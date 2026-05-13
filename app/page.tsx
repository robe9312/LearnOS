'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Target, 
  BookOpen, 
  Zap, 
  Map as MapIcon, 
  ChevronRight, 
  Search, 
  MessageSquare, 
  BarChart2, 
  Settings, 
  Brain,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { CURRICULUM_PROMPT } from '@/lib/ai/tutor';

// --- Mock Data ---
const ACTIVE_PATH = {
  name: "Fullstack Next.js",
  progress: 68,
  nextModule: "Server Actions & Hydration",
  modules: [
    { id: '1', title: "Routing & Layouts", status: 'completed' },
    { id: '2', title: "Client vs Server Components", status: 'completed' },
    { id: '3', title: "Data Fetching Patterns", status: 'current' },
    { id: '4', title: "Authentication with NextAuth", status: 'locked' },
  ]
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showChat, setShowChat] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPath, setGeneratedPath] = useState<any>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsGenerating(true);
    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("Gemini API key is missing. Please set NEXT_PUBLIC_GEMINI_API_KEY in settings.");
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.0-flash",
        generationConfig: { responseMimeType: "application/json" }
      });

      const prompt = CURRICULUM_PROMPT
        .replace("{topic}", topic)
        .replace("{level}", 'principiante')
        .replace("{goal}", 'General mastery');

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const responseText = response.text();
      const data = JSON.parse(responseText);
      
      setGeneratedPath(data);
      setTopic('');
    } catch (err: any) {
      console.error(err);
      alert(err?.message || "Failed to generate curriculum");
    } finally {
      setIsGenerating(false);
    }
  };

  const displayPath = generatedPath || ACTIVE_PATH;

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans">
      {/* Top Navigation Bar */}
      <nav className="h-16 border-b border-white/10 flex items-center justify-between px-4 md:px-8 shrink-0 glass z-50">
        <div className="flex items-center gap-3">
          {isMobile && (
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}
          <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center">
            <Brain className="text-white" size={18} />
          </div>
          <span className="text-lg md:text-xl font-bold tracking-tight text-white uppercase">
            Learn <span className="font-light opacity-60">OS</span>
          </span>
        </div>
        
        <div className="flex items-center gap-2 md:gap-6">
          <div className="flex items-center gap-2 px-2 md:px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-[9px] md:text-[10px] font-medium text-emerald-400 font-mono tracking-wider">ACTIVE</span>
          </div>
          {!isMobile && (
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-[10px] font-bold">
              AU
            </div>
          )}
        </div>
      </nav>

      <main className="flex-1 flex overflow-hidden relative">
        
        {/* Sidebar Left */}
        <AnimatePresence>
          {(isSidebarOpen || !isMobile) && (
            <motion.aside 
              initial={isMobile ? { x: -256 } : false}
              animate={{ x: 0 }}
              exit={{ x: -256 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={cn(
                "w-64 border-r border-white/5 p-6 flex flex-col gap-8 shrink-0 bg-slate-950/50 z-40",
                isMobile && "fixed inset-y-0 left-0 top-16 shadow-2xl bg-slate-950"
              )}
            >
              <div>
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Current Path</h3>
                <ul className="space-y-1">
                  <SidebarLink icon={<Target size={14} />} label={displayPath.name || displayPath.topic} active={activeTab === 'overview'} onClick={() => { setActiveTab('overview'); if (isMobile) setIsSidebarOpen(false); }} />
                  <SidebarLink icon={<MapIcon size={14} />} label="Skill Graph" active={activeTab === 'graph'} onClick={() => { setActiveTab('graph'); if (isMobile) setIsSidebarOpen(false); }} />
                  <SidebarLink icon={<BookOpen size={14} />} label="Library" active={activeTab === 'library'} onClick={() => { setActiveTab('library'); if (isMobile) setIsSidebarOpen(false); }} />
                  <SidebarLink icon={<BarChart2 size={14} />} label="Analytics" active={activeTab === 'analytics'} onClick={() => { setActiveTab('analytics'); if (isMobile) setIsSidebarOpen(false); }} />
                </ul>
              </div>

              <div>
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">System Health</h3>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-mono text-slate-500 uppercase">
                      <span>Skill Mastery</span>
                      <span>68%</span>
                    </div>
                    <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: '68%' }} className="h-full bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.5)]" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-auto">
                <div className="p-4 rounded-xl bg-slate-900 border border-white/5 space-y-2">
                  <p className="text-[10px] text-slate-400 leading-relaxed uppercase tracking-tighter">
                    Routing: <span className="text-sky-400 font-bold">S1</span>
                  </p>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Backdrop for mobile */}
        {isMobile && isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 top-16"
          />
        )}

        {/* Center Pane */}
        <section className="flex-1 relative grid-bg overflow-hidden flex flex-col p-4 md:p-8">
          <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
            <div className="min-w-0 flex-1">
              <h1 className="text-xl md:text-2xl font-semibold text-white tracking-tight font-display mb-1 truncate">
                {displayPath.name || displayPath.topic}
              </h1>
              <p className="text-slate-500 text-xs md:text-sm truncate">
                Frontier: <span className="text-sky-400 opacity-80">{displayPath.nextModule || "Structured by AI"}</span>
              </p>
            </div>
            <form onSubmit={handleGenerate} className="flex items-center gap-2 md:gap-3 bg-slate-900 border border-white/10 p-1 rounded-full px-3 md:px-4 focus-within:border-sky-500/50 transition-all w-full lg:max-w-xs">
              <Search className="text-slate-500 shrink-0" size={14} />
              <input 
                type="text" 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="¿Qué quieres aprender?" 
                className="bg-transparent border-none outline-none text-xs flex-1 min-w-0 py-1.5 md:py-2"
                disabled={isGenerating}
              />
              <button 
                type="submit"
                disabled={isGenerating}
                className="bg-sky-500 text-white rounded-full p-1.5 hover:bg-sky-400 disabled:opacity-50 transition-all shrink-0"
              >
                {isGenerating ? <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <ChevronRight size={14} />}
              </button>
            </form>
          </header>

          <div className="flex-1 flex flex-col gap-6 overflow-y-auto pb-24 lg:pb-0">
            <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-4 md:p-6 relative overflow-hidden backdrop-blur-sm shrink-0">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-sky-500/20 text-sky-400 text-[8px] md:text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded italic">
                    {isGenerating ? "Generando..." : "Misión Activa"}
                  </div>
                  <span className="text-slate-500 text-[10px] flex items-center gap-1 font-mono">
                    <Zap size={10} className="text-sky-400" /> +250 XP
                  </span>
                </div>
                <h2 className="text-lg md:text-xl font-bold mb-4 text-white uppercase tracking-tight line-clamp-1">
                  {displayPath.name || displayPath.topic}
                </h2>
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${displayPath.progress || 0}%` }} className="h-full bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.3)]" />
                  </div>
                  <span className="text-[9px] md:text-[10px] font-mono text-slate-500 uppercase shrink-0">{displayPath.progress || 0}%</span>
                </div>
                <button className="mt-6 w-full md:w-auto bg-sky-500 hover:bg-sky-400 text-white font-bold py-2.5 px-6 rounded-lg text-xs uppercase tracking-widest transition-all shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2">
                  Jump In <ChevronRight size={14} />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {(displayPath.modules || []).map((m: any) => (
                <ModuleCard key={m.id || m.week} title={m.title} status={m.status || 'current'} />
              ))}
            </div>
          </div>

          <div className="absolute bottom-6 right-6 hidden md:flex gap-2">
            <button className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-md text-[9px] uppercase font-bold tracking-widest hover:bg-white/10 transition-colors">Recenter</button>
            <button className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-md text-[9px] uppercase font-bold tracking-widest hover:bg-white/10 transition-colors">Auto-Layout</button>
          </div>
        </section>

        {/* Right Pane (Tutor Chat Drawer for Mobile) */}
        <AnimatePresence>
          {(showChat || !isMobile) && (
            <motion.aside 
              initial={isMobile ? { y: '100%' } : false}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={cn(
                "w-80 glass shrink-0 flex flex-col z-50",
                isMobile && "fixed inset-x-0 bottom-0 h-[80vh] w-full rounded-t-3xl shadow-[0_-8px_24px_rgba(0,0,0,0.5)] border-t border-white/10"
              )}
            >
              <div className="p-4 md:p-6 border-b border-white/10 flex justify-between items-center bg-slate-900/50">
                <div className="flex items-center gap-3">
                  {isMobile && (
                    <button onClick={() => setShowChat(false)} className="p-1 -ml-1 text-slate-400">
                      <X size={18} />
                    </button>
                  )}
                  <div>
                    <h3 className="font-bold text-white text-xs md:text-sm uppercase tracking-tight">Tutor Agent</h3>
                    {!isMobile && <p className="text-[9px] text-slate-500 font-mono tracking-tighter">OPENCLAW v2.1.4</p>}
                  </div>
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
              </div>

              <div className="flex-1 p-4 md:p-6 space-y-6 overflow-y-auto">
                <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <div className="text-[9px] uppercase font-bold text-slate-500 flex items-center gap-2">
                      <span className="w-1 h-3 bg-sky-500 rounded-full"></span> System Analysis
                    </div>
                    <div className="bg-slate-800/60 p-3 rounded-lg rounded-tl-none border border-white/5 text-[11px] leading-relaxed text-slate-300 backdrop-blur-sm">
                      I&apos;ve detected a conceptual mismatch while you were implementing the <span className="text-sky-400">Art Of Learning</span>. 
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-900/80 border-t border-white/10 pb-8 md:pb-4">
                <div className="relative group">
                  <textarea 
                    className="w-full bg-slate-800/50 border border-white/10 rounded-lg p-3 text-xs focus:outline-none focus:border-sky-500/50 resize-none h-20 md:h-24 placeholder-slate-600 transition-all font-mono"
                    placeholder="Ask your tutor..."
                  ></textarea>
                  <button className="absolute bottom-3 right-3 p-1.5 rounded bg-sky-500 text-white shadow-lg shadow-sky-500/20 transition-all active:scale-95">
                    <ChevronRight size={14} />
                  </button>
                </div>
                <div className="mt-3 flex justify-between px-1 text-[8px] text-slate-600 uppercase font-mono tracking-tighter">
                  <span>{isMobile ? "Tap corner to send" : "Cmd + Enter to Send"}</span>
                  <span className="italic">Socratic</span>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Mobile Floating Trigger for Chat */}
        {isMobile && !showChat && (
          <button 
            onClick={() => setShowChat(true)}
            className="fixed bottom-6 right-6 w-14 h-14 bg-sky-500 text-white rounded-full flex items-center justify-center shadow-xl shadow-sky-500/40 z-[45] animate-in zoom-in duration-300"
          >
            <MessageSquare size={24} />
          </button>
        )}
      </main>

      {/* Interface Footer */}
      <footer className="h-8 md:h-10 bg-slate-900 border-t border-white/5 px-4 md:px-6 flex items-center justify-between shrink-0 font-mono text-[8px] md:text-[9px] text-slate-500 uppercase tracking-widest">
        <div className="flex gap-4 md:gap-6">
          <span>DB: <span className="text-slate-300">Neon</span></span>
          <span className="hidden sm:inline">Engine: <span className="text-slate-300">OpenFang</span></span>
        </div>
        <div className="flex gap-4 items-center">
          <span className="flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-emerald-500"></span> 42ms</span>
          <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-400">Stable</span>
        </div>
      </footer>
    </div>
  );
}

function SidebarLink({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-left",
        active 
          ? "bg-sky-500/10 text-sky-400 border border-sky-500/20 shadow-[0_0_12px_rgba(14,165,233,0.1)]" 
          : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
      )}
    >
      <span className={cn(active ? "text-sky-400" : "text-slate-600")}>{icon}</span>
      <span className="font-bold text-[11px] uppercase tracking-wider truncate">{label}</span>
      {active && <div className="ml-auto w-1 h-1 bg-sky-500 rounded-full shrink-0"></div>}
    </button>
  );
}

function ModuleCard({ title, status }: { title: string, status: string }) {
  const isCompleted = status === 'completed';
  const isCurrent = status === 'current';
  const isLocked = status === 'locked';

  return (
    <div className={cn(
      "p-4 rounded-xl border transition-all flex items-center justify-between group min-w-0",
      isCompleted && "bg-emerald-500/5 border-emerald-500/20 opacity-80",
      isCurrent && "bg-slate-900 border-sky-500/50 node-active",
      isLocked && "bg-slate-950 border-white/5 opacity-40 grayscale"
    )}>
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center border shrink-0",
          isCompleted ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : "bg-slate-800 border-white/5 text-slate-600",
          isCurrent && "bg-sky-500 text-white shadow-lg shadow-sky-500/20 border-sky-400"
        )}>
          {isCompleted ? <Zap size={14} /> : (isLocked ? <Settings size={14} /> : <BookOpen size={14} />)}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-[11px] font-bold text-white uppercase tracking-tight truncate">{title}</span>
          {isCurrent && <span className="text-[8px] text-sky-400 font-mono uppercase tracking-widest truncate">In Progress</span>}
        </div>
      </div>
      {isCompleted && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] ml-2 shrink-0"></div>}
    </div>
  );
}
