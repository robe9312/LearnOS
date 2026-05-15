'use client';

import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  animate?: boolean;
  id?: string;
}

export function GlassPanel({ children, className, glow, animate = true, id }: GlassPanelProps) {
  const Component = animate ? motion.div : 'div';
  
  return (
    <Component
      id={id}
      initial={animate ? { opacity: 0, y: 10 } : undefined}
      animate={animate ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.5 }}
      className={cn(
        "glass-panel rounded-xl overflow-hidden relative group",
        glow && "glow-border",
        className
      )}
    >
      <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      <div className="relative z-10 p-4">
        {children}
      </div>
    </Component>
  );
}
