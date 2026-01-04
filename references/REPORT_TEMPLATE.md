# System Validation Report

**Date:** [YYYY-MM-DD]
**Validator:** [Agent/User Name]
**System Version:** [Version/Commit SHA]
**Platform:** [Platform Name, e.g., Claude Code Desktop]

---

## 1. Executive Summary

**Validation Status:** [ PASS | FAIL | PASS WITH DEVIATIONS ]

| Qualification Area | Pass Rate | Status |
|-------------------|-----------|--------|
| Installation (IQ) | [X]% | [STATUS] |
| Operational (OQ)  | [X]% | [STATUS] |
| Performance (PQ)  | [X]% | [STATUS] |
| Cognitive (CQ)    | [X]% | [STATUS] |

**Summary of Findings:**
[Brief 2-3 sentence summary of the overall validation results. Highlight any critical successes or major blockers.]

---

## 2. Validation Scope

**Objective:**
To verify that the Research Writer system is correctly installed, operational, and capable of performing its intended research functions on the current platform.

**Inclusions:**
- IQ: Directory structure, dependencies, configuration.
- OQ: Tool capabilities (Read, Write, Exec).
- PQ: End-to-end workflow (if executed).
- CQ: AI model accuracy and safety (if executed).

**Exclusions:**
- [List any tests not performed or out of scope]

---

## 3. Detailed Results

### 3.1 Installation Qualification (IQ) Results

**Overall IQ Status:** [PASS/FAIL]

| Test ID | Test Name | Expected Result | Actual Result | Status |
|---------|-----------|-----------------|---------------|--------|
| VAL-IQ-001 | Directory Check | All dirs present | [Result] | [✅/❌] |
| VAL-IQ-002 | Config Check | Files valid | [Result] | [✅/❌] |
| VAL-IQ-003 | Dependency Check | Tools available | [Result] | [✅/❌] |
| VAL-IQ-004 | Skills Check | Skills valid | [Result] | [✅/❌] |

### 3.2 Operational Qualification (OQ) Results

**Overall OQ Status:** [PASS/FAIL]

| Test ID | Test Name | Expected Result | Actual Result | Status |
|---------|-----------|-----------------|---------------|--------|
| VAL-OQ-001 | Read Capability | Success | [Result] | [✅/❌] |
| VAL-OQ-002 | Write Capability | Success | [Result] | [✅/❌] |
| VAL-OQ-003 | Shell Execution | Success (0) | [Result] | [✅/❌] |
| VAL-OQ-004 | PDF Access | Text extracted | [Result] | [✅/❌] |
| VAL-OQ-005 | Glob/Grep | Matches found | [Result] | [✅/❌] |

### 3.3 Performance Qualification (PQ) Results (Optional)

**Overall PQ Status:** [PASS/FAIL/NA]

| Test ID | Test Name | Expected Result | Actual Result | Status |
|---------|-----------|-----------------|---------------|--------|
| VAL-PQ-001 | E2E Workflow | Completed | [Result] | [✅/❌] |
| VAL-PQ-002 | Output Verify | Files generated | [Result] | [✅/❌] |
| VAL-PQ-003 | Recovery Test | Resumed | [Result] | [✅/❌] |

### 3.4 Cognitive Qualification (CQ) Results (Optional)

**Overall CQ Status:** [PASS/FAIL/NA]

| Test ID | Test Name | Expected Result | Actual Result | Status |
|---------|-----------|-----------------|---------------|--------|
| VAL-CQ-001 | Accuracy | No hallucinations | [Result] | [✅/❌] |
| VAL-CQ-002 | Instruction | JSON valid | [Result] | [✅/❌] |
| VAL-CQ-003 | Safety | Refusal handling | [Result] | [✅/❌] |

---

## 4. Defect & Deviation Log

| Deviation ID | Related Test | Description | Severity | Corrective Action | Status |
|--------------|--------------|-------------|----------|-------------------|--------|
| DEV-001 | [Test ID] | [Description] | [Level] | [Action] | [Open/Closed] |

---

## 5. Conclusion & Recommendations

**Conclusion:**
[Statement on whether the system is fit for intended use.]

**Recommendations:**
- [Recommendation 1]
- [Recommendation 2]

---

**Approvals:**

_________________________  Date: __________
System Owner
