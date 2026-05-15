import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/ui/sidebar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "LearnOS | Cognitive Command Center",
  description: "A cognitive operating system for adaptive learning.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased os-grid min-h-screen relative`}>
        <div className="os-scanline" />
        
        {/* Global Atmosphere */}
        <div className="absolute inset-0 bg-radial-gradient from-brand-cyan/5 via-transparent to-transparent pointer-events-none" />
        
        <div className="flex h-screen overflow-hidden relative z-10">
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-6 relative">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
