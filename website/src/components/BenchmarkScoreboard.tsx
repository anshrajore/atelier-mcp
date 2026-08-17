"use client";

import React from "react";
import Image from "next/image";
import { BarChart3, Clock, DollarSign, Target, Award } from "lucide-react";

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
    <section id="scoreboard" className="border-b border-[#182430] bg-[#080d12] py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <div className="font-mono text-xs text-[#00e5ff] tracking-wider uppercase mb-2">
            EMPIRICAL BENCHMARK SCOREBOARD
          </div>
          <h2 className="font-orbitron text-2xl sm:text-4xl font-bold tracking-tight text-white uppercase max-w-3xl">
            RIGOROUS EVALUATION ACROSS 1,659 TRIPLES
          </h2>
          <p className="mt-4 max-w-2xl font-sans text-sm sm:text-base text-[#90a4ae] leading-relaxed">
            Evaluated on held-out test datasets spanning Next.js UI components and n8n backend workflows. Verified by deterministic labeling scripts in <code className="text-[#00e5ff] font-mono">benchmarks/SCOREBOARD.md</code>.
          </p>
        </div>

        {/* Scoreboard Table */}
        <div className="mt-12 overflow-x-auto border border-[#182430] bg-[#0a1017]">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead>
              <tr className="border-b border-[#182430] bg-[#0e1620] text-[#90a4ae]">
                <th className="py-4 px-6 font-semibold">EVALUATOR</th>
                <th className="py-4 px-4 font-semibold">ENGINE / TYPE</th>
                <th className="py-4 px-4 font-semibold text-[#00e5ff]">PRECISION</th>
                <th className="py-4 px-4 font-semibold text-[#00e5ff]">RECALL</th>
                <th className="py-4 px-4 font-semibold text-white">F1 SCORE</th>
                <th className="py-4 px-4 font-semibold">LATENCY</th>
                <th className="py-4 px-6 font-semibold">COST / 1K RUNS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#182430]">
              {benchmarks.map((b, idx) => (
                <tr
                  key={idx}
                  className={`transition-colors ${
                    b.highlight
                      ? "bg-[#00e5ff]/5 border-l-2 border-l-[#00e5ff]"
                      : "hover:bg-[#0e1620]/50"
                  }`}
                >
                  <td className="py-4 px-6 font-medium text-white">
                    <div className="flex items-center gap-2">
                      {b.highlight && <span className="h-1.5 w-1.5 rounded-full bg-[#00e5ff]" />}
                      <span>{b.evaluator}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-[#90a4ae]">{b.type}</td>
                  <td className="py-4 px-4 text-[#00e5ff] font-bold">{b.precision}</td>
                  <td className="py-4 px-4 text-[#00e5ff] font-bold">{b.recall}</td>
                  <td className="py-4 px-4 text-white font-bold">{b.f1Score}</td>
                  <td className="py-4 px-4 text-[#90a4ae]">{b.latency}</td>
                  <td className="py-4 px-6 text-[#90a4ae]">{b.costPer1k}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Visual Benchmark Scoreboard Chart Asset */}
        <div className="mt-8 border border-[#182430] bg-[#0a1017] p-6 flex flex-col items-center">
          <div className="w-full max-w-4xl relative min-h-[250px]">
            <Image
              src="/assets/scoreboard-chart.svg"
              alt="Atelier Empirical Recall & Precision Benchmark Chart"
              width={1000}
              height={500}
              className="w-full h-auto object-contain border border-[#182430] bg-[#060a0f]"
              unoptimized
            />
          </div>
          <div className="mt-4 flex items-center justify-between w-full max-w-4xl font-mono text-[11px] text-[#546e7a]">
            <span>DATASET: 1,659 VALIDATED TRIPLES</span>
            <span>TEST SPLIT: 99 GOLDEN SAMPLES</span>
            <span className="text-[#00e5ff]">PRECISION DELTA: +68.8% VS STATIC PROMPTS</span>
          </div>
        </div>
      </div>
    </section>
  );
};
