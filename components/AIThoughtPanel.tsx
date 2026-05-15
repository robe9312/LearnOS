'use client';

import { motion, AnimatePresence } from 'motion/react';
import { Brain, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export function AIThoughtPanel({ thought }: { thought?: string }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!thought) return null;

  return (
    <div className="w-full max-w-2xl mx-auto mt-4 px-6 border-l-2 border-accent/20">
      <div className={cn(
        "bg-card/30 transition-all overflow-hidden",
        isExpanded ? "p-4" : "p-2"
      )}>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full text-[10px] uppercase tracking-widest font-bold text-muted hover:text-accent transition-colors"
        >
          <div className="flex items-center gap-2">
            <Brain className="w-3 h-3" />
            <span>Trace Cognitive Reasoning</span>
          </div>
          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
        
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-3 text-xs leading-relaxed text-muted-foreground font-mono whitespace-pre-wrap border-t border-border pt-3"
            >
              {thought}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
