# Installation Qualification (IQ) Test Procedures

## Overview
These procedures verify that the Research Writer environment is correctly installed, configured, and capable of supporting research operations.

**Pass Criteria:**
- IQ Pass Rate ≥ 90%
- Zero critical failures

---

## VAL-IQ-001: Directory Structure Verification

**Objective:** Verify essential project directories exist.

**Procedure:**
1. List the root directory contents.
2. Verify existence of the following directories:
   - `corpus/`
   - `outputs/`
   - `template/`
   - `quick-start/`
   - `skills/`
   - `audits/`
   - `interface/`

**Pass Criteria:**
- All listed directories are present.

**Critical Failure:**
- Missing `corpus/`, `outputs/`, or `skills/` directory.

---

## VAL-IQ-002: Configuration File Validation

**Objective:** Verify essential configuration files are present and valid.

**Procedure:**
1. Check for existence of `.gitignore`.
2. Check for existence of `template/screening-criteria-template.md`.
3. Verify `.gitignore` contains strict exclusion rules (e.g., `!.gitignore`, `!README.md`).

**Pass Criteria:**
- Files exist.
- `.gitignore` is not empty.

**Critical Failure:**
- `.gitignore` missing or blocking critical files.

---

## VAL-IQ-003: Dependency Verification

**Objective:** Confirm availability of external tools and libraries.

**Procedure:**
1. Check for Python installation (if using local execution).
2. Check for Git availability.
3. Check for specific PDF parsing libraries if applicable to the platform.

**Pass Criteria:**
- Tools return version information without error.

---

## VAL-IQ-004: Skills Integrity Check

**Objective:** Ensure all skill definitions are present and valid.

**Procedure:**
1. Verify existence of `skills/01_literature-discovery/SKILL.md`.
2. Verify existence of `audits/skills/system-validation/SKILL.md`.
3. Check that files contain valid YAML frontmatter.

**Pass Criteria:**
- Skill files exist.
- YAML frontmatter is parseable.

**Critical Failure:**
- Missing `system-validation` or `literature-discovery` skill files.

---

## VAL-IQ-005: IQ Summary Report Generation

**Objective:** Consolidate IQ results into a report.

**Procedure:**
1. Aggregate results from VAL-IQ-001 through VAL-IQ-004.
2. Calculate pass rate.
3. Generate `audits/reports/VALIDATION_IQ_REPORT_[DATE].md`.

**Pass Criteria:**
- Report generated successfully.
