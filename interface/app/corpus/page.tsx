"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2, Upload, FileText, RefreshCw, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { FileStat, FilesResponse } from "@/lib/types";

export default function CorpusPage() {
    const [files, setFiles] = useState<FileStat[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

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

        setUploading(true);
        const formData = new FormData();
        formData.append("file", e.target.files[0]);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                await fetchFiles();
            } else {
                alert("Upload failed");
            }
        } catch (error) {
            console.error("Upload error", error);
        } finally {
            setUploading(false);
            // Reset input
            e.target.value = "";
        }
    };

    const handleDelete = async (filename: string) => {
        if (!confirm(`Are you sure you want to delete ${filename}?`)) return;

        try {
            const res = await fetch(`/api/files?dir=corpus&filename=${encodeURIComponent(filename)}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setFiles(files.filter(f => f.name !== filename));
            } else {
                alert("Delete failed");
            }
        } catch (error) {
            console.error("Delete error", error);
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
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Corpus Management</h1>
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

                <div className="divide-y divide-white/5">
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
