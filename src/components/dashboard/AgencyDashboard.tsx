import React, { useState, useMemo } from 'react';
import { 
  DollarSign, 
  Clock, 
  Users, 
  TrendingUp, 
  Activity, 
  Sparkles, 
  FileText, 
  Bot, 
  ArrowUpRight, 
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Play,
  Plus,
  Search,
  X,
  Filter
} from 'lucide-react';
import { AgencyTenant, ClientCompany, ActivityAuditLog } from '../../types';

interface AgencyDashboardProps {
  agency?: AgencyTenant;
  clients?: ClientCompany[];
  auditLogs?: ActivityAuditLog[];
  opportunities?: any;
  proposals?: any;
  botConfigs?: any;
  leads?: any;
  onSelectClient?: (clientId: string) => void;
  onNavigateTab?: (tab: string) => void;
}

export const AgencyDashboard: React.FC<AgencyDashboardProps> = ({
  agency = { id: 'default', name: 'NexusAI', slug: 'nexus-ai', plan: 'Enterprise', activeClientsCount: 3, totalMrr: 897, totalHoursSavedMonthly: 1240 },
  clients = [],
  auditLogs = [],
  onSelectClient = (_clientId: string) => {},
  onNavigateTab = (_tab: string) => {}
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('ALL');

  const totalCalculatedSavings = clients.reduce((acc, c) => acc + (c.totalSavedHours * c.hourlyWageAvg), 0);
  const activeRetainerClients = clients.filter(c => c.status === 'ACTIVE_RETAINER').length;
  const inDeliveryClients = clients.filter(c => c.status === 'DELIVERY').length;
  const proposalSentClients = clients.filter(c => c.status === 'PROPOSAL_SENT').length;
  const discoveryClients = clients.filter(c => c.status === 'DISCOVERY' || c.status === 'ONBOARDING').length;

  // Extract unique industries dynamically
  const availableIndustries = useMemo(() => {
    const industries = new Set<string>();
    clients.forEach(c => {
      if (c.industry) industries.add(c.industry);
    });
    return Array.from(industries).sort();
  }, [clients]);

  const filteredClients = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return clients.filter(client => {
      // Filter by name, industry, or status in search term
      const statusFormatted = (client.status || '').toLowerCase().replace(/_/g, ' ');
      const matchesSearch = !term || (
        (client.name || '').toLowerCase().includes(term) ||
        (client.industry || '').toLowerCase().includes(term) ||
        (client.status || '').toLowerCase().includes(term) ||
        statusFormatted.includes(term) ||
        (client.contactName && client.contactName.toLowerCase().includes(term)) ||
        (client.contactEmail && client.contactEmail.toLowerCase().includes(term))
      );

      const matchesStatus = activeFilter === 'ALL' || client.status === activeFilter;
      const matchesIndustry = selectedIndustry === 'ALL' || client.industry.toLowerCase() === selectedIndustry.toLowerCase();

      return matchesSearch && matchesStatus && matchesIndustry;
    });
  }, [clients, searchTerm, activeFilter, selectedIndustry]);

  const isFiltering = searchTerm !== '' || activeFilter !== 'ALL' || selectedIndustry !== 'ALL';

  const clearAllFilters = () => {
    setSearchTerm('');
    setActiveFilter('ALL');
    setSelectedIndustry('ALL');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass p-6 rounded-xl">
        <div>
          <div className="flex items-center space-x-2 text-[10px] font-medium text-white/40 uppercase tracking-widest mb-1.5 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Agency Executive Overview • Multi-Tenant Terminal</span>
          </div>
          <h1 className="serif italic text-3xl sm:text-4xl text-white">
            {agency.name}
          </h1>
          <p className="text-xs text-white/50 mt-1 font-light">
            Strategic performance metrics and autonomous AI deployments across <span className="text-white font-normal">{clients.length} client entities</span>.
          </p>
        </div>

        {/* Action Fast Triggers */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigateTab('onboarding')}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs uppercase tracking-wider flex items-center space-x-1.5 transition-all shadow-md cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Client Discovery</span>
          </button>
          <button
            onClick={() => onNavigateTab('analyzer')}
            className="px-4 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-white/90 font-medium text-xs uppercase tracking-wider border border-white/10 flex items-center space-x-1.5 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>AI Process Analyzer</span>
          </button>
        </div>
      </div>

      {/* 4 Core Hero Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1: MRR */}
        <div className="glass p-6 rounded-xl">
          <div className="text-xs uppercase tracking-tighter text-white/40 mb-2">Total MRR</div>
          <div className="text-3xl font-light text-white font-mono">${agency.totalMrr.toLocaleString()}</div>
          <div className="text-[10px] text-emerald-400 mt-2 font-medium tracking-wide flex items-center">
            <TrendingUp className="w-3 h-3 mr-1" /> +18.4% vs LAST MONTH
          </div>
        </div>

        {/* Metric 2: Total Hours Saved */}
        <div className="glass p-6 rounded-xl">
          <div className="text-xs uppercase tracking-tighter text-white/40 mb-2">Hours Saved</div>
          <div className="text-3xl font-light text-white font-mono">
            {agency.totalHoursSavedMonthly.toLocaleString()}<span className="text-lg opacity-50 font-sans">h</span>
          </div>
          <div className="text-[10px] text-blue-400 mt-2 font-medium tracking-wide uppercase">
            Across {clients.length} Client Workspaces
          </div>
        </div>

        {/* Metric 3: AI ROI Index */}
        <div className="glass p-6 rounded-xl">
          <div className="text-xs uppercase tracking-tighter text-white/40 mb-2">AI ROI Index</div>
          <div className="text-3xl font-light text-white font-mono">
            3.8<span className="text-lg opacity-50 font-sans">x</span>
          </div>
          <div className="text-[10px] text-white/40 mt-2 font-medium tracking-wide uppercase">
            Efficiency Multiplier
          </div>
        </div>

        {/* Metric 4: Active Proposals */}
        <div className="glass p-6 rounded-xl">
          <div className="text-xs uppercase tracking-tighter text-white/40 mb-2">Autonomous Ops</div>
          <div className="text-3xl font-light text-white font-mono">1.48M</div>
          <div className="text-[10px] text-emerald-400 mt-2 font-medium tracking-wide uppercase">
            99.98% System Uptime
          </div>
        </div>
      </div>

      {/* Pipeline Funnel Stages */}
      <div className="glass rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-white/5">
          <h2 className="text-sm font-semibold text-white tracking-wide flex items-center space-x-2">
            <Activity className="w-4 h-4 text-blue-400" />
            <span>Client Lifecycle Pipeline Status</span>
          </h2>
          <span className="text-xs text-white/50 font-mono">
            Pipeline Value: <strong className="text-white font-normal">$184,000 in Retainers</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-black/30 border border-white/5 p-4 rounded-lg">
            <span className="text-[10px] uppercase tracking-wider font-medium text-white/40 block">1. Discovery Intake</span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-2xl font-light text-white font-mono">{discoveryClients}</span>
              <span className="text-[11px] text-amber-400">In Progress</span>
            </div>
            <div className="w-full bg-white/5 h-1 rounded-full mt-3 overflow-hidden">
              <div className="bg-amber-400 h-full rounded-full w-3/4"></div>
            </div>
          </div>

          <div className="bg-black/30 border border-white/5 p-4 rounded-lg">
            <span className="text-[10px] uppercase tracking-wider font-medium text-white/40 block">2. Proposal Sent</span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-2xl font-light text-white font-mono">{proposalSentClients}</span>
              <span className="text-[11px] text-blue-400">Under Review</span>
            </div>
            <div className="w-full bg-white/5 h-1 rounded-full mt-3 overflow-hidden">
              <div className="bg-blue-500 h-full rounded-full w-1/2"></div>
            </div>
          </div>

          <div className="bg-black/30 border border-white/5 p-4 rounded-lg">
            <span className="text-[10px] uppercase tracking-wider font-medium text-white/40 block">3. In Delivery</span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-2xl font-light text-white font-mono">{inDeliveryClients}</span>
              <span className="text-[11px] text-indigo-400">Deploying</span>
            </div>
            <div className="w-full bg-white/5 h-1 rounded-full mt-3 overflow-hidden">
              <div className="bg-indigo-500 h-full rounded-full w-4/5"></div>
            </div>
          </div>

          <div className="bg-black/30 border border-white/5 p-4 rounded-lg">
            <span className="text-[10px] uppercase tracking-wider font-medium text-white/40 block">4. Active Retainer</span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-2xl font-light text-emerald-400 font-mono">{activeRetainerClients}</span>
              <span className="text-[11px] text-emerald-400">Live SLA</span>
            </div>
            <div className="w-full bg-white/5 h-1 rounded-full mt-3 overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full w-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Client Account Matrix & Live Activity Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Client Accounts Table (2 Cols) */}
        <div className="lg:col-span-2 glass rounded-xl overflow-hidden flex flex-col">
          <div className="p-5 border-b border-white/5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-semibold tracking-wide text-white">Client Portfolio Overview</h3>
                  <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-white/70">
                    {filteredClients.length} of {clients.length}
                  </span>
                </div>
                <p className="text-xs text-white/40 font-light">Select a client entity to open their dedicated workspace.</p>
              </div>

              {isFiltering && (
                <button
                  onClick={clearAllFilters}
                  className="self-start sm:self-auto text-xs text-blue-400 hover:text-blue-300 flex items-center space-x-1 cursor-pointer transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Clear Filters</span>
                </button>
              )}
            </div>

            {/* Global Search Bar & Industry Filter */}
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  placeholder="Search clients by name, industry, or status..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder-white/40 focus:outline-none focus:border-blue-500/80 transition-colors"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Industry Dropdown Filter */}
              <div className="relative sm:w-48">
                <select
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-xs text-white/80 focus:outline-none focus:border-blue-500/80 cursor-pointer pr-8 appearance-none"
                >
                  <option value="ALL" className="bg-zinc-900 text-white">All Industries</option>
                  {availableIndustries.map(ind => (
                    <option key={ind} value={ind} className="bg-zinc-900 text-white">{ind}</option>
                  ))}
                </select>
                <Filter className="w-3.5 h-3.5 text-white/40 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Status Filter Chips */}
            <div className="flex items-center space-x-1 bg-black/30 p-1 rounded-lg border border-white/5 text-[11px] overflow-x-auto">
              {[
                { id: 'ALL', label: 'All Statuses' },
                { id: 'ACTIVE_RETAINER', label: 'Active Retainer' },
                { id: 'DELIVERY', label: 'In Delivery' },
                { id: 'PROPOSAL_SENT', label: 'Proposal Sent' },
                { id: 'ONBOARDING', label: 'Onboarding' },
                { id: 'DISCOVERY', label: 'Discovery' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap cursor-pointer ${
                    activeFilter === f.id ? 'bg-blue-600 text-white font-medium shadow-sm' : 'text-white/40 hover:text-white/80'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-5 space-y-3 flex-1">
            {filteredClients.length === 0 ? (
              <div className="p-8 text-center space-y-3 bg-white/[0.01] rounded-xl border border-dashed border-white/10">
                <div className="w-10 h-10 rounded-full bg-white/5 mx-auto flex items-center justify-center text-white/40">
                  <Search className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-white">No clients found</p>
                  <p className="text-xs text-white/40 max-w-sm mx-auto">
                    No client entities match {searchTerm ? `"${searchTerm}"` : 'the active filter criteria'}. Try adjusting your search query, status, or industry filter.
                  </p>
                </div>
                {isFiltering && (
                  <button
                    onClick={clearAllFilters}
                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-white font-medium transition-colors cursor-pointer"
                  >
                    Reset all filters
                  </button>
                )}
              </div>
            ) : (
              filteredClients.map((client) => {
                const statusColors: Record<string, string> = {
                  ACTIVE_RETAINER: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
                  DELIVERY: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
                  PROPOSAL_SENT: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
                  ONBOARDING: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
                  DISCOVERY: 'bg-white/5 text-white/60 border-white/10',
                };

                return (
                  <div
                    key={client.id}
                    onClick={() => {
                      onSelectClient(client.id);
                      onNavigateTab('crm');
                    }}
                    className="group p-4 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-white/20 rounded-xl transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-semibold text-sm text-white group-hover:text-blue-400 transition-colors">
                          {client.name}
                        </h4>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusColors[client.status] || 'bg-white/5 text-white/60'}`}>
                          {(client.status || 'ACTIVE').replace(/_/g, ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-white/50">
                        {client.industry} • Contact: <span className="text-white/80">{client.contactName}</span> ({client.contactRole})
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {(client.techStack || []).slice(0, 3).map((tech, i) => (
                          <span key={i} className="px-1.5 py-0.5 rounded bg-black/40 border border-white/5 text-[10px] font-mono text-white/40">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end sm:space-x-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                      <div className="text-left sm:text-right">
                        <span className="text-[10px] uppercase tracking-wider text-white/40 block">Retainer</span>
                        <span className="text-sm font-light text-white font-mono">
                          {client.currentMonthlyRetainer > 0 ? `$${client.currentMonthlyRetainer.toLocaleString()}/mo` : 'Pending'}
                        </span>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="text-[10px] uppercase tracking-wider text-white/40 block">Saved</span>
                        <span className="text-sm font-medium text-emerald-400 font-mono">
                          {client.totalSavedHours.toLocaleString()}h
                        </span>
                      </div>

                      <div className="w-7 h-7 rounded-lg bg-white/5 group-hover:bg-blue-600 group-hover:text-white text-white/40 flex items-center justify-center transition-all">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Live Autonomous Activity Feed (1 Col) */}
        <div className="glass rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <h3 className="text-sm font-semibold tracking-wide text-white">Live Activity Stream</h3>
              </div>
              <span className="text-[10px] uppercase tracking-widest text-white/40 font-mono">Real-time</span>
            </div>

            <div className="space-y-3">
              {(auditLogs || []).slice(0, 5).map((log) => {
                const severityIcon = {
                  SUCCESS: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />,
                  INFO: <Activity className="w-3.5 h-3.5 text-blue-400" />,
                  WARNING: <AlertCircle className="w-3.5 h-3.5 text-amber-400" />,
                  CRITICAL: <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                }[log.severity] || <Activity className="w-3.5 h-3.5 text-white/40" />;

                return (
                  <div key={log.id} className="p-3 bg-black/40 border border-white/5 rounded-lg space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <div className="flex items-center space-x-1.5 font-medium text-white/80">
                        {severityIcon}
                        <span>{log.actor}</span>
                      </div>
                      <span className="text-white/30 font-mono">{log.timestamp}</span>
                    </div>
                    <p className="text-xs text-white font-medium">
                      {log.action}
                    </p>
                    <p className="text-[11px] text-white/50 font-light leading-relaxed">
                      {log.details}
                    </p>
                    {log.clientName && (
                      <span className="inline-block px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] text-blue-400 font-mono">
                        {log.clientName}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/5">
            <button
              onClick={() => onNavigateTab('schema')}
              className="w-full py-2 rounded bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs text-white/80 font-medium flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Multi-Tenant Architecture Schema</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
