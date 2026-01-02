"use client";

import { useEffect, useState, Suspense, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Copy, Check, ArrowLeft, Terminal, Play, Zap, XCircle } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { PHASES } from "@/lib/constants";

function PromptsContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialPhase = searchParams.get("phase") || "1";

    const [activePhase, setActivePhase] = useState(initialPhase);
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    // Execution State
    const [isExecuting, setIsExecuting] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);
    const [yoloMode, setYoloMode] = useState(false);
    const [provider, setProvider] = useState<"gemini" | "claude">("gemini");
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setActivePhase(initialPhase);
    }, [initialPhase]);

    // Load provider preference from localStorage
    useEffect(() => {
        const savedProvider = localStorage.getItem("ai-provider");
        if (savedProvider === "gemini" || savedProvider === "claude") {
            setProvider(savedProvider);
        }
    }, []);

    // Save provider preference to localStorage
    useEffect(() => {
        localStorage.setItem("ai-provider", provider);
    }, [provider]);

    useEffect(() => {
        const fetchPrompt = async () => {
            setLoading(true);
            const phase = PHASES.find(p => p.id === activePhase);
            if (!phase) return;

            try {
                const res = await fetch(`/api/content?path=${phase.promptFile}`);
                const data = await res.json();
                if (data.content) {
                    setContent(data.content);
                } else {
                    setContent("Prompt file not found.");
                }
            } catch (error) {
                console.error("Failed to fetch prompt", error);
                setContent("Error loading prompt.");
            } finally {
                setLoading(false);
            }
        };

        fetchPrompt();
    }, [activePhase]);

    // Auto-scroll terminal
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs, isExecuting]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const runAgent = async () => {
        setIsExecuting(true);
        setLogs(["Initializing Agent..."]);

        const phase = PHASES.find(p => p.id === activePhase);
        if (!phase) return;

        try {
            const response = await fetch("/api/agent/run", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ promptPath: phase.promptFile, yoloMode, provider })
            });

            if (!response.body) throw new Error("No response body");

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let done = false;

            while (!done) {
                const { value, done: doneReading } = await reader.read();
                done = doneReading;
                const chunkValue = decoder.decode(value);
                setLogs(prev => [...prev, chunkValue]);
            }
        } catch (error) {
            setLogs(prev => [...prev, `\n[Error] Execution failed: ${error}`]);
        } finally {
            setIsExecuting(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
            {/* Sidebar Navigation */}
            <div className="space-y-2 lg:h-full lg:overflow-y-auto pr-2">
                {PHASES.map((phase) => (
                    <button
                        key={phase.id}
                        onClick={() => {
                            setActivePhase(phase.id);
                            router.replace(`/prompts?phase=${phase.id}`);
                            setLogs([]); // Clear logs on switch
                        }}
                        className={cn(
                            "w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                            activePhase === phase.id
                                ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                                : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                        )}
                    >
                        {phase.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="lg:col-span-3 flex flex-col space-y-4 h-full">
                <Card className="flex-1 flex flex-col overflow-hidden border-indigo-500/10 shadow-2xl">
                    {/* Toolbar */}
                    <div className="p-4 border-b border-white/10 flex flex-wrap items-center justify-between bg-white/5 gap-4">
                        <div className="flex items-center space-x-2 text-sm text-foreground">
                            <Terminal className="w-4 h-4 text-muted-foreground" />
                            <span className="font-mono">{PHASES.find(p => p.id === activePhase)?.promptFile}</span>
                        </div>

                        <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-2 mr-2">
                                <select
                                    value={provider}
                                    onChange={(e) => setProvider(e.target.value as "gemini" | "claude")}
                                    disabled={isExecuting}
                                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 text-foreground border border-white/10 hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Select AI Provider"
                                >
                                    <option value="gemini">Gemini CLI</option>
                                    <option value="claude">Claude CLI</option>
                                </select>

                                {provider === "gemini" && (
                                    <button
                                        onClick={() => setYoloMode(!yoloMode)}
                                        className={cn(
                                            "px-3 py-1.5 rounded-full text-xs font-medium flex items-center transition-colors border",
                                            yoloMode
                                                ? "bg-red-500/10 text-red-400 border-red-500/50 hover:bg-red-500/20"
                                                : "bg-white/5 text-muted-foreground border-white/10 hover:bg-white/10"
                                        )}
                                        title="YOLO Mode: Auto-approve all tool uses (Gemini only)"
                                    >
                                        <Zap className={cn("w-3 h-3 mr-1", yoloMode && "fill-current")} />
                                        {yoloMode ? "YOLO Mode ON" : "YOLO Mode OFF"}
                                    </button>
                                )}
                            </div>

                            <Button variant="secondary" size="sm" onClick={copyToClipboard} disabled={isExecuting}>
                                {copied ? (
                                    <>
                                        <Check className="w-4 h-4 mr-2" />
                                        Copied
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-4 h-4 mr-2" />
                                        Copy
                                    </>
                                )}
                            </Button>

                            <Button
                                variant="primary"
                                size="sm"
                                onClick={runAgent}
                                disabled={isExecuting || loading}
                                className={cn(isExecuting && "animate-pulse")}
                            >
                                {isExecuting ? (
                                    <>
                                        <Terminal className="w-4 h-4 mr-2 animate-spin" />
                                        Running...
                                    </>
                                ) : (
                                    <>
                                        <Play className="w-4 h-4 mr-2" />
                                        Run Agent
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Main Content Split: Prompt vs Terminal */}
                    <div className="flex-1 grid grid-rows-2 lg:grid-rows-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-white/10 overflow-hidden">
                        {/* Source View */}
                        <div className="relative overflow-hidden bg-[#09090b]">
                            {loading ? (
                                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                                    Loading...
                                </div>
                            ) : (
                                <div className="absolute inset-0 overflow-y-auto custom-scrollbar p-4">
                                    <pre className="font-mono text-xs text-muted-foreground whitespace-pre-wrap">
                                        {content}
                                    </pre>
                                </div>
                            )}
                            <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 rounded text-[10px] text-muted-foreground uppercase tracking-wider font-semibold pointer-events-none">
                                Source
                            </div>
                        </div>

                        {/* Terminal View */}
                        <div className="flex flex-col bg-[#1e1e1e] border-l border-white/5">
                            <div className="px-4 py-2 bg-[#252526] text-xs text-gray-400 flex items-center justify-between border-b border-white/5">
                                <span>TERMINAL OUTPUT</span>
                                {logs.length > 0 && !isExecuting && (
                                    <button onClick={() => setLogs([])} className="hover:text-white"><XCircle className="w-3 h-3" /></button>
                                )}
                            </div>
                            <div className="relative flex-1 bg-[#1e1e1e]">
                                <div
                                    ref={scrollRef}
                                    className="absolute inset-0 p-4 font-mono text-xs text-green-400 overflow-y-auto whitespace-pre-wrap custom-scrollbar"
                                >
                                    {logs.length === 0 ? (
                                        <div className="h-full flex flex-col items-center justify-center text-gray-600 space-y-2">
                                            <Terminal className="w-8 h-8 opacity-20" />
                                            <p>Ready to execute</p>
                                        </div>
                                    ) : (
                                        logs.join("")
                                    )}
                                    {isExecuting && <span className="animate-pulse">_</span>}
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}

export default function PromptsPage() {
    return (
        <main className="h-screen flex flex-col p-8 max-w-7xl mx-auto space-y-6 overflow-hidden">
            <header className="flex items-center space-x-4 flex-shrink-0">
                <Link href="/">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Prompt Library</h1>
                    <p className="text-muted-foreground">Select a phase and execute with AI agents</p>
                </div>
            </header>

            <div className="flex-1 min-h-0">
                <Suspense fallback={<div>Loading Prompts...</div>}>
                    <PromptsContent />
                </Suspense>
            </div>
        </main>
    );
}
