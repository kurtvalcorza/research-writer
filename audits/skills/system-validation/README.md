# System Validation Skill

**Version:** 2.1
**Last Updated:** 2026-01-04
**License:** Apache-2.0
**Compatibility:** Universal (Claude Code, Gemini CLI, OpenAI, Anthropic API)

---

## Overview

The **System Validation Skill** provides a comprehensive IQ/OQ/PQ/CQ validation framework for the Research Writer system, ensuring production-ready quality before research work begins.

This skill automates professional-grade validation testing following industry standards (IEEE 829, ISO 9001, NIST AI RMF) commonly used in regulated environments, adapted for AI-assisted research workflows.

---

## What This Skill Does

**Validates four critical areas:**

1. **IQ (Installation Qualification):** Verifies environment setup is correct
   - Directory structure, configuration files, dependencies, skills integrity

2. **OQ (Operational Qualification):** Verifies tools function properly
   - Read, Write, Bash, PDF access, Glob/Grep pattern matching

3. **PQ (Performance Qualification):** Verifies workflows execute successfully
   - End-to-end Phase 1 execution, state management, cross-platform compatibility

4. **CQ (Cognitive Qualification):** Verifies AI model behavior is accurate and safe
   - Groundedness (no hallucinations), instruction following, safety/refusal, consistency, bias detection

**Automatically Generates:**
- 📄 **Main Validation Report** (`audits/reports/VALIDATION_REPORT_[DATE].md`) - Complete IEEE 829-compliant report with executive summary, test results, deviations, and recommendations
- 🔗 **Traceability Matrix** (`audits/matrices/VALIDATION_TRACEABILITY_MATRIX_[DATE].md`) - Requirements-to-tests mapping with coverage analysis
- 📁 **Evidence Archive** (`audits/validation-evidence/[DATE]/`) - Structured test results and execution logs

---

## When to Use This Skill

✅ **First-time setup** - Validate your Research Writer installation
✅ **Platform migration** - Switching between Claude Code, Gemini CLI, etc.
✅ **Post-update validation** - After git updates or dependency changes
✅ **Troubleshooting** - Diagnosing "Tool not found" or file access errors
✅ **Quality assurance** - Pre-research validation for production use
✅ **Multi-platform testing** - Cross-platform compatibility verification

---

## Quick Start

### Basic Validation (IQ/OQ Only)

**Recommended for:** First-time users, general troubleshooting

```bash
Execute audits/skills/system-validation/SKILL.md
```

**Duration:** ~10-15 minutes
**Tests:** Directory structure, configuration, tool availability

---

### Full Validation (IQ/OQ/PQ/CQ)

**Recommended for:** Production deployment, multi-platform validation, compliance needs

```bash
Execute audits/skills/system-validation/SKILL.md with:
- compliance-mode: true
- test-corpus: corpus/ (ensure 3-5 test PDFs present)
- platform: claude-code-desktop
```

**Duration:** ~45-60 minutes
**Tests:** Full installation + operational + performance + cognitive testing

**Output:** Generates formal validation report automatically at completion

---

## Automatic Report Generation

Upon completion, the skill **automatically generates** a comprehensive validation package:

### 📄 Main Validation Report
**File:** `audits/reports/VALIDATION_REPORT_[YYYY-MM-DD].md`

**Contents:**
- Executive Summary (overall status, pass rates, critical issues)
- Test Environment details (OS, platform, dependencies)
- Complete test results tables for IQ/OQ/PQ/CQ phases
- Traceability section
- Deviations & corrective actions
- Risk assessment
- Recommendations
- Approval signatures
- Evidence artifacts list

**Format:** IEEE 829-compliant with 10 structured sections

### 🔗 Traceability Matrix
**File:** `audits/matrices/VALIDATION_TRACEABILITY_MATRIX_[YYYY-MM-DD].md`

**Contents:**
- Requirements-to-tests mapping (23 requirements)
- Test coverage analysis
- Status tracking (PASS/FAIL/N/A)
- Evidence linking

### 📁 Evidence Archive
**Directory:** `audits/validation-evidence/[YYYY-MM-DD]/`

**Contents:**
- `IQ_results_[timestamp].json` - Installation Qualification test data
- `OQ_results_[timestamp].json` - Operational Qualification test data
- `PQ_results_[timestamp].json` - Performance Qualification test data (if applicable)
- `CQ_results_[timestamp].json` - Cognitive Qualification test data (if applicable)
- Execution logs and supporting evidence

### ✅ Validation Summary
The skill provides a final summary upon completion:

```
✅ System Validation Complete

Overall Status: PASS
IQ Pass Rate: 100%
OQ Pass Rate: 100%
PQ Pass Rate: 100%
CQ Pass Rate: 100%

Reports Generated:
- audits/reports/VALIDATION_REPORT_2026-01-04.md
- audits/matrices/VALIDATION_TRACEABILITY_MATRIX_2026-01-04.md
- audits/validation-evidence/2026-01-04/ (evidence archive)

System is production-ready. Proceed with research work.
```

---

## File Structure

```
system-validation/
├── SKILL.md                          # Main skill definition (execute this)
├── README.md                         # This file
└── references/                       # Detailed procedures and templates
    ├── IQ_TEST_PROCEDURES.md         # Installation Qualification tests
    ├── OQ_TEST_PROCEDURES.md         # Operational Qualification tests
    ├── PQ_TEST_PROCEDURES.md         # Performance Qualification tests
    ├── CQ_TEST_PROCEDURES.md         # Cognitive Qualification tests
    ├── REPORT_TEMPLATE.md            # Validation report structure
    ├── TRACEABILITY_MATRIX_TEMPLATE.md  # Requirements mapping
    └── PLATFORM_CONSIDERATIONS.md    # Platform-specific guidance
```

**Design Philosophy:** Progressive disclosure - main SKILL.md is concise and executable (~350 lines), detailed procedures loaded on demand from `references/`.

---

## Validation Phases Explained

### Phase 1: Installation Qualification (IQ)

**What it tests:** Environment is correctly set up

**Test IDs:** VAL-IQ-001 through VAL-IQ-005

**Key Checks:**
- ✅ Required directories exist (`corpus/`, `outputs/`, `settings/`, `quick-start/`, `skills/`, `audits/`)
- ✅ `.gitignore` configured correctly (doesn't block corpus access)
- ✅ Screening criteria template present with required sections
- ✅ Dependencies installed (Python, PDF libraries, Git)
- ✅ All 7 phase skills present with valid YAML frontmatter

**Pass Criteria:** ≥90% pass rate, zero critical failures

---

### Phase 2: Operational Qualification (OQ)

**What it tests:** Tools function correctly

**Test IDs:** VAL-OQ-001 through VAL-OQ-006

**Key Checks:**
- ✅ Read capability (README, .gitignore, skill files)
- ✅ Write capability (create/verify/delete temp file)
- ✅ Shell execution (echo, ls/dir, git status)
- ✅ PDF access (read metadata, extract text)
- ✅ Glob/Grep pattern matching

**Pass Criteria:** ≥80% pass rate, Read/Write/Glob/Grep must PASS, Bash can be RESTRICTED

**Platform Notes:** Gemini CLI requires `--yolo` flag for shell access. See `references/PLATFORM_CONSIDERATIONS.md`.

---

### Phase 3: Performance Qualification (PQ) [Optional]

**What it tests:** Workflows execute successfully in production conditions

**Test IDs:** VAL-PQ-001 through VAL-PQ-003

**Key Checks:**
- ✅ End-to-end Phase 1 workflow (3-pass execution with test corpus)
- ✅ State management & interruption recovery
- ✅ Cross-platform compatibility (if multi-platform validation)

**Pass Criteria:** ≥80% pass rate, all outputs generated, PRISMA compliance verified

**Prerequisites:** Test corpus with 3-5 PDFs in `corpus/`, screening criteria customized

---

### Phase 4: Cognitive Qualification (CQ) [Optional - AI Models Only]

**What it tests:** AI model behavior is accurate, safe, and unbiased

**Test IDs:** VAL-CQ-001 through VAL-CQ-005

**Key Checks:**
- ✅ Groundedness (no hallucinations - queries non-existent files)
- ✅ Instruction following (strict JSON format compliance)
- ✅ Safety & refusal (red teaming - resists adversarial quick-start)
- ⚠️ Output consistency (optional - 3 runs comparison)
- ⚠️ Bias detection (optional - requires diverse corpus)

**Pass Criteria:** ≥80% pass rate, mandatory tests (001-003) must PASS

**Note:** Skip CQ entirely if using traditional deterministic software without AI.

---

## Generated Outputs

After validation, the following files are generated:

### Main Report
- `audits/reports/VALIDATION_REPORT_[DATE].md` - Comprehensive validation report

### Detailed Reports
- `audits/reports/VALIDATION_IQ_REPORT_[DATE].md` - Installation Qualification results
- `audits/reports/VALIDATION_OQ_REPORT_[DATE].md` - Operational Qualification results
- `audits/reports/VALIDATION_PQ_REPORT_[DATE].md` - Performance Qualification results (if applicable)
- `audits/reports/VALIDATION_CQ_REPORT_[DATE].md` - Cognitive Qualification results (if applicable)

### Traceability
- `audits/matrices/VALIDATION_TRACEABILITY_MATRIX_[DATE].md` - Requirements-to-tests mapping

### Evidence Archive
- `audits/validation-evidence/[DATE]/` - All test artifacts (JSON results, logs, output archives)

---

## Platform-Specific Setup

### Claude Code Desktop
**Setup:** None required
**Command:** `Execute audits/skills/system-validation/SKILL.md`
**Notes:** Most seamless experience, full tool support out-of-the-box

---

### Gemini CLI
**Setup:** Install `conductor` extension, use `--yolo` flag
**Command:** `gemini --yolo -p "Execute audits/skills/system-validation/SKILL.md"`
**Notes:** Shell execution disabled by default (safe mode)

---

### Claude Code CLI
**Setup:** None required
**Command:** `claude --print "Execute audits/skills/system-validation/SKILL.md"`
**Notes:** Incremental workflow design prevents context overflow

---

### Other Platforms
See `references/PLATFORM_CONSIDERATIONS.md` for Anthropic API, OpenAI API, and custom agent implementations.

---

## Compliance & Standards

This validation protocol aligns with:

- **IEEE 829** - Software Test Documentation Standard
- **ISO 9001** - Quality Management Systems
- **ISO/IEC 25010** - Software Quality Model
- **NIST AI RMF** - AI Risk Management Framework (for CQ tests)
- **RAGAS** - Retrieval Augmented Generation Assessment (for CQ tests)

**For regulated environments (FDA, GxP):**
This approach is compatible with FDA 21 CFR Part 11, ISO 13485, and GxP guidelines. Consult your quality team for specific compliance requirements.

---

## Frequently Asked Questions

### Do I need to run all phases?

**No.** Choose the validation level appropriate for your needs:

- **IQ/OQ only** (basic, ~15 min): First-time setup, general troubleshooting
- **IQ/OQ/PQ** (full, ~45 min): Production deployment, multi-platform validation
- **IQ/OQ/PQ/CQ** (comprehensive, ~60 min): High-stakes research, compliance needs, AI safety validation

### What if a test fails?

The skill uses **conservative defaults**:

- **Critical failures** (e.g., .gitignore blocks corpus) → STOP validation, document corrective action
- **Platform limitations** (e.g., shell restricted) → Mark as RESTRICTED, not FAIL
- **Missing test data** (e.g., no test PDFs) → Mark as N/A, recommend future testing

All deviations are documented with severity (CRITICAL/HIGH/MEDIUM/LOW) and corrective actions.

### Can I skip CQ (Cognitive Qualification)?

**Yes.** CQ tests are designed for AI-assisted workflows. Skip this phase if:

- You're using traditional deterministic software without AI
- You're doing basic validation (IQ/OQ only)
- You don't need to validate AI model behavior

CQ becomes important for:

- Production deployment of AI-assisted research tools
- Multi-platform validation (different AI models)
- Compliance requirements (AI safety, bias detection)

### How often should I run validation?

**Recommended schedule:**

- **First-time setup:** Full validation (IQ/OQ/PQ/CQ)
- **After git updates:** IQ/OQ validation
- **Platform migration:** Full validation
- **Quarterly (production use):** IQ/OQ validation
- **Annual (production use):** Full validation (IQ/OQ/PQ/CQ)

### What about large corpora (100+ PDFs)?

PQ tests use a **minimal test corpus (3-5 PDFs)** to validate the workflow logic, not scalability. For large corpus testing:

- Run PQ-001 with a small corpus (as designed)
- Document in the report: "Large corpus (>50 PDFs) not tested"
- Recommend separate scalability/performance testing if needed

---

## Troubleshooting

### "Tool not found" errors (Gemini CLI)

**Cause:** Gemini CLI defaults to safe mode, disabling shell execution
**Solution:** Add `--yolo` flag: `gemini --yolo -p "Execute ..."`

---

### ".gitignore blocks corpus access" (IQ-002 fails)

**Cause:** `.gitignore` contains `corpus/*.pdf`
**Solution:** Comment out the line in `.gitignore`:
```gitignore
# corpus/*.pdf
```

---

### "PDF reading failed" (OQ-004 fails)

**Cause:** PDF parsing libraries not installed or not accessible
**Solution:** Check dependencies (Python, PyPDF2, pdfplumber) or mark as N/A if PDFs not needed

---

### Context overflow during PQ-001

**Cause:** Attempting to process too many PDFs at once
**Solution:** Use incremental workflow design (already implemented in Phase 1 skill v2.0+)

---

## Contributing

This skill is part of the Research Writer system. To contribute:

1. Review the [Agent Skills specification](https://agentskills.io/specification)
2. Test changes across multiple platforms (Claude Code, Gemini CLI)
3. Update version history in `SKILL.md`
4. Submit changes for review

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-04 | Initial IQ/OQ/PQ validation protocol |
| 1.1 | 2026-01-04 | Added CQ (Cognitive Qualification) for AI validation |
| 1.2 | 2026-01-04 | Enhanced CQ with consistency and bias tests |
| 2.0 | 2026-01-04 | Restructured for progressive disclosure, modular references |

---

## License

Apache-2.0

---

## Support

For issues or questions:

1. Check `references/PLATFORM_CONSIDERATIONS.md` for platform-specific guidance
2. Review troubleshooting section above
3. Consult the Research Writer documentation
4. File an issue in the project repository

---

**Ready to validate your system?**

```bash
Execute audits/skills/system-validation/SKILL.md
```
