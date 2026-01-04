"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileText, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";
import { ContentResponse } from "@/lib/types";
import remarkGfm from "remark-gfm";

// Lazy load ReactMarkdown for better performance
const ReactMarkdown = dynamic(() => import("react-markdown"), {
    loading: () => <p className="text-muted-foreground">Loading markdown renderer...</p>,
    ssr: false,
});

const OUTPUTS = [
    { id: "screening", label: "Screening Matrix", file: "outputs/literature-screening-matrix.md" },
    { id: "extraction", label: "Extraction Matrix", file: "outputs/literature-extraction-matrix.md" },
    { id: "synthesis", label: "Synthesis Matrix", file: "outputs/literature-synthesis-matrix.md" },
    { id: "outline", label: "Review Outline", file: "outputs/literature-review-outline.md" },
    { id: "draft", label: "Review Draft", file: "outputs/literature-review-draft.md" },
    { id: "citation", label: "Citation Report", file: "outputs/citation-integrity-report.md" },
    { id: "contributions", label: "Contributions", file: "outputs/research-contributions-implications.md" },
    { id: "validation", label: "Cross-Phase Validation", file: "outputs/cross-phase-validation-report.md" },
];

export default function OutputsPage() {
    const [activeId, setActiveId] = useState("screening");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);

    const activeOutput = OUTPUTS.find(o => o.id === activeId);

    const fetchContent = async () => {
        if (!activeOutput) {
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(`/api/content?path=${activeOutput.file}`);
            const data: ContentResponse = await res.json();
            if (data.content) {
                setContent(data.content);
            } else {
                setContent("*File not generated yet.*");
            }
        } catch (error) {
            setContent("Error loading content.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContent();
    }, [activeId]);

    return (
        <main className="min-h-screen p-8 max-w-7xl mx-auto space-y-6">
            <header className="flex items-center space-x-4">
                <Link href="/">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Outputs</h1>
                    <p className="text-muted-foreground">Review generated research artifacts</p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar */}
                <div className="space-y-2">
                    {OUTPUTS.map((out) => (
                        <button
                            key={out.id}
                            onClick={() => setActiveId(out.id)}
                            className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeId === out.id
                                ? "bg-teal-500/20 text-teal-300 border border-teal-500/30"
                                : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                                }`}
                        >
                            {out.label}
                        </button>
                    ))}
                </div>

                {/* Content Viewer */}
                <div className="lg:col-span-3">
                    <Card className="min-h-[600px] flex flex-col">
                        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5 rounded-t-xl">
                            <div className="flex items-center space-x-2 text-sm text-foreground">
                                <FileText className="w-4 h-4 text-muted-foreground" />
                                <span className="font-semibold">{activeOutput?.file}</span>
                            </div>
                            <Button variant="ghost" size="sm" onClick={fetchContent} disabled={loading}>
                                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                            </Button>
                        </div>

                        <div className="flex-1 p-8 overflow-y-auto max-h-[80vh] prose prose-invert max-w-none">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    h1: ({ node, ...props }) => <h1 className="text-2xl font-bold text-indigo-300 mb-4 pb-2 border-b border-white/10" {...props} />,
                                    h2: ({ node, ...props }) => <h2 className="text-xl font-semibold text-teal-300 mt-6 mb-3" {...props} />,
                                    h3: ({ node, ...props }) => <h3 className="text-lg font-medium text-white mt-4 mb-2" {...props} />,
                                    p: ({ node, ...props }) => <p className="text-gray-300 leading-relaxed mb-4" {...props} />,
                                    ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-4 text-gray-300 space-y-1" {...props} />,
                                    ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-4 text-gray-300 space-y-1" {...props} />,
                                    table: ({ node, ...props }) => <div className="overflow-x-auto my-4 rounded-lg border border-white/10"><table className="w-full text-sm text-left" {...props} /></div>,
                                    thead: ({ node, ...props }) => <thead className="bg-white/5 text-gray-200 uppercase font-medium" {...props} />,
                                    th: ({ node, ...props }) => <th className="px-6 py-3 border-b border-white/10" {...props} />,
                                    td: ({ node, ...props }) => <td className="px-6 py-4 border-b border-white/5 text-gray-400" {...props} />,
                                    blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-indigo-500 pl-4 italic text-gray-400 my-4" {...props} />,
                                    code: ({ node, ...props }) => <code className="bg-white/10 rounded px-1 py-0.5 font-mono text-sm text-indigo-300" {...props} />,
                                }}
                            >
                                {content}
                            </ReactMarkdown>
                        </div>
                    </Card>
                </div>
            </div>
        </main>
    );
}
