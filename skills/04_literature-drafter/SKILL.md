---
name: literature-review-drafter
description: Drafts a theme-driven literature review section based on an approved argument outline and synthesis matrix.
license: Apache-2.0
compatibility: Requires read access to a synthesis matrix and argument outline in Markdown format.
allowed-tools: read_resource write_file
metadata:
  short-description: Converts a literature review outline into structured academic prose.
  version: 1.0.0
---

# Literature Review Drafter (Phase 4)

This skill converts a **validated literature review outline (Phase 3)** and a **literature synthesis matrix (Phase 2)** into a **coherent, theme-driven literature review draft**.

This phase focuses on **controlled prose generation**, grounded strictly in prior analytical outputs.

---

## 1. Trigger
Activate this skill when the user:
- Has an approved literature review outline (Phase 3), and
- Requests a draft of the literature review section.

---

## 2. Objective
Produce a **structured literature review draft** that:
- Is organized by themes, not individual papers
- Accurately reflects consensus, debate, and gaps
- Maintains traceability to the synthesis matrix
- Uses formal academic tone and neutral language

---

## 3. Inputs
- `outputs/literature-review-outline.md` (from Phase 3)
- `outputs/literature-synthesis-matrix.md` (from Phase 2)

No additional sources may be introduced.

---

## 4. Execution Steps

### 4.1 Section-by-Section Drafting
For each section in the outline:
- Use the **Core Claim** as the paragraph anchor
- Integrate evidence from multiple papers per theme
- Avoid sequential or paper-by-paper narration

Each section should typically contain:
- 1–2 paragraphs, depending on evidence density

---

### 4.2 Evidence Integration Rules
- Cite multiple studies when describing consensus
- Explicitly signal disagreement or divergence where present
- Attribute findings accurately and conservatively
- Use hedging language when evidence is limited or mixed

---

### 4.3 Gap Signposting
Where gaps are identified:
- Clearly indicate what is missing or underexplored
- Avoid speculative explanations
- Defer implications to later sections unless explicitly requested

---

### 4.4 Citation Handling
- Use consistent in-text citation style (e.g., Author, Year)
- Do not fabricate bibliographic details
- If citation metadata is incomplete, retain minimal identifiers

---

## 5. Output

Save the result as: `outputs/literature-review-draft.md`


The output must include:
- Clear section headings aligned with the outline
- Coherent, theme-driven paragraphs
- Explicit transitions between sections

---

## 6. Constraints
- Do not introduce new concepts, theories, or sources
- Do not summarize papers individually
- Do not overstate findings beyond the synthesis
- Do not include conclusions or recommendations unless requested
- Avoid rhetorical or persuasive language

---

## 7. Error Handling
- If outline sections lack sufficient evidence, flag this explicitly in the draft
- If synthesis data is sparse or ambiguous, use cautious language and note limitations

---

## 8. Example Invocation
> “Draft the literature review section based on the approved outline and synthesis matrix.”

---

## 9. Intended Use
This skill supports:
- Academic journal articles
- Theses and dissertations
- Policy and technical research reports

It is designed to ensure that **writing follows analysis**, preserving rigor, credibility, and traceability.

**End of SKILL Definition**