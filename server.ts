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
  const fallbackModels = ['gemini-3.6-flash', 'gemini-3.1-flash-lite', 'gemini-3.8-flash', 'gemini-flash-latest'];
  const requestedModel = config?.model;
  const isDeprecatedOrUnavailable = (m: string) => !m || m.includes('2.5') || m.includes('1.5') || m.includes('2.0') || m.includes('3.7');
  const modelsToTry: string[] = [];
  if (requestedModel && !isDeprecatedOrUnavailable(requestedModel)) modelsToTry.push(requestedModel);
  for (const m of fallbackModels) if (!modelsToTry.includes(m)) modelsToTry.push(m);
  let lastError: any = null;
  for (const model of modelsToTry) {
    try {
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error(`Model ${model} request timed out`)), 12000));
      const response: any = await Promise.race([
        ai.models.generateContent({ ...config, model }),
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
      return res.json({ success: true, source: 'heuristic', analysis: generateFallbackAnalysis(companyName, industry, teamSize, primaryBottlenecks, currentTools, manualProcesses, hourlyWageAvg, annualRevenue) });
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
            executiveSummary: { type: Type.STRING }, totalEstimatedAnnualSavings: { type: Type.NUMBER }, totalHoursSavedPerWeek: { type: Type.NUMBER }, projectedRoiPercentage: { type: Type.NUMBER }, averagePaybackMonths: { type: Type.NUMBER }, riskLevel: { type: Type.STRING },
            opportunities: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, title: { type: Type.STRING }, category: { type: Type.STRING }, implementationTier: { type: Type.STRING }, painPoint: { type: Type.STRING }, solutionArchitecture: { type: Type.STRING }, estimatedHoursSavedPerWeek: { type: Type.NUMBER }, estimatedAnnualSavings: { type: Type.NUMBER }, impactScore: { type: Type.NUMBER }, feasibilityScore: { type: Type.NUMBER }, riskScore: { type: Type.NUMBER }, recommendedTech: { type: Type.ARRAY, items: { type: Type.STRING } }, estimatedImplementationWeeks: { type: Type.NUMBER }, breakEvenMonths: { type: Type.NUMBER }, keyDeliverables: { type: Type.ARRAY, items: { type: Type.STRING } } }, required: ['id', 'title', 'category', 'implementationTier', 'painPoint', 'solutionArchitecture', 'estimatedHoursSavedPerWeek', 'estimatedAnnualSavings', 'impactScore', 'feasibilityScore', 'riskScore', 'recommendedTech', 'estimatedImplementationWeeks', 'breakEvenMonths'] } }
          },
          required: ['executiveSummary', 'totalEstimatedAnnualSavings', 'totalHoursSavedPerWeek', 'projectedRoiPercentage', 'averagePaybackMonths', 'opportunities']
        }
      }
    });
    const parsed = JSON.parse(response.text || '{}');
    res.json({ success: true, source: 'gemini', analysis: parsed });
  } catch (error: any) {
    res.json({ success: true, source: 'heuristic-resilient', analysis: generateFallbackAnalysis(req.body.companyName, req.body.industry, req.body.teamSize, req.body.primaryBottlenecks, req.body.currentTools, req.body.manualProcesses, req.body.hourlyWageAvg, req.body.annualRevenue) });
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
    if (!apiKey) return res.json({ success: true, source: 'heuristic', proposal: generateFallbackProposal(clientName, selectedOpportunities, pricingModel, retainerTier, customNotes) });
    const ai = getGenAI();
    const prompt = `You are a Partner at an elite Enterprise AI & Automation Consultancy.
Generate a comprehensive, high-converting B2B Strategy & Implementation Proposal for:
Client: ${clientName}
Pricing Model: ${pricingModel}
Selected Automation Modules: ${JSON.stringify(selectedOpportunities)}
Retainer Tier: ${retainerTier}
Custom Context & Directives: ${customNotes || 'Focus on rapid time-to-value, zero disruption to existing team, and dedicated SLA.'}`;
    const response = await generateContentWithFallback(ai, { contents: prompt, config: { responseMimeType: 'application/json' } });
    const parsed = JSON.parse(response.text || '{}');
    if (!parsed.title && parsed.proposalTitle) parsed.title = parsed.proposalTitle;
    res.json({ success: true, source: 'gemini', proposal: parsed });
  } catch (error: any) {
    res.json({ success: true, source: 'heuristic-resilient', proposal: generateFallbackProposal(clientName, selectedOpportunities, pricingModel, retainerTier, customNotes) });
  }
});

// AI Bot Playground API
app.post(['/api/bot/chat', '/api/chat-bot'], async (req, res) => {
  const { clientName, systemPrompt, message, knowledgeDocs, botConfig, userMessage, ragContext } = req.body;
  const queryText = message || userMessage || 'Hello, what properties are available?';
  const effectiveClient = clientName || botConfig?.clientName || 'Nexus Estates Dubai';
  const defaultPrompt = `You are the AI sales assistant for ${effectiveClient}. You help prospects find properties, answer questions, and connect them with our sales team.`;
  const effectivePrompt = systemPrompt || botConfig?.systemPrompt || defaultPrompt;
  const docs = knowledgeDocs || ragContext || [];
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.json({ success: true, source: 'heuristic', reply: `Thanks for your message: "${queryText}"` });
    const ai = getGenAI();
    const response: any = await generateContentWithFallback(ai, { model: 'gemini-flash-latest', contents: `${effectivePrompt}\n\nKnowledge: ${JSON.stringify(docs)}\n\nUser: ${queryText}`, config: {} });
    res.json({ success: true, source: 'gemini', reply: response.text || 'I am ready to help.' });
  } catch (error: any) {
    res.json({ success: true, source: 'heuristic-resilient', reply: `Thanks for your message: "${queryText}"` });
  }
});

function generateFallbackAnalysis(companyName = 'Enterprise Client', industry = 'B2B Services', teamSize = '25-50', primaryBottlenecks: any[] = [], currentTools: any[] = [], manualProcesses = '', hourlyWageAvg = 65, annualRevenue = '$5M - $10M') {
  const opps = [
    { id: 'opp-1', title: 'AI Customer Support Triage', category: 'Customer Support', implementationTier: 'Quick Win', painPoint: 'Manual support triage', solutionArchitecture: 'AI classifier with CRM routing', estimatedHoursSavedPerWeek: 18, estimatedAnnualSavings: Number(hourlyWageAvg || 65) * 18 * 52, impactScore: 9, feasibilityScore: 9, riskScore: 2, recommendedTech: ['LLM', 'CRM API', 'Workflow Automation'], estimatedImplementationWeeks: 2, breakEvenMonths: 1.5, keyDeliverables: ['Triage agent', 'Routing workflow'] },
    { id: 'opp-2', title: 'Lead Qualification Automation', category: 'Sales & CRM', implementationTier: 'Quick Win', painPoint: 'Manual lead qualification', solutionArchitecture: 'AI lead scoring and CRM enrichment', estimatedHoursSavedPerWeek: 15, estimatedAnnualSavings: Number(hourlyWageAvg || 65) * 15 * 52, impactScore: 9, feasibilityScore: 8, riskScore: 2, recommendedTech: ['LLM', 'CRM', 'Webhooks'], estimatedImplementationWeeks: 3, breakEvenMonths: 2, keyDeliverables: ['Lead scorer', 'CRM automation'] },
    { id: 'opp-3', title: 'Document Intelligence Pipeline', category: 'Document Intelligence', implementationTier: 'Strategic Core', painPoint: 'Manual document processing', solutionArchitecture: 'Document extraction and validation pipeline', estimatedHoursSavedPerWeek: 12, estimatedAnnualSavings: Number(hourlyWageAvg || 65) * 12 * 52, impactScore: 8, feasibilityScore: 8, riskScore: 3, recommendedTech: ['OCR', 'LLM', 'Workflow Automation'], estimatedImplementationWeeks: 4, breakEvenMonths: 2.5, keyDeliverables: ['Extraction pipeline', 'Validation rules'] }
  ];
  const totalHours = opps.reduce((sum, o) => sum + o.estimatedHoursSavedPerWeek, 0);
  const totalSavings = opps.reduce((sum, o) => sum + o.estimatedAnnualSavings, 0);
  return { executiveSummary: `${companyName} can reduce repetitive operational work through targeted AI automation.`, totalEstimatedAnnualSavings: totalSavings, totalHoursSavedPerWeek: totalHours, projectedRoiPercentage: 250, averagePaybackMonths: 2, riskLevel: 'Low', opportunities: opps };
}

function generateFallbackProposal(clientName = 'Enterprise Client', selectedOpps: any[] = [], pricingModel = 'Phase 1 Setup + Retainer', retainerTier = 'Growth Engine Retainer ($4,500/mo)', customNotes = '') {
  const oppCount = selectedOpps?.length || 3;
  const setupFee = oppCount <= 2 ? 8500 : oppCount <= 4 ? 14500 : 22000;
  const monthlyRetainer = retainerTier.includes('4,500') ? 4500 : retainerTier.includes('7,500') ? 7500 : 3500;
  const annualBenefit = oppCount * 42000;
  const netFirstYear = annualBenefit - (setupFee + monthlyRetainer * 12);
  return { proposalTitle: `AI Transformation & Workflow Automation Strategy for ${clientName}`, targetClient: clientName, validUntilDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }), executiveSummary: `This executive proposal outlines the deployment of dedicated AI automation infrastructure for ${clientName}.`, costOfInactionAnnual: annualBenefit + 35000, projectedAnnualBenefit: annualBenefit, netFirstYearBenefit: netFirstYear, solutionPhases: [], commercialTerms: { setupInvestment: setupFee, monthlyRetainer, contractTermMonths: 12, paymentMilestones: [], guarantees: [] }, complianceAndSecurity: [] };
}

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false, watch: null },
      appType: 'spa',
    });

    app.use(vite.middlewares);

    app.get('*', async (req, res, next) => {
      try {
        const indexPath = path.join(process.cwd(), 'index.html');
        let html = fs.readFileSync(indexPath, 'utf8');
        html = await vite.transformIndexHtml(req.originalUrl, html);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => res.sendFile(path.join(distPath, 'index.html')));
  }
  app.listen(PORT, '0.0.0.0', () => console.log(`NexusAI Agency OS server running at http://0.0.0.0:${PORT}`));
}

startServer();
