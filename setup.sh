#!/usr/bin/env bash

# Atelier Interactive Setup & Quickstart Script
# Engineered by Ansh Rajore

set -e

BOLD="\033[1m"
DIM="\033[2m"
RESET="\033[0m"

echo -e "${BOLD}======================================================================${RESET}"
echo -e "${BOLD}              ATELIER QUALITY GATE — ONE-CLICK SETUP                  ${RESET}"
echo -e "${DIM}      Two-Agent Post-Generation Critic for Vibe-Coded Applications     ${RESET}"
echo -e "${DIM}               ENGINEERED BY ANSH RAJORE                              ${RESET}"
echo -e "${BOLD}======================================================================${RESET}\n"

echo -e "${DIM}[1/4] Building MCP Server TypeScript package...${RESET}"
npm install --silent
npm --prefix mcp-server install --silent
npm --prefix mcp-server run build --silent
echo -e "  ${BOLD}✓${RESET} MCP Server compiled successfully (dist/index.js ready)\n"

echo -e "${DIM}[2/4] Verifying canonical adapter synchronization...${RESET}"
node scripts/check-sync.js
echo -e "  ${BOLD}✓${RESET} All adapters in sync with SKILL.md ruleset\n"

echo -e "${DIM}[3/4] Installing editor quality gate adapters...${RESET}"
node bin/atelier.js install all
echo ""

echo -e "${DIM}[4/4] Validating MCP Critic tools...${RESET}"
node scripts/verify-tools.js
echo ""

echo -e "${BOLD}======================================================================${RESET}"
echo -e "${BOLD}                     SETUP COMPLETE & 100% READY!                     ${RESET}"
echo -e "${BOLD}======================================================================${RESET}"
echo -e "
${BOLD}HOW TO USE ATELIER:${RESET}

${BOLD}1. Standalone Terminal Audit & Remediation:${RESET}
   $ node bin/atelier.js audit <file-or-dir>   # Scan for 36 quality violations
   $ node bin/atelier.js fix <file-or-dir>     # Automatically repair violations

${BOLD}2. Start MCP Server (stdio):${RESET}
   $ npm start   (or: node bin/atelier.js serve)

${BOLD}3. Configure with Cursor / Claude Desktop / Windsurf:${RESET}
   Add this JSON to your MCP configuration file:

   {
     \"mcpServers\": {
       \"atelier\": {
         \"command\": \"node\",
         \"args\": [\"$(pwd)/mcp-server/dist/index.js\"],
         \"env\": {
           \"ATELIER_LLM_PROVIDER\": \"heuristic\"
         }
       }
     }
   }
"
