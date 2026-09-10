import React, { useState } from 'react';
import { 
  Bot, 
  UploadCloud, 
  Send, 
  FileText, 
  Sparkles, 
  Sliders, 
  Layers, 
  CheckCircle2, 
  Copy, 
  Check, 
  Key, 
  Code, 
  Trash2, 
  Plus, 
  RefreshCw, 
  Cpu, 
  AlertCircle, 
  Volume2, 
  VolumeX,
  Flame,
  Phone,
  Calendar,
  Coins,
  MapPin,
  Home,
  UserCheck,
  ShieldCheck,
  Globe
} from 'lucide-react';
import { BotConfig, KnowledgeDocument, ClientCompany, QualifiedLead } from '../../types';

interface AgentStudioProps {
  currentClient: ClientCompany;
  botConfig: BotConfig;
  knowledgeDocs: KnowledgeDocument[];
  onUpdateBotConfig: (updated: BotConfig) => void;
  onAddKnowledgeDoc: (doc: KnowledgeDocument) => void;
  onDeleteKnowledgeDoc: (docId: string) => void;
  onLeadCaptured?: (lead: QualifiedLead) => void;
}

export const AgentStudio: React.FC<AgentStudioProps> = ({
  currentClient,
  botConfig,
  knowledgeDocs = [],
  onUpdateBotConfig,
  onAddKnowledgeDoc,
  onDeleteKnowledgeDoc,
  onLeadCaptured
}) => {
  const [config, setConfig] = useState<BotConfig>({
    ...botConfig,
    name: 'NexusAI Sales Assistant',
    persona: 'Elite Real Estate Sales & Property Advisory Assistant',
    tone: 'Warm, consultative, executive-ready, and highly professional'
  });

  const [activeTab, setActiveTab] = useState<'PROMPT' | 'SETTINGS' | 'KNOWLEDGE' | 'DEPLOY'>('PROMPT');
  
  // Real Estate Configuration Settings
  const [selectedLanguage, setSelectedLanguage] = useState<'English' | 'Arabic' | 'Multilingual'>('English');
  const [qualificationThreshold, setQualificationThreshold] = useState<'STANDARD' | 'HIGH_BUDGET'>('STANDARD');
  const [selectedTone, setSelectedTone] = useState<'Consultative & Executive' | 'Warm & Friendly' | 'Direct & High-Paced'>('Consultative & Executive');

  // Lead Capture Event State
  const [capturedLeadPopup, setCapturedLeadPopup] = useState<QualifiedLead | null>(null);

  // Playground Chat State with Interactive Real Estate Demo Conversation
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; text: string; time: string }[]>([
    {
      role: 'assistant',
      text: "Hello! I'm the AI sales assistant for Nexus Estates Dubai. I can help you find properties, answer questions, and connect you with our sales team. What are you looking for today? How can I help you find your ideal property today?",
      time: '10:14 AM'
    },
    {
      role: 'user',
      text: "I'm looking for a 3-bedroom villa in Dubai.",
      time: '10:15 AM'
    },
    {
      role: 'assistant',
      text: "Absolutely. Which area do you prefer, and what's your approximate budget?",
      time: '10:15 AM'
    },
    {
      role: 'user',
      text: "Dubai Hills, around AED 3 million.",
      time: '10:16 AM'
    },
    {
      role: 'assistant',
      text: "We have a 3-bedroom villa in Dubai Hills listed at AED 3.2M. It includes a private garden, parking and access to a community pool. Are you looking to purchase soon or still exploring?",
      time: '10:16 AM'
    },
    {
      role: 'user',
      text: "Within 3 months.",
      time: '10:17 AM'
    },
    {
      role: 'assistant',
      text: "Great. I can connect you with a sales specialist. May I have your name and best phone number?",
      time: '10:17 AM'
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isBotThinking, setIsBotThinking] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);

  // Document Upload State
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocCategory, setNewDocCategory] = useState<KnowledgeDocument['category']>('SOP');
  const [newDocContent, setNewDocContent] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Suggested Test Queries
  const testQueries = [
    "I'm looking for a 3-bedroom villa in Dubai Hills.",
    "Do you have any 2-bedroom apartments in Downtown Dubai under 2M?",
    "Tell me about luxury waterfront villas in Palm Jumeirah.",
    "John Smith, +971 50 892 4410",
    "Can I schedule a private viewing with your sales specialist this week?"
  ];

  const [isSpeakingMsgId, setIsSpeakingMsgId] = useState<number | null>(null);

  const handleSpeakMessage = (text: string, idx: number) => {
    if ('speechSynthesis' in window) {
      if (isSpeakingMsgId === idx) {
        window.speechSynthesis.cancel();
        setIsSpeakingMsgId(null);
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.onstart = () => setIsSpeakingMsgId(idx);
      utterance.onend = () => setIsSpeakingMsgId(null);
      utterance.onerror = () => setIsSpeakingMsgId(null);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Lead Detection Helper
  const checkForLeadCapture = (text: string) => {
    const hasPhone = /(\+?\d[\d\s\-()]{7,}\d)/.test(text);
    const hasName = /(john|sarah|david|alex|michael|omar|tariq|emma|ali|fatima|smith|williams|brown)/i.test(text);

    if (hasPhone || (hasName && (text || '').length > 5)) {
      const detectedName = ((text || '').split(/[,;\n]/)[0] || '').replace(/[+0-9]/g, '').trim() || 'John Smith';
      const phoneMatch = (text || '').match(/(\+?\d[\d\s\-()]{7,}\d)/);
      const detectedPhone = phoneMatch ? phoneMatch[0].trim() : '+971 50 892 4410';

      const newLead: QualifiedLead = {
        id: `lead_${Date.now()}`,
        tenantId: 'nexus_estates_dubai',
        clientId: currentClient.id,
        clientName: currentClient.name,
        name: detectedName,
        phone: detectedPhone,
        email: `${(detectedName || 'lead').toLowerCase().replace(/\s+/g, '.')}@inboundlead.ae`,
        propertyInterest: '3 Bedroom Villa',
        propertyType: '3 Bedroom Villa',
        preferredLocation: 'Dubai Hills',
        location: 'Dubai Hills',
        bedrooms: 3,
        budget: 'AED 3.2M',
        timeline: 'Within 3 months',
        leadScore: 'HOT',
        score: 96,
        status: 'QUALIFIED',
        isHot: true,
        capturedAt: 'Just now',
        createdDate: 'Today',
        assignedBroker: 'Tariq Al-Mansoor (Senior Luxury Broker)',
        sourceChannel: 'AI Agent Studio Simulator',
        notes: `Autonomous lead capture in simulator: Buyer requested 3BR Villa in Dubai Hills. Budget AED 3.2M. Timeline 3 months.`
      };

      setCapturedLeadPopup(newLead);
      onLeadCaptured?.(newLead);
    }
  };

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputMessage;
    if (!textToSend.trim() || isBotThinking) return;

    const userMsg = {
      role: 'user' as const,
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!queryText) setInputMessage('');
    setIsBotThinking(true);

    // Check if user submitted contact details to fire lead capture
    checkForLeadCapture(textToSend);

    try {
      const response = await fetch('/api/chat-bot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: currentClient?.name || 'Nexus Estates Dubai',
          systemPrompt: config.systemPrompt,
          message: textToSend,
          persona: selectedTone,
          tone: selectedTone,
          knowledgeDocs: (knowledgeDocs || []).map(d => ({ title: d.title, content: d.contentPreview }))
        })
      });

      const data = await response.json();
      const botMsg = {
        role: 'assistant' as const,
        text: data.reply || "Thanks! I've recorded your inquiry for Nexus Estates Dubai. A luxury sales specialist will reach out shortly.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: `Thank you! I have recorded your details for our Dubai Hills 3BR Villa demo listing (AED 3.2M). Tariq Al-Mansoor from Nexus Estates Dubai will contact you shortly.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsBotThinking(false);
    }
  };

  const handleSaveConfig = () => {
    onUpdateBotConfig(config);
  };

  const handleCreateDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocTitle) return;

    setIsUploading(true);
    setTimeout(() => {
      const doc: KnowledgeDocument = {
        id: `doc_${Date.now()}`,
        clientId: currentClient.id,
        title: newDocTitle,
        category: newDocCategory,
        chunkCount: 14,
        status: 'INDEXED',
        lastUpdated: new Date().toISOString().split('T')[0],
        contentPreview: newDocContent || 'Grounded real estate specs and brokerage policies.'
      };

      onAddKnowledgeDoc(doc);
      setNewDocTitle('');
      setNewDocContent('');
      setIsUploading(false);
    }, 500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Preset & Metadata Header */}
      <div className="rounded-2xl bg-zinc-950/90 border border-white/10 p-6 md:p-7 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-white/10">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-blue-400 mb-1">
              <Bot className="w-4 h-4" />
              <span>Real Estate AI Agent Studio</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              NexusAI Sales Assistant
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Client: <strong className="text-white font-medium">Nexus Estates Dubai</strong> • Industry: <strong className="text-white font-medium">Real Estate</strong>
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                checkForLeadCapture('John Smith, +971 50 892 4410');
              }}
              className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>Simulate Lead Capture Event</span>
            </button>
          </div>
        </div>

        {/* Studio Presets Specs Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-5 text-xs">
          <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/5">
            <span className="text-[10px] font-mono uppercase text-zinc-500 block">Agent Name</span>
            <span className="font-semibold text-white mt-0.5 block">NexusAI Sales Assistant</span>
          </div>
          <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/5">
            <span className="text-[10px] font-mono uppercase text-zinc-500 block">Industry Preset</span>
            <span className="font-semibold text-white mt-0.5 block">Real Estate (Freehold & Off-Plan)</span>
          </div>
          <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/5">
            <span className="text-[10px] font-mono uppercase text-zinc-500 block">Client Target</span>
            <span className="font-semibold text-white mt-0.5 block">Nexus Estates Dubai</span>
          </div>
          <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/5">
            <span className="text-[10px] font-mono uppercase text-zinc-500 block">Primary Goal</span>
            <span className="font-semibold text-emerald-400 mt-0.5 block truncate">Inbound Lead Qualification & Appointment</span>
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center space-x-2 border-b border-white/10 pb-3">
        <button
          onClick={() => setActiveTab('PROMPT')}
          className={`px-3.5 py-2 rounded-xl text-xs font-medium cursor-pointer transition-all ${
            activeTab === 'PROMPT'
              ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40'
              : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          System Prompt & Preview
        </button>
        <button
          onClick={() => setActiveTab('SETTINGS')}
          className={`px-3.5 py-2 rounded-xl text-xs font-medium cursor-pointer transition-all ${
            activeTab === 'SETTINGS'
              ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40'
              : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          Configuration Settings
        </button>
        <button
          onClick={() => setActiveTab('KNOWLEDGE')}
          className={`px-3.5 py-2 rounded-xl text-xs font-medium cursor-pointer transition-all ${
            activeTab === 'KNOWLEDGE'
              ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40'
              : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          Vector Knowledge ({knowledgeDocs.length})
        </button>
        <button
          onClick={() => setActiveTab('DEPLOY')}
          className={`px-3.5 py-2 rounded-xl text-xs font-medium cursor-pointer transition-all ${
            activeTab === 'DEPLOY'
              ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40'
              : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          Channels & Embed Code
        </button>
      </div>

      {/* Main 2-Column Split: Config/Prompt (Left) vs Simulator (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (6 Cols) */}
        <div className="lg:col-span-6 rounded-2xl bg-zinc-950/90 border border-white/10 p-6 space-y-6 shadow-xl">
          
          {/* TAB 1: PROMPT */}
          {activeTab === 'PROMPT' && (
            <div className="space-y-5 text-xs">
              <div className="pb-3 border-b border-white/5 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold tracking-wide text-white">System Prompt Preview</h3>
                  <p className="text-zinc-400 text-[11px]">Real estate domain qualification rules and demo property guidance.</p>
                </div>
                <button
                  onClick={handleSaveConfig}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs uppercase tracking-wider cursor-pointer shadow-sm transition-colors"
                >
                  Save Prompt
                </button>
              </div>

              <div>
                <label className="block text-zinc-400 font-medium mb-1">System Instructions</label>
                <textarea
                  rows={12}
                  value={config.systemPrompt}
                  onChange={(e) => setConfig({ ...config, systemPrompt: e.target.value })}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl p-3 text-white font-mono text-[11px] focus:outline-none focus:border-blue-500 resize-none leading-relaxed"
                />
              </div>

              {/* Lead Capture Preview Box */}
              <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/5 space-y-2">
                <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  <span>Lead Capture Target Protocol</span>
                </span>
                <p className="text-zinc-400 text-[11px] leading-relaxed">
                  The AI extracts 5 mandatory criteria: <span className="text-white font-mono">Visitor Name</span>, <span className="text-white font-mono">Phone</span>, <span className="text-white font-mono">Location</span>, <span className="text-white font-mono">Budget</span>, and <span className="text-white font-mono">Purchase Timeline</span>. Once captured, a CRM lead is instantly minted.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: SETTINGS (Tone, Language, Qualification Threshold) */}
          {activeTab === 'SETTINGS' && (
            <div className="space-y-5 text-xs">
              <div className="pb-3 border-b border-white/5">
                <h3 className="text-sm font-semibold tracking-wide text-white">Configuration Settings</h3>
                <p className="text-zinc-400 text-[11px]">Tune language, conversational persona, and qualification rigor.</p>
              </div>

              <div>
                <label className="block text-zinc-400 font-medium mb-1">Agent Tone & Persona</label>
                <select
                  value={selectedTone}
                  onChange={(e) => setSelectedTone(e.target.value as any)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="Consultative & Executive">Consultative & Executive (Default for Luxury Real Estate)</option>
                  <option value="Warm & Friendly">Warm & Friendly (High-empathy residential advisory)</option>
                  <option value="Direct & High-Paced">Direct & High-Paced (Commercial & Fast off-plan sales)</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 font-medium mb-1">Primary Operating Language</label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value as any)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="English">English (International Foreign Investors)</option>
                  <option value="Arabic">Arabic (GCC & Regional Buyers)</option>
                  <option value="Multilingual">Multilingual Auto-Detect (English, Arabic, Russian, French)</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 font-medium mb-1">Qualification Threshold</label>
                <select
                  value={qualificationThreshold}
                  onChange={(e) => setQualificationThreshold(e.target.value as any)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="STANDARD">Standard Qualification (Captures All Verified Contact Inquiries)</option>
                  <option value="HIGH_BUDGET">High Budget Strict (Only AED 2M+ & Timeline ≤ 3 Months scored as Qualified)</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    handleSaveConfig();
                    alert('Settings updated successfully.');
                  }}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors cursor-pointer"
                >
                  Save Configuration Settings
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: KNOWLEDGE */}
          {activeTab === 'KNOWLEDGE' && (
            <div className="space-y-4 text-xs">
              <div className="pb-3 border-b border-white/5">
                <h3 className="text-sm font-semibold tracking-wide text-white">Knowledge Base Grounding</h3>
                <p className="text-zinc-400 text-[11px]">Documents indexed into pgvector for sub-second retrieval.</p>
              </div>

              <form onSubmit={handleCreateDocument} className="p-4 bg-zinc-900 border border-white/10 rounded-xl space-y-3">
                <span className="font-semibold text-white block text-xs">Index New Listing or Policy</span>
                <input
                  type="text"
                  required
                  placeholder="Document Title (e.g. Dubai Marina 2BR Penthouse)"
                  value={newDocTitle}
                  onChange={(e) => setNewDocTitle(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-white"
                />
                <textarea
                  rows={2}
                  placeholder="Property specs, pricing, payment plans..."
                  value={newDocContent}
                  onChange={(e) => setNewDocContent(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-white"
                />
                <button
                  type="submit"
                  disabled={isUploading}
                  className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold cursor-pointer"
                >
                  {isUploading ? 'Vectorizing...' : 'Upload & Index'}
                </button>
              </form>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {knowledgeDocs.map((doc) => (
                  <div key={doc.id} className="p-3 bg-zinc-900 border border-white/5 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-white">{doc.title}</div>
                      <div className="text-[10px] text-zinc-500 font-mono">{doc.category} • {doc.chunkCount} chunks</div>
                    </div>
                    <button
                      onClick={() => onDeleteKnowledgeDoc(doc.id)}
                      className="p-1 text-zinc-500 hover:text-rose-400 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: DEPLOY */}
          {activeTab === 'DEPLOY' && (
            <div className="space-y-4 text-xs">
              <div className="pb-3 border-b border-white/5">
                <h3 className="text-sm font-semibold tracking-wide text-white">Embed Code & Webhook</h3>
                <p className="text-zinc-400 text-[11px]">Deploy the NexusAI real estate widget on Nexus Estates website.</p>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Widget Script Tag</label>
                <pre className="bg-black/60 p-3 rounded-xl border border-white/10 text-[11px] font-mono text-zinc-300 overflow-x-auto">
{`<script 
  src="https://cdn.nexusai.agency/widget.js" 
  data-tenant-id="nexus_estates_dubai"
  data-agent="sales-assistant"
  async>
</script>`}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Working AI Conversation Simulator (6 Cols) */}
        <div className="lg:col-span-6 rounded-2xl bg-zinc-950/90 border border-white/10 p-6 flex flex-col justify-between h-[660px] shadow-2xl backdrop-blur-xl">
          {/* Header */}
          <div className="pb-3 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <h3 className="text-sm font-bold tracking-wide text-white">Working AI Conversation Simulator</h3>
            </div>
            <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
              Nexus Estates Dubai
            </span>
          </div>

          {/* Chat Messages Stream */}
          <div className="flex-1 overflow-y-auto py-4 space-y-3.5 pr-1">
            {messages.map((msg, i) => {
              const isAssistant = msg.role === 'assistant';

              return (
                <div
                  key={i}
                  className={`flex items-start space-x-2.5 ${isAssistant ? '' : 'flex-row-reverse space-x-reverse'}`}
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    isAssistant ? 'bg-blue-600/20 text-blue-400 font-mono text-xs border border-blue-500/30' : 'bg-blue-600 text-white'
                  }`}>
                    {isAssistant ? <Bot className="w-3.5 h-3.5 text-blue-400" /> : <span className="text-[10px] font-medium font-mono">You</span>}
                  </div>

                  <div className={`p-3.5 rounded-2xl text-xs max-w-[85%] leading-relaxed ${
                    isAssistant 
                      ? 'bg-zinc-900 border border-white/10 text-zinc-200' 
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-normal'
                  }`}>
                    <p>{msg.text}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className={`text-[9px] font-mono ${isAssistant ? 'text-zinc-500' : 'text-blue-200'}`}>
                        {msg.time}
                      </span>
                      {isAssistant && (
                        <button
                          onClick={() => handleSpeakMessage(msg.text, i)}
                          className="flex items-center space-x-1 text-[10px] text-blue-400 hover:text-blue-300 ml-2 cursor-pointer"
                          title="Read out loud"
                        >
                          {isSpeakingMsgId === i ? <VolumeX className="w-3 h-3 text-amber-400" /> : <Volume2 className="w-3 h-3" />}
                          <span>{isSpeakingMsgId === i ? 'Stop' : 'Voice'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {isBotThinking && (
              <div className="flex items-center space-x-2 text-xs text-blue-400 p-2 bg-zinc-900 rounded-lg border border-white/10 w-fit font-mono">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>AI Sales Assistant is typing...</span>
              </div>
            )}
          </div>

          {/* Quick Query Suggestions */}
          <div className="py-2 border-t border-white/10 flex flex-wrap gap-1.5">
            {testQueries.map((query, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(query)}
                className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-zinc-400 hover:text-white text-[10px] truncate max-w-[280px] cursor-pointer transition-colors font-mono"
              >
                {query}
              </button>
            ))}
          </div>

          {/* Chat Input Bar */}
          <div className="pt-3 border-t border-white/10 flex items-center space-x-2">
            <input
              type="text"
              placeholder="Test property inquiry or enter name and phone..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 font-light"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={isBotThinking || !inputMessage.trim()}
              className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium transition-all disabled:opacity-40 cursor-pointer shadow-lg shadow-blue-500/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* LEAD CAPTURE POPUP / NOTIFICATION EVENT (Section 13) */}
      {capturedLeadPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-2xl bg-zinc-950 border border-emerald-500/40 p-6 shadow-2xl relative shadow-emerald-500/10">
            {/* Pulsing indicator */}
            <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-emerald-400 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Lead Capture Event Triggered</span>
            </div>

            <h3 className="text-2xl font-black text-white tracking-tight mb-1">
              New Qualified Lead Captured!
            </h3>
            <p className="text-xs text-zinc-400 mb-5">
              The conversation has successfully qualified and captured this prospective buyer. This record is now synchronized to the Leads Dashboard.
            </p>

            {/* Summary Box */}
            <div className="p-4 rounded-xl bg-zinc-900 border border-white/10 space-y-2.5 text-xs mb-6">
              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="text-zinc-400">Name:</span>
                <span className="font-bold text-white text-sm">{capturedLeadPopup.name}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="text-zinc-400">Phone:</span>
                <span className="font-mono font-semibold text-white">{capturedLeadPopup.phone}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="text-zinc-400">Property:</span>
                <span className="font-semibold text-white">{capturedLeadPopup.propertyInterest}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="text-zinc-400">Budget:</span>
                <span className="font-mono font-bold text-amber-300">{capturedLeadPopup.budget}</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-zinc-400">Timeline:</span>
                <span className="font-semibold text-emerald-400">{capturedLeadPopup.timeline}</span>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setCapturedLeadPopup(null)}
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs uppercase tracking-wider cursor-pointer transition-all shadow-lg shadow-emerald-500/20"
              >
                Acknowledge & Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
