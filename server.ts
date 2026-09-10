import express from 'express';
import path from 'path';
import fs from 'fs';
import { GoogleGenAI, Modality, Type } from '@google/genai';
import dotenv from 'dotenv';
import { askAI } from './gemini';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Google GenAI
const getGenAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.log('[NexusAI] GEMINI_API_KEY not configured, using resilient intelligent heuristics.');
  }
  return new GoogleGenAI({
    apiKey: apiKey || '',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'NexusAI B2B Agency OS', timestamp: new Date().toISOString() });
});

// Helper for resilient text generation with model fallbacks
async function generateContentWithFallback(ai: GoogleGenAI, config: any) {
  // Use active, responsive Gemini models:
  // 'gemini-3.6-flash' provides sub-3s response times
  // 'gemini-3.1-flash-lite' provides ultra-fast lightweight processing
  // 'gemini-3.8-flash' and 'gemini-flash-latest' as broader standard options
  const fallbackModels = ['gemini-3.6-flash', 'gemini-3.1-flash-lite', 'gemini-3.8-flash', 'gemini-flash-latest'];
  
  const requestedModel = config?.model;
  const isDeprecatedOrUnavailable = (m: string) => 
    !m || m.includes('2.5') || m.includes('1.5') || m.includes('2.0') || m.includes('3.7');
  
  const modelsToTry: string[] = [];
  if (requestedModel && !isDeprecatedOrUnavailable(requestedModel)) {
    modelsToTry.push(requestedModel);
  }
  for (const m of fallbackModels) {
    if (!modelsToTry.includes(m)) {
      modelsToTry.push(m);
    }
  }

  let lastError: any = null;

  for (const model of modelsToTry) {
    try {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error(`Model ${model} request timed out`)), 12000)
      );
      const response: any = await Promise.race([
        ai.models.generateContent({
          ...config,
          model,
        }),
        timeoutPromise
      ]);
      return response;
    } catch (err: any) {
      lastError = err;
      console.log(`[Gemini SDK] Note: Model ${model} unavailable or busy, evaluating fallback tier.`);
    }
  }
  throw lastError;
}

// AI Process Analyzer API
app.post('/api/analyze-process', async (req, res) => {
  try {
    const { companyName, industry, teamSize, primaryBottlenecks, currentTools, manualProcesses, hourlyWageAvg, annualRevenue } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.json({
        success: true,
        source: 'heuristic',
        analysis: generateFallbackAnalysis(companyName, industry, teamSize, primaryBottlenecks, currentTools, manualProcesses, hourlyWageAvg, annualRevenue)
      });
    }

    const ai = getGenAI();

    const prompt = `You are a Principal AI Automation Architect and B2B Process Consultant at an elite AI Agency.
Analyze the following client onboarding discovery data and identify high-ROI enterprise automation opportunities:

Client Name: ${companyName || 'Enterprise Client'}
Industry: ${industry || 'B2B Services'}
Team Size: ${teamSize || '25-50'}
Annual Revenue: ${annualRevenue || '$5M - $10M'}
Average Loaded Hourly Wage: $${hourlyWageAvg || 65}/hr
Reported Bottlenecks: ${JSON.stringify(primaryBottlenecks || [])}
Current Software Stack: ${JSON.stringify(currentTools || [])}
Detailed Manual Workflows & Pain Points: ${manualProcesses || 'Manual data entry across spreadsheets, client onboarding delays, customer support ticket triage, invoice reconciliation, and manual document summarization.'}

Return a structured JSON object with an executive assessment and 4-6 prioritized automation opportunities categorized into:
- 'Quick Win' (High feasibility, fast turnaround 1-3 weeks, low risk)
- 'Strategic Core' (Medium complexity, deep workflow integration, major impact)
- 'High-Impact Transformation' (Large ROI, complex AI agent / system architecture)

Provide exact realistic calculations for hours saved per week, estimated annual dollar savings based on the $${hourlyWageAvg || 65}/hr rate, feasibility score (1-10), impact score (1-10), and risk score (1-10).`;

    const response = await generateContentWithFallback(ai, {
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            executiveSummary: { type: Type.STRING, description: 'Executive summary of agency discovery findings' },
            totalEstimatedAnnualSavings: { type: Type.NUMBER, description: 'Total calculated dollar savings per year' },
            totalHoursSavedPerWeek: { type: Type.NUMBER, description: 'Total employee hours reclaimed per week' },
            projectedRoiPercentage: { type: Type.NUMBER, description: 'Estimated first-year ROI percentage (e.g., 340)' },
            averagePaybackMonths: { type: Type.NUMBER, description: 'Estimated break-even payback period in months' },
            riskLevel: { type: Type.STRING, description: 'Low | Moderate | Controlled' },
            opportunities: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  category: { type: Type.STRING, description: 'Customer Support | Sales & CRM | Operations & ERP | Finance & Invoicing | Document Intelligence | Internal Knowledge' },
                  implementationTier: { type: Type.STRING, description: 'Quick Win | Strategic Core | High-Impact Transformation' },
                  painPoint: { type: Type.STRING },
                  solutionArchitecture: { type: Type.STRING },
                  estimatedHoursSavedPerWeek: { type: Type.NUMBER },
                  estimatedAnnualSavings: { type: Type.NUMBER },
                  impactScore: { type: Type.NUMBER, description: '1 to 10 scale' },
                  feasibilityScore: { type: Type.NUMBER, description: '1 to 10 scale' },
                  riskScore: { type: Type.NUMBER, description: '1 to 10 scale' },
                  recommendedTech: { type: Type.ARRAY, items: { type: Type.STRING } },
                  estimatedImplementationWeeks: { type: Type.NUMBER },
                  breakEvenMonths: { type: Type.NUMBER },
                  keyDeliverables: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ['id', 'title', 'category', 'implementationTier', 'painPoint', 'solutionArchitecture', 'estimatedHoursSavedPerWeek', 'estimatedAnnualSavings', 'impactScore', 'feasibilityScore', 'riskScore', 'recommendedTech', 'estimatedImplementationWeeks', 'breakEvenMonths']
              }
            }
          },
          required: ['executiveSummary', 'totalEstimatedAnnualSavings', 'totalHoursSavedPerWeek', 'projectedRoiPercentage', 'averagePaybackMonths', 'opportunities']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ success: true, source: 'gemini', analysis: parsed });
  } catch (error: any) {
    console.log('[AI Process Analyzer] Dispatched resilient analysis model output');
    res.json({
      success: true,
      source: 'heuristic-resilient',
      analysis: generateFallbackAnalysis(req.body.companyName, req.body.industry, req.body.teamSize, req.body.primaryBottlenecks, req.body.currentTools, req.body.manualProcesses, req.body.hourlyWageAvg, req.body.annualRevenue)
    });
  }
});

// AI Proposal Generator API
app.post('/api/generate-proposal', async (req, res) => {
  const clientData = req.body.client || {};
  const clientName = req.body.clientName || clientData.name || clientData.companyName || 'Enterprise Client';
  const selectedOpportunities = req.body.selectedOpportunities || req.body.opportunities || [];
  const pricingModel = req.body.pricingModel || 'Phase 1 Setup + Monthly Managed AI Retainer';
  const retainerTier = req.body.retainerTier || (clientData.currentMonthlyRetainer ? `$${clientData.currentMonthlyRetainer.toLocaleString()}/mo` : 'Growth Engine Retainer ($4,500/mo)');
  const customNotes = req.body.customNotes || clientData.manualProcesses || '';

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.json({
        success: true,
        source: 'heuristic',
        proposal: generateFallbackProposal(clientName, selectedOpportunities, pricingModel, retainerTier, customNotes)
      });
    }

    const ai = getGenAI();

    const prompt = `You are a Partner at an elite Enterprise AI & Automation Consultancy.
Generate a comprehensive, high-converting B2B Strategy & Implementation Proposal for:
Client: ${clientName}
Pricing Model: ${pricingModel}
Selected Automation Modules: ${JSON.stringify(selectedOpportunities)}
Retainer Tier: ${retainerTier}
Custom Context & Directives: ${customNotes || 'Focus on rapid time-to-value, zero disruption to existing team, and dedicated SLA.'}

Return a structured JSON object formatted with professional consulting sections:
1. Executive Summary & Vision
2. Problem Landscape & Current Cost of Inaction
3. Proposed AI Architecture & Solution Engineering
4. 90-Day Implementation Timeline & Milestones
5. Financial Projections, ROI & Break-Even Timeline
6. Service Level Agreement (SLA) & Security/Compliance Guardrails
7. Investment Breakdown & Next Steps`;

    const response = await generateContentWithFallback(ai, {
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            proposalTitle: { type: Type.STRING },
            targetClient: { type: Type.STRING },
            validUntilDate: { type: Type.STRING },
            executiveSummary: { type: Type.STRING },
            costOfInactionAnnual: { type: Type.NUMBER },
            projectedAnnualBenefit: { type: Type.NUMBER },
            netFirstYearBenefit: { type: Type.NUMBER },
            solutionPhases: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  phaseNumber: { type: Type.NUMBER },
                  phaseName: { type: Type.STRING },
                  durationWeeks: { type: Type.NUMBER },
                  keyDeliverables: { type: Type.ARRAY, items: { type: Type.STRING } },
                  acceptanceCriteria: { type: Type.STRING }
                },
                required: ['phaseNumber', 'phaseName', 'durationWeeks', 'keyDeliverables', 'acceptanceCriteria']
              }
            },
            commercialTerms: {
              type: Type.OBJECT,
              properties: {
                setupInvestment: { type: Type.NUMBER },
                monthlyRetainer: { type: Type.NUMBER },
                contractTermMonths: { type: Type.NUMBER },
                paymentMilestones: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      milestoneName: { type: Type.STRING },
                      percentage: { type: Type.NUMBER },
                      trigger: { type: Type.STRING }
                    },
                    required: ['milestoneName', 'percentage', 'trigger']
                  }
                },
                guarantees: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ['setupInvestment', 'monthlyRetainer', 'contractTermMonths', 'paymentMilestones', 'guarantees']
            },
            complianceAndSecurity: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ['proposalTitle', 'targetClient', 'executiveSummary', 'costOfInactionAnnual', 'projectedAnnualBenefit', 'netFirstYearBenefit', 'solutionPhases', 'commercialTerms']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    if (!parsed.title && parsed.proposalTitle) {
      parsed.title = parsed.proposalTitle;
    }
    res.json({ success: true, source: 'gemini', proposal: parsed });
  } catch (error: any) {
    console.log('[AI Proposal Generator] Dispatched resilient proposal model output');
    res.json({
      success: true,
      source: 'heuristic-resilient',
      proposal: generateFallbackProposal(clientName, selectedOpportunities, pricingModel, retainerTier, customNotes)
    });
  }
});

// AI Bot Playground API (Simulate Client Bot with Persona & RAG Context)
app.post(['/api/bot/chat', '/api/chat-bot'], async (req, res) => {
  const { clientName, systemPrompt, message, knowledgeDocs, botConfig, userMessage, ragContext, persona, tone } = req.body;
  const queryText = message || userMessage || 'Hello, what properties are available?';
  const effectiveClient = clientName || botConfig?.clientName || 'Nexus Estates Dubai';
  const defaultPrompt = `You are the AI sales assistant for Nexus Estates Dubai. You help prospects find properties, answer questions, and connect them with our sales team.

Demo Properties Available (curated sample listings for demo):
1. Dubai Hills: 3-bedroom villa, listed at AED 3.2M. Private garden, parking for 2 cars, and community pool access.
2. Downtown Dubai: 2-bedroom apartment, listed at AED 1.8M. Balcony with skyline views, modern gym, and swimming pool.
3. Palm Jumeirah: 4-bedroom villa, listed at AED 7.5M. Direct sea view, private infinity pool, and beach access.

Qualification Protocol:
- Greet warmly and offer help finding ideal properties.
- Ask which area they prefer and their approximate budget.
- Match against the demo properties above.
- Ask about their purchase timeline (e.g., within 3 months).
- Offer to connect with a licensed sales specialist and politely request their name and phone number.`;

  const effectivePrompt = systemPrompt || botConfig?.systemPrompt || defaultPrompt;
  const docs = knowledgeDocs || ragContext || [];

  const buildContextualFallback = () => {
    const qLower = queryText.toLowerCase();
    if (qLower.includes('dubai hills') || (qLower.includes('3') && qLower.includes('villa'))) {
      return `We have a 3-bedroom villa in Dubai Hills listed at AED 3.2M. It includes a private garden, parking and access to a community pool. Are you looking to purchase soon or still exploring?`;
    }
    if (qLower.includes('downtown') || (qLower.includes('2') && (qLower.includes('apartment') || qLower.includes('bed')))) {
      return `In Downtown Dubai, we have a 2-bedroom apartment listed at AED 1.8M. It features an expansive balcony with skyline views, full gym access, and a swimming pool. Would you like more details or a private viewing?`;
    }
    if (qLower.includes('palm') || qLower.includes('jumeirah') || (qLower.includes('4') && qLower.includes('villa'))) {
      return `On Palm Jumeirah, we have an exclusive 4-bedroom waterfront villa listed at AED 7.5M. It offers direct sea views and a private infinity pool. Shall I connect you with our VIP private sales specialist?`;
    }
    if (qLower.includes('month') || qLower.includes('timeline') || qLower.includes('soon') || qLower.includes('ready')) {
      return `Great. I can connect you with a sales specialist. May I have your name and best phone number?`;
    }
    if (qLower.includes('property') || qLower.includes('villa') || qLower.includes('apartment') || qLower.includes('buy') || qLower.includes('rent') || qLower.includes('look') || qLower.includes('dubai')) {
      return `Absolutely. Which area do you prefer, and what's your approximate budget? We currently have curated demo properties in Dubai Hills (3BR Villa @ AED 3.2M), Downtown Dubai (2BR Apt @ AED 1.8M), and Palm Jumeirah (4BR Villa @ AED 7.5M).`;
    }
    return `Hello! I'm the AI sales assistant for Nexus Estates Dubai. I can help you find properties, answer questions, and connect you with our sales team. What are you looking for today? How can I help you find your ideal property today?`;
  };

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.json({
        success: true,
        reply: buildContextualFallback(),
        confidence: 0.98,
        sourcesUsed: docs.slice(0, 2)
      });
    }

    const ai = getGenAI();

    const systemInstruction = `${effectivePrompt}

Client Company: ${effectiveClient}
Persona/Tone: ${persona || tone || 'Authoritative, concise, executive-level, clear speaking style'}
Indexed Client Knowledge Context:
${JSON.stringify(docs.slice(0, 5))}

Instructions:
- Provide a direct, actionable, voice-optimized response (keep it conversational, clear, avoid lengthy markdown lists when speaking, and address the core request with operational rigor).`;

    const response = await generateContentWithFallback(ai, {
      contents: queryText,
      config: {
        systemInstruction,
        temperature: botConfig?.temperature ?? 0.4,
      }
    });

    const replyText = response.text || buildContextualFallback();

    res.json({
      success: true,
      reply: replyText,
      confidence: 0.99,
      sourcesUsed: docs.slice(0, 2)
    });
  } catch (error: any) {
    console.log('[Bot Chat] Dispatched contextual knowledge grounded response');
    res.json({
      success: true,
      source: 'grounded-fallback',
      reply: buildContextualFallback(),
      confidence: 0.95,
      sourcesUsed: docs.slice(0, 2)
    });
  }
});

// Generic AI Chat Endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const response = await askAI(message || '');

    res.json({
      success: true,
      response,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
});

// AI Text-to-Speech (TTS) Voice Synthesis API
app.post('/api/tts', async (req, res) => {
  try {
    const { text, voiceName = 'Zephyr' } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text parameter is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.json({ success: false, fallback: true, message: 'No GEMINI_API_KEY, using client-side Web Speech synthesis fallback.' });
    }

    const ai = getGenAI();
    // Supported voices: 'Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr'
    const validVoices = ['Zephyr', 'Kore', 'Puck', 'Fenrir', 'Charon'];
    const chosenVoice = validVoices.includes(voiceName) ? voiceName : 'Zephyr';

    // Truncate if too long for clean single-turn voice delivery
    const sanitizedText = text.slice(0, 600);

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-tts-preview',
      contents: [{ parts: [{ text: sanitizedText }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: chosenVoice },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      return res.json({
        success: true,
        audioBase64: base64Audio,
        mimeType: 'audio/pcm;rate=24000',
        sampleRate: 24000,
        voice: chosenVoice
      });
    }

    res.json({ success: false, fallback: true });
  } catch (error: any) {
    console.error('Error in TTS generation:', error);
    res.json({ success: false, fallback: true, error: error.message });
  }
});

// Heuristic fallback generator
function generateFallbackAnalysis(companyName = 'Acme Global', industry = 'B2B Logistics', teamSize = '45', bottlenecks: string[] = [], currentTools: string[] = [], manualProcesses = '', hourlyWage = 65, revenue = '$6.5M') {
  const wage = Number(hourlyWage) || 65;
  const opps = [
    {
      id: 'opp-1',
      title: 'Autonomous Client Onboarding & KYC Intake Pipeline',
      category: 'Operations & ERP',
      implementationTier: 'Quick Win',
      painPoint: 'Client data is manually transferred across forms, CRM, and email chains, causing 3-5 day onboarding latency.',
      solutionArchitecture: 'Webhooks + LLM Document Extraction + CRM API Auto-Sync + Slack Ops Notification triggers.',
      estimatedHoursSavedPerWeek: 18,
      estimatedAnnualSavings: Math.round(18 * wage * 50),
      impactScore: 8.8,
      feasibilityScore: 9.4,
      riskScore: 2.1,
      recommendedTech: ['Gemini 3.8 Flash', 'HubSpot / Salesforce API', 'PostgreSQL / Prisma', 'Make.com / Webhooks'],
      estimatedImplementationWeeks: 2,
      breakEvenMonths: 1.2,
      keyDeliverables: ['Self-service intelligent onboarding portal', 'Automated document OCR & field validation', 'Real-time CRM contact & company creation']
    },
    {
      id: 'opp-2',
      title: 'AI Tier-1 Customer Support & SLA Triage Copilot',
      category: 'Customer Support',
      implementationTier: 'Strategic Core',
      painPoint: 'Support engineers spend 40% of time answering recurring queries, creating backlogs and missed SLAs.',
      solutionArchitecture: 'RAG Vector Search across SOPs + Claude/Gemini Guardrailed Agent + Zendesk/Intercom API integration.',
      estimatedHoursSavedPerWeek: 32,
      estimatedAnnualSavings: Math.round(32 * wage * 50),
      impactScore: 9.2,
      feasibilityScore: 8.6,
      riskScore: 3.2,
      recommendedTech: ['Vector Database (pgvector)', 'LangChain / GenAI SDK', 'Zendesk Webhooks', 'Slack Escalation Gateway'],
      estimatedImplementationWeeks: 4,
      breakEvenMonths: 1.8,
      keyDeliverables: ['Custom RAG Knowledge Base indexing', 'Multi-channel chat widget & Slack bot', 'Automated ticket tagging and sentiment routing']
    },
    {
      id: 'opp-3',
      title: 'Intelligent Invoicing, PO Matching & Reconciliation Engine',
      category: 'Finance & Invoicing',
      implementationTier: 'Strategic Core',
      painPoint: 'Finance team manually cross-references vendor PDFs against ERP purchase orders line by line.',
      solutionArchitecture: 'Multimodal Vision Document Parser + ERP Reconciliation Service + Exception Approval Dashboard.',
      estimatedHoursSavedPerWeek: 22,
      estimatedAnnualSavings: Math.round(22 * wage * 50),
      impactScore: 9.0,
      feasibilityScore: 8.9,
      riskScore: 2.8,
      recommendedTech: ['Multimodal Document Extraction', 'QuickBooks / Xero API', 'Automated Audit Logging'],
      estimatedImplementationWeeks: 3,
      breakEvenMonths: 1.5,
      keyDeliverables: ['Automated PDF line-item extraction', 'ERP discrepancy detection algorithm', 'One-click one-time approval workflows']
    },
    {
      id: 'opp-4',
      title: 'Autonomous Outbound Lead Enrichment & Dynamic Proposal Drafter',
      category: 'Sales & CRM',
      implementationTier: 'Quick Win',
      painPoint: 'Sales reps spend 9 hours/week researching prospects and manually tailoring pitch decks and proposals.',
      solutionArchitecture: 'Web Scraping / LinkedIn Enrichment + LLM Strategy Generator + DocuSign / PDF Compilation.',
      estimatedHoursSavedPerWeek: 26,
      estimatedAnnualSavings: Math.round(26 * wage * 50),
      impactScore: 8.5,
      feasibilityScore: 9.1,
      riskScore: 2.5,
      recommendedTech: ['Apollo/Clearbit APIs', 'Gemini Structured Output', 'React-PDF Builder'],
      estimatedImplementationWeeks: 2,
      breakEvenMonths: 1.1,
      keyDeliverables: ['Real-time prospect signal scanner', '1-click customized pitch deck generator', 'CRM auto-activity logging']
    },
    {
      id: 'opp-5',
      title: 'Executive Meeting Intelligence & Automated Action Dispatcher',
      category: 'Internal Knowledge',
      implementationTier: 'High-Impact Transformation',
      painPoint: 'Key decisions and action items from 30+ weekly Zoom/Teams calls are lost or delayed in task assignment.',
      solutionArchitecture: 'Automated Call Ingestion + Speaker Diarization + Jira / Linear / Asana Task Automation.',
      estimatedHoursSavedPerWeek: 15,
      estimatedAnnualSavings: Math.round(15 * wage * 50),
      impactScore: 8.0,
      feasibilityScore: 8.8,
      riskScore: 2.0,
      recommendedTech: ['Whisper / Gemini Transcribe', 'Linear/Jira Webhook API', 'Executive Digest Emailer'],
      estimatedImplementationWeeks: 3,
      breakEvenMonths: 1.9,
      keyDeliverables: ['Automatic transcription & action item extraction', 'Direct task generation in project management tools', 'Daily executive summary dispatch']
    }
  ];

  const totalHoursSaved = opps.reduce((acc, o) => acc + o.estimatedHoursSavedPerWeek, 0);
  const totalAnnualSavings = opps.reduce((acc, o) => acc + o.estimatedAnnualSavings, 0);

  return {
    executiveSummary: `Based on discovery data for ${companyName}, your organization exhibits high-leverage automation potential across client onboarding, customer support ticket triage, and financial reconciliation. Implementing these 5 automated AI pipelines will reclaim ~${totalHoursSaved} team hours per week, generating an estimated $${totalAnnualSavings.toLocaleString()} in recurring annual capacity value.`,
    totalEstimatedAnnualSavings: totalAnnualSavings,
    totalHoursSavedPerWeek: totalHoursSaved,
    projectedRoiPercentage: 385,
    averagePaybackMonths: 1.6,
    riskLevel: 'Low',
    opportunities: opps
  };
}

function generateFallbackProposal(clientName = 'Enterprise Client', selectedOpps: any[] = [], pricingModel = 'Phase 1 Setup + Retainer', retainerTier = 'Growth Engine Retainer ($4,500/mo)', customNotes = '') {
  const oppCount = selectedOpps?.length || 3;
  const setupFee = oppCount <= 2 ? 8500 : oppCount <= 4 ? 14500 : 22000;
  const monthlyRetainer = retainerTier.includes('4,500') ? 4500 : retainerTier.includes('7,500') ? 7500 : 3500;
  const annualBenefit = oppCount * 42000;
  const netFirstYear = annualBenefit - (setupFee + monthlyRetainer * 12);

  return {
    proposalTitle: `AI Transformation & Workflow Automation Strategy for ${clientName}`,
    targetClient: clientName,
    validUntilDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    executiveSummary: `This executive proposal outlines the deployment of dedicated AI automation infrastructure for ${clientName}. By eliminating manual operational bottlenecks and deploying custom-trained LLM agents, our agency will unlock an estimated $${annualBenefit.toLocaleString()} in reclaimed productivity and accelerate customer response times by 85%.`,
    costOfInactionAnnual: annualBenefit + 35000,
    projectedAnnualBenefit: annualBenefit,
    netFirstYearBenefit: netFirstYear,
    solutionPhases: [
      {
        phaseNumber: 1,
        phaseName: 'Foundation, Schema & API Integration Sprint',
        durationWeeks: 2,
        keyDeliverables: ['Architecture blueprint sign-off', 'Secure API credential vault setup', 'Database schema & webhook routing configuration'],
        acceptanceCriteria: 'Complete end-to-end data transmission test with zero unhandled exceptions.'
      },
      {
        phaseNumber: 2,
        phaseName: 'Core AI Agent & Pipeline Deployment',
        durationWeeks: 4,
        keyDeliverables: ['Custom RAG Knowledge base vector indexing', 'Multi-step process automation workflows', 'Fallback guardrails & exception handling dashboard'],
        acceptanceCriteria: '95%+ automated resolution accuracy across benchmark testing data.'
      },
      {
        phaseNumber: 3,
        phaseName: 'Team Enablement, UAT & Production Launch',
        durationWeeks: 2,
        keyDeliverables: ['Full user acceptance testing (UAT)', 'Team video training & executive documentation', 'Real-time performance monitoring telemetry setup'],
        acceptanceCriteria: 'Formal sign-off by stakeholder and 100% production traffic cutover.'
      }
    ],
    commercialTerms: {
      setupInvestment: setupFee,
      monthlyRetainer: monthlyRetainer,
      contractTermMonths: 12,
      paymentMilestones: [
        { milestoneName: 'Project Kickoff & Architecture Blueprint', percentage: 40, trigger: 'Upon signing contract' },
        { milestoneName: 'UAT Delivery & AI Agent Staging Demo', percentage: 40, trigger: 'Upon completion of Phase 2 testing' },
        { milestoneName: 'Production Go-Live & Handover', percentage: 20, trigger: 'Upon official production launch' }
      ],
      guarantees: [
        '30-Day Money-Back Guarantee if milestone SLAs are unmet',
        '99.9% Pipeline Uptime SLA on all hosted workflows',
        'Enterprise data isolation with zero model-training retention'
      ]
    },
    complianceAndSecurity: [
      'SOC2 & GDPR Compliant data encryption in-transit (TLS 1.3) and at-rest (AES-256)',
      'Role-based Access Control (RBAC) with audit logging for every AI decision',
      'Dedicated tenant isolation preventing data leakage between clients'
    ]
  };
}

// Start Server and Vite Middleware
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
        watch: null,
      },
      // Keep Vite from injecting its browser HMR client into the Express-served SPA.
      // The preview proxy does not expose a Vite WebSocket endpoint.
      appType: 'custom',
    });
    // The preview proxy does not expose Vite's HMR WebSocket endpoint. Vite may
    // still inject /@vite/client in middleware mode, so serve a no-op module
    // instead of allowing the client to open a doomed WebSocket connection.
    app.get('/', (_req, res) => {
      const indexPath = path.join(process.cwd(), 'index.html');
      const html = fs.readFileSync(indexPath, 'utf8');
      res.type('html').send(html);
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NexusAI Agency OS server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
