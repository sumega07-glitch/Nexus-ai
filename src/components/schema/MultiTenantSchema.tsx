import React, { useState } from 'react';
import { 
  Database, 
  ShieldCheck, 
  Layers, 
  Lock, 
  Key, 
  Copy, 
  Check, 
  Code2, 
  FileCode,
  Server
} from 'lucide-react';
import { PRISMA_SCHEMA_CODE } from '../../data/mockData';

export const MultiTenantSchema: React.FC = () => {
  const [copiedPrisma, setCopiedPrisma] = useState(false);
  const [activeTab, setActiveTab] = useState<'PRISMA' | 'ISOLATION' | 'API_SPEC'>('PRISMA');

  const handleCopyPrisma = () => {
    navigator.clipboard.writeText(PRISMA_SCHEMA_CODE);
    setCopiedPrisma(true);
    setTimeout(() => setCopiedPrisma(false), 2500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass p-6 rounded-xl">
        <div>
          <div className="flex items-center space-x-2 text-[10px] font-medium text-white/40 uppercase tracking-widest mb-1 font-mono">
            <Database className="w-3.5 h-3.5 text-blue-400" />
            <span>Architecture & Isolation</span>
          </div>
          <h1 className="serif italic text-3xl text-white">
            PostgreSQL & Prisma Multi-Tenancy
          </h1>
          <p className="text-xs text-white/50 mt-1 font-light">
            Hierarchical Isolation: <span className="text-white font-mono">AgencyTenant $\rightarrow$ ClientCompany $\rightarrow$ User</span> with Row-Level Security.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center space-x-1 bg-black/40 p-1 rounded-lg border border-white/5 text-xs">
          <button
            onClick={() => setActiveTab('PRISMA')}
            className={`px-3 py-1.5 rounded transition-colors cursor-pointer text-xs ${
              activeTab === 'PRISMA' ? 'bg-white/10 text-white font-medium' : 'text-white/40 hover:text-white/80'
            }`}
          >
            Prisma Schema
          </button>
          <button
            onClick={() => setActiveTab('ISOLATION')}
            className={`px-3 py-1.5 rounded transition-colors cursor-pointer text-xs ${
              activeTab === 'ISOLATION' ? 'bg-white/10 text-white font-medium' : 'text-white/40 hover:text-white/80'
            }`}
          >
            Isolation Model
          </button>
          <button
            onClick={() => setActiveTab('API_SPEC')}
            className={`px-3 py-1.5 rounded transition-colors cursor-pointer text-xs ${
              activeTab === 'API_SPEC' ? 'bg-white/10 text-white font-medium' : 'text-white/40 hover:text-white/80'
            }`}
          >
            Server API & Gemini
          </button>
        </div>
      </div>

      {/* TAB 1: PRISMA SCHEMA */}
      {activeTab === 'PRISMA' && (
        <div className="glass rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div className="flex items-center space-x-2 text-xs text-white/60 font-mono">
              <FileCode className="w-4 h-4 text-blue-400" />
              <span>schema.prisma</span>
              <span className="text-white/30">• Production Schema</span>
            </div>

            <button
              onClick={handleCopyPrisma}
              className="px-3 py-1.5 rounded bg-white/[0.04] hover:bg-white/[0.08] text-white/80 text-xs font-mono flex items-center space-x-1.5 cursor-pointer border border-white/10 transition-colors"
            >
              {copiedPrisma ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedPrisma ? 'Copied' : 'Copy Schema'}</span>
            </button>
          </div>

          <pre className="p-5 bg-black/40 rounded-xl border border-white/5 text-white/80 font-mono text-xs overflow-x-auto leading-relaxed max-h-[550px] overflow-y-auto">
            {PRISMA_SCHEMA_CODE}
          </pre>
        </div>
      )}

      {/* TAB 2: TENANT ISOLATION ARCHITECTURE */}
      {activeTab === 'ISOLATION' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass p-6 rounded-xl space-y-3">
            <div className="w-9 h-9 rounded-lg bg-black/40 border border-white/10 text-white flex items-center justify-center font-mono text-xs">
              01
            </div>
            <h3 className="serif text-lg text-white">Agency Level</h3>
            <p className="text-xs text-white/60 font-light leading-relaxed">
              The overarching multi-tenant umbrella. Holds master billing, global MRR rollups, assigned solutions architects, and agency-wide SLA health across all clients.
            </p>
            <div className="pt-2 text-[10px] font-mono text-blue-400">
              AgencyTenant ID: agency_nexus_01
            </div>
          </div>

          <div className="glass p-6 rounded-xl space-y-3">
            <div className="w-9 h-9 rounded-lg bg-black/40 border border-white/10 text-white flex items-center justify-center font-mono text-xs">
              02
            </div>
            <h3 className="serif text-lg text-white">Client Company Level</h3>
            <p className="text-xs text-white/60 font-light leading-relaxed">
              Strictly segregated data vault. Every document, vector chunk, proposal, API key, and audit log is partitioned by <code className="text-white font-mono">clientId</code> to prevent cross-tenant leakage.
            </p>
            <div className="pt-2 text-[10px] font-mono text-indigo-400">
              Foreign Key: ClientCompany.agencyId
            </div>
          </div>

          <div className="glass p-6 rounded-xl space-y-3">
            <div className="w-9 h-9 rounded-lg bg-black/40 border border-white/10 text-white flex items-center justify-center font-mono text-xs">
              03
            </div>
            <h3 className="serif text-lg text-white">User & RBAC Level</h3>
            <p className="text-xs text-white/60 font-light leading-relaxed">
              Scoped access roles (Super Admin, AI Solutions Architect, Client Stakeholder, Read-Only Auditor) with Clerk Organization authentication.
            </p>
            <div className="pt-2 text-[10px] font-mono text-emerald-400">
              Roles: AGENCY_ADMIN, CLIENT_EXEC
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SERVER API ROUTES */}
      {activeTab === 'API_SPEC' && (
        <div className="glass rounded-xl p-6 space-y-4 text-xs">
          <h3 className="serif text-lg text-white">Server-Side API Endpoints (Express + Gemini 3.8 Flash)</h3>
          
          <div className="space-y-3">
            <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-1 font-mono">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium text-[10px]">POST</span>
                <span className="text-white font-medium">/api/analyze-process</span>
              </div>
              <p className="text-white/50 font-sans text-xs pt-1 font-light">
                Evaluates discovery intake parameters using Google Gen AI structured JSON response schema to return prioritized opportunities, impact/feasibility scores, and payback months.
              </p>
            </div>

            <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-1 font-mono">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium text-[10px]">POST</span>
                <span className="text-white font-medium">/api/generate-proposal</span>
              </div>
              <p className="text-white/50 font-sans text-xs pt-1 font-light">
                Synthesizes selected automation opportunities into executive proposals, 90-day phase deliverables, and commercial milestone schedules.
              </p>
            </div>

            <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-1 font-mono">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium text-[10px]">POST</span>
                <span className="text-white font-medium">/api/chat-bot</span>
              </div>
              <p className="text-white/50 font-sans text-xs pt-1 font-light">
                Executes client-grounded RAG inferences with custom system prompt rules and indexed document knowledge preview context.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
