import { useState } from 'react';

export interface EventLogEntry {
  seq: number;
  type: string;
  payload: any;
  timestamp: number;
  resultingState?: any;
}

interface EventLogProps {
  events: EventLogEntry[];
  onClear?: () => void;
}

export default function EventLog({ events, onClear }: EventLogProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit'
    }) + '.' + date.getMilliseconds().toString().padStart(3, '0');
  };

  return (
    <div className="bg-slate-100 dark:bg-slate-800 rounded-lg shadow-2xl p-6 flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Event Log</h2>
        <div className="flex gap-2 items-center">
          <span className="text-sm text-slate-600 dark:text-slate-400">
            {events.length} event{events.length !== 1 ? 's' : ''}
          </span>
          {events.length > 0 && (
            <button
              onClick={onClear}
              className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded text-sm font-semibold transition"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {events.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-slate-500 dark:text-slate-400">
          <div className="text-center">
            <div className="text-4xl mb-2">📋</div>
            <p>No events logged yet</p>
            <p className="text-sm mt-1">Send events to see them here</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-auto space-y-2">
          {events.map((event, index) => (
            <div
              key={index}
              className="bg-white dark:bg-slate-900 rounded-lg border border-slate-300 dark:border-slate-700 overflow-hidden"
            >
              <button
                onClick={() => toggleExpand(index)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition text-left"
              >
                <div className="flex items-center gap-3 flex-1">
                  <span className="font-mono text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded font-bold">
                    #{event.seq}
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {event.type}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                    {formatTime(event.timestamp)}
                  </span>
                </div>
                <span className="text-slate-400 dark:text-slate-500">
                  {expandedIndex === index ? '▼' : '▶'}
                </span>
              </button>

              {expandedIndex === index && (
                <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950">
                  <div className="space-y-3">
                    {/* Full Event Structure */}
                    <div>
                      <h4 className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2 uppercase">
                        Full Event
                      </h4>
                      <pre className="text-xs bg-white dark:bg-slate-900 p-3 rounded border border-slate-200 dark:border-slate-700 overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
                        {JSON.stringify(event.payload, null, 2)}
                      </pre>
                    </div>

                    {/* Resulting State */}
                    {event.resultingState && (
                      <div>
                        <h4 className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2 uppercase">
                          Resulting State
                        </h4>
                        <pre className="text-xs bg-white dark:bg-slate-900 p-3 rounded border border-slate-200 dark:border-slate-700 overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
                          {JSON.stringify(event.resultingState, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
