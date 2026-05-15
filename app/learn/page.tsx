'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Send, BookOpen, Sparkles, User, Activity, ChevronLeft } from 'lucide-react';
import { useTutorAgent } from '@/lib/tutor-agent';
import { AIThoughtPanel } from '@/components/AIThoughtPanel';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';

export default function LearnPage() {
  const { messages, loading, error, sendMessage } = useTutorAgent();
  const [input, setInput] = useState('');
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && !hasInitialized) {
      const searchParams = new URLSearchParams(window.location.search);
      const query = searchParams.get('q');
      if (query) {
        sendMessage(query);
      }
      setHasInitialized(true);
    }
  }, [hasInitialized, sendMessage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-accent/10 selection:text-accent flex flex-col font-sans">
      <header className="border-b border-border bg-background/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-muted hover:text-foreground transition-colors">
              <ChevronLeft className="w-4 h-4" />
              <span className="text-xs font-bold tracking-widest uppercase">Workspace</span>
            </Link>
            <div className="w-px h-4 bg-border" />
            <div className="flex items-center gap-2 text-accent">
              <BookOpen className="w-4 h-4" />
              <span className="text-sm font-medium tracking-tight">Cognitive Tutor</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-muted">
              <Activity className="w-3 h-3 text-accent" />
              <span>Syncing Neural Paths</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full flex flex-col pt-12 pb-48 px-6 overflow-y-auto custom-scrollbar">
        {messages.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col items-center justify-center text-center space-y-8 py-20"
          >
            <div className="w-16 h-16 rounded-2xl bg-accent/5 border border-accent/20 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-accent" />
            </div>
            <div className="space-y-4 max-w-md">
              <h1 className="text-3xl font-medium tracking-tight">Neural Input Requested</h1>
              <p className="text-muted leading-relaxed">
                Provide a concept, a question, or a learning objective to begin synthesis.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg">
              <SuggestionCard onClick={() => sendMessage("Explain closures in JavaScript visually")} label="Visual Closures" />
              <SuggestionCard onClick={() => sendMessage("Why is Paxos more robust than Two-Phase Commit?")} label="Paxos vs 2PC" />
            </div>
          </motion.div>
        )}

        <div className="space-y-20">
          {messages.map((message, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-start gap-8">
                <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center shrink-0 mt-1">
                  {message.role === 'user' ? <User className="w-5 h-5 text-muted" /> : <Sparkles className="w-5 h-5 text-accent" />}
                </div>
                <div className="flex-1 space-y-4 min-w-0">
                  <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted">
                    {message.role === 'user' ? 'INTEGRATION REQUEST' : 'COG-TUTOR RESPONSE'}
                  </div>
                  <div className="text-prose prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-card prose-pre:border prose-pre:border-border">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                </div>
              </div>
              {message.thought && <AIThoughtPanel thought={message.thought} />}
            </motion.div>
          ))}
          {loading && (
            <div className="flex items-center gap-4 text-muted animate-pulse px-20">
              <Activity className="w-4 h-4 animate-spin-slow" />
              <span className="text-[10px] uppercase font-bold tracking-widest">Synthesizing...</span>
            </div>
          )}
          {error && (
            <div className="mx-20 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-xs font-mono">
              [SYSTEM_ERROR] {error}
            </div>
          )}
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background/95 to-transparent pb-10 pt-20">
        <div className="max-w-2xl mx-auto px-6">
          <form 
            onSubmit={handleSubmit}
            className="relative bg-card border border-border rounded-2xl shadow-xl focus-within:border-accent transition-all pl-6 pr-4 py-4"
          >
            <textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="What should we integrate into your model?"
              className="w-full bg-transparent border-none outline-none resize-none h-12 text-lg py-2 placeholder:text-muted/50"
            />
            <div className="flex items-center justify-between mt-2">
              <div className="flex gap-2">
                <kbd className="text-[9px] bg-muted/10 border border-border px-1.5 py-0.5 rounded text-muted font-mono">Enter to Send</kbd>
              </div>
              <button 
                type="submit"
                disabled={loading || !input.trim()}
                className="p-2 rounded-xl bg-accent text-white disabled:opacity-50 disabled:grayscale hover:bg-accent/90 transition-all shadow-lg shadow-accent/20"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      </footer>
      
      <div className="fixed inset-0 pointer-events-none z-[-1] opacity-[0.03]" 
           style={{ backgroundImage: 'radial-gradient(circle, #000 1.5px, transparent 1.5px)', backgroundSize: '48px 48px' }} />
    </div>
  );
}

function SuggestionCard({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="p-4 border border-border rounded-xl text-sm font-medium hover:border-accent hover:bg-accent/5 transition-all text-left"
    >
      {label}
    </button>
  );
}
