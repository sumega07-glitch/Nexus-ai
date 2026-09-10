# NexusAI — Enterprise B2B AI Agency Operating System

An enterprise-grade platform for AI automation agencies and consulting firms. NexusAI streamlines the end-to-end client lifecycle: from process intelligence and workflow discovery to ROI calculation, strategy proposal generation, custom AI agent building, and live client delivery portals.

---

## Key Modules & Features

### 1. Agency Command Center & Portfolio Dashboard
- **Executive Metrics**: Live tracking of aggregate client savings, active monthly retainers, active agent fleet count, and pipeline velocity.
- **Client Portfolio Management**: Dynamic search across client name, industry, and status, with instant industry filters and pipeline badges.
- **Activity & SLA Audit Feed**: Real-time event log tracking agent executions, SLA compliance, and human approval queues.

### 2. Client CRM & Pipeline Tracker
- **5-Stage Pipeline**: Manages clients across `DISCOVERY`, `ONBOARDING`, `PROPOSAL_SENT`, `DELIVERY`, and `ACTIVE_RETAINER`.
- **Dual View Modes**: Switch between high-density Data Table and responsive Kanban board.
- **Multi-Field Filtering**: Unified search and filter bar supporting name, industry, and status matching with instant reset.
- **Client Quick-Actions**: Update retainer tiers, transition pipeline stages, or launch dedicated client workspaces.

### 3. AI Process Analyzer & Workflow Discovery
- **Document & Text Intake**: Ingests standard operating procedures (SOPs), process documentation, or operational transcripts.
- **Gemini-Powered Opportunity Extraction**: Discovers automation bottlenecks, estimates weekly hours saved, evaluates feasibility/risk, and suggests system architecture.
- **Opportunity Selection**: Select high-leverage opportunities directly into client proposals.

### 4. Interactive ROI & Financial Modeling
- **Cost of Inaction (COI)**: Calculates annual wasted capital from repetitive manual workflows based on team size and hourly wages.
- **Projected Annual Benefit**: Models efficiency gains and reclaimed capacity from autonomous AI agents.
- **Payback Period & Retainer ROI**: Live calculations of net first-year benefit, break-even months, and agency fee return on investment.

### 5. Strategy Proposal Builder & E-Signature
- **Executive Strategy Generation**: Produces complete proposals with customized architecture, 90-day milestone phases, and commercial pricing models.
- **Digital E-Signature**: In-browser authorization workflow for executive sponsors with signature timestamps and celebration confetti.
- **PDF Export via jsPDF**: One-click download of publication-ready, multi-page corporate proposals with running headers, footers, financial breakdowns, and signature blocks.
- **Shareable Links**: Generates direct client review links.

### 6. Custom AI Agent Studio
- **Fleet Management**: Configure specialized AI agents (e.g., Document Ingestion, Customer Support Routing, Compliance Verification).
- **Architecture Builder**: Specify trigger types, LLM models, system prompts, memory retention, and fallback policies.
- **Live Sandbox**: Test agent prompts directly in a simulated run environment before deploying to client production.

### 7. Interactive Voice & Talking Agent
- **Real-Time Speech Interaction**: Interactive voice consultation using Web Audio and Gemini AI.
- **Mic Visualizer**: Dynamic audio visualizer responding to voice input and live assistant responses.

### 8. Client Delivery Portal
- **Dedicated Client Workspace**: Clients can log in to view their active automations, request agent changes, review approval queues, and monitor uptime SLAs.

---

## Tech Stack & Architecture

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, `motion/react` (animations), `lucide-react` (icons), `canvas-confetti`.
- **PDF Generation**: `jspdf` for multi-page formatted proposals with corporate branding and pagination.
- **Backend**: Node.js, Express, `tsx` for development, `esbuild` for production CommonJS bundle compilation (`dist/server.cjs`).
- **AI Engine**: Google Gen AI SDK (`@google/genai`) using Gemini models with server-side API proxying (`server.ts`).

---

## Getting Started

### Prerequisites
- Node.js 18+
- A Google Gemini API key (optional for simulated modes, required for live AI generation)

### Installation
```bash
npm install
```

### Environment Setup
Create a `.env` file based on `.env.example`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### Development
Start the full-stack dev server:
```bash
npm run dev
```
The application will be available at `http://localhost:3000`.

### Production Build
```bash
npm run build
npm start
```

---

## Security & Governance
- **API Key Security**: Sensitive keys (`GEMINI_API_KEY`) strictly remain server-side and are never exposed to the client bundle.
- **RBAC & Tenant Isolation**: Refer to `SECURITY.md` for role-based access rules and data isolation policies across agency and client workspaces.
