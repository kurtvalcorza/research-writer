# Research Writer Interface

A **production-ready, secure** web interface designed to orchestrate the agentic research workflow. This Next.js application provides a centralized dashboard to manage your corpus, configure settings, and execute research phases using external AI agents (Gemini CLI or Claude CLI).

**Status**: ✅ **Production Ready** - Version 2.0.0 (Security Hardened)

## ✨ Features

### Core Features
- **Dashboard**: Real-time overview of your research progress with "Phase Locking" to enforce a rigorous evidence-first workflow
- **Corpus Management**: Drag-and-drop upload, listing, and deletion of research PDFs with validation
- **Prompt Library**: View and copy prompts for each research phase (Screening, Synthesis, Drafting, etc.)
- **Criteria Editor**: Visual editor for your Inclusion/Exclusion screening criteria
- **Output Viewer**: Beautiful Markdown rendering for generated research artifacts (matrices, drafts, reports)
- **Multi-Provider CLI Integration**: Direct execution of prompts using either `gemini` or `claude` command-line tools with real-time terminal view

### Security Features
- ✅ **Enterprise-Grade Security**: No critical vulnerabilities, comprehensive input validation
- ✅ **File Type Validation**: PDF magic bytes verification, 50MB file size limits
- ✅ **Path Traversal Protection**: Secure path resolution prevents unauthorized file access
- ✅ **Process Management**: 10-minute timeout, automatic cleanup, no resource leaks
- ✅ **Security Headers**: HSTS, CSP, X-Frame-Options, and 7+ security headers
- ✅ **Command Injection Prevention**: Secure command execution without shell interpretation

### Code Quality
- ✅ **100% TypeScript**: Full type safety, no `any` types
- ✅ **Error Boundaries**: Graceful error handling with recovery options
- ✅ **ESLint Configured**: Security rules, TypeScript rules, React best practices
- ✅ **Accessibility**: ARIA labels, screen reader support, keyboard navigation
- ✅ **Performance Optimized**: Lazy loading, optimized bundle size

## 🛠️ Getting Started

### Prerequisites
- **Node.js 18+** installed
- At least one AI CLI tool installed and available in your PATH (for "Run Agent" feature):
  - [\`gemini\` CLI](https://geminicli.com/) (Google Gemini)
  - [\`claude\` CLI](https://claude.ai/download) (Anthropic Claude)
- **Python 3.8+** with \`pypdf\` installed for backend agent operations
- **Parent repository**: This interface must be in the \`interface/\` directory of the research-writer repository

### Installation

1.  Navigate to the \`interface\` directory:
    \`\`\`bash
    cd interface
    \`\`\`

2.  Install dependencies:
    \`\`\`bash
    npm install
    \`\`\`

3.  Run the development server:
    \`\`\`bash
    npm run dev
    \`\`\`

4.  Open [http://localhost:3000](http://localhost:3000) in your browser

### Production Build

\`\`\`bash
npm run build
npm run start
\`\`\`

## 🎮 Workflow Guide

### 1. Manage Corpus
Go to the **Corpus** page to upload your research papers (PDFs). These files are stored in the \`../corpus\` directory and serve as the source material for the AI agent.

**Features:**
- Drag-and-drop PDF upload
- PDF validation (magic bytes check)
- File size limit enforcement (50MB max)
- Duplicate detection
- Delete functionality with confirmation

### 2. Configure Criteria
Visit **Settings** to define your *Screening Criteria*. This updates the \`../settings/screening-criteria-template.md\` file, which is used by the agent during Phase 1.

**Features:**
- Live editing with syntax highlighting
- Auto-save functionality
- Content size validation (10MB max)
- Template-specific write access

### 3. Execute Research Phases
Navigate to the **Prompt Library**. You have two options for execution:

#### Option A: Manual Execution (Copy-Paste)
1. Select the current phase
2. Click **Copy to Clipboard**
3. Paste the prompt into your preferred AI tool (Claude Desktop, ChatGPT, etc.)

#### Option B: Auto Execution (AI CLI)
1. Select your preferred AI provider (Gemini CLI or Claude CLI) from the dropdown
2. Select the current phase
3. Click **Run Agent**
4. (Gemini only) Toggle **YOLO Mode** if you want the agent to auto-approve all tool use (proceed with caution)
5. Watch the real-time execution logs in the embedded terminal

**Security:**
- 10-minute execution timeout
- Automatic process cleanup on disconnect
- Real-time streaming output
- Error handling with detailed logs

### 4. Review Outputs
Once a phase is complete, the dashboard will unlock the next phase. You can view the generated artifacts (matrices, outlines, drafts) in the **Outputs** viewer.

**Features:**
- Beautiful Markdown rendering with GFM support
- Syntax highlighting for code blocks
- Responsive table rendering
- Custom styling for headers and blockquotes

## 📂 Project Structure

\`\`\`
interface/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── agent/run/           # Agent execution endpoint
│   │   ├── content/             # Content read/write
│   │   ├── files/               # File listing/deletion
│   │   └── upload/              # File upload
│   ├── corpus/                   # Corpus management page
│   ├── outputs/                  # Output viewer page
│   ├── prompts/                  # Prompt library page
│   ├── settings/                 # Settings editor page
│   ├── layout.tsx               # Root layout with metadata
│   ├── page.tsx                 # Dashboard
│   └── globals.css              # Global styles
├── components/                   # Reusable UI components
│   ├── ui/                      # shadcn/ui components
│   ├── error-boundary.tsx       # Error handling
│   ├── theme-provider.tsx       # Dark mode support
│   └── theme-toggle.tsx         # Theme switcher
├── lib/                         # Utilities and configuration
│   ├── constants.ts            # Research phases config
│   ├── types.ts                # TypeScript interfaces
│   ├── utils.ts                # Utility functions
│   └── env.ts                  # Environment validation
├── middleware.ts                # Security headers
├── SECURITY.md                  # Security documentation
├── CHANGELOG.md                 # Detailed changelog
├── IMPROVEMENTS_SUMMARY.md      # Quick reference
└── package.json                 # Dependencies
\`\`\`

### Directory References
- \`../corpus\` - Directory for input PDFs (parent repository)
- \`../outputs\` - Directory for generated research artifacts (parent repository)
- \`../prompts\` - Directory containing the system prompts for each phase (parent repository)
- \`../template\` - Directory for screening criteria template (parent repository)

## 🔒 Security

This interface implements enterprise-grade security measures. See [SECURITY.md](SECURITY.md) for complete documentation.

## 🚀 Technology Stack

- **Framework**: Next.js 16.1.1 (App Router)
- **Runtime**: React 19.2.3
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui
- **Markdown**: react-markdown with remark-gfm

## 📚 Documentation

- **[SECURITY.md](SECURITY.md)** - Comprehensive security documentation
- **[CHANGELOG.md](CHANGELOG.md)** - Detailed change history
- **[IMPROVEMENTS_SUMMARY.md](IMPROVEMENTS_SUMMARY.md)** - Quick reference for version 2.0.0 improvements

## 🐛 Troubleshooting

See the full README for troubleshooting tips, or check [SECURITY.md](SECURITY.md) for security-related questions.

---

**Version**: 2.0.0 (Security Hardened)  
**Last Updated**: 2026-01-02  
**Status**: Production Ready
