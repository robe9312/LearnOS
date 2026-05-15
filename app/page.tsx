'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, Zap, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { generateCourse } from '@/lib/course-generator';
import { cn } from '@/lib/utils';

export default function Home() {
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();

  const handleGenerate = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!topic.trim() || isGenerating) return;

    setIsGenerating(true);
    try {
      const course = await generateCourse(topic);
      // In a real app we would persist this, for now we pass it via state or session
      localStorage.setItem('current_course', JSON.stringify(course));
      router.push(`/course/${course.id}`);
    } catch (error) {
      console.error(error);
      setIsGenerating(false);
    }
  };

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-xl space-y-12 relative z-10">
        <header className="space-y-4 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] uppercase font-bold tracking-[0.2em]"
          >
            <Zap className="w-3 h-3" />
            <span>Autonomous Learning OS</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl font-medium tracking-tight leading-[1.1]"
          >
            Master any subject<br />in minutes.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground font-light max-w-md mx-auto"
          >
            Enter a topic. LearnOS assembles a custom curriculum, interactive lessons, and cognitive maps instantly.
          </motion.p>
        </header>

        <motion.form 
          onSubmit={handleGenerate}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="relative group"
        >
          <div className={cn(
            "relative flex items-center bg-card border-2 transition-all duration-500 rounded-2xl overflow-hidden shadow-2xl shadow-accent/5",
            isGenerating ? "border-accent/40 ring-4 ring-accent/5" : "border-border group-focus-within:border-accent/40"
          )}>
            <input 
              autoFocus
              className="w-full bg-transparent border-none outline-none text-xl font-medium placeholder:text-muted/40 py-6 pl-8 pr-32"
              placeholder="What do you want to learn?"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              disabled={isGenerating}
            />
            <div className="absolute right-3 flex items-center gap-2">
              <button 
                type="submit"
                disabled={!topic.trim() || isGenerating}
                className="flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-accent/90 disabled:opacity-50 disabled:grayscale transition-all shadow-lg shadow-accent/20"
              >
                {isGenerating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Generate</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
          
          <AnimatePresence>
            {isGenerating && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute -bottom-12 left-0 right-0 text-center"
              >
                <div className="flex items-center justify-center gap-2 text-accent">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                  <span className="text-[10px] uppercase font-bold tracking-widest">Synthesizing Neural Curriculum...</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.form>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap justify-center gap-3"
        >
          <span className="text-[10px] uppercase font-bold text-muted w-full text-center mb-1 tracking-widest">Suggested Paths</span>
          {['Quantum Computing', 'Behavioral Economics', 'Neural Networks', 'Roman History'].map((s) => (
            <button 
              key={s}
              onClick={() => { setTopic(s); handleGenerate(); }}
              className="px-4 py-1.5 rounded-full border border-border text-xs text-muted-foreground hover:border-accent hover:text-accent transition-all hover:bg-accent/5"
            >
              {s}
            </button>
          ))}
        </motion.div>
      </div>

      <footer className="absolute bottom-10 left-0 right-0 text-center">
        <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted/40">Powered by LearnOS Cognitive Engine</p>
      </footer>
    </main>
  );
}
