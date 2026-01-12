import { useState, useEffect, useRef } from 'react';
import { Trash2, Pin, Info, ExternalLink } from 'lucide-react';

interface ContextMenuItem {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
}

interface DesktopIconContextMenuProps {
  x: number;
  y: number;
  appId: string;
  appName: string;
  onClose: () => void;
  onRemoveFromDesktop: (appId: string) => void;
}

export const DesktopIconContextMenu = ({
  x,
  y,
  appId,
  appName,
  onClose,
  onRemoveFromDesktop,
}: DesktopIconContextMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  // Adjust position to stay on screen
  const adjustedX = Math.min(x, window.innerWidth - 180);
  const adjustedY = Math.min(y, window.innerHeight - 150);

  const items: ContextMenuItem[] = [
    {
      label: 'Remove from Desktop',
      icon: <Trash2 className="w-4 h-4" />,
      onClick: () => {
        onRemoveFromDesktop(appId);
        onClose();
      },
      danger: true,
    },
  ];

  return (
    <div
      ref={menuRef}
      className="fixed z-[9999] min-w-[160px] bg-background/95 backdrop-blur-xl border border-border/50 rounded-xl shadow-xl overflow-hidden animate-scale-in"
      style={{ left: adjustedX, top: adjustedY }}
    >
      <div className="px-3 py-2 border-b border-border/50">
        <p className="text-xs text-muted-foreground truncate">{appName}</p>
      </div>
      
      <div className="p-1">
        {items.map((item, idx) => (
          <button
            key={idx}
            onClick={item.onClick}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
              item.danger
                ? 'text-red-400 hover:bg-red-500/10'
                : 'text-foreground hover:bg-muted/50'
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};
