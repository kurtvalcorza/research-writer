import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

// Maximum content size: 10MB
const MAX_CONTENT_SIZE = 10 * 1024 * 1024;

function getSafePath(relativePath: string, projectRoot: string): string | null {
    // Allow access to specific dirs
    const allowedRoots = ["prompts", "settings", "outputs"];

    // Normalize path and remove leading traversal sequences
    const normalized = path.normalize(relativePath).replace(/^(\.\.[\/\\])+/, "");
    const rootDir = normalized.split(path.sep)[0];

    if (!allowedRoots.includes(rootDir)) {
        return null;
    }

    // Resolve full paths
    const fullPath = path.resolve(projectRoot, normalized);
    const allowedPath = path.resolve(projectRoot, rootDir);

    // Ensure resolved path is within allowed directory
    if (!fullPath.startsWith(allowedPath + path.sep) && fullPath !== allowedPath) {
        return null;
    }

    return fullPath;
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const relPath = searchParams.get("path");

    if (!relPath || typeof relPath !== "string") {
        return NextResponse.json({ error: "Path required" }, { status: 400 });
    }

    if (relPath.length > 500) {
        return NextResponse.json({ error: "Path too long" }, { status: 400 });
    }

    try {
        const projectRoot = path.join(process.cwd(), "..");
        const fullPath = getSafePath(relPath, projectRoot);

        if (!fullPath) {
            return NextResponse.json({ error: "Invalid path or access denied" }, { status: 403 });
        }

        // Check if file exists
        const stats = await fs.stat(fullPath);

        if (stats.isDirectory()) {
            return NextResponse.json({ error: "Cannot read directories" }, { status: 400 });
        }

        if (stats.size > MAX_CONTENT_SIZE) {
            return NextResponse.json({ error: "File too large" }, { status: 400 });
        }

        const content = await fs.readFile(fullPath, "utf-8");
        return NextResponse.json({ content });
    } catch (error) {
        console.error("Read error:", error);

        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return NextResponse.json({ error: "File not found" }, { status: 404 });
        }

        return NextResponse.json({
            error: "Failed to read file",
            message: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { path: relPath, content } = body;

        if (!relPath || typeof relPath !== "string") {
            return NextResponse.json({ error: "Path required" }, { status: 400 });
        }

        if (typeof content !== "string") {
            return NextResponse.json({ error: "Content must be a string" }, { status: 400 });
        }

        if (relPath.length > 500) {
            return NextResponse.json({ error: "Path too long" }, { status: 400 });
        }

        // Check content size
        const contentBytes = Buffer.byteLength(content, "utf-8");
        if (contentBytes > MAX_CONTENT_SIZE) {
            return NextResponse.json({
                error: `Content too large. Maximum size is ${MAX_CONTENT_SIZE / 1024 / 1024}MB`
            }, { status: 400 });
        }

        const projectRoot = path.join(process.cwd(), "..");
        const fullPath = getSafePath(relPath, projectRoot);

        if (!fullPath) {
            return NextResponse.json({ error: "Invalid path or access denied" }, { status: 403 });
        }

        // Only allow writing to settings directory
        if (!relPath.startsWith("settings/")) {
            return NextResponse.json({
                error: "Write access only allowed for settings directory"
            }, { status: 403 });
        }

        // Ensure parent directory exists
        await fs.mkdir(path.dirname(fullPath), { recursive: true });

        await fs.writeFile(fullPath, content, "utf-8");
        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Write error:", error);
        return NextResponse.json({
            error: "Failed to write file",
            message: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}
