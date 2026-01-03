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
    // Persist logs map: phaseId -> logs[]
    const [logsMap, setLogsMap] = useState<Record<string, string[]>>({});
    const [yoloMode, setYoloMode] = useState(false);
    const [provider, setProvider] = useState<"gemini" | "claude">("gemini");
    const [error, setError] = useState<string | null>(null);
    const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Abort controller ref
    const abortControllerRef = useRef<AbortController | null>(null);

    // Computed logs for current phase
    const logs = logsMap[activePhase] || [];

    // Helper to append log to current phase
    const appendLog = (text: string) => {
        setLogsMap(prev => ({
            ...prev,
            [activePhase]: [...(prev[activePhase] || []), text]
        }));

        // Simple progress parsing logic
        // Expecting patterns like: "Processing item 5 of 10" or "Step 1/3"
        const progressMatch = text.match(/(?:Processing|Step)\s+(\d+)\s*(?:of|\/)\s*(\d+)/i);
        if (progressMatch) {
            const current = parseInt(progressMatch[1], 10);
            const total = parseInt(progressMatch[2], 10);
            if (!isNaN(current) && !isNaN(total)) {
                setProgress({ current, total });
            }
        }
    };

    const clearLogs = () => {
        setLogsMap(prev => ({
            ...prev,
            [activePhase]: []
        }));
        setError(null);
        setProgress(null);
    };

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
    }, [logsMap, activePhase, isExecuting]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const stopAgent = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
            appendLog("\n[System] Execution stopped by user.");
            setIsExecuting(false);
            setError("Execution stopped by user.");
        }
    };

    const runAgent = async () => {
        setIsExecuting(true);
        setError(null);
        setProgress(null);

        // Clear previous logs for this run if desired, or keep history. 
        // Let's clear to keep it clean for a new run.
        setLogsMap(prev => ({ ...prev, [activePhase]: ["Initializing Agent..."] }));

        // Create new abort controller
        const controller = new AbortController();
        abortControllerRef.current = controller;

        const phase = PHASES.find(p => p.id === activePhase);
        if (!phase) return;

        try {
            const response = await fetch("/api/agent/run", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ promptPath: phase.promptFile, yoloMode, provider }),
                signal: controller.signal
            });

            // Handle non-200 responses (Pre-flight checks etc)
            if (!response.ok) {
                const errorData = await response.json();
                const errorMessage = errorData.message || errorData.error || "Unknown error";
                appendLog(`\n[Error] ${errorMessage}`);
                setError(errorMessage);
                throw new Error(errorMessage);
            }

            if (!response.body) throw new Error("No response body");

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let done = false;

            while (!done) {
                const { value, done: doneReading } = await reader.read();
                done = doneReading;
                const chunkValue = decoder.decode(value);
                appendLog(chunkValue);
            }
        } catch (error: any) {
            if (error.name === 'AbortError') {
                // Handled in stopAgent
            } else {
                const msg = error.message || String(error);
                appendLog(`\n[Error] Execution failed: ${msg}`);
                setError(msg);
            }
        } finally {
            setIsExecuting(false);
            abortControllerRef.current = null;
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
            {/* Sidebar Navigation */}
            <div className="space-y-2 lg:h-full lg:overflow-y-auto pr-2">
                {PHASES.filter(p => !["corpus", "0"].includes(p.id)).map((phase) => (
                    <button
                        key={phase.id}
                        onClick={() => {
                            setActivePhase(phase.id);
                            router.replace(`/prompts?phase=${phase.id}`);
                            // Do NOT clear logs on switch anymore (Log Persistence)
                        }}
                        className={cn(
                            "w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                            activePhase === phase.id
                                ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                                : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                        )}
                    >
                        {phase.label}
                        {/* Show indicator if logs exist */}
                        {logsMap[phase.id]?.length > 0 && <span className="ml-2 w-1.5 h-1.5 rounded-full bg-indigo-500 inline-block" />}
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
                                    <div className="group relative">
                                        <button
                                            onClick={() => setYoloMode(!yoloMode)}
                                            className={cn(
                                                "px-3 py-1.5 rounded-full text-xs font-medium flex items-center transition-colors border",
                                                yoloMode
                                                    ? "bg-red-500/10 text-red-400 border-red-500/50 hover:bg-red-500/20"
                                                    : "bg-white/5 text-muted-foreground border-white/10 hover:bg-white/10"
                                            )}
                                        >
                                            <Zap className={cn("w-3 h-3 mr-1", yoloMode && "fill-current")} />
                                            {yoloMode ? "YOLO Mode ON" : "YOLO Mode OFF"}
                                        </button>
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-black/90 text-[10px] text-gray-300 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-center">
                                            Auto-approves all tool confirmations. Only available for Gemini.
                                        </div>
                                    </div>
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

                            {isExecuting ? (
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={stopAgent}
                                    className="animate-pulse"
                                >
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Stop Agent
                                </Button>
                            ) : (
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={runAgent}
                                    disabled={loading}
                                >
                                    <Play className="w-4 h-4 mr-2" />
                                    Run Agent
                                </Button>
                            )}
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
                            {/* Error Banner */}
                            {error && (
                                <div className="px-4 py-3 bg-red-500/10 border-b border-red-500/20 text-red-400 text-xs flex items-center justify-between">
                                    <span className="flex items-center">
                                        <XCircle className="w-3 h-3 mr-2" />
                                        {error}
                                    </span>
                                    <button onClick={() => setError(null)} className="hover:text-red-300">
                                        <XCircle className="w-3 h-3" />
                                    </button>
                                </div>
                            )}

                            {/* Progress Bar */}
                            {isExecuting && progress && (
                                <div className="w-full h-1 bg-white/5">
                                    <div
                                        className="h-full bg-indigo-500 transition-all duration-300"
                                        style={{ width: `${(progress.current / progress.total) * 100}%` }}
                                    />
                                </div>
                            )}

                            <div className="px-4 py-2 bg-[#252526] text-xs text-gray-400 flex items-center justify-between border-b border-white/5">
                                <span>TERMINAL OUTPUT</span>
                                {logs.length > 0 && !isExecuting && (
                                    <div className="flex items-center space-x-3">
                                        <span className="text-[10px] uppercase text-muted-foreground">
                                            {PHASES.find(p => p.id === activePhase)?.label} Log
                                        </span>
                                        <button onClick={clearLogs} className="hover:text-white"><XCircle className="w-3 h-3" /></button>
                                    </div>
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
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Prompts</h1>
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
