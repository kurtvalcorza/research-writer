import { NextRequest, NextResponse } from "next/server";
import { spawn, ChildProcess, execSync } from "child_process";
import fs from "fs";
import path from "path";

// Maximum execution time: 10 minutes
const MAX_EXECUTION_TIME = 10 * 60 * 1000;

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

// Secure path validation
function validateAndResolvePath(relativePath: string, allowedDir: string, projectRoot: string): string | null {
    // Normalize and remove leading path traversal sequences
    const sanitizedPath = path.normalize(relativePath).replace(/^(\.\.[\/\\])+/, "");

    // Check if path starts with allowed directory
    if (!sanitizedPath.startsWith(allowedDir)) {
        return null;
    }

    // Resolve full paths
    const resolvedPath = path.resolve(projectRoot, sanitizedPath);
    const allowedPath = path.resolve(projectRoot, allowedDir);

    // Ensure resolved path is within allowed directory
    if (!resolvedPath.startsWith(allowedPath + path.sep) && resolvedPath !== allowedPath) {
        return null;
    }

    return resolvedPath;
}

// Helper to check if provider CLI is available
function isProviderAvailable(provider: string): boolean {
    try {
        const command = process.platform === "win32" ? `where ${provider}` : `which ${provider}`;
        // stdio: 'ignore' prevents output to console
        import("child_process").then(cp => cp.execSync(command, { stdio: "ignore" }));
        return true;
    } catch {
        return false;
    }
}

export async function POST(req: NextRequest) {
    let child: ChildProcess | null = null;
    let timeoutId: NodeJS.Timeout | null = null;

    try {
        const { promptPath, yoloMode, provider = "gemini" } = await req.json();

        // Validate input
        if (!promptPath || typeof promptPath !== "string") {
            return NextResponse.json({ error: "Invalid prompt path" }, { status: 400 });
        }

        if (typeof yoloMode !== "boolean" && yoloMode !== undefined) {
            return NextResponse.json({ error: "Invalid yoloMode value" }, { status: 400 });
        }

        if (!["gemini", "claude"].includes(provider)) {
            return NextResponse.json({ error: "Invalid provider. Must be 'gemini' or 'claude'" }, { status: 400 });
        }

        // 1. Pre-flight Check: Provider Availability
        if (!isProviderAvailable(provider)) {
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
        const fullPromptPath = validateAndResolvePath(promptPath, "prompts", projectRoot);

        if (!fullPromptPath) {
            return NextResponse.json({ error: "Invalid directory or path traversal attempt" }, { status: 403 });
        }

        if (!fs.existsSync(fullPromptPath)) {
            return NextResponse.json({ error: "Prompt file not found" }, { status: 404 });
        }

        let promptContent = fs.readFileSync(fullPromptPath, "utf-8");

        // 3. Skill Injection (Tactical Fix)
        // Match both 'skills/name/SKILL.md' and flexible 'skills/path/to/file.md'
        const skillMatches = promptContent.match(/skills\/[\w\-\/]+\.md/g);

        if (skillMatches) {
            const injectedSkills: string[] = [];

            for (const skillRelPath of skillMatches) {
                // Validate skill path securely
                const fullSkillPath = validateAndResolvePath(skillRelPath, "skills", projectRoot);

                if (fullSkillPath && fs.existsSync(fullSkillPath)) {
                    const skillContent = fs.readFileSync(fullSkillPath, "utf-8");
                    injectedSkills.push(`\n\n---\n# INJECTED SKILL: ${skillRelPath}\n\n${skillContent}`);
                } else {
                    console.warn(`[Warning] Could not resolve or read referenced skill: ${skillRelPath}`);
                    injectedSkills.push(`\n\n[System Warning] Referenced skill file '${skillRelPath}' could not be loaded.`);
                }
            }

            if (injectedSkills.length > 0) {
                promptContent += injectedSkills.join("");
            }
        }

        // Provider-specific configuration
        let command: string = provider;
        const args: string[] = [];
        const isWindows = process.platform === "win32";

        if (provider === "gemini") {
            command = "gemini";
            if (yoloMode) {
                args.push("--yolo");
            }
        } else if (provider === "claude") {
            command = "claude";
        }

        // Spawn the selected CLI tool
        child = spawn(command, args, {
            cwd: projectRoot,
            shell: isWindows,
            env: { ...process.env, "NO_COLOR": "1", "FORCE_COLOR": "0" }
        });

        // Set up timeout
        timeoutId = setTimeout(() => {
            if (child && !child.killed) {
                console.log("Execution timed out, terminating...");
                child.kill("SIGTERM");
                setTimeout(() => {
                    if (child && !child.killed) {
                        child.kill("SIGKILL");
                    }
                }, 5000);
            }
        }, MAX_EXECUTION_TIME);

        // 4. Clean up on client disconnect (Improved)
        req.signal.addEventListener('abort', () => {
            if (timeoutId) clearTimeout(timeoutId);
            if (child && !child.killed) {
                console.log("Client aborted, terminating agent...");
                child.kill("SIGTERM");
                // Give it a chance to clean up gracefully
                setTimeout(() => {
                    if (child && !child.killed) {
                        console.log("Force killing agent...");
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

                if (skillMatches && skillMatches.length > 0) {
                    yield `[System] Injected ${skillMatches.length} referenced skill(s) into context.\n`;
                }

                yield `[System] Executing: ${command} ${args.join(" ")}\n\n`;

                // Pipe input
                if (child?.stdin) {
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

        console.error("Agent execution failed:", error);
        return NextResponse.json({
            error: "Internal Server Error",
            message: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}
