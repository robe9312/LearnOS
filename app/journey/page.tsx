'use client';

import { motion } from 'motion/react';
import { Circle, ChevronRight, CheckCircle2, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

const roadmap = [
  {
    stage: '01',
    title: 'Foundations of Thought',
    description: 'Mastering the core structures of logical reasoning and internal taxonomy.',
    status: 'complete',
    modules: ['Logic Primitives', 'Semantic Labeling', 'Categorical Intuition']
  },
  {
    stage: '02',
    title: 'Complex Systems Theory',
    description: 'Understanding multi-layered dependencies and emergent behaviors.',
    status: 'active',
    modules: ['Feedback Loops', 'Network Topology', 'Entropy Management']
  },
  {
    stage: '03',
    title: 'Post-Human Cognition',
    description: 'Integrating algorithmic acceleration into native cognitive processes.',
    status: 'locked',
    modules: ['Parallel Threading', 'Vectorized Recall', 'Synthetic Intuition']
  }
];

export default function Journey() {
  return (
    <div className="max-w-3xl mx-auto py-24 px-6 space-y-16">
      <header className="space-y-4">
        <h1 className="text-5xl font-medium tracking-tight">The Journey</h1>
        <p className="text-muted text-lg leading-relaxed max-w-xl">
          Your path through the LearnOS curriculum. Each stage refines the resolution of your cognitive model.
        </p>
      </header>

      <section className="space-y-20">
        {roadmap.map((stage, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15 }}
            className={cn(
              "relative pl-12 border-l border-border pb-4",
              stage.status === 'locked' && "opacity-50"
            )}
          >
            {/* Status Indicator */}
            <div className={cn(
              "absolute left-[-9px] top-0 w-4 h-4 rounded-full border-2 bg-background flex items-center justify-center",
              stage.status === 'complete' ? "border-accent text-accent" : 
              stage.status === 'active' ? "border-accent animate-pulse" : "border-border"
            )}>
              {stage.status === 'complete' && <CheckCircle2 className="w-3 h-3" />}
              {stage.status === 'locked' && <Lock className="w-2 h-2 text-muted" />}
            </div>

            <div className="space-y-6">
              <header className="space-y-2">
                <span className="text-[10px] font-mono font-bold tracking-[0.3em] text-accent uppercase">
                  Stage {stage.stage}
                </span>
                <h2 className="text-2xl font-medium">{stage.title}</h2>
                <p className="text-muted text-base leading-relaxed max-w-lg italic">
                  "{stage.description}"
                </p>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stage.modules.map((module, j) => (
                  <div key={j} className="group p-4 border border-border rounded-md hover:border-accent/40 transition-colors cursor-pointer flex items-center justify-between">
                    <span className="text-sm font-medium text-mutedgroup-hover:text-foreground transition-colors">
                      {module}
                    </span>
                    <ChevronRight className="w-4 h-4 text-border group-hover:text-accent transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </section>
      
      <div className="pt-8 text-center">
        <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted">
          Continuity verified: 04.12.2026
        </p>
      </div>
    </div>
  );
}
