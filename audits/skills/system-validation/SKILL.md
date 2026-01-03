---
name: system-integrity-validation
description: Performs Installation Qualification (IQ) and Operational Qualification (OQ) of the Research Writer environment. Validates file access, tool capabilities, and proper configuration (e.g., .gitignore, CLI permissions). Generates audit reports.
license: Apache-2.0
compatibility: Universal (Gemini, Claude, OpenAI)
allowed-tools: Read Write Edit Glob Grep Bash
---

# System Integrity Validation Agent

This skill automates the **Validation Protocol** for the Research Writer system, ensuring it is correctly installed (IQ) and operationally capable (OQ) before research begins.

---

## 1. Trigger

Activate this skill when:
- Setting up the system for the first time
- Troubleshooting "tool not found" or "file access" errors
- Switching between AI providers (e.g., Claude to Gemini)
- Verifying environment integrity after git updates

---

## 2. Objective

Produce a **Validation Report** that certifies:
- **Installation Qualification (IQ):** Required files, directories, and configurations are present.
- **Operational Qualification (OQ):** The agent can successfully read, write, and execute necessary commands.

---

## 3. Inputs

No specific inputs required. The agent inspects the current workspace environment.

---

## 4. Execution Steps

### Phase 1: Installation Qualification (IQ)

**Step 1: Directory Structure Verification**
- Check for existence of critical directories:
  - `corpus/`
  - `outputs/`
  - `templates/`
  - `prompts/`
  - `skills/`

**Step 2: Configuration Check**
- **.gitignore Analysis:**
  - Read `.gitignore`.
  - **CRITICAL CHECK:** Ensure `corpus/*.pdf` and `outputs/*.md` are **NOT** ignored (commented out or missing).
  - If ignored: Flag as Critical Failure (Agent cannot read/write data).
- **Template Check:**
  - Verify `template/screening-criteria-template.md` exists.
  - Check if it contains default "Example" text (requires customization) or is ready.

### Phase 2: Operational Qualification (OQ)

**Step 3: Tool Capability Test**
- **Read Test:** specific read of `README.md` (first 5 lines).
- **Write Test:** Write a small test file to `outputs/validation_test.tmp` and delete it.
- **Shell Test:** Execute `echo "System Check"` using `run_shell_command` (or `Bash`).
  - *Note:* If `run_shell_command` fails, flag as "Restricted Mode Error" (Suggest `--yolo` for Gemini).

### Phase 3: Reporting

**Step 4: Generate Validation Report**
- Create file: `audits/VALIDATION_REPORT_[YYYY-MM-DD].md`
- format:
  ```markdown
  # System Validation Report
  **Date:** [Date]
  **Agent:** [Agent Name]
  
  ## IQ Results
  - Directories: [PASS/FAIL]
  - Gitignore: [PASS/FAIL] (Must allow PDF/MD access)
  - Templates: [PASS/WARNING]
  
  ## OQ Results
  - Read Capability: [PASS/FAIL]
  - Write Capability: [PASS/FAIL]
  - Shell Capability: [PASS/FAIL] (Critical for some skills)
  
  ## Summary
  [PASS/FAIL]
  ```

**Step 5: Audit Log Update**
- Append entry to `audits/README.md` in the "Audit History" table.

---

## 5. Constraints & Troubleshooting

### Critical Failures (Stop Work)
- **Blocked File Access:** If `.gitignore` blocks `corpus/`, the agent is blind. **Fix:** User must modify `.gitignore`.
- **Missing Write Permission:** If Write Test fails, the agent cannot generate outputs. **Fix:** Check OS permissions or CLI "Safe Mode".
- **Missing Shell:** If Shell Test fails, some advanced skills (Git operations) may fail. **Fix:** Use `--yolo` (Gemini) or check extension installation.

### Conservative Defaults
- If a tool fails (e.g., Shell), do NOT crash. Log it as a generic failure in the report and propose the standard fix (e.g., "Enable --yolo flag").

---

## 6. Intended Use

Use this skill as a "Self-Test" mechanism. It mimics the behavior of complex skills (Phase 1-7) to catch configuration issues early.

**End of SKILL Definition**
