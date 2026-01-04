# Performance Qualification (PQ) Test Procedures

## Overview
These procedures verify that the system can perform its intended workflows under production-like conditions (end-to-end execution).

**Pass Criteria:**
- PQ Pass Rate ≥ 80%
- All workflow outputs generated
- PRISMA compliance verified

**Prerequisites:**
- Test corpus with 3-5 PDFs in `corpus/`.
- Screening criteria defined in `template/screening-criteria-template.md`.

---

## VAL-PQ-001: End-to-End Phase 1 Workflow Test

**Objective:** Verify the full "Literature Discovery & Screening" workflow (Phase 1).

**Procedure:**
1. Execute the Phase 1 skill (`skills/01_literature-discovery/SKILL.md`).
2. Monitor execution through all three passes:
   - Pass 1: Metadata Extraction
   - Pass 2: Relevance Screening
   - Pass 3: Matrix Generation

**Pass Criteria:**
- Execution completes without crash.
- User is notified of completion.

---

## VAL-PQ-002: Output Verification

**Objective:** Verify that specific workflow outputs are created and valid.

**Procedure:**
1. Check for `outputs/screening_matrix.md`.
2. Check for `outputs/prisma_flow_diagram.md`.
3. Check for `outputs/screening_progress.md`.

**Pass Criteria:**
- Files exist and are not empty.
- Screening matrix contains rows corresponding to the input PDFs.
- PRISMA diagram numbers sum correctly (Total = Included + Excluded).

---

## VAL-PQ-003: Interruption Recovery Test (Optional)

**Objective:** Verify system state resilience.

**Procedure:**
1. Start Phase 1 execution.
2. Manually interrupt (Ctrl+C) during Pass 2.
3. Restart execution.

**Pass Criteria:**
- System detects previous progress (check `screening_progress.md`).
- System resumes from the last processed file or pass, rather than restarting from zero.

---

## VAL-PQ-004: PQ Summary Report Generation

**Objective:** Consolidate PQ results.

**Procedure:**
1. Aggregate results.
2. Generate `audits/reports/VALIDATION_PQ_REPORT_[DATE].md`.

**Pass Criteria:**
- Report generated successfully.
