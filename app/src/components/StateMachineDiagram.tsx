import { useEffect, useRef, useState } from 'react';
import cytoscape, { Core } from 'cytoscape';
// @ts-ignore
import dagre from 'cytoscape-dagre';
import type { StateMachineConfig, StateConfig } from '@/lib/state-machine/types';
import { useTheme } from '@/contexts/ThemeContext';

// Register dagre layout
cytoscape.use(dagre);

interface StateMachineDiagramProps {
  config: StateMachineConfig<any, any>;
  activeStates: Set<string>;
  onEventClick: (eventType: string) => void;
}

export default function StateMachineDiagram({ 
  config, 
  activeStates,
  onEventClick 
}: StateMachineDiagramProps) {
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<Core | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // Theme-aware colors
    const isDark = theme === 'dark';
    const nodeColor = isDark ? '#3b82f6' : '#2563eb';
    const nodeBorder = isDark ? '#2563eb' : '#1d4ed8';
    const edgeColor = isDark ? '#64748b' : '#94a3b8';
    const textBgColor = isDark ? '#0f172a' : '#ffffff';
    const textColor = isDark ? '#94a3b8' : '#64748b';
    const parentBg = isDark ? '#64748b' : '#cbd5e1';
    const parentBorder = isDark ? '#475569' : '#94a3b8';
    const parentText = isDark ? '#cbd5e1' : '#475569';

    // Build cytoscape elements from config
    const elements = buildElements(config);

    // Create cytoscape instance
    cyRef.current = cytoscape({
      container: containerRef.current,
      elements,
      wheelSensitivity: 0.1,
      style: [
        {
          selector: 'node',
          style: {
            'background-color': nodeColor,
            'label': 'data(label)',
            'color': '#fff',
            'text-valign': 'center',
            'text-halign': 'center',
            'font-weight': 'bold',
            'text-wrap': 'wrap',
            'text-max-width': '100px',
            'font-size': '10px',
            'width': 140,
            'height': 80,
            'border-width': 3,
            'border-color': nodeBorder,
          },
        },
        {
          selector: 'edge',
          style: {
            'width': 2,
            'line-color': edgeColor,
            'target-arrow-color': edgeColor,
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'arrow-scale': 1,
            'label': 'data(label)',
            'font-size': '9px',
            'text-wrap': 'wrap',
            'text-max-width': '120px',
            'text-margin-y': '-8' as any,
            'text-background-color': textBgColor,
            'text-background-opacity': 0.95,
            'text-background-padding': '3px',
            'color': textColor,
          },
        },
        {
          selector: 'node:parent',
          style: {
            'background-opacity': 0.15,
            'background-color': parentBg,
            'border-color': parentBorder,
            'border-width': 2,
            'text-valign': 'top',
            'text-halign': 'center',
            'font-weight': 'bold',
            'color': parentText,
            'font-size': '11px',
            'padding': '20' as any,
          },
        },
        {
          selector: 'node.active',
          style: {
            'background-color': '#10b981',
            'border-color': '#059669',
            'border-width': 4,
          },
        },
        {
          selector: 'node:parent.active',
          style: {
            'background-color': '#10b981',
            'background-opacity': 0.2,
            'border-color': '#059669',
            'border-width': 3,
          },
        },
        {
          selector: 'node.highlighted',
          style: {
            'background-color': '#f59e0b',
            'border-color': '#d97706',
            'border-width': 4,
          },
        },
        {
          selector: 'edge.highlighted',
          style: {
            'line-color': '#f59e0b',
            'target-arrow-color': '#f59e0b',
            'width': 3,
          },
        },
        {
          selector: 'node[isStartNode]',
          style: {
            'background-color': isDark ? '#1e293b' : '#cbd5e1',
            'width': 20,
            'height': 20,
            'shape': 'ellipse',
            'label': '',
            'border-width': 2,
            'border-color': isDark ? '#475569' : '#94a3b8',
          },
        },
        {
          selector: 'edge[isStartEdge]',
          style: {
            'width': 3,
            'line-color': isDark ? '#475569' : '#94a3b8',
            'target-arrow-color': isDark ? '#475569' : '#94a3b8',
          },
        },
      ],
      layout: {
        name: 'dagre',
        rankDir: 'LR',
        padding: 50,
        spacingFactor: 1.3,
        nodeDimensionsIncludeLabels: true,
        rankSep: 120,
        edgeSep: 40,
      } as any,
    });

    // Add interactivity
    cyRef.current.on('tap', 'edge', (evt) => {
      const edge = evt.target;
      const edgeData = edge.data();
      
      if (edgeData.eventType && !edgeData.isStartEdge) {
        onEventClick(edgeData.eventType);
      }

      // Highlight
      cyRef.current?.elements().removeClass('highlighted');
      edge.addClass('highlighted');
    });

    cyRef.current.on('tap', 'node', (evt) => {
      const node = evt.target;
      
      cyRef.current?.elements().removeClass('highlighted');
      node.addClass('highlighted');
      node.connectedEdges().addClass('highlighted');
    });

    cyRef.current.on('tap', (evt) => {
      if (evt.target === cyRef.current) {
        cyRef.current?.elements().removeClass('highlighted');
      }
    });

    return () => {
      cyRef.current?.destroy();
    };
  }, [config, onEventClick, theme]);

  // Update active states highlighting
  useEffect(() => {
    if (!cyRef.current) return;

    cyRef.current.nodes().removeClass('active');
    
    activeStates.forEach((stateId) => {
      const node = cyRef.current?.getElementById(stateId);
      if (node && node.length > 0) {
        node.addClass('active');
      }
    });
  }, [activeStates]);

  const handleZoomIn = () => {
    if (cyRef.current) {
      cyRef.current.zoom(cyRef.current.zoom() + 0.1);
      cyRef.current.center();
    }
  };

  const handleZoomOut = () => {
    if (cyRef.current) {
      cyRef.current.zoom(cyRef.current.zoom() - 0.1);
      cyRef.current.center();
    }
  };

  const handleResetZoom = () => {
    if (cyRef.current) {
      cyRef.current.fit();
      cyRef.current.center();
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setTimeout(() => {
      if (cyRef.current) {
        cyRef.current.fit();
        cyRef.current.center();
      }
    }, 100);
  };

  return (
    <div className={`bg-slate-100 dark:bg-slate-800 rounded-lg shadow-2xl p-4 ${isFullscreen ? 'fixed inset-0 z-50 bg-white dark:bg-slate-950' : ''}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">State Machine Diagram</h2>
        
        <div className="flex gap-2 items-center">
          {/* Legend */}
          <div className="flex gap-4 mr-4 border-l border-slate-400 dark:border-slate-600 pl-4">
            <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
              <div className="w-4 h-4 rounded bg-blue-500 border-2 border-blue-600"></div>
              <span>Inactive</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
              <div className="w-4 h-4 rounded bg-green-500 border-2 border-green-600"></div>
              <span>Active</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
              <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-800 border-2 border-slate-500 dark:border-slate-600"></div>
              <span>Start</span>
            </div>
          </div>

          {/* Controls */}
          <button
            onClick={handleZoomIn}
            className="px-3 py-1 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded font-bold transition"
            title="Zoom In"
          >
            +
          </button>
          <button
            onClick={handleZoomOut}
            className="px-3 py-1 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded font-bold transition"
            title="Zoom Out"
          >
            -
          </button>
          <button
            onClick={handleResetZoom}
            className="px-3 py-1 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded text-sm transition"
          >
            Reset
          </button>
          <button
            onClick={toggleFullscreen}
            className="px-3 py-1 bg-slate-400 dark:bg-slate-600 hover:bg-slate-500 dark:hover:bg-slate-500 text-white rounded text-sm transition font-semibold"
          >
            {isFullscreen ? '✕ Exit' : '⛶ Fullscreen'}
          </button>
        </div>
      </div>
      
      <div 
        ref={containerRef} 
        className={`bg-white dark:bg-slate-900 rounded border-2 border-slate-300 dark:border-slate-700 ${
          isFullscreen ? 'h-[calc(100vh-80px)]' : 'h-[600px]'
        }`}
      />
    </div>
  );
}

// Helper function to build cytoscape elements from state machine config
function buildElements(config: StateMachineConfig<any, any>) {
  const elements: any[] = [];

  function processState(
    stateKey: string,
    stateConfig: StateConfig<any>,
    parentId: string | null,
    isInitial: boolean
  ) {
    const fullStateId = parentId ? `${parentId}.${stateKey}` : stateKey;

    // Add the state node
    elements.push({
      data: {
        id: fullStateId,
        label: stateKey,
        parent: parentId,
      },
    });

    // Add start node for initial states
    if (isInitial) {
      const startNodeId = `__START__${fullStateId}`;
      elements.push({
        data: {
          id: startNodeId,
          label: '',
          isStartNode: true,
          parent: parentId,
        },
      });

      elements.push({
        data: {
          id: `start_to_${fullStateId}`,
          source: startNodeId,
          target: fullStateId,
          isStartEdge: true,
        },
      });
    }

    // Process transitions
    if (stateConfig.on) {
      for (const [eventType, transition] of Object.entries(stateConfig.on)) {
        const transitionConfig = typeof transition === 'string' 
          ? { target: transition } 
          : Array.isArray(transition) 
          ? transition[0] 
          : transition;

        if (transitionConfig && typeof transitionConfig === 'object') {
          const target = transitionConfig.target;
          if (target) {
            const fullTargetId = parentId ? `${parentId}.${target}` : target;
            elements.push({
              data: {
                id: `${fullStateId}_to_${fullTargetId}_on_${eventType}`,
                source: fullStateId,
                target: fullTargetId,
                label: eventType,
                eventType,
              },
            });
          }
        }
      }
    }

    // Process nested states
    if (stateConfig.states) {
      for (const [childKey, childConfig] of Object.entries(stateConfig.states)) {
        processState(
          childKey,
          childConfig,
          fullStateId,
          stateConfig.initial === childKey
        );
      }
    }
  }

  // Process all top-level states
  for (const [stateKey, stateConfig] of Object.entries(config.states)) {
    processState(stateKey, stateConfig, null, config.initial === stateKey);
  }

  return elements;
}
