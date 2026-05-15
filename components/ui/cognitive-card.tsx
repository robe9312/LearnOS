'use client';

import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { GlassPanel } from './glass-panel';

interface CognitiveCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  statusColor?: 'cyan' | 'violet' | 'emerald';
  className?: string;
  progress?: number;
}

export function CognitiveCard({ 
  title, 
  subtitle, 
  children, 
  icon, 
  statusColor = 'cyan', 
  className,
  progress
}: CognitiveCardProps) {
  const colorClass = statusColor === 'cyan' ? 'text-brand-cyan' : statusColor === 'violet' ? 'text-brand-violet' : 'text-emerald-500';
  const glowBorder = statusColor === 'cyan' ? 'glow-border' : statusColor === 'violet' ? 'glow-border-violet' : 'border-emerald-500/30';

  return (
    <GlassPanel className={cn("p-0 flex flex-col", glowBorder, className)} animate={true}>
      <div className="p-5 border-b border-white/5 flex items-start justify-between">
        <div className="flex items-center gap-3">
          {icon && (
            <div className={cn("p-2 rounded-lg bg-white/5", colorClass)}>
              {icon}
            </div>
          )}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">{title}</h3>
            {subtitle && <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">{subtitle}</p>}
          </div>
        </div>
        <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", 
          statusColor === 'cyan' ? "bg-brand-cyan shadow-[0_0_8px_#00f2ff]" : 
          statusColor === 'violet' ? "bg-brand-violet shadow-[0_0_8px_#8b5cf6]" : "bg-emerald-500 shadow-[0_0_8px_#10b981]"
        )} />
      </div>

      <div className="flex-1 p-5">
        {children}
      </div>

      {progress !== undefined && (
        <div className="px-5 pb-5">
          <div className="flex justify-between items-center text-[9px] font-bold text-slate-500 uppercase mb-2">
            <span>Sincronización</span>
            <span className={colorClass}>{progress}%</span>
          </div>
          <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className={cn("h-full", 
                statusColor === 'cyan' ? "bg-brand-cyan" : 
                statusColor === 'violet' ? "bg-brand-violet" : "bg-emerald-500"
              )}
            />
          </div>
        </div>
      )}
    </GlassPanel>
  );
}
