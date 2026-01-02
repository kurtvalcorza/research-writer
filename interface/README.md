# Research Writer Interface

A companion UI designed to orchestrate the agentic research workflow. This interface allows you to manage your corpus, configure settings, and execute research phases using external AI agents (Gemini CLI or Claude CLI) from a centralized dashboard.

## 🚀 Features

- **Dashboard**: Real-time overview of your research progress with "Phase Locking" to enforce a rigorous evidence-first workflow.
- **Corpus Management**: Drag-and-drop upload, listing, and deletion of research PDFs.
- **Prompt Library**: View and copy prompts for each research phase (Screening, Synthesis, Drafting, etc.).
- **Criteria Editor**: Visual editor for your Inclusion/Exclusion screening criteria.
- **Output Viewer**: Beautiful Markdown rendering for generated research artifacts (matrices, drafts, reports).
- **Multi-Provider CLI Integration**: Direct execution of prompts using either `gemini` or `claude` command-line tools with a real-time terminal view and provider selection.

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ installed.
- At least one AI CLI tool installed and available in your PATH (for "Run Agent" feature):
  - `gemini` CLI (Google Gemini)
  - `claude` CLI (Anthropic Claude)
- Python (with `pypdf` installed) for the backend agent operations.

### Installation

1.  Navigate to the `interface` directory:
    ```bash
    cd interface
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Run the development server:
    ```bash
    npm run dev
    ```

4.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎮 Workflow Guide

### 1. Manage Corpus
Go to the **Corpus** page to upload your research papers (PDFs). These files are stored in the `../corpus` directory and serve as the source material for the AI agent.

### 2. Configure Criteria
Visit **Settings** to define your *Screening Criteria*. This updates the `../template/screening-criteria-template.md` file, which is used by the agent during Phase 1.

### 3. Execute Research Phases
Navigate to the **Prompt Library**. You have two options for execution:

*   **Option A: Manual Execution (Copy-Paste)**
    1.  Select the current phase.
    2.  Click **Copy to Clipboard**.
    3.  Paste the prompt into your preferred AI tool (Claude Desktop, ChatGPT, etc.).

*   **Option B: Auto Execution (AI CLI)**
    1.  Select your preferred AI provider (Gemini CLI or Claude CLI) from the dropdown.
    2.  Select the current phase.
    3.  Click **Run Agent**.
    4.  (Gemini only) Toggle **YOLO Mode** if you want the agent to auto-approve all tool use (proceed with caution).
    5.  Watch the real-time execution logs in the embedded terminal.

### 4. Review Outputs
Once a phase is complete, the dashboard will unlock the next phase. You can view the generated artifacts (matrices, outlines, drafts) in the **Outputs** viewer.

## 📂 Project Structure

- `app/`: Next.js App Router pages and API routes.
- `components/`: Reusable UI components (shadcn/ui compatible).
- `lib/`: Utility functions.
- `../corpus`: Directory for input PDFs.
- `../outputs`: Directory for generated research artifacts.
- `../prompts`: Directory containing the system prompts for each phase.
