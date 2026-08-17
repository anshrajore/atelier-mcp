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
    <section id="scoreboard" className="py-24 bg-[#fafafa] dark:bg-[#090d16] border-b border-[#f1f5f9] dark:border-zinc-800 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <div className="text-xs font-semibold tracking-widest text-[#ff7a00] uppercase mb-3">
            EMPIRICAL BENCHMARK SCOREBOARD
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#111827] dark:text-white max-w-3xl tracking-tight leading-tight">
            Rigorous Empirical Recall Across All 36 Rules
          </h2>
          <p className="mt-4 max-w-2xl font-sans text-sm sm:text-base text-[#64748b] dark:text-zinc-400 leading-relaxed">
            Evaluated against the synthetic validation suite of 1,659 golden triples containing intentional violations and remediated ground-truth code.
          </p>
        </div>

        {/* Benchmarks Table */}
        <div className="mt-14 overflow-x-auto rounded-3xl bg-white dark:bg-zinc-900 border border-[#e2e8f0] dark:border-zinc-800 shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
          <table className="w-full text-left border-collapse font-sans text-xs sm:text-sm min-w-[700px]">
            <thead>
              <tr className="border-b border-[#e2e8f0] dark:border-zinc-800 bg-[#f8fafc] dark:bg-zinc-950 text-[#475569] dark:text-zinc-400">
                <th className="py-4 px-6 font-semibold">EVALUATOR / CRITIC ARCHITECTURE</th>
                <th className="py-4 px-4 font-semibold text-center">PRECISION</th>
                <th className="py-4 px-4 font-semibold text-center">RECALL</th>
                <th className="py-4 px-4 font-semibold text-center">F1 SCORE</th>
                <th className="py-4 px-4 font-semibold text-center">P95 LATENCY</th>
                <th className="py-4 px-6 font-semibold text-right">COST / 1K RUNS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9] dark:divide-zinc-800">
              {benchmarks.map((b, idx) => (
                <tr
                  key={idx}
                  className={`transition-colors ${
                    b.highlight
                      ? "bg-orange-50/40 dark:bg-orange-950/20 font-medium"
                      : "hover:bg-[#f8fafc]/60 dark:hover:bg-zinc-800/40"
                  }`}
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2.5">
                      <span className="font-semibold text-[#111827] dark:text-white">{b.evaluator}</span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold ${
                          b.highlight
                            ? "bg-[#ff7a00] text-white"
                            : "bg-[#f1f5f9] dark:bg-zinc-800 text-[#64748b] dark:text-zinc-400"
                        }`}
                      >
                        {b.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#64748b] dark:text-zinc-400 mt-0.5">{b.type}</div>
                  </td>
                  <td className="py-4 px-4 text-center font-mono font-semibold text-[#111827] dark:text-zinc-200">
                    {b.precision}
                  </td>
                  <td className="py-4 px-4 text-center font-mono font-semibold text-[#111827] dark:text-zinc-200">
                    {b.recall}
                  </td>
                  <td className="py-4 px-4 text-center font-mono font-bold text-[#ff7a00]">
                    {b.f1Score}
                  </td>
                  <td className="py-4 px-4 text-center font-mono text-[#64748b] dark:text-zinc-400">
                    {b.latency}
                  </td>
                  <td className="py-4 px-6 text-right font-mono font-semibold text-[#111827] dark:text-zinc-200">
                    {b.costPer1k}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Visual Benchmark Scoreboard Chart */}
        <div className="mt-12 rounded-3xl bg-white dark:bg-zinc-900 border border-[#e2e8f0] dark:border-zinc-800 p-6 lg:p-10 flex flex-col items-center shadow-sm">
          <div className="w-full max-w-5xl overflow-hidden relative min-h-[300px] rounded-2xl bg-white dark:bg-zinc-950 p-4 border border-[#e2e8f0] dark:border-zinc-800">
            <Image
              src="/assets/scoreboard-chart.svg"
              alt="Atelier Benchmark Scoreboard Chart"
              width={1100}
              height={500}
              className="w-full h-auto object-contain rounded-xl dark:opacity-90"
            />
          </div>
          <div className="mt-4 text-xs text-[#64748b] dark:text-zinc-400 font-mono">
            Empirical Evaluation Metric: Overall Recall % on 1,659 Golden Triples
          </div>
        </div>
      </div>
    </section>
  );
};
