---
name: phase-07-cross-phase-validator
description: "Final quality gate: Validate consistency and traceability across all phase outputs. Ensures synthesis themes appear in outline, outline sections in draft, claims trace back to evidence. Calculates consistency score. MUST PASS (≥75 score) before workflow completion."
requires:
  - outputs/literature-synthesis-matrix.md
  - outputs/literature-review-outline.md
  - outputs/literature-review-draft.md
produces:
  - outputs/cross-phase-validation-report.md
model: sonnet
tools: Read, Write, Edit, Grep
allowed-tools: Read, Write, Edit, Grep
estimated_time: "5-10 min"
resumable: false
is_final_quality_gate: true
---

# Phase 7: Cross-Phase Validation

## Overview

This is the **FINAL QUALITY CONTROL GATE**. It validates:
1. **Phase 2→3**: All synthesis themes appear in outline
2. **Phase 3→4**: All outline sections appear in draft
3. **Phase 2→4**: Themes properly carried through both phases
4. **Phase 4→6**: Contributions grounded in draft evidence (if Phase 6 exists)
5. **End-to-end**: Sample claims traceable from corpus to final output

**Success metric**: Consistency score ≥75/100

**Blocks workflow if**: Critical issues found OR consistency <75

## Pre-Execution Validation

```bash
1. outputs/literature-synthesis-matrix.md exists
2. outputs/literature-review-outline.md exists
3. outputs/literature-review-draft.md exists
4. Optional: outputs/research-contributions-implications.md
5. outputs/ directory writable
```

## Execution Model

### Step 1: Phase 2→3 Validation

**Check**: All synthesis themes appear in outline

```
1. Extract themes from synthesis matrix
   - Theme A (7 papers)
   - Theme B (5 papers)
   - Theme C (3 papers)
   - [etc.]

2. Extract sections from outline
   - Section 1: [Title]
   - Section 2: [Title]
   - [etc.]

3. Verify each theme has corresponding section
   - Theme A → Section 2 ✓
   - Theme B → Section 3 ✓
   - Theme C → Section 4 ✓

4. Flag any orphaned themes
   - Themes in synthesis but NOT in outline
   - Sections in outline but NOT in synthesis
```

**Scoring**:
- Each theme present in outline: +10 points
- Each section well-aligned with theme: +5 points
- Missing theme: -10 points (CRITICAL)
- Orphaned section: -5 points

### Step 2: Phase 3→4 Validation

**Check**: All outline sections have corresponding draft sections

```
1. Extract sections from outline
   - Section 1: AI Applications
   - Section 2: Implementation Barriers
   - [etc.]

2. Extract sections from draft
   - ## AI Applications in Healthcare
   - ## Implementation Barriers
   - [etc.]

3. Verify each outline section drafted
   - Outline Section 1 → Draft Section ✓
   - Outline Section 2 → Draft Section ✓

4. Check depth
   - Is each section adequately developed?
   - Minimal: <100 words per section (ISSUE)
   - Standard: 200-500 words per section ✓
   - Comprehensive: 500+ words per section ✓
```

**Scoring**:
- Section drafted with adequate depth: +15 points
- Section present but underdeveloped: -5 points (WARNING)
- Section outlined but not drafted: -15 points (CRITICAL)
- Extra draft sections not in outline: -5 points (suggests scope creep)

### Step 3: Phase 2→4 Direct Validation

**Check**: Themes and citations properly carried through

```
For each theme:
1. Find theme in synthesis matrix
2. Find corresponding outline section
3. Find corresponding draft section
4. Verify citations match
   - Does draft cite papers identified in synthesis for this theme?
   - Are there unexpected citations?
   - Are key papers cited or absent?

Example:
- Synthesis: Theme A addressed by papers P1, P3, P5, P7
- Outline: Section II covers Theme A
- Draft: Section II cites (P1, P3, P5, P7) ✓ OR missing P7 ⚠️

5. Verify evidence strength consistency
   - Synthesis labels evidence as "Strong Consensus"
   - Outline marks as strong consensus
   - Draft uses confident language ✓
```

**Scoring**:
- Theme consistent across phases: +20 points
- Minor citation discrepancies: -3 points
- Missing key citation: -10 points
- Inconsistent evidence strength language: -5 points

### Step 4: Phase 4→6 Validation (if Phase 6 present)

**Check**: Contributions grounded in draft evidence

```
For each contribution in Phase 6 output:
1. Identify evidence claim in contribution
2. Search draft for supporting evidence
3. Verify contribution is proportionate to evidence
   - Evidence: "Some research suggests X"
   - Contribution: Claims "X is established practice" ✗ (OVERCLAIM)
   - Contribution: Claims "X is emerging approach" ✓

4. Check limitations section
   - Are important limitations acknowledged?
   - Do implications match evidence strength?
```

**Scoring**:
- Contribution grounded in draft: +20 points
- Contribution overclaimed: -15 points (CRITICAL WARNING)
- Important limitation missing: -5 points
- Implications proportionate: +10 points

### Step 5: End-to-End Traceability Audit

**Check**: Sample claims traceable from corpus to final output

```
Select 3-5 major claims from draft. For each:

1. Find claim in draft
2. Find evidence in synthesis matrix
3. Find papers in extraction matrix
4. Verify papers actually say what synthesis claims

Example trace:
- Draft claim: "AI diagnostics improve accuracy by 15-25%"
- Synthesis says: "Papers report 15-25% improvements"
- Extraction matrix shows: Smith P1 says 15-25%, Jones P2 says 12-18%
- Result: Claim partially supported; slight overgeneralization detected

Traceability score:
- Complete chain (corpus→synthesis→outline→draft): +20 points
- Missing link: -15 points (CRITICAL)
- Evidence misrepresented at some stage: -10 points
```

### Step 6: Calculate Consistency Score

```
Total possible points: 100

Allocation:
- Phase 2→3 alignment: 20 points
- Phase 3→4 alignment: 25 points
- Phase 2→4 consistency: 20 points
- Phase 4→6 consistency: 15 points (if Phase 6 present)
- End-to-end traceability: 20 points

Final score = sum of achieved points

Interpretation:
- ≥85: EXCELLENT consistency
- 75-84: GOOD consistency ✓ PASS
- 65-74: ACCEPTABLE consistency (caution)
- <65: POOR consistency ✗ FAIL (major issues)
```

---

## Output Format: cross-phase-validation-report.md

```markdown
# Cross-Phase Validation Report

## Executive Summary

**Overall Consistency Score**: 82/100 ✅ **PASS**

**Status**: Workflow can proceed to completion

**Score Interpretation**: GOOD consistency across all phases. Minor issues identified; overall analytical pipeline maintained integrity.

---

## Detailed Validation Results

### Phase 2→3 Alignment (Synthesis → Outline)

**Check**: Do all synthesis themes appear in outline?

**Results**: ✅ PASS

| Synthesis Theme | Papers | Outline Section | Status |
|-----------------|--------|-----------------|--------|
| Theme A: AI Diagnostics | 8 papers | Section II | ✓ Present, well-aligned |
| Theme B: Clinical Support | 6 papers | Section III | ✓ Present, adequate coverage |
| Theme C: Barriers | 5 papers | Section IV | ✓ Present, comprehensive |
| Theme D: Implementation | 5 papers | Section IV.2 | ✓ Present as subsection |
| Theme E: Regulation | 4 papers | Section V | ✓ Present |
| Theme F: Future | 3 papers | Section VI | ✓ Present |

**Score**: 18/20 points
**Deduction**: One theme (Theme E) somewhat underdeveloped in outline (-2)

**Recommendation**: Theme E content adequate; no action required

---

### Phase 3→4 Alignment (Outline → Draft)

**Check**: Do all outline sections have corresponding draft sections?

**Results**: ⚠️ PASS WITH MINOR ISSUES

| Outline Section | Draft Section | Word Count | Status |
|-----------------|----------------|-----------|--------|
| I. Introduction | Present | 250 words | ✓ Good |
| II. AI Diagnostics | Present | 380 words | ✓ Excellent |
| III. Clinical Support | Present | 320 words | ✓ Good |
| IV. Implementation | Present | 290 words | ✓ Adequate |
| IV.1 Infrastructure | Covered in IV | N/A | ✓ Integrated |
| IV.2 Human Factors | Covered in IV | N/A | ✓ Integrated |
| V. Regulation | Present | 200 words | ⚠️ Minimal (WARNING) |
| VI. Conclusions | Present | 150 words | ⚠️ Minimal (WARNING) |

**Score**: 21/25 points
**Deductions**: 
- Section V somewhat brief (-2)
- Section VI could be expanded (-2)

**Recommendation**: Consider expanding Regulation and Conclusion sections if important for manuscript. Current coverage adequate for literature review scope.

---

### Phase 2→4 Direct Consistency (Theme Continuity)

**Check**: Are themes and citations consistent across synthesis-outline-draft?

**Results**: ✅ PASS

**Sample Theme Audit** (Theme A: AI Diagnostics):

1. **Synthesis Matrix**: 
   - Evidence strength: Strong Consensus
   - Key finding: "15-25% accuracy improvements"
   - Papers: Smith, Jones, Davis, Chen, et al. (8 total)

2. **Outline Section II**:
   - Labels as: "Strong Consensus"
   - Points covered: Accuracy improvements, domain breadth, limitations

3. **Draft Section II**:
   - Uses confident language: ✓ ("Research clearly demonstrates")
   - Cites appropriate papers: ✓ (Smith, Jones, Davis cited)
   - Reports 15-25% accuracy: ✓ (matches synthesis)
   - Evidence strength language: ✓ (matches "Strong Consensus")

**Theme Consistency**: EXCELLENT ✓

**Score**: 18/20 points
**Deduction**: One additional paper (Chen) in synthesis not cited in draft (-2, minor issue)

**Recommendation**: Citation represents adequate coverage; no action required. Including Chen optional.

---

### Phase 4→6 Consistency (Draft → Contributions)

**Check**: Are contributions grounded in draft evidence?

**Results**: ✅ PASS

**Sample Contribution Audit**:

**Contribution**: "This review synthesizes evidence showing AI diagnostic potential is well-proven"

- **Evidence in draft**: ✓ 8 papers support this, labeled "Strong Consensus"
- **Proportionality**: ✓ Claim appropriate to evidence strength
- **Grounding**: ✓ Directly references synthesis findings
- **Specificity**: ✓ Claims "well-proven" only for diagnostics (not all applications)

**Assessment**: Well-grounded, appropriately hedged ✓

**Score**: 14/15 points
**Note**: Overall contributions well-evidenced throughout

---

## Critical Issue Audit

**Check**: Any broken evidence chains?

**Result**: ✅ NONE FOUND

No instances of:
- Claims in draft without synthesis support
- Themes in outline not traced to papers
- Sections missing from draft
- Fabricated evidence chains

---

## Traceability Spot Check

**Sample Claim Analysis**:

**Claim**: "Six studies document physician resistance to AI"

**Trace**:
1. **Draft**: "Staff training and organizational change management emerge as equally critical factors. Multiple studies document significant physician resistance..."
   
2. **Synthesis**: Theme labeled "Human Factors" with 6 papers addressing resistance (Grant, Harris, Ibrahim, etc.)
   
3. **Papers**: Grant (P023), Harris (P024), Ibrahim (P025), Jones (P026), Khan (P027), Lee (P028)
   
4. **Extraction Matrix**: All 6 papers verified in extraction matrix with "resistance" or "skepticism" documented

**Traceability**: ✅ COMPLETE CHAIN

**Other spot checks**: All verified successfully

---

## Summary Statistics

**Validation Coverage**:
- Themes checked: 6/6 (100%)
- Outline sections checked: 8/8 (100%)
- Draft sections checked: 8/8 (100%)
- Citation continuity checked: 6 themes sampled (representative)
- Traceability spot checks: 5 claims (all verified)

**Score Breakdown**:
- Phase 2→3: 18/20 (90%)
- Phase 3→4: 21/25 (84%)
- Phase 2→4: 18/20 (90%)
- Phase 4→6: 14/15 (93%)
- Traceability: 20/20 (100%)

**Overall Score**: 91/100 = **91%**

---

## Consistency Assessment

| Category | Assessment |
|----------|------------|
| Synthesis-Outline alignment | Excellent |
| Outline-Draft alignment | Good |
| Theme consistency across phases | Excellent |
| Evidence strength labeling | Consistent |
| Citation continuity | Excellent |
| Claim support | Strong |
| Overclaiming risk | Low |

---

## Issues Identified

### Critical Issues (Must Fix)
NONE ✅

### Warnings (Should Review)
1. Section V (Regulation) underdeveloped—consider expansion
2. Section VI (Conclusions) brief—could provide more synthesis

### Information (Recommendations)
1. Chen (2024) appears in synthesis but not cited in draft—optional to add
2. Some narrative citations could improve readability

---

## Pass/Fail Decision

**FINAL STATUS**: ✅ **PASS**

**Consistency Score**: 91/100 (Target: ≥75)

**Qualifications**: 
- No critical issues
- Minor warnings noted but acceptable
- Analytical integrity maintained throughout workflow
- Ready for final manuscript integration

---

## Workflow Completion Status

✅ **Phase 1**: Literature Discovery — PASSED
✅ **Phase 2**: Extraction & Synthesis — PASSED
✅ **Phase 3**: Argument Structuring — PASSED
✅ **Phase 4**: Drafting — PASSED
✅ **Phase 4.5**: Citation Validation — PASSED
✅ **Phase 6**: Contribution Framing — PASSED
✅ **Phase 7**: Cross-Phase Validation — **PASSED**

---

## Recommendations for Final Manuscript

1. **Consider expanding**: Regulation and Conclusion sections (minor enhancement)
2. **Optional addition**: Include Chen (2024) citation in Theme A section
3. **Review suggested warnings**: Address if improving manuscript quality
4. **Ready for next stage**: Draft can proceed to:
   - Integration with methods/results sections
   - Manuscript formatting
   - Peer review submission

---

## Next Steps

**Workflow Conclusion**: All phases complete and validated

**Available outputs**:
- literature-review-draft.md (main deliverable)
- research-contributions-implications.md (contributions section)
- citation-integrity-report.md (citation documentation)
- All supporting matrices and outlines

**Ready for**: Manuscript integration, institutional submission, publication pipeline

---

## Validation Methodology

This validation ensures:
✅ Analytical integrity across 7-phase workflow
✅ No broken evidence chains
✅ Consistent evidence strength labeling
✅ Complete traceability (corpus → synthesis → outline → draft)
✅ Appropriate claim hedging
✅ Zero overclaiming

Quality standards met: **PASS**
```

---

## Success Criteria

Phase 7 successful when:

1. ✅ cross-phase-validation-report.md generated
2. ✅ Consistency score calculated (0-100)
3. ✅ All themes traced through all phases
4. ✅ Critical issues identified (if any)
5. ✅ Pass/Fail determination made
6. ✅ Traceability audit completed

---

## Pass/Fail Logic

```
PASS if:
- Consistency score ≥75
- No critical issues found
- Evidence chains complete
- Overclaiming risk low

FAIL if:
- Consistency score <75
- Critical issues present (broken chains, unsupported claims)
- Cannot trace evidence
- High overclaiming risk

If FAIL:
- Workflow paused
- Issues documented with locations
- Recommendations for fixes provided
- User must re-run affected phases
- Re-validate in Phase 7
```

---

## Integration with Orchestrator

### Inputs
```
Parameters:
- synthesis_file: "outputs/literature-synthesis-matrix.md"
- outline_file: "outputs/literature-review-outline.md"
- draft_file: "outputs/literature-review-draft.md"
- contributions_file: "outputs/research-contributions-implications.md" (optional)
```

### Outputs
```
Status: SUCCESS
Duration: X minutes

Output file:
- outputs/cross-phase-validation-report.md ✓

Result Summary:
- Consistency score: X/100
- Critical issues: [count]
- Pass/Fail: PASS / FAIL
```

### Orchestrator Final Step (AUTO QUALITY GATE)
```
If PASS (≥75):
  ✅ "WORKFLOW COMPLETE"
  Display: Final summary report
  Ask: "Ready to finalize? (yes/no)"
  
If FAIL (<75 or critical issues):
  ❌ "WORKFLOW PAUSED - Quality issues detected"
  Display: Issues and recommendations
  Ask: "Fix issues and re-validate? (yes/no)"
```

---

## Key Principle

**This is the FINAL quality gate.**

Both Phase 4.5 (citations) and Phase 7 (consistency) must PASS before workflow completion.

No low-quality outputs reach manuscript or publication pipeline.
