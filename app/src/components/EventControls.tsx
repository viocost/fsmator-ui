import { useState } from 'react';

interface EventControlsProps {
  availableEvents: string[];
  onSendEvent: (eventType: string, payload?: any) => void;
  disabled?: boolean;
}

export default function EventControls({ 
  availableEvents, 
  onSendEvent,
  disabled = false
}: EventControlsProps) {
  const [customEvent, setCustomEvent] = useState('');
  const [customPayload, setCustomPayload] = useState('{}');
  const [showPayloadInput, setShowPayloadInput] = useState(false);
  const [pendingEventType, setPendingEventType] = useState<string | null>(null);

  const handleEventClick = (eventType: string) => {
    setPendingEventType(eventType);
    setShowPayloadInput(true);
  };

  const handleSendWithPayload = () => {
    if (!pendingEventType) return;

    try {
      const payload = JSON.parse(customPayload);
      onSendEvent(pendingEventType, { type: pendingEventType, ...payload });
    } catch (e) {
      onSendEvent(pendingEventType, { type: pendingEventType });
    }
    
    setShowPayloadInput(false);
    setPendingEventType(null);
    setCustomPayload('{}');
  };

  const handleSendCustom = () => {
    if (!customEvent.trim()) return;
    
    try {
      const payload = JSON.parse(customPayload);
      onSendEvent(customEvent, { type: customEvent, ...payload });
    } catch (e) {
      onSendEvent(customEvent, { type: customEvent });
    }
    
    setCustomEvent('');
    setCustomPayload('{}');
  };

  return (
    <div className="bg-slate-100 dark:bg-slate-800 rounded-lg shadow-2xl p-6">
      <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">Send Events</h2>
      
      {/* Payload Modal */}
      {showPayloadInput && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-md w-full mx-4 border-2 border-slate-300 dark:border-slate-600">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">
              Event: {pendingEventType}
            </h3>
            <label className="block text-sm text-slate-700 dark:text-slate-300 mb-2">
              Payload (JSON):
            </label>
            <textarea
              value={customPayload}
              onChange={(e) => setCustomPayload(e.target.value)}
              className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-slate-100 font-mono text-sm h-32"
              placeholder='{"key": "value"}'
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleSendWithPayload}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-semibold transition"
              >
                Send
              </button>
              <button
                onClick={() => {
                  setShowPayloadInput(false);
                  setPendingEventType(null);
                  setCustomPayload('{}');
                }}
                className="flex-1 px-4 py-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded font-semibold transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Available Events */}
      {availableEvents.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Available Events:</h3>
          <div className="grid grid-cols-2 gap-2">
            {availableEvents.map((event) => (
              <button
                key={event}
                onClick={() => handleEventClick(event)}
                disabled={disabled}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:text-slate-500 dark:disabled:text-slate-500 text-white rounded font-semibold transition text-sm"
              >
                {event}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Custom Event */}
      <div className="border-t border-slate-300 dark:border-slate-700 pt-4">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Custom Event:</h3>
        <div className="space-y-2">
          <input
            type="text"
            value={customEvent}
            onChange={(e) => setCustomEvent(e.target.value)}
            placeholder="EVENT_TYPE"
            className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-slate-100 font-mono text-sm"
            disabled={disabled}
          />
          <textarea
            value={customPayload}
            onChange={(e) => setCustomPayload(e.target.value)}
            placeholder='{"key": "value"}'
            className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-slate-100 font-mono text-sm h-24"
            disabled={disabled}
          />
          <button
            onClick={handleSendCustom}
            disabled={disabled || !customEvent.trim()}
            className="w-full px-4 py-3 bg-green-600 hover:bg-green-500 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:text-slate-500 dark:disabled:text-slate-500 text-white rounded font-bold transition"
          >
            Send Custom Event
          </button>
        </div>
      </div>

      {disabled && (
        <p className="mt-4 text-sm text-yellow-600 dark:text-yellow-400 text-center">
          Machine is halted. Reset to continue.
        </p>
      )}
    </div>
  );
}
