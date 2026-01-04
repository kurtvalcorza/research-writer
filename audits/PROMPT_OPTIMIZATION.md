# Prompt Optimization - Skill Injection Removal

## Problem

When executing phases from the UI, the system was encountering "Prompt is too long" errors. This occurred because:

1. The UI read the prompt file (e.g., `quick-start/phase1.md`)
2. Detected references to skill files (e.g., `skills/01_literature-discovery/SKILL.md`)
3. **Auto-injected the entire skill file content** into the prompt before sending to the CLI
4. The combined prompt + skill content exceeded the CLI's prompt size limit

For example, Phase 1's SKILL.md is 574 lines, which when injected alongside the prompt, exceeded limits.

## Solution

**Removed auto-injection and switched to reference-based approach:**

- ✅ Agents now **read skill files when needed** using their Read tool
- ✅ Prompts contain clear instructions to "Read and execute" the skill file
- ✅ No upfront context bloat - skills loaded only if/when agent needs them
- ✅ Works for ALL phases (1, 2, 3, 4, 4.5, 6, 7)

## Changes Made

### 1. Backend Changes
**File:** `interface/app/api/agent/run/route.ts`

**Before:**
```typescript
let promptContent = fs.readFileSync(fullPromptPath, "utf-8");

// Auto-inject skill files
const skillMatches = promptContent.match(/skills\/[\w\-\/]+\.md/g);
if (skillMatches) {
    for (const skillRelPath of skillMatches) {
        const skillContent = fs.readFileSync(fullSkillPath, "utf-8");
        injectedSkills.push(`\n\n---\n# INJECTED SKILL: ${skillRelPath}\n\n${skillContent}`);
    }
    promptContent += injectedSkills.join("");
}
```

**After:**
```typescript
const promptContent = fs.readFileSync(fullPromptPath, "utf-8");

// Note: Skills are referenced in prompts but NOT auto-injected
// Agents will use their Read tool to access skill files as needed
// This prevents "Prompt is too long" errors and reduces context usage
```

### 2. Prompt Minimization

Reduced ALL phase prompts to minimal, consistent format (16-21 lines each):

**Before:** 26-117 lines per prompt (verbose instructions)
**After:** 16-21 lines per prompt (concise, focused)

**New minimal format:**
```markdown
# Phase X: Title

Brief description.

## Instructions

1. Read the complete SKILL file: `skills/0X_*/SKILL.md`
2. Follow all steps in the SKILL exactly as specified
3. Read inputs from: [paths]

## Outputs

Generate these files in `outputs/`:
- [output files]

BEGIN.
```

**Line count reduction:**
- Phase 1: 68 → 19 lines
- Phase 2: 65 → 17 lines
- Phase 3: 26 → 16 lines
- Phase 4: 26 → 18 lines
- Phase 4.5: 77 → 19 lines
- Phase 6: 29 → 19 lines
- Phase 7: 117 → 21 lines

## Benefits

1. **Eliminates "Prompt is too long" errors** - No upfront injection of large skill files
2. **Reduces context usage** - Agents only load what they need, when they need it
3. **Faster startup** - No time spent injecting multiple large files
4. **More flexible** - Agents can re-read skills if needed during execution
5. **Consistent with design** - Prompts are entry points, skills are implementation guides

## Architecture Alignment

This change aligns with the intended two-layer architecture:

- **Prompts** (`quick-start/phaseX.md`) - Concise invocation instructions (entry point)
- **Skills** (`skills/0X_*/SKILL.md`) - Detailed technical specs (read when needed)

The agent reads the prompt, sees the instruction to read the skill file, and uses its Read tool to access it.

## Additional Fix: Claude CLI stdin Limitation

After initial implementation, discovered that Claude CLI has a prompt length limit when receiving input via **stdin piping**, even with minimal prompts.

### Root Cause
- When piping prompt via stdin: `echo "prompt" | claude` → "Prompt is too long"
- When passing as argument: `claude --print "prompt"` → Works correctly

### Solution
Modified the backend to use command arguments instead of stdin for Claude CLI:

```typescript
if (provider === "claude") {
    command = "claude";
    args.push("--print");
    args.push(promptContent);  // Pass as argument instead of piping
    useStdin = false;
}
```

This approach:
- Bypasses Claude CLI's stdin length limitation
- Maintains Gemini CLI's stdin piping (works fine)
- Provider-specific handling ensures compatibility

## Testing Recommendation

Before deploying, test Phase 1 execution:
1. Navigate to Prompts UI
2. Select Phase 1
3. Click "Run Agent"
4. Verify: No "Prompt is too long" error
5. Verify: Agent successfully reads SKILL.md and executes the workflow

## Notes

- The SKILL-EXEC.md file created earlier is no longer needed (can be deleted)
- All skill files remain unchanged - they are complete implementation guides
- This approach is CLI-agnostic - works with Claude CLI, Gemini CLI, etc.
