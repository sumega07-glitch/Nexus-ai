import React, { useState } from 'react';
import { 
  Building2, 
  Clock, 
  DollarSign, 
  Activity, 
  ShieldCheck, 
  CheckCircle2, 
  CreditCard, 
  Download, 
  FileText, 
  Send, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Sparkles,
  Layers,
  AlertCircle,
  Flame,
  Phone,
  X,
  PhoneCall,
  MessageSquare
} from 'lucide-react';
import { ClientCompany, GeneratedProposal, ActivityAuditLog, QualifiedLead } from '../../types';
import { INITIAL_LEADS } from '../../data/mockData';
import { LeadCard } from '../leads/LeadCard';
import { RolloutProgressStepper } from './RolloutProgressStepper';

interface ClientPortalProps {
  client: ClientCompany;
  proposal: GeneratedProposal;
  auditLogs: ActivityAuditLog[];
  leads?: QualifiedLead[];
  onApproveMilestone?: (milestoneIndex: number) => void;
}

export const ClientPortal: React.FC<ClientPortalProps> = ({
  client,
  proposal,
  auditLogs,
  leads = INITIAL_LEADS,
  onApproveMilestone
}) => {
  const [activeTab, setActiveTab] = useState<'METRICS' | 'LEADS' | 'MILESTONES' | 'BILLING' | 'REQUESTS'>('METRICS');
  const [feedbackCategory, setFeedbackCategory] = useState('New Workflow Automation');
  const [feedbackText, setFeedbackText] = useState('');
  const [submittedFeedback, setSubmittedFeedback] = useState(false);
  
  // Selected Lead for Modals in Client Portal
  const [contactModalLead, setContactModalLead] = useState<QualifiedLead | null>(null);
  const [conversationModalLead, setConversationModalLead] = useState<QualifiedLead | null>(null);
  const [contactToast, setContactToast] = useState<string | null>(null);

  const hotLeadsCount = leads.filter(l => l.isHot).length;

  const monthlySavingsCalculated = client.totalSavedHours * client.hourlyWageAvg;
  const clientLogs = auditLogs.filter(l => !l.clientName || l.clientName === client.name || l.clientName === 'Nexus Estates Dubai');

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    setSubmittedFeedback(true);
    setTimeout(() => {
      setFeedbackText('');
      setSubmittedFeedback(false);
    }, 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Client Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass p-6 rounded-xl">
        <div>
          <div className="flex items-center space-x-2 text-[10px] font-medium text-white/40 uppercase tracking-widest mb-1 font-mono">
            <Building2 className="w-3.5 h-3.5 text-blue-400" />
            <span>Dedicated Client Portal • {client.domain}</span>
          </div>
          <h1 className="serif italic text-3xl text-white">
            {client.name} Command Center
          </h1>
          <p className="text-xs text-white/50 mt-1 font-light">
            Architect: <strong className="text-white font-normal">{client.assignedArchitect}</strong> • Status: <span className={`font-medium font-mono ${
              client.status === 'ACTIVE_RETAINER' || client.status === 'COMPLETED'
                ? 'text-emerald-400'
                : client.status === 'DELIVERY'
                ? 'text-blue-400'
                : 'text-amber-400'
            }`}>{(client.status || 'ACTIVE').replace(/_/g, ' ')}</span>
          </p>
        </div>

        {/* Portal Tab Switcher */}
        <div className="flex flex-wrap items-center gap-1 bg-black/40 p-1 rounded-lg border border-white/5 text-xs">
          <button
            onClick={() => setActiveTab('METRICS')}
            className={`px-3 py-1.5 rounded transition-colors cursor-pointer text-xs ${
              activeTab === 'METRICS' ? 'bg-white/10 text-white font-medium' : 'text-white/40 hover:text-white/80'
            }`}
          >
            Live KPI Metrics
          </button>
          <button
            onClick={() => setActiveTab('LEADS')}
            className={`px-3 py-1.5 rounded transition-colors cursor-pointer text-xs flex items-center space-x-1.5 ${
              activeTab === 'LEADS' ? 'bg-amber-500/20 text-amber-300 font-medium border border-amber-500/30' : 'text-white/40 hover:text-amber-200'
            }`}
          >
            <span>🔥 Leads</span>
            <span className="px-1.5 py-0.5 rounded-full bg-amber-500/30 text-amber-200 text-[9px] font-bold font-mono">
              {hotLeadsCount} HOT
            </span>
          </button>
          <button
            onClick={() => setActiveTab('MILESTONES')}
            className={`px-3 py-1.5 rounded transition-colors cursor-pointer text-xs ${
              activeTab === 'MILESTONES' ? 'bg-white/10 text-white font-medium' : 'text-white/40 hover:text-white/80'
            }`}
          >
            Milestones & Delivery
          </button>
          <button
            onClick={() => setActiveTab('BILLING')}
            className={`px-3 py-1.5 rounded transition-colors cursor-pointer text-xs ${
              activeTab === 'BILLING' ? 'bg-white/10 text-white font-medium' : 'text-white/40 hover:text-white/80'
            }`}
          >
            Retainer & Billing
          </button>
          <button
            onClick={() => setActiveTab('REQUESTS')}
            className={`px-3 py-1.5 rounded transition-colors cursor-pointer text-xs ${
              activeTab === 'REQUESTS' ? 'bg-white/10 text-white font-medium' : 'text-white/40 hover:text-white/80'
            }`}
          >
            Submit Request
          </button>
        </div>
      </div>

      {/* Visual Rollout Progress Stepper */}
      <RolloutProgressStepper
        client={client}
        proposal={proposal}
        onNavigateToMilestones={() => setActiveTab('MILESTONES')}
      />

      {/* TAB 1: LIVE METRICS & REAL-TIME ACTIVITY STREAM */}
      {activeTab === 'METRICS' && (
        <div className="space-y-8">
          {/* Live Inbound Lead Highlight Card */}
          <div className="p-5 rounded-xl bg-gradient-to-r from-amber-500/10 via-zinc-950 to-zinc-950 border border-amber-500/30 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start space-x-3">
              <div className="p-2.5 rounded-lg bg-amber-500/20 text-amber-300 shrink-0 border border-amber-500/30">
                <Flame className="w-5 h-5 fill-amber-400 text-amber-400" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400">
                    🔥 Hot Inbound Lead Qualified by AI
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[9px] font-bold">
                    QUALIFIED
                  </span>
                </div>
                <h4 className="text-base font-bold text-white mt-0.5">
                  John Smith — Dubai Hills 3 Bedroom Villa
                </h4>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Budget: <strong className="text-white">AED 3M</strong> • Timeline: <strong className="text-white">3 Months</strong> • Inbound: WhatsApp/Web Widget
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={() => setContactModalLead(leads[0] || null)}
                className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Contact Sales
              </button>
              <button
                onClick={() => setConversationModalLead(leads[0] || null)}
                className="px-3.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-xs font-medium border border-white/10 transition-colors cursor-pointer"
              >
                View Conversation
              </button>
              <button
                onClick={() => setActiveTab('LEADS')}
                className="px-3 py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-medium transition-colors cursor-pointer"
              >
                All Leads →
              </button>
            </div>
          </div>

          {/* 4 Client KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="glass p-5 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider text-white/40 font-mono">Monthly Reclaimed</span>
                <Clock className="w-4 h-4 text-blue-400" />
              </div>
              <div className="mt-3 flex items-baseline space-x-2">
                <span className="text-2xl font-light font-mono text-white">{client.totalSavedHours.toLocaleString()} hrs</span>
                <span className="text-[10px] text-emerald-400 font-mono font-medium">+14%</span>
              </div>
              <p className="text-[10px] text-white/30 mt-1 font-light">Across active pipelines</p>
            </div>

            <div className="glass p-5 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider text-white/40 font-mono">Direct Labor Saved</span>
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="mt-3 flex items-baseline space-x-2">
                <span className="text-2xl font-light font-mono text-emerald-400">${monthlySavingsCalculated.toLocaleString()}</span>
                <span className="text-[10px] text-emerald-400 font-mono">3.4x ROI</span>
              </div>
              <p className="text-[10px] text-white/30 mt-1 font-light">Calculated at ${client.hourlyWageAvg}/hr</p>
            </div>

            <div className="glass p-5 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider text-white/40 font-mono">System Uptime SLA</span>
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="mt-3 flex items-baseline space-x-2">
                <span className="text-2xl font-light font-mono text-white">99.98%</span>
                <span className="text-[10px] text-emerald-400 font-mono">Nominal</span>
              </div>
              <p className="text-[10px] text-white/30 mt-1 font-light">Managed AI enterprise SLA</p>
            </div>

            <div className="glass p-5 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider text-white/40 font-mono">Autonomous Ops (30d)</span>
                <Activity className="w-4 h-4 text-blue-400" />
              </div>
              <div className="mt-3 flex items-baseline space-x-2">
                <span className="text-2xl font-light font-mono text-white">41,290</span>
                <span className="text-[10px] text-white/50 font-mono">99.4% Acc</span>
              </div>
              <p className="text-[10px] text-white/30 mt-1 font-light">LLM & API events</p>
            </div>
          </div>

          {/* Real-Time Processing Execution Feed */}
          <div className="glass rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <h3 className="text-sm font-semibold tracking-wide text-white">Live Execution Stream</h3>
              </div>
              <span className="text-[10px] text-white/40 font-mono">Real-Time Autonomous Feed</span>
            </div>

            <div className="space-y-3">
              {clientLogs.map((log) => (
                <div key={log.id} className="p-3.5 bg-black/30 border border-white/5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="font-medium text-white">{log.action}</span>
                      <span className="text-white/40 font-mono text-[10px]">• {log.timestamp}</span>
                    </div>
                    <p className="text-white/60 text-[11px] pl-5 font-light">{log.details}</p>
                  </div>

                  <span className="px-2 py-0.5 rounded bg-black/40 border border-white/5 text-[10px] font-mono text-white/60 self-start sm:self-auto">
                    {log.actor}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB: QUALIFIED INBOUND LEADS (HOT LEADS) */}
      {activeTab === 'LEADS' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-zinc-950/80 border border-white/5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
              <div>
                <div className="flex items-center space-x-2 text-[10px] font-mono font-bold tracking-widest text-amber-400 uppercase">
                  <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>Real-Time Inbound Qualification Engine</span>
                </div>
                <h2 className="text-2xl font-bold text-white mt-1">Qualified Property Leads</h2>
                <p className="text-xs text-zinc-400">
                  AI-qualified buyers from WhatsApp, web concierge, and property portal integrations.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold">
                  {hotLeadsCount} HOT LEADS
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold">
                  {leads.length} TOTAL LEADS
                </span>
              </div>
            </div>

            {/* Leads Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
              {leads.map((lead) => (
                <LeadCard
                  key={lead.id}
                  lead={lead}
                  onContactSales={(lead) => setContactModalLead(lead)}
                  onViewConversation={(lead) => setConversationModalLead(lead)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MILESTONES & DELIVERY PROGRESS */}
      {activeTab === 'MILESTONES' && (
        <div className="space-y-6">
          <div className="glass rounded-xl p-6 space-y-6">
            <div>
              <h2 className="serif text-xl text-white mb-1">90-Day Implementation & Delivery Gates</h2>
              <p className="text-xs text-white/40 font-light">Track milestone status, test acceptance criteria, and approve staging builds.</p>
            </div>

            <div className="space-y-4">
              {(proposal.solutionPhases || []).map((phase) => {
                const phaseStatus = phase.status || (phase.phaseNumber === 1 ? 'COMPLETED' : phase.phaseNumber === 2 ? 'IN_PROGRESS' : 'PENDING');
                const isComplete = phaseStatus === 'COMPLETED';
                const isInProgress = phaseStatus === 'IN_PROGRESS';

                return (
                  <div key={phase.phaseNumber} className="p-5 bg-black/30 border border-white/5 rounded-xl space-y-3 text-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center space-x-3">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-[10px] font-bold ${
                          isComplete ? 'bg-emerald-600 text-white' : isInProgress ? 'bg-blue-600 text-white' : 'bg-white/10 text-white/40'
                        }`}>
                          {isComplete ? '✓' : phase.phaseNumber}
                        </span>
                        <div>
                          <h3 className="serif text-base text-white">Phase {phase.phaseNumber}: {phase.phaseName}</h3>
                          <span className="text-[10px] text-white/40 font-mono">{phase.durationWeeks} Weeks Estimated</span>
                        </div>
                      </div>

                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium ${
                        isComplete ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        isInProgress ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                        'bg-white/5 text-white/40 border border-white/5'
                      }`}>
                        {phaseStatus.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <div className="pt-2">
                      <span className="text-white/60 font-medium block mb-1">Key Deliverables:</span>
                      <ul className="space-y-1 pl-4 list-disc text-white/70 font-light">
                        {phase.keyDeliverables.map((d, i) => (
                          <li key={i}>{d}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-3 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px]">
                      <span className="text-white/50 font-light">
                        <strong className="text-white font-normal">Acceptance Criteria:</strong> {phase.acceptanceCriteria}
                      </span>

                      {isInProgress && (
                        <button
                          onClick={() => alert(`Milestone Phase ${phase.phaseNumber} approval logged! Solutions architect notified.`)}
                          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs uppercase tracking-wider flex items-center space-x-1.5 cursor-pointer shadow-sm transition-colors"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve Milestone</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: BILLING & STRIPE INVOICE HISTORY */}
      {activeTab === 'BILLING' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="glass p-6 rounded-xl space-y-2">
              <span className="text-[10px] text-white/40 uppercase font-mono tracking-wider">Active Retainer</span>
              <div className="text-2xl font-light font-mono text-white">
                ${client.currentMonthlyRetainer.toLocaleString()}<span className="text-sm font-normal text-white/40">/mo</span>
              </div>
              <p className="text-[10px] text-white/40 font-light">
                Continuous prompt enhancement, model fine-tuning, and 99.9% uptime SLA.
              </p>
            </div>

            <div className="glass p-6 rounded-xl space-y-2">
              <span className="text-[10px] text-white/40 uppercase font-mono tracking-wider">Next Billing Cycle</span>
              <div className="text-2xl font-light font-mono text-white">
                October 1, 2026
              </div>
              <p className="text-[10px] text-white/40 font-light">
                Auto-charged via Stripe Enterprise Billing.
              </p>
            </div>

            <div className="glass p-6 rounded-xl space-y-2">
              <span className="text-[10px] text-white/40 uppercase font-mono tracking-wider">Payment Method</span>
              <div className="flex items-center space-x-2 text-white font-mono text-sm pt-1">
                <CreditCard className="w-4 h-4 text-blue-400" />
                <span>Visa ending in •••• 9412</span>
              </div>
              <p className="text-[10px] text-white/40 font-light">
                Managed securely via Stripe Customer Portal.
              </p>
            </div>
          </div>

          {/* Invoice History Table */}
          <div className="glass rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-semibold tracking-wide text-white">Invoice History & Receipts</h3>

            <div className="space-y-2 text-xs">
              {[
                { id: 'INV-2026-009', date: 'Sep 1, 2026', desc: 'Monthly Managed AI Retainer (Sep 2026)', amount: client.currentMonthlyRetainer || 4500, status: 'PAID' },
                { id: 'INV-2026-008', date: 'Aug 1, 2026', desc: 'Monthly Managed AI Retainer (Aug 2026)', amount: client.currentMonthlyRetainer || 4500, status: 'PAID' },
                { id: 'INV-2026-001', date: 'Jul 15, 2026', desc: 'Phase 1 Engineering & Implementation Kickoff', amount: 16500, status: 'PAID' },
              ].map((inv) => (
                <div key={inv.id} className="p-3.5 bg-black/30 border border-white/5 rounded-xl flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-white font-medium">{inv.id}</span>
                      <span className="text-white/60 font-light">• {inv.desc}</span>
                    </div>
                    <span className="text-[10px] text-white/40 font-mono">{inv.date}</span>
                  </div>

                  <div className="flex items-center space-x-4">
                    <span className="font-mono text-white text-sm">
                      ${inv.amount.toLocaleString()}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-mono border border-emerald-500/20">
                      {inv.status}
                    </span>
                    <button
                      onClick={() => alert(`Downloading PDF receipt for ${inv.id}`)}
                      className="p-1.5 text-white/40 hover:text-white rounded bg-white/5 border border-white/10 transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SUBMIT NEW WORKFLOW REQUEST */}
      {activeTab === 'REQUESTS' && (
        <div className="glass rounded-xl p-6 sm:p-8 max-w-2xl mx-auto space-y-6">
          <div>
            <h2 className="serif text-xl text-white mb-1">Submit Automation Feature Request</h2>
            <p className="text-xs text-white/40 font-light">
              Have another manual bottleneck or software tool you want to automate? Your assigned AI Architect ({client.assignedArchitect}) will analyze and prioritize it.
            </p>
          </div>

          {submittedFeedback ? (
            <div className="p-6 bg-black/30 border border-emerald-500/30 rounded-xl text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <h3 className="serif text-lg text-white">Request Submitted</h3>
              <p className="text-xs text-white/60 font-light">
                Your dedicated AI Solutions Architect has received your request and will schedule a scoping session within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmitFeedback} className="space-y-4 text-xs">
              <div>
                <label className="block text-white/60 font-medium mb-1">Request Category</label>
                <select
                  value={feedbackCategory}
                  onChange={(e) => setFeedbackCategory(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-white/30 cursor-pointer"
                >
                  <option value="New Workflow Automation">New Workflow Automation</option>
                  <option value="Prompt / Tone Calibration">Prompt / AI Agent Tone Adjustment</option>
                  <option value="New Software API Integration">New Software API Integration</option>
                  <option value="SOP Knowledge Base Update">SOP Knowledge Base Update</option>
                  <option value="Urgent Bug / SLA Ticket">Urgent Priority Support Ticket</option>
                </select>
              </div>

              <div>
                <label className="block text-white/60 font-medium mb-1">Describe the Workflow or Inefficiency</label>
                <textarea
                  rows={5}
                  required
                  placeholder="Describe the repetitive manual process, the software involved, and expected volume..."
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-white/30 resize-none leading-relaxed font-light"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs uppercase tracking-wider flex items-center space-x-2 cursor-pointer shadow-md transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit to Architect</span>
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Toast Notification */}
      {contactToast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-blue-600 text-white shadow-2xl flex items-center space-x-2 text-xs font-medium border border-blue-400/40">
          <PhoneCall className="w-4 h-4 animate-bounce" />
          <span>{contactToast}</span>
        </div>
      )}

      {/* Contact Sales Modal */}
      {contactModalLead && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Contact Sales Team</h3>
                  <p className="text-xs text-zinc-400">Direct Broker Assignment</p>
                </div>
              </div>
              <button
                onClick={() => setContactModalLead(null)}
                className="text-zinc-500 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs bg-zinc-900/60 p-4 rounded-xl border border-zinc-800/80">
              <div className="flex justify-between">
                <span className="text-zinc-500">Prospect:</span>
                <span className="text-white font-semibold">{contactModalLead.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Property Inquiry:</span>
                <span className="text-white font-medium">{contactModalLead.propertyType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Location:</span>
                <span className="text-white font-medium">{contactModalLead.preferredLocation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Budget:</span>
                <span className="text-emerald-400 font-mono font-bold">{contactModalLead.budget}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Timeline:</span>
                <span className="text-amber-300 font-medium">{contactModalLead.timeline}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-zinc-800">
                <span className="text-zinc-500">Direct Phone:</span>
                <span className="text-blue-400 font-mono font-semibold">{contactModalLead.phone}</span>
              </div>
            </div>

            <div className="flex space-x-3">
              <a
                href={`tel:${contactModalLead.phone || ''}`}
                onClick={() => {
                  setContactToast(`Connecting to ${contactModalLead.name} at ${contactModalLead.phone || 'Broker Desk'}...`);
                  setTimeout(() => setContactToast(null), 3500);
                  setContactModalLead(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-center text-xs font-semibold uppercase tracking-wider flex items-center justify-center space-x-2 transition-colors cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Broker Desk</span>
              </a>
              <a
                href={`https://wa.me/${(contactModalLead.phone || '').replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-center text-xs font-semibold uppercase tracking-wider flex items-center justify-center space-x-2 transition-colors cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* View Conversation Modal */}
      {conversationModalLead && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 shrink-0">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">AI Conversation Transcript</h3>
                  <p className="text-xs text-zinc-400">{conversationModalLead.name} • Nexus Estates Concierge</p>
                </div>
              </div>
              <button
                onClick={() => setConversationModalLead(null)}
                className="text-zinc-500 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2 text-xs">
              {(conversationModalLead.conversationSnippet || conversationModalLead.conversation || []).map((msg, idx) => {
                const isAssistant = msg.role === 'assistant';
                return (
                  <div
                    key={idx}
                    className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}
                  >
                    <div className="flex items-center space-x-1.5 mb-1 text-[10px] text-zinc-500 font-mono">
                      <span>{isAssistant ? 'Nexus Estates AI' : conversationModalLead.name}</span>
                      <span>•</span>
                      <span>{msg.time}</span>
                    </div>
                    <div
                      className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                        isAssistant
                          ? 'bg-zinc-900 border border-zinc-800 text-zinc-200'
                          : 'bg-blue-600 text-white font-medium'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-zinc-800 flex justify-between items-center shrink-0">
              <span className="text-[11px] text-emerald-400 font-mono">Status: QUALIFIED (Ready for Dispatch)</span>
              <button
                onClick={() => {
                  const leadToContact = conversationModalLead;
                  setConversationModalLead(null);
                  setContactModalLead(leadToContact);
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Proceed to Contact
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
