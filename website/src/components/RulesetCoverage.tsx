"use client";

import React, { useState } from "react";
import { Sparkles, Terminal } from "lucide-react";

export const RulesetCoverage = () => {
  const [filter, setFilter] = useState<"all" | "ui" | "backend">("all");

  const rules = [
    // Core UI/UX
    { id: "BASE-UI-101", cat: "ui", name: "Arbitrary 8px Spacing Grid", desc: "Forbids ad-hoc pixel margins/paddings (`p-[19px]`, `gap-[13px]`). Enforces strict 4px/8px modular scale." },
    { id: "BASE-UI-102", cat: "ui", name: "Fluid Responsive Layout Scaling", desc: "Guarantees components adapt from mobile (375px) to 4K displays without horizontal content clipping." },
    { id: "BASE-UI-103", cat: "ui", name: "WCAG AA Contrast Ratio (4.5:1)", desc: "Enforces minimum 4.5:1 text-to-background contrast across all interactive and informative states." },
    { id: "BASE-UI-104", cat: "ui", name: "Typography & Line-Height Bounds", desc: "Disallows oversized untracked type; requires proportional line heights (`leading-relaxed`, `leading-snug`)." },
    { id: "BASE-UI-105", cat: "ui", name: "Visual Hierarchy & Token Discipline", desc: "Restricts page to 2 font families, maximum 3 font weights, and semantic tokenized surface colors." },
    { id: "BASE-UI-106", cat: "ui", name: "Anti-Cliché Decorative Ceiling", desc: "Rejects unsemantic rainbow gradients, glowing borders, icon-stuffed bento boxes, and headline biscuit pills." },

    // Next.js / Tailwind UI Preset
    { id: "NEXT-UI-101", cat: "ui", name: "No Raw <img> Without Next/Image", desc: "Mandates next/image with explicit width, height, and priority tags to prevent Layout Shift (CLS)." },
    { id: "NEXT-UI-102", cat: "ui", name: "Client Boundary Minimization", desc: "Enforces default React Server Components; limits 'use client' strictly to interactive leaves." },
    { id: "NEXT-UI-103", cat: "ui", name: "Semantic Heading Hierarchy (Single H1)", desc: "Ensures strictly one H1 per page followed by logically ordered H2-H6 heading tags for accessibility." },
    { id: "NEXT-UI-104", cat: "ui", name: "Clean CSS Token Architecture", desc: "Forbids arbitrary ad-hoc inline styles; requires Tailwind design tokens defined in theme config." },
    { id: "NEXT-UI-105", cat: "ui", name: "Focus-Visible Indicator Enforcement", desc: "Interactive buttons, inputs, and links must define explicit focus-visible rings for keyboard navigation." },
    { id: "NEXT-UI-106", cat: "ui", name: "Fluid Container Breakpoints", desc: "Rejects hardcoded container widths (`w-[980px]`) in favor of fluid `max-w-7xl px-4 sm:px-6` constraints." },

    // Core Backend
    { id: "BASE-BE-101", cat: "backend", name: "Zero Plaintext Secrets / Tokens", desc: "Scans for hardcoded JWTs, AWS keys, Stripe tokens, and connection strings; mandates environment configs." },
    { id: "BASE-BE-102", cat: "backend", name: "Transient Error Retries & Backoff", desc: "All external network I/O calls must configure timeouts and exponential backoff on 5xx responses." },
    { id: "BASE-BE-103", cat: "backend", name: "Atomic Multi-Entity Transactions", desc: "Database mutations touching multiple tables must run within explicit ACID transaction boundaries." },
    { id: "BASE-BE-104", cat: "backend", name: "Exhaustive Error Catch Boundaries", desc: "Guarantees all asynchronous promises and route handlers catch errors and emit structured JSON." },
    { id: "BASE-BE-105", cat: "backend", name: "Strict Input Sanitization & Schemas", desc: "Requires runtime validation (e.g. Zod, Joi) on all external parameters and request payloads." },
    { id: "BASE-BE-106", cat: "backend", name: "Explicit Rate Limiting & Throttling", desc: "Public API endpoints must define rate limit headers, bucket sizes, and 429 status handlers." },

    // n8n Backend Workflow Preset
    { id: "N8N-BE-101", cat: "backend", name: "Credential Separation via Vaults", desc: "Forbids inline API keys in n8n Function/Code nodes; enforces n8n credential vault references." },
    { id: "N8N-BE-102", cat: "backend", name: "Deterministic Schema Assertions", desc: "Requires node output schemas to be strictly defined before downstream JSON mapping." },
    { id: "N8N-BE-103", cat: "backend", name: "Pagination & Batch Size Caps", desc: "Loops fetching external APIs must specify maximum batch sizes (default 50) and cursor pagination." },
    { id: "N8N-BE-104", cat: "backend", name: "Idempotent Webhook Processing", desc: "Webhook receivers must check unique idempotency keys to prevent duplicate transaction execution." },
    { id: "N8N-BE-105", cat: "backend", name: "Exhaustive Error Trigger Branches", desc: "Requires 'On Error: Continue' nodes to wire into dedicated notification/dead-letter queue branches." },
    { id: "N8N-BE-106", cat: "backend", name: "Sanitized Logging (No PII Leakage)", desc: "Logs emitted to external monitoring tools must mask sensitive personal and financial attributes." },
  ];

  const filteredRules = filter === "all" ? rules : rules.filter((r) => r.cat === filter);

  return (
    <section id="ruleset" className="py-24 bg-white border-b border-[#f1f5f9]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <div className="text-xs font-semibold tracking-widest text-[#ff7a00] uppercase mb-3">
            CANONICAL RULE SPECIFICATION
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#111827] max-w-3xl tracking-tight leading-tight">
            36 Mechanically Gradeable Quality Checks
          </h2>
          <p className="mt-4 max-w-2xl font-sans text-sm sm:text-base text-[#64748b] leading-relaxed">
            Every rule is defined in <code className="text-[#111827] font-semibold">skills/atelier/SKILL.md</code> with exact pass/fail signatures, AST labeling checks, and automated fixes.
          </p>

          {/* Clean Pill Tab Switcher */}
          <div className="mt-8 flex items-center p-1 bg-[#f1f5f9] rounded-full text-xs font-medium">
            <button
              onClick={() => setFilter("all")}
              className={`px-6 py-2 rounded-full transition-all ${
                filter === "all"
                  ? "bg-white text-[#111827] shadow-sm font-semibold"
                  : "text-[#64748b] hover:text-[#111827]"
              }`}
            >
              All Rules (36)
            </button>
            <button
              onClick={() => setFilter("ui")}
              className={`px-6 py-2 rounded-full transition-all flex items-center gap-1.5 ${
                filter === "ui"
                  ? "bg-white text-[#111827] shadow-sm font-semibold"
                  : "text-[#64748b] hover:text-[#111827]"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-[#ff7a00]" />
              <span>UI/UX Critic (18)</span>
            </button>
            <button
              onClick={() => setFilter("backend")}
              className={`px-6 py-2 rounded-full transition-all flex items-center gap-1.5 ${
                filter === "backend"
                  ? "bg-white text-[#111827] shadow-sm font-semibold"
                  : "text-[#64748b] hover:text-[#111827]"
              }`}
            >
              <Terminal className="h-3.5 w-3.5 text-[#2563eb]" />
              <span>Backend Guard (18)</span>
            </button>
          </div>
        </div>

        {/* Rules Grid */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-sans text-xs">
          {filteredRules.map((r) => (
            <div
              key={r.id}
              className="rounded-3xl bg-[#fafafa] border border-[#e2e8f0] p-6 flex flex-col justify-between hover:border-[#cbd5e1] hover:shadow-sm transition-all"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#e2e8f0]">
                  <span className="font-mono text-[#111827] font-bold text-xs">{r.id}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white border border-[#e2e8f0] text-[#64748b] uppercase">
                    {r.cat === "ui" ? "UI/UX" : "BACKEND"}
                  </span>
                </div>
                <h3 className="mt-4 font-semibold text-[#111827] text-sm">
                  {r.name}
                </h3>
                <p className="mt-2 text-[#64748b] leading-relaxed">
                  {r.desc}
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-[#e2e8f0] text-[11px] text-[#64748b] flex items-center justify-between font-mono">
                <span>MECHANICAL AST</span>
                <span className="text-emerald-600 font-medium">AUTO-FIX READY</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
