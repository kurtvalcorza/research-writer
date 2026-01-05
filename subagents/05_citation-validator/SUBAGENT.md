---
name: phase-05-citation-validator
description: "Quality control gate: Validate all citations in draft against extraction matrix. Detect fabricated citations (CRITICAL - blocks workflow), misattributions (WARNINGS), and format inconsistencies (INFO). Produces detailed citation integrity report. MUST PASS before proceeding to Phase 6."
requires:
  - outputs/literature-review-draft.md
  - outputs/literature-extraction-matrix.md
  - outputs/literature-synthesis-matrix.md
produces:
  - outputs/citation-integrity-report.md
model: sonnet
tools: Read, Write, Edit, Grep
allowed-tools: Read, Write, Edit, Grep
estimated_time: "3-5 min per 10 papers"
resumable: false
is_quality_gate: true
---

# Phase 4.5: Citation Integrity Validation

## Overview

This is a **QUALITY CONTROL GATE**. It validates all citations in draft against extraction matrix to:
- Detect **FABRICATED** citations (not in corpus)—CRITICAL issue
- Detect **misattributions** (claim doesn't match paper)—WARNING
- Check **format consistency**—INFO
- Assess **citation balance**—INFO

**Outcome**: Draft cannot proceed to Phase 6 if CRITICAL issues found.

## Pre-Execution Validation

```bash
1. outputs/literature-review-draft.md exists
2. outputs/literature-extraction-matrix.md exists  
3. All citations in draft are in format: (Author Year)
4. outputs/ directory writable
```

## Execution Model

### Step 1: Extract All Citations from Draft

```
Read literature-review-draft.md
Find all citations in format (Author Year)
Create list:
- Citation text: "Research shows X (Smith, 2024)"
- Author-Year: Smith, 2024
- Claim: "Research shows X"
- Location: [section, paragraph number]
```

### Step 2: Validate Each Citation Against Extraction Matrix

```
For each citation (Author Year):

A) Check existence
   Is this author-year in extraction matrix?
   - YES → Continue to step B
   - NO → FABRICATED CITATION (CRITICAL)

B) Check claim alignment
   Does the draft claim match what the paper actually found?
   - Perfect match → OK
   - Reasonable paraphrase → OK
   - Different finding than paper → MISATTRIBUTION (WARNING)
   - Overstated beyond paper's findings → MISATTRIBUTION (WARNING)
   - Understated (paper found more) → OK (conservative)

C) Check citation context
   Is citation placed appropriately?
   - Yes → OK
   - No (cites wrong paper for claim) → MISATTRIBUTION (WARNING)
```

### Step 3: Categorize Issues

```
CRITICAL Issues (Blocks Workflow):
- Fabricated citation (Author Year not in corpus)
- Fundamental misattribution (claim completely opposite to paper)

WARNINGS (Can proceed with review):
- Over-citation (>30% of citations from single paper)
- Potential misattribution (claim stretches paper's findings)
- Missing citation (claim lacks supporting citation)

INFO (Recommendations only):
- Format inconsistencies (parenthetical vs narrative)
- Citation style variations
- Unbalanced source usage
```

### Step 4: Generate Citation Integrity Report

Create citation-integrity-report.md with:
- Executive summary (Pass/Fail status)
- Critical issues (if any)
- Warnings (if any)
- Recommendations
- Full citation audit table

---

## Output Format: citation-integrity-report.md

```markdown
# Citation Integrity Validation Report

## Executive Summary

**Status**: ⚠️  PASS WITH WARNINGS

**Critical Issues**: 0 (✅ PASS)
**Warnings**: 3 (⚠️  REVIEW)
**Info Items**: 5 (ℹ️  RECOMMENDATIONS)

**Overall Assessment**: 
Draft contains no fabricated citations. All citations correspond to papers in corpus. Three warnings about potential misattributions should be reviewed before finalization.

**Recommendation**: Fix warnings and re-validate before proceeding to Phase 6.

---

## Critical Issues (Blocks Progression)

NONE FOUND ✅

If issues were present, would appear here with locations and corrections needed.

---

## Warnings (Review Before Proceeding)

### Warning 1: Over-Citation

**Location**: Section II, Paragraph 1

**Issue**: This paper is cited 8 times out of 23 total citations in draft (35%)

**Papers Over-Cited**: 
- Smith (2024): 8 citations (35%)
- Jones (2023): 5 citations (22%)
- Combined: 57% of draft citations from 2 papers

**Recommendation**: 
This indicates potential over-reliance on two sources. Consider:
- Whether these papers truly deserve this emphasis
- If other corpus papers could support same claims
- Whether balanced source representation needed

**Action**: Review these claims; consider citing additional supporting papers

---

### Warning 2: Potential Misattribution

**Location**: Section II, Paragraph 3

**Draft Claim**: "AI diagnostics improve accuracy by 15-25%"

**Citation**: (Smith, 2024)

**What Smith Actually Found**: AI improved accuracy by 12-18% in radiology specifically

**Issue**: 
Draft states 15-25% but Smith reports 12-18%. This may be:
- Overstated interpretation of Smith's findings
- Averaging with other papers' results (but only Smith cited here)
- Slight misremembering of exact numbers

**Recommendation**: 
Either:
1. Change claim to "12-18%" and cite Smith
2. If 15-25% is correct average, cite multiple papers supporting that range
3. Clarify: "Smith (2024) found 12-18% in radiology, though multi-domain analysis shows up to 25%"

**Action**: Clarify claim to match cited paper's findings

---

### Warning 3: Implied Citation

**Location**: Section III, Paragraph 2

**Draft Claim**: "Studies document physician resistance to AI"

**Issue**: 
No specific citation provided for this claim. Multiple papers address physician resistance, but reader doesn't know which ones support this statement.

**Papers Addressing This**:
- Grant (2023) - physician skepticism
- Harris (2023) - resistance to change
- Ibrahim (2023) - concerns about AI reliability

**Recommendation**: 
Add citation: "Studies document physician resistance to AI (Grant, 2023; Harris, 2023; Ibrahim, 2023)."

**Action**: Add citations to support this claim

---

## Information Items (Recommendations)

### Info 1: Citation Style Inconsistency

**Locations**: 5 instances

**Issue**: Mix of parenthetical citations: (Author Year) vs (Author, Year)

**Examples**:
- Correct: (Smith 2024)
- Also used: (Smith, 2024)

**Recommendation**: 
Standardize format. Author-year style typically: (Author Year)

**Action**: Search-replace to standardize format

---

### Info 2: Narrative Citations Underused

**Observation**: All citations parenthetical; no narrative citations

**Example Narrative Citation**:
Current: "Research shows X (Smith, 2024)"
Narrative: "Smith (2024) demonstrated that X"

**Benefit**: Narrative citations emphasize key authors; can improve flow

**Recommendation**: Consider 1-2 narrative citations for major findings

---

### Info 3: Citation Recency

**Observation**: 85% of citations 2022-2024; only 15% pre-2022

**Assessment**: 
This is actually GOOD - shows focus on recent research

**No action needed** - This demonstrates good currency

---

### Info 4: Geographic Representation

**Observation**: Mostly US/UK authors; minimal Philippines-specific citations

**Assessment**: 
This reflects literature gap (acknowledged in Phase 3 outline as "future direction")

**Recommendation**: Note this limitation when discussing implications

---

### Info 5: Peer Review Status

**Observation**: All cited papers are peer-reviewed journal articles

**Assessment**: 
EXCELLENT - High quality sources only

**No action needed** - Strong source credibility

---

## Citation Audit Table

| Citation | Paper | Location | Verification | Status | Notes |
|----------|-------|----------|--------------|--------|-------|
| Smith, 2024 | Literature-extraction-matrix P001 | Sec II, Para 1 | ✓ Found | OK | Over-cited (8x) |
| Jones, 2023 | P002 | Sec II, Para 1 | ✓ Found | OK | Over-cited (5x) |
| Davis, 2022 | P003 | Sec II, Para 1 | ✓ Found | OK | Accuracy claim verified |
| Brown, 2023 | P004 | Sec III, Para 1 | ✓ Found | OK | Claim verified |
| [continue for all citations] | | | | | |

---

## Summary Statistics

**Total Citations in Draft**: 23

**Verification Results**:
- Fabricated (not in corpus): 0 ✅
- Correctly cited: 20 ✅
- Misattributed (claim doesn't match): 0 ✅
- Warnings (over-cited, unclear): 3 ⚠️
- Missing citations (claims without cites): 1 ⚠️

**Citation Sources**:
- Unique papers cited: 12
- Most cited paper: Smith (2024) - 8 citations
- Citations per paper: Average 1.9

**Quality Assessment**:
- Fabrication risk: MINIMAL ✅
- Accuracy concern: LOW (3 warnings out of 23)
- Attribution clarity: GOOD

---

## Pass/Fail Decision

**PASS WITH WARNINGS** ✅ (Can proceed to Phase 6)

**Conditions**:
- Fix the 3 warnings before finalizing draft
- Re-validate after fixes
- Consider Info recommendations for improvement

**If critical issues had been found**: 
❌ FAIL - Cannot proceed. Must revise draft and resubmit.

---

## Recommendations for Draft Improvement

1. **Priority 1**: Fix Warning 2 (Smith accuracy claim)
2. **Priority 2**: Fix Warning 3 (Add citations for resistance claim)
3. **Priority 3**: Fix Warning 1 (Reduce over-reliance on Smith/Jones)
4. **Priority 4**: Standardize citation format (Info 1)

---

## Process for Draft Revision

If warnings found:

1. **Review each warning** in this report
2. **Make corrections** to literature-review-draft.md
3. **Re-validate** by re-running Phase 4.5
4. **Verify** all warnings resolved in new report

Once revalidation shows 0 critical issues:

✅ **PROCEED TO PHASE 6** (Contribution Framing)

---

## Quality Standards

This validation ensures:
✅ No hallucinated/fabricated citations
✅ Claims match cited papers' actual findings
✅ Balanced source representation
✅ Consistent citation formatting
✅ Academic integrity maintained

---

## Next Steps

**If PASS** (no critical issues):
→ Proceed to Phase 6 (Contribution & Implications Framing)

**If FAIL** (critical issues):
→ MUST revise draft
→ Fix all fabricated citations
→ Fix misattributions
→ Re-run Phase 4.5 validation
→ Get PASS before proceeding

---

## Notes

- This validation runs automatically in orchestrator workflow
- Results prevent low-quality claims from reaching manuscript
- Two quality gates exist: Phase 4.5 (citations) and Phase 7 (consistency)
- Both must PASS before workflow completion
```

---

## Success Criteria

Phase 4.5 successful when:

1. ✅ citation-integrity-report.md generated
2. ✅ Zero CRITICAL issues (fabricated citations)
3. ✅ All citations verified against extraction matrix
4. ✅ Warnings documented (if any)
5. ✅ Pass/Fail status clearly stated
6. ✅ Recommendations for improvement provided

---

## Pass/Fail Logic

```
PASS if:
- Zero fabricated citations
- Zero high-severity misattributions
- <5 format inconsistencies
- OR: User acknowledges warnings and proceeds

FAIL if:
- Any fabricated citations found
- High-severity misattributions found
- User cannot proceed without fixing critical issues
```

---

## Integration with Orchestrator

### Inputs
```
Parameters:
- draft_file: "outputs/literature-review-draft.md"
- extraction_matrix: "outputs/literature-extraction-matrix.md"
```

### Outputs
```
Status: SUCCESS
Duration: X minutes

Output file:
- outputs/citation-integrity-report.md ✓

Result Summary:
- Critical issues: 0
- Warnings: X
- Pass/Fail: PASS / FAIL
```

### Orchestrator Next Step (AUTO QUALITY GATE)
```
If CRITICAL issues found:
  ❌ WORKFLOW PAUSED
  "Draft has fabricated citations. Cannot proceed."
  Ask: "Fix and re-run Phase 4.5? (yes/no)"

If PASS:
  ✅ "Citation validation passed."
  Ask: "Proceed to Phase 6? (yes/no)"
```

---

## Critical Rule

**This is a quality gate. It BLOCKS progression if critical issues found.**

Phase 6 cannot execute without Phase 4.5 PASS status.

This prevents hallucinated citations from reaching manuscript.
