import React from "react";
import Link from "next/link";
import { ArrowUpRight, BookOpen } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-[#f1f5f9] py-16 text-xs text-[#64748b]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-[#f1f5f9]">
          {/* Brand & Developer Info */}
          <div className="md:col-span-2 flex flex-col gap-3">
            <div className="flex items-center gap-1.5">
              <span className="font-sans text-xl font-bold tracking-tight text-[#111827] lowercase">
                atelier
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#ff7a00]" />
            </div>
            <p className="text-xs text-[#64748b] max-w-sm leading-relaxed">
              Open-source agent-skill and MCP quality gate for vibe-coded applications. Two post-generation quality critics: UI/UX Critic and Backend Architecture Guard.
            </p>
            <div className="text-[11px] text-[#94a3b8] font-mono mt-1">
              ENGINEERED & DEVELOPED BY <strong className="text-[#111827] font-semibold">ANSH RAJORE</strong> (<a href="https://github.com/anshrajore" target="_blank" rel="noopener noreferrer" className="text-[#ff7a00] hover:underline">@anshrajore</a>)
            </div>
          </div>

          {/* Platform */}
          <div className="flex flex-col gap-2.5">
            <span className="text-[#111827] font-semibold text-xs tracking-wider uppercase">PLATFORM</span>
            <Link href="/#architecture" className="hover:text-[#111827] transition-colors">
              Two-Agent Architecture
            </Link>
            <Link href="/#live-critique" className="hover:text-[#111827] transition-colors">
              Live Critic Simulation
            </Link>
            <Link href="/#ruleset" className="hover:text-[#111827] transition-colors">
              36 Mechanical Rules
            </Link>
            <Link href="/#scoreboard" className="hover:text-[#111827] transition-colors">
              Empirical Benchmarks
            </Link>
            <Link href="/#adapters" className="hover:text-[#111827] transition-colors">
              Editor Adapters (5 IDEs)
            </Link>
          </div>

          {/* Resources */}
          <div className="flex flex-col gap-2.5">
            <span className="text-[#111827] font-semibold text-xs tracking-wider uppercase">RESOURCES</span>
            <Link href="/docs" className="hover:text-[#111827] transition-colors flex items-center gap-1">
              <span>Full Documentation</span>
              <BookOpen className="h-3 w-3" />
            </Link>
            <a
              href="https://github.com/anshrajore/atelier-mcp"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#111827] transition-colors flex items-center gap-1"
            >
              <span>GitHub Repository</span>
              <ArrowUpRight className="h-3 w-3" />
            </a>
            <a
              href="https://github.com/anshrajore/atelier-mcp/blob/main/LICENSE"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#111827] transition-colors"
            >
              MIT License
            </a>
            <a
              href="https://github.com/anshrajore/atelier-mcp/blob/main/CONTRIBUTING.md"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#111827] transition-colors"
            >
              Contributing Guide
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#94a3b8]">
          <div>
            © 2026 Atelier. Open source under the MIT License.
          </div>
          <div className="flex items-center gap-2">
            <span>Built with Next.js & Tailwind</span>
            <span>•</span>
            <span>Developed by Ansh Rajore</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
