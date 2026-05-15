'use client';

import { motion } from 'motion/react';
import { Search, Filter, Plus } from 'lucide-react';

const nodes = [
  { id: 1, x: 200, y: 150, label: 'Cognitive' },
  { id: 2, x: 400, y: 100, label: 'Neural' },
  { id: 3, x: 500, y: 300, label: 'Quantum' },
  { id: 4, x: 150, y: 350, label: 'Ethics' },
  { id: 5, x: 350, y: 450, label: 'Systems' },
];

const links = [
  { source: 1, target: 2 },
  { source: 1, target: 4 },
  { source: 2, target: 3 },
  { source: 3, target: 5 },
  { source: 4, target: 5 },
  { source: 1, target: 5 },
];

export default function Explore() {
  return (
    <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden">
      <aside className="w-80 border-r border-border p-8 space-y-12 shrink-0 overflow-y-auto custom-scrollbar">
        <header className="space-y-4">
          <h1 className="text-3xl font-medium tracking-tight">Explore</h1>
          <p className="text-muted text-sm leading-relaxed">
            Navigate the semantic landscape of your internal knowledge.
          </p>
        </header>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input 
            type="text" 
            placeholder="Search nodes..."
            className="w-full bg-card border border-border rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-accent transition-colors"
          />
        </div>

        <section className="space-y-4">
          <h3 className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Active Clusters</h3>
          <div className="space-y-2">
            <ClusterItem label="Distributed Systems" count={14} active />
            <ClusterItem label="Neuro-Linguistics" count={8} />
            <ClusterItem label="Quantum Topology" count={22} />
          </div>
        </section>

        <button className="w-full py-2 px-4 border border-border rounded-md text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-card transition-colors">
          <Plus className="w-4 h-4" /> New Seed
        </button>
      </aside>

      <main className="flex-1 bg-background relative overflow-hidden flex items-center justify-center">
        <div className="absolute top-8 right-8 flex gap-2">
          <button className="p-2 border border-border rounded-md bg-background/50 hover:bg-card transition-colors">
            <Filter className="w-4 h-4 text-muted" />
          </button>
        </div>

        <svg viewBox="0 0 800 600" className="w-full h-full max-w-4xl opacity-80">
          {/* Flat Links */}
          {links.map((link, i) => {
            const s = nodes.find(n => n.id === link.source)!;
            const t = nodes.find(n => n.id === link.target)!;
            return (
              <line 
                key={i} 
                x1={s.x} y1={s.y} x2={t.x} y2={t.y} 
                stroke="currentColor" 
                className="text-border" 
                strokeWidth="1.5"
              />
            );
          })}
          
          {/* Flat Nodes */}
          {nodes.map((node) => (
            <motion.g 
              key={node.id} 
              whileHover={{ scale: 1.1 }}
              className="cursor-pointer group"
            >
              <circle 
                cx={node.x} cy={node.y} r="6" 
                className="fill-background stroke-accent" 
                strokeWidth="2"
              />
              <text 
                x={node.x} y={node.y + 24} 
                textAnchor="middle" 
                className="text-[10px] font-mono font-bold uppercase tracking-widest fill-muted group-hover:fill-accent transition-colors"
              >
                {node.label}
              </text>
            </motion.g>
          ))}
        </svg>

        {/* Minimal grid background */}
        <div className="absolute inset-0 z-[-1] opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </main>
    </div>
  );
}

function ClusterItem({ label, count, active = false }: { label: string; count: number; active?: boolean }) {
  return (
    <div className={`group flex items-center justify-between p-2 rounded-md transition-colors cursor-pointer ${active ? 'bg-accent/5 text-accent' : 'hover:bg-card'}`}>
      <span className="text-xs font-medium">{label}</span>
      <span className="text-[10px] font-mono text-muted">{count}</span>
    </div>
  );
}
