"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Code2, Cpu, ShieldCheck, Terminal, Award, Sparkles, Layers } from "lucide-react";

export const AboutAnshRajore = () => {
  const stats = [
    { label: "Ruleset Checks", value: "36", desc: "Mechanical AST & Regex Checks" },
    { label: "Training Dataset", value: "1,659", desc: "Curated Golden Instruction Triples" },
    { label: "Editor Adapters", value: "5", desc: "Native IDE Rulesets Synchronized" },
    { label: "Engine Latency", value: "12ms", desc: "Deterministic Zero-Cost Heuristics" },
  ];

  return (
    <section id="about-ansh" className="py-28 bg-[#fafafa] border-b border-[#f1f5f9] relative overflow-hidden">
      {/* Subtle background ambient radial */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-r from-orange-100/40 via-indigo-100/30 to-rose-100/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Vision & Bio (7 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 flex flex-col gap-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#e2e8f0] text-xs font-semibold text-[#ff6a00] uppercase tracking-wider shadow-sm w-fit">
              <Sparkles className="h-3.5 w-3.5" />
              <span>THE ARCHITECT BEHIND ATELIER</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#111827] tracking-tight leading-tight">
              Engineered & Developed by <span className="italic font-normal">Ansh Rajore</span>
            </h2>

            <p className="font-sans text-base sm:text-lg text-[#4b5563] leading-relaxed">
              <strong>Ansh Rajore</strong> is a software engineer and AI systems researcher dedicated to building robust autonomous coding environments, mechanical quality gates, and edge-deployable AI models.
            </p>

            <p className="font-sans text-sm sm:text-base text-[#64748b] leading-relaxed">
              Frustrated by how modern vibe-coding tools chronically hallucinate uncalibrated UI layouts, arbitrary padding, unsemantic gradients, and brittle backend architecture, Ansh architected <strong>Atelier</strong> to bridge the gap between creative AI code generation and rigorous production engineering standards.
            </p>

            {/* Principles & Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-white border border-[#e2e8f0] shadow-sm flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-[#ff6a00] shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-sm text-[#111827]">Deterministic Quality</div>
                  <div className="text-xs text-[#64748b] mt-0.5">Moving beyond subjective prompts to gradeable AST rules.</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#e2e8f0] shadow-sm flex items-start gap-3">
                <Cpu className="h-5 w-5 text-[#2563eb] shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-sm text-[#111827]">Local Apple Silicon MLX</div>
                  <div className="text-xs text-[#64748b] mt-0.5">Zero-marginal-cost edge critique using fine-tuned LoRA models.</div>
                </div>
              </div>
            </div>

            {/* Social / GitHub Connect CTA */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <a
                href="https://github.com/anshrajore"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1e2330] text-white text-sm font-medium hover:bg-[#111827] transition-all shadow-md"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                <span>Follow @anshrajore on GitHub</span>
                <ArrowUpRight className="h-4 w-4 text-[#94a3b8]" />
              </a>

              <a
                href="https://github.com/anshrajore/atelier-mcp"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-[#e2e8f0] text-sm font-medium text-[#111827] hover:bg-[#f8fafc] transition-all shadow-sm"
              >
                <span>Explore Atelier Repository</span>
              </a>
            </div>
          </motion.div>

          {/* Right Column: Interactive Profile & System Card (5 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5"
          >
            <div className="rounded-3xl bg-white border border-[#e2e8f0] p-8 shadow-xl relative overflow-hidden">
              {/* Top Card Badge */}
              <div className="flex items-center justify-between pb-6 border-b border-[#f1f5f9]">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-[#1e2330] text-white flex items-center justify-center font-bold text-lg shadow-inner">
                    AR
                  </div>
                  <div>
                    <div className="font-bold text-[#111827] text-base">Ansh Rajore</div>
                    <div className="text-xs text-[#64748b]">Creator & Lead Architect</div>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-mono text-[11px] font-semibold border border-emerald-200">
                  OPEN SOURCE
                </span>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-4 py-6">
                {stats.map((s, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-[#fafafa] border border-[#f1f5f9]">
                    <div className="font-serif text-2xl sm:text-3xl font-bold text-[#111827]">
                      {s.value}
                    </div>
                    <div className="text-xs font-semibold text-[#111827] mt-1">
                      {s.label}
                    </div>
                    <div className="text-[11px] text-[#64748b] mt-0.5 leading-snug">
                      {s.desc}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quote / Mission Statement */}
              <div className="pt-4 border-t border-[#f1f5f9] text-xs font-serif italic text-[#4b5563] leading-relaxed">
                &ldquo;AI should elevate software quality, not erode it. Atelier is designed to ensure every vibe-coded application ships with production-grade craft and architectural resilience.&rdquo;
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
