export type TenantRole = 'AGENCY_ADMIN' | 'SOLUTIONS_ARCHITECT' | 'CLIENT_ADMIN' | 'CLIENT_VIEWER';

export interface AgencyTenant {
  id: string;
  name: string;
  slug: string;
  plan: 'Growth' | 'Enterprise' | 'Scale';
  activeClientsCount: number;
  totalMrr: number;
  totalHoursSavedMonthly: number;
}

export type AgencyProfile = AgencyTenant;

export interface ClientCompany {
  id: string;
  agencyId: string;
  name: string;
  domain: string;
  industry: string;
  teamSize: string;
  annualRevenue: string;
  contactName: string;
  contactEmail: string;
  contactRole: string;
  hourlyWageAvg: number;
  status: 'DISCOVERY' | 'ONBOARDING' | 'PROPOSAL_SENT' | 'DELIVERY' | 'ACTIVE_RETAINER' | 'COMPLETED';
  currentMonthlyRetainer: number;
  totalSavedHours: number;
  techStack: string[];
  primaryBottlenecks: string[];
  manualProcesses: string;
  assignedArchitect: string;
  createdAt: string;
  healthScore: number;
}

export interface AutomationOpportunity {
  id: string;
  clientId?: string;
  title: string;
  category: 'Customer Support' | 'Sales & CRM' | 'Operations & ERP' | 'Finance & Invoicing' | 'Document Intelligence' | 'Internal Knowledge';
  implementationTier: 'Quick Win' | 'Strategic Core' | 'High-Impact Transformation';
  painPoint: string;
  solutionArchitecture: string;
  estimatedHoursSavedPerWeek: number;
  estimatedAnnualSavings: number;
  impactScore: number; // 1 - 10
  feasibilityScore: number; // 1 - 10
  riskScore: number; // 1 - 10
  recommendedTech: string[];
  estimatedImplementationWeeks: number;
  breakEvenMonths: number;
  keyDeliverables: string[];
  selectedForProposal?: boolean;
}

export interface ProcessAnalysisResult {
  executiveSummary: string;
  totalEstimatedAnnualSavings: number;
  totalHoursSavedPerWeek: number;
  projectedRoiPercentage: number;
  averagePaybackMonths: number;
  riskLevel: string;
  opportunities?: AutomationOpportunity[];
  prioritizedOpportunities?: AutomationOpportunity[];
  analyzedAt?: string;
  source?: 'gemini' | 'heuristic';
}

export interface ProposalPhase {
  phaseNumber: number;
  phaseName: string;
  durationWeeks: number;
  keyDeliverables: string[];
  acceptanceCriteria: string;
  status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | string;
}

export interface ProposalCommercialTerms {
  setupInvestment: number;
  monthlyRetainer: number;
  contractTermMonths: number;
  paymentMilestones: {
    milestoneName: string;
    percentage: number;
    trigger: string;
  }[];
  guarantees: string[];
}

export interface GeneratedProposal {
  id: string;
  clientId: string;
  clientName: string;
  proposalTitle: string;
  targetClient: string;
  validUntilDate: string;
  executiveSummary: string;
  costOfInactionAnnual: number;
  projectedAnnualBenefit: number;
  netFirstYearBenefit: number;
  solutionPhases: ProposalPhase[];
  commercialTerms: ProposalCommercialTerms;
  complianceAndSecurity: string[];
  status: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REVISED';
  title?: string;
  scopeOfWork?: string | string[];
  deliverables?: string[];
  signedBy?: string;
  signedAt?: string;
}

export interface KnowledgeDocument {
  id: string;
  clientId: string;
  title: string;
  category: 'SOP' | 'Policy' | 'API Specs' | 'FAQ' | 'Product Catalog' | 'PRICING' | 'API_SPEC' | 'POLICY';
  wordCount?: number;
  chunkCount: number;
  lastUpdated?: string;
  contentSnippet?: string;
  contentPreview?: string;
  fileName?: string;
  fileType?: string;
  fileSize?: string;
  indexedAt?: string;
  status: 'INDEXED' | 'PROCESSING' | 'PENDING';
}

export interface BotConfiguration {
  id: string;
  clientId: string;
  name: string;
  persona?: string;
  tone?: string;
  systemPrompt: string;
  temperature: number;
  model?: string;
  strictKnowledgeMode?: boolean;
  webhookEndpoint?: string;
  apiKeyToken?: string;
  guardrails?: string;
  channels?: {
    webWidget: boolean;
    slack: boolean;
    zendesk: boolean;
    whatsapp: boolean;
    webhook: boolean;
  };
  escalationEmail?: string;
  activeStatus?: 'ONLINE' | 'MAINTENANCE' | 'OFFLINE';
  totalConversations?: number;
  resolutionRate?: number;
}

export type BotConfig = BotConfiguration;

export type LeadStatus = 'NEW' | 'WARM' | 'HOT' | 'QUALIFIED' | 'CONTACTED' | 'VIEWING' | 'WON' | 'LOST' | 'VIEWING_SCHEDULED' | 'CLOSED';

export interface QualifiedLead {
  id: string;
  tenantId?: string; // e.g. "nexus_estates_dubai"
  clientId: string;
  clientName: string;
  name: string;
  phone?: string;
  email?: string;
  propertyInterest: string; // e.g. "3 Bedroom Villa"
  propertyType?: string; // backwards compatibility
  preferredLocation: string; // e.g. "Dubai Hills"
  location?: string; // alias
  bedrooms?: number | string; // e.g. 3 or "3 Beds"
  budget: string; // e.g. "AED 3M"
  timeline: string; // e.g. "Within 3 months"
  leadScore?: 'HOT' | 'WARM' | 'NEW' | number; // e.g. "HOT" or 98
  score?: number; // 98/100
  status: LeadStatus;
  isHot?: boolean;
  capturedAt: string;
  createdDate?: string;
  conversationRef?: string;
  conversationSnippet?: { role: 'user' | 'assistant'; text: string; time?: string }[];
  conversation?: { role: 'user' | 'assistant'; text: string; time?: string }[];
  assignedBroker?: string;
  brokerPhone?: string;
  notes?: string;
  sourceChannel?: string;
}

export interface PropertyListing {
  id: string;
  tenantId: string;
  title: string;
  type: 'Villa' | 'Apartment' | 'Penthouse' | 'Townhouse';
  bedrooms: number;
  location: string;
  price: string;
  priceNumeric: number;
  features: string[];
  description: string;
  status: 'AVAILABLE' | 'UNDER_OFFER' | 'SOLD';
  imageUrl?: string;
}

export interface RealEstateConversation {
  id: string;
  tenantId: string;
  leadId?: string;
  visitorName: string;
  visitorContact?: string;
  propertyInterest: string;
  location: string;
  startedAt: string;
  leadCaptured: boolean;
  qualificationCompleted: boolean;
  humanHandoffAvailable: boolean;
  messages: { role: 'user' | 'assistant'; text: string; time: string }[];
}

export interface ActivityAuditLog {
  id: string;
  agencyId?: string;
  clientId?: string;
  timestamp: string;
  actor: string;
  role?: string;
  action: string;
  clientName?: string;
  severity: 'INFO' | 'SUCCESS' | 'WARNING' | 'CRITICAL';
  details: string;
}
