import React from "react";
import Link from "next/link";
import { ArrowUpRight, ShieldCheck, Terminal, BookOpen, Heart } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t border-[#182430] bg-[#04070a] py-14 font-mono text-xs text-[#90a4ae]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-[#182430]">
          {/* Brand & Mission */}
          <div className="md:col-span-2 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center border border-[#00e5ff]/50 bg-[#0a141f] text-[#00e5ff] font-orbitron font-bold text-xs">
                A
              </div>
              <span className="font-orbitron text-sm font-bold text-white tracking-wider">
                ATELIER
              </span>
            </div>
            <p className="font-sans text-xs text-[#78909c] max-w-sm leading-relaxed">
              Open-source agent-skill and MCP quality gate for vibe-coded applications. Two post-generation quality critics: UI/UX Critic and Backend Architecture Guard.
            </p>
            <div className="text-[11px] text-[#546e7a]">
              ENGINEERED & DEVELOPED BY <strong className="text-white font-medium">ANSH RAJORE</strong> (<a href="https://github.com/anshrajore" target="_blank" rel="noopener noreferrer" className="text-[#00e5ff] hover:underline">@anshrajore</a>)
            </div>
          </div>

          {/* Core System */}
          <div className="flex flex-col gap-2.5">
            <span className="text-white font-semibold text-xs tracking-wider">SYSTEM</span>
            <Link href="/#architecture" className="hover:text-[#00e5ff] transition-colors">
              Two-Agent Architecture
            </Link>
            <Link href="/#live-critique" className="hover:text-[#00e5ff] transition-colors">
              Live Critic Simulation
            </Link>
            <Link href="/#ruleset" className="hover:text-[#00e5ff] transition-colors">
              36 Mechanical Rules
            </Link>
            <Link href="/#scoreboard" className="hover:text-[#00e5ff] transition-colors">
              Empirical Benchmarks
            </Link>
            <Link href="/#adapters" className="hover:text-[#00e5ff] transition-colors">
              Editor Adapters (5 IDEs)
            </Link>
          </div>

          {/* Resources */}
          <div className="flex flex-col gap-2.5">
            <span className="text-white font-semibold text-xs tracking-wider">RESOURCES</span>
            <Link href="/docs" className="hover:text-[#00e5ff] transition-colors flex items-center gap-1">
              <span>Full Documentation</span>
              <BookOpen className="h-3 w-3" />
            </Link>
            <a
              href="https://github.com/anshrajore/atelier-mcp"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#00e5ff] transition-colors flex items-center gap-1"
            >
              <span>GitHub Repository</span>
              <ArrowUpRight className="h-3 w-3" />
            </a>
            <a
              href="https://github.com/anshrajore/atelier-mcp/blob/main/LICENSE"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#00e5ff] transition-colors"
            >
              MIT Open Source License
            </a>
            <a
              href="https://github.com/anshrajore/atelier-mcp/blob/main/CONTRIBUTING.md"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#00e5ff] transition-colors"
            >
              Contributing & Rule Guide
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#546e7a]">
          <div>
            © 2026 Atelier. Open source under the MIT License.
          </div>
          <div className="flex items-center gap-2">
            <span>Built with Next.js & Tailwind</span>
            <span>•</span>
            <span>Zero Unsemantic Gradients</span>
            <span>•</span>
            <span>100% Dogfood Compliant</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
