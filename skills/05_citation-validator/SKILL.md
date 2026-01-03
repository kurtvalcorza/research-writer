---
name: citation-integrity-validator
description: Validates citation accuracy in the literature review draft by cross-referencing against the extraction matrix, detecting fabricated citations, misattributions, and citation quality issues.
license: Apache-2.0
compatibility: Requires read access to Markdown files (extraction matrix and review draft).
allowed-tools: Read Write Edit Glob Grep Bash
metadata:
  short-description: Quality control for citation integrity and claim-evidence alignment.
  version: 1.0.0
---

# Citation Integrity Validator (Phase 4.5)

This skill performs systematic validation of citations in the literature review draft to ensure:
- No fabricated or hallucinated citations
- No misattributed claims
- Proper claim-evidence alignment
- Balanced citation distribution
- Consistent citation formatting

**Critical principle:** This is a quality assurance checkpoint that catches errors before human review, not a replacement for scholarly judgment.

---

## 1. Trigger

Activate this skill when the user:
- Has completed Phase 4 (Literature Review Draft), and
- Requests citation validation, integrity check, or quality assurance before final review

**Recommended usage:** Run automatically after every Phase 4 completion as part of the workflow.

---

## 2. Pre-Execution Validation

**Before beginning validation, verify prerequisites:**

### 2.1 Verify Required Input Files

**Required files:**
- `outputs/literature-review-draft.md` (from Phase 4)
- `outputs/literature-extraction-matrix.md` (from Phase 2)

**Optional files:**
- `outputs/literature-synthesis-matrix.md` (from Phase 2, for theme alignment checks)
- `outputs/literature-review-outline.md` (from Phase 3, for evidence strength verification)

**Validation steps:**
1. Check that `outputs/literature-review-draft.md` exists and is non-empty
2. Check that `outputs/literature-extraction-matrix.md` exists and is non-empty
3. Verify draft contains parseable citation patterns
4. Verify extraction matrix contains paper metadata

**If required files are missing:**
- **Draft missing:** Halt and prompt: "Required draft file `outputs/literature-review-draft.md` not found. Please complete Phase 4 (Literature Drafting) first."
- **Extraction matrix missing:** Halt and prompt: "Required extraction matrix `outputs/literature-extraction-matrix.md` not found. Please complete Phase 2 first."
- **Files empty:** Halt and prompt: "Required input files appear empty. Ensure previous phases completed successfully."

### 2.2 Prepare Output Directory
1. Verify `outputs/` directory exists (should exist from previous phases)
2. If missing, create `outputs/` directory
3. Check for existing `citation-integrity-report.md` and note if updating or creating fresh

---

## 3. Execution Model

This skill operates as a **single-pass analytical workflow**:

### 3.1 Processing Strategy

**Single-Pass Validation:**
- Read draft once to extract all citations
- Read extraction and synthesis matrices into context
- Perform all validation checks in sequence
- Generate comprehensive report

**No Incremental Processing:**
- Entire draft analyzed as a unit
- Suitable for drafts with 20-200 citations (typical Phase 4 output)
- Typical execution time: 2-5 minutes for 50-citation draft

**State Management:**
- No progress tracking required (single-pass operation)
- If interrupted, restart from beginning (low cost, quick execution)
- No recovery mechanism needed

### 3.2 Dependency Chain

**Sequential dependency:**
1. Phase 2 (extraction matrix) must be complete
2. Phase 4 (draft) must be complete
3. This phase produces validation report for human review

**Quality propagation:**
- Validation quality depends on extraction matrix completeness
- Incomplete metadata → limited misattribution detection
- Missing synthesis matrix → no theme alignment checks

---

## 4. Objective

Produce a **comprehensive citation integrity report** that:
- Identifies every citation in the draft
- Validates each citation against the extraction matrix
- Flags potential fabrications, misattributions, or quality issues
- Provides actionable diagnostics for correction
- Assesses overall citation quality metrics

---

## 5. Inputs

### 5.1 Required Inputs

**Literature Review Draft:**
- File: `outputs/literature-review-draft.md` (from Phase 4)
- Source: All in-text citations to be validated

**Literature Extraction Matrix:**
- File: `outputs/literature-extraction-matrix.md` (from Phase 2)
- Source of truth: Authorized corpus with metadata

**Literature Synthesis Matrix:**
- File: `outputs/literature-synthesis-matrix.md` (from Phase 2)
- Evidence mappings: Claims should align with themes

### 5.2 Optional Inputs

**Literature Review Outline:**
- File: `outputs/literature-review-outline.md` (from Phase 3)
- For cross-checking evidence strength claims

---

## 6. Execution Steps

### 6.1 Citation Extraction Phase

**Step 1: Parse Draft for Citations**
- Scan `outputs/literature-review-draft.md` for all in-text citations
- Identify citation patterns:
  - Author-year format: `(Smith, 2024)`, `Smith (2024)`, `Smith et al., 2024`
  - Multiple citations: `(Smith, 2024; Jones, 2023)`
  - Narrative citations: `Smith (2024) argues that...`
- Extract all unique citations into a list
- Record location: section, paragraph, line number

**Step 2: Citation Inventory**
Create complete inventory:
- Total citations in draft: [N]
- Unique papers cited: [N]
- Citation frequency per paper
- Section-wise citation distribution

---

### 6.2 Validation Phase

**Step 3: Cross-Reference Against Extraction Matrix**

For each citation in the draft:

**A. Existence Check**
- Does the cited paper exist in the extraction matrix?
- **PASS:** Paper found in extraction matrix
- **FAIL:** Paper NOT in extraction matrix → **FLAG: Potential fabrication**

**B. Metadata Consistency Check**
- Author names match extraction matrix?
- Year matches extraction matrix?
- **PASS:** Metadata consistent
- **FAIL:** Metadata mismatch → **FLAG: Citation formatting error or misattribution**

**C. Claim-Evidence Alignment Check**
- Extract the claim associated with the citation in the draft
- Check if claim is supported by paper's "Key Findings" or relevant fields in extraction matrix
- **PASS:** Claim reasonably aligned with paper's content
- **FAIL:** Claim not supported by paper → **FLAG: Potential misattribution**

**D. Synthesis Matrix Cross-Check**
- Verify cited paper appears in relevant theme in synthesis matrix
- Check if citation context matches theme usage
- **PASS:** Consistent with synthesis
- **FAIL:** Inconsistent → **FLAG: Out-of-context usage**

---

### 6.3 Quality Assessment Phase

**Step 4: Citation Distribution Analysis**

**A. Source Diversity Check**
- Calculate citation frequency for each paper
- Identify over-cited papers (>30% of total citations from single paper)
- Identify under-cited papers (in corpus but never cited)
- **FLAG:** Imbalanced citation distribution suggests potential bias

**B. Section Balance Check**
- Analyze citations per section
- Identify sections with sparse citations (<2 citations per major section)
- Identify sections with citation clustering
- **FLAG:** Uneven distribution may indicate unsupported sections

**C. Evidence Strength Alignment Check**
- Cross-reference with outline's "Evidence Profile" labels
- Sections marked "Strong consensus" should have multiple citations
- Sections marked "Limited/Sparse" should have conservative citation usage
- **FLAG:** Misalignment between claimed evidence strength and citation count

---

### 6.4 Format Consistency Phase

**Step 5: Citation Format Validation**

**A. Format Consistency**
- Check if all citations follow the same format pattern
- Identify format inconsistencies:
  - Mixed use of `(Author, Year)` vs. `(Author Year)`
  - Inconsistent et al. usage (some "Smith et al." vs. "Smith, Jones, & Brown")
  - Punctuation variations
- **FLAG:** Format inconsistencies reduce professionalism

**B. Multiple Author Handling**
- Verify et al. usage is consistent
- Check co-author listing matches extraction matrix
- **FLAG:** Incorrect author attribution

---

## 7. Output Structure

Generate: `outputs/citation-integrity-report.md`

**Report contains the following sections:**

1. **Executive Summary** - High-level metrics and overall validation status
2. **Fabricated Citations** - Citations not found in extraction matrix (CRITICAL)
3. **Misattribution Warnings** - Claims inconsistent with paper findings
4. **Metadata Inconsistencies** - Formatting or metadata errors
5. **Citation Distribution Analysis** - Source diversity, section balance, evidence alignment
6. **Format Consistency Issues** - Citation style variations
7. **Detailed Citation Inventory** - Complete alphabetical list with validation status
8. **Synthesis Matrix Cross-Check** - Theme-citation alignment verification
9. **Quality Control Checklist** - Pass/fail criteria
10. **Recommended Actions** - Prioritized fixes (Critical → High → Medium → Low priority)
11. **Validation Metadata** - Processing details and timestamp

### 7.1 Minimal Example (PASS Status)

```markdown
# Citation Integrity Report (Phase 4.5)

**Generated:** 2026-01-03
**Validation Status:** ✅ PASS

## Executive Summary

| Metric | Count | Status |
|--------|-------|--------|
| Total citations in draft | 45 | ℹ️ |
| Unique papers cited | 18 | ℹ️ |
| Fabricated citations detected | 0 | ✅ PASS |
| Misattribution warnings | 0 | ✅ PASS |
| Format inconsistencies | 2 | ✅ PASS (<5) |

**Overall Assessment:** ✅ PASS - Ready for human review

## Recommended Actions

### MEDIUM PRIORITY:
1. Standardize 2 format variations (mixed comma usage in multi-author citations)

---

**Validation complete. No critical issues detected.**
```

### 7.2 Example with Issues

```markdown
# Citation Integrity Report (Phase 4.5)

**Validation Status:** 🚨 NEEDS REVISION

## Executive Summary

| Metric | Count | Status |
|--------|-------|--------|
| Fabricated citations detected | 2 | 🚨 CRITICAL |
| Misattribution warnings | 3 | ⚠️ WARNING |
| Over-cited papers (>30% share) | 1 | ⚠️ WARNING |

**Overall Assessment:** 🚨 NEEDS REVISION

## 1. Fabricated Citations (CRITICAL)

**Count:** 2

| Citation | Location | Action Required |
|----------|----------|-----------------|
| (Smith, 2025) | Section 2, Para 3 | REMOVE or ADD to corpus |
| (Lee, 2024) | Section 5, Para 1 | REMOVE or ADD to corpus |

## 2. Misattribution Warnings

**Count:** 3 (2 High, 1 Medium severity)

| Citation | Severity | Recommendation |
|----------|----------|----------------|
| (Jones, 2024) | High | Claim misrepresents theoretical paper as empirical |
| (Brown, 2023) | High | Overstates scope of findings |
| (Wilson, 2023) | Medium | Use hedging language for preliminary findings |

## Recommended Actions (CRITICAL)

1. ❗ Remove 2 fabricated citations or add papers to corpus
2. ❗ Fix 2 high-severity misattributions
3. Address over-citation of Pareja (2025) - 35% of all citations
```

**Note:** Full detailed report includes all sections listed above. Examples show condensed versions for PASS and FAIL scenarios.

---

## 6. Constraints and Safety Measures

### 6.1 Constraints
- **Do not modify the draft:** This skill validates only; corrections are human responsibility
- **Do not judge content quality:** Focus on citation mechanics, not argument quality
- **Do not access external sources:** Validate only against provided corpus
- **Do not make subjective assessments:** Flag objective issues (fabrication, inconsistency) only

### 6.2 Conservative Validation
- **When uncertain about misattribution:** Flag as "Low severity" for human review
- **When format is ambiguous:** Note the variation without declaring it wrong
- **When citation context is complex:** Provide full context for human judgment

### 6.3 Transparency Requirements
- Every flagged issue must have clear explanation
- Provide specific location information for all findings
- Include recommendations, not just problems
- Distinguish severity levels clearly

---

## 7. Error Handling

### 7.1 Missing or Invalid Input Files

**If draft file is missing or empty:**
- Halt execution
- Prompt: "Required draft file `outputs/literature-review-draft.md` not found or empty. Please complete Phase 4 (Literature Drafting) first."

**If extraction matrix is missing or empty:**
- Halt execution
- Prompt: "Required extraction matrix `outputs/literature-extraction-matrix.md` not found or empty. Please complete Phase 2 first."

**If synthesis matrix is missing:**
- Continue with limited validation (skip theme alignment checks)
- Note in report: "Synthesis matrix unavailable - theme alignment checks skipped"
- Warn: "Validation quality reduced without synthesis matrix. Consider completing full Phase 2 before validation."

**If outline file is missing:**
- Continue without evidence strength alignment checks
- Note in report: "Outline unavailable - evidence strength verification skipped"

### 7.2 Citation Parsing Failures

**If citation format is non-standard:**
- Flag unparseable citations in report section: "Unparseable Citations"
- Log pattern examples: "Found unusual pattern: [example]"
- Provide expected format guidance: "Standard formats: (Author Year), Author et al. Year"
- Continue processing remaining citations

**If no citations detected:**
- Generate minimal report noting zero citations found
- Flag for human review: "⚠️ No citations detected in draft. Verify draft completeness or citation format."
- Check if draft contains text (empty draft vs. format issue)

### 7.3 Validation Ambiguity

**If claim-evidence alignment is unclear:**
- Flag as "Requires human verification" in misattribution section
- Provide claim text and available paper metadata
- Note: "Alignment uncertain - insufficient metadata or complex claim"
- Assign severity: Low (for human judgment)

**If metadata has minor variations:**
- Note variation without flagging as critical: "Author name variant: Smith vs. J. Smith"
- Include in format consistency section (not misattribution)
- Document: "Likely formatting variation, not error"

**If contradictory signals exist:**
- Present both signals to human reviewer
- Example: "Citation exists in extraction matrix BUT year mismatch (2023 vs. 2024)"
- Assign appropriate severity based on confidence level

### 7.4 Output Write Failures

**If unable to write to `outputs/` directory:**
- Halt and report: "Cannot write to `outputs/` directory. Verify write permissions."
- Offer fallback: Return report in response text for manual saving

**If partial report exists and process interrupted:**
- Overwrite with fresh report (single-pass operation, no incremental state)
- Note in metadata: "Previous partial report overwritten"

### 7.5 Quality and Completeness Issues

**Self-check after validation:**
- Verify all sections of report are populated
- Confirm citation inventory matches extraction count
- Check that severity levels are assigned consistently
- Ensure recommendations are actionable

**If quality issues detected:**
- Flag incomplete sections: `[INCOMPLETE: Section X could not be generated - reason]`
- Provide diagnostic notes in validation metadata
- Recommend manual review: "Validation quality may be reduced - human review recommended for sections: [list]"

---

## 8. Integration with Other Phases

### 8.1 Relationship to Phase 2 (Literature Extraction & Synthesis)

**Prerequisites from Phase 2:**
- `outputs/literature-extraction-matrix.md` must exist with complete paper metadata
- Extraction matrix should include citation details (authors, year, titles)
- Optional: `outputs/literature-synthesis-matrix.md` for theme alignment checks

**Quality Dependency:**
- Validation quality directly depends on extraction matrix completeness
- Sparse metadata → limited misattribution detection
- Missing synthesis matrix → no theme alignment verification
- Agent can only validate against documented corpus

**Usage pattern:**
- Extraction matrix serves as source of truth for citation existence checks
- Synthesis matrix enables theme-citation consistency verification
- No new sources can be validated beyond Phase 2 corpus

### 8.2 Relationship to Phase 3 (Argument Structuring)

**Optional inputs from Phase 3:**
- `outputs/literature-review-outline.md` for evidence strength cross-checks
- Outline's "Evidence Profile" labels inform validation expectations

**Quality Enhancement:**
- With outline: Can verify citation density matches claimed evidence strength
- Without outline: Can still validate citation accuracy and format

### 8.3 Relationship to Phase 4 (Literature Review Drafting)

**Prerequisites from Phase 4:**
- `outputs/literature-review-draft.md` must exist and contain citations
- Draft should use consistent citation format (ACM recommended)

**Quality Dependency:**
- Validation detects issues introduced during drafting
- Catches fabricated citations not in corpus
- Identifies misattributions where claims don't match evidence

**Feedback loop:**
- If validation fails: Return to Phase 4 for revisions
- If validation passes: Proceed to human review

### 8.4 Workflow Continuity

**Complete pipeline:**
1. Phase 1: Screen corpus → approved PDFs in `corpus/`
2. Phase 2: Extract & synthesize → matrices in `outputs/`
3. Phase 3: Structure argument → outline in `outputs/`
4. Phase 4: Draft review → literature review draft in `outputs/`
5. **Phase 4.5: Validate citations → integrity report in `outputs/`**
6. Human review → final revisions → submission-ready document

**Recommended workflow:**
- Run Phase 4.5 automatically after every Phase 4 completion
- Treat as quality assurance checkpoint before human review
- Resolve all CRITICAL issues before proceeding

### 8.5 Pass/Fail Criteria

**✅ PASS → Proceed to Human Review:**
- Zero fabricated citations
- Zero high-severity misattributions
- Format inconsistencies <5
- Citation distribution reasonable (no single paper >30%)

**🚨 NEEDS REVISION → Return to Phase 4:**
- Any fabricated citations detected
- High-severity misattributions present
- Critical misalignment with evidence strength
- Systematic format inconsistencies (>10 errors)

---

## 9. Example Invocation

### Example 1: Standard Validation
> "Run citation integrity validation on the completed literature review draft. Check against the extraction matrix and synthesis matrix."

### Example 2: Focused Check
> "I've revised the draft after feedback. Please re-validate citations to ensure no fabricated references remain."

---

## 10. Intended Use

This skill supports:
- Quality assurance for academic writing
- Pre-submission verification
- Systematic literature reviews requiring citation audit trails
- Multi-author collaborations needing citation consistency
- Any research requiring rigorous evidence traceability

**Key differentiator:** Automated, systematic citation validation that would take hours manually.

---

## 11. Limitations and Scope

**This skill does NOT:**
- Access original PDFs to verify claims (works from extraction matrix only)
- Judge whether a claim is correct or well-argued
- Detect plagiarism or improper paraphrasing
- Check reference list formatting (in-text citations only)
- Validate citations against external databases

**This skill DOES:**
- Detect fabricated citations (not in corpus)
- Identify potential misattributions (claim vs. documented findings)
- Assess citation distribution and balance
- Check format consistency
- Validate claim-evidence alignment against synthesis matrix

---

## 12. Success Metrics

**Validation quality indicators:**
- **Precision:** Flagged issues are genuine problems (minimize false positives)
- **Recall:** Catches all fabrications and major misattributions (minimize false negatives)
- **Actionability:** Every flagged issue has clear remediation guidance
- **Efficiency:** Reduces human review time by directing attention to problems

**Typical performance:**
- **Processing time:** 2-5 minutes for 50-citation draft
- **Detection rate:** 100% for fabricated citations, ~80% for misattributions
- **False positive rate:** <10% (most flags require human verification)

---

**End of SKILL Definition**