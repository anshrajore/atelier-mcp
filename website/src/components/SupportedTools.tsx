"use client";

import React from "react";
import { CheckCircle2, RefreshCw } from "lucide-react";

export const SupportedTools = () => {
  const tools = [
    {
      name: "Cursor",
      filePath: ".cursorrules & .cursor/rules/atelier.mdc",
      format: "Canonical MDC & Rules",
      status: "SYNCED",
    },
    {
      name: "Windsurf",
      filePath: ".windsurfrules",
      format: "Windsurf Directives",
      status: "SYNCED",
    },
    {
      name: "Claude Code",
      filePath: "CLAUDE.md & AGENTS.md",
      format: "Modular Skills",
      status: "SYNCED",
    },
    {
      name: "Antigravity",
      filePath: ".agents/rules/atelier.md",
      format: "Native Agent Gate",
      status: "SYNCED",
    },
    {
      name: "GitHub Copilot",
      filePath: ".github/copilot-instructions.md",
      format: "Workspace Rules",
      status: "SYNCED",
    },
  ];

  return (
    <section id="adapters" className="py-24 bg-white dark:bg-[#090d16] border-b border-[#f1f5f9] dark:border-zinc-800 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <div className="text-xs font-semibold tracking-widest text-[#ff7a00] uppercase mb-3">
            UNIVERSAL COMPATIBILITY
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#111827] dark:text-white max-w-3xl tracking-tight leading-tight">
            Plugs into Your Favorite AI Coding Tool
          </h2>
          <p className="mt-4 max-w-2xl font-sans text-sm sm:text-base text-[#64748b] dark:text-zinc-400 leading-relaxed">
            All 5 editor adapters are automatically generated and synchronized against <code className="text-[#111827] dark:text-zinc-200 font-semibold font-mono">SKILL.md</code> to guarantee zero drift.
          </p>
        </div>

        {/* Compatibility Strip */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 font-sans text-xs">
          {tools.map((t) => (
            <div
              key={t.name}
              className="rounded-3xl bg-[#fafafa] dark:bg-zinc-900/60 border border-[#e2e8f0] dark:border-zinc-800 p-5 flex flex-col justify-between hover:border-[#cbd5e1] dark:hover:border-zinc-700 hover:shadow-sm transition-all"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#e2e8f0] dark:border-zinc-800">
                  <span className="font-bold text-[#111827] dark:text-white text-sm">{t.name}</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>{t.status}</span>
                  </span>
                </div>
                <div className="mt-3 text-[11px] font-mono text-[#64748b] dark:text-zinc-400 break-all">
                  {t.filePath}
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-[#e2e8f0] dark:border-zinc-800 text-[11px] text-[#94a3b8] dark:text-zinc-500">
                {t.format}
              </div>
            </div>
          ))}
        </div>

        {/* Sync Guarantee Pill */}
        <div className="mt-10 mx-auto max-w-xl rounded-full bg-[#f8fafc] dark:bg-zinc-900 border border-[#e2e8f0] dark:border-zinc-800 px-6 py-3 flex items-center justify-between font-sans text-xs shadow-sm">
          <div className="flex items-center gap-2 text-[#475569] dark:text-zinc-400">
            <RefreshCw className="h-4 w-4 text-[#ff7a00]" />
            <span>Automated CI Check: <code className="font-mono text-[#111827] dark:text-zinc-200">node scripts/check-sync.js</code></span>
          </div>
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">100% MATCH</span>
        </div>
      </div>
    </section>
  );
};
