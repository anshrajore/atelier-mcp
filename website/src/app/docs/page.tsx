"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { BookOpen, Copy, Check, ArrowLeft } from "lucide-react";

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("overview");
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const navItems = [
    { id: "overview", label: "1. Overview & Principles" },
    { id: "quickstart", label: "2. Quickstart & Setup" },
    { id: "mcp-setup", label: "3. MCP Configuration" },
    { id: "ruleset-ui", label: "4. UI/UX Critic Rules" },
    { id: "ruleset-backend", label: "5. Backend Guard Rules" },
    { id: "cli-remediation", label: "6. Standalone CLI" },
    { id: "model-pipeline", label: "7. Model Distillation" },
  ];

  return (
    <div className="min-h-screen bg-white text-[#111827]">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Header Breadcrumb */}
        <div className="flex items-center justify-between pb-6 border-b border-[#f1f5f9] text-xs text-[#64748b]">
          <div className="flex items-center gap-2">
            <Link href="/" className="hover:text-[#111827] flex items-center gap-1 font-medium">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Home</span>
            </Link>
            <span>/</span>
            <span className="text-[#111827] font-semibold">Documentation</span>
          </div>
          <div className="text-[11px] font-mono text-[#94a3b8]">
            SPEC: v1.0.0 CANONICAL
          </div>
        </div>

        {/* 2-Column Documentation Grid */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sidebar Nav (3 cols) */}
          <aside className="lg:col-span-3 sticky top-20 rounded-3xl bg-[#fafafa] border border-[#e2e8f0] p-5 text-xs">
            <div className="text-[#111827] font-bold mb-3 pb-2 border-b border-[#e2e8f0] flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-[#ff7a00]" />
              <span>CONTENTS</span>
            </div>
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className={`text-left px-3 py-2 rounded-xl transition-all ${
                    activeSection === item.id
                      ? "bg-white text-[#111827] font-semibold shadow-sm border border-[#e2e8f0]"
                      : "text-[#64748b] hover:text-[#111827] hover:bg-white/60"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Main Docs Body (9 cols) */}
          <main className="lg:col-span-9 flex flex-col gap-12 text-xs">
            {/* 1. Overview */}
            <section id="overview" className="rounded-3xl bg-[#fafafa] border border-[#e2e8f0] p-8">
              <div className="text-[11px] font-semibold text-[#ff7a00] uppercase tracking-wider mb-2">SECTION 01</div>
              <h1 className="font-serif text-2xl sm:text-3xl font-normal text-[#111827]">
                Overview & Design Principles
              </h1>
              <p className="mt-4 font-sans text-sm text-[#4b5563] leading-relaxed">
                <strong>Atelier</strong> is an open-source agent skill and Model Context Protocol (MCP) quality gate engineered for modern vibe-coding workflows. Unlike generic style rules that only enforce code minimalism, Atelier establishes two active post-generation quality critics:
              </p>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl bg-white border border-[#e2e8f0] p-5 shadow-sm">
                  <div className="text-[#111827] font-bold text-sm">1. UI/UX Critic</div>
                  <p className="mt-1 text-[#64748b] text-xs leading-relaxed">
                    Guarantees visual hierarchy, strict 8px spacing scales, WCAG AA color contrast, responsive layout bounds, and eliminates unsemantic template clichés.
                  </p>
                </div>
                <div className="rounded-2xl bg-white border border-[#e2e8f0] p-5 shadow-sm">
                  <div className="text-[#111827] font-bold text-sm">2. Backend Architecture Guard</div>
                  <p className="mt-1 text-[#64748b] text-xs leading-relaxed">
                    Enforces zero plain-text secrets, mandatory transient error retries with exponential backoff, atomic database transactions, rate limiting, and exhaustive error boundaries.
                  </p>
                </div>
              </div>
            </section>

            {/* 2. Quickstart */}
            <section id="quickstart" className="rounded-3xl bg-[#fafafa] border border-[#e2e8f0] p-8">
              <div className="text-[11px] font-semibold text-[#ff7a00] uppercase tracking-wider mb-2">SECTION 02</div>
              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#111827]">
                Quickstart & Installation
              </h2>
              <p className="mt-4 font-sans text-sm text-[#4b5563] leading-relaxed">
                Run the automated one-click setup script to compile the TypeScript MCP server, verify adapter synchronization across all 5 IDE targets, and test the critic tools:
              </p>

              <div className="mt-6 rounded-2xl bg-[#1e2330] text-white p-5">
                <div className="flex items-center justify-between text-[#94a3b8] pb-2 border-b border-[#2d3748] mb-3">
                  <span className="font-mono text-xs">Terminal Setup</span>
                  <button
                    onClick={() => handleCopy("quickstart-cmd", "git clone https://github.com/anshrajore/atelier-mcp.git && cd atelier-mcp && ./setup.sh")}
                    className="hover:text-white flex items-center gap-1 text-xs"
                  >
                    {copied === "quickstart-cmd" ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copied === "quickstart-cmd" ? "Copied" : "Copy"}</span>
                  </button>
                </div>
                <pre className="text-gray-200 font-mono text-xs leading-relaxed overflow-x-auto">
                  <code>
{`git clone https://github.com/anshrajore/atelier-mcp.git
cd atelier-mcp
./setup.sh`}
                  </code>
                </pre>
              </div>
            </section>

            {/* 3. MCP Setup */}
            <section id="mcp-setup" className="rounded-3xl bg-[#fafafa] border border-[#e2e8f0] p-8">
              <div className="text-[11px] font-semibold text-[#ff7a00] uppercase tracking-wider mb-2">SECTION 03</div>
              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#111827]">
                MCP Client Configuration
              </h2>
              <p className="mt-4 font-sans text-sm text-[#4b5563] leading-relaxed">
                Configure Atelier with Claude Desktop, Cursor, or Windsurf by adding the MCP server entry to your settings JSON:
              </p>

              <div className="mt-6 rounded-2xl bg-[#1e2330] text-white p-5">
                <div className="flex items-center justify-between text-[#94a3b8] pb-2 border-b border-[#2d3748] mb-3">
                  <span className="font-mono text-xs">mcp_config.json</span>
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
                    className="hover:text-white flex items-center gap-1 text-xs"
                  >
                    {copied === "mcp-json" ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copied === "mcp-json" ? "Copied" : "Copy"}</span>
                  </button>
                </div>
                <pre className="text-gray-200 font-mono text-xs leading-relaxed overflow-x-auto">
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
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
