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
PHASE 2 — Literature Extraction & Synthesis       (SKILL)
        ↓
PHASE 3 — Argument Structure & Review Outline     (SKILL)
        ↓
PHASE 4 — Literature Review Drafting              (SKILL)
        ↓
PHASE 4.5 — Citation Integrity Validation         (SKILL - Quality Control)
        ↓
PHASE 5 — Contribution & Implications Framing     (SKILL)
        ↓
PHASE 6 — Cross-Phase Validation                  (SKILL - Quality Control)
```

> **Note:** Phase numbering follows the complete research pipeline: 1 (Discovery) → 2 (Synthesis) → 3 (Outline) → 4 (Draft) → 4.5 (Citation Validation) → 5 (Contributions) → 6 (Cross-Phase Validation). Quality control phases (4.5, 6) are automated validation checkpoints.

> **Skills Compliance:** All skills comply with the [Agent Skills specification](https://agentskills.io/specification) using actual tool names (`Read Write Edit Glob Grep Bash`) and include comprehensive Pre-Execution Validation, Execution Models, Error Handling, Output Validation, and Integration documentation.

---

## Repository Structure

```text
research-writer/
├── corpus/                    (Your PDFs - start here!)
│   └── *.pdf                  (Add your research PDFs to be screened)
│
├── scripts/
│   └── setup.sh               (Automated setup and validation)
│
├── settings/
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
├── audits/                    (Process audit reports)
│   ├── README.md              (Audit history and methodology)
│   ├── PROCESS_AUDIT_REPORT.md (Phase 1 setup audit)
│   └── PHASES_2-7_AUDIT_REPORT.md (Phases 2-7 docs audit)
│
├── interface/                 (Web UI - Optional)
│   ├── app/                   (Next.js pages and API routes)
│   ├── components/            (React components)
│   ├── lib/                   (Utilities and types)
│   ├── middleware.ts          (Security headers)
│   ├── SECURITY.md            (Security documentation)
│   ├── CHANGELOG.md           (Version history)
│   └── package.json           (Node.js dependencies)
│
├── requirements.txt           (Python dependencies)
├── .gitignore                 (Git ignore rules)
├── README.md                  (This file)
└── WORKFLOW_DIAGRAM.md        (Visual workflow)
```

---

## How Prompts & Skills Work Together

This system uses a two-layer architecture for clarity and maintainability:

### **Prompts** (`prompts/phaseX.md`)
- **Purpose:** Concise invocation instructions that you pass to your AI assistant
- **Content:** What to do, what inputs to use, what outputs to generate
- **Length:** Typically 30-120 lines
- **Role:** Entry point for executing each phase

### **Skills** (`skills/0X_*/SKILL.md`)
- **Purpose:** Detailed technical specifications that guide the AI's execution
- **Content:** Complete workflow steps, error handling, constraints, quality thresholds
- **Length:** Typically 300-700 lines
- **Role:** Implementation guide that ensures consistency and rigor

### How They Work Together

```
User → Tells AI: "Execute prompts/phase2.md"
       ↓
AI reads prompt → "Use SKILL skills/02_literature-synthesis/SKILL.md"
       ↓
AI follows SKILL → Executes detailed workflow with error handling
       ↓
Outputs generated → User reviews results
```

**Why this design?**
- **Simplicity:** Prompts stay clean and easy to read
- **Rigor:** Skills contain all technical details and edge cases
- **Modularity:** Can update SKILLs without changing prompts
- **Consistency:** Same SKILL can be invoked multiple ways

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

**Inputs:** PDFs in `corpus/` + screening criteria in `settings/screening-criteria-template.md`
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

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/kurtvalcorza/research-writer
   cd research-writer
   ```

2. **Run the setup script:**
   ```bash
   bash scripts/setup.sh
   ```

   This will:
   - Create required directories (`corpus/`, `outputs/`)
   - Check Python installation
   - Install PDF processing dependencies
   - Validate your environment

   **Or install manually:**
   ```bash
   # Create directories
   mkdir -p corpus outputs

   # Install PDF processing libraries
   pip install -r requirements.txt
   ```

3. **Set up your AI coding assistant:**
   - [**Claude Code**](https://claude.com/product/claude-code) (recommended)
   - [**Gemini CLI**](https://geminicli.com/) (Requires `--yolo` flag for full tool support)
   - [**Codex CLI**](https://developers.openai.com/codex/cli/)
   - Any AI coding assistant with file reading capabilities

---

## 🌐 Web Interface (Optional)

For users who prefer a graphical interface, the Research Writer includes a **production-ready web application** that provides:

### Features
- **Visual Dashboard**: Real-time progress tracking with phase locking
- **Corpus Management**: Drag-and-drop PDF upload with validation
- **Settings Editor**: Visual editor for screening criteria
- **Prompt Library**: View, copy, or directly execute prompts
- **Output Viewer**: Beautiful Markdown rendering of generated artifacts
- **Multi-Provider Support**: Direct integration with Gemini CLI and Claude CLI
- **Real-Time Execution**: Watch agent execution in an embedded terminal

### Quick Start

```bash
# Navigate to interface directory
cd interface

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

### Production Deployment

```bash
# Build for production
npm run build

# Start production server
npm run start
```

### Security & Quality

The web interface is built with **robust security and engineering best practices**:
- ✅ Designed to prevent common vulnerabilities
- ✅ PDF validation and file size limits
- ✅ Path traversal protection
- ✅ Security headers (HSTS, CSP, X-Frame-Options)
- ✅ 100% TypeScript with full type safety
- ✅ Accessibility support (WCAG 2.1 AA)
- ✅ Error boundaries and graceful recovery

**Documentation:**
- [Interface README](interface/README.md) - Complete setup and usage guide
- [Security Documentation](interface/SECURITY.md) - Security implementation details
- [Changelog](interface/CHANGELOG.md) - Version history and improvements

**Technology Stack:** Next.js 16, React 19, TypeScript 5, Tailwind CSS 4

### When to Use the Interface

**Use the web interface if you:**
- Prefer visual dashboards over CLI
- Want drag-and-drop file management
- Need real-time execution monitoring
- Want to switch between AI providers easily
- Prefer clicking buttons over typing commands

**Use the CLI workflow if you:**
- Are comfortable with command-line tools
- Want maximum flexibility and control
- Prefer working directly in your AI assistant
- Need to customize prompts on the fly
- Want to work entirely in terminal

Both approaches use the same underlying research workflow and produce identical outputs. Choose what works best for your workflow!

---

## Step by Step Procedure

### Workflow Progress Tracker

Track your progress through the research writing workflow. Check off each step as you complete it:

```
Phase 1: Literature Discovery & Screening
  [ ] 1. Prepare PDFs in corpus/
  [ ] 2. Customize screening criteria template
  [ ] 3. Run Phase 1 (screening)
  [ ] 4. Review screening matrix
  [ ] 5. Human checkpoint: Approve final corpus

Phase 2: Literature Extraction & Synthesis
  [ ] 6. Run Phase 2 (extraction + synthesis)
  [ ] 7. Review quality report (>80% success rate)
  [ ] 8. Review synthesis matrix (3-7 themes)

Phase 3: Argument Structure
  [ ] 9. Run Phase 3 (outline generation)
  [ ] 10. Review outline structure
  [ ] 11. Human checkpoint: Approve outline

Phase 4: Literature Review Drafting
  [ ] 12. Run Phase 4 (draft writing)
  [ ] 13. Review draft (theme-driven, not paper-by-paper)

Phase 4.5: Citation Validation (Quality Control)
  [ ] 14. Run Phase 4.5 (citation validation)
  [ ] 15. Review validation report
  [ ] 16. Fix any critical issues (fabrications, misattributions)
  [ ] 17. Re-run Phase 4.5 if fixes made

Phase 6: Contribution Framing (Optional)
  [ ] 18. Run Phase 6 (contributions + implications)
  [ ] 19. Review contribution claims (grounded in evidence?)

Phase 7: Cross-Phase Validation (Quality Control)
  [ ] 20. Run Phase 7 (consistency validation)
  [ ] 21. Review consistency score (≥75?)
  [ ] 22. Fix critical issues if any
  [ ] 23. Re-run Phase 7 if fixes made

Final Steps
  [ ] 24. Human review: Approve final outputs
  [ ] 25. Ready for manuscript integration
```

**Current outputs location:** `outputs/` directory

**Expected completion time:** 1-2 hours for small corpus (5-10 papers), 3-5 hours for medium corpus (20-50 papers)

---

### 1. Prepare Your PDFs

Add your research PDF files to the `corpus/` directory (these are the papers you want to screen).

```bash
# Example: Copy PDFs to corpus
cp ~/Downloads/*.pdf corpus/
```

**Tips:**
- Ensure filenames are descriptive (e.g., `smith2024_ai_adoption.pdf`)
- Files must be text-readable (use OCR if needed for scanned PDFs)
- Directories `corpus/` and `outputs/` are already created if you ran the setup script

### 2. Define Screening Criteria
Customize the template for your research topic:
- Research context (topic, review type, geographic/temporal scope)
- Inclusion criteria (topic, study type, publication type, date range, language)
- Exclusion criteria (out of scope, methodological, quality thresholds)
- Edge case decision rules and example applications

```
Topic: AI Adoption in the Philippines
Please revise settings/screening-criteria-template.md accordingly.
# Add instructions on screen criteria
```

### 3. Run Phase 1 Screening

**Tell your AI coding assistant (e.g., Claude Code):**

```
Please execute Phase 1 literature screening using the instructions in prompts/phase1.md.

Process the PDFs in the corpus/ directory and apply the screening criteria from settings/screening-criteria-template.md.
```

**What happens:**
The agent will automatically execute a three-pass workflow:
- **PASS 1:** Quick triage of all PDFs (lightweight metadata scan)
- **PASS 2:** Detailed screening one-by-one (resumable if interrupted)
- **PASS 3:** Generate final screening matrix and PRISMA diagram

**Estimated time:** 5-15 min (1-5 PDFs), 15-40 min (6-20 PDFs), 40-90 min (20-50 PDFs)

### 4. Review Phase 1 Results
Open `outputs/literature-screening-matrix.md` and review:
- ✅ **INCLUDE** papers (proceed to Phase 2)
- ❌ **EXCLUDE** papers (verify rationales)
- ⚠️ **UNCERTAIN** cases (require human judgment)
- ⚙️ **METADATA_INSUFFICIENT** papers (may need OCR or manual entry)

⚠️ **Human checkpoint:** Phase 1 provides recommendations only. You must approve the final corpus before Phase 2.

### 5. Run Phase 2: Literature Extraction & Synthesis

**Prerequisites:**
- ✅ Phase 1 complete (screening matrix generated)
- ✅ Approved corpus in `corpus/` directory
- ✅ Human checkpoint: Final corpus approved

**Tell your AI coding assistant:**

```
Please execute Phase 2 literature extraction and synthesis using the instructions in prompts/phase2.md.

Process the approved PDFs from the corpus/ directory.
```

**What happens:**
The agent will:
- Extract standardized information from each paper (metadata, methods, findings, contributions)
- Generate a PDF processing quality report (success/failure rates)
- Synthesize themes across the corpus
- Output: `literature-extraction-matrix.md` and `literature-synthesis-matrix.md`

**Quality Thresholds:**
- EXCELLENT: >95% success rate
- GOOD: 80-95% success rate
- ACCEPTABLE: 60-80% success rate (proceed with caution)
- POOR: <60% success rate (resolve issues before Phase 3)

**If >20% of PDFs fail to process:** Review the processing report and resolve high-priority failures before continuing.

**Estimated time:** 15-30 min for 10 papers

**Success Indicators:**
- ✅ Both output files generated (extraction + synthesis matrices)
- ✅ PDF processing report shows GOOD or EXCELLENT quality
- ✅ All corpus papers appear in extraction matrix
- ✅ Synthesis matrix identifies 3-7 themes
- ✅ Processing metadata shows >80% success rate

### 6. Run Phase 3: Argument Structure & Review Outline

**Prerequisites:**
- ✅ Phase 2 complete (extraction + synthesis matrices generated)
- ✅ Synthesis matrix reviewed and validated

**Tell your AI coding assistant:**

```
Please execute Phase 3 argument structuring using the instructions in prompts/phase3.md.

Use the synthesis matrix to create a logical argument structure and literature review outline.
```

**What happens:**
The agent will:
- Convert synthesis into a defensible argument structure
- Decide what the literature says, disagrees on, and omits
- Generate `literature-review-outline.md`

**Estimated time:** 5-10 min

**Success Indicators:**
- ✅ Outline file generated with clear section structure
- ✅ All synthesis themes represented in outline
- ✅ Evidence strength labels assigned (Strong consensus, Mixed, Emerging, Sparse)
- ✅ Consolidated gaps section included
- ✅ Argument flow summary explains section ordering

⚠️ **Human checkpoint:** Approve the outline before drafting begins.

### 7. Run Phase 4: Literature Review Drafting

**Prerequisites:**
- ✅ Phase 3 complete (outline generated)
- ✅ Human checkpoint: Outline approved
- ✅ Phase 2 synthesis matrix available

**Tell your AI coding assistant:**

```
Please execute Phase 4 literature review drafting using the instructions in prompts/phase4.md.

Use the approved outline and synthesis matrix to draft the literature review.
```

**What happens:**
The agent will:
- Translate approved structure into academic prose
- Maintain theme-driven, evidence-grounded writing (not paper-by-paper summaries)
- Use appropriate hedging language based on evidence strength
- Generate `literature-review-draft.md`

**Estimated time:** 10-20 min for 10 papers

**Success Indicators:**
- ✅ Draft file generated with all outline sections
- ✅ Theme-driven organization (not individual paper summaries)
- ✅ Citations present for all major claims
- ✅ Hedging language matches evidence strength from outline
- ✅ No fabricated sources or claims beyond synthesis

---

### 🔍 QUALITY CONTROL CHECKPOINT

**Phase 4.5 is an automated validation gate.** It checks for:
- Fabricated citations (CRITICAL - blocks progression)
- Misattributions and over-citation (WARNINGS)
- Citation format consistency

**Pass Criteria:**
- Zero fabricated citations
- Zero high-severity misattributions
- <5 format inconsistencies

**If validation FAILS:** Fix issues in Phase 4 draft before proceeding to Phase 6.

---

### 8. Run Phase 4.5: Citation Integrity Validation (Quality Control)

**Prerequisites:**
- ✅ Phase 4 complete (draft generated)
- ✅ Phase 2 extraction matrix available
- ✅ Phase 2 synthesis matrix available

**Tell your AI coding assistant:**

```
Please execute Phase 4.5 citation integrity validation using the instructions in prompts/phase4.5.md.

Validate all citations in the draft against the extraction matrix.
```

**What happens:**
The agent will:
- Extract all citations from the draft
- Cross-reference each citation against extraction matrix (detect fabrications)
- Validate claim-evidence alignment (detect misattributions)
- Assess citation distribution and balance
- Check format consistency
- Generate `citation-integrity-report.md`

**Estimated time:** 3-5 min

**Success Indicators:**
- ✅ Validation report generated
- ✅ Zero fabricated citations detected
- ✅ Zero high-severity misattributions
- ✅ Balanced citation distribution (no single paper >30%)
- ✅ Format inconsistencies <5

**If issues found:** Review the report, fix flagged citations in draft, re-run Phase 4.5 to verify fixes.

### 9. Run Phase 6: Contribution & Implications Framing (Optional)

**Prerequisites:**
- ✅ Phase 4 complete (draft generated)
- ✅ Phase 4.5 validation passed (or issues resolved)
- ✅ Phase 2-3 outputs available

**Tell your AI coding assistant:**

```
Please execute Phase 6 contribution and implications framing using the instructions in prompts/phase6.md.

Use the literature review draft and synthesis to frame contributions and implications.
```

**What happens:**
The agent will:
- Identify defensible contributions grounded in prior phases
- Classify contributions (theoretical, methodological, practical, policy)
- Articulate implications proportionate to evidence strength
- Acknowledge limitations and boundary conditions
- Define future research directions tied to documented gaps
- Generate `research-contributions-implications.md`

**Estimated time:** 5-10 min

**Success Indicators:**
- ✅ Contributions file generated with clear sections
- ✅ All contributions grounded in draft evidence
- ✅ Implications match evidence strength (no overclaiming)
- ✅ Limitations explicitly acknowledged
- ✅ Future research tied to identified gaps

---

### 🔍 QUALITY CONTROL CHECKPOINT

**Phase 7 is the final validation gate.** It checks for:
- Cross-phase consistency (synthesis → outline → draft → contributions)
- Complete traceability (corpus → synthesis → outline → draft)
- Orphaned content or broken evidence chains
- Evidence strength alignment across phases

**Pass Criteria:**
- Consistency score ≥75
- Zero critical issues
- All warnings reviewed

**If validation FAILS:** Review and fix inconsistencies before finalizing manuscript.

---

### 10. Run Phase 7: Cross-Phase Validation (Quality Control)

**Prerequisites:**
- ✅ Minimum: Phases 2, 3, 4 complete
- ✅ Extended: Phases 2, 3, 4, 6 complete
- ✅ Optional: Phase 4.5 report available

**Tell your AI coding assistant:**

```
Please execute Phase 7 cross-phase validation using the instructions in prompts/phase7.md.

Validate consistency and traceability across all completed phase outputs.
```

**What happens:**
The agent will:
- Validate Phase 2→3 consistency (all synthesis themes in outline?)
- Validate Phase 3→4 consistency (all outline sections drafted?)
- Validate Phase 2→4 direct (themes properly cited in draft?)
- Validate Phase 4→6 (if available - contributions grounded in draft?)
- Perform end-to-end traceability audit on sample claims
- Calculate overall consistency score
- Generate `cross-phase-validation-report.md`

**Estimated time:** 5-10 min

**Success Indicators:**
- ✅ Validation report generated
- ✅ Consistency score ≥75
- ✅ Zero critical issues detected
- ✅ All synthesis themes represented in outline and draft
- ✅ All outline sections have corresponding draft sections
- ✅ Sample claims trace back through complete evidence chain

⚠️ **Final checkpoint:** Review validation report. If critical issues found, fix affected phases and re-run validation.

---

### One-Command Workflow Execution (Experimental)

⚠️ **Note:** This workflow is experimental and works best with small corpora (<5 papers). For larger corpora or complex projects, use the step-by-step approach (Steps 1-10) for better control and reliability.

For experienced users who want to run the complete workflow in sequence, provide this instruction to your AI coding assistant:

```
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

**Limitations:**
- May hit context limits with 20+ papers
- Error handling less robust than step-by-step approach
- Human checkpoints not enforced (requires manual intervention)
- **Recommended:** Use step-by-step approach for production work

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
Solution: This issue has been fixed in the current version
- The skill now uses incremental processing (one PDF at a time)
- If you still encounter this, ensure you're using the latest SKILL.md
- The universal three-pass workflow handles any corpus size
- Note: Initial testing with Claude Code CLI revealed this issue, which was fixed before multi-platform validation
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

#### Phase 2 Issues

**Problem: High PDF failure rate (>20%)**
```
Solution: Check PDF processing report
- Re-download corrupted files from original sources
- Run OCR on image-only PDFs: ocrmypdf input.pdf output.pdf
- Remove password protection from encrypted PDFs
- Verify files are actual PDFs (not renamed files)
```

**Problem: "POOR quality assessment" (<60% success rate)**
```
Solution: CRITICAL - Resolve before Phase 3
- Review "Failed PDF Details" table in extraction matrix
- Fix high-priority papers (critical to synthesis)
- Can proceed with medium-priority issues (note limitations in draft)
- Document which papers were excluded and why
```

**Problem: No themes generated in synthesis matrix**
```
Solution: Check corpus content
- Ensure papers are actually relevant to research topic
- Verify extraction matrix has meaningful "Key Themes" column
- May need minimum 3-5 successfully extracted papers
- Review if corpus is too narrow or too broad
```

#### Phase 3 Issues

**Problem: Outline sections don't make sense**
```
Solution: Review synthesis matrix quality
- Check if synthesis themes are well-defined
- May need to re-run Phase 2 with better theme identification
- Provide feedback to AI if themes need reorganization
```

**Problem: Evidence strength labels seem wrong**
```
Solution: Check synthesis matrix documentation
- "Strong consensus" requires ALL or MOST papers addressing theme
- "Limited" means 1-2 papers only
- Labels should match synthesis evidence, not subjective assessment
```

#### Phase 4 Issues

**Problem: Draft reads like paper-by-paper summaries**
```
Solution: Re-run Phase 4 with stricter instructions
- Emphasize theme-driven synthesis (not paper summaries)
- May indicate outline wasn't sufficiently thematic
- Consider revising outline (Phase 3) first
```

**Problem: Draft has unsupported claims**
```
Solution: Check against synthesis matrix
- All claims must trace to synthesis themes
- Revise draft to match evidence in synthesis
- Flag for Phase 4.5 citation validation
```

#### Phase 4.5 Issues

**Problem: Fabricated citations detected (CRITICAL)**
```
Solution: MUST FIX before proceeding
- Review each flagged citation in report
- Option 1: Remove citation and rephrase claim
- Option 2: Add paper to corpus (run through Phases 1-2 first)
- Re-run Phase 4 after fixes
- Re-run Phase 4.5 to verify all fabrications resolved
```

**Problem: Over-citation warning (>30% from one paper)**
```
Solution: Review draft for balance
- Check if over-cited paper is truly central to all themes
- Ensure claims supported by multiple sources where possible
- May indicate over-reliance on single source
- Consider citing other corpus papers for similar claims
```

**Problem: Misattribution warnings**
```
Solution: Review context for each flagged citation
- Read full sentence containing citation
- Check extraction matrix for paper's actual findings
- Adjust claim language to match evidence strength
- High-severity: Replace citation or remove claim
- Medium-severity: Add hedging language
```

#### Phase 6 Issues

**Problem: Contribution claims seem overclaimed**
```
Solution: Check against draft evidence
- All contributions must be grounded in draft
- Review Phase 6 output against Phase 7 validation
- Reduce scope of claims to match evidence boundaries
- Add more limitations and caveats
```

#### Phase 7 Issues

**Problem: Consistency score <75**
```
Solution: Review validation report systematically
1. Fix CRITICAL issues first (broken traces, missing sections)
2. Address WARNING issues (misalignments, gaps)
3. Review INFO items (may be acceptable)
4. Re-run affected phases
5. Re-run Phase 7 to verify fixes raised score
```

**Problem: "Missing outline section in draft"**
```
Solution: CRITICAL error
- Option 1: Add missing section to draft (re-run Phase 4)
- Option 2: Remove from outline if no longer relevant (re-run Phase 3)
- Re-run Phase 7 to verify consistency
```

**Problem: "Theme in synthesis not in outline"**
```
Solution: Review orphaned themes
- Check if theme is actually important
- If yes: Add to outline (re-run Phase 3)
- If no: Document why excluded
- Ensure exclusion doesn't create synthesis gaps
```

**Problem: Broken traceability chain**
```
Solution: Trace claim manually
- Find claim in draft
- Check if in outline → if not, remove or add to outline
- Check if in synthesis → if not, check if supported
- If chain broken: Remove claim or rebuild evidence
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
