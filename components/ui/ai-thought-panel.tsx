'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Brain, Cpu, MessageSquare, Sparkles } from 'lucide-react';
import { GlassPanel } from './glass-panel';

interface AIThoughtPanelProps {
  thoughts: string[];
  isThinking?: boolean;
}

export function AIThoughtPanel({ thoughts, isThinking }: AIThoughtPanelProps) {
  return (
    <GlassPanel className="bg-slate-900/50 border-brand-cyan/20 p-6">
      <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
        <div className="w-8 h-8 rounded-lg bg-brand-cyan/10 flex items-center justify-center">
          <Brain className="w-4 h-4 text-brand-cyan" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">AI Reasoning Tracer</h4>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Cognitive Process Stream</p>
        </div>
        {isThinking && (
          <div className="ml-auto flex items-center gap-2">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Cpu className="w-3.5 h-3.5 text-brand-cyan" />
            </motion.div>
            <span className="text-[9px] font-mono text-brand-cyan animate-pulse">Processing...</span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {thoughts.map((thought, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.2 }}
            className="flex gap-4 items-start group"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-brand-cyan/50 mt-1.5 shrink-0 group-hover:scale-125 transition-transform" />
            <p className="text-xs text-slate-400 font-mono leading-relaxed group-hover:text-slate-200 transition-colors">
              {thought}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 pt-4 border-t border-white/5 flex justify-between items-center">
         <div className="flex gap-2">
            <Sparkles className="w-3 h-3 text-slate-600" />
            <MessageSquare className="w-3 h-3 text-slate-600" />
         </div>
         <span className="text-[8px] font-mono text-slate-700">KERNEL_ADDR: 0x7FFC...B420</span>
      </div>
    </GlassPanel>
  );
}
