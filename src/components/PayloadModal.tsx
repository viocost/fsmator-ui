import { useState, useEffect } from 'react';

type ModalMode = 'payload' | 'custom';

interface PayloadModalProps {
  isOpen: boolean;
  eventType: string;
  mode: ModalMode;
  onSend: (eventType: string, payload: any) => void;
  onClose: () => void;
}

export default function PayloadModal({ isOpen, eventType, mode, onSend, onClose }: PayloadModalProps) {
  const [payloadText, setPayloadText] = useState('{}');
  const [error, setError] = useState<string | null>(null);
  const [errorLine, setErrorLine] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (mode === 'payload') {
        // Payload mode: just the payload object (formatted)
        setPayloadText('{}');
      } else {
        // Custom mode: full event with type (formatted)
        setPayloadText(`{\n  "type": "${eventType}"\n}`);
      }
      setError(null);
      setErrorLine(null);
    }
  }, [isOpen, eventType, mode]);

  const validateAndHighlightJSON = (text: string) => {
    setPayloadText(text);
    
    if (!text.trim()) {
      setError('JSON cannot be empty');
      setErrorLine(null);
      return;
    }

    try {
      JSON.parse(text);
      setError(null);
      setErrorLine(null);
    } catch (e: any) {
      setError(e.message);
      
      // Try to extract line number from error message
      const lineMatch = e.message.match(/position (\d+)/);
      if (lineMatch) {
        const position = parseInt(lineMatch[1], 10);
        const beforeError = text.substring(0, position);
        const lineNumber = (beforeError.match(/\n/g) || []).length + 1;
        setErrorLine(lineNumber);
      } else {
        setErrorLine(null);
      }
    }
  };

  const handleSend = () => {
    try {
      const parsed = JSON.parse(payloadText);
      
      if (mode === 'payload') {
        // Payload mode: send as { type, payload: {...} }
        onSend(eventType, { type: eventType, payload: parsed });
      } else {
        // Custom mode: send the entire parsed object as-is
        onSend(eventType, parsed);
      }
      
      onClose();
    } catch (e) {
      // Error already set by validation
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      if (!error) {
        handleSend();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(payloadText);
      const formatted = JSON.stringify(parsed, null, 2);
      setPayloadText(formatted);
      setError(null);
      setErrorLine(null);
    } catch (e: any) {
      // Keep validation error
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    // Try to auto-format pasted JSON
    const pasted = e.clipboardData.getData('text');
    try {
      const parsed = JSON.parse(pasted);
      const formatted = JSON.stringify(parsed, null, 2);
      e.preventDefault();
      setPayloadText(formatted);
      setError(null);
      setErrorLine(null);
    } catch {
      // If not valid JSON, let default paste behavior happen
    }
  };

  if (!isOpen) return null;

  const lines = payloadText.split('\n');

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]" onClick={onClose}>
      <div 
        className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl max-w-2xl w-full mx-4 border-2 border-slate-300 dark:border-slate-600"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-300 dark:border-slate-700">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {mode === 'payload' ? 'Send Event with Payload' : 'Send Custom Event'}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Event: <span className="font-mono font-semibold text-blue-600 dark:text-blue-400">{eventType}</span>
                {mode === 'payload' && <span className="ml-2 text-xs">(payload will be sent as event.payload)</span>}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-2xl leading-none"
            >
              ×
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              {mode === 'payload' ? 'Payload Object (JSON):' : 'Full Event (JSON):'}
            </label>
            <button
              onClick={handleFormat}
              className="px-3 py-1 text-xs bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded font-semibold transition"
              title="Format JSON (Ctrl/Cmd + Shift + F)"
            >
              Format JSON
            </button>
          </div>
          
          <div className="relative">
            {/* Line numbers */}
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-slate-100 dark:bg-slate-900 border-r border-slate-300 dark:border-slate-700 rounded-l flex flex-col text-right pr-2 pt-3 font-mono text-xs text-slate-500 dark:text-slate-500 select-none overflow-hidden">
              {lines.map((_, i) => (
                <div
                  key={i}
                  className={`leading-6 ${errorLine === i + 1 ? 'bg-red-200 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-bold' : ''}`}
                >
                  {i + 1}
                </div>
              ))}
            </div>

            {/* Textarea */}
            <textarea
              value={payloadText}
              onChange={(e) => validateAndHighlightJSON(e.target.value)}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              className={`w-full pl-14 pr-4 py-3 bg-white dark:bg-slate-900 border-2 rounded font-mono text-sm h-64 resize-none focus:outline-none focus:ring-2 ${
                error
                  ? 'border-red-500 focus:ring-red-500 text-red-700 dark:text-red-300'
                  : 'border-slate-300 dark:border-slate-700 focus:ring-blue-500 text-slate-900 dark:text-slate-100'
              }`}
              placeholder='{"key": "value"}'
              spellCheck={false}
            />
          </div>

          {/* Error message */}
          {error && (
            <div className="mt-3 p-3 bg-red-100 dark:bg-red-900/20 border border-red-500 rounded">
              <div className="flex items-start gap-2">
                <span className="text-red-600 dark:text-red-400 font-bold text-sm">⚠</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-red-700 dark:text-red-400">Invalid JSON</p>
                  <p className="text-xs text-red-600 dark:text-red-300 mt-1 font-mono">{error}</p>
                  {errorLine && (
                    <p className="text-xs text-red-600 dark:text-red-300 mt-1">
                      Error on line {errorLine}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Helper text */}
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
            Press <kbd className="px-2 py-0.5 bg-slate-200 dark:bg-slate-700 rounded border border-slate-300 dark:border-slate-600 font-mono">Cmd/Ctrl + Enter</kbd> to send, <kbd className="px-2 py-0.5 bg-slate-200 dark:bg-slate-700 rounded border border-slate-300 dark:border-slate-600 font-mono">Esc</kbd> to cancel
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-300 dark:border-slate-700 flex gap-3">
          <button
            onClick={handleSend}
            disabled={!!error}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:text-slate-500 dark:disabled:text-slate-500 disabled:cursor-not-allowed text-white rounded font-semibold transition"
          >
            Send Event
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded font-semibold transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
