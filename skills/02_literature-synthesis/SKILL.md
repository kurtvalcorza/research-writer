---
name: literature-review-synthesis-matrix
description: Generates a two-part literature review matrix: (1) paper-centric extraction and (2) theme-centric synthesis, from a folder of PDF research papers.
license: Apache-2.0
compatibility: Requires PDF parsing capability and filesystem read/write access.
allowed-tools: list_directory read_resource parse_pdf write_file
metadata:
  short-description: Builds extraction and synthesis matrices from a corpus of research PDFs.
  version: 2.0.0
---

# Literature Review Synthesis Matrix Generator (Phase 2)

This skill operationalizes a **two-part literature review workflow** aligned with best practices in academic, policy, and evidence-based research.

- **Part 1** produces a structured, paper-centric extraction matrix.
- **Part 2** synthesizes Part 1 into a theme-centric synthesis matrix.

---

## 1. Trigger
Activate this skill when the user:
- Provides a folder containing multiple research PDFs, and
- Requests a literature review matrix, synthesis matrix, or comparative analysis across papers.

---

## 2. Part 1 — Literature Extraction Matrix (Paper-Centric)

### 2.1 Objective
Create a **standardized extraction table** where each row represents one paper and each column captures a consistent analytical attribute.

This part emphasizes **accuracy, normalization, and completeness**, not interpretation.

---

### 2.2 Part 1 Execution Steps

1. **Discovery**  
   Identify all PDF files in the specified directory `corpus`.

2. **Iteration**  
   For each PDF:
   - Extract text using `parse_pdf`.
   - Identify bibliographic and analytical elements.
   - Normalize terminology across papers.
   - Populate exactly one row per paper.

3. **Compilation**  
   Aggregate all rows into a single Markdown table.

4. **Output**  
   Save as: `outputs/literature-extraction-matrix.md`


---

### 2.3 Part 1 Extraction Schema

| Column | Description |
|------|-------------|
| **Citation** | Author(s), year, title (APA-style where possible) |
| **Research Objective** | Primary aim or research question |
| **Methodology** | Study design, data, models, or analytical approach |
| **Key Findings** | Main results or conclusions |
| **Limitations / Gaps** | Explicitly stated or clearly implied gaps |
| **Key Themes / Concepts** | 3–5 high-level concepts (methods, variables, lenses) |
| **Relevance / Notes** | Why this paper matters to the review |

---

### 2.4 Part 1 Constraints
- Do not invent missing information.
- Do not merge multiple papers into one row.
- Use `Not specified` when information is unavailable.
- Avoid long verbatim quotations.

---

## 3. Part 2 — Literature Synthesis Matrix (Theme-Centric)

### 3.1 Objective
Transform the Part 1 extraction matrix into a **true synthesis matrix** that enables:

- Cross-paper comparison
- Pattern detection
- Gap identification
- Analytical insight generation

This part is **comparative and integrative**, but must remain grounded in Part 1 data.

---

### 3.2 Part 2 Input
Use **only** the Part 1 extraction matrix generated in this run.

No new sources may be introduced.

---

### 3.3 Part 2 Execution Steps

1. **Theme Identification**
- Scan the **Key Themes / Concepts**, methodologies, findings, and gaps.
- Identify recurring, contrasting, or strategically important themes.

2. **Theme Normalization**
- Merge synonymous or closely related concepts.
- Use neutral, discipline-appropriate labels.

3. **Evidence Mapping**
- For each theme, map how different papers:
  - Address it
  - Support it
  - Contradict it
  - Leave gaps

4. **Matrix Construction**
- Each row represents a **theme or analytical dimension**.
- Columns summarize how the literature engages with that theme.

5. **Output**
Save as: `outputs/literature-synthesis-matrix.md`

---

### 3.4 Part 2 Synthesis Schema

| Column | Description |
|------|-------------|
| **Theme / Analytical Dimension** | Core concept, variable, or issue |
| **Papers Addressing Theme** | Key citations engaging with it |
| **Consensus / Patterns** | Areas of agreement or convergence |
| **Contradictions / Divergence** | Conflicting findings or approaches |
| **Identified Gaps** | What the literature does not sufficiently address |
| **Implications for Review** | Why this theme matters for the research |

---

### 3.5 Part 2 Constraints
- Do not infer beyond what Part 1 supports.
- Do not attribute claims to papers that do not support them.
- Explicitly note weak or sparse evidence.
- Maintain analytic neutrality.

---

## 4. Error Handling and Quality Reporting

### 4.1 PDF Processing Errors

**When a PDF fails to parse:**

1. **Log the failure with diagnostic information:**
   - Filename
   - Error type (corrupted, encrypted, OCR-required, unreadable format)
   - Suggested remediation action

2. **Continue processing:** Proceed with successfully parsed PDFs

3. **Include in output:** Add structured error report to extraction matrix

**Error report format in extraction matrix:**

```markdown
## PDF Processing Report

**Total PDFs in corpus:** [N]
**Successfully processed:** [N] ([X]%)
**Failed to process:** [N] ([X]%)

### Processing Summary

| Status | Count | Percentage |
|--------|-------|------------|
| ✅ Successfully extracted | X | X% |
| ❌ Failed to parse | X | X% |

### Failed PDF Details

| Filename | Error Type | Error Message | Suggested Action | Priority |
|----------|------------|---------------|------------------|----------|
| paper1.pdf | Corrupted file | "PDF structure invalid" | Re-download from source | High |
| paper2.pdf | Image-only PDF | "No extractable text" | Apply OCR preprocessing | High |
| paper3.pdf | Encrypted | "Password protection detected" | Remove encryption | Medium |
| scan_doc.pdf | Unreadable format | "Unknown PDF version" | Verify file integrity | Low |

### Remediation Guidance

**High Priority (blocks comprehensive synthesis):**
- [List of papers critical to corpus coverage]
- **Action:** Must resolve before proceeding to Phase 3

**Medium Priority (impacts synthesis quality):**
- [List of papers that would enhance synthesis]
- **Action:** Recommended to resolve; can proceed with caution

**Low Priority (minor coverage gaps):**
- [List of papers with marginal relevance]
- **Action:** Optional to resolve
```

### 4.2 Metadata Extraction Warnings

**When metadata is incomplete or ambiguous:**

1. **Use "Not specified" for missing fields**
2. **Flag papers with incomplete metadata** in extraction matrix
3. **Note metadata quality** in a dedicated column

**Enhanced extraction schema with quality flag:**

Add column: **Extraction Quality**
- **Complete:** All fields extracted successfully
- **Partial:** Some fields missing or unclear (specify which)
- **Minimal:** Only basic identification possible (title/filename only)

### 4.3 Quality Thresholds and Alerts

**Automated quality checks:**

**ALERT if:**
- **>20% PDF processing failures** → "High failure rate detected. Review corpus file quality."
- **>30% papers with Partial/Minimal extraction** → "Metadata quality low. Consider manual verification."
- **Zero papers extracted successfully** → "CRITICAL: No valid PDFs processed. Check corpus directory."

**Include in extraction matrix output:**

```markdown
## Quality Alerts

⚠️ **HIGH FAILURE RATE DETECTED**
- 12 of 50 PDFs (24%) failed to parse
- **Impact:** Synthesis may be incomplete or biased toward successfully parsed papers
- **Recommendation:** Resolve high-priority parsing failures before Phase 3
- **Action:** Review "Failed PDF Details" table above

✅ **ACCEPTABLE QUALITY**
- 48 of 50 PDFs (96%) successfully processed
- Extraction quality sufficient for synthesis
- Review failed PDFs if time permits but not blocking
```

### 4.4 Synthesis Phase Error Handling

**When synthesis encounters issues:**

1. **Sparse theme coverage:**
   - If a theme is addressed by <2 papers, flag as "Limited evidence"
   - Include in synthesis matrix with explicit caveat

2. **Contradictory findings without resolution:**
   - Document the contradiction clearly
   - Do not attempt to resolve - leave for human interpretation
   - Flag for Phase 3 outline structuring

3. **Missing synthesis data:**
   - If extraction failed for key papers, note gaps in synthesis
   - Explicitly state "Analysis limited by incomplete corpus extraction"

### 4.5 Error Recovery Procedures

**If >50% of PDFs fail:**
1. STOP processing
2. Generate error report only (skip synthesis)
3. Recommend systematic troubleshooting:
   - Check PDF sources (re-download)
   - Verify file integrity
   - Consider batch OCR preprocessing
   - Review corpus selection (may contain non-PDF files)

**If synthesis cannot proceed:**
1. Output extraction matrix only
2. Include diagnostic report explaining why synthesis was skipped
3. Provide specific requirements for proceeding (e.g., "Need ≥3 successfully extracted papers")

### 4.6 Transparency and Auditability

**Every output must include:**

```markdown
## Processing Metadata

**Execution timestamp:** [datetime]
**Corpus directory:** [path]
**Total files in directory:** [N]
**PDF files detected:** [N]
**Successfully processed:** [N] ([X]% success rate)
**Failed to process:** [N]
**Extraction quality score:** [X]% (papers with Complete extraction)

**Proceed to synthesis:** [YES / NO - if NO, explain why]

**Quality assessment:** [EXCELLENT >95% / GOOD 80-95% / ACCEPTABLE 60-80% / POOR <60%]

**Recommendations:**
- [ ] Ready to proceed to Phase 3 without revisions
- [ ] Recommended: Resolve high-priority failures before Phase 3
- [ ] Required: Address critical issues before proceeding
```

---

---

## 5. Expected Outputs
Two Markdown files in the target directory:

1. **Part 1:** `outputs/literature-extraction-matrix.md`  
2. **Part 2:** `outputs/literature-synthesis-matrix.md`

Together, these enable both **transparent evidence tracing** and **rigorous synthesis**.

---

## 6. Example Invocation
> “Generate a full literature extraction and synthesis matrix from all PDFs in the `corpus/` folder.”

---

## 7. Intended Use
This skill supports:
- Academic literature reviews
- Policy evidence synthesis
- Systematic mapping studies
- AI-assisted research workflows

It is designed to be **modular, auditable, and synthesis-ready**.

**End of SKILL Definition**