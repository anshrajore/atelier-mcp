"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Terminal, Check, Copy, Sparkles } from "lucide-react";

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
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">
        <div className="flex flex-col items-center text-center">
          {/* Decorative Filigree Flourish (Exact match to Sarvam Reference) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="w-32 h-9 text-[#1e2330]/75 dark:text-zinc-400 flex items-center justify-center mb-4"
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
            className="text-xs sm:text-sm font-medium tracking-wide text-[#2563eb] dark:text-blue-400 mb-5 font-sans"
          >
            Atelier&apos;s Sovereign AI Quality Platform
          </motion.div>

          {/* Editorial Display Headline (Newsreader Serif) */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal text-[#111827] dark:text-white max-w-4xl tracking-tight leading-[1.1]"
          >
            Quality for all AI Code
          </motion.h1>

          {/* 3-line Sub-headline */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-6 max-w-2xl text-base sm:text-lg text-[#4b5563] dark:text-zinc-300 font-sans leading-relaxed font-light"
          >
            Building the sovereign quality architecture for AI-generated software. Fine-tuned models, gradeable critic rulesets, and native IDE agents built in India for the world.
          </motion.p>

          {/* Twin Action Pills */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold"
          >
            <Link
              href="#playground"
              className="px-8 py-3.5 rounded-full bg-[#ff7a00] text-white hover:bg-[#ff8b26] transition-all shadow-md flex items-center gap-2 group"
            >
              <span>Try Live Playground</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="#ide-matrix"
              className="px-8 py-3.5 rounded-full bg-white dark:bg-zinc-900 border border-[#e2e8f0] dark:border-zinc-800 text-[#1e2330] dark:text-zinc-100 hover:bg-[#f8fafc] dark:hover:bg-zinc-800 transition-all shadow-sm flex items-center gap-2"
            >
              <Terminal className="h-4 w-4 text-[#ff7a00]" />
              <span>IDE Setup Matrix</span>
            </Link>
          </motion.div>

          {/* Telemetry / 1-Liner Quick copy */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-8 w-full max-w-xl"
          >
            <div className="flex items-center justify-between px-5 py-3 rounded-full bg-[#1e2330] dark:bg-zinc-950 border border-[#2d3748] dark:border-zinc-800 shadow-xl text-xs font-mono text-gray-200">
              <div className="flex items-center gap-2 truncate">
                <Terminal className="h-4 w-4 text-[#ff7a00] shrink-0" />
                <span className="truncate">{installCmd}</span>
              </div>
              <button
                onClick={handleCopy}
                className="ml-3 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white font-sans text-xs flex items-center gap-1.5 transition-all shrink-0"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>
          </motion.div>

          {/* Logo Cloud Strip Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-16 pt-8 border-t border-[#f1f5f9] dark:border-zinc-800/80 w-full max-w-6xl"
          >
            <div className="text-[11px] font-semibold tracking-widest text-[#64748b] dark:text-zinc-400 uppercase mb-8 font-sans">
              DEVELOPERS & AGENTS BUILD WITH ATELIER
            </div>

            {/* Monochrome Logo Cloud */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-8 items-center justify-center opacity-70 dark:opacity-60 grayscale hover:opacity-100 dark:hover:opacity-100 transition-opacity font-mono text-xs font-bold text-[#334155] dark:text-zinc-300">
              <div className="flex items-center justify-center gap-1.5 hover:text-[#111827] dark:hover:text-white transition-colors">
                <span>CURSOR</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 hover:text-[#111827] dark:hover:text-white transition-colors">
                <span>WINDSURF</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 hover:text-[#111827] dark:hover:text-white transition-colors">
                <span>CLAUDE CODE</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 hover:text-[#111827] dark:hover:text-white transition-colors">
                <span>ANTIGRAVITY</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 hover:text-[#111827] dark:hover:text-white transition-colors">
                <span>GITHUB COPILOT</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 hover:text-[#111827] dark:hover:text-white transition-colors">
                <span>NEXT.JS</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 hover:text-[#111827] dark:hover:text-white transition-colors">
                <span>N8N</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 hover:text-[#111827] dark:hover:text-white transition-colors">
                <span>APPLE MLX</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
