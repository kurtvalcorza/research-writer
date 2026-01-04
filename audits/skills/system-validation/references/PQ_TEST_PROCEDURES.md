# Performance Qualification (PQ) Test Procedures

**Test ID Range:** VAL-PQ-001 through VAL-PQ-003

**Note:** PQ is optional for basic validation. Required for compliance-mode or multi-platform validation.

---

## VAL-PQ-001: End-to-End Workflow Test

**Objective:** Verify Phase 1 skill executes successfully with minimal corpus

**Expected Result:** Complete Phase 1 workflow executes without errors

**Prerequisites:**
- Test corpus with 3-5 PDFs in `corpus/`
- Screening criteria template customized

**Test Procedure:**
1. Execute Phase 1 skill with test corpus
2. Verify all 3 passes complete (PASS 1, PASS 2, PASS 3)
3. Check output files generated:
   - `outputs/screening-triage.md`
   - `outputs/screening-progress.md`
   - `outputs/literature-screening-matrix.md`
   - `outputs/prisma-flow-diagram.md`

4. Validate output content:
   - All test PDFs processed
   - Metadata extraction successful
   - PRISMA compliance verified
   - No context overflow errors

**Pass Criteria:**
- All 3 passes complete successfully
- All 4 output files generated
- 100% PDF processing success rate
- PRISMA flow diagram valid
- No critical errors in execution log

**Evidence:**
- Phase 1 execution logs
- Generated output files (archived)
- Performance metrics (execution time, memory usage)

---

## VAL-PQ-002: State Management & Recovery Test

**Objective:** Verify interruption recovery capabilities

**Expected Result:** Workflow resumes correctly after interruption

**Test Procedure:**
1. Start Phase 1 execution with test corpus
2. Simulate interruption during PASS 2 (after processing 1-2 PDFs)
3. Check `screening-progress.md` for state information
4. Resume execution
5. Verify:
   - Already-processed PDFs not reprocessed
   - Remaining PDFs processed successfully
   - Final outputs complete and accurate

**Pass Criteria:**
- State file correctly tracks progress
- Resumption skips completed PDFs
- No duplicate processing
- Final outputs match non-interrupted run

**Evidence:**
- State file snapshots (before/after interruption)
- Resume execution logs
- Output file comparison

---

## VAL-PQ-003: Cross-Platform Compatibility Test

**Objective:** Verify skill executes consistently across platforms

**Expected Result:** Same corpus produces identical outputs on different platforms

**Test Procedure:**
1. Execute Phase 1 on Platform A (e.g., Claude Code Desktop)
2. Execute Phase 1 on Platform B (e.g., Gemini CLI with --yolo)
3. Compare outputs:
   - File structure identical
   - Screening decisions consistent
   - PRISMA flow numbers match
   - Metadata extraction results equivalent

4. Document platform-specific differences (e.g., execution time, tool availability)

**Pass Criteria:**
- Output files structurally identical
- Screening recommendations consistent (±5% variance acceptable)
- No platform-specific failures
- All platforms achieve ≥80% success rate

**Evidence:**
- Output file diffs
- Platform comparison matrix
- Execution performance comparison

---

**End of PQ Test Procedures**
