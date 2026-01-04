"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Save, ArrowLeft, AlertCircle } from "lucide-react";
import Link from "next/link";

const CRITERIA_PATH = "settings/screening-criteria-template.md";

export default function SettingsPage() {
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const res = await fetch(`/api/content?path=${CRITERIA_PATH}`);
                const data = await res.json();
                if (data.content) {
                    setContent(data.content);
                }
            } catch (error) {
                console.error("Failed to load criteria", error);
            } finally {
                setLoading(false);
            }
        };
        fetchContent();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        setStatus("idle");
        try {
            const res = await fetch("/api/content", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ path: CRITERIA_PATH, content }),
            });

            if (res.ok) {
                setStatus("success");
                setTimeout(() => setStatus("idle"), 3000);
            } else {
                setStatus("error");
            }
        } catch (error) {
            console.error("Failed to save", error);
            setStatus("error");
        } finally {
            setSaving(false);
        }
    };

    return (
        <main className="min-h-screen p-8 max-w-7xl mx-auto space-y-6">
            <header className="flex items-center space-x-4">
                <Link href="/">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Project Settings</h1>
                    <p className="text-muted-foreground">Configure global research parameters</p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                    <Card className="min-h-[500px] flex flex-col">
                        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5 rounded-t-xl">
                            <div className="flex items-center space-x-2">
                                <span className="font-semibold">Screening Criteria Template</span>
                                <span className="text-xs text-muted-foreground bg-white/10 px-2 py-0.5 rounded">Required for Phase 1</span>
                            </div>

                            <div className="flex items-center space-x-2">
                                {status === "success" && <span className="text-green-400 text-sm">Saved!</span>}
                                {status === "error" && <span className="text-red-400 text-sm">Error saving</span>}

                                <Button onClick={handleSave} disabled={saving || loading} variant={status === "error" ? "danger" : "primary"}>
                                    <Save className="w-4 h-4 mr-2" />
                                    {saving ? "Saving..." : "Save Changes"}
                                </Button>
                            </div>
                        </div>

                        <div className="flex-1 p-0">
                            {loading ? (
                                <div className="p-8 text-center text-muted-foreground">Loading...</div>
                            ) : (
                                <textarea
                                    className="w-full h-full min-h-[500px] bg-transparent p-6 font-mono text-sm resize-none focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    spellCheck={false}
                                />
                            )}
                        </div>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="p-6">
                        <h3 className="font-semibold text-lg mb-2">Instructions</h3>
                        <div className="space-y-4 text-sm text-muted-foreground">
                            <p>
                                Use this editor to define your <strong>Inclusion</strong> and <strong>Exclusion</strong> criteria.
                            </p>
                            <p>
                                The AI Agent will strictly follow these rules during <strong>Phase 1 (Screening)</strong>.
                            </p>
                            <div className="bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-lg text-yellow-200">
                                <AlertCircle className="w-4 h-4 inline mr-2" />
                                <strong>Tip:</strong> Be specific about "Study Type" (e.g., Empirical studies only) and "Date Range".
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </main>
    );
}
