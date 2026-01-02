---
name: cross-phase-validator
description: Validates internal consistency across multiple phase outputs to ensure traceability, alignment, and coherence throughout the research writing workflow.
license: Apache-2.0
compatibility: Requires read access to multiple Markdown output files from Phases 2-6.
allowed-tools: read_resource write_file
metadata:
  short-description: Quality control for cross-phase consistency and traceability.
  version: 1.0.0
---

# Cross-Phase Validation Agent (Phase 7)

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
- After Phase 6 (before finalizing manuscript)
- Any time significant revisions are made to intermediate phases

---

## 2. Objective

Produce a **comprehensive cross-phase validation report** that:
- Validates forward traceability (corpus → synthesis → outline → draft → contributions)
- Validates backward traceability (claims → synthesis → corpus)
- Identifies orphaned content (themes in synthesis but not in outline; outline sections without draft)
- Flags inconsistencies in evidence strength characterizations
- Assesses overall workflow integrity

---

## 3. Inputs

### 3.1 Required Inputs (Minimum)

**For Phase 2→3→4 validation:**
- `outputs/literature-synthesis-matrix.md` (Phase 2)
- `outputs/literature-review-outline.md` (Phase 3)
- `outputs/literature-review-draft.md` (Phase 4)

### 3.2 Optional Inputs (Extended Validation)

- `outputs/literature-extraction-matrix.md` (Phase 2) - for corpus coverage validation
- `outputs/research-contributions-implications.md` (Phase 6) - for contribution-evidence alignment
- `outputs/citation-integrity-report.md` (Phase 4.5) - for citation validation cross-check

---

## 4. Validation Dimensions

### 4.1 Phase 2→3 Validation: Synthesis to Outline

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

### 4.2 Phase 3→4 Validation: Outline to Draft

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

### 4.3 Phase 2→4 Validation: Synthesis to Draft (Direct)

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

### 4.4 Phase 4→6 Validation: Draft to Contributions

**Objective:** Ensure contribution claims are grounded in draft evidence.

**Checks:**

1. **Contribution-Gap Alignment**
   - Contributions in Phase 6 correspond to gaps identified in synthesis/outline/draft?
   - **PASS:** Contributions address documented gaps
   - **WARNING:** Contribution claims not tied to identified gaps

2. **Evidence Boundary Respect**
   - Contributions in Phase 6 respect limitations acknowledged in draft?
   - **PASS:** No overclaiming
   - **WARNING:** Contribution scope exceeds evidence boundaries

3. **Future Research-Gap Mapping**
   - Future research directions in Phase 6 trace to gaps in synthesis?
   - **PASS:** Future directions target documented gaps
   - **WARNING:** Future directions address issues not identified as gaps

**Validation table:**

| Contribution Claim (Phase 6) | Grounding in Draft | Gap Documented? | Boundary Respected? | Status |
|------------------------------|--------------------|-----------------|--------------------|--------|
| "Multi-level framework clarification" | Section 1 discussion | ✅ Yes (synthesis) | ✅ Yes | ✅ VALID |
| "Comprehensive gap mapping" | Sections 1-6 gaps | ✅ Yes (outline) | ✅ Yes | ✅ VALID |
| "First longitudinal study of AI adoption" | Not mentioned | ❌ No | ❌ No - overclaim | 🚨 ERROR |

---

### 4.5 Complete Traceability Chain Validation

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

## 5. Output Structure

Generate: `outputs/cross-phase-validation-report.md`

```markdown
# Cross-Phase Validation Report

**Generated:** [date]
**Phases Validated:** 2 → 3 → 4 [→ 6 if available]
**Validation Scope:** [Minimum / Extended]
**Overall Status:** [PASS / WARNINGS / CRITICAL ISSUES]

---

## Executive Summary

| Validation Dimension | Status | Issues Found | Critical | Warnings |
|---------------------|--------|--------------|----------|----------|
| Phase 2→3 (Synthesis to Outline) | [status] | X | X | X |
| Phase 3→4 (Outline to Draft) | [status] | X | X | X |
| Phase 2→4 (Synthesis to Draft Direct) | [status] | X | X | X |
| Phase 4→6 (Draft to Contributions) | [status] | X | X | X |
| End-to-End Traceability | [status] | X | X | X |

**Overall Assessment:** [PASS / NEEDS ATTENTION / CRITICAL ISSUES]

**Proceed to next phase:** [YES / AFTER REVISIONS]

---

## 1. Phase 2→3 Validation: Synthesis to Outline

### 1.1 Theme Coverage Analysis

**Total themes in synthesis matrix:** [N]
**Themes represented in outline:** [N] ([X]%)
**Missing themes:** [N]

**Status:** [✅ COMPLETE / ⚠️ GAPS DETECTED / 🚨 MAJOR GAPS]

#### Missing Themes

| Theme | Papers Addressing | Why Missing? | Severity | Recommendation |
|-------|-------------------|--------------|----------|----------------|
| Policy Frameworks | 2 papers | Not outlined | Medium | Add to Section 4 or document exclusion |
| ... | ... | ... | ... | ... |

**Action Required:**
- Review missing themes for relevance
- Add to outline or document why excluded
- If excluded, ensure rationale is sound

---

### 1.2 Evidence Strength Consistency

**Total outline sections checked:** [N]
**Aligned with synthesis:** [N] ([X]%)
**Misaligned:** [N]

**Status:** [✅ ALIGNED / ⚠️ MINOR MISALIGNMENT / 🚨 MAJOR MISALIGNMENT]

#### Misalignments Detected

| Section | Synthesis Evidence | Outline Label | Issue | Recommendation |
|---------|-------------------|---------------|-------|----------------|
| Section 2 | 2 papers | "Strong consensus" | Overstated | Revise to "Limited" or "Mixed" |
| Section 5 | All 3 papers | "Emerging/limited" | Understated | Revise to "Strong consensus" |

**Action Required:**
- Align evidence strength labels with actual synthesis documentation
- Re-run Phase 3 if major misalignment detected

---

### 1.3 Gap Representation

**Gaps in synthesis matrix:** [N]
**Gaps in outline:** [N]
**Missing gap coverage:** [N]

**Status:** [✅ COMPLETE / ⚠️ PARTIAL / 🚨 GAPS LOST]

#### Gaps Not Carried Forward

| Gap (from Synthesis) | Present in Outline? | Section | Recommendation |
|----------------------|---------------------|---------|----------------|
| "Longitudinal studies absent" | ❌ No | N/A | Add to "Consolidated Gaps" |
| "Ethics frameworks underdeveloped" | ✅ Yes | Section 4 | ✅ Carried forward |

---

## 2. Phase 3→4 Validation: Outline to Draft

### 2.1 Section Completeness

**Outline sections:** [N]
**Draft sections:** [N]
**1:1 mapping:** [YES / NO]

**Status:** [✅ COMPLETE / ⚠️ MISSING SECTIONS / 🚨 SCOPE CREEP]

#### Section Mapping Analysis

| Outline Section | Draft Section | Match Quality | Status |
|-----------------|---------------|---------------|--------|
| Section 1: Current State | Section 1: Current State of AI Adoption | ✅ Exact | ✅ PASS |
| Section 2: Infrastructure | Section 2: Technical and Infrastructure Prerequisites | ✅ Equivalent | ✅ PASS |
| Section 3: Human Capital | ❌ NOT FOUND | N/A | 🚨 MISSING |

**Missing Sections:**
- Section 3: Human Capital [CRITICAL - major outline section not drafted]

**Unauthorized Sections (not in outline):**
- [Draft section name] [WARNING - scope creep or phase skipping]

**Action Required:**
- Draft all missing outline sections
- Review unauthorized sections: integrate into outline or remove

---

### 2.2 Core Claim Alignment

**Sections with core claims:** [N]
**Claims aligned:** [N] ([X]%)
**Claims misaligned:** [N]

**Status:** [✅ ALIGNED / ⚠️ MINOR DRIFT / 🚨 MAJOR DRIFT]

#### Claim Alignment Analysis

| Section | Outline Core Claim | Draft Opening Claim | Alignment | Status |
|---------|-------------------|---------------------|-----------|--------|
| Section 1 | "Philippines in foundational stage..." | "Philippines finds itself in foundational phase..." | ✅ Match | ✅ PASS |
| Section 2 | "Infrastructure at multiple levels..." | "Infrastructure includes both hardware and software..." | ⚠️ Partial | ⚠️ WARNING |

**Partial Matches:**
- Section 2: Draft emphasizes hardware/software distinction not central to outline claim

**Action Required:**
- Review partial matches to ensure draft reflects approved argument
- Revise draft or update outline if argument evolution is justified

---

### 2.3 Evidence Hedging Appropriateness

**Sections checked:** [N]
**Appropriate hedging:** [N] ([X]%)
**Inappropriate confidence:** [N]

**Status:** [✅ APPROPRIATE / ⚠️ MINOR ISSUES / 🚨 OVERCLAIMING]

#### Hedging Issues Detected

| Section | Evidence Strength (Outline) | Draft Language | Issue | Example | Recommendation |
|---------|----------------------------|----------------|-------|---------|----------------|
| Section 6 | "Emerging/limited" | Definitive | Too confident | "AI will drive economic growth" | Add hedging: "AI may contribute to economic growth" |
| Section 3 | "Strong consensus" | Overly cautious | Understated | "Some studies suggest skills gaps" | Strengthen: "All studies document critical skills gaps" |

**Action Required:**
- Adjust draft language to match evidence strength
- Sections with limited evidence must use cautious phrasing

---

## 3. Phase 2→4 Validation: Synthesis to Draft (Direct)

### 3.1 Theme Coverage in Draft

**Themes in synthesis:** [N]
**Themes discussed in draft:** [N] ([X]%)
**Orphaned themes:** [N]

**Status:** [✅ COMPLETE / ⚠️ PARTIAL / 🚨 MAJOR GAPS]

#### Orphaned Themes (in synthesis but not draft)

| Theme | Papers | Why Not in Draft? | Severity | Recommendation |
|-------|--------|-------------------|----------|----------------|
| Digital Transformation Maturity | 2 papers | Integrated into Section 1 | Low | ✅ Acceptable if integrated |
| Economic Impact | 2 papers | ❌ Not addressed | High | Add to Section 6 or explain exclusion |

---

### 3.2 Paper Citation Coverage

**Papers in extraction matrix:** [N]
**Papers cited in draft:** [N] ([X]%)
**Uncited papers:** [N]

**Status:** [✅ COMPLETE / ⚠️ UNDERUTILIZED / 🚨 CORPUS GAPS]

#### Uncited Papers

| Paper | Contribution to Synthesis | Expected Citation Location | Why Not Cited? | Recommendation |
|-------|---------------------------|---------------------------|----------------|----------------|
| Chen (2023) | [theme] | Section X | Not in corpus? | Verify corpus inclusion |
| Lee (2024) | Minor contribution | N/A | Low relevance | ✅ Acceptable |

**Papers central to synthesis but under-cited:**
- [Paper name]: Cited only [N] times despite addressing [X] major themes

---

## 4. Phase 4→6 Validation: Draft to Contributions

**Note:** This section requires `outputs/research-contributions-implications.md` (Phase 6 output).

### 4.1 Contribution Grounding

**Contributions claimed:** [N]
**Grounded in draft:** [N] ([X]%)
**Ungrounded claims:** [N]

**Status:** [✅ GROUNDED / ⚠️ WEAK GROUNDING / 🚨 OVERCLAIMING]

#### Contribution Grounding Analysis

| Contribution | Evidence in Draft | Gap Documented? | Status |
|--------------|-------------------|-----------------|--------|
| "Multi-level framework" | ✅ Section 1 extensively discusses levels | ✅ Yes | ✅ VALID |
| "First comprehensive synthesis" | ⚠️ Draft mentions synthesis but doesn't claim novelty | ❌ No | ⚠️ WARNING - verify claim |
| "Longitudinal insights" | ❌ No longitudinal data in draft | ❌ No | 🚨 OVERCLAIM |

**Action Required:**
- Remove or qualify ungrounded contribution claims
- Ensure Phase 6 contributions match Phase 4 evidence

---

### 4.2 Boundary Respect

**Limitations in draft:** [N]
**Contributions respecting limits:** [N] ([X]%)
**Boundary violations:** [N]

**Status:** [✅ RESPECTED / ⚠️ MINOR VIOLATIONS / 🚨 MAJOR VIOLATIONS]

#### Boundary Violations

| Contribution/Implication | Limitation in Draft | Violation | Severity | Recommendation |
|--------------------------|---------------------|-----------|----------|----------------|
| "Generalizable to all developing countries" | "Specific to Philippines" | Overgeneralization | High | Qualify scope to Philippines or similar contexts |

---

### 4.3 Future Research Alignment

**Future directions in Phase 6:** [N]
**Tied to documented gaps:** [N] ([X]%)
**Ungrounded directions:** [N]

**Status:** [✅ ALIGNED / ⚠️ PARTIAL / 🚨 MISALIGNED]

#### Future Research Alignment

| Future Direction | Gap in Synthesis/Outline/Draft | Grounding Status |
|------------------|-------------------------------|------------------|
| "Longitudinal studies needed" | ✅ Gap noted in synthesis & outline | ✅ GROUNDED |
| "Experimental interventions" | ⚠️ Mentioned but not emphasized as gap | ⚠️ WEAK |
| "Cross-cultural comparisons" | ❌ Not identified as gap | 🚨 UNGROUNDED |

---

## 5. End-to-End Traceability Audit

**Sample claims traced:** [N]
**Complete traces:** [N] ([X]%)
**Broken traces:** [N]

**Status:** [✅ TRACEABLE / ⚠️ GAPS / 🚨 BROKEN CHAIN]

### Sample Trace 1

**Claim (Draft):** "Critical skill gaps emerge as the most urgent constraint"

**Trace:**
```
Draft (Section 3) → Outline (Section 3: Core Claim) →
Synthesis (Theme: Skills Development) →
Extraction (Campued: "skill gaps"; Jala: "shortage"; Pareja: implicit)
```

**Status:** ✅ COMPLETE TRACE

---

### Sample Trace 2

**Claim (Draft):** "AI adoption in Philippines mirrors global trends"

**Trace:**
```
Draft (Section 1) → Outline (???) → Synthesis (???) → Extraction (???)
```

**Status:** 🚨 BROKEN TRACE - claim not found in outline or synthesis

**Action Required:** Remove claim or add supporting evidence to synthesis

---

### Broken Traces Summary

| Claim | Location | Issue | Recommendation |
|-------|----------|-------|----------------|
| [Claim text] | Section X | Not in outline | Remove or add to outline first |
| [Claim text] | Section Y | Not in synthesis | Remove or synthesize evidence |

---

## 6. Consistency Metrics

### 6.1 Overall Consistency Score

**Calculated from:**
- Theme coverage completeness
- Section mapping accuracy
- Evidence strength alignment
- Citation coverage
- Traceability completeness

**Score:** [X]/100

**Interpretation:**
- 90-100: EXCELLENT - minimal issues
- 75-89: GOOD - minor revisions recommended
- 60-74: ACCEPTABLE - moderate revisions needed
- <60: POOR - substantial rework required

---

### 6.2 Issue Severity Distribution

| Severity | Count | % of Total |
|----------|-------|------------|
| 🚨 CRITICAL | X | X% |
| ⚠️ WARNING | X | X% |
| ℹ️ INFO | X | X% |

---

## 7. Quality Control Checklist

Before proceeding, verify:

**Phase 2→3:**
- [ ] All synthesis themes represented in outline
- [ ] Evidence strength labels consistent
- [ ] Gaps carried forward

**Phase 3→4:**
- [ ] All outline sections have corresponding draft
- [ ] No unauthorized draft sections (scope creep)
- [ ] Core claims aligned
- [ ] Hedging appropriate for evidence strength

**Phase 2→4:**
- [ ] All themes discussed in draft
- [ ] Papers cited where expected
- [ ] No orphaned synthesis content

**Phase 4→6 (if applicable):**
- [ ] Contributions grounded in draft evidence
- [ ] No overclaiming beyond evidence boundaries
- [ ] Future research tied to documented gaps

**Traceability:**
- [ ] Sample claims trace completely through pipeline
- [ ] No broken evidence chains

**Overall:**
- [ ] Consistency score >75
- [ ] Zero critical issues
- [ ] All warnings documented and assessed

---

## 8. Recommended Actions (Prioritized)

### CRITICAL (Must Fix):
1. [List critical issues requiring immediate attention]

### HIGH PRIORITY (Strongly Recommended):
2. [List high-priority warnings]

### MEDIUM PRIORITY (Should Address):
3. [List medium-priority improvements]

### LOW PRIORITY (Optional):
4. [List minor suggestions]

---

## 9. Validation Metadata

**Validation performed by:** Cross-Phase Validator v1.0.0
**Phases analyzed:**
  - Phase 2: literature-synthesis-matrix.md
  - Phase 3: literature-review-outline.md
  - Phase 4: literature-review-draft.md
  - Phase 6: research-contributions-implications.md [if available]

**Validation timestamp:** [datetime]
**Consistency score:** [X]/100
**Critical issues:** [N]
**Warnings:** [N]

---

**End of Cross-Phase Validation Report**
```

---

## 6. Constraints and Safety Measures

### 6.1 Constraints
- **Do not modify any phase outputs:** Validation only
- **Do not judge content quality:** Focus on structural consistency
- **Do not enforce style preferences:** Check alignment, not aesthetics
- **Work only with provided files:** No external validation

### 6.2 Validation Philosophy
- **Structural over semantic:** Check that outline section exists, not whether it's well-written
- **Explicit over implicit:** Flag missing content even if implicitly addressed
- **Conservative flagging:** When uncertain, flag for human review rather than passing

---

## 7. Integration with Workflow

### 7.1 When to Run

**Option 1: After Phase 4** (before human review)
- Validates Phases 2→3→4 pipeline
- Catches inconsistencies before polishing

**Option 2: After Phase 6** (before finalization)
- Full validation including contributions
- Final quality check before submission

**Option 3: After Revisions**
- Any time a phase is re-run or substantially edited
- Ensures revisions maintain consistency

### 7.2 Workflow Integration

```
Phase 4 → Cross-Phase Validation →
  [If PASS] → Human Review → Phase 6
  [If WARNINGS] → Review warnings → Decide to proceed or revise
  [If CRITICAL] → Fix issues → Re-run Phase → Re-validate
```

---

## 8. Example Invocation

> "Run cross-phase validation on Phases 2 through 4. Check that all synthesis themes appear in the outline and draft, and verify evidence strength consistency."

> "Validate the complete workflow from synthesis to contributions (Phases 2-6). I want to ensure no broken traceability chains before submission."

---

## 9. Intended Use

This skill supports:
- Multi-phase research writing workflows
- Quality assurance before manuscript submission
- Post-revision consistency checks
- Audit trails for systematic reviews
- Collaborative projects requiring internal coherence

---

## 10. Limitations

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