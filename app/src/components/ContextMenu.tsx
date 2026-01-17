import { useEffect, useRef } from 'react';

interface ContextMenuProps {
  x: number;
  y: number;
  onSendWithPayload: () => void;
  onSendCustom: () => void;
  onClose: () => void;
}

export default function ContextMenu({ x, y, onSendWithPayload, onSendCustom, onClose }: ContextMenuProps) {
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
      className="fixed z-[100] bg-white dark:bg-slate-800 rounded-lg shadow-2xl border border-slate-300 dark:border-slate-600 py-1 min-w-[200px]"
      style={{ left: x, top: y }}
    >
      <button
        onClick={() => {
          onSendWithPayload();
          onClose();
        }}
        className="w-full px-4 py-2 text-left text-sm text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 transition flex items-center gap-2"
      >
        <span className="text-blue-600 dark:text-blue-400">📦</span>
        <div>
          <div className="font-semibold">Send with Payload</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">Add custom payload data</div>
        </div>
      </button>
      
      <div className="border-t border-slate-200 dark:border-slate-700 my-1"></div>
      
      <button
        onClick={() => {
          onSendCustom();
          onClose();
        }}
        className="w-full px-4 py-2 text-left text-sm text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 transition flex items-center gap-2"
      >
        <span className="text-purple-600 dark:text-purple-400">✏️</span>
        <div>
          <div className="font-semibold">Send Custom Event</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">Edit full event structure</div>
        </div>
      </button>
    </div>
  );
}
