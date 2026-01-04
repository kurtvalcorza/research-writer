export interface ResearchPhase {
    id: string;
    label: string;
    desc: string;
    promptFile: string;
    outputFile: string;
    color: string;
}

export const PHASES: ResearchPhase[] = [
    {
        id: "corpus",
        label: "Manage Corpus",
        desc: "Upload and organize your research papers.",
        promptFile: "",
        outputFile: "corpus", // Special case
        color: "text-sky-400"
    },
    {
        id: "0",
        label: "Project Settings",
        desc: "Define screening criteria and project settings.",
        promptFile: "",
        outputFile: "screening-criteria-template.md",
        color: "text-zinc-400"
    },
    {
        id: "1",
        label: "Phase 1: Screening",
        desc: "Identify relevant papers from your corpus.",
        promptFile: "quick-start/phase1.md",
        outputFile: "literature-screening-matrix.md",
        color: "text-blue-400"
    },
    {
        id: "2",
        label: "Phase 2: Extraction",
        desc: "Extract standardized metadata and findings.",
        promptFile: "quick-start/phase2.md",
        outputFile: "literature-extraction-matrix.md",
        color: "text-indigo-400"
    },
    {
        id: "3",
        label: "Phase 3: Structure",
        desc: "Generate argument structure and outline.",
        promptFile: "quick-start/phase3.md",
        outputFile: "literature-review-outline.md",
        color: "text-purple-400"
    },
    {
        id: "4",
        label: "Phase 4: Drafting",
        desc: "Write the literature review draft.",
        promptFile: "quick-start/phase4.md",
        outputFile: "literature-review-draft.md",
        color: "text-pink-400"
    },
    {
        id: "4.5",
        label: "Phase 4.5: Integrity",
        desc: "Validate citations and prevent hallucinations.",
        promptFile: "quick-start/phase4.5.md",
        outputFile: "citation-integrity-report.md",
        color: "text-rose-400"
    },
    {
        id: "6",
        label: "Phase 6: Contributions",
        desc: "Frame theoretical and practical implications.",
        promptFile: "quick-start/phase6.md",
        outputFile: "research-contributions-implications.md",
        color: "text-orange-400"
    },
    {
        id: "7",
        label: "Phase 7: Validation",
        desc: "Cross-phase consistency check.",
        promptFile: "quick-start/phase7.md",
        outputFile: "cross-phase-validation-report.md",
        color: "text-green-400"
    },
];
