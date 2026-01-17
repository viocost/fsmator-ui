import Editor from '@monaco-editor/react';
import { useTheme } from '@/contexts/ThemeContext';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function CodeEditor({ value, onChange }: CodeEditorProps) {
  const { theme } = useTheme();
  
  return (
    <div className="bg-slate-100 dark:bg-slate-800 rounded-lg shadow-2xl p-4">
      <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">Configuration Editor</h2>
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
