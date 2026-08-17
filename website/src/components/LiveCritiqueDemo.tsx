"use client";

import React, { useState } from "react";
import { AlertCircle, CheckCircle2, Copy, Check, ArrowRight, ShieldAlert, Sparkles, Terminal } from "lucide-react";

export const LiveCritiqueDemo = () => {
  const [activeTab, setActiveTab] = useState<"ui" | "backend">("ui");
  const [copied, setCopied] = useState(false);

  const uiExample = {
    title: "Next.js / Tailwind UI Component",
    flawedCode: `1: export const AnalyticsCard = ({ title, count }) => {
2:   return (
3:     <div className="p-[19px] bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg shadow-2xl">
4:       <h3 className="text-white text-lg font-bold">{title}</h3>
5:       <p className="text-gray-300 text-2xl">{count}</p>
6:       <button className="mt-4 px-4 py-2 bg-black text-white hover:opacity-80">
7:         Inspect Metric
8:       </button>
9:     </div>
10:  );
11: };`,
    findings: [
      {
        ruleId: "BASE-UI-101",
        severity: "CRITICAL",
        line: 3,
        name: "Arbitrary 8px Spacing Grid Violation",
        issue: "Value `p-[19px]` is not aligned to the 4px/8px design system token scale.",
        fix: "Replace `p-[19px]` with standard Tailwind scale token `p-5` (20px).",
      },
      {
        ruleId: "BASE-UI-106",
        severity: "WARNING",
        line: 3,
        name: "Forbidden Rainbow Gradient Cliché",
        issue: "Using multi-hue saturated color transitions (`from-purple-500 to-indigo-600`) without semantic basis.",
        fix: "Replace with disciplined surface color `bg-[#0a1017] border border-[#182430]`.",
      },
      {
        ruleId: "NEXT-UI-105",
        severity: "WARNING",
        line: 6,
        name: "Missing Focus-Visible Outline Indicator",
        issue: "Interactive button lacks explicit keyboard focus-visible styling.",
        fix: "Add `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00e5ff]`.",
      },
    ],
    fixedCode: `1: export const AnalyticsCard = ({ title, count }) => {
2:   return (
3:     <div className="p-5 bg-[#0a1017] border border-[#182430] rounded-none">
4:       <h3 className="text-white text-base font-semibold">{title}</h3>
5:       <p className="text-[#90a4ae] text-2xl font-mono mt-1">{count}</p>
6:       <button className="mt-4 px-4 py-2 border border-[#182430] bg-[#060a0f] text-white hover:border-[#00e5ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00e5ff] transition-colors font-mono text-xs">
7:         Inspect Metric
8:       </button>
9:     </div>
10:  );
11: };`,
  };

  const backendExample = {
    title: "Backend Route / n8n Workflow Handler",
    flawedCode: `1: export async function POST(req: Request) {
2:   const body = await req.json();
3:   const apiKey = "HARDCODED_UNSAFE_PRODUCTION_SECRET_KEY_9948";
4:   
5:   const res = await fetch("https://api.provider.com/v1/charge", {
6:     method: "POST",
7:     headers: { Authorization: \`Bearer \${apiKey}\` },
8:     body: JSON.stringify(body),
9:   });
10:  return Response.json(await res.json());
11: }`,
    findings: [
      {
        ruleId: "BASE-BE-101",
        severity: "CRITICAL",
        line: 3,
        name: "Hardcoded Secret / API Token",
        issue: "Raw live credentials detected inline matching standard token entropy patterns.",
        fix: "Use environment variables `process.env.PROVIDER_API_KEY` with runtime schema assertion.",
      },
      {
        ruleId: "BASE-BE-102",
        severity: "CRITICAL",
        line: 5,
        name: "Missing Transient Retry & Timeout Handler",
        issue: "External HTTP call lacks timeout bounds and exponential backoff on 5xx errors.",
        fix: "Wrap with AbortSignal timeout and status retry handler.",
      },
      {
        ruleId: "BASE-BE-104",
        severity: "WARNING",
        line: 1,
        name: "Unhandled Async Exception / No Try-Catch",
        issue: "Route crashes on malformed JSON body or upstream network drop.",
        fix: "Enclose handler in try/catch block returning structured error JSON.",
      },
    ],
    fixedCode: `1: export async function POST(req: Request) {
2:   try {
3:     const body = await req.json();
4:     const apiKey = process.env.PROVIDER_API_KEY;
5:     if (!apiKey) throw new Error("PROVIDER_API_KEY environment variable missing");
6: 
7:     const controller = new AbortController();
8:     const timeoutId = setTimeout(() => controller.abort(), 8000);
9: 
10:    const res = await fetch("https://api.provider.com/v1/charge", {
11:      method: "POST",
12:      headers: { Authorization: \`Bearer \${apiKey}\` },
13:      body: JSON.stringify(body),
14:      signal: controller.signal,
15:    });
16:    clearTimeout(timeoutId);
17:    return Response.json(await res.json());
18:  } catch (err: any) {
19:    return Response.json({ error: err.message }, { status: 500 });
20:  }
21: }`,
  };

  const current = activeTab === "ui" ? uiExample : backendExample;

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="live-critique" className="border-b border-[#182430] bg-[#080d12] py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <div className="font-mono text-xs text-[#00e5ff] tracking-wider uppercase mb-2">
            INTERACTIVE CRITIQUE INSPECTION
          </div>
          <h2 className="font-orbitron text-2xl sm:text-4xl font-bold tracking-tight text-white uppercase max-w-3xl">
            REAL-WORLD BEFORE / CRITIQUE / AFTER
          </h2>
          <p className="mt-4 max-w-2xl font-sans text-sm sm:text-base text-[#90a4ae] leading-relaxed">
            Witness how Atelier evaluates flawed vibe-coded snippets, extracts mechanical rule violations, and yields unified remediation diffs.
          </p>

          {/* Preset Category Switcher */}
          <div className="mt-8 flex items-center border border-[#182430] bg-[#0a1017] p-1 font-mono text-xs">
            <button
              onClick={() => setActiveTab("ui")}
              className={`px-5 py-2 transition-colors flex items-center gap-2 ${
                activeTab === "ui"
                  ? "bg-[#182430] text-[#00e5ff] font-semibold"
                  : "text-[#90a4ae] hover:text-white"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>UI/UX Critic (Next.js / Tailwind)</span>
            </button>
            <button
              onClick={() => setActiveTab("backend")}
              className={`px-5 py-2 transition-colors flex items-center gap-2 ${
                activeTab === "backend"
                  ? "bg-[#182430] text-[#00e5ff] font-semibold"
                  : "text-[#90a4ae] hover:text-white"
              }`}
            >
              <Terminal className="h-3.5 w-3.5" />
              <span>Backend Guard (API / n8n)</span>
            </button>
          </div>
        </div>

        {/* 3-Column Inspection Grid */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch font-mono text-xs">
          {/* Col 1: Flawed Input (4 cols) */}
          <div className="lg:col-span-4 border border-[#182430] bg-[#0a1017] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-[#182430] bg-[#0e1620] px-4 py-3 text-[#90a4ae]">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  <span className="text-white font-semibold text-[11px]">FLAWED GENERATION</span>
                </div>
                <span className="text-[10px] text-red-400 font-medium">3 VIOLATIONS</span>
              </div>
              <div className="p-4 bg-[#060a0f] overflow-x-auto">
                <pre className="text-red-300/80 leading-relaxed">
                  <code>{current.flawedCode}</code>
                </pre>
              </div>
            </div>
            <div className="border-t border-[#182430] bg-[#0a1017] p-3 text-[11px] text-[#546e7a]">
              INPUT SNIPPET: {current.title}
            </div>
          </div>

          {/* Col 2: Structured Critique Cards (4 cols) */}
          <div className="lg:col-span-4 border border-[#182430] bg-[#0a1017] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-[#182430] bg-[#0e1620] px-4 py-3 text-[#90a4ae]">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#00e5ff]" />
                  <span className="text-[#00e5ff] font-semibold text-[11px]">ATELIER CRITIC FINDINGS</span>
                </div>
                <span className="text-[10px] text-[#90a4ae]">SCORE: 40/100</span>
              </div>
              <div className="p-4 flex flex-col gap-3 max-h-[420px] overflow-y-auto">
                {current.findings.map((f, idx) => (
                  <div
                    key={idx}
                    className="border border-[#182430] bg-[#060a0f] p-3 flex flex-col gap-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[#00e5ff] font-bold text-[11px]">{f.ruleId}</span>
                      <span
                        className={`text-[9px] px-1.5 py-0.2 border ${
                          f.severity === "CRITICAL"
                            ? "border-red-800 bg-red-950/40 text-red-400"
                            : "border-yellow-800 bg-yellow-950/40 text-yellow-400"
                        }`}
                      >
                        {f.severity} (L{f.line})
                      </span>
                    </div>
                    <div className="text-white font-medium text-[11px]">{f.name}</div>
                    <div className="text-[#90a4ae] text-[10px] leading-normal">{f.issue}</div>
                    <div className="mt-1 pt-1.5 border-t border-[#182430] text-[#00e5ff] text-[10px] flex items-start gap-1">
                      <span className="text-[#546e7a]">Fix:</span>
                      <span>{f.fix}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t border-[#182430] bg-[#0a1017] p-3 text-[11px] text-[#00e5ff]">
              AUTO-REMEDIATION READY VIA `ATELIER FIX`
            </div>
          </div>

          {/* Col 3: Remediated Clean Code (4 cols) */}
          <div className="lg:col-span-4 border border-[#182430] bg-[#0a1017] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-[#182430] bg-[#0e1620] px-4 py-3 text-[#90a4ae]">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span className="text-white font-semibold text-[11px]">REMEDIATED CODE</span>
                </div>
                <button
                  onClick={() => handleCopyCode(current.fixedCode)}
                  className="flex items-center gap-1 text-[10px] text-[#90a4ae] hover:text-white"
                >
                  {copied ? <Check className="h-3 w-3 text-[#00e5ff]" /> : <Copy className="h-3 w-3" />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>
              </div>
              <div className="p-4 bg-[#060a0f] overflow-x-auto">
                <pre className="text-emerald-300/90 leading-relaxed">
                  <code>{current.fixedCode}</code>
                </pre>
              </div>
            </div>
            <div className="border-t border-[#182430] bg-[#0a1017] p-3 text-[11px] text-emerald-400 flex items-center justify-between">
              <span>SCORE: 100/100 PASS</span>
              <span>ZERO REGRESSIONS</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
