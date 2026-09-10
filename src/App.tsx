import React, { useState } from 'react';
import { Navbar } from './components/layout/Navbar';
import { LandingPage } from './components/landing/LandingPage';
import { AgencyDashboard } from './components/dashboard/AgencyDashboard';
import { ClientCrm } from './components/crm/ClientCrm';
import { OnboardingDiscovery } from './components/onboarding/OnboardingDiscovery';
import { ProcessAnalyzer } from './components/analyzer/ProcessAnalyzer';
import { RoiCalculator } from './components/roi/RoiCalculator';
import { ProposalBuilder } from './components/proposal/ProposalBuilder';
import { AgentStudio } from './components/studio/AgentStudio';
import { TalkingAgent } from './components/talking/TalkingAgent';
import { ClientPortal } from './components/portal/ClientPortal';
import { LeadsManager } from './components/leads/LeadsManager';
import { PricingPage } from './components/pricing/PricingPage';
import { MultiTenantSchema } from './components/schema/MultiTenantSchema';
import { ConversationsManager } from './components/conversations/ConversationsManager';
import { KnowledgeBaseManager } from './components/knowledge/KnowledgeBaseManager';
import { AgencyAdminView } from './components/admin/AgencyAdminView';
import { ClerkProvider, SignInPage, SignUpPage, useUser, useAuth } from './components/auth/ClerkAuth';
import { ErrorBoundary } from './components/common/ErrorBoundary';

import { 
  MOCK_AGENCY, 
  MOCK_CLIENTS, 
  MOCK_OPPORTUNITIES, 
  MOCK_PROPOSALS, 
  MOCK_BOT_CONFIGS, 
  MOCK_KNOWLEDGE_DOCS, 
  MOCK_AUDIT_LOGS,
  INITIAL_LEADS,
  DEMO_CONVERSATIONS
} from './data/mockData';
import { 
  AgencyTenant, 
  ClientCompany, 
  AutomationOpportunity, 
  GeneratedProposal, 
  BotConfig, 
  KnowledgeDocument, 
  ActivityAuditLog,
  ProcessAnalysisResult,
  QualifiedLead
} from './types';

function AppContent() {
  const { user } = useUser();
  const { switchRole } = useAuth();

  // Navigation & Multi-Tenant Context State
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [currentRole, setCurrentRole] = useState<'AGENCY_ADMIN' | 'CLIENT_EXEC'>(user?.role || 'AGENCY_ADMIN');
  const [selectedClientId, setSelectedClientId] = useState<string>('client_acme');

  // Keep currentRole in sync with Clerk user role changes
  React.useEffect(() => {
    if (user?.role && user.role !== currentRole) {
      setCurrentRole(user.role);
    }
  }, [user?.role]);

  // Application Data States
  const [agency, setAgency] = useState<AgencyTenant>(MOCK_AGENCY);
  const [clients, setClients] = useState<ClientCompany[]>(MOCK_CLIENTS);
  const [opportunities, setOpportunities] = useState<AutomationOpportunity[]>(MOCK_OPPORTUNITIES);
  const [proposals, setProposals] = useState<GeneratedProposal[]>(MOCK_PROPOSALS);
  const [botConfigs, setBotConfigs] = useState<BotConfig[]>(MOCK_BOT_CONFIGS);
  const [knowledgeDocs, setKnowledgeDocs] = useState<KnowledgeDocument[]>(MOCK_KNOWLEDGE_DOCS);
  const [auditLogs, setAuditLogs] = useState<ActivityAuditLog[]>(MOCK_AUDIT_LOGS);
  const [leads, setLeads] = useState<QualifiedLead[]>(INITIAL_LEADS);

  // AI Loading & Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingProposal, setIsGeneratingProposal] = useState(false);
  const [latestAnalysisResult, setLatestAnalysisResult] = useState<ProcessAnalysisResult | null>({
    executiveSummary: `${clients[0]?.name || 'Nexus Estates Dubai'} currently has an estimated $280,000 in annual recurring labor inefficiencies primarily driven by manual inbound property inquiries, repetitive buyer qualification calls, and unverified scheduling conflicts. Implementing our recommended real estate AI sales assistant and multi-channel lead orchestration pipeline will reclaim ~75 hours per week of broker capacity with an estimated potential impact of +380% ROI.`,
    totalEstimatedAnnualSavings: 280000,
    totalHoursSavedPerWeek: 75,
    projectedRoiPercentage: 380,
    averagePaybackMonths: 1.4,
    riskLevel: 'LOW',
    opportunities: MOCK_OPPORTUNITIES,
    prioritizedOpportunities: MOCK_OPPORTUNITIES
  });

  // Current Active Client & Dependent Objects
  const currentClient = (clients && clients.length > 0)
    ? (clients.find(c => c.id === selectedClientId) || clients[0])
    : MOCK_CLIENTS[0];
  const currentProposal = (proposals && proposals.length > 0)
    ? (proposals.find(p => p.clientId === currentClient?.id) || proposals[0])
    : MOCK_PROPOSALS[0];
  const currentBotConfig = (botConfigs && botConfigs.length > 0)
    ? (botConfigs.find(b => b.clientId === currentClient?.id) || botConfigs[0])
    : MOCK_BOT_CONFIGS[0];
  const currentKnowledgeDocs = (knowledgeDocs || []).filter(d => d.clientId === currentClient?.id);

  // Handler: Add New Client
  const handleAddClient = (newClient: ClientCompany) => {
    setClients(prev => [newClient, ...prev]);
    setSelectedClientId(newClient.id);
    
    // Add audit log
    const log: ActivityAuditLog = {
      id: `log_${Date.now()}`,
      agencyId: agency.id,
      clientId: newClient.id,
      clientName: newClient.name,
      action: 'New Client Tenant Registered',
      actor: 'Alex Vance (Lead AI Architect)',
      timestamp: 'Just now',
      severity: 'SUCCESS',
      details: `Created isolated client tenant with loaded hourly wage baseline of $${newClient.hourlyWageAvg}/hr.`
    };
    setAuditLogs(prev => [log, ...prev]);
  };

  // Handler: Update Client Status
  const handleUpdateClientStatus = (clientId: string, newStatus: ClientCompany['status']) => {
    setClients(prev => prev.map(c => c.id === clientId ? { ...c, status: newStatus } : c));
  };

  // Handler: Update Client Profile
  const handleUpdateClient = (updatedFields: Partial<ClientCompany>) => {
    setClients(prev => prev.map(c => c.id === currentClient.id ? { ...c, ...updatedFields } : c));
  };

  // Handler: Toggle Opportunity Selection for Proposal
  const handleToggleOpportunity = (oppId: string) => {
    setOpportunities(prev => prev.map(o => o.id === oppId ? { ...o, selectedForProposal: !o.selectedForProposal } : o));
  };

  // Handler: Run AI Process Analysis (Live Server Integration)
  const handleRunAiAnalysis = async (discoveryPayload: any) => {
    setIsAnalyzing(true);
    setActiveTab('analyzer');

    try {
      const response = await fetch('/api/analyze-process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(discoveryPayload)
      });

      const data = await response.json();
      const analysisObj = data.analysis || data;
      const opps = analysisObj.opportunities || data.opportunities;

      if (opps && opps.length > 0) {
        setOpportunities(opps.map((o: any) => ({
          ...o,
          selectedForProposal: true
        })));

        setLatestAnalysisResult({
          executiveSummary: analysisObj.executiveSummary || latestAnalysisResult?.executiveSummary || '',
          totalEstimatedAnnualSavings: analysisObj.totalEstimatedAnnualSavings || 280000,
          totalHoursSavedPerWeek: analysisObj.totalHoursSavedPerWeek || 75,
          projectedRoiPercentage: analysisObj.projectedRoiPercentage || 380,
          averagePaybackMonths: analysisObj.averagePaybackMonths || 1.4,
          riskLevel: analysisObj.riskLevel || 'LOW',
          opportunities: opps,
          prioritizedOpportunities: opps
        });

        // Audit Log
        const log: ActivityAuditLog = {
          id: `log_${Date.now()}`,
          agencyId: agency.id,
          clientId: currentClient.id,
          clientName: currentClient.name,
          action: 'AI Process Analysis Completed',
          actor: 'Gemini Flash Engine',
          timestamp: 'Just now',
          severity: 'SUCCESS',
          details: `Identified ${opps.length} high-leverage workflows with estimated savings of $${(analysisObj.totalEstimatedAnnualSavings || 280000).toLocaleString()}/yr.`
        };
        setAuditLogs(prev => [log, ...prev]);
      }
    } catch (err) {
      console.error('Analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handler: Re-generate Proposal with AI
  const handleReGenerateProposal = async () => {
    setIsGeneratingProposal(true);
    try {
      const selectedOpps = opportunities.filter(o => o.selectedForProposal);
      const response = await fetch('/api/generate-proposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client: currentClient,
          opportunities: selectedOpps
        })
      });

      const data = await response.json();
      if (data.proposal) {
        const updated: GeneratedProposal = {
          ...currentProposal,
          title: data.proposal.title || currentProposal.title,
          executiveSummary: data.proposal.executiveSummary || currentProposal.executiveSummary,
          scopeOfWork: data.proposal.scopeOfWork || currentProposal.scopeOfWork,
          deliverables: data.proposal.deliverables || currentProposal.deliverables,
          commercialTerms: {
            ...currentProposal.commercialTerms,
            setupInvestment: data.proposal.commercialTerms?.setupInvestment || currentProposal.commercialTerms.setupInvestment,
            monthlyRetainer: data.proposal.commercialTerms?.monthlyRetainer || currentProposal.commercialTerms.monthlyRetainer
          }
        };

        setProposals(prev => prev.map(p => p.id === currentProposal.id ? updated : p));
      }
    } catch (err) {
      console.error('Proposal generation error:', err);
    } finally {
      setIsGeneratingProposal(false);
    }
  };

  // Handler: Update Proposal
  const handleUpdateProposal = (updated: GeneratedProposal) => {
    setProposals(prev => prev.map(p => p.id === updated.id ? updated : p));
    if (updated.status === 'ACCEPTED') {
      // Also update client retainer
      setClients(prev => prev.map(c => c.id === currentClient.id ? { 
        ...c, 
        status: 'ACTIVE_RETAINER',
        currentMonthlyRetainer: updated.commercialTerms.monthlyRetainer 
      } : c));

      // Add audit log
      const log: ActivityAuditLog = {
        id: `log_${Date.now()}`,
        agencyId: agency.id,
        clientId: currentClient.id,
        clientName: currentClient.name,
        action: 'Strategy Agreement Digitally Executed',
        actor: updated.signedBy || 'Client Executive',
        timestamp: 'Just now',
        severity: 'SUCCESS',
        details: `Contract accepted: $${updated.commercialTerms.setupInvestment.toLocaleString()} Setup + $${updated.commercialTerms.monthlyRetainer.toLocaleString()}/mo Retainer.`
      };
      setAuditLogs(prev => [log, ...prev]);
    }
  };

  // Handler: Update Bot Config
  const handleUpdateBotConfig = (updated: BotConfig) => {
    setBotConfigs(prev => prev.map(b => b.id === updated.id ? updated : b));
  };

  // Handler: Add Knowledge Document
  const handleAddKnowledgeDoc = (doc: KnowledgeDocument) => {
    setKnowledgeDocs(prev => [doc, ...prev]);
    const log: ActivityAuditLog = {
      id: `log_${Date.now()}`,
      agencyId: agency.id,
      clientId: currentClient.id,
      clientName: currentClient.name,
      action: 'Knowledge Document Vectorized',
      actor: 'Alex Vance (Lead AI Architect)',
      timestamp: 'Just now',
      severity: 'INFO',
      details: `Indexed "${doc.title}" into pgvector (${doc.chunkCount} chunks).`
    };
    setAuditLogs(prev => [log, ...prev]);
  };

  // Handler: Delete Knowledge Document
  const handleDeleteKnowledgeDoc = (docId: string) => {
    setKnowledgeDocs(prev => prev.filter(d => d.id !== docId));
  };

  // Handler: Update Qualified Lead Status
  const handleUpdateLeadStatus = (leadId: string, newStatus: QualifiedLead['status']) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
    const targetLead = leads.find(l => l.id === leadId);
    const log: ActivityAuditLog = {
      id: `log_${Date.now()}`,
      agencyId: agency.id,
      clientId: selectedClientId,
      clientName: currentClient.name,
      action: `Lead Handover: ${targetLead?.name || 'Lead'} -> ${newStatus}`,
      actor: 'Tariq Al-Mansoor (Senior Luxury Broker)',
      timestamp: 'Just now',
      severity: 'SUCCESS',
      details: `Dispatched broker engagement for ${targetLead?.name || 'lead'} (${targetLead?.preferredLocation || 'Dubai'} ${targetLead?.propertyType || 'Property'}).`
    };
    setAuditLogs(prev => [log, ...prev]);
  };

  // Handler: Lead Captured Event
  const handleLeadCaptured = (newLead: QualifiedLead) => {
    setLeads(prev => [newLead, ...prev]);
    const log: ActivityAuditLog = {
      id: `log_${Date.now()}`,
      agencyId: agency.id,
      clientId: selectedClientId,
      clientName: currentClient.name,
      action: `AI Lead Qualified & Captured: ${newLead.name}`,
      actor: 'NexusAI Autonomous Sales Assistant',
      timestamp: 'Just now',
      severity: 'SUCCESS',
      details: `Autonomous qualification completed for ${newLead.name} (${newLead.phone}) - ${newLead.preferredLocation} with budget ${newLead.budget}.`
    };
    setAuditLogs(prev => [log, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Top Main Navigation */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        currentRole={currentRole}
        onToggleRole={() => setCurrentRole(prev => prev === 'AGENCY_ADMIN' ? 'CLIENT_EXEC' : 'AGENCY_ADMIN')}
        clients={clients}
        selectedClientId={selectedClientId}
        onSelectClient={setSelectedClientId}
      />

      {/* Main Dynamic Viewport */}
      <main className="flex-1">
        {activeTab === 'landing' && (
          <LandingPage
            onExploreApp={() => setActiveTab('dashboard')}
            onOpenDiscovery={() => setActiveTab('onboarding')}
            onViewLeads={() => setActiveTab('leads')}
            onViewConversations={() => setActiveTab('conversations')}
          />
        )}

        {activeTab === 'dashboard' && (
          <AgencyDashboard
            agency={agency}
            clients={clients}
            opportunities={opportunities}
            proposals={proposals}
            botConfigs={botConfigs}
            auditLogs={auditLogs}
            leads={leads}
            onSelectClient={(clientId) => {
              setSelectedClientId(clientId);
              setActiveTab('leads');
            }}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'crm' && (
          <ClientCrm
            clients={clients}
            selectedClientId={selectedClientId}
            onSelectClient={setSelectedClientId}
            onAddClient={handleAddClient}
            onUpdateClientStatus={handleUpdateClientStatus}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'leads' && (
          <LeadsManager
            leads={leads}
            onUpdateLeadStatus={handleUpdateLeadStatus}
            onNavigateToStudio={() => setActiveTab('agent-studio')}
          />
        )}

        {activeTab === 'conversations' && (
          <ConversationsManager
            conversations={DEMO_CONVERSATIONS}
            leads={leads}
            onViewLead={(_leadId) => {
              setActiveTab('leads');
            }}
            onNavigateToStudio={() => setActiveTab('agent-studio')}
            onNavigateToLeads={() => setActiveTab('leads')}
          />
        )}

        {activeTab === 'knowledge' && (
          <KnowledgeBaseManager
            knowledgeDocs={currentKnowledgeDocs}
            onAddDoc={handleAddKnowledgeDoc}
            onDeleteDoc={handleDeleteKnowledgeDoc}
          />
        )}

        {activeTab === 'agency-admin' && (
          <AgencyAdminView
            agency={agency}
            clients={clients}
            onSelectClient={(clientId) => {
              setSelectedClientId(clientId);
              setActiveTab('leads');
            }}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'onboarding' && (
          <OnboardingDiscovery
            currentClient={currentClient}
            onUpdateClient={handleUpdateClient}
            onRunAiAnalysis={handleRunAiAnalysis}
            isAnalyzing={isAnalyzing}
          />
        )}

        {activeTab === 'analyzer' && (
          <ProcessAnalyzer
            currentClient={currentClient}
            analysisResult={latestAnalysisResult}
            opportunities={opportunities}
            onToggleOpportunitySelection={handleToggleOpportunity}
            onReRunAnalysis={() => handleRunAiAnalysis({
              companyName: currentClient.name,
              industry: currentClient.industry,
              teamSize: currentClient.teamSize,
              annualRevenue: currentClient.annualRevenue,
              hourlyWageAvg: currentClient.hourlyWageAvg,
              primaryBottlenecks: currentClient.primaryBottlenecks,
              currentTools: currentClient.techStack,
              manualProcesses: currentClient.manualProcesses
            })}
            onGoToProposal={() => setActiveTab('proposal')}
            isAnalyzing={isAnalyzing}
          />
        )}

        {activeTab === 'roi' && (
          <RoiCalculator
            currentClient={currentClient}
            onGoToProposal={() => setActiveTab('proposal')}
          />
        )}

        {activeTab === 'pricing' && (
          <PricingPage
            onNavigateToLeads={() => setActiveTab('leads')}
            onNavigateToStudio={() => setActiveTab('agent-studio')}
          />
        )}

        {activeTab === 'proposal' && (
          <ProposalBuilder
            currentClient={currentClient}
            proposal={currentProposal}
            opportunities={opportunities}
            onUpdateProposal={handleUpdateProposal}
            onReGenerateProposal={handleReGenerateProposal}
            isGenerating={isGeneratingProposal}
          />
        )}

        {activeTab === 'agent-studio' && (
          <AgentStudio
            currentClient={currentClient}
            botConfig={currentBotConfig}
            knowledgeDocs={currentKnowledgeDocs}
            onUpdateBotConfig={handleUpdateBotConfig}
            onAddKnowledgeDoc={handleAddKnowledgeDoc}
            onDeleteKnowledgeDoc={handleDeleteKnowledgeDoc}
            onLeadCaptured={handleLeadCaptured}
          />
        )}

        {activeTab === 'talking-agent' && (
          <TalkingAgent
            currentClient={currentClient}
            knowledgeDocs={currentKnowledgeDocs}
          />
        )}

        {activeTab === 'portal' && (
          <ClientPortal
            client={currentClient}
            proposal={currentProposal}
            auditLogs={auditLogs}
            leads={leads}
          />
        )}

        {activeTab === 'schema' && (
          <MultiTenantSchema />
        )}

        {(activeTab === 'sign-in' || activeTab === 'auth') && (
          <SignInPage onNavigate={(tab) => setActiveTab(tab)} />
        )}

        {activeTab === 'sign-up' && (
          <SignUpPage onNavigate={(tab) => setActiveTab(tab)} />
        )}
      </main>

      {/* Enterprise Footer */}
      <footer className="no-print border-t border-white/5 bg-[#050505] py-8 px-4 text-center text-xs text-white/40">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 font-light">
          <div className="flex items-center space-x-2">
            <span className="serif italic text-white tracking-wide text-sm">
              NexusAI
            </span>
            <span className="text-white/30">• Multi-Tenant AI Operating System for Real Estate</span>
          </div>

          <div className="flex items-center space-x-4 text-[11px] text-white/40 font-mono">
            <span>SOC2 Type II</span>
            <span>•</span>
            <span>Gemini 3.8 Flash</span>
            <span>•</span>
            <span>PostgreSQL Multi-Tenancy</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ClerkProvider>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </ClerkProvider>
  );
}
