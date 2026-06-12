# Research Writer Architecture

## System Overview

Research Writer is a **literature review orchestration system** — an optional Phase 0 (search strategy) plus 7 core phases — powered by **subagent-based workflow management**. It fully supports narrative and scoping reviews and assists PRISMA-style systematic reviews (see "Honest scope" in CLAUDE.md and the review-type notes in `settings/screening-criteria.md`).

### Key Innovation: Subagent Orchestration

Instead of running all phases in a single conversation (which causes context overflow), each phase runs as an **isolated subagent** with clean context:

```
Old (Skills-based):
- All phases in one conversation
- Context accumulates across phases
- Context window fills up quickly with larger corpora

New (Subagent-based):
- Each phase gets isolated context
- Fresh start for each phase
- Can handle larger corpora without cross-phase context buildup
```

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    User Request                                 │
│  "Help me complete a literature review on [topic]"              │
└─────────────────────┬─────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│  ORCHESTRATOR = the MAIN Claude Code session, driven by         │
│  CLAUDE.md at the repo root (NOT a subagent — subagents cannot  │
│  spawn agents or ask the user, so orchestration must live here) │
│  - Validates prerequisites                                      │
│  - Spawns phase agents via the Agent tool                       │
│    (renamed from "Task" in Claude Code v2.1.63; old name still  │
│    works as an alias)                                           │
│  - Manages phase sequencing (optional Phase 0, then 1-7)        │
│  - Handles human checkpoints                                    │
│  - Tracks execution state (execution-log.json)                  │
└─────────────────┬─────────────┬─────────────┬──────────────────┘
                  │             │             │
        ┌─────────▼──┐   ┌──────▼───┐   ┌────▼──────┐
        │  PHASE 1   │   │ PHASE 2  │   │ PHASE 3   │
        │ Discovery  │   │ Synthesis│   │ Structurer│
        │(Isolated)  │   │(Isolated)│   │(Isolated) │
        └─────┬──────┘   └──────┬───┘   └────┬──────┘
              │                 │            │
              ▼                 ▼            ▼
    [Screening    [Extraction+   [Outline.md]
     Matrix.md]    Synthesis]

        ┌─────────▼──┐   ┌──────▼───┐   ┌────▼──────┐
        │  PHASE 4   │   │ PHASE 5  │   │ PHASE 6   │
        │ Drafting   │   │  Citation│   │Contribution
        │(Isolated)  │   │ Validator│   │Framing
        └─────┬──────┘   └──────┬───┘   └────┬──────┘
              │                 │            │
              ▼                 ▼            ▼
    [Draft.md]  [Citation      [Contributions
                 Report]        .md]

        ┌─────────────────────────────┐
        │  PHASE 7 (Final Gate)       │
        │ Cross-Phase Validation      │
        │(Isolated - Quality Check)   │
        └────────────┬────────────────┘
                     │
                     ▼
        [Validation Report + Pass/Fail]
```

---

## Multi-Agent Design: Orchestrator + Specialized Agents

### Directory Structure

```
CLAUDE.md                               # ORCHESTRATOR (main session instructions)
.claude/agents/
├── search-strategist.md                # Phase 0: Search strategy (optional)
├── literature-screener.md              # Phase 1: Screening
├── extraction-synthesizer.md           # Phase 2: Extraction & Synthesis
├── argument-structurer.md              # Phase 3: Outline Generation
├── literature-drafter.md               # Phase 4: Academic Prose
├── citation-validator.md               # Phase 5: Citation Quality Gate
├── contribution-framer.md              # Phase 6: Contributions + Disclosure
└── consistency-validator.md            # Phase 7: Final Quality Gate
```

### Tools Configuration (current Claude Code semantics)

Two facts about current Claude Code drive this design — both are
platform-enforced, not configuration choices:

1. **Subagents cannot spawn other subagents** — the Agent tool is
   unavailable inside a subagent even if listed in `tools:`.
2. **Subagents cannot use `AskUserQuestion`** — human interaction belongs
   exclusively to the main session.

This is precisely why the orchestrator is the *main session* (driven by
`CLAUDE.md`) rather than an agent file: only the main session can both
spawn agents and talk to the user.

Frontmatter semantics for the specialists:

- **Omitting `tools:` means the agent inherits EVERY tool** available to
  the parent. Explicit `tools:` is an allowlist — a scoping choice, not a
  delegation requirement.
- The 8 specialists here declare `tools: Read, Write, Bash, Glob, Grep`
  deliberately: least privilege per phase. Listing or omitting `Agent` /
  `AskUserQuestion` would change nothing (see the two facts above), so
  they are simply left out.

```yaml
---
name: literature-screener  # or any other specialist
description: Screen and triage research PDFs...
model: sonnet
color: blue
tools: Read, Write, Bash, Glob, Grep   # deliberate scoping, not magic
---
```

### Agent Execution Pattern

The orchestrator uses Claude Code's **Agent tool** (renamed from "Task" in
v2.1.63; `Task(...)` references still work as aliases) to spawn each agent
in isolation:

```javascript
// Orchestrator (main session) spawns Phase 1
Agent(agent_type: "literature-screener", prompt: "Screen papers in corpus/")
  → literature-screener agent runs in fresh context
  → Produces outputs/literature-screening-matrix.md
  → Returns summary to orchestrator

// Orchestrator spawns Phase 2
Agent(agent_type: "extraction-synthesizer", prompt: "Extract from approved papers")
  → extraction-synthesizer agent runs in fresh context
  → Reads literature-screening-matrix.md
  → Produces synthesis outputs
  → Returns summary to orchestrator

// Pattern continues through Phase 7...
```

### Key Architectural Benefits

1. **Context Isolation**: Each agent gets a fresh context window
2. **Scalability**: Handles larger corpora than single-conversation approaches
3. **Maintainability**: Update individual agents without touching orchestrator
4. **Discoverability**: All agents visible in Claude Code's `/agents` menu
5. **Semantic Names**: Agent names describe function, not execution order

## Two-Tier Design: Orchestrator + Phase Agents

### Tier 1: The Orchestrator (Main Session via CLAUDE.md)

**What it does:**
- Orchestrates the complete workflow (optional Phase 0 + Phases 1-7)
- Manages human approval checkpoints (the ONLY tier that can ask the user)
- Tracks execution state (`execution-log.json`, `execution-context.json`)
- Enables workflow resumption
- Handles phase sequencing and gate revision loops

**Lives in**: `CLAUDE.md` at the repo root — Claude Code loads it as
project instructions for the main session. It is NOT an agent file:
subagents can neither spawn agents nor prompt the user, so an
orchestrator-as-subagent cannot work on this platform.

**Not responsible for:**
- Phase logic (that's each phase agent)
- Domain knowledge (agents are self-contained)
- Implementation details (each phase agent handles its own)

### Tier 2: Phase Agents (8 total)

Each phase is a **self-contained independent agent**:
- Spawned via the Agent tool by the orchestrator
- Runs in fresh context window
- Reads required inputs from outputs/ (per the File Contract Table)
- Produces specific outputs to outputs/
- Can be invoked directly from `/agents` menu
- Returns summary to orchestrator
- Never interacts with the user — decisions are flagged for checkpoints

**Agents**:
0. **search-strategist** - Document reproducible search strategy (optional)
1. **literature-screener** - Screen PDFs by criteria
2. **extraction-synthesizer** - Extract info, appraise quality, identify themes
3. **argument-structurer** - Organize themes into outline
4. **literature-drafter** - Write academic prose
5. **citation-validator** - Quality gate #1 (verify citations)
6. **contribution-framer** - Frame implications + methods disclosure
7. **consistency-validator** - Quality gate #2 (computed consistency score)

---

## Execution Flow

### State Tracking: execution-log.json (CANONICAL SCHEMA)

This is the canonical schema. CLAUDE.md's logging instructions reference
these exact field names, and `outputs/execution-log.example.json` (checked
into the repo) shows a populated example.

```json
{
  "workflow_id": "rw-20260612-153000",
  "research_topic": "AI Adoption in Philippine Healthcare",
  "started_at": "2026-06-12T10:30:00Z",
  "status": "in_progress",
  "current_phase": 2,
  "phases": [
    {
      "phase": 1,
      "name": "Literature Screening",
      "agent": "literature-screener",
      "status": "success",
      "started_at": "2026-06-12T10:32:00Z",
      "completed_at": "2026-06-12T11:05:00Z",
      "human_approval": "approved",
      "output_files": [
        "outputs/literature-screening-matrix.md",
        "outputs/prisma-flow-diagram.md",
        "outputs/screening-progress.md"
      ],
      "warnings": ["2 papers UNCERTAIN - resolved at checkpoint"]
    },
    {
      "phase": 2,
      "name": "Extraction & Synthesis",
      "agent": "extraction-synthesizer",
      "status": "in_progress",
      "started_at": "2026-06-12T11:10:00Z"
    }
  ],
  "checkpoints": [
    {
      "phase": 1,
      "type": "approval",
      "user_choice": "approved",
      "decisions": ["davis-2022-unclear.pdf: INCLUDE (user override)"]
    }
  ],
  "gate_results": [
  ]
}
```

Field reference: `phase` (number), `name`, `agent` (subagent name),
`status` ("success" | "failure" | "partial" | "in_progress"),
`started_at`/`completed_at` (ISO-8601), `output_files`, `warnings`,
`human_approval` (approval checkpoints only). `gate_results` entries
record `{phase, status, critical_count, retry_count}` parsed from the
gate report headers, plus `score` for Phase 7 ONLY — the citation gate
(Phase 5) emits no numeric score, so its entries omit the field (as the
checked-in example shows).

**Use cases:**
- **Resume**: Load last completed phase, continue from next
- **Audit**: See complete execution history
- **Debug**: Identify where issues occurred

### Checkpoint System

**Three types of checkpoints:**

1. **Approval Checkpoints** (Phase 0 if run; Phases 1, 3)
   - User reviews outputs (search strategy / screening decisions / outline)
   - Approves or requests changes; all `Decisions Required` items surfaced
   - Can re-run phase if needed

2. **Auto Quality Gates** (Phases 5, 7)
   - Run automatically; verdict parsed from machine-readable report header
   - FAIL → automatic revision cycle (max 2), then human review
   - WARN → user decides: proceed or revise

3. **Progress Checkpoints** (Phases 2, 4, 6)
   - Phase 2: extraction spot-check against source PDFs (the pipeline's
     only ground-truth verification — don't skip it)
   - Phases 4, 6: optional early review, non-blocking

---

## Context Management Strategy

### Problem: Context Overflow with Skills

With skills-based system:
```
Start: 10K tokens available
Phase 1: Uses 8K, leaves 2K
Phase 2: Uses 3K of 2K available → OVERFLOW
```

### Solution: Isolated Contexts

Each subagent gets fresh context:
```
Phase 1: 90K tokens available → uses 15K → done
Phase 2: 90K tokens available → uses 20K → done  
Phase 3: 90K tokens available → uses 5K → done
... additional phases follow the same pattern
```

### Practical Implementation

**For each phase subagent:**
1. Receive only required inputs (not all prior phases)
2. Process with fresh context
3. Produce specific outputs
4. Return to orchestrator
5. Clear context

**Critical**: Phase 2 (synthesis) batches large corpora:
- Batches papers to stay within context limits
- Saves progress after each batch
- Continues with next batch
- Result: Can process larger corpora than a single-context approach

---

## Quality Assurance: Two-Gate System

### Gate 1: Phase 5 - Citation Integrity Validation

```
CHECKS:
✓ All citations in draft exist in extraction matrix
✓ No fabricated/hallucinated citations
✓ Claims match what papers actually found
✓ Citations appropriately placed

OUTCOME:
❌ CRITICAL issues → BLOCK workflow
⚠️  WARNINGS → Allow with notification
✅ PASS → Proceed to Phase 6
```

**Why this matters**: Prevents fabricated citations from reaching manuscript

### Gate 2: Phase 7 - Cross-Phase Validation

```
CHECKS:
✓ Themes from Phase 2 appear in Phase 3
✓ Outline from Phase 3 drafted in Phase 4
✓ Draft claims traceable to evidence
✓ Evidence strength language consistent
✓ No broken evidence chains

METRICS:
- Consistency Score (0-100)
- Theme traceability
- Claim support

OUTCOME:
❌ Score <75 or critical issues → BLOCK
⚠️  Score 65-74 → WARN
✅ Score ≥75 → PASS
```

**Why this matters**: Ensures analytical integrity across entire workflow

---

## File Organization

### Orchestrator (CLAUDE.md)

**Entry point**: `CLAUDE.md` at the repo root — loaded automatically by
Claude Code as project instructions for the main session.

Contains:
- Workflow initialization (setup checks, execution-context.json)
- Agent tool invocation patterns for each phase
- Checkpoint taxonomy and management logic (approval / gate / progress)
- Quality-gate handling: header parsing, revision loops, retry limits
- Resumability logic (execution-log.json)

**User experience:**
- Active in every Claude Code session opened in this repo
- "Help me complete a literature review on [topic]" starts the workflow
- Single orchestrator interface; specialists never talk to the user

### Phase Agents (.claude/agents/)

Each phase agent is one file in `.claude/agents/`:

**Example: literature-screener.md**
- YAML frontmatter (name, description, model, color)
- Complete implementation for Phase 1
- Three-pass screening workflow
- Resumable state management
- PRISMA compliance
- 400+ lines of detailed logic

**Implementation pattern:**
1. Orchestrator spawns agent via the Agent tool
2. Agent runs in fresh context window
3. Agent reads required inputs
4. Agent executes phase logic independently
5. Agent produces outputs
6. Agent returns summary to orchestrator

### File Contract Table (AUTHORITATIVE)

This table is the single source of truth for who writes and who reads every
workflow file. CLAUDE.md and README.md summarize it; when they disagree,
this table wins. Lifecycle: **deliverable** (end product), **report**
(gate/quality output), **state** (resumability), **working** (transient,
internal to one phase).

| File (outputs/ unless noted) | Producer | Consumers | Lifecycle |
|---|---|---|---|
| `execution-log.json` | orchestrator (init; updated every phase) | orchestrator (resume/audit) | state |
| `execution-context.json` | orchestrator (init, after topic confirmation) | orchestrator (resume) | state |
| `pass-1-triage.md` | literature-screener (PASS 1) | literature-screener (PASS 2) | working |
| `screening-progress.md` | literature-screener | literature-screener (resume); orchestrator (NEEDS_DECISION flag) | state |
| `literature-screening-matrix.md` | literature-screener | extraction-synthesizer; orchestrator (Decisions Required → Phase 1 checkpoint) | deliverable |
| `prisma-flow-diagram.md` | literature-screener | user | deliverable |
| `paper-pXXX-extraction.md` (per paper) | extraction-synthesizer | extraction-synthesizer (Phase 2B); citation-validator (claim sampling); consistency-validator (claim sampling); user (Phase 2 spot-check) | deliverable (audit trail) |
| `literature-extraction-matrix.md` | extraction-synthesizer | citation-validator; literature-drafter (corpus-only citation rule) | deliverable |
| `literature-synthesis-matrix.md` | extraction-synthesizer | argument-structurer; literature-drafter; citation-validator; contribution-framer; consistency-validator | deliverable |
| `extraction-quality-report.md` | extraction-synthesizer (also its progress/state) | orchestrator (Phase 2 checkpoint); extraction-synthesizer (resume) | report + state |
| `literature-review-outline.md` | argument-structurer | literature-drafter; contribution-framer; consistency-validator | deliverable |
| `literature-review-draft.md` | literature-drafter (initial + Revision Mode rewrites) | citation-validator; contribution-framer; consistency-validator; user | deliverable ← MAIN |
| `citation-integrity-report.md` | citation-validator | orchestrator (gate verdict); literature-drafter (Revision Mode) | report (Gate 1) |
| `research-contributions-implications.md` | contribution-framer | consistency-validator; user | deliverable |
| `methods-disclosure.md` | contribution-framer | user (manuscript methods section) | deliverable |
| `cross-phase-validation-report.md` | consistency-validator | orchestrator (gate verdict); literature-drafter / contribution-framer (Revision Mode) | report (Gate 2) |
| `workflow-execution-summary.md` | orchestrator (at completion) | user | deliverable |
| `settings/screening-criteria.md` | user (template provided) | literature-screener; search-strategist (filter derivation) | input |
| `settings/search-strategy.md` | search-strategist (Phase 0, optional); results table filled by USER | literature-screener (PRISMA identification) | input + deliverable |
| `corpus/*.pdf` | user | literature-screener; extraction-synthesizer | input |

Rules the table encodes:
- Every file has exactly ONE producer. Orchestrator-owned files
  (`execution-log.json`, `execution-context.json`,
  `workflow-execution-summary.md`) are never written by phase agents.
- `paper-pXXX-extraction.md` files are the system's ground truth: both
  gates sample against them, and the Phase 2 checkpoint asks the user to
  spot-check them against source PDFs.
- Working files may be deleted after their phase completes; everything
  else persists for audit.

### Input Files (corpus/ + settings/)

User provides:
```
corpus/
├── paper1.pdf
├── paper2.pdf
└── ... (as many as needed)

settings/
└── screening-criteria.md (customize criteria)
```

---

## Design Principles

### 1. Isolation (Not Accumulation)

Each phase:
- Gets only what it needs
- Returns what it produces
- Doesn't carry context forward
- Can be re-run independently

### 2. Clarity (Explicit Contracts)

Each subagent declares:
- **Requires**: What input files needed
- **Produces**: What output files created (one producer per file — see the
  File Contract Table)
- **Tools**: An explicit allowlist, chosen for least privilege. (Omitting
  `tools:` would inherit every parent tool — legal, but sloppier.)
- **Constraints**: PDF reading protocol, checkpointing discipline

### 3. Checkpoints (Human in Loop)

Critical decisions have human approval:
- Phase 1: Approve screening decisions
- Phase 3: Approve outline structure
- Phases 5, 7: Automatic quality gates

### 4. Auditability (Complete Logging)

Every execution tracked:
- execution-log.json stores all phase runs
- Agent IDs recorded for resumption
- Timestamps for performance analysis
- User approvals documented

### 5. Resumability (No Lost Work)

If interrupted:
- Load execution-log.json
- Find last completed phase
- Resume from next phase
- No re-processing earlier work

---

## Technology Stack

### Models
- All agents declare `model: sonnet`, which resolves to the latest Claude
  Sonnet (currently Sonnet 4.6)
- Rationale: best balance of speed and quality for per-phase work; set
  `model: inherit` (or edit per agent) to match the main session instead

### Tools Available to Subagents
- **Read**: Read files (PDFs, markdown, etc.)
- **Write**: Create files
- **Edit**: Modify existing files
- **Bash**: Execute shell commands (for file operations)
- **Glob**: List files matching patterns
- **Grep**: Search file contents

### Storage
- **Local filesystem**: PDFs, outputs, settings
- **JSON state files**: execution-log.json for resumption
- **Markdown artifacts**: All outputs in markdown format

---

## Scalability

### Small Corpora (1-20 papers)
- All phases run sequentially in single contexts
- No special handling needed

### Medium Corpora (20-50 papers)
- Phase 2 may split into multiple context windows
- Otherwise standard execution
- Resumption helpful if interrupted

### Large Corpora (50-100+ papers)
- Phase 2 batches extraction across multiple context windows
- Each batch processed independently, results aggregated
- Resumption important for reliability
- Not yet extensively tested at the upper end of this range

### Very Large Corpora (200+ papers)
- Phase 1 and Phase 2 both require batching
- May need multiple sessions
- Architecturally supported but not yet validated at this scale

---

## Extensibility

### Adding New Phases

To add a Phase 8 (e.g., Methods Narrativizer):

1. Create `.claude/agents/methods-narrativizer.md` (frontmatter: name,
   description, model, color, tools — follow an existing specialist as
   the template, including its Autonomy Contract section)
2. Define inputs/outputs and add them to the File Contract Table
3. Update CLAUDE.md to spawn it at the right point
4. Add a checkpoint if needed
5. Update Phase 7 to validate the new phase's output

### Custom Phases

Users can add domain-specific phases:
- Phase 5b: Domain-Specific Synthesis
- Phase 6b: Policy Brief Generation
- Phase 8: Supplementary Materials

### Export Formats

Currently: Markdown output only

Future:
- DOCX export (manuscript-ready)
- LaTeX export (for journal submission)
- HTML export (for online viewing)
- PDF export (for sharing)

---

## Comparison: Skills vs Subagents

| Aspect | Skills | Subagents |
|--------|--------|-----------|
| **Context** | Accumulated | Isolated |
| **Max corpus** | Limited by context window | Larger (context isolation) |
| **Invocation** | Auto (model-driven) | Explicit (user/orchestrator-driven) |
| **Isolation** | None (all in one conversation) | Complete (separate contexts) |
| **Resumption** | Fragile | Built-in |
| **Error recovery** | Limited | Comprehensive |
| **Parallelization** | Not possible | Supported by the platform (multiple Agent calls per message); unused here because phases are sequentially dependent |
| **Audit trail** | None | Complete (execution-log.json) |
| **Checkpoints** | Manual | Automatic (orchestrator-managed) |
| **Quality gates** | None | Two mandatory gates |

---

## Possible Extensions (no committed timeline)

- [ ] Custom extraction fields (user-defined data to extract)
- [ ] Theme relationship mapping (how themes connect)
- [ ] Export to DOCX/LaTeX/HTML
- [ ] Reference manager integration (Zotero, Mendeley)
- [ ] Batch processing (multiple reviews)
- [ ] Knowledge graph generation

## Platform Features Worth Considering (current Claude Code)

Documented as options — none are adopted yet:

- **Subagent memory** (`memory: project` in frontmatter): lets an agent
  accumulate knowledge across sessions in a MEMORY.md — could let the
  screener remember criteria interpretations between resumed sessions
- **Worktree isolation** (`isolation: worktree`): gives a subagent its own
  git worktree — useful if phases ever write conflicting files
- **Subagent hooks** (`SubagentStop` etc.): could auto-trigger a gate
  whenever its upstream phase finishes
- **Per-agent effort** (`effort:`): raise effort for the two validators,
  lower it for triage
- **Agent teams** (experimental): parallel screening with genuinely
  independent screeners would be a real dual-screening upgrade to E5's
  second-pass approximation

---

## Troubleshooting Guide

### Configuration Issues

**Q: The main session does all the work instead of delegating to specialists**
A: The orchestrator instructions in `CLAUDE.md` must be loaded — confirm
you opened Claude Code at the repo root (CLAUDE.md is auto-loaded from
there), and that the agent names it spawns match the `name:` fields in
`.claude/agents/*.md`. (Note: a *missing* `tools:` line in an agent is NOT the cause —
omitting it just inherits all tools.)

**Q: A specialist tried to ask a question or spawn an agent mid-run**
A: It can't — the platform blocks `AskUserQuestion` and the Agent tool
inside subagents; such a call simply fails. If a spec *instructs* the
agent to do so, that's a spec bug: route the decision through a
`Decisions Required` section instead (see any agent's Autonomy Contract).

### Execution Issues

**Q: Phase 1 fails to read PDFs**
A: Check file format. Phase 1 requires valid PDF files. Use `file corpus/*` to verify.

**Q: Context overflow during Phase 2**
A: Automatic batching should prevent this. If it occurs, split corpus into smaller batches.

**Q: Phase 5 blocks due to fabricated citations**
A: Expected! Fix the draft (edit claimed citations or remove unsupported claims), then re-run Phase 5 (citation-validator agent).

### Quality Issues

**Q: Phase 7 consistency score too low**
A: Review the validation report. Likely issue: themes don't appear in outline, or outline sections missing from draft.

**Q: Want to re-run a specific phase**
A: Invoke the phase subagent directly. Don't need to re-run orchestrator.

### Resumption Issues

**Q: Lost my execution-log.json**
A: Execution log still exists in `outputs/`. Load it: `cat outputs/execution-log.json`

**Q: Want to start fresh after interruption**
A: Ask orchestrator: "Start fresh research workflow" (or rename old execution-log.json)

---

## Performance Characteristics

Execution time varies based on corpus size, PDF length, model speed, and content complexity. No formal benchmarks have been conducted.

**General observations:**
- Phases 1 and 2 (screening and extraction) are the most time-intensive, growing with corpus size
- Phases 3-7 operate on consolidated outputs and are relatively quick regardless of corpus size
- API costs depend on model choice, prompt length, and number of retries

**Resource usage:**
- **Storage**: Outputs are markdown files; storage needs are modest (PDFs excluded)
- **Network**: Requires API access to Claude (all other processing is local)

---

## Security & Privacy

### Data Handling

- **Local execution**: All data stays on your machine
- **No external APIs**: Except Claude API for LLM calls
- **Data retention**: PDF and output content sent to the Claude API is
  subject to your Anthropic plan's data-usage and retention settings —
  review them before processing sensitive or unpublished material
- **Audit trail**: execution-log.json is your record

### Best Practices

1. Keep corpus/ private (contains your research PDFs)
2. Review execution-log.json for audit
3. Archive outputs/ after manuscript submission
4. Don't commit PDFs to public repositories

---

## Conclusion

Research Writer demonstrates a powerful design pattern:

**Subagent orchestration** > Single-conversation workflow

This architecture aims to provide:
- Context isolation (no cross-phase accumulation)
- Reliability (quality gates + error recovery)
- Transparency (complete audit trail)
- Extensibility (easy to add new phases)
- Resumability (pick up where you left off)

**Result**: A more scalable approach to literature review automation than single-conversation workflows. Upper limits depend on model, API, and corpus characteristics.
