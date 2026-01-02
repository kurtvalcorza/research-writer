import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

// Function to safely get directory path
function getSafePath(dirName: string) {
    const allowedDirs = ["corpus", "outputs", "prompts", "template"];
    if (!allowedDirs.includes(dirName)) {
        throw new Error("Invalid directory");
    }
    // Go up one level from 'interface' to root, then into target dir
    // interface is at /.../research-writer/interface
    // we want /.../research-writer/{dirName}
    return path.join(process.cwd(), "..", dirName);
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const dir = searchParams.get("dir");

    if (!dir) {
        return NextResponse.json({ error: "Directory required" }, { status: 400 });
    }

    try {
        const dirPath = getSafePath(dir);

        // Check if dir exists
        try {
            await fs.access(dirPath);
        } catch {
            // Create if not exists (e.g. outputs might be missing)
            await fs.mkdir(dirPath, { recursive: true });
        }

        const files = await fs.readdir(dirPath);

        const fileStats = await Promise.all(
            files.map(async (file) => {
                const filePath = path.join(dirPath, file);
                const stats = await fs.stat(filePath);
                return {
                    name: file,
                    size: stats.size,
                    mtime: stats.mtime,
                    isDirectory: stats.isDirectory()
                };
            })
        );

        // Filter out directories if needed, or keeping them.
        // For now, let's just return everything but maybe filter .gitkeep or similar later.
        return NextResponse.json({ files: fileStats });

    } catch (error) {
        return NextResponse.json({ error: "Failed to list files" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const dir = searchParams.get("dir");
    const filename = searchParams.get("filename");

    if (!dir || !filename) {
        return NextResponse.json({ error: "Dir and filename required" }, { status: 400 });
    }

    try {
        const dirPath = getSafePath(dir);
        // Basic sanitization
        const safeFilename = path.basename(filename);
        const filePath = path.join(dirPath, safeFilename);

        await fs.unlink(filePath);

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete file" }, { status: 500 });
    }
}
