# Phase 1: Literature Discovery & Screening

**Objective:** Execute systematic literature screening with PRISMA-compliant documentation.

---

## Task

You are executing **Phase 1: Literature Discovery & Screening** using the `literature-discovery-screening` skill.

### Inputs

- **PDF Directory:** `corpus/` (contains research PDFs to be screened)
- **Screening Criteria:** `template/screening-criteria-template.md` (must be customized before execution)

### Outputs

- `outputs/literature-screening-matrix.md` (screening results with recommendations)
- `outputs/prisma-flow-diagram.md` (PRISMA 2020 compliant flow diagram)
- `outputs/screening-progress.md` (state management for resumability)

---

## Execution Instructions

Follow the **complete technical specifications** defined in:

**`skills/01_literature-discovery/SKILL.md`**

This skill implements the **universal three-pass incremental workflow** that works for ALL corpus sizes (1-100+ papers):

- **PASS 1:** Lightweight metadata scan (quick triage)
- **PASS 2:** Detailed incremental screening (one PDF at a time, resumable)
- **PASS 3:** Aggregate and finalize (generate final outputs)

---

## Key Principles

- **Recommendation, not decision:** All screening results are recommendations requiring human approval
- **Conservative defaults:** When uncertain, flag for human review (UNCERTAIN) rather than auto-exclude
- **Transparency:** Every recommendation must have explicit rationale
- **Context-safe:** Process one PDF at a time in PASS 2 to avoid context limits
- **Resumable:** State management allows recovery from interruptions

---

## Success Criteria

✅ All PDFs in corpus/ processed
✅ Screening matrix generated with clear recommendations
✅ PRISMA flow diagram complete and internally consistent
✅ No fabricated metadata (use "Not available" if extraction fails)
✅ Human review checkpoints identified (UNCERTAIN cases)

---

## Next Steps After Completion

1. Review `outputs/literature-screening-matrix.md`
2. Resolve UNCERTAIN cases (human judgment required)
3. Approve final corpus for Phase 2
4. Proceed to Phase 2: Literature Extraction & Synthesis

---

**For full technical specifications, constraints, and error handling procedures, refer to:**
**`skills/01_literature-discovery/SKILL.md`**
