import React, { useState } from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  TrendingUp, 
  Clock, 
  DollarSign, 
  ShieldCheck, 
  Cpu, 
  Workflow, 
  Bot, 
  FileSpreadsheet, 
  Database,
  Lock,
  BarChart3,
  Building,
  Zap,
  Check,
  Flame,
  MessageSquare,
  Home,
  Users,
  CreditCard,
  Building2,
  Calendar
} from 'lucide-react';

interface LandingPageProps {
  onStartDiscovery?: () => void;
  onExploreDashboard?: () => void;
  onNavigateToLeads?: () => void;
  onNavigateToStudio?: () => void;
  onNavigateToPricing?: () => void;
  onExploreApp?: () => void;
  onOpenDiscovery?: () => void;
  onViewLeads?: () => void;
  onViewConversations?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartDiscovery,
  onExploreDashboard,
  onNavigateToLeads,
  onNavigateToStudio,
  onNavigateToPricing,
  onExploreApp,
  onOpenDiscovery,
  onViewLeads,
  onViewConversations
}) => {
  const handleStartDiscovery = onStartDiscovery || onOpenDiscovery || (() => {});
  const handleExplore = onExploreDashboard || onExploreApp || (() => {});
  const handleLeads = onNavigateToLeads || onViewLeads;
  // Real Estate Interactive ROI Estimator
  const [brokerCount, setBrokerCount] = useState<number>(20);
  const [hoursSpentPerWeek, setHoursSpentPerWeek] = useState<number>(15);
  const [avgCommission, setAvgCommission] = useState<number>(25000); // AED or USD

  // Weekly hours lost per broker on manual portal messages and unqualified queries
  const weeklyWastedHoursTotal = brokerCount * hoursSpentPerWeek;
  const annualBrokerHoursWasted = weeklyWastedHoursTotal * 50;
  // Estimated additional closed deals per year by responding within 60 seconds (conservative 2 extra deals per 5 brokers)
  const estimatedExtraDeals = Math.max(1, Math.round((brokerCount / 5) * 2));
  const estimatedRevenueGained = estimatedExtraDeals * avgCommission;
  const reclaimedBrokerHours = Math.round(annualBrokerHoursWasted * 0.75);

  return (
    <div className="min-h-screen bg-[#050505] text-[#e5e7eb]">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-14 pb-20 border-b border-white/5">
        {/* Subtle atmospheric ambient glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[360px] bg-blue-600/[0.08] blur-[150px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Top Eyebrow Tag */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-xs font-medium text-white/80 mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[11px] uppercase tracking-widest text-zinc-400 font-mono">
                NEXUSAI Multi-Tenant Operating System
              </span>
              <span className="text-white/20">•</span>
              <span className="text-blue-400 font-mono text-[11px]">Real Estate Edition</span>
            </div>

            {/* Main Headline */}
            <h1 className="serif italic text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-white leading-tight">
              Turn Inbound Property Inquiries Into Qualified Private Viewings In 60 Seconds.
            </h1>

            {/* Subtitle */}
            <p className="mt-6 text-base sm:text-lg text-white/60 max-w-2xl mx-auto leading-relaxed font-light">
              NexusAI is the multi-tenant AI operating system built for international real-estate brokerages, off-plan developers, and luxury agencies. Deploy 24/7 AI sales agents that autonomously answer inventory questions, qualify buyer budgets and timelines, and hand off high-intent leads to your licensed sales brokers.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
              {handleLeads && (
                <button
                  id="landing-explore-leads-btn"
                  onClick={handleLeads}
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-xs uppercase tracking-widest shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Flame className="w-4 h-4 fill-amber-300 text-amber-300" />
                  <span>Explore Live Leads</span>
                </button>
              )}

              {onNavigateToStudio && (
                <button
                  id="landing-test-agent-btn"
                  onClick={onNavigateToStudio}
                  className="px-6 py-3 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/15 text-white font-medium text-xs uppercase tracking-widest transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Bot className="w-4 h-4 text-blue-400" />
                  <span>Test AI Sales Agent</span>
                </button>
              )}

              {onNavigateToPricing && (
                <button
                  id="landing-pricing-btn"
                  onClick={onNavigateToPricing}
                  className="px-5 py-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.06] border border-white/10 text-white/80 hover:text-white font-medium text-xs uppercase tracking-widest transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Pilot Plans ($99+)</span>
                </button>
              )}

              <button
                id="landing-open-dashboard-btn"
                onClick={handleExplore}
                className="px-5 py-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.06] border border-white/10 text-white/70 hover:text-white font-medium text-xs uppercase tracking-widest transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <BarChart3 className="w-3.5 h-3.5 text-zinc-400" />
                <span>Brokerage Dashboard</span>
              </button>
            </div>

            {/* Micro proof points */}
            <div className="mt-10 pt-6 border-t border-white/5 flex flex-wrap items-center justify-center gap-6 text-xs text-white/40 font-mono">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>24/7 Zero Latency Buyer Engagement</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>WhatsApp Business & Web Widget API</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Grounded RAG Property Vector Store</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real-Estate Core Capabilities Bento */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="text-[10px] uppercase tracking-widest text-zinc-400 mb-2 font-mono">
            Autonomous Property Sales Engine
          </div>
          <h2 className="serif italic text-3xl text-white">Engineered For High-Value Real Estate</h2>
          <p className="text-xs text-zinc-400 mt-2 font-light">
            Every layer designed to eliminate broker manual triage while delivering concierge-level service to international buyers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="glass rounded-xl p-6 hover:border-white/20 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
                <Bot className="w-5 h-5" />
              </div>
              <h3 className="serif text-xl text-white mb-2">24/7 AI Sales Assistant</h3>
              <p className="text-xs text-white/60 leading-relaxed font-light">
                Autonomously answers property questions across Dubai Hills, Downtown, Palm Jumeirah, and master developments with floorplans, pricing, and live community amenities.
              </p>
              <div className="mt-4 space-y-1.5 text-xs text-white/70">
                <div className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-blue-400" />
                  <span>Instant response at 2:00 AM for international buyers</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-blue-400" />
                  <span>Voice audio synthesis for telephone support</span>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-white/5 text-[11px] text-zinc-500 font-mono">
              Channels: Web Widget • WhatsApp • Voice Agent
            </div>
          </div>

          {/* Card 2 */}
          <div className="glass rounded-xl p-6 border-blue-500/30 relative flex flex-col justify-between">
            <div className="absolute -top-2.5 right-4 px-2 py-0.5 rounded bg-blue-600 text-white text-[9px] font-mono uppercase tracking-widest">
              High Leverage
            </div>
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
                <Flame className="w-5 h-5 fill-amber-400" />
              </div>
              <h3 className="serif text-xl text-white mb-2">Autonomous Lead Qualification</h3>
              <p className="text-xs text-white/60 leading-relaxed font-light">
                Gathers budget, bedroom requirements, cash vs. mortgage financing, and expected purchase timeline. Categorizes leads as HOT and pre-qualifies purchasing power.
              </p>
              <div className="mt-4 space-y-1.5 text-xs text-white/70">
                <div className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-amber-400" />
                  <span>Identifies &gt;AED 3M+ high-budget buyers instantly</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-amber-400" />
                  <span>Automated lead scoring: HOT, WARM, QUALIFIED</span>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-white/5 text-[11px] text-zinc-500 font-mono">
              Output: CRM Lead Record with Full Transcript
            </div>
          </div>

          {/* Card 3 */}
          <div className="glass rounded-xl p-6 hover:border-white/20 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="serif text-xl text-white mb-2">Human Broker Handoff</h3>
              <p className="text-xs text-white/60 leading-relaxed font-light">
                When a buyer requests sales assistance or schedules a private viewing, the agent triggers an instant broker dispatch with full conversation context.
              </p>
              <div className="mt-4 space-y-1.5 text-xs text-white/70">
                <div className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Single-click WhatsApp and phone broker dispatch</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Brokers enter conversations pre-informed of requirements</span>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-white/5 text-[11px] text-zinc-500 font-mono">
              Integrations: Salesforce • HubSpot • Yardi • Webhooks
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Real Estate ROI Estimator Hook */}
      <section className="py-14 bg-[#080808] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto glass rounded-xl p-6 sm:p-8 relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/5">
              <div>
                <div className="flex items-center space-x-2 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-1 font-mono">
                  <TrendingUp className="w-4 h-4" />
                  <span>Brokerage ROI & Capacity Calculator</span>
                </div>
                <h2 className="serif italic text-2xl text-white">
                  Quantify Lost Broker Hours vs. Autonomous AI Conversions
                </h2>
              </div>
              <span className="px-2.5 py-1 bg-white/[0.04] text-blue-400 border border-white/10 text-xs font-mono rounded self-start md:self-auto">
                Real Estate Benchmark Model
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
              <div>
                <label className="text-xs text-white/50 font-medium block mb-2">
                  Licensed Sales Brokers: <span className="text-white font-mono font-semibold">{brokerCount} brokers</span>
                </label>
                <input
                  type="range"
                  min="5"
                  max="100"
                  step="5"
                  value={brokerCount}
                  onChange={(e) => setBrokerCount(Number(e.target.value))}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-[10px] text-white/30 mt-1 font-mono">
                  <span>5 brokers</span>
                  <span>100 brokers</span>
                </div>
              </div>

              <div>
                <label className="text-xs text-white/50 font-medium block mb-2">
                  Hours / Wk Fielding Repetitive Portal Inquiries: <span className="text-white font-mono font-semibold">{hoursSpentPerWeek} hrs/broker</span>
                </label>
                <input
                  type="range"
                  min="5"
                  max="30"
                  step="1"
                  value={hoursSpentPerWeek}
                  onChange={(e) => setHoursSpentPerWeek(Number(e.target.value))}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-[10px] text-white/30 mt-1 font-mono">
                  <span>5 hrs</span>
                  <span>30 hrs</span>
                </div>
              </div>

              <div>
                <label className="text-xs text-white/50 font-medium block mb-2">
                  Average Deal Broker Commission: <span className="text-white font-mono font-semibold">${avgCommission.toLocaleString()}</span>
                </label>
                <input
                  type="range"
                  min="10000"
                  max="80000"
                  step="5000"
                  value={avgCommission}
                  onChange={(e) => setAvgCommission(Number(e.target.value))}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-[10px] text-white/30 mt-1 font-mono">
                  <span>$10,000</span>
                  <span>$80,000</span>
                </div>
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/5 bg-black/40 p-4 rounded-lg">
              <div className="p-3">
                <span className="text-xs uppercase tracking-wider text-white/40 block mb-1 font-mono">
                  Annual Broker Time Lost
                </span>
                <span className="text-2xl font-light text-rose-400 font-mono">
                  {annualBrokerHoursWasted.toLocaleString()} hrs
                  <span className="text-xs font-sans text-white/40 block mt-0.5">spent answering repetitive queries</span>
                </span>
              </div>

              <div className="p-3 border-t sm:border-t-0 sm:border-l border-white/5">
                <span className="text-xs uppercase tracking-wider text-white/40 block mb-1 font-mono">
                  Reclaimed Broker Capacity
                </span>
                <span className="text-2xl font-light text-emerald-400 font-mono">
                  +{reclaimedBrokerHours.toLocaleString()} hrs
                  <span className="text-xs font-sans text-white/40 block mt-0.5">redirected to high-touch viewings</span>
                </span>
              </div>

              <div className="p-3 border-t sm:border-t-0 sm:border-l border-white/5 flex flex-col justify-center">
                <span className="text-xs uppercase tracking-wider text-white/40 block mb-1 font-mono">
                  Projected Commission Uplift
                </span>
                <span className="text-2xl font-light text-blue-400 font-mono">
                  +${estimatedRevenueGained.toLocaleString()}
                  <span className="text-xs font-sans text-white/40 block mt-0.5">from instant 60s qualification</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real Estate Case Studies & Proof Points */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="text-[10px] uppercase tracking-widest text-zinc-400 mb-2 font-mono">
            Verified Brokerage Case Studies
          </div>
          <h2 className="serif italic text-3xl text-white">Real-World Real Estate Transformations</h2>
          <p className="text-xs text-zinc-400 mt-2 font-light">
            How leading luxury brokerages and property developers eliminate lead leakage with NexusAI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Case 1 */}
          <div className="glass rounded-xl p-6 hover:border-white/20 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-0.5 rounded bg-white/5 text-white/70 text-xs font-medium border border-white/10">
                  Luxury Brokerage
                </span>
                <span className="text-xs font-mono text-emerald-400 font-medium">AED 12.5M Pipeline</span>
              </div>
              <h3 className="serif text-xl text-white mb-2">Nexus Estates Dubai</h3>
              <p className="text-xs text-white/60 leading-relaxed font-light">
                Deployed autonomous luxury property sales assistant with live inventory RAG across Dubai Hills, Downtown, and Palm Jumeirah, with instant lead handoff to brokers.
              </p>
              <div className="mt-4 space-y-1.5 text-xs text-white/70">
                <div className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-blue-400" />
                  <span>75 hours/week saved qualifying buyer inquiries</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-blue-400" />
                  <span>1.4-month break-even period on deployment</span>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-white/5 text-[11px] text-zinc-500 font-mono">
              Stack: Gemini 3.8 Flash • WhatsApp Business • Salesforce CRM
            </div>
          </div>

          {/* Case 2 */}
          <div className="glass rounded-xl p-6 hover:border-white/20 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-0.5 rounded bg-white/5 text-white/70 text-xs font-medium border border-white/10">
                  Off-Plan Master Developer
                </span>
                <span className="text-xs font-mono text-emerald-400 font-medium">4.2x Faster Viewing Booking</span>
              </div>
              <h3 className="serif text-xl text-white mb-2">Elysian Off-Plan Residences</h3>
              <p className="text-xs text-white/60 leading-relaxed font-light">
                Automated multi-currency payment plan explanations, floorplan distribution, and escrow payment milestone answers for European and Asian investors.
              </p>
              <div className="mt-4 space-y-1.5 text-xs text-white/70">
                <div className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-blue-400" />
                  <span>62% reduction in initial brochure requests handled by humans</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-blue-400" />
                  <span>24/7 multilingual qualification in English, Russian, and Arabic</span>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-white/5 text-[11px] text-zinc-500 font-mono">
              Stack: Vector RAG • Multilingual LLM • HubSpot CRM
            </div>
          </div>

          {/* Case 3 */}
          <div className="glass rounded-xl p-6 hover:border-white/20 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-0.5 rounded bg-white/5 text-white/70 text-xs font-medium border border-white/10">
                  Commercial & Asset Management
                </span>
                <span className="text-xs font-mono text-emerald-400 font-medium">88% Auto-Triaged</span>
              </div>
              <h3 className="serif text-xl text-white mb-2">Apex Real Estate Holdings</h3>
              <p className="text-xs text-white/60 leading-relaxed font-light">
                Engineered autonomous commercial leasing inquiry triage, square footage pricing calculations, and automated tenant viewing scheduling.
              </p>
              <div className="mt-4 space-y-1.5 text-xs text-white/70">
                <div className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-blue-400" />
                  <span>Zero lead drop-off during peak commercial search hours</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-blue-400" />
                  <span>Automated broker calendar sync & NDA distribution</span>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-white/5 text-[11px] text-zinc-500 font-mono">
              Stack: Yardi Voyager • DocuSign API • Webhooks
            </div>
          </div>
        </div>
      </section>

      {/* 3-Tier Enterprise Service Model */}
      <section className="py-16 bg-[#080808] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="text-[10px] uppercase tracking-widest text-zinc-400 mb-2 font-mono">
              Brokerage Deployment Roadmap
            </div>
            <p className="serif italic text-3xl text-white">How We Deploy Into Your Brokerage</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl glass flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 text-blue-400 flex items-center justify-center mb-4">
                  <Workflow className="w-4 h-4" />
                </div>
                <h3 className="serif text-lg text-white mb-2">Phase 1: Catalog RAG Ingestion</h3>
                <p className="text-xs text-white/60 leading-relaxed font-light">
                  We ingest your property listings, brochures, pricing matrices, and sales SOPs into secure vector embeddings with strict tenant isolation.
                </p>
                <ul className="mt-4 space-y-2 text-xs text-white/70">
                  <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-blue-400" /><span>Property specification parsing</span></li>
                  <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-blue-400" /><span>Pricing & payment plan guardrails</span></li>
                  <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-blue-400" /><span>Broker assignment mapping</span></li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-white/5">
                <span className="text-xs font-mono text-zinc-400">Timeline: 7 Days</span>
              </div>
            </div>

            <div className="p-6 rounded-xl glass border-blue-500/30 relative flex flex-col justify-between">
              <div className="absolute -top-2.5 right-4 px-2 py-0.5 rounded bg-blue-600 text-white text-[9px] font-mono uppercase tracking-widest">
                Production Core
              </div>
              <div>
                <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
                  <Cpu className="w-4 h-4" />
                </div>
                <h3 className="serif text-lg text-white mb-2">Phase 2: Live WhatsApp & Web Cutover</h3>
                <p className="text-xs text-white/60 leading-relaxed font-light">
                  We connect your official WhatsApp Business number and website chat widget, configuring real-time broker notifications and CRM dispatch.
                </p>
                <ul className="mt-4 space-y-2 text-xs text-white/70">
                  <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-blue-400" /><span>WhatsApp Business API setup</span></li>
                  <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-blue-400" /><span>CRM webhook integration</span></li>
                  <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-blue-400" /><span>Human handoff fallback testing</span></li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-white/5">
                <span className="text-xs font-mono text-blue-400">Timeline: 14 Days</span>
              </div>
            </div>

            <div className="p-6 rounded-xl glass flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="serif text-lg text-white mb-2">Phase 3: Managed Retainer & SLA</h3>
                <p className="text-xs text-white/60 leading-relaxed font-light">
                  Continuous prompt optimization, weekly inventory updates, conversation audit logging, and guaranteed 99.9% uptime.
                </p>
                <ul className="mt-4 space-y-2 text-xs text-white/70">
                  <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-blue-400" /><span>Weekly inventory catalog re-indexing</span></li>
                  <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-blue-400" /><span>Lead conversion analytics reporting</span></li>
                  <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-blue-400" /><span>Dedicated account manager & SLA</span></li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-white/5">
                <span className="text-xs font-mono text-emerald-400">Monthly Managed Retainer</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 text-center max-w-4xl mx-auto px-4">
        <h2 className="serif italic text-3xl sm:text-4xl text-white font-normal">
          Ready to Automate Inbound Property Lead Qualification?
        </h2>
        <p className="text-white/50 text-xs mt-3 max-w-xl mx-auto font-light">
          Explore our live real-estate leads, test the AI agent playground, or review our transparent pilot packages starting at $99/month.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {handleLeads && (
            <button
              onClick={handleLeads}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-xs uppercase tracking-widest shadow-xl shadow-blue-600/25 transition-all flex items-center space-x-2 cursor-pointer"
            >
              <Flame className="w-4 h-4 fill-amber-300 text-amber-300" />
              <span>Explore Leads CRM</span>
            </button>
          )}

          {onNavigateToPricing && (
            <button
              onClick={onNavigateToPricing}
              className="px-6 py-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-xs uppercase tracking-widest transition-all flex items-center space-x-2 cursor-pointer"
            >
              <CreditCard className="w-4 h-4 text-emerald-400" />
              <span>View Pilot Pricing</span>
            </button>
          )}
        </div>
      </section>
    </div>
  );
};
