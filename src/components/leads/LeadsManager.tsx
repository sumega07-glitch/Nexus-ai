import React, { useState } from 'react';
import { 
  Flame, 
  Search, 
  Filter, 
  CheckCircle2, 
  Phone, 
  Mail, 
  MessageSquare, 
  Calendar, 
  X, 
  Send, 
  ArrowRight, 
  Building2, 
  ShieldCheck, 
  Sparkles, 
  Bot, 
  UserCheck, 
  Clock, 
  ExternalLink,
  MapPin,
  Home,
  Coins,
  Download,
  LayoutGrid,
  Table,
  ChevronDown,
  UserPlus,
  BedDouble,
  FileSpreadsheet
} from 'lucide-react';
import { QualifiedLead, LeadStatus } from '../../types';
import { LeadCard } from './LeadCard';

interface LeadsManagerProps {
  leads: QualifiedLead[];
  onUpdateLeadStatus?: (leadId: string, newStatus: LeadStatus) => void;
  onNavigateToStudio?: () => void;
}

export const LeadsManager: React.FC<LeadsManagerProps> = ({
  leads: initialLeads,
  onUpdateLeadStatus,
  onNavigateToStudio
}) => {
  const [leadsList, setLeadsList] = useState<QualifiedLead[]>(initialLeads);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  
  // Selected Lead for Modals
  const [contactModalLead, setContactModalLead] = useState<QualifiedLead | null>(null);
  const [conversationModalLead, setConversationModalLead] = useState<QualifiedLead | null>(null);
  const [assignAgentLead, setAssignAgentLead] = useState<QualifiedLead | null>(null);
  const [selectedBroker, setSelectedBroker] = useState<string>('Tariq Al-Mansoor (Senior Luxury Broker)');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync if initialLeads updates from parent
  React.useEffect(() => {
    setLeadsList(initialLeads);
  }, [initialLeads]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Status mapping and colors:
  // Green for Qualified / Won
  // Blue for Contacted / Viewing Scheduled
  // Gray for New / Lost
  const getStatusBadge = (status: LeadStatus | string) => {
    const s = (status || 'NEW').toUpperCase();
    if (s === 'QUALIFIED' || s === 'WON') {
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold font-mono tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span>{s === 'QUALIFIED' ? 'Qualified' : 'Won'}</span>
        </span>
      );
    }
    if (s === 'CONTACTED' || s === 'VIEWING' || s === 'VIEWING_SCHEDULED') {
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold font-mono tracking-wider bg-blue-500/15 text-blue-300 border border-blue-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
          <span>{s === 'CONTACTED' ? 'Contacted' : 'Viewing Scheduled'}</span>
        </span>
      );
    }
    if (s === 'HOT') {
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold font-mono tracking-wider bg-gradient-to-r from-amber-500/20 to-rose-500/20 text-amber-300 border border-amber-500/40">
          <Flame className="w-3 h-3 text-amber-400 fill-amber-400" />
          <span>HOT</span>
        </span>
      );
    }
    // Gray for New / Lost
    return (
      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium font-mono tracking-wider bg-zinc-800/80 text-zinc-400 border border-white/10">
        <span className="w-1.5 h-1.5 rounded-full bg-zinc-500"></span>
        <span>{s === 'LOST' ? 'Lost' : 'New'}</span>
      </span>
    );
  };

  // Lead score badge: HOT / WARM / NEW
  const getLeadScoreBadge = (lead: QualifiedLead) => {
    const rawScore = lead.leadScore;
    const isHot = lead.isHot || rawScore === 'HOT' || lead.status === 'HOT' || (typeof rawScore === 'number' && rawScore >= 90);
    const isWarm = rawScore === 'WARM' || (typeof rawScore === 'number' && rawScore >= 80 && rawScore < 90);

    if (isHot) {
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-gradient-to-r from-amber-500/25 to-rose-500/25 border border-amber-500/50 text-amber-300 font-mono text-[11px] font-black tracking-widest uppercase shadow-sm shadow-amber-500/20 animate-pulse">
          <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span>HOT</span>
        </span>
      );
    }
    if (isWarm) {
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-[11px] font-semibold tracking-wider uppercase">
          <span>WARM</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-zinc-800/70 border border-white/10 text-zinc-400 font-mono text-[11px] font-medium tracking-wider uppercase">
        <span>NEW</span>
      </span>
    );
  };

  // Filter logic
  const filteredLeads = leadsList.filter(lead => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      lead.name.toLowerCase().includes(query) ||
      (lead.phone && lead.phone.toLowerCase().includes(query)) ||
      (lead.email && lead.email.toLowerCase().includes(query)) ||
      lead.preferredLocation.toLowerCase().includes(query) ||
      (lead.propertyInterest && lead.propertyInterest.toLowerCase().includes(query)) ||
      lead.budget.toLowerCase().includes(query) ||
      lead.timeline.toLowerCase().includes(query);
    
    if (!matchesSearch) return false;

    if (filterType === 'ALL') return true;
    if (filterType === 'HOT') return lead.isHot || lead.leadScore === 'HOT' || lead.status === 'HOT';
    if (filterType === 'NEW') return lead.status === 'NEW' || lead.leadScore === 'NEW';
    if (filterType === 'QUALIFIED') return lead.status === 'QUALIFIED';
    if (filterType === 'CONTACTED') return lead.status === 'CONTACTED';
    if (filterType === 'VIEWING') return lead.status === 'VIEWING' || lead.status === 'VIEWING_SCHEDULED';
    if (filterType === 'WON') return lead.status === 'WON';
    if (filterType === 'LOST') return lead.status === 'LOST';
    return true;
  });

  // Action Handlers
  const handleStatusChange = (leadId: string, newStatus: LeadStatus) => {
    setLeadsList(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
    onUpdateLeadStatus?.(leadId, newStatus);
    showToast(`Lead status updated to ${newStatus}`);
  };

  const handleAssignAgentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignAgentLead) return;

    setLeadsList(prev => prev.map(l => l.id === assignAgentLead.id ? { 
      ...l, 
      assignedBroker: selectedBroker,
      status: l.status === 'NEW' ? 'CONTACTED' : l.status 
    } : l));

    showToast(`Assigned ${assignAgentLead.name} to ${selectedBroker.split(' (')[0]}`);
    setAssignAgentLead(null);
  };

  // Export CSV Action
  const handleExportCSV = () => {
    const headers = [
      'Lead ID',
      'Name',
      'Phone',
      'Email',
      'Property Interest',
      'Location',
      'Bedrooms',
      'Budget',
      'Timeline',
      'Status',
      'Lead Score',
      'Created Date',
      'Assigned Agent',
      'Notes'
    ];

    const rows = leadsList.map(lead => [
      `"${lead.id}"`,
      `"${lead.name}"`,
      `"${lead.phone || ''}"`,
      `"${lead.email || ''}"`,
      `"${lead.propertyInterest || lead.propertyType || ''}"`,
      `"${lead.preferredLocation || lead.location || ''}"`,
      `"${lead.bedrooms || ''}"`,
      `"${lead.budget}"`,
      `"${lead.timeline}"`,
      `"${lead.status}"`,
      `"${lead.isHot ? 'HOT' : (lead.leadScore || 'NEW')}"`,
      `"${lead.createdDate || lead.capturedAt}"`,
      `"${lead.assignedBroker || 'Unassigned'}"`,
      `"${(lead.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `nexusai_leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Exported ${leadsList.length} leads to CSV`);
  };

  const hotCount = leadsList.filter(l => l.isHot || l.leadScore === 'HOT' || l.status === 'HOT').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 p-4 rounded-xl bg-emerald-500 text-white font-medium text-xs flex items-center space-x-2 shadow-2xl backdrop-blur-md animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 text-xs font-mono tracking-widest text-zinc-400 uppercase mb-1">
          <span className="font-bold text-white tracking-widest">NEXUSAI</span>
          <span>•</span>
          <span className="text-zinc-500">Autonomous Real Estate Lead Capture</span>
        </div>

        <div className="w-full h-px bg-white/10 my-3" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
                <span>LEADS</span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold font-mono uppercase tracking-wider flex items-center space-x-1">
                  <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{hotCount} HOT LEADS ACTIVE</span>
                </span>
              </h1>
            </div>
            <p className="text-xs text-zinc-400 mt-1 font-light max-w-2xl">
              Demo Leads captured by NexusAI Sales Assistant for Nexus Estates Dubai. Autonomous qualification of location, bedrooms, budget, and timeline with immediate human broker handoff.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-medium flex items-center space-x-2 transition-all cursor-pointer hover:border-white/20"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Export CSV</span>
            </button>

            {onNavigateToStudio && (
              <button
                onClick={onNavigateToStudio}
                className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center space-x-2 transition-all cursor-pointer shadow-lg shadow-blue-500/20"
              >
                <Bot className="w-4 h-4 text-white" />
                <span>Open Agent Studio</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-zinc-900/50 border border-white/5 flex flex-col">
          <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Total Captured Leads</span>
          <span className="text-2xl font-bold text-white mt-1">{leadsList.length}</span>
          <span className="text-[10px] text-zinc-500 mt-1 font-mono">
            Nexus Estates Dubai Tenant
          </span>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/50 border border-white/5 flex flex-col">
          <span className="text-[11px] font-mono text-amber-400 uppercase tracking-wider flex items-center gap-1">
            <Flame className="w-3 h-3 fill-amber-400" />
            <span>High-Priority Hot Leads</span>
          </span>
          <span className="text-2xl font-bold text-amber-300 mt-1">{hotCount}</span>
          <span className="text-[10px] text-zinc-400 mt-1 font-mono">
            High budget • Timeline ≤ 3 Mo
          </span>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/50 border border-white/5 flex flex-col">
          <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Qualified Pipeline Value</span>
          <span className="text-2xl font-bold text-emerald-400 font-mono mt-1">AED 12.5M</span>
          <span className="text-[10px] text-zinc-400 mt-1 font-mono">
            Dubai Hills • Downtown • Palm
          </span>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/50 border border-white/5 flex flex-col">
          <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Avg. AI Qualification Time</span>
          <span className="text-2xl font-bold text-blue-400 font-mono mt-1">85 sec</span>
          <span className="text-[10px] text-zinc-400 mt-1 font-mono">
            Zero human latency
          </span>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 mb-6">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search name, phone, Dubai Hills, 3BR..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900/80 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 font-light"
          />
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto pb-1">
          {/* Status filter buttons */}
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors font-mono ${
              filterType === 'ALL'
                ? 'bg-white/15 text-white border border-white/20'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            All ({leadsList.length})
          </button>
          <button
            onClick={() => setFilterType('HOT')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors font-mono flex items-center space-x-1.5 ${
              filterType === 'HOT'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-zinc-400 hover:text-amber-300 hover:bg-white/5'
            }`}
          >
            <Flame className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>Hot ({hotCount})</span>
          </button>
          <button
            onClick={() => setFilterType('QUALIFIED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors font-mono ${
              filterType === 'QUALIFIED'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Qualified
          </button>
          <button
            onClick={() => setFilterType('CONTACTED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors font-mono ${
              filterType === 'CONTACTED'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Contacted
          </button>
          <button
            onClick={() => setFilterType('VIEWING')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors font-mono ${
              filterType === 'VIEWING'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Viewing Scheduled
          </button>
          <button
            onClick={() => setFilterType('WON')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors font-mono ${
              filterType === 'WON'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Won
          </button>

          {/* View mode toggle */}
          <div className="flex items-center space-x-1 border-l border-white/10 pl-2 ml-1">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                viewMode === 'table'
                  ? 'bg-white/20 text-white'
                  : 'text-zinc-500 hover:text-white'
              }`}
              title="Table View"
            >
              <Table className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white/20 text-white'
                  : 'text-zinc-500 hover:text-white'
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* VIEW: TABLE VIEW (Standard CRM view per requirements) */}
      {viewMode === 'table' ? (
        <div className="rounded-2xl bg-zinc-950/90 border border-white/10 overflow-hidden shadow-2xl backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-zinc-900/60 text-[10px] font-mono uppercase text-zinc-400">
                  <th className="py-3.5 px-4 font-semibold">Lead Name</th>
                  <th className="py-3.5 px-4 font-semibold">Contact Info</th>
                  <th className="py-3.5 px-4 font-semibold">Property Interest</th>
                  <th className="py-3.5 px-4 font-semibold">Location</th>
                  <th className="py-3.5 px-4 font-semibold">Beds</th>
                  <th className="py-3.5 px-4 font-semibold">Budget</th>
                  <th className="py-3.5 px-4 font-semibold">Timeline</th>
                  <th className="py-3.5 px-4 font-semibold">Score</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold">Created Date</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredLeads.map((lead) => {
                  return (
                    <tr 
                      key={lead.id} 
                      className={`hover:bg-white/[0.02] transition-colors ${lead.isHot ? 'bg-amber-500/[0.02]' : ''}`}
                    >
                      {/* Lead Name */}
                      <td className="py-4 px-4">
                        <div className="font-semibold text-white text-sm">
                          {lead.name}
                        </div>
                        <div className="text-[10px] text-zinc-500 font-mono">
                          {lead.assignedBroker ? lead.assignedBroker.split(' (')[0] : 'Unassigned'}
                        </div>
                      </td>

                      {/* Phone & Email */}
                      <td className="py-4 px-4 font-mono text-[11px] text-zinc-300">
                        {lead.phone && (
                          <div className="flex items-center gap-1.5 text-zinc-300">
                            <Phone className="w-3 h-3 text-zinc-500" />
                            <span>{lead.phone}</span>
                          </div>
                        )}
                        {lead.email && (
                          <div className="flex items-center gap-1.5 text-zinc-400 mt-0.5 text-[10px]">
                            <Mail className="w-3 h-3 text-zinc-600" />
                            <span className="truncate max-w-[140px]">{lead.email}</span>
                          </div>
                        )}
                      </td>

                      {/* Property Interest */}
                      <td className="py-4 px-4">
                        <span className="font-medium text-white flex items-center gap-1.5">
                          <Home className="w-3.5 h-3.5 text-blue-400" />
                          <span>{lead.propertyInterest || lead.propertyType || '3BR Villa'}</span>
                        </span>
                      </td>

                      {/* Location */}
                      <td className="py-4 px-4 text-zinc-300">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                          <span>{lead.preferredLocation || lead.location || 'Dubai Hills'}</span>
                        </span>
                      </td>

                      {/* Bedrooms */}
                      <td className="py-4 px-4 font-mono text-zinc-300">
                        {lead.bedrooms || '3'} BR
                      </td>

                      {/* Budget */}
                      <td className="py-4 px-4 font-bold text-amber-300 font-mono">
                        {lead.budget}
                      </td>

                      {/* Timeline */}
                      <td className="py-4 px-4 text-zinc-300">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-zinc-500" />
                          <span>{lead.timeline}</span>
                        </span>
                      </td>

                      {/* Lead Score: HOT / WARM / NEW */}
                      <td className="py-4 px-4">
                        {getLeadScoreBadge(lead)}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        {getStatusBadge(lead.status)}
                      </td>

                      {/* Created Date */}
                      <td className="py-4 px-4 text-zinc-400 font-mono text-[11px]">
                        {lead.createdDate || lead.capturedAt.split(',')[0]}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          {/* View Conversation */}
                          <button
                            onClick={() => setConversationModalLead(lead)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                            title="View Conversation Transcript"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </button>

                          {/* Assign Agent */}
                          <button
                            onClick={() => setAssignAgentLead(lead)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-blue-600/20 text-zinc-300 hover:text-blue-300 transition-colors cursor-pointer"
                            title="Assign Broker"
                          >
                            <UserPlus className="w-3.5 h-3.5" />
                          </button>

                          {/* Change Status Dropdown */}
                          <select
                            value={lead.status}
                            onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                            className="bg-zinc-900 border border-white/10 text-white rounded-lg px-2 py-1 text-[11px] font-mono cursor-pointer focus:outline-none focus:border-blue-500"
                          >
                            <option value="NEW">New</option>
                            <option value="CONTACTED">Contacted</option>
                            <option value="VIEWING_SCHEDULED">Viewing Scheduled</option>
                            <option value="QUALIFIED">Qualified</option>
                            <option value="WON">Won</option>
                            <option value="LOST">Lost</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredLeads.length === 0 && (
                  <tr>
                    <td colSpan={11} className="py-16 text-center text-zinc-400">
                      <UserCheck className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                      <p className="text-sm font-medium">No leads found matching your search criteria.</p>
                      <button
                        onClick={() => { setSearchQuery(''); setFilterType('ALL'); }}
                        className="mt-2 text-xs text-blue-400 hover:underline cursor-pointer"
                      >
                        Reset filters
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* VIEW: CARD GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLeads.map((lead) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              onContactSales={(l) => setContactModalLead(l)}
              onViewConversation={(l) => setConversationModalLead(l)}
            />
          ))}

          {filteredLeads.length === 0 && (
            <div className="col-span-full py-16 text-center rounded-2xl border border-dashed border-white/10 bg-zinc-950/40">
              <UserCheck className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
              <p className="text-sm text-zinc-400 font-medium">No leads match your current query.</p>
              <button
                onClick={() => { setSearchQuery(''); setFilterType('ALL'); }}
                className="mt-3 text-xs text-blue-400 hover:underline cursor-pointer"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* MODAL: VIEW CONVERSATION */}
      {conversationModalLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-2xl bg-zinc-950 border border-white/15 p-6 shadow-2xl relative">
            <button
              onClick={() => setConversationModalLead(null)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-white p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 text-xs font-mono text-blue-400 uppercase tracking-wider mb-1">
              <MessageSquare className="w-4 h-4" />
              <span>Full Autonomous AI Chat Transcript</span>
            </div>

            <h3 className="text-2xl font-bold text-white mb-1">
              Conversation with {conversationModalLead.name}
            </h3>
            <p className="text-xs text-zinc-400 mb-4 font-mono">
              Captured via NexusAI Sales Assistant • {conversationModalLead.phone || 'Phone verified'}
            </p>

            {/* Quick Dossier */}
            <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-white/5 grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4 text-xs">
              <div>
                <span className="text-[10px] text-zinc-500 font-mono uppercase block">Property Interest</span>
                <span className="font-semibold text-white">{conversationModalLead.propertyInterest}</span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 font-mono uppercase block">Location</span>
                <span className="font-semibold text-white">{conversationModalLead.preferredLocation}</span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 font-mono uppercase block">Budget</span>
                <span className="font-bold text-amber-300 font-mono">{conversationModalLead.budget}</span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 font-mono uppercase block">Timeline</span>
                <span className="font-semibold text-white">{conversationModalLead.timeline}</span>
              </div>
            </div>

            {/* Messages */}
            <div className="max-h-[380px] overflow-y-auto space-y-3 py-2 pr-2 border-y border-white/10 my-4">
              {(conversationModalLead.conversationSnippet || conversationModalLead.conversation || [
                { role: 'assistant', text: "Hello! I'm the AI sales assistant for Nexus Estates Dubai. I can help you find properties, answer questions, and connect you with our sales team. What are you looking for today?", time: '10:14 AM' },
                { role: 'user', text: `I'm interested in ${conversationModalLead.propertyInterest} in ${conversationModalLead.preferredLocation}. Budget around ${conversationModalLead.budget}.`, time: '10:15 AM' },
                { role: 'assistant', text: `We have matching options available in ${conversationModalLead.preferredLocation}. Are you looking to purchase soon or still exploring?`, time: '10:16 AM' },
                { role: 'user', text: `${conversationModalLead.timeline}. Please connect me with a specialist. My number is ${conversationModalLead.phone}.`, time: '10:17 AM' },
                { role: 'assistant', text: `Thank you, ${conversationModalLead.name}. I've logged your request and our luxury broker specialist will follow up with complete floor plans.`, time: '10:18 AM' }
              ]).map((msg, idx) => {
                const isAssistant = msg.role === 'assistant';
                return (
                  <div
                    key={idx}
                    className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}
                  >
                    <span className="text-[10px] font-mono text-zinc-500 mb-1">
                      {isAssistant ? 'NexusAI Assistant' : conversationModalLead.name} {msg.time ? `• ${msg.time}` : ''}
                    </span>
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                        isAssistant
                          ? 'bg-zinc-900 border border-white/10 text-zinc-200'
                          : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-zinc-500 font-mono">
                Status: {conversationModalLead.status}
              </span>
              <button
                onClick={() => setConversationModalLead(null)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ASSIGN AGENT */}
      {assignAgentLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-zinc-950 border border-white/15 p-6 shadow-2xl relative">
            <button
              onClick={() => setAssignAgentLead(null)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-white p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 text-xs font-mono text-blue-400 uppercase tracking-wider mb-1">
              <UserPlus className="w-4 h-4" />
              <span>Broker Handover</span>
            </div>

            <h3 className="text-xl font-bold text-white mb-2">
              Assign Agent to {assignAgentLead.name}
            </h3>
            <p className="text-xs text-zinc-400 mb-4">
              Select a licensed luxury broker from Nexus Estates Dubai to take ownership of this qualified lead.
            </p>

            <form onSubmit={handleAssignAgentSubmit} className="space-y-4">
              <div>
                <label className="block text-zinc-400 font-mono text-[10px] uppercase mb-1">
                  Choose Licensed Broker
                </label>
                <select
                  value={selectedBroker}
                  onChange={(e) => setSelectedBroker(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Tariq Al-Mansoor (Senior Luxury Broker)">
                    Tariq Al-Mansoor (Senior Luxury Broker - Dubai Hills / Palm)
                  </option>
                  <option value="Layla Al-Hashemi (Off-Plan Specialist)">
                    Layla Al-Hashemi (Off-Plan Specialist - Downtown Dubai)
                  </option>
                  <option value="Zaid Al-Husseini (High-Net-Worth Advisory)">
                    Zaid Al-Husseini (HNW Advisory & Commercial)
                  </option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300">
                <span className="font-semibold block mb-1">Automated Handover Protocol:</span>
                Broker will receive an instant WhatsApp summary with buyer requirements, timeline, budget, and conversation link.
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAssignAgentLead(null)}
                  className="px-4 py-2 rounded-xl text-xs text-zinc-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold cursor-pointer shadow-lg shadow-blue-500/20"
                >
                  Confirm Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CONTACT SALES HANDOVER */}
      {contactModalLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl bg-zinc-950 border border-white/15 p-6 shadow-2xl relative">
            <button
              onClick={() => setContactModalLead(null)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-white p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 text-xs font-mono text-amber-400 uppercase tracking-wider mb-2">
              <Flame className="w-4 h-4 fill-amber-400" />
              <span>Priority Sales Handover</span>
            </div>

            <h3 className="text-2xl font-bold text-white mb-1">
              Contact Sales: {contactModalLead.name}
            </h3>
            <p className="text-xs text-zinc-400 mb-6">
              AI Sales Specialist has qualified this buyer for immediate broker engagement.
            </p>

            <div className="p-4 rounded-xl bg-zinc-900 border border-white/10 space-y-3 mb-6">
              <div className="flex justify-between items-center text-xs pb-2 border-b border-white/5">
                <span className="text-zinc-400">Phone:</span>
                <span className="font-mono font-semibold text-white">{contactModalLead.phone || '+971 50 892 4410'}</span>
              </div>
              <div className="flex justify-between items-center text-xs pb-2 border-b border-white/5">
                <span className="text-zinc-400">Property Interest:</span>
                <span className="font-semibold text-white">{contactModalLead.propertyInterest}</span>
              </div>
              <div className="flex justify-between items-center text-xs pb-2 border-b border-white/5">
                <span className="text-zinc-400">Location:</span>
                <span className="font-semibold text-white">{contactModalLead.preferredLocation}</span>
              </div>
              <div className="flex justify-between items-center text-xs pb-2 border-b border-white/5">
                <span className="text-zinc-400">Budget:</span>
                <span className="font-mono font-bold text-amber-300">{contactModalLead.budget}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-400">Timeline:</span>
                <span className="font-semibold text-emerald-400">{contactModalLead.timeline}</span>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setContactModalLead(null)}
                className="px-4 py-2 rounded-xl text-xs text-zinc-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleStatusChange(contactModalLead.id, 'CONTACTED');
                  setContactModalLead(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold cursor-pointer shadow-lg shadow-blue-500/20"
              >
                Mark as Contacted & Dispatch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
