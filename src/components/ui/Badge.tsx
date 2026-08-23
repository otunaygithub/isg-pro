import React from 'react';
import { RiskSeverity } from '@/lib/types';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'critical';
  severity?: RiskSeverity;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  severity,
  children,
  ...props
}) => {
  let colorClass = 'bg-slate-100 text-slate-800 border-slate-200';

  if (severity) {
    switch (severity) {
      case 'DÜŞÜK':
        colorClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
        break;
      case 'ORTA':
        colorClass = 'bg-amber-50 text-amber-700 border-amber-200';
        break;
      case 'YÜKSEK':
        colorClass = 'bg-orange-50 text-orange-700 border-orange-200';
        break;
      case 'ACİL_DURDURMA':
        colorClass = 'bg-rose-600 text-white font-bold animate-pulse border-rose-700';
        break;
    }
  } else {
    switch (variant) {
      case 'success':
        colorClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
        break;
      case 'warning':
        colorClass = 'bg-amber-50 text-amber-700 border-amber-200';
        break;
      case 'danger':
        colorClass = 'bg-rose-50 text-rose-700 border-rose-200';
        break;
      case 'critical':
        colorClass = 'bg-rose-600 text-white border-rose-700';
        break;
      case 'info':
        colorClass = 'bg-sky-50 text-sky-700 border-sky-200';
        break;
    }
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors',
        colorClass,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};