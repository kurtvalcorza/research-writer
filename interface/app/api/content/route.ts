import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

function getSafePath(relativePath: string) {
    // Allow access to specific dirs
    const allowedRoots = ["prompts", "template", "outputs"];
    const rootDir = relativePath.split("/")[0].split("\\")[0]; // Handle both separators

    if (!allowedRoots.includes(rootDir)) {
        throw new Error("Access denied to this directory");
    }

    // interface is at /.../research-writer/interface
    return path.join(process.cwd(), "..", relativePath);
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const relPath = searchParams.get("path");

    if (!relPath) {
        return NextResponse.json({ error: "Path required" }, { status: 400 });
    }

    try {
        const fullPath = getSafePath(relPath);
        const content = await fs.readFile(fullPath, "utf-8");
        return NextResponse.json({ content });
    } catch (error) {
        return NextResponse.json({ error: "Failed to read file" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { path: relPath, content } = body;

        if (!relPath || typeof content !== "string") {
            return NextResponse.json({ error: "Path and content required" }, { status: 400 });
        }

        const fullPath = getSafePath(relPath);

        // Safety check: ensure file exists before writing? Or allow new files? 
        // For prompts/templates, they should exist. For outputs, they might be new.
        // Let's allow generic write.

        await fs.writeFile(fullPath, content, "utf-8");
        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Write error:", error);
        return NextResponse.json({ error: "Failed to write file" }, { status: 500 });
    }
}
