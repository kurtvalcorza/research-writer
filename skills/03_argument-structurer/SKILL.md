---
name: literature-review-argument-structurer
description: Transforms a literature synthesis matrix into a coherent argument structure and section-level outline for a literature review.
license: Apache-2.0
compatibility: Requires read access to a Markdown synthesis matrix file. No external data sources required.
allowed-tools: read_resource write_file
metadata:
  short-description: Builds a defensible literature review outline from a synthesis matrix.
  version: 1.0.0
---

# Literature Review Argument Structurer (Phase 3)

This skill converts a **theme-centric literature synthesis matrix** into a **logical argument structure and review outline**, suitable for academic, policy, or R&D research writing.

This phase focuses on **reasoning and organization**, not prose generation.

---

## 1. Trigger
Activate this skill when the user:
- Has completed a literature synthesis matrix (Phase 2), and
- Requests an outline, structure, or argument flow for a literature review.

---

## 2. Objective
Produce a **clear, evidence-grounded argument spine** that:
- Organizes themes into a logical sequence
- Distinguishes consensus, debate, and gaps
- Supports traceable, defensible writing in later phases

---

## 3. Input
Markdown files containing the **Literature Synthesis Matrix** generated in Phase 2.
- `outputs/literature-extraction-matrix.md`
- `outputs/literature-synthesis-matrix.md`

No new sources may be introduced.

---

## 4. Execution Steps

### 4.1 Theme Clustering
- Review all themes and analytical dimensions in the synthesis matrix.
- Group related themes into **3–7 higher-level clusters**, depending on corpus size.
- Ensure clusters are:
  - Conceptually coherent
  - Mutually distinguishable

---

### 4.2 Argument Sequencing
Arrange clusters into a **logical narrative flow**, such as:
- Foundational → applied → emerging
- Consensus → divergence → unresolved gaps
- Historical → methodological → forward-looking

The sequence must be justified by the evidence distribution.

---

### 4.3 Section-Level Claim Formulation
For each cluster:
- Formulate a **section claim** (1–2 sentences) that summarizes what the literature establishes.
- Explicitly indicate:
  - Areas of agreement
  - Areas of disagreement
  - Strength of evidence

---

### 4.4 Evidence Strength Annotation
For each section, assign an evidence strength label:
- **Strong consensus**
- **Mixed / contested**
- **Emerging / limited**
- **Sparse or absent**

Base this solely on synthesis matrix content.

---

### 4.5 Gap Consolidation
- Identify cross-cutting gaps that:
  - Appear across multiple themes, or
  - Systematically affect the literature (e.g., data limitations, population bias).
- Flag these for later discussion or future research framing.

---

## 5. Output Structure

Save the result as: `outputs/literature-review-outline.md`

The output must include:

### 5.1 Review Outline
```markdown
## Literature Review Outline

### Section 1: [Section Title]
**Core Claim:** …
**Evidence Profile:** …
**Key Themes Covered:** …

### Section 2: …
```

--- 

### 5.2 Argument Flow Summary
A short paragraph explaining:
- Why sections are ordered as they are
- How the argument progresses logically

### 5.3 Consolidated Gaps & Tensions
A bullet list summarizing:
- Major unresolved issues
- Methodological or conceptual blind spots

## 6. Constraints
- Do not generate full prose paragraphs.
- Do not summarize individual papers.
- Do not introduce new interpretations unsupported by the synthesis matrix.
- Avoid normative or persuasive language; remain analytical.

## 7. Error Handling
- If the synthesis matrix is incomplete or poorly structured, flag this explicitly and proceed with best-effort clustering.
- Clearly note weak or ambiguous evidence.

## 8. Example Invocation
>“Create a literature review argument structure and outline based on the synthesis matrix.”

## 9. Intended Use
This skill supports:
- Academic literature reviews
- Systematic and scoping reviews
- Policy and evidence synthesis reports
- AI-assisted research writing pipelines
- It is designed to ensure that drafting in later phases is guided by structure, not intuition.

**End of SKILL Definition**