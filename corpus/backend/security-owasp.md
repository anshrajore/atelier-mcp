# Backend Security & OWASP Guidelines

## 1. Secrets & Environment Configuration (12-Factor Principle III)
- Never embed raw secrets, API tokens, encryption keys, or credentials into source code.
- Never use insecure fallback defaults in production code:
  ```typescript
  // INSECURE:
  const secret = process.env.JWT_SECRET || "supersecretdevkey";

  // SECURE:
  import { z } from "zod";
  const envSchema = z.object({
    JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
    DATABASE_URL: z.string().url(),
  });
  export const env = envSchema.parse(process.env);
  ```

## 2. Boundary Schema Validation
External inputs must be validated before business logic execution:
- Use validation schemas (Zod, Pydantic, Joi, TypeBox) on `req.body`, `req.query`, and `req.params`.
- Disallow unknown payload keys (e.g. `z.strictObject()` or strip unknown properties) to protect against mass-assignment vulnerabilities.

## 3. Rate Limiting & Denial of Service Protection
- Apply rate limiting to all public endpoints, especially authentication (`/login`, `/signup`, `/reset-password`), resource-heavy queries, and AI generation endpoints.
- Return HTTP 429 status code with `Retry-After` header when limits are reached.
