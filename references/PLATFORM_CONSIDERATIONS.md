# Platform Considerations & Troubleshooting

This document outlines known limitations, behaviors, and configuration requirements for different AI agent platforms running the Research Writer system.

---

## 1. Claude Code (CLI/Desktop)

**Capability Profile:**
- **Shell Access:** Full (Subject to user approval).
- **File Access:** Full.
- **Tools:** Native `grep`, `glob`, `edit`, `bash`.

**Known Issues:**
- **Timeout:** Long-running tasks (like PDF screening) may timeout.
- **Mitigation:** Use `checkpoints` or `resume` features if available.

**Validation Notes:**
- OQ Shell Execution (VAL-OQ-003) should PASS.
- PQ Interruption Recovery (VAL-PQ-003) is critical here due to session limits.

---

## 2. Gemini CLI

**Capability Profile:**
- **Shell Access:** Restricted/Simulated.
- **File Access:** Full.
- **Tools:** `run_shell_command` (Python wrapper).

**Known Issues:**
- `git` commands might behave differently than in a native shell.
- Colored output from CLI tools might be stripped or raw.

**Validation Notes:**
- OQ Shell Execution (VAL-OQ-003) might show warnings.
- Ensure `run_shell_command` is available in the environment.

---

## 3. Windows vs Linux/macOS

**Path Separators:**
- The system handles paths using `/` (forward slash) internally where possible.
- **Windows Users:** Ensure your agent is using `\` or `/` consistently. Use `os.path.join` equivalent in scripts.

**Command Availability:**
- `ls` vs `dir`: The validation skill checks for `ls`. On Windows, `ls` might verify if using PowerShell, but `dir` is the native command.
- **Mitigation:** The OQ test uses generic commands or checks for alias availability.

---

## 4. Troubleshooting Common Failures

### "Tool not found" (OQ Failure)
- **Cause:** The agent environment does not have the specified tool enabled.
- **Fix:** Check `allowed-tools` in SKILL.md and your agent's configuration.

### "Permission denied" (IQ/OQ Failure)
- **Cause:** File system permissions or OS-level restrictions.
- **Fix:** Run agent with appropriate user permissions. Check file attributes.

### "Hallucination" (CQ Failure)
- **Cause:** Model temperature too high or context window overflow.
- **Fix:** Lower temperature in settings. Reduce batch size of PDFs.
