'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';
import { 
  Cpu, 
  Network, 
  BookOpen, 
  History, 
  Terminal, 
  Compass,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', icon: Cpu, label: 'Cognitive Home' },
  { href: '/explore', icon: Network, label: 'Knowledge Graph' },
  { href: '/journey', icon: Compass, label: 'Narrative Arc' },
  { href: '/timeline', icon: History, label: 'Cognitive Timeline' },
  { href: '/system', icon: Terminal, label: 'Runtime Inspector' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-16 md:w-64 glass-panel border-r border-white/10 h-full flex flex-col transition-all duration-300">
      <div className="p-6 flex items-center gap-3">
        <Activity className="w-8 h-8 text-brand-cyan glow-text-cyan animate-pulse" />
        <span className="hidden md:block font-bold text-xl tracking-tighter glow-text-cyan">
          LearnOS
        </span>
      </div>

      <nav className="flex-1 px-3 space-y-2 mt-4">
        {navItems.map((item) => {
          const Active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-lg transition-all relative group",
                Active ? "bg-brand-cyan/10 text-brand-cyan" : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              )}>
                {Active && (
                  <motion.div 
                    layoutId="tab-underline"
                    className="absolute left-0 w-1 h-6 bg-brand-cyan rounded-r-full"
                  />
                )}
                <item.icon className={cn("w-5 h-5", Active && "glow-text-cyan")} />
                <span className="hidden md:block text-sm font-medium">{item.label}</span>
                
                {/* Tooltip for collapsed mode */}
                <div className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none md:hidden z-50 whitespace-nowrap">
                  {item.label}
                </div>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        <div className="hidden md:block glass-panel p-3 rounded-lg bg-slate-900/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase tracking-widest text-slate-500">System Load</span>
            <span className="text-[10px] text-brand-cyan">0.82 CF</span>
          </div>
          <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '45%' }}
              className="h-full bg-brand-cyan shadow-[0_0_10px_#00f2ff]"
            />
          </div>
        </div>
      </div>
    </aside>
  );
}
