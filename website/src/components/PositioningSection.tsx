"use client";

import React from "react";
import { Check, X, Shield, Sparkles } from "lucide-react";

export const PositioningSection = () => {
  const comparisonItems = [
    {
      feature: "Scope of Quality Gate",
      ponytail: "Code minimalism & token reduction only",
      atelier: "Two-Agent Critic: UI/UX Quality Gate + Backend Architecture Guard",
    },
    {
      feature: "Rule Verification Method",
      ponytail: "Subjective text instructions with non-deterministic compliance",
      atelier: "36 mechanically gradeable checks (AST parsing, Regex, Schema validation)",
    },
    {
      feature: "Execution Model",
      ponytail: "Static prompt injected into context window",
      atelier: "Self-hostable fine-tuned Qwen 1.5B/7B + MCP Stdio Server + Frontier fallback",
    },
    {
      feature: "Design & UX Enforcement",
      ponytail: "None (ignores spacing scale, contrast, focus states, and cliches)",
      atelier: "Rigorous 8px grid, WCAG AA contrast, focus rings, and decorative ceiling bounds",
    },
    {
      feature: "Backend & Systems Soundness",
      ponytail: "None (ignores hardcoded secrets, rate limits, and orphan paths)",
      atelier: "Prevents plain-text tokens, unhandled HTTP retries, and missing catch branches",
    },
    {
      feature: "Automated Remediation",
      ponytail: "Manual developer intervention",
      atelier: "1-click automated fix engine via `atelier fix` and MCP `generate_fix`",
    },
  ];

  return (
    <section id="positioning" className="py-24 bg-[#fafafa] dark:bg-[#090d16] border-b border-[#f1f5f9] dark:border-zinc-800 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <div className="text-xs font-semibold tracking-widest text-[#ff7a00] uppercase mb-3">
            ARCHITECTURAL POSITIONING
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#111827] dark:text-white max-w-3xl tracking-tight leading-tight">
            Why Code Minimalism Rules Alone Are Not Enough
          </h2>
          <p className="mt-4 max-w-2xl font-sans text-sm sm:text-base text-[#64748b] dark:text-zinc-400 leading-relaxed">
            Existing tools enforce brevity only. Atelier establishes an end-to-end quality critic that grades design precision and backend soundness before code reaches production.
          </p>
        </div>

        {/* Clean Rounded Comparison Card */}
        <div className="mt-14 overflow-x-auto rounded-3xl bg-white dark:bg-zinc-900 border border-[#e2e8f0] dark:border-zinc-800 shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
          <table className="w-full text-left border-collapse font-sans text-xs sm:text-sm min-w-[600px]">
            <thead>
              <tr className="border-b border-[#e2e8f0] dark:border-zinc-800 bg-[#f8fafc] dark:bg-zinc-950 text-[#475569] dark:text-zinc-400">
                <th className="py-4 px-6 font-semibold w-1/4">DIMENSION</th>
                <th className="py-4 px-6 font-semibold w-5/12 text-[#64748b] dark:text-zinc-400">GENERIC / STATIC RULES</th>
                <th className="py-4 px-6 font-semibold w-5/12 text-[#1e2330] dark:text-[#ff7a00]">ATELIER TWO-AGENT GATE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9] dark:divide-zinc-800">
              {comparisonItems.map((item, idx) => (
                <tr key={idx} className="hover:bg-[#f8fafc]/60 dark:hover:bg-zinc-800/40 transition-colors">
                  <td className="py-4 px-6 font-medium text-[#111827] dark:text-zinc-200">
                    {item.feature}
                  </td>
                  <td className="py-4 px-6 text-[#64748b] dark:text-zinc-400">
                    <div className="flex items-center gap-2">
                      <span className="text-[#94a3b8] dark:text-zinc-600">✕</span>
                      <span>{item.ponytail}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-[#111827] dark:text-zinc-100 font-medium">
                    <div className="flex items-center gap-2">
                      <span className="text-[#ff7a00] font-bold">✓</span>
                      <span>{item.atelier}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
