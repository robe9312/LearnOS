'use client';

import { motion } from 'motion/react';
import { ArrowRight, Circle, Activity, Cpu, Database } from 'lucide-react';
import { cn } from '@/lib/utils';

const feed = [
  {
    id: 1,
    time: '09:42:01',
    category: 'INTEGRATION',
    content: 'Neural handshake complete. Synchronizing cognitive buffers with local vector store.',
    importance: 'low'
  },
  {
    id: 2,
    time: '10:12:44',
    category: 'LEARNING',
    content: 'Quantum Computing fundamentals successfully indexed. New semantic cluster formed: /physics/quantum.',
    importance: 'high'
  },
  {
    id: 3,
    time: '11:05:12',
    category: 'SYSTEM',
    content: 'Optimizing graph topology. 14 stale nodes pruned. Efficiency increased by 4.2%.',
    importance: 'medium'
  },
  {
    id: 4,
    time: '13:22:10',
    category: 'THOUGHT',
    content: 'Pattern detected in user inquiry frequency. Suggesting deep-dive into Distributed Systems.',
    importance: 'high'
  }
];

export default function Home() {
  return (
    <div className="max-w-3xl mx-auto py-24 px-6 space-y-16">
      <header className="space-y-4">
        <div className="flex items-center gap-2 text-accent">
          <Activity className="w-4 h-4" />
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold font-mono">Status: Optimal</span>
        </div>
        <h1 className="text-5xl font-medium tracking-tight">Cognitive Home</h1>
        <p className="text-muted text-lg leading-relaxed max-w-xl">
          Welcome back to LearnOS. Your neural landscape is synchronized. Four events requiring attention since last session.
        </p>
      </header>

      <section className="space-y-8">
        <h2 className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground border-b border-border pb-4">
          Runtime Stream
        </h2>
        
        <div className="space-y-12">
          {feed.map((item, i) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group relative flex gap-8"
            >
              <div className="flex flex-col items-center gap-2 pt-1.5">
                <span className="text-[10px] font-mono text-muted-foreground vertical-text rotate-180">
                  {item.time}
                </span>
                <div className={cn(
                  "w-1 h-1 rounded-full",
                  item.importance === 'high' ? "bg-accent" : "bg-border group-hover:bg-muted"
                )} />
              </div>
              
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-accent/80 px-1.5 py-0.5 border border-accent/20 rounded">
                    {item.category}
                  </span>
                </div>
                <p className="text-lg leading-snug group-hover:text-accent/90 transition-colors cursor-default">
                  {item.content}
                </p>
                <div className="pt-2 flex gap-4">
                  <button className="text-[10px] font-bold uppercase tracking-widest text-muted hover:text-foreground flex items-center gap-1.5 transition-colors">
                    EXPAND <ArrowRight className="w-3 h-3" />
                  </button>
                  <button className="text-[10px] font-bold uppercase tracking-widest text-muted hover:text-foreground transition-colors">
                    ARCHIVE
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="pt-16 border-t border-border grid grid-cols-3 gap-8">
        <Stat icon={Cpu} label="Load" value="12%" />
        <Stat icon={Database} label="Vector Store" value="4.2 GB" />
        <Stat icon={Activity} label="Latency" value="14ms" />
      </footer>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 text-muted">
        <Icon className="w-3 h-3" />
        <span className="text-[10px] uppercase tracking-widest font-bold">{label}</span>
      </div>
      <p className="font-mono text-sm">{value}</p>
    </div>
  );
}
