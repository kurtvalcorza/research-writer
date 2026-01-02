# Process Audit Report: Phases 2-7 (Prompts & Skills)
**Date:** 2026-01-02
**Auditor:** Process Audit (First-Time User Perspective)
**Scope:** prompts/phase2.md through phase7.md + skills/02 through 07

---

## Executive Summary

This audit evaluates Phases 2-7 from a first-time user perspective. Unlike Phase 1 (which had critical blockers), Phases 2-7 have **excellent technical design** and **well-structured SKILLs**, but suffer from **inconsistent user-facing documentation** that creates confusion and friction.

**Key Finding:** The prompt files (phase2-7.md) are already clean and simple (unlike the old bloated phase1.md), but the README doesn't reflect this improvement and uses inconsistent instruction formats.

**Severity Levels:**
- 🔴 **CRITICAL** - Blocks user from proceeding
- 🟠 **HIGH** - Causes significant confusion or friction
- 🟡 **MEDIUM** - Causes minor friction
- 🟢 **LOW** - Enhancement opportunity

---

## Critical Issues (Blockers)

### 🔴 CRITICAL-1: Inconsistent Execution Instructions (Steps 5-10)

**Problem:**
README Steps 5-10 (Phases 2-7) use vague "Execute Phase X using prompts/phaseX.md" format, but Step 3 (Phase 1) was updated with clear "Tell your AI coding assistant:" instructions.

**User Impact:**
- **Confusion**: "Wait, why does Phase 1 have clear instructions but Phase 2 doesn't?"
- **Inconsistency**: Users expect the same format throughout
- **Friction**: Users must figure out execution method themselves

**Evidence:**
```markdown
# Step 3 (Phase 1) - GOOD:
**Tell your AI coding assistant (e.g., Claude Code):**

```
Please execute Phase 1 literature screening using the instructions in prompts/phase1.md.
...
```

# Step 5 (Phase 2) - BAD:
```bash
Execute Phase 2 using prompts/phase2.md with the approved corpus.
```
```

**User Mental Model:**
```
User at Step 3: "Oh great, clear instructions!"
User at Step 5: "Wait, what happened to the format? Do I just say 'Execute Phase 2'?"
User: *tries various phrasings, wastes 5-10 minutes*
```

**Fix Required:**
Update Steps 5-10 in README to use the same "Tell your AI coding assistant:" format as Step 3.

**Recommendation:**
Apply the Phase 1 instruction pattern to all phases consistently.

---

## High-Priority Issues

### 🟠 HIGH-1: README Doesn't Reflect Simplified Prompts

**Problem:**
Prompt files (phase2-7.md) are already clean, simple delegation files (30-120 lines), but README documentation doesn't acknowledge or leverage this improvement.

**What Actually Exists:**
- phase2.md: 66 lines - clean delegation to SKILL
- phase3.md: 28 lines - very simple
- phase4.md: 28 lines - very simple
- phase4.5.md: 78 lines - clear quality control spec
- phase6.md: 30 lines - simple delegation
- phase7.md: 118 lines - comprehensive QC spec

**What README Implies:**
- Still talks about prompts as if they're complex execution files
- Doesn't explain the prompt → SKILL relationship
- No mention that prompts are now streamlined

**User Impact:**
- Users don't understand that prompts are intentionally simple
- Miss opportunity to explain the elegant design (prompts = invocation, SKILLs = implementation)

**Recommendation:**
Add a brief explanation in README (maybe in "How This Works" section):

```markdown
## How Prompts and Skills Work Together

This system uses a two-layer design:

- **Prompts** (`prompts/phaseX.md`): Concise invocation instructions that you pass to your AI assistant
- **Skills** (`skills/0X_*/SKILL.md`): Detailed technical specifications that guide the AI's execution

When you execute a phase, the AI reads the prompt (what to do) and follows the SKILL (how to do it). This separation keeps instructions clean while maintaining technical rigor.
```

---

### 🟠 HIGH-2: Missing Time Estimates for Phases 2-7

**Problem:**
README Step 3 (Phase 1) includes helpful time estimates:
```
**Estimated time:** 5-15 min (1-5 PDFs), 15-40 min (6-20 PDFs), 40-90 min (20-50 PDFs)
```

But Steps 5-10 (Phases 2-7) have NO time estimates.

**User Impact:**
- Users don't know if Phase 2 takes 10 minutes or 2 hours
- Can't plan their workflow
- May interrupt phases thinking they're stuck

**Recommendation:**
Add realistic time estimates to each phase based on corpus size:

**Suggested estimates** (for 10-paper corpus):
- Phase 2: 15-30 min (PDF extraction + synthesis)
- Phase 3: 5-10 min (outline generation)
- Phase 4: 10-20 min (draft writing)
- Phase 4.5: 3-5 min (citation validation)
- Phase 6: 5-10 min (contribution framing)
- Phase 7: 5-10 min (cross-phase validation)

---

### 🟠 HIGH-3: No Example Outputs

**Problem:**
Phase 1 has `template/screening-criteria-template.md` (example content), but Phases 2-7 have NO example outputs.

**User Impact:**
- Users don't know what "good output" looks like
- Can't validate if their results are correct
- May not understand the expected format

**Evidence:**
No example files for:
- `literature-extraction-matrix.md` (Phase 2)
- `literature-synthesis-matrix.md` (Phase 2)
- `literature-review-outline.md` (Phase 3)
- `literature-review-draft.md` (Phase 4)
- `citation-integrity-report.md` (Phase 4.5)
- `research-contributions-implications.md` (Phase 6)
- `cross-phase-validation-report.md` (Phase 7)

**Recommendation:**
**Option A (High Impact):** Create `examples/` directory with sample outputs from a real 3-paper corpus
```
examples/
├── README.md (explains the example corpus)
├── literature-extraction-matrix-example.md
├── literature-synthesis-matrix-example.md
├── literature-review-outline-example.md
├── literature-review-draft-example.md
├── citation-integrity-report-example.md
├── research-contributions-implications-example.md
└── cross-phase-validation-report-example.md
```

**Option B (Quick Fix):** Add "Example Output Structure" sections to README for each phase

---

## Medium-Priority Issues

### 🟡 MEDIUM-1: Phase 2 Error Handling Not Mentioned in README

**Problem:**
Phase 2 prompt has comprehensive error reporting requirements (lines 31-65 in phase2.md), but README Step 5 doesn't mention this.

**What Phase 2 Actually Does:**
- PDF Processing Report (success/failure rates)
- Quality Alerts (flags >20% failure rate)
- Processing Metadata with quality assessment
- Thresholds: EXCELLENT/GOOD/ACCEPTABLE/POOR

**What README Says:**
```
The agent will:
- Extract standardized information from each paper
- Synthesize themes across the corpus
- Generate literature-extraction-matrix.md and literature-synthesis-matrix.md
```

**Missing:** Any mention of error handling, quality reports, or failure scenarios.

**User Impact:**
- Users surprised when they get a "POOR quality" alert
- Don't understand what success rates mean
- Don't know what to do if >50% PDFs fail

**Recommendation:**
Update README Step 5:
```markdown
### 5. Run Phase 2: Literature Extraction & Synthesis

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
```

---

### 🟡 MEDIUM-2: Quality Control Phases (4.5, 7) Not Clearly Flagged

**Problem:**
Phases 4.5 and 7 are **automated quality control checkpoints**, but this isn't prominently communicated in the README.

**Current README:**
- Step 8: "Run Phase 4.5: Citation Integrity Validation (Quality Control)"
- Step 10: "Run Phase 7: Cross-Phase Validation (Quality Control)"

**Good:** Includes "(Quality Control)" label
**Missing:** Explanation of WHEN to run, WHAT happens if validation fails, and IMPORTANCE

**Recommendation:**
Add a callout box in README before Step 8 and Step 10:

```markdown
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

**If validation FAILS:** Fix issues in Phase 4 before proceeding to Phase 6.

---
```

---

### 🟡 MEDIUM-3: One-Command Workflow Overpromises

**Problem:**
README section "One-Command Workflow Execution (Advanced)" suggests users can run all phases in sequence with a single prompt, but provides no evidence this actually works or has been tested.

**Current Text:**
```markdown
For experienced users who want to run the complete workflow in sequence, provide this instruction to your AI coding assistant:

```
Execute the complete research writing workflow:
1. Phase 1: Screen PDFs using prompts/phase1.md
2. Pause for human review of screening-matrix.md
...
```
```

**Issues:**
1. **Untested claim:** No indication this has been validated
2. **Context limits:** Will likely hit context limits with 20+ papers
3. **Error handling:** What happens if Phase 2 fails? Does it stop or skip?
4. **Human checkpoints:** Says "Pause" but no mechanism to enforce pauses

**Recommendation:**
**Option A:** Add disclaimer:
```markdown
### One-Command Workflow Execution (Experimental)

⚠️ **Note:** This workflow is experimental and works best with small corpora (<5 papers).

For larger corpora or complex projects, use the step-by-step approach (Steps 1-10) for better control and reliability.
```

**Option B:** Remove this section entirely until it's tested and validated

---

### 🟡 MEDIUM-4: No Guidance on "What If Things Go Wrong"

**Problem:**
README has minimal troubleshooting for Phases 2-7. Only Phase 1 has troubleshooting section.

**User Scenarios:**
- "Phase 2 says 60% of my PDFs failed - what do I do?"
- "Phase 4.5 detected fabricated citations - how do I fix this?"
- "Phase 7 consistency score is 65 - can I still proceed?"

**Current README:** No answers to these questions.

**Recommendation:**
Add troubleshooting section for Phases 2-7:

```markdown
## Troubleshooting Phases 2-7

### Phase 2 Issues

**Problem: High PDF failure rate (>20%)**
```
Solution: Check PDF processing report
- Re-download corrupted files
- Run OCR on image-only PDFs (ocrmypdf)
- Verify files aren't password-protected
```

**Problem: "POOR quality assessment" (<60% success)**
```
Solution: Resolve failures before Phase 3
- Fix high-priority papers (critical to synthesis)
- Can proceed with medium-priority issues (note limitations)
```

### Phase 4.5 Issues

**Problem: Fabricated citations detected**
```
Solution: Critical - must fix
- Review each flagged citation
- Option 1: Remove citation and rephrase
- Option 2: Add paper to corpus (run through Phases 1-2)
- Re-run Phase 4 after fixes
```

**Problem: Over-citation warning (>30% from one paper)**
```
Solution: Review draft
- Ensure claims supported by multiple sources
- Check if over-cited paper is truly central
- Balance citations across corpus
```

### Phase 7 Issues

**Problem: Consistency score <75**
```
Solution: Review validation report
- Fix critical issues first (missing sections, broken traces)
- Address warnings (misalignments, gaps)
- Re-run affected phases
- Re-run Phase 7 to verify fixes
```

**Problem: "Missing outline section in draft"**
```
Solution: Critical error
- Add missing section to draft (Phase 4)
- OR remove from outline if no longer relevant (Phase 3)
- Re-run Phase 7 to verify consistency
```
```

---

## Low-Priority Enhancements

### 🟢 LOW-1: Add "Prerequisites" Section to Each Phase

**Recommendation:**
Add clear prerequisites to README steps:

```markdown
### 5. Run Phase 2: Literature Extraction & Synthesis

**Prerequisites:**
- ✅ Phase 1 complete (screening matrix generated)
- ✅ Approved corpus in `corpus/` directory
- ✅ Human checkpoint: Final corpus approved

**Tell your AI coding assistant:**
...
```

---

### 🟢 LOW-2: Add "Success Indicators" to Each Phase

**Recommendation:**
Help users validate success:

```markdown
### 5. Run Phase 2: Literature Extraction & Synthesis

**Success Indicators:**
- ✅ Both output files generated (extraction + synthesis matrices)
- ✅ PDF processing report shows GOOD or EXCELLENT quality
- ✅ All corpus papers appear in extraction matrix
- ✅ Synthesis matrix identifies 3-7 themes
- ✅ Processing metadata shows >80% success rate

**If you see:** "POOR quality" or ">50% failures" → Review troubleshooting
```

---

### 🟢 LOW-3: Add Visual Progress Tracker

**Recommendation:**
Add a progress visualization to README:

```markdown
## Workflow Progress Tracker

Track your progress through the workflow:

```
[ ✅ ] Phase 1: Literature Screening        (outputs/literature-screening-matrix.md)
[ ✅ ] Human Checkpoint: Approve corpus
[ ⏳ ] Phase 2: Extraction & Synthesis      (outputs/literature-extraction-matrix.md, literature-synthesis-matrix.md)
[    ] Phase 3: Argument Structure          (outputs/literature-review-outline.md)
[    ] Human Checkpoint: Approve outline
[    ] Phase 4: Drafting                    (outputs/literature-review-draft.md)
[    ] Phase 4.5: Citation Validation       (outputs/citation-integrity-report.md)
[    ] Phase 6: Contribution Framing        (outputs/research-contributions-implications.md)
[    ] Phase 7: Cross-Phase Validation      (outputs/cross-phase-validation-report.md)
[    ] Final Review
```
```

---

## Positive Observations

### ✅ Excellent Technical Design

**prompts/phase2-7.md:**
- ✅ Clean, concise delegation files (28-118 lines each)
- ✅ Consistent structure (SYSTEM ROLE → TASK → INPUTS → ACTIONS → CONSTRAINTS)
- ✅ Clear separation of concerns (prompts invoke, SKILLs implement)
- ✅ Enhanced error handling in Phase 2

**skills/02-07:**
- ✅ Comprehensive, professional SKILL specifications
- ✅ Excellent metadata headers
- ✅ Clear sections (Trigger, Objective, Inputs, Steps, Output, Constraints)
- ✅ Detailed error handling (especially Phase 2, 4.5, 7)
- ✅ Quality control checkpoints well-designed (4.5, 7)

### ✅ Strong Workflow Architecture

- ✅ Evidence-first approach (analysis before writing)
- ✅ Traceability (corpus → synthesis → outline → draft → contributions)
- ✅ Human-in-the-loop at critical points
- ✅ Quality control gates (4.5, 7)
- ✅ Modular and composable

### ✅ Phase 2 Error Handling is Excellent

The enhanced error handling in Phase 2 is outstanding:
- PDF processing reports with success/failure rates
- Quality thresholds (EXCELLENT/GOOD/ACCEPTABLE/POOR)
- Remediation guidance
- Transparency and auditability

### ✅ Phase 4.5 & 7 Quality Control is Best-in-Class

These validation phases are impressive:
- Systematic checks (fabrication, misattribution, consistency)
- Clear severity levels (CRITICAL/WARNING/INFO)
- Actionable recommendations
- Pass/fail criteria
- Complete traceability validation

---

## Comparison: Phase 1 vs Phases 2-7

| Aspect | Phase 1 | Phases 2-7 |
|--------|---------|------------|
| **Prompt Simplicity** | ✅ NOW simple (68 lines) | ✅ ALREADY simple (28-118 lines) |
| **README Instructions** | ✅ FIXED (clear "Tell your AI..." format) | ❌ INCONSISTENT (old vague format) |
| **Time Estimates** | ✅ Present | ❌ Missing |
| **Error Handling Docs** | ✅ Comprehensive troubleshooting | ❌ Minimal troubleshooting |
| **Example Outputs** | ✅ Has template example | ❌ No examples |
| **Technical Quality** | ✅ Excellent SKILL | ✅ Excellent SKILLs |

**Bottom Line:** Phase 1 documentation is now BETTER than Phases 2-7 documentation (ironic, since we just fixed it!)

---

## Recommended Fixes Priority Order

### Immediate (Do Now)

1. **Fix Steps 5-10 execution instructions** (apply Phase 1 format consistently)
2. **Add time estimates to all phases**
3. **Add "What happens if..." guidance for quality control phases**

### High Priority (Do Before Public Release)

4. **Create examples/ directory with sample outputs**
5. **Add Phase 2 error handling explanation to README**
6. **Flag quality control phases more prominently**
7. **Add troubleshooting section for Phases 2-7**
8. **Explain prompt → SKILL architecture in README**

### Medium Priority (Quality of Life)

9. **Add prerequisites to each phase**
10. **Add success indicators**
11. **Fix/remove one-command workflow section**
12. **Add progress tracker visualization**

### Low Priority (Nice to Have)

13. **Add "Common Mistakes" section**
14. **Create video walkthrough for Phases 2-7**
15. **Add FAQ for quality control phases**

---

## Recommended README Restructure

Current README flow is good, but could be improved:

**Suggested improvements:**
1. Add "How Prompts & Skills Work" section (explain architecture)
2. Standardize all phase instructions (use Phase 1 format)
3. Add time estimates to all phases
4. Add quality control callout boxes before Phases 4.5 and 7
5. Expand troubleshooting to cover all phases
6. Add examples reference to each phase

---

## Conclusion

**Overall Assessment:** Phases 2-7 have **excellent technical design** with **comprehensive SKILLs**, but **inconsistent user-facing documentation** creates unnecessary friction.

**Key Insight:** The hard work is DONE (prompts are simple, SKILLs are excellent). The remaining work is **documentation polish** - making the user experience as good as the technical design.

**Estimated Fix Time:**
- Critical + High priority: ~2-3 hours (mostly README updates)
- Medium priority: ~2-3 hours (troubleshooting, examples creation)
- Total to "production ready": ~5-6 hours

**Bottom Line:**
With the recommended fixes, Phases 2-7 would go from "technically excellent but documentation inconsistent" to "best-in-class end-to-end research workflow."

The technical architecture is already outstanding. The missing piece is completing the documentation polish we started with Phase 1.

---

**End of Audit Report**
