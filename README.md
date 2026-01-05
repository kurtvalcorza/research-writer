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

**Result**: Publication-ready literature review draft, ready for your manuscript.

---

## 📋 What is This?

Research Writer is a **7-phase literature review workflow** powered by **subagent orchestration**. Each phase runs in isolated context with built-in quality gates.

### Phases

| Phase | Name | Input | Output | Time |
|-------|------|-------|--------|------|
| **1** | Literature Discovery | PDFs | Screening matrix (INCLUDE/EXCLUDE/UNCERTAIN) | 5-20 min |
| **2** | Extraction & Synthesis | Approved PDFs | Extraction + synthesis matrices, themes | 15-30 min |
| **3** | Argument Structure | Synthesis matrix | Literature review outline | 5-10 min |
| **4** | Drafting | Outline + synthesis | Academic prose draft | 15-30 min |
| **4.5** | Citation Validation | Draft | Citation integrity report (quality gate) | 3-5 min |
| **6** | Contributions | Draft | Implications + future research | 10-15 min |
| **7** | Cross-Phase Validation | All outputs | Consistency score report (quality gate) | 5-10 min |

**Total time**: 1-2 hours for 20 papers, scales to 100+ papers

---

## 🎯 Why Subagents?

### The Problem with Skills-Based Workflow

Old system (skills) accumulated context with each phase:
```
Phase 1 → context grows
Phase 2 → context grows more
Phase 3 → context grows more
Phase 4 → OVERFLOW (breaks at ~5 papers)
```

### The Solution: Reference Architecture

New system uses a **project agent that reads phase specifications**:
```
Project Agent (.claude/agents/research-workflow-orchestrator.md)
├─ Phase 1: Reads subagents/01_literature-discovery/SUBAGENT.md
│           Follows the 3-pass screening workflow defined in spec
│           → Produces screening matrix
├─ Human checkpoint
├─ Phase 2: Reads subagents/02_literature-synthesis/SUBAGENT.md
│           Follows the batched extraction workflow defined in spec
│           → Produces synthesis matrix
├─ Phase 3: Reads subagents/03_argument-structurer/SUBAGENT.md
│           Follows the structuring logic defined in spec
│           → Produces outline
└─ ... (continues reading specs for each phase)
```

**Key Innovation**: The project agent doesn't contain implementation logic—it **reads and follows** the detailed specifications in `subagents/`. This means:
- ✅ No hardcoded workflows (update specs without touching the agent)
- ✅ Modular design (each phase independently specified)
- ✅ Context-safe (agent only loads what it needs per phase)

**Result**: Works with 3 papers OR 300 papers—no context overflow.

---

## 📁 Directory Structure

```
research-writer/
├── .claude/                            # Claude Code integration
│   └── agents/
│       └── research-workflow-orchestrator.md  (Project agent - user entry point)
│
├── subagents/                          # Phase-specific implementations
│   ├── 01_literature-discovery/
│   │   └── SUBAGENT.md                (Phase 1: Screening)
│   ├── 02_literature-synthesis/
│   │   └── SUBAGENT.md                (Phase 2: Extraction + Themes)
│   ├── 03_argument-structurer/
│   │   └── SUBAGENT.md                (Phase 3: Outline)
│   ├── 04_literature-drafter/
│   │   └── SUBAGENT.md                (Phase 4: Drafting)
│   ├── 05_citation-validator/
│   │   └── SUBAGENT.md                (Phase 4.5: Quality gate)
│   ├── 06_contribution-framer/
│   │   └── SUBAGENT.md                (Phase 6: Implications)
│   └── 07_cross-phase-validator/
│       └── SUBAGENT.md                (Phase 7: Quality gate)
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
- **Phase 4.5**: Automatic validation (blocks if citations fabricated)
- **Phase 7**: Automatic validation (blocks if consistency <75%)

### 4. Use Your Outputs

After completion, you have:

```
✅ literature-review-draft.md
   → Publication-ready literature review section
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

1. **Reads phase specifications** before executing each phase
2. **Follows the detailed workflow** defined in each spec file
3. **Does NOT improvise** or create its own implementation

**Critical Execution Pattern** (for each phase):
```
Step 1: Read subagents/XX_phase-name/SUBAGENT.md
Step 2: Follow the workflow defined in that spec exactly
Step 3: Produce outputs as specified
Step 4: Save state and proceed to next phase
```

This ensures:
- ✅ Consistent execution (follows proven workflows)
- ✅ No context overflow (only loads what's needed)
- ✅ Easy updates (modify specs without changing agent)

### What's a Phase Subagent Specification?

Each file in `subagents/` contains:
- **YAML frontmatter**: Required inputs, expected outputs, tools, time estimates
- **Detailed workflow**: Step-by-step implementation instructions
- **Batching strategies**: How to handle 5 papers vs 100 papers
- **Error handling**: What to do when things go wrong
- **Validation steps**: Quality checks before moving forward

**Example**: `subagents/02_literature-synthesis/SUBAGENT.md` (600 lines) defines:
- How to batch extraction (5 papers per context window)
- What data to extract from each paper
- How to identify cross-paper themes
- Output format for synthesis matrix

### Quality Gates

Two mandatory quality gates ensure output integrity:

1. **Phase 4.5 (Citation Validation)**: 
   - ❌ BLOCKS if fabricated citations found
   - ⚠️ WARNS if misattributions found
   - ✅ PASSES if all citations verified

2. **Phase 7 (Cross-Phase Validation)**:
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
[Phase 4.5: Citation Validation] ← QUALITY GATE (must pass)
  ↓
[Phase 6: Contribution Framing]
  ↓
[Phase 7: Cross-Phase Validation] ← FINAL QUALITY GATE (must pass)
  ↓
COMPLETE ✅
```

---

## ⚡ Advanced: Individual Subagent Invocation

You can also invoke individual phases directly:

```
"Use the phase-01-literature-discovery subagent to screen my PDFs"
```

This is useful for:
- Re-running specific phases
- Testing individual components
- Fine-grained control over workflow
- Troubleshooting

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
  "phases_to_run": [1, 2, 3, 4, 4.5, 6, 7],
  "started_at": "2025-01-05T10:30:00Z"
}
```

---

## 📈 Scaling: From 5 Papers to 500

| Corpus Size | Phase 1 | Phase 2 | Phase 3 | Phase 4 | Total Time |
|-------------|---------|---------|---------|---------|-----------|
| 5 papers | 5 min | 10 min | 3 min | 10 min | ~30 min |
| 20 papers | 15 min | 25 min | 5 min | 20 min | ~1.5 hours |
| 50 papers | 30 min | 60 min | 5 min | 30 min | ~2 hours |
| 100 papers | 60 min | 90+ min | 5 min | 45 min | ~3 hours |
| 300+ papers | Requires batching (Phase 2 splits into chunks) | | | | |

**For 300+ papers**: Phase 2 automatically batches extraction into 50-paper chunks

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

### Phase 4.5: citation-integrity-report.md
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

### "Phase 1 fails to read PDFs"
```
Cause: Corrupted PDFs or non-PDF files
Fix: 
1. Check file types: file corpus/* | grep -i pdf
2. Remove corrupted files
3. Retry Phase 1
```

### "Phase 4.5 finds fabricated citations"
```
Cause: Citations don't match extraction matrix
Fix:
1. Review citation-integrity-report.md
2. Edit literature-review-draft.md to fix citations
3. Re-run Phase 4.5
4. Retry Phase 7
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

1. **Phase 4.5**: Citation Validation
   - Verifies all citations exist in corpus
   - Detects fabricated claims
   - Blocks workflow if critical issues

2. **Phase 7**: Cross-Phase Validation
   - Checks consistency across all phases
   - Verifies evidence chains
   - Calculates consistency score (≥75 to pass)

**Result**: No low-quality output reaches your manuscript.

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

**Questions?** See docs/ folder or review individual SUBAGENT.md files for detailed specifications.

---

**Happy researching! 🚀**
