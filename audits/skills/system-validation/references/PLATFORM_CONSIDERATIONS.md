# Platform-Specific Considerations

This document provides platform-specific guidance for executing the System Validation Skill across different AI agent environments.

---

## Gemini CLI

**Tool Support:** Requires `conductor` extension for standardized tool interface

**Special Requirements:**
- Must use `--yolo` flag to enable full tool support
- `conductor` extension must be installed
- Check `.gitignore` configuration to ensure corpus access

**Command:**
```bash
gemini --yolo -p "Execute audits/skills/system-validation/SKILL.md"
```

**Known Limitations:**
- Shell execution disabled by default (safe mode)
- File write operations may require explicit permission
- PDF reading requires `conductor` extension

**OQ-003 (Shell Execution) Expected Result:** ⚠️ RESTRICTED (without --yolo)

**Workarounds:**
- Always use `--yolo` flag for validation work
- Verify `conductor` extension is active before starting
- Test shell access with simple `echo` command first

---

## Claude Code Desktop

**Tool Support:** Native (no special flags or extensions required)

**Special Requirements:**
- None

**Command:**
```
Execute audits/skills/system-validation/SKILL.md
```

**Known Limitations:**
- None identified

**OQ-003 (Shell Execution) Expected Result:** ✅ PASS

**Advantages:**
- Most seamless execution experience
- Full tool support out-of-the-box
- No configuration required

---

## Claude Code CLI

**Tool Support:** Native

**Special Requirements:**
- Incremental workflow design to prevent context overflow
- State management files for resumption

**Command:**
```bash
claude --print "Execute audits/skills/system-validation/SKILL.md"
```

**Known Limitations:**
- Context window management required for large corpora
- Incremental processing validated (no batch mode)

**OQ-003 (Shell Execution) Expected Result:** ✅ PASS

**Best Practices:**
- Use incremental workflow design for PQ-001
- Leverage state files (`screening-progress.md`) for interruption recovery
- Clear context between large operations

---

## Anthropic API (Direct)

**Tool Support:** Requires custom tool implementation

**Special Requirements:**
- Implement tool handlers for Read, Write, Bash, Glob, Grep
- Handle tool response streaming
- Manage state persistence externally

**Implementation Notes:**
- Use Anthropic SDK for tool calling
- Implement file I/O with appropriate sandboxing
- Handle shell execution with caution (security considerations)

**OQ-003 (Shell Execution) Expected Result:** Implementation-dependent

**Recommended Approach:**
- Use Anthropic's official tool use examples
- Implement tools incrementally (Read/Write first, then Bash)
- Test each tool in isolation before full validation

---

## OpenAI API (ChatGPT/GPT-4)

**Tool Support:** Requires function calling implementation

**Special Requirements:**
- Implement functions for Read, Write, Execute
- Map function calls to local operations
- Handle streaming responses

**Known Differences:**
- Function calling syntax differs from Anthropic's tool use
- May require adapter layer for skill compatibility
- Context window handling differs

**OQ-003 (Shell Execution) Expected Result:** Implementation-dependent

**Compatibility Notes:**
- Skill YAML frontmatter is platform-agnostic
- Execution steps may require translation for OpenAI function format
- Consider using LangChain or similar framework for standardization

---

## Custom/Internal Agents

**Tool Support:** Varies by implementation

**Example: Antigravity Internal Agent**
- Executed via custom Python scripts
- Manual implementation of Read/Write/Parse operations
- Bypasses CLI wrapper for direct logic validation

**Validation Approach:**
- Test screening logic independently of CLI
- Implement tool operations as Python functions
- Generate outputs programmatically

**Use Case:**
- Logic validation without CLI dependencies
- Testing in restricted environments
- Batch processing with custom orchestration

---

## Platform Comparison Matrix

| Platform | Tool Support | Shell Access | PDF Reading | Special Config | Recommended Use |
|----------|--------------|--------------|-------------|----------------|----------------|
| **Gemini CLI** | conductor extension | ⚠️ Requires --yolo | ✅ Yes | --yolo flag | Production (with config) |
| **Claude Code Desktop** | Native | ✅ Full | ✅ Yes | None | Production (recommended) |
| **Claude Code CLI** | Native | ✅ Full | ✅ Yes | Incremental workflow | Production |
| **Anthropic API** | Custom impl. | Depends on impl. | Depends on impl. | Tool handlers | Custom integrations |
| **OpenAI API** | Custom impl. | Depends on impl. | Depends on impl. | Function calling | Custom integrations |
| **Custom Agents** | Manual | Manual | Manual | Implementation-specific | Testing/Development |

---

## General Best Practices

### Before Starting Validation

1. **Verify tool availability**
   - Test Read with a simple file
   - Test Write with a temp file
   - Test Bash with `echo "test"`

2. **Check file access**
   - Verify `.gitignore` doesn't block `corpus/` or `outputs/`
   - Test PDF access with a sample file

3. **Platform-specific setup**
   - Gemini CLI: Add `--yolo` flag
   - API implementations: Test tool handlers
   - Custom agents: Verify script dependencies

### During Validation

1. **Monitor for platform-specific issues**
   - Shell execution failures → Check platform permissions
   - PDF reading errors → Verify parsing library availability
   - File access denied → Review `.gitignore` and permissions

2. **Document platform deviations**
   - Use deviation logs for platform-specific failures
   - Note RESTRICTED status for limited tool access
   - Document workarounds used

### After Validation

1. **Platform-specific recommendations**
   - Document required configuration for future runs
   - Note any platform limitations in final report
   - Provide setup guidance for new users

---

## Cross-Platform Validation Notes

When validating across multiple platforms (VAL-PQ-003):

1. **Use identical test corpus** across all platforms
2. **Expect minor differences** in:
   - Execution time
   - Tool availability (document as RESTRICTED, not FAIL)
   - Metadata extraction precision (±5% acceptable)

3. **Require consistency** in:
   - Screening decisions (INCLUDE/EXCLUDE/UNCERTAIN)
   - PRISMA flow diagram numbers
   - Output file structure

4. **Document platform recommendations** based on testing:
   - Best platform for production use
   - Platforms requiring special configuration
   - Platforms not recommended (if any)

---

**Last Updated:** 2026-01-04
**Document Version:** 1.0
