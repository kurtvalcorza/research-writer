# Research Writer Architecture

## System Overview

Research Writer is a **7-phase literature review orchestration system** powered by **subagent-based workflow management**.

### Key Innovation: Subagent Orchestration

Instead of running all phases in a single conversation (which causes context overflow), each phase runs as an **isolated subagent** with clean context:

```
Old (Skills-based):
- All phases in one conversation
- Context accumulates
- Breaks at ~5 papers
- Maximum corpus: 5-10 papers

New (Subagent-based):
- Each phase isolated context
- Fresh start for each phase
- Scales to 100+ papers
- Maximum corpus: 100+ papers
```

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    User Request                                 │
│  "Help me complete a literature review on [topic]"              │
│                    OR                                           │
│  /agents → research-workflow-orchestrator                       │
└─────────────────────┬─────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│  ORCHESTRATOR (.claude/agents/research-workflow-orchestrator)   │
│  - Validates prerequisites                                      │
│  - Spawns phase agents via Task tool                            │
│  - Manages phase sequencing                                     │
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
.claude/agents/
├── research-workflow-orchestrator.md   # Main coordinator (HAS Task tool)
├── literature-screener.md              # Phase 1: Screening (NO Task tool)
├── extraction-synthesizer.md           # Phase 2: Extraction & Synthesis (NO Task tool)
├── argument-structurer.md              # Phase 3: Outline Generation (NO Task tool)
├── literature-drafter.md               # Phase 4: Academic Prose (NO Task tool)
├── citation-validator.md               # Phase 5: Citation Quality Gate (NO Task tool)
├── contribution-framer.md              # Phase 6: Contributions (NO Task tool)
└── consistency-validator.md            # Phase 7: Final Quality Gate (NO Task tool)
```

### Critical Configuration Requirements

**For multi-agent delegation to work, explicit `tools:` configuration is REQUIRED in YAML frontmatter.**

#### Orchestrator Agent Configuration

```yaml
---
name: research-workflow-orchestrator
description: Use this agent when the user requests any literature review...
model: sonnet
color: green
tools: Read, Write, Bash, Glob, Grep, Task, AskUserQuestion
---
```

**Key tools:**
- `Task` - **CRITICAL**: Enables spawning sub-agents
- `AskUserQuestion` - For human checkpoints
- Standard file tools for coordination

#### Specialist Agent Configuration

All 7 specialist agents use this pattern:

```yaml
---
name: literature-screener  # or extraction-synthesizer, etc.
description: Screen and triage research PDFs...
model: sonnet
color: blue
tools: Read, Write, Bash, Glob, Grep
---
```

**Intentionally excluded:**
- `Task` - Prevents nested sub-agent spawning (only orchestrator spawns)
- `AskUserQuestion` - Specialists work autonomously

**Why this matters:**
- ✅ Without `Task` in orchestrator → orchestrator cannot spawn sub-agents
- ✅ Without excluding `Task` from specialists → unwanted nested spawning
- ✅ Proper configuration → clean multi-agent delegation pattern

### Agent Execution Pattern

The orchestrator uses Claude Code's **Task tool** to spawn each agent in isolation:

```javascript
// Orchestrator spawns Phase 1
Task(subagent_type: "literature-screener", prompt: "Screen papers in corpus/")
  → literature-screener agent runs in fresh context
  → Produces outputs/literature-screening-matrix.md
  → Returns summary to orchestrator

// Orchestrator spawns Phase 2
Task(subagent_type: "extraction-synthesizer", prompt: "Extract from approved papers")
  → extraction-synthesizer agent runs in fresh context
  → Reads screening-matrix.md
  → Produces synthesis outputs
  → Returns summary to orchestrator

// Pattern continues for all 7 phases...
```

### Key Architectural Benefits

1. **Context Isolation**: Each agent gets fresh ~200K token context window
2. **Scalability**: Handle 100+ papers without context overflow
3. **Maintainability**: Update individual agents without touching orchestrator
4. **Discoverability**: All agents visible in Claude Code's `/agents` menu
5. **Semantic Names**: Agent names describe function, not execution order

## Two-Tier Design: Orchestrator + Phase Agents

### Tier 1: Research Workflow Orchestrator (Project Agent)

**What it does:**
- Orchestrates the complete 7-phase workflow
- Manages human approval checkpoints
- Tracks execution state
- Enables workflow resumption
- Handles phase sequencing

**Lives in**: `.claude/agents/research-workflow-orchestrator.md`

**How it works:**
- Registered as a Claude Code project agent
- Appears in `/agents` list for easy invocation
- Spawns phase agents via Task tool
- Each agent runs in fresh context window
- Coordinates workflow through file-based communication

**Not responsible for:**
- Phase logic (that's each phase agent)
- Domain knowledge (agents are self-contained)
- Implementation details (each phase agent handles its own)

### Tier 2: Phase Agents (7 total)

Each phase is a **self-contained independent agent**:
- Spawned via Task tool by orchestrator
- Runs in fresh context window
- Reads required inputs from outputs/
- Produces specific outputs to outputs/
- Can be invoked directly from `/agents` menu
- Returns summary to orchestrator

**Agents**:
1. **literature-screener** - Screen PDFs by criteria
2. **extraction-synthesizer** - Extract info, identify themes
3. **argument-structurer** - Organize themes into outline
4. **literature-drafter** - Write academic prose
5. **citation-validator** - Quality gate #1 (verify citations)
6. **contribution-framer** - Frame implications
7. **consistency-validator** - Quality gate #2 (consistency check)

---

## Execution Flow

### State Tracking: execution-log.json

```json
{
  "workflow_id": "rw-20250105-153000",
  "research_topic": "AI Adoption in Philippine Healthcare",
  "started_at": "2025-01-05T10:30:00Z",
  "status": "in_progress",
  "current_phase": 2,
  "phases": [
    {
      "phase": 1,
      "name": "Literature Discovery & Screening",
      "agent_id": "agent-abc123xyz",
      "status": "success",
      "human_approval": "approved",
      "output_files": [
        "outputs/literature-screening-matrix.md",
        "outputs/prisma-flow-diagram.md"
      ]
    },
    {
      "phase": 2,
      "name": "Literature Extraction & Synthesis",
      "agent_id": "agent-def456uvw",
      "status": "in_progress"
    }
  ],
  "checkpoints": [
    {
      "phase": 1,
      "type": "approval_required",
      "user_choice": "approved"
    }
  ]
}
```

**Use cases:**
- **Resume**: Load last completed phase, continue from next
- **Audit**: See complete execution history
- **Debug**: Identify where issues occurred

### Checkpoint System

**Three types of checkpoints:**

1. **Approval Checkpoints** (Phases 1, 3)
   - User reviews outputs
   - Approves or requests changes
   - Can re-run phase if needed

2. **Auto Quality Gates** (Phases 5, 7)
   - Run automatically
   - BLOCK if critical issues found
   - WARN if minor issues found

3. **Progress Checkpoints** (Phases 2, 4, 6)
   - Optional review points
   - User can approve or retry
   - Non-blocking

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
... unlimited phases possible
```

### Practical Implementation

**For each phase subagent:**
1. Receive only required inputs (not all prior phases)
2. Process with fresh context
3. Produce specific outputs
4. Return to orchestrator
5. Clear context

**Critical**: Phase 2 (synthesis) batches large corpora:
- Max 5 papers per context window
- Save progress after each batch
- Continue with next batch
- Result: Process unlimited papers

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

### Orchestrator (.claude/agents/)

**Entry point**: `research-workflow-orchestrator.md`

Contains:
- YAML frontmatter (name, description, model, color)
- Trigger examples for Claude Code
- Task tool invocation patterns for each phase
- Human checkpoint management logic
- Quality assurance standards

**User experience:**
- Visible in `/agents` command
- Auto-invoked by Claude Code when user requests literature review
- Clean, single orchestrator interface

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
1. Orchestrator spawns agent via Task tool
2. Agent runs in fresh context window
3. Agent reads required inputs
4. Agent executes phase logic independently
5. Agent produces outputs
6. Agent returns summary to orchestrator

### Output Files (outputs/)

Generated during workflow:

```
outputs/
├── execution-log.json                    # Workflow state
├── execution-context.json                # User inputs
├── literature-screening-matrix.md        # Phase 1 output
├── literature-extraction-matrix.md       # Phase 2 output
├── literature-synthesis-matrix.md        # Phase 2 output
├── literature-review-outline.md          # Phase 3 output
├── literature-review-draft.md            # Phase 4 output ← MAIN
├── citation-integrity-report.md          # Phase 5 output
├── research-contributions-implications.md # Phase 6 output
├── cross-phase-validation-report.md      # Phase 7 output
└── workflow-execution-summary.md         # Final summary
```

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
- **Produces**: What output files created
- **Tools**: What abilities it has (MUST be explicit in YAML frontmatter)
- **Constraints**: Time/size limits

**Critical**: The `tools:` field in YAML frontmatter is not optional—it's required for proper multi-agent delegation. Without it, the orchestrator cannot spawn sub-agents.

### 3. Checkpoints (Human in Loop)

Critical decisions have human approval:
- Phase 1: Approve screening decisions
- Phase 3: Approve outline structure
- Phases 4.5, 7: Automatic quality gates

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
- **Claude Sonnet 4**: Default model for all phases
- Rationale: Best balance of speed and quality

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
- All phases single context
- Phase 1-7 in sequence
- Total time: 30 min - 1.5 hours
- No special handling needed

### Medium Corpora (20-50 papers)
- Phase 2 may split into 2-3 context windows
- Otherwise standard execution
- Total time: 1.5 - 2 hours
- Resumption helpful if interrupted

### Large Corpora (50-100+ papers)
- Phase 2 batches into 10-20 context windows
- Each batch processed independently
- Results aggregated
- Total time: 2-3 hours
- Resumption essential for reliability

### Very Large Corpora (300+ papers)
- Phase 1 screens in batches of 50
- Phase 2 extracts in batches of 5
- All other phases on consolidated results
- Requires planning execution across multiple sessions
- Total time: 4-6 hours across multiple days

---

## Extensibility

### Adding New Phases

To add a Phase 8 (Methods Narrativizer):

1. Create `subagents/08_methods-narrativizer/SUBAGENT.md`
2. Define inputs/outputs
3. Update orchestrator to invoke at right point
4. Add checkpoint if needed
5. Update Phase 7 to validate new phase

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
| **Max corpus** | 5-10 papers | 100+ papers |
| **Invocation** | Auto (model-driven) | Explicit (user/orchestrator-driven) |
| **Isolation** | None (all in one conversation) | Complete (separate contexts) |
| **Resumption** | Fragile | Built-in |
| **Error recovery** | Limited | Comprehensive |
| **Parallelization** | Not possible | Future-ready |
| **Audit trail** | None | Complete (execution-log.json) |
| **Checkpoints** | Manual | Automatic (orchestrator-managed) |
| **Quality gates** | None | Two mandatory gates |

---

## Future Roadmap

### V2 (Q1 2025)
- [ ] Parallel phase execution (Phases 1+2 concurrently)
- [ ] Custom extraction fields (user-defined data to extract)
- [ ] Theme relationship mapping (how themes connect)
- [ ] Geographic/temporal analysis

### V3 (Q2 2025)
- [ ] Export to DOCX/LaTeX/HTML
- [ ] Team collaboration (multi-user workflows)
- [ ] Reference manager integration (Zotero, Mendeley)
- [ ] Web UI enhancement

### V4 (Q3+ 2025)
- [ ] Custom subagents (user-defined phases)
- [ ] Batch processing (hundreds of reviews)
- [ ] Knowledge graph generation
- [ ] Integration with manuscript tools

---

## Troubleshooting Guide

### Configuration Issues

**Q: Orchestrator does all the work instead of delegating to specialists**
A: **Root Cause**: Missing `tools:` configuration in agent frontmatter.

**Fix:**
1. Verify orchestrator has `Task` tool:
   ```bash
   grep "^tools:" .claude/agents/research-workflow-orchestrator.md
   # Should output: tools: Read, Write, Bash, Glob, Grep, Task, AskUserQuestion
   ```

2. Verify specialists do NOT have `Task` tool:
   ```bash
   grep "^tools:" .claude/agents/literature-screener.md
   # Should output: tools: Read, Write, Bash, Glob, Grep
   ```

3. If missing, add to YAML frontmatter as shown in "Critical Configuration Requirements" section above.

**Q: Specialist agents try to spawn their own sub-agents**
A: Remove `Task` from specialist agent `tools:` configuration.

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

### Execution Time by Phase

| Phase | 5 papers | 20 papers | 50 papers | Notes |
|-------|----------|-----------|-----------|-------|
| 1 | 5 min | 15 min | 30 min | Scales linearly with PDFs |
| 2 | 10 min | 25 min | 60 min | Batching prevents overflow |
| 3 | 3 min | 5 min | 5 min | Independent of corpus size |
| 4 | 10 min | 20 min | 30 min | Scales with complexity |
| 5 | 2 min | 3 min | 5 min | Citation checking |
| 6 | 5 min | 10 min | 10 min | Implication framing |
| 7 | 3 min | 5 min | 5 min | Final validation |
| **Total** | **~40 min** | **~1.5 hrs** | **~2 hrs** | Scales well |

### Resource Usage

- **Storage**: ~1 MB per 10 papers (PDFs excluded)
- **Memory**: ~2 GB per phase execution
- **Network**: None (local execution)
- **Cost**: ~$0.05-0.15 per 10 papers (API usage for Claude)

---

## Security & Privacy

### Data Handling

- **Local execution**: All data stays on your machine
- **No external APIs**: Except Claude API for LLM calls
- **No data retention**: Claude doesn't retain your PDFs or outputs
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

This architecture enables:
✅ Unlimited corpus size (no context overflow)
✅ Reliability (quality gates + error recovery)
✅ Transparency (complete audit trail)
✅ Extensibility (easy to add new phases)
✅ Resumability (no lost work)

**Result**: Robust, scalable literature review automation.
