
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  BookOpen, 
  ChevronRight, 
  Clock, 
  BarChart3, 
  Zap, 
  Network,
  Play,
  ArrowLeft
} from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { Course } from '@/lib/types';
import Link from 'next/link';

export default function CourseOverview() {
  const [course, setCourse] = useState<Course | null>(null);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const saved = localStorage.getItem('current_course');
    if (saved) {
      setCourse(JSON.parse(saved));
    } else {
      router.push('/');
    }
  }, [router]);

  if (!course) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <header className="border-b border-border bg-background/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-6 group">
            <div className="flex items-center gap-2 group-hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center">
                <span className="text-background font-black text-xs">L</span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] hidden sm:block">LearnOS</span>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.push('/')}
              className="group flex items-center gap-2 text-[10px] uppercase font-bold tracking-[0.2em] text-muted hover:text-foreground transition-colors border border-border px-4 py-1.5 rounded-full hover:bg-muted/10 font-mono"
            >
              <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to Home</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-12 p-12">
        {/* Left: Curriculum */}
        <div className="lg:col-span-2 space-y-12">
          <header className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 rounded bg-accent/10 text-accent text-[9px] font-bold uppercase tracking-widest border border-accent/20">
                {course.difficulty_model} Engine
              </span>
              <div className="flex items-center gap-1.5 text-muted text-[10px] uppercase font-bold tracking-widest">
                <Clock className="w-3 h-3" />
                <span>{course.estimated_duration}h Est.</span>
              </div>
            </div>
            <h1 className="text-5xl font-medium tracking-tight leading-[1.1]">{course.title}</h1>
            <p className="text-xl text-muted-foreground font-light leading-relaxed">{course.description}</p>
          </header>

          <section className="space-y-8">
            <h2 className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted border-b border-border pb-2">Structured Curriculum</h2>
            <div className="space-y-4">
              {course.modules.map((module, i) => (
                <motion.div 
                  key={module.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 bg-card border border-border rounded-2xl hover:border-accent/40 transition-all group cursor-default"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-accent">MODULE 0{i + 1}</span>
                      <h3 className="text-lg font-medium tracking-tight">{module.title}</h3>
                    </div>
                    <span className="text-[10px] font-mono text-muted">{module.lessons.length} LESSONS • LOAD: {module.difficulty}/10</span>
                  </div>
                  <div className="space-y-2">
                    {module.lessons.map((lesson) => (
                      <div key={lesson.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/5 transition-colors group/item">
                        <div className="w-1.5 h-1.5 rounded-full bg-border group-hover/item:bg-accent transition-colors" />
                        <div className="flex items-center justify-between flex-1">
                          <span className="text-xs text-muted-foreground group-hover/item:text-foreground transition-colors">{lesson.title}</span>
                          <span className="text-[9px] font-bold uppercase tracking-widest text-muted/50">{lesson.type}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </div>

        {/* Right: Meta & Launch */}
        <aside className="space-y-12">
          <div className="sticky top-28 space-y-12">
            <section className="p-8 bg-accent text-white rounded-3xl shadow-2xl shadow-accent/20 space-y-6">
              <div className="space-y-2">
                <h3 className="text-2xl font-medium tracking-tight">Ready?</h3>
                <p className="text-sm text-white/80 leading-relaxed">Your cognitive path is mapped. The tutor is initialized with this curriculum.</p>
              </div>
              <button 
                onClick={() => router.push(`/learn/${course.id}`)}
                className="w-full py-4 bg-white text-accent rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Begin Learning</span>
              </button>
            </section>

            <section className="space-y-6">
              <h2 className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted px-2">Cognitive Stats</h2>
              <div className="grid grid-cols-2 gap-4">
                <StatCard icon={<Network className="w-4 h-4" />} label="Exec Modules" value={course.modules.length.toString()} />
                <StatCard icon={<BarChart3 className="w-4 h-4" />} label="Strategy" value={course.assessment_strategy.type} />
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted px-2">Dependency Graph</h2>
              <div className="space-y-3">
                {course.dependency_graph.map((edge, i) => (
                  <div key={i} className="flex items-center gap-3 px-4 py-2 border border-border bg-card rounded-xl">
                    <span className="text-[10px] font-mono text-accent">{edge.from}</span>
                    <ChevronRight className="w-3 h-3 text-muted" />
                    <span className="text-[10px] font-mono text-foreground">{edge.to}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </aside>
      </main>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="p-4 border border-border rounded-2xl space-y-2 bg-card/50">
      <div className="text-accent">{icon}</div>
      <div>
        <div className="text-[9px] uppercase font-bold tracking-widest text-muted">{label}</div>
        <div className="text-lg font-medium">{value}</div>
      </div>
    </div>
  );
}
