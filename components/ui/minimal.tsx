import { cn } from "@/lib/utils";

export function TextBlock({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("text-lg leading-relaxed text-foreground/90 font-light", className)}>
      {children}
    </p>
  );
}

export function Section({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("space-y-6 py-8", className)}>
      <h2 className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted border-b border-border pb-2">
        {title}
      </h2>
      <div className="space-y-4">
        {children}
      </div>
    </section>
  );
}
