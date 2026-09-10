import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  Plus, 
  Trash2, 
  Sparkles, 
  Layers, 
  Building2, 
  Workflow, 
  AlertTriangle, 
  Cpu, 
  Check, 
  RotateCcw,
  Bot
} from 'lucide-react';
import { ClientCompany } from '../../types';

type Step = 'profile' | 'workflows' | 'pains' | 'readiness' | 'complete';

interface WorkflowItem {
  name: string;
  tools: string;
  volume: string;
}

interface OnboardingDiscoveryProps {
  currentClient: ClientCompany;
  onUpdateClient: (updated: Partial<ClientCompany>) => void;
  onRunAiAnalysis: (discoveryPayload: any) => void;
  isAnalyzing: boolean;
}

export const OnboardingDiscovery: React.FC<OnboardingDiscoveryProps> = ({
  currentClient,
  onUpdateClient,
  onRunAiAnalysis,
  isAnalyzing
}) => {
  const [step, setStep] = useState<Step>('profile');

  const [formData, setFormData] = useState({
    companyName: currentClient.name || 'Nexus Estates Dubai',
    industry: currentClient.industry || 'Real Estate & Property Development',
    employees: currentClient.teamSize || '120',
    revenue: currentClient.annualRevenue || '$25M-$50M',
    contactName: currentClient.contactName || 'Jane Doe',
    contactEmail: currentClient.contactEmail || 'jane@nexusestates.ae',
    hourlyWageAvg: currentClient.hourlyWageAvg || 68,
    workflows: [
      { name: 'Supplier Invoice & Delivery Note OCR', tools: 'SAP ERP, Gmail, Adobe PDF', volume: '150 invoices/week' },
      { name: 'Customer Order Status & ETA Triage', tools: 'Zendesk, Slack, Excel', volume: '400 inquiries/month' },
      { name: 'Purchase Order Discrepancy Matching', tools: 'QuickBooks Enterprise, Outlook', volume: '30 hours/month' }
    ] as WorkflowItem[],
    bottlenecks: currentClient.manualProcesses || 'Operations team spends 20+ hours per week matching vendor delivery notes against ERP purchase orders and responding to repetitive status emails.',
    supportVolume: '100 tickets/day',
    leadVolume: '500 leads/mo',
    currentAiUsage: 'ChatGPT for writing email drafts and translation',
    softwareStack: (currentClient.techStack && currentClient.techStack.join(', ')) || 'Salesforce, Slack, SAP ERP, QuickBooks, Zendesk',
  });

  const [workflow, setWorkflow] = useState<WorkflowItem>({ name: '', tools: '', volume: '' });

  // Sync with currentClient prop changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      companyName: currentClient.name || prev.companyName,
      industry: currentClient.industry || prev.industry,
      revenue: currentClient.annualRevenue || prev.revenue,
      contactName: currentClient.contactName || prev.contactName,
      contactEmail: currentClient.contactEmail || prev.contactEmail,
      bottlenecks: currentClient.manualProcesses || prev.bottlenecks,
      softwareStack: currentClient.techStack ? currentClient.techStack.join(', ') : prev.softwareStack
    }));
  }, [currentClient.id]);

  const stepOrder: Step[] = ['profile', 'workflows', 'pains', 'readiness', 'complete'];
  const stepIndex = stepOrder.indexOf(step);
  const progressPercent = ((stepIndex + 1) / stepOrder.length) * 100;

  const nextStep = () => {
    if (step === 'profile') setStep('workflows');
    else if (step === 'workflows') setStep('pains');
    else if (step === 'pains') setStep('readiness');
    else if (step === 'readiness') setStep('complete');
  };

  const prevStep = () => {
    if (step === 'workflows') setStep('profile');
    else if (step === 'pains') setStep('workflows');
    else if (step === 'readiness') setStep('pains');
  };

  const addWorkflow = () => {
    if (workflow.name.trim()) {
      setFormData({
        ...formData,
        workflows: [
          ...formData.workflows,
          {
            name: workflow.name.trim(),
            tools: workflow.tools.trim() || 'Internal System',
            volume: workflow.volume.trim() || 'Daily'
          }
        ]
      });
      setWorkflow({ name: '', tools: '', volume: '' });
    }
  };

  const handleApplyPreset = (preset: {
    companyName: string;
    industry: string;
    employees: string;
    revenue: string;
    contactName: string;
    contactEmail: string;
    hourlyWageAvg: number;
    workflows: WorkflowItem[];
    bottlenecks: string;
    supportVolume: string;
    leadVolume: string;
    currentAiUsage: string;
    softwareStack: string;
  }) => {
    setFormData(preset);
  };

  const handleExecuteAiAnalysis = () => {
    const payload = {
      companyName: formData.companyName,
      industry: formData.industry,
      teamSize: formData.employees,
      annualRevenue: formData.revenue,
      hourlyWageAvg: formData.hourlyWageAvg,
      primaryBottlenecks: formData.workflows.map(w => w.name).concat([formData.bottlenecks]),
      currentTools: formData.softwareStack.split(',').map(s => s.trim()),
      manualProcesses: `${formData.bottlenecks} (Workflows: ${formData.workflows.map(w => `${w.name} using ${w.tools} [${w.volume}]`).join('; ')})`
    };

    onUpdateClient({
      name: formData.companyName,
      industry: formData.industry,
      annualRevenue: formData.revenue,
      contactName: formData.contactName,
      contactEmail: formData.contactEmail,
      hourlyWageAvg: formData.hourlyWageAvg,
      techStack: formData.softwareStack.split(',').map(s => s.trim()),
      manualProcesses: formData.bottlenecks
    });

    onRunAiAnalysis(payload);
  };

  const commonTools = ['Salesforce', 'Slack', 'SAP ERP', 'QuickBooks', 'HubSpot', 'Zendesk', 'Jira', 'Google Workspace', 'PostgreSQL'];

  const addToolToStack = (toolName: string) => {
    const tools = formData.softwareStack.split(',').map(t => t.trim()).filter(Boolean);
    if (!tools.includes(toolName)) {
      setFormData({ ...formData, softwareStack: [...tools, toolName].join(', ') });
    }
  };

  return (
    <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8 flex items-center justify-center animate-in fade-in duration-300">
      <div className="max-w-3xl w-full bg-zinc-950 rounded-3xl shadow-2xl border border-zinc-800 overflow-hidden">
        
        {/* Progress Bar */}
        <div className="h-2 bg-zinc-900 w-full relative">
          <div
            className="h-full bg-indigo-600 transition-all duration-500 shadow-sm shadow-indigo-500/50"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Top Step Navigation Pills */}
        <div className="px-8 pt-6 pb-2 border-b border-zinc-800/60 flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-x-auto text-xs font-semibold">
            {[
              { id: 'profile', label: '1. Profile', icon: Building2 },
              { id: 'workflows', label: '2. Workflows', icon: Workflow },
              { id: 'pains', label: '3. Bottlenecks', icon: AlertTriangle },
              { id: 'readiness', label: '4. AI Readiness', icon: Cpu },
              { id: 'complete', label: '5. Complete', icon: CheckCircle }
            ].map((s) => {
              const Icon = s.icon;
              const isCurrent = step === s.id;
              const isPassed = stepOrder.indexOf(s.id as Step) < stepIndex;

              return (
                <button
                  key={s.id}
                  onClick={() => setStep(s.id as Step)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-indigo-600 text-white font-bold'
                      : isPassed
                      ? 'text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{s.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Preset Selector */}
          <div className="hidden sm:flex items-center gap-1 text-[11px] text-zinc-400">
            <span className="text-zinc-500">Preset:</span>
            <button
              onClick={() => handleApplyPreset({
                companyName: 'Nexus Estates Dubai',
                industry: 'Real Estate & Property Development',
                employees: '120',
                revenue: '$25M-$50M',
                contactName: 'Jane Doe',
                contactEmail: 'jane@nexusestates.ae',
                hourlyWageAvg: 75,
                workflows: [
                  { name: 'Inbound Buyer Inquiry & Lead Triage', tools: 'HubSpot CRM, WhatsApp Business, Gmail', volume: '220/week' },
                  { name: 'Property Viewing & Broker Dispatch', tools: 'Google Calendar, Slack, Salesforce', volume: '140/month' }
                ],
                bottlenecks: 'Sales operations spends 25+ hours per week manually fielding repeated property availability inquiries and manually qualifying buyer budgets before routing to brokers.',
                supportVolume: '95 inquiries/day',
                leadVolume: '450 leads/mo',
                currentAiUsage: 'Basic chatbot with no inventory RAG integration',
                softwareStack: 'HubSpot, Salesforce, WhatsApp, Gmail, Slack'
              })}
              className="px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors"
            >
              Nexus Estates
            </button>
            <button
              onClick={() => handleApplyPreset({
                companyName: 'Global Logistics',
                industry: 'Transport',
                employees: '350',
                revenue: '$50M-$100M',
                contactName: 'Bob Martinez',
                contactEmail: 'bob@global.com',
                hourlyWageAvg: 62,
                workflows: [
                  { name: 'Driver Bill of Lading Indexing', tools: 'McLeod LoadMaster, Paper Scans', volume: '500/day' },
                  { name: 'Carrier Check-Call Updates', tools: 'Phone Calls, Excel', volume: '250/day' }
                ],
                bottlenecks: 'Dispatchers manually log 300+ carrier check calls daily and re-type driver fuel receipts from photos into software.',
                supportVolume: '350 calls/day',
                leadVolume: '120 quotes/mo',
                currentAiUsage: 'None currently',
                softwareStack: 'McLeod LoadMaster, Samsara, Slack, Google Workspace'
              })}
              className="px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors"
            >
              Logistics
            </button>
          </div>
        </div>

        <div className="p-8 md:p-12">
          {/* STEP 1: PROFILE */}
          {step === 'profile' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white tracking-tight">Welcome to your AI Discovery</h1>
                <p className="text-zinc-400 mt-2 text-sm">Let's start with the basics of your business.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-zinc-300">Company Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Nexus Estates Dubai"
                    className="w-full px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-900 text-white placeholder-zinc-500 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-zinc-300">Industry</label>
                  <input
                    type="text"
                    placeholder="e.g. Real Estate, Logistics, Manufacturing"
                    className="w-full px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-900 text-white placeholder-zinc-500 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-zinc-300">Employee Count</label>
                  <input
                    type="text"
                    placeholder="e.g. 50"
                    className="w-full px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-900 text-white placeholder-zinc-500 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                    value={formData.employees}
                    onChange={(e) => setFormData({ ...formData, employees: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-zinc-300">Annual Revenue Range</label>
                  <select
                    className="w-full px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-900 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                    value={formData.revenue}
                    onChange={(e) => setFormData({ ...formData, revenue: e.target.value })}
                  >
                    <option value="">Select a range</option>
                    <option value="$1M-$10M">$1M - $10M</option>
                    <option value="$10M-$50M">$10M - $50M</option>
                    <option value="$50M-$100M">$50M - $100M</option>
                    <option value="$100M+">$100M+</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-zinc-300">Contact Person</label>
                  <input
                    type="text"
                    placeholder="e.g. Jane Doe"
                    className="w-full px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-900 text-white placeholder-zinc-500 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-zinc-300">Contact Email</label>
                  <input
                    type="email"
                    placeholder="e.g. jane@acme.com"
                    className="w-full px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-900 text-white placeholder-zinc-500 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm font-mono"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: WORKFLOWS */}
          {step === 'workflows' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white tracking-tight">Map Your Workflows</h1>
                <p className="text-zinc-400 mt-2 text-sm">Which processes take up most of your team's time?</p>
              </div>

              {/* Add Workflow Box */}
              <div className="bg-zinc-900/80 p-6 rounded-2xl border border-zinc-800 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase text-zinc-400">Process Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Lead Qualification"
                      className="w-full px-3 py-2.5 rounded-lg border border-zinc-800 bg-zinc-950 text-white text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={workflow.name}
                      onChange={(e) => setWorkflow({ ...workflow, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase text-zinc-400">Current Tools</label>
                    <input
                      type="text"
                      placeholder="e.g. Gmail, Excel, SAP"
                      className="w-full px-3 py-2.5 rounded-lg border border-zinc-800 bg-zinc-950 text-white text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={workflow.tools}
                      onChange={(e) => setWorkflow({ ...workflow, tools: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase text-zinc-400">Volume / Frequency</label>
                    <input
                      type="text"
                      placeholder="e.g. 20/day"
                      className="w-full px-3 py-2.5 rounded-lg border border-zinc-800 bg-zinc-950 text-white text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={workflow.volume}
                      onChange={(e) => setWorkflow({ ...workflow, volume: e.target.value })}
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={addWorkflow}
                  className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Process to List
                </button>
              </div>

              {/* Workflow Items List */}
              <div className="space-y-3">
                {formData.workflows.map((wf, i) => (
                  <div key={i} className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 shadow-sm hover:border-zinc-700 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-xs">
                        {i + 1}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{wf.name}</p>
                        <p className="text-xs text-zinc-400">{wf.tools} • {wf.volume}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, workflows: formData.workflows.filter((_, idx) => idx !== i) })}
                      className="text-zinc-500 hover:text-red-400 p-1 rounded-lg transition-colors cursor-pointer"
                      title="Remove Process"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {formData.workflows.length === 0 && (
                  <div className="text-center py-8 border border-dashed border-zinc-800 rounded-xl text-zinc-500 text-xs">
                    No workflows added yet. Add a process above to map your repetitive tasks.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: PAINS / BOTTLENECKS */}
          {step === 'pains' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white tracking-tight">Identify Bottlenecks</h1>
                <p className="text-zinc-400 mt-2 text-sm">What is slowing you down the most?</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-zinc-300">
                    What is your biggest operational bottleneck?
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Describe the process that causes the most frustration, error rates, or manual employee hours..."
                    className="w-full px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-900 text-white placeholder-zinc-500 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm leading-relaxed"
                    value={formData.bottlenecks}
                    onChange={(e) => setFormData({ ...formData, bottlenecks: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-zinc-300">Daily Support Volume</label>
                    <input
                      type="text"
                      placeholder="e.g. 100 tickets/day"
                      className="w-full px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-900 text-white placeholder-zinc-500 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                      value={formData.supportVolume}
                      onChange={(e) => setFormData({ ...formData, supportVolume: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-zinc-300">Monthly Lead Volume</label>
                    <input
                      type="text"
                      placeholder="e.g. 500 leads/mo"
                      className="w-full px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-900 text-white placeholder-zinc-500 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                      value={formData.leadVolume}
                      onChange={(e) => setFormData({ ...formData, leadVolume: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: AI READINESS */}
          {step === 'readiness' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white tracking-tight">AI Readiness</h1>
                <p className="text-zinc-400 mt-2 text-sm">How are you currently using AI in your business?</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-zinc-300">Current AI Tooling</label>
                  <input
                    type="text"
                    placeholder="e.g. ChatGPT for emails, Midjourney for ads, None yet"
                    className="w-full px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-900 text-white placeholder-zinc-500 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                    value={formData.currentAiUsage}
                    onChange={(e) => setFormData({ ...formData, currentAiUsage: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-zinc-300">Existing Software Stack</label>
                    <span className="text-[11px] text-zinc-500">Click chips to quickly add</span>
                  </div>

                  {/* Software Chips */}
                  <div className="flex flex-wrap gap-1.5 pb-2">
                    {commonTools.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => addToolToStack(t)}
                        className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-indigo-600/30 hover:border-indigo-500/50 border border-zinc-800 text-[11px] text-zinc-400 hover:text-indigo-300 transition-colors cursor-pointer"
                      >
                        + {t}
                      </button>
                    ))}
                  </div>

                  <textarea
                    rows={3}
                    placeholder="e.g. Salesforce, Slack, QuickBooks, HubSpot, SAP ERP"
                    className="w-full px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-900 text-white placeholder-zinc-500 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm leading-relaxed"
                    value={formData.softwareStack}
                    onChange={(e) => setFormData({ ...formData, softwareStack: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: COMPLETE */}
          {step === 'complete' && (
            <div className="text-center space-y-6 animate-in zoom-in-95">
              <div className="flex justify-center">
                <div className="bg-emerald-500/15 border border-emerald-500/30 p-4 rounded-full text-emerald-400">
                  <CheckCircle className="w-12 h-12" />
                </div>
              </div>

              <h1 className="text-3xl font-bold text-white tracking-tight">Discovery Complete!</h1>
              <p className="text-zinc-400 max-w-md mx-auto text-sm leading-relaxed">
                We've collected all the necessary operational data for <strong className="text-white">{formData.companyName}</strong>. Our AI engineers are now analyzing your processes to find the highest ROI automation opportunities.
              </p>

              {/* Summary Card */}
              <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-2xl max-w-lg mx-auto text-left text-xs space-y-2">
                <div className="flex justify-between pb-2 border-b border-zinc-800">
                  <span className="text-zinc-400">Industry & Revenue:</span>
                  <span className="font-bold text-white">{formData.industry} • {formData.revenue}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-zinc-800">
                  <span className="text-zinc-400">Mapped Workflows:</span>
                  <span className="font-bold text-indigo-400">{formData.workflows.length} processes registered</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Primary Software:</span>
                  <span className="font-bold text-white truncate max-w-[200px]">{formData.softwareStack}</span>
                </div>
              </div>

              <div className="py-4">
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-sm font-medium">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                  </span>
                  AI Analysis in Progress...
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  disabled={isAnalyzing}
                  onClick={handleExecuteAiAnalysis}
                  className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-indigo-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isAnalyzing ? 'Running Gemini Analysis...' : 'Run Live AI Opportunity Matrix'}</span>
                </button>
              </div>
            </div>
          )}

          {/* FOOTER CONTROLS */}
          {step !== 'complete' && (
            <div className="mt-12 flex items-center justify-between pt-8 border-t border-zinc-800/80">
              <button
                type="button"
                onClick={prevStep}
                disabled={step === 'profile'}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all ${
                  step === 'profile'
                    ? 'text-zinc-600 cursor-not-allowed'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900 cursor-pointer'
                }`}
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-indigo-500 transition-all active:scale-95 shadow-lg shadow-indigo-500/20 cursor-pointer"
              >
                {step === 'readiness' ? 'Submit Discovery' : 'Continue'} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
