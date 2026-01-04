---
name: system-validation
description: Performs comprehensive IQ/OQ/PQ/CQ validation of the Research Writer environment. Validates infrastructure integrity ensuring file access and tool capabilities, and cognitive integrity ensuring model accuracy, instruction adherence, and safety.
license: Apache-2.0
compatibility: Universal (Claude Code, Gemini CLI, OpenAI, Anthropic API)
allowed-tools: Read Write Edit Glob Grep Bash
validation-standard: IEEE 829 (Test Docs), ISO 9001 (Quality), NIST AI RMF (AI Safety)
---

# System Validation Skill

This skill automates the **IQ/OQ/PQ/CQ Validation Protocol** for the Research Writer system, ensuring production-ready quality before research begins.

**Note:** While this validation approach follows industry best practices used in regulated environments (pharmaceutical, medical device software), it is **not required** for typical research use. Use the level of validation appropriate for your needs—basic IQ/OQ for general use, full IQ/OQ/PQ/CQ for production or high-stakes research.

**Validation Approach:**
- **IQ (Installation Qualification):** Verify correct installation and configuration
- **OQ (Operational Qualification):** Verify system operates as intended
- **PQ (Performance Qualification):** Verify system performs correctly in real-world use
- **CQ (Cognitive Qualification):** Verify AI model accuracy, safety, and consistency

---

## 1. Trigger

Activate this skill when:
- **First-time setup:** Initial installation validation
- **Platform migration:** Switching between AI providers (Claude Code, Gemini CLI, etc.)
- **Post-update validation:** After git updates or dependency changes
- **Troubleshooting:** "Tool not found", "File access denied", or execution errors
- **Quality assurance:** Pre-research validation for production use
- **Multi-platform testing:** Cross-platform compatibility verification

---

## 2. Objective

Produce a **professional-grade Validation Report** (IEEE 829 compliant) that certifies the Research Writer system is production-ready across four qualification areas:

**Installation Qualification (IQ):** Environment setup correct
**Operational Qualification (OQ):** Tools function properly
**Performance Qualification (PQ):** Workflows execute successfully
**Cognitive Qualification (CQ):** AI behavior is accurate and safe

---

## 3. Inputs

**Required:**
- Current workspace directory (auto-detected)

**Optional:**
- `--platform`: Specify platform being tested (claude-code-cli, gemini-cli, claude-code-desktop, etc.)
- `--test-corpus`: Path to minimal test corpus (3-5 PDFs for PQ validation)
- `--compliance-mode`: Enable full IQ/OQ/PQ/CQ with evidence generation (default: IQ/OQ only)

---

## 4. Execution Steps

### PHASE 1: Installation Qualification (IQ)

**Objective:** Verify environment is correctly installed and configured

**Test Checklist:**
- [ ] VAL-IQ-001: Directory structure verification (corpus, outputs, template, quick-start, skills, audits)
- [ ] VAL-IQ-002: Configuration file validation (.gitignore, screening template)
- [ ] VAL-IQ-003: Dependency verification (Python, PDF libraries, Git)
- [ ] VAL-IQ-004: Skills integrity check (all 7 phase skills present with valid YAML)
- [ ] VAL-IQ-005: IQ summary report generation

**Detailed Procedures:** See `references/IQ_TEST_PROCEDURES.md`

**Pass Criteria:** IQ Pass Rate ≥90%, zero critical failures


**Actions:**
1. Execute each test in sequence
2. Document results in IQ test table
3. Calculate IQ pass percentage
4. Generate IQ summary report: `audits/reports/VALIDATION_IQ_REPORT_[DATE].md`

---

### PHASE 2: Operational Qualification (OQ)

**Objective:** Verify all required tools function correctly

**Test Checklist:**
- [ ] VAL-OQ-001: Read capability test (README.md, .gitignore, skill files)
- [ ] VAL-OQ-002: Write capability test (create, verify, delete temp file)
- [ ] VAL-OQ-003: Shell execution test (echo, ls/dir, git status)
- [ ] VAL-OQ-004: PDF access test (read metadata, extract text)
- [ ] VAL-OQ-005: Glob/Grep pattern matching test (search .md files, search patterns)
- [ ] VAL-OQ-006: OQ summary with tool capability matrix

**Detailed Procedures:** See `references/OQ_TEST_PROCEDURES.md`

**Pass Criteria:** OQ Pass Rate ≥80%, Read/Write/Glob/Grep must PASS, Bash can be RESTRICTED

**Platform-Specific Notes:** See `references/PLATFORM_CONSIDERATIONS.md`

**Actions:**
1. Execute each test in sequence
2. Document results in OQ test table with tool capability matrix
3. Calculate OQ pass percentage
4. Generate OQ summary report: `audits/reports/VALIDATION_OQ_REPORT_[DATE].md`

---

### PHASE 3: Performance Qualification (PQ) [Optional]

**Objective:** Verify workflows execute successfully in production-like conditions

**Prerequisites:**
- Test corpus with 3-5 PDFs in `corpus/`
- Screening criteria template customized

**Test Checklist:**
- [ ] VAL-PQ-001: End-to-end Phase 1 workflow test (full 3-pass execution)
- [ ] VAL-PQ-002: State management & interruption recovery test
- [ ] VAL-PQ-003: Cross-platform compatibility test (if multi-platform validation)

**Detailed Procedures:** See `references/PQ_TEST_PROCEDURES.md`

**Pass Criteria:** PQ Pass Rate ≥80%, all outputs generated, PRISMA compliance verified

**Actions:**
1. Execute Phase 1 skill with test corpus
2. Verify all output files generated (screening-triage, screening-progress, screening-matrix, prisma-flow)
3. Test interruption recovery (optional)
4. Compare outputs across platforms (if applicable)
5. Generate PQ summary report: `audits/reports/VALIDATION_PQ_REPORT_[DATE].md`

---

### PHASE 4: Cognitive Qualification (CQ) [Optional - AI Models Only]

**Objective:** Verify AI model behavior is accurate, safe, and unbiased

**Note:** Skip this phase if using traditional deterministic software without AI.

**Test Checklist:**
- [ ] VAL-CQ-001: Groundedness & accuracy test (hallucination check)
- [ ] VAL-CQ-002: Instruction following / format test (JSON compliance)
- [ ] VAL-CQ-003: Safety & refusal test (red teaming)
- [ ] VAL-CQ-004: Output consistency test (optional, 3 runs comparison)
- [ ] VAL-CQ-005: Bias & fairness test (optional, requires diverse corpus)

**Detailed Procedures:** See `references/CQ_TEST_PROCEDURES.md`

**Pass Criteria:** CQ Pass Rate ≥80%, mandatory tests (001-003) must PASS

**Actions:**
1. Execute mandatory CQ tests (VAL-CQ-001 through VAL-CQ-003)
2. Optionally execute VAL-CQ-004 and VAL-CQ-005 for comprehensive validation
3. Document AI model behavior and any safety concerns
4. Generate CQ summary report: `audits/reports/VALIDATION_CQ_REPORT_[DATE].md`

---

### PHASE 5: Validation Report Generation

**Objective:** Automatically generate comprehensive validation report with traceability and evidence

**Prerequisites:** All IQ/OQ/PQ/CQ tests completed and results collected

**Actions:**

#### Step 1: Prepare Test Summary Data
1. Review all test results from conversation history (IQ, OQ, PQ, CQ phases)
2. For each phase, compile:
   - Test ID, Test Name, Expected Result, Actual Result, Status (✅ PASS / ❌ FAIL / ⚠️ RESTRICTED / N/A)
   - Pass rate percentage
   - Any deviations or critical failures

#### Step 2: Write Main Validation Report
**REQUIRED:** Create file `audits/reports/VALIDATION_REPORT_[YYYY-MM-DD].md`

1. Use template structure from `references/REPORT_TEMPLATE.md`
2. Fill in all placeholders with actual values:
   - **Executive Summary:** Overall status, pass rates, critical issues count
   - **Section 3.1 (IQ Results):** Complete IQ test table with actual results
   - **Section 3.2 (OQ Results):** Complete OQ test table with actual results
   - **Section 3.3 (PQ Results):** Complete PQ test table (if PQ was executed)
   - **Section 3.4 (CQ Results):** Complete CQ test table (if CQ was executed)
   - **Section 5 (Deviations):** Document all deviations with severity and corrective actions
   - **Section 8 (Conclusion):** Final validation status and production readiness

3. Calculate and include:
   - IQ Pass Rate: (# passed IQ tests) / (# total IQ tests) × 100%
   - OQ Pass Rate: (# passed OQ tests) / (# total OQ tests) × 100%
   - PQ Pass Rate: (# passed PQ tests) / (# total PQ tests) × 100% (if applicable)
   - CQ Pass Rate: (# passed CQ tests) / (# total CQ tests) × 100% (if applicable)
   - Overall Status: PASS (if all pass rates meet criteria) | FAIL | PASS WITH DEVIATIONS

#### Step 3: Write Traceability Matrix
**REQUIRED:** Create file `audits/matrices/VALIDATION_TRACEABILITY_MATRIX_[YYYY-MM-DD].md`

1. Use template from `references/TRACEABILITY_MATRIX_TEMPLATE.md`
2. Fill in all requirement rows with actual test results:
   - Map each requirement (REQ-IQ-001, REQ-OQ-001, etc.) to its test ID
   - Mark status: ✅ PASS / ❌ FAIL / N/A
   - Link to evidence (test output, deviation ID)

3. Calculate coverage:
   - Total Requirements: [count]
   - Requirements Tested: [count]
   - Requirements Passed: [count]
   - Test Coverage: [percentage]%

#### Step 4: Create Evidence Archive Directory
**REQUIRED:** Create directory `audits/validation-evidence/[YYYY-MM-DD]/`

1. Create the directory structure
2. Save test results as structured data (JSON or markdown):
   - `IQ_results_[timestamp].json` (or .md)
   - `OQ_results_[timestamp].json` (or .md)
   - `PQ_results_[timestamp].json` (if applicable)
   - `CQ_results_[timestamp].json` (if applicable)

3. Optional: Create execution log capturing all test commands and outputs

#### Step 5: Generate Validation Summary
After all files are created, provide user with:

1. **Validation completion confirmation:**
   ```
   ✅ System Validation Complete

   Overall Status: [PASS | FAIL | PASS WITH DEVIATIONS]
   IQ Pass Rate: [X%]
   OQ Pass Rate: [X%]
   PQ Pass Rate: [X%] (if applicable)
   CQ Pass Rate: [X%] (if applicable)

   Reports Generated:
   - audits/reports/VALIDATION_REPORT_[DATE].md
   - audits/matrices/VALIDATION_TRACEABILITY_MATRIX_[DATE].md
   - audits/validation-evidence/[DATE]/ (evidence archive)
   ```

2. **Next steps recommendation:**
   - If PASS: "System is production-ready. Proceed with research work."
   - If FAIL: "Critical issues detected. Review deviations and apply corrective actions before production use."
   - If PASS WITH DEVIATIONS: "System operational with noted limitations. Review restrictions in validation report."

**Pass Criteria for Phase 5:**
- ✅ Main validation report created with all sections complete
- ✅ Traceability matrix created with all requirements mapped
- ✅ Evidence archive directory created
- ✅ Overall validation status calculated and documented

---

## 5. Output Structure

### Generated Files

**Main Report:**
- `audits/reports/VALIDATION_REPORT_[YYYY-MM-DD].md` - Comprehensive validation report

**Detailed Reports:**
- `audits/reports/VALIDATION_IQ_REPORT_[YYYY-MM-DD].md` - IQ test results
- `audits/reports/VALIDATION_OQ_REPORT_[YYYY-MM-DD].md` - OQ test results
- `audits/reports/VALIDATION_PQ_REPORT_[YYYY-MM-DD].md` - PQ test results (optional)
- `audits/reports/VALIDATION_CQ_REPORT_[YYYY-MM-DD].md` - CQ test results (optional)

**Traceability:**
- `audits/matrices/VALIDATION_TRACEABILITY_MATRIX_[YYYY-MM-DD].md` - Requirements-to-tests mapping

**Evidence Archive:**
- `audits/validation-evidence/[YYYY-MM-DD]/` - All evidence artifacts



---

## 6. Constraints & Safety Measures

### Critical Failure Handling

**If ANY critical test fails, STOP validation and document:**
1. Test ID that failed
2. Expected vs. actual result
3. Root cause (if determinable)
4. Recommended corrective action
5. Impact on production readiness

**Critical Failures:**
- `.gitignore` blocks corpus access → Flag as IQ FAILURE
- Write operations fail → Flag as OQ FAILURE
- Required directories missing → Flag as IQ FAILURE
- Skills integrity check fails → Flag as IQ FAILURE

### Conservative Defaults

- **When uncertain:** Flag as UNCERTAIN, not FAIL
- **Platform limitations:** Document as RESTRICTED, not FAIL
- **Missing test data:** Mark as N/A with recommendation for future testing

### Deviation Management

- Document ALL deviations from expected results
- Assign severity: CRITICAL | HIGH | MEDIUM | LOW
- Propose corrective actions with priorities
- Track deviation closure status

---

## 7. Quality Standards & Audit Trail

**This validation protocol aligns with:**
- **IEEE 829:** Software test documentation standard
- **ISO 9001:** Quality management systems
- **ISO/IEC 25010:** Software quality model
- **NIST AI RMF:** AI Risk Management Framework (for CQ tests)
- **RAGAS:** Retrieval Augmented Generation Assessment (for CQ tests)

**For regulated environments (FDA, GxP):**
This approach is compatible with FDA 21 CFR Part 11, ISO 13485, and GxP guidelines. Consult your quality team for specific compliance requirements.

**Audit Trail Requirements:**
- All tests uniquely identified (Test IDs)
- All results timestamped
- All evidence preserved
- All deviations documented
- Traceability maintained end-to-end

**Evidence Retention:** Project lifecycle + 5 years (recommended, adjust per institutional policy)

---

## 8. Example Invocations

### Basic Validation (IQ/OQ Only)
```
Execute audits/skills/system-validation/SKILL.md
```

### Full Validation (IQ/OQ/PQ/CQ)
```
Execute audits/skills/system-validation/SKILL.md with:
- compliance-mode: true
- test-corpus: corpus/ (ensure 3-5 test PDFs present)
- platform: claude-code-desktop
```

### Multi-Platform Validation
```
For each platform (Claude Code Desktop, Gemini CLI, etc.):
1. Execute full validation (IQ/OQ/PQ/CQ)
2. Generate platform-specific validation report
3. Compare results across platforms
4. Generate multi-platform summary report
```

---

## 9. Limitations & Scope

**This skill validates:**
- Environment setup and configuration
- Tool availability and functionality
- Basic workflow execution (with test corpus)
- Cross-platform compatibility
- Cognitive integrity (Model accuracy & safety)

**This skill does NOT validate:**
- Scientific accuracy of screening decisions
- Quality of research outputs
- Correctness of PRISMA methodology
- Performance under stress (large corpora >50 PDFs)
- Security vulnerabilities
- Network-dependent operations

**For comprehensive validation, supplement with:**
- User acceptance testing (UAT)
- Security audit
- Performance testing with large corpora
- Scientific peer review

---

## 10. References

**Detailed Test Procedures:**
- `references/IQ_TEST_PROCEDURES.md` - Installation Qualification tests
- `references/OQ_TEST_PROCEDURES.md` - Operational Qualification tests
- `references/PQ_TEST_PROCEDURES.md` - Performance Qualification tests
- `references/CQ_TEST_PROCEDURES.md` - Cognitive Qualification tests

**Templates:**
- `references/REPORT_TEMPLATE.md` - Validation report structure
- `references/TRACEABILITY_MATRIX_TEMPLATE.md` - Requirements mapping

**Platform Guidance:**
- `references/PLATFORM_CONSIDERATIONS.md` - Platform-specific setup and troubleshooting

---

## 11. Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2026-01-04 | Initial IQ/OQ/PQ validation protocol | Research Writer Team |
| 1.1 | 2026-01-04 | Added CQ (Cognitive Qualification) for AI validation | Gemini + Claude Collaboration |
| 1.2 | 2026-01-04 | Enhanced CQ with consistency and bias tests (VAL-CQ-004, VAL-CQ-005) | Claude Sonnet 4.5 |
| 2.0 | 2026-01-04 | Restructured for progressive disclosure, modular references | Claude Sonnet 4.5 |
| 2.1 | 2026-01-04 | Enhanced Phase 5 with explicit automatic report generation | Claude Sonnet 4.5 |

---

**End of SKILL Definition**
