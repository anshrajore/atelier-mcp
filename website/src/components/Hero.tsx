"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Terminal, Check, Copy, Sparkles } from "lucide-react";

export const Hero = () => {
  const [copied, setCopied] = useState(false);
  const installCmd = "npx -y github:anshrajore/atelier-mcp install";

  const handleCopy = () => {
    navigator.clipboard.writeText(installCmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative overflow-hidden hero-aura-background pt-12 pb-16 lg:pt-16 lg:pb-24">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">
        <div className="flex flex-col items-center text-center">
          {/* Decorative Filigree Flourish (Exact match to Sarvam Reference) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="w-32 h-9 text-[#1e2330]/75 flex items-center justify-center mb-4"
          >
            <svg viewBox="0 0 120 28" fill="none" className="w-full h-full stroke-current">
              <path
                d="M60 14 C48 3, 34 3, 22 14 C12 24, 6 14, 2 14 M60 14 C72 3, 86 3, 98 14 C108 24, 114 14, 118 14 M42 14 C36 9, 30 9, 24 14 C18 19, 12 14, 10 14 M78 14 C84 9, 90 9, 96 14 C102 19, 108 14, 110 14"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              <circle cx="60" cy="14" r="3" fill="currentColor" />
            </svg>
          </motion.div>

          {/* Subtitle / Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xs sm:text-sm font-medium tracking-wide text-[#2563eb] mb-5 font-sans"
          >
            Atelier&apos;s Sovereign AI Quality Platform
          </motion.div>

          {/* Editorial Display Headline (Newsreader Serif) */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal text-[#111827] max-w-4xl tracking-tight leading-[1.1]"
          >
            Quality for all AI Code
          </motion.h1>

          {/* 3-line Sub-headline */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-6 max-w-2xl font-sans text-base sm:text-lg text-[#4b5563] leading-relaxed font-light"
          >
            Built on 36 mechanical gradeable rules. Powered by fine-tuned models.<br />
            Delivering zero-regression vibe coding.
          </motion.p>

          {/* Centered Twin Action Pill Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm font-medium"
          >
            <a
              href="https://github.com/anshrajore/atelier-mcp"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 rounded-full bg-[#1e2330] text-white hover:bg-[#111827] transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Get Started
            </a>

            <Link
              href="/docs"
              className="px-8 py-3.5 rounded-full bg-white border border-[#e2e8f0] text-[#1e2330] hover:bg-[#f8fafc] transition-all shadow-sm transform hover:-translate-y-0.5"
            >
              Documentation
            </Link>
          </motion.div>

          {/* Secondary Quick CLI Copy Pill */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-6 flex items-center gap-2"
          >
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm border border-[#e2e8f0] text-xs font-mono text-[#4b5563] hover:text-[#111827] shadow-sm hover:shadow transition-all"
            >
              <Terminal className="h-3.5 w-3.5 text-[#ff6a00]" />
              <span>{installCmd}</span>
              {copied ? (
                <Check className="h-3 w-3 text-emerald-600" />
              ) : (
                <Copy className="h-3 w-3 text-[#94a3b8]" />
              )}
            </button>
          </motion.div>

          {/* Logo Cloud Strip Header (Matching "INDIA BUILDS WITH SARVAM") */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-20 pt-8 border-t border-[#f1f5f9] w-full max-w-6xl"
          >
            <div className="text-[11px] font-semibold tracking-widest text-[#64748b] uppercase mb-8 font-sans">
              DEVELOPERS & AGENTS BUILD WITH ATELIER
            </div>

            {/* Monochrome Logo Cloud */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-8 items-center justify-center opacity-70 grayscale hover:opacity-100 transition-opacity font-mono text-xs font-bold text-[#334155]">
              <div className="flex items-center justify-center gap-1.5 hover:text-[#111827] transition-colors">
                <span>CURSOR</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 hover:text-[#111827] transition-colors">
                <span>WINDSURF</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 hover:text-[#111827] transition-colors">
                <span>CLAUDE CODE</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 hover:text-[#111827] transition-colors">
                <span>ANTIGRAVITY</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 hover:text-[#111827] transition-colors">
                <span>GITHUB COPILOT</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 hover:text-[#111827] transition-colors">
                <span>NEXT.JS</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 hover:text-[#111827] transition-colors">
                <span>N8N</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 hover:text-[#111827] transition-colors">
                <span>APPLE MLX</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
