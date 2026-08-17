"use client";

import React, { useState } from "react";
import { Shield, Sparkles, Terminal, CheckCircle2, Filter } from "lucide-react";

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
    <section id="ruleset" className="border-b border-[#182430] bg-[#060a0f] py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <div className="font-mono text-xs text-[#00e5ff] tracking-wider uppercase mb-2">
            CANONICAL RULE SPECIFICATION
          </div>
          <h2 className="font-orbitron text-2xl sm:text-4xl font-bold tracking-tight text-white uppercase max-w-3xl">
            36 MECHANICALLY GRADEABLE QUALITY CHECKS
          </h2>
          <p className="mt-4 max-w-2xl font-sans text-sm sm:text-base text-[#90a4ae] leading-relaxed">
            Every rule is defined in <code className="text-[#00e5ff] font-mono">skills/atelier/SKILL.md</code> with exact pass/fail signatures, AST labeling checks, and automated fixes.
          </p>

          {/* Filter Bar */}
          <div className="mt-8 flex items-center border border-[#182430] bg-[#0a1017] p-1 font-mono text-xs">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-1.5 transition-colors ${
                filter === "all"
                  ? "bg-[#182430] text-[#00e5ff] font-semibold"
                  : "text-[#90a4ae] hover:text-white"
              }`}
            >
              All Rules (36)
            </button>
            <button
              onClick={() => setFilter("ui")}
              className={`px-4 py-1.5 transition-colors flex items-center gap-1.5 ${
                filter === "ui"
                  ? "bg-[#182430] text-[#00e5ff] font-semibold"
                  : "text-[#90a4ae] hover:text-white"
              }`}
            >
              <Sparkles className="h-3 w-3" />
              <span>UI/UX Critic (18)</span>
            </button>
            <button
              onClick={() => setFilter("backend")}
              className={`px-4 py-1.5 transition-colors flex items-center gap-1.5 ${
                filter === "backend"
                  ? "bg-[#182430] text-[#00e5ff] font-semibold"
                  : "text-[#90a4ae] hover:text-white"
              }`}
            >
              <Terminal className="h-3 w-3" />
              <span>Backend Guard (18)</span>
            </button>
          </div>
        </div>

        {/* Rules Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
          {filteredRules.map((r) => (
            <div
              key={r.id}
              className="border border-[#182430] bg-[#0a1017] p-5 flex flex-col justify-between hover:border-[#00e5ff]/50 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-[#182430]">
                  <span className="text-[#00e5ff] font-bold">{r.id}</span>
                  <span className="text-[10px] px-1.5 py-0.5 border border-[#182430] bg-[#060a0f] text-[#90a4ae] uppercase">
                    {r.cat === "ui" ? "UI/UX" : "BACKEND"}
                  </span>
                </div>
                <h3 className="mt-3 font-orbitron font-semibold text-white text-xs tracking-wide">
                  {r.name}
                </h3>
                <p className="mt-2 font-sans text-xs text-[#90a4ae] leading-relaxed">
                  {r.desc}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#182430] text-[10px] text-[#546e7a] flex items-center justify-between">
                <span>MECHANICAL AST CHECK</span>
                <span className="text-[#00e5ff]">AUTO-FIX AVAILABLE</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
