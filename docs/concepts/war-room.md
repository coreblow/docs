---
title: CoreFlow Orchestration
---

# CoreFlow Orchestration

**CoreFlow** (maintaining legacy *War Room* route and `/concepts/war-room` link compatibility) is CoreBlow's in-memory multi-agent orchestration and preview engine (`src/agents/`) built around a single-brain **Cognitive Coordinator** and a deterministic Kanban DAG.

## Specialist Roles

Complex tasks are coordinated across role-bounded specialist workers communicating over an in-memory append-only board:

- `@coder` — Scoped implementation and refactoring tasks.
- `@researcher` — Codebase, documentation, and dependency investigation.
- `@auditor` — Security, trust-boundary, and static analysis checks.
- `@verifier` — Test execution and regression verification.
- `@all` — Coordinated broadcast across active CoreFlow participants.

## Deterministic 5-Gate + 3-Tier Auto-Bypass Architecture

Before proposed changes are accepted by the CoreFlow workflow preview, CoreBlow evaluates five verification gates locally (it does not perform live automated GitHub PR merging):

1. `typecheck` — Strict TypeScript verification (`tsgo --noEmit`).
2. `linter` — Repository lint and import-boundary checks.
3. `unit_tests` — Scoped and suite-level test execution.
4. `secret_scan` — Detection of leaked keys, tokens, and personal filesystem paths.
5. `forbidden_paths` — Enforcement against restricted surfaces and `CODEOWNERS` boundaries.

To avoid redundant overhead on low-risk changes while keeping sensitive paths strictly gated, CoreFlow classifies changes into a **3-tier auto-bypass** policy:

- **Tier 1 (Docs / Non-Code):** Safe documentation-only edits bypass heavy build/test gates while still enforcing `secret_scan` and `forbidden_paths`.
- **Tier 2 (Standard Code):** Typical source changes run scoped `typecheck`, `linter`, `unit_tests`, `secret_scan`, and `forbidden_paths`.
- **Tier 3 (Critical / Security Surfaces):** Touches to auth, sandbox, crypto, or release-signing paths enforce full-suite verification with zero bypasses.

## Related

- [Architecture Overview](/architecture)
- [Cory 4-Layer Memory](/concepts/memory)
- [EvoLoop Cognitive Skills](/concepts/skills)
