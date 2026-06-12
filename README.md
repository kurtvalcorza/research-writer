# Research Writer: Subagent-Based Research Orchestration

Transform your research PDFs into a complete, validated literature review in one automated workflow.

## 🚀 Quick Start

**Tell Claude Code:**

```
"Help me complete a literature review on [your research topic]"
```

The orchestrator will:
0. ✅ *(Optional but recommended)* Design a documented search strategy you execute
1. ✅ Screen your research PDFs systematically
2. ✅ Extract and synthesize findings (with indicative quality appraisal)
3. ✅ Generate an outline structure
4. ✅ Draft academic prose
5. ✅ Validate citations (catch fabrications)
6. ✅ Frame contributions, implications, and an AI-use methods disclosure
7. ✅ Validate consistency across all phases

**Result**: A structured literature review draft that you can refine for your manuscript.

### What this pipeline is (and isn't)

Research Writer fully supports **narrative and scoping reviews**, and **assists** PRISMA-style systematic reviews. For systematic-review claims you must execute the documented search yourself (Phase 0 output), and understand that dual independent human screening and formal risk-of-bias assessment are *approximated* (borderline second-pass screening, indicative quality flags), not replaced. The pipeline generates an honest `outputs/methods-disclosure.md` you can adapt for your manuscript.

---

## 📋 What is This?

Research Writer is a **literature review workflow** powered by **subagent orchestration**: an optional Phase 0 plus 7 core phases, each running in isolated context with built-in quality gates.

### Phases

| Phase | Agent Name | Input | Output |
|-------|------------|-------|--------|
| **0** *(optional)* | search-strategist | Research question + criteria | Documented search strategy (you execute it) |
| **1** | literature-screener | PDFs | Screening matrix (INCLUDE/EXCLUDE/UNCERTAIN), PRISMA diagram |
| **2** | extraction-synthesizer | Approved PDFs | Per-paper extractions, extraction + synthesis matrices, quality report |
| **3** | argument-structurer | Synthesis matrix | Literature review outline |
| **4** | literature-drafter | Outline + synthesis | Academic prose draft |
| **5** | citation-validator | Draft + extractions | Citation integrity report (quality gate) |
| **6** | contribution-framer | Draft | Implications + future research + methods disclosure |
| **7** | consistency-validator | All outputs | Consistency score report (quality gate) |

Execution time varies depending on corpus size, PDF length, and model speed.

---

## 🎯 Why Multi-Agent Architecture?

### The Problem with Single-Conversation Workflows

A single conversation accumulates context with each phase:
```
Phase 1 → context grows
Phase 2 → context grows more
Phase 3 → context grows more
Phase 4 → OVERFLOW (context window fills up)
```

### The Solution: Orchestrator + Specialist Subagents

The **main Claude Code session is the orchestrator** — its behavior is defined by `CLAUDE.md` at the repo root. It spawns each phase as a specialist subagent via the **Agent tool** (renamed from "Task" in Claude Code v2.1.63; the old name still works as an alias):

```
Orchestrator (main session, driven by CLAUDE.md)
├─ Phase 0: spawns search-strategist (optional)
│           → strategy documented; YOU run the searches
├─ Human checkpoint (strategy approval, corpus assembly)
├─ Phase 1: spawns literature-screener
│           → fresh context, produces screening matrix + PRISMA diagram
├─ Human checkpoint (screening approval + Decisions Required items)
├─ Phase 2: spawns extraction-synthesizer
│           → fresh context, produces per-paper extractions + matrices
├─ Human checkpoint (extraction spot-check vs source PDFs)
├─ Phase 3: spawns argument-structurer → outline
├─ Human checkpoint (outline approval)
├─ Phase 4: spawns literature-drafter → draft
├─ Phase 5: spawns citation-validator (QUALITY GATE 1)
│           → FAIL triggers automatic drafter revision cycle (max 2)
├─ Phase 6: spawns contribution-framer → contributions + disclosure
└─ Phase 7: spawns consistency-validator (QUALITY GATE 2)
            → computed 0-100 score; FAIL routes fixes by issue type
```

**Why the orchestrator is NOT itself a subagent**: Claude Code subagents cannot spawn other subagents and cannot ask the user questions — both are platform restrictions. Orchestration therefore lives in the main session (via `CLAUDE.md`), which is the only place that can do both.

**Key benefit**: each phase runs in a fresh context window, so context never accumulates across phases — larger corpora than single-conversation approaches.

---

## 📁 Directory Structure

```
research-writer/
├── CLAUDE.md                          # ORCHESTRATOR — drives the main session
├── .claude/
│   └── agents/                        # 8 specialist subagents
│       ├── search-strategist.md       (Phase 0: Search strategy — optional)
│       ├── literature-screener.md     (Phase 1: Screening)
│       ├── extraction-synthesizer.md  (Phase 2: Extraction + Synthesis)
│       ├── argument-structurer.md     (Phase 3: Outline)
│       ├── literature-drafter.md      (Phase 4: Drafting)
│       ├── citation-validator.md      (Phase 5: Citation quality gate)
│       ├── contribution-framer.md     (Phase 6: Contributions + disclosure)
│       └── consistency-validator.md   (Phase 7: Final quality gate)
│
├── corpus/                            # Your research PDFs (input)
│
├── settings/
│   ├── screening-criteria.md          # Customize your criteria (template)
│   └── search-strategy.md             # Phase 0 output; you fill results table
│
├── outputs/                           # Generated artifacts — see the File
│   │                                  # Contract Table in ARCHITECTURE.md for
│   │                                  # the authoritative producer/consumer map
│   ├── literature-screening-matrix.md
│   ├── prisma-flow-diagram.md
│   ├── paper-pXXX-extraction.md       (one per paper — audit trail)
│   ├── literature-extraction-matrix.md
│   ├── literature-synthesis-matrix.md
│   ├── extraction-quality-report.md
│   ├── literature-review-outline.md
│   ├── literature-review-draft.md     ← MAIN DELIVERABLE
│   ├── citation-integrity-report.md
│   ├── research-contributions-implications.md
│   ├── methods-disclosure.md
│   ├── cross-phase-validation-report.md
│   ├── execution-log.json             (state; see execution-log.example.json)
│   ├── execution-context.json         (state)
│   └── workflow-execution-summary.md  (written at completion)
│
├── ARCHITECTURE.md                    (System design + File Contract Table)
└── README.md                          (This file)
```

---

## 🚀 How to Use

> **Requires Claude Code** (CLI, desktop app, or web). The workflow depends on
> Claude Code's subagent system (`.claude/agents/`) and project instructions
> (`CLAUDE.md`); it will not orchestrate itself in other clients.

### 1. Prepare Your Materials

```bash
# Place your research PDFs in corpus/
cp /path/to/your/pdfs/* corpus/

# Customize screening criteria (template provided)
$EDITOR settings/screening-criteria.md
```

No corpus yet? Start anyway — the orchestrator will offer Phase 0, which produces
ready-to-paste database queries and a results-recording template.

### 2. Start the Workflow

```
"Help me complete a literature review on [my research topic]"
```

The orchestrator (main session, per `CLAUDE.md`) guides you through every phase.

### 3. Checkpoints

Three kinds:

- **Approval (blocking)** — Phase 0 (strategy review; then you run the searches),
  Phase 1 (screening decisions + every `Decisions Required` item), Phase 3 (outline)
- **Quality gates (automatic)** — Phase 5 and Phase 7; on FAIL the orchestrator runs
  up to 2 automatic revision cycles before asking you
- **Progress (lightweight)** — Phase 2 (the **extraction spot-check**: you verify a
  small sample of extraction files against the source PDFs — the pipeline's only
  ground-truth check), Phases 4 and 6 (optional early review)

### 4. Use Your Outputs

```
✅ literature-review-draft.md
   → Literature review draft for further refinement

✅ research-contributions-implications.md
   → Contribution framing, implications, future research

✅ methods-disclosure.md
   → AI-use disclosure paragraph for your methods section

✅ citation-integrity-report.md
   → Proof all citations verified against the corpus

✅ execution-log.json
   → Complete audit trail; enables resuming
```

---

## 🔄 Resumable Workflows

**If interrupted:**

```
"Continue my research workflow"
```

The orchestrator loads `outputs/execution-log.json`, shows the last completed
phase, and resumes — no re-processing. Phases 1 and 2 checkpoint after every
paper, so even a mid-phase interruption costs at most one paper of work.

---

## 🎓 Key Concepts

### How Orchestration Works

1. **The main session is the orchestrator** — `CLAUDE.md` defines its workflow
2. **Each phase is a specialist subagent** spawned via the Agent tool, running in its own fresh context window
3. **Agents communicate through files** in `outputs/` (see the File Contract Table in ARCHITECTURE.md)
4. **Specialists never interact with the user** — subagents cannot use AskUserQuestion; they leave `Decisions Required` sections and status flags that the orchestrator surfaces at checkpoints

### Tools Configuration (current Claude Code semantics)

- If an agent's frontmatter **omits** `tools:`, it inherits **every** tool available to the parent — explicit `tools:` is a *scoping choice*, not a delegation requirement.
- Subagents **cannot** spawn other subagents and **cannot** use `AskUserQuestion`, regardless of what `tools:` lists — these are platform restrictions, which is exactly why the orchestrator lives in the main session.
- The specialists here declare `tools: Read, Write, Bash, Glob, Grep` deliberately, to keep each phase least-privileged.

### Quality Gates

1. **Phase 5 (Citation Validation)** — report begins with a machine-readable `STATUS:` header:
   - ❌ FAIL: any FABRICATED (hallucinated), OUT_OF_CORPUS (real-looking but not in your corpus), or fundamentally misattributed citation. OUT_OF_CORPUS items **pause the workflow first** — you choose delete-vs-rescue per item before any auto-revision can touch them; FABRICATED-only failures go straight to the automatic drafter revision cycle (max 2), then human review
   - ⚠️ WARN: misattributions / missing citations — you decide: proceed or revise
   - ✅ PASS: every citation verified; a 20% sample deep-checked against per-paper extraction files

2. **Phase 7 (Consistency Validation)** — computed score, shown with its arithmetic:
   - Theme traceability (40) + section coverage (30) + sampled claim support (30)
   - ✅ PASS ≥75 with zero critical flags / ⚠️ WARN 65–74 / ❌ FAIL <65 or any critical flag (overclaim, misrepresented evidence, undrafted section)

---

## 📊 Workflow State Machine

```
START
  ↓
[Phase 0: Search Strategy] (optional) → CHECKPOINT: approve; YOU run searches
  ↓
[Phase 1: Screening] → CHECKPOINT: approve corpus + Decisions Required
  ↓
[Phase 2: Extraction & Synthesis] → CHECKPOINT: extraction spot-check
  ↓
[Phase 3: Argument Structuring] → CHECKPOINT: approve outline
  ↓
[Phase 4: Drafting]
  ↓
[Phase 5: Citation Validation] ← GATE 1 ──FAIL──→ drafter Revision Mode (≤2 cycles)
  ↓ PASS
[Phase 6: Contribution Framing + Methods Disclosure]
  ↓
[Phase 7: Cross-Phase Validation] ← GATE 2 ──FAIL──→ routed fixes (≤2 cycles)
  ↓ PASS
COMPLETE ✅ (workflow-execution-summary.md written)
```

---

## ⚡ Advanced: Individual Subagent Invocation

You can invoke individual phase agents directly:

```
"Use the literature-screener agent to screen my PDFs"
"Run the citation-validator agent on my draft"
```

Useful for re-running specific phases, testing, or troubleshooting. All agents are
visible in Claude Code's `/agents` menu. Check phase dependencies first — each
agent's spec lists its required input files.

---

## 🛠️ Configuration

### Screening Criteria (`settings/screening-criteria.md`)

The provided template covers inclusion/exclusion criteria, edge-case rules, and
worked examples. **Customize it before running** — and keep the temporal scope and
temporal exclusions consistent (the screener flags mismatches it detects).

### Search Strategy (`settings/search-strategy.md`)

Produced by Phase 0. Contains concept blocks, per-database Boolean queries, and a
results table **you** fill in after running the searches. Feeds the PRISMA
identification stage; without it, the PRISMA diagram states that identification
was not systematic.

### Execution Context (`outputs/execution-context.json`)

Written by the orchestrator **at initialization** (after you confirm the topic):

```json
{
  "research_topic": "AI Adoption in Philippine Healthcare",
  "corpus_path": "corpus/",
  "criteria_path": "settings/screening-criteria.md",
  "phases_to_run": [0, 1, 2, 3, 4, 5, 6, 7],
  "started_at": "2026-06-12T10:30:00Z"
}
```

---

## 📈 Scaling Considerations

Execution time depends on corpus size, PDF length, and model speed. In general:

- **Phases 1 and 2** process each paper individually and grow with corpus size; both checkpoint after every paper.
- **Phases 3–7** operate on consolidated outputs and are less sensitive to corpus size.
- **Large corpora (50+ papers)**: expect longer runs and plan for interruptions — the workflow is resumable.
- **Very large corpora (200+ papers)**: may require multiple sessions. Architecturally supported but not extensively tested at scale.

---

## 🚨 Troubleshooting

### "Phase 1 fails to read PDFs"
```
Cause: Corrupted PDFs or non-PDF files
Fix:
1. Check file types: file corpus/* | grep -i pdf
2. Remove corrupted files (or OCR scanned ones)
3. Retry Phase 1 — unreadable files are marked METADATA_INSUFFICIENT and
   listed under Decisions Required, never silently dropped
```

### "Phase 5 reports OUT_OF_CORPUS citations"
```
Cause: The draft cited a real paper that isn't in your corpus (the drafter
       is corpus-only by rule, but this is the safety net)
Fix — your choice at the checkpoint:
1. Delete the citation (orchestrator runs a drafter revision cycle), OR
2. Add the paper's PDF to corpus/ and re-run extraction for it, then
   re-validate
```

### "Phase 7 consistency score too low"
```
Cause: Themes don't trace through phases consistently
Fix:
1. Read cross-phase-validation-report.md — the score arithmetic shows
   exactly which themes/sections/claims failed
2. The orchestrator routes fixes automatically (drafter or framer);
   structural issues need a Phase 3 re-run
```

### "Want to resume mid-workflow"
```
Ask: "Continue my research workflow"
The orchestrator loads execution-log.json and resumes from the next phase.
```

---

## 🔐 Quality Assurance

Every workflow has TWO quality gates that MUST pass, plus a human ground-truth check:

1. **Phase 2 spot-check**: you verify a sample of extractions against source PDFs — automation validates *internal* consistency; this validates against *reality*
2. **Phase 5**: citation integrity (fabrication/out-of-corpus detection, sampled claim verification)
3. **Phase 7**: cross-phase consistency (computed 0–100 score with shown arithmetic)

---

## 📚 Documentation

- **[ARCHITECTURE.md](ARCHITECTURE.md)**: System design, File Contract Table, canonical state schema
- **[REMEDIATION-PLAN.md](REMEDIATION-PLAN.md)**: The audit and fix plan that produced the current design

---

## 🤝 Contributing

1. **Report issues**: Found a bug? Create an issue
2. **Suggest features**: Want new phases? Suggest it
3. **Improve subagents**: Better execution logic? Submit a PR — run `scripts/validate-contracts.sh` before pushing

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🎓 Citation

If you use Research Writer in your work:

```bibtex
@software{research_writer_2026,
  title={Research Writer: Subagent-Based Research Orchestration},
  author={Kurt Valcorza},
  year={2026},
  url={https://github.com/kurtvalcorza/research-writer}
}
```

---

## 🎯 Getting Started Checklist

- [ ] Clone or download research-writer
- [ ] (Recommended) Run Phase 0 and execute the documented search; or place existing PDFs in `corpus/`
- [ ] Customize `settings/screening-criteria.md`
- [ ] Tell Claude Code: "Help me complete a literature review on [topic]"
- [ ] Approve checkpoints when asked (don't skip the Phase 2 spot-check)
- [ ] Collect outputs from `outputs/` — draft, contributions, methods disclosure
- [ ] Integrate `literature-review-draft.md` into your manuscript

**Questions?** See [ARCHITECTURE.md](ARCHITECTURE.md) or review individual agent files in `.claude/agents/` for detailed specifications.

---

**Happy researching! 🚀**
