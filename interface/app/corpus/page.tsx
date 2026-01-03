"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2, Upload, FileText, RefreshCw, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { FileStat, FilesResponse } from "@/lib/types";
import { toast } from "sonner";

export default function CorpusPage() {
    const [files, setFiles] = useState<FileStat[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const fetchFiles = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/files?dir=corpus");
            const data: FilesResponse = await res.json();
            if (data.files) {
                // Filter for PDFs only
                const pdfs = data.files.filter((f: FileStat) => f.name.toLowerCase().endsWith(".pdf"));
                setFiles(pdfs);
            }
        } catch (error) {
            console.error("Failed to fetch files", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFiles();
    }, []);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;
        const fileList = Array.from(e.target.files);
        await processFiles(fileList);
        // Reset input
        e.target.value = "";
    };

    const handleDelete = async (filename: string) => {
        // ... (keep existing delete logic but replace alert with toast if desired, or leave as is)
        if (!confirm(`Are you sure you want to delete ${filename}?`)) return;

        try {
            const res = await fetch(`/api/files?dir=corpus&filename=${encodeURIComponent(filename)}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setFiles(files.filter(f => f.name !== filename));
                toast.success("File deleted successfully");
            } else {
                toast.error("Delete failed");
            }
        } catch (error) {
            console.error("Delete error", error);
            toast.error("Delete failed");
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const droppedFiles = Array.from(e.dataTransfer.files);
        if (!droppedFiles.length) return;

        await processFiles(droppedFiles);
    };

    const processFiles = async (fileList: File[]) => {
        // 1. Batch Limit
        if (fileList.length > 10) {
            toast.error("Too many files", {
                description: "Please upload up to 10 files at a time."
            });
            return;
        }

        // 2. Filter PDFs
        const pdfFiles = fileList.filter(f => f.name.toLowerCase().endsWith('.pdf'));
        const rejectedCount = fileList.length - pdfFiles.length;

        if (rejectedCount > 0) {
            toast.warning(`Skipped ${rejectedCount} non-PDF file${rejectedCount > 1 ? 's' : ''}`);
        }

        if (pdfFiles.length === 0) return;

        setUploading(true);
        const toastId = toast.loading(`Starting upload for ${pdfFiles.length} file${pdfFiles.length > 1 ? 's' : ''}...`);

        let successCount = 0;
        const errors: string[] = [];

        try {
            // 3. Resilient Upload Loop
            for (let i = 0; i < pdfFiles.length; i++) {
                const file = pdfFiles[i];
                toast.loading(`Uploading ${i + 1}/${pdfFiles.length}: ${file.name}`, {
                    id: toastId,
                });

                try {
                    await uploadFile(file);
                    successCount++;
                } catch (error) {
                    const msg = error instanceof Error ? error.message : "Unknown error";
                    errors.push(`${file.name}: ${msg}`);
                }
            }

            // 4. Final Summary
            if (errors.length === 0) {
                toast.success(`Successfully uploaded ${successCount} file${successCount !== 1 ? 's' : ''}`, {
                    id: toastId,
                });
            } else {
                toast.error(`Completed with errors`, {
                    id: toastId,
                    description: (
                        <div className="space-y-1 mt-2">
                            <p>{successCount} uploaded, {errors.length} failed.</p>
                            <ul className="text-xs list-disc pl-4 space-y-0.5 opacity-90 max-h-32 overflow-y-auto">
                                {errors.map((err, idx) => (
                                    <li key={idx}>{err}</li>
                                ))}
                            </ul>
                        </div>
                    ),
                    duration: 5000,
                });
            }

            await fetchFiles();
        } catch (error) {
            console.error("Batch upload error", error);
            toast.error("Batch upload failed", { id: toastId });
        } finally {
            setUploading(false);
        }
    };

    const uploadFile = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
        });

        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.error || "Upload failed");
        }
    };

    return (
        <main className="min-h-screen p-8 max-w-7xl mx-auto space-y-8">
            <header className="flex items-center space-x-4">
                <Link href="/">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Corpus</h1>
                    <p className="text-muted-foreground">Manage your research PDFs</p>
                </div>
            </header>

            <Card>
                <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
                    <div className="flex items-center space-x-2">
                        <h2 className="text-xl font-semibold">Processed Files ({files.length})</h2>
                        <Button variant="ghost" size="icon" onClick={fetchFiles} disabled={loading}>
                            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                        </Button>
                    </div>

                    <div className="flex items-center space-x-2">
                        <label className="cursor-pointer">
                            <input
                                type="file"
                                accept=".pdf"
                                multiple
                                className="hidden"
                                onChange={handleUpload}
                                disabled={uploading}
                            />
                            <div className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-all active:scale-95">
                                {uploading ? "Uploading..." : (
                                    <>
                                        <Upload className="w-4 h-4 mr-2" />
                                        Upload PDF
                                    </>
                                )}
                            </div>
                        </label>
                    </div>
                </div>

                <div
                    className={`divide-y divide-white/5 relative transition-all ${isDragging ? 'bg-indigo-500/10 border-2 border-indigo-500 border-dashed' : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    {isDragging && (
                        <div className="absolute inset-0 flex items-center justify-center bg-indigo-500/20 backdrop-blur-sm z-10 pointer-events-none">
                            <div className="text-center space-y-2">
                                <Upload className="w-16 h-16 mx-auto text-indigo-400 animate-bounce" />
                                <p className="text-xl font-semibold text-indigo-300">Drop PDF here to upload</p>
                                <p className="text-sm text-indigo-400">Only PDF files are accepted</p>
                            </div>
                        </div>
                    )}

                    {files.length === 0 && !loading && (
                        <div className="p-12 text-center text-muted-foreground">
                            No files found. Upload a PDF to get started.
                        </div>
                    )}

                    {files.map((file) => (
                        <div key={file.name} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors group">
                            <div className="flex items-center space-x-4 min-w-0 flex-1 mr-4">
                                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 shrink-0">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <div className="min-w-0">
                                    <p className="font-medium text-foreground truncate" title={file.name}>{file.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {(file.size / 1024 / 1024).toFixed(2)} MB • {new Date(file.mtime).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <Button
                                variant="danger"
                                size="sm"
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => handleDelete(file.name)}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            </Card>
        </main>
    );
}
