"use client";

import React, { useState } from "react";
import { Terminal, Copy, Check, FileJson, Cpu, Play } from "lucide-react";

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
    <section id="quickstart" className="border-b border-[#182430] bg-[#080d12] py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <div className="font-mono text-xs text-[#00e5ff] tracking-wider uppercase mb-2">
            INSTANT ONBOARDING
          </div>
          <h2 className="font-orbitron text-2xl sm:text-4xl font-bold tracking-tight text-white uppercase max-w-3xl">
            GET STARTED IN UNDER 60 SECONDS
          </h2>
          <p className="mt-4 max-w-2xl font-sans text-sm sm:text-base text-[#90a4ae] leading-relaxed">
            Run standalone via terminal CLI, start the MCP stdio daemon, or add Atelier directly to your Claude Desktop or Cursor configuration.
          </p>

          {/* Quickstart Tab Buttons */}
          <div className="mt-8 flex items-center border border-[#182430] bg-[#0a1017] p-1 font-mono text-xs">
            <button
              onClick={() => setActiveTab("cli")}
              className={`px-4 py-1.5 transition-colors flex items-center gap-2 ${
                activeTab === "cli"
                  ? "bg-[#182430] text-[#00e5ff] font-semibold"
                  : "text-[#90a4ae] hover:text-white"
              }`}
            >
              <Terminal className="h-3.5 w-3.5" />
              <span>CLI Commands</span>
            </button>
            <button
              onClick={() => setActiveTab("mcp")}
              className={`px-4 py-1.5 transition-colors flex items-center gap-2 ${
                activeTab === "mcp"
                  ? "bg-[#182430] text-[#00e5ff] font-semibold"
                  : "text-[#90a4ae] hover:text-white"
              }`}
            >
              <FileJson className="h-3.5 w-3.5" />
              <span>MCP Server Config</span>
            </button>
            <button
              onClick={() => setActiveTab("setup")}
              className={`px-4 py-1.5 transition-colors flex items-center gap-2 ${
                activeTab === "setup"
                  ? "bg-[#182430] text-[#00e5ff] font-semibold"
                  : "text-[#90a4ae] hover:text-white"
              }`}
            >
              <Play className="h-3.5 w-3.5" />
              <span>1-Click Setup Script</span>
            </button>
          </div>
        </div>

        {/* Code Snippet Box */}
        <div className="mt-8 mx-auto max-w-4xl border border-[#182430] bg-[#0a1017] shadow-xl">
          <div className="flex items-center justify-between border-b border-[#182430] bg-[#0e1620] px-4 py-2.5 font-mono text-xs text-[#90a4ae]">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
              <span className="ml-2 text-white font-medium">
                {activeTab === "cli" ? "Terminal CLI Execution" : activeTab === "mcp" ? "mcp_config.json" : "Bash One-Click Setup"}
              </span>
            </div>
            <button
              onClick={() => handleCopy(cliSnippets[activeTab])}
              className="flex items-center gap-1 text-[11px] text-[#90a4ae] hover:text-white transition-colors"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-[#00e5ff]" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? "Copied to Clipboard" : "Copy Code"}</span>
            </button>
          </div>
          <div className="p-6 bg-[#060a0f] overflow-x-auto">
            <pre className="font-mono text-xs text-[#cfd8dc] leading-relaxed">
              <code>{cliSnippets[activeTab]}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
};
