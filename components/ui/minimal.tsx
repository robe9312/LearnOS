import { cn } from "@/lib/utils";

export function TextBlock({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("text-lg leading-relaxed text-foreground/90", className)}>
      {children}
    </p>
  );
}

export function Section({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("space-y-8 py-12", className)}>
      <h2 className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted border-b border-border pb-4">
        {title}
      </h2>
      <div className="space-y-6">
        {children}
      </div>
    </section>
  );
}

export function Divider() {
  return <hr className="border-border my-8" />;
}

export function InlineTag({ children, color = 'accent' }: { children: React.ReactNode; color?: 'accent' | 'muted' }) {
  return (
    <span className={cn(
      "text-[10px] font-mono font-bold uppercase tracking-widest px-1.5 py-0.5 border rounded",
      color === 'accent' ? "text-accent border-accent/20 bg-accent/5" : "text-muted border-border bg-muted/5"
    )}>
      {children}
    </span>
  );
}

export function ListItem({ children, icon: Icon }: { children: React.ReactNode; icon?: any }) {
  return (
    <div className="flex gap-4 group">
      {Icon ? (
        <Icon className="w-4 h-4 mt-1 text-muted group-hover:text-accent transition-colors" />
      ) : (
        <div className="w-1.5 h-1.5 rounded-full mt-2.5 bg-border group-hover:bg-accent transition-colors" />
      )}
      <div className="flex-1 text-base text-foreground/80 group-hover:text-foreground transition-colors">
        {children}
      </div>
    </div>
  );
}

export function CodeLine({ children }: { children: React.ReactNode }) {
  return (
    <code className="block w-full bg-card border border-border p-4 rounded-md font-mono text-sm overflow-x-auto text-accent">
      <span className="text-muted mr-3">$</span>
      {children}
    </code>
  );
}
