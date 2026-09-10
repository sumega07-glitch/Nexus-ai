import React from 'react';
import { 
  Building2, 
  Users, 
  Bot, 
  Flame, 
  DollarSign, 
  ShieldCheck, 
  Layers, 
  ExternalLink, 
  ChevronRight, 
  Activity, 
  Server,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { ClientCompany, AgencyTenant } from '../../types';
import { INITIAL_AGENCY, INITIAL_CLIENTS } from '../../data/mockData';

interface AgencyAdminViewProps {
  agency?: AgencyTenant;
  clients?: ClientCompany[];
  onSelectClient?: (id: string) => void;
  onNavigateTab?: (tab: string) => void;
}

export const AgencyAdminView: React.FC<AgencyAdminViewProps> = ({
  agency = INITIAL_AGENCY,
  clients = INITIAL_CLIENTS,
  onSelectClient = (_id: string) => {},
  onNavigateTab = (_tab: string) => {}
}) => {
  // Exact user-specified demo metrics:
  // Companies: 3
  // Active Clients: 3
  // AI Agents: 3
  // Leads Generated: 184
  // MRR: $897
  const demoMetrics = {
    totalCompanies: 3,
    activeClients: 3,
    activeAiAgents: 3,
    totalLeads: 184,
    monthlyRecurringRevenue: '$897'
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 text-xs font-mono tracking-widest text-zinc-400 uppercase mb-1">
          <span className="font-bold text-white tracking-widest">NEXUSAI</span>
          <span>•</span>
          <span className="text-zinc-500">Agency Master Control Plane</span>
        </div>

        <div className="w-full h-px bg-white/10 my-3" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
                <span>AGENCY ADMIN</span>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold font-mono uppercase tracking-wider">
                  SUPER ADMIN
                </span>
              </h1>
            </div>
            <p className="text-xs text-zinc-400 mt-1 font-light max-w-2xl">
              Multi-tenant agency control plane overseeing international real estate enterprise accounts, bot orchestration, and consolidated SaaS subscription performance.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-medium">
              Demo Metrics Active
            </span>
          </div>
        </div>
      </div>

      {/* Primary Demo Metric Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {/* Total Companies */}
        <div className="p-5 rounded-2xl bg-zinc-950/80 border border-white/10 relative overflow-hidden group hover:border-white/20 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Total Companies</span>
            <Building2 className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">{demoMetrics.totalCompanies}</div>
          <div className="text-[10px] text-zinc-500 mt-1 font-mono">Demo Metrics</div>
        </div>

        {/* Active Clients */}
        <div className="p-5 rounded-2xl bg-zinc-950/80 border border-white/10 relative overflow-hidden group hover:border-white/20 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Active Clients</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-400 font-mono">{demoMetrics.activeClients}</div>
          <div className="text-[10px] text-zinc-500 mt-1 font-mono">100% Retainer Health</div>
        </div>

        {/* Active AI Agents */}
        <div className="p-5 rounded-2xl bg-zinc-950/80 border border-white/10 relative overflow-hidden group hover:border-white/20 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Active AI Agents</span>
            <Bot className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-extrabold text-purple-300 font-mono">{demoMetrics.activeAiAgents}</div>
          <div className="text-[10px] text-zinc-500 mt-1 font-mono">Gemini 3.8 Flash Engine</div>
        </div>

        {/* Leads Generated */}
        <div className="p-5 rounded-2xl bg-zinc-950/80 border border-white/10 relative overflow-hidden group hover:border-white/20 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Total Leads</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-amber-300 font-mono">{demoMetrics.totalLeads}</div>
          <div className="text-[10px] text-zinc-500 mt-1 font-mono">Autonomous Qualification</div>
        </div>

        {/* Monthly Recurring Revenue */}
        <div className="p-5 rounded-2xl bg-zinc-950/80 border border-white/10 relative overflow-hidden group hover:border-white/20 transition-all col-span-2 md:col-span-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Monthly Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-400 font-mono">{demoMetrics.monthlyRecurringRevenue}</div>
          <div className="text-[10px] text-zinc-500 mt-1 font-mono">MRR (Demo Metrics)</div>
        </div>
      </div>

      {/* Multi-Tenant Client Registry */}
      <div className="rounded-2xl bg-zinc-950/90 border border-white/10 p-6 shadow-2xl mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-white/10">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-400" />
              <span>Multi-Tenant Real Estate Client Directory</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Isolated workspace partitions with tenant ID segregation, dedicated RAG indexes, and custom bot parameters.
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('crm')}
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center space-x-1 cursor-pointer"
          >
            <span>Open Client CRM</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-[10px] font-mono uppercase text-zinc-400">
                <th className="pb-3 font-semibold">Tenant / Company Name</th>
                <th className="pb-3 font-semibold">Industry Focus</th>
                <th className="pb-3 font-semibold">Tenant Identifier</th>
                <th className="pb-3 font-semibold">Active Agent</th>
                <th className="pb-3 font-semibold">Leads Captured</th>
                <th className="pb-3 font-semibold">Lifecycle Status</th>
                <th className="pb-3 font-semibold text-right">Switch Workspace</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {clients.map((client) => {
                const leadCount = client.id === 'client_acme' ? 98 : client.id === 'client_nexus' ? 54 : 32;
                return (
                  <tr key={client.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 font-bold flex items-center justify-center font-mono">
                          {client.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-white">{client.name}</div>
                          <div className="text-[10px] text-zinc-500">{client.industry}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 text-zinc-300">
                      {client.industry}
                    </td>

                    <td className="py-4 font-mono text-[11px] text-zinc-400">
                      {(client.id || '').replace('client_', 'tenant_')}
                    </td>

                    <td className="py-4">
                      <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-300 border border-blue-500/20 font-mono text-[10px]">
                        <Bot className="w-3 h-3 text-blue-400" />
                        <span>Sales Specialist</span>
                      </span>
                    </td>

                    <td className="py-4 font-mono font-bold text-amber-300">
                      {leadCount} leads
                    </td>

                    <td className="py-4">
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        <ShieldCheck className="w-3 h-3" />
                        <span>{client.status}</span>
                      </span>
                    </td>

                    <td className="py-4 text-right">
                      <button
                        onClick={() => {
                          onSelectClient(client.id);
                          onNavigateTab('portal');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-blue-600 text-white hover:text-white border border-white/10 text-xs font-medium transition-colors cursor-pointer inline-flex items-center space-x-1"
                      >
                        <span>Open Portal</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tenant Isolation & Architecture Security Box */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 rounded-2xl bg-zinc-950/70 border border-white/5 space-y-2">
          <div className="flex items-center space-x-2 text-white font-semibold text-xs">
            <Server className="w-4 h-4 text-blue-400" />
            <span>Row-Level Tenant Isolation</span>
          </div>
          <p className="text-[11px] text-zinc-400 font-light leading-relaxed">
            Every lead record, conversation transcript, and vector chunk includes an immutable <code className="font-mono text-zinc-300">tenantId</code> predicate, enforcing cross-tenant isolation at the database layer.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-950/70 border border-white/5 space-y-2">
          <div className="flex items-center space-x-2 text-white font-semibold text-xs">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Autonomous AI Qualification</span>
          </div>
          <p className="text-[11px] text-zinc-400 font-light leading-relaxed">
            NexusAI executes sub-second heuristic & Gemini 3.8 Flash analysis to score buyer intent, budget fit, and timeline urgency without human latency.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-950/70 border border-white/5 space-y-2">
          <div className="flex items-center space-x-2 text-white font-semibold text-xs">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>Multi-Agency White Labeling</span>
          </div>
          <p className="text-[11px] text-zinc-400 font-light leading-relaxed">
            Agency operators can provision dedicated domains, custom styling, and localized pricing tiers for each partner brokerage in minutes.
          </p>
        </div>
      </div>
    </div>
  );
};
