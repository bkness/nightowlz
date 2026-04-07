---
name: api-best-practices
description: "Design, implement, and operate robust REST APIs using best practices for contracts, Mongoose data modeling, validation, auth, rate limiting, idempotency, observability, testing, and lifecycle governance. Use when building new APIs or hardening existing endpoints."
argument-hint: "API type + endpoint(s) + auth model + latency/SLA + compliance needs"
user-invocable: true
disable-model-invocation: false
---

# API Best Practices

## When to Use

- Designing a new REST API surface backed by MongoDB/Mongoose.
- Hardening existing endpoints with reliability and security controls.
- Standardizing API behavior across teams and services.
- Preparing APIs for production readiness or external consumption.

## Inputs to Collect First

- API consumers and use cases (internal, partner, public).
- Endpoint inventory and critical user journeys.
- Authentication/authorization model and trust boundaries.
- SLA/SLO targets (latency, uptime, error budget).
- Compliance requirements (PII, auditability, retention).

## Workflow

1. Define contract and resource model

- Model resources, relationships, and canonical identifiers.
- Establish request/response schemas with examples.
- Standardize naming conventions and error envelope format.

2. Design endpoint behavior

- Make methods semantic (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`).
- Define pagination, filtering, sorting, and field selection.
- Define idempotency semantics for write operations.

3. Model persistence with Mongoose

- Define schemas with strict validation and indexed query paths.
- Use unique indexes for dedupe and data integrity boundaries.
- Encode optimistic concurrency where write contention is expected.

4. Establish security baseline

- Enforce authentication and least-privilege authorization.
- Validate/sanitize all inputs and constrain payload size.
- Redact secrets/PII in logs and response bodies.

5. Add reliability controls

- Implement timeouts, retries (client/server aware), and backoff strategy.
- Add rate limiting and abuse protections.
- Use graceful degradation patterns where possible.

6. Plan versioning and compatibility

- Choose version strategy (URI, header, or media type).
- Preserve backward compatibility for non-breaking changes.
- Document deprecation windows and migration paths.

7. Implement observability

- Emit structured logs with trace/correlation IDs.
- Track metrics: request volume, p95/p99 latency, error rates, saturation.
- Add alerts for SLO breach, auth failure spikes, and 5xx trends.

8. Verify with layered testing

- Unit-test handlers, validation, and policy checks.
- Integration-test auth, persistence, and edge cases.
- Contract-test compatibility and error responses.

9. Operationalize and govern

- Publish concise docs with examples and failure modes.
- Add runbooks for incident response and rollback.
- Require strict release gates: security checks, SLO checks, and passing tests.

## Decision Points

- Endpoint granularity:
  - Coarse-grained endpoints for mobile/latency-sensitive consumers.
  - Fine-grained endpoints for composability and flexible clients.
- Mongoose read/write strategy:
  - Lean reads (`.lean()`) for read-heavy endpoints to reduce overhead.
  - Hydrated docs for mutation paths needing middleware/virtual behavior.
- Strict vs tolerant validation:
  - Strict validation for security/compliance-sensitive operations.
  - Tolerant parsing for optional, non-critical fields.
- Versioning trigger:
  - Avoid major version bumps for additive changes.
  - Introduce a new major version for breaking contract changes.
- Sync vs async writes:
  - Sync for immediate consistency requirements.
  - Async for long-running workflows with callback/webhook/polling.

## Completion Checklist

- Contract is documented with stable resource identifiers.
- Error model is consistent and machine-readable.
- AuthN/AuthZ controls are enforced and tested.
- JWT/OAuth2 token validation, expiry, and scope checks are enforced.
- Validation, rate limiting, and idempotency are implemented.
- Observability covers SLOs, failures, and traceability.
- Compatibility and versioning policy is documented.
- Test suite includes unit, integration, and contract coverage.
- Runbooks and deprecation policy are ready.

## Output Format

Provide a concise implementation packet containing:

- API contract summary (resources, methods, schemas).
- Security and abuse-protection plan.
- Reliability and resilience controls.
- Versioning and compatibility strategy.
- Observability dashboard/alerts specification.
- Test and rollout plan.
