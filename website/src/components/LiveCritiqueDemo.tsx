"use client";

import React, { useState } from "react";
import { Check, Copy, Sparkles, Terminal } from "lucide-react";

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
3:     <div className="p-5 bg-white border border-gray-200 rounded-2xl shadow-sm">
4:       <h3 className="text-gray-900 text-base font-semibold">{title}</h3>
5:       <p className="text-gray-500 text-2xl font-mono mt-1">{count}</p>
6:       <button className="mt-4 px-4 py-2 rounded-full border border-gray-200 bg-gray-50 text-gray-900 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 transition-colors font-sans text-xs font-medium">
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
    <section id="live-critique" className="py-24 bg-[#fafafa] border-b border-[#f1f5f9]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <div className="text-xs font-semibold tracking-widest text-[#ff7a00] uppercase mb-3">
            INTERACTIVE CRITIQUE INSPECTION
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#111827] max-w-3xl tracking-tight leading-tight">
            Real-World Before / Critique / After
          </h2>
          <p className="mt-4 max-w-2xl font-sans text-sm sm:text-base text-[#64748b] leading-relaxed">
            Witness how Atelier evaluates flawed vibe-coded snippets, extracts mechanical rule violations, and yields unified remediation diffs.
          </p>

          {/* Clean Pill Tab Switcher */}
          <div className="mt-8 flex items-center p-1 bg-[#f1f5f9] rounded-full text-xs font-medium">
            <button
              onClick={() => setActiveTab("ui")}
              className={`px-6 py-2 rounded-full transition-all flex items-center gap-2 ${
                activeTab === "ui"
                  ? "bg-white text-[#111827] shadow-sm font-semibold"
                  : "text-[#64748b] hover:text-[#111827]"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-[#ff7a00]" />
              <span>UI/UX Critic (Next.js / Tailwind)</span>
            </button>
            <button
              onClick={() => setActiveTab("backend")}
              className={`px-6 py-2 rounded-full transition-all flex items-center gap-2 ${
                activeTab === "backend"
                  ? "bg-white text-[#111827] shadow-sm font-semibold"
                  : "text-[#64748b] hover:text-[#111827]"
              }`}
            >
              <Terminal className="h-3.5 w-3.5 text-[#2563eb]" />
              <span>Backend Guard (API / n8n)</span>
            </button>
          </div>
        </div>

        {/* 3-Column Inspection Grid */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch font-mono text-xs">
          {/* Col 1: Flawed Generation */}
          <div className="lg:col-span-4 rounded-3xl bg-white border border-[#e2e8f0] shadow-sm flex flex-col justify-between overflow-hidden">
            <div>
              <div className="flex items-center justify-between border-b border-[#f1f5f9] bg-[#f8fafc] px-5 py-3.5 text-[#64748b]">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-rose-500" />
                  <span className="font-semibold text-[#111827] text-xs">FLAWED INPUT</span>
                </div>
                <span className="text-[10px] text-rose-600 font-semibold">3 VIOLATIONS</span>
              </div>
              <div className="p-5 bg-white overflow-x-auto">
                <pre className="text-rose-950/80 leading-relaxed font-mono">
                  <code>{current.flawedCode}</code>
                </pre>
              </div>
            </div>
            <div className="border-t border-[#f1f5f9] bg-[#f8fafc] px-5 py-3 text-[11px] text-[#64748b]">
              INPUT: {current.title}
            </div>
          </div>

          {/* Col 2: Atelier Findings */}
          <div className="lg:col-span-4 rounded-3xl bg-white border border-[#e2e8f0] shadow-sm flex flex-col justify-between overflow-hidden">
            <div>
              <div className="flex items-center justify-between border-b border-[#f1f5f9] bg-[#f8fafc] px-5 py-3.5 text-[#64748b]">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#ff7a00]" />
                  <span className="font-semibold text-[#111827] text-xs">ATELIER CRITIC</span>
                </div>
                <span className="text-[10px] font-semibold text-[#ff7a00]">GRADE: 40/100</span>
              </div>
              <div className="p-5 flex flex-col gap-3 max-h-[420px] overflow-y-auto">
                {current.findings.map((f, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-[#e2e8f0] bg-[#fafafa] p-3.5 flex flex-col gap-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[#111827] font-bold text-xs">{f.ruleId}</span>
                      <span
                        className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${
                          f.severity === "CRITICAL"
                            ? "bg-rose-100 text-rose-700"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {f.severity} (L{f.line})
                      </span>
                    </div>
                    <div className="text-[#111827] font-medium text-xs">{f.name}</div>
                    <div className="text-[#64748b] text-[11px] leading-normal">{f.issue}</div>
                    <div className="mt-1 pt-1.5 border-t border-[#e2e8f0] text-[#ff7a00] text-[11px] font-medium">
                      Fix: {f.fix}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t border-[#f1f5f9] bg-[#f8fafc] px-5 py-3 text-[11px] text-[#111827] font-semibold">
              AUTO-REMEDIATION READY VIA `ATELIER FIX`
            </div>
          </div>

          {/* Col 3: Remediated Code */}
          <div className="lg:col-span-4 rounded-3xl bg-white border border-[#e2e8f0] shadow-sm flex flex-col justify-between overflow-hidden">
            <div>
              <div className="flex items-center justify-between border-b border-[#f1f5f9] bg-[#f8fafc] px-5 py-3.5 text-[#64748b]">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="font-semibold text-[#111827] text-xs">REMEDIATED OUTPUT</span>
                </div>
                <button
                  onClick={() => handleCopyCode(current.fixedCode)}
                  className="flex items-center gap-1 text-[11px] text-[#64748b] hover:text-[#111827]"
                >
                  {copied ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>
              </div>
              <div className="p-5 bg-white overflow-x-auto">
                <pre className="text-emerald-950/90 leading-relaxed font-mono">
                  <code>{current.fixedCode}</code>
                </pre>
              </div>
            </div>
            <div className="border-t border-[#f1f5f9] bg-[#f8fafc] px-5 py-3 text-[11px] text-emerald-700 font-semibold flex items-center justify-between">
              <span>SCORE: 100/100 PASS</span>
              <span>ZERO REGRESSIONS</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
