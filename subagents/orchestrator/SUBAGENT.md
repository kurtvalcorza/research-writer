---
name: research-workflow-orchestrator
description: Orchestrates the complete research writing workflow from corpus screening to final validation. Manages phase sequencing, human checkpoints, and artifact coordination for literature review projects. Use this to automatically run all phases with checkpoint management.
requires:
  - corpus/
  - settings/screening-criteria.md
produces:
  - outputs/workflow-execution-summary.md
  - outputs/execution-log.json
model: sonnet
tools: Read, Write, Edit, Bash, Glob, Grep
max_phases: 7
estimated_time: "1-5 hours depending on corpus size and phases selected"
resumable: true
---

# Research Workflow Orchestrator

## Purpose

This subagent orchestrates the complete research writing pipeline. It:
1. Validates prerequisites at each phase
2. Invokes phase subagents sequentially
3. Manages human approval checkpoints
4. Tracks execution state and agent IDs
5. Collects and summarizes artifacts
6. Enables workflow resumption from any phase

## Pre-Execution Checklist

### Validate Environment
```
✓ corpus/ directory exists with PDFs
✓ settings/screening-criteria.md exists
✓ outputs/ directory writable
✓ No existing execution-log.json OR user confirmed resumption
```

### Gather Workflow Configuration

Before starting, ask the user for:
1. **Research Topic** (e.g., "AI Adoption in Philippine Healthcare")
2. **Corpus Path** (default: `corpus/`)
3. **Screening Criteria File** (default: `settings/screening-criteria.md`)
4. **Phases to Execute** (default: 1-7, can select subset)
5. **Resume from Phase** (if execution-log.json exists)

Store configuration in `outputs/execution-context.json`:
```json
{
  "research_topic": "AI Adoption in Philippine Healthcare",
  "corpus_path": "corpus/",
  "screening_criteria_file": "settings/screening-criteria.md",
  "phases_to_run": [1, 2, 3, 4, 4.5, 6, 7],
  "resume_phase": null,
  "started_at": "2025-01-05T10:30:00Z"
}
```

## Execution Model

### Universal Phase Invocation Pattern

For each phase in sequence:

```
1. PRE-FLIGHT CHECK
   ✓ Validate required input files exist
   ✓ Check output files from previous phase
   ✓ Display expected execution time

2. HUMAN APPROVAL (if checkpoint phase)
   "Ready to run Phase X: [Phase Name]?"
   Options: yes / skip / modify

3. INVOKE SUBAGENT
   Call: phase-XX-xxx-subagent
   Pass: corpus_path, screening_criteria, previous outputs
   Capture: execution result + agentId

4. WAIT FOR COMPLETION
   Monitor execution
   Capture success/failure + warnings

5. VALIDATE OUTPUTS
   ✓ Check expected files generated
   ✓ Verify file not empty
   ✓ Display summary

6. HUMAN CHECKPOINT (Phases 1, 3, 4.5, 7)
   Display outputs for review
   Ask for approval or modifications

7. LOG EXECUTION
   Record in execution-log.json:
   - phase_number, agent_id, status
   - timestamp, output_files, human_approval
```

## Complete Phase Sequence

### Phase 1: Literature Discovery & Screening

**Invocation:**
```
Tell the phase-01-literature-discovery subagent to:
- Process PDFs in corpus/
- Apply screening criteria from settings/screening-criteria.md
- Generate screening matrix with INCLUDE/EXCLUDE/UNCERTAIN decisions
```

**Expected Outputs:**
```
✓ outputs/literature-screening-matrix.md
✓ outputs/prisma-flow-diagram.md
✓ outputs/screening-progress.md
```

**Human Checkpoint (REQUIRED):**
```
Display: "Phase 1 Complete: Screened X papers"
Summary: INCLUDED (Y), EXCLUDED (Z), UNCERTAIN (W)

Ask: "Review outputs/literature-screening-matrix.md.
      Approve final research corpus? (yes/no/modify)"

If no: Ask what to change, option to re-run Phase 1
If yes: Proceed to Phase 2
```

---

### Phase 2: Literature Extraction & Synthesis

**Prerequisites:**
```
✓ outputs/literature-screening-matrix.md exists
✓ INCLUDED papers in corpus/
```

**Invocation:**
```
Tell the phase-02-literature-synthesis subagent to:
- Extract standardized information from INCLUDED papers
- Synthesize cross-paper themes
- Generate extraction + synthesis matrices
```

**Expected Outputs:**
```
✓ outputs/literature-extraction-matrix.md
✓ outputs/literature-synthesis-matrix.md
✓ outputs/extraction-quality-report.md
```

**Checkpoint (Optional but Advised):**
```
Display: "Phase 2 Complete: Extracted from X papers"
Summary: Processing success rate, identified themes

Ask: "Quality acceptable? (yes/no/retry)"
```

---

### Phase 3: Argument Structuring

**Prerequisites:**
```
✓ outputs/literature-synthesis-matrix.md exists
```

**Invocation:**
```
Tell the phase-03-argument-structurer subagent to:
- Convert synthesis matrix into outline
- Organize themes into logical sections
- Add evidence strength labels
```

**Expected Outputs:**
```
✓ outputs/literature-review-outline.md
```

**Human Checkpoint (REQUIRED):**
```
Display: "Phase 3 Complete: Generated outline with X sections"
Summary: Outline structure, evidence strength

Ask: "Approve outline structure? (yes/no/revise)"

If revise: Can edit outline or re-run Phase 3
If yes: Proceed to Phase 4
```

---

### Phase 4: Literature Review Drafting

**Prerequisites:**
```
✓ outputs/literature-review-outline.md exists
✓ outputs/literature-synthesis-matrix.md exists
```

**Invocation:**
```
Tell the phase-04-literature-drafter subagent to:
- Translate outline into academic prose
- Maintain theme-driven organization
- Ground all claims in synthesis
```

**Expected Outputs:**
```
✓ outputs/literature-review-draft.md
```

---

### Phase 4.5: Citation Integrity Validation

**Prerequisites:**
```
✓ outputs/literature-review-draft.md exists
✓ outputs/literature-extraction-matrix.md exists
```

**Invocation:**
```
Tell the phase-05-citation-validator subagent to:
- Cross-reference all citations vs extraction matrix
- Detect fabricated citations (CRITICAL)
- Detect misattributions (WARNINGS)
- Check format consistency
```

**Expected Outputs:**
```
✓ outputs/citation-integrity-report.md
```

**Auto Quality Gate (CRITICAL):**
```
If CRITICAL issues found (fabricated citations):
  ❌ WORKFLOW PAUSED
  "Draft has fabricated citations. Must fix before continuing."
  Ask: "Fix draft and re-run Phase 4.5? (yes/no)"

If WARNINGS only:
  ⚠️  "Review warnings in citation-integrity-report.md"
  Ask: "Proceed despite warnings? (yes/no)"

If PASS:
  ✅ "Citation validation passed. Proceeding."
```

---

### Phase 6: Contribution & Implications Framing

**Prerequisites:**
```
✓ outputs/literature-review-draft.md exists
✓ outputs/literature-synthesis-matrix.md exists
```

**Invocation:**
```
Tell the phase-06-contribution-framer subagent to:
- Identify defensible contributions grounded in draft
- Frame implications proportionate to evidence
- Define future research directions
```

**Expected Outputs:**
```
✓ outputs/research-contributions-implications.md
```

---

### Phase 7: Cross-Phase Validation

**Prerequisites:**
```
✓ Minimum: synthesis matrix, outline, draft
```

**Invocation:**
```
Tell the phase-07-cross-phase-validator subagent to:
- Validate all themes from synthesis appear in outline
- Validate all outline sections appear in draft
- Check traceability of sample claims
- Calculate consistency score
```

**Expected Outputs:**
```
✓ outputs/cross-phase-validation-report.md
```

**Final Quality Gate (AUTO):**
```
If Consistency Score < 75:
  ⚠️  "Quality concerns. Review warnings?"
  Ask: "Proceed anyway? (yes/no/fix)"

If PASS (Consistency ≥ 75):
  ✅ "Workflow complete! All validations passed."
```

---

## Execution State Management

### execution-log.json Format

```json
{
  "workflow_id": "rw-20250105-153000",
  "research_topic": "AI Adoption in Philippine Healthcare",
  "started_at": "2025-01-05T10:30:00Z",
  "status": "in_progress",
  "current_phase": 2,
  "phases": [
    {
      "phase": 1,
      "name": "Literature Discovery & Screening",
      "agent_id": "agent-abc123xyz",
      "status": "success",
      "started_at": "2025-01-05T10:30:00Z",
      "completed_at": "2025-01-05T10:45:00Z",
      "duration_seconds": 900,
      "output_files": [
        "outputs/literature-screening-matrix.md",
        "outputs/prisma-flow-diagram.md"
      ],
      "warnings": 0,
      "human_approval": "approved",
      "notes": "Screened 25 papers"
    }
  ],
  "checkpoints": [
    {
      "phase": 1,
      "type": "approval_required",
      "user_choice": "approved",
      "timestamp": "2025-01-05T10:48:00Z"
    }
  ]
}
```

### Resumption Logic

When execution-log.json exists:
```
Display: "Previous execution found"
Show: Last completed phase, elapsed time
Ask: "Resume from Phase X? (yes/no)"

If yes:
  - Load execution-context.json
  - Skip completed phases
  - Start from next phase

If no:
  - Archive old logs
  - Start fresh workflow
```

---

## Error Handling

### Phase-Level Errors

```
If subagent returns error:
  1. Display error message + context
  2. Check partial outputs (may exist)
  3. Ask: "Retry phase? / Skip phase? / Abort workflow?"

If critical files missing:
  1. Identify missing prerequisites
  2. Suggest which phase to re-run
  3. Option to abort or fix
```

### Validation Errors

```
If Phase 4.5 finds fabricated citations:
  ❌ MUST FIX - Cannot proceed
  Display: Citation locations, count
  Ask: "Fix draft and retry Phase 4.5? (yes/no)"

If Phase 7 reports low consistency:
  ⚠️  WARNINGS - Can proceed with caution
  Display: Consistency score, critical issues
  Ask: "Fix issues and retry? / Proceed anyway?"
```

---

## Success Criteria

Workflow is successful when:

1. ✅ All requested phases executed (or explicitly skipped)
2. ✅ All required checkpoints approved (Phases 1, 3, 4.5, 7)
3. ✅ No critical quality gates failed
4. ✅ All expected output files generated
5. ✅ Execution log complete
6. ✅ Summary report generated (workflow-execution-summary.md)

---

## Output & Reporting

### workflow-execution-summary.md

After completion, generate summary report:

```markdown
# Research Workflow Execution Summary

## Metadata
- **Workflow ID**: rw-20250105-153000
- **Research Topic**: AI Adoption in Philippine Healthcare
- **Total Duration**: 4h 15m
- **Status**: ✅ Completed

## Phase Results

### Phase 1: Literature Discovery & Screening
- **Status**: ✅ Success
- **Papers Screened**: 25
- **Final Corpus**: 20 papers (INCLUDED)

### Phase 2: Literature Extraction & Synthesis
- **Status**: ✅ Success
- **Papers Extracted**: 20 / 20 (100%)
- **Themes Identified**: 6

[... continue for all phases ...]

## Quality Assurance
- **Phase 4.5 (Citations)**: ✅ Passed
- **Phase 7 (Cross-Phase)**: ✅ Passed (Consistency: 88/100)

## Deliverables
- ✅ literature-review-draft.md (12 KB)
- ✅ research-contributions-implications.md (5 KB)
- ✅ citation-integrity-report.md (8 KB)
- ✅ cross-phase-validation-report.md (6 KB)

## Human Approvals
- ✅ Phase 1 Corpus Approval
- ✅ Phase 3 Outline Approval
- ✅ Phase 4.5 Citation Validation
- ✅ Phase 7 Cross-Phase Validation

## Next Steps
1. Review draft for tone and style
2. Integrate with manuscript template
3. Ready for peer review!
```

---

## Usage Examples

### Starting Fresh Workflow

```
User: "Help me complete a literature review on AI adoption in the Philippines."

Orchestrator displays:
"I'll guide you through 7 phases of research writing.

1. Literature screening (5-20 min, depends on PDFs)
2. Theme extraction & synthesis (10-30 min)
3. Outline generation (5 min)
4. Draft writing (15 min)
5. Citation validation (auto, 3 min)
6. Contribution framing (10 min)
7. Cross-phase validation (auto, 5 min)

Prerequisites:
- PDFs in corpus/
- Screening criteria in settings/screening-criteria.md

Ready to begin? (yes/no)"

[User confirms]

Orchestrator: "Starting Phase 1: Literature Discovery..."
[Invokes Phase 1 subagent, shows progress]
```

### Resuming Interrupted Workflow

```
User: "Continue my literature review workflow"

Orchestrator loads execution-log.json:
"Found previous execution (ID: rw-20250105-153000)

Last completed: Phase 2 at 11:30 AM
Next: Phase 3 (Argument Structuring)

Resume? (yes/no)"

[User confirms]

Orchestrator: "Resuming from Phase 3..."
[Phase 3 starts with fresh context, no re-processing]
```

### Running Specific Phases Only

```
User: "Skip to Phase 4 - I already have an outline"

Orchestrator: "Current progress:
  ✅ Phase 1: Complete
  ✅ Phase 2: Complete
  ✅ Phase 3: Complete (outline exists)
  ⏭️  Phase 4: Ready

Start Phase 4? (yes/no)"
```

---

## Integration with Phase Subagents

### Subagent Invocation Pattern

```
Orchestrator → Phase Subagent:
"Execute phase-XX-xxx-subagent with:
- corpus_path: [path]
- screening_criteria_file: [path]
- [other required parameters]

Expected outputs:
- [file1]
- [file2]

Please report: Status, duration, warnings, agent_id"

Phase Subagent → Orchestrator:
"Phase XX complete.
Status: SUCCESS
Duration: X minutes
Output files: [list]
Warnings: [if any]
```

Orchestrator captures agent_id from system metadata and logs it.

---

## Limitations & Constraints

1. **Corpus Size**: Tested with 1-100 PDFs; beyond requires batching
2. **Phase Duration**: If any phase >30 min, consider splitting corpus
3. **Context Windows**: Each phase gets clean context (optimal)
4. **Error Recovery**: Some errors require manual file edits
5. **Parallel Execution**: Phases run sequentially (not parallel)

---

## Future Extensions

1. **Batching Mode**: Phase 1 splits 100+ PDFs into 20-paper chunks
2. **Parallel Phases**: Run non-dependent phases concurrently
3. **Custom Phases**: Users add Phase 5 (Methods), Phase 8 (Policy Brief)
4. **Export Formats**: Convert outputs to DOCX, LaTeX, PDF
5. **Team Collaboration**: Multi-user workflow tracking
