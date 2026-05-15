'use client';

import React from 'react';
import { motion } from 'motion/react';
import { 
  Compass, 
  Sparkles, 
  ScrollText, 
  Award,
  ChevronRight,
  Target,
  Flame,
  Star
} from 'lucide-react';
import { GlassPanel } from '@/components/ui/glass-panel';

const JOURNEY_CHAPTERS = [
  { id: 1, title: 'El Despertar del Arquitecto', description: 'Fundamentos de la arquitectura cognitiva en LearnOS.', status: 'completed', arc: 'Exposition' },
  { id: 2, title: 'El Flujo del Evento', description: 'Dominando la propagación de conocimiento asíncrono.', status: 'active', arc: 'Rising Action' },
  { id: 3, title: 'La Paradoja de la Consistencia', description: 'Enfrentando el clímax de los estados distribuidos.', status: 'locked', arc: 'Climax' },
  { id: 4, title: 'El Eco de la Retención', description: 'Estrategias de estabilización y memoria semántica.', status: 'locked', arc: 'Falling Action' },
];

export default function NarrativeJourney() {
  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <header className="text-center space-y-4">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="inline-flex items-center gap-2 px-3 py-1 bg-brand-violet/10 border border-brand-violet/20 rounded-full text-brand-violet text-[10px] uppercase font-bold tracking-widest"
        >
          <Compass className="w-3 h-3" /> Odisea de Aprendizaje Activa
        </motion.div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter glow-text-violet">
          The <span className="text-white">Narrative</span> Arc
        </h1>
        <p className="text-slate-400 max-w-xl mx-auto text-sm">
          Tu evolución cognitiva no es un curso, es una historia tejida por cada nodo que conquistas.
        </p>
      </header>

      {/* Progress Path (Visualized as a Vertical Timeline Journey) */}
      <div className="relative space-y-12 before:absolute before:left-8 md:before:left-1/2 before:top-0 before:bottom-0 before:w-px before:bg-gradient-to-b before:from-brand-cyan/40 before:via-brand-violet/40 before:to-transparent">
        {JOURNEY_CHAPTERS.map((chapter, i) => (
          <div key={chapter.id} className="relative flex flex-col md:flex-row md:items-center gap-8 md:even:flex-row-reverse">
            {/* Chapter Indicator / Dot */}
            <div className="absolute left-8 md:left-1/2 -translate-x-1/2 z-10">
               <div className={cn(
                 "w-4 h-4 rounded-full border-4 border-os-bg ring-4",
                 chapter.status === 'completed' ? "bg-emerald-500 ring-emerald-500/20" : 
                 chapter.status === 'active' ? "bg-brand-cyan ring-brand-cyan/20 animate-pulse" : "bg-slate-700 ring-slate-800"
               )} />
            </div>

            {/* Content Card */}
            <div className="ml-16 md:ml-0 md:w-1/2 md:px-12">
               <GlassPanel 
                 glow={chapter.status === 'active'}
                 className={cn(
                   "group hover:bg-slate-900/60 transition-all",
                   chapter.status === 'locked' && "opacity-50 grayscale"
                 )}
               >
                  <div className="flex justify-between items-start mb-4">
                     <span className="text-[9px] uppercase font-bold text-slate-500 tracking-[0.2em]">{chapter.arc}</span>
                     {chapter.status === 'completed' && <Award className="w-4 h-4 text-emerald-500" />}
                     {chapter.status === 'active' && <Flame className="w-4 h-4 text-brand-cyan animate-bounce" />}
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2 group-hover:text-brand-violet transition-colors">
                     Capítulo {chapter.id}: {chapter.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-6">
                     {chapter.description}
                  </p>

                  {chapter.status === 'active' ? (
                     <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                           <div className="p-1 rounded bg-brand-cyan/10 text-brand-cyan">
                              <Target className="w-3 h-3" />
                           </div>
                           <span className="text-[10px] text-slate-400 uppercase font-bold mt-0.5">Reto actual: El Latido del Bus</span>
                        </div>
                        <button className="text-[10px] uppercase font-bold text-brand-cyan flex items-center gap-1 hover:glow-text-cyan transition-all">
                           Continuar <ChevronRight className="w-3 h-3" />
                        </button>
                     </div>
                  ) : chapter.status === 'completed' ? (
                    <div className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest flex items-center gap-2">
                      <Star className="w-3 h-3 fill-current" /> Dominado con éxito
                    </div>
                  ) : (
                    <div className="text-[10px] text-slate-600 font-bold uppercase tracking-widest flex items-center gap-2">
                      <Sparkles className="w-3 h-3" /> Requiere sincronización previa
                    </div>
                  )}
               </GlassPanel>
            </div>
          </div>
        ))}
      </div>

      {/* Narrative Stats Overlay */}
      <footer className="pt-12">
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatSmall label="Arcos Completados" value="04" icon={ScrollText} />
            <StatSmall label="Breakthroughs" value="12" icon={Sparkles} />
            <StatSmall label="Nivel Narrativo" value="Prototipo" icon={Award} />
            <StatSmall label="Sincronía" value="82%" icon={Target} />
         </div>
      </footer>
    </div>
  );
}

function StatSmall({ label, value, icon: Icon }: { label: string, value: string, icon: any }) {
   return (
      <GlassPanel className="p-4 flex flex-col items-center gap-2 bg-slate-900/40 text-center">
         <Icon className="w-4 h-4 text-slate-500" />
         <div className="text-xl font-bold glow-text-cyan">{value}</div>
         <div className="text-[9px] uppercase font-bold tracking-widest text-slate-500">{label}</div>
      </GlassPanel>
   );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
