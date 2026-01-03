import { NextRequest, NextResponse } from "next/server";
import { spawn, ChildProcess } from "child_process";
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

        const projectRoot = path.join(process.cwd(), ".."); // Go up from 'interface'

        // Secure path validation with proper traversal protection
        const fullPromptPath = validateAndResolvePath(promptPath, "prompts", projectRoot);

        if (!fullPromptPath) {
            return NextResponse.json({ error: "Invalid directory or path traversal attempt" }, { status: 403 });
        }

        if (!fs.existsSync(fullPromptPath)) {
            return NextResponse.json({ error: "Prompt file not found" }, { status: 404 });
        }

        const promptContent = fs.readFileSync(fullPromptPath, "utf-8");

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
        // On Windows, npm globals are .cmd files which require a shell to execute
        child = spawn(command, args, {
            cwd: projectRoot,
            shell: isWindows, // Enable shell on Windows to resolve .cmd files
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
        }, MAX_EXECUTION_TIME);

        // Clean up on client disconnect
        req.signal.addEventListener('abort', () => {
            if (timeoutId) clearTimeout(timeoutId);
            if (child && !child.killed) {
                child.kill("SIGTERM");
            }
        });

        // Initialize streaming response
        const stream = makeStream(async function* () {
            try {
                const sanitizedPath = path.normalize(promptPath).replace(/^(\.\.[\/\\])+/, "");
                yield `[System] Starting ${provider.charAt(0).toUpperCase() + provider.slice(1)} Agent...\n`;
                yield `[System] Reading prompt: ${sanitizedPath}\n`;
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

                // Stream stderr
                if (child?.stderr) {
                    for await (const chunk of child.stderr) {
                        yield `[Error] ${chunk.toString()}`;
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
