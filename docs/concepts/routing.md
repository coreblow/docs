---
title: Adaptive Decision Router
---

# Adaptive Decision Router & Daybreak Failover

CoreBlow's **Adaptive Decision Router** (`src/providers/`) routes model requests across **8 execution/provider backends** and **6 task tiers**, maintaining active sessions automatically when provider quotas or rate limits tighten.

## Task Tiers

Requests are matched to configured provider models by capability tier:

- `fast` — Low-latency classification, summaries, and lightweight tool steps.
- `deep` — Complex multi-step reasoning and architectural planning.
- `local` — Privacy-first local inference (e.g., Ollama) with zero external egress.
- `coding` — Code generation, refactoring, and diff review.
- `vision` — Image understanding and multimodal inspection.
- `decision` — Structured routing, policy evaluation, and coordinator arbitration.

## Daybreak Quota Failover

When a primary cloud provider hits rate limits, quota caps, or transient outages:

1. The credential pool marks the exhausted key/endpoint with cooldown backoff.
2. **Daybreak failover** reroutes the turn to the next healthy fallback cloud model or local Ollama endpoint without dropping session context.
3. Mid-session manual overrides remain available at any time via `/model` in the TUI, Desktop, or messaging channels.

## Related

- [Architecture Overview](/architecture)
- [Providers](/providers)
- [Configuration](/configuration)
