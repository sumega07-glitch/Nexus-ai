import { AgencyTenant, ClientCompany, AutomationOpportunity, GeneratedProposal, KnowledgeDocument, BotConfiguration, ActivityAuditLog, QualifiedLead, PropertyListing, RealEstateConversation } from '../types';

export const INITIAL_AGENCY: AgencyTenant = {
  id: 'agency_nexus_01',
  name: 'NexusAI Real Estate Operating System',
  slug: 'nexus-ai',
  plan: 'Enterprise',
  activeClientsCount: 3,
  totalMrr: 897,
  totalHoursSavedMonthly: 1240,
};

export const INITIAL_CLIENTS: ClientCompany[] = [
  {
    id: 'client_acme',
    agencyId: 'agency_nexus_01',
    name: 'Nexus Estates Dubai',
    domain: 'nexusestates.ae',
    industry: 'Real Estate & Luxury Brokerage',
    teamSize: '45-80',
    annualRevenue: '$25M-$60M',
    contactName: 'Tariq Al-Mansoor',
    contactEmail: 'tariq@nexusestates.ae',
    contactRole: 'Managing Director & Principal Broker',
    hourlyWageAvg: 85,
    status: 'ACTIVE_RETAINER',
    currentMonthlyRetainer: 299,
    totalSavedHours: 640,
    techStack: ['Salesforce Real Estate CRM', 'PropertyFinder API', 'WhatsApp Business API', 'DocuSign', 'Stripe Payments'],
    primaryBottlenecks: [
      'High-volume inbound property inquiry qualification & lead triage',
      'Instant matching of buyer requirements with off-plan & luxury secondary inventory',
      'Scheduling VIP private viewings and dispatching broker dossiers'
    ],
    manualProcesses: 'Sales brokers spend 25+ hours per week manually fielding repetitive WhatsApp messages and portal leads regarding bedroom configurations, amenities, and pricing in Dubai Hills, Downtown Dubai, and Palm Jumeirah.',
    assignedArchitect: 'Alex Vance (Lead AI Architect)',
    createdAt: '2026-01-15',
    healthScore: 99
  },
  {
    id: 'client_global',
    agencyId: 'agency_nexus_01',
    name: 'Elysian Off-Plan Residences',
    domain: 'elysianresidences.ae',
    industry: 'Real Estate & Off-Plan Development',
    teamSize: '25-50',
    annualRevenue: '$35M-$80M',
    contactName: 'Nadia Mansoor',
    contactEmail: 'nadia@elysianresidences.ae',
    contactRole: 'Head of International Sales',
    hourlyWageAvg: 75,
    status: 'DELIVERY',
    currentMonthlyRetainer: 299,
    totalSavedHours: 320,
    techStack: ['HubSpot Real Estate', 'WhatsApp Business API', 'DocuSign', 'Stripe'],
    primaryBottlenecks: [
      'Overseas buyer off-plan brochure dissemination',
      'Payment plan milestone explanations (60/40, 70/30 handover)',
      'Escrow account verification and investor qualification'
    ],
    manualProcesses: 'Sales agents answer 150+ international WhatsApp queries every night regarding completion dates and Golden Visa eligibility.',
    assignedArchitect: 'Elena Rostova (Senior Automation Eng)',
    createdAt: '2026-02-10',
    healthScore: 94
  },
  {
    id: 'client_zenith',
    agencyId: 'agency_nexus_01',
    name: 'Apex Real Estate Holdings',
    domain: 'apexrealestate.ae',
    industry: 'Commercial Real Estate & Asset Management',
    teamSize: '30-60',
    annualRevenue: '$20M-$50M',
    contactName: 'Zaid Al-Husseini',
    contactEmail: 'zaid@apexrealestate.ae',
    contactRole: 'Chief Investment Officer',
    hourlyWageAvg: 90,
    status: 'ACTIVE_RETAINER',
    currentMonthlyRetainer: 299,
    totalSavedHours: 280,
    techStack: ['Yardi Voyager', 'Salesforce CRM', 'WhatsApp API', 'Outlook'],
    primaryBottlenecks: [
      'Office floorplate and retail leasing inquiry intake',
      'Tenant financial pre-qualification and trade license vetting',
      'Commercial lease draft generation'
    ],
    manualProcesses: 'Brokers manually vet corporate credentials and calculate square-foot yield comparisons for prospective enterprise tenants.',
    assignedArchitect: 'Alex Vance (Lead AI Architect)',
    createdAt: '2026-01-20',
    healthScore: 97
  },
  {
    id: 'client_vanguard',
    agencyId: 'agency_nexus_01',
    name: 'Horizon HealthTech Labs',
    domain: 'horizonhealth.co',
    industry: 'Healthcare SaaS',
    teamSize: '65-100',
    annualRevenue: '$14M',
    contactName: 'Dr. Marcus Reynolds',
    contactEmail: 'reynolds@horizonhealth.co',
    contactRole: 'Chief Technology Officer',
    hourlyWageAvg: 85,
    status: 'DELIVERY',
    currentMonthlyRetainer: 5500,
    totalSavedHours: 640,
    techStack: ['HubSpot CRM', 'Jira', 'PostgreSQL', 'Stripe Billing', 'Intercom'],
    primaryBottlenecks: [
      'Complex B2B clinic onboarding workflows',
      'HIPAA compliant security questionnaire responses',
      'Tier 1 developer API support requests'
    ],
    manualProcesses: 'Solutions team manually reviews 30+ clinic onboarding documents weekly and cross-checks medical license verification via 3 state registries.',
    assignedArchitect: 'Elena Rostova (Senior Automation Eng)',
    createdAt: '2026-02-01',
    healthScore: 92
  },
  {
    id: 'client_finscale',
    agencyId: 'agency_nexus_01',
    name: 'FinScale Capital Partners',
    domain: 'finscalecap.com',
    industry: 'Fintech & Lending',
    teamSize: '40-60',
    annualRevenue: '$9.5M',
    contactName: 'David Sterling',
    contactEmail: 'david@finscalecap.com',
    contactRole: 'Managing Partner',
    hourlyWageAvg: 95,
    status: 'PROPOSAL_SENT',
    currentMonthlyRetainer: 0,
    totalSavedHours: 0,
    techStack: ['Salesforce Financial Services Cloud', 'Plaid', 'Stripe', 'Notion', 'Slack'],
    primaryBottlenecks: [
      'Borrower KYC & bank statement underwriting summarization',
      'Loan covenant compliance monitoring',
      'Manual investor monthly reporting compilation'
    ],
    manualProcesses: 'Junior credit analysts spend 25 hours per week downloading borrower PDF bank statements, calculating debt-service ratios into Excel, and drafting approval memorandums.',
    assignedArchitect: 'Alex Vance (Lead AI Architect)',
    createdAt: '2026-02-18',
    healthScore: 88
  },
  {
    id: 'client_nexushome',
    agencyId: 'agency_nexus_01',
    name: 'Apex Real Estate Holdings',
    domain: 'apexholdings.org',
    industry: 'Commercial Real Estate',
    teamSize: '80-120',
    annualRevenue: '$22M',
    contactName: 'Jessica Wu',
    contactEmail: 'jessica@apexholdings.org',
    contactRole: 'Head of Asset Management',
    hourlyWageAvg: 60,
    status: 'ONBOARDING',
    currentMonthlyRetainer: 0,
    totalSavedHours: 0,
    techStack: ['Yardi Voyager', 'DocuSign', 'Microsoft 365', 'HubSpot'],
    primaryBottlenecks: [
      'Commercial lease agreement redlining and key date extraction',
      'Tenant maintenance dispatch and contractor quote comparison',
      'Utility bill anomaly detection across 45 properties'
    ],
    manualProcesses: 'Property managers manually scan 80-page lease contracts to record escalation dates, maintenance caps, and square footage adjustments into Yardi.',
    assignedArchitect: 'David Chen (Process Consultant)',
    createdAt: '2026-02-24',
    healthScore: 85
  },
  {
    id: 'client_novaprint',
    agencyId: 'agency_nexus_01',
    name: 'NovaScale Media & Ads',
    domain: 'novascalemedia.com',
    industry: 'B2B Performance Marketing',
    teamSize: '30-45',
    annualRevenue: '$6.2M',
    contactName: 'Liam O\'Connor',
    contactEmail: 'liam@novascalemedia.com',
    contactRole: 'Founder & CEO',
    hourlyWageAvg: 55,
    status: 'DISCOVERY',
    currentMonthlyRetainer: 0,
    totalSavedHours: 0,
    techStack: ['Meta Ads API', 'Google Ads', 'Slack', 'Asana', 'Looker Studio'],
    primaryBottlenecks: [
      'Multi-channel ad performance reporting & client weekly memos',
      'Creative copy variations generation & compliance checks',
      'Client onboarding media asset collection and tagging'
    ],
    manualProcesses: 'Account managers spend Monday entire morning compiling Google/Meta CSV exports, calculating blended ROAS, and typing 15 client summary emails.',
    assignedArchitect: 'Alex Vance (Lead AI Architect)',
    createdAt: '2026-02-28',
    healthScore: 78
  }
];

export const INITIAL_OPPORTUNITIES: AutomationOpportunity[] = [
  {
    id: 'opp_re_1',
    clientId: 'client_acme',
    title: '24/7 Autonomous Inbound Lead Qualification & CRM Triage',
    category: 'Sales & CRM',
    implementationTier: 'Quick Win',
    painPoint: 'Website visitors and portal inquiries arrive 24/7, but human brokers take hours to respond, losing 60%+ of high-intent buyers.',
    solutionArchitecture: 'NexusAI Real Estate Assistant + PropertyFinder / Bayut Webhook + Instant WhatsApp & Web Qualification.',
    estimatedHoursSavedPerWeek: 28,
    estimatedAnnualSavings: 123760,
    impactScore: 9.6,
    feasibilityScore: 9.8,
    riskScore: 1.2,
    recommendedTech: ['NexusAI Agent Core', 'WhatsApp Business API', 'Salesforce Real Estate CRM', 'PostgreSQL pgvector'],
    estimatedImplementationWeeks: 1,
    breakEvenMonths: 0.9,
    keyDeliverables: [
      'Sub-60-second conversational engagement widget',
      'Location, bedrooms, budget, and timeline extraction protocol',
      'Automated lead scoring (HOT / WARM / NEW) and CRM sync',
      'Immediate broker SMS/WhatsApp dispatch notification'
    ],
    selectedForProposal: true
  },
  {
    id: 'opp_re_2',
    clientId: 'client_acme',
    title: 'Intelligent Inventory Matching & Property Dossier Dispatch',
    category: 'Customer Support',
    implementationTier: 'Strategic Core',
    painPoint: 'Brokers spend hours manually curating listings and compiling PDF brochures for prospects.',
    solutionArchitecture: 'Vectorized Property Knowledge Base + Semantic Spec Matching + Automated WhatsApp PDF Dispatch.',
    estimatedHoursSavedPerWeek: 32,
    estimatedAnnualSavings: 141440,
    impactScore: 9.3,
    feasibilityScore: 9.1,
    riskScore: 1.8,
    recommendedTech: ['Gemini 3.8 Flash', 'pgvector Property Catalog', 'Dynamic PDF Generator', 'Cloud Storage'],
    estimatedImplementationWeeks: 2,
    breakEvenMonths: 1.2,
    keyDeliverables: [
      'Natural language inventory search across Dubai Hills, Downtown, Palm Jumeirah',
      'Auto-generated bespoke property briefing brochures',
      'Real-time price, service charge, and payment plan verification'
    ],
    selectedForProposal: true
  },
  {
    id: 'opp_re_3',
    clientId: 'client_acme',
    title: 'VIP Broker Private Viewing Scheduler & Human Handoff Gateway',
    category: 'Operations & ERP',
    implementationTier: 'High-Impact Transformation',
    painPoint: 'Scheduling private viewings requires multi-party phone tag between international buyers, tenants, and licensed brokers.',
    solutionArchitecture: 'Automated Calendar Coordination Engine + KYC Pre-Screening + Escrow/Deposit Advice.',
    estimatedHoursSavedPerWeek: 15,
    estimatedAnnualSavings: 66300,
    impactScore: 8.9,
    feasibilityScore: 8.7,
    riskScore: 2.1,
    recommendedTech: ['Calendly / Cal.com API', 'Google Calendar Sync', 'Broker Availability Router'],
    estimatedImplementationWeeks: 2,
    breakEvenMonths: 1.5,
    keyDeliverables: [
      'Direct calendar booking for private viewings',
      'Pre-viewing buyer requirement summary pack for brokers',
      'Automated 24-hour and 2-hour WhatsApp reminder sequences'
    ],
    selectedForProposal: true
  }
];

export const INITIAL_PROPOSAL: GeneratedProposal = {
  id: 'prop_acme_01',
  clientId: 'client_acme',
  clientName: 'Nexus Estates Dubai',
  proposalTitle: 'NexusAI AI Lead Generation Pilot',
  targetClient: 'Nexus Estates Dubai',
  validUntilDate: 'April 30, 2026',
  executiveSummary: 'NexusAI proposes a high-impact 60-day AI Lead Generation Pilot for Nexus Estates Dubai. The pilot deploys our autonomous 24/7 AI Sales Assistant across website and messaging channels, instantly qualifying inbound buyers by budget, location, and purchase timeline, matching them with active inventory (Dubai Hills, Downtown, Palm Jumeirah), and executing seamless human handoffs to licensed brokers. Expected outcome: 3x faster response times and ~75 hours weekly saved across the sales brokerage.',
  costOfInactionAnnual: 312000,
  projectedAnnualBenefit: 285000,
  netFirstYearBenefit: 245000,
  solutionPhases: [
    {
      phaseNumber: 1,
      phaseName: 'Current Challenge & Property Knowledge Base Grounding',
      durationWeeks: 1,
      keyDeliverables: [
        'Ingest Nexus Estates Dubai active inventory, floor plans, and pricing rules',
        'Calibrate brand tone: Warm, consultative, high-trust luxury advisory',
        'Configure lead qualification thresholds and high-intent buyer triggers'
      ],
      acceptanceCriteria: 'AI accurately answers inventory and pricing questions across 100% of test scenarios.'
    },
    {
      phaseNumber: 2,
      phaseName: 'NexusAI Solution & AI Agent Channel Deployment',
      durationWeeks: 1,
      keyDeliverables: [
        'Deploy NexusAI Sales Assistant website chat widget and WhatsApp channel',
        'Configure automated lead capture and qualification summary generation',
        'Test human handoff protocol to senior broker Tariq Al-Mansoor'
      ],
      acceptanceCriteria: 'Live capture of buyer details with under 85-second qualification cycle.'
    },
    {
      phaseNumber: 3,
      phaseName: 'Analytics, CRM Sync & Broker Handover Optimization',
      durationWeeks: 2,
      keyDeliverables: [
        'Activate real-time Leads CRM Dashboard and conversation audit logs',
        'Connect instant WhatsApp / SMS lead alert notifications to brokers',
        'Deliver broker training sessions and pilot review KPIs'
      ],
      acceptanceCriteria: 'Zero lead loss with complete conversation audit trails and weekly ROI reporting.'
    }
  ],
  commercialTerms: {
    setupInvestment: 2450,
    monthlyRetainer: 299,
    contractTermMonths: 3,
    paymentMilestones: [
      { milestoneName: 'Pilot Kickoff & Knowledge Base Grounding', percentage: 50, trigger: 'Upon agreement authorization' },
      { milestoneName: 'Channel Go-Live & Broker Handoff Verification', percentage: 50, trigger: 'Upon live launch' }
    ],
    guarantees: [
      'Sample / Demo Pilot Framework: Terms customized per agency deployment',
      'Zero-Latency Inbound Engagement: 24/7 sub-60-second response SLA',
      'Complete Data Isolation: Client listings and inquiries are strictly private'
    ]
  },
  complianceAndSecurity: [
    'Strict Tenant Isolation with tenantId data partitioning',
    'TLS 1.3 encryption in transit and AES-256 at rest',
    'Compliant with UAE RERA brokerage data guidelines',
    'Role-based access control (RBAC) for agency brokers and management'
  ],
  status: 'SENT'
};

export const INITIAL_KNOWLEDGE_DOCS: KnowledgeDocument[] = [
  {
    id: 'doc_1',
    clientId: 'client_acme',
    title: 'Dubai Hills - 3-Bedroom Villa [Demo / Sample Property]',
    category: 'Product Catalog',
    wordCount: 1420,
    chunkCount: 8,
    lastUpdated: '2026-03-01',
    contentSnippet: '[DEMO / SAMPLE PROPERTY - Presentation Listing]\nLocation: Dubai Hills Estate\nType: 3-Bedroom Luxury Villa\nPrice: AED 3.2M\nKey Features & Amenities: Private landscaped garden, covered parking for 2 vehicles, exclusive access to community pool, kids play area, and proximity to championship golf course. Status: Active listing, available for buyer acquisition and private viewing.',
    contentPreview: '[DEMO / SAMPLE PROPERTY - Presentation Listing]\nLocation: Dubai Hills Estate\nType: 3-Bedroom Luxury Villa\nPrice: AED 3.2M\nKey Features & Amenities: Private landscaped garden, covered parking for 2 vehicles, exclusive access to community pool, kids play area, and proximity to championship golf course. Status: Active listing, available for buyer acquisition and private viewing.',
    status: 'INDEXED'
  },
  {
    id: 'doc_2',
    clientId: 'client_acme',
    title: 'Downtown Dubai - 2-Bedroom Apartment [Demo / Sample Property]',
    category: 'Product Catalog',
    wordCount: 1250,
    chunkCount: 6,
    lastUpdated: '2026-03-01',
    contentSnippet: '[DEMO / SAMPLE PROPERTY - Presentation Listing]\nLocation: Downtown Dubai\nType: 2-Bedroom Luxury Apartment\nPrice: AED 1.8M\nKey Features & Amenities: Expansive private balcony with skyline views, modern fitness gym, luxury temperature-controlled swimming pool, 24/7 concierge security. Walking distance to Dubai Mall and Burj Khalifa. Status: Active listing, ready for immediate purchase or investment.',
    contentPreview: '[DEMO / SAMPLE PROPERTY - Presentation Listing]\nLocation: Downtown Dubai\nType: 2-Bedroom Luxury Apartment\nPrice: AED 1.8M\nKey Features & Amenities: Expansive private balcony with skyline views, modern fitness gym, luxury temperature-controlled swimming pool, 24/7 concierge security. Walking distance to Dubai Mall and Burj Khalifa. Status: Active listing, ready for immediate purchase or investment.',
    status: 'INDEXED'
  },
  {
    id: 'doc_3',
    clientId: 'client_acme',
    title: 'Palm Jumeirah - 4-Bedroom Villa [Demo / Sample Property]',
    category: 'Product Catalog',
    wordCount: 1680,
    chunkCount: 10,
    lastUpdated: '2026-03-01',
    contentSnippet: '[DEMO / SAMPLE PROPERTY - Presentation Listing]\nLocation: Palm Jumeirah\nType: 4-Bedroom Waterfront Villa\nPrice: AED 7.5M\nKey Features & Amenities: Unobstructed Arabian Gulf sea view, private infinity pool, direct beach access, expansive entertaining terrace, and double private garage. Status: Exclusive demo listing available for VIP private consultation.',
    contentPreview: '[DEMO / SAMPLE PROPERTY - Presentation Listing]\nLocation: Palm Jumeirah\nType: 4-Bedroom Waterfront Villa\nPrice: AED 7.5M\nKey Features & Amenities: Unobstructed Arabian Gulf sea view, private infinity pool, direct beach access, expansive entertaining terrace, and double private garage. Status: Exclusive demo listing available for VIP private consultation.',
    status: 'INDEXED'
  },
  {
    id: 'doc_4',
    clientId: 'client_acme',
    title: 'Nexus Estates Dubai - Sales Qualification SOP & Protocols [Demo SOP]',
    category: 'SOP',
    wordCount: 2450,
    chunkCount: 12,
    lastUpdated: '2026-03-01',
    contentSnippet: 'Standard Operating Procedure for Nexus Estates Dubai AI Sales Assistant:\n1. Greeting: Introduce as the AI sales assistant for Nexus Estates Dubai. Assist with property discovery and connect with sales team.\n2. Inquire: Ask which area prospect prefers and approximate budget (AED).\n3. Catalog Matching: Match against active demo inventory (Dubai Hills 3BR Villa @ 3.2M, Downtown 2BR Apt @ 1.8M, Palm Jumeirah 4BR Villa @ 7.5M).\n4. Timeline: Determine purchase horizon (e.g., within 3 months, 6 months, or exploring).\n5. Handover: Offer to connect with a sales specialist; politely collect name and best phone number.',
    contentPreview: 'Standard Operating Procedure for Nexus Estates Dubai AI Sales Assistant:\n1. Greeting: Introduce as the AI sales assistant for Nexus Estates Dubai. Assist with property discovery and connect with sales team.\n2. Inquire: Ask which area prospect prefers and approximate budget (AED).\n3. Catalog Matching: Match against active demo inventory (Dubai Hills 3BR Villa @ 3.2M, Downtown 2BR Apt @ 1.8M, Palm Jumeirah 4BR Villa @ 7.5M).\n4. Timeline: Determine purchase horizon (e.g., within 3 months, 6 months, or exploring).\n5. Handover: Offer to connect with a sales specialist; politely collect name and best phone number.',
    status: 'INDEXED'
  }
];

export const INITIAL_BOT_CONFIG: BotConfiguration = {
  id: 'bot_acme_01',
  clientId: 'client_acme',
  name: 'Nexus Estates Dubai AI Sales Specialist',
  persona: 'Elite Real Estate Sales & Property Advisory Assistant',
  tone: 'Warm, professional, consultative, and executive-ready',
  systemPrompt: `You are the AI sales assistant for Nexus Estates Dubai. You help prospects find properties, answer questions, and connect them with our sales team.

Demo & Sample Properties (curated for presentation):
1. Dubai Hills: 3-bedroom villa, AED 3.2M. Private garden, parking, community pool.
2. Downtown Dubai: 2-bedroom apartment, AED 1.8M. Balcony, gym, swimming pool.
3. Palm Jumeirah: 4-bedroom villa, AED 7.5M. Sea view, private pool.

Conversation Flow:
- Greet warmly: "Hello! I'm the AI sales assistant for Nexus Estates Dubai. I can help you find properties, answer questions, and connect you with our sales team. What are you looking for today? How can I help you find your ideal property today?"
- Understand requirements: Ask which area they prefer and approximate budget.
- Recommend properties: Match against the demo properties above with exact specs.
- Qualify purchase timeline: Ask if they are looking to purchase soon (e.g., within 3 months) or still exploring.
- Handover to human broker: Connect with a sales specialist by requesting their name and best phone number.`,
  temperature: 0.3,
  guardrails: 'Clearly present demo properties as curated sample inventory. Respect client contact privacy. Seamlessly offer connection to human sales specialists.',
  channels: {
    webWidget: true,
    slack: true,
    zendesk: true,
    whatsapp: true,
    webhook: true
  },
  escalationEmail: 'sales@nexusestates.ae',
  activeStatus: 'ONLINE',
  totalConversations: 1840,
  resolutionRate: 97.4
};

export const INITIAL_AUDIT_LOGS: ActivityAuditLog[] = [
  {
    id: 'log_1',
    timestamp: 'Just now',
    actor: 'Alex Vance',
    role: 'Solutions Architect',
    action: 'Ran AI Property Qualification Model for Nexus Estates Dubai',
    clientName: 'Nexus Estates Dubai',
    severity: 'SUCCESS',
    details: 'Calibrated AI Sales Assistant with curated demo inventory (Dubai Hills, Downtown, Palm Jumeirah).'
  },
  {
    id: 'log_2',
    timestamp: '14 min ago',
    actor: 'System Autonomous Agent',
    role: 'Workflow Runner',
    action: 'Qualified high-intent buyer for Dubai Hills 3BR Villa',
    clientName: 'Nexus Estates Dubai',
    severity: 'INFO',
    details: 'Acquired budget (AED 3.2M) and purchase timeline (3 months); routed to sales broker.'
  },
  {
    id: 'log_3',
    timestamp: '42 min ago',
    actor: 'Sarah Jenkins',
    role: 'Client Admin',
    action: 'Viewed Executive AI Real Estate Strategy Proposal',
    clientName: 'Nexus Estates Dubai',
    severity: 'INFO',
    details: 'Client reviewed commercial terms and ROI breakdown.'
  },
  {
    id: 'log_4',
    timestamp: '2 hours ago',
    actor: 'David Sterling',
    role: 'Client Exec',
    action: 'Submitted Onboarding Discovery Questionnaire',
    clientName: 'FinScale Capital Partners',
    severity: 'SUCCESS',
    details: 'Completed 5/5 discovery modules. Underwriting bottleneck identified.'
  },
  {
    id: 'log_5',
    timestamp: '5 hours ago',
    actor: 'Elena Rostova',
    role: 'Senior Automation Eng',
    action: 'Deployed Vector Indexing for Horizon HealthTech',
    clientName: 'Horizon HealthTech Labs',
    severity: 'INFO',
    details: 'Embedded 42 clinic onboarding SOP documents into PostgreSQL pgvector.'
  }
];

export const DEMO_PROPERTIES: PropertyListing[] = [
  {
    id: 'prop_dubai_hills',
    tenantId: 'nexus_estates_dubai',
    title: 'Dubai Hills 3BR Villa',
    type: 'Villa',
    bedrooms: 3,
    location: 'Dubai Hills',
    price: 'AED 3.2 million',
    priceNumeric: 3200000,
    features: ['Private garden', 'Covered parking for 2 cars', 'Community pool access', 'Championship golf course nearby'],
    description: 'Immaculate 3-bedroom luxury family villa located in the prestigious Dubai Hills Estate community. Boasts high-end European finishes, floor-to-ceiling double-glazed windows, private landscaped garden, and walking distance to Dubai Hills Park.',
    status: 'AVAILABLE'
  },
  {
    id: 'prop_downtown',
    tenantId: 'nexus_estates_dubai',
    title: 'Downtown Dubai 2BR Apartment',
    type: 'Apartment',
    bedrooms: 2,
    location: 'Downtown Dubai',
    price: 'AED 1.8 million',
    priceNumeric: 1800000,
    features: ['Skyline & Burj Khalifa view balcony', 'State-of-the-art gym', 'Temperature-controlled swimming pool', '24/7 concierge'],
    description: 'High-floor executive 2-bedroom residence situated in prime Downtown Dubai. Walking distance to Dubai Mall and Opera District with panoramic skyline vistas. Ideal for high rental yield investment or urban lifestyle.',
    status: 'AVAILABLE'
  },
  {
    id: 'prop_palm_jumeirah',
    tenantId: 'nexus_estates_dubai',
    title: 'Palm Jumeirah 4BR Villa',
    type: 'Villa',
    bedrooms: 4,
    location: 'Palm Jumeirah',
    price: 'AED 7.5 million',
    priceNumeric: 7500000,
    features: ['Unobstructed Arabian Gulf sea view', 'Private infinity pool', 'Private beach access', 'Double garage & maid room'],
    description: 'Exclusive beachfront signature 4-bedroom waterfront villa on the iconic Palm Jumeirah fronds. Features direct private beach frontage, bespoke Italian kitchen, private infinity pool, and expansive sunset rooftop terrace.',
    status: 'AVAILABLE'
  }
];

export const DEMO_CONVERSATIONS: RealEstateConversation[] = [
  {
    id: 'conv_john_smith',
    tenantId: 'nexus_estates_dubai',
    leadId: 'lead_john_smith',
    visitorName: 'John Smith',
    visitorContact: '+971 50 892 4410',
    propertyInterest: '3 Bedroom Villa',
    location: 'Dubai Hills',
    startedAt: 'Today, 10:14 AM',
    leadCaptured: true,
    qualificationCompleted: true,
    humanHandoffAvailable: true,
    messages: [
      {
        role: 'assistant',
        text: "Hello! I'm the AI sales assistant for Nexus Estates Dubai. I can help you explore properties, answer questions, understand your requirements, and connect you with our sales team. What are you looking for today?",
        time: '10:14 AM'
      },
      {
        role: 'user',
        text: "I'm looking for a 3-bedroom villa in Dubai.",
        time: '10:15 AM'
      },
      {
        role: 'assistant',
        text: "Absolutely. Which area of Dubai do you prefer, and what's your approximate budget?",
        time: '10:15 AM'
      },
      {
        role: 'user',
        text: "Dubai Hills, around AED 3 million.",
        time: '10:16 AM'
      },
      {
        role: 'assistant',
        text: "We have a demo listing for a 3-bedroom villa in Dubai Hills at AED 3.2M, featuring a private garden, parking and access to a community pool. Are you looking to purchase soon or are you still exploring options?",
        time: '10:16 AM'
      },
      {
        role: 'user',
        text: "Within 3 months.",
        time: '10:17 AM'
      },
      {
        role: 'assistant',
        text: "Great. I can connect you with a sales specialist to discuss suitable options. May I have your name and best phone number?",
        time: '10:17 AM'
      },
      {
        role: 'user',
        text: "John Smith, +971 50 892 4410",
        time: '10:18 AM'
      },
      {
        role: 'assistant',
        text: "Thanks, John. I've recorded your enquiry. A sales specialist can follow up with you about suitable properties.",
        time: '10:18 AM'
      }
    ]
  },
  {
    id: 'conv_sarah_williams',
    tenantId: 'nexus_estates_dubai',
    leadId: 'lead_sarah_williams',
    visitorName: 'Sarah Williams',
    visitorContact: '+971 52 411 9082',
    propertyInterest: '2 Bedroom Apartment',
    location: 'Downtown Dubai',
    startedAt: 'Today, 09:28 AM',
    leadCaptured: true,
    qualificationCompleted: true,
    humanHandoffAvailable: true,
    messages: [
      {
        role: 'assistant',
        text: "Hello! I'm the AI sales assistant for Nexus Estates Dubai. I can help you explore properties, answer questions, understand your requirements, and connect you with our sales team. What are you looking for today?",
        time: '09:28 AM'
      },
      {
        role: 'user',
        text: "Do you have 2-bedroom units in Downtown with good amenities under 2M?",
        time: '09:29 AM'
      },
      {
        role: 'assistant',
        text: "Yes, we have an exceptional 2-bedroom apartment in Downtown Dubai listed at AED 1.8M featuring skyline views, luxury gym, and swimming pool. When would you be ready to complete?",
        time: '09:29 AM'
      },
      {
        role: 'user',
        text: "Ready within 1-2 months, cash buyer.",
        time: '09:30 AM'
      },
      {
        role: 'assistant',
        text: "That sounds like a good fit. I can have a member of our sales team contact you with suitable options. May I take your name and best contact number?",
        time: '09:30 AM'
      },
      {
        role: 'user',
        text: "Sarah Williams, +971 52 411 9082",
        time: '09:31 AM'
      },
      {
        role: 'assistant',
        text: "Thank you, Sarah. Layla Al-Hashemi from our Downtown investor desk will follow up promptly with the complete floor plans.",
        time: '09:31 AM'
      }
    ]
  },
  {
    id: 'conv_david_brown',
    tenantId: 'nexus_estates_dubai',
    leadId: 'lead_david_brown',
    visitorName: 'David Brown',
    visitorContact: '+44 7911 123456',
    propertyInterest: '4 Bedroom Villa',
    location: 'Palm Jumeirah',
    startedAt: 'Yesterday, 04:12 PM',
    leadCaptured: true,
    qualificationCompleted: true,
    humanHandoffAvailable: true,
    messages: [
      {
        role: 'assistant',
        text: "Hello! I'm the AI sales assistant for Nexus Estates Dubai. I can help you explore properties, answer questions, understand your requirements, and connect you with our sales team. What are you looking for today?",
        time: '04:12 PM'
      },
      {
        role: 'user',
        text: "Looking for waterfront beachfront properties on the Palm, 4 beds minimum.",
        time: '04:13 PM'
      },
      {
        role: 'assistant',
        text: "We currently represent a 4-bedroom beachfront villa on Palm Jumeirah listed at AED 7.5M with private infinity pool and direct beach access. What is your preferred purchase timeline?",
        time: '04:14 PM'
      },
      {
        role: 'user',
        text: "Within 6 months as we relocate from London.",
        time: '04:15 PM'
      },
      {
        role: 'assistant',
        text: "That sounds like a wonderful transition. May I take your name and contact number to arrange a VIP broker consultation with our luxury specialist?",
        time: '04:15 PM'
      },
      {
        role: 'user',
        text: "David Brown, +44 7911 123456",
        time: '04:16 PM'
      }
    ]
  }
];

export const INITIAL_LEADS: QualifiedLead[] = [
  {
    id: 'lead_john_smith',
    tenantId: 'nexus_estates_dubai',
    clientId: 'client_acme',
    clientName: 'Nexus Estates Dubai',
    name: 'John Smith',
    phone: '+971 50 892 4410',
    email: 'john.smith@smithadvisory.ae',
    propertyInterest: '3 Bedroom Villa',
    propertyType: '3 Bedroom Villa',
    preferredLocation: 'Dubai Hills',
    location: 'Dubai Hills',
    bedrooms: 3,
    budget: 'AED 3M',
    timeline: 'Within 3 months',
    leadScore: 'HOT',
    score: 98,
    status: 'HOT',
    isHot: true,
    capturedAt: 'Today, 10:18 AM',
    createdDate: 'Today',
    conversationRef: 'conv_john_smith',
    assignedBroker: 'Tariq Al-Mansoor (Senior Luxury Broker)',
    brokerPhone: '+971 4 399 2200',
    sourceChannel: 'AI Web Sales Assistant',
    notes: 'Inquired for a 3-bedroom villa in Dubai Hills. Budget AED 3M matches Dubai Hills 3BR Villa demo listing @ AED 3.2M. Timeline confirmed within 3 months. Cash/pre-approved buyer.',
    conversationSnippet: DEMO_CONVERSATIONS[0].messages
  },
  {
    id: 'lead_sarah_williams',
    tenantId: 'nexus_estates_dubai',
    clientId: 'client_acme',
    clientName: 'Nexus Estates Dubai',
    name: 'Sarah Williams',
    phone: '+971 52 411 9082',
    email: 'sarah.williams@singaporeholdings.sg',
    propertyInterest: '2 Bedroom Apartment',
    propertyType: '2 Bedroom Luxury Apartment',
    preferredLocation: 'Downtown Dubai',
    location: 'Downtown Dubai',
    bedrooms: 2,
    budget: 'AED 1.8M',
    timeline: '1-2 Months',
    leadScore: 'WARM',
    score: 86,
    status: 'WARM',
    isHot: false,
    capturedAt: 'Today, 09:31 AM',
    createdDate: 'Today',
    conversationRef: 'conv_sarah_williams',
    assignedBroker: 'Layla Al-Hashemi',
    brokerPhone: '+971 4 399 2201',
    sourceChannel: 'AI Web Sales Assistant',
    notes: 'Seeking high rental yield investment apartment in Downtown Dubai walking distance to Dubai Mall. Matched with Downtown 2BR Apartment @ AED 1.8M.',
    conversationSnippet: DEMO_CONVERSATIONS[1].messages
  },
  {
    id: 'lead_david_brown',
    tenantId: 'nexus_estates_dubai',
    clientId: 'client_acme',
    clientName: 'Nexus Estates Dubai',
    name: 'David Brown',
    phone: '+44 7911 123456',
    email: 'dbrown@mayfairfamily.co.uk',
    propertyInterest: '4 Bedroom Villa',
    propertyType: '4 Bedroom Waterfront Villa',
    preferredLocation: 'Palm Jumeirah',
    location: 'Palm Jumeirah',
    bedrooms: 4,
    budget: 'AED 7.5M',
    timeline: '6 Months',
    leadScore: 'NEW',
    score: 78,
    status: 'NEW',
    isHot: false,
    capturedAt: 'Yesterday, 04:16 PM',
    createdDate: 'Yesterday',
    conversationRef: 'conv_david_brown',
    assignedBroker: 'Tariq Al-Mansoor',
    brokerPhone: '+971 4 399 2200',
    sourceChannel: 'AI Web Sales Assistant',
    notes: 'Relocating from London. Interested in Palm Jumeirah 4BR beachfront villa with private infinity pool and direct beach access.',
    conversationSnippet: DEMO_CONVERSATIONS[2].messages
  },
  {
    id: 'lead_michael_chang',
    tenantId: 'nexus_estates_dubai',
    clientId: 'client_acme',
    clientName: 'Nexus Estates Dubai',
    name: 'Michael Chang',
    phone: '+971 55 310 8821',
    email: 'mchang@orienttech.hk',
    propertyInterest: '1 Bedroom Luxury Apartment',
    propertyType: '1 Bedroom Apartment',
    preferredLocation: 'Dubai Marina',
    location: 'Dubai Marina',
    bedrooms: 1,
    budget: 'AED 1.2M',
    timeline: 'Immediate',
    leadScore: 92,
    score: 92,
    status: 'VIEWING',
    isHot: false,
    capturedAt: 'Yesterday, 02:45 PM',
    createdDate: 'Yesterday',
    conversationRef: 'conv_michael_chang',
    assignedBroker: 'Layla Al-Hashemi',
    brokerPhone: '+971 4 399 2201',
    sourceChannel: 'WhatsApp AI Agent',
    notes: 'Private viewing scheduled for tomorrow 3 PM for Dubai Marina waterfront apartment.',
    conversationSnippet: [
      { role: 'assistant', text: 'Hello Michael! Viewing confirmed for Dubai Marina 1BR tomorrow at 3 PM with Layla Al-Hashemi.', time: '02:45 PM' }
    ]
  },
  {
    id: 'lead_fatima_alzahra',
    tenantId: 'nexus_estates_dubai',
    clientId: 'client_acme',
    clientName: 'Nexus Estates Dubai',
    name: 'Fatima Al-Zahra',
    phone: '+971 50 671 9900',
    email: 'fatima@alzahraholdings.ae',
    propertyInterest: '5 Bedroom Signature Villa',
    propertyType: '5 Bedroom Mansion',
    preferredLocation: 'Emirates Hills',
    location: 'Emirates Hills',
    bedrooms: 5,
    budget: 'AED 22M',
    timeline: 'Within 30 days',
    leadScore: 'HOT',
    score: 99,
    status: 'WON',
    isHot: true,
    capturedAt: '3 days ago',
    createdDate: '3 days ago',
    conversationRef: 'conv_fatima',
    assignedBroker: 'Tariq Al-Mansoor',
    brokerPhone: '+971 4 399 2200',
    sourceChannel: 'VIP Portal Assistant',
    notes: 'Sale closed successfully with full escrow deposit transferred. Golden Visa paperwork underway.',
    conversationSnippet: [
      { role: 'assistant', text: 'Contract signed. Escrow verified under UAE RERA.', time: '11:00 AM' }
    ]
  },
  {
    id: 'lead_omar_farooq',
    tenantId: 'nexus_estates_dubai',
    clientId: 'client_acme',
    clientName: 'Nexus Estates Dubai',
    name: 'Omar Farooq',
    phone: '+971 54 812 3344',
    email: 'omar.farooq@outlook.com',
    propertyInterest: 'Studio Investor Unit',
    propertyType: 'Studio Apartment',
    preferredLocation: 'Business Bay',
    location: 'Business Bay',
    bedrooms: 'Studio',
    budget: 'AED 750k',
    timeline: 'Exploring',
    leadScore: 'NEW',
    score: 65,
    status: 'LOST',
    isHot: false,
    capturedAt: '4 days ago',
    createdDate: '4 days ago',
    conversationRef: 'conv_omar',
    assignedBroker: 'Layla Al-Hashemi',
    brokerPhone: '+971 4 399 2201',
    sourceChannel: 'Web Widget',
    notes: 'Client postponed investment to Q4 2026. Archived in CRM nurture sequence.',
    conversationSnippet: [
      { role: 'assistant', text: 'Understood Omar. We will send monthly market intelligence updates.', time: '05:20 PM' }
    ]
  }
];

export const PRISMA_SCHEMA_CODE = `// Prisma Schema for Multi-Tenant B2B AI Agency Operating System
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum TenantRole {
  AGENCY_ADMIN
  SOLUTIONS_ARCHITECT
  CLIENT_ADMIN
  CLIENT_VIEWER
}

enum ClientStatus {
  DISCOVERY
  ONBOARDING
  PROPOSAL_SENT
  DELIVERY
  ACTIVE_RETAINER
  COMPLETED
  CHURNED
}

enum OpportunityTier {
  QUICK_WIN
  STRATEGIC_CORE
  HIGH_IMPACT_TRANSFORMATION
}

enum ProposalStatus {
  DRAFT
  SENT
  ACCEPTED
  REVISED
}

model Agency {
  id                      String         @id @default(uuid())
  name                    String
  slug                    String         @unique
  plan                    String         @default("Enterprise")
  createdAt               DateTime       @default(now())
  updatedAt               DateTime       @updatedAt

  users                   User[]
  clients                 Client[]
  auditLogs               AuditLog[]
  agencyIntegrations      Integration[]
}

model Client {
  id                      String         @id @default(uuid())
  agencyId                String
  agency                  Agency         @relation(fields: [agencyId], references: [id], onDelete: Cascade)
  
  name                    String
  domain                  String?
  industry                String
  teamSize                String
  annualRevenue           String?
  hourlyWageAvg           Float          @default(65.0)
  status                  ClientStatus   @default(DISCOVERY)
  currentMonthlyRetainer  Float          @default(0.0)
  totalSavedHours         Float          @default(0.0)
  techStack               String[]
  primaryBottlenecks      String[]
  manualProcesses         String?
  healthScore             Int            @default(90)

  users                   User[]
  opportunities           AutomationOpportunity[]
  proposals               Proposal[]
  roadmapItems            RoadmapItem[]
  knowledgeDocs           KnowledgeDocument[]
  botConfigs              BotConfig[]
  integrations            Integration[]
  auditLogs               AuditLog[]

  createdAt               DateTime       @default(now())
  updatedAt               DateTime       @updatedAt
}

model User {
  id                      String         @id @default(uuid())
  clerkId                 String         @unique
  email                   String         @unique
  name                    String
  role                    TenantRole     @default(CLIENT_VIEWER)
  
  agencyId                String?
  agency                  Agency?        @relation(fields: [agencyId], references: [id], onDelete: Cascade)
  
  clientId                String?
  client                  Client?        @relation(fields: [clientId], references: [id], onDelete: SetNull)

  createdAt               DateTime       @default(now())
  updatedAt               DateTime       @updatedAt
}

model AutomationOpportunity {
  id                      String           @id @default(uuid())
  clientId                String
  client                  Client           @relation(fields: [clientId], references: [id], onDelete: Cascade)
  
  title                   String
  category                String
  implementationTier      OpportunityTier  @default(QUICK_WIN)
  painPoint               String
  solutionArchitecture    String
  estimatedHoursSavedWeek Float
  estimatedAnnualSavings  Float
  impactScore             Float
  feasibilityScore        Float
  riskScore               Float
  recommendedTech         String[]
  estimatedWeeks          Int
  breakEvenMonths         Float
  keyDeliverables         String[]
  selectedForProposal     Boolean          @default(false)

  createdAt               DateTime         @default(now())
  updatedAt               DateTime         @updatedAt
}

model Proposal {
  id                      String           @id @default(uuid())
  clientId                String
  client                  Client           @relation(fields: [clientId], references: [id], onDelete: Cascade)
  
  title                   String
  validUntil              DateTime
  executiveSummary        String
  costOfInactionAnnual    Float
  projectedAnnualBenefit  Float
  netFirstYearBenefit     Float
  setupInvestment         Float
  monthlyRetainer         Float
  contractTermMonths      Int              @default(12)
  status                  ProposalStatus   @default(DRAFT)
  signedBy                String?
  signedAt                DateTime?

  phases                  ProposalPhase[]
  milestones              PaymentMilestone[]

  createdAt               DateTime         @default(now())
  updatedAt               DateTime         @updatedAt
}

model ProposalPhase {
  id                      String           @id @default(uuid())
  proposalId              String
  proposal                Proposal         @relation(fields: [proposalId], references: [id], onDelete: Cascade)
  
  phaseNumber             Int
  phaseName               String
  durationWeeks           Int
  keyDeliverables         String[]
  acceptanceCriteria      String
}

model PaymentMilestone {
  id                      String           @id @default(uuid())
  proposalId              String
  proposal                Proposal         @relation(fields: [proposalId], references: [id], onDelete: Cascade)
  
  name                    String
  percentage              Int
  triggerEvent            String
  isPaid                  Boolean          @default(false)
}

model RoadmapItem {
  id                      String           @id @default(uuid())
  clientId                String
  client                  Client           @relation(fields: [clientId], references: [id], onDelete: Cascade)
  
  title                   String
  status                  String           @default("PLANNED")
  quarter                 String           // e.g. "Q2 2026"
  targetCompletion        DateTime?
  owner                   String?
}

model KnowledgeDocument {
  id                      String           @id @default(uuid())
  clientId                String
  client                  Client           @relation(fields: [clientId], references: [id], onDelete: Cascade)
  
  title                   String
  category                String
  wordCount               Int
  chunkCount              Int
  contentSnippet          String
  status                  String           @default("INDEXED")
  vectorEmbeddingsId      String?

  createdAt               DateTime         @default(now())
  updatedAt               DateTime         @updatedAt
}

model BotConfig {
  id                      String           @id @default(uuid())
  clientId                String
  client                  Client           @relation(fields: [clientId], references: [id], onDelete: Cascade)
  
  name                    String
  persona                 String
  tone                    String
  systemPrompt            String
  temperature             Float            @default(0.4)
  guardrails              String
  escalationEmail         String
  activeStatus            String           @default("ONLINE")
  totalConversations      Int              @default(0)
  resolutionRate          Float            @default(95.0)

  createdAt               DateTime         @default(now())
  updatedAt               DateTime         @updatedAt
}

model Integration {
  id                      String           @id @default(uuid())
  agencyId                String?
  agency                  Agency?          @relation(fields: [agencyId], references: [id], onDelete: Cascade)
  clientId                String?
  client                  Client?          @relation(fields: [clientId], references: [id], onDelete: Cascade)
  
  serviceName             String           // e.g., "Slack", "Salesforce", "Zendesk", "HubSpot", "Stripe"
  authType                String           // "OAuth2" | "APIKey" | "Webhook"
  status                  String           @default("ACTIVE")
  lastSyncedAt            DateTime         @default(now())
}

model AuditLog {
  id                      String           @id @default(uuid())
  agencyId                String
  agency                  Agency           @relation(fields: [agencyId], references: [id], onDelete: Cascade)
  clientId                String?
  client                  Client?          @relation(fields: [clientId], references: [id], onDelete: SetNull)
  
  actor                   String
  role                    String
  action                  String
  severity                String           @default("INFO")
  details                 String
  timestamp               DateTime         @default(now())
}`;

// Aliases for unified importing across application components
export const MOCK_AGENCY = INITIAL_AGENCY;
export const MOCK_CLIENTS = INITIAL_CLIENTS;
export const MOCK_OPPORTUNITIES = INITIAL_OPPORTUNITIES;
export const MOCK_PROPOSAL = INITIAL_PROPOSAL;
export const MOCK_PROPOSALS: GeneratedProposal[] = [INITIAL_PROPOSAL];
export const MOCK_BOT_CONFIG = INITIAL_BOT_CONFIG;
export const MOCK_BOT_CONFIGS: BotConfiguration[] = [
  {
    ...INITIAL_BOT_CONFIG,
    model: 'gemini-3.8-flash',
    strictKnowledgeMode: true,
    webhookEndpoint: 'https://api.nexusai.agency/v1/webhook/nexus_estates_inbound',
    apiKeyToken: 'sk_live_nexus_98f42ba79e0114da92c'
  }
];
export const MOCK_KNOWLEDGE_DOCS = INITIAL_KNOWLEDGE_DOCS;
export const MOCK_AUDIT_LOGS = INITIAL_AUDIT_LOGS;

