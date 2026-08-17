"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Menu, X, BookOpen } from "lucide-react";

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="w-full pt-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-50">
      {/* Floating Pill Navbar */}
      <header className="mx-auto flex items-center justify-between px-6 py-3 bg-white/95 backdrop-blur-md rounded-full border border-[#f1f5f9] shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="font-sans text-2xl font-bold tracking-tight text-[#111827] lowercase">
            atelier
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-[#ff7a00]" />
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-[11px] font-semibold tracking-wider text-[#4b5563] uppercase">
          <Link href="/#architecture" className="hover:text-[#111827] transition-colors">
            Platform
          </Link>
          <Link href="/#live-critique" className="hover:text-[#111827] transition-colors">
            Critics
          </Link>
          <Link href="/#ruleset" className="hover:text-[#111827] transition-colors">
            Ruleset
          </Link>
          <Link href="/#scoreboard" className="hover:text-[#111827] transition-colors">
            Benchmarks
          </Link>
          <Link href="/docs" className="hover:text-[#111827] transition-colors">
            Docs
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-3 text-xs font-medium">
          <a
            href="https://github.com/anshrajore/atelier-mcp"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2 rounded-full bg-[#1e2330] text-white hover:bg-[#111827] transition-all shadow-sm flex items-center gap-1.5"
          >
            <span>Get Started</span>
          </a>
          <Link
            href="/docs"
            className="px-5 py-2 rounded-full bg-white border border-[#e2e8f0] text-[#1e2330] hover:bg-[#f8fafc] transition-all"
          >
            <span>Documentation</span>
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-[#4b5563] hover:text-[#111827]"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 p-5 bg-white rounded-3xl border border-[#e2e8f0] shadow-xl text-xs font-semibold uppercase tracking-wider text-[#4b5563]">
          <div className="flex flex-col gap-3">
            <Link href="/#architecture" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-[#111827]">
              Platform
            </Link>
            <Link href="/#live-critique" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-[#111827]">
              Critics
            </Link>
            <Link href="/#ruleset" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-[#111827]">
              Ruleset (36 Rules)
            </Link>
            <Link href="/#scoreboard" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-[#111827]">
              Benchmarks
            </Link>
            <Link href="/docs" onClick={() => setMobileMenuOpen(false)} className="py-1 text-[#111827] flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5" />
              <span>Documentation</span>
            </Link>
            <a
              href="https://github.com/anshrajore/atelier-mcp"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 py-2.5 rounded-full bg-[#1e2330] text-white text-center"
            >
              Get Started on GitHub
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
