import { useEffect, useRef } from 'react';

interface EventListMenuProps {
  x: number;
  y: number;
  events: string[];
  onEventSelect: (eventType: string) => void;
  onClose: () => void;
}

export default function EventListMenu({ x, y, events, onEventSelect, onClose }: EventListMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className="fixed z-[100] bg-white dark:bg-slate-800 rounded-lg shadow-2xl border border-slate-300 dark:border-slate-600 py-2 min-w-[200px] max-h-[400px] overflow-y-auto"
      style={{ left: x, top: y }}
    >
      <div className="px-3 py-1 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
        Send Event
      </div>
      <div className="border-t border-slate-200 dark:border-slate-700 my-1"></div>
      
      {events.length === 0 ? (
        <div className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400 text-center">
          No events available
        </div>
      ) : (
        events.map((eventType) => (
          <button
            key={eventType}
            onClick={() => {
              onEventSelect(eventType);
              onClose();
            }}
            className="w-full px-4 py-2 text-left text-sm text-slate-900 dark:text-slate-100 hover:bg-blue-50 dark:hover:bg-slate-700 transition flex items-center gap-2"
          >
            <span className="text-blue-600 dark:text-blue-400 font-mono text-xs">▸</span>
            <span className="font-medium font-mono">{eventType}</span>
          </button>
        ))
      )}
    </div>
  );
}
