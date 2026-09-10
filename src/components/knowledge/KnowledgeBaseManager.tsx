import React, { useState } from 'react';
import { 
  Database, 
  Building2, 
  Home, 
  HelpCircle, 
  ShieldCheck, 
  Clock, 
  Plus, 
  Trash2, 
  FileText, 
  CheckCircle2, 
  Sparkles, 
  Search,
  MapPin,
  Coins,
  BedDouble,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { KnowledgeDocument, PropertyListing } from '../../types';
import { DEMO_PROPERTIES, MOCK_KNOWLEDGE_DOCS } from '../../data/mockData';

interface KnowledgeBaseManagerProps {
  knowledgeDocs?: KnowledgeDocument[];
  onAddDoc?: (doc: KnowledgeDocument) => void;
  onDeleteDoc?: (docId: string) => void;
}

export const KnowledgeBaseManager: React.FC<KnowledgeBaseManagerProps> = ({
  knowledgeDocs = MOCK_KNOWLEDGE_DOCS,
  onAddDoc = (_doc: KnowledgeDocument) => {},
  onDeleteDoc = (_docId: string) => {}
}) => {
  const [activeSection, setActiveSection] = useState<'COMPANY' | 'PROPERTIES' | 'FAQS' | 'RULES' | 'HOURS' | 'DOCS'>('PROPERTIES');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddDocModal, setShowAddDocModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<KnowledgeDocument['category']>('Product Catalog');
  const [newContent, setNewContent] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newDoc: KnowledgeDocument = {
      id: `doc_${Date.now()}`,
      clientId: 'client_acme',
      title: newTitle,
      category: newCategory,
      wordCount: newContent.split(/\s+/).length || 50,
      chunkCount: Math.ceil((newContent.length || 200) / 400),
      lastUpdated: new Date().toISOString().split('T')[0],
      contentSnippet: newContent,
      contentPreview: newContent,
      status: 'INDEXED'
    };

    onAddDoc(newDoc);
    setNewTitle('');
    setNewContent('');
    setShowAddDocModal(false);
  };

  const faqs = [
    {
      q: 'What is the property buying process in Dubai for foreign nationals?',
      a: 'Foreign buyers can purchase freehold properties in designated investment zones. The process involves selecting a property, signing a Memorandum of Understanding (Form F), placing a 10% security deposit with an escrow agent, obtaining a No Objection Certificate (NOC) from the master developer, and completing registration at the Dubai Land Department (DLD).'
    },
    {
      q: 'How does Nexus Estates Dubai verify purchase deposits?',
      a: 'All deposits are held in government-regulated RERA escrow accounts in compliance with UAE Federal Law. The AI sales assistant guides buyers on official escrow verification and connects them directly with licensed escrow advisors.'
    },
    {
      q: 'What is the agency commission rate?',
      a: 'Standard UAE real estate agency commission is 2% of the agreed purchase price (+ VAT), payable upon successful completion of title transfer at the Dubai Land Department.'
    },
    {
      q: 'Can buying a property qualify me for a UAE Golden Visa?',
      a: 'Yes. Investing AED 2 million or more in freehold property qualifies international investors for a renewable 10-year UAE Golden Visa, covering the investor, spouse, and dependents.'
    },
    {
      q: 'How do I book a private viewing for one of the listed properties?',
      a: 'Prospects can immediately request a viewing via the AI assistant. Our senior luxury brokers (Tariq Al-Mansoor and Layla Al-Hashemi) confirm chauffeur pickup and VIP access within 2 business hours.'
    }
  ];

  const qualificationRules = [
    {
      rule: 'Budget Qualification Threshold',
      description: 'Prospects must indicate a budget of at least AED 750,000 for off-plan apartments or AED 2.5M+ for luxury villas to be scored as QUALIFIED.',
      impact: 'Triggers CRM qualification badge'
    },
    {
      rule: 'Timeline to Purchase (HOT Flag)',
      description: 'If a buyer plans to purchase within 3 months, they are automatically tagged as HOT LEAD with instant broker SMS notification.',
      impact: 'Automated SMS dispatch to Tariq Al-Mansoor'
    },
    {
      rule: 'Inventory Spec Matching Protocol',
      description: 'The AI matches requested bedroom counts and amenities strictly against active inventory (Dubai Hills, Downtown, Palm Jumeirah).',
      impact: 'Prevents hallucination of unavailable floor plans'
    },
    {
      rule: 'Contact Verification',
      description: 'A lead is only marked CAPTURED once a verified phone number or email address is confirmed by the visitor.',
      impact: 'Ensures 100% actionable CRM pipeline'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 text-xs font-mono tracking-widest text-zinc-400 uppercase mb-1">
          <span className="font-bold text-white tracking-widest">NEXUSAI</span>
          <span>•</span>
          <span className="text-zinc-500">Grounded Real Estate Knowledge Base</span>
        </div>

        <div className="w-full h-px bg-white/10 my-3" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <span>KNOWLEDGE BASE</span>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-bold font-mono uppercase tracking-wider">
                RAG GROUNDED
              </span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1 font-light max-w-2xl">
              Curated inventory, company credentials, qualification rules, and legal FAQs that ground the NexusAI Sales Assistant to ensure zero hallucinations and 100% factual property advisory.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowAddDocModal(true)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center space-x-2 transition-all cursor-pointer shadow-lg shadow-blue-500/20"
            >
              <Plus className="w-4 h-4 text-white" />
              <span>Add Knowledge Document</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-white/10 pb-3 mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveSection('PROPERTIES')}
          className={`px-3.5 py-2 rounded-xl text-xs font-medium cursor-pointer transition-all flex items-center space-x-2 ${
            activeSection === 'PROPERTIES'
              ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40'
              : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>Property Listings (3 Demo)</span>
        </button>

        <button
          onClick={() => setActiveSection('COMPANY')}
          className={`px-3.5 py-2 rounded-xl text-xs font-medium cursor-pointer transition-all flex items-center space-x-2 ${
            activeSection === 'COMPANY'
              ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40'
              : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Company Info</span>
        </button>

        <button
          onClick={() => setActiveSection('FAQS')}
          className={`px-3.5 py-2 rounded-xl text-xs font-medium cursor-pointer transition-all flex items-center space-x-2 ${
            activeSection === 'FAQS'
              ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40'
              : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Buyer FAQs</span>
        </button>

        <button
          onClick={() => setActiveSection('RULES')}
          className={`px-3.5 py-2 rounded-xl text-xs font-medium cursor-pointer transition-all flex items-center space-x-2 ${
            activeSection === 'RULES'
              ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40'
              : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Qualification Rules</span>
        </button>

        <button
          onClick={() => setActiveSection('HOURS')}
          className={`px-3.5 py-2 rounded-xl text-xs font-medium cursor-pointer transition-all flex items-center space-x-2 ${
            activeSection === 'HOURS'
              ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40'
              : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Hours & Contacts</span>
        </button>

        <button
          onClick={() => setActiveSection('DOCS')}
          className={`px-3.5 py-2 rounded-xl text-xs font-medium cursor-pointer transition-all flex items-center space-x-2 ${
            activeSection === 'DOCS'
              ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40'
              : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>All Vector Docs ({knowledgeDocs.length})</span>
        </button>
      </div>

      {/* SECTION: PROPERTY LISTINGS */}
      {activeSection === 'PROPERTIES' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
              Curated Presentation Properties • Active Inventory
            </span>
            <span className="text-xs text-amber-400 font-mono bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20">
              Demo / Sample Property Listings
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {DEMO_PROPERTIES.map((prop) => (
              <div
                key={prop.id}
                className="rounded-2xl bg-zinc-950/80 border border-white/10 p-6 flex flex-col justify-between hover:border-white/20 transition-all shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase">
                      {prop.type}
                    </span>
                    <span className="text-xs font-bold text-amber-300 font-mono">
                      {prop.price}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">
                    {prop.title}
                  </h3>

                  <div className="flex items-center gap-2 text-xs text-zinc-400 mb-4 font-mono">
                    <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                    <span>{prop.location}</span>
                    <span>•</span>
                    <BedDouble className="w-3.5 h-3.5 text-zinc-500" />
                    <span>{prop.bedrooms} Bedrooms</span>
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed font-light mb-4">
                    {prop.description}
                  </p>

                  <div className="space-y-1.5 pt-3 border-t border-white/5">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">Key Amenities</span>
                    {prop.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-xs text-zinc-400">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                  <span>Status: Available</span>
                  <span className="text-emerald-400">Indexed for AI</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION: COMPANY INFO */}
      {activeSection === 'COMPANY' && (
        <div className="rounded-2xl bg-zinc-950/80 border border-white/10 p-6 md:p-8 space-y-6">
          <div className="flex items-center space-x-3 pb-6 border-b border-white/10">
            <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-xl font-mono">
              N
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Nexus Estates Dubai</h2>
              <p className="text-xs text-zinc-400 mt-0.5">Licensed Real Estate Brokerage & Luxury Advisory • Dubai, UAE</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="p-4 rounded-xl bg-zinc-900/50 border border-white/5">
              <span className="text-[10px] font-mono text-zinc-500 uppercase block">RERA License</span>
              <span className="text-sm font-semibold text-white mt-1 block">RERA-ORN #28914</span>
              <span className="text-[10px] text-emerald-400 mt-1 block">Active Freehold Brokerage</span>
            </div>
            <div className="p-4 rounded-xl bg-zinc-900/50 border border-white/5">
              <span className="text-[10px] font-mono text-zinc-500 uppercase block">Headquarters</span>
              <span className="text-sm font-semibold text-white mt-1 block">Emaar Square, Building 4</span>
              <span className="text-[10px] text-zinc-400 mt-1 block">Downtown Dubai, UAE</span>
            </div>
            <div className="p-4 rounded-xl bg-zinc-900/50 border border-white/5">
              <span className="text-[10px] font-mono text-zinc-500 uppercase block">Lead Broker Contact</span>
              <span className="text-sm font-semibold text-white mt-1 block">Tariq Al-Mansoor</span>
              <span className="text-[10px] text-blue-400 mt-1 block">tariq@nexusestates.ae</span>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white">Brokerage Profile & Positioning</h3>
            <p className="text-xs text-zinc-300 leading-relaxed font-light">
              Nexus Estates Dubai specializes in high-value residential acquisitions across Dubai Hills Estate, Downtown Dubai, and Palm Jumeirah. The firm caters to high-net-worth foreign individuals, family offices, and institutional investors seeking premium off-plan capital appreciation and high-yield prime rentals.
            </p>
            <p className="text-xs text-zinc-300 leading-relaxed font-light">
              By deploying NexusAI Operating System, Nexus Estates provides instantaneous, 24/7 multilingual qualification of prospective buyers, ensuring international buyers receive immediate responses regardless of time zone differences.
            </p>
          </div>
        </div>
      )}

      {/* SECTION: BUYER FAQS */}
      {activeSection === 'FAQS' && (
        <div className="space-y-4">
          <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2">
            Verified Legal, Escrow & Purchase FAQs Grounding AI Answers
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-zinc-950/80 border border-white/10 hover:border-white/20 transition-all"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    Q
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-white">
                      {faq.q}
                    </h4>
                    <p className="text-xs text-zinc-300 leading-relaxed font-light">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION: QUALIFICATION RULES */}
      {activeSection === 'RULES' && (
        <div className="space-y-4">
          <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2">
            AI Automated Lead Scoring & Triage Logic
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {qualificationRules.map((rule, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-zinc-950/80 border border-white/10 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    {rule.rule}
                  </h4>
                  <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
                    Active Rule
                  </span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed font-light">
                  {rule.description}
                </p>
                <div className="pt-2 border-t border-white/5 text-[11px] font-mono text-zinc-500">
                  Outcome: <span className="text-zinc-300">{rule.impact}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION: HOURS & CONTACTS */}
      {activeSection === 'HOURS' && (
        <div className="rounded-2xl bg-zinc-950/80 border border-white/10 p-6 md:p-8 space-y-6">
          <h3 className="text-lg font-bold text-white">Operating Hours & Brokerage Contacts</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="p-5 rounded-xl bg-zinc-900/50 border border-white/5 space-y-3">
              <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block">Physical Office Hours</span>
              <div className="space-y-1.5 text-zinc-300">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span>Sunday – Thursday</span>
                  <span className="font-semibold text-white">09:00 AM – 07:00 PM (GST)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span>Friday</span>
                  <span className="font-semibold text-white">10:00 AM – 04:00 PM (GST)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Saturday</span>
                  <span className="font-semibold text-zinc-400">By VIP Appointment Only</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-zinc-900/50 border border-white/5 space-y-3">
              <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block">Digital & AI Assistant Hours</span>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-emerald-400 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>24 Hours / 7 Days a Week Autonomous Intake</span>
                </div>
                <p className="text-zinc-400 font-light leading-relaxed">
                  Inbound inquiries through web widget, WhatsApp Business API, and portal integrations receive instant sub-60-second responses and qualification around the clock.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION: ALL VECTOR DOCS */}
      {activeSection === 'DOCS' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
              {knowledgeDocs.length} Indexed Knowledge Documents in RAG Vector Store
            </span>
          </div>

          <div className="space-y-3">
            {knowledgeDocs.map((doc) => (
              <div
                key={doc.id}
                className="p-4 rounded-xl bg-zinc-950/80 border border-white/10 hover:border-white/20 transition-all flex items-center justify-between gap-4"
              >
                <div className="flex items-start space-x-3">
                  <FileText className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-white">{doc.title}</h4>
                    <p className="text-xs text-zinc-400 line-clamp-2 mt-1 font-light">
                      {doc.contentPreview || doc.contentSnippet}
                    </p>
                    <div className="flex items-center space-x-3 text-[10px] font-mono text-zinc-500 mt-2">
                      <span>Category: {doc.category}</span>
                      <span>•</span>
                      <span>{doc.chunkCount} Chunks</span>
                      <span>•</span>
                      <span>Updated: {doc.lastUpdated}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    INDEXED
                  </span>
                  <button
                    onClick={() => onDeleteDoc(doc.id)}
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                    title="Remove document"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: ADD KNOWLEDGE DOCUMENT */}
      {showAddDocModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-zinc-950 border border-white/15 p-6 shadow-2xl relative">
            <h3 className="text-xl font-bold text-white mb-1">Add Knowledge Document</h3>
            <p className="text-xs text-zinc-400 mb-4">
              Ground the AI sales assistant with additional property listings, FAQs, or brokerage policies.
            </p>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-400 font-mono uppercase text-[10px] mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dubai Marina 2BR Luxury Penthouse"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-mono uppercase text-[10px] mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as KnowledgeDocument['category'])}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Product Catalog">Product Catalog / Property Listing</option>
                  <option value="SOP">SOP / Brokerage Protocol</option>
                  <option value="Policy & Compliance">Policy & Compliance / Legal</option>
                  <option value="Support FAQ">Support FAQ / Buyer Guide</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 font-mono uppercase text-[10px] mb-1">Content / Specs / Q&A</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Enter property details, pricing, bedrooms, amenities, or FAQ answer..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl p-3 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddDocModal(false)}
                  className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold cursor-pointer"
                >
                  Index into Vector Store
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
