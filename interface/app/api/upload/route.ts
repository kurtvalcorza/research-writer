import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { FILE_LIMITS } from "@/lib/config";

// PDF magic bytes signature
const PDF_SIGNATURE = [0x25, 0x50, 0x44, 0x46]; // %PDF

function isPDFFile(buffer: Buffer): boolean {
    // Check PDF magic bytes at the start
    if (buffer.length < 4) return false;

    for (let i = 0; i < PDF_SIGNATURE.length; i++) {
        if (buffer[i] !== PDF_SIGNATURE[i]) {
            return false;
        }
    }

    return true;
}

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // Validate file size
        if (file.size > FILE_LIMITS.MAX_UPLOAD_SIZE) {
            return NextResponse.json({
                error: `File too large. Maximum size is ${FILE_LIMITS.MAX_UPLOAD_SIZE / 1024 / 1024}MB`
            }, { status: 400 });
        }

        if (file.size === 0) {
            return NextResponse.json({ error: "File is empty" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        // Validate PDF file type by checking magic bytes
        if (!isPDFFile(buffer)) {
            return NextResponse.json({
                error: "Invalid file type. Only PDF files are allowed."
            }, { status: 400 });
        }

        // Sanitize filename - preserve extension
        const ext = path.extname(file.name).toLowerCase();
        const basename = path.basename(file.name, ext);
        const sanitizedBasename = basename.replace(/[^a-zA-Z0-9.-_]/g, "_");
        const filename = `${sanitizedBasename}${ext}`;

        // Prevent empty filenames
        if (!sanitizedBasename || sanitizedBasename.length === 0) {
            return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
        }

        const uploadDir = path.join(process.cwd(), "..", "corpus");

        // Ensure dir exists - using recursive: true is idempotent
        await fs.mkdir(uploadDir, { recursive: true });

        const filePath = path.join(uploadDir, filename);

        // Check if file already exists
        try {
            await fs.access(filePath);
            return NextResponse.json({
                error: "File already exists. Please rename the file or delete the existing one."
            }, { status: 409 });
        } catch {
            // File doesn't exist, proceed with upload
        }

        await fs.writeFile(filePath, buffer);

        return NextResponse.json({
            success: true,
            filename,
            size: file.size
        });
    } catch (error) {
        return NextResponse.json({
            error: "Upload failed",
            message: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}
