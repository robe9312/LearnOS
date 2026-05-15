'use client';

import { Terminal, Activity, ChevronRight, Search, Download } from 'lucide-react';
import { motion } from 'motion/react';

const logs = [
  { timestamp: '17:42:01.002', source: 'KERNEL', type: 'TRACE', message: 'Memory allocation for cognitive_buffer[1024] succeeded.' },
  { timestamp: '17:42:01.005', source: 'AGENT', type: 'INFO', message: 'Awaiting user input for module "Distributed_VECTORS".' },
  { timestamp: '17:42:01.008', source: 'NEURAL', type: 'SYNC', message: 'Handshake complete with local identity provider.' },
  { timestamp: '17:42:01.012', source: 'UI_RENDER', type: 'DEBUG', message: 'Minimalist shell active. CSS variables injected.' },
  { timestamp: '17:42:01.015', source: 'SYSTEM', type: 'STATUS', message: 'Integrity: HIGH | Temperature: 32C | Load: 0.12' }
];

export default function System() {
  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] bg-[#050505] font-mono text-[11px] leading-relaxed">
      <header className="flex items-center justify-between px-6 py-4 border-b border-[#222]">
        <div className="flex items-center gap-4">
          <Terminal className="w-4 h-4 text-accent" />
          <h1 className="text-sm font-bold uppercase tracking-widest text-[#888]">Runtime_Inspector</h1>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-[10px] text-accent uppercase tracking-widest font-bold">Live Stream</span>
          </div>
          <button className="text-muted hover:text-foreground transition-colors">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-1">
        {logs.map((log, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex gap-4 group hover:bg-[#111] transition-colors py-0.5"
          >
            <span className="text-[#555] shrink-0">{log.timestamp}</span>
            <span className="w-20 text-accent font-bold shrink-0">[{log.source}]</span>
            <span className={`w-12 font-bold shrink-0 ${log.type === 'DEBUG' ? 'text-[#444]' : 'text-[#888]'}`}>{log.type}</span>
            <span className="text-[#aaa] group-hover:text-foreground transition-all">{log.message}</span>
          </motion.div>
        ))}
        {/* Placeholder for real-time appearance */}
        <div className="h-4 flex items-center gap-1">
          <div className="w-1.5 h-3 bg-accent animate-pulse" />
          <span className="text-[#555]">_</span>
        </div>
      </div>

      <footer className="border-t border-[#222] p-4 flex gap-4">
        <div className="flex-1 flex items-center gap-4 bg-[#111] rounded px-4 py-2 border border-[#333] focus-within:border-accent transition-colors">
          <ChevronRight className="w-4 h-4 text-accent" />
          <input 
            type="text" 
            placeholder="system.flush_buffers()..."
            className="bg-transparent border-none outline-none w-full text-[#eee] placeholder-[#444]"
          />
        </div>
        <div className="flex items-center gap-6 px-4">
          <Stat label="CPU" value="12%" />
          <Stat label="MEM" value="342MB" />
          <Stat label="NET" value="0.2KB/s" />
        </div>
      </footer>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-[9px] text-[#444] font-bold">{label}</span>
      <span className="text-[10px] text-[#888]">{value}</span>
    </div>
  );
}
