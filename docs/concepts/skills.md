---
title: Cory EvoLoop Skill Synthesizer
---

# Cory EvoLoop & Cognitive Skills

CoreBlow agents use **Cory EvoLoop**, a closed-loop skill synthesis and refinement engine that autonomously evolves cognitive capabilities from successful execution trajectories.

## Overview

Unlike fragile monolithic plugins that require external dependencies and complex compilation, Cognitive Skills in CoreBlow follow the `SKILL.md` V2 blueprint:
- **Zero Runtime Dependencies:** Plain, human-readable structured Markdown.
- **Fast Indexed Recall:** Stored in SQLite WAL and indexed for BM25 associative search.
- **Role-Bounded Execution:** Applied selectively depending on agent specialization (Lead, Coder, Auditor, Researcher, Verifier).

## How EvoLoop Works

```
Turn Execution (Trajectory)
          │
          ▼
   Trajectory Distiller
          │
          ▼
3-Gate Zero-Trust Security Scanner
          │
          ▼
  Bayesian Wilson Scoring (z=1.28)
          │
          ▼
Skill Promotion: Candidate -> Verified Active
```

1. **Trajectory Distillation:** Successful turn steps and validated tool outputs are analyzed by the distiller.
2. **3-Gate Security Scanner:** Ensures candidate skills do not contain prompt injections, command escalation, or hardcoded secrets.
3. **Bayesian Wilson Score:** Evaluates skill utility and stability across repeated turns before promotion.
4. **Promotion & Immutability:** High-confidence skills graduate to `verified_active`. Critical organization skills can be locked with `locked: true` to prevent automated regression.

## Configuration & Storage

Skills are stored locally under `skills/<skill-name>/SKILL.md` and indexed by the microkernel on startup:

```markdown
---
name: code-review
description: Automated security and architectural code review.
version: 1.0.0
locked: true
tags: [security, code-quality]
---

# Code Review Blueprint

1. Verify static types with tsgo.
2. Inspect changed diff lines for secrets.
3. Assert test coverage before approval.
```
