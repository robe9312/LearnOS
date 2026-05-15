'use client';

import { motion } from 'motion/react';
import { Send, ChevronLeft, Sparkles, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, use } from 'react';

const initialMessages = [
  {
    role: 'system',
    content: 'Module: QUANTUM_COMPUTING Status: ACTIVE Objectives: Understand qubits and superposition.'
  },
  {
    role: 'assistant',
    content: "We're beginning your exploration of Quantum Computing. At its most fundamental level, we are moving away from the binary certainty of bits into the probabilistic richness of qubits.\n\nHow would you like to start? We can analyze the physical implementation of a qubit, or dive straight into the mathematical concept of Superposition."
  }
];

export default function LearnChat({ params }: { params: Promise<{ nodeId: string }> }) {
  const { nodeId } = use(params);
  const [messages, setMessages] = useState(initialMessages);

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-3.5rem)] flex flex-col pt-12">
      <header className="px-6 pb-8 border-b border-border flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-accent">
            <BookOpen className="w-4 h-4" />
            <span className="text-[10px] uppercase tracking-widest font-bold">Module Explorer</span>
          </div>
          <h1 className="text-3xl font-medium tracking-tight">Quantum Foundations</h1>
        </div>
        <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted hover:text-foreground transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back to Graph
        </button>
      </header>

      <main className="flex-1 overflow-y-auto px-6 py-12 space-y-12 custom-scrollbar">
        {messages.map((msg, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "flex gap-8",
              msg.role === 'system' ? "bg-card p-4 border border-border rounded-md italic" : ""
            )}
          >
            <div className="w-12 shrink-0 pt-1">
              {msg.role === 'assistant' ? (
                <div className="w-8 h-8 rounded-full border border-accent/20 flex items-center justify-center text-accent">
                  <Sparkles className="w-4 h-4" />
                </div>
              ) : msg.role === 'system' ? (
                <span className="text-[10px] font-mono font-bold text-muted uppercase">SYS</span>
              ) : (
                <div className="w-8 h-8 rounded-full bg-border flex items-center justify-center text-muted font-bold text-[10px]">
                  YOU
                </div>
              )}
            </div>
            
            <div className="flex-1 space-y-4">
              <div className="text-lg leading-relaxed whitespace-pre-wrap text-foreground/90 font-light">
                {msg.content}
              </div>
              {msg.role === 'assistant' && i === messages.length - 1 && (
                <div className="flex flex-wrap gap-3 pt-4">
                  <Chip label="Define Superposition" />
                  <Chip label="Architecture of Qubits" />
                  <Chip label="Historical Context" />
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </main>

      <footer className="p-8 pb-12">
        <div className="relative max-w-2xl mx-auto">
          <textarea 
            placeholder="Type your cognitive synthesis..."
            className="w-full bg-card border border-border rounded-xl p-4 pr-12 text-base leading-relaxed focus:outline-none focus:border-accent min-h-[100px] resize-none transition-all placeholder:text-muted"
          ></textarea>
          <button className="absolute bottom-4 right-4 p-2 text-accent hover:text-accent-foreground transition-colors">
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-center mt-4 text-[10px] text-muted font-mono uppercase tracking-widest">
          Continuous Interaction Active • Low Latency Mode
        </p>
      </footer>
    </div>
  );
}

function Chip({ label }: { label: string }) {
  return (
    <button className="px-3 py-1.5 border border-border rounded-full text-xs font-medium text-muted hover:border-accent hover:text-accent transition-all">
      {label}
    </button>
  );
}
