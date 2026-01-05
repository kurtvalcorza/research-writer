---
name: phase-02-literature-synthesis
description: Extract standardized information from screened research papers and synthesize cross-paper themes. Produces extraction matrix (metadata + findings per paper) and synthesis matrix (themes across papers with evidence strength labels). Quality metrics included.
requires:
  - outputs/literature-screening-matrix.md
  - corpus/
produces:
  - outputs/literature-extraction-matrix.md
  - outputs/literature-synthesis-matrix.md
  - outputs/extraction-quality-report.md
model: sonnet
tools: Read, Write, Edit, Bash, Glob, Grep
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
max_papers: 100
estimated_time: "15-30 min (10 papers), 30-60 min (20 papers), 60-120 min (50 papers)"
resumable: true
---

# Phase 2: Literature Extraction & Synthesis

## Overview

This subagent performs two key tasks:

1. **Extraction**: Read each approved paper systematically, extract standardized information
2. **Synthesis**: Identify cross-paper themes, synthesize findings, label evidence strength

**Key Features:**
- ✅ Standardized extraction template (consistent across papers)
- ✅ Quality metrics (success rate, completeness)
- ✅ Cross-paper thematic synthesis
- ✅ Evidence strength labeling
- ✅ Resumable from last processed paper

## Pre-Execution Validation

### Environment Check
```bash
1. outputs/literature-screening-matrix.md exists
2. Extract INCLUDED papers from screening matrix
3. Verify INCLUDED papers exist in corpus/
4. outputs/ directory writable
5. No corrupted papers in INCLUDED list
```

### Configuration
```
1. Load INCLUDED papers from screening-matrix.md
2. Build list of papers to extract
3. Count total papers to process
4. Initialize extraction tracking
```

### State Check
```
If outputs/extraction-quality-report.md exists:
  - Load state: last processed paper, success count
  - Option: Resume from next paper OR restart extraction
Else:
  - Fresh extraction session
  - Create empty extraction tracking
```

---

## Execution Model

### Phase 2A: Extraction

**Purpose**: Extract standardized information from each paper.

**Workflow:**

**Step 1: For each INCLUDED paper**
```
1. Read PDF (use Read tool)
2. Extract metadata:
   - Title, Authors, Year, Journal/Source
   - Publication type (journal, conference, preprint)
   - URL/DOI if available

3. Extract key sections:
   - Abstract (full)
   - Methods (summary: what was studied, how)
   - Findings (key results, quantitative + qualitative)
   - Limitations (stated by authors)
   - Contributions (author's stated contributions)

4. Identify themes:
   - Read abstract + findings section
   - List 2-5 keywords describing main themes
   - Note if paper addresses multiple themes
```

**Step 2: Record in extraction matrix**
```
Create/update literature-extraction-matrix.md:

| Paper ID | Title | Authors | Year | Methods Summary | Key Findings | Limitations | Themes |
|----------|-------|---------|------|-----------------|--------------|-------------|--------|
| P001 | [Title] | [Authors] | 2024 | [Methods] | [Key findings summary] | [Limitations] | Theme A, Theme B |
```

**Step 3: Save progress**
```
After every 5 papers:
1. Save literature-extraction-matrix.md
2. Update extraction-quality-report.md with progress
3. Clear context, continue with next batch
```

**Step 4: Error handling**
```
If PDF fails to read:
  - Mark as EXTRACTION_FAILED
  - Document reason (unreadable, corrupted, missing)
  - Store in failure list
  - Continue with next paper

If paper has no abstract/methods:
  - Mark as METADATA_INSUFFICIENT
  - Extract what's available
  - Note in quality report
  
If extraction unclear:
  - Extract best available
  - Flag in quality report for manual review
```

---

### Phase 2B: Synthesis

**Purpose**: Identify cross-paper themes and synthesize findings.

**Workflow:**

**Step 1: Identify themes**
```
1. Review all extracted themes from INCLUDED papers
2. Consolidate similar/related themes
3. Group papers by theme
4. Final list: 3-7 major themes (typical)

Example: 20 papers on AI in healthcare might have:
- Theme A: AI diagnostics (8 papers)
- Theme B: Clinical decision support (6 papers)
- Theme C: Implementation barriers (5 papers)
- Theme D: Ethical considerations (7 papers)
```

**Step 2: Synthesize per theme**
```
For each theme:

A) Identify papers addressing this theme
B) Read findings section of each paper
C) Synthesize:
   - What do papers agree on?
   - Where do they differ?
   - What's the overall consensus?
   - How strong is the evidence?

D) Assign evidence strength label:
   - "Strong Consensus": 80%+ of papers agree
   - "Mixed Views": 40-80% agreement, disagreement present
   - "Emerging": 2-4 papers, less established
   - "Limited": 1 paper only, needs corroboration
```

**Step 3: Create synthesis matrix**
```
Create literature-synthesis-matrix.md:

| Theme | Papers | Evidence Strength | Synthesis |
|-------|--------|------------------|-----------|
| Theme A: AI Diagnostics | P001, P003, P005, P008 | Strong Consensus | "Papers consistently show AI improves diagnostic accuracy by 15-25%. Agreement across diverse health conditions. Well-established finding." |
| Theme B: Clinical Support | P002, P004, P007 | Mixed Views | "Some papers (2) show strong adoption; others (1) document barriers. Context-dependent effectiveness observed." |
| Theme C: Implementation | P006, P009 | Emerging | "New theme. 2 papers suggest organizational readiness is critical factor. Needs more research." |
```

**Step 4: Quality report**
```
Generate extraction-quality-report.md:

# Extraction & Synthesis Quality Report

## Extraction Results
- Total INCLUDED papers: 20
- Successfully extracted: 19 (95%)
- Extraction failures: 1 (metadata insufficient)
- Average extraction completeness: 92%

## Theme Identification
- Total themes identified: 6
- Papers per theme: 3-8 (good distribution)
- Cross-theme papers: 5 (address multiple themes)

## Synthesis Quality
- Consensus strength: Good (mostly Strong/Mixed)
- Evidence distribution: Balanced
- Emerging themes: 1

## Recommendations
- 1 failed paper: Consider manual extraction or OCR
- Overall quality: EXCELLENT (>80% success)
- Ready for Phase 3
```

---

## Extraction Template

Structured extraction form for each paper:

```markdown
## Paper ID: P001

**Metadata**
- Title: [Full title]
- Authors: [All authors]
- Year: [Publication year]
- Journal: [Journal/Conference/Source]
- DOI/URL: [If available]
- Publication Type: Journal Article / Conference / Preprint

**Abstract**
[Full abstract or summary if not available]

**Methods**
[What was studied, how, sample size if applicable]

**Key Findings**
[Main results, both quantitative and qualitative]
- Finding 1: ...
- Finding 2: ...

**Limitations**
[Stated by authors]

**Author's Stated Contributions**
[What they claim as contributions]

**Themes (from our analysis)**
- Theme A
- Theme B

**Quality Notes**
- Completeness: 100%
- Clarity: High
- Any extraction issues: None
```

---

## Output Validation

After completion, verify:

```
✓ literature-extraction-matrix.md generated
  - All INCLUDED papers in matrix
  - Standard fields populated for each paper
  - Missing data clearly noted

✓ literature-synthesis-matrix.md generated
  - 3-7 themes identified
  - Each theme has synthesis summary
  - Evidence strength labels assigned
  - Cross-paper patterns documented

✓ extraction-quality-report.md generated
  - Extraction success rate >80%
  - Papers per theme distribution reasonable
  - Any failures documented with reasons

✓ No data loss
  - All INCLUDED papers processed
  - No papers left in "pending" state
  - Counts match screening matrix
```

---

## Success Criteria

Phase 2 successful when:

1. ✅ All INCLUDED papers extracted
2. ✅ Extraction success rate ≥80%
3. ✅ literature-extraction-matrix.md generated (valid Markdown)
4. ✅ literature-synthesis-matrix.md generated (valid Markdown)
5. ✅ 3-7 themes identified
6. ✅ All themes have synthesis summaries
7. ✅ Evidence strength labels assigned to all themes
8. ✅ extraction-quality-report.md generated

---

## Integration with Orchestrator

### Inputs from Orchestrator
```
Parameters:
- screening_matrix_file: "outputs/literature-screening-matrix.md"
- corpus_path: "corpus/"
- extraction_depth: "comprehensive"
```

### Outputs to Orchestrator
```
Status: SUCCESS / FAILURE / PARTIAL
Duration: X minutes
Papers extracted: N / Total: M
Success rate: X%

Output files:
- outputs/literature-extraction-matrix.md ✓
- outputs/literature-synthesis-matrix.md ✓
- outputs/extraction-quality-report.md ✓

Themes identified: X
Quality assessment: EXCELLENT / GOOD / ACCEPTABLE / POOR
```

### Orchestrator Next Step
```
Display: Extraction summary + quality metrics
Optional checkpoint: "Quality acceptable? (yes/no/retry)"

If yes: Proceed to Phase 3 (Argument Structuring)
If no: Option to retry Phase 2
```

---

## Error Handling

### PDF Extraction Failures
```
If PDF extraction fails:
  - Mark paper as EXTRACTION_FAILED
  - Document reason
  - Continue with next paper
  - Reduce extraction success rate in quality report

Quality thresholds:
- EXCELLENT: >95%
- GOOD: 80-95%
- ACCEPTABLE: 60-80%
- POOR: <60% (may need to re-screen corpus)
```

### Missing/Incomplete Data
```
If paper has no abstract:
  - Extract from intro paragraph
  - Note in quality report

If methods section missing:
  - Extract from "Methodology" or "Approach"
  - Note in quality report

If findings unclear:
  - Extract best interpretation
  - Flag for manual review
  - Note in quality report
```

### Theme Identification Issues
```
If <3 themes identified:
  - Likely corpus is too narrow
  - May need to reconsider paper selection
  - Note in quality report

If >10 themes identified:
  - Likely themes are too granular
  - Recommend consolidation
  - Note in quality report
```

---

## Quality Metrics

Calculate and report:

```
Extraction Success Rate:
  = (Papers successfully extracted / Total INCLUDED papers) × 100

Extraction Completeness:
  = Average % of fields populated per paper

Theme Distribution:
  = Papers per theme (should be roughly balanced, 3-8 papers each)

Evidence Quality:
  = % of themes with "Strong Consensus" or "Mixed Views"
  (vs "Emerging" or "Limited")

Overall Quality Assessment:
  If success rate >95% AND completeness >90%: EXCELLENT
  If success rate >80% AND completeness >85%: GOOD
  If success rate >60% AND completeness >75%: ACCEPTABLE
  If success rate <60%: POOR (may need remediation)
```

---

## Usage Notes

### Extraction Strategy
- Process one paper at a time
- Use consistent extraction template
- Extract objectively (what paper says, not interpretation)
- Note any ambiguities for manual review

### Synthesis Strategy
- Identify themes from extracted keywords
- Consolidate similar themes
- Synthesize by comparing findings across papers
- Be honest about consensus/disagreement
- Label evidence strength accurately

### Quality Management
- Check success rate after every 10 papers
- If rate drops <80%, investigate failures
- Document all issues in quality report
- Flag papers for manual review if needed

### Time Expectations
- Small corpus (5 papers): 15 min
- Medium corpus (15 papers): 30-40 min
- Large corpus (50 papers): 90-120 min
- Very large corpus (100+ papers): Requires batching

---

## Context Management

To prevent context overflow:

```
1. Process max 5 papers per context window
2. After every 5 papers:
   - Save matrices
   - Save progress
   - Clear context
   - Continue with next batch
3. Use extraction template to minimize token usage
4. Synthesis: Consolidate themes after all extraction complete
```

---

## Future Enhancements

1. **Custom Extraction Fields**: Users define additional fields
2. **Automated Theme Clustering**: ML-based theme consolidation
3. **Cross-Theme Relationships**: Show how themes relate
4. **Citation Network**: Show which papers cite each other
5. **Geographic/Temporal Analysis**: Show findings by region/year
