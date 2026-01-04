---
name: literature-discovery-screening
description: Extracts metadata from research PDFs, applies user-defined screening criteria, and generates a PRISMA-style screening report with inclusion/exclusion recommendations. Uses universal three-pass incremental workflow for all corpus sizes.
license: Apache-2.0
compatibility: Requires PDF parsing capability and filesystem read/write access
allowed-tools: Read Write Edit Glob Grep Bash
---

# Literature Discovery & Screening Agent (Phase 1)

This skill partially automates the literature discovery and screening process, providing structured metadata extraction, systematic application of inclusion/exclusion criteria, and PRISMA-compliant documentation.

**Critical principle:** This agent **recommends** but does not make final decisions. Human approval is required before proceeding to Phase 2.

---

## 1. Trigger

Activate this skill when the user:
- Provides a folder containing potential research PDFs to be screened, and
- Requests literature screening, corpus validation, or PRISMA documentation

---

## 2. Objective

Produce a **systematic screening report** that:
- Extracts metadata from all PDFs in the target directory
- Applies user-defined inclusion/exclusion criteria consistently
- Generates screening recommendations with rationale
- Creates PRISMA-style flow documentation
- Enables informed human decision-making about corpus boundaries

---

## 3. Inputs

### 3.1 Required Inputs

**PDF Directory:**
- `corpus/` - folder containing research PDFs to be screened (same directory will contain approved PDFs after human review)

**Screening Criteria:**
- Read from `template/screening-criteria-template.md`
- Template must be customized for the research topic before executing Phase 1

### 3.2 Template Structure

The screening criteria template (`template/screening-criteria-template.md`) includes:

**Required Sections:**
- **Research Context:** Topic, review type, geographic/temporal scope
- **Inclusion Criteria:** Topic/focus, study type, publication type, geographic context, temporal parameters, language, domain-specific criteria
- **Exclusion Criteria:** Out of scope, methodological exclusions, geographic/temporal/language exclusions, quality thresholds, domain-specific exclusions
- **Edge Cases and Decision Rules:** Borderline cases, missing information, conflicting criteria
- **Screening Protocol:** Consistency checks and quality assurance measures
- **Example Applications:** Sample decisions (INCLUDE, EXCLUDE, UNCERTAIN, METADATA_INSUFFICIENT)

**Template Customization:**
If the user has not customized the screening template before running Phase 1, recommend action to customize using a prompt like:
```
Topic: [Your Research Topic]
Please revise template/screening-criteria-template.md accordingly.
```

---

## 4. Execution Steps

**Phase 1 uses a universal three-pass incremental workflow for ALL corpus sizes (1-100+ papers).**

This approach:
- ✅ Avoids context window limitations (processes one PDF at a time in PASS 2)
- ✅ Provides state management and recovery (resumable from interruptions)
- ✅ Scales infinitely (same workflow for 3 PDFs or 300 PDFs)
- ✅ Maintains consistency (one workflow to learn and maintain)

**Token Budget:** Estimated maximum ~30K tokens at any point (well within 200K limit; actual usage varies by PDF complexity)

**Estimated Time:** *(Estimates vary based on PDF complexity and system performance)*
- Small corpus (1-5 PDFs): 5-15 minutes
- Medium corpus (6-20 PDFs): 15-40 minutes
- Large corpus (20-50 PDFs): 40-90 minutes
- Very large corpus (50+ PDFs): 90-180 minutes

---

### Pre-Execution Validation

**Before beginning PASS 1, validate prerequisites:**

**Step 0: Verify screening criteria template**
1. Check that `template/screening-criteria-template.md` exists
2. Verify the template has been customized (not the default boilerplate)
3. Confirm all required sections are present:
   - Research Context
   - Inclusion Criteria
   - Exclusion Criteria
   - Edge Cases and Decision Rules

**If template is missing or uncustomized:**
- Halt execution
- Prompt user: "The screening criteria template at `template/screening-criteria-template.md` needs to be customized for your research topic before screening can begin. Please review and update the template, then re-run this skill."

---

### PASS 1: Lightweight Metadata Scan (Incremental)

**Purpose:** Quick triage to identify obvious INCLUDE/EXCLUDE cases. **Must process one PDF at a time** to save tokens.

**Step 1: Prepare environment**
- Create `outputs/` directory if it doesn't exist
- Initialize `outputs/screening-triage.md` with table headers:
  `| Filename | Year | Title | Status | Rationale |`

**Step 2: Incremental Triage Loop**
**For each PDF in `corpus/`:**
1. **Read PDF:** Read first 1-2 pages ONLY (limit context).
2. **Extract lightweight metadata:** Title, Year, quick topic check.
3. **Decide:**
   - ✅ **Auto-INCLUDE:** Title clearly matches topic + year in range
   - ❌ **Auto-EXCLUDE:** Obvious mismatch (year, topic, language)
   - ⚠️ **Flag for PASS 2:** Unclear / Abstract needed
4. **Append:** Add row to `outputs/screening-triage.md`.
5. **Clear Context:** **CRITICAL:** Forget/release PDF content before Next.

**Step 3: Summary**
- Count results from the generated file.

---

### PASS 2: Detailed Incremental Screening (One PDF at a time)

**Purpose:** Deep screening for papers that weren't obvious in Pass 1

**For each paper flagged for PASS 2:**

**Step 5: Process ONE PDF at a time**
1. **Read the single PDF**
2. **Extract full metadata:**
   - Complete title
   - Full author list
   - Publication year
   - DOI/identifier
   - Complete abstract (up to 1000 characters)
   - Journal/venue
   - Study type (if determinable)

3. **Apply detailed screening criteria:**
   - Topic relevance assessment
   - Methodology fit
   - Geographic scope
   - Study type requirements
   - Quality indicators

4. **Generate recommendation:**
   - INCLUDE / EXCLUDE / UNCERTAIN / METADATA_INSUFFICIENT
   - Detailed rationale (2-3 sentences)
   - Specific criteria that led to decision
   - Flags for human attention

5. **Append to progress file:** `outputs/screening-progress.md`
   - Add row to screening table
   - Update running counts
   - Save state (enables recovery if interrupted)

6. **Release PDF from context before next iteration**

**Step 6: Repeat for all PASS 2 papers**
- Process papers sequentially (one at a time)
- Each iteration is independent (no memory of previous PDFs needed)
- Progress file accumulates results

---

### PASS 3: Aggregate & Finalize

**Step 7: Combine Pass 1 + Pass 2 results**
1. Read `outputs/screening-triage.md` (Pass 1 results)
2. Read `outputs/screening-progress.md` (Pass 2 results)
3. Merge into comprehensive screening matrix

**Step 8: Generate final outputs with PRISMA documentation**

1. Generate `outputs/literature-screening-matrix.md` (complete screening results)
2. Generate `outputs/prisma-flow-diagram.md` with:
   - **Identification:** Records identified through database searching [external count, if provided]; Records identified through other sources [N/A or user-specified]; Total records identified [count]
   - **Screening:** Records screened [total PDFs processed]; Records excluded [count with reasons]
   - **Included:** Records included for synthesis [INCLUDE count]; Records requiring human review [UNCERTAIN count]
3. Categorize exclusions by reason:
   - Wrong topic/focus: [count]
   - Wrong publication type: [count]
   - Wrong geographic scope: [count]
   - Outside date range: [count]
   - Non-English: [count]
   - Insufficient metadata: [count]
   - Other reasons: [count with specification]

---

### State Management & Recovery

**Progress Tracking File:** `outputs/screening-progress.md`

```markdown
# Phase 1 Screening Progress

**Session Started:** [timestamp]
**Total PDFs:** [N]
**Pass 1 Complete:** Yes
**Pass 2 Progress:** [X]/[Y] papers processed

## Pass 2 Processing Log

| PDF Filename | Status | Timestamp |
|--------------|--------|-----------|
| paper1.pdf   | ✅ COMPLETE | 2026-01-02 14:23 |
| paper2.pdf   | ✅ COMPLETE | 2026-01-02 14:28 |
| paper3.pdf   | ⏳ IN_PROGRESS | 2026-01-02 14:31 |
| paper4.pdf   | ⏸️ PENDING | - |

## Detailed Screening Results (Incremental)

[Table rows added one-by-one as papers are processed]
```

**Recovery Capability:**

If the screening process is interrupted, the agent can resume using this workflow:

```
RECOVERY WORKFLOW:

1. Check if outputs/screening-progress.md exists
   - If NO: Start from PASS 1 (fresh execution)
   - If YES: Proceed to step 2

2. Read outputs/screening-progress.md
   - Parse "Pass 1 Complete" field
   - Parse "Pass 2 Progress" field (X/Y papers processed)
   - Parse "Pass 2 Processing Log" table

3. Determine current state:
   - If Pass 1 not complete: Resume PASS 1
   - If Pass 1 complete AND Pass 2 has pending papers: Resume PASS 2

4. For PASS 2 resumption:
   - Identify all PDFs with status "⏸️ PENDING" in the processing log
   - Get list of all PDFs flagged for PASS 2 from outputs/screening-triage.md
   - Compare to find next unprocessed PDF
   - Resume processing from that PDF onwards

5. Continue normal PASS 2 workflow:
   - Process next pending PDF
   - Append results to outputs/screening-progress.md
   - Repeat until all PASS 2 papers are complete
   - Proceed to PASS 3

EXAMPLE:
If screening-progress.md shows:
  - Pass 1 Complete: Yes
  - Pass 2 Progress: 5/10 papers processed
  - Last completed: paper5.pdf
  - Next pending: paper6.pdf

→ Resume by processing paper6.pdf and continuing sequentially
```

---

## 5. Output Structure

Generate **TWO output files:**

### 5.1 Screening Matrix: `outputs/literature-screening-matrix.md`

```markdown
# Literature Screening Matrix (Phase 1)

**Generated:** [date]
**Source Directory:** [path]
**Total PDFs Discovered:** [N]
**Screening Criteria Applied:** [summary]

---

## Screening Summary

| Category | Count | Percentage |
|----------|-------|------------|
| INCLUDE | X | X% |
| EXCLUDE | X | X% |
| UNCERTAIN | X | X% |
| METADATA_INSUFFICIENT | X | X% |

---

## Detailed Screening Results

| Filename | Title | Authors | Year | Recommendation | Rationale | Flags |
|----------|-------|---------|------|----------------|-----------|-------|
| paper1.pdf | ... | ... | 2024 | INCLUDE | Meets criteria: AI adoption, Philippine context, empirical study | None |
| paper2.pdf | ... | ... | 2018 | EXCLUDE | Outside date range (2020-2025) | Pre-specified cutoff |
| paper3.pdf | ... | ... | 2023 | UNCERTAIN | Topic relevant but methodology unclear from abstract | HUMAN_REVIEW_REQUIRED |
| ... | ... | ... | ... | ... | ... | ... |

---

## Papers Recommended for INCLUSION ([X] papers)

[List with brief justification for each]

## Papers Recommended for EXCLUSION ([X] papers)

[Grouped by exclusion reason]

## Papers Requiring Human Review ([X] papers)

[List with specific questions/concerns for human reviewer]

## Metadata Extraction Failures ([X] papers)

[List with suggested remediation: re-download, OCR, manual entry]

---

## Next Steps

- [ ] Human review of UNCERTAIN papers
- [ ] Resolution of metadata extraction failures
- [ ] Final approval of INCLUDE papers for Phase 2
- [ ] Move approved PDFs to corpus/ directory
```

---

### 5.2 PRISMA Flow Diagram: `outputs/prisma-flow-diagram.md`

```markdown
# PRISMA Flow Diagram

**Study:** [Study title/focus]
**Screening Date:** [date]

---

## Identification

- **Records identified through database searching:** [N, if provided by user]
- **Additional records identified through other sources:** [N, if provided]
- **Total records before screening:** [N]

---

## Screening

- **Records screened (title/abstract):** [N]
- **Records excluded:** [N]

### Exclusion Reasons:
- Wrong topic/focus: [N]
- Wrong study type: [N]
- Wrong geographic scope: [N]
- Outside date range: [N]
- Language criteria not met: [N]
- Insufficient metadata: [N]
- Other reasons: [N with specification]

---

## Eligibility

- **Records assessed for eligibility (full-text):** [INCLUDE + UNCERTAIN count]
- **Records pending human review:** [UNCERTAIN count]

---

## Included

- **Studies included in synthesis (recommended):** [INCLUDE count]
- **Studies requiring human decision:** [UNCERTAIN count]

---

## Flow Diagram (Text Representation)

```
                    Identification
                         │
                    Records identified
                         (N = [X])
                         │
                         ▼
                      Screening
                         │
              ┌──────────┴──────────┐
              │                     │
         Included                Excluded
         (N = [X])              (N = [X])
              │                     │
              │                [Reasons listed]
              │
              ▼
         Human Review Required
              (N = [X])
              │
              ▼
         Final Corpus
      (Awaiting approval)
```

---

## Audit Trail

- **Screening performed by:** [Agent name/version]
- **Screening criteria source:** [User-provided / Template]
- **Metadata extraction success rate:** [X%]
- **Human review required for:** [X] papers ([X%] of total)

---

## Documentation Notes

This PRISMA flow diagram follows the PRISMA 2020 guidelines adapted for AI-assisted screening. All recommendations are subject to human approval before finalizing the corpus for Phase 2 (Literature Extraction & Synthesis).
```

---

## 6. Constraints and Safety Measures

### 6.1 Constraints
- **Do not fabricate metadata:** Use "Not available" if extraction fails
- **Do not make subjective quality judgments:** Screen for fit with criteria only, not paper quality
- **Do not automatically exclude papers:** All exclusions are recommendations requiring human approval
- **Do not proceed to Phase 2:** This phase produces recommendations only

### 6.2 Conservative Defaults
- **When uncertain, flag for human review:** Prefer UNCERTAIN over automatic EXCLUDE
- **Acknowledge extraction limitations:** Explicitly note when metadata is incomplete
- **Maintain neutrality:** Do not favor inclusion or exclusion; apply criteria consistently

### 6.3 Transparency Requirements
- Every recommendation must have explicit rationale
- Criteria application must be documented for each paper
- Metadata extraction failures must be logged with diagnostic information

---

## 7. Error Handling

### 7.1 Empty or Missing Corpus Directory
- **If `corpus/` directory doesn't exist:**
  - Halt execution
  - Prompt user: "The `corpus/` directory was not found. Please create it and add PDFs to be screened."

- **If `corpus/` directory is empty (contains 0 PDFs):**
  - Halt execution
  - Prompt user: "The `corpus/` directory contains no PDF files. Please add research papers to be screened before running this skill."

### 7.2 PDF Parsing Failures
- Log the filename and error type
- Categorize as METADATA_INSUFFICIENT
- Provide diagnostic suggestions:
  - "Corrupted file: re-download from source"
  - "Image-only PDF: requires OCR preprocessing"
  - "Encrypted PDF: remove password protection"
  - "Unreadable format: verify file integrity"

### 7.3 Ambiguous Metadata
- Flag papers with conflicting metadata (e.g., title suggests 2020 but metadata shows 2019)
- Request human verification
- Do not guess or infer missing information

### 7.4 Criteria Interpretation Challenges
- If user-provided criteria are ambiguous, request clarification before screening
- If a paper presents edge-case scenario, categorize as UNCERTAIN with explanation
- Document interpretation decisions for consistency

---

## 8. Integration with Phase 2

**Handoff Requirements:**

Before proceeding to Phase 2 (Literature Extraction & Synthesis), the user must:
1. Review the screening matrix
2. Approve or override INCLUDE/EXCLUDE recommendations
3. Resolve UNCERTAIN cases
4. Address metadata extraction failures
5. Remove excluded PDFs from the `corpus/` directory (keeping only approved papers)
6. Optionally: document final inclusion/exclusion decisions

**Phase 2 inputs will be:**
- Only the approved, screened PDFs in `corpus/`
- (Optional) The PRISMA flow diagram for methods documentation

---

## 9. Example Invocation

### Example 1: Standard Template-Based Workflow
> "Screen all PDFs in the `corpus/` folder for a literature review on AI adoption in Southeast Asia. Include: empirical studies, policy analyses, published 2020-2025. Exclude: purely technical algorithm papers, non-English, non-peer-reviewed sources."

**Agent response:** "First, I'll help you populate the screening criteria template at `template/screening-criteria-template.md` with your requirements. Once that's customized, I'll proceed with the three-pass screening workflow."

### Example 2: With Criteria Template
> "Generate a screening report for PDFs in `corpus/`. I'm researching digital transformation in government. Help me define appropriate screening criteria first."

---

## 10. Intended Use

This skill supports:
- Systematic literature reviews
- Scoping reviews
- Evidence synthesis projects
- Meta-analyses
- Any research requiring transparent, reproducible corpus selection

**Key differentiator:** Unlike fully manual screening or fully automated filtering, this agent provides **augmented decision-making**—systematic, consistent application of criteria with full transparency and human oversight.

---

## 11. Limitations and Scope

**This skill does NOT:**
- Replace human judgment about paper relevance or quality
- Perform full-text analysis (screening based on title/abstract/metadata only)
- Access external databases or conduct literature searches
- Download or acquire papers
- Make final inclusion/exclusion decisions

**This skill DOES:**
- Accelerate the screening process through consistent criteria application
- Create audit trails for corpus selection
- Identify papers requiring closer human examination
- Generate PRISMA-compliant documentation
- Reduce cognitive load of processing large candidate sets

---

## 12. Quality Assurance Checklist

After running this skill, verify:
- [ ] All PDFs in source directory were processed
- [ ] Metadata extraction success rate is acceptable (>80% ideal)
- [ ] Screening rationales are specific and traceable to criteria
- [ ] UNCERTAIN category is used appropriately (not empty, not excessive)
- [ ] Exclusion reasons are categorized and counted
- [ ] PRISMA flow diagram numbers are internally consistent
- [ ] No papers were automatically excluded without human review capability

---

**End of SKILL Definition**