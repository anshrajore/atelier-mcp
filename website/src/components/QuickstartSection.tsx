"use client";

import React, { useState } from "react";
import { Terminal, Copy, Check, FileJson, Play } from "lucide-react";

export const QuickstartSection = () => {
  const [activeTab, setActiveTab] = useState<"cli" | "mcp" | "setup">("cli");
  const [copied, setCopied] = useState(false);

  const cliSnippets = {
    cli: `# 1. Audit any directory or component for 36 quality violations
node bin/atelier.js audit ./src/components/Hero.tsx

# 2. Automatically repair violations in-place
node bin/atelier.js fix ./src/components

# 3. Install quality gate adapters across your local editors
node bin/atelier.js install all`,

    mcp: `{
  "mcpServers": {
    "atelier": {
      "command": "node",
      "args": ["/path/to/atelier/mcp-server/dist/index.js"],
      "env": {
        "ATELIER_LLM_PROVIDER": "heuristic"
      }
    }
  }
}`,

    setup: `# One-click clone and full environment verification:
git clone https://github.com/anshrajore/atelier-mcp.git
cd atelier-mcp
./setup.sh`,
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="quickstart" className="py-24 bg-[#fafafa] border-b border-[#f1f5f9]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <div className="text-xs font-semibold tracking-widest text-[#ff7a00] uppercase mb-3">
            INSTANT ONBOARDING
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#111827] max-w-3xl tracking-tight leading-tight">
            Get Started in Under 60 Seconds
          </h2>
          <p className="mt-4 max-w-2xl font-sans text-sm sm:text-base text-[#64748b] leading-relaxed">
            Run standalone via terminal CLI, start the MCP stdio daemon, or add Atelier directly to your Claude Desktop or Cursor configuration.
          </p>

          {/* Clean Pill Tab Switcher */}
          <div className="mt-8 flex items-center p-1 bg-[#f1f5f9] rounded-full text-xs font-medium">
            <button
              onClick={() => setActiveTab("cli")}
              className={`px-6 py-2 rounded-full transition-all flex items-center gap-2 ${
                activeTab === "cli"
                  ? "bg-white text-[#111827] shadow-sm font-semibold"
                  : "text-[#64748b] hover:text-[#111827]"
              }`}
            >
              <Terminal className="h-3.5 w-3.5" />
              <span>CLI Commands</span>
            </button>
            <button
              onClick={() => setActiveTab("mcp")}
              className={`px-6 py-2 rounded-full transition-all flex items-center gap-2 ${
                activeTab === "mcp"
                  ? "bg-white text-[#111827] shadow-sm font-semibold"
                  : "text-[#64748b] hover:text-[#111827]"
              }`}
            >
              <FileJson className="h-3.5 w-3.5" />
              <span>MCP Server Config</span>
            </button>
            <button
              onClick={() => setActiveTab("setup")}
              className={`px-6 py-2 rounded-full transition-all flex items-center gap-2 ${
                activeTab === "setup"
                  ? "bg-white text-[#111827] shadow-sm font-semibold"
                  : "text-[#64748b] hover:text-[#111827]"
              }`}
            >
              <Play className="h-3.5 w-3.5" />
              <span>1-Click Setup</span>
            </button>
          </div>
        </div>

        {/* Code Box */}
        <div className="mt-10 mx-auto max-w-3xl rounded-3xl bg-[#1e2330] text-white shadow-xl overflow-hidden">
          <div className="flex items-center justify-between border-b border-[#2d3748] bg-[#151922] px-6 py-3.5 text-xs text-[#94a3b8]">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
              <span className="ml-2 font-mono text-white text-xs">
                {activeTab === "cli" ? "Terminal CLI" : activeTab === "mcp" ? "mcp_config.json" : "setup.sh"}
              </span>
            </div>
            <button
              onClick={() => handleCopy(cliSnippets[activeTab])}
              className="flex items-center gap-1.5 text-xs text-[#94a3b8] hover:text-white transition-colors"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? "Copied" : "Copy Code"}</span>
            </button>
          </div>
          <div className="p-6 bg-[#1e2330] overflow-x-auto">
            <pre className="font-mono text-xs text-gray-200 leading-relaxed">
              <code>{cliSnippets[activeTab]}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
};
