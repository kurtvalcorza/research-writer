---
name: research-contribution-implications-framer
description: Frames the scholarly, practical, and policy contributions and implications of a study based on prior synthesis, argument structure, and drafted findings.
license: Apache-2.0
compatibility: Requires read access to literature synthesis outputs and drafted sections in Markdown format.
allowed-tools: read_resource write_file
metadata:
  short-description: Articulates contributions, implications, and future directions grounded in evidence.
  version: 1.0.0
---

# Research Contribution & Implications Framer (Phase 6)

This skill articulates the **contributions, implications, and future research directions** of a study based strictly on prior analytical and drafting phases.

This phase focuses on **interpretive framing**, not new analysis or evidence generation.

---

## 1. Trigger
Activate this skill when the user:
- Has completed the literature review draft (Phase 4), and
- Requests contribution statements, implications, or discussion framing.

---

## 2. Objective
Produce a **grounded contribution and implications section** that:
- Clearly states what the study adds to existing knowledge
- Differentiates scholarly, practical, and policy implications
- Aligns claims with the strength and limits of available evidence
- Avoids overgeneralization or novelty inflation

---

## 3. Inputs
One or more of the following:
- `outputs/literature-synthesis-matrix.md` (Phase 2)
- `outputs/literature-review-outline.md` (Phase 3)
- `outputs/literature-review-draft.md` (Phase 4)
- (Optional) study findings or results section

No new sources or evidence may be introduced.

---

## 4. Execution Steps

### 4.1 Contribution Identification
Identify **distinct contributions** of the study relative to existing literature, such as:
- Conceptual clarification
- Theoretical extension or integration
- Methodological advancement
- Empirical coverage of underexplored contexts
- Systematic synthesis of fragmented evidence

Each contribution must be explicitly grounded in prior phases.

---

### 4.2 Contribution Classification
Classify contributions into one or more categories:
- **Theoretical / Scholarly**
- **Methodological**
- **Practical / Applied**
- **Policy / Governance**

Do not force all categories; include only those supported by evidence.

---

### 4.3 Implications Mapping
For each validated contribution:
- Articulate its implications for:
  - Researchers
  - Practitioners
  - Policymakers or institutions (if applicable)
- Maintain proportionality between:
  - Strength of evidence
  - Scope of implication

---

### 4.4 Boundary & Limitation Alignment
Explicitly acknowledge:
- Evidence limitations
- Contextual constraints
- Areas where implications should be interpreted cautiously

This step is mandatory to avoid overclaiming.

---

### 4.5 Future Research Directions
Translate identified gaps into:
- Clearly scoped future research questions
- Methodological or data recommendations
- Logical next steps for the field

Avoid speculative or unfalsifiable directions.

---

## 5. Output

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

## 6. Constraints
- Do not introduce new theories, data, or citations
- Do not claim “first,” “novel,” or “unprecedented” unless explicitly supported
- Do not generalize beyond the reviewed corpus or study context
- Avoid promotional or persuasive language

## 7. Error Handling
- If contributions are weak or incremental, state this explicitly
- If implications are narrow, reflect this honestly
- Flag mismatches between claimed contributions and evidence strength

## 8. Example Invocation
> “Frame the contributions, implications, and future research directions based on the completed literature review.”

## 9. Intended Use
This skill supports:
- Academic discussion sections
- Policy-oriented research reports
- Grant proposals and justification sections
- Evidence-based R&D documentation

It is designed to ensure that claims of value are traceable, proportional, and credible.

**End of SKILL Definition**