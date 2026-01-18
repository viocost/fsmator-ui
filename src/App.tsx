import { useState, useCallback, useMemo, useEffect } from 'react';
import { StateMachine, type StateMachineConfig } from 'fsmator';
import StateMachineDiagram from '@/components/StateMachineDiagram';
import CodeEditor from '@/components/CodeEditor';
import StateDisplay from '@/components/StateDisplay';
import EventControls from '@/components/EventControls';
import EventLog, { type EventLogEntry } from '@/components/EventLog';
import Toast from '@/components/Toast';
import Footer from '@/components/Footer';
import { examples } from '@/examples';
import { useTheme } from '@/contexts/ThemeContext';

type Tab = 'controls' | 'editor' | 'diagram';

function App() {
  const { theme, toggleTheme } = useTheme();
  const [code, setCode] = useState(examples.counter);
  const [machine, setMachine] = useState<StateMachine<any, any> | null>(null);
  const [config, setConfig] = useState<StateMachineConfig<any, any> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeStates, setActiveStates] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<Tab>('controls');
  const [eventLog, setEventLog] = useState<EventLogEntry[]>([]);
  const [eventSeq, setEventSeq] = useState(0);
  const [toast, setToast] = useState<{ message: string; type: 'info' | 'success' | 'warning' | 'error' } | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Auto-load counter example on first mount
  useEffect(() => {
    if (!initialized) {
      try {
        const loadedConfig = eval(examples.counter);
        const newMachine = new StateMachine(loadedConfig).start();
        setMachine(newMachine);
        setConfig(loadedConfig);
        setActiveStates(new Set(newMachine.getActiveStateNodes()));
        setInitialized(true);
      } catch (err) {
        console.error('Failed to auto-load counter example:', err);
      }
    }
  }, [initialized]);

  // Extract available events from config
  const availableEvents = useMemo(() => {
    if (!machine) return [];

    const events = new Set<string>();
    const config = (machine as any).root;

    const extractEvents = (node: any) => {
      if (node._onTransitions) {
        for (const eventType of node._onTransitions.keys()) {
          if (!eventType.startsWith('__')) {
            events.add(eventType);
          }
        }
      }
      if (node.children) {
        for (const child of node.children) {
          extractEvents(child);
        }
      }
    };

    extractEvents(config);
    return Array.from(events);
  }, [machine]);

  const loadConfiguration = useCallback(() => {
    try {
      // Evaluate the code to get the config
      // Using eval instead of Function constructor to support the wrapped object literal syntax
      const loadedConfig = eval(code);

      // Validate config has required fields
      if (!loadedConfig || typeof loadedConfig !== 'object') {
        throw new Error('Configuration must be an object');
      }
      if (!loadedConfig.initialContext) {
        throw new Error('Configuration must have initialContext property');
      }
      if (!loadedConfig.initial) {
        throw new Error('Configuration must have initial property');
      }
      if (!loadedConfig.states) {
        throw new Error('Configuration must have states property');
      }

      // Create and start the machine
      const newMachine = new StateMachine(loadedConfig).start();
      setMachine(newMachine);
      setConfig(loadedConfig);
      setActiveStates(new Set(newMachine.getActiveStateNodes()));
      setError(null);
      setEventLog([]);
      setEventSeq(0);
    } catch (err: any) {
      setError(err.message || 'Failed to load configuration');
      setMachine(null);
      setConfig(null);
    }
  }, [code]);

  // Detect when machine halts and show toast
  useEffect(() => {
    if (machine && machine.isHalted()) {
      setToast({ message: 'State Machine Halted', type: 'warning' });
    }
  }, [machine, activeStates]);

  const handleSendEvent = useCallback((eventType: string, payload?: any) => {
    if (!machine) return;


    try {
      const event = payload || { type: eventType };

      console.log('Sending event to machine:', event);
      machine.send(event);

      const newSeq = eventSeq + 1;
      const resultingState = {
        value: machine.getStateValue(),
        context: machine.getContext(),
      };

      // Add to event log
      setEventLog(prev => [...prev, {
        seq: newSeq,
        type: eventType,
        payload: event,
        timestamp: Date.now(),
        resultingState,
      }]);
      setEventSeq(newSeq);

      setActiveStates(new Set(machine.getActiveStateNodes()));
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to send event');
    }
  }, [machine, eventSeq]);

  const handleRewind = useCallback((steps: number = 1) => {
    if (!machine) return;

    try {
      machine.rewind(steps);
      setActiveStates(new Set(machine.getActiveStateNodes()));
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to rewind');
    }
  }, [machine]);

  const handleForward = useCallback((steps: number = 1) => {
    if (!machine) return;

    try {
      machine.ff(steps);
      setActiveStates(new Set(machine.getActiveStateNodes()));
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fast-forward');
    }
  }, [machine]);

  const handleFullRewind = useCallback(() => {
    if (!machine) return;
    const currentIndex = machine.getHistoryIndex();
    if (currentIndex > 0) {
      handleRewind(currentIndex);
    }
  }, [machine, handleRewind]);

  const handleFullForward = useCallback(() => {
    if (!machine) return;
    const currentIndex = machine.getHistoryIndex();
    const maxIndex = machine.getHistoryLength() - 1;
    if (currentIndex < maxIndex) {
      handleForward(maxIndex - currentIndex);
    }
  }, [machine, handleForward]);

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  // Auto-play: step forward every second when playing
  useEffect(() => {
    if (!isPlaying || !machine) return;

    const interval = setInterval(() => {
      if (machine.getHistoryIndex() < machine.getHistoryLength() - 1) {
        handleForward(1);
      } else {
        // Reached the end, stop playing
        setIsPlaying(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, machine, handleForward]);

  const canRewind = machine ? machine.getHistoryIndex() > 0 : false;
  const canForward = machine ? machine.getHistoryIndex() < machine.getHistoryLength() - 1 : false;

  const handleReset = useCallback(() => {
    setIsPlaying(false);
    loadConfiguration();
  }, [loadConfiguration]);

  const handleClearLog = useCallback(() => {
    setEventLog([]);
    setEventSeq(0);
  }, []);

  const loadExample = useCallback((exampleKey: keyof typeof examples) => {
    setCode(examples[exampleKey]);

    // Auto-load the example immediately
    try {
      const loadedConfig = eval(examples[exampleKey]);

      if (!loadedConfig || typeof loadedConfig !== 'object') {
        throw new Error('Configuration must be an object');
      }
      if (!loadedConfig.initialContext) {
        throw new Error('Configuration must have initialContext property');
      }
      if (!loadedConfig.initial) {
        throw new Error('Configuration must have initial property');
      }
      if (!loadedConfig.states) {
        throw new Error('Configuration must have states property');
      }

      const newMachine = new StateMachine(loadedConfig).start();
      setMachine(newMachine);
      setConfig(loadedConfig);
      setActiveStates(new Set(newMachine.getActiveStateNodes()));
      setError(null);
      setEventLog([]);
      setEventSeq(0);
    } catch (err: any) {
      setError(err.message || 'Failed to load configuration');
      setMachine(null);
      setConfig(null);
    }
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Header */}
      <header className="bg-slate-100 dark:bg-slate-900 border-b border-slate-300 dark:border-slate-800 py-6 px-8 shadow-xl">
        <div className="max-w-[1800px] mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-2">
                FSMator UI 0.0.1
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Visual State Machine Simulator
              </p>
              <p className="text-slate-600 dark:text-slate-400 text-xs mt-1">
                Powered by <a href="https://github.com/viocost/fsmator" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 underline">FSMator 0.2.0</a>
              </p>
            </div>

            {/* Theme Selector */}
            <button
              onClick={toggleTheme}
              className="px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 rounded-lg transition shadow-md"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-[1800px] mx-auto p-8">
        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-100 dark:bg-red-500/20 border-2 border-red-500 rounded-lg p-4">
            <h3 className="text-red-600 dark:text-red-400 font-bold mb-1">Error</h3>
            <pre className="text-red-700 dark:text-red-300 text-sm font-mono">{error}</pre>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex gap-2 border-b border-slate-300 dark:border-slate-700">
            <button
              onClick={() => setActiveTab('controls')}
              className={`px-6 py-3 font-semibold transition relative ${activeTab === 'controls'
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
            >
              Controls & State
              {activeTab === 'controls' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('editor')}
              className={`px-6 py-3 font-semibold transition relative ${activeTab === 'editor'
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
            >
              Code Editor
              {activeTab === 'editor' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('diagram')}
              disabled={!machine}
              className={`px-6 py-3 font-semibold transition relative disabled:opacity-50 disabled:cursor-not-allowed ${activeTab === 'diagram'
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
            >
              Interactive Diagram
              {activeTab === 'diagram' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"></div>
              )}
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'controls' && (
          <div className="grid grid-cols-2 gap-6">
            {/* Left Column - State & Controls */}
            <div className="space-y-6">
              {machine ? (
                <>
                  {/* Time Controls */}
                  <div className="bg-slate-100 dark:bg-slate-800 rounded-lg shadow-2xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Time Travel</h3>
                      <div className="text-sm text-slate-600 dark:text-slate-400 font-mono">
                        {machine.getHistoryIndex() + 1} / {machine.getHistoryLength()}
                      </div>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={handleFullRewind}
                        disabled={!canRewind || isPlaying}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-400 disabled:cursor-not-allowed text-white rounded font-semibold transition text-sm"
                        title="Rewind to start"
                      >
                        ⏮ Start
                      </button>
                      <button
                        onClick={() => handleRewind(1)}
                        disabled={!canRewind || isPlaying}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-400 disabled:cursor-not-allowed text-white rounded font-semibold transition text-sm"
                        title="Rewind 1 step"
                      >
                        ⏪ Back
                      </button>
                      {isPlaying ? (
                        <button
                          onClick={handlePause}
                          className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded font-semibold transition text-sm"
                          title="Pause playback"
                        >
                          ⏸ Pause
                        </button>
                      ) : (
                        <button
                          onClick={handlePlay}
                          disabled={!canForward}
                          className="px-4 py-2 bg-green-600 hover:bg-green-500 disabled:bg-slate-400 disabled:cursor-not-allowed text-white rounded font-semibold transition text-sm"
                          title="Play (step forward every second)"
                        >
                          ▶ Play
                        </button>
                      )}
                      <button
                        onClick={() => handleForward(1)}
                        disabled={!canForward || isPlaying}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-400 disabled:cursor-not-allowed text-white rounded font-semibold transition text-sm"
                        title="Forward 1 step"
                      >
                        Forward ⏩
                      </button>
                      <button
                        onClick={handleFullForward}
                        disabled={!canForward || isPlaying}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-400 disabled:cursor-not-allowed text-white rounded font-semibold transition text-sm"
                        title="Fast forward to end"
                      >
                        End ⏭
                      </button>
                    </div>
                  </div>

                  <StateDisplay
                    stateValue={machine.getStateValue()}
                    context={machine.getContext()}
                    isHalted={machine.isHalted()}
                  />
                  <EventControls
                    availableEvents={availableEvents}
                    onSendEvent={handleSendEvent}
                    disabled={machine.isHalted()}
                  />
                </>
              ) : (
                <div className="bg-slate-100 dark:bg-slate-800 rounded-lg shadow-2xl p-12 text-center">
                  <div className="text-6xl mb-4">🤖</div>
                  <p className="text-slate-600 dark:text-slate-400 text-lg">
                    Load a configuration to start the simulator
                  </p>
                </div>
              )}
            </div>

            {/* Right Column - Event Log */}
            <div className="h-[800px]">
              <EventLog events={eventLog} onClear={handleClearLog} />
            </div>
          </div>
        )}

        {activeTab === 'editor' && (
          <div className="space-y-6">
            <CodeEditor value={code} onChange={setCode} onLoadExample={loadExample} />

            <div className="flex gap-3">
              <button
                onClick={loadConfiguration}
                className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-lg transition shadow-lg"
              >
                Load & Start Machine
              </button>
              <button
                onClick={handleReset}
                disabled={!machine}
                className="px-6 py-3 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 text-slate-900 dark:text-white rounded-lg font-bold transition"
              >
                Reset
              </button>
            </div>
          </div>
        )}

        {activeTab === 'diagram' && machine && config && (
          <StateMachineDiagram
            config={config}
            activeStates={activeStates}
            context={machine.getContext()}
            eventLog={eventLog}
            onEventClick={handleSendEvent}
            onReset={handleReset}
            onRewind={handleRewind}
            onForward={handleForward}
            onFullRewind={handleFullRewind}
            onFullForward={handleFullForward}
            onPlay={handlePlay}
            onPause={handlePause}
            canRewind={canRewind}
            canForward={canForward}
            historyIndex={machine.getHistoryIndex()}
            historyLength={machine.getHistoryLength()}
            isHalted={machine.isHalted()}
            isPlaying={isPlaying}
            onShowToast={(message, type) => setToast({ message, type })}
            onClearLog={handleClearLog}
          />
        )}
      </div>

      {/* Toast notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
