'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Network, 
  Search, 
  Filter, 
  Info,
  Lock,
  CheckCircle2,
  Circle,
  ArrowUpRight
} from 'lucide-react';
import { GlassPanel } from '@/components/ui/glass-panel';

const MOCK_NODES = [
  { id: 1, title: 'Bases de Datos', status: 'completed', level: 0.95 },
  { id: 2, title: 'Mensajería Asíncrona', status: 'active', level: 0.68 },
  { id: 3, title: 'Consistencia Eventual', status: 'locked', level: 0 },
  { id: 4, title: 'CQRS', status: 'locked', level: 0 },
  { id: 5, title: 'Event Sourcing', status: 'locked', level: 0 },
  { id: 6, title: 'Kafka & RabbitMQ', status: 'locked', level: 0 },
];

export default function KnowledgeGraph() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold glow-text-cyan flex items-center gap-3">
            <Network className="text-brand-cyan" />
            Semantic <span className="text-brand-violet">Knowledge</span> Graph
          </h1>
          <p className="text-slate-400 text-sm mt-1">Explora las conexiones de tu mapa mental sintetizado.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Buscar concepto..."
              className="glass-panel py-2 pl-10 pr-4 rounded-full text-xs text-slate-300 focus:outline-none focus:border-brand-cyan/50 h-10 w-64 bg-slate-900/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="glass-panel p-2 rounded-full h-10 w-10 flex items-center justify-center hover:bg-white/10 transition-colors">
            <Filter className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </header>

      {/* Main Graph Area (Represented as Cluster View) */}
      <div className="relative min-h-[600px] glass-panel p-8 overflow-hidden rounded-2xl bg-os-bg/40">
        <div className="absolute inset-0 os-grid opacity-30" />
        
        {/* Simple Semantic Clusters */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_NODES.map((node, i) => (
            <NodeCard key={node.id} node={node} index={i} />
          ))}
        </div>

        {/* Ambient Graph Connections Decor (Decorative for now) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
          <line x1="20%" y1="20%" x2="50%" y2="50%" stroke="#00f2ff" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="80%" y1="30%" x2="50%" y2="50%" stroke="#8b5cf6" strokeWidth="1" strokeDasharray="4 4" />
        </svg>
      </div>
    </div>
  );
}

function NodeCard({ node, index }: { node: any, index: number }) {
  const isLocked = node.status === 'locked';
  const isActive = node.status === 'active';
  const isCompleted = node.status === 'completed';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
    >
      <GlassPanel 
        className={cn(
          "h-full transition-all group hover:scale-[1.02]",
          isActive && "glow-border",
          isLocked && "opacity-60 grayscale"
        )}
      >
        <div className="flex justify-between items-start mb-4">
          <div className={cn(
            "p-2 rounded-lg",
            isActive ? "bg-brand-cyan/20 text-brand-cyan" : 
            isCompleted ? "bg-emerald-500/20 text-emerald-500" : "bg-slate-800 text-slate-500"
          )}>
            {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : 
             isLocked ? <Lock className="w-5 h-5" /> : <Circle className="w-5 h-5 animate-pulse" />}
          </div>
          <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-widest">
            {isCompleted ? 'Decay in 12d' : isLocked ? 'Locked' : 'Learning'}
          </span>
        </div>

        <h3 className="text-lg font-bold mb-2 group-hover:text-brand-cyan transition-colors">{node.title}</h3>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className={cn(
                  "h-full transition-all duration-1000",
                  isCompleted ? "bg-emerald-500" : "bg-brand-cyan"
                )}
                style={{ width: `${node.level * 100}%` }}
              />
            </div>
            <span className="text-[10px] font-mono text-slate-500">{(node.level * 100).toFixed(0)}%</span>
          </div>

          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="text-[10px] uppercase font-bold text-slate-400 hover:text-brand-cyan transition-colors flex items-center gap-1">
              <Info className="w-3 h-3" /> Detalles
            </button>
            {!isLocked && (
              <button className="text-[10px] uppercase font-bold text-slate-400 hover:text-brand-cyan transition-colors flex items-center gap-1 ml-auto">
                Abrir <ArrowUpRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </GlassPanel>
    </motion.div>
  );
}

// Re-using cn utility locally if needed
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
