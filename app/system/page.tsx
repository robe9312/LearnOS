'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Terminal, 
  Settings, 
  Cpu, 
  Activity, 
  Database, 
  ShieldCheck,
  ChevronDown,
  RefreshCw,
  Zap,
  Play
} from 'lucide-react';
import { GlassPanel } from '@/components/ui/glass-panel';

export default function SystemInspector() {
  const [logs, setLogs] = useState([
    { timestamp: '16:52:12', type: 'INFO', module: 'EVENT_BUS', message: 'Cognitive event stream initialized.' },
    { timestamp: '16:52:13', type: 'DEBUG', module: 'GRAPHE', message: 'Heuristic traversal complete. 42 candidate nodes identified.' },
    { timestamp: '16:53:01', type: 'WARN', module: 'MASTERY', message: 'Retention decay detected in Node: CSS_GRID (-4.2%).' },
    { timestamp: '16:54:10', type: 'INFO', module: 'AGENT', message: 'TutorPrime selected strategy: SOCRATIC_INTERACTION.' },
  ]);

  const [activeTab, setActiveTab] = useState('logs');

  return (
    <div className="max-w-7xl mx-auto flex flex-col h-[calc(100vh-120px)] overflow-hidden">
      <header className="flex items-center justify-between mb-8 shrink-0">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-brand-violet/20 rounded-xl text-brand-violet glow-border">
            <Terminal className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold glow-text-violet uppercase tracking-tighter">Runtime <span className="text-white">Inspector</span></h1>
            <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">Accessing Kernel... Decrypting cognitive telemetry</p>
          </div>
        </div>
        <div className="flex gap-4">
           <GlassPanel className="py-2 px-6 flex items-center gap-4 border-white/5 bg-slate-900/50">
              <div className="flex flex-col">
                 <span className="text-[10px] text-slate-500 font-bold">Uptime</span>
                 <span className="text-sm font-mono text-white">04:12:33:04</span>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="flex flex-col">
                 <span className="text-[10px] text-slate-500 font-bold">Events/s</span>
                 <span className="text-sm font-mono text-brand-cyan">142</span>
              </div>
           </GlassPanel>
        </div>
      </header>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Navigation / System Status */}
        <div className="w-72 flex flex-col gap-4">
           <GlassPanel className="space-y-1">
              <button 
                onClick={() => setActiveTab('logs')}
                className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors", activeTab === 'logs' ? "bg-brand-violet/20 text-brand-violet" : "text-slate-400 hover:bg-white/5")}
              >
                 <Activity className="w-4 h-4" />
                 <span className="text-xs font-bold uppercase tracking-widest">Event Log</span>
              </button>
              <button 
                onClick={() => setActiveTab('threads')}
                className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors", activeTab === 'threads' ? "bg-brand-violet/20 text-brand-violet" : "text-slate-400 hover:bg-white/5")}
              >
                 <Cpu className="w-4 h-4" />
                 <span className="text-xs font-bold uppercase tracking-widest">Cognitive Threads</span>
              </button>
              <button 
                onClick={() => setActiveTab('memory')}
                className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors", activeTab === 'memory' ? "bg-brand-violet/20 text-brand-violet" : "text-slate-400 hover:bg-white/5")}
              >
                 <Database className="w-4 h-4" />
                 <span className="text-xs font-bold uppercase tracking-widest">Vector Store</span>
              </button>
           </GlassPanel>

           <GlassPanel className="flex-1 bg-slate-900/40 relative overflow-hidden">
              <h3 className="text-[10px] uppercase font-bold text-slate-500 mb-4 tracking-[0.2em]">Live Signals</h3>
              <div className="space-y-4">
                 <SignalMeter label="Neural Sync" value={82} color="brand-cyan" />
                 <SignalMeter label="Latency" value={14} color="brand-violet" />
                 <SignalMeter label="IO Throughput" value={65} color="emerald-500" />
              </div>
              
              {/* Decorative Schematic Background */}
              <div className="absolute bottom-[-20%] right-[-10%] opacity-10 pointer-events-none rotate-12">
                 <ShieldCheck className="w-48 h-48 text-brand-violet" />
              </div>
           </GlassPanel>
        </div>

        {/* Dynamic Panel Content */}
        <div className="flex-1 flex flex-col gap-6 overflow-hidden">
           <GlassPanel className="flex-1 flex flex-col bg-black/40 border-white/5 p-0 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-brand-violet animate-pulse shadow-[0_0_8px_#8b5cf6]" />
                    <span className="text-xs font-bold uppercase tracking-widest">{activeTab === 'logs' ? 'System Log Output' : 'Extended Detail'}</span>
                 </div>
                 <div className="flex gap-4">
                    <button className="flex items-center gap-2 text-[10px] uppercase font-bold text-slate-500 hover:text-white transition-colors">
                       <RefreshCw className="w-3 h-3" /> Clear Buffer
                    </button>
                 </div>
              </div>

              {/* Log Stream Area */}
              <div className="flex-1 overflow-y-auto p-0 font-mono text-[11px] leading-relaxed custom-scrollbar">
                 <table className="w-full border-collapse">
                    <thead className="sticky top-0 bg-slate-900/90 text-slate-600 uppercase text-[9px] tracking-[0.2em] border-b border-white/5 z-20">
                       <tr>
                          <th className="px-6 py-3 text-left font-bold">Timestamp</th>
                          <th className="px-4 py-3 text-left font-bold">Priority</th>
                          <th className="px-4 py-3 text-left font-bold">Module</th>
                          <th className="px-6 py-3 text-left font-bold">Output Stream</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 overflow-x-hidden">
                       {logs.map((log, i) => (
                          <motion.tr 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            key={i} 
                            className="hover:bg-brand-violet/5 transition-colors group cursor-crosshair"
                          >
                             <td className="px-6 py-4 text-slate-500 whitespace-nowrap">{log.timestamp}</td>
                             <td className="px-4 py-4 whitespace-nowrap">
                                <span className={cn(
                                   "px-2 py-0.5 rounded text-[9px] font-bold",
                                   log.type === 'INFO' ? "bg-brand-cyan/10 text-brand-cyan" : 
                                   log.type === 'DEBUG' ? "bg-slate-800 text-slate-500" : "bg-amber-500/10 text-amber-500"
                                )}>{log.type}</span>
                             </td>
                             <td className="px-4 py-4 text-slate-400 font-bold whitespace-nowrap">{log.module}</td>
                             <td className="px-6 py-4 text-slate-300 group-hover:text-white transition-colors">{log.message}</td>
                          </motion.tr>
                       ))}
                    </tbody>
                 </table>
              </div>

              {/* Interactive Inspector Console (Bottom) */}
              <div className="p-4 bg-slate-900/50 border-t border-white/5 shrink-0">
                 <div className="flex items-center gap-3 bg-black/60 rounded-lg p-1 pr-3 border border-white/5 focus-within:border-brand-violet/50 transition-all">
                    <div className="p-2 text-brand-violet">
                       <Play className="w-3 h-3 fill-current" />
                    </div>
                    <input 
                      type="text" 
                      placeholder="Input command (e.g. kern.recalculate_path)..."
                      className="flex-1 bg-transparent border-none outline-none text-xs font-mono text-slate-400 placeholder-slate-700 py-2 pb-2.5"
                    />
                    <div className="flex gap-2">
                       <span className="text-[10px] text-slate-600 font-mono">AI AUTOFILL: ON</span>
                       <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 shadow-[0_0_8px_#10b981]" />
                    </div>
                 </div>
              </div>
           </GlassPanel>
        </div>
      </div>
    </div>
  );
}

function SignalMeter({ label, value, color }: { label: string, value: number, color: string }) {
   return (
      <div className="space-y-1.5">
         <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest text-slate-500">
            <span>{label}</span>
            <span className={cn("glow-text-" + color)}>{value}%</span>
         </div>
         <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
            <motion.div 
               initial={{ width: 0 }}
               animate={{ width: `${value}%` }}
               className={cn("h-full shadow-lg", `bg-brand-${color=== 'brand-cyan' ? 'cyan' : color === 'brand-violet' ? 'violet' : 'emerald-500'}`)}
            />
         </div>
      </div>
   );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
