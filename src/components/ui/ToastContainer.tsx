import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { useShopStore } from '../../store/shop-store';
import { cn } from '../../lib/utils';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useShopStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-16 sm:bottom-4 right-2 sm:right-4 left-2 sm:left-auto z-50 flex flex-col gap-2 sm:max-w-sm pointer-events-none">
      {toasts.map(toast => {
        const icons = {
          success: CheckCircle2,
          warning: AlertTriangle,
          alert: AlertCircle,
          info: Info,
        };
        const Icon = icons[toast.type] || Info;

        const borderColors = {
          success: 'border-emerald/40 bg-card text-foreground',
          warning: 'border-amber/40 bg-card text-foreground',
          alert: 'border-guardsRed/40 bg-card text-foreground',
          info: 'border-border-bright bg-card text-foreground',
        };

        const iconColors = {
          success: 'text-emerald',
          warning: 'text-amber',
          alert: 'text-guardsRed',
          info: 'text-foreground-muted',
        };

        return (
          <div
            key={toast.id}
            className={cn(
              'pointer-events-auto flex items-start gap-3 p-3 rounded shadow-popover border text-xs font-sans animate-in slide-in-from-right duration-200 backdrop-blur-md',
              borderColors[toast.type]
            )}
          >
            <Icon className={cn('w-4 h-4 shrink-0 mt-0.5', iconColors[toast.type])} />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-xs tracking-tight">{toast.title}</p>
              <p className="text-[11px] text-foreground-muted font-mono mt-0.5 leading-relaxed">
                {toast.description}
              </p>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-foreground-subtle hover:text-foreground p-0.5 rounded shrink-0 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
