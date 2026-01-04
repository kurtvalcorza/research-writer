# Research Writing Agent Orchestration - Complete Workflow

**Updated:** 2026-01-03 (with Phase 1, 4.5, 6 + Enhanced Phase 2 + Corrected Phase Numbering)

---

## Visual Workflow

```
┌─────────────────────────────────────────────────────────────┐
│                    RESEARCH PREPARATION                      │
│                                                              │
│  Researcher identifies topic & gathers PDFs                 │
│  Downloads PDFs to /corpus/ directory                        │
│  Customizes settings/screening-criteria-template.md         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  PHASE 1: Literature Discovery & Screening                  │
│  SKILL: literature-discovery-screening                       │
├─────────────────────────────────────────────────────────────┤
│  INPUT:                                                      │
│    • /corpus/ directory (PDFs - any size: 1-100+)           │
│    • settings/screening-criteria-template.md                │
│                                                              │
│  EXECUTION (Universal Workflow):                            │
│    PASS 1: Lightweight Metadata Scan (all PDFs)            │
│      - Extract: title, year, page count, first 200 chars   │
│      - Quick triage: AUTO-INCLUDE/EXCLUDE/FLAG for PASS 2  │
│      - Output: screening-triage.md                          │
│                                                              │
│    PASS 2: Detailed Incremental Screening (one-by-one)     │
│      - Process ONE PDF at a time (context-safe)             │
│      - Extract full metadata + abstract                     │
│      - Apply detailed criteria                              │
│      - Append to: screening-progress.md (resumable)         │
│      - Repeat for all flagged papers                        │
│                                                              │
│    PASS 3: Aggregate & Finalize                             │
│      - Combine PASS 1 + PASS 2 results                      │
│      - Generate final outputs                               │
│                                                              │
│  OUTPUT:                                                     │
│    • literature-screening-matrix.md                         │
│    • prisma-flow-diagram.md                                 │
│    • screening-progress.md (state management)               │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  🔍 HUMAN CHECKPOINT 1 (REQUIRED)                           │
├─────────────────────────────────────────────────────────────┤
│  TASKS:                                                      │
│    • Review screening matrix recommendations                │
│    • Approve INCLUDE papers                                 │
│    • Resolve UNCERTAIN cases                                │
│    • Address metadata extraction failures                   │
│    • Remove EXCLUDE papers from corpus/                     │
│    • Document final decisions                               │
│                                                              │
│  QUALITY CHECKS:                                            │
│    ✓ Criteria applied consistently?                         │
│    ✓ Rationales clear and traceable?                        │
│    ✓ UNCERTAIN category appropriately used?                 │
│    ✓ All PDFs accounted for?                                │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  PHASE 2: Literature Extraction & Synthesis                 │
│  SKILL: literature-review-synthesis-matrix                   │
├─────────────────────────────────────────────────────────────┤
│  INPUT:                                                      │
│    • /corpus/ directory (approved PDFs from Phase 1)        │
│                                                              │
│  AGENT ACTIONS:                                             │
│    SUB-PHASE 2A: Paper-Centric Extraction                   │
│      1. Parse each PDF for content                          │
│      2. Extract bibliographic data                          │
│      3. Extract: objectives, methods, findings, gaps        │
│      4. Log parsing failures with diagnostics               │
│      5. Populate extraction table (1 row per paper)         │
│                                                              │
│    SUB-PHASE 2B: Theme-Centric Synthesis                    │
│      6. Identify recurring themes across papers             │
│      7. Map evidence: consensus, contradictions, gaps       │
│      8. Build synthesis matrix (1 row per theme)            │
│                                                              │
│    NEW: Quality Reporting                                   │
│      9. Generate PDF processing report                      │
│      10. Calculate extraction quality score                 │
│      11. Flag if >20% failure rate                          │
│      12. Provide remediation guidance                       │
│                                                              │
│  OUTPUT:                                                     │
│    • literature-extraction-matrix.md (+ processing report)  │
│    • literature-synthesis-matrix.md                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  🔍 HUMAN CHECKPOINT 2 (Advised)                            │
├─────────────────────────────────────────────────────────────┤
│  TASKS:                                                      │
│    • Validate extraction accuracy                           │
│    • Verify theme coverage                                  │
│    • Check citation integrity                               │
│    • Assess synthesis quality                               │
│                                                              │
│  QUALITY CHECKS:                                            │
│    ✓ All papers represented in extraction matrix?           │
│    ✓ Themes reflect actual corpus content?                  │
│    ✓ Evidence accurately attributed?                        │
│    ✓ Gaps appropriately identified?                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  PHASE 3: Argument Structure & Review Outline               │
│  SKILL: literature-review-argument-structurer                │
├─────────────────────────────────────────────────────────────┤
│  INPUT:                                                      │
│    • literature-synthesis-matrix.md                         │
│                                                              │
│  AGENT ACTIONS:                                             │
│    1. Cluster themes into 3-7 higher-level groups           │
│    2. Sequence clusters into logical narrative flow         │
│    3. Formulate section claims with evidence strength       │
│    4. Consolidate gaps and tensions                         │
│    5. Generate argument flow summary                        │
│                                                              │
│  OUTPUT:                                                     │
│    • literature-review-outline.md                           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  🔍 HUMAN CHECKPOINT 3 (Advised)                            │
├─────────────────────────────────────────────────────────────┤
│  TASKS:                                                      │
│    • Approve argument structure                             │
│    • Validate section sequencing                            │
│    • Verify claim-evidence alignment                        │
│    • Adjust section focus if needed                         │
│                                                              │
│  QUALITY CHECKS:                                            │
│    ✓ Argument flow is logical and coherent?                 │
│    ✓ Section claims match evidence strength?                │
│    ✓ All major themes covered?                              │
│    ✓ Gaps appropriately positioned?                         │
│                                                              │
│  ⚠️  CRITICAL: Approve outline before drafting begins       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  PHASE 4: Literature Review Drafting                        │
│  SKILL: literature-review-drafter                            │
├─────────────────────────────────────────────────────────────┤
│  INPUT:                                                      │
│    • literature-review-outline.md (approved)                │
│    • literature-synthesis-matrix.md                         │
│                                                              │
│  AGENT ACTIONS:                                             │
│    1. Draft section-by-section following outline            │
│    2. Integrate evidence from synthesis matrix              │
│    3. Use theme-driven (not paper-by-paper) narrative       │
│    4. Apply academic tone and hedging language              │
│    5. Signal gaps and limitations explicitly                │
│                                                              │
│  CONSTRAINTS:                                               │
│    ✗ No new sources introduced                              │
│    ✗ No unsupported claims                                  │
│    ✗ No paper-by-paper summaries                            │
│    ✗ No overclaiming beyond evidence                        │
│                                                              │
│  OUTPUT:                                                     │
│    • literature-review-draft.md                             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  PHASE 4.5: Citation Integrity Validation                   │
│  SKILL: citation-integrity-validator                         │
├─────────────────────────────────────────────────────────────┤
│  INPUT:                                                      │
│    • literature-review-draft.md                             │
│    • literature-extraction-matrix.md                        │
│    • literature-synthesis-matrix.md                         │
│                                                              │
│  AGENT ACTIONS:                                             │
│    1. Extract all in-text citations from draft              │
│    2. Cross-reference against extraction matrix             │
│    3. Validate claim-evidence alignment                     │
│    4. Check citation distribution & balance                 │
│    5. Assess format consistency                             │
│                                                              │
│  VALIDATION CHECKS:                                         │
│    🚨 CRITICAL: Fabricated citations (not in corpus)        │
│    🚨 CRITICAL: High-severity misattributions               │
│    ⚠️  WARNING: Over-citation (>30% from one source)        │
│    ⚠️  WARNING: Under-cited sections                        │
│    ⚠️  WARNING: Evidence strength misalignment              │
│    ℹ️  INFO: Format inconsistencies                         │
│                                                              │
│  OUTPUT:                                                     │
│    • citation-integrity-report.md                           │
│                                                              │
│  PASS CRITERIA:                                             │
│    ✓ Zero fabricated citations                              │
│    ✓ Zero high-severity misattributions                     │
│    ✓ Format inconsistencies <5                              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  📊 AUTO QC CHECKPOINT (Phase 4.5)                          │
├─────────────────────────────────────────────────────────────┤
│  IF PASS: Proceed to human review                           │
│  IF WARNINGS: Review report, decide to proceed or fix       │
│  IF CRITICAL: Fix issues, revise draft, re-validate         │
│                                                              │
│  Typical outcome: Directs human attention to problem areas  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  🔍 HUMAN CHECKPOINT 4 (Advised)                            │
├─────────────────────────────────────────────────────────────┤
│  TASKS:                                                      │
│    • Review tone and academic style                         │
│    • Address citation issues flagged in Phase 4.5           │
│    • Check balance across sections                          │
│    • Assess readability and coherence                       │
│                                                              │
│  QUALITY CHECKS:                                            │
│    ✓ Citation integrity report reviewed?                    │
│    ✓ All critical issues resolved?                          │
│    ✓ Appropriate hedging for weak evidence?                 │
│    ✓ Theme-driven (not paper summaries)?                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  PHASE 5: Contribution & Implications Framing               │
│  SKILL: research-contribution-implications-framer            │
├─────────────────────────────────────────────────────────────┤
│  INPUT:                                                      │
│    • literature-synthesis-matrix.md                         │
│    • literature-review-outline.md                           │
│    • literature-review-draft.md                             │
│    • (Optional) study findings/results                      │
│                                                              │
│  AGENT ACTIONS:                                             │
│    1. Identify distinct contributions vs. existing work     │
│    2. Classify: theoretical/methodological/practical/policy │
│    3. Map implications proportionate to evidence strength   │
│    4. Acknowledge limitations and boundary conditions       │
│    5. Translate gaps into future research directions        │
│                                                              │
│  CONSTRAINTS:                                               │
│    ✗ No novelty inflation                                   │
│    ✗ No unsupported impact claims                           │
│    ✗ No generalization beyond evidence                      │
│    ✗ No promotional language                                │
│                                                              │
│  OUTPUT:                                                     │
│    • research-contributions-implications.md                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  🔍 HUMAN CHECKPOINT 5 (Advised)                            │
├─────────────────────────────────────────────────────────────┤
│  TASKS:                                                      │
│    • Validate contribution claims                           │
│    • Assess implications for proportionality                │
│    • Review limitations for completeness                    │
│    • Approve future research directions                     │
│                                                              │
│  QUALITY CHECKS:                                            │
│    ✓ Contributions grounded in evidence?                    │
│    ✓ No overclaiming or novelty inflation?                  │
│    ✓ Implications proportionate to evidence strength?       │
│    ✓ Limitations honestly acknowledged?                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  PHASE 6: Cross-Phase Validation                            │
│  SKILL: cross-phase-validator                                │
├─────────────────────────────────────────────────────────────┤
│  INPUT:                                                      │
│    • literature-synthesis-matrix.md (Phase 2)               │
│    • literature-review-outline.md (Phase 3)                 │
│    • literature-review-draft.md (Phase 4)                   │
│    • research-contributions-implications.md (Phase 5)       │
│                                                              │
│  AGENT ACTIONS:                                             │
│    1. Validate Phase 2→3 consistency                        │
│       ✓ All synthesis themes in outline?                    │
│       ✓ Evidence strength aligned?                          │
│    2. Validate Phase 3→4 consistency                        │
│       ✓ All outline sections drafted?                       │
│       ✓ No scope creep?                                     │
│    3. Validate Phase 2→4 direct                             │
│       ✓ Themes discussed in draft?                          │
│       ✓ Papers cited where expected?                        │
│    4. Validate Phase 4→5 consistency                        │
│       ✓ Contributions grounded in draft?                    │
│       ✓ Boundaries respected?                               │
│    5. End-to-end traceability audit                         │
│       ✓ Sample claims trace to corpus                       │
│                                                              │
│  OUTPUT:                                                     │
│    • cross-phase-validation-report.md                       │
│    • Consistency score (0-100)                              │
│                                                              │
│  PASS CRITERIA:                                             │
│    ✓ Consistency score ≥75                                  │
│    ✓ Zero critical issues                                   │
│    ✓ No broken traceability chains                          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  📊 AUTO QC CHECKPOINT (Phase 6)                            │
├─────────────────────────────────────────────────────────────┤
│  IF PASS (score ≥75, zero critical): Proceed to finalization│
│  IF WARNINGS: Review inconsistencies, decide action         │
│  IF CRITICAL ISSUES: Fix phase outputs, re-validate         │
│                                                              │
│  Common findings:                                            │
│    • Missing outline sections in draft                      │
│    • Evidence strength mismatch                             │
│    • Contribution overclaiming                              │
│    • Orphaned synthesis themes                              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     RESEARCH COMPLETE                        │
│                                                              │
│  Final Deliverables:                                        │
│    ✅ PRISMA flow diagram (methods documentation)           │
│    ✅ Literature review draft (validated)                   │
│    ✅ Contributions & implications (grounded)               │
│    ✅ Citation integrity report (QC passed)                 │
│    ✅ Cross-phase validation report (QC passed)             │
│    ✅ Complete audit trail (all intermediate artifacts)     │
│                                                              │
│  Quality Assurance:                                          │
│    ✅ No fabricated citations                               │
│    ✅ Full traceability corpus→draft→contributions          │
│    ✅ Internal consistency validated                        │
│    ✅ Evidence strength appropriately characterized         │
│                                                              │
│  Ready for:                                                  │
│    → Integration into full manuscript                       │
│    → Submission for review                                  │
│    → Further extension (Phase 5, 8)                         │
└─────────────────────────────────────────────────────────────┘
```

---

## Phase Summary Table

| Phase | Name | Status | Agent/Manual | Required Checkpoint | Time Estimate |
|-------|------|--------|--------------|---------------------|---------------|
| **1** | Literature Discovery & Screening | Existing | Agent-assisted | ✅ REQUIRED | 1 hour (50 papers) |
| **2** | Literature Extraction & Synthesis | Existing | Agent + QC | Advised | 2-3 hours (50 papers) |
| **3** | Argument Structure & Outline | Existing | Agent | Advised | 30-45 min |
| **4** | Literature Review Drafting | Existing | Agent | Advised | 1-2 hours |
| **4.5** | Citation Integrity Validation | Existing | Automated | Auto QC | 2-5 min |
| **5** | Contribution & Implications | Existing | Agent | Advised | 45-60 min |
| **6** | Cross-Phase Validation | Existing | Automated | Auto QC | 3-7 min |
| **7** | Methods & Results (optional) | Not implemented | Manual | N/A | Varies |
| **8** | Dissemination (optional) | Not implemented | Manual | N/A | Varies |

**Total agent-assisted workflow:** ~5-9 hours for complete, QC-validated literature review
**Equivalent manual effort:** ~15-25 hours
**Time savings:** ~60-70%
**Quality improvement:** 2 automated QC checkpoints catch errors before human review

---

## File Flow Diagram

```
Input Files                Phase Outputs               Final Deliverables
─────────────              ──────────────              ─────────────────

corpus/                                               outputs/
├── paper1.pdf   ──────▶  PHASE 1  ────▶  ├── literature-screening-matrix.md
├── paper2.pdf            screening       ├── prisma-flow-diagram.md
└── paper3.pdf                                         │
                                                       │
                                                       ▼
corpus/                                                │
├── paper1.pdf   ──────▶  PHASE 2  ────▶  ├── literature-extraction-matrix.md
└── paper3.pdf            extraction      ├── literature-synthesis-matrix.md
(approved only)           & synthesis                  │
                                                       │
                                                       ▼
                                                       │
synthesis-matrix.md ───▶  PHASE 3  ────▶  ├── literature-review-outline.md
                          argument                     │
                          structure                    │
                                                       ▼
                                                       │
outline.md +     ──────▶  PHASE 4  ────▶  ├── literature-review-draft.md
synthesis-matrix.md       drafting                     │
                                                       │
                                                       ▼
                                                       │
all Phase 2-4    ──────▶  PHASE 5  ────▶  └── research-contributions-
outputs                   contribution                  implications.md
                          framing
```

---

## Quality Control Flow

```
                    ┌─────────────────────┐
                    │   User Input        │
                    │   (Criteria/PDFs)   │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │  Agent Processing   │
                    │  (Systematic)       │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │  Structured Output  │
                    │  (Matrix/Outline)   │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │  Human Review       │
                    │  (Judgment)         │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │  Approved Artifact  │
                    │  (Next phase input) │
                    └─────────────────────┘

Every phase follows this pattern:
Input → Agent → Output → Human → Approval → Next Phase
```

---

## Data Traceability Chain

```
Phase 1: Screening Decision
    ↓ (justified by)
Screening Criteria + PDF Metadata
    ↓ (produces)
Approved Corpus in /corpus/

Phase 2: Synthesis Theme
    ↓ (extracted from)
Individual Paper Content
    ↓ (aggregated into)
Theme-Evidence Mapping

Phase 3: Section Claim
    ↓ (derived from)
Synthesis Theme Patterns
    ↓ (structured into)
Argument Outline

Phase 4: Draft Paragraph
    ↓ (composed from)
Outline Section + Synthesis Evidence
    ↓ (cites)
Specific Papers (traceable to Phase 2)

Phase 5: Contribution Statement
    ↓ (grounded in)
Synthesis Gaps + Draft Content
    ↓ (limited by)
Evidence Strength & Boundaries
```

**Every claim in the final draft can be traced back through this chain to original papers.**

---

## Decision Points (Human Judgment Required)

| Decision Point | Phase | Question | Agent Role | Human Role |
|----------------|-------|----------|------------|------------|
| **Corpus boundary** | 1 | What papers to include? | Recommend based on criteria | Final approval |
| **Theme identification** | 2 | What themes emerge? | Identify patterns | Validate accuracy |
| **Argument structure** | 3 | How to organize review? | Propose logical sequence | Approve structure |
| **Claim strength** | 4 | How strong is evidence? | Apply conservative language | Verify appropriateness |
| **Contribution scope** | 5 | What does study contribute? | Identify grounded contributions | Prevent overclaiming |

---

## Error Prevention Mechanisms

| Risk | Phase | Prevention Mechanism |
|------|-------|---------------------|
| **Irrelevant papers included** | 1 | Systematic criteria + human checkpoint |
| **Fabricated citations** | 2 | Extraction from actual PDFs only |
| **Unsupported claims** | 4 | Claims must trace to synthesis matrix |
| **Novelty inflation** | 6 | Conservative contribution framing + limitations |
| **Hallucinated evidence** | All | No agent generates new sources; works only with provided corpus |

---

## Workflow Principles (Maintained Across All Phases)

1. **Analysis → Structure → Writing** (never reversed)
2. **Evidence → Synthesis → Claims** (never unsupported claims)
3. **Conservative → Explicit → Traceable** (never speculative)
4. **Agent recommends → Human decides** (at high-risk points)
5. **Artifact-based handoffs → Audit trail** (never black box)

---

## Integration with Phase 1

### Before Phase 1 Implementation:
```
Manual screening → /corpus/ → Phase 2 (extraction)
(time: 3-4 hours, risk: inconsistent criteria application)
```

### After Phase 1 Implementation:
```
/corpus/ → Phase 1 (agent screening) → Human approval → /corpus/ → Phase 2
(time: 1 hour, benefit: systematic + documented + PRISMA-compliant)
```

### Key Improvements:
- ✅ **60-75% time reduction** for screening
- ✅ **100% criteria consistency** (no human fatigue)
- ✅ **PRISMA-compliant documentation** (automatic)
- ✅ **Audit trail** for every decision
- ✅ **Human oversight maintained** (required checkpoint)

---

## Next Phase Extensions (Future)

### Recommended Priority Order:
1. **Citation Integrity Checker** (Phase 4.5) - validates citations against extraction matrix
2. **Cross-Phase Validator** - ensures internal consistency across artifacts
3. **Methods Narrativizer** (Phase 5) - documents research methodology
4. **Enhanced Prompts with Examples** - improves agent output consistency

---

**Workflow Status:** ✅ Fully operational with Phases 1, 2, 3, 4, 4.5, 5, 6 (excluding optional Phases 7-8)
**Ready for:** Immediate production use on research projects
**Maintenance:** All skills versioned and documented