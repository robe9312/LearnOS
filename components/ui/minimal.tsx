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

export function Divider() {
  return <hr className="border-border my-6" opacity-50 />;
}

export function InlineTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-accent underline underline-offset-4 cursor-pointer hover:bg-accent/5 px-1 rounded transition-colors">
      {children}
    </span>
  );
}

export function ListItem({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 group">
      <div className="w-1.5 h-1.5 rounded-full mt-2.5 bg-border group-hover:bg-accent transition-colors" />
      <div className="flex-1 text-base text-foreground/80 group-hover:text-foreground transition-colors">
        {children}
      </div>
    </div>
  );
}

export function CodeLine({ children }: { children: React.ReactNode }) {
  return (
    <code className="block w-full bg-card border border-border p-3 rounded font-mono text-xs text-accent">
      <span className="text-muted mr-3">$</span>
      {children}
    </code>
  );
}
