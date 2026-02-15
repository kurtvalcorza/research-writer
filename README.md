# Research Writer: Subagent-Based Research Orchestration

Transform your research PDFs into a complete, validated literature review in one automated workflow.

## 🚀 Quick Start

**Tell Claude Code (or your AI assistant):**

```
"Help me complete a literature review on [your research topic]"
```

The orchestrator subagent will:
1. ✅ Screen your research PDFs systematically
2. ✅ Extract and synthesize findings
3. ✅ Generate an outline structure
4. ✅ Draft academic prose
5. ✅ Validate citations (catch fabrications)
6. ✅ Frame contributions and implications
7. ✅ Validate consistency across all phases

**Result**: A structured literature review draft that you can refine for your manuscript.

---

## 📋 What is This?

Research Writer is a **7-phase literature review workflow** powered by **subagent orchestration**. Each phase runs in isolated context with built-in quality gates.

### Phases

| Phase | Agent Name | Input | Output |
|-------|------------|-------|--------|
| **1** | literature-screener | PDFs | Screening matrix (INCLUDE/EXCLUDE/UNCERTAIN) |
| **2** | extraction-synthesizer | Approved PDFs | Extraction + synthesis matrices, themes |
| **3** | argument-structurer | Synthesis matrix | Literature review outline |
| **4** | literature-drafter | Outline + synthesis | Academic prose draft |
| **5** | citation-validator | Draft | Citation integrity report (quality gate) |
| **6** | contribution-framer | Draft | Implications + future research |
| **7** | consistency-validator | All outputs | Consistency score report (quality gate) |

Execution time varies depending on corpus size, PDF length, and model speed.

---

## 🎯 Why Multi-Agent Architecture?

### The Problem with Single-Agent Workflows

Old approach accumulated context with each phase:
```
Phase 1 → context grows
Phase 2 → context grows more
Phase 3 → context grows more
Phase 4 → OVERFLOW (context window fills up)
```

### The Solution: Task Tool-Based Agent Orchestration

New system uses **orchestrator + specialized agents** (Claude Code pattern):
```
Orchestrator (.claude/agents/research-workflow-orchestrator.md)
├─ Phase 1: Spawns literature-screener agent via Task tool
│           → Agent runs in fresh context, produces screening matrix
├─ Human checkpoint
├─ Phase 2: Spawns extraction-synthesizer agent via Task tool
│           → Fresh context, reads Phase 1 outputs, produces synthesis
├─ Phase 3: Spawns argument-structurer agent via Task tool
│           → Fresh context, produces outline
├─ Phase 4: Spawns literature-drafter agent via Task tool
│           → Fresh context, produces draft
├─ Phase 5: Spawns citation-validator agent via Task tool (Quality Gate 1)
│           → Fresh context, validates citations
├─ Phase 6: Spawns contribution-framer agent via Task tool
│           → Fresh context, frames implications
└─ Phase 7: Spawns consistency-validator agent via Task tool (Quality Gate 2)
            → Fresh context, validates consistency
```

**Key Innovation**: Each phase runs as an **independent agent** with its own context window using Claude Code's Task tool. This means:
- ✅ True context isolation (each agent starts fresh)
- ✅ Handles larger corpora (no context accumulation)
- ✅ Modular design (each agent is self-contained)
- ✅ Proper Claude Code pattern (agents discoverable in `.claude/agents/`)

**Result**: Context isolation removes the per-phase accumulation problem, allowing larger corpora than single-conversation approaches.

---

## 📁 Directory Structure

```
research-writer/
├── .claude/                            # Claude Code integration
│   └── agents/
│       ├── research-workflow-orchestrator.md  (Orchestrator - user entry point)
│       ├── literature-screener.md             (Phase 1: Screening)
│       ├── extraction-synthesizer.md          (Phase 2: Extraction + Synthesis)
│       ├── argument-structurer.md             (Phase 3: Outline)
│       ├── literature-drafter.md              (Phase 4: Drafting)
│       ├── citation-validator.md              (Phase 5: Citation quality gate)
│       ├── contribution-framer.md             (Phase 6: Contributions)
│       └── consistency-validator.md           (Phase 7: Final quality gate)
│
├── corpus/                            # Your research PDFs (input)
│   └── [place your PDFs here]
│
├── outputs/                           # Generated artifacts
│   ├── literature-screening-matrix.md
│   ├── literature-extraction-matrix.md
│   ├── literature-synthesis-matrix.md
│   ├── literature-review-outline.md
│   ├── literature-review-draft.md
│   ├── research-contributions-implications.md
│   ├── citation-integrity-report.md
│   ├── cross-phase-validation-report.md
│   ├── execution-log.json              # Workflow state tracking
│   └── workflow-execution-summary.md
│
├── settings/
│   └── screening-criteria.md  (Customize your criteria)
│
├── docs/
│   ├── ARCHITECTURE.md                 (System design overview)
│   ├── SUBAGENT_GUIDE.md               (How to use subagents)
│   └── MIGRATION_GUIDE.md              (Upgrading from skills)
│
└── README.md                           (This file)
```

---

## 🚀 How to Use

### 1. Prepare Your Materials

```bash
# Place your research PDFs in corpus/
cp /path/to/your/pdfs/* corpus/

# Customize screening criteria (optional, default template provided)
nano settings/screening-criteria.md
```

### 2. Start the Workflow

**In Claude Desktop, or Claude Code:**

```
"Help me complete a literature review on [my research topic]"
```

**Or invoke the agent directly in Claude Code:**

```
/agents
→ Select: research-workflow-orchestrator
```

The agent will guide you through the complete workflow.

### 3. Approve Checkpoints

The orchestrator pauses at critical checkpoints:

- **Phase 1**: Approve your final research corpus (or modify screening)
- **Phase 3**: Approve outline structure (or request revisions)
- **Phase 5**: Automatic validation (blocks if citations fabricated)
- **Phase 7**: Automatic validation (blocks if consistency <75%)

### 4. Use Your Outputs

After completion, you have:

```
✅ literature-review-draft.md
   → Literature review draft for further refinement
   → Integrate directly into your manuscript

✅ research-contributions-implications.md
   → Contribution framing
   → Policy/practice implications
   → Future research directions

✅ citation-integrity-report.md
   → Proof all citations verified
   → No fabricated claims

✅ execution-log.json
   → Complete audit trail
   → Can resume from any phase
```

---

## 🔄 Resumable Workflows

**If interrupted:**

```
"Continue my research workflow"
```

The orchestrator will:
1. Load your execution log
2. Show last completed phase
3. Ask to resume from next phase
4. Continue without re-processing earlier work

---

## 🎓 Key Concepts

### How the Agent Works

The **research-workflow-orchestrator** is a Claude Code project agent that:

1. **Spawns specialized agents** for each phase via Task tool
2. **Each agent runs independently** in its own fresh context window
3. **Agents communicate through files** in the outputs/ directory
4. **Orchestrator coordinates** the workflow and manages checkpoints

**Critical Execution Pattern** (for each phase):
```
Step 1: Orchestrator spawns phase agent via Task tool
Step 2: Agent executes in fresh context, reads required inputs
Step 3: Agent produces outputs as specified
Step 4: Agent returns summary to orchestrator
Step 5: Orchestrator logs state and proceeds to next phase
```

This ensures:
- ✅ True context isolation (each agent starts with a fresh context window)
- ✅ No cross-phase context accumulation
- ✅ Independent agents (update one without touching others)
- ✅ Proper Claude Code pattern (discoverable in /agents menu)

### What's a Phase Agent?

Each agent in `.claude/agents/` contains:
- **YAML frontmatter**: Name, description, model, color, **tools**
- **Complete implementation**: All logic for that phase
- **Input/output specifications**: What files it reads/writes
- **Error handling**: How to handle edge cases
- **Quality checks**: Validation before completion

#### Critical Configuration: Tools

**Orchestrator agent** must include `Task` tool:
```yaml
---
name: research-workflow-orchestrator
tools: Read, Write, Bash, Glob, Grep, Task, AskUserQuestion
---
```

**Specialist agents** must NOT include `Task` tool:
```yaml
---
name: literature-screener
tools: Read, Write, Bash, Glob, Grep
---
```

This configuration enables:
- ✅ Orchestrator can spawn sub-agents via Task tool
- ✅ Specialists run in isolated contexts (no nested spawning)
- ✅ Proper multi-agent delegation pattern

**Example**: `extraction-synthesizer.md` agent:
- Runs in fresh context for Phase 2
- Reads screening-matrix.md from Phase 1
- Extracts data from each approved paper
- Identifies cross-paper themes
- Produces synthesis-matrix.md for Phase 3

### Quality Gates

Two mandatory quality gates ensure output integrity:

1. **Phase 5 (Citation Validation)**:
   - ❌ BLOCKS if fabricated citations found
   - ⚠️ WARNS if misattributions found
   - ✅ PASSES if all citations verified

2. **Phase 7 (Consistency Validation)**:
   - ✅ PASSES if consistency ≥75
   - ⚠️ WARNS if consistency 65-74
   - ❌ BLOCKS if consistency <65 or critical issues

### Execution Log

`outputs/execution-log.json` tracks:
- Every phase executed
- Agent ID for each phase
- Human approvals at checkpoints
- Timestamps
- Output files generated

**Use for**: Auditing workflow, resuming, understanding execution history

---

## 📊 Workflow State Machine

```
START
  ↓
[Phase 1: Discovery & Screening]
  ↓
CHECKPOINT 1: "Approve corpus?"
  ↓
[Phase 2: Extraction & Synthesis]
  ↓
[Phase 3: Argument Structuring]
  ↓
CHECKPOINT 2: "Approve outline?"
  ↓
[Phase 4: Drafting]
  ↓
[Phase 5: Citation Validation] ← QUALITY GATE (must pass)
  ↓
[Phase 6: Contribution Framing]
  ↓
[Phase 7: Cross-Phase Validation] ← FINAL QUALITY GATE (must pass)
  ↓
COMPLETE ✅
```

---

## ⚡ Advanced: Individual Subagent Invocation

You can also invoke individual phase agents directly:

```
"Use the literature-screener agent to screen my PDFs"
"Run the citation-validator agent on my draft"
```

This is useful for:
- Re-running specific phases
- Testing individual components
- Fine-grained control over workflow
- Troubleshooting

All phase agents are visible in `/agents` menu in Claude Code.

---

## 🛠️ Configuration

### Screening Criteria (settings/screening-criteria.md)

Customize what papers to include/exclude:

```markdown
# Literature Review Screening Criteria

## Research Topic
AI Adoption in Philippine Healthcare

## Inclusion Criteria
- [ ] Topic: AI/Machine Learning
- [ ] Geographic scope: Any region
- [ ] Language: English
- [ ] Date: 2015-present
- [ ] Study type: Empirical research

## Exclusion Criteria
- [ ] Opinion pieces or editorials
- [ ] Not healthcare-related
- [ ] Published before 2015
- [ ] Non-English publications

## Edge Cases
[Document how to handle unclear papers]
```

### Execution Context

After Phase 1, the orchestrator creates `outputs/execution-context.json`:

```json
{
  "research_topic": "AI Adoption in Philippine Healthcare",
  "corpus_path": "corpus/",
  "screening_criteria_file": "settings/screening-criteria.md",
  "phases_to_run": [1, 2, 3, 4, 5, 6, 7],
  "started_at": "2025-01-05T10:30:00Z"
}
```

---

## 📈 Scaling Considerations

Execution time depends on corpus size, PDF length, and model speed. In general:

- **Phases 1 and 2** (screening and extraction) take longer as corpus size grows, since they process each paper individually.
- **Phases 3-7** operate on consolidated outputs and are less sensitive to corpus size.
- **Large corpora (50+ papers)**: Phase 2 batches extraction to stay within context limits. Expect longer runs and plan for possible interruptions — the workflow is resumable.
- **Very large corpora (200+ papers)**: May require multiple sessions. Batching and resumability help, but this hasn't been extensively tested at scale.

---

## 🔍 Understanding the Output Files

### Phase 1: literature-screening-matrix.md
Raw decisions: INCLUDE / EXCLUDE / UNCERTAIN for each PDF

**Use case**: Verify you approved the right papers

### Phase 2: literature-synthesis-matrix.md
Cross-paper themes with evidence strength labels

**Use case**: Understand the themes your papers address

### Phase 3: literature-review-outline.md
Structured outline ready for drafting

**Use case**: Approve outline before drafting begins

### Phase 4: literature-review-draft.md
**THE MAIN DELIVERABLE** - Academic prose literature review

**Use case**: Copy directly into your manuscript

### Phase 5: citation-integrity-report.md
Citation validation results with any warnings

**Use case**: Proof that all citations verified, no fabrications

### Phase 6: research-contributions-implications.md
Your review's contributions, implications, future research

**Use case**: Add to your manuscript's Discussion/Conclusion

### Phase 7: cross-phase-validation-report.md
Final consistency check across all phases

**Use case**: Proof of workflow quality and integrity

---

## 🚨 Troubleshooting

### "Orchestrator does all work instead of delegating"
```
Cause: Missing tools: configuration in agent files
Fix:
1. Verify orchestrator has Task tool:
   grep "^tools:" .claude/agents/research-workflow-orchestrator.md

2. Should show: tools: Read, Write, Bash, Glob, Grep, Task, AskUserQuestion

3. If missing, agents need tools: field in YAML frontmatter
   (See "Critical Configuration: Tools" section above)
```

### "Phase 1 fails to read PDFs"
```
Cause: Corrupted PDFs or non-PDF files
Fix:
1. Check file types: file corpus/* | grep -i pdf
2. Remove corrupted files
3. Retry Phase 1
```

### "Phase 5 finds fabricated citations"
```
Cause: Citations don't match extraction matrix
Fix:
1. Review citation-integrity-report.md
2. Edit literature-review-draft.md to fix citations
3. Re-run Phase 5 (citation-validator agent)
4. Proceed to Phase 6
```

### "Phase 7 consistency score too low"
```
Cause: Themes don't trace through phases consistently
Fix:
1. Review cross-phase-validation-report.md
2. Identify where trace breaks
3. Re-run affected phases
4. Retry Phase 7
```

### "Want to resume mid-workflow"
```
Ask: "Continue my research workflow"

Orchestrator will:
1. Load execution-log.json
2. Show last completed phase
3. Resume from next phase
4. No re-processing earlier phases
```

---

## 🔐 Quality Assurance

Every workflow has TWO quality gates that MUST pass:

1. **Phase 5**: Citation Validation
   - Verifies all citations exist in corpus
   - Detects fabricated claims
   - Blocks workflow if critical issues

2. **Phase 7**: Consistency Validation
   - Checks consistency across all phases
   - Verifies evidence chains
   - Calculates consistency score (≥75 to pass)

**Result**: These gates help catch common issues before output reaches your manuscript.

---

## 📚 Documentation

- **ARCHITECTURE.md**: Deep dive into system design
- **SUBAGENT_GUIDE.md**: How to invoke individual subagents
- **MIGRATION_GUIDE.md**: Upgrading from old skill-based workflow

---

## 🤝 Contributing

Want to improve research-writer?

1. **Report issues**: Found a bug? Create an issue
2. **Suggest features**: Want new phases? Suggest it
3. **Improve subagents**: Better execution logic? Submit a PR

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🎓 Citation

If you use Research Writer in your work:

```bibtex
@software{research_writer_2025,
  title={Research Writer: Subagent-Based Research Orchestration},
  author={Kurt Valcorza},
  year={2025},
  url={https://github.com/kurtvalcorza/research-writer}
}
```

---

## 🎯 Getting Started Checklist

- [ ] Clone or download research-writer
- [ ] Place your PDFs in `corpus/`
- [ ] Review `settings/screening-criteria.md` (optional customization)
- [ ] Tell Claude Code: "Help me complete a literature review on [topic]"
- [ ] Approve checkpoints when asked
- [ ] Collect outputs from `outputs/` directory
- [ ] Integrate `literature-review-draft.md` into your manuscript

**Questions?** See docs/ folder or review individual agent files in `.claude/agents/` for detailed specifications.

---

**Happy researching! 🚀**
