"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { BookOpen, Terminal, Shield, Cpu, Sparkles, Copy, Check, ArrowLeft, ArrowUpRight } from "lucide-react";

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("overview");
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const navItems = [
    { id: "overview", label: "1. Overview & Design Principles" },
    { id: "quickstart", label: "2. Quickstart & Installation" },
    { id: "mcp-setup", label: "3. MCP Client Configuration" },
    { id: "ruleset-ui", label: "4. UI/UX Critic Rules (18)" },
    { id: "ruleset-backend", label: "5. Backend Architecture Rules (18)" },
    { id: "presets", label: "6. Presets: Next.js & n8n" },
    { id: "cli-remediation", label: "7. CLI & Auto-Remediation" },
    { id: "model-pipeline", label: "8. Model Distillation & MLX LoRA" },
  ];

  return (
    <div className="min-h-screen bg-[#060a0f] text-white">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Header Breadcrumb */}
        <div className="flex items-center justify-between pb-6 border-b border-[#182430] font-mono text-xs text-[#90a4ae]">
          <div className="flex items-center gap-2">
            <Link href="/" className="hover:text-[#00e5ff] flex items-center gap-1">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Home</span>
            </Link>
            <span>/</span>
            <span className="text-white">Documentation</span>
          </div>
          <div className="text-[11px] text-[#546e7a]">
            VERSION: v1.0.0 CANONICAL SPEC
          </div>
        </div>

        {/* 2-Column Documentation Grid */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sidebar Nav (3 cols) */}
          <aside className="lg:col-span-3 sticky top-20 border border-[#182430] bg-[#0a1017] p-4 font-mono text-xs">
            <div className="text-white font-semibold mb-3 pb-2 border-b border-[#182430] flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-[#00e5ff]" />
              <span>TABLE OF CONTENTS</span>
            </div>
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className={`text-left px-2.5 py-1.5 transition-colors ${
                    activeSection === item.id
                      ? "bg-[#182430] text-[#00e5ff] font-semibold border-l-2 border-l-[#00e5ff]"
                      : "text-[#90a4ae] hover:text-white hover:bg-[#0e1620]"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Main Docs Body (9 cols) */}
          <main className="lg:col-span-9 flex flex-col gap-12 font-mono text-xs">
            {/* 1. Overview */}
            <section id="overview" className="border border-[#182430] bg-[#0a1017] p-6 lg:p-8">
              <div className="text-[11px] text-[#00e5ff] uppercase tracking-wider mb-2">SECTION 01</div>
              <h1 className="font-orbitron text-xl sm:text-2xl font-bold text-white uppercase">
                OVERVIEW & DESIGN PRINCIPLES
              </h1>
              <p className="mt-4 font-sans text-sm text-[#cfd8dc] leading-relaxed">
                <strong>Atelier</strong> is an open-source agent skill and Model Context Protocol (MCP) quality gate engineered for modern vibe-coding workflows. Unlike generic style rules that only enforce code minimalism, Atelier establishes two active post-generation quality critics:
              </p>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                <div className="border border-[#182430] bg-[#060a0f] p-4">
                  <div className="text-[#00e5ff] font-bold">1. UI/UX Critic</div>
                  <p className="mt-1 font-sans text-[#90a4ae] text-xs">
                    Guarantees visual hierarchy, strict 8px spacing scales, WCAG AA color contrast, responsive layout bounds, and eliminates unsemantic template clichés.
                  </p>
                </div>
                <div className="border border-[#182430] bg-[#060a0f] p-4">
                  <div className="text-[#00e5ff] font-bold">2. Backend Architecture Guard</div>
                  <p className="mt-1 font-sans text-[#90a4ae] text-xs">
                    Enforces zero plain-text secrets, mandatory transient error retries with exponential backoff, atomic database transactions, rate limiting, and exhaustive error boundaries.
                  </p>
                </div>
              </div>
            </section>

            {/* 2. Quickstart */}
            <section id="quickstart" className="border border-[#182430] bg-[#0a1017] p-6 lg:p-8">
              <div className="text-[11px] text-[#00e5ff] uppercase tracking-wider mb-2">SECTION 02</div>
              <h2 className="font-orbitron text-xl sm:text-2xl font-bold text-white uppercase">
                QUICKSTART & INSTALLATION
              </h2>
              <p className="mt-4 font-sans text-sm text-[#cfd8dc] leading-relaxed">
                Run the automated one-click setup script to compile the TypeScript MCP server, verify adapter synchronization across all 5 IDE targets, and test the critic tools:
              </p>

              <div className="mt-4 border border-[#182430] bg-[#060a0f] p-4">
                <div className="flex items-center justify-between text-[#546e7a] pb-2 border-b border-[#182430] mb-3">
                  <span>Terminal Setup</span>
                  <button
                    onClick={() => handleCopy("quickstart-cmd", "git clone https://github.com/anshrajore/atelier-mcp.git && cd atelier-mcp && ./setup.sh")}
                    className="hover:text-white flex items-center gap-1"
                  >
                    {copied === "quickstart-cmd" ? <Check className="h-3 w-3 text-[#00e5ff]" /> : <Copy className="h-3 w-3" />}
                    <span>{copied === "quickstart-cmd" ? "Copied" : "Copy"}</span>
                  </button>
                </div>
                <pre className="text-[#cfd8dc] leading-relaxed overflow-x-auto">
                  <code>
{`git clone https://github.com/anshrajore/atelier-mcp.git
cd atelier-mcp
./setup.sh`}
                  </code>
                </pre>
              </div>
            </section>

            {/* 3. MCP Setup */}
            <section id="mcp-setup" className="border border-[#182430] bg-[#0a1017] p-6 lg:p-8">
              <div className="text-[11px] text-[#00e5ff] uppercase tracking-wider mb-2">SECTION 03</div>
              <h2 className="font-orbitron text-xl sm:text-2xl font-bold text-white uppercase">
                MCP CLIENT CONFIGURATION
              </h2>
              <p className="mt-4 font-sans text-sm text-[#cfd8dc] leading-relaxed">
                Configure Atelier with Claude Desktop, Cursor, or Windsurf by adding the MCP server entry to your settings JSON:
              </p>

              <div className="mt-4 border border-[#182430] bg-[#060a0f] p-4">
                <div className="flex items-center justify-between text-[#546e7a] pb-2 border-b border-[#182430] mb-3">
                  <span>claude_desktop_config.json / cursor.mcp.json</span>
                  <button
                    onClick={() => handleCopy("mcp-json", JSON.stringify({
                      mcpServers: {
                        atelier: {
                          command: "node",
                          args: ["/absolute/path/to/atelier/mcp-server/dist/index.js"],
                          env: { ATELIER_LLM_PROVIDER: "heuristic" }
                        }
                      }
                    }, null, 2))}
                    className="hover:text-white flex items-center gap-1"
                  >
                    {copied === "mcp-json" ? <Check className="h-3 w-3 text-[#00e5ff]" /> : <Copy className="h-3 w-3" />}
                    <span>{copied === "mcp-json" ? "Copied" : "Copy"}</span>
                  </button>
                </div>
                <pre className="text-[#cfd8dc] leading-relaxed overflow-x-auto">
                  <code>
{`{
  "mcpServers": {
    "atelier": {
      "command": "node",
      "args": ["/absolute/path/to/atelier/mcp-server/dist/index.js"],
      "env": {
        "ATELIER_LLM_PROVIDER": "heuristic"
      }
    }
  }
}`}
                  </code>
                </pre>
              </div>
            </section>

            {/* 4. UI Rules */}
            <section id="ruleset-ui" className="border border-[#182430] bg-[#0a1017] p-6 lg:p-8">
              <div className="text-[11px] text-[#00e5ff] uppercase tracking-wider mb-2">SECTION 04</div>
              <h2 className="font-orbitron text-xl sm:text-2xl font-bold text-white uppercase">
                UI/UX CRITIC RULES (18 CHECKS)
              </h2>
              <div className="mt-6 flex flex-col gap-3">
                {[
                  { id: "BASE-UI-101", name: "Arbitrary 8px Spacing Grid", desc: "Forbids ad-hoc pixel values (e.g. p-[19px], m-[23px]). Enforces strict multiples of 4px/8px." },
                  { id: "BASE-UI-102", name: "Fluid Responsive Layout Scaling", desc: "Prevents overflow clipping and horizontal scroll from 375px to 4K displays." },
                  { id: "BASE-UI-103", name: "WCAG AA Contrast Ratio (4.5:1)", desc: "Enforces 4.5:1 normal text contrast and 3:1 large text contrast." },
                  { id: "BASE-UI-104", name: "Typography & Line-Height Bounds", desc: "Rejects huge untracked typefaces; mandates proportional leading." },
                  { id: "BASE-UI-105", name: "Visual Hierarchy & Token Discipline", desc: "Caps font weights at 3 per view and requires tokenized surface palettes." },
                  { id: "BASE-UI-106", name: "Anti-Cliché Decorative Ceiling", desc: "Blocks rainbow gradients, glowing outlines, icon-stuffed bentos, and pulsing pills." },
                ].map((r) => (
                  <div key={r.id} className="border border-[#182430] bg-[#060a0f] p-3 flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[#00e5ff] font-bold">{r.id}</span>
                      <span className="text-[#546e7a] text-[10px]">MECHANICAL AST</span>
                    </div>
                    <div className="text-white font-medium">{r.name}</div>
                    <div className="text-[#90a4ae] text-xs font-sans">{r.desc}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* 5. Backend Rules */}
            <section id="ruleset-backend" className="border border-[#182430] bg-[#0a1017] p-6 lg:p-8">
              <div className="text-[11px] text-[#00e5ff] uppercase tracking-wider mb-2">SECTION 05</div>
              <h2 className="font-orbitron text-xl sm:text-2xl font-bold text-white uppercase">
                BACKEND ARCHITECTURE RULES (18 CHECKS)
              </h2>
              <div className="mt-6 flex flex-col gap-3">
                {[
                  { id: "BASE-BE-101", name: "Zero Plaintext Secrets / Tokens", desc: "Scans for hardcoded JWTs, AWS keys, Stripe tokens, and connection strings." },
                  { id: "BASE-BE-102", name: "Transient Error Retries & Backoff", desc: "External I/O calls must configure timeout signals and exponential backoff." },
                  { id: "BASE-BE-103", name: "Atomic Multi-Entity Transactions", desc: "Database mutations spanning multiple tables must run in ACID transactions." },
                  { id: "BASE-BE-104", name: "Exhaustive Error Catch Boundaries", desc: "Guarantees all promises and route handlers catch errors and emit structured JSON." },
                  { id: "BASE-BE-105", name: "Strict Input Sanitization & Schemas", desc: "Requires runtime schema validation (Zod) on external parameters and payloads." },
                  { id: "BASE-BE-106", name: "Explicit Rate Limiting & Throttling", desc: "Public API endpoints must define rate limit headers and 429 status handlers." },
                ].map((r) => (
                  <div key={r.id} className="border border-[#182430] bg-[#060a0f] p-3 flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[#00e5ff] font-bold">{r.id}</span>
                      <span className="text-[#546e7a] text-[10px]">REGEX / SCHEMA</span>
                    </div>
                    <div className="text-white font-medium">{r.name}</div>
                    <div className="text-[#90a4ae] text-xs font-sans">{r.desc}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* 6. CLI & Auto-Remediation */}
            <section id="cli-remediation" className="border border-[#182430] bg-[#0a1017] p-6 lg:p-8">
              <div className="text-[11px] text-[#00e5ff] uppercase tracking-wider mb-2">SECTION 06</div>
              <h2 className="font-orbitron text-xl sm:text-2xl font-bold text-white uppercase">
                CLI & AUTO-REMEDIATION
              </h2>
              <p className="mt-4 font-sans text-sm text-[#cfd8dc] leading-relaxed">
                Atelier ships with a standalone CLI (<code className="text-[#00e5ff]">bin/atelier.js</code>) that can audit and fix files directly from your terminal:
              </p>

              <div className="mt-4 border border-[#182430] bg-[#060a0f] p-4">
                <pre className="text-[#cfd8dc] leading-relaxed overflow-x-auto">
                  <code>
{`# Audit code for 36 rules
node bin/atelier.js audit ./src/components/Hero.tsx

# Auto-remediate arbitrary spacing and template clichés in-place
node bin/atelier.js fix ./src/components

# Install quality gate adapters across your local editors
node bin/atelier.js install all`}
                  </code>
                </pre>
              </div>
            </section>

            {/* 7. Model Distillation & MLX LoRA */}
            <section id="model-pipeline" className="border border-[#182430] bg-[#0a1017] p-6 lg:p-8">
              <div className="text-[11px] text-[#00e5ff] uppercase tracking-wider mb-2">SECTION 07</div>
              <h2 className="font-orbitron text-xl sm:text-2xl font-bold text-white uppercase">
                MODEL DISTILLATION & MLX LoRA
              </h2>
              <p className="mt-4 font-sans text-sm text-[#cfd8dc] leading-relaxed">
                Atelier provides an Apple Silicon MLX LoRA fine-tuning pipeline (<code className="text-[#00e5ff]">model/train/train_mlx.py</code>) that fine-tunes Qwen2.5-1.5B/7B into a dedicated, self-hostable critic:
              </p>

              <div className="mt-4 border border-[#182430] bg-[#060a0f] p-4">
                <pre className="text-[#cfd8dc] leading-relaxed overflow-x-auto">
                  <code>
{`# Run standalone MLX LoRA fine-tuning (Apple Silicon GPU)
python3 model/train/train_mlx.py

# Generated adapter weights:
# model/output/atelier-qwen-1.5b-lora/adapters.safetensors (10.8 MB)`}
                  </code>
                </pre>
              </div>
            </section>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
