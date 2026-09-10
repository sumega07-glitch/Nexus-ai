import React, { useState } from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  Clock, 
  DollarSign, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight, 
  Check, 
  Layers, 
  Filter, 
  Cpu, 
  Zap, 
  AlertCircle,
  RefreshCw,
  FileText
} from 'lucide-react';
import { AutomationOpportunity, ProcessAnalysisResult, ClientCompany } from '../../types';

interface ProcessAnalyzerProps {
  currentClient: ClientCompany;
  analysisResult: ProcessAnalysisResult | null;
  opportunities: AutomationOpportunity[];
  onToggleOpportunitySelection: (oppId: string) => void;
  onReRunAnalysis: () => void;
  onGoToProposal: () => void;
  isAnalyzing: boolean;
}

export const ProcessAnalyzer: React.FC<ProcessAnalyzerProps> = ({
  currentClient,
  analysisResult,
  opportunities,
  onToggleOpportunitySelection,
  onReRunAnalysis,
  onGoToProposal,
  isAnalyzing
}) => {
  const [tierFilter, setTierFilter] = useState<string>('ALL');

  const selectedCount = opportunities.filter(o => o.selectedForProposal).length;
  const selectedAnnualSavings = opportunities
    .filter(o => o.selectedForProposal)
    .reduce((acc, o) => acc + (Number(o.estimatedAnnualSavings) || 0), 0);
  const selectedWeeklyHours = opportunities
    .filter(o => o.selectedForProposal)
    .reduce((acc, o) => acc + (Number(o.estimatedHoursSavedPerWeek) || 0), 0);

  const filteredOpportunities = opportunities.filter(opp => {
    if (tierFilter === 'ALL') return true;
    return opp.implementationTier === tierFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass p-6 rounded-xl">
        <div>
          <div className="flex items-center space-x-2 text-[10px] font-medium text-white/40 uppercase tracking-widest mb-1 font-mono">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>AI Process Intelligence & Roadmap Engine</span>
          </div>
          <h1 className="serif italic text-3xl text-white">
            Automation Roadmap for {currentClient.name}
          </h1>
          <p className="text-xs text-white/50 mt-1 font-light">
            Structured opportunity evaluation generated via Gemini 3.8 Flash from onboarding discovery parameters.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onReRunAnalysis}
            disabled={isAnalyzing}
            className="px-4 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-white/80 text-xs font-medium uppercase tracking-wider border border-white/10 flex items-center space-x-1.5 transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-blue-400 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>{isAnalyzing ? 'Analyzing...' : 'Re-Run AI Analysis'}</span>
          </button>

          <button
            onClick={onGoToProposal}
            className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs uppercase tracking-wider flex items-center space-x-1.5 transition-all shadow-md cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Build Proposal ({selectedCount})</span>
          </button>
        </div>
      </div>

      {/* Executive Discovery Summary Card */}
      {analysisResult && (
        <div className="glass rounded-xl p-6 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/5">
            <div className="max-w-3xl">
              <span className="text-[10px] uppercase tracking-widest text-white/40 font-mono block mb-1">
                Executive Synthesis
              </span>
              <p className="text-sm text-white/90 font-light leading-relaxed">
                {analysisResult.executiveSummary}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-emerald-400 text-xs font-mono font-medium flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Risk Level: {analysisResult.riskLevel || 'Controlled'}</span>
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white text-xs font-mono font-medium">
                Avg Payback: {analysisResult.averagePaybackMonths || 1.4} Mo
              </span>
            </div>
          </div>

          {/* 4 Quantified Impact Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-black/30 p-4 rounded-xl border border-white/5">
              <span className="text-[10px] uppercase tracking-wider text-white/40 block font-mono">Total Annual Value</span>
              <span className="text-2xl font-light font-mono text-emerald-400 block mt-1">
                ${(analysisResult.totalEstimatedAnnualSavings || 280000).toLocaleString()}
              </span>
              <span className="text-[10px] text-white/30 font-light">Annual capacity saved</span>
            </div>

            <div className="bg-black/30 p-4 rounded-xl border border-white/5">
              <span className="text-[10px] uppercase tracking-wider text-white/40 block font-mono">Reclaimed Weekly Hours</span>
              <span className="text-2xl font-light font-mono text-white block mt-1">
                {analysisResult.totalHoursSavedPerWeek || 75}<span className="text-sm opacity-50 font-sans">h/wk</span>
              </span>
              <span className="text-[10px] text-white/30 font-light">Across team members</span>
            </div>

            <div className="bg-black/30 p-4 rounded-xl border border-white/5">
              <span className="text-[10px] uppercase tracking-wider text-white/40 block font-mono">Projected ROI</span>
              <span className="text-2xl font-light font-mono text-white block mt-1">
                +{analysisResult.projectedRoiPercentage || 380}%
              </span>
              <span className="text-[10px] text-white/30 font-light">Net return over cost</span>
            </div>

            <div className="bg-black/30 p-4 rounded-xl border border-white/5">
              <span className="text-[10px] uppercase tracking-wider text-white/40 block font-mono">Selected For Proposal</span>
              <span className="text-2xl font-light font-mono text-white block mt-1">
                {selectedCount} <span className="text-sm opacity-40 font-sans">of {opportunities.length}</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">${selectedAnnualSavings.toLocaleString()}/yr value</span>
            </div>
          </div>
        </div>
      )}

      {/* Prioritization 2x2 Matrix & Tier Selector */}
      <div className="glass rounded-xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold tracking-wide text-white flex items-center space-x-2">
              <Layers className="w-4 h-4 text-blue-400" />
              <span>Opportunity Prioritization Matrix & Tiers</span>
            </h2>
            <p className="text-xs text-white/40 mt-0.5 font-light">
              Ranked by impact, technical feasibility, risk, and time-to-value.
            </p>
          </div>

          {/* Tier Filter Tabs */}
          <div className="flex items-center space-x-1 bg-black/40 p-1 rounded-lg border border-white/5 text-xs">
            {['ALL', 'Quick Win', 'Strategic Core', 'High-Impact Transformation'].map(tier => (
              <button
                key={tier}
                onClick={() => setTierFilter(tier)}
                className={`px-3 py-1 rounded transition-colors cursor-pointer text-xs ${
                  tierFilter === tier
                    ? 'bg-white/10 text-white font-medium'
                    : 'text-white/40 hover:text-white/80'
                }`}
              >
                {tier}
              </button>
            ))}
          </div>
        </div>

        {/* Visual 2x2 Matrix Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-black/30 border border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">Tier 1: Quick Wins</span>
              <span className="text-[10px] font-mono text-white/40">1-2 Wks</span>
            </div>
            <p className="text-xs text-white/60 font-light leading-relaxed">
              High feasibility, low friction, immediate ROI within 30 days.
            </p>
            <span className="text-xs text-emerald-400 font-mono block">
              {opportunities.filter(o => o.implementationTier === 'Quick Win').length} Opportunities Identified
            </span>
          </div>

          <div className="p-4 rounded-xl bg-black/30 border border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-blue-400 uppercase tracking-wider">Tier 2: Strategic Core</span>
              <span className="text-[10px] font-mono text-white/40">3-4 Wks</span>
            </div>
            <p className="text-xs text-white/60 font-light leading-relaxed">
              Deep CRM/ERP integration, RAG knowledge retrieval, high team leverage.
            </p>
            <span className="text-xs text-blue-400 font-mono block">
              {opportunities.filter(o => o.implementationTier === 'Strategic Core').length} Opportunities Identified
            </span>
          </div>

          <div className="p-4 rounded-xl bg-black/30 border border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider">Tier 3: Transformation</span>
              <span className="text-[10px] font-mono text-white/40">4-6 Wks</span>
            </div>
            <p className="text-xs text-white/60 font-light leading-relaxed">
              Multi-agent autonomous systems, real-time audit reconciliation.
            </p>
            <span className="text-xs text-indigo-400 font-mono block">
              {opportunities.filter(o => o.implementationTier === 'High-Impact Transformation').length} Opportunities Identified
            </span>
          </div>
        </div>
      </div>

      {/* Opportunity Cards List */}
      <div className="space-y-4">
        {filteredOpportunities.map((opp) => {
          const isSelected = !!opp.selectedForProposal;

          const tierBadgeColors: Record<string, string> = {
            'Quick Win': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
            'Strategic Core': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
            'High-Impact Transformation': 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
          };

          return (
            <div
              key={opp.id}
              className={`p-6 rounded-xl border transition-all ${
                isSelected 
                  ? 'glass border-blue-500/80 shadow-xl shadow-blue-500/10' 
                  : 'glass hover:border-white/20'
              }`}
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1.5 max-w-3xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${tierBadgeColors[opp.implementationTier] || 'bg-white/5 text-white/60'}`}>
                      {opp.implementationTier}
                    </span>
                    <span className="px-2.5 py-0.5 rounded bg-black/40 border border-white/5 text-[10px] font-mono text-white/50">
                      {opp.category}
                    </span>
                    <span className="text-xs text-white/40 font-mono">
                      ~{opp.estimatedImplementationWeeks} wks timeline
                    </span>
                  </div>

                  <h3 className="serif text-xl text-white">
                    {opp.title}
                  </h3>
                </div>

                {/* Proposal Selection Toggle Checkbox */}
                <button
                  onClick={() => onToggleOpportunitySelection(opp.id)}
                  className={`px-4 py-2 rounded-lg text-xs font-medium uppercase tracking-wider flex items-center space-x-2 transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white/80'
                  }`}
                >
                  <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                    isSelected ? 'bg-white text-blue-600 border-white' : 'border-white/30'
                  }`}>
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span>{isSelected ? 'Included' : 'Add to Proposal'}</span>
                </button>
              </div>

              {/* Problem vs Proposed Architecture */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-5 text-xs">
                <div className="p-4 rounded-xl bg-black/30 border border-white/5">
                  <span className="text-[10px] font-mono text-rose-400 uppercase tracking-wider block mb-1.5">
                    Current Bottleneck & Inefficiency
                  </span>
                  <p className="text-white/70 font-light leading-relaxed">
                    {opp.painPoint}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-black/30 border border-white/5">
                  <span className="text-[10px] font-mono text-blue-400 uppercase tracking-wider block mb-1.5">
                    Proposed AI System Architecture
                  </span>
                  <p className="text-white/70 font-light leading-relaxed">
                    {opp.solutionArchitecture}
                  </p>
                </div>
              </div>

              {/* Score Indicators & Financial Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-4 border-t border-white/5 text-xs">
                <div className="bg-black/30 p-2.5 rounded-lg border border-white/5">
                  <span className="text-[10px] uppercase tracking-wider text-white/40 block font-mono">Weekly Saved</span>
                  <span className="text-base font-light font-mono text-white block mt-0.5">
                    {opp.estimatedHoursSavedPerWeek ?? 0} hrs/wk
                  </span>
                </div>

                <div className="bg-black/30 p-2.5 rounded-lg border border-white/5">
                  <span className="text-[10px] uppercase tracking-wider text-white/40 block font-mono">Annual Value</span>
                  <span className="text-base font-light font-mono text-emerald-400 block mt-0.5">
                    ${(Number(opp.estimatedAnnualSavings) || 0).toLocaleString()}/yr
                  </span>
                </div>

                <div className="bg-black/30 p-2.5 rounded-lg border border-white/5">
                  <span className="text-[10px] uppercase tracking-wider text-white/40 block font-mono">Feasibility</span>
                  <span className="text-base font-light font-mono text-white block mt-0.5">
                    {opp.feasibilityScore ?? 8} / 10
                  </span>
                </div>

                <div className="bg-black/30 p-2.5 rounded-lg border border-white/5">
                  <span className="text-[10px] uppercase tracking-wider text-white/40 block font-mono">Impact Score</span>
                  <span className="text-base font-light font-mono text-white block mt-0.5">
                    {opp.impactScore ?? 9} / 10
                  </span>
                </div>

                <div className="bg-black/30 p-2.5 rounded-lg border border-white/5">
                  <span className="text-[10px] uppercase tracking-wider text-white/40 block font-mono">Break-Even</span>
                  <span className="text-base font-light font-mono text-white block mt-0.5">
                    {opp.breakEvenMonths ?? 1.5} Mo
                  </span>
                </div>
              </div>

              {/* Recommended Tech Stack & Deliverables */}
              <div className="mt-4 pt-3 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] uppercase tracking-wider text-white/40 mr-1 font-mono">Stack:</span>
                  {(opp.recommendedTech || []).map((tech, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-black/40 border border-white/5 text-[10px] font-mono text-white/70">
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="text-[11px] text-white/40 font-mono">
                  {(opp.keyDeliverables || []).length} Deliverables mapped
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
