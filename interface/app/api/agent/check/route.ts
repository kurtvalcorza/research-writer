import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";

// Helper to check if provider CLI is available
function isProviderAvailable(provider: string): boolean {
    try {
        const command = process.platform === "win32" ? `where ${provider}` : `which ${provider}`;
        require("child_process").execSync(command, { stdio: "ignore" });
        return true;
    } catch {
        return false;
    }
}

// Helper to check available tools for a provider
async function checkProviderTools(provider: string): Promise<{ available: boolean; tools: string[]; error?: string }> {
    if (!isProviderAvailable(provider)) {
        return {
            available: false,
            tools: [],
            error: `${provider} CLI not found in PATH`
        };
    }

    return new Promise((resolve) => {
        const isWindows = process.platform === "win32";
        const testPrompt = "List all available tools you have access to. Respond with just the tool names, one per line.";

        const child = spawn(provider, [], {
            shell: isWindows,
            env: { ...process.env, "NO_COLOR": "1", "FORCE_COLOR": "0" }
        });

        let stdout = "";
        let stderr = "";
        let timeout: NodeJS.Timeout;

        // Set a timeout for the check (10 seconds)
        timeout = setTimeout(() => {
            child.kill("SIGTERM");
            resolve({
                available: true,
                tools: [],
                error: "Tool check timed out"
            });
        }, 10000);

        if (child.stdin) {
            child.stdin.write(testPrompt);
            child.stdin.end();
        }

        if (child.stdout) {
            child.stdout.on("data", (data) => {
                stdout += data.toString();
            });
        }

        if (child.stderr) {
            child.stderr.on("data", (data) => {
                stderr += data.toString();
            });
        }

        child.on("close", (code) => {
            clearTimeout(timeout);

            // Parse tool list from output
            const tools: string[] = [];
            const lines = stdout.toLowerCase().split("\n");

            // Look for common tool keywords in output
            const toolKeywords = [
                "bash", "shell", "run_shell_command",
                "read", "read_file",
                "write", "write_file",
                "edit", "edit_file",
                "glob", "search",
                "grep", "search_file_content"
            ];

            for (const keyword of toolKeywords) {
                if (stdout.toLowerCase().includes(keyword)) {
                    tools.push(keyword);
                }
            }

            // Check for conductor extension (Gemini-specific)
            const hasConductor = stdout.toLowerCase().includes("conductor") ||
                                stdout.toLowerCase().includes("run_shell_command");

            resolve({
                available: true,
                tools: [...new Set(tools)], // Remove duplicates
                error: stderr ? stderr.substring(0, 500) : undefined
            });
        });

        child.on("error", (err) => {
            clearTimeout(timeout);
            resolve({
                available: false,
                tools: [],
                error: err.message
            });
        });
    });
}

export async function POST(req: NextRequest) {
    try {
        const { provider = "gemini" } = await req.json();

        if (!["gemini", "claude"].includes(provider)) {
            return NextResponse.json({
                error: "Invalid provider. Must be 'gemini' or 'claude'"
            }, { status: 400 });
        }

        // Quick check if CLI exists
        const isAvailable = isProviderAvailable(provider);

        if (!isAvailable) {
            return NextResponse.json({
                provider,
                available: false,
                installed: false,
                tools: [],
                message: `${provider} CLI is not installed or not in your PATH`,
                recommendation: provider === "gemini"
                    ? "Install Gemini CLI: npm install -g @anthropic/gemini-cli"
                    : "Install Claude CLI: npm install -g @anthropic/claude-cli"
            });
        }

        // Deep check for available tools
        const toolCheck = await checkProviderTools(provider);

        // Check for required tools based on skill requirements
        const requiredTools = ["bash", "run_shell_command", "read", "write", "edit", "glob", "grep"];
        const hasRequiredTools = requiredTools.some(tool =>
            toolCheck.tools.some(availableTool =>
                availableTool.toLowerCase().includes(tool.toLowerCase())
            )
        );

        // Specific check for shell/bash capability
        const hasShellCapability = toolCheck.tools.some(tool =>
            ["bash", "shell", "run_shell_command"].some(keyword =>
                tool.toLowerCase().includes(keyword.toLowerCase())
            )
        );

        let message = "";
        let recommendation = "";

        if (provider === "gemini" && !hasShellCapability) {
            message = "Gemini CLI found but may lack shell command execution capability";
            recommendation = "Install the 'conductor' extension for Gemini to enable file operations and shell commands, or switch to Claude CLI";
        } else if (hasShellCapability) {
            message = `${provider} CLI is properly configured with all required tools`;
        } else {
            message = `${provider} CLI found but tool capabilities could not be verified`;
            recommendation = "Tool detection inconclusive. Try running a phase to verify functionality.";
        }

        return NextResponse.json({
            provider,
            available: true,
            installed: true,
            tools: toolCheck.tools,
            hasShellCapability,
            hasRequiredTools,
            message,
            recommendation: recommendation || undefined,
            rawError: toolCheck.error
        });

    } catch (error) {
        console.error("System check failed:", error);
        return NextResponse.json({
            error: "System check failed",
            message: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}
