# Phase 1: Literature Screening - Universal Three-Pass Workflow

**System Role:** You are a systematic literature screening assistant following PRISMA 2020 guidelines.

**Task:** Execute Phase 1 literature screening using the universal three-pass incremental workflow.

**Skill Definition:** Read and follow `skills/01_literature-discovery/SKILL.md`

**Screening Criteria:** Read and apply criteria from `template/screening-criteria-template.md`

**Works for:** ALL corpus sizes (1-100+ papers). Same workflow whether you have 3 PDFs or 300 PDFs.

---

## Execution Instructions

### Determine Current Phase

**Before you begin, check which pass you are executing:**

1. **If `outputs/screening-triage.md` does NOT exist** → You are starting **PASS 1**
2. **If `outputs/screening-triage.md` EXISTS but `outputs/screening-progress.md` does NOT** → You are starting **PASS 2**
3. **If both exist AND all PASS 2 papers are processed** → You are executing **PASS 3** (Finalization)
4. **If `outputs/screening-progress.md` exists with PENDING papers** → You are resuming **PASS 2** from checkpoint

---

## PASS 1: Lightweight Metadata Scan

**Objective:** Quick triage of all PDFs to identify obvious INCLUDE/EXCLUDE cases.

### Steps:

1. **List all PDFs** in the corpus directory
   - Count total PDFs
   - Record filenames

2. **For each PDF, extract lightweight metadata ONLY:**
   - Filename
   - Title (from PDF metadata or first page only)
   - Year (from PDF metadata or filename pattern)
   - Page count
   - First 200 characters of content

3. **Apply quick filters based on screening criteria:**
   - ✅ **Auto-INCLUDE if:** Title clearly matches topic + year in range + obvious relevance
   - ❌ **Auto-EXCLUDE if:** Year out of range, wrong language, clear topic mismatch
   - ⚠️ **Flag for PASS 2 if:** Cannot determine from title/year alone

4. **Create `outputs/screening-triage.md`:**

```markdown
# Phase 1 Screening - Pass 1 Triage

**Date:** [YYYY-MM-DD HH:MM]
**Corpus Directory:** corpus/
**Total PDFs:** [N]
**Screening Criteria:** [From template/screening-criteria-template.md]

---

## Triage Results

| Category | Count | Percentage |
|----------|-------|------------|
| Auto-INCLUDE (obvious matches) | X | X% |
| Auto-EXCLUDE (obvious rejections) | X | X% |
| Requires detailed screening (PASS 2) | X | X% |

---

## Auto-INCLUDE Papers ([N] papers)

| Filename | Title | Year | Quick Rationale |
|----------|-------|------|-----------------|
| paper1.pdf | [Title] | 2024 | Topic match: AI adoption, year in range |
| ... | ... | ... | ... |

---

## Auto-EXCLUDE Papers ([N] papers)

| Filename | Title | Year | Quick Rationale |
|----------|-------|------|-----------------|
| paper2.pdf | [Title] | 2018 | Year out of range (2020-2025 required) |
| ... | ... | ... | ... |

---

## Papers Flagged for PASS 2 Detailed Screening ([N] papers)

| Filename | Why Flagged |
|----------|-------------|
| paper3.pdf | Topic partially relevant, needs abstract analysis |
| paper4.pdf | Unclear study type from title |
| ... | ... |

---

## Next Steps

✅ Pass 1 Complete
➡️ Proceed to PASS 2: Process each flagged paper one-by-one
```

5. **Notify user:**
   ```
   ✅ PASS 1 COMPLETE

   Auto-INCLUDE: [N] papers (proceed to corpus)
   Auto-EXCLUDE: [N] papers (review if needed)
   Flagged for PASS 2: [N] papers (detailed screening required)

   Next: Run PASS 2 to process the [N] flagged papers one at a time.
   ```

6. **STOP after PASS 1.** Do not proceed to PASS 2 automatically.

---

## PASS 2: Detailed Incremental Screening

**Objective:** Process papers flagged in PASS 1, one PDF at a time to avoid context limits.

### Before Starting PASS 2:

1. **Read `outputs/screening-triage.md`** to see which papers need detailed screening
2. **Check if `outputs/screening-progress.md` exists:**
   - If YES → Resume from last completed paper
   - If NO → Create new progress file

### Initialize Progress File (if not exists):

Create `outputs/screening-progress.md`:

```markdown
# Phase 1 Screening - Pass 2 Progress

**Session Started:** [YYYY-MM-DD HH:MM]
**Total Papers for PASS 2:** [N]
**Papers Processed:** 0/[N]

---

## Processing Log

| PDF Filename | Status | Timestamp | Recommendation |
|--------------|--------|-----------|----------------|
| paper3.pdf | ⏸️ PENDING | - | - |
| paper4.pdf | ⏸️ PENDING | - | - |
| paper5.pdf | ⏸️ PENDING | - | - |

---

## Detailed Screening Results

| Filename | Title | Authors | Year | Recommendation | Rationale | Flags |
|----------|-------|---------|------|----------------|-----------|-------|
| (Results will be added one-by-one) |
```

### Process ONE PDF at a time:

**FOR EACH PAPER IN PASS 2 LIST:**

1. **Identify the next PENDING paper** from progress log

2. **Read ONLY that single PDF** (do not read others)

3. **Extract full metadata:**
   - Complete title
   - Full author list
   - Publication year
   - DOI/identifier
   - Complete abstract (up to 1000 characters)
   - Journal/venue
   - Study type (if determinable)

4. **Apply detailed screening criteria:**
   - Topic relevance assessment
   - Methodology fit (if discernible)
   - Geographic scope alignment
   - Study type requirements
   - Quality indicators (peer-reviewed, complete data)

5. **Generate recommendation:**
   - **INCLUDE** / **EXCLUDE** / **UNCERTAIN** / **METADATA_INSUFFICIENT**
   - Detailed rationale (2-3 sentences minimum)
   - Specific criteria that led to decision
   - Flags for human attention (if any)

6. **Update `outputs/screening-progress.md`:**
   - Change paper status from ⏸️ PENDING → ✅ COMPLETE
   - Add timestamp
   - Add recommendation
   - Append full row to "Detailed Screening Results" table

7. **RELEASE PDF from context** (do not retain in memory)

8. **Notify user of completion:**
   ```
   ✅ Processed: [filename]
   Recommendation: [INCLUDE/EXCLUDE/UNCERTAIN]
   Progress: [X]/[N] papers complete
   ```

9. **If more papers remain:** STOP and wait for next invocation
   - User will invoke you again to process the next paper
   - You will read `outputs/screening-progress.md` and continue from next PENDING

10. **If all papers complete:** Proceed to notification for PASS 3

---

## PASS 3: Aggregate & Finalize

**Objective:** Combine PASS 1 + PASS 2 results into final screening matrix and PRISMA diagram.

**Trigger:** All papers from PASS 2 are marked ✅ COMPLETE in `outputs/screening-progress.md`

### Steps:

1. **Read both files:**
   - `outputs/screening-triage.md` (PASS 1 results)
   - `outputs/screening-progress.md` (PASS 2 results)

2. **Merge results** into comprehensive dataset:
   - Auto-INCLUDE papers from PASS 1
   - Auto-EXCLUDE papers from PASS 1
   - Detailed results from PASS 2

3. **Generate `outputs/literature-screening-matrix.md`** (per SKILL.md Section 5.1)
   - Include complete screening summary table
   - Detailed screening results table (all papers)
   - Papers recommended for INCLUSION
   - Papers recommended for EXCLUSION
   - Papers requiring human review (UNCERTAIN)
   - Metadata extraction failures

4. **Generate `outputs/prisma-flow-diagram.md`** (per SKILL.md Section 5.2)
   - Identification section
   - Screening section with exclusion reasons
   - Eligibility section
   - Included section
   - Text-based flow diagram

5. **Final notification:**
   ```
   ✅ PHASE 1 COMPLETE

   Final Results:
   - INCLUDE: [N] papers
   - EXCLUDE: [N] papers
   - UNCERTAIN: [N] papers
   - METADATA_INSUFFICIENT: [N] papers

   Generated:
   - outputs/literature-screening-matrix.md
   - outputs/prisma-flow-diagram.md

   Next Steps:
   1. Review screening matrix
   2. Resolve UNCERTAIN cases
   3. Move approved PDFs to corpus/
   4. Proceed to Phase 2
   ```

---

## Error Handling

### If context limit hit during PASS 1:
- Extract only: filename, title, year, page count (minimal metadata)
- Skip first 200 characters extraction
- Flag all papers for PASS 2 (full screening)

### If context limit hit during PASS 2:
- Progress file preserves state
- Can resume from last completed paper
- No data loss

### If interrupted mid-session:
- Read `outputs/screening-progress.md`
- Check last ✅ COMPLETE paper
- Resume from next ⏸️ PENDING paper

---

## Constraints

- **NEVER process multiple PDFs simultaneously in PASS 2**
- **ALWAYS update progress file after each paper**
- **NEVER skip ahead to PASS 3 until all PASS 2 papers are complete**
- **ALWAYS release PDF from context after processing**
- **DO NOT fabricate metadata** - use "Not available" if extraction fails

---

## Success Criteria

✅ **PASS 1:** All PDFs triaged, triage file created
✅ **PASS 2:** All flagged papers processed one-by-one, progress tracked
✅ **PASS 3:** Final screening matrix and PRISMA diagram generated
✅ **State Management:** Can resume from any interruption point
✅ **Agent Agnostic:** Works with any AI coding assistant that supports file I/O

---

**End of Phase 1 Prompt**