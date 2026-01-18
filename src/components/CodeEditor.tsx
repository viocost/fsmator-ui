import Editor from '@monaco-editor/react';
import { useTheme } from '@/contexts/ThemeContext';
import { examples } from '@/examples';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  onApply: () => void;
  hasUnsavedChanges: boolean;
  onLoadExample?: (exampleName: keyof typeof examples) => void;
}

export default function CodeEditor({ value, onChange, onApply, hasUnsavedChanges, onLoadExample }: CodeEditorProps) {
  const { theme } = useTheme();
  
  return (
    <div className="bg-slate-100 dark:bg-slate-800 rounded-lg shadow-2xl p-4">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Configuration Editor</h2>
          <button
            onClick={onApply}
            disabled={!hasUnsavedChanges}
            className="px-3 py-1 bg-green-600 hover:bg-green-500 disabled:bg-slate-400 disabled:cursor-not-allowed text-white rounded text-xs font-semibold transition"
            title="Apply changes and reload machine"
          >
            Apply
          </button>
          {hasUnsavedChanges && (
            <span className="text-xs text-orange-600 dark:text-orange-400 font-semibold flex items-center gap-1">
              <span className="inline-block w-2 h-2 bg-orange-600 dark:bg-orange-400 rounded-full"></span>
              Unsaved changes
            </span>
          )}
        </div>
        
        {/* Example Selector Buttons */}
        {onLoadExample && (
          <div className="flex gap-2 items-center flex-wrap">
            <span className="text-xs text-slate-600 dark:text-slate-400 font-semibold mr-1">Examples:</span>
            <button
              onClick={() => onLoadExample('counter')}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded font-semibold transition text-xs"
              title="Counter Example"
            >
              Counter
            </button>
            <button
              onClick={() => onLoadExample('trafficLight')}
              className="px-3 py-1 bg-green-600 hover:bg-green-500 text-white rounded font-semibold transition text-xs"
              title="Traffic Light Example"
            >
              Traffic Light
            </button>
            <button
              onClick={() => onLoadExample('formWorkflow')}
              className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded font-semibold transition text-xs"
              title="Form Workflow Example"
            >
              Form Workflow
            </button>
            <button
              onClick={() => onLoadExample('parallelMedia')}
              className="px-3 py-1 bg-orange-600 hover:bg-orange-500 text-white rounded font-semibold transition text-xs"
              title="Media Player Example"
            >
              Media Player
            </button>
          </div>
        )}
      </div>
      
      <div className="border-2 border-slate-300 dark:border-slate-700 rounded overflow-hidden">
        <Editor
          height="500px"
          defaultLanguage="javascript"
          theme={theme === 'dark' ? 'vs-dark' : 'light'}
          value={value}
          onChange={(val) => onChange(val || '')}
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
          }}
        />
      </div>
    </div>
  );
}
