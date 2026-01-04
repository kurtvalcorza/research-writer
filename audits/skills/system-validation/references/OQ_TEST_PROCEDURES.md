# Operational Qualification (OQ) Test Procedures

**Test ID Range:** VAL-OQ-001 through VAL-OQ-006

---

## VAL-OQ-001: Read Capability Test

**Objective:** Verify agent can read files correctly

**Expected Result:** Files read successfully with correct content

**Test Procedure:**
1. Read `README.md` (first 10 lines)
2. Verify content matches expected format
3. Test reading `.gitignore` (configuration file)
4. Test reading skill file (YAML + Markdown)

**Pass Criteria:**
- All files read without errors
- Content retrieved matches file structure
- Line numbers accurate (if using line-numbered read)

**Evidence:**
- Read operation logs
- Content hash verification

---

## VAL-OQ-002: Write Capability Test

**Objective:** Verify agent can write files correctly

**Expected Result:** Files created with correct content and permissions

**Test Procedure:**
1. Write test file: `outputs/validation_test_[timestamp].tmp`
2. Verify file created successfully
3. Read file back to verify content integrity
4. Delete test file
5. Verify deletion successful

**Pass Criteria:**
- File created successfully
- Content integrity verified (hash match)
- File deleted without errors
- No orphaned test files remain

**Evidence:**
- Write operation logs
- File creation/deletion timestamps

---

## VAL-OQ-003: Shell Execution Test

**Objective:** Verify shell command execution capabilities

**Expected Result:** Shell commands execute successfully

**Test Procedure:**
1. Execute simple echo command: `echo "System Check"`
2. Execute directory listing: `ls` or `dir`
3. Execute git status: `git status`
4. Test command chaining: `echo "test" && echo "success"`

**Pass Criteria:**
- All commands execute without errors
- Output captured correctly
- Exit codes properly detected

**Special Cases:**
- **Gemini CLI:** If shell test fails, check for `--yolo` flag requirement
- **Restricted Mode:** Document if shell access is limited

**Evidence:**
- Shell command execution logs
- Output verification

---

## VAL-OQ-004: PDF Access Test

**Objective:** Verify PDF reading capabilities

**Expected Result:** PDF files readable and parseable

**Test Procedure:**
1. Check if test PDFs exist in `corpus/`
2. Attempt to read PDF metadata (title, author, year)
3. Attempt to extract text from first page
4. Verify encoding handling (UTF-8, special characters)

**Pass Criteria:**
- PDF files accessible
- Metadata extractable
- Text extraction succeeds
- No encoding errors

**If No Test PDFs Available:**
- Mark test as N/A
- Document in validation report
- Recommend user add test PDF for full OQ

**Evidence:**
- PDF metadata extraction results
- Text extraction samples

---

## VAL-OQ-005: Glob/Grep Pattern Matching Test

**Objective:** Verify file search and pattern matching capabilities

**Expected Result:** Pattern matching tools work correctly

**Test Procedure:**
1. Test Glob: Find all `.md` files in `outputs/`
2. Test Glob: Find all skill files matching `skills/*/SKILL.md`
3. Test Grep: Search for specific pattern in README
4. Test Grep: Case-insensitive search

**Pass Criteria:**
- Glob returns correct file matches
- Grep finds expected patterns
- No false positives or missed matches

**Evidence:**
- Search results with file counts
- Pattern match verification

---

## VAL-OQ-006: OQ Summary Report Generation

**Objective:** Generate OQ summary with pass/fail determination

**Expected Result:** OQ report generated with tool capability matrix

**Test Procedure:**
1. Aggregate all OQ test results (VAL-OQ-001 through VAL-OQ-005)
2. Generate tool capability matrix:
   | Tool | Status | Evidence |
   |------|--------|----------|
   | Read | PASS | VAL-OQ-001 |
   | Write | PASS | VAL-OQ-002 |
   | Bash | PASS/RESTRICTED | VAL-OQ-003 |
   | PDF Access | PASS/N/A | VAL-OQ-004 |
   | Glob/Grep | PASS | VAL-OQ-005 |

3. Calculate OQ pass percentage
4. Document platform-specific limitations
5. Generate OQ certificate (if passed)

**Pass Criteria:**
- OQ Pass Percentage ≥80%
- Read, Write, Glob, Grep all PASS
- Bash PASS or RESTRICTED (documented)
- PDF Access PASS or N/A (documented)

**Evidence:**
- OQ Summary Report (`audits/VALIDATION_OQ_REPORT_[DATE].md`)
- Tool capability matrix

---

**End of OQ Test Procedures**
