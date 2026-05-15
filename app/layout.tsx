import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "LearnOS",
  description: "Minimal Cognitive Environment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={cn(inter.variable, mono.variable, "font-sans min-h-screen")}>
        <div className="flex flex-col min-h-screen">
          <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <a href="/" className="text-sm font-bold tracking-tight hover:text-accent transition-colors">
                  LEARNOS
                </a>
                <nav className="hidden md:flex items-center gap-6">
                  <NavLink href="/explore" label="Explore" />
                  <NavLink href="/journey" label="Journey" />
                  <NavLink href="/system" label="System" />
                  <NavLink href="/timeline" label="Timeline" />
                </nav>
              </div>
              <div className="flex items-center gap-4">
                <button className="text-[10px] font-mono text-muted uppercase tracking-widest border border-border px-2 py-0.5 rounded hover:border-accent hover:text-accent transition-colors">
                  v1.2.0
                </button>
              </div>
            </div>
          </header>
          <main className="flex-1">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <a 
      href={href} 
      className="text-xs uppercase tracking-widest text-muted hover:text-foreground transition-colors font-medium"
    >
      {label}
    </a>
  );
}
