---
name: research-contribution-implications-framer
description: Frames the scholarly, practical, and policy contributions and implications of a study based on prior synthesis, argument structure, and drafted findings.
license: Apache-2.0
compatibility: Requires read access to literature synthesis outputs and drafted sections in Markdown format.
allowed-tools: Read Write Edit Glob Grep Bash
metadata:
  short-description: Articulates contributions, implications, and future directions grounded in evidence.
  version: 1.0.0
---

# Research Contribution & Implications Framer (Phase 5)

This skill articulates the **contributions, implications, and future research directions** of a study based strictly on prior analytical and drafting phases.

This phase focuses on **interpretive framing**, not new analysis or evidence generation.

---

## 1. Trigger
Activate this skill when the user:
- Has completed the literature review draft (Phase 4) and citation validation (Phase 4.5), and
- Requests contribution statements, implications, or discussion framing.

---

## 2. Pre-Execution Validation

**Before beginning framing, validate prerequisites:**

### 2.1 Verify Required Input Files

**Required files:**
- `outputs/literature-review-draft.md` (from Phase 4)
- `outputs/literature-synthesis-matrix.md` (from Phase 2)

**Optional files:**
- `outputs/literature-review-outline.md` (from Phase 3, for gap identification)
- `outputs/citation-integrity-report.md` (from Phase 4.5, for quality assurance)
- Study findings or results section (if separate from literature review)

**Validation steps:**
1. Check that `outputs/literature-review-draft.md` exists and is non-empty
2. Check that `outputs/literature-synthesis-matrix.md` exists and is non-empty
3. Verify draft contains complete literature review content
4. Verify synthesis matrix contains gap analysis

**If required files are missing:**
- **Draft missing:** Halt and prompt: "Required draft file `outputs/literature-review-draft.md` not found. Please complete Phase 4 (Literature Drafting) first."
- **Synthesis matrix missing:** Halt and prompt: "Required synthesis matrix `outputs/literature-synthesis-matrix.md` not found. Please complete Phase 2 first."
- **Files empty:** Halt and prompt: "Required input files appear empty. Ensure previous phases completed successfully."

### 2.2 Prepare Output Directory
1. Verify `outputs/` directory exists (should exist from previous phases)
2. If missing, create `outputs/` directory
3. Check for existing `research-contributions-implications.md` and note if updating or creating fresh

---

## 3. Execution Model

This skill operates as a **single-pass analytical workflow**:

### 3.1 Processing Strategy

**Single-Pass Operation:**
- Read literature review draft to understand synthesized findings
- Read synthesis matrix to identify gaps and patterns
- Perform contribution identification and classification
- Generate implications framing
- Write output file

**No Incremental Processing:**
- All inputs analyzed holistically
- Suitable for completed literature reviews (typical 3,000-10,000 words)
- Typical execution time: 3-7 minutes

**State Management:**
- No progress tracking required (single-pass operation)
- If interrupted, restart from beginning (low cost, quick execution)
- No recovery mechanism needed

### 3.2 Dependency Chain

**Sequential dependency:**
1. Phase 2 (synthesis matrix with gaps) must be complete
2. Phase 4 (literature review draft) must be complete
3. Phase 4.5 (citation validation) recommended but not required
4. This phase produces framing for discussion/conclusion sections

**Quality propagation:**
- Contribution framing quality depends on synthesis gap analysis
- Weak gap identification → limited future research directions
- Incomplete draft → difficulty identifying study contributions
- Agent cannot fabricate contributions not supported by synthesis

---

## 4. Objective
Produce a **grounded contribution and implications section** that:
- Clearly states what the study adds to existing knowledge
- Differentiates scholarly, practical, and policy implications
- Aligns claims with the strength and limits of available evidence
- Avoids overgeneralization or novelty inflation

---

## 5. Inputs
One or more of the following:
- `outputs/literature-synthesis-matrix.md` (Phase 2)
- `outputs/literature-review-outline.md` (Phase 3)
- `outputs/literature-review-draft.md` (Phase 4)
- (Optional) study findings or results section

No new sources or evidence may be introduced.

---

## 6. Execution Steps

### 6.1 Contribution Identification
Identify **distinct contributions** of the study relative to existing literature, such as:
- Conceptual clarification
- Theoretical extension or integration
- Methodological advancement
- Empirical coverage of underexplored contexts
- Systematic synthesis of fragmented evidence

Each contribution must be explicitly grounded in prior phases.

---

### 6.2 Contribution Classification
Classify contributions into one or more categories:
- **Theoretical / Scholarly**
- **Methodological**
- **Practical / Applied**
- **Policy / Governance**

Do not force all categories; include only those supported by evidence.

---

### 6.3 Implications Mapping
For each validated contribution:
- Articulate its implications for:
  - Researchers
  - Practitioners
  - Policymakers or institutions (if applicable)
- Maintain proportionality between:
  - Strength of evidence
  - Scope of implication

---

### 6.4 Boundary & Limitation Alignment
Explicitly acknowledge:
- Evidence limitations
- Contextual constraints
- Areas where implications should be interpreted cautiously

This step is mandatory to avoid overclaiming.

---

### 6.5 Future Research Directions
Translate identified gaps into:
- Clearly scoped future research questions
- Methodological or data recommendations
- Logical next steps for the field

Avoid speculative or unfalsifiable directions.

---

## 7. Output

Save the result as: `outputs/research-contributions-implications.md`

The output must include clearly labeled sections:

```markdown
## Contributions of the Study
- Contribution 1: …
- Contribution 2: …

## Implications
### Implications for Research
### Implications for Practice
### Implications for Policy (if applicable)

## Limitations and Boundary Conditions

## Directions for Future Research
```

### 7.1 Concrete Example Output

```markdown
# Research Contributions and Implications

## Contributions of the Study

This literature review makes three distinct contributions to understanding AI adoption in organizational contexts:

**1. Theoretical Integration:** This review synthesizes three historically separate theoretical frameworks (TAM, DOI, TOE) and demonstrates their complementary nature rather than competitive positioning. While prior reviews treated these frameworks independently (Rogers 2003, Venkatesh and Bala 2008), this systematic synthesis reveals that they address adoption at different analytical levels—individual (TAM), diffusion (DOI), and organizational (TOE)—providing a more complete understanding of adoption dynamics.

**2. Methodological Gap Identification:** The review systematically identifies measurement inconsistencies in "organizational readiness" operationalization across TOE-based studies, documenting variation in 12 of 18 studies. This finding highlights a critical barrier to cross-study comparison and meta-analysis in the AI adoption literature.

**3. Ethical Framework Absence Documentation:** This review provides the first systematic documentation of the gap between rapid AI adoption pace (accelerating post-2022) and ethical framework development (only 3 of 18 studies address ethics). This contribution establishes a foundation for future integration of ethical considerations into adoption models.

## Implications

### Implications for Research

**Standardization Need:** Researchers studying AI adoption using TOE frameworks should adopt standardized measures of organizational readiness to enable meaningful cross-study comparison. The measurement inconsistencies documented in this review limit cumulative knowledge building.

**Multi-Level Analysis:** Future empirical work should explicitly address adoption at multiple levels (individual, organizational, ecosystem) rather than privileging single-level analysis. The theoretical integration presented here provides conceptual foundation for such multi-level studies.

**Temporal Sensitivity:** Given the documented temporal lag (most data pre-dates GPT-era AI), research using pre-2023 adoption frameworks should explicitly acknowledge potential relevance limitations when applied to current generative AI contexts.

### Implications for Practice

**Holistic Adoption Strategy:** Practitioners should design AI adoption strategies that address individual-level factors (perceived usefulness, ease of use), organizational factors (readiness, culture), and ecosystem factors (competitive pressure, regulatory environment) simultaneously. Single-level interventions are likely insufficient given the multi-level nature of adoption dynamics.

**Readiness Assessment Challenges:** Organizations should recognize that "organizational readiness" assessment tools vary significantly in what they measure. Practitioners should critically evaluate readiness assessment instruments against their specific organizational context rather than assuming universal applicability.

### Implications for Policy

**Ethical Governance Gap:** Policymakers should recognize that AI adoption is outpacing ethical framework development. Regulatory interventions may be necessary to address the documented gap between adoption speed and ethical guidance, particularly for high-stakes domains (healthcare, criminal justice, education).

**Evidence-Based Policy Limits:** The geographic bias documented in this review (12 of 18 studies from North America/Europe) suggests current evidence may inadequately inform policy in Global South contexts. Region-specific evidence generation should be prioritized before wholesale policy transfer.

## Limitations and Boundary Conditions

**Corpus Scope:** This review synthesizes 18 empirical studies published 2020-2025. Findings should be interpreted within this temporal and methodological scope. Pre-2020 foundational work is referenced but not systematically analyzed.

**Generative AI Relevance:** Most empirical data pre-dates generative AI emergence (late 2022). Findings may not fully capture adoption dynamics specific to tools like ChatGPT, Claude, or Gemini.

**Geographic Representativeness:** The documented North America/Europe bias limits generalizability to other regions. Implications for policy and practice should be contextualized accordingly.

**Measurement Focus:** The identified measurement inconsistencies limit confidence in specific quantitative effect size estimates. Qualitative patterns (e.g., "organizational culture matters") are more robust than precise effect magnitudes.

## Directions for Future Research

**Priority Research Questions:**

1. **Standardized Measurement Development:** How can we develop and validate standardized measures of organizational AI readiness that are applicable across industries and organizational types?

2. **Generative AI Adoption Dynamics:** Do adoption patterns for generative AI tools differ systematically from traditional AI/ML adoption? What new theoretical constructs are necessary?

3. **Ethical Framework Integration:** How can ethical considerations be integrated into TAM/DOI/TOE frameworks without treating ethics as an afterthought or barrier?

4. **Global South Evidence:** What are the adoption drivers, barriers, and dynamics in low- and middle-income countries where existing evidence is sparse?

5. **Multi-Level Longitudinal Studies:** What are the temporal dynamics of AI adoption across individual, organizational, and ecosystem levels? How do cross-level interactions evolve over time?

**Methodological Recommendations:**

- Employ longitudinal designs to capture adoption as a process rather than a static outcome
- Use mixed methods to complement survey data with qualitative insight into context-specific adoption dynamics
- Prioritize external validity through diverse organizational sampling beyond convenience samples

**Data Collection Priorities:**

- Post-2023 data on generative AI adoption
- Systematic data from underrepresented geographic regions (Asia-Pacific, Latin America, Africa)
- Industry-specific studies (current evidence over-represents tech sector)
```

---

## 8. Constraints
- Do not introduce new theories, data, or citations
- Do not claim “first,” “novel,” or “unprecedented” unless explicitly supported
- Do not generalize beyond the reviewed corpus or study context
- Avoid promotional or persuasive language

## 9. Error Handling

### 9.1 Missing or Invalid Input Files

**If draft file is missing or empty:**
- Halt execution
- Prompt: "Required draft file `outputs/literature-review-draft.md` not found or empty. Please complete Phase 4 (Literature Drafting) first."

**If synthesis matrix is missing or empty:**
- Halt execution
- Prompt: "Required synthesis matrix `outputs/literature-synthesis-matrix.md` not found or empty. Please complete Phase 2 first."

**If draft lacks sufficient content:**
- Warn: "Literature review draft appears incomplete (<500 words). Contribution framing quality may be limited."
- Continue with available content but flag limitation in output

### 9.2 Weak or Incremental Contributions

**If contributions are weak or incremental:**
- State explicitly: "This review makes incremental contributions to existing knowledge"
- Avoid overstating novelty or impact
- Frame contributions honestly within appropriate scope
- Example: "While this review does not introduce new theoretical frameworks, it provides systematic documentation of measurement inconsistencies..."

**If no clear contributions can be identified:**
- Document explicitly: "Based on synthesis analysis, this review primarily consolidates existing knowledge without introducing new conceptual or empirical insights"
- Recommend manual review: "Consider whether synthesis reveals contributions not immediately apparent from automated analysis"

### 9.3 Narrow or Limited Implications

**If implications are narrow:**
- Reflect scope honestly: "Implications are primarily relevant to [specific context/domain]"
- Avoid forcing broad generalizations
- Note boundary conditions: "These implications should not be extended beyond [specified limits]"

**If only one stakeholder category applies:**
- Do not force implications for all categories (research/practice/policy)
- Include only supported implications
- Example: "This review has primarily theoretical implications for research. Practical and policy implications are limited given the early-stage nature of the evidence base."

### 9.4 Contribution-Evidence Misalignment

**If claimed contributions exceed evidence:**
- Flag mismatch: `[OVERCLAIMING DETECTED: Contribution claim exceeds synthesis support - requires revision]`
- Provide specific diagnostic: "Claim of 'comprehensive integration' not supported - synthesis covers only 3 frameworks in narrow domain"
- Recommend conservative reframing

**If contributions understate synthesis value:**
- Flag potential: "Synthesis may support stronger contributions than currently framed - consider..."
- Provide evidence: "Gap analysis identifies systematic absence of [X] - this constitutes methodological contribution"

### 9.5 Output Write Failures

**If unable to write to `outputs/` directory:**
- Halt and report: "Cannot write to `outputs/` directory. Verify write permissions."
- Offer fallback: Return framing in response text for manual saving

**If partial output exists and process interrupted:**
- Overwrite with fresh output (single-pass operation)
- Note in metadata: "Previous partial output overwritten"

---

## 10. Integration with Other Phases

### 10.1 Relationship to Phase 2 (Literature Extraction & Synthesis)

**Prerequisites from Phase 2:**
- `outputs/literature-synthesis-matrix.md` must exist with gap analysis
- Synthesis matrix should identify contradictions, divergence, and methodological issues
- Gap consolidation provides foundation for future research directions

**Quality Dependency:**
- Contribution framing quality depends on synthesis depth
- Sparse gap analysis → limited future research directions
- Missing pattern identification → difficulty articulating theoretical contributions

**Usage pattern:**
- Synthesis matrix gaps directly inform future research directions
- Contradictions/divergence enable contribution claims about integration or clarification
- Methodological analysis supports contributions about measurement or design

### 10.2 Relationship to Phase 3 (Argument Structuring)

**Optional inputs from Phase 3:**
- `outputs/literature-review-outline.md` for additional gap context
- Evidence strength annotations inform limitation framing

**Quality Enhancement:**
- Outline's "Consolidated Gaps & Tensions" complements synthesis matrix gaps
- Evidence profile labels help calibrate contribution scope claims

### 10.3 Relationship to Phase 4 (Literature Review Drafting)

**Prerequisites from Phase 4:**
- `outputs/literature-review-draft.md` must exist with complete review content
- Draft provides narrative context for contribution articulation
- Review demonstrates synthesis execution (validates claimed contributions)

**Quality Dependency:**
- Draft quality affects contribution credibility
- Well-synthesized review → stronger basis for claiming integration contributions
- Paper-by-paper review → limited basis for synthesis contributions

**Usage pattern:**
- Review draft demonstrates actual synthesis (not just planned)
- Executed integration supports theoretical contribution claims
- Draft limitations inform boundary condition acknowledgment

### 10.4 Relationship to Phase 4.5 (Citation Validation)

**Optional inputs from Phase 4.5:**
- `outputs/citation-integrity-report.md` for quality assurance
- Validation pass/fail status informs contribution confidence

**Quality Enhancement:**
- Clean citation validation → higher confidence in contribution claims
- Detected fabrications → must revise before framing contributions
- Misattributions → may affect scope of claimed contributions

### 10.5 Workflow Continuity

**Complete pipeline:**
1. Phase 1: Screen corpus → approved PDFs in `corpus/`
2. Phase 2: Extract & synthesize → matrices in `outputs/`
3. Phase 3: Structure argument → outline in `outputs/`
4. Phase 4: Draft review → literature review draft in `outputs/`
5. Phase 4.5: Validate citations → integrity report in `outputs/`
6. **Phase 5: Frame contributions → contribution/implications document in `outputs/`**
7. Human review → final integration → submission-ready document

**Recommended workflow:**
- Run Phase 5 after Phase 4 (and ideally 4.5) completion
- Use for discussion/conclusion section development
- Treat as final analytical phase before full document integration

---

## 11. Output Validation

**Before finalizing contribution framing, validate quality criteria:**

✅ **Contribution Grounding:**
- All contributions traceable to synthesis matrix or review draft
- No fabricated or speculative contributions
- Contribution scope aligned with evidence strength
- Novelty claims appropriately hedged

✅ **Implication Proportionality:**
- Implications match contribution scope
- No overgeneralizations beyond corpus or context
- Stakeholder categories (research/practice/policy) included only when supported
- Boundary conditions explicitly stated

✅ **Future Research Quality:**
- Research questions clearly scoped and answerable
- Methodological recommendations specific and actionable
- Directions logically derived from identified gaps
- No speculative or unfalsifiable directions

✅ **Limitation Honesty:**
- All major limitations explicitly acknowledged
- Contextual constraints documented
- Evidence weaknesses noted
- Overclaiming risks addressed

**Quality Tiers:**
- **Excellent:** All criteria met, honest scope framing, actionable directions, ready for integration
- **Good:** Criteria met, minor over/under-stating, minor revisions needed
- **Acceptable:** Core content present, some hedging needed, moderate revision required
- **Poor:** Significant overclaiming or underclaiming, major revision needed

Include quality self-assessment in output metadata.

---

## 12. Example Invocation
> "Frame the contributions, implications, and future research directions based on the completed literature review."

---

## 13. Intended Use
This skill supports:
- Academic discussion sections
- Policy-oriented research reports
- Grant proposals and justification sections
- Evidence-based R&D documentation

It is designed to ensure that claims of value are traceable, proportional, and credible.

**End of SKILL Definition**