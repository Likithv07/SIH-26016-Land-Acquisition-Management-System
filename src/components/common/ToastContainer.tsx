import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none">
      {toasts.map((toast) => {
        const iconMap = {
          success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
          warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
          info: <Info className="w-5 h-5 text-cyan-400 shrink-0" />,
          danger: <XCircle className="w-5 h-5 text-rose-400 shrink-0" />,
        };

        const borderMap = {
          success: 'border-emerald-500/40 bg-emerald-950/80 text-emerald-100 shadow-[0_0_20px_rgba(16,185,129,0.3)]',
          warning: 'border-amber-500/40 bg-amber-950/80 text-amber-100 shadow-[0_0_20px_rgba(245,158,11,0.3)]',
          info: 'border-cyan-500/40 bg-cyan-950/80 text-cyan-100 shadow-[0_0_20px_rgba(34,211,238,0.3)]',
          danger: 'border-rose-500/40 bg-rose-950/80 text-rose-100 shadow-[0_0_20px_rgba(239,68,68,0.3)]',
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border backdrop-blur-xl ${borderMap[toast.type]} transition-all animate-in fade-in slide-in-from-bottom-3 duration-200`}
          >
            {iconMap[toast.type]}
            <p className="text-sm font-medium flex-1 leading-snug">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
