"use client";

import React from "react";
import { Check, X, ShieldAlert, Cpu, Sparkles, Terminal } from "lucide-react";

export const PositioningSection = () => {
  const comparisonItems = [
    {
      feature: "Scope of Quality Gate",
      ponytail: "Code minimalism & token reduction only",
      atelier: "Two-Agent Critic: UI/UX Quality Gate + Backend Architecture Guard",
      atelierAdvantage: true,
    },
    {
      feature: "Rule Verification Method",
      ponytail: "Subjective text instructions with non-deterministic compliance",
      atelier: "36 mechanically gradeable checks (AST parsing, Regex, Schema validation)",
      atelierAdvantage: true,
    },
    {
      feature: "Execution Model",
      ponytail: "Static prompt injected into context window",
      atelier: "Self-hostable fine-tuned Qwen 1.5B/7B model + MCP Stdio Server + Frontier fallback",
      atelierAdvantage: true,
    },
    {
      feature: "Design & UX Enforcement",
      ponytail: "None (ignores spacing scale, contrast, focus states, and cliches)",
      atelier: "Rigorous 8px grid, WCAG AA contrast, focus rings, and decorative ceiling bounds",
      atelierAdvantage: true,
    },
    {
      feature: "Backend & Systems Soundness",
      ponytail: "None (ignores hardcoded secrets, rate limits, and orphan paths)",
      atelier: "Prevents plain-text tokens, unhandled HTTP retries, and missing error catch branches",
      atelierAdvantage: true,
    },
    {
      feature: "Automated Remediation",
      ponytail: "Manual developer intervention",
      atelier: "1-click automated fix engine via `atelier fix` and MCP `generate_fix`",
      atelierAdvantage: true,
    },
  ];

  return (
    <section id="positioning" className="border-b border-[#182430] bg-[#080d12] py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <div className="font-mono text-xs text-[#00e5ff] tracking-wider uppercase mb-2">
            ARCHITECTURAL POSITIONING
          </div>
          <h2 className="font-orbitron text-2xl sm:text-4xl font-bold tracking-tight text-white uppercase max-w-3xl">
            WHY CODE MINIMALISM RULES ALONE ARE NOT ENOUGH
          </h2>
          <p className="mt-4 max-w-2xl font-sans text-sm sm:text-base text-[#90a4ae] leading-relaxed">
            Existing rulesets focus solely on making AI code concise. Atelier establishes an end-to-end quality critic that grades both aesthetic design precision and backend architecture soundness before code lands in production.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="mt-12 overflow-x-auto border border-[#182430] bg-[#0a1017]">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead>
              <tr className="border-b border-[#182430] bg-[#0e1620] text-[#90a4ae]">
                <th className="py-4 px-6 font-semibold w-1/4">DIMENSION</th>
                <th className="py-4 px-6 font-semibold w-5/12 text-[#546e7a]">GENERIC / STATIC RULES</th>
                <th className="py-4 px-6 font-semibold w-5/12 text-[#00e5ff]">ATELIER TWO-AGENT GATE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#182430]">
              {comparisonItems.map((item, idx) => (
                <tr key={idx} className="hover:bg-[#0e1620]/50 transition-colors">
                  <td className="py-4 px-6 font-medium text-white">
                    {item.feature}
                  </td>
                  <td className="py-4 px-6 text-[#90a4ae] flex items-center gap-2">
                    <span className="text-[#546e7a]">✕</span>
                    <span>{item.ponytail}</span>
                  </td>
                  <td className="py-4 px-6 text-white font-medium">
                    <div className="flex items-center gap-2">
                      <span className="text-[#00e5ff]">✓</span>
                      <span>{item.atelier}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Callout Strip */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          <div className="border border-[#182430] bg-[#0a1017] p-4 flex flex-col gap-1.5">
            <span className="text-[#00e5ff] font-semibold">100% Gradeable Rules</span>
            <span className="text-[#90a4ae]">Every rule is checked via AST, Regex, or JSON inspection—never subjective language.</span>
          </div>
          <div className="border border-[#182430] bg-[#0a1017] p-4 flex flex-col gap-1.5">
            <span className="text-[#00e5ff] font-semibold">Self-Hostable MLX / GGUF</span>
            <span className="text-[#90a4ae]">Ships with 10.8MB LoRA adapters and fine-tuned weights for local zero-latency critique.</span>
          </div>
          <div className="border border-[#182430] bg-[#0a1017] p-4 flex flex-col gap-1.5">
            <span className="text-[#00e5ff] font-semibold">Tri-Tier MCP Routing</span>
            <span className="text-[#90a4ae]">Instantly executes via 12ms deterministic heuristics with seamless frontier LLM fallback.</span>
          </div>
        </div>
      </div>
    </section>
  );
};
