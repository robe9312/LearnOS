'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, BookOpen, Sparkles, User, Activity, ChevronLeft, Layout, CheckCircle2 } from 'lucide-react';
import { useTutorAgent } from '@/lib/tutor-agent';
import { AIThoughtPanel } from '@/components/AIThoughtPanel';
import { Course, Module, UserProgress, ExecutionState } from '@/lib/types';
import { LearningExecutionEngine } from '@/lib/execution-engine';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Zap, Target, Brain, AlertCircle } from 'lucide-react';

export default function LearnExecutionPage() {
  const [course, setCourse] = useState<Course | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [executionState, setExecutionState] = useState<ExecutionState>('NOT_STARTED');
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [isRecompiling, setIsRecompiling] = useState(false);
  const router = useRouter();
  const params = useParams();
  
  const { messages, loading, error, sendMessage } = useTutorAgent({
    course: course || undefined,
    progress: progress
  });

  const handleRecompile = async () => {
    if (!course || !progress || progress.gapAreas.length === 0) return;
    
    setIsRecompiling(true);
    try {
      const { repairCoursePath } = await import('@/lib/course-generator');
      const updatedCourse = await repairCoursePath(course, progress.gapAreas);
      localStorage.setItem('current_course', JSON.stringify(updatedCourse));
      setCourse(updatedCourse);
      
      // Clear gaps after repair
      const updatedProgress = { ...progress, gapAreas: [] };
      LearningExecutionEngine.saveProgress(updatedProgress);
      setProgress(updatedProgress);
      
      setExecutionState(LearningExecutionEngine.getExecutionState(updatedCourse));
    } catch (err) {
      console.error(err);
    } finally {
      setIsRecompiling(false);
    }
  };
  
  const [input, setInput] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('current_course');
    if (saved) {
      const parsedCourse = JSON.parse(saved);
      setCourse(parsedCourse);
      
      // Load progress
      let currentProgress = LearningExecutionEngine.getProgress(parsedCourse.id);
      if (!currentProgress) {
        currentProgress = LearningExecutionEngine.initializeProgress(parsedCourse);
      }
      setProgress(currentProgress);
      setExecutionState(LearningExecutionEngine.getExecutionState(parsedCourse));
    } else {
      router.push('/');
    }
  }, [router]);

  const activeModule = useMemo(() => {
    if (!course) return null;
    return course.modules[activeModuleIndex];
  }, [course, activeModuleIndex]);

  const currentLesson = useMemo(() => {
    if (!activeModule || !progress) return null;
    return activeModule.lessons.find(l => l.id === progress.currentLessonId) || activeModule.lessons[0];
  }, [activeModule, progress]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(input);
      setInput('');
    }
  };

  if (!course) return null;

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-accent/10 selection:text-accent flex flex-col font-sans">
      {/* Header with Progress */}
      <header className="border-b border-border bg-background/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 group transition-opacity hover:opacity-80">
              <div className="w-8 h-8 bg-foreground rounded flex items-center justify-center">
                <span className="text-background font-black text-xs">L</span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] hidden sm:block">LearnOS</span>
            </Link>
            <div className="h-4 w-px bg-border" />
            <Link href={`/course/${course.id}`} className="flex items-center gap-2 text-muted hover:text-foreground transition-colors group">
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span className="text-[10px] uppercase font-bold tracking-widest hidden sm:block">Course Overview</span>
            </Link>
            <div className="w-px h-4 bg-border" />
            <div className="flex flex-col">
              <span className="text-[9px] uppercase font-bold text-accent tracking-widest">Active Course</span>
              <span className="text-sm font-medium truncate max-w-[150px]">{course.title}</span>
            </div>
          </div>

          <div className="flex-1 max-w-md mx-8 hidden lg:block">
            <div className="flex justify-between items-end mb-1.5">
              <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-widest">
                Execution State: <span className="text-accent">{executionState}</span>
              </span>
              <span className="text-[10px] font-mono text-accent">{progress?.masteryScore || 0}%</span>
            </div>
            <div className="h-1 bg-border rounded-full overflow-hidden">
              <div className="h-full bg-accent transition-all duration-1000" style={{ width: `${progress?.masteryScore || 0}%` }} />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-accent/10 rounded-full border border-accent/20">
              <Activity className="w-3 h-3 text-accent animate-pulse" />
              <span className="text-[10px] uppercase font-bold tracking-widest text-accent">Live Sync</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left: Navigator */}
        <aside className="w-80 border-r border-border p-8 hidden xl:flex flex-col gap-12 shrink-0">
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted">
                <Layout className="w-4 h-4" />
                <h2 className="text-[10px] uppercase tracking-[0.3em] font-bold">Course Navigator</h2>
              </div>
              <span className={cn(
                "px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest border",
                executionState === 'BLOCKED' ? "bg-red-500/10 text-red-500 border-red-500/20" :
                executionState === 'MASTERED' ? "bg-green-500/10 text-green-500 border-green-500/20" :
                "bg-accent/10 text-accent border-accent/20"
              )}>
                {executionState}
              </span>
            </div>
            <div className="space-y-3">
              {course.modules.map((mod, idx) => (
                <button 
                  key={mod.id}
                  onClick={() => setActiveModuleIndex(idx)}
                  className={cn(
                    "w-full text-left p-4 rounded-2xl border transition-all space-y-1 group",
                    idx === activeModuleIndex 
                      ? "bg-accent/5 border-accent/30 ring-1 ring-accent/30" 
                      : "border-transparent hover:bg-card hover:border-border"
                  )}
                >
                  <div className="flex justify-between items-center">
                    <span className={cn(
                      "text-[9px] font-mono uppercase tracking-widest font-bold",
                      idx === activeModuleIndex ? "text-accent" : "text-muted"
                    )}>
                      Module 0{idx + 1}
                    </span>
                    {idx < activeModuleIndex && <CheckCircle2 className="w-3 h-3 text-green-500" />}
                  </div>
                  <h3 className={cn(
                    "text-xs font-semibold leading-tight",
                    idx === activeModuleIndex ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {mod.title}
                  </h3>
                </button>
              ))}
            </div>
          </section>

          <section className="mt-auto space-y-4">
            {currentLesson?.pedagogical_reasoning && (
              <div className="p-6 bg-accent/5 border border-accent/20 rounded-2xl space-y-4">
                <div className="flex items-center gap-2 text-accent">
                  <Brain className="w-4 h-4" />
                  <h4 className="text-[10px] uppercase font-bold tracking-widest">Compiler Reasoning</h4>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed italic">
                  "{currentLesson.pedagogical_reasoning}"
                </p>
              </div>
            )}

            <div className="p-6 bg-card border border-border rounded-2xl space-y-4">
              <div className="flex items-center gap-2 text-muted">
                <Sparkles className="w-4 h-4" />
                <h4 className="text-[10px] uppercase font-bold tracking-widest">Module Difficulty</h4>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Cognitive Load</span>
                <span className="text-xs font-mono font-bold text-accent">{activeModule?.difficulty}/10</span>
              </div>
              <div className="h-1 bg-border rounded-full overflow-hidden">
                <div className="h-full bg-accent" style={{ width: `${(activeModule?.difficulty || 0) * 10}%` }} />
              </div>
            </div>
          </section>
        </aside>

        {/* Center: Conversation */}
        <main className="flex-1 flex flex-col relative">
          <div className="flex-1 overflow-y-auto px-6 pt-12 pb-48 custom-scrollbar">
            <div className="max-w-3xl mx-auto space-y-16">
              {messages.length === 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8 py-12"
                >
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase text-accent tracking-[0.3em]">Session Initialization</span>
                    <h1 className="text-3xl font-medium tracking-tight">Welcome to Module 0{activeModuleIndex + 1}: {activeModule?.title}</h1>
                  </div>
                  <p className="text-prose text-muted-foreground">
                    I am your cognitive guide for this session. We will start by exploring the foundational concepts of this module. Ask me anything or just say "Start Lesson" to begin.
                  </p>

                  {progress && progress.gapAreas.length > 0 && (
                    <div className="p-6 border border-red-500/20 bg-red-500/5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="flex items-center gap-4">
                        <AlertCircle className="w-6 h-6 text-red-500 shrink-0" />
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-widest text-foreground">Cognitive Gaps Detected</h4>
                          <p className="text-[11px] text-muted-foreground mt-1">Gaps found in: {progress.gapAreas.join(', ')}. The compiler suggests a repair.</p>
                        </div>
                      </div>
                      <button 
                        onClick={handleRecompile}
                        disabled={isRecompiling}
                        className="px-6 py-2 bg-red-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-2 whitespace-nowrap"
                      >
                        {isRecompiling ? (
                          <Activity className="w-3 h-3 animate-pulse" />
                        ) : (
                          <Zap className="w-3 h-3" />
                        )}
                        {isRecompiling ? 'Repairing...' : 'Repair Cognitive Path'}
                      </button>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3">
                    {['Explain the core idea', 'What are the prerequisites?', 'Start Lesson'].map((s) => (
                      <button 
                        key={s}
                        onClick={() => sendMessage(s)}
                        className="px-4 py-2 border border-border rounded-xl text-xs font-medium hover:border-accent hover:text-accent transition-all"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {messages.map((message, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="flex items-start gap-8">
                    <div className={cn(
                      "w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 mt-1 shadow-sm",
                      message.role === 'user' ? "border-border bg-card" : "border-accent/20 bg-accent/5"
                    )}>
                      {message.role === 'user' ? <User className="w-5 h-5 text-muted" /> : <Sparkles className="w-5 h-5 text-accent" />}
                    </div>
                    <div className="flex-1 space-y-4 min-w-0">
                      <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted">
                        {message.role === 'user' ? 'Inquiry' : `Guide • Module 0${activeModuleIndex + 1}`}
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
                <div className="flex items-center gap-4 text-muted px-12 animate-pulse overflow-hidden">
                  <div className="w-px h-8 bg-accent/30 animate-grow-y" />
                  <span className="text-[10px] uppercase font-bold tracking-[0.2em]">Processing Semantic Vectors...</span>
                </div>
              )}
            </div>
          </div>

          {/* Input Area */}
          <footer className="absolute bottom-0 left-0 right-0 p-8 pt-20 bg-gradient-to-t from-background via-background/95 to-transparent">
            <div className="max-w-2xl mx-auto relative">
              <form 
                onSubmit={handleSubmit}
                className="relative bg-card border border-border rounded-2xl shadow-2xl focus-within:border-accent transition-all pl-6 pr-4 py-4"
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
                  placeholder="Ask your tutor about this module..."
                  className="w-full bg-transparent border-none outline-none resize-none h-12 text-lg py-2 placeholder:text-muted/30"
                />
                <div className="flex items-center justify-between mt-2">
                  <div className="flex gap-2">
                    <kbd className="text-[9px] bg-muted/10 border border-border px-1.5 py-0.5 rounded text-muted font-mono">Shift + Enter for new line</kbd>
                  </div>
                  <button 
                    type="submit"
                    disabled={loading || !input.trim()}
                    className="p-2 rounded-xl bg-accent text-white disabled:opacity-50 hover:bg-accent/90 transition-all"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </div>
          </footer>
        </main>
      </div>

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
