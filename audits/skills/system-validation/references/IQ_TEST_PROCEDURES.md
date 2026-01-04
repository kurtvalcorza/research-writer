# Installation Qualification (IQ) Test Procedures

**Test ID Range:** VAL-IQ-001 through VAL-IQ-005

---

## VAL-IQ-001: Directory Structure Verification

**Objective:** Verify required directories exist with correct permissions

**Expected Result:** All critical directories present and accessible

**Test Procedure:**
1. Check for existence of critical directories:
   - `corpus/` (research PDFs)
   - `outputs/` (generated reports)
   - `settings/` (screening criteria)
   - `quick-start/` (execution quick-start)
   - `skills/` (skill definitions)
   - `audits/` (validation reports)

2. Verify directory permissions (read/write access)

3. Document missing directories in deviation log

**Pass Criteria:**
- All 6 directories exist
- All directories are readable and writable
- No permission errors encountered

**Evidence:**
- Directory listing with timestamps
- Permission verification output

---

## VAL-IQ-002: Configuration File Validation

**Objective:** Verify configuration files exist and are properly formatted

**Expected Result:** All configuration files present and valid

**Test Procedure:**
1. Verify `.gitignore` exists
2. **CRITICAL CHECK:** Ensure `corpus/*.pdf` and `outputs/*.md` are NOT ignored
3. Verify `settings/screening-criteria-template.md` exists
4. Check if template contains customizable sections

**Pass Criteria:**
- `.gitignore` exists and allows corpus/output access
- Template file exists with required sections:
  - Research Context
  - Inclusion Criteria
  - Exclusion Criteria
  - Edge Cases and Decision Rules

**Critical Failure:** If `.gitignore` blocks corpus access → Flag as IQ FAILURE

**Evidence:**
- `.gitignore` content snapshot
- Template file structure verification

---

## VAL-IQ-003: Dependency Verification

**Objective:** Verify required dependencies are installed

**Expected Result:** All dependencies available and correct versions

**Test Procedure:**
1. Check Python installation (if applicable)
2. Verify PDF processing libraries (PyPDF2, pdfplumber)
3. Check Node.js installation (for web interface, if used)
4. Verify Git installation and configuration

**Pass Criteria:**
- Python ≥3.8 installed (if required)
- PDF libraries accessible
- Git configured with valid credentials

**Evidence:**
- Dependency version report
- Import test results

---

## VAL-IQ-004: Skills Integrity Check

**Objective:** Verify all skill files are present and parseable

**Expected Result:** All 7 phase skills accessible and valid YAML frontmatter

**Test Procedure:**
1. Enumerate all skill files in `skills/` directory
2. Verify YAML frontmatter validity
3. Check `allowed-tools` declarations
4. Verify skill descriptions match execution models

**Pass Criteria:**
- All phase skills (01-07) present
- YAML frontmatter valid in all files
- No broken references or missing dependencies

**Evidence:**
- Skill inventory with checksums
- YAML validation report

---

## VAL-IQ-005: IQ Summary Report Generation

**Objective:** Generate IQ summary with pass/fail determination

**Expected Result:** IQ report generated with clear status

**Test Procedure:**
1. Aggregate all IQ test results (VAL-IQ-001 through VAL-IQ-004)
2. Calculate IQ pass percentage
3. Document all deviations and critical failures
4. Generate IQ certificate (if passed)

**Pass Criteria:**
- IQ Pass Percentage ≥90%
- Zero critical failures
- All deviations documented with remediation plans

**Evidence:**
- IQ Summary Report (`audits/VALIDATION_IQ_REPORT_[DATE].md`)

---

**End of IQ Test Procedures**
