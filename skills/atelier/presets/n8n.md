# Atelier Preset: n8n Workflow Soundness & Orchestration

This preset extends `SKILL.md` with deterministic, mechanically checkable rules for n8n workflow export JSON files. Every rule is evaluated by inspecting the workflow JSON's `nodes`, `connections`, and `settings` objects.

---

## 1. Credentials & Secrets Hygiene (`N8N-BE-xxx`)

### `N8N-BE-201: Zero Hardcoded Auth Headers or Tokens in Parameters`
- **Statement**: Nodes must use n8n's managed credential store (`credentials` object) instead of hardcoding raw Authorization tokens, bearer keys, or passwords inside node `parameters`.
- **Pass/Fail Threshold**: Zero occurrences of raw keys in `parameters.headerParameters`, `parameters.options`, or `parameters.authentication`.
- **Violation Example**: `node.parameters.headerParameters.parameters[0] = { name: "Authorization", value: "Bearer sk-proj-123456789" }`
- **check:** `json: nodes[].parameters.headerParameters.parameters[] -> if name.toLowerCase() === 'authorization' and !value.startsWith('={{') -> fail`

### `N8N-BE-202: Zero Raw API Keys in URL Query Strings`
- **Statement**: External API request URLs in HTTP Request nodes must not embed plaintext API keys, secret query parameters, or passwords.
- **Pass/Fail Threshold**: Zero occurrences of query params like `api_key=`, `secret=`, `token=`, `apikey=` with literal string values.
- **Violation Example**: `node.parameters.url = "https://api.hunter.io/v2/email-verifier?api_key=abc123456789&email=test@example.com"`
- **check:** `json: nodes[type == 'n8n-nodes-base.httpRequest'].parameters.url -> if url matches /[?&](?:api_?key|secret|token|password|auth)=([a-zA-Z0-9_\-]{8,})/ and !match[1].startsWith('{{') -> fail`

---

## 2. Graph Connectivity & Flow Integrity (`N8N-BE-xxx`)

### `N8N-BE-203: Zero Unreachable Orphan Nodes`
- **Statement**: Every non-trigger node in the workflow graph must have at least one incoming connection from another node.
- **Pass/Fail Threshold**: Zero nodes where `node.name` is absent from all target arrays in the `connections` object (excluding nodes with `type.includes('trigger')` or `type.includes('webhook')`).
- **Violation Example**: A node `"Orphan Slack Fallback Node"` defined in `nodes[]` that is never targeted by any parent node in `connections`.
- **check:** `json: for node in nodes (where !type.includes('trigger') and !type.includes('webhook')) -> targets = flat_map(connections.*.*[].node) -> if node.name not in targets -> fail`

### `N8N-BE-204: Zero Dead-End Conditional Branches`
- **Statement**: Conditional nodes (`n8n-nodes-base.if`, `n8n-nodes-base.switch`, `n8n-nodes-base.filter`) must wire every defined output branch (e.g. both `true` (index 0) and `false` (index 1)) to downstream processing or recovery nodes.
- **Pass/Fail Threshold**: `connections[ifNode.name].main` must have non-empty connection arrays for both index 0 and index 1.
- **Violation Example**: An IF node where index 0 (`true`) routes to Slack, but index 1 (`false`) is left unhandled with `[]`.
- **check:** `json: for node in nodes[type == 'n8n-nodes-base.if'] -> conn = connections[node.name].main -> if !conn[0] or conn[0].length === 0 or !conn[1] or conn[1].length === 0 -> fail`

### `N8N-BE-205: Zero Dangling Final Catch / Error Handlers`
- **Statement**: Nodes configured with `"onError": "continueErrorOutput"` must connect their second output index (error branch) to an explicit alert, logging, or fallback node.
- **Pass/Fail Threshold**: When `node.onError === 'continueErrorOutput'`, `connections[node.name].main[1]` must contain at least 1 destination node.
- **Violation Example**: A node with `onError = continueErrorOutput` but no wires connected to the error output connector.
- **check:** `json: for node in nodes[onError == 'continueErrorOutput'] -> if !connections[node.name]?.main?.[1] or connections[node.name].main[1].length === 0 -> fail`

---

## 3. Resilience, Timeouts & Retries (`N8N-BE-xxx`)

### `N8N-BE-206: Mandatory Timeout Configuration on HTTP Request Nodes`
- **Statement**: External HTTP Request nodes must explicitly define a request timeout (`parameters.options.timeout` <= 30000ms) to prevent worker starvation.
- **Pass/Fail Threshold**: 100% of `n8n-nodes-base.httpRequest` nodes must have `parameters.options.timeout` defined and > 0 and <= 30000.
- **Violation Example**: An HTTP Request node without `options.timeout` configured (defaults to infinite or system default).
- **check:** `json: nodes[type == 'n8n-nodes-base.httpRequest'] -> if !parameters?.options?.timeout or parameters.options.timeout > 30000 -> fail`

### `N8N-BE-207: Mandatory Retry on Fail for External Webhook / API Calls`
- **Statement**: Nodes performing critical outbound network requests (e.g. OpenAI, Stripe, Hunter, Slack, Webhooks) must enable automatic retries (`retryOnFail: true` and `maxTries >= 2`).
- **Pass/Fail Threshold**: `retryOnFail === true` and `maxTries >= 2` on all outbound HTTP / API integration nodes.
- **Violation Example**: `node.type = 'n8n-nodes-base.httpRequest'` with `retryOnFail` unset or false.
- **check:** `json: nodes[type in ['n8n-nodes-base.httpRequest', 'n8n-nodes-base.openAi', 'n8n-nodes-base.stripe']] -> if !retryOnFail or maxTries < 2 -> fail`

### `N8N-BE-208: Rate Limit / Throttle Protection on Batch Loops`
- **Statement**: Workflows processing arrays of items through loop nodes (e.g. `n8n-nodes-base.splitInBatches` or loop nodes) must include a wait node (`n8n-nodes-base.wait`) or specify batch throttling to prevent downstream API 429 errors.
- **Pass/Fail Threshold**: Any workflow containing `splitInBatches` must have a downstream path leading through a `n8n-nodes-base.wait` or batch interval setting.
- **Violation Example**: A loop iterating over 500 records executing an external HTTP request with 0ms delay.
- **check:** `json: if nodes.some(n => n.type.includes('splitInBatches')) and !nodes.some(n => n.type.includes('wait')) -> fail`

---

## 4. Governance, Logging & Naming (`N8N-BE-xxx`)

### `N8N-BE-209: Descriptive Node Naming (Ban on Default Placeholders)`
- **Statement**: All nodes must have descriptive, purposeful names explaining their action. Default placeholder names (`HTTP Request1`, `Code`, `Webhook`, `If1`, `Edit Fields`) are prohibited.
- **Pass/Fail Threshold**: Zero occurrences of node names matching default regex `^(HTTP Request|Code|Webhook|If|Switch|Schedule|Set|Edit Fields|Filter)\d*$`
- **Violation Example**: `node.name = "HTTP Request1"` or `node.name = "Code"`
- **check:** `json: nodes[].name -> if name matches /^(?:HTTP Request|Code|Webhook|If|Switch|Schedule|Set|Edit Fields|Filter)\d*$/i -> fail`

### `N8N-BE-210: Workflow-Level Error Trigger Configuration`
- **Statement**: Workflows in production must have an Error Trigger workflow configured in `settings.errorWorkflow` or contain a dedicated `n8n-nodes-base.errorTrigger` node.
- **Pass/Fail Threshold**: Either `workflow.settings.errorWorkflow` must be non-empty, or `nodes.some(n => n.type === 'n8n-nodes-base.errorTrigger')` must be true.
- **Violation Example**: A workflow with `settings: {}` and zero error trigger nodes.
- **check:** `json: if !settings?.errorWorkflow and !nodes.some(n => n.type == 'n8n-nodes-base.errorTrigger') -> fail`

### `N8N-BE-211: Execution Data Retention / Save Settings Specified`
- **Statement**: Workflows must explicitly define execution data saving settings (`settings.saveExecutionProgress` and `settings.saveManualExecutions`) to prevent unmonitored failures.
- **Pass/Fail Threshold**: `settings.saveExecutionProgress` must be explicitly configured as `true`.
- **Violation Example**: `settings = { saveExecutionProgress: false }`
- **check:** `json: if settings?.saveExecutionProgress !== true -> fail`

---

## 5. Security & Permission Scope (`N8N-BE-xxx`)

### `N8N-BE-212: Restricted Code Node Sandbox Scope`
- **Statement**: Code nodes (`n8n-nodes-base.code`) must never attempt to access forbidden environment variables (`process.env`) or internal filesystem modules (`fs`, `child_process`).
- **Pass/Fail Threshold**: Zero occurrences of `process.env`, `require('fs')`, `require('child_process')`, or `eval(` in Code node parameters.
- **Violation Example**: `node.parameters.jsCode = "const fs = require('fs'); fs.writeFileSync('/tmp/key', $json.token);"`
- **check:** `json: nodes[type == 'n8n-nodes-base.code'].parameters.jsCode -> if code matches /(?:process\.env|require\(['"](?:fs|child_process|net|tls)['"]\)|eval\()/ -> fail`

### `N8N-BE-213: Webhook Authentication Requirement`
- **Statement**: Production Webhook triggers receiving sensitive data or triggering mutations must declare an authentication method (`authentication: 'basicAuth'` or `'headerAuth'`) instead of `'none'`.
- **Pass/Fail Threshold**: `parameters.authentication` on webhook nodes must not equal `'none'` unless explicitly marked public.
- **Violation Example**: `node.type = 'n8n-nodes-base.webhook'` with `parameters.authentication = 'none'` and path `"charge-customer"`.
- **check:** `json: nodes[type == 'n8n-nodes-base.webhook'] -> if parameters.authentication === 'none' and parameters.path.match(/(?:charge|payment|delete|update|user|admin|auth)/) -> fail`
