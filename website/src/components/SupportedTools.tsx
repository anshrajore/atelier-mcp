"use client";

import React from "react";
import { CheckCircle2, FileCode2, Terminal, RefreshCw } from "lucide-react";

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
      format: "Windsurf System Directives",
      status: "SYNCED",
    },
    {
      name: "Claude Code",
      filePath: "CLAUDE.md & AGENTS.md",
      format: "Modular Subagent Skills",
      status: "SYNCED",
    },
    {
      name: "Antigravity",
      filePath: ".agents/rules/atelier.md",
      format: "Native Agentic Quality Gate",
      status: "SYNCED",
    },
    {
      name: "GitHub Copilot",
      filePath: ".github/copilot-instructions.md",
      format: "Copilot Workspace Instructions",
      status: "SYNCED",
    },
  ];

  return (
    <section id="adapters" className="border-b border-[#182430] bg-[#060a0f] py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <div className="font-mono text-xs text-[#00e5ff] tracking-wider uppercase mb-2">
            UNIVERSAL COMPATIBILITY
          </div>
          <h2 className="font-orbitron text-2xl sm:text-4xl font-bold tracking-tight text-white uppercase max-w-3xl">
            PLUGS INTO YOUR FAVORITE AI CODING TOOL
          </h2>
          <p className="mt-4 max-w-2xl font-sans text-sm sm:text-base text-[#90a4ae] leading-relaxed">
            All 5 editor adapters are automatically generated and synchronized against <code className="text-[#00e5ff] font-mono">SKILL.md</code> to guarantee zero drift.
          </p>
        </div>

        {/* Compatibility Strip */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 font-mono text-xs">
          {tools.map((t) => (
            <div
              key={t.name}
              className="border border-[#182430] bg-[#0a1017] p-4 flex flex-col justify-between hover:border-[#00e5ff] transition-colors"
            >
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-[#182430]">
                  <span className="font-orbitron font-bold text-white text-sm">{t.name}</span>
                  <span className="text-[10px] text-[#00e5ff] font-medium flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>{t.status}</span>
                  </span>
                </div>
                <div className="mt-3 text-[11px] text-[#90a4ae] break-all">
                  {t.filePath}
                </div>
              </div>
              <div className="mt-4 pt-2 border-t border-[#182430] text-[10px] text-[#546e7a]">
                {t.format}
              </div>
            </div>
          ))}
        </div>

        {/* Sync Guarantee Badge */}
        <div className="mt-8 mx-auto max-w-2xl border border-[#182430] bg-[#0a1017] p-4 flex items-center justify-between font-mono text-xs">
          <div className="flex items-center gap-2 text-[#cfd8dc]">
            <RefreshCw className="h-4 w-4 text-[#00e5ff]" />
            <span>Automated CI Check: <code className="text-[#00e5ff]">node scripts/check-sync.js</code></span>
          </div>
          <span className="text-[#00e5ff] font-semibold">100% CANONICAL MATCH</span>
        </div>
      </div>
    </section>
  );
};
