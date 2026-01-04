# Operational Qualification (OQ) Test Procedures

## Overview
These procedures verify that the AI agent has the necessary operational capabilities (tools, file access, execution permissions) to perform its tasks.

**Pass Criteria:**
- OQ Pass Rate ≥ 80%
- Read/Write/Glob/Grep must PASS
- Bash can be RESTRICTED (depending on platform)

---

## VAL-OQ-001: Read Capability Test

**Objective:** Verify the agent can read files from the workspace.

**Procedure:**
1. Attempt to read `README.md` (first 10 lines).
2. Attempt to read `.gitignore` (full content).

**Pass Criteria:**
- Content is retrieved successfully.
- No "permission denied" or "file not found" errors for existing files.

---

## VAL-OQ-002: Write Capability Test

**Objective:** Verify the agent can create and delete files.

**Procedure:**
1. Create a file `OQ_TEST_[TIMESTAMP].txt` with content "Write test successful".
2. Verify file existence.
3. Delete the file.
4. Verify file absence.

**Pass Criteria:**
- File created, verified, and deleted successfully.

**Critical Failure:**
- Inability to write files.

---

## VAL-OQ-003: Shell Execution Test

**Objective:** Verify the agent can execute shell commands.

**Procedure:**
1. Execute `echo "Hello World"`.
2. Execute `ls -la` (or `dir` on Windows).
3. Execute `git status`.

**Pass Criteria:**
- Commands return expected output (stdout).
- Exit code 0.

**Allowed Deviation:**
- If platform forbids shell execution (e.g., restricted API mode), mark as **RESTRICTED**. This is not a failure if the platform is known to be restricted.

---

## VAL-OQ-004: PDF Access Test

**Objective:** Verify the agent can read binary/PDF files.

**Procedure:**
1. Attempt to read a sample PDF from `corpus/` (if available) or `examples/`.
2. Extract text from the first page (simulated or actual).

**Pass Criteria:**
- Tool successfully accesses the file.
- No binary garbage output (should be handled by PDF reading tool).

---

## VAL-OQ-005: Glob/Grep Pattern Matching Test

**Objective:** Verify search capabilities.

**Procedure:**
1. Use glob to find all `.md` files in `skills/`.
2. Use grep to find the string "system-validation" in `audits/`.

**Pass Criteria:**
- Glob returns list of markdown files.
- Grep finds the expected string in the SKILL.md file.

---

## VAL-OQ-006: OQ Summary Report Generation

**Objective:** Consolidate OQ results.

**Procedure:**
1. Aggregate results from VAL-OQ-001 through VAL-OQ-005.
2. Generate `audits/reports/VALIDATION_OQ_REPORT_[DATE].md`.

**Pass Criteria:**
- Report generated successfully.
