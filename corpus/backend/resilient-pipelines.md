# Resilient Orchestration & Pipeline Soundness

## 1. Zero Orphan / Disconnected Nodes
Workflow orchestration graphs (n8n, LangGraph, Temporal, Airflow) often contain unhandled branches or abandoned terminal points:
- Every conditional statement (`if / else`, router switches) must have defined destinations for ALL branches.
- Error outputs on integration nodes (HTTP Request, Database Write, AI Model call) must either connect to a retry handler, fallback node, or dead-letter queue (DLQ) alert.

## 2. Idempotency on State Mutation
- Distributed pipelines, payment webhooks, and asynchronous workers will inevitably receive duplicate events.
- Mutating operations must check an `Idempotency-Key` or store transaction IDs with unique database constraints to prevent double-processing.

## 3. Error Sanitization & Propagation
- Catch internal system errors and return clean, mapped application error codes and messages.
- Never bubble raw database connection strings, database syntax errors, or server stack traces to external clients.
