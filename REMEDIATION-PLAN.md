# Research Writer — Remediation Plan

**Status:** DRAFT — pending owner approval
**Date:** 2026-06-12
**Scope:** Fixes identified by a four-layer audit: (1) Claude Code platform alignment, (2) agent-spec executability, (3) cross-file contract consistency, (4) methodology soundness, plus configuration/templates and repo hygiene.

---

## Goals

1. Every instruction in every agent spec is executable in current Claude Code (no impossible tool calls, no unbounded PDF reads).
2. One authoritative contract: each file in `outputs/` has exactly one declared producer, and every declared consumer's input exists by the time it runs. Docs agree with specs.
3. Both quality gates produce deterministic, reproducible PASS/FAIL decisions.
4. Documentation describes the system that actually exists (orchestrator in `CLAUDE.md`, current Claude Code tool names and frontmatter semantics).
5. Methodology claims match what the pipeline actually does (no "Systematic Review" overclaim without the supporting stages).

## Non-goals (this round)

- No new phases that require new agents beyond what's listed in Workstream E (full search/identification automation, reference-manager integration, export formats stay on the roadmap).
- No behavior changes to the drafting style or synthesis approach — those are sound.

---

## Workstream A — Platform alignment (docs + frontmatter)

The architecture runs today only because of backward-compat aliases and because orchestration already moved into `CLAUDE.md`. Make the docs say so.

| # | Fix | Files |
|---|-----|-------|
| A1 | Replace all "Task tool" / `subagent_type` references with "Agent tool" / `agent_type`; add a one-line note that `Task` remains a deprecated alias (renamed in Claude Code v2.1.63). | `ARCHITECTURE.md` (~lines 39, 105–156, 364–396), `README.md` (~lines 58–87, 212–230), `CLAUDE.md` (Phase Execution section) |
| A2 | Delete the fictional `research-workflow-orchestrator.md` tier. Rewrite the "Two-Tier Design" and directory diagrams to show: orchestrator = main session driven by `CLAUDE.md`; specialists = 7 subagents in `.claude/agents/`. Remove the `/agents → research-workflow-orchestrator` invocation instructions. | `ARCHITECTURE.md` 32–43, 79–91, 166–189, 362–376; `README.md` 94–103, 149–156, 210–230 |
| A3 | Rewrite "Critical Configuration Requirements": omitting `tools:` means the agent **inherits all tools** (it is not required for delegation); subagents **cannot** spawn subagents or use `AskUserQuestion` regardless of `tools:` — platform-enforced. Keep the explicit allowlists on specialists as deliberate scoping, with corrected rationale. Delete the troubleshooting Q&A built on the false claim (ARCHITECTURE.md 594–616). | `ARCHITECTURE.md` 93–135, 440–450, 594–616 |
| A4 | Update model references: "Claude Sonnet 4" → current naming; note `model: sonnet` resolves to the latest Sonnet. | `ARCHITECTURE.md` 477–481 |
| A5 | Fix the comparison table: "Parallelization: Not possible → Future-ready" is wrong; parallel subagent spawning is supported (note Phase dependencies prevent using it here except where flagged in E). | `ARCHITECTURE.md` 553–566 |
| A6 | Remove or refresh the stale roadmap (dated Q1–Q3 2025; it is mid-2026). Either delete or re-date with honest status. | `ARCHITECTURE.md` 570–589 |
| A7 | Fix extensibility section pointing at the defunct `subagents/08_.../SUBAGENT.md` layout → `.claude/agents/methods-narrativizer.md` pattern. | `ARCHITECTURE.md` 524–533 |
| A8 | Optional (flag-gated, do last): mention newer platform features that fit this design — subagent `memory:`, `isolation: worktree` for file-writing phases, `SubagentStop` hooks for auto-triggering gates. Document as options, don't adopt yet. | `ARCHITECTURE.md` new "Platform Features" subsection |

**Acceptance:** `grep -ri "task tool\|subagent_type\|research-workflow-orchestrator" README.md ARCHITECTURE.md CLAUDE.md` returns only the alias-deprecation note.

---

## Workstream B — Agent spec executability

Make every specialist runnable start-to-finish with zero user interaction (all human decisions belong to the orchestrator).

| # | Fix | Files |
|---|-----|-------|
| B1 | **Remove all mid-run user interaction from specialists.** Replace with a standard pattern: agent records the issue + options in a `## Decisions Required` section of its output summary and (where relevant) a `NEEDS_DECISION` status in its progress file; the orchestrator surfaces it at the next checkpoint. Affected: screener PDF-failure handling ("Redownload? / OCR? / Exclude?" → auto-classify as `METADATA_INSUFFICIENT`, continue, report); argument-structurer "<3 themes → Ask user" (→ proceed with available themes, flag `INCOMPLETE_SYNTHESIS`); citation-validator "user acknowledges warnings" (→ emit WARN status, orchestrator asks the user). | `literature-screener.md` ~307–314; `argument-structurer.md` ~271–274; `citation-validator.md` ~108–121 |
| B2 | **Add PDF-reading protocol to both PDF-touching agents.** Explicit rules: PDFs >10 pages require the `pages` parameter; max 20 pages per Read call; Pass 1 reads pages 1–2 only (title/abstract/metadata); Pass 2 / extraction reads in 20-page chunks, prioritizing abstract → methods → findings → discussion; skip references/appendices unless needed. | `literature-screener.md` (Pass 1/Pass 2 sections); `extraction-synthesizer.md` ~77–96 |
| B3 | **Resolve batching contradictions.** extraction-synthesizer: "process one paper at a time" vs "max 5 per context window" → single rule: extract one paper at a time, checkpoint progress file after each paper, target batch of ~3–5 papers between progress saves depending on PDF length. Replace the "~30K tokens" claims with honest guidance ("save state frequently; expect a fraction of the corpus per context window for long PDFs"). | `extraction-synthesizer.md` 133, 454–469; `literature-screener.md` 22, 195–204 |
| B4 | **Clarify synthesis data flow.** Phase 2B "read findings of each paper" must mean *read the per-paper extraction files / extraction matrix*, never re-read PDFs. State it explicitly. | `extraction-synthesizer.md` ~187–217 |
| B5 | **Define gate re-entry paths.** citation-validator and consistency-validator FAIL outcomes get an explicit handoff: report names the offending sections, orchestrator re-spawns literature-drafter with a "revision mode" prompt (drafter spec gains a short Revision Mode section: read the integrity report, fix only flagged items), then the gate re-runs. Document the loop and a max-retry suggestion (2) in CLAUDE.md. | `citation-validator.md` ~107–142; `consistency-validator.md` ~230–240; `literature-drafter.md` (new section); `CLAUDE.md` quality-gate sections |
| B6 | **Drafter fallback for missing evidence.** If a claim the outline requires has no support in the synthesis matrix: omit or hedge the claim and log it in a `## Unsupported Claims Omitted` list in the draft footer (HTML comment), so Gate 1 doesn't discover it the hard way. | `literature-drafter.md` ~140, 204 |
| B7 | **Fix the fabricated-vs-out-of-corpus conflation.** citation-validator gets three categories: `FABRICATED` (no plausible real-world referent — CRITICAL), `OUT_OF_CORPUS` (real-looking citation not in extraction matrix — CRITICAL by default since the drafter must only cite the corpus, but distinctly labeled so a human can rescue it), `MISATTRIBUTED` (in corpus, wrong claim — WARNING). Drafter spec gains an explicit "cite only papers present in the extraction matrix" rule so OUT_OF_CORPUS becomes rare. | `citation-validator.md` ~56–121; `literature-drafter.md` citation rules |
| B8 | Remove the false "Works CLI-agnostic (Gemini, ChatGPT, Claude Desktop)" claim — the system depends on Claude Code agent frontmatter. | `literature-screener.md` line 23 |
| B9 | Clarify quote-extraction ownership: extraction-synthesizer captures key quotes per theme; argument-structurer only *selects* from them. | `argument-structurer.md` ~115–119, 294–305; `extraction-synthesizer.md` |

**Acceptance:** `grep -rin "ask the user\|ask user\|user acknowledges\|(yes/no)" .claude/agents/` returns nothing; every agent spec has a PDF protocol if it reads PDFs; both gates document their FAIL→fix→re-run loop.

---

## Workstream C — Contract reconciliation (single source of truth)

| # | Fix | Files |
|---|-----|-------|
| C1 | Create a **contract table** as the single authority — one row per `outputs/` file: producer, consumers, lifecycle (persistent / working / state). Lives in `ARCHITECTURE.md`; `CLAUDE.md` and `README.md` link to or abbreviate it rather than restating divergent lists. | `ARCHITECTURE.md` (replaces File Organization tree), `CLAUDE.md` 205–237, `README.md` 108–118 |
| C2 | Resolve orphans: **`execution-context.json`** — assign to orchestrator at initialization (add to CLAUDE.md init steps) or delete all references; *recommend: assign to orchestrator*. **`workflow-execution-summary.md`** — assign to orchestrator at workflow completion (CLAUDE.md final step) or delete; *recommend: assign, it's the natural completion artifact*. **`screening-progress.md`**, extraction progress, `pass-1-triage.md` — document as *working/state files* in the contract table so they're expected, not mystery files. | `CLAUDE.md`, `README.md` 118, `ARCHITECTURE.md` 404–414, `literature-screener.md` 34–38, 90 |
| C3 | **Unify the `execution-log.json` schema.** Adopt the richer ARCHITECTURE.md schema (workflow_id, phases[], checkpoints[]) as canonical; CLAUDE.md's logging instructions reference its field names exactly. Add `outputs/execution-log.example.json` to the repo (the `.gitignore` already whitelists it — see F1). | `CLAUDE.md` 56–62, `ARCHITECTURE.md` 214–250, new example file |
| C4 | Remove the phantom dependency: drop `literature-screening-matrix.md` from argument-structurer's required inputs (or mark optional with stated purpose). | `argument-structurer.md` 22–26 |
| C5 | Fix consistency-validator's "(Optional)" label on `research-contributions-implications.md`: Phase 6 always precedes Phase 7 in the standard flow, so mark it required-in-full-workflow / optional-in-standalone-invocation. | `consistency-validator.md` 24–33, 145–167 |
| C6 | Reconcile checkpoint lists: CLAUDE.md (checkpoints after 1, 3, 5, 7) vs ARCHITECTURE.md (approval 1, 3; auto gates 5, 7; optional progress 2, 4, 6). Adopt the ARCHITECTURE taxonomy, fix the "Phases 4.5, 7" typo (line 457). | `CLAUDE.md` 64–71, `ARCHITECTURE.md` 257–274, 452–457 |
| C7 | State explicitly which files the per-paper `paper-pXXX-extraction.md` audit trail serves (human audit + citation-validator spot-checks per E3) — or drop the "MANDATORY" label. | `extraction-synthesizer.md` 34, 99–142 |

**Acceptance:** the lint script (G1) passes: every consumed file has a producer, every documented file has an owner, doc lists match the contract table.

---

## Workstream D — Deterministic quality gates

| # | Fix | Files |
|---|-----|-------|
| D1 | **Make the consistency score computable.** Replace vague rubric with counted checks, e.g.: Theme traceability = (themes from synthesis matrix appearing as outline sections, by heading match or explicit mapping) / total themes × 40pts; Section coverage = outline sections present in draft / total × 30pts; Claim support = sampled draft claims traceable to synthesis rows / sample size × 30pts (fixed sample: every claim with a citation in 2 randomly chosen sections + intro/conclusion). Define each term ("present" = heading exists AND ≥100 words). Keep ≥75 PASS / 65–74 WARN / <65 FAIL, now derived from countable subscores; require the report to show the arithmetic. | `consistency-validator.md` 100–212 |
| D2 | **Tighten citation-validator PASS/FAIL.** PASS = zero FABRICATED and zero OUT_OF_CORPUS; WARN = only MISATTRIBUTED/format issues (report count, no fixed "<5" magic number — orchestrator asks the user at the checkpoint); FAIL otherwise. Validation procedure: enumerate every in-text citation, check each against the extraction matrix author/year/title, and for a 20% random sample verify the *claim* against the per-paper extraction file. | `citation-validator.md` 56–121 |
| D3 | Both gate reports get a machine-readable verdict header (`STATUS: PASS|WARN|FAIL`, `SCORE: NN`) so the orchestrator parses results instead of interpreting prose. | `citation-validator.md`, `consistency-validator.md`, `CLAUDE.md` gate handling |

**Acceptance:** two independent runs of each gate on the same inputs produce the same verdict; every score in a report is backed by shown counts.

---

## Workstream E — Methodology hardening

Recommended scope: **honest repositioning + cheap rigor additions** (full search-stage automation stays on the roadmap).

| # | Fix | Files |
|---|-----|-------|
| E1 | **Re-scope claims.** README/ARCHITECTURE state plainly: this pipeline supports *narrative and scoping reviews*, and *assists* (not replaces) PRISMA systematic reviews — the user supplies the documented search; dual independent screening and formal risk-of-bias assessment are not automated. Template's "Review Type" section gets a note on what each type additionally requires. | `README.md`, `ARCHITECTURE.md`, `settings/screening-criteria.md` 32–37 |
| E2 | **Search provenance (manual, documented).** New optional `settings/search-strategy.md` template (databases, query strings, dates, results counts). If present, the screener copies it into the PRISMA diagram's identification section; if absent, the PRISMA output explicitly says identification was not systematic. | new template; `literature-screener.md` PRISMA section |
| E3 | **Extraction spot-check loop (closes the gates' ground-truth gap).** After Phase 2, the quality report instructs: orchestrator asks the user to verify N random per-paper extraction files against source PDFs (N = max(3, 10%)) at the (now formalized) Phase 2 checkpoint. | `extraction-synthesizer.md` quality-report section; `CLAUDE.md` checkpoint list |
| E4 | **Lightweight quality appraisal.** Extraction template gains per-paper fields: study design, sample/scope, and a 3-level quality flag (Strong / Moderate / Weak with one-line justification). Synthesis matrix weighs them; drafter's hedging rules reference them. Documented as "indicative appraisal, not GRADE/RoB substitute." | `extraction-synthesizer.md`, `literature-drafter.md` |
| E5 | **Dual-screen option for borderline papers.** Pass 2 addition: papers within the UNCERTAIN band get a second independent screening pass (fresh reasoning, criteria re-read); disagreement → UNCERTAIN → human. Cheap approximation of dual screening where it matters most. | `literature-screener.md` Pass 2 |
| E6 | **Deduplication step.** Pass 1 addition: detect same-title/same-DOI duplicates, keep the most complete, record in PRISMA counts. | `literature-screener.md` Pass 1 |
| E7 | **AI-use disclosure artifact.** Phase 6 or 7 additionally emits `outputs/methods-disclosure.md`: a ready-to-adapt paragraph disclosing LLM-assisted screening/extraction/drafting, human checkpoints performed, and verification steps — aligned with emerging journal/PRISMA-AI expectations. | `contribution-framer.md` (recommended owner) + contract table |
| E8 | Fix the template's internal contradiction: temporal scope 2018–2025 vs "[x] Published before 2023" exclusion (line 163) — uncheck and set placeholder `[YEAR]` so the example is internally consistent. Also soften the Security section's "Claude doesn't retain your PDFs" to "subject to your Anthropic plan and data settings." | `settings/screening-criteria.md` 100–105 vs 161–165; `ARCHITECTURE.md` 661–676 |

**Acceptance:** no doc claims unattended PRISMA compliance; a run without `search-strategy.md` produces a PRISMA diagram that says so; extraction matrix rows carry quality flags.

---

## Workstream F — Repo hygiene

| # | Fix | Files |
|---|-----|-------|
| F1 | `.gitignore`: remove duplicate `*.log` / `.DS_Store` entries; remove the `!.claude/instructions.txt` exception (file doesn't exist); keep `!outputs/execution-log.example.json` and actually add that example file (C3); add `!corpus/.gitkeep` for robustness. | `.gitignore` |
| F2 | README "Claude Desktop" invocation claim: subagent orchestration requires Claude Code — correct the supported-clients statement. | `README.md` 141–156 |
| F3 | Sweep both docs for remaining references to the old skills-based layout after A/C land. | `README.md`, `ARCHITECTURE.md` |

---

## Workstream G — Drift prevention

| # | Fix | Files |
|---|-----|-------|
| G1 | `scripts/validate-contracts.sh` (bash + grep/awk, no deps): parses each agent's "Input Requirements" / "Output Files" sections and the ARCHITECTURE contract table; fails on (a) consumed-but-never-produced, (b) documented-but-unowned, (c) forbidden strings (`Task tool`, `subagent_type`, `AskUserQuestion` inside specialist bodies, "ask the user" in agent specs). | new script |
| G2 | GitHub Actions workflow running G1 on PRs touching `.claude/agents/`, `CLAUDE.md`, `README.md`, `ARCHITECTURE.md`. *Optional — skip if CI is unwanted.* | `.github/workflows/validate.yml` |

---

## Sequencing & PR strategy

Order: **B → C → D** (behavior first: specs must be executable and contracts true before docs describe them) → **E** (methodology, builds on B/C) → **A + F** (docs rewritten once against the final state) → **G** (lint last, validates everything).

One PR per workstream pairing, on `claude/tender-brown-rdnfwf` (or stacked branches if preferred):
1. **PR 1 — "Make agent specs executable"**: B1–B9, C4, C5, C7
2. **PR 2 — "Reconcile contracts & gates"**: C1–C3, C6, D1–D3
3. **PR 3 — "Methodology honesty & rigor"**: E1–E8
4. **PR 4 — "Docs & hygiene"**: A1–A8, F1–F3
5. **PR 5 — "Contract lint"**: G1 (G2 if approved)

Each PR's acceptance criteria are the workstream acceptance lines above; PR 5's CI must pass on the final state of PRs 1–4.

## Open decisions (owner input wanted)

1. **E-scope:** the plan recommends repositioning + cheap rigor (E1–E8). Alternative: also build a true Phase 0 search agent — bigger scope, deferred by default.
2. **G2 CI:** add the GitHub Actions check, or keep the lint script manual-only?
3. **PR granularity:** 5 stacked PRs as above, or one combined PR with 5 reviewable commits?
