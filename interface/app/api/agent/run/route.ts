import { NextRequest, NextResponse } from "next/server";
import { spawn, ChildProcess, execSync } from "child_process";
import fs from "fs";
import path from "path";
import { validatePath } from "@/lib/utils";
import { AGENT_CONFIG } from "@/lib/config";

// Function to handle the streaming response
function makeStream(generator: AsyncGenerator<string, void, unknown>) {
    const encoder = new TextEncoder();
    return new ReadableStream({
        async pull(controller) {
            const { value, done } = await generator.next();
            if (done) {
                controller.close();
            } else {
                controller.enqueue(encoder.encode(value));
            }
        },
    });
}

// Helper to check if provider CLI is available and return its path
function getProviderPath(provider: string): string | null {
    try {
        const command = process.platform === "win32" ? `where ${provider}` : `which ${provider}`;
        // stdio: 'pipe' to capture output
        const output = execSync(command, { encoding: "utf-8", stdio: "pipe" });
        // Get the first line (first match) and trim whitespace
        return output.split(/\r?\n/)[0].trim();
    } catch {
        return null;
    }
}

export async function POST(req: NextRequest) {
    let child: ChildProcess | null = null;
    let timeoutId: NodeJS.Timeout | null = null;
    let useStdin = true; // Flag to determine if we use stdin or command args

    try {
        const { promptPath, yoloMode, provider = "gemini" } = await req.json();

        // Validate input
        if (!promptPath || typeof promptPath !== "string") {
            return NextResponse.json({ error: "Invalid prompt path" }, { status: 400 });
        }

        if (typeof yoloMode !== "boolean" && yoloMode !== undefined) {
            return NextResponse.json({ error: "Invalid yoloMode value" }, { status: 400 });
        }

        // Claude Code CLI removed due to critical validation failures
        // See audits/reports/PHASE_1_MULTIPLATFORM_VALIDATION_REPORT.md Section 7
        // Only Gemini CLI is supported
        if (provider !== "gemini") {
            return NextResponse.json({
                error: "Invalid provider. Only 'gemini' is supported.",
                message: "Claude Code CLI has been removed due to critical validation failures (context overflow with ≥6 PDFs). Please use Gemini CLI or copy the prompt to Claude.ai."
            }, { status: 400 });
        }

        // 1. Pre-flight Check: Provider Availability
        const providerPath = getProviderPath(provider);
        if (!providerPath) {
            return NextResponse.json({
                error: `${provider} CLI not found`,
                message: `The ${provider} CLI tool is not installed or not in your PATH. Please install it to use this agent.`
            }, { status: 503 });
        }

        const projectRoot = path.join(process.cwd(), ".."); // Go up from 'interface'

        // 2. Pre-flight Check: Corpus Validation
        const corpusPath = path.join(projectRoot, "corpus");
        if (!fs.existsSync(corpusPath)) {
            return NextResponse.json({
                error: "Corpus directory missing",
                message: "The 'corpus' directory was not found. Please create it and add your research PDFs."
            }, { status: 404 });
        }

        const pdfFiles = fs.readdirSync(corpusPath).filter(f => f.toLowerCase().endsWith(".pdf"));
        if (pdfFiles.length === 0) {
            return NextResponse.json({
                error: "Corpus is empty",
                message: "No PDF files found in the 'corpus' directory. Please add at least one PDF to screen."
            }, { status: 400 });
        }

        // Secure path validation with proper traversal protection
        const fullPromptPath = validatePath(promptPath, "quick-start", projectRoot);

        if (!fullPromptPath) {
            return NextResponse.json({ error: "Invalid directory or path traversal attempt" }, { status: 403 });
        }

        if (!fs.existsSync(fullPromptPath)) {
            return NextResponse.json({ error: "Prompt file not found" }, { status: 404 });
        }

        const promptContent = fs.readFileSync(fullPromptPath, "utf-8");

        // Note: Skills are referenced in prompts but NOT auto-injected
        // Agents will use their Read tool to access skill files as needed
        // This prevents "Prompt is too long" errors and reduces context usage

        // Provider-specific configuration (Gemini CLI only)
        const args: string[] = [];

        if (yoloMode) {
            args.push("--yolo");
        }

        // Spawn the selected CLI tool directly without shell
        // This mitigates command injection risks
        child = spawn(providerPath, args, {
            cwd: projectRoot,
            shell: false, // Explicitly disable shell
            env: { ...process.env, "NO_COLOR": "1", "FORCE_COLOR": "0" }
        });

        // Set up timeout
        timeoutId = setTimeout(() => {
            if (child && !child.killed) {
                child.kill("SIGTERM");
                setTimeout(() => {
                    if (child && !child.killed) {
                        child.kill("SIGKILL");
                    }
                }, 5000);
            }
        }, AGENT_CONFIG.MAX_EXECUTION_TIME);

        // 4. Clean up on client disconnect (Improved)
        req.signal.addEventListener('abort', () => {
            if (timeoutId) clearTimeout(timeoutId);
            if (child && !child.killed) {
                child.kill("SIGTERM");
                // Give it a chance to clean up gracefully
                setTimeout(() => {
                    if (child && !child.killed) {
                        child.kill("SIGKILL");
                    }
                }, 5000);
            }
        });

        // Initialize streaming response
        const stream = makeStream(async function* () {
            try {
                const sanitizedPath = path.normalize(promptPath).replace(/^(\.\.[\/\\])+/, "");
                yield `[System] Starting ${provider.charAt(0).toUpperCase() + provider.slice(1)} Agent...\n`;
                yield `[System] Reading prompt: ${sanitizedPath}\n`;
                // yield `[System] Executing: ${command} ${args.join(" ")}\n\n`; // Do not expose full path

                // Pipe input (only for providers that use stdin)
                if (useStdin && child?.stdin) {
                    child.stdin.write(promptContent);
                    child.stdin.end();
                }

                // Stream stdout
                if (child?.stdout) {
                    for await (const chunk of child.stdout) {
                        yield chunk.toString();
                    }
                }

                // Stream stderr with enhanced error detection
                if (child?.stderr) {
                    for await (const chunk of child.stderr) {
                        const errorText = chunk.toString();
                        const lowerError = errorText.toLowerCase();

                        // Detect tool-related errors
                        if (lowerError.includes("tool not found") ||
                            lowerError.includes("run_shell_command") ||
                            lowerError.includes("no tool named") ||
                            lowerError.includes("conductor")) {
                            yield `\n[CRITICAL ERROR] Missing Required Tool Detected\n`;
                            yield `[Error] ${errorText}`;
                            yield `\n[SUGGESTION] This error suggests the ${provider} CLI lacks required tools.\n`;
                            if (provider === "gemini") {
                                yield `[SUGGESTION] For Gemini: Install the 'conductor' extension or switch to Claude CLI.\n`;
                            } else {
                                yield `[SUGGESTION] For Claude: Ensure you have the latest version installed.\n`;
                            }
                            yield `[SUGGESTION] Use the "Check System" button to verify tool availability.\n\n`;
                        } else {
                            yield `[Error] ${errorText}`;
                        }
                    }
                }

                yield `\n[System] Process finished with exit code ${child?.exitCode ?? "unknown"}`;
            } catch (streamError) {
                yield `\n[System Error] ${streamError instanceof Error ? streamError.message : "Unknown error occurred"}`;
            } finally {
                if (timeoutId) clearTimeout(timeoutId);
            }
        }());

        return new NextResponse(stream, {
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
                "Cache-Control": "no-cache",
                "X-Content-Type-Options": "nosniff",
            },
        });

    } catch (error) {
        // Clean up on error
        if (timeoutId) clearTimeout(timeoutId);
        if (child && !child.killed) {
            child.kill("SIGTERM");
        }

        return NextResponse.json({
            error: "Internal Server Error",
            message: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}
