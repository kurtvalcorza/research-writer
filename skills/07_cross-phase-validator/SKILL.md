---
name: cross-phase-validator
description: Validates internal consistency across multiple phase outputs to ensure traceability, alignment, and coherence throughout the research writing workflow.
license: Apache-2.0
compatibility: Requires read access to multiple Markdown output files from Phases 2-5.
allowed-tools: Read Write Edit Glob Grep Bash
metadata:
  short-description: Quality control for cross-phase consistency and traceability.
  version: 1.0.0
---

# Cross-Phase Validation Agent (Phase 6)

This skill performs systematic validation of internal consistency across all phase outputs to ensure:
- Complete traceability from corpus through to final outputs
- Alignment of themes, arguments, and claims across phases
- No orphaned content or broken evidence chains
- Consistency of evidence strength characterizations

**Critical principle:** This agent validates the integrity of the entire analytical pipeline, catching inconsistencies that single-phase checks miss.

---

## 1. Trigger

Activate this skill when the user:
- Has completed multiple phases (minimum: Phases 2-4), and
- Requests cross-phase validation, consistency check, or workflow integrity audit

**Recommended usage:**
- After Phase 4 (before human review)
- After Phase 5 (before finalizing manuscript)
- Any time significant revisions are made to intermediate phases

---

## 2. Pre-Execution Validation

Before performing cross-phase validation, verify the following prerequisites:

### 2.1 Required File Checks

**Minimum Required Files** (for Phase 2→3→4 validation):
1. Check if `outputs/literature-synthesis-matrix.md` exists
   - **CRITICAL:** Cannot validate without Phase 2 synthesis
   - Action: Abort if missing, instruct user to complete Phase 2 first

2. Check if `outputs/literature-review-outline.md` exists
   - **CRITICAL:** Cannot validate Phase 2→3 alignment without outline
   - Action: Abort if missing, instruct user to complete Phase 3 first

3. Check if `outputs/literature-review-draft.md` exists
   - **CRITICAL:** Cannot validate Phase 3→4 alignment without draft
   - Action: Abort if missing, instruct user to complete Phase 4 first

**Optional Files** (for extended validation):
4. Check if `outputs/literature-extraction-matrix.md` exists
   - If present: Include corpus coverage validation
   - If absent: Skip corpus-level validation

5. Check if `outputs/citation-integrity-report.md` exists (Phase 4.5)
   - If present: Cross-check citation validation findings
   - If absent: Skip citation cross-validation

6. Check if `outputs/research-contributions-implications.md` exists (Phase 5)
   - If present: Validate Phase 4→5 alignment (contribution grounding)
   - If absent: Skip contribution validation

### 2.2 Output Directory Verification

1. Verify `outputs/` directory exists
   - If absent: Create it before proceeding
   - If no write permission: Abort with error

2. Check if `outputs/cross-phase-validation-report.md` already exists
   - If exists: Confirm user wants to overwrite
   - Preserve previous report as `outputs/cross-phase-validation-report.backup.md`

### 2.3 File Format Validation

For each present file, verify:
1. File is valid Markdown (can be read without errors)
2. File is not empty (>0 bytes)
3. File contains expected structural markers:
   - Synthesis matrix: Theme tables or theme headers
   - Outline: Section headers with "Core Claim" labels
   - Draft: Paragraph content with citations
   - Contributions: Contribution/implication sections

**If any required file fails format validation:**
- Log warning with specific format issue
- Attempt validation anyway (best-effort mode)
- Flag format issues in final report

### 2.4 Validation Scope Determination

Based on available files, determine validation scope:
- **Minimum scope:** Phases 2→3→4 (synthesis → outline → draft)
- **Extended scope:** Add Phase 4.5 and/or Phase 5 if files present
- **Corpus-level scope:** Add extraction matrix validation if present

**Output validation scope at start of report:**
```
Validation Scope: [Minimum / Extended / Corpus-level]
Phases Validated: 2 → 3 → 4 [→ 4.5] [→ 5]
```

---

## 3. Execution Model

This skill operates as a **single-pass analytical workflow** that validates consistency across multiple completed phases.

### 3.1 Processing Strategy

**Sequential Validation Flow:**
1. Load all available phase outputs into memory
2. Validate Phase 2→3 (synthesis to outline)
3. Validate Phase 3→4 (outline to draft)
4. Validate Phase 2→4 direct (synthesis to draft)
5. If Phase 5 present: Validate Phase 4→5 (draft to contributions)
6. Perform end-to-end traceability audit (sample claims)
7. Calculate consistency metrics
8. Generate comprehensive validation report

**Processing Characteristics:**
- **Read-only operation:** Never modifies any phase outputs
- **No state management:** Completes in single execution
- **No recovery needed:** If interrupted, re-run from start (fast operation)
- **Memory-based:** All files loaded for cross-referencing

### 3.2 Validation Dependencies

**Hard Dependencies** (must exist):
- Phase 2 output (synthesis matrix)
- Phase 3 output (outline)
- Phase 4 output (draft)

**Soft Dependencies** (optional):
- Phase 2 extraction matrix (for corpus coverage)
- Phase 4.5 citation report (for citation cross-check)
- Phase 5 contributions (for contribution grounding)

**Execution Guarantee:**
With all required files present, validation completes in single pass with no user intervention required.

### 3.3 Performance Characteristics

**Expected duration:**
- Small corpus (3-5 papers): 30-60 seconds
- Medium corpus (10-20 papers): 1-2 minutes
- Large corpus (50+ papers): 3-5 minutes

**Bottlenecks:**
- Large draft files (>10,000 words) require more citation cross-referencing
- Complex synthesis matrices (>20 themes) slow theme coverage checks

---

## 4. Objective

Produce a **comprehensive cross-phase validation report** that:
- Validates forward traceability (corpus → synthesis → outline → draft → contributions)
- Validates backward traceability (claims → synthesis → corpus)
- Identifies orphaned content (themes in synthesis but not in outline; outline sections without draft)
- Flags inconsistencies in evidence strength characterizations
- Assesses overall workflow integrity

---

## 5. Inputs

### 5.1 Required Inputs (Minimum)

**For Phase 2→3→4 validation:**
- `outputs/literature-synthesis-matrix.md` (Phase 2)
- `outputs/literature-review-outline.md` (Phase 3)
- `outputs/literature-review-draft.md` (Phase 4)

### 5.2 Optional Inputs (Extended Validation)

- `outputs/literature-extraction-matrix.md` (Phase 2) - for corpus coverage validation
- `outputs/research-contributions-implications.md` (Phase 5) - for contribution-evidence alignment
- `outputs/citation-integrity-report.md` (Phase 4.5) - for citation validation cross-check

---

## 6. Validation Dimensions

### 6.1 Phase 2→3 Validation: Synthesis to Outline

**Objective:** Ensure outline comprehensively addresses synthesis themes.

**Checks:**

1. **Theme Coverage**
   - Every theme from synthesis matrix appears in outline?
   - **PASS:** All themes represented
   - **WARNING:** Theme(s) in synthesis but not in outline
   - **Action:** Add missing themes or document exclusion rationale

2. **Evidence Strength Consistency**
   - Outline's "Evidence Profile" aligns with synthesis theme documentation?
   - Example: If synthesis shows "all 3 papers" address theme, outline should mark "Strong consensus"
   - **PASS:** Evidence strength labels justified
   - **WARNING:** Mismatch between synthesis evidence and outline characterization

3. **Gap Representation**
   - Gaps identified in synthesis appear in outline's "Gaps & Tensions"?
   - **PASS:** Gaps carried forward
   - **WARNING:** Gaps lost between phases

**Validation table:**

| Synthesis Theme | Present in Outline? | Evidence Strength (Synthesis) | Evidence Strength (Outline) | Alignment Status |
|-----------------|---------------------|-------------------------------|----------------------------|------------------|
| AI Readiness | ✅ Yes (Section 1) | All 3 papers | Strong consensus | ✅ ALIGNED |
| Skills Development | ✅ Yes (Section 3) | All 3 papers | Strong consensus | ✅ ALIGNED |
| Infrastructure | ✅ Yes (Section 2) | 2 papers | Strong consensus | ⚠️ MISALIGNED - only 2 papers but labeled "strong" |
| Policy Frameworks | ❌ No | 2 papers | N/A | 🚨 MISSING - theme in synthesis but not outlined |

---

### 6.2 Phase 3→4 Validation: Outline to Draft

**Objective:** Ensure draft implements the approved outline structure and claims.

**Checks:**

1. **Section Completeness**
   - Every section in outline has corresponding draft section?
   - **PASS:** 1:1 mapping
   - **WARNING:** Outline section missing from draft
   - **ERROR:** Draft section not in outline (suggests scope creep)

2. **Core Claim Alignment**
   - Draft paragraphs reflect outline's "Core Claim"?
   - **PASS:** Claims match
   - **WARNING:** Draft substantially differs from approved claim

3. **Evidence Strength Hedging**
   - Draft language appropriate for outline's evidence strength?
   - Example: "Limited evidence" sections should use cautious language
   - **PASS:** Hedging matches evidence strength
   - **WARNING:** Overconfident language for weak evidence

**Validation table:**

| Outline Section | Draft Section Present? | Core Claim Match? | Hedging Appropriate? | Status |
|-----------------|------------------------|-------------------|----------------------|--------|
| Section 1: Current State | ✅ Yes | ✅ Match | ✅ Appropriate | ✅ PASS |
| Section 2: Infrastructure | ✅ Yes | ⚠️ Partial | ✅ Appropriate | ⚠️ WARNING |
| Section 3: Human Capital | ❌ Missing | N/A | N/A | 🚨 ERROR |
| [Unlabeled: New section] | ✅ Present | N/A | N/A | 🚨 ERROR - not in outline |

---

### 6.3 Phase 2→4 Validation: Synthesis to Draft (Direct)

**Objective:** Ensure draft claims trace back to synthesis evidence.

**Checks:**

1. **Theme-Draft Mapping**
   - Themes from synthesis are actually discussed in draft?
   - **PASS:** All themes addressed
   - **WARNING:** Theme in synthesis but never mentioned in draft

2. **Paper Citation Coverage**
   - Papers contributing to synthesis themes are cited in relevant draft sections?
   - **PASS:** Papers cited where expected
   - **WARNING:** Paper central to theme but never cited in draft

**Validation table:**

| Synthesis Theme | Papers Addressing Theme | Draft Sections Discussing Theme | Papers Cited in Those Sections | Coverage Status |
|-----------------|-------------------------|---------------------------------|--------------------------------|-----------------|
| AI Readiness | Pareja, Campued, Jala | Section 1 | Pareja, Campued, Jala | ✅ COMPLETE |
| Skills Development | All 3 papers | Section 3 | Campued, Jala | ⚠️ INCOMPLETE - Pareja not cited |
| Infrastructure | Pareja, Jala | Section 2 | Pareja, Jala | ✅ COMPLETE |

---

### 6.4 Phase 4→5 Validation: Draft to Contributions

**Objective:** Ensure contribution claims are grounded in draft evidence.

**Checks:**

1. **Contribution-Gap Alignment**
   - Contributions in Phase 5 correspond to gaps identified in synthesis/outline/draft?
   - **PASS:** Contributions address documented gaps
   - **WARNING:** Contribution claims not tied to identified gaps

2. **Evidence Boundary Respect**
   - Contributions in Phase 5 respect limitations acknowledged in draft?
   - **PASS:** No overclaiming
   - **WARNING:** Contribution scope exceeds evidence boundaries

3. **Future Research-Gap Mapping**
   - Future research directions in Phase 5 trace to gaps in synthesis?
   - **PASS:** Future directions target documented gaps
   - **WARNING:** Future directions address issues not identified as gaps

**Validation table:**

| Contribution Claim (Phase 5) | Grounding in Draft | Gap Documented? | Boundary Respected? | Status |
|------------------------------|--------------------|-----------------|--------------------|--------|
| "Multi-level framework clarification" | Section 1 discussion | ✅ Yes (synthesis) | ✅ Yes | ✅ VALID |
| "Comprehensive gap mapping" | Sections 1-6 gaps | ✅ Yes (outline) | ✅ Yes | ✅ VALID |
| "First longitudinal study of AI adoption" | Not mentioned | ❌ No | ❌ No - overclaim | 🚨 ERROR |

---

### 6.5 Complete Traceability Chain Validation

**Objective:** Verify end-to-end traceability for sampled claims.

**Process:**
1. Select 5-10 key claims from draft
2. Trace backward:
   - Draft claim → Outline section → Synthesis theme → Extraction matrix papers
3. Verify chain is unbroken

**Example trace:**

```
CLAIM (Draft, Section 3):
"Critical skill gaps and shortage of AI professionals emerge as the most urgent constraints to AI adoption across all three studies."

TRACED TO (Outline, Section 3):
Core Claim: "Critical skill gaps represent the most urgent constraint"
Evidence Profile: "Strong consensus (all 3 papers)"

TRACED TO (Synthesis Matrix):
Theme: "Skills and Workforce Development"
Papers Addressing: Campued et al., Jala et al., Pareja (implicit)
Consensus: "Universal agreement on critical skill gaps"

TRACED TO (Extraction Matrix):
- Campued: "need for tailored training" (Key Findings)
- Jala: "significant skill gaps and shortage" (Key Findings)
- Pareja: [implicit in digital transformation requirements]

TRACEABILITY STATUS: ✅ COMPLETE
```

---

## 7. Output Structure

Generate: `outputs/cross-phase-validation-report.md`

### 7.1 Report Structure Overview

The validation report contains these sections:
1. **Executive Summary** - Overall status and issue counts
2. **Phase 2→3 Validation** - Synthesis to Outline alignment
3. **Phase 3→4 Validation** - Outline to Draft alignment
4. **Phase 2→4 Validation** - Synthesis to Draft direct traceability
5. **Phase 4→5 Validation** - Draft to Contributions grounding (if Phase 5 present)
6. **End-to-End Traceability Audit** - Sample claim traces
7. **Consistency Metrics** - Overall consistency score and issue distribution
8. **Quality Control Checklist** - Go/no-go criteria
9. **Recommended Actions** - Prioritized fix list
10. **Validation Metadata** - Timestamp, files analyzed, scores

### 7.2 Complete Example Report (Minimal Corpus)

```markdown
# Cross-Phase Validation Report

**Generated:** 2024-03-15 14:32:00
**Phases Validated:** 2 → 3 → 4
**Validation Scope:** Minimum (3 papers)
**Overall Status:** WARNINGS

---

## Executive Summary

| Validation Dimension | Status | Issues Found | Critical | Warnings |
|---------------------|--------|--------------|----------|----------|
| Phase 2→3 (Synthesis to Outline) | ⚠️ WARNINGS | 2 | 0 | 2 |
| Phase 3→4 (Outline to Draft) | ✅ PASS | 0 | 0 | 0 |
| Phase 2→4 (Synthesis to Draft Direct) | ⚠️ WARNINGS | 1 | 0 | 1 |
| End-to-End Traceability | ✅ PASS | 0 | 0 | 0 |

**Overall Assessment:** NEEDS ATTENTION (2 warnings need review)

**Proceed to next phase:** AFTER REVISIONS (address warnings first)

---

## 1. Phase 2→3 Validation: Synthesis to Outline

### 1.1 Theme Coverage Analysis

**Total themes in synthesis matrix:** 4
**Themes represented in outline:** 3 (75%)
**Missing themes:** 1

**Status:** ⚠️ GAPS DETECTED

#### Missing Themes

| Theme | Papers Addressing | Why Missing? | Severity | Recommendation |
|-------|-------------------|--------------|----------|----------------|
| Policy Frameworks | Campued, Jala (2 papers) | Not outlined | Medium | Add to Section 4 or document exclusion rationale |

**Action Required:**
- Review "Policy Frameworks" theme for inclusion
- If relevant, add as Section 4 in outline
- If excluded intentionally, document why in outline introduction

### 1.2 Evidence Strength Consistency

**Total outline sections checked:** 3
**Aligned with synthesis:** 2 (67%)
**Misaligned:** 1

**Status:** ⚠️ MINOR MISALIGNMENT

#### Misalignments Detected

| Section | Synthesis Evidence | Outline Label | Issue | Recommendation |
|---------|-------------------|---------------|-------|----------------|
| Section 2: Infrastructure | 2 papers (Pareja, Jala) | "Strong consensus" | Overstated | Revise to "Mixed evidence" (only 2/3 papers) |

**Action Required:**
- Update Section 2 evidence profile from "Strong consensus" to "Mixed evidence" or "Moderate support"

### 1.3 Gap Representation

**Gaps in synthesis matrix:** 2
**Gaps in outline:** 2
**Missing gap coverage:** 0

**Status:** ✅ COMPLETE

All gaps carried forward successfully.

---

## 2. Phase 3→4 Validation: Outline to Draft

### 2.1 Section Completeness

**Outline sections:** 3
**Draft sections:** 3
**1:1 mapping:** YES

**Status:** ✅ COMPLETE

All outline sections have corresponding draft sections.

### 2.2 Core Claim Alignment

**Sections with core claims:** 3
**Claims aligned:** 3 (100%)
**Claims misaligned:** 0

**Status:** ✅ ALIGNED

### 2.3 Evidence Hedging Appropriateness

**Sections checked:** 3
**Appropriate hedging:** 3 (100%)
**Inappropriate confidence:** 0

**Status:** ✅ APPROPRIATE

---

## 3. Phase 2→4 Validation: Synthesis to Draft (Direct)

### 3.1 Theme Coverage in Draft

**Themes in synthesis:** 4
**Themes discussed in draft:** 3 (75%)
**Orphaned themes:** 1

**Status:** ⚠️ PARTIAL

#### Orphaned Themes

| Theme | Papers | Why Not in Draft? | Severity | Recommendation |
|-------|--------|-------------------|----------|----------------|
| Policy Frameworks | 2 papers | ❌ Not addressed | Medium | Add paragraph to Section 3 or explain exclusion |

**Action Required:**
- Same as Phase 2→3 issue: add Policy Frameworks content or document exclusion

### 3.2 Paper Citation Coverage

**Papers in extraction matrix:** 3
**Papers cited in draft:** 3 (100%)
**Uncited papers:** 0

**Status:** ✅ COMPLETE

All papers in corpus are cited appropriately.

---

## 4. End-to-End Traceability Audit

**Sample claims traced:** 3
**Complete traces:** 3 (100%)
**Broken traces:** 0

**Status:** ✅ TRACEABLE

### Sample Trace 1

**Claim (Draft, Section 3):** "Critical skill gaps and shortage of AI professionals emerge as the most urgent constraints to AI adoption."

**Trace:**
```
Draft (Section 3) → Outline (Section 3: Core Claim "Critical skill gaps represent the most urgent constraint") →
Synthesis (Theme: Skills and Workforce Development, All 3 papers) →
Extraction (Campued: "tailored training"; Jala: "skill gaps and shortage"; Pareja: implicit in digital transformation requirements)
```

**Status:** ✅ COMPLETE TRACE

### Sample Trace 2

**Claim (Draft, Section 1):** "Philippines finds itself in the foundational stages of AI adoption."

**Trace:**
```
Draft (Section 1) → Outline (Section 1: Core Claim "Philippines in foundational stage") →
Synthesis (Theme: Current State of AI Readiness, All 3 papers) →
Extraction (All 3 papers discuss current adoption level)
```

**Status:** ✅ COMPLETE TRACE

### Sample Trace 3

**Claim (Draft, Section 2):** "Infrastructure readiness shows mixed progress across technical and organizational dimensions."

**Trace:**
```
Draft (Section 2) → Outline (Section 2: Core Claim "Infrastructure at multiple levels") →
Synthesis (Theme: Infrastructure Readiness, Pareja + Jala) →
Extraction (Pareja: technical infrastructure; Jala: organizational infrastructure)
```

**Status:** ✅ COMPLETE TRACE

---

## 5. Consistency Metrics

### 5.1 Overall Consistency Score

**Score:** 82/100

**Interpretation:** GOOD - minor revisions recommended before proceeding

**Breakdown:**
- Theme coverage: 75% (3/4 themes)
- Section mapping: 100% (3/3 sections)
- Evidence strength alignment: 67% (2/3 aligned)
- Citation coverage: 100% (3/3 papers)
- Traceability: 100% (3/3 traces complete)

### 5.2 Issue Severity Distribution

| Severity | Count | % of Total |
|----------|-------|------------|
| 🚨 CRITICAL | 0 | 0% |
| ⚠️ WARNING | 3 | 100% |
| ℹ️ INFO | 0 | 0% |

---

## 6. Quality Control Checklist

**Phase 2→3:**
- [ ] All synthesis themes represented in outline [PARTIAL - 1 missing]
- [x] Evidence strength labels consistent [NEEDS REVISION - 1 mislabeled]
- [x] Gaps carried forward

**Phase 3→4:**
- [x] All outline sections have corresponding draft
- [x] No unauthorized draft sections (scope creep)
- [x] Core claims aligned
- [x] Hedging appropriate for evidence strength

**Phase 2→4:**
- [ ] All themes discussed in draft [PARTIAL - same missing theme]
- [x] Papers cited where expected
- [x] No orphaned synthesis content

**Traceability:**
- [x] Sample claims trace completely through pipeline
- [x] No broken evidence chains

**Overall:**
- [x] Consistency score >75 (82/100)
- [x] Zero critical issues
- [ ] All warnings documented and assessed [IN PROGRESS]

---

## 7. Recommended Actions (Prioritized)

### HIGH PRIORITY (Strongly Recommended):
1. **Address missing "Policy Frameworks" theme** - Either add to outline/draft OR document exclusion rationale in outline introduction
2. **Fix evidence strength label** - Change Section 2 outline from "Strong consensus" to "Mixed evidence" to match actual paper coverage (2/3 papers)

### MEDIUM PRIORITY (Should Address):
None

### LOW PRIORITY (Optional):
None

---

## 8. Validation Metadata

**Validation performed by:** Cross-Phase Validator v1.0.0
**Phases analyzed:**
  - Phase 2: `outputs/literature-synthesis-matrix.md` (4 themes, 3 papers)
  - Phase 3: `outputs/literature-review-outline.md` (3 sections)
  - Phase 4: `outputs/literature-review-draft.md` (3 sections, 2,847 words)

**Validation timestamp:** 2024-03-15 14:32:00
**Consistency score:** 82/100
**Critical issues:** 0
**Warnings:** 3

---

**End of Cross-Phase Validation Report**
```

### 7.3 Template Notes

For each validation dimension, the report includes:
- **Quantitative metrics** (counts, percentages, scores)
- **Status indicators** (✅ ❌ ⚠️ symbols for quick scanning)
- **Detailed tables** showing specific issues with file/section references
- **Action Required sections** with concrete next steps
- **Severity assessment** for prioritization

---

## 8. Error Handling

This section documents how to handle common errors and edge cases during cross-phase validation.

### 8.1 Missing or Invalid Input Files

**Error: Required phase output missing**
- **Detection:** Pre-execution check finds `outputs/literature-synthesis-matrix.md`, `outputs/literature-review-outline.md`, or `outputs/literature-review-draft.md` missing
- **Severity:** CRITICAL - cannot proceed
- **Action:**
  1. Abort validation
  2. Report which required file(s) are missing
  3. Instruct user: "Please complete [Phase X] first, then re-run cross-phase validation"
- **Example message:** "Cannot validate: `outputs/literature-review-outline.md` not found. Please complete Phase 3 (Argument Structurer) before running cross-phase validation."

**Error: File exists but is empty or corrupted**
- **Detection:** File size is 0 bytes OR cannot be parsed as Markdown
- **Severity:** CRITICAL
- **Action:**
  1. Report specific file and issue
  2. Suggest re-running the phase that produces this file
- **Example message:** "`outputs/literature-synthesis-matrix.md` is empty (0 bytes). Please re-run Phase 2 (Literature Synthesis)."

**Error: Optional file referenced but not found**
- **Detection:** User requests extended validation (e.g., Phase 4→5) but `outputs/research-contributions-implications.md` missing
- **Severity:** WARNING
- **Action:**
  1. Proceed with validation for available phases only
  2. Note in report which validation dimensions were skipped
- **Example message:** "Phase 5 output not found. Skipping contribution grounding validation. Proceeding with Phases 2→3→4 validation only."

### 8.2 Partial Workflow Validation

**Error: User requests validation but intermediate phases incomplete**
- **Detection:** Phase 4 output exists, but Phase 3 output missing
- **Severity:** CRITICAL - cannot validate non-sequential phases
- **Action:**
  1. Abort validation
  2. Report gap in workflow
  3. List which phases are present and which are missing
- **Example message:** "Validation failed: Phase 4 output found, but Phase 3 output missing. Cross-phase validation requires sequential phases (2→3→4)."

**Scenario: Phases 2 and 4 exist, but Phase 3 missing**
- Cannot validate Phase 2→3 alignment (no Phase 3)
- Cannot validate Phase 3→4 alignment (no Phase 3)
- CAN validate Phase 2→4 direct alignment
- **Action:** Offer reduced validation scope OR instruct user to complete Phase 3

### 8.3 Malformed Phase Output Structure

**Error: Expected structural markers not found**
- **Detection:**
  - Synthesis matrix missing theme headers or tables
  - Outline missing "Core Claim" labels
  - Draft missing section headers
  - Contributions file missing "Contribution" or "Implication" sections
- **Severity:** MAJOR - validation will be incomplete
- **Action:**
  1. Flag warning at start of validation
  2. Attempt best-effort validation
  3. Document structural issues in validation report
  4. Mark affected validation dimensions as "INCOMPLETE - FORMAT ISSUES"
- **Example:** If outline lacks "Evidence Profile" labels, cannot validate evidence strength consistency

**Error: Phase outputs use inconsistent formatting**
- **Detection:** Outline uses "Section 1" but draft uses "1." or "Part 1"
- **Severity:** MINOR - affects mapping accuracy
- **Action:**
  1. Attempt fuzzy matching (e.g., "Section 1" matches "1. Introduction")
  2. Flag ambiguous mappings for human review
  3. Document matching strategy in report

### 8.4 Output Write Failures

**Error: Cannot create `outputs/cross-phase-validation-report.md`**
- **Detection:** Write permission denied OR disk full OR directory missing
- **Severity:** CRITICAL - validation results cannot be saved
- **Action:**
  1. Attempt to create `outputs/` directory if missing
  2. If still fails, report file system issue
  3. Suggest alternative: Display validation results in console instead
- **Example message:** "Cannot write to `outputs/cross-phase-validation-report.md` (permission denied). Check directory permissions or run with appropriate access."

**Error: Existing report cannot be backed up**
- **Detection:** `outputs/cross-phase-validation-report.md` exists but cannot be renamed to `.backup.md`
- **Severity:** MINOR - can proceed by overwriting
- **Action:**
  1. Warn user that previous report will be overwritten without backup
  2. Prompt for confirmation
  3. If user declines, abort

### 8.5 Validation Contradictions and Edge Cases

**Edge case: Theme in synthesis but intentionally excluded from outline**
- **Detection:** Theme appears in synthesis matrix but not in outline
- **Severity:** WARNING (may be intentional)
- **Action:**
  1. Flag as "Missing theme" in validation report
  2. Provide recommendation: "Add to outline OR document exclusion rationale"
  3. Allow user to decide if this is an error or intentional design choice

**Edge case: Draft section not in outline (scope expansion)**
- **Detection:** Draft contains section not present in outline
- **Severity:** MAJOR - suggests scope creep or phase skipping
- **Action:**
  1. Flag as "Unauthorized section" in validation report
  2. Recommendation: "Review this section - either add to outline first OR remove from draft"
  3. Mark validation status as "WARNINGS - SCOPE CREEP DETECTED"

**Edge case: Paper in synthesis but never cited in draft**
- **Detection:** Paper contributed to synthesis themes but has zero citations in draft
- **Severity:** MINOR to MAJOR (depends on paper's centrality)
- **Action:**
  1. Check if paper is central to multiple themes (high importance) or minor contributor (low importance)
  2. Flag as warning if central paper under-cited
  3. Mark as informational note if minor contributor

**Edge case: Complete traceability chain but weak evidence**
- **Detection:** Claim traces back to corpus, but only 1 paper supports it (weak evidence)
- **Severity:** INFORMATIONAL - traceability is valid, but user should be aware
- **Action:**
  1. Note in traceability audit: "✅ COMPLETE TRACE (but limited evidence: 1 paper)"
  2. Cross-check with outline's "Evidence Profile" - should be labeled "Limited" or "Emerging"

**Edge case: Validation timeouts for very large corpora**
- **Detection:** Processing time exceeds reasonable threshold (>10 minutes)
- **Severity:** MINOR - validation still correct, just slow
- **Action:**
  1. Provide progress updates during long operations
  2. Consider sampling strategy for very large corpora (e.g., validate 10 sample themes instead of all 50)

---

## 9. Output Validation

After generating `outputs/cross-phase-validation-report.md`, perform self-assessment to ensure validation quality.

### 9.1 Validation Report Quality Criteria

A high-quality cross-phase validation report must:

1. **Completeness:**
   - All requested validation dimensions included (Phase 2→3, 3→4, 2→4, etc.)
   - Executive summary table populated
   - All validation tables contain actual data (not placeholders)
   - Consistency score calculated and justified
   - Recommended actions prioritized by severity

2. **Accuracy:**
   - Theme counts match actual synthesis matrix
   - Section counts match actual outline/draft
   - Citation coverage percentages calculated correctly
   - Traceability samples representative of overall draft

3. **Actionability:**
   - Every flagged issue includes specific recommendation
   - Critical issues clearly distinguished from warnings
   - Recommendations are concrete (not vague like "review this")
   - Prioritized action list helps user know what to fix first

4. **Clarity:**
   - Status indicators consistent (✅ ❌ ⚠️)
   - Tables well-formatted and readable
   - Examples provided for complex issues
   - Overall assessment clear (PASS / WARNINGS / CRITICAL ISSUES)

### 9.2 Quality Self-Assessment

Before finalizing the report, verify:

**Structural Checks:**
- [ ] All validation dimension sections present (2→3, 3→4, 2→4, 4→5, end-to-end)
- [ ] Executive summary table populated with actual counts
- [ ] Consistency score calculated (not "[X]/100" placeholder)
- [ ] Quality control checklist populated with actual checkboxes
- [ ] Validation metadata section includes actual timestamp and file paths

**Content Checks:**
- [ ] At least 5-10 sample claims traced for end-to-end validation
- [ ] All "Missing themes" identified with severity assessment
- [ ] All "Missing sections" (outline vs draft) flagged
- [ ] Evidence strength misalignments quantified (X out of Y sections)
- [ ] Citation coverage calculated as percentage

**Recommendation Checks:**
- [ ] Every critical issue has "Action Required" guidance
- [ ] Recommended actions prioritized (CRITICAL / HIGH / MEDIUM / LOW)
- [ ] No generic recommendations like "review for consistency"
- [ ] Specific file/section references provided for each issue

### 9.3 Quality Tiers

**EXCELLENT (Consistency Score 90-100):**
- Zero critical issues
- Zero or minimal warnings (≤3)
- All themes/sections/claims traceable
- Evidence strength alignment >95%
- Ready to proceed to next phase without revisions

**GOOD (Consistency Score 75-89):**
- Zero critical issues
- Moderate warnings (4-10)
- Minor gaps in coverage or alignment
- Evidence strength alignment >85%
- Minor revisions recommended before proceeding

**ACCEPTABLE (Consistency Score 60-74):**
- 1-2 critical issues OR many warnings (>10)
- Noticeable gaps in theme/section coverage
- Evidence strength misalignments in multiple sections
- Moderate revisions needed before proceeding

**POOR (Consistency Score <60):**
- Multiple critical issues (≥3)
- Major gaps in workflow (missing themes, sections, broken traces)
- Widespread evidence strength misalignments
- Substantial rework required - do NOT proceed to next phase

**Validation Report Self-Assessment:**
After generating report, assign quality tier to the validation process itself:
- Did validation check all required dimensions? → If no, report is INCOMPLETE
- Are all tables populated with real data? → If no, report is DRAFT/PLACEHOLDER
- Are recommendations specific and actionable? → If no, report needs revision

---

## 10. Integration with Other Phases

This skill validates the **outputs** of prior phases and provides quality assurance before proceeding to manuscript finalization or publication.

### 10.1 Relationship to Prior Phases

**Phase 2 (Literature Synthesis) - Input Dependency:**
- **Requires:** `outputs/literature-synthesis-matrix.md`
- **Uses:** Theme identification, paper-to-theme mapping, consensus documentation
- **Validates:** That synthesis themes appear in outline and draft
- **Quality dependency:** If synthesis has poorly defined themes, validation will flag many "missing theme" warnings

**Phase 3 (Argument Structurer) - Input Dependency:**
- **Requires:** `outputs/literature-review-outline.md`
- **Uses:** Section structure, core claims, evidence profiles
- **Validates:** That outline sections appear in draft, claims align, evidence strength consistent
- **Quality dependency:** If outline lacks clear "Core Claim" labels, claim alignment validation will be incomplete

**Phase 4 (Literature Drafter) - Input Dependency:**
- **Requires:** `outputs/literature-review-draft.md`
- **Uses:** Draft sections, paragraph claims, citation usage
- **Validates:** That draft implements outline structure, cites synthesis papers appropriately
- **Quality dependency:** If draft has poor section headers, section mapping will require manual review

**Phase 4.5 (Citation Validator) - Optional Input:**
- **Requires:** `outputs/citation-integrity-report.md` (optional)
- **Uses:** Citation validation findings for cross-check
- **Validates:** Consistency between Phase 4.5 findings and Phase 6 validation
- **Integration point:** If Phase 4.5 flagged citation issues, Phase 6 should verify they align with draft-to-synthesis validation

**Phase 5 (Contribution Framer) - Optional Input:**
- **Requires:** `outputs/research-contributions-implications.md` (optional)
- **Uses:** Contribution claims, future research directions
- **Validates:** That contributions are grounded in draft evidence, respect evidence boundaries
- **Quality dependency:** If Phase 5 makes overclaims, validation will flag boundary violations

### 10.2 Workflow Continuity

**Prerequisites:**
- Minimum: Phases 2, 3, 4 completed
- Recommended: Phases 2, 3, 4, 4.5, 5 completed
- This skill (Phase 6) does NOT require Phase 1 output (screening), as it validates analytical phases only

**Enables:**
- Human review with confidence (after validation shows PASS or GOOD status)
- Manuscript finalization (if consistency score >75)
- Submission preparation (if zero critical issues)

**Triggers for Re-Running This Skill:**
1. After revising any intermediate phase (2, 3, 4, 5)
2. Before final manuscript submission
3. If reviewers question internal consistency
4. When adding new papers to corpus and re-running Phases 2-4

### 10.3 Quality Dependency Chain

```
Phase 2 Quality → Affects → Phase 6 theme coverage validation
Phase 3 Quality → Affects → Phase 6 claim alignment validation
Phase 4 Quality → Affects → Phase 6 citation coverage validation
Phase 5 Quality → Affects → Phase 6 contribution grounding validation
```

**If Phase 2 has issues:**
- Poorly defined themes → Phase 6 will struggle to match themes to outline
- Missing papers in synthesis → Phase 6 will flag under-cited papers

**If Phase 3 has issues:**
- Vague core claims → Phase 6 cannot validate claim alignment
- Missing evidence profiles → Phase 6 cannot validate evidence strength

**If Phase 4 has issues:**
- Poor section structure → Phase 6 will flag section mapping issues
- Under-citation → Phase 6 will flag citation coverage gaps

**If Phase 5 has issues:**
- Overclaiming → Phase 6 will flag boundary violations
- Ungrounded contributions → Phase 6 will flag weak contribution grounding

### 10.4 Output Usage

**Primary Output:**
- `outputs/cross-phase-validation-report.md` - used by human reviewers to assess workflow integrity

**Secondary Effects:**
- Confidence in manuscript quality increases if validation shows PASS
- Identification of specific phases needing revision
- Documentation of systematic review rigor for publication

**Does NOT produce:**
- Revised versions of any phase outputs (validation only, never modifies)
- New research content
- Citation corrections (use Phase 4.5 for that)

---

## 11. Constraints and Safety Measures

### 11.1 Constraints
- **Do not modify any phase outputs:** Validation only
- **Do not judge content quality:** Focus on structural consistency
- **Do not enforce style preferences:** Check alignment, not aesthetics
- **Work only with provided files:** No external validation

### 11.2 Validation Philosophy
- **Structural over semantic:** Check that outline section exists, not whether it's well-written
- **Explicit over implicit:** Flag missing content even if implicitly addressed
- **Conservative flagging:** When uncertain, flag for human review rather than passing

---

## 12. Integration with Workflow

### 12.1 When to Run

**Option 1: After Phase 4** (before human review)
- Validates Phases 2→3→4 pipeline
- Catches inconsistencies before polishing

**Option 2: After Phase 5** (before finalization)
- Full validation including contributions
- Final quality check before submission

**Option 3: After Revisions**
- Any time a phase is re-run or substantially edited
- Ensures revisions maintain consistency

### 12.2 Workflow Integration

```
Phase 4 → Cross-Phase Validation (Phase 6) →
  [If PASS] → Human Review → Phase 5 (or finalization)
  [If WARNINGS] → Review warnings → Decide to proceed or revise
  [If CRITICAL] → Fix issues → Re-run Phase → Re-validate
```

---

## 13. Example Invocation

> "Run cross-phase validation on Phases 2 through 4. Check that all synthesis themes appear in the outline and draft, and verify evidence strength consistency."

> "Validate the complete workflow from synthesis to contributions (Phases 2-6). I want to ensure no broken traceability chains before submission."

---

## 14. Intended Use

This skill supports:
- Multi-phase research writing workflows
- Quality assurance before manuscript submission
- Post-revision consistency checks
- Audit trails for systematic reviews
- Collaborative projects requiring internal coherence

---

## 15. Limitations

**This skill does NOT:**
- Judge argument quality or persuasiveness
- Check grammar, style, or formatting
- Validate against external sources
- Assess novelty or contribution significance
- Guarantee correctness of content

**This skill DOES:**
- Validate structural consistency across phases
- Ensure traceability chains are unbroken
- Flag missing or orphaned content
- Check alignment of evidence strength claims
- Identify scope creep or phase-skipping

---

**End of SKILL Definition**