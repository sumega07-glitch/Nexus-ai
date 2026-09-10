import React, { useState } from 'react';
import { 
  Search, 
  Cpu, 
  Layers, 
  Rocket, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  ArrowRight,
  ShieldCheck,
  Calendar,
  Sparkles,
  FileCheck,
  Check
} from 'lucide-react';
import { ClientCompany, GeneratedProposal } from '../../types';

interface RolloutProgressStepperProps {
  client: ClientCompany;
  proposal?: GeneratedProposal;
  onNavigateToMilestones?: () => void;
}

interface RolloutStage {
  id: string;
  stageNumber: number;
  label: string;
  title: string;
  tagline: string;
  icon: React.ComponentType<{ className?: string }>;
  duration: string;
  description: string;
  deliverables: string[];
  acceptanceCriteria: string;
  keyMetric: string;
  architectNote: string;
}

const ROLLOUT_STAGES: RolloutStage[] = [
  {
    id: 'discovery',
    stageNumber: 1,
    label: 'Discovery',
    title: 'Discovery & Intake',
    tagline: 'Workflow audit, bottleneck mapping & knowledge ingestion',
    icon: Search,
    duration: 'Weeks 1-2',
    description: 'Ingestion of standard operating procedures (SOPs), team shadow sessions, and operational friction quantification across manual processes.',
    deliverables: [
      'Comprehensive manual process friction & labor audit',
      'Knowledge base and documentation vector indexing',
      'Baseline labor hours, task volume, and wage calibration',
      'Enterprise data privacy and IT security questionnaire'
    ],
    acceptanceCriteria: 'Stakeholder sign-off on target process inventory and friction mapping.',
    keyMetric: '100% of target SOPs indexed',
    architectNote: 'Discovery identifies high-leverage bottlenecks where automation yields immediate ROI with minimal operational friction.'
  },
  {
    id: 'analysis',
    stageNumber: 2,
    label: 'Analysis',
    title: 'Analysis & Architecture',
    tagline: 'Feasibility modeling, ROI quantification & solution design',
    icon: Cpu,
    duration: 'Weeks 3-4',
    description: 'Deep-dive financial and technical feasibility modeling with Gemini AI, defining agent tooling, prompt strategies, and commercial architecture.',
    deliverables: [
      'Annual cost-of-inaction financial analysis & payback projection',
      'Multi-agent system architecture & tool-calling blueprint',
      'Prompt safety guardrails and human review thresholds',
      'Commercial agreement and 90-day phase delivery roadmap'
    ],
    acceptanceCriteria: 'Mutual execution of Strategy Proposal and technical architecture freeze.',
    keyMetric: 'Projected payback calculated',
    architectNote: 'Architecture guarantees client data remains isolated and models adhere strictly to deterministic business logic.'
  },
  {
    id: 'implementation',
    stageNumber: 3,
    label: 'Implementation',
    title: 'Implementation & Staging',
    tagline: 'Pipeline engineering, tool integration & UAT validation',
    icon: Layers,
    duration: 'Weeks 5-8',
    description: 'Engineers construct API pipelines, deploy custom agents to the isolated staging sandbox, and validate accuracy benchmarks in human-in-the-loop review queues.',
    deliverables: [
      'ERP / CRM bidirectional API connector deployment',
      'Autonomous agent execution engine with tool-calling handlers',
      'Human-in-the-loop exception approval queues & review dashboard',
      'Staging UAT verification with >98% accuracy benchmark sign-off'
    ],
    acceptanceCriteria: 'Completion of 500+ test batch workflows meeting 98%+ accuracy threshold.',
    keyMetric: '98%+ accuracy across test runs',
    architectNote: 'Staging environment mirrors production data while maintaining a strict human oversight barrier before cutover.'
  },
  {
    id: 'live',
    stageNumber: 4,
    label: 'Live',
    title: 'Live Production & SLA',
    tagline: 'Autonomous execution, continuous prompt tuning & 99.9% uptime SLA',
    icon: Rocket,
    duration: 'Continuous Retainer',
    description: 'Full production cutover where autonomous agents handle live operational workloads backed by continuous fine-tuning, latency optimizations, and dedicated enterprise SLAs.',
    deliverables: [
      'Production traffic cutover with real-time audit logging',
      'Continuous prompt calibration & weekly model drift checks',
      'Real-time error anomaly detection & automated failovers',
      'Guaranteed 99.9% uptime SLA and monthly executive ROI reporting'
    ],
    acceptanceCriteria: 'End-to-end autonomous execution with active monthly retainer governance.',
    keyMetric: '99.9% uptime SLA guaranteed',
    architectNote: 'Ongoing retainer operations ensure agents evolve with business software updates and maintain peak accuracy.'
  }
];

export const RolloutProgressStepper: React.FC<RolloutProgressStepperProps> = ({
  client,
  proposal,
  onNavigateToMilestones
}) => {
  // Map ClientCompany status to current stage index (0-3)
  const getCurrentStageIndex = (): number => {
    switch (client.status) {
      case 'DISCOVERY':
        return 0;
      case 'ONBOARDING':
      case 'PROPOSAL_SENT':
        return 1;
      case 'DELIVERY':
        return 2;
      case 'ACTIVE_RETAINER':
      case 'COMPLETED':
      default:
        return 3;
    }
  };

  const currentStageIndex = getCurrentStageIndex();
  const [inspectedStageIndex, setInspectedStageIndex] = useState<number>(currentStageIndex);

  const inspectedStage = ROLLOUT_STAGES[inspectedStageIndex];
  const activeStage = ROLLOUT_STAGES[currentStageIndex];

  // Calculate overall rollout progress percentage
  const calculateProgressPercent = (): number => {
    switch (currentStageIndex) {
      case 0:
        return 25;
      case 1:
        return 50;
      case 2:
        return 75;
      case 3:
      default:
        return 100;
    }
  };

  const progressPercent = calculateProgressPercent();

  return (
    <div className="glass rounded-xl p-6 space-y-6 border border-white/10 relative overflow-hidden">
      {/* Background ambient glow matching current stage */}
      <div 
        className="absolute -top-24 -right-24 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" 
      />

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/5">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-blue-400 font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-blue-400" />
              Automation Rollout Journey
            </span>
            <span className="text-white/20">•</span>
            <span className="text-[10px] font-mono text-white/50">
              Stage {currentStageIndex + 1} of 4
            </span>
          </div>
          <h2 className="text-xl serif font-normal text-white flex items-center gap-2.5">
            <span>Current Stage:</span>
            <span className="text-blue-400 italic">{activeStage.title}</span>
          </h2>
        </div>

        {/* Status Pill & Progress Metric */}
        <div className="flex items-center space-x-4">
          <div className="text-right hidden sm:block">
            <div className="text-[10px] font-mono uppercase tracking-wider text-white/40">
              Rollout Velocity
            </div>
            <div className="text-sm font-mono font-medium text-white flex items-center justify-end gap-1.5">
              <span>{progressPercent}% Complete</span>
              {currentStageIndex === 3 ? (
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              ) : (
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
              )}
            </div>
          </div>

          <div className="px-3.5 py-1.5 rounded-full bg-black/40 border border-white/10 text-xs font-mono flex items-center space-x-2">
            {currentStageIndex === 3 ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span className="text-emerald-400 font-medium whitespace-nowrap">LIVE IN PRODUCTION</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></span>
                <span className="text-blue-300 font-medium whitespace-nowrap">IN PROGRESS • {activeStage.duration}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Visual Stepper Horizontal Bar */}
      <div className="relative pt-2 pb-1">
        {/* Connecting Progress Track Line */}
        <div className="hidden md:block absolute top-[38px] left-[6%] right-[6%] h-[2px] bg-white/10 -z-0">
          {/* Active completed track fill */}
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 via-blue-500 to-blue-400 transition-all duration-700 ease-out"
            style={{ 
              width: `${(currentStageIndex / (ROLLOUT_STAGES.length - 1)) * 100}%` 
            }}
          />
        </div>

        {/* 4 Step Cards / Interactive Nodes */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 relative z-10">
          {ROLLOUT_STAGES.map((stage, idx) => {
            const isCompleted = idx < currentStageIndex;
            const isCurrent = idx === currentStageIndex;
            const isUpcoming = idx > currentStageIndex;
            const isSelected = idx === inspectedStageIndex;
            const Icon = stage.icon;

            return (
              <button
                key={stage.id}
                onClick={() => setInspectedStageIndex(idx)}
                className={`text-left p-4 rounded-xl transition-all duration-200 cursor-pointer relative group border ${
                  isSelected
                    ? 'bg-blue-600/15 border-blue-500/50 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/30'
                    : isCurrent
                    ? 'bg-white/[0.04] border-blue-500/30 hover:border-blue-400/50'
                    : isCompleted
                    ? 'bg-black/40 border-emerald-500/20 hover:border-emerald-500/40'
                    : 'bg-black/30 border-white/5 hover:border-white/15 opacity-70 hover:opacity-90'
                }`}
              >
                {/* Top indicator: Node Icon + Number + Status Badge */}
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                    isCompleted 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                      : isCurrent
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30 ring-2 ring-blue-400/30'
                      : 'bg-white/5 text-white/40 border border-white/10'
                  }`}>
                    {isCompleted ? (
                      <Check className="w-4 h-4 stroke-[2.5]" />
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                  </div>

                  {/* Status Pill */}
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border whitespace-nowrap ${
                    isCompleted
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : isCurrent
                      ? 'bg-blue-500/20 text-blue-300 border-blue-500/30 font-medium'
                      : 'bg-white/5 text-white/30 border-white/5'
                  }`}>
                    {isCompleted ? 'COMPLETED' : isCurrent ? 'CURRENT' : 'UPCOMING'}
                  </span>
                </div>

                {/* Stage Label & Duration */}
                <div className="space-y-1">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[10px] font-mono text-white/40 uppercase">
                      0{stage.stageNumber}
                    </span>
                    <span className="text-white/20">•</span>
                    <span className="text-[10px] font-mono text-white/40">
                      {stage.duration}
                    </span>
                  </div>

                  <h3 className={`text-sm font-semibold tracking-tight transition-colors ${
                    isSelected ? 'text-white' : isCurrent ? 'text-blue-200' : isCompleted ? 'text-white/90' : 'text-white/60'
                  }`}>
                    {stage.title}
                  </h3>

                  <p className="text-[11px] text-white/40 font-light line-clamp-2 leading-relaxed">
                    {stage.tagline}
                  </p>
                </div>

                {/* Active indicator dot */}
                {isSelected && (
                  <div className="absolute bottom-1.5 right-2 flex items-center space-x-1 text-[9px] font-mono text-blue-400">
                    <span>Inspecting</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Inspected Stage Detail Panel */}
      <div className="bg-black/40 border border-white/10 rounded-xl p-5 space-y-4">
        {/* Panel Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              inspectedStageIndex < currentStageIndex 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : inspectedStageIndex === currentStageIndex
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                : 'bg-white/5 text-white/40 border border-white/10'
            }`}>
              <inspectedStage.icon className="w-4 h-4" />
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h4 className="text-base serif text-white">
                  Stage {inspectedStage.stageNumber}: {inspectedStage.title}
                </h4>
                {inspectedStageIndex === currentStageIndex && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    ACTIVE NOW
                  </span>
                )}
              </div>
              <p className="text-xs text-white/50 font-light mt-0.5">
                {inspectedStage.description}
              </p>
            </div>
          </div>

          {/* Quick jump back to current stage if viewing another */}
          {inspectedStageIndex !== currentStageIndex && (
            <button
              onClick={() => setInspectedStageIndex(currentStageIndex)}
              className="text-[11px] font-mono text-blue-400 hover:text-blue-300 flex items-center space-x-1 transition-colors self-start sm:self-auto cursor-pointer"
            >
              <span>Return to Current Stage ({activeStage.label})</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Deliverables Checklist & Governance Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-1">
          {/* Key Deliverables Column */}
          <div className="lg:col-span-2 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-white/70 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <FileCheck className="w-3.5 h-3.5 text-blue-400" />
                Stage Deliverables & Workstream Status
              </span>
              <span className="text-[10px] font-mono text-white/40">
                {inspectedStageIndex < currentStageIndex ? '4 of 4 verified' : inspectedStageIndex === currentStageIndex ? 'In Progress' : 'Pending kickoff'}
              </span>
            </div>

            <div className="space-y-2">
              {inspectedStage.deliverables.map((item, i) => {
                const isItemDone = inspectedStageIndex < currentStageIndex || (inspectedStageIndex === currentStageIndex && i < 2);
                
                return (
                  <div 
                    key={i} 
                    className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 flex items-start space-x-2.5 text-xs"
                  >
                    <div className="mt-0.5">
                      {isItemDone ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0 mt-0.5" />
                      )}
                    </div>
                    <div className="flex-1">
                      <span className={`leading-relaxed font-light ${isItemDone ? 'text-white/90' : 'text-white/50'}`}>
                        {item}
                      </span>
                    </div>
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded shrink-0 ${
                      isItemDone 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-white/5 text-white/30'
                    }`}>
                      {isItemDone ? 'PASSED' : 'IN REVIEW'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Gate Requirements & Architect Note Column */}
          <div className="space-y-3">
            {/* Acceptance Gate Box */}
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
              <span className="text-[10px] font-mono uppercase text-white/40 tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                Milestone Acceptance Gate
              </span>
              <p className="text-xs text-white/80 font-light leading-relaxed">
                {inspectedStage.acceptanceCriteria}
              </p>
              <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-white/40 border-t border-white/5">
                <span>Target KPI:</span>
                <span className="text-emerald-400 font-medium">{inspectedStage.keyMetric}</span>
              </div>
            </div>

            {/* AI Architect Advisory */}
            <div className="p-3.5 rounded-xl bg-blue-950/20 border border-blue-500/10 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-blue-300 font-medium uppercase tracking-wider">
                  Architect Notes
                </span>
                <span className="text-[9px] font-mono text-white/40">
                  {client.assignedArchitect.split(' ')[0]} {client.assignedArchitect.split(' ')[1]}
                </span>
              </div>
              <p className="text-[11px] text-white/60 font-light italic leading-relaxed">
                "{inspectedStage.architectNote}"
              </p>
            </div>

            {/* Action button to jump to full milestone list if available */}
            {onNavigateToMilestones && (
              <button
                onClick={onNavigateToMilestones}
                className="w-full py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 text-xs font-medium border border-white/10 flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
              >
                <span>View Full 90-Day Delivery Plan</span>
                <ChevronRight className="w-3 h-3 text-white/40" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
