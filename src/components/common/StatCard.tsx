import React from 'react';
import { LucideIcon } from 'lucide-react';
import { GlassCard } from './GlassCard';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  color?: 'blue' | 'cyan' | 'purple' | 'emerald' | 'amber' | 'rose';
  id?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = 'blue',
  id,
}) => {
  const colorMap = {
    blue: 'text-blue-800 bg-blue-50 border-blue-200/80',
    cyan: 'text-blue-900 bg-blue-50/70 border-blue-200',
    purple: 'text-indigo-800 bg-indigo-50 border-indigo-200/80',
    emerald: 'text-emerald-800 bg-emerald-50 border-emerald-200/80',
    amber: 'text-amber-800 bg-amber-50 border-amber-200/80',
    rose: 'text-rose-800 bg-rose-50 border-rose-200/80',
  };

  const iconColor = {
    blue: 'text-blue-700',
    cyan: 'text-blue-800',
    purple: 'text-indigo-700',
    emerald: 'text-emerald-700',
    amber: 'text-amber-700',
    rose: 'text-rose-700',
  }[color];

  return (
    <GlassCard id={id} className="p-5 relative overflow-hidden group hover:border-blue-300 hover:shadow-xs transition-all">
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">{title}</p>
          <div className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight flex items-baseline gap-1.5">
            {value}
          </div>
          {subtitle && <p className="text-xs text-slate-500 font-medium mt-1">{subtitle}</p>}
          {trend && (
            <div className="flex items-center gap-1.5 text-xs pt-1">
              <span className={`font-semibold ${trend.isPositive ? 'text-emerald-700' : 'text-rose-700'}`}>
                {trend.isPositive ? '↑' : '↓'} {trend.value}
              </span>
              <span className="text-slate-400 font-medium">vs target</span>
            </div>
          )}
        </div>

        <div className={`p-2.5 rounded-xl border ${colorMap[color]} transition-transform duration-200 group-hover:scale-105 shrink-0`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
      </div>
    </GlassCard>
  );
};
