"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Play, CheckCircle, ArrowRight, RefreshCw, Lock, FolderOpen, BookOpen } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { PHASES } from "@/lib/constants";
import { DashboardStats, FilesResponse, FileStat } from "@/lib/types";

export default function Home() {
  const [stats, setStats] = useState<DashboardStats>({ corpusCount: 0, completedPhases: [] });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch all data in parallel
      const [corpusRes, outputsRes, settingsRes] = await Promise.all([
        fetch("/api/files?dir=corpus"),
        fetch("/api/files?dir=outputs"),
        fetch("/api/files?dir=settings"),
      ]);

      const corpusData: FilesResponse = await corpusRes.json();
      const corpusCount = corpusData.files ? corpusData.files.filter((f: FileStat) => f.name.toLowerCase().endsWith(".pdf")).length : 0;

      const outputsData: FilesResponse = await outputsRes.json();
      const outputFiles = outputsData.files ? outputsData.files.map((f: FileStat) => f.name) : [];

      const settingsData: FilesResponse = await settingsRes.json();
      const settingsFiles = settingsData.files ? settingsData.files.map((f: FileStat) => f.name) : [];

      const allFiles = [...outputFiles, ...settingsFiles];

      const completedPhases = PHASES.filter(p => allFiles.includes(p.outputFile)).map(p => p.id);

      setStats({ corpusCount, completedPhases });
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Determine current phase (first incomplete phase)
  const currentPhaseIndex = PHASES.findIndex(p => !stats.completedPhases.includes(p.id));
  const currentPhase = currentPhaseIndex === -1 ? PHASES[PHASES.length - 1] : PHASES[currentPhaseIndex];

  return (
    <main className="min-h-screen p-8 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 to-teal-400 bg-clip-text text-transparent">
            Research Writer
          </h1>
          <p className="text-muted-foreground text-lg">
            Agent-Assisted Research Orchestration
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={fetchData}
            className={loading ? "animate-spin" : ""}
            aria-label="Refresh dashboard data"
            title="Refresh dashboard data"
          >
            <RefreshCw className="w-5 h-5" aria-hidden="true" />
          </Button>

          <Link href="/readme" title="Documentation">
            <Button variant="ghost" size="icon">
              <BookOpen className="w-5 h-5" />
            </Button>
          </Link>

          <div
            className="flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium"
            role="status"
            aria-live="polite"
          >
            <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" aria-hidden="true" />
            <span>System Ready</span>
          </div>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-blue-500" />
              <span>Corpus</span>
            </CardTitle>
            <CardDescription>Research papers in analysis</CardDescription>
          </CardHeader>
          <div className="px-6 pb-6 space-y-4 flex-1 flex flex-col">
            {loading ? (
              <div className="flex-1 flex items-center justify-center">
                <Skeleton className="h-10 w-24" />
              </div>
            ) : (
              <>
                <div className="flex-1 flex flex-col items-center justify-center">
                  <div className="text-4xl font-bold">{stats.corpusCount}</div>
                  <div className="text-sm text-muted-foreground">
                    PDFs processed
                  </div>
                </div>
                <Link href="/corpus" className="block pt-2 mt-auto w-full">
                  <Button variant="outline" size="sm" className="w-full">
                    <FolderOpen className="w-4 h-4 mr-2" />
                    Manage Files
                  </Button>
                </Link>
              </>
            )}
          </div>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Outputs</span>
            </CardTitle>
            <CardDescription>Access all generated research artifacts</CardDescription>
          </CardHeader>
          <div className="px-6 pb-6 pt-2 flex-1 flex flex-col justify-end">
            <Link href="/outputs" className="block">
              <Button variant="outline" size="sm" className="w-full">
                <FileText className="w-4 h-4 mr-2" />
                View Outputs
              </Button>
            </Link>
          </div>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Play className="w-5 h-5 text-purple-500" />
              <span>Prompts</span>
            </CardTitle>
            <CardDescription>Access research prompts</CardDescription>
          </CardHeader>
          <div className="px-6 pb-6 space-y-3 flex-1 flex flex-col justify-end">
            <Link href="/prompts" className="block">
              <Button variant="outline" size="sm" className="w-full">
                <Play className="w-4 h-4 mr-2" />
                Go to Prompts
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* Recent Activity / Outputs */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Workflow</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PHASES.filter(p => p.id !== "corpus").map((phase, index) => {
            // Determine completion status
            // Note: During loading, we default to mostly locked or simple view, but skeleton is better.
            // Since we have stats/loading state, we can use that.

            if (loading) {
              return (
                <Card key={phase.id} className="p-6 space-y-4">
                  <div className="flex justify-between">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-6 w-6 rounded-full" />
                  </div>
                  <Skeleton className="h-10 w-full" />
                  <div className="flex justify-between pt-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </Card>
              )
            }

            let isCompleted = stats.completedPhases.includes(phase.id);
            if (phase.id === "corpus") {
              isCompleted = stats.corpusCount > 0;
            }

            const isLocked = (index > currentPhaseIndex && currentPhaseIndex !== -1) && phase.id !== "1";


            return (
              <Card key={phase.id} className={cn(
                "transition-all duration-300",
                isLocked ? "bg-muted/30 border-dashed" : "hover:-translate-y-1 hover:shadow-lg glass-panel",
                isCompleted && "border-blue-500/30 bg-blue-500/5 !border-solid"
              )}>
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className={cn("font-semibold text-lg", isCompleted ? "text-blue-500" : (isLocked ? "text-muted-foreground" : phase.color))}>
                      {phase.label.includes(":") ? phase.label.split(":")[1].trim() : phase.label}
                    </h3>
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5 text-blue-500" />
                    ) : isLocked ? (
                      <Lock className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <div className="h-2.5 w-2.5 rounded-full bg-indigo-500 animate-pulse" />
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2 h-10">
                    {phase.desc}
                  </p>

                  <div className="pt-2 flex items-center justify-between">
                    {isCompleted ? (
                      <Link
                        href={phase.id === "0" ? "/settings" : phase.id === "corpus" ? "/corpus" : "/outputs"}
                        className="text-xs font-medium text-blue-400 hover:text-blue-300 flex items-center"
                      >
                        {phase.id === "0" ? "Edit Config" : phase.id === "corpus" ? "Manage Files" : "View Output"} <ArrowRight className="w-3 h-3 ml-1" />
                      </Link>
                    ) : isLocked ? (
                      <span className="text-xs font-medium text-muted-foreground flex items-center cursor-not-allowed">
                        Locked
                      </span>
                    ) : (
                      <Link
                        href={phase.id === "0" ? "/settings" : phase.id === "corpus" ? "/corpus" : `/prompts?phase=${phase.id}`}
                        className={cn("text-xs font-medium hover:underline flex items-center", phase.color)}
                      >
                        {phase.id === "0" ? "Configure" : phase.id === "corpus" ? "Upload" : "Get Prompt"} <ArrowRight className="w-3 h-3 ml-1" />
                      </Link>
                    )}

                    <span className="text-[10px] bg-white/5 px-2 py-1 rounded text-muted-foreground font-mono">
                      {phase.id === "corpus" ? "corpus" : phase.id === "0" ? "settings" : `Phase ${phase.id}`}
                    </span>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </section>
    </main>
  );
}
