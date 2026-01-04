# System Validation Report Template

**Instructions:** Use this template to generate the final validation report. Replace placeholders with actual values.

---

# System Validation Report

**Date:** [YYYY-MM-DD]
**Platform:** [Platform Name]
**OS:** [Operating System + Version]
**Validator:** [Agent Name/Human Name]
**Validation Type:** [IQ/OQ | IQ/OQ/PQ | Full (incl. CQ)]
**Testing Standard:** IEEE 829 (Software Test Documentation)

---

## Executive Summary

**Overall Status:** [PASS | FAIL | PASS WITH DEVIATIONS]
**IQ Status:** [PASS | FAIL] (Pass Rate: X%)
**OQ Status:** [PASS | FAIL] (Pass Rate: X%)
**PQ Status:** [PASS | FAIL | N/A] (Pass Rate: X%)
**CQ Status:** [PASS | FAIL | N/A] (Pass Rate: X%)

**Critical Issues:** [Count]
**Deviations:** [Count]
**Recommendations:** [Count]

---

## 1. Validation Objectives

[Document what was validated and why]

---

## 2. Test Environment

**Platform Details:**
- OS: [Windows 11 | macOS | Linux]
- CLI Tool: [Claude Code Desktop | Gemini CLI | etc.]
- Python Version: [if applicable]
- Dependencies: [list with versions]

**System Configuration:**
- Working Directory: [path]
- Git Repository: [URL]
- Git Branch: [branch name]
- Git Commit: [commit hash]

---

## 3. Validation Results

### 3.1 Installation Qualification (IQ)

| Test ID | Test Name | Expected Result | Actual Result | Status | Evidence |
|---------|-----------|----------------|---------------|--------|----------|
| VAL-IQ-001 | Directory Structure | All 6 dirs exist | [actual] | [✅/❌] | [link] |
| VAL-IQ-002 | Configuration Files | Files valid | [actual] | [✅/❌] | [link] |
| VAL-IQ-003 | Dependencies | All installed | [actual] | [✅/❌] | [link] |
| VAL-IQ-004 | Skills Integrity | All skills valid | [actual] | [✅/❌] | [link] |
| VAL-IQ-005 | IQ Summary | IQ Pass ≥90% | [actual] | [✅/❌] | [link] |

**IQ Pass Rate:** [X%]
**IQ Status:** [PASS | FAIL]

---

### 3.2 Operational Qualification (OQ)

| Test ID | Test Name | Expected Result | Actual Result | Status | Evidence |
|---------|-----------|----------------|---------------|--------|----------|
| VAL-OQ-001 | Read Capability | Files readable | [actual] | [✅/❌] | [link] |
| VAL-OQ-002 | Write Capability | Files writable | [actual] | [✅/❌] | [link] |
| VAL-OQ-003 | Shell Execution | Commands work | [actual] | [✅/⚠️/❌] | [link] |
| VAL-OQ-004 | PDF Access | PDFs readable | [actual] | [✅/❌/N/A] | [link] |
| VAL-OQ-005 | Pattern Matching | Searches work | [actual] | [✅/❌] | [link] |
| VAL-OQ-006 | OQ Summary | OQ Pass ≥80% | [actual] | [✅/❌] | [link] |

**OQ Pass Rate:** [X%]
**OQ Status:** [PASS | FAIL]

---

### 3.3 Performance Qualification (PQ) [If Applicable]

| Test ID | Test Name | Expected Result | Actual Result | Status | Evidence |
|---------|-----------|----------------|---------------|--------|----------|
| VAL-PQ-001 | End-to-End Workflow | Phase 1 completes | [actual] | [✅/❌] | [link] |
| VAL-PQ-002 | State Management | Recovery works | [actual] | [✅/❌] | [link] |
| VAL-PQ-003 | Cross-Platform | Consistent outputs | [actual] | [✅/❌] | [link] |

**PQ Pass Rate:** [X%]
**PQ Status:** [PASS | FAIL | N/A]

---

### 3.4 Cognitive Qualification (CQ) [If Applicable]

| Test ID | Test Name | Expected Result | Actual Result | Status | Evidence |
|---------|-----------|----------------|---------------|--------|----------|
| VAL-CQ-001 | Groundedness | No Hallucinations | [actual] | [✅/❌] | [link] |
| VAL-CQ-002 | Instruction Following | Valid JSON | [actual] | [✅/❌] | [link] |
| VAL-CQ-003 | Safety/Red Team | Refusal of stray | [actual] | [✅/❌] | [link] |
| VAL-CQ-004 | Output Consistency | ≥90% agreement | [actual] | [✅/❌/N/A] | [link] |
| VAL-CQ-005 | Bias Detection | No bias (p≥0.05) | [actual] | [✅/❌/N/A] | [link] |

**CQ Pass Rate:** [X%]
**CQ Status:** [PASS | FAIL | N/A]

**Note:** CQ tests 004 and 005 are optional. Mark as N/A if not executed.

---

## 4. Traceability Matrix

See: `VALIDATION_TRACEABILITY_MATRIX_[DATE].md`

---

## 5. Deviations & Corrective Actions

| Deviation ID | Test ID | Description | Severity | Root Cause | Corrective Action | Status |
|--------------|---------|-------------|----------|------------|-------------------|--------|
| [DEV-XXX] | [VAL-XX-XXX] | [description] | [CRITICAL/HIGH/MEDIUM/LOW] | [cause] | [action] | [Open/Resolved] |

---

## 6. Risk Assessment

| Risk | Severity | Likelihood | Impact | Mitigation | Residual Risk |
|------|----------|------------|--------|------------|---------------|
| [risk description] | [H/M/L] | [H/M/L] | [description] | [mitigation] | [H/M/L] |

---

## 7. Recommendations

1. **Critical:** [recommendation]
2. **High:** [recommendation]
3. **Medium:** [recommendation]
4. **Low:** [recommendation]

---

## 8. Conclusion

**Overall Validation Status:** [PASS | FAIL | PASS WITH DEVIATIONS]

**System Ready for Production Use:** [YES | NO | YES WITH RESTRICTIONS]

**Restrictions/Limitations:**
- [List any limitations discovered during validation]

**Next Steps:**
- [List required actions before production use]

---

## 9. Approval

**Validated By:** [Name]
**Date:** [YYYY-MM-DD]
**Signature:** _________________________

**Reviewed By:** [Name]
**Date:** [YYYY-MM-DD]
**Signature:** _________________________

---

## 10. Evidence Artifacts

**Evidence Location:** `audits/validation-evidence/[DATE]/`

**Files Generated:**
- IQ Test Results: `IQ_results_[timestamp].json`
- OQ Test Results: `OQ_results_[timestamp].json`
- PQ Test Results: `PQ_results_[timestamp].json` (if applicable)
- CQ Test Results: `CQ_results_[timestamp].json` (if applicable)
- Tool Execution Logs: `execution_log_[timestamp].txt`
- Output File Archive: `outputs_archive_[timestamp].zip`

**Evidence Retention:** As per institutional requirements (recommended: project lifecycle + 5 years)

---

**Report Generated:** [YYYY-MM-DD HH:MM:SS]
**Report Version:** 1.0
**Validation Protocol Version:** 1.2
