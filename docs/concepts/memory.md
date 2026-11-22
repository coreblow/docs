# Cory 4-Layer Memory Engine

The Cory Memory Engine provides persistent, structured, and sub-millisecond contextual memory for autonomous CoreBlow agents. It implements an immutable Single Memory Authority invariant where the Gateway microkernel is the exclusive single writer.

## Architecture & Layers

Cory organizes memory into four distinct architectural layers:

1. **Layer 1: Identity (`IDENTITY.md`)**
   - Defines the immutable persona, communication tone, and fundamental identity directives of the agent.
2. **Layer 2: Durable Knowledge (`MEMORY.md`)**
   - High-confidence facts, user preferences, and project-specific knowledge.
   - Indexed via native SQLite WAL with hybrid full-text (BM25) search for `< 2ms` sub-millisecond retrieval without vector database bloat.
3. **Layer 3: System Constraints (`CONSTRAINTS.md`)**
   - Active operational guardrails and non-negotiable repository policies pinned directly to every conversation turn.
4. **Layer 4: Episodic Memory (Session WAL)**
   - Chronological turn logs and tool execution trajectories recorded with SHA-256 integrity checksums.

## Knowledge Scribe & Zero-Stall Compaction

To prevent token context overflow while avoiding hallucinatory summarization, Cory uses the **Knowledge Scribe**:
- Trajectories are distilled into durable memory notes before token budgets are exhausted.
- Zero-stall prepared compaction preserves critical constraints across long conversations without blocking agent turns.

## Client Access

All external surfaces (Desktop Studio, Web Cockpit, CLI) query memory via the Gateway REST endpoint:
```http
GET /api/cory/layers
GET /api/cory/search?q=<query>
```
