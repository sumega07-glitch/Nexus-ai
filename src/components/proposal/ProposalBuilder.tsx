import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Sparkles, 
  Printer, 
  Share2, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  ShieldCheck, 
  ChevronRight, 
  Edit3, 
  Layers, 
  Lock,
  Download,
  Check,
  Send,
  AlertCircle,
  Copy,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { GeneratedProposal, ClientCompany, AutomationOpportunity } from '../../types';
import { exportProposalToPdf } from '../../utils/pdfExport';

interface ProposalBuilderProps {
  currentClient: ClientCompany;
  proposal: GeneratedProposal;
  opportunities: AutomationOpportunity[];
  onUpdateProposal: (updated: GeneratedProposal) => void;
  onReGenerateProposal: () => void;
  isGenerating: boolean;
}

export const ProposalBuilder: React.FC<ProposalBuilderProps> = ({
  currentClient,
  proposal,
  opportunities,
  onUpdateProposal,
  onReGenerateProposal,
  isGenerating
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showSignModal, setShowSignModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [signerName, setSignerName] = useState(currentClient?.contactName || 'Executive Sponsor');
  const [signerTitle, setSignerTitle] = useState(currentClient?.contactRole || 'VP of Operations');
  const [copiedLink, setCopiedLink] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  // Local editable draft state synchronized with prop updates
  const [editableProposal, setEditableProposal] = useState<GeneratedProposal>(proposal);

  useEffect(() => {
    setEditableProposal(proposal);
  }, [proposal]);

  const selectedOpps = opportunities.filter(o => o.selectedForProposal);

  const handleSaveEdits = () => {
    onUpdateProposal(editableProposal);
    setIsEditing(false);
  };

  const handleDownloadPdf = () => {
    setIsExportingPdf(true);
    try {
      exportProposalToPdf(editableProposal, currentClient, opportunities);
    } catch (error) {
      console.error('PDF export failed:', error);
    } finally {
      setTimeout(() => setIsExportingPdf(false), 800);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSignProposal = () => {
    if (!signerName) return;

    const signed: GeneratedProposal = {
      ...editableProposal,
      status: 'ACCEPTED',
      signedBy: `${signerName} (${signerTitle})`,
      signedAt: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    };

    setEditableProposal(signed);
    onUpdateProposal(signed);
    setShowSignModal(false);

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.log('Confetti trigger');
    }
  };

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(`https://nexusai.agency/proposals/${proposal.id || 'acme-2026'}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Action & Status Bar (Hidden during print) */}
      <div className="no-print flex flex-col md:flex-row md:items-center justify-between gap-4 glass p-6 rounded-xl">
        <div>
          <div className="flex items-center space-x-2 text-[10px] font-medium text-white/40 uppercase tracking-widest mb-1 font-mono">
            <FileText className="w-3.5 h-3.5 text-blue-400" />
            <span>Proposal Builder & Agreement</span>
          </div>
          <h1 className="serif italic text-3xl text-white">
            Client Strategy Proposal: {currentClient?.name || 'Enterprise Client'}
          </h1>
          <p className="text-xs text-white/50 mt-1 font-light">
            Status: <span className={`font-medium ${proposal.status === 'ACCEPTED' ? 'text-emerald-400' : 'text-blue-400'}`}>
              {proposal.status === 'ACCEPTED' ? 'ACCEPTED & EXECUTED' : proposal.status}
            </span> • Valid through: <span className="text-white/70 font-mono">{proposal.validUntilDate}</span>
          </p>
        </div>

        {/* Top Control Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onReGenerateProposal}
            disabled={isGenerating}
            className="px-3.5 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-white/80 text-xs font-medium uppercase tracking-wider border border-white/10 flex items-center space-x-1.5 cursor-pointer disabled:opacity-50 transition-colors"
          >
            <Sparkles className={`w-3.5 h-3.5 text-blue-400 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Drafting...' : 'AI Re-Draft'}</span>
          </button>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-3.5 py-2 rounded-lg text-xs font-medium uppercase tracking-wider border flex items-center space-x-1.5 cursor-pointer transition-colors ${
              isEditing ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-white/[0.04] hover:bg-white/[0.08] text-white/80 border-white/10'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Done Editing' : 'Edit Text'}</span>
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={isExportingPdf}
            className="px-3.5 py-2 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 text-xs font-medium uppercase tracking-wider border border-blue-500/30 flex items-center space-x-1.5 cursor-pointer disabled:opacity-50 transition-colors shadow-sm"
            title="Download formatted Strategy Proposal as PDF"
          >
            <Download className={`w-3.5 h-3.5 text-blue-400 ${isExportingPdf ? 'animate-bounce' : ''}`} />
            <span>{isExportingPdf ? 'Generating...' : 'Download PDF'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-white/80 text-xs font-medium uppercase tracking-wider border border-white/10 flex items-center space-x-1.5 cursor-pointer transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-white/50" />
            <span>Print</span>
          </button>

          <button
            onClick={() => setShowShareModal(true)}
            className="px-3.5 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-white/80 text-xs font-medium uppercase tracking-wider border border-white/10 flex items-center space-x-1.5 cursor-pointer transition-colors"
          >
            <Share2 className="w-3.5 h-3.5 text-white/50" />
            <span>Share</span>
          </button>

          {proposal.status !== 'ACCEPTED' && (
            <button
              onClick={() => setShowSignModal(true)}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs uppercase tracking-wider flex items-center space-x-1.5 cursor-pointer shadow-md transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>E-Sign</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Document Body (Styled for Enterprise Executive Delivery & Print) */}
      <div className="glass print:bg-white rounded-xl p-8 sm:p-12 shadow-2xl print:shadow-none space-y-10 text-white print:text-black">
        
        {/* Cover Header */}
        <div className="border-b border-white/5 print:border-slate-300 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="serif text-xl font-bold tracking-tight text-white print:text-black">
                NEXUS<span className="text-blue-400 print:text-blue-700">AI</span>
              </span>
              <span className="text-xs text-white/40 print:text-slate-500 font-light">| Enterprise Solutions</span>
            </div>
            <h2 className="serif text-2xl sm:text-3xl text-white print:text-black leading-tight">
              {editableProposal.proposalTitle}
            </h2>
            <p className="text-xs text-white/50 print:text-slate-600 font-light">
              Prepared for: <strong className="text-white print:text-black font-medium">{editableProposal.targetClient}</strong> • Valid until: {editableProposal.validUntilDate}
            </p>
          </div>

          {/* Signed Watermark / Stamp if executed */}
          {editableProposal.status === 'ACCEPTED' && (
            <div className="p-3.5 bg-black/40 print:bg-emerald-50 border border-emerald-500/30 print:border-emerald-300 rounded-xl text-xs space-y-1">
              <div className="flex items-center space-x-1.5 text-emerald-400 print:text-emerald-800 font-medium font-mono">
                <CheckCircle2 className="w-4 h-4" />
                <span>Digitally Executed & Bound</span>
              </div>
              <p className="text-[11px] text-white/70 print:text-slate-700 font-light">
                Signed by: <strong>{editableProposal.signedBy}</strong>
              </p>
              <p className="text-[10px] text-white/40 font-mono">
                {editableProposal.signedAt} • Immutable Audit ID #{proposal.id}
              </p>
            </div>
          )}
        </div>

        {/* Section 1: Executive Summary */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-white/40 print:text-slate-600 font-mono text-[10px] uppercase tracking-widest">
            <span>01</span>
            <span>•</span>
            <span>Executive Summary & Vision</span>
          </div>

          {isEditing ? (
            <textarea
              rows={4}
              value={editableProposal.executiveSummary}
              onChange={(e) => setEditableProposal({ ...editableProposal, executiveSummary: e.target.value })}
              className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white resize-none font-light"
            />
          ) : (
            <p className="text-sm text-white/80 print:text-slate-700 leading-relaxed font-light">
              {editableProposal.executiveSummary}
            </p>
          )}
        </div>

        {/* Section 2: Financial Impact & Cost of Inaction */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-white/40 print:text-slate-600 font-mono text-[10px] uppercase tracking-widest">
            <span>02</span>
            <span>•</span>
            <span>Financial Payback & Reclaimed Value</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-black/30 print:bg-slate-100 border border-white/5 print:border-slate-300">
              <span className="text-[10px] uppercase tracking-wider text-white/40 print:text-slate-600 block font-mono">Cost of Inaction</span>
              <span className="text-2xl font-light font-mono text-rose-400 print:text-rose-700 block mt-1">
                ${(editableProposal.costOfInactionAnnual ?? 0).toLocaleString()}/yr
              </span>
              <span className="text-[10px] text-white/30 font-light">Wasted manual employee hours</span>
            </div>

            <div className="p-4 rounded-xl bg-black/30 print:bg-slate-100 border border-white/5 print:border-slate-300">
              <span className="text-[10px] uppercase tracking-wider text-white/40 print:text-slate-600 block font-mono">Projected Annual AI Benefit</span>
              <span className="text-2xl font-light font-mono text-emerald-400 print:text-emerald-700 block mt-1">
                ${(editableProposal.projectedAnnualBenefit ?? 0).toLocaleString()}/yr
              </span>
              <span className="text-[10px] text-white/30 font-light">Direct operational capacity</span>
            </div>

            <div className="p-4 rounded-xl bg-black/30 print:bg-slate-100 border border-white/5 print:border-slate-300">
              <span className="text-[10px] uppercase tracking-wider text-white/40 print:text-slate-600 block font-mono">Net 1st-Year Profit Benefit</span>
              <span className="text-2xl font-light font-mono text-white print:text-black block mt-1">
                ${(editableProposal.netFirstYearBenefit ?? 0).toLocaleString()}
              </span>
              <span className="text-[10px] text-white/30 font-light">After all agency fees & retainers</span>
            </div>
          </div>
        </div>

        {/* Section 3: Selected AI Automation Modules */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-white/40 print:text-slate-600 font-mono text-[10px] uppercase tracking-widest">
            <span>03</span>
            <span>•</span>
            <span>Target Automation Architecture & Scope</span>
          </div>

          <div className="space-y-3">
            {selectedOpps.map((opp, idx) => (
              <div key={opp.id} className="p-4 rounded-xl bg-black/30 print:bg-slate-50 border border-white/5 print:border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-5 h-5 rounded-full bg-white/5 text-white/80 print:bg-slate-100 print:text-black font-mono font-medium text-[10px] flex items-center justify-center border border-white/10">
                      {idx + 1}
                    </span>
                    <h4 className="serif text-base text-white print:text-black">{opp.title}</h4>
                  </div>
                  <span className="font-mono text-emerald-400 print:text-emerald-700 font-medium">
                    +{opp.estimatedHoursSavedPerWeek} hrs/wk saved
                  </span>
                </div>

                <p className="text-white/70 print:text-slate-700 font-light leading-relaxed">
                  <strong className="text-white print:text-black font-normal">Architecture:</strong> {opp.solutionArchitecture}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {opp.keyDeliverables.map((deliv, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-black/40 print:bg-white border border-white/5 print:border-slate-300 text-[10px] text-white/60 print:text-slate-700 font-mono">
                      ✓ {deliv}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: 90-Day Implementation Timeline & Milestones */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-white/40 print:text-slate-600 font-mono text-[10px] uppercase tracking-widest">
            <span>04</span>
            <span>•</span>
            <span>90-Day Implementation Plan & Acceptance Gates</span>
          </div>

          <div className="space-y-4">
            {(editableProposal.solutionPhases || []).map((phase) => (
              <div key={phase.phaseNumber} className="p-4 rounded-xl bg-black/30 print:bg-slate-50 border border-white/5 print:border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="serif text-sm text-white print:text-black">
                    Phase {phase.phaseNumber}: {phase.phaseName}
                  </span>
                  <span className="font-mono text-white/50 print:text-slate-600">
                    {phase.durationWeeks} Wks Duration
                  </span>
                </div>

                <ul className="space-y-1 text-white/70 print:text-slate-700 pl-4 list-disc font-light">
                  {(phase.keyDeliverables || []).map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>

                <div className="pt-2 border-t border-white/5 print:border-slate-200 text-[11px] text-white/50 print:text-slate-600 font-light">
                  <strong className="text-white print:text-black font-normal">Gate Acceptance Criteria:</strong> {phase.acceptanceCriteria}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: Commercial Terms & Milestone Schedule */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-white/40 print:text-slate-600 font-mono text-[10px] uppercase tracking-widest">
            <span>05</span>
            <span>•</span>
            <span>Investment Breakdown & Payment Milestones</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-black/30 print:bg-slate-50 border border-white/5 print:border-slate-300 space-y-2">
              <span className="text-[10px] uppercase tracking-wider text-white/40 print:text-slate-600 block font-mono">Phase 1 Engineering & Deployment</span>
              <div className="text-3xl font-light font-mono text-white print:text-black">
                ${(editableProposal.commercialTerms?.setupInvestment ?? 16500).toLocaleString()}
              </div>
              <p className="text-[11px] text-white/50 print:text-slate-600 font-light">
                One-time fee covering custom LLM prompting, vector knowledge base indexing, API connectors, and UAT.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-black/30 print:bg-slate-50 border border-white/5 print:border-slate-300 space-y-2">
              <span className="text-[10px] uppercase tracking-wider text-white/40 print:text-slate-600 block font-mono">Managed Operations Retainer</span>
              <div className="text-3xl font-light font-mono text-white print:text-black">
                ${(editableProposal.commercialTerms?.monthlyRetainer ?? 4250).toLocaleString()}<span className="text-sm text-white/40 font-normal">/mo</span>
              </div>
              <p className="text-[11px] text-white/50 print:text-slate-600 font-light">
                {editableProposal.commercialTerms?.contractTermMonths ?? 12}-Month agreement including 99.9% uptime SLA, model fine-tuning, and prompt enhancements.
              </p>
            </div>
          </div>

          {/* Payment Milestone Triggers */}
          <div className="p-4 rounded-xl bg-black/30 print:bg-slate-50 border border-white/5 print:border-slate-300 space-y-3">
            <span className="text-xs text-white/80 print:text-black block font-medium">Milestone Billing Schedule</span>
            <div className="space-y-2 text-xs">
              {(editableProposal.commercialTerms?.paymentMilestones || []).map((m, i) => (
                <div key={i} className="flex items-center justify-between pb-1.5 border-b border-white/5 print:border-slate-200">
                  <span className="text-white/70 print:text-slate-700 font-light">{m.milestoneName} ({m.percentage}%)</span>
                  <span className="font-mono text-white/90 print:text-black text-[11px]">{m.trigger}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 6: Security, Compliance & SLA Guarantees */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-white/40 print:text-slate-600 font-mono text-[10px] uppercase tracking-widest">
            <span>06</span>
            <span>•</span>
            <span>Security, Compliance & Guarantees</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-lg bg-black/30 print:bg-slate-50 border border-white/5 print:border-slate-300 space-y-1">
              <span className="font-medium text-emerald-400 print:text-emerald-800 flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Enterprise Data Privacy Guarantee</span>
              </span>
              <p className="text-[11px] text-white/50 print:text-slate-600 font-light">
                All client proprietary data, documents, and customer conversations are strictly isolated. No data is used to train public LLM models.
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-black/30 print:bg-slate-50 border border-white/5 print:border-slate-300 space-y-1">
              <span className="font-medium text-emerald-400 print:text-emerald-800 flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>30-Day Milestone Guarantee</span>
              </span>
              <p className="text-[11px] text-white/50 print:text-slate-600 font-light">
                Full money-back refund on setup fees if automated resolution accuracy fails acceptance criteria during UAT staging.
              </p>
            </div>
          </div>
        </div>

        {/* Section 7: Signature Execution Block */}
        <div className="pt-8 border-t border-white/5 print:border-slate-300 grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs">
          <div className="space-y-3">
            <span className="text-[10px] font-mono text-white/40 print:text-slate-600 uppercase tracking-wider">For Agency: NexusAI Solutions</span>
            <div className="p-4 bg-black/30 print:bg-slate-100 rounded-xl border border-white/5 print:border-slate-300 space-y-2">
              <div className="serif italic text-base text-white print:text-black">Alex Vance</div>
              <div className="text-[11px] text-white/50 print:text-slate-600 font-light">Alex Vance • Principal AI Architect</div>
              <div className="text-[10px] text-white/40 font-mono">Date: {new Date().toLocaleDateString()}</div>
            </div>
          </div>

          <div className="space-y-3">
            <span className="text-[10px] font-mono text-white/40 print:text-slate-600 uppercase tracking-wider">For Client: {editableProposal.targetClient}</span>
            <div className="p-4 bg-black/30 print:bg-slate-100 rounded-xl border border-white/5 print:border-slate-300 space-y-2">
              {editableProposal.status === 'ACCEPTED' ? (
                <>
                  <div className="serif italic text-base text-emerald-400 print:text-emerald-800">{editableProposal.signedBy}</div>
                  <div className="text-[11px] text-white/70 print:text-slate-700 font-light">Authorized Electronic Signature</div>
                  <div className="text-[10px] text-emerald-400 font-mono">Executed: {editableProposal.signedAt}</div>
                </>
              ) : (
                <div className="py-2 text-center text-white/40 italic font-light">
                  Awaiting electronic signature from authorized sponsor
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Electronic Signature Modal */}
      {showSignModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="serif italic text-xl text-white">Execute Strategy Agreement</h3>
            <p className="text-xs text-white/50 font-light">
              By typing your name below, you confirm agreement to the scope of work, milestone schedule, and commercial terms for {currentClient?.name || 'Enterprise Client'}.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-white/60 mb-1 font-medium">Signer Full Legal Name</label>
                <input
                  type="text"
                  value={signerName}
                  onChange={(e) => setSignerName(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-white/30 font-light"
                />
              </div>

              <div>
                <label className="block text-white/60 mb-1 font-medium">Title / Corporate Designation</label>
                <input
                  type="text"
                  value={signerTitle}
                  onChange={(e) => setSignerTitle(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-white/30 font-light"
                />
              </div>

              <div className="p-3 bg-black/40 border border-white/5 rounded-xl text-[11px] text-white/70 font-mono">
                Setup: ${editableProposal.commercialTerms.setupInvestment.toLocaleString()} • Monthly Retainer: ${editableProposal.commercialTerms.monthlyRetainer.toLocaleString()}/mo
              </div>
            </div>

            <div className="pt-3 border-t border-white/5 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowSignModal(false)}
                className="px-4 py-2 rounded-lg bg-white/[0.04] text-white/60 text-xs font-medium hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSignProposal}
                className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs uppercase tracking-wider cursor-pointer shadow-md transition-colors"
              >
                Sign & Accept Agreement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Proposal Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="serif italic text-xl text-white">Share Proposal with Client</h3>
            <p className="text-xs text-white/50 font-light">
              Send this interactive live link to executive stakeholders for review and e-signature.
            </p>

            <div className="bg-black/40 p-3 rounded-xl border border-white/5 flex items-center justify-between text-xs">
              <span className="font-mono text-white/60 truncate mr-2 text-[11px]">
                https://nexusai.agency/proposals/{proposal.id || 'acme-2026'}
              </span>
              <button
                onClick={handleCopyShareLink}
                className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs flex items-center space-x-1 cursor-pointer transition-colors"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>

            <div className="pt-1">
              <button
                onClick={() => {
                  handleDownloadPdf();
                  setShowShareModal(false);
                }}
                disabled={isExportingPdf}
                className="w-full py-2.5 px-4 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] text-white/90 text-xs font-medium border border-white/10 flex items-center justify-center space-x-2 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-blue-400" />
                <span>Download Strategy Proposal (PDF)</span>
              </button>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2 rounded-lg bg-white/[0.04] text-white/60 text-xs font-medium hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
