# NexusAI Enterprise — Agent & Developer Guidelines

This document outlines the architectural standards, design principles, and engineering practices for the **NexusAI Enterprise AI Consulting & Operations Platform**.

---

## 1. Project Overview

NexusAI is an enterprise-grade AI automation consultancy and agent operations platform. It provides agency partners and enterprise clients with tools for:
- **Process Intelligence & Discovery**: Ingesting business process documentation and mapping high-leverage automation opportunities using Gemini AI.
- **Client CRM & Pipeline Management**: Managing clients across lifecycle stages (`DISCOVERY`, `ONBOARDING`, `PROPOSAL_SENT`, `DELIVERY`, `ACTIVE_RETAINER`).
- **Interactive ROI & Financial Modeling**: Quantifying cost-of-inaction, annual productivity reclaim, payback period, and retainer profitability.
- **Dynamic Proposal Generation & Execution**: Producing real-time proposals, digital e-signatures, shareable web links, and exported PDF deliverables (`jspdf`).
- **Client Delivery Portal**: Dedicated client workspaces for reviewing active agent automations, audit logs, SLAs, and approval queues.

---

## 2. Architecture & Runtime Rules

### Full-Stack Express + Vite Integration
- **Server Entry**: `/server.ts` handles server-side API proxying and hosts Vite dev middleware in development, serving production builds from `/dist`.
- **Port & Host**: Binds to port `3000` on host `0.0.0.0`.
- **API Key Security**: Sensitive keys (such as `GEMINI_API_KEY`) must **only** reside in server-side code (`server.ts` or `/server/*`). Never expose secret keys to the browser via `VITE_` prefixes.
- **Scripts**:
  - `npm run dev`: Boots via `tsx server.ts`.
  - `npm run build`: Runs `vite build` and compiles `server.ts` to `dist/server.cjs` with `esbuild`.
  - `npm run start`: Runs `node dist/server.cjs`.

### Client-Side SPA
- Built with **React 18**, **TypeScript**, and **Vite**.
- State transitions and animated layouts use `motion/react`.
- UI icons must come exclusively from `lucide-react`.

---

## 3. Design System & UI/UX Standards

### Aesthetic Archetype: Dark Luxury & Technical Precision
- **Canvas & Gradients**: Deep dark backgrounds (`bg-black`, `bg-zinc-950`, `bg-slate-950`) accented with subtle borders (`border-white/5` to `border-white/10`) and glass containers (`backdrop-blur-md`).
- **Color Logic**:
  - **Primary**: Electric blues (`blue-500`, `indigo-500`).
  - **Success / Reclaimed ROI**: Emeralds (`emerald-400`, `emerald-500`).
  - **Warnings / Inaction**: Rose and Amber (`rose-500`, `amber-400`).
  - **Neutrals**: Crisp white headings, muted subtitles (`text-white/40` to `text-white/70`).
- **Anti-Slop Directives**:
  - No purple-to-cyan gradient text.
  - No unformatted cards inside cards.
  - Respect mathematical corner nesting: `Inner Radius = Outer Radius - Padding`.
  - Text inside buttons, pills, chips, or badges must stay on a single line (`whitespace-nowrap`).

---

## 4. Core Domain Models & Lifecycles

Defined in `/src/types.ts`:
- **Client Company Statuses**:
  - `DISCOVERY`: Initial qualification and intake.
  - `ONBOARDING`: Data intake and workflow mapping.
  - `PROPOSAL_SENT`: Strategy proposal generated and awaiting authorization.
  - `DELIVERY`: Implementation, staging sandbox, and UAT approval.
  - `ACTIVE_RETAINER`: Deployed in production under managed SLA.
- **Opportunities & Proposals**:
  - Each opportunity models weekly hours saved, implementation feasibility, and risk analysis.
  - Proposals calculate `costOfInactionAnnual`, `projectedAnnualBenefit`, and `netFirstYearBenefit` tied to client wages and retainer fees.

---

## 5. Development Conventions

1. **Type Safety**: Strictly avoid `any`. Use interfaces and type definitions from `/src/types.ts`.
2. **Modular Code Structure**: Avoid monolithic files. Extract modal views, calculation helpers, and domain utilities into `/src/components/*` and `/src/utils/*`.
3. **PDF Generation**: All proposal exports should pass through `/src/utils/pdfExport.ts` using `jspdf` for consistent corporate styling and pagination.
4. **Interactive Filters**: Search bars across portfolio and CRM tables must allow simultaneous filtering across name, industry, and status with immediate reset capabilities.
5. **Security & Governance**: Review `/SECURITY.md` for role-based access control (RBAC), tenant isolation, and enterprise compliance rules.

---

## 6. Design Constraints & Architectural Principles

These rules govern architectural decisions across features and bug fixes:

### Core Stays Small; Extend at the Edges
- New capabilities should be added via specialized tools, external adapters, or modular handlers rather than bloating core loop logic or foundational request routers.
- Keep the critical path small and focused; avoid inlining channel/view wire details into core coordination modules.

### Less Structure, More Intelligence
- Prefer simple, readable code over premature framework layers, meta-abstractions, and unnecessary indirection.
- Add structure only when it removes real complexity, protects an architectural boundary, or matches established conventions.

### Prefer Duplication Over Premature Abstraction
- Modules, adapters, and providers are allowed to repeat similar localized logic (retries, formatting, validation).
- Do not introduce complex base classes or leaky shared helpers solely to deduplicate a few lines of code. Keep files self-contained and readable.

### Minimal Change that Solves the Real Problem
- Fix bugs and add features by changing only what is necessary.
- Do not bundle unrelated refactors, styling rewrites, or clean-ups into feature or bugfix changes.

### Keep Changes Reviewable
- Keep commits and diffs focused on the exact invariant being protected or feature being added.
- Never mix architectural ownership shifts or large refactors into a bugfix.

### Type Dynamic Boundaries at the Edge
- Network payloads, external SDK responses, and user inputs are untrusted dynamic boundaries.
- Parse or normalize them at the boundary with explicit TypeScript types or interfaces from `/src/types.ts`.
- Avoid spreading untyped dictionaries or objects into inner application logic.
- Avoid loose `as` type assertions unless accompanied by explicit runtime guards.

### Explicit Over Magical
- Configuration must be declared explicitly in typed configs or schema definitions.
- Error handling must raise clear, actionable messages rather than silently swallowing bad input or guessing intent.

---

## 7. Security Boundaries

The agent operates with significant power (file system, shell, web). The following guards must not be bypassed when modifying related code.

### Workspace Restriction
Filesystem tools (`read_file`, `write_file`, `edit_file`, `list_dir`, `apply_patch`) resolve paths through the workspace path resolver (`agent/tools/filesystem.py` / `agent/tools/path_utils.py`), which enforces that the resolved path must lie under the active workspace when workspace restriction is enabled. The media upload directory is always an internal extra read root while restricted.

Additional filesystem roots must be capability-specific. `extra_allowed_dirs` is a legacy read-only alias. Use `extra_read_allowed_dirs` for read-only roots, `extra_write_allowed_dirs` only when a write-capable tool is intentionally allowed to modify an extra directory, and exact file allowlists when a tool may modify only specific files.

Shell execution (`ExecTool`, `agent/tools/shell.py`) also respects `restrict_to_workspace` as an application-level guard: if enabled and `working_dir` is outside the workspace, the command is rejected before execution, and command text is checked for obvious workspace escapes. This is not process-level isolation; use an exec sandbox backend for that.

**Rule**: Any new path-handling logic must go through the workspace path resolver or perform an equivalent containment check with explicit read/write capability semantics.

### SSRF Protection
All outbound HTTP requests from agent tools must pass through the shared URL guards in `security/network.py` (`validate_url_target` or `resolve_url_target`). By default they block loopback, RFC1918 private addresses, CGNAT ranges, link-local ranges, and cloud metadata endpoints (including `169.254.169.254`).

For direct requests, the only escape hatch is `configure_ssrf_whitelist(cidrs)`, which reads from `config.tools.ssrf_whitelist` at load time. An explicitly configured `providers.<name>.proxy` is a separate user-authorized trust boundary for provider requests and provider-returned image URL downloads. Those downloads still reject malformed URLs and locally identifiable private/internal targets on every redirect, but hostnames unavailable to local DNS are delegated to the trusted proxy. The user-selected proxy owns final DNS resolution and network egress policy.

HTTP/SSE MCP transports are part of this boundary: validate configured MCP URLs before probing or constructing clients, and validate each outgoing HTTP request before redirects are followed. Local/private HTTP MCP endpoints are allowed only through the explicit SSRF whitelist. Stdio MCP servers are not part of the HTTP SSRF path.

**Rule**: Do not add direct `httpx.get` / `requests.get` calls in tools. Route through the existing web fetch utilities or replicate the `validate_url_target` check.

### Shell Sandbox
`tools/sandbox.py` provides optional command wrapping. The only backend currently shipped is `bwrap` (bubblewrap), intended for containerized deployments. On Windows and bare-metal Linux without `bwrap`, commands run in the native shell with workspace restriction as an application-level guard only.

**Rule**: If adding a new sandbox backend, implement `_wrap_<name>(command, workspace, cwd) -> str` and register it in `_BACKENDS`.


