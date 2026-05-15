'use client';

import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface SemanticPulseProps {
  color?: 'cyan' | 'violet' | 'emerald';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function SemanticPulse({ color = 'cyan', size = 'md', className }: SemanticPulseProps) {
  const colorMap = {
    cyan: 'bg-brand-cyan',
    violet: 'bg-brand-violet',
    emerald: 'bg-emerald-500'
  };

  const glowMap = {
    cyan: 'shadow-[0_0_15px_#00f2ff]',
    violet: 'shadow-[0_0_15px_#8b5cf6]',
    emerald: 'shadow-[0_0_15px_#10b981]'
  };

  const sizeMap = {
    sm: 'w-2 h-2',
    md: 'w-4 h-4',
    lg: 'w-8 h-8'
  };

  return (
    <div className={cn("relative flex items-center justify-center", sizeMap[size], className)}>
      <motion.div
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.8, 0, 0.8],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className={cn("absolute inset-0 rounded-full border border-current", 
          color === 'cyan' ? 'text-brand-cyan' : color === 'violet' ? 'text-brand-violet' : 'text-emerald-500'
        )}
      />
      <div className={cn("rounded-full z-10", sizeMap[size], colorMap[color], glowMap[color])} />
    </div>
  );
}
