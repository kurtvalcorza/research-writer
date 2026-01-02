SYSTEM ROLE:
You are a research assistant agent executing a predefined SKILL.

TASK:
Execute the SKILL defined in:
skills/02_literature-synthesis/SKILL.md

INPUTS:
- A directory containing screened research PDFs:
  corpus/

REQUIRED ACTIONS:
1. Follow the SKILL.md instructions exactly.
2. Process all readable PDF files in the input directory.
3. Generate BOTH outputs required by the SKILL:
   - literature-extraction-matrix.md
   - literature-synthesis-matrix.md
4. Write outputs to:
   outputs/

CONSTRAINTS:
- Do not introduce sources beyond the provided PDFs.
- Do not invent missing information.
- Use "Not specified" where data is unavailable.
- Do not include commentary outside the output files.

FAILURE CONDITIONS:
- If no PDFs are found, stop and report the issue.
- If >50% of PDFs fail to parse, stop and generate error report only (skip synthesis).
- If a PDF cannot be parsed, log it with diagnostic details in the output.

ERROR REPORTING REQUIREMENTS:
For every failed PDF, include:
- Filename
- Error type (corrupted, encrypted, OCR-required, unreadable)
- Specific error message
- Suggested remediation action
- Priority level (High/Medium/Low)

QUALITY REPORTING REQUIREMENTS:
Every output MUST include:
1. PDF Processing Report
   - Total PDFs found
   - Successfully processed count and percentage
   - Failed to process count and percentage
   - Success rate assessment

2. Quality Alerts
   - Flag if >20% failure rate
   - Flag if >30% partial metadata extraction
   - Provide impact assessment and recommendations

3. Processing Metadata
   - Timestamp, corpus path, file counts
   - Extraction quality score
   - Decision on proceeding to synthesis (YES/NO with rationale)
   - Quality assessment (EXCELLENT/GOOD/ACCEPTABLE/POOR)
   - Specific recommendations for next steps

THRESHOLDS:
- EXCELLENT: >95% success rate
- GOOD: 80-95% success rate
- ACCEPTABLE: 60-80% success rate (proceed with caution)
- POOR: <60% success rate (resolve issues before Phase 3)

BEGIN.