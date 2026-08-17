"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Terminal, Shield, Cpu, BookOpen, ArrowUpRight, Menu, X, Check } from "lucide-react";

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#182430] bg-[#060a0f]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Brand / HUD */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center border border-[#00e5ff]/40 bg-[#0a141f] text-[#00e5ff] font-orbitron font-bold text-sm tracking-wider group-hover:border-[#00e5ff] transition-colors">
              A
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-orbitron text-base font-bold tracking-widest text-white group-hover:text-[#00e5ff] transition-colors">
                  ATELIER
                </span>
                <span className="font-mono text-[10px] px-1.5 py-0.5 border border-[#182430] bg-[#0a1017] text-[#90a4ae]">
                  v1.0.0
                </span>
              </div>
              <span className="font-mono text-[9px] text-[#546e7a] tracking-tight">
                TWO-AGENT QUALITY GATE
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 font-mono text-xs text-[#90a4ae]">
          <Link href="/#architecture" className="hover:text-[#00e5ff] transition-colors">
            Architecture
          </Link>
          <Link href="/#live-critique" className="hover:text-[#00e5ff] transition-colors">
            Live Critic
          </Link>
          <Link href="/#ruleset" className="hover:text-[#00e5ff] transition-colors flex items-center gap-1">
            <span>Ruleset</span>
            <span className="text-[10px] px-1 bg-[#182430] text-[#00e5ff]">36</span>
          </Link>
          <Link href="/#scoreboard" className="hover:text-[#00e5ff] transition-colors">
            Benchmarks
          </Link>
          <Link href="/#adapters" className="hover:text-[#00e5ff] transition-colors">
            Adapters
          </Link>
          <Link href="/#quickstart" className="hover:text-[#00e5ff] transition-colors">
            Quickstart
          </Link>
          <Link
            href="/docs"
            className="flex items-center gap-1 text-white hover:text-[#00e5ff] font-medium transition-colors"
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>Docs</span>
          </Link>
        </nav>

        {/* Actions / CTA */}
        <div className="hidden md:flex items-center gap-3 font-mono text-xs">
          <a
            href="https://github.com/anshrajore/atelier-mcp"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 border border-[#182430] bg-[#0a1017] px-3 py-1.5 text-white hover:border-[#00e5ff] hover:bg-[#0e1620] transition-colors"
          >
            <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span>GitHub</span>
            <ArrowUpRight className="h-3 w-3 text-[#546e7a]" />
          </a>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 border border-[#182430] text-[#90a4ae] hover:text-white"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#182430] bg-[#0a1017] px-4 py-4 font-mono text-xs">
          <div className="flex flex-col gap-3">
            <Link
              href="/#architecture"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 text-[#90a4ae] hover:text-[#00e5ff]"
            >
              Architecture
            </Link>
            <Link
              href="/#live-critique"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 text-[#90a4ae] hover:text-[#00e5ff]"
            >
              Live Critic
            </Link>
            <Link
              href="/#ruleset"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 text-[#90a4ae] hover:text-[#00e5ff]"
            >
              Ruleset (36 Checks)
            </Link>
            <Link
              href="/#scoreboard"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 text-[#90a4ae] hover:text-[#00e5ff]"
            >
              Benchmarks
            </Link>
            <Link
              href="/#adapters"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 text-[#90a4ae] hover:text-[#00e5ff]"
            >
              IDE Adapters
            </Link>
            <Link
              href="/docs"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 text-white hover:text-[#00e5ff] flex items-center gap-1.5"
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>Documentation</span>
            </Link>
            <a
              href="https://github.com/anshrajore/atelier-mcp"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 flex items-center justify-center gap-2 border border-[#00e5ff] bg-[#00e5ff]/10 py-2 text-[#00e5ff]"
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>Star on GitHub</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
