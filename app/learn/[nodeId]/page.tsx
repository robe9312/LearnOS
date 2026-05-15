'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cpu, 
  Terminal, 
  ChevronRight, 
  Sparkles,
  RefreshCcw,
  BookOpen,
  Zap,
  Info,
  Brain
} from 'lucide-react';
import { GlassPanel } from '@/components/ui/glass-panel';

export default function LearningSession() {
  const params = useParams();
  const nodeId = params.nodeId;
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Identificando contexto cognitivo... Nodo activo: Sistemas Event-Driven. ¿Quieres profundizar en la diferencia entre acoplamiento temporal y espacial?', type: 'tutor' }
  ]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: 'user', content: input, type: 'user' }]);
    setInput('');
    // Mock response
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Excelente pregunta. El acoplamiento espacial se refiere a conocer la ubicación del receptor. En sistemas de eventos, esto se rompe mediante el Event Bus.', type: 'tutor' }]);
    }, 1000);
  };

  return (
    <div className="h-[calc(100vh-120px)] flex gap-6 overflow-hidden">
      {/* Left side: Context & Workspace */}
      <div className="flex-1 flex flex-col gap-6">
        <GlassPanel className="h-full bg-os-bg/60 border-brand-cyan/20 flex flex-col">
          <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-brand-cyan/10 rounded-lg text-brand-cyan">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-lg uppercase tracking-tight">Cognitive Session</h2>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1 font-mono uppercase tracking-tighter">
                    <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" /> Live Session
                  </span>
                  <span>|</span>
                  <span className="font-mono">Node ID: {nodeId}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="glass-panel p-2 hover:bg-white/10 transition-colors">
                <RefreshCcw className="w-4 h-4 text-slate-500" />
              </button>
              <button className="bg-brand-cyan/20 hover:bg-brand-cyan/30 text-brand-cyan px-4 py-1.5 rounded-lg text-xs font-bold transition-all uppercase tracking-widest">
                Finalizar
              </button>
            </div>
          </div>

          {/* Interactive Workspace Area */}
          <div className="flex-1 relative rounded-xl bg-black/40 border border-white/5 p-8 flex items-center justify-center">
            <div className="absolute inset-0 os-grid opacity-20" />
            <div className="text-center max-w-lg relative z-10">
              <Brain className="w-16 h-16 text-brand-cyan mx-auto mb-6 opacity-40" />
              <h3 className="text-xl font-bold mb-4">Área de Trabajo Conceptual</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Aquí es donde se visualizan los modelos mentales, diagramas de flujo y desafíos generados dinámicamente por LearnOS.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-4">
                <GlassPanel className="p-3 text-left bg-slate-900/50">
                  <div className="text-[10px] text-brand-cyan uppercase font-bold mb-1">Concepto Base</div>
                  <div className="text-sm">Inmutabilidad</div>
                </GlassPanel>
                <GlassPanel className="p-3 text-left bg-slate-900/50">
                  <div className="text-[10px] text-brand-violet uppercase font-bold mb-1">Próxima Señal</div>
                  <div className="text-sm">Propagación</div>
                </GlassPanel>
              </div>
            </div>
          </div>
        </GlassPanel>
      </div>

      {/* Right side: Tutor Agent Cinematic Panel */}
      <div className="w-96 flex flex-col gap-6">
        <GlassPanel glow className="flex-1 flex flex-col min-h-0 bg-slate-900/80">
          <div className="flex items-center gap-3 mb-6 p-2 border-b border-white/5">
            <div className="relative">
               <Sparkles className="w-6 h-6 text-brand-cyan animate-pulse" />
               <div className="absolute inset-0 bg-brand-cyan/20 blur-lg" />
            </div>
            <div>
              <h3 className="font-bold text-xs uppercase tracking-widest text-slate-300">Tutor Prime</h3>
              <p className="text-[9px] text-slate-500 font-mono italic">Cognition Orchestrator v4.0</p>
            </div>
          </div>

          {/* Message Stream */}
          <div className="flex-1 overflow-y-auto space-y-6 px-2 custom-scrollbar">
            {messages.map((msg, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: msg.type === 'user' ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={cn(
                  "flex flex-col gap-2",
                  msg.type === 'user' ? "items-end text-right" : "items-start"
                )}
              >
                <div className={cn(
                  "max-w-[90%] p-4 rounded-xl text-sm leading-relaxed",
                  msg.type === 'user' ? "bg-brand-violet/20 border border-brand-violet/30 text-white" : "glass-panel bg-brand-cyan/5 text-slate-200"
                )}>
                  {msg.content}
                </div>
                <span className="text-[8px] uppercase tracking-widest text-slate-600 font-bold px-1">
                  {msg.type === 'user' ? 'Respuesta enviada' : 'Análisis cognitivo'}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Reasoning / Thought Panel (Small) */}
          <div className="mt-6 mb-4">
             <div className="p-3 bg-brand-cyan/5 rounded-lg border border-brand-cyan/10">
                <div className="flex items-center gap-2 mb-2">
                   <Terminal className="w-3 h-3 text-brand-cyan" />
                   <span className="text-[9px] uppercase font-bold text-brand-cyan tracking-widest">Reasoning Tracer</span>
                </div>
                <p className="text-[10px] text-slate-500 italic leading-tight">
                   "Detectada debilidad en el concepto de desacoplamiento temporal. Iniciando estrategia de analogía espacial..."
                </p>
             </div>
          </div>

          {/* Input Area */}
          <div className="relative mt-auto">
            <input 
              type="text" 
              placeholder="Escribe tu reflexión..."
              className="w-full bg-os-bg/80 border border-white/10 rounded-xl py-4 pl-4 pr-12 text-sm focus:outline-none focus:border-brand-cyan/50 transition-all font-mono"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button 
              onClick={handleSend}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-brand-cyan text-os-bg hover:bg-brand-cyan/80 transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-2 flex justify-between px-1">
             <span className="text-[8px] text-slate-600 uppercase font-mono tracking-tighter italic">Modo: Socrático Adaptativo</span>
             <Info className="w-3 h-3 text-slate-700 cursor-help" />
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
