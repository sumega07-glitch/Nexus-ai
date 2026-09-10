import React, { useState } from 'react';
import { 
  Check, 
  Sparkles, 
  Building2, 
  ShieldCheck, 
  Zap, 
  MessageSquare, 
  ArrowRight, 
  HelpCircle, 
  PhoneCall, 
  Layers, 
  Clock,
  Coins,
  Bot
} from 'lucide-react';

interface PricingPageProps {
  onSelectPlan?: (planName: string) => void;
  onNavigateToLeads?: () => void;
  onNavigateToStudio?: () => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({
  onSelectPlan,
  onNavigateToLeads,
  onNavigateToStudio
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'pilot'>('monthly');
  const [selectedPlanModal, setSelectedPlanModal] = useState<string | null>(null);

  const plans = [
    {
      id: 'starter',
      name: 'Starter / Pilot',
      badge: 'Single Office Pilot',
      price: billingCycle === 'monthly' ? '$99' : '$490',
      period: billingCycle === 'monthly' ? '/ month' : 'one-time 60-day pilot',
      description: 'Ideal for boutique brokerages and independent real-estate agencies testing autonomous lead qualification.',
      features: [
        '1 Dedicated Real Estate AI Sales Assistant',
        'Website chat widget integration (custom branding)',
        'Up to 500 qualified buyer conversations / month',
        'Automated lead intake (Budget, Location, Timeline)',
        'Instant email & SMS lead notifications',
        'Curated 10-property catalog RAG indexing',
        'Standard business hours knowledge support',
        'Client Leads management dashboard'
      ],
      cta: 'Start Pilot',
      popular: false,
      tierColor: 'border-white/10'
    },
    {
      id: 'growth',
      name: 'Growth',
      badge: 'Most Popular for Brokerages',
      price: billingCycle === 'monthly' ? '$299' : '$1,250',
      period: billingCycle === 'monthly' ? '/ month' : 'quarterly pilot package',
      description: 'Designed for active brokerage firms needing multi-channel WhatsApp and web automation with instant broker handoff.',
      features: [
        'Everything in Starter / Pilot, plus:',
        'Official WhatsApp Business API & Web Widget deployment',
        'Up to 2,500 qualified buyer conversations / month',
        'Dynamic property catalog RAG (up to 150 active listings)',
        'Automated broker assignment & CRM handoff (HubSpot, Salesforce)',
        'Priority human-agent handoff & VIP private viewing scheduler',
        'AI Buyer Qualification Scoring (Hot, Warm, Cold triage)',
        'Weekly pipeline ROI and conversion analytics reports',
        'Full conversation transcripts with grounding citations'
      ],
      cta: 'Deploy Growth Agent',
      popular: true,
      tierColor: 'border-blue-500/70 shadow-2xl shadow-blue-500/10'
    },
    {
      id: 'enterprise',
      name: 'Enterprise / Custom',
      badge: 'Master Developers & Large Portals',
      price: billingCycle === 'monthly' ? '$799+' : 'Custom SLA',
      period: billingCycle === 'monthly' ? '/ month' : 'tailored rollout',
      description: 'For property developers, master brokers, and international real-estate portals managing high inquiry volumes.',
      features: [
        'Multi-agent deployment (Off-Plan, Luxury Resale, Commercial, Leasing)',
        'Custom CRM & ERP integrations (Yardi, Salesforce, PropertyFinder, Bayut)',
        'Unlimited property catalog vector embeddings & floorplan indexing',
        'Multilingual AI Sales models (Arabic, English, Russian, French, Chinese)',
        'Dedicated Solutions Architect & 99.9% uptime SLA guarantee',
        'White-label broker portal with tenant role-based access control (RBAC)',
        'Custom voice agent integration for telephone hotline qualification',
        'Cryptographic audit trail and SOC 2 Type II compliance'
      ],
      cta: 'Request Enterprise Consultation',
      popular: false,
      tierColor: 'border-white/10'
    }
  ];

  const faqs = [
    {
      q: 'How does the NexusAI sales assistant qualify real estate leads?',
      a: 'The AI engages prospects through natural dialogue, inquiring about preferred neighborhoods, property specifications (villas vs. apartments, bedroom count), verified budget range, and expected purchasing timeline. High-intent buyers are automatically scored as HOT and routed to licensed human brokers.'
    },
    {
      q: 'Can the assistant connect with our existing property inventory?',
      a: 'Yes. In the Growth and Enterprise tiers, NexusAI ingests listings via XML feeds, CRM exports, or manual catalog uploads, allowing the agent to provide accurate pricing, amenity details, and availability in real time.'
    },
    {
      q: 'What happens when a buyer asks to speak with a human broker?',
      a: 'The assistant triggers an immediate Human Handoff. It collects the buyer’s verified contact details, creates a complete qualification summary card in the Leads CRM, and dispatches an instant WhatsApp/email alert to the assigned broker.'
    },
    {
      q: 'Is this transparent demo data or live software?',
      a: 'The NexusAI platform features live AI generation powered by Gemini models and simulated multi-tenant agency pipelines. All pricing plans shown are production-ready subscription templates for international real-estate clients.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Top Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-medium text-white/80">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-[11px] uppercase tracking-widest text-zinc-400 font-mono">
            B2B Commercial Architecture
          </span>
          <span className="text-white/20">•</span>
          <span className="text-emerald-400 font-mono text-[11px]">Zero Risk Pilot Model</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
          Transparent AI Pilot & Retainer Plans
        </h1>

        <p className="text-sm sm:text-base text-zinc-400 font-light leading-relaxed">
          Predictable, high-ROI pricing engineered for international real-estate brokerages, off-plan developers, and luxury property agencies.
        </p>

        {/* Billing Cycle Switcher */}
        <div className="pt-3 flex items-center justify-center">
          <div className="bg-zinc-900 p-1 rounded-xl border border-white/10 flex items-center space-x-1 text-xs">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-lg font-medium transition-all cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Monthly Subscription
            </button>
            <button
              onClick={() => setBillingCycle('pilot')}
              className={`px-4 py-2 rounded-lg font-medium transition-all cursor-pointer flex items-center space-x-1.5 ${
                billingCycle === 'pilot'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>Pilot / Setup Package</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">
                Pilot Proof
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {plans.map((plan) => (
          <div
            key={plan.id}
            id={`pricing-card-${plan.id}`}
            className={`rounded-2xl bg-zinc-950/90 border p-8 flex flex-col justify-between relative backdrop-blur-xl transition-all ${plan.tierColor} ${
              plan.popular ? 'ring-1 ring-blue-500/40 lg:-translate-y-2' : 'hover:border-white/20'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-mono uppercase tracking-widest font-bold shadow-md shadow-blue-500/25">
                Recommended For Brokerages
              </div>
            )}

            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                  {plan.badge}
                </span>
                {plan.popular && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                )}
              </div>

              <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
              <p className="text-xs text-zinc-400 font-light mb-6 min-h-[36px]">
                {plan.description}
              </p>

              <div className="flex items-baseline space-x-2 pb-6 border-b border-white/10 mb-6">
                <span className="text-4xl sm:text-5xl font-extrabold text-white font-mono tracking-tight">
                  {plan.price}
                </span>
                <span className="text-xs text-zinc-400 font-mono">{plan.period}</span>
              </div>

              {/* Feature Checklist */}
              <div className="space-y-3 mb-8">
                <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider block mb-2">
                  What&apos;s Included:
                </span>
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start space-x-2.5 text-xs text-zinc-300">
                    <div className="w-4 h-4 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5 text-blue-400 stroke-[3]" />
                    </div>
                    <span className="leading-relaxed">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <button
                id={`btn-plan-${plan.id}`}
                onClick={() => {
                  setSelectedPlanModal(plan.name);
                  onSelectPlan?.(plan.name);
                }}
                className={`w-full py-3 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-lg ${
                  plan.popular
                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/25'
                    : 'bg-white/5 hover:bg-white/10 border border-white/15 text-white'
                }`}
              >
                <span>{plan.cta}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <p className="text-[10px] text-zinc-500 text-center mt-3 font-mono">
                {plan.id === 'starter' && '14-day zero-risk trial available'}
                {plan.id === 'growth' && 'Includes WhatsApp Business onboarding'}
                {plan.id === 'enterprise' && 'Custom SLA with 24/7 dedicated lead engineer'}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Trust & Guarantee Banner */}
      <div className="rounded-2xl bg-zinc-900/50 border border-white/10 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h4 className="text-base font-bold text-white">
              The NexusAI 30-Day Lead Conversion Guarantee
            </h4>
            <p className="text-xs text-zinc-400 mt-1 max-w-xl font-light">
              If the autonomous assistant does not qualify and hand over verified property leads during your initial pilot deployment, our agency extends the staging period free of charge until metrics are achieved.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          {onNavigateToLeads && (
            <button
              onClick={onNavigateToLeads}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-medium transition-colors cursor-pointer"
            >
              Explore Live Leads
            </button>
          )}
          {onNavigateToStudio && (
            <button
              onClick={onNavigateToStudio}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer flex items-center space-x-1.5"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Test AI Agent</span>
            </button>
          )}
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="max-w-4xl mx-auto space-y-6 pt-6">
        <div className="text-center mb-8">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-1">
            Questions & Direct Answers
          </span>
          <h3 className="text-2xl font-bold text-white">Frequently Asked Questions</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {faqs.map((faq, i) => (
            <div key={i} className="p-5 rounded-xl bg-zinc-950 border border-white/10 space-y-2">
              <h5 className="text-sm font-semibold text-white flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>{faq.q}</span>
              </h5>
              <p className="text-xs text-zinc-400 leading-relaxed font-light pl-6">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Plan Selection Confirmation Modal (Demo Flow) */}
      {selectedPlanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-zinc-950 border border-white/15 p-6 shadow-2xl relative space-y-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Sparkles className="w-5 h-5" />
            </div>

            <div>
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">
                Pilot Reservation Initialized
              </span>
              <h3 className="text-xl font-bold text-white mt-0.5">
                {selectedPlanModal} Plan Selected
              </h3>
              <p className="text-xs text-zinc-400 mt-2 font-light leading-relaxed">
                Your pilot deployment agreement for <strong>Nexus Estates Dubai</strong> has been prepared. In production, this provisions your dedicated WhatsApp number, Gemini RAG pipeline, and broker notification webhooks.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-900 border border-white/10 space-y-1.5 text-xs text-zinc-300">
              <div className="flex justify-between">
                <span className="text-zinc-500">Selected Package:</span>
                <span className="font-semibold text-white">{selectedPlanModal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Billing Cycle:</span>
                <span className="font-mono text-white capitalize">{billingCycle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Staging Onboarding:</span>
                <span className="text-emerald-400 font-semibold">Immediate Sandbox</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end space-x-2">
              <button
                onClick={() => setSelectedPlanModal(null)}
                className="px-4 py-2 rounded-lg text-xs text-zinc-400 hover:text-white cursor-pointer"
              >
                Close
              </button>
              {onNavigateToStudio && (
                <button
                  onClick={() => {
                    setSelectedPlanModal(null);
                    onNavigateToStudio();
                  }}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold uppercase tracking-wider cursor-pointer flex items-center space-x-1.5"
                >
                  <span>Launch Agent Sandbox</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
