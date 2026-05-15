'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Command, 
  Search, 
  Sparkles, 
  BookOpen, 
  Activity, 
  ChevronRight, 
  History as HistoryIcon,
  X,
  Target,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

// --- Components ---

function CommandBar({ onCommand }: { onCommand: (cmd: string) => void }) {
  const [value, setValue] = useState('');

  return (
    <div className="w-full border-b border-border bg-background/50 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-6 h-16 flex items-center gap-4">
        <Command className="w-5 h-5 text-muted" />
        <input 
          autoFocus
          className="command-input"
          placeholder="What would you like to build or understand today?"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && value.trim()) {
              onCommand(value);
              setValue('');
            }
          }}
        />
        <div className="flex items-center gap-2">
          <kbd className="text-[10px] bg-muted/10 border border-border px-1.5 py-0.5 rounded text-muted font-mono">⌘</kbd>
          <kbd className="text-[10px] bg-muted/10 border border-border px-1.5 py-0.5 rounded text-muted font-mono">K</kbd>
        </div>
      </div>
    </div>
  );
}

function CognitiveWorkspace({ content }: { content: any }) {
  return (
    <div className="cognitive-workspace">
      <AnimatePresence mode="wait">
        <motion.div
          key={content.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="space-y-12"
        >
          <header className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-accent">
                {content.category}
              </span>
              <div className="w-1 h-1 rounded-full bg-border" />
              <span className="text-[10px] font-mono text-muted uppercase tracking-widest">
                {content.timestamp}
              </span>
            </div>
            <h1 className="text-4xl font-medium tracking-tight leading-tight">
              {content.title}
            </h1>
          </header>

          <div className="space-y-8">
            {content.sections.map((section: any, i: number) => (
              <section key={i} className="space-y-4">
                {section.type === 'prose' && (
                  <p className="text-prose leading-relaxed">
                    {section.content.split(' ').map((word: string, j: number) => {
                      if (word.startsWith('[[')) {
                        const link = word.replace('[[', '').replace(']]', '');
                        return (
                          <span key={j} className="text-accent underline underline-offset-4 cursor-pointer hover:bg-accent/5 transition-colors">
                            {link}{' '}
                          </span>
                        );
                      }
                      return word + ' ';
                    })}
                  </p>
                )}
                {section.type === 'insight' && (
                  <div className="p-6 bg-card border border-border rounded-lg space-y-3">
                    <div className="flex items-center gap-2 text-accent">
                      <Sparkles className="w-4 h-4" />
                      <span className="text-[10px] uppercase font-bold tracking-widest">Cognitive Insight</span>
                    </div>
                    <p className="text-sm text-foreground/80 italic leading-relaxed">
                      {section.content}
                    </p>
                  </div>
                )}
                {section.type === 'action' && (
                  <div className="flex flex-wrap gap-3">
                    {section.items.map((item: string, j: number) => (
                      <button key={j} className="px-4 py-1.5 border border-border rounded-full text-xs font-medium hover:border-accent hover:text-accent transition-colors">
                        {item}
                      </button>
                    ))}
                  </div>
                )}
              </section>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function ContextPanel({ isOpen, onClose, context }: { isOpen: boolean; onClose: () => void; context: any }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/40 backdrop-blur-sm z-[60]"
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-96 bg-background border-l border-border z-[70] p-8 space-y-12 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted">Context Inspector</h2>
              <button onClick={onClose} className="p-1 hover:text-accent transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <section className="space-y-6">
              <div className="flex items-center gap-2 text-accent">
                <Target className="w-4 h-4" />
                <h3 className="text-sm font-medium">Mastery Snapshot</h3>
              </div>
              <div className="space-y-4">
                {context.mastery.map((item: any, i: number) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold tracking-widest text-muted uppercase">
                      <span>{item.subject}</span>
                      <span>{item.value}%</span>
                    </div>
                    <div className="h-0.5 bg-border rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${item.value}%` }}
                        className="h-full bg-accent"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-2 text-accent">
                <HistoryIcon className="w-4 h-4" />
                <h3 className="text-sm font-medium">Recent Activity</h3>
              </div>
              <div className="space-y-4 border-l border-border pl-4">
                {context.history.map((event: any, i: number) => (
                  <div key={i} className="relative space-y-1">
                    <div className="absolute left-[-21px] top-1.5 w-2 h-2 rounded-full bg-border" />
                    <span className="text-[10px] text-muted font-mono">{event.time}</span>
                    <p className="text-xs font-medium text-foreground/80">{event.label}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-2 text-accent">
                <Zap className="w-4 h-4" />
                <h3 className="text-sm font-medium">Next Steps</h3>
              </div>
              <div className="space-y-2">
                {context.recommendations.map((rec: string, i: number) => (
                  <div key={i} className="flex items-center gap-3 group cursor-pointer p-2 rounded hover:bg-accent/5 transition-colors">
                    <ChevronRight className="w-3 h-3 text-border group-hover:text-accent transition-colors" />
                    <span className="text-xs text-muted group-hover:text-foreground transition-colors">{rec}</span>
                  </div>
                ))}
              </div>
            </section>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

// --- Main Page ---

const MOCK_WORKSPACE = {
  id: 'intro',
  category: 'SYNOPSIS',
  timestamp: '18:12:04',
  title: 'The Architecture of Learning',
  sections: [
    {
      type: 'prose',
      content: 'LearnOS is designed as a dynamic [[knowledge]] environment. Unlike linear tutorials, this workspace prioritizes [[structural]] understanding and [[multidimensional]] links between ideas.'
    },
    {
      type: 'insight',
      content: 'Cognitive load is currently at 12%. The optimal window for high-density neural integration is open. Suggesting exploration of [[Distributed_Systems]].'
    },
    {
      type: 'prose',
      content: 'Your current mastery graph shows a strong foundation in Logical Foundations, but a developing understanding of [[Network_Topology]]. Strengthening this link will unlock higher-order architectural patterns.'
    },
    {
      type: 'action',
      items: ['Synthesize Network Theory', 'Review Logic Primitives', 'Explore Semantic Graph']
    }
  ]
};

const MOCK_CONTEXT = {
  mastery: [
    { subject: 'Logical Foundations', value: 92 },
    { subject: 'Distributed Systems', value: 45 },
    { subject: 'Neural Sync', value: 78 }
  ],
  history: [
    { time: '18:05', label: 'Knowledge Handshake: Distributed Systems' },
    { time: '17:42', label: 'Semantic Optimization: Core Kernel' },
    { time: '16:30', label: 'Quiz Completed: Logic Primitives' }
  ],
  recommendations: [
    'Deep dive into Paxos consensus',
    'Revisit CAP theorem nuances',
    'Link Networking to Entropic Load'
  ]
};

export default function CognitiveIDE() {
  const [workspace, setWorkspace] = useState(MOCK_WORKSPACE);
  const [isContextOpen, setIsContextOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'i') {
        e.preventDefault();
        setIsContextOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleCommand = (cmd: string) => {
    // Simulated command handling
    console.log('Command received:', cmd);
    if (cmd.toLowerCase().includes('learn') || cmd.toLowerCase().includes('explain')) {
      window.location.href = `/learn?q=${encodeURIComponent(cmd)}`;
    }
  };

  return (
    <div className="min-h-screen bg-background selection:bg-accent/10 selection:text-accent font-sans">
      <CommandBar onCommand={handleCommand} />
      
      <main className="relative flex flex-col items-center">
        <div className="w-full max-w-4xl px-6 py-4 flex justify-end gap-6 text-[10px] font-bold uppercase tracking-widest text-muted">
          <a href="/learn" className="hover:text-accent transition-colors flex items-center gap-2">
            <BookOpen className="w-3 h-3" /> Start Learning
          </a>
          <button onClick={() => setIsContextOpen(true)} className="hover:text-accent transition-colors flex items-center gap-2">
            <Activity className="w-3 h-3" /> Context Inspector
          </button>
        </div>
        
        <CognitiveWorkspace content={workspace} />
        
        {/* Floating Toggle for Context (Mobile-friendly access) */}
        {!isContextOpen && (
          <motion.button 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => setIsContextOpen(true)}
            className="fixed bottom-8 right-8 p-4 bg-background border border-border rounded-full shadow-lg hover:border-accent hover:text-accent transition-all z-40 group"
          >
            <Activity className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </motion.button>
        )}
      </main>

      <ContextPanel 
        isOpen={isContextOpen} 
        onClose={() => setIsContextOpen(false)} 
        context={MOCK_CONTEXT} 
      />

      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none z-[-1] opacity-[0.03]" 
           style={{ backgroundImage: 'radial-gradient(circle, #000 1.5px, transparent 1.5px)', backgroundSize: '48px 48px' }} />
    </div>
  );
}
