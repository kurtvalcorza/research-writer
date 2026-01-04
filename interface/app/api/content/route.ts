import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { validatePath } from "@/lib/utils";
import { FILE_LIMITS, ALLOWED_DIRECTORIES } from "@/lib/config";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const relPath = searchParams.get("path");

    if (!relPath || typeof relPath !== "string") {
        return NextResponse.json({ error: "Path required" }, { status: 400 });
    }

    if (relPath.length > FILE_LIMITS.MAX_PATH_LENGTH) {
        return NextResponse.json({ error: "Path too long" }, { status: 400 });
    }

    try {
        const projectRoot = path.join(process.cwd(), "..");
        const fullPath = validatePath(relPath, ALLOWED_DIRECTORIES.CONTENT_DIRS, projectRoot);

        if (!fullPath) {
            return NextResponse.json({ error: "Invalid path or access denied" }, { status: 403 });
        }

        // Check if file exists
        const stats = await fs.stat(fullPath);

        if (stats.isDirectory()) {
            return NextResponse.json({ error: "Cannot read directories" }, { status: 400 });
        }

        if (stats.size > FILE_LIMITS.MAX_CONTENT_SIZE) {
            return NextResponse.json({ error: "File too large" }, { status: 400 });
        }

        const content = await fs.readFile(fullPath, "utf-8");
        return NextResponse.json({ content });
    } catch (error) {
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

        if (relPath.length > FILE_LIMITS.MAX_PATH_LENGTH) {
            return NextResponse.json({ error: "Path too long" }, { status: 400 });
        }

        // Check content size
        const contentBytes = Buffer.byteLength(content, "utf-8");
        if (contentBytes > FILE_LIMITS.MAX_CONTENT_SIZE) {
            return NextResponse.json({
                error: `Content too large. Maximum size is ${FILE_LIMITS.MAX_CONTENT_SIZE / 1024 / 1024}MB`
            }, { status: 400 });
        }

        const projectRoot = path.join(process.cwd(), "..");
        const fullPath = validatePath(relPath, ALLOWED_DIRECTORIES.CONTENT_DIRS, projectRoot);

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
        return NextResponse.json({
            error: "Failed to write file",
            message: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}
