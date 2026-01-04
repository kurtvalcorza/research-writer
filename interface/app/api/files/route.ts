import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

interface FileStat {
    name: string;
    size: number;
    mtime: Date;
    isDirectory: boolean;
}

// Function to safely get directory path
function getSafePath(dirName: string): string {
    const allowedDirs = ["corpus", "outputs", "prompts", "settings"];
    if (!allowedDirs.includes(dirName)) {
        throw new Error("Invalid directory");
    }
    return path.join(process.cwd(), "..", dirName);
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const dir = searchParams.get("dir");

    if (!dir || typeof dir !== "string") {
        return NextResponse.json({ error: "Directory required" }, { status: 400 });
    }

    try {
        const dirPath = getSafePath(dir);

        // Create directory if it doesn't exist - recursive: true is idempotent
        await fs.mkdir(dirPath, { recursive: true });

        const files = await fs.readdir(dirPath);

        const fileStats = await Promise.all(
            files.map(async (file): Promise<FileStat | null> => {
                try {
                    const filePath = path.join(dirPath, file);
                    const stats = await fs.stat(filePath);
                    return {
                        name: file,
                        size: stats.size,
                        mtime: stats.mtime,
                        isDirectory: stats.isDirectory()
                    };
                } catch (statError) {
                    // Skip files that can't be stat'd
                    return null;
                }
            })
        );

        // Filter out null entries (files that couldn't be stat'd) and directories
        const validFiles = fileStats.filter((f): f is FileStat => f !== null && !f.isDirectory);

        return NextResponse.json({ files: validFiles });

    } catch (error) {
        console.error("Failed to list files:", error);
        return NextResponse.json({
            error: "Failed to list files",
            message: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const dir = searchParams.get("dir");
    const filename = searchParams.get("filename");

    if (!dir || !filename) {
        return NextResponse.json({ error: "Dir and filename required" }, { status: 400 });
    }

    if (typeof dir !== "string" || typeof filename !== "string") {
        return NextResponse.json({ error: "Invalid parameter types" }, { status: 400 });
    }

    // Prevent deletion of certain files
    const protectedFiles = [".gitkeep", ".gitignore"];
    if (protectedFiles.includes(filename)) {
        return NextResponse.json({ error: "Cannot delete protected files" }, { status: 403 });
    }

    try {
        const dirPath = getSafePath(dir);
        // Sanitize filename using basename to prevent path traversal
        const safeFilename = path.basename(filename);

        // Additional check: ensure no path separators remain
        if (safeFilename.includes(path.sep) || safeFilename.includes('/') || safeFilename.includes('\\')) {
            return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
        }

        const filePath = path.join(dirPath, safeFilename);

        // Verify file exists and is within allowed directory
        const stats = await fs.stat(filePath);

        if (stats.isDirectory()) {
            return NextResponse.json({ error: "Cannot delete directories" }, { status: 400 });
        }

        await fs.unlink(filePath);

        return NextResponse.json({ success: true, filename: safeFilename });
    } catch (error) {
        console.error("Failed to delete file:", error);

        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return NextResponse.json({ error: "File not found" }, { status: 404 });
        }

        return NextResponse.json({
            error: "Failed to delete file",
            message: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}
