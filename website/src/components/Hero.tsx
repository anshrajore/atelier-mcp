"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Terminal, Shield, ArrowRight, Check, Copy, Sparkles, Cpu, Layers } from "lucide-react";

export const Hero = () => {
  const [copied, setCopied] = useState(false);
  const installCmd = "npx -y atelier-quality-gate install";

  const handleCopy = () => {
    navigator.clipboard.writeText(installCmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative overflow-hidden border-b border-[#182430] bg-[#060a0f] pt-16 pb-20 lg:pt-24 lg:pb-28">
      {/* Background technical grid and subtle radial glow */}
      <div className="absolute inset-0 technical-grid opacity-30 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 subtle-radial pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          {/* Engineering attribution badge */}
          <div className="inline-flex items-center gap-2 border border-[#182430] bg-[#0a1017] px-3 py-1 text-xs font-mono text-[#90a4ae] mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00e5ff] animate-pulse" />
            <span>ENGINEERED BY ANSH RAJORE</span>
            <span className="text-[#546e7a]">|</span>
            <span className="text-[#00e5ff]">36 MECHANICALLY GRADEABLE RULES</span>
          </div>

          {/* Display Headline in Orbitron */}
          <h1 className="font-orbitron text-3xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl max-w-5xl uppercase leading-tight">
            POST-GENERATION QUALITY GATE FOR VIBE CODING
          </h1>

          {/* Positioning statement */}
          <p className="mt-6 max-w-3xl font-sans text-base text-[#cfd8dc] sm:text-lg lg:text-xl leading-relaxed">
            Ponytail-style rulesets only enforce code minimalism. <strong className="text-white font-semibold">Atelier</strong> adds two post-generation quality critics—a <span className="text-[#00e5ff]">UI/UX Critic</span> and a <span className="text-[#00e5ff]">Backend Architecture Guard</span>—powered by a self-hostable fine-tuned model and universal MCP integration.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 font-mono text-sm">
            <a
              href="https://github.com/anshrajore/atelier-mcp"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 border border-[#00e5ff] bg-[#00e5ff] px-6 py-3 font-semibold text-[#060a0f] hover:bg-[#5ce1e6] hover:border-[#5ce1e6] transition-all shadow-[0_0_20px_rgba(0,229,255,0.2)]"
            >
              <span>Get Started on GitHub</span>
              <ArrowRight className="h-4 w-4" />
            </a>

            <Link
              href="/docs"
              className="flex items-center gap-2 border border-[#182430] bg-[#0a1017] px-6 py-3 text-white hover:border-[#00e5ff] hover:bg-[#0e1620] transition-colors"
            >
              <span>Read Documentation</span>
            </Link>

            <button
              onClick={handleCopy}
              className="flex items-center gap-2 border border-[#182430] bg-[#0a1017] px-4 py-3 text-[#90a4ae] hover:text-white hover:border-[#2b4760] transition-colors"
              title="Copy quick install command"
            >
              <Terminal className="h-4 w-4 text-[#00e5ff]" />
              <span className="text-xs">{installCmd}</span>
              {copied ? <Check className="h-3.5 w-3.5 text-[#00e5ff]" /> : <Copy className="h-3.5 w-3.5 text-[#546e7a]" />}
            </button>
          </div>

          {/* Live Critique Simulation HUD Container */}
          <div className="mt-14 w-full max-w-5xl border border-[#182430] bg-[#0a1017] text-left shadow-2xl">
            {/* Terminal Window Header */}
            <div className="flex items-center justify-between border-b border-[#182430] bg-[#0e1620] px-4 py-2.5 font-mono text-xs text-[#90a4ae]">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
                <span className="ml-2 text-[#cfd8dc] font-semibold">atelier-mcp stdio session</span>
              </div>
              <div className="flex items-center gap-4 text-[11px]">
                <span className="text-[#546e7a]">MODEL: atelier-qwen-1.5b-mlx</span>
                <span className="text-[#00e5ff]">LATENCY: 12ms (Heuristic)</span>
                <span className="text-[#27c93f]">STATUS: 100% READY</span>
              </div>
            </div>

            {/* Terminal Content Split Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-[#182430] font-mono text-xs">
              {/* Flawed Generation Input */}
              <div className="p-5 bg-[#060a0f]/60">
                <div className="flex items-center justify-between pb-3 text-[#546e7a] border-b border-[#182430] mb-3">
                  <span className="text-white font-medium">{"// AI Generated Component (Pre-Critic)"}</span>
                  <span className="text-red-400 font-semibold text-[11px]">2 VIOLATIONS</span>
                </div>
                <pre className="text-[#90a4ae] leading-relaxed overflow-x-auto">
                  <code>
{`1: export const PricingCard = () => (
2:   <div className="bg-gradient-to-r from-purple-500 to-indigo-600">
3:     <button className="p-[19px] shadow-2xl">
4:       Upgrade Plan
5:     </button>
6:   </div>
7: );`}
                  </code>
                </pre>
                <div className="mt-4 flex flex-col gap-1.5 text-[11px]">
                  <div className="flex items-center gap-2 text-red-400 bg-red-950/30 border border-red-900/40 px-2.5 py-1">
                    <span>Line 2:</span>
                    <span>BASE-UI-106 (Rainbow Gradient Cliché)</span>
                  </div>
                  <div className="flex items-center gap-2 text-red-400 bg-red-950/30 border border-red-900/40 px-2.5 py-1">
                    <span>Line 3:</span>
                    <span>BASE-UI-101 (Arbitrary 19px Spacing Token)</span>
                  </div>
                </div>
              </div>

              {/* Atelier Critic Remediation Output */}
              <div className="p-5 bg-[#0a1017]">
                <div className="flex items-center justify-between pb-3 text-[#546e7a] border-b border-[#182430] mb-3">
                  <span className="text-[#00e5ff] font-medium">{"// Atelier Post-Generation Output"}</span>
                  <span className="text-[#27c93f] font-semibold text-[11px]">AUTO-REMEDIATED</span>
                </div>
                <pre className="text-[#cfd8dc] leading-relaxed overflow-x-auto">
                  <code>
{`1: export const PricingCard = () => (
2:   <div className="bg-zinc-900 border border-zinc-800">
3:     <button className="p-5 shadow-sm focus-visible:ring-2 focus-visible:ring-zinc-400">
4:       Upgrade Plan
5:     </button>
6:   </div>
7: );`}
                  </code>
                </pre>
                <div className="mt-4 flex items-center justify-between text-[11px] bg-[#060a0f] border border-[#182430] px-3 py-2">
                  <span className="text-[#90a4ae]">Grade: <strong className="text-white">100/100 COMPLIANT</strong></span>
                  <span className="text-[#00e5ff]">AST Validated & Zero Regressions</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
