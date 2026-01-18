import { useEffect, useRef, useState } from 'react';

interface ContextMenuProps {
  x: number;
  y: number;
  onSendWithPayload: () => void;
  onClose: () => void;
}

export default function ContextMenu({ x, y, onSendWithPayload, onClose }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x, y });

  useEffect(() => {
    // Adjust position to keep menu in viewport
    if (menuRef.current) {
      const menuRect = menuRef.current.getBoundingClientRect();
      const parentElement = menuRef.current.parentElement;
      
      if (!parentElement) return;
      
      const parentRect = parentElement.getBoundingClientRect();
      const parentWidth = parentRect.width;
      const parentHeight = parentRect.height;

      let adjustedX = x;
      let adjustedY = y;

      // Add slight offset to appear next to cursor
      adjustedX += 5;
      adjustedY += 5;

      // Check right boundary (relative to parent)
      if (adjustedX + menuRect.width > parentWidth) {
        adjustedX = Math.max(10, parentWidth - menuRect.width - 10);
      }

      // Check bottom boundary (relative to parent)
      if (adjustedY + menuRect.height > parentHeight) {
        adjustedY = Math.max(10, parentHeight - menuRect.height - 10);
      }

      // Check left boundary
      if (adjustedX < 10) {
        adjustedX = 10;
      }

      // Check top boundary
      if (adjustedY < 10) {
        adjustedY = 10;
      }

      setPosition({ x: adjustedX, y: adjustedY });
    }
  }, [x, y]);

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
      className="absolute z-[100] bg-white dark:bg-slate-800 rounded-lg shadow-2xl border border-slate-300 dark:border-slate-600 py-1 min-w-[200px]"
      style={{ left: position.x, top: position.y }}
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
    </div>
  );
}
