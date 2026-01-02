import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";

// Function to handle the streaming response
function makeStream(generator: AsyncGenerator<any, void, unknown>) {
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

export async function POST(req: NextRequest) {
    try {
        const { promptPath, yoloMode, provider = "gemini" } = await req.json();

        if (!promptPath || typeof promptPath !== "string") {
            return NextResponse.json({ error: "Invalid prompt path" }, { status: 400 });
        }

        if (!["gemini", "claude"].includes(provider)) {
            return NextResponse.json({ error: "Invalid provider. Must be 'gemini' or 'claude'" }, { status: 400 });
        }

        // Security: Ensure prompt is within allowed directory
        const sanitizedPath = path.normalize(promptPath).replace(/^(\.\.[\/\\])+/, "");
        const allowedDir = "prompts";
        // The path usually comes as "prompts/phase1.md", so we check if it starts with prompts
        if (!sanitizedPath.startsWith(allowedDir)) {
            return NextResponse.json({ error: "Invalid directory" }, { status: 403 });
        }

        const projectRoot = path.join(process.cwd(), ".."); // Go up from 'interface'
        const fullPromptPath = path.join(projectRoot, sanitizedPath);

        if (!fs.existsSync(fullPromptPath)) {
            return NextResponse.json({ error: "Prompt file not found" }, { status: 404 });
        }

        const promptContent = fs.readFileSync(fullPromptPath, "utf-8");

        // Provider-specific configuration
        let command: string = provider; // Default to provider name
        const args: string[] = [];

        if (provider === "gemini") {
            command = "gemini";
            if (yoloMode) {
                args.push("--yolo");
            }
        } else if (provider === "claude") {
            command = "claude";
            // Claude CLI doesn't have direct YOLO mode equivalent
            // Users can configure auto-approval in Claude settings if needed
        }

        // Spawn the selected CLI tool
        // Using shell: true for cross-platform PATH compatibility
        const child = spawn(command, args, {
            cwd: projectRoot,
            shell: true,
            env: { ...process.env, "NO_COLOR": "true" } // Try to strip colors for easier parsing
        });

        // Initialize streaming response
        const stream = makeStream(async function* () {
            // Write prompt to stdin
            yield `[System] Starting ${provider.charAt(0).toUpperCase() + provider.slice(1)} Agent...\n`;
            yield `[System] Reading prompt: ${sanitizedPath}\n`;
            yield `[System] Executing: ${command} ${args.join(" ")}\n\n`;

            // Pipe input
            if (child.stdin) {
                child.stdin.write(promptContent);
                child.stdin.end();
            }

            // Stream stdout
            if (child.stdout) {
                for await (const chunk of child.stdout) {
                    yield chunk.toString();
                }
            }

            // Stream stderr
            if (child.stderr) {
                for await (const chunk of child.stderr) {
                    yield `[Error] ${chunk.toString()}`;
                }
            }

            yield `\n[System] Process finished with exit code ${child.exitCode ?? "unknown"}`;
        }());

        return new NextResponse(stream, {
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
                "Cache-Control": "no-cache",
            },
        });

    } catch (error) {
        console.error("Agent execution failed:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
