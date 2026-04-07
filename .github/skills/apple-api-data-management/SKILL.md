---
name: apple-api-data-management
description: "Design and implement Apple API data management workflows: request planning, auth handling, pagination, normalization, caching, retries, observability, and data integrity checks. Use when integrating Apple services or hardening existing Apple API pipelines."
argument-hint: "API name + endpoints + storage target + freshness/SLA requirements"
user-invocable: true
disable-model-invocation: false
---

# Apple API Data Management

## When to Use

- Integrating Apple APIs (for example App Store Connect, MusicKit, or Apple web services).
- Building server-side API information pipelines that ingest and manage Apple-sourced metadata.
- Refactoring brittle ingestion/sync jobs into deterministic pipelines.
- Adding reliability controls: retries, dedupe, idempotency, and schema validation.
- Defining storage, retention, and freshness rules for Apple-sourced data.

## Inputs to Collect First

- Target Apple API surface and server endpoints.
- Auth mode and token lifecycle (JWT, OAuth, key rotation cadence).
- Data consumer needs: latency, freshness window, and required fields.
- Storage target and query patterns (OLTP vs analytics, read/write ratios).
- Failure budget and rate-limit constraints.

## Workflow

1. Define data contract

- Identify entities, required fields, and source-of-truth ownership.
- Mark nullable vs required fields and enum domains.
- Assign versioning strategy for schema evolution.

2. Plan acquisition strategy

- Choose pull model: full sync, incremental sync, or event-driven updates.
- Determine pagination approach and stable cursors/checkpoints.
- Define idempotency key per entity or event.

3. Implement secure API client

- Centralize auth signing/token refresh and clock-skew handling.
- Add bounded retries with exponential backoff + jitter.
- Respect Apple rate limits and include circuit-breaker behavior.

4. Normalize and validate payloads

- Map external fields to internal canonical models.
- Validate with strict schema checks before persistence.
- Reject or quarantine malformed records with reason codes.

5. Persist with consistency guarantees

- Upsert by immutable external identifiers.
- Enforce dedupe constraints in storage layer.
- Commit checkpoints only after successful durable writes.

6. Add cache and revalidation policy

- Cache derived read models where latency matters.
- Set TTL by endpoint volatility and consumer freshness SLA.
- Support explicit revalidation path for stale-critical records.

7. Instrument and monitor

- Emit metrics: request rate, error rate, p95 latency, stale-data age, sync lag.
- Log structured failure context without leaking secrets.
- Alert on sustained lag, auth failures, and schema mismatch spikes.

8. Verify and harden

- Run backfill simulation and replay tests.
- Perform rate-limit and token-expiry chaos tests.
- Document runbook for incident triage and safe reprocessing.

## Decision Points

- Full vs incremental sync:
  - Use incremental when endpoint supports stable cursors/timestamps.
  - Use periodic full sync for low-volume data or missing reliable cursors.
- Strict reject vs soft accept on schema drift:
  - Strict reject for security/compliance-critical entities.
  - Soft accept with quarantine when availability is prioritized.
- Cache-first vs source-first reads:
  - Cache-first for latency-sensitive UI paths.
  - Source-first for financial/reporting correctness paths.

## Completion Checklist

- Data contract is documented and versioned.
- Auth flow handles rotation, expiry, and clock skew.
- Retry/backoff/rate-limit logic is tested.
- Persistence is idempotent with dedupe constraints.
- Checkpointing is atomic relative to writes.
- Metrics and alerts cover reliability and freshness.
- Replay/backfill process is documented and tested.
- Security review confirms no key/token leakage in logs.

## Output Format

Provide a concise implementation packet containing:

- Architecture summary (pipeline stages + ownership).
- Canonical schema definitions and mapping table.
- Sync strategy and checkpoint design.
- Failure handling matrix (retry, quarantine, drop, alert).
- Test plan (unit, integration, replay, chaos).
- Operational runbook notes.
