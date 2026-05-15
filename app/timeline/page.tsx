'use client';

import { motion } from 'motion/react';
import { Calendar, History, Search } from 'lucide-react';

const history = [
  { date: 'MAY 14', items: [
    { time: '22:15', label: 'Quantum Entanglement', type: 'LEARN', description: 'Deep dive into Bell Inequality and EPR Paradox.' },
    { time: '18:30', label: 'Systems Refactoring', type: 'SYSTEM', description: 'Updated UI to Absolute Minimalist v2.0.' }
  ]},
  { date: 'MAY 13', items: [
    { time: '09:00', label: 'Neural Genesis', type: 'SYNC', description: 'Initial handshake with LearnOS kernel successful.' },
    { time: '14:20', label: 'Ethics in AI', type: 'LEARN', description: 'Synthesizing categorical imperatives for agentic behavior.' }
  ]}
];

export default function Timeline() {
  return (
    <div className="max-w-3xl mx-auto py-24 px-6 space-y-16">
      <header className="flex items-end justify-between">
        <div className="space-y-4">
          <h1 className="text-5xl font-medium tracking-tight">Timeline</h1>
          <p className="text-muted text-lg leading-relaxed">
            A linear trace of your cognitive evolution.
          </p>
        </div>
        <div className="flex items-center gap-2 text-muted px-4 py-2 border border-border rounded-md">
          <History className="w-4 h-4" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Active log</span>
        </div>
      </header>

      <div className="space-y-16">
        {history.map((day, i) => (
          <section key={i} className="space-y-8">
            <h2 className="text-[10px] uppercase tracking-[0.4em] font-bold text-muted-foreground border-b border-border pb-4 flex items-center gap-4">
              <Calendar className="w-3.5 h-3.5" />
              {day.date}
            </h2>
            
            <div className="space-y-12 pl-4">
              {day.items.map((item, j) => (
                <motion.div 
                  key={j}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (i * 2 + j) * 0.1 }}
                  className="group relative flex gap-12"
                >
                  <div className="w-12 pt-1 font-mono text-[10px] text-muted-foreground font-bold">
                    {item.time}
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold uppercase tracking-widest group-hover:text-accent transition-colors">
                        {item.label}
                      </span>
                      <span className="text-[9px] font-mono text-muted group-hover:text-muted-foreground transition-colors">
                        // {item.type}
                      </span>
                    </div>
                    <p className="text-muted leading-relaxed text-sm max-w-lg">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <footer className="pt-8 text-center">
        <button className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted hover:text-accent transition-colors">
          Load older sequences
        </button>
      </footer>
    </div>
  );
}
