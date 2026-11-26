---
title: War Room v2
---

# War Room v2

**War Room v2** is CoreBlow's in-memory multi-agent orchestration and preview engine (`src/agents/`) built around a single-brain **Cognitive Coordinator** and a deterministic Kanban DAG.

## Specialist Roles

Complex tasks can be coordinated across role-bounded specialist workers communicating over an in-memory append-only board:

- `@coder` — Scoped implementation and refactoring tasks.
- `@researcher` — Codebase, documentation, and dependency investigation.
- `@auditor` — Security, trust-boundary, and static analysis checks.
- `@verifier` — Test execution and regression verification.
- `@all` — Coordinated broadcast across active War Room participants.

## 5-Gate Verification Engine

Before proposed changes are accepted by the War Room workflow preview, CoreBlow evaluates five verification gates locally (it does not perform live automated GitHub PR merging):

1. `typecheck` — Strict TypeScript verification (`tsgo --noEmit`).
2. `linter` — Repository lint and import-boundary checks.
3. `unit_tests` — Scoped and suite-level test execution.
4. `secret_scan` — Detection of leaked keys, tokens, and personal filesystem paths.
5. `forbidden_paths` — Enforcement against restricted surfaces and `CODEOWNERS` boundaries.

## Related

- [Architecture Overview](/architecture)
- [Cory 4-Layer Memory](/concepts/memory)
- [EvoLoop Cognitive Skills](/concepts/skills)
