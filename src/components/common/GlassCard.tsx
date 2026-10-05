import React, { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
  interactive?: boolean;
  onClick?: () => void;
  id?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  glow = false,
  interactive = false,
  onClick,
  id,
}) => {
  return (
    <div
      id={id}
      onClick={onClick}
      className={`
        bg-white border border-slate-200/90 rounded-xl text-slate-800
        transition-all duration-200
        ${glow ? 'shadow-sm border-blue-200/80 ring-1 ring-blue-100' : 'shadow-xs'}
        ${interactive ? 'hover:border-slate-300 hover:shadow-md cursor-pointer hover:-translate-y-0.5' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};
