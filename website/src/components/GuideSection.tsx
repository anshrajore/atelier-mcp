"use client";

import React, { useState } from "react";
import {
  BookOpen,
  Terminal,
  Settings,
  Layers,
  Copy,
  Check,
  ChevronRight,
  Monitor,
  Zap,
  Shield,
  ArrowRight,
  Code2,
  FileCode,
  Workflow,
} from "lucide-react";

const steps = [
  {
    id: "install",
    icon: Terminal,
    title: "Install the CLI",
    subtitle: "One command — zero config. Works on macOS, Linux & Windows.",
    description:
      "Atelier runs as a global npx command. No signup, no API key, no config files. It downloads once and caches automatically.",
    code: `# Install & run (auto-caches after first use)
npx -y atelier-quality-gate help

# Verify installation — shows version + system info
npx -y atelier-quality-gate info`,
    tip: "The -y flag auto-confirms the install prompt. Works in CMD, PowerShell, Git Bash, WSL, and all Unix terminals.",
  },
  {
    id: "audit",
    icon: Shield,
    title: "Audit Your Code",
    subtitle: "Scan files or entire directories against 36 deterministic rules.",
    description:
      "The audit command checks for UI spacing violations, missing focus rings, raw <img> tags, hardcoded secrets, unvalidated inputs, and more. Each file gets a score from 0–100.",
    code: `# Audit a single file
npx -y atelier-quality-gate audit ./src/components/Hero.tsx

# Audit an entire directory (recursive)
npx -y atelier-quality-gate audit ./src

# Output shows per-file scores + specific violations with fix suggestions`,
    tip: "Files scoring below 80/100 need attention. Critical findings (like hardcoded secrets) drop the score by 15 points each.",
  },
  {
    id: "fix",
    icon: Zap,
    title: "Auto-Fix Violations",
    subtitle: "Automatically remediate spacing & design rule violations in-place.",
    description:
      "The fix command rewrites non-harmonic spacing values (e.g. 13px → 12px, 7px → 8px) to align with the 4px grid system. It modifies files in-place — commit your changes first.",
    code: `# Fix a single file
npx -y atelier-quality-gate fix ./src/components/Hero.tsx

# Fix an entire directory
npx -y atelier-quality-gate fix ./src/components

# Always audit after fixing to confirm score improvement
npx -y atelier-quality-gate audit ./src`,
    tip: "The fix command currently handles spacing rules (BASE-UI-101). Other violations like missing focus rings or hardcoded secrets require manual remediation using the suggested fixes.",
  },
  {
    id: "adapters",
    icon: Monitor,
    title: "Install IDE Adapters",
    subtitle: "Inject quality gate rules into Cursor, Windsurf, Claude Code, Copilot, or Antigravity.",
    description:
      "Adapters are instruction files that teach your AI coding assistant the Atelier ruleset. When installed, every code generation is automatically constrained by the 36 quality rules.",
    code: `# Install adapters for ALL supported IDEs at once
npx -y atelier-quality-gate install all

# Or install for a specific editor
npx -y atelier-quality-gate install cursor
npx -y atelier-quality-gate install windsurf
npx -y atelier-quality-gate install claude
npx -y atelier-quality-gate install copilot
npx -y atelier-quality-gate install antigravity`,
    tip: "Adapter files are placed in your project root. For Cursor: .cursorrules + .cursor/rules/atelier.mdc. For Copilot: .github/copilot-instructions.md. For Claude Code: CLAUDE.md + AGENTS.md.",
    files: [
      { editor: "Cursor", files: ".cursorrules, .cursor/rules/atelier.mdc" },
      { editor: "Windsurf", files: ".windsurfrules" },
      { editor: "Claude Code", files: "CLAUDE.md, AGENTS.md" },
      { editor: "GitHub Copilot", files: ".github/copilot-instructions.md" },
      { editor: "Antigravity", files: ".agents/rules/atelier.md" },
    ],
  },
  {
    id: "mcp",
    icon: Layers,
    title: "Connect as MCP Server",
    subtitle: "Add Atelier as a Model Context Protocol server in your IDE for real-time critique.",
    description:
      "MCP (Model Context Protocol) lets your IDE call Atelier's critique tools directly during conversations. This enables real-time quality feedback as your AI assistant generates code.",
    code: `// Add this to your IDE's MCP configuration:
// Cursor:    .cursor/mcp.json
// Windsurf:  ~/.codeium/windsurf/mcp_config.json
// Claude:    ~/Library/Application Support/Claude/claude_desktop_config.json
// Copilot:   .github/copilot-mcp.json

{
  "mcpServers": {
    "atelier": {
      "command": "npx",
      "args": ["-y", "atelier-quality-gate", "serve"],
      "env": {
        "ATELIER_LLM_PROVIDER": "heuristic"
      }
    }
  }
}`,
    tip: 'After adding the config, restart your IDE. You\'ll see Atelier\'s tools (critique_ui, critique_backend, generate_fix) available in MCP. The "heuristic" provider runs fully offline — no API key needed.',
    configs: [
      {
        ide: "Cursor",
        path: ".cursor/mcp.json",
        note: "Create in your project root",
      },
      {
        ide: "Windsurf",
        path: "~/.codeium/windsurf/mcp_config.json",
        note: "Global config for all projects",
      },
      {
        ide: "Claude Desktop",
        path: "~/Library/Application Support/Claude/claude_desktop_config.json",
        note: "macOS path (Windows: %APPDATA%\\Claude\\)",
      },
      {
        ide: "VS Code + Copilot",
        path: ".github/copilot-mcp.json",
        note: "Per-project config",
      },
    ],
  },
  {
    id: "workflow",
    icon: Workflow,
    title: "Recommended Workflow",
    subtitle: "How to integrate Atelier into your daily development loop.",
    description:
      "The recommended workflow is: generate code with your AI assistant → audit the output → fix mechanical violations → review remaining issues manually. Repeat until score ≥ 90.",
    code: `# Step 1: Generate code with your AI assistant (Cursor, Copilot, etc.)
# Your adapter files ensure the AI follows the 36 rules during generation

# Step 2: Audit the generated output
npx -y atelier-quality-gate audit ./src

# Step 3: Auto-fix what can be fixed mechanically
npx -y atelier-quality-gate fix ./src

# Step 4: Re-audit to verify improvements
npx -y atelier-quality-gate audit ./src

# Step 5: Manually fix remaining violations using the suggested fixes
# (focus rings, next/image, secrets, input validation, etc.)`,
    tip: "Target a minimum score of 90/100 across all files. Integrate the audit step into your CI/CD pipeline to block merges with scores below your threshold.",
  },
];

export const GuideSection = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const step = steps[activeStep];
  const StepIcon = step.icon;

  return (
    <section
      id="guide"
      className="py-24 px-6 bg-gradient-to-b from-[#fafaf9] to-white dark:from-[#0b1120] dark:to-[#090d16] transition-colors duration-300"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[#ff7a00] mb-4">
            <BookOpen className="w-4 h-4" />
            Step-by-Step Guide
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-semibold text-[#111827] dark:text-white mb-4">
            How to Use Atelier
          </h2>
          <p className="text-lg text-[#6b7280] dark:text-[#94a3b8] max-w-2xl mx-auto">
            From zero to fully integrated quality gate in under 5 minutes.
            Follow each step to set up audit, auto-fix, IDE adapters, and MCP.
          </p>
        </div>

        {/* Step Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                onClick={() => setActiveStep(i)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#ff7a00] focus-visible:outline-none ${
                  activeStep === i
                    ? "bg-[#ff7a00] text-white shadow-lg shadow-[#ff7a00]/20"
                    : "bg-white dark:bg-[#111827] text-[#6b7280] dark:text-[#94a3b8] hover:bg-[#f3f4f6] dark:hover:bg-[#1e293b] border border-[#e5e7eb] dark:border-[#1e293b]"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{s.title}</span>
                <span className="sm:hidden">Step {i + 1}</span>
              </button>
            );
          })}
        </div>

        {/* Active Step Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Info */}
          <div className="space-y-6">
            {/* Step Badge */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#ff7a00]/10 dark:bg-[#ff7a00]/20 flex items-center justify-center">
                <StepIcon className="w-5 h-5 text-[#ff7a00]" />
              </div>
              <div>
                <span className="text-xs font-mono text-[#ff7a00] uppercase tracking-wider">
                  Step {activeStep + 1} of {steps.length}
                </span>
                <h3 className="text-2xl font-semibold text-[#111827] dark:text-white">
                  {step.title}
                </h3>
              </div>
            </div>

            <p className="text-lg text-[#374151] dark:text-[#cbd5e1] font-medium">
              {step.subtitle}
            </p>

            <p className="text-[#6b7280] dark:text-[#94a3b8] leading-relaxed">
              {step.description}
            </p>

            {/* Tip Box */}
            <div className="bg-[#fffbeb] dark:bg-[#ff7a00]/10 border border-[#fcd34d]/40 dark:border-[#ff7a00]/20 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Zap className="w-4 h-4 text-[#f59e0b] dark:text-[#ff7a00] mt-0.5 shrink-0" />
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#92400e] dark:text-[#ff7a00]">
                    Pro Tip
                  </span>
                  <p className="text-sm text-[#78350f] dark:text-[#e2e8f0] mt-1 leading-relaxed">
                    {step.tip}
                  </p>
                </div>
              </div>
            </div>

            {/* File mapping table (for adapters step) */}
            {step.files && (
              <div className="bg-white dark:bg-[#111827] rounded-xl border border-[#e5e7eb] dark:border-[#1e293b] overflow-hidden">
                <div className="px-4 py-3 bg-[#f9fafb] dark:bg-[#0f172a] border-b border-[#e5e7eb] dark:border-[#1e293b]">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#6b7280] dark:text-[#94a3b8]">
                    Installed Files Per Editor
                  </span>
                </div>
                <div className="divide-y divide-[#f3f4f6] dark:divide-[#1e293b]">
                  {step.files.map((f) => (
                    <div key={f.editor} className="flex items-center justify-between px-4 py-3">
                      <span className="text-sm font-medium text-[#111827] dark:text-white">
                        {f.editor}
                      </span>
                      <code className="text-xs bg-[#f3f4f6] dark:bg-[#1e293b] text-[#6b7280] dark:text-[#94a3b8] px-2 py-1 rounded font-mono">
                        {f.files}
                      </code>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* MCP config paths (for mcp step) */}
            {step.configs && (
              <div className="bg-white dark:bg-[#111827] rounded-xl border border-[#e5e7eb] dark:border-[#1e293b] overflow-hidden">
                <div className="px-4 py-3 bg-[#f9fafb] dark:bg-[#0f172a] border-b border-[#e5e7eb] dark:border-[#1e293b]">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#6b7280] dark:text-[#94a3b8]">
                    MCP Config File Locations
                  </span>
                </div>
                <div className="divide-y divide-[#f3f4f6] dark:divide-[#1e293b]">
                  {step.configs.map((c) => (
                    <div key={c.ide} className="px-4 py-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-[#111827] dark:text-white">
                          {c.ide}
                        </span>
                        <code className="text-xs bg-[#f3f4f6] dark:bg-[#1e293b] text-[#6b7280] dark:text-[#94a3b8] px-2 py-1 rounded font-mono">
                          {c.path}
                        </code>
                      </div>
                      <p className="text-xs text-[#9ca3af] dark:text-[#64748b] mt-1">
                        {c.note}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center gap-3 pt-2">
              {activeStep > 0 && (
                <button
                  onClick={() => setActiveStep(activeStep - 1)}
                  className="px-4 py-2 text-sm font-medium rounded-lg border border-[#e5e7eb] dark:border-[#1e293b] text-[#6b7280] dark:text-[#94a3b8] hover:bg-[#f3f4f6] dark:hover:bg-[#1e293b] transition-colors focus-visible:ring-2 focus-visible:ring-[#ff7a00] focus-visible:outline-none"
                >
                  ← Previous
                </button>
              )}
              {activeStep < steps.length - 1 && (
                <button
                  onClick={() => setActiveStep(activeStep + 1)}
                  className="px-4 py-2 text-sm font-medium rounded-lg bg-[#ff7a00] text-white hover:bg-[#e56900] transition-colors flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-[#ff7a00] focus-visible:outline-none"
                >
                  Next Step <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Right: Code Block */}
          <div className="relative">
            <div className="sticky top-24">
              <div className="bg-[#0f172a] dark:bg-[#020617] rounded-2xl overflow-hidden border border-[#1e293b] dark:border-[#1e293b]/60 shadow-2xl">
                {/* Terminal Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-[#1e293b]/60 border-b border-[#1e293b]">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-[#ef4444]/80" />
                      <div className="w-3 h-3 rounded-full bg-[#f59e0b]/80" />
                      <div className="w-3 h-3 rounded-full bg-[#22c55e]/80" />
                    </div>
                    <span className="text-xs text-[#64748b] font-mono ml-2">
                      {step.id === "mcp" ? "mcp-config.json" : "terminal"}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy(step.code, step.id)}
                    className="flex items-center gap-1.5 text-xs text-[#64748b] hover:text-white transition-colors px-2 py-1 rounded hover:bg-[#334155] focus-visible:ring-2 focus-visible:ring-[#ff7a00] focus-visible:outline-none"
                  >
                    {copiedId === step.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#22c55e]" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
                {/* Code Content */}
                <pre className="p-5 text-sm font-mono leading-relaxed overflow-x-auto text-[#e2e8f0] max-h-[500px] overflow-y-auto">
                  <code>
                    {step.code.split("\n").map((line, i) => (
                      <div key={i} className="flex">
                        <span className="select-none text-[#475569] w-6 shrink-0 text-right mr-4">
                          {i + 1}
                        </span>
                        <span
                          className={
                            line.startsWith("#") || line.startsWith("//")
                              ? "text-[#64748b]"
                              : line.startsWith("npx")
                              ? "text-[#22c55e]"
                              : line.includes('"')
                              ? "text-[#fbbf24]"
                              : "text-[#e2e8f0]"
                          }
                        >
                          {line}
                        </span>
                      </div>
                    ))}
                  </code>
                </pre>
              </div>

              {/* Step Progress */}
              <div className="flex items-center justify-center gap-2 mt-6">
                {steps.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveStep(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 focus-visible:ring-2 focus-visible:ring-[#ff7a00] focus-visible:outline-none ${
                      i === activeStep
                        ? "w-8 bg-[#ff7a00]"
                        : i < activeStep
                        ? "w-4 bg-[#ff7a00]/40"
                        : "w-4 bg-[#e5e7eb] dark:bg-[#1e293b]"
                    }`}
                    aria-label={`Go to step ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
