"use client";

import React from "react";
import Image from "next/image";

export const BenchmarkScoreboard = () => {
  const benchmarks = [
    {
      evaluator: "Atelier Deterministic Engine",
      type: "AST / Regex Heuristic Engine",
      precision: "100.0%",
      recall: "100.0%",
      f1Score: "100.0%",
      latency: "12 ms",
      costPer1k: "$0.00",
      status: "DEFAULT CRITIC",
      highlight: true,
    },
    {
      evaluator: "Atelier Fine-Tuned Model (Qwen 1.5B/7B)",
      type: "Self-Hostable MLX / GGUF LoRA",
      precision: "94.8%",
      recall: "92.1%",
      f1Score: "93.4%",
      latency: "420 ms",
      costPer1k: "$0.00 (Local GPU)",
      status: "SELF-HOSTED",
      highlight: false,
    },
    {
      evaluator: "Frontier Teacher (Claude 3.5 Sonnet)",
      type: "Cloud API Fallback",
      precision: "98.2%",
      recall: "95.7%",
      f1Score: "96.9%",
      latency: "1,480 ms",
      costPer1k: "$15.00 / 1k runs",
      status: "FRONTIER FALLBACK",
      highlight: false,
    },
    {
      evaluator: "Ponytail / Static Rule Baseline",
      type: "Prompt-Only Injection",
      precision: "31.2%",
      recall: "24.3%",
      f1Score: "27.3%",
      latency: "N/A (Upstream LLM)",
      costPer1k: "Variable",
      status: "STATIC PROMPT",
      highlight: false,
    },
  ];

  return (
    <section id="scoreboard" className="py-24 bg-[#fafafa] border-b border-[#f1f5f9]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <div className="text-xs font-semibold tracking-widest text-[#ff7a00] uppercase mb-3">
            EMPIRICAL BENCHMARK SCOREBOARD
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#111827] max-w-3xl tracking-tight leading-tight">
            Rigorous Evaluation Across 1,659 Triples
          </h2>
          <p className="mt-4 max-w-2xl font-sans text-sm sm:text-base text-[#64748b] leading-relaxed">
            Evaluated on held-out test datasets spanning Next.js UI components and n8n backend workflows. Verified by deterministic labeling scripts in <code className="text-[#111827] font-semibold">benchmarks/SCOREBOARD.md</code>.
          </p>
        </div>

        {/* Scoreboard Table */}
        <div className="mt-14 overflow-hidden rounded-3xl bg-white border border-[#e2e8f0] shadow-sm">
          <table className="w-full text-left border-collapse font-sans text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-[#e2e8f0] bg-[#f8fafc] text-[#475569]">
                <th className="py-4 px-6 font-semibold">EVALUATOR</th>
                <th className="py-4 px-4 font-semibold">ENGINE / TYPE</th>
                <th className="py-4 px-4 font-semibold text-[#111827]">PRECISION</th>
                <th className="py-4 px-4 font-semibold text-[#111827]">RECALL</th>
                <th className="py-4 px-4 font-semibold text-[#111827]">F1 SCORE</th>
                <th className="py-4 px-4 font-semibold">LATENCY</th>
                <th className="py-4 px-6 font-semibold">COST / 1K RUNS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {benchmarks.map((b, idx) => (
                <tr
                  key={idx}
                  className={`transition-colors ${
                    b.highlight
                      ? "bg-amber-50/40"
                      : "hover:bg-[#f8fafc]/60"
                  }`}
                >
                  <td className="py-4 px-6 font-medium text-[#111827]">
                    <div className="flex items-center gap-2">
                      {b.highlight && <span className="h-1.5 w-1.5 rounded-full bg-[#ff7a00]" />}
                      <span>{b.evaluator}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-[#64748b] font-mono text-xs">{b.type}</td>
                  <td className="py-4 px-4 text-[#111827] font-bold">{b.precision}</td>
                  <td className="py-4 px-4 text-[#111827] font-bold">{b.recall}</td>
                  <td className="py-4 px-4 text-[#111827] font-bold">{b.f1Score}</td>
                  <td className="py-4 px-4 text-[#64748b] font-mono text-xs">{b.latency}</td>
                  <td className="py-4 px-6 text-[#64748b] font-mono text-xs">{b.costPer1k}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Visual Benchmark Scoreboard Chart Asset */}
        <div className="mt-8 rounded-3xl bg-white border border-[#e2e8f0] p-6 flex flex-col items-center shadow-sm">
          <div className="w-full max-w-4xl relative min-h-[250px] rounded-2xl bg-[#fafafa] p-4 border border-[#f1f5f9]">
            <Image
              src="/assets/scoreboard-chart.svg"
              alt="Atelier Empirical Recall & Precision Benchmark Chart"
              width={1000}
              height={500}
              className="w-full h-auto object-contain"
              unoptimized
            />
          </div>
          <div className="mt-4 flex items-center justify-between w-full max-w-4xl font-mono text-[11px] text-[#64748b]">
            <span>DATASET: 1,659 VALIDATED TRIPLES</span>
            <span>TEST SPLIT: 99 GOLDEN SAMPLES</span>
            <span className="text-[#111827] font-semibold">PRECISION DELTA: +68.8% VS STATIC PROMPTS</span>
          </div>
        </div>
      </div>
    </section>
  );
};
