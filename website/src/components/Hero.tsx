"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Terminal, Check, Copy } from "lucide-react";

export const Hero = () => {
  const [copied, setCopied] = useState(false);
  const installCmd = "npx -y atelier-quality-gate install";

  const handleCopy = () => {
    navigator.clipboard.writeText(installCmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative overflow-hidden hero-aura-background pt-12 pb-16 lg:pt-16 lg:pb-24">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          {/* Decorative Filigree Flourish (Matching Sarvam Reference) */}
          <div className="w-28 h-8 text-[#1e2330]/70 flex items-center justify-center mb-4">
            <svg viewBox="0 0 100 24" fill="none" className="w-full h-full stroke-current">
              <path
                d="M50 12 C40 4, 30 4, 20 12 C10 20, 5 12, 1 12 M50 12 C60 4, 70 4, 80 12 C90 20, 95 12, 99 12 M35 12 C30 8, 25 8, 20 12 C15 16, 10 12, 8 12 M65 12 C70 8, 75 8, 80 12 C85 16, 90 12, 92 12"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <circle cx="50" cy="12" r="2.5" fill="currentColor" />
            </svg>
          </div>

          {/* Subtitle / Tagline Pill */}
          <div className="text-xs sm:text-sm font-medium tracking-wide text-[#2563eb] mb-6">
            Two-Agent Post-Generation Quality Gate
          </div>

          {/* Large Editorial Display Headline (Newsreader Serif) */}
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal text-[#111827] max-w-4xl tracking-tight leading-[1.1]">
            Quality for all AI Code
          </h1>

          {/* 3-line Sub-headline */}
          <p className="mt-6 max-w-2xl font-sans text-base sm:text-lg text-[#4b5563] leading-relaxed font-light">
            Built on 36 mechanical gradeable rules. Powered by fine-tuned models.<br />
            Delivering zero-regression vibe coding.
          </p>

          {/* Centered Twin Action Pill Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm font-medium">
            <a
              href="https://github.com/anshrajore/atelier-mcp"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 rounded-full bg-[#1e2330] text-white hover:bg-[#111827] transition-all shadow-md hover:shadow-lg"
            >
              Get Started
            </a>

            <Link
              href="/docs"
              className="px-8 py-3.5 rounded-full bg-white border border-[#e2e8f0] text-[#1e2330] hover:bg-[#f8fafc] transition-all shadow-sm"
            >
              Documentation
            </Link>
          </div>

          {/* Secondary Quick CLI Copy Pill */}
          <div className="mt-6 flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-[#e2e8f0] text-xs font-mono text-[#4b5563] hover:text-[#111827] shadow-sm transition-all"
            >
              <Terminal className="h-3.5 w-3.5 text-[#ff7a00]" />
              <span>{installCmd}</span>
              {copied ? (
                <Check className="h-3 w-3 text-emerald-600" />
              ) : (
                <Copy className="h-3 w-3 text-[#94a3b8]" />
              )}
            </button>
          </div>

          {/* Logo Cloud Strip Header (Matching "INDIA BUILDS WITH SARVAM") */}
          <div className="mt-20 pt-8 border-t border-[#f1f5f9] w-full max-w-6xl">
            <div className="text-[11px] font-semibold tracking-widest text-[#64748b] uppercase mb-8">
              DEVELOPERS & AGENTS BUILD WITH ATELIER
            </div>

            {/* Monochrome Logo Cloud */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-8 items-center justify-center opacity-70 grayscale hover:opacity-100 transition-opacity font-mono text-xs font-bold text-[#334155]">
              <div className="flex items-center justify-center gap-1.5 hover:text-[#111827]">
                <span>CURSOR</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 hover:text-[#111827]">
                <span>WINDSURF</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 hover:text-[#111827]">
                <span>CLAUDE CODE</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 hover:text-[#111827]">
                <span>ANTIGRAVITY</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 hover:text-[#111827]">
                <span>GITHUB COPILOT</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 hover:text-[#111827]">
                <span>NEXT.JS</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 hover:text-[#111827]">
                <span>N8N</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 hover:text-[#111827]">
                <span>APPLE MLX</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
