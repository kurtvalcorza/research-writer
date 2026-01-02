---
name: citation-integrity-validator
description: Validates citation accuracy in the literature review draft by cross-referencing against the extraction matrix, detecting fabricated citations, misattributions, and citation quality issues.
license: Apache-2.0
compatibility: Requires read access to Markdown files (extraction matrix and review draft).
allowed-tools: read_resource write_file
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

## 2. Objective

Produce a **comprehensive citation integrity report** that:
- Identifies every citation in the draft
- Validates each citation against the extraction matrix
- Flags potential fabrications, misattributions, or quality issues
- Provides actionable diagnostics for correction
- Assesses overall citation quality metrics

---

## 3. Inputs

### 3.1 Required Inputs

**Literature Review Draft:**
- File: `outputs/literature-review-draft.md` (from Phase 4)
- Source: All in-text citations to be validated

**Literature Extraction Matrix:**
- File: `outputs/literature-extraction-matrix.md` (from Phase 2)
- Source of truth: Authorized corpus with metadata

**Literature Synthesis Matrix:**
- File: `outputs/literature-synthesis-matrix.md` (from Phase 2)
- Evidence mappings: Claims should align with themes

### 3.2 Optional Inputs

**Literature Review Outline:**
- File: `outputs/literature-review-outline.md` (from Phase 3)
- For cross-checking evidence strength claims

---

## 4. Execution Steps

### 4.1 Citation Extraction Phase

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

### 4.2 Validation Phase

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

### 4.3 Quality Assessment Phase

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

### 4.4 Format Consistency Phase

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

## 5. Output Structure

Generate: `outputs/citation-integrity-report.md`

```markdown
# Citation Integrity Report (Phase 4.5)

**Generated:** [date]
**Draft Analyzed:** literature-review-draft.md
**Reference Corpus:** literature-extraction-matrix.md
**Validation Status:** [PASS / WARNINGS / CRITICAL ISSUES]

---

## Executive Summary

| Metric | Count | Status |
|--------|-------|--------|
| Total citations in draft | X | ℹ️ |
| Unique papers cited | X | ℹ️ |
| Papers in corpus not cited | X | ⚠️ if >20% |
| Fabricated citations detected | X | 🚨 if >0 |
| Misattribution warnings | X | ⚠️ if >0 |
| Format inconsistencies | X | ⚠️ if >5 |
| Over-cited papers (>30% share) | X | ⚠️ if >0 |

**Overall Assessment:** [PASS / NEEDS ATTENTION / CRITICAL ISSUES]

---

## 1. Fabricated Citations (CRITICAL)

**Definition:** Citations appearing in draft but NOT in extraction matrix.

**Count:** [X]

**Status:** [🚨 CRITICAL if >0 / ✅ PASS if 0]

### Detected Fabrications:

| Citation | Location | Context | Action Required |
|----------|----------|---------|-----------------|
| (Smith, 2025) | Section 2, Para 3 | "Smith (2025) argues that AI adoption..." | REMOVE or ADD paper to corpus |
| ... | ... | ... | ... |

**Explanation:**
These citations reference papers that are NOT in your approved corpus (extraction matrix). This indicates:
- Possible hallucination by the drafting agent
- Unintentional reference to papers outside the screening scope
- Manual additions that weren't processed through Phase 1-2

**Action Required:**
1. For each fabricated citation: Decide whether to:
   - **REMOVE** the citation and rephrase the claim (if paper is out of scope)
   - **ADD** the paper to corpus by processing through Phase 1-2 (if relevant)
2. Re-run Phase 4 after corpus changes

---

## 2. Misattribution Warnings

**Definition:** Citations where the claim appears inconsistent with the paper's documented findings.

**Count:** [X]

**Status:** [⚠️ WARNING if >0 / ✅ PASS if 0]

### Potential Misattributions:

| Citation | Claim in Draft | Finding in Extraction Matrix | Severity | Recommendation |
|----------|----------------|------------------------------|----------|----------------|
| (Jones, 2024) | "Jones (2024) found strong evidence of AI adoption barriers" | Key Findings: "Preliminary survey of 20 SMEs" | Medium | Claim overstates certainty; use hedging language |
| (Brown, 2023) | "Brown (2023) demonstrates cost savings" | Key Findings: "Conceptual framework proposed" | High | Misattribution - paper is theoretical, not empirical |
| ... | ... | ... | ... | ... |

**Severity Levels:**
- **High:** Claim fundamentally misrepresents paper's content or findings
- **Medium:** Claim overstates certainty or scope of paper's findings
- **Low:** Minor interpretation differences

**Action Required:**
1. Review each flagged citation in context
2. Verify claim against original paper (if accessible)
3. Adjust claim language to match evidence strength
4. Consider replacing citation if misattribution is severe

---

## 3. Metadata Inconsistencies

**Definition:** Citations with formatting or metadata errors.

**Count:** [X]

**Status:** [⚠️ if >0 / ✅ PASS if 0]

### Detected Inconsistencies:

| Citation in Draft | Correct Format (from Matrix) | Location | Issue Type |
|-------------------|------------------------------|----------|------------|
| (Smith, 2023) | (Smith, 2024) | Section 1 | Wrong year |
| (Johnson et al., 2024) | (Johnson & Lee, 2024) | Section 3 | Should be &, not et al. (only 2 authors) |
| ... | ... | ... | ... |

**Action Required:**
1. Update citations to match extraction matrix metadata
2. Ensure consistency with chosen citation style

---

## 4. Citation Distribution Analysis

### 4.1 Source Diversity

**Papers by Citation Frequency:**

| Paper | Citation Count | % of Total | Assessment |
|-------|----------------|------------|------------|
| Pareja (2025) | 25 | 35% | 🚨 OVER-CITED (>30%) |
| Campued et al. (2023) | 20 | 28% | ⚠️ High usage |
| Jala et al. (2024) | 15 | 21% | ✅ Balanced |
| ... | ... | ... | ... |

**Papers in Corpus NOT Cited:**

| Paper | Status | Recommendation |
|-------|--------|----------------|
| Chen (2023) | Not cited | Review if relevant themes in synthesis matrix |
| ... | ... | ... |

**Over-Citation Analysis:**
- **Issue:** Pareja (2025) accounts for 35% of all citations
- **Risk:** May indicate over-reliance on single source or limited synthesis
- **Recommendation:** Review draft to ensure claims are supported by multiple sources where possible

**Under-Citation Analysis:**
- **Papers never cited:** [X]
- **Potential issue:** Papers in corpus but unused may indicate:
  - Screening errors (should have been excluded)
  - Synthesis gaps (relevant papers overlooked)
  - Draft gaps (missing themes)

---

### 4.2 Section-Wise Distribution

| Section | Citation Count | Citations per 100 words | Assessment |
|---------|----------------|-------------------------|------------|
| Section 1: Current State | 15 | 8.5 | ✅ Well-supported |
| Section 2: Infrastructure | 8 | 4.2 | ⚠️ Moderately supported |
| Section 3: Human Capital | 3 | 1.8 | 🚨 Under-cited (<2 per 100 words) |
| ... | ... | ... | ... |

**Under-Cited Sections:**
- Section 3: Human Capital has only 3 citations across 450 words
- **Risk:** Claims may appear unsupported
- **Recommendation:** Add citations from synthesis matrix or acknowledge limited evidence

---

### 4.3 Evidence Strength Alignment

**Cross-Check with Outline's Evidence Profiles:**

| Section | Outline Evidence Profile | Citation Count | Alignment Status |
|---------|--------------------------|----------------|------------------|
| Section 1 | "Strong consensus (all 3 papers)" | 15 citations | ✅ ALIGNED |
| Section 3 | "Strong consensus (all 3 papers)" | 3 citations | 🚨 MISALIGNED - should have more citations |
| Section 4 | "Mixed/contested" | 12 citations | ✅ ALIGNED |
| Section 6 | "Emerging/limited" | 8 citations | ⚠️ May overstate - limited evidence should have fewer citations |

**Action Required:**
- Section 3: Add more citations to match "strong consensus" claim
- Section 6: Consider reducing citation density or adding hedging language

---

## 5. Format Consistency Issues

**Count:** [X]

**Status:** [⚠️ if >5 / ✅ PASS if <5]

### Format Variations Detected:

| Issue Type | Examples | Count | Recommendation |
|------------|----------|-------|----------------|
| Inconsistent year format | `(Smith, 2024)` vs `(Smith 2024)` | 5 | Standardize to (Author, Year) |
| Et al. inconsistency | `Smith et al.` vs `Smith, Jones, & Lee` for 3+ authors | 3 | Use et al. for 3+ authors |
| Punctuation variance | `(Smith, 2024; Jones, 2023)` vs `(Smith 2024, Jones 2023)` | 2 | Standardize separator |

**Action Required:**
1. Choose a consistent citation style (APA, Chicago, etc.)
2. Apply format rules uniformly across entire draft
3. Consider using citation management tool for consistency

---

## 6. Detailed Citation Inventory

### All Citations in Draft (Alphabetical)

| Citation | Frequency | Locations | Validation Status |
|----------|-----------|-----------|-------------------|
| Campued et al. (2023) | 20 | Sections 1, 3, 4, 5 | ✅ Valid |
| Jala et al. (2024) | 15 | Sections 2, 3, 5, 6 | ✅ Valid |
| Pareja (2025) | 25 | All sections | ✅ Valid (but over-cited) |
| Smith (2025) | 1 | Section 2 | 🚨 FABRICATED - not in corpus |
| ... | ... | ... | ... |

---

## 7. Synthesis Matrix Cross-Check

**Theme-Citation Alignment:**

| Theme (from Synthesis Matrix) | Expected Citations | Actual Citations in Draft | Status |
|--------------------------------|-------------------|---------------------------|--------|
| AI Readiness and Awareness | All 3 papers | Pareja (2025), Campued (2023), Jala (2024) | ✅ Complete |
| Skills and Workforce Development | All 3 papers | Campued (2023), Jala (2024) | ⚠️ Missing Pareja (2025) |
| Infrastructure Constraints | Pareja, Jala | Pareja (2025), Jala (2024) | ✅ Complete |
| ... | ... | ... | ... |

**Missing Theme-Citation Links:**
- Theme "Skills and Workforce Development" should cite Pareja (2025) based on synthesis matrix
- **Recommendation:** Review if Pareja's implicit discussion of skills should be cited

---

## 8. Quality Control Checklist

Before proceeding to human review, verify:

- [ ] **Zero fabricated citations** (all citations exist in extraction matrix)
- [ ] **No high-severity misattributions** (claims match paper findings)
- [ ] **Balanced source distribution** (no single paper >30% of citations)
- [ ] **All corpus papers considered** (papers not cited have been reviewed for relevance)
- [ ] **Section citations adequate** (no section <2 citations per 100 words without justification)
- [ ] **Evidence strength aligned** (citation density matches outline's evidence profile)
- [ ] **Format consistency** (<5 format variations)
- [ ] **Theme-citation alignment** (synthesis matrix themes properly cited)

**Overall Validation Status:** [PASS / NEEDS REVISION]

---

## 9. Recommended Actions (Prioritized)

### CRITICAL (Must Fix Before Proceeding):
1. Remove or resolve all fabricated citations
2. Fix high-severity misattributions

### HIGH PRIORITY (Strongly Recommended):
3. Address over-citation issues (>30% from single source)
4. Add citations to under-cited sections
5. Align evidence strength claims with citation density

### MEDIUM PRIORITY (Improve Quality):
6. Resolve metadata inconsistencies
7. Fix format variations
8. Consider citing unused corpus papers if relevant

### LOW PRIORITY (Polish):
9. Balance citation distribution for better synthesis
10. Review et al. usage for consistency

---

## 10. Validation Metadata

**Validation performed by:** Citation Integrity Validator v1.0.0
**Extraction matrix source:** literature-extraction-matrix.md
**Synthesis matrix source:** literature-synthesis-matrix.md
**Draft analyzed:** literature-review-draft.md (Phase 4 output)
**Total citations validated:** [N]
**Validation timestamp:** [datetime]

---

## Appendix A: Citation-by-Citation Detail

[Detailed line-by-line validation results for full transparency]

**Format:**
```
Citation: (Author, Year)
Location: Section X, Paragraph Y, Line Z
Context: "Full sentence containing citation..."
Validation checks:
  ✅ Exists in extraction matrix
  ✅ Metadata consistent
  ✅ Claim-evidence aligned
  ✅ Theme-appropriate usage
Overall: PASS
```

[Repeat for all citations]

---

**End of Citation Integrity Report**
```

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

### 7.1 Missing Input Files
- If extraction matrix is not found: Stop and report error
- If draft is not found: Stop and report error
- If synthesis matrix is missing: Proceed with limited validation (skip theme alignment)

### 7.2 Unparseable Citations
- If citation format is non-standard: Flag for human review
- Log all unparseable patterns for improvement
- Provide examples of expected format

### 7.3 Ambiguous Validation Results
- If claim-evidence alignment is unclear: Mark as "Requires human verification"
- If metadata has minor variations: Note but don't flag as critical
- Document ambiguity clearly

---

## 8. Integration with Workflow

### 8.1 When to Run
**Recommended:** Automatically after Phase 4 completion, before human review

**Workflow position:**
```
Phase 4 (Draft) → Phase 4.5 (Citation Validation) → Human Review → Phase 6
```

### 8.2 Outputs Feed Into
- **Human review checkpoint:** Report guides reviewer attention to problem areas
- **Phase 4 revision:** If critical issues found, revise draft before proceeding
- **Phase 6:** Clean draft with validated citations improves contribution framing

### 8.3 Pass/Fail Criteria
**PASS → Proceed to Human Review:**
- Zero fabricated citations
- Zero high-severity misattributions
- Format inconsistencies <5

**NEEDS REVISION → Return to Phase 4:**
- Any fabricated citations detected
- High-severity misattributions present
- Critical misalignment with evidence strength

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