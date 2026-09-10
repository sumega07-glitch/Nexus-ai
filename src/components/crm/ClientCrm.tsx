import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Building2, 
  Mail, 
  DollarSign, 
  Clock, 
  ExternalLink, 
  CheckCircle2, 
  Sparkles, 
  FileText, 
  Bot, 
  ChevronRight, 
  Filter, 
  X, 
  Layers, 
  ArrowRight,
  MoreVertical,
  LayoutGrid,
  Table as TableIcon,
  PhoneCall,
  Check,
  Briefcase
} from 'lucide-react';
import { ClientCompany } from '../../types';

interface ClientCrmProps {
  clients: ClientCompany[];
  selectedClientId: string;
  onSelectClient: (id: string) => void;
  onAddClient: (newClient: ClientCompany) => void;
  onUpdateClientStatus: (clientId: string, newStatus: ClientCompany['status']) => void;
  onNavigateTab: (tab: string) => void;
}

export const ClientCrm: React.FC<ClientCrmProps> = ({
  clients,
  selectedClientId,
  onSelectClient,
  onAddClient,
  onUpdateClientStatus,
  onNavigateTab
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
  const [activeModalClient, setActiveModalClient] = useState<ClientCompany | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [actionMenuClientId, setActionMenuClientId] = useState<string | null>(null);

  // Extract all unique industries dynamically
  const allIndustries = useMemo(() => {
    const set = new Set<string>();
    clients.forEach(c => {
      if (c.industry) set.add(c.industry);
    });
    return Array.from(set).sort();
  }, [clients]);

  // New Client Form State
  const [newClientForm, setNewClientForm] = useState({
    name: '',
    domain: '',
    industry: 'Manufacturing',
    teamSize: '50-100',
    annualRevenue: '$10M-$50M',
    contactName: '',
    contactEmail: '',
    contactRole: 'VP of Operations',
    hourlyWageAvg: 65,
    status: 'ACTIVE_RETAINER' as ClientCompany['status'],
    techStack: 'Salesforce, Slack, Google Workspace',
    primaryBottlenecks: 'Manual invoice transcription, repetitive customer status emails',
    manualProcesses: 'Staff manually types orders from email PDFs into ERP system.'
  });

  const pipelineStages: { id: ClientCompany['status']; label: string; badge: string }[] = [
    { id: 'DISCOVERY', label: 'Discovery / Lead', badge: 'Lead' },
    { id: 'ONBOARDING', label: 'Onboarding', badge: 'Onboarding' },
    { id: 'PROPOSAL_SENT', label: 'Proposal Sent', badge: 'Proposal' },
    { id: 'DELIVERY', label: 'In Delivery', badge: 'Delivery' },
    { id: 'ACTIVE_RETAINER', label: 'Active Retainer', badge: 'Active' }
  ];

  const statusFilterOptions = [
    { id: 'ALL', label: 'All Statuses' },
    { id: 'ACTIVE_RETAINER', label: 'Active Retainer' },
    { id: 'DELIVERY', label: 'In Delivery' },
    { id: 'PROPOSAL_SENT', label: 'Proposal Sent' },
    { id: 'ONBOARDING', label: 'Onboarding' },
    { id: 'DISCOVERY', label: 'Lead' }
  ];

  const getStatusBadge = (status: ClientCompany['status']) => {
    switch (status) {
      case 'ACTIVE_RETAINER':
        return {
          label: 'Active',
          className: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
        };
      case 'ONBOARDING':
        return {
          label: 'Onboarding',
          className: 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
        };
      case 'DISCOVERY':
        return {
          label: 'Lead',
          className: 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
        };
      case 'PROPOSAL_SENT':
        return {
          label: 'Proposal',
          className: 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
        };
      case 'DELIVERY':
        return {
          label: 'In Delivery',
          className: 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
        };
      default:
        return {
          label: status,
          className: 'bg-zinc-500/15 text-zinc-400 border border-zinc-500/30'
        };
    }
  };

  const filteredClients = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return clients.filter(c => {
      const statusFormatted = (c.status || '').toLowerCase().replace(/_/g, ' ');
      // Search term filters by name, industry, or status
      const matchesSearch = !term || (
        (c.name || '').toLowerCase().includes(term) || 
        (c.industry || '').toLowerCase().includes(term) ||
        (c.status || '').toLowerCase().includes(term) ||
        statusFormatted.includes(term) ||
        (c.contactEmail && c.contactEmail.toLowerCase().includes(term)) ||
        (c.contactName && c.contactName.toLowerCase().includes(term))
      );

      const matchesIndustry = selectedIndustry === 'ALL' || c.industry.toLowerCase() === selectedIndustry.toLowerCase();
      const matchesStatus = selectedStatusFilter === 'ALL' || c.status === selectedStatusFilter;

      return matchesSearch && matchesIndustry && matchesStatus;
    });
  }, [clients, searchTerm, selectedIndustry, selectedStatusFilter]);

  const isFiltering = searchTerm !== '' || selectedIndustry !== 'ALL' || selectedStatusFilter !== 'ALL';

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedIndustry('ALL');
    setSelectedStatusFilter('ALL');
  };

  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientForm.name) return;

    const created: ClientCompany = {
      id: `client_${Date.now()}`,
      agencyId: 'agency_nexus_01',
      name: newClientForm.name,
      domain: newClientForm.domain || `${(newClientForm.name || 'client').toLowerCase().replace(/\s+/g, '')}.com`,
      industry: newClientForm.industry,
      teamSize: newClientForm.teamSize,
      annualRevenue: newClientForm.annualRevenue,
      contactName: newClientForm.contactName || 'Primary Contact',
      contactEmail: newClientForm.contactEmail || `contact@${newClientForm.domain || 'example.com'}`,
      contactRole: newClientForm.contactRole,
      hourlyWageAvg: Number(newClientForm.hourlyWageAvg) || 65,
      status: newClientForm.status,
      currentMonthlyRetainer: newClientForm.status === 'ACTIVE_RETAINER' ? 6500 : 0,
      totalSavedHours: 0,
      techStack: newClientForm.techStack.split(',').map(s => s.trim()),
      primaryBottlenecks: newClientForm.primaryBottlenecks.split(',').map(s => s.trim()),
      manualProcesses: newClientForm.manualProcesses,
      assignedArchitect: 'Alex Vance (Lead AI Architect)',
      createdAt: new Date().toISOString().split('T')[0],
      healthScore: 92
    };

    onAddClient(created);
    setShowAddModal(false);
    onSelectClient(created.id);
  };

  const handleOpenClientDetails = (client: ClientCompany) => {
    onSelectClient(client.id);
    setActiveModalClient(client);
    setActionMenuClientId(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Clients</h1>
          <p className="text-zinc-400 mt-1 text-sm">
            Manage your business clients and their automation journeys.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                viewMode === 'table'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="Table View"
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                viewMode === 'kanban'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="Pipeline Kanban"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Pipeline</span>
            </button>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-500 transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20 active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Client
          </button>
        </div>
      </div>

      {/* Filters & Search Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search clients by name, industry, or status..."
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-zinc-800 bg-zinc-900/90 text-sm text-white placeholder-zinc-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white p-1 rounded-full hover:bg-zinc-800 transition-colors cursor-pointer"
                title="Clear search text"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Industry Filter Dropdown */}
          <div className="relative sm:w-56">
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-800 bg-zinc-900 text-xs text-zinc-300 font-medium focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer pr-8 appearance-none"
            >
              <option value="ALL">All Industries</option>
              {allIndustries.map((ind) => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>
            <Filter className="w-3.5 h-3.5 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Status Filter Chips & Result Counter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-0.5">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {statusFilterOptions.map((status) => (
              <button
                key={status.id}
                onClick={() => setSelectedStatusFilter(status.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all whitespace-nowrap cursor-pointer ${
                  selectedStatusFilter === status.id
                    ? 'bg-indigo-600 border-indigo-500 text-white font-semibold shadow-sm'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                }`}
              >
                {status.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 text-xs text-zinc-400">
            <span>
              Showing <strong className="text-white font-mono">{filteredClients.length}</strong> of <span className="font-mono">{clients.length}</span> clients
            </span>
            {isFiltering && (
              <button
                onClick={clearAllFilters}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <X className="w-3 h-3" />
                <span>Reset filters</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* TABLE VIEW (Primary user request) */}
      {viewMode === 'table' && (
        <div className="bg-zinc-900/90 rounded-2xl border border-zinc-800 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-zinc-950/80 text-zinc-400 text-xs font-semibold uppercase tracking-wider border-b border-zinc-800">
                <tr>
                  <th className="px-6 py-4">Client</th>
                  <th className="px-6 py-4">Industry</th>
                  <th className="px-6 py-4">Revenue Range</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {filteredClients.map((client) => {
                  const statusInfo = getStatusBadge(client.status);
                  const isSelected = client.id === selectedClientId;

                  return (
                    <tr 
                      key={client.id} 
                      className={`transition-colors group ${
                        isSelected 
                          ? 'bg-indigo-950/30 hover:bg-indigo-950/40' 
                          : 'hover:bg-zinc-800/40'
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div 
                          className="flex flex-col cursor-pointer"
                          onClick={() => handleOpenClientDetails(client)}
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white group-hover:text-indigo-400 transition-colors">
                              {client.name}
                            </span>
                            {isSelected && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono">
                                Selected
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-zinc-400 font-mono mt-0.5">
                            {client.contactEmail}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-300">
                        {client.industry}
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-300 font-mono">
                        {client.annualRevenue}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5 ${statusInfo.className}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 relative">
                          <button
                            onClick={() => handleOpenClientDetails(client)}
                            className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-indigo-400 transition-colors cursor-pointer"
                            title="View Client Details"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>

                          <div className="relative">
                            <button 
                              onClick={() => setActionMenuClientId(actionMenuClientId === client.id ? null : client.id)}
                              className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                              title="More Options"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>

                            {/* Dropdown Menu */}
                            {actionMenuClientId === client.id && (
                              <div className="absolute right-0 top-full mt-1 w-52 bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl z-30 py-1 text-left text-xs font-medium text-zinc-300">
                                <button
                                  onClick={() => {
                                    onSelectClient(client.id);
                                    onNavigateTab('onboarding');
                                    setActionMenuClientId(null);
                                  }}
                                  className="w-full px-4 py-2.5 hover:bg-zinc-800/80 flex items-center gap-2.5 text-zinc-200 hover:text-indigo-400"
                                >
                                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                                  <span>Start AI Discovery</span>
                                </button>
                                <button
                                  onClick={() => {
                                    onSelectClient(client.id);
                                    onNavigateTab('analyzer');
                                    setActionMenuClientId(null);
                                  }}
                                  className="w-full px-4 py-2.5 hover:bg-zinc-800/80 flex items-center gap-2.5 text-zinc-200 hover:text-blue-400"
                                >
                                  <Briefcase className="w-3.5 h-3.5 text-blue-400" />
                                  <span>Opportunity Matrix</span>
                                </button>
                                <button
                                  onClick={() => {
                                    onSelectClient(client.id);
                                    onNavigateTab('proposal');
                                    setActionMenuClientId(null);
                                  }}
                                  className="w-full px-4 py-2.5 hover:bg-zinc-800/80 flex items-center gap-2.5 text-zinc-200 hover:text-purple-400"
                                >
                                  <FileText className="w-3.5 h-3.5 text-purple-400" />
                                  <span>Generate Proposal</span>
                                </button>
                                <button
                                  onClick={() => {
                                    onSelectClient(client.id);
                                    onNavigateTab('talking-agent');
                                    setActionMenuClientId(null);
                                  }}
                                  className="w-full px-4 py-2.5 hover:bg-zinc-800/80 flex items-center gap-2.5 text-zinc-200 hover:text-emerald-400"
                                >
                                  <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                                  <span>Live Voice Agent</span>
                                </button>
                                <div className="h-px bg-zinc-800 my-1"></div>
                                <div className="px-4 py-1.5 text-[10px] uppercase font-bold text-zinc-500">
                                  Update Status
                                </div>
                                {pipelineStages.map((stage) => (
                                  <button
                                    key={stage.id}
                                    onClick={() => {
                                      onUpdateClientStatus(client.id, stage.id);
                                      setActionMenuClientId(null);
                                    }}
                                    className="w-full px-4 py-1.5 hover:bg-zinc-800/80 flex items-center justify-between text-[11px]"
                                  >
                                    <span>{stage.badge}</span>
                                    {client.status === stage.id && <Check className="w-3 h-3 text-emerald-400" />}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredClients.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-14 text-center">
                      <div className="max-w-sm mx-auto space-y-3">
                        <div className="w-10 h-10 rounded-full bg-zinc-800/80 mx-auto flex items-center justify-center text-zinc-400">
                          <Search className="w-5 h-5" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-white font-medium text-sm">No clients matched your criteria</p>
                          <p className="text-xs text-zinc-400">
                            Try searching for another client name, industry, or pipeline status.
                          </p>
                        </div>
                        {isFiltering && (
                          <button
                            onClick={clearAllFilters}
                            className="mt-2 px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-white font-medium transition-colors cursor-pointer"
                          >
                            Reset filters
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* KANBAN BOARD VIEW */}
      {viewMode === 'kanban' && (
        <div className="space-y-4">
          {filteredClients.length === 0 && (
            <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-center space-y-2">
              <p className="text-sm font-medium text-white">No clients match your filter criteria</p>
              <p className="text-xs text-zinc-400">Try clearing the search query or selecting a different status/industry.</p>
              {isFiltering && (
                <button
                  onClick={clearAllFilters}
                  className="mt-1 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-white transition-colors cursor-pointer"
                >
                  Reset all filters
                </button>
              )}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {pipelineStages.map((stage) => {
            const stageClients = filteredClients.filter(c => c.status === stage.id);

            return (
              <div key={stage.id} className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-3.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-2.5 border-b border-zinc-800 mb-3">
                    <span className="text-xs font-bold text-zinc-200">{stage.label}</span>
                    <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 text-[10px] font-mono font-semibold">
                      {stageClients.length}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {stageClients.map((client) => {
                      const isCurrent = client.id === selectedClientId;

                      return (
                        <div
                          key={client.id}
                          onClick={() => handleOpenClientDetails(client)}
                          className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                            isCurrent 
                              ? 'bg-indigo-950/40 border-indigo-500/80 shadow-lg shadow-indigo-500/10' 
                              : 'bg-zinc-900 hover:bg-zinc-800/80 border-zinc-800 hover:border-zinc-700'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <h4 className="font-bold text-xs text-white hover:text-indigo-400 transition-colors">
                              {client.name}
                            </h4>
                            <span className="text-[10px] text-zinc-400 font-mono">
                              {client.annualRevenue}
                            </span>
                          </div>

                          <p className="text-[11px] text-zinc-400 mt-1 line-clamp-1">
                            {client.industry}
                          </p>

                          <div className="mt-2.5 pt-2 border-t border-zinc-800 flex items-center justify-between text-[10px]">
                            <span className="text-zinc-500">
                              {client.contactName.split(' ')[0]}
                            </span>
                            <span className="font-mono text-emerald-400 font-medium">
                              {client.currentMonthlyRetainer > 0 
                                ? `$${client.currentMonthlyRetainer.toLocaleString()}/mo` 
                                : `$${client.hourlyWageAvg}/hr`}
                            </span>
                          </div>
                        </div>
                      );
                    })}

                    {stageClients.length === 0 && (
                      <div className="text-center py-8 border border-dashed border-zinc-800 rounded-xl text-zinc-500 text-xs">
                        No clients in this stage
                      </div>
                    )}
                  </div>
                </div>

                {stage.id === 'DISCOVERY' && (
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="mt-3 w-full py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Lead</span>
                  </button>
                )}
              </div>
            );
          })}
          </div>
        </div>
      )}

      {/* CLIENT DETAIL MODAL / DRAWER */}
      {activeModalClient && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveModalClient(null)}
              className="absolute right-5 top-5 text-zinc-400 hover:text-white p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-start justify-between pr-8">
              <div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5 mb-2 ${getStatusBadge(activeModalClient.status).className}`}>
                  {getStatusBadge(activeModalClient.status).label}
                </span>
                <h2 className="text-2xl font-bold text-white">{activeModalClient.name}</h2>
                <p className="text-xs text-zinc-400 mt-0.5">{activeModalClient.domain} • {activeModalClient.industry}</p>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl">
                <span className="text-[10px] text-zinc-400 uppercase font-semibold">Revenue</span>
                <p className="text-sm font-bold text-white font-mono mt-0.5">{activeModalClient.annualRevenue}</p>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl">
                <span className="text-[10px] text-zinc-400 uppercase font-semibold">Team Size</span>
                <p className="text-sm font-bold text-white mt-0.5">{activeModalClient.teamSize}</p>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl">
                <span className="text-[10px] text-zinc-400 uppercase font-semibold">Primary Contact</span>
                <p className="text-sm font-bold text-white mt-0.5 truncate">{activeModalClient.contactName}</p>
                <p className="text-[11px] text-zinc-400 font-mono truncate">{activeModalClient.contactEmail}</p>
              </div>
            </div>

            {/* Manual Bottlenecks */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Current Operational Bottlenecks</span>
              <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl text-xs text-zinc-300 leading-relaxed">
                {activeModalClient.manualProcesses}
              </div>
            </div>

            {/* Tech Stack */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Current Software Stack</span>
              <div className="flex flex-wrap gap-2">
                {activeModalClient.techStack.map((tool, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 font-medium">
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            {/* Jump Actions */}
            <div className="pt-4 border-t border-zinc-800 flex flex-wrap gap-3">
              <button
                onClick={() => {
                  onSelectClient(activeModalClient.id);
                  setActiveModalClient(null);
                  onNavigateTab('onboarding');
                }}
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" /> Start AI Discovery
              </button>
              <button
                onClick={() => {
                  onSelectClient(activeModalClient.id);
                  setActiveModalClient(null);
                  onNavigateTab('analyzer');
                }}
                className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all"
              >
                <Briefcase className="w-3.5 h-3.5" /> View Analysis
              </button>
              <button
                onClick={() => {
                  onSelectClient(activeModalClient.id);
                  setActiveModalClient(null);
                  onNavigateTab('proposal');
                }}
                className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all"
              >
                <FileText className="w-3.5 h-3.5" /> Build Proposal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD CLIENT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute right-5 top-5 text-zinc-400 hover:text-white p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <h2 className="text-2xl font-bold text-white">Add New Client</h2>
              <p className="text-xs text-zinc-400 mt-1">Register a new client account into your agency operating system.</p>
            </div>

            <form onSubmit={handleCreateClient} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-zinc-300">Company Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Nexus Estates Dubai"
                    value={newClientForm.name}
                    onChange={(e) => setNewClientForm({ ...newClientForm, name: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-zinc-300">Industry</label>
                  <input
                    type="text"
                    placeholder="e.g. Manufacturing, Transport"
                    value={newClientForm.industry}
                    onChange={(e) => setNewClientForm({ ...newClientForm, industry: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-zinc-300">Revenue Range</label>
                  <select
                    value={newClientForm.annualRevenue}
                    onChange={(e) => setNewClientForm({ ...newClientForm, annualRevenue: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="$1M-$10M">$1M - $10M</option>
                    <option value="$10M-$50M">$10M - $50M</option>
                    <option value="$50M-$100M">$50M - $100M</option>
                    <option value="$100M+">$100M+</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-zinc-300">Initial Status</label>
                  <select
                    value={newClientForm.status}
                    onChange={(e) => setNewClientForm({ ...newClientForm, status: e.target.value as any })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="ACTIVE_RETAINER">Active</option>
                    <option value="ONBOARDING">Onboarding</option>
                    <option value="DISCOVERY">Lead</option>
                    <option value="PROPOSAL_SENT">Proposal</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-zinc-300">Contact Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Jane Doe"
                    value={newClientForm.contactName}
                    onChange={(e) => setNewClientForm({ ...newClientForm, contactName: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-zinc-300">Contact Email</label>
                  <input
                    type="email"
                    placeholder="e.g. jane@acme.com"
                    value={newClientForm.contactEmail}
                    onChange={(e) => setNewClientForm({ ...newClientForm, contactEmail: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-zinc-300">Operational Bottleneck (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Manual invoice entry from PDF to ERP..."
                  value={newClientForm.manualProcesses}
                  onChange={(e) => setNewClientForm({ ...newClientForm, manualProcesses: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>

              <div className="pt-4 border-t border-zinc-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-500/20 active:scale-95 cursor-pointer"
                >
                  Add Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
