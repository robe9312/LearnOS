'use client';

import React from 'react';
import { motion } from 'motion/react';
import { 
  Zap, 
  Brain, 
  Target, 
  ArrowUpRight, 
  MessageSquare,
  Sparkles,
  ChevronRight,
  Activity,
  BookOpen
} from 'lucide-react';
import { GlassPanel } from '@/components/ui/glass-panel';
import { MasteryRadar } from '@/components/ui/mastery-radar';

export default function CognitiveHome() {
  // Mock data for initial view - would be dynamic in production
  const activeNode = {
    title: "Sistemas Event-Driven",
    description: "Arquitectura basada en propagación de eventos asíncronos.",
    progress: 68
  };

  const masteryState = {
    conceptualUnderstanding: 0.85,
    proceduralFluency: 0.62,
    transferAbility: 0.45,
    retention: 0.72,
    confidence: 0.90,
    stability: 0.55
  };

  const recentEvents = [
    { type: 'MASTERY_UPDATED', label: 'Conceptual Shift', delta: '+12%', time: '2m ago' },
    { type: 'KNOWLEDGE_GAP_DETECTED', label: 'Dependency Missing: Message Queues', delta: 'Warning', time: '15m ago' },
    { type: 'REFLECTION_LOGGED', label: 'Self-Correction detected', delta: 'Insight', time: '1h ago' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header / Status Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-brand-cyan mb-2"
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Runtime Status: Active</span>
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter glow-text-cyan">
            Cognitive <span className="text-brand-violet">Command</span> Center
          </h1>
        </div>
        <div className="flex gap-4">
          <GlassPanel className="py-2 px-6 flex items-center gap-3 bg-brand-cyan/5 border-brand-cyan/20">
            <Brain className="text-brand-cyan w-5 h-5" />
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 uppercase font-bold">IQ Signal</span>
              <span className="text-xl font-bold text-brand-cyan font-mono leading-none">142</span>
            </div>
          </GlassPanel>
        </div>
      </header>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Active Learning */}
        <div className="lg:col-span-8 space-y-6">
          <GlassPanel glow className="h-full min-h-[400px] flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold mb-1 flex items-center gap-3">
                  <Target className="text-brand-cyan w-6 h-6" />
                  Nodo en Foco
                </h2>
                <p className="text-slate-400 max-w-md">{activeNode.title}</p>
              </div>
              <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
                <ArrowUpRight className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="my-12 relative h-48 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-48 h-48 bg-brand-cyan/10 rounded-full blur-[100px] animate-pulse" />
                <div className="w-32 h-32 border border-brand-cyan/20 rounded-full animate-[ping_3s_infinite]" />
              </div>
              <div className="text-center z-10">
                <span className="text-6xl font-black text-brand-cyan glow-text-cyan font-mono">
                  {activeNode.progress}%
                </span>
                <p className="text-xs uppercase tracking-widest text-brand-cyan/60 font-bold mt-2">Sincronización</p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${activeNode.progress}%` }}
                    className="h-full bg-gradient-to-r from-brand-blue to-brand-cyan"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button className="glass-panel py-3 flex flex-col items-center gap-1 hover:bg-brand-cyan/10 transition-colors group">
                  <BookOpen className="w-4 h-4 text-slate-400 group-hover:text-brand-cyan transition-colors" />
                  <span className="text-[10px] uppercase font-bold text-slate-500">Explicar</span>
                </button>
                <button className="glass-panel py-3 flex flex-col items-center gap-1 hover:bg-brand-violet/10 transition-colors group">
                  <Zap className="w-4 h-4 text-slate-400 group-hover:text-brand-violet transition-colors" />
                  <span className="text-[10px] uppercase font-bold text-slate-500">Desafío</span>
                </button>
                <button className="glass-panel py-3 flex flex-col items-center gap-1 hover:bg-white/10 transition-colors group">
                  <MessageSquare className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                  <span className="text-[10px] uppercase font-bold text-slate-500">Consultar</span>
                </button>
              </div>
            </div>
          </GlassPanel>
        </div>

        {/* Right Column: Analytics & Events */}
        <div className="lg:col-span-4 space-y-6">
          <GlassPanel className="bg-slate-900/40">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Perfil de Maestría
            </h3>
            <MasteryRadar state={masteryState} />
          </GlassPanel>

          <GlassPanel className="flex-1">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4">Señales del Sistema</h3>
            <div className="space-y-4">
              {recentEvents.map((event, index) => (
                <div key={index} className="flex items-start gap-3 group">
                  <div className={`mt-1.5 w-1.5 h-1.5 rounded-full ${index === 0 ? 'bg-brand-cyan shadow-[0_0_8px_#00f2ff]' : 'bg-slate-600'}`} />
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors">{event.label}</span>
                      <span className="text-[10px] text-slate-500">{event.time}</span>
                    </div>
                    <div className="text-[10px] text-brand-cyan/80 font-mono italic shrink-0">{event.delta}</div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 flex items-center justify-center gap-2 text-[10px] uppercase font-bold text-slate-500 hover:text-brand-cyan transition-colors group">
              Explorar Timeline <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </button>
          </GlassPanel>
        </div>
      </div>
    </div>
  );
}
