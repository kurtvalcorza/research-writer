#!/usr/bin/env bash
# validate-contracts.sh — drift guard for the Research Writer workflow.
#
# Checks:
#   1. Agent frontmatter sanity (name matches filename; description/tools present)
#   2. No specialist instructs itself to interact with the user mid-run
#      (statements that it CANNOT do so are allowed)
#   3. No stale platform terminology (Task tool / subagent_type /
#      research-workflow-orchestrator), except explicit alias notes
#   4. Contract graph closes: every required input file has exactly one
#      producer; orchestrator-owned files are documented in CLAUDE.md
#   5. CLAUDE.md spawn wiring matches the agent files on disk
#
# Exit 0 = clean. Exit 1 = violations printed to stdout.

set -uo pipefail
cd "$(dirname "$0")/.."

AGENTS_DIR=".claude/agents"
FAIL=0

err()  { printf 'ERROR: %s\n' "$*"; FAIL=1; }
note() { printf 'note:  %s\n' "$*"; }

# ---------------------------------------------------------------------------
# 1. Frontmatter sanity
# ---------------------------------------------------------------------------
for f in "$AGENTS_DIR"/*.md; do
  base=$(basename "$f" .md)
  name=$(awk -F': *' '/^name:/{print $2; exit}' "$f" | tr -d '"')
  [ "$name" = "$base" ] || err "$f: frontmatter name '$name' != filename '$base'"
  grep -q '^description:' "$f" || err "$f: missing 'description:' in frontmatter"
  grep -q '^tools:' "$f"       || err "$f: missing 'tools:' in frontmatter (omit only deliberately — omission inherits ALL tools)"
done

# ---------------------------------------------------------------------------
# 2. Forbidden mid-run user interaction in specialist specs
#    Match instructions like 'Ask user:', 'Ask the user', 'Ask: ...?', or
#    '(yes/no)'. Lines that state the agent CANNOT/never does so are fine.
# ---------------------------------------------------------------------------
while IFS=: read -r file line text; do
  [ -z "${file:-}" ] && continue
  if printf '%s' "$text" | grep -qiE 'cannot|CANNOT|never|unavailable|not available|would need'; then
    continue
  fi
  err "$file:$line: specialist appears instructed to interact with the user: ${text#"${text%%[![:space:]]*}"}"
done < <(grep -rniE 'Ask user|Ask the user|^\s*-?\s*Ask:|\(yes/no\)|[Pp]rompt the user' "$AGENTS_DIR" 2>/dev/null || true)

# ---------------------------------------------------------------------------
# 3. Stale platform terminology in docs and agents
#    Allowed only on lines that are explicit rename/alias notes.
# ---------------------------------------------------------------------------
while IFS=: read -r file line text; do
  [ -z "${file:-}" ] && continue
  if printf '%s' "$text" | grep -qiE 'renamed|alias'; then
    continue
  fi
  err "$file:$line: stale platform term: ${text#"${text%%[![:space:]]*}"}"
done < <(grep -rnE 'subagent_type|Task tool|research-workflow-orchestrator' \
           README.md ARCHITECTURE.md CLAUDE.md "$AGENTS_DIR" 2>/dev/null || true)

# ---------------------------------------------------------------------------
# 4. Contract graph
# ---------------------------------------------------------------------------
declare -A PRODUCER

normalize() {
  # Collapse per-paper file patterns to one canonical key
  printf '%s' "$1" | sed -E 's/paper-p[X0-9]+-extraction\.md/paper-pXXX-extraction.md/'
}

# Orchestrator-owned files: must be documented in CLAUDE.md, never in agents
for f in execution-log.json execution-context.json workflow-execution-summary.md; do
  PRODUCER["outputs/$f"]="orchestrator(CLAUDE.md)"
  grep -q "$f" CLAUDE.md || err "orchestrator-owned file '$f' is not documented in CLAUDE.md"
done
# User-provided inputs
PRODUCER["settings/screening-criteria.md"]="user"
PRODUCER["corpus/"]="user"
PRODUCER["outputs/"]="orchestrator(CLAUDE.md)"   # the directory itself
# Repo fixtures (checked in, not produced by the workflow)
PRODUCER["outputs/execution-log.example.json"]="repo(fixture)"
[ -f outputs/execution-log.example.json ] || err "fixture outputs/execution-log.example.json is missing from the repo"

# Collect each agent's declared outputs (section: '## Output Files')
for f in "$AGENTS_DIR"/*.md; do
  agent=$(basename "$f" .md)
  while IFS= read -r path; do
    [ -z "$path" ] && continue
    key=$(normalize "$path")
    existing="${PRODUCER[$key]:-}"
    if [ -n "$existing" ] && [ "$existing" != "$agent" ] && [ "$existing" != "user" ]; then
      err "duplicate producer for '$key': $existing AND $agent"
    fi
    PRODUCER["$key"]="$agent"
  done < <(awk '/^## Output Files/{flag=1;next}/^## /{flag=0}flag' "$f" \
             | grep -oE '`(outputs|settings)/[^`]*`' | tr -d '`' || true)
done

# Check each agent's REQUIRED inputs (section: '## Input Requirements',
# stopping at the '**Optional' marker) against the producer map
for f in "$AGENTS_DIR"/*.md; do
  agent=$(basename "$f" .md)
  while IFS= read -r path; do
    [ -z "$path" ] && continue
    key=$(normalize "$path")
    if [ -z "${PRODUCER[$key]:-}" ]; then
      err "$agent requires '$path' but nothing produces it"
    fi
  done < <(awk '/^## Input Requirements/{flag=1;next}/^## /{flag=0}flag' "$f" \
             | awk '/\*\*Optional/{exit} {print}' \
             | grep -oE '`(outputs|settings|corpus)/[^`]*`' | tr -d '`' || true)
done

# Every outputs/ file CLAUDE.md mentions must have a producer
while IFS= read -r path; do
  [ -z "$path" ] && continue
  key=$(normalize "$path")
  if [ -z "${PRODUCER[$key]:-}" ]; then
    err "CLAUDE.md references '$path' but nothing produces it"
  fi
done < <(grep -oE '`outputs/[A-Za-z0-9._X-]+`' CLAUDE.md | tr -d '`' | sort -u || true)

# ---------------------------------------------------------------------------
# 5. CLAUDE.md spawn wiring <-> agent files on disk
# ---------------------------------------------------------------------------
while IFS= read -r a; do
  [ -z "$a" ] && continue
  [ -f "$AGENTS_DIR/$a.md" ] || err "CLAUDE.md spawns agent_type=\"$a\" but $AGENTS_DIR/$a.md does not exist"
done < <(grep -oE 'agent_type="[a-z0-9-]+"' CLAUDE.md | sed 's/agent_type="//;s/"//' | sort -u || true)

for f in "$AGENTS_DIR"/*.md; do
  base=$(basename "$f" .md)
  grep -q "$base" CLAUDE.md || err "agent '$base' exists on disk but CLAUDE.md never references it"
done

# ---------------------------------------------------------------------------
if [ "$FAIL" -eq 0 ]; then
  echo "OK: contracts, terminology, and wiring are consistent."
fi
exit "$FAIL"
