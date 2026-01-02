# Research Writing Agent Orchestration

This repository implements a **modular, agent-assisted research writing workflow**, designed to support rigorous academic, policy, and R&D research while minimizing hallucination and preserving evidence traceability.

The workflow decomposes research writing into **clearly defined phases**, each handled by a dedicated SKILL.

Each phase produces auditable artifacts that feed the next phase.

---

## Introduction & Design Principles

This orchestration is built on five core principles:

1. **Analysis precedes writing**
   No drafting occurs before evidence is extracted, synthesized, and structured.

2. **Traceability over fluency**
   Every claim can be traced back to synthesized evidence.

3. **Separation of cognitive tasks**
   Extraction, synthesis, structuring, drafting, and interpretation are handled by distinct agents.

4. **Human-in-the-loop at high-risk points**
   Humans approve scope, structure, and claims of contribution.

5. **Composable & auditable outputs**
   Each phase outputs Markdown artifacts that can be inspected, revised, or reused.

### What This System Is (and Is Not)

✅ This system is:
- A research thinking scaffold
- An evidence-first writing pipeline
- Suitable for:
    - Academic papers
    - Theses/dissertations
    - Policy and R&D reports

❌ This system is not:
- A "write my paper" shortcut
- A citation generator
- A replacement for domain expertise

---

## End-to-End Workflow Overview

```text
PHASE 1 — Literature Discovery & Screening        (SKILL)
        ↓
PHASE 2 — Literature Extraction & Synthesis       (SKILL + Enhanced Error Handling)
        ↓
PHASE 3 — Argument Structure & Review Outline     (SKILL)
        ↓
PHASE 4 — Literature Review Drafting              (SKILL)
        ↓
PHASE 4.5 — Citation Integrity Validation         (SKILL - Quality Control)
        ↓
PHASE 6 — Contribution & Implications Framing     (SKILL)
        ↓
PHASE 7 — Cross-Phase Validation                  (SKILL - Quality Control)
```

> Note: Phase numbering aligns with conventional research workflows. Phase 5 (methods/results) and Phase 8 (dissemination) are intentionally modular and optional. Quality control phases (4.5, 7) are automated validation checkpoints.

---

## Repository Structure

```text
research-writer-claude-desktop/
├── corpus/                    (Your PDFs - start here!)
│   └── *.pdf                  (Add your research PDFs to be screened)
│
├── template/
│   └── screening-criteria-template.md  (Customize before Phase 1)
│
├── prompts/
│   ├── phase1.md              (Phase 1 execution prompt)
│   ├── phase2.md              (Phase 2 prompt)
│   ├── phase3.md              (Phase 3 prompt)
│   ├── phase4.md              (Phase 4 prompt)
│   ├── phase4.5.md            (Citation validation)
│   ├── phase6.md              (Contribution framing)
│   └── phase7.md              (Cross-phase validation)
│
├── skills/
│   ├── 01_literature-discovery/
│   │   └── SKILL.md
│   ├── 02_literature-synthesis/
│   │   └── SKILL.md
│   ├── 03_argument-structurer/
│   │   └── SKILL.md
│   ├── 04_literature-drafter/
│   │   └── SKILL.md
│   ├── 05_citation-validator/
│   │   └── SKILL.md           (Quality control)
│   ├── 06_contribution-framer/
│   │   └── SKILL.md
│   └── 07_cross-phase-validator/
│       └── SKILL.md           (Quality control)
│
├── outputs/                   (Auto-generated)
│   ├── literature-screening-matrix.md       (Phase 1)
│   ├── prisma-flow-diagram.md               (Phase 1)
│   ├── screening-progress.md                (Phase 1 - state management)
│   ├── literature-extraction-matrix.md      (Phase 2)
│   ├── literature-synthesis-matrix.md       (Phase 2)
│   ├── literature-review-outline.md         (Phase 3)
│   ├── literature-review-draft.md           (Phase 4)
│   ├── citation-integrity-report.md         (Phase 4.5)
│   ├── research-contributions-implications.md (Phase 6)
│   └── cross-phase-validation-report.md     (Phase 7)
│
├── README.md                  (This file)
└── WORKFLOW_DIAGRAM.md        (Visual workflow)
```

---

## Workflow (Phase-by-Phase Details)

> **Visual diagram:** See [WORKFLOW_DIAGRAM.md](WORKFLOW_DIAGRAM.md) for complete visual representation of all phases.

### PHASE 1 — Literature Discovery & Screening

**SKILL:** `literature-discovery-screening`

**Purpose:** Automate systematic screening of research papers with PRISMA-compliant documentation. Provides structured recommendations for inclusion/exclusion while maintaining full human oversight.

**Universal Three-Pass Workflow** (works for ALL corpus sizes: 1-100+ papers)
- **PASS 1:** Quick triage (lightweight metadata scan)
- **PASS 2:** Detailed screening one-by-one (context-safe, resumable)
- **PASS 3:** Aggregate and finalize (PRISMA documentation)

**Key Features:**
- ✅ No context window limitations (max ~30K tokens at any point)
- ✅ CLI-agnostic (works with Claude Code, Gemini CLI, ChatGPT CLI, etc.)
- ✅ State management (resume from interruptions)
- ✅ Same workflow for 3 PDFs or 300 PDFs

**Time Estimates:**
- 1-5 PDFs: 5-15 min | 6-20 PDFs: 15-40 min | 20-50 PDFs: 40-90 min | 50+ PDFs: 90-180 min

**Inputs:** PDFs in `corpus/` + screening criteria in `template/screening-criteria-template.md`
**Outputs:** `literature-screening-matrix.md`, `prisma-flow-diagram.md`, `screening-progress.md`

### PHASE 2 — Literature Extraction & Synthesis

SKILL: `literature-review-synthesis-matrix`

Purpose:
- Extract standardized information from each paper
- Synthesize themes across the corpus

Inputs:
- Folder of screened research PDFs

Outputs:
- `literature-extraction-matrix.md`
- `literature-synthesis-matrix.md`

This phase transforms reading into structured evidence.

### PHASE 3 — Argument Structure & Review Outline

SKILL: `literature-review-argument-structurer`

Purpose:
- Convert synthesis into a defensible argument structure
- Decide what the literature says, disagrees on, and omits

Inputs:
- `literature-synthesis-matrix.md`

Outputs:
- `literature-review-outline.md`

⚠️ Human checkpoint recommended here

Approve outline before drafting begins.

### PHASE 4 — Literature Review Drafting

SKILL: `literature-review-drafter`

Purpose:
- Translate approved structure into academic prose
- Maintain theme-driven, evidence-grounded writing

Inputs:
- `literature-review-outline.md`
- `literature-synthesis-matrix.md`

Outputs:
- `literature-review-draft.md`

This phase is intentionally constrained to prevent:
- Paper-by-paper summaries
- Unsupported claims
- Essay-style hallucination

### PHASE 4.5 — Citation Integrity Validation

SKILL: `citation-integrity-validator`

Purpose:
- Validate all citations against extraction matrix
- Detect fabricated or hallucinated citations
- Identify potential misattributions
- Assess citation distribution and balance
- Check format consistency

Inputs:
- `literature-review-draft.md`
- `literature-extraction-matrix.md`
- `literature-synthesis-matrix.md`

Outputs:
- `citation-integrity-report.md`

⚠️ Quality control checkpoint

This phase automatically catches citation errors before human review, ensuring:
- No fabricated citations (not in corpus)
- Claims align with documented findings
- Balanced source usage (no over-reliance on single paper)
- Consistent citation formatting

**Pass criteria:** Zero fabricated citations, zero high-severity misattributions

### PHASE 6 — Contribution & Implications Framing

SKILL: `research-contribution-implications-framer`

Purpose:
- Articulate what the research contributes
- Frame implications proportionate to evidence strength
- Define future research directions

Inputs:
- Synthesis matrix
- Review outline
- Literature review draft
- (Optional) study findings

Outputs:
- `research-contributions-implications.md`

⚠️ This phase controls overclaiming and novelty inflation.

### PHASE 7 — Cross-Phase Validation

SKILL: `cross-phase-validator`

Purpose:
- Validate consistency across all phase outputs
- Ensure complete traceability from corpus to final claims
- Identify orphaned content or broken evidence chains
- Check alignment of evidence strength characterizations

Inputs:
- All phase outputs (minimum: Phases 2, 3, 4)
- Extended: Phases 2, 3, 4, 6

Outputs:
- `cross-phase-validation-report.md`

⚠️ Final quality control checkpoint

This phase validates the integrity of the entire analytical pipeline:
- Phase 2→3: All synthesis themes appear in outline
- Phase 3→4: All outline sections are drafted
- Phase 2→4: Themes and citations properly carried through
- Phase 4→6: Contributions grounded in draft evidence
- End-to-end traceability for sample claims

**Pass criteria:** Consistency score ≥75, zero critical issues

---

## Human-in-the-Loop Checkpoints (Recommended)

| Checkpoint      | Type     | Why                                                      |
| --------------- | -------- | -------------------------------------------------------- |
| After Phase 1   | REQUIRED | Approve final corpus; resolve UNCERTAIN screening cases |
| After Phase 2   | Advised  | Validate corpus coverage and synthesis accuracy          |
| After Phase 3   | Advised  | Approve argument structure before drafting               |
| After Phase 4   | Advised  | Review tone, balance, and writing quality                |
| After Phase 4.5 | Auto QC  | Citation validation (automated - review if issues found) |
| After Phase 6   | Advised  | Validate contribution claims and implications            |
| After Phase 7   | Auto QC  | Cross-phase consistency (automated - review if warnings) |

---

## Step by Step Procedure

### 1. Clone the repository and prepare Your PDFs
```bash
git clone https://github.com/kurtvalcorza/research-writer
cd research-writer

mkdir -p corpus/ outputs/
# Add your PDF files to corpus/ (these are papers you want to screen)
```

Ensure filenames are descriptive and files are text-readable (OCR if needed).

### 2. Define Screening Criteria
Customize the template for your research topic:

```
Topic: AI Adoption in the Philippines
Please revise template/screening-criteria-template.md accordingly.
```

The template will be customized with:
- Research context (topic, review type, geographic/temporal scope)
- Inclusion criteria (topic, study type, publication type, date range, language)
- Exclusion criteria (out of scope, methodological, quality thresholds)
- Edge case decision rules and example applications

### 3. Run Phase 1 Screening
```bash
Execute Phase 1 using prompts/phase1.md.
```

The agent executes a three-pass workflow:
- **PASS 1:** Quick triage of all PDFs (lightweight metadata scan)
- **PASS 2:** Detailed screening one-by-one (resumable)
- **PASS 3:** Generate final screening matrix and PRISMA diagram

### 4. Review Phase 1 Results
Open `outputs/literature-screening-matrix.md` and review:
- ✅ **INCLUDE** papers (proceed to Phase 2)
- ❌ **EXCLUDE** papers (verify rationales)
- ⚠️ **UNCERTAIN** cases (require human judgment)
- ⚙️ **METADATA_INSUFFICIENT** papers (may need OCR or manual entry)

⚠️ **Human checkpoint:** Phase 1 provides recommendations only. You must approve the final corpus before Phase 2.

### 5. Run Phase 2: Literature Extraction & Synthesis
```bash
Execute Phase 2 using prompts/phase2.md with the approved corpus.
```

The agent will:
- Extract standardized information from each paper (metadata, methods, findings, contributions)
- Synthesize themes across the corpus
- Generate `literature-extraction-matrix.md` and `literature-synthesis-matrix.md`

Review the synthesis matrix to validate corpus coverage and theme accuracy.

### 6. Run Phase 3: Argument Structure & Review Outline
```bash
Execute Phase 3 using prompts/phase3.md with the synthesis matrix.
```

The agent will:
- Convert synthesis into a defensible argument structure
- Decide what the literature says, disagrees on, and omits
- Generate `literature-review-outline.md`

⚠️ **Human checkpoint:** Approve the outline before drafting begins.

### 7. Run Phase 4: Literature Review Drafting
```bash
Execute Phase 4 using prompts/phase4.md with the approved outline.
```

The agent will:
- Translate approved structure into academic prose
- Maintain theme-driven, evidence-grounded writing
- Generate `literature-review-draft.md`

### 8. Run Phase 4.5: Citation Integrity Validation (Quality Control)
```bash
Execute Phase 4.5 using prompts/phase4.5.md to validate citations.
```

The agent will:
- Validate all citations against extraction matrix
- Detect fabricated or hallucinated citations
- Identify potential misattributions
- Generate `citation-integrity-report.md`

Review the report and fix any issues before proceeding.

### 9. Run Phase 6: Contribution & Implications Framing (Optional)
```bash
Execute Phase 6 using prompts/phase6.md to frame contributions.
```

The agent will:
- Articulate what the research contributes
- Frame implications proportionate to evidence strength
- Generate `research-contributions-implications.md`

### 10. Run Phase 7: Cross-Phase Validation (Quality Control)
```bash
Execute Phase 7 using prompts/phase7.md for final validation.
```

The agent will:
- Validate consistency across all phase outputs
- Ensure complete traceability from corpus to final claims
- Generate `cross-phase-validation-report.md`

⚠️ **Final checkpoint:** Review validation report. Pass criteria: Consistency score ≥75, zero critical issues.

---

### One-Command Workflow Execution (Advanced)

For experienced users who want to run the complete workflow in sequence:

```bash
# Create a prompt to run all phases sequentially
Execute the complete research writing workflow:

1. Phase 1: Screen PDFs using prompts/phase1.md
2. Pause for human review of screening-matrix.md
3. Phase 2: Extract and synthesize using prompts/phase2.md
4. Phase 3: Generate outline using prompts/phase3.md
5. Pause for human approval of outline
6. Phase 4: Draft literature review using prompts/phase4.md
7. Phase 4.5: Validate citations using prompts/phase4.5.md
8. Phase 6: Frame contributions using prompts/phase6.md
9. Phase 7: Cross-phase validation using prompts/phase7.md

Stop at each human checkpoint for approval before proceeding.
```

**Note:** The one-command approach requires the AI coding assistant to maintain context across all phases. For large corpora or long sessions, the step-by-step approach (Steps 1-10) is more reliable.

---

### Tips for Success

- **Define criteria first** before running Phase 1
- **Start conservative:** Use liberal criteria initially (prefer UNCERTAIN over auto-EXCLUDE)
- **State management allows resuming** if interrupted during PASS 2
- **Validate metadata:** Spot-check critical fields (year, authors) in the matrix
- **Trust the process:** The agent provides systematic consistency; you provide domain expertise
- **Review checkpoints:** Human approval at Phases 1, 3, 4.5, and 7 ensures quality control

**Key principle:** The agent recommends; humans decide.

---

## Extending the Orchestration

Optional extensions include:
- Methods & results narrativizer (Phase 5)
- Reviewer response generator (Phase 8)
- Policy brief / executive summary generator
- Incremental checkpointing for Phase 2 (large corpora)
- Reference manager integration (Zotero, Mendeley)

Each can be added as a composable SKILL.

---

## Troubleshooting & FAQ

### Troubleshooting

#### Phase 1 Issues

**Problem: Context window limit hit during PASS 1**
```
Solution: Extract minimal metadata only
- Skip first 200 characters extraction
- Flag all papers for PASS 2 (full screening)
```

**Problem: PDF parsing failure**
```
Solution: Check PDF quality
- Re-download corrupted files
- Use OCR for image-only PDFs: ocrmypdf input.pdf output.pdf
- Check file isn't password-protected
```

**Problem: Can't find screening-triage.md**
```
Solution: PASS 1 hasn't run yet
- Execute PASS 1 first
- Check outputs/ directory
```

**Problem: Interrupted during PASS 2**
```
Solution: Resume from checkpoint
- Check screening-progress.md for last completed PDF
- Re-run PASS 2 command - it will pick up from next PENDING paper
- No data loss!
```

#### Phase 2-7 Issues

**Problem: Large corpus (50+ PDFs) taking too long**
```
Solution: Same incremental pattern applies
- Consider implementing incremental Phase 2 (same as Phase 1)
- Process one PDF at a time in extraction phase
```

**Problem: Citation validation failing (Phase 4.5)**
```
Solution: Check extraction matrix
- Ensure Phase 2 completed successfully
- Verify cited papers are in extraction matrix
- Check citation format consistency
```

#### General Issues

**Problem: Which AI coding assistant should I use?**
```
Solution: Any AI coding assistant works
- Claude Code (recommended for PDF parsing)
- Google Gemini CLI (good for large corpora)
- ChatGPT CLI
- Use what you have available
```

**Problem: How do I know if it's working?**
```
Solution: Check outputs/ directory
- Each phase creates specific output files
- Progress files show state (for incremental modes)
- Review outputs after each phase
```

---

### FAQ

**Q: Do I need to use all 7 phases?**
A: No. Use what you need. Core workflow: Phases 1, 2, 3, 4. Quality control: 4.5, 7. Optional: 6.

**Q: Can I modify the screening criteria mid-process?**
A: Not recommended. If criteria change, restart Phase 1 for consistency.

**Q: What if I only have 2 PDFs?**
A: Use the same universal workflow. Takes 5-10 minutes total.

**Q: Can this handle 100+ PDFs?**
A: Yes! Universal workflow scales. Expect 2-3 hours for 100 PDFs in Phase 1.

**Q: Do I need programming skills?**
A: No. Just ability to run AI coding assistant commands and review Markdown files.

**Q: What if my PDFs are in a language other than English?**
A: Screening criteria can specify language requirements. Non-English PDFs will be flagged or excluded based on your criteria.

---

## Final Note

This orchestration mirrors how experienced researchers actually work, but makes the reasoning explicit, modular, and auditable.

The goal is not faster writing — the goal is better thinking, expressed clearly.

Tool-agnostic by design. Use the AI coding assistant that works best for your workflow.
