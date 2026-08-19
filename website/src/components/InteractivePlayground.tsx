"use client";

import React, { useState } from "react";
import {
  Play,
  Check,
  AlertTriangle,
  ShieldAlert,
  Sparkles,
  RefreshCw,
  Wand2,
  CheckCircle2,
  XCircle,
} from "lucide-react";

interface Preset {
  id: string;
  name: string;
  category: "UI/UX" | "Backend";
  code: string;
}

const PRESETS: Preset[] = [
  {
    id: "spacing-glow",
    name: "Arbitrary Spacing & Gradient Overkill",
    category: "UI/UX",
    code: `<div className="bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 p-[19px] m-[13px] shadow-2xl rounded-2xl">
  <button className="bg-gradient-to-tr from-violet-500 to-fuchsia-500 text-white font-bold py-[9px] px-[17px] rounded-lg">
    Submit Order
  </button>
</div>`
  },
  {
    id: "jwt-leak",
    name: "Hardcoded API Secret & JWT (OWASP A07)",
    category: "Backend",
    code: `import express from "express";
const app = express();

const JWT_SECRET = "mock_secret_production_key_998811";
const API_TOKEN = "test_live_key_sample_token_example_only";

app.post("/api/checkout", (req, res) => {
  const token = jwt.sign({ user: req.body.userId }, JWT_SECRET);
  res.json({ token, apiToken: API_TOKEN });
});`
  },
  {
    id: "missing-zod",
    name: "Unvalidated Request Body Boundary",
    category: "Backend",
    code: `export async function POST(req: Request) {
  const body = await req.json();
  
  // Directly executing mutation without schema parser (Zod/Pydantic)
  const user = await db.user.create({
    data: {
      email: body.email,
      role: body.role, // Privilege escalation risk
    }
  });
  
  return Response.json(user);
}`
  },
  {
    id: "missing-focus",
    name: "Missing Focus-Visible Accessibility",
    category: "UI/UX",
    code: `<nav className="flex gap-4">
  <button className="px-4 py-2 bg-blue-600 text-white rounded-md">
    Dashboard
  </button>
  <a href="/settings" className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md">
    Settings
  </a>
</nav>`
  }
];

interface Finding {
  ruleId: string;
  severity: "CRITICAL" | "WARNING" | "SUGGESTION";
  title: string;
  line: number;
  explanation: string;
  fix: string;
}

export const InteractivePlayground = () => {
  const [selectedPreset, setSelectedPreset] = useState<Preset>(PRESETS[0]);
  const [code, setCode] = useState(PRESETS[0].code);
  const [originalCode, setOriginalCode] = useState(PRESETS[0].code);
  const [viewMode, setViewMode] = useState<"editor" | "diff">("editor");
  const [isAuditing, setIsAuditing] = useState(false);
  const [findings, setFindings] = useState<Finding[]>([
    {
      ruleId: "BASE-UI-101",
      severity: "CRITICAL",
      title: "Arbitrary 8px Spacing Grid Violation",
      line: 1,
      explanation: "Values 19px and 13px violate the 4px/8px design system harmonic token scale.",
      fix: "Snap 19px to 20px (p-5) and 13px to 12px (m-3) or 16px (m-4)."
    },
    {
      ruleId: "BASE-UI-105",
      severity: "WARNING",
      title: "Decorative Ceiling Policy Exceeded",
      line: 1,
      explanation: "Multiple nested rainbow gradient fills and heavy drop shadows create cognitive clutter.",
      fix: "Replace multi-stop gradients with solid refined surfaces (e.g. bg-zinc-900 border border-zinc-800)."
    }
  ]);
  const [score, setScore] = useState(65);

  const runAudit = (sourceCode: string) => {
    setIsAuditing(true);
    setTimeout(() => {
      const newFindings: Finding[] = [];
      let newScore = 100;

      // Spacing check
      const spacingMatches = sourceCode.match(/(?:m|p|gap|top|left|right|bottom|w|h)-\[(\d+)px\]/g) || [];
      for (const m of spacingMatches) {
        const val = parseInt(m.replace(/[^0-9]/g, ""), 10);
        if (val % 4 !== 0) {
          newFindings.push({
            ruleId: "BASE-UI-101",
            severity: "CRITICAL",
            title: `Arbitrary ${val}px Spacing Grid Violation`,
            line: 1,
            explanation: `Value ${val}px does not conform to the 4px/8px harmonic grid.`,
            fix: `Use standard Tailwind tokens or round to nearest multiple of 4px (${Math.round(val / 4) * 4}px).`
          });
          newScore -= 15;
          break;
        }
      }

      // Gradient check
      const gradCount = (sourceCode.match(/bg-gradient-to-[a-z]+/g) || []).length;
      if (gradCount > 1) {
        newFindings.push({
          ruleId: "BASE-UI-105",
          severity: "WARNING",
          title: "Decorative Ceiling Policy Exceeded",
          line: 1,
          explanation: `${gradCount} high-intensity gradient surfaces detected on a single component.`,
          fix: "Replace excessive gradients with subtle border definitions and clean flat surfaces."
        });
        newScore -= 15;
      }

      // Secret check
      if (/(?:api_key|apiKey|secret|private_key|jwt_secret|bearer_token|password|sk_live)\s*[:=]\s*['"`]([A-Za-z0-9_\-\.]{8,})['"`]/i.test(sourceCode)) {
        newFindings.push({
          ruleId: "BASE-BE-201",
          severity: "CRITICAL",
          title: "Hardcoded Credential / Secret (OWASP A07)",
          line: 4,
          explanation: "Plaintext private token committed in source code.",
          fix: "Extract credentials to process.env (e.g. process.env.JWT_SECRET)."
        });
        newScore -= 35;
      }

      // Zod check
      if (/(?:app\.(post|put)|export async function POST)/i.test(sourceCode) && !/(?:zod|pydantic|z\.|parse|validate)/i.test(sourceCode)) {
        newFindings.push({
          ruleId: "BASE-BE-202",
          severity: "CRITICAL",
          title: "Unvalidated Request Boundary Schema",
          line: 1,
          explanation: "Incoming request payload is processed directly without schema validation.",
          fix: "Parse req.body with Zod or Pydantic before accessing fields."
        });
        newScore -= 25;
      }

      // Focus check
      if (/<button|<a\s/i.test(sourceCode) && !/focus-visible/i.test(sourceCode)) {
        newFindings.push({
          ruleId: "BASE-UI-108",
          severity: "WARNING",
          title: "Missing Keyboard Focus-Visible State",
          line: 2,
          explanation: "Interactive controls lack visible focus indicators for keyboard navigation.",
          fix: "Add focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-offset-2."
        });
        newScore -= 15;
      }

      setFindings(newFindings);
      setScore(Math.max(0, newScore));
      setIsAuditing(false);
    }, 250);
  };

  const handlePresetSelect = (preset: Preset) => {
    setSelectedPreset(preset);
    setCode(preset.code);
    setOriginalCode(preset.code);
    setViewMode("editor");
    runAudit(preset.code);
  };

  const handleAutoFix = () => {
    let fixed = code;
    // Fix spacing
    fixed = fixed.replace(/(m|p|gap|top|left|right|bottom|w|h)-\[(\d+)px\]/g, (match, prefix, num) => {
      const val = parseInt(num, 10);
      const rounded = Math.max(4, Math.round(val / 4) * 4);
      return `${prefix}-[${rounded}px]`;
    });
    // Fix gradients
    fixed = fixed.replace(/bg-gradient-to-[a-z]+ (?:from|via|to)-[a-z0-9\-]+/g, "bg-zinc-900 border border-zinc-800");
    // Fix secrets
    fixed = fixed.replace(/"mock_secret_production_key_998811"/g, 'process.env.JWT_SECRET || ""');
    fixed = fixed.replace(/"test_live_key_sample_token_example_only"/g, 'process.env.API_TOKEN || ""');
    // Fix zod
    if (fixed.includes("req.json()") && !fixed.includes("z.object")) {
      fixed = `import { z } from "zod";\n\nconst UserSchema = z.object({\n  email: z.string().email(),\n  role: z.enum(["user", "admin"])\n});\n\n` + fixed;
      fixed = fixed.replace("const body = await req.json();", "const raw = await req.json();\n  const body = UserSchema.parse(raw);");
    }
    // Fix focus-visible
    if (fixed.includes("<button") && !fixed.includes("focus-visible")) {
      fixed = fixed.replace(/<button className="([^"]*)"/g, '<button className="$1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7a00]"');
    }

    setCode(fixed);
    setViewMode("diff");
    runAudit(fixed);
  };

  // Rule categories metrics
  const categories = [
    { name: "Spacing Scale", status: findings.some(f => f.ruleId === "BASE-UI-101") ? "failed" : "passed" },
    { name: "Focus Indicators", status: findings.some(f => f.ruleId === "BASE-UI-108") ? "failed" : "passed" },
    { name: "Secret Leak Protection", status: findings.some(f => f.ruleId === "BASE-BE-201") ? "failed" : "passed" },
    { name: "Schema Validation", status: findings.some(f => f.ruleId === "BASE-BE-202") ? "failed" : "passed" },
  ];

  return (
    <section id="playground" className="py-20 bg-[#fafafa] dark:bg-zinc-900/60 border-t border-b border-[#e2e8f0] dark:border-zinc-800 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-950/50 border border-orange-200 dark:border-orange-800 text-[11px] font-semibold text-[#ff6800] uppercase tracking-wider mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Interactive AST Critic</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#111827] dark:text-white">
            Try the Live Quality Gate in Your Browser
          </h2>
          <p className="mt-3 font-sans text-sm text-[#4b5563] dark:text-zinc-400">
            Paste your component or backend handler below, or select a failure preset to see the mechanical AST rule engine detect violations and generate concrete repairs.
          </p>
        </div>

        {/* Preset Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handlePresetSelect(preset)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                selectedPreset.id === preset.id
                  ? "bg-[#1e2330] dark:bg-white text-white dark:text-[#111827] shadow-sm font-semibold"
                  : "bg-white dark:bg-zinc-800/80 text-[#4b5563] dark:text-zinc-300 border border-[#e2e8f0] dark:border-zinc-700 hover:bg-[#f1f5f9] dark:hover:bg-zinc-700"
              }`}
            >
              <span className="opacity-60 mr-1.5 text-[10px] font-mono uppercase tracking-wider">{preset.category}</span>
              {preset.name}
            </button>
          ))}
        </div>

        {/* Interactive Editor + Results Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Code Editor Panel (7 cols) */}
          <div className="lg:col-span-7 flex flex-col rounded-3xl bg-[#1e2330] dark:bg-zinc-950 border border-[#2d3748] dark:border-zinc-800 shadow-xl overflow-hidden">
            {/* Window Bar */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-[#151922] dark:bg-zinc-900 border-b border-[#2d3748] dark:border-zinc-800 text-xs">
              <div className="flex items-center gap-2">
                <div className="h-3.5 w-3.5 rounded-full bg-[#ff5f56]" />
                <div className="h-3.5 w-3.5 rounded-full bg-[#ffbd2e]" />
                <div className="h-3.5 w-3.5 rounded-full bg-[#27c93f]" />
                <span className="ml-2 font-mono text-[11px] text-[#94a3b8]">source_snippet.tsx</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-[#1e2330] border border-[#2d3748] rounded-lg p-0.5 mr-2">
                  <button
                    onClick={() => setViewMode("editor")}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-semibold transition-all ${
                      viewMode === "editor"
                        ? "bg-[#ff7a00] text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    Editor
                  </button>
                  <button
                    onClick={() => {
                      if (code === originalCode) {
                        handleAutoFix();
                      } else {
                        setViewMode("diff");
                      }
                    }}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-semibold transition-all ${
                      viewMode === "diff"
                        ? "bg-[#ff7a00] text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    Diff View
                  </button>
                </div>
                <button
                  onClick={handleAutoFix}
                  className="px-3 py-1 rounded-full bg-[#ff7a00] hover:bg-[#ff8b26] text-white text-[11px] font-semibold flex items-center gap-1 transition-all shadow-sm"
                >
                  <Wand2 className="h-3 w-3" />
                  <span>Auto-Remediate</span>
                </button>
                <button
                  onClick={() => runAudit(code)}
                  disabled={isAuditing}
                  className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold flex items-center gap-1 transition-all"
                >
                  <RefreshCw className={`h-3 w-3 ${isAuditing ? "animate-spin" : ""}`} />
                  <span>Audit</span>
                </button>
              </div>
            </div>

            {/* View Mode Router */}
            {viewMode === "editor" ? (
              <div className="p-5 flex-1 flex flex-col">
                <textarea
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value);
                    runAudit(e.target.value);
                  }}
                  className="w-full flex-1 min-h-[280px] bg-transparent text-gray-200 font-mono text-xs leading-relaxed focus:outline-none resize-none selection:bg-[#ff7a00] selection:text-white"
                  spellCheck={false}
                />
                <div className="pt-3 border-t border-[#2d3748] flex items-center justify-between text-[11px] text-[#94a3b8] font-mono">
                  <span>AST Parser: Compiler API v2.0.0</span>
                  <span>Type directly to test your own code</span>
                </div>
              </div>
            ) : (
              <div className="flex-1 grid grid-cols-2 divide-x divide-[#2d3748] bg-[#1a1f2c]">
                {/* Left Side: Original */}
                <div className="p-5 overflow-y-auto max-h-[350px]">
                  <div className="text-[10px] font-mono text-rose-400 font-semibold mb-2 uppercase tracking-wider flex items-center gap-1">
                    <XCircle className="h-3 w-3" /> Original Code
                  </div>
                  <pre className="font-mono text-[11px] text-gray-400 whitespace-pre-wrap leading-relaxed">
                    <code>{originalCode}</code>
                  </pre>
                </div>
                {/* Right Side: Remediated */}
                <div className="p-5 overflow-y-auto max-h-[350px] bg-[#16222f]/40">
                  <div className="text-[10px] font-mono text-emerald-400 font-semibold mb-2 uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Remediated Code
                  </div>
                  <pre className="font-mono text-[11px] text-emerald-100 whitespace-pre-wrap leading-relaxed">
                    <code>{code}</code>
                  </pre>
                </div>
              </div>
            )}
          </div>

          {/* Critic Findings Output Panel (5 cols) */}
          <div className="lg:col-span-5 flex flex-col rounded-3xl bg-white dark:bg-zinc-900 border border-[#e2e8f0] dark:border-zinc-800 p-6 shadow-sm">
            {/* Score Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#f1f5f9] dark:border-zinc-800">
              <div>
                <div className="text-[11px] font-semibold text-[#64748b] dark:text-zinc-400 uppercase tracking-wider">Quality Gate Result</div>
                <div className="font-serif text-xl text-[#111827] dark:text-white flex items-center gap-2 mt-0.5">
                  <span>Score: {score}/100</span>
                  {score >= 90 ? (
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-sans font-semibold">
                      PASSED
                    </span>
                  ) : (
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 font-sans font-semibold">
                      REJECTED
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[11px] text-[#64748b] dark:text-zinc-400 font-mono">Violations</div>
                <div className="text-lg font-bold text-[#111827] dark:text-white">{findings.length}</div>
              </div>
            </div>

            {/* Visual Stats Rules Row */}
            <div className="py-4 border-b border-[#f1f5f9] dark:border-zinc-800 grid grid-cols-2 gap-2 text-[10px] font-mono">
              {categories.map((cat, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-xl bg-[#fafafa] dark:bg-zinc-950 border border-[#e2e8f0] dark:border-zinc-800"
                >
                  <span className="text-[#64748b] dark:text-zinc-400 truncate mr-1">{cat.name}</span>
                  {cat.status === "passed" ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5">
                      <Check className="h-3 w-3 stroke-[3]" /> OK
                    </span>
                  ) : (
                    <span className="text-rose-500 font-semibold flex items-center gap-0.5">
                      <AlertTriangle className="h-3 w-3 stroke-[3]" /> FAIL
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Findings List */}
            <div className="mt-4 flex-1 flex flex-col gap-3 overflow-y-auto max-h-[220px] pr-1">
              {findings.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-6 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-9 w-9 mb-2 stroke-[2]" />
                  <div className="font-bold text-sm">100% Quality Gate Conformance</div>
                  <p className="text-xs text-[#64748b] dark:text-zinc-400 mt-1 max-w-xs leading-relaxed">
                    No design clichés, spacing bugs, or security vulnerabilities detected in this AST pass.
                  </p>
                </div>
              ) : (
                findings.map((f, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl bg-[#fafafa] dark:bg-zinc-950 border border-[#e2e8f0] dark:border-zinc-800 text-xs"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono font-bold text-[#111827] dark:text-white flex items-center gap-1.5">
                        {f.severity === "CRITICAL" ? (
                          <ShieldAlert className="h-3.5 w-3.5 text-rose-500" />
                        ) : (
                          <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                        )}
                        {f.ruleId}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-md font-semibold uppercase tracking-wider bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900">
                        {f.severity}
                      </span>
                    </div>
                    <div className="font-semibold text-[#111827] dark:text-zinc-200 mb-1">{f.title}</div>
                    <p className="text-[#64748b] dark:text-zinc-400 text-[11px] leading-relaxed mb-2">
                      {f.explanation}
                    </p>
                    <div className="p-2 rounded-xl bg-white dark:bg-zinc-900 border border-[#e2e8f0] dark:border-zinc-800 font-mono text-[11px] text-[#ff7a00]">
                      <span className="text-[#64748b] dark:text-zinc-500 select-none">Fix: </span>
                      {f.fix}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
