'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Activity, Battery, Wifi, Cpu } from 'lucide-react';
import { GlassPanel } from './glass-panel';

export function CognitiveSignalBar() {
  return (
    <header className="h-12 border-b border-white/5 bg-slate-950/50 backdrop-blur-md flex items-center justify-between px-6 z-40">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Kernel Core: Stable</span>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <SignalItem icon={Cpu} label="Load" value="12%" />
          <SignalItem icon={Activity} label="Cognition" value="Sync" />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-1.5">
             {[1, 2, 3, 4].map(i => (
               <motion.div 
                 key={i}
                 animate={{ height: [4, 12, 4] }}
                 transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                 className="w-0.5 bg-brand-cyan/60 rounded-full"
               />
             ))}
           </div>
           <span className="text-[10px] font-mono text-brand-cyan">RF: 1.2GHz</span>
        </div>
        <div className="flex items-center gap-3">
          <Wifi className="w-3.5 h-3.5 text-slate-500" />
          <Battery className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-[10px] font-mono text-slate-300">16:58:12</span>
        </div>
      </div>
    </header>
  );
}

function SignalItem({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="flex items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity cursor-default">
      <Icon className="w-3 h-3 text-slate-400" />
      <span className="text-[9px] font-bold uppercase tracking-tighter text-slate-500">{label}:</span>
      <span className="text-[9px] font-mono text-slate-200">{value}</span>
    </div>
  );
}
