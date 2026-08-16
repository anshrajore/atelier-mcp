#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { RulesEngine } from './rules-engine.js';
import { LLMClient } from './llm-client.js';
import { handleCritiqueUI } from './critics/ui.js';
import { handleCritiqueBackend } from './critics/backend.js';
import { handleGenerateFix } from './critics/fixer.js';

const rulesEngine = new RulesEngine();
const llmClient = new LLMClient();

const server = new Server(
  {
    name: 'atelier-critic',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Register tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'critique_ui',
        description:
          'Audit UI code and rendered screenshots against design system guidelines (spacing scales, typography hierarchy, contrast/WCAG AA, and anti-AI-cliché patterns). Returns structured findings citing canonical SKILL.md rules.',
        inputSchema: {
          type: 'object',
          properties: {
            code: {
              type: 'string',
              description: 'The frontend component or page source code (React, Vue, HTML, Svelte, Tailwind).',
            },
            filePath: {
              type: 'string',
              description: 'Optional path of the file being audited.',
            },
            framework: {
              type: 'string',
              enum: ['react', 'vue', 'html', 'svelte', 'solid'],
              description: 'The frontend framework used.',
            },
            screenshotBase64: {
              type: 'string',
              description: 'Optional base64-encoded screenshot of the rendered component for visual craft inspection.',
            },
            screenshotPath: {
              type: 'string',
              description: 'Optional absolute path to the screenshot image file.',
            },
            designSystem: {
              type: 'string',
              enum: ['tailwind', 'radix', 'shadcn', 'vanilla', 'material'],
              description: 'Target design system convention.',
            },
          },
          required: ['code'],
        },
      },
      {
        name: 'critique_backend',
        description:
          'Audit backend and pipeline code against OWASP security, 12-factor principles, N+1 query elimination, input boundary validation, and zero-orphan workflow node rules.',
        inputSchema: {
          type: 'object',
          properties: {
            code: {
              type: 'string',
              description: 'The backend endpoint, service logic, or workflow orchestration JSON (e.g. n8n, LangGraph).',
            },
            filePath: {
              type: 'string',
              description: 'Optional path of the backend file or workflow graph.',
            },
            language: {
              type: 'string',
              enum: ['typescript', 'javascript', 'python', 'go', 'rust'],
              description: 'Programming language of the code snippet.',
            },
            framework: {
              type: 'string',
              enum: ['express', 'fastapi', 'nest', 'nextjs', 'django', 'workflow-n8n', 'langgraph'],
              description: 'Backend framework or workflow orchestrator.',
            },
            isWorkflowJson: {
              type: 'boolean',
              description: 'Set to true if evaluating an orchestration graph JSON payload.',
            },
          },
          required: ['code'],
        },
      },
      {
        name: 'generate_fix',
        description:
          'Given source code and structured findings from critique_ui or critique_backend, generate an updated, compliant code patch and diff.',
        inputSchema: {
          type: 'object',
          properties: {
            code: {
              type: 'string',
              description: 'The original code snippet.',
            },
            filePath: {
              type: 'string',
              description: 'Optional file path.',
            },
            critic: {
              type: 'string',
              enum: ['ui', 'backend'],
              description: 'The critic type that generated the findings.',
            },
            findings: {
              type: 'array',
              description: 'The array of CritiqueFinding objects returned by critique_ui or critique_backend.',
              items: {
                type: 'object',
              },
            },
          },
          required: ['code', 'critic', 'findings'],
        },
      },
    ],
  };
});

// Tool execution handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === 'critique_ui') {
      const result = await handleCritiqueUI(args as any, rulesEngine, llmClient);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }

    if (name === 'critique_backend') {
      const result = await handleCritiqueBackend(args as any, rulesEngine, llmClient);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }

    if (name === 'generate_fix') {
      const result = handleGenerateFix(args as any);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }

    throw new Error(`Unknown tool: ${name}`);
  } catch (error: any) {
    return {
      isError: true,
      content: [
        {
          type: 'text',
          text: `Error executing ${name}: ${error.message || String(error)}`,
        },
      ],
    };
  }
});

async function run() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Atelier MCP Server running on stdio');
}

run().catch((err) => {
  console.error('Fatal error starting Atelier MCP server:', err);
  process.exit(1);
});
