# Security Policy & Architecture Guide

NexusAI is an enterprise B2B AI Agency Operating System built to manage high-stakes client discovery, operational process analysis, financial ROI modeling, custom AI agent development, and real-time client communication. 

This document outlines our security governance, multi-tenant isolation model, API and credential management, vulnerability reporting protocols, and compliance standards.

---

## 1. Supported Versions

Security updates, vulnerability patches, and configuration fixes are actively maintained for the following versions:

| Version | Supported | Status |
| :--- | :--- | :--- |
| `v1.x` (Latest Main) | :white_check_mark: Yes | Current production release with active SLA |
| `< 1.0` (Alpha/Beta) | :x: No | Deprecated; migrate to latest release |

---

## 2. Reporting a Vulnerability

We take the security and integrity of customer organizational data with the utmost seriousness. If you discover a potential vulnerability, security bypass, or data exposure issue, please follow our responsible disclosure program:

### Disclosure Procedure
1. **Direct Contact**: Email our dedicated security response team at **`security@nexusai.enterprise`** (or report directly to your assigned Agency Technical Account Lead).
2. **Details to Include**:
   - Component affected (e.g., Auth proxy, Process Analyzer, Tenant Boundary, Agent Studio).
   - Clear description and proof-of-concept steps.
   - Potential impact assessment.
   - Any proposed remediation if known.
3. **Response SLAs**:
   - **Triage Acknowledgment**: Within **12 hours** of initial receipt.
   - **Severity Assessment & Initial Patch Plan**: Within **24 hours** for Critical / P1 issues.
   - **Remediation & Deployment**: Within **72 hours** for high-priority security issues.
4. **Safe Harbor**: We commit not to pursue legal action against security researchers who identify and report vulnerabilities responsibly, avoid accessing or altering other tenants' data, and refrain from performing service-disruptive tests (such as volumetric DoS).

---

## 3. Multi-Tenant Architecture & Data Isolation

NexusAI enforces multi-tenant segmentation across all operational modules:

### Tenant Boundary Model
* **Logical Tenant Partitioning**: Every resource (Clients, Discoveries, Process Maps, AI Agents, Proposals, Audits) is keyed with compound tenant identifiers:
  * `agencyId`: The top-level agency workspace.
  * `clientId`: The specific client organization partition.
* **Cross-Tenant Access Prevention**: Client Executives (`CLIENT_EXEC`) are strictly scoped to their assigned `clientId` with no visibility or querying privileges into other client records or global agency financial models.
* **Agent Sandbox Isolation**: Custom AI agents configured in the **Agent Studio** operate with isolated vector knowledge bases and tool-calling execution environments bounded to that specific client company's documentation.

---

## 4. Authentication & Role-Based Access Control (RBAC)

NexusAI integrates modern enterprise authentication through **Clerk Authentication** coupled with internal state-driven authorization:

### Role Matrix

| Capability / Action | Agency Admin (`AGENCY_ADMIN`) | Client Executive (`CLIENT_EXEC`) | System / AI Engine |
| :--- | :---: | :---: | :---: |
| Global Agency Dashboard & Revenue Stats | :white_check_mark: Full Access | :x: No Access | :x: No Access |
| Multi-Client CRM Management | :white_check_mark: Full Access | :x: Scoped Only | :x: No Access |
| Intake & Discovery Process Mapping | :white_check_mark: Create & Edit | :white_check_mark: View & Submit | :white_check_mark: Read-only ingestion |
| AI Process Analysis & Opportunity Scoring | :white_check_mark: Full Execution | :white_check_mark: Executive Summary | :white_check_mark: Execution Pipeline |
| Proposal Commercial Terms & Fee Editing | :white_check_mark: Full Edit | :x: View-Only | :x: No Access |
| Digital Proposal Acceptance & Signing | :white_check_mark: Counter-sign | :white_check_mark: Sign & Execute | :x: Automated Validation |
| Custom Agent Studio & Prompt Engineering | :white_check_mark: Full Config | :x: Read-only Tester | :white_check_mark: Deployment API |
| Real-time Voice Consultation | :white_check_mark: Admin Auditing | :white_check_mark: Full Call Access | :white_check_mark: Streaming Engine |
| Security Audit Log Inspection | :white_check_mark: Full Audit Logs | :x: No Access | :white_check_mark: Append Only |

### Session Security & Token Validation
* **Session Persistence**: Sessions use encrypted, HTTP-only cookie mechanisms in production with client token rotation.
* **Instant Role Revocation**: Switching personas or signing out invalidates the active workspace context immediately.

---

## 5. API Key & Secret Protection

To eliminate risk of browser-side secret exfiltration, NexusAI adheres to a strict server-side proxy model:

* **Zero Client-Side Secrets**: Browser bundles (`dist/`) **never** contain Gemini API keys, Clerk secret keys, or database administrative credentials.
* **Server Proxy Gateway (`server.ts`)**:
  * All generative AI requests (`/api/analyze-process`, `/api/generate-proposal`, `/api/agent-chat`, `/api/talking-turn`, `/api/tts`) execute on the Node.js backend.
  * Secrets are retrieved exclusively from container environment variables (`process.env.GEMINI_API_KEY`, `process.env.CLERK_SECRET_KEY`).
* **Microphone Permissions**: Browser audio permissions are explicitly requested solely when engaging the interactive voice agent (`requestFramePermissions: ["microphone"]` declared in `metadata.json`).

---

## 6. AI Model Safety & Enterprise Data Governance

NexusAI interacts with Google's enterprise Gemini models via the official `@google/genai` TypeScript SDK:

* **Zero Customer Data Retention for Training**: Under Google Cloud's enterprise terms, prompt inputs, discovery workflows, and uploaded client process maps are not retained or utilized to train general foundational models.
* **Deterministic Fallback Engine**: If upstream network latency or token rate-limiting occurs, the application uses local heuristic inference generators rather than crashing or exposing raw stack traces.
* **Input Sanitization & Structured Schemas**: All generative prompts utilize strict schema validation, escaping of untrusted form text, and JSON structured output constraints to mitigate prompt injection risks.

---

## 7. Audit Logging & Non-Repudiation

All critical administrative and client actions generate tamper-evident audit records:
* Timestamped entries capturing `clientId`, `action`, `actor`, `severity`, and detail payloads.
* Actions logged include:
  * Discovery session completions.
  * AI analysis runs and opportunity evaluations.
  * Proposal creation, fee revisions, and digital e-signatures with signer IP/timestamp proofs.
  * Voice agent consultation logs and tool-calling execution steps.

---

## 8. Incident Response Plan

In the event of a confirmed security incident:
1. **Containment**: Immediate isolation of affected sessions or API endpoints via reverse proxy configuration.
2. **Eradication & Remediation**: Expedited patch release, secret rotation, and deployment validation.
3. **Notification**: Affected tenants are formally notified within **24 hours** of breach confirmation in compliance with GDPR / CCPA guidelines.
4. **Post-Mortem**: Transparent root cause analysis (RCA) published to affected enterprise stakeholders within 5 business days.

---

## 9. Agent Security Boundaries

The agent operates with significant power (file system, shell, web). The following guards must not be bypassed when modifying related code:

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

---

*Last Updated: September 2026*  
*Document Version: 1.1.0*  
*NexusAI Enterprise Platform Security Team*
