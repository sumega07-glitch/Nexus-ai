import React, { useState } from 'react';
import { 
  MessageSquare, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  Phone, 
  Mail, 
  MapPin, 
  Home, 
  Coins, 
  Bot, 
  User, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  ExternalLink,
  ChevronRight,
  Flame
} from 'lucide-react';
import { RealEstateConversation, QualifiedLead } from '../../types';
import { DEMO_CONVERSATIONS, INITIAL_LEADS } from '../../data/mockData';

interface ConversationsManagerProps {
  conversations?: RealEstateConversation[];
  leads?: QualifiedLead[];
  onNavigateToStudio?: () => void;
  onNavigateToLeads?: () => void;
  onViewLead?: (leadId: string) => void;
}

export const ConversationsManager: React.FC<ConversationsManagerProps> = ({
  conversations: initialConversations = DEMO_CONVERSATIONS,
  leads = INITIAL_LEADS,
  onNavigateToStudio,
  onNavigateToLeads,
  onViewLead
}) => {
  const [conversations, setConversations] = useState<RealEstateConversation[]>(initialConversations || []);
  const [selectedConvId, setSelectedConvId] = useState<string>((initialConversations || [])[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'QUALIFIED' | 'IN_PROGRESS'>('ALL');
  const [handoffSuccessId, setHandoffSuccessId] = useState<string | null>(null);

  const safeConversations = conversations || [];
  const safeLeads = leads || [];
  const selectedConv = safeConversations.find(c => c.id === selectedConvId) || safeConversations[0];
  const matchingLead = safeLeads.find(l => l.conversationRef === selectedConv?.id || l.name === selectedConv?.visitorName);

  const filteredConversations = safeConversations.filter(conv => {
    const matchesSearch = 
      conv.visitorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (conv.location && conv.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (conv.propertyInterest && conv.propertyInterest.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (conv.visitorContact && conv.visitorContact.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (filterType === 'QUALIFIED') return conv.qualificationCompleted;
    if (filterType === 'IN_PROGRESS') return !conv.qualificationCompleted;
    return true;
  });

  const handleTriggerHandoff = (convId: string) => {
    setHandoffSuccessId(convId);
    setTimeout(() => {
      setHandoffSuccessId(null);
    }, 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 text-xs font-mono tracking-widest text-zinc-400 uppercase mb-1">
          <span className="font-bold text-white tracking-widest">NEXUSAI</span>
          <span>•</span>
          <span className="text-zinc-500">Autonomous Real Estate Dialogue Stream</span>
        </div>

        <div className="w-full h-px bg-white/10 my-3" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
                <span>CONVERSATIONS</span>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-bold font-mono uppercase tracking-wider">
                  24/7 AI DIALOGUES
                </span>
              </h1>
            </div>
            <p className="text-xs text-zinc-400 mt-1 font-light max-w-2xl">
              Inspect recent buyer inquiries handled autonomously by NexusAI Sales Assistant for Nexus Estates Dubai. View lead capture status, qualification state, and human broker handoffs.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            {onNavigateToStudio && (
              <button
                onClick={onNavigateToStudio}
                className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-medium flex items-center space-x-2 transition-all cursor-pointer"
              >
                <Bot className="w-4 h-4 text-blue-400" />
                <span>Test in Agent Studio</span>
              </button>
            )}
            {onNavigateToLeads && (
              <button
                onClick={onNavigateToLeads}
                className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center space-x-2 transition-all cursor-pointer"
              >
                <Flame className="w-4 h-4 text-amber-300" />
                <span>View Leads Dashboard</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-zinc-900/50 border border-white/5">
          <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Total Dialogues</div>
          <div className="text-2xl font-bold text-white mt-1">{conversations.length}</div>
          <div className="text-[10px] text-zinc-500 mt-1 font-mono">Sample Real Estate Stream</div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/50 border border-white/5">
          <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Leads Captured</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">
            {conversations.filter(c => c.leadCaptured).length} / {conversations.length}
          </div>
          <div className="text-[10px] text-emerald-400/80 mt-1 font-mono">100% Verified Phone/Email</div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/50 border border-white/5">
          <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Qualification Rate</div>
          <div className="text-2xl font-bold text-blue-400 mt-1">
            {Math.round((conversations.filter(c => c.qualificationCompleted).length / Math.max(1, conversations.length)) * 100)}%
          </div>
          <div className="text-[10px] text-zinc-500 mt-1 font-mono">Budget & Timeline extracted</div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/50 border border-white/5">
          <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Human Handoff Status</div>
          <div className="text-2xl font-bold text-amber-300 mt-1">
            {conversations.filter(c => c.humanHandoffAvailable).length} Ready
          </div>
          <div className="text-[10px] text-amber-400/80 mt-1 font-mono">Senior Luxury Broker on standby</div>
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Conversations List (4 cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          {/* Search & Filters */}
          <div className="space-y-3 bg-zinc-900/60 border border-white/10 rounded-2xl p-4">
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 font-light"
              />
            </div>

            <div className="flex items-center space-x-1.5 pt-1">
              <button
                onClick={() => setFilterType('ALL')}
                className={`px-3 py-1 rounded-lg text-xs font-mono cursor-pointer transition-colors ${
                  filterType === 'ALL'
                    ? 'bg-white/15 text-white border border-white/20'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                All ({conversations.length})
              </button>
              <button
                onClick={() => setFilterType('QUALIFIED')}
                className={`px-3 py-1 rounded-lg text-xs font-mono cursor-pointer transition-colors ${
                  filterType === 'QUALIFIED'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                Qualified ({conversations.filter(c => c.qualificationCompleted).length})
              </button>
              <button
                onClick={() => setFilterType('IN_PROGRESS')}
                className={`px-3 py-1 rounded-lg text-xs font-mono cursor-pointer transition-colors ${
                  filterType === 'IN_PROGRESS'
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                In Progress ({conversations.filter(c => !c.qualificationCompleted).length})
              </button>
            </div>
          </div>

          {/* Conversations Scrollable List */}
          <div className="space-y-2.5 max-h-[620px] overflow-y-auto pr-1">
            {filteredConversations.map((conv) => {
              const isSelected = conv.id === selectedConv?.id;
              return (
                <div
                  key={conv.id}
                  onClick={() => setSelectedConvId(conv.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer text-left ${
                    isSelected
                      ? 'bg-blue-600/10 border-blue-500/50 shadow-lg shadow-blue-500/5 ring-1 ring-blue-500/20'
                      : 'bg-zinc-950/70 border-white/5 hover:border-white/20 hover:bg-zinc-900/40'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-7 h-7 rounded-full bg-blue-500/20 text-blue-400 font-bold text-xs flex items-center justify-center font-mono">
                        {conv.visitorName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white tracking-tight">
                          {conv.visitorName}
                        </h4>
                        <span className="text-[10px] text-zinc-500 font-mono">{conv.startedAt}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end space-y-1">
                      {conv.qualificationCompleted ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          QUALIFIED
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-zinc-800 text-zinc-400 border border-white/10">
                          NEEDS INFO
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Criteria snippets */}
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-zinc-400 my-2">
                    {conv.location && (
                      <span className="flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded text-zinc-300">
                        <MapPin className="w-3 h-3 text-zinc-500" />
                        {conv.location}
                      </span>
                    )}
                    {conv.propertyInterest && (
                      <span className="flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded text-zinc-300">
                        <Home className="w-3 h-3 text-zinc-500" />
                        {conv.propertyInterest}
                      </span>
                    )}
                  </div>

                  {/* Last Message Snippet */}
                  <div className="text-xs text-zinc-400 font-light truncate mt-1">
                    {conv.messages[conv.messages.length - 1]?.text || 'Active conversation...'}
                  </div>

                  {/* Status Pills */}
                  <div className="flex items-center justify-between pt-3 mt-2 border-t border-white/5 text-[10px] font-mono">
                    <span className="flex items-center gap-1 text-emerald-400">
                      <CheckCircle2 className="w-3 h-3" />
                      Lead Captured
                    </span>
                    <span className="text-amber-400 flex items-center gap-1">
                      <UserCheck className="w-3 h-3" />
                      Ready for Agent
                    </span>
                  </div>
                </div>
              );
            })}

            {filteredConversations.length === 0 && (
              <div className="py-12 text-center rounded-2xl border border-dashed border-white/10 bg-zinc-950/40">
                <MessageSquare className="w-6 h-6 text-zinc-600 mx-auto mb-2" />
                <p className="text-xs text-zinc-400">No conversations match your search.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Full Conversation Transcript & Lead Summary (7 cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          {selectedConv ? (
            <div className="rounded-2xl bg-zinc-950/90 border border-white/10 p-6 flex flex-col h-full shadow-2xl backdrop-blur-xl">
              {/* Transcript Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/10">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-xl font-bold text-white">
                      {selectedConv.visitorName}
                    </h3>
                    {selectedConv.visitorContact && (
                      <span className="text-xs text-blue-400 font-mono bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                        {selectedConv.visitorContact}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400 mt-1 flex items-center gap-2">
                    <span>Started: {selectedConv.startedAt}</span>
                    <span>•</span>
                    <span>Nexus Estates Dubai Assistant</span>
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleTriggerHandoff(selectedConv.id)}
                    className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center space-x-2 transition-all cursor-pointer shadow-lg shadow-blue-500/20"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-white" />
                    <span>Handoff to Broker</span>
                  </button>
                </div>
              </div>

              {/* Toast for Handoff */}
              {handoffSuccessId === selectedConv.id && (
                <div className="my-3 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-medium flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Broker Tariq Al-Mansoor notified via WhatsApp & CRM dispatch.</span>
                </div>
              )}

              {/* Qualification Dossier Card */}
              <div className="my-4 p-4 rounded-xl bg-zinc-900/60 border border-white/5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-[10px] font-mono uppercase text-zinc-500 block">Property Interest</span>
                  <span className="font-semibold text-white mt-0.5 block">{selectedConv.propertyInterest || 'Pending'}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-zinc-500 block">Preferred Area</span>
                  <span className="font-semibold text-white mt-0.5 block">{selectedConv.location || 'Dubai Hills'}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-zinc-500 block">Lead Capture</span>
                  <span className="font-semibold text-emerald-400 mt-0.5 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Captured
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-zinc-500 block">Handoff Mode</span>
                  <span className="font-semibold text-amber-300 mt-0.5 flex items-center gap-1">
                    <UserCheck className="w-3 h-3" />
                    Ready for Agent
                  </span>
                </div>
              </div>

              {/* Chat Message Stream */}
              <div className="flex-1 overflow-y-auto space-y-3.5 py-4 max-h-[460px] pr-2">
                {selectedConv.messages.map((msg, index) => {
                  const isAssistant = msg.role === 'assistant';
                  return (
                    <div
                      key={index}
                      className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}
                    >
                      <div className="flex items-center space-x-1.5 text-[10px] font-mono text-zinc-500 mb-1">
                        {isAssistant ? (
                          <>
                            <Bot className="w-3 h-3 text-blue-400" />
                            <span>NexusAI Assistant</span>
                          </>
                        ) : (
                          <>
                            <span>{selectedConv.visitorName}</span>
                            <User className="w-3 h-3 text-emerald-400" />
                          </>
                        )}
                        <span>•</span>
                        <span>{msg.time}</span>
                      </div>

                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                          isAssistant
                            ? 'bg-zinc-900 border border-white/10 text-zinc-200'
                            : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Handoff Status Footer */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="font-mono text-[11px]">Audit log verified • AES-256 encrypted</span>
                </div>
                {matchingLead && onNavigateToLeads && (
                  <button
                    onClick={onNavigateToLeads}
                    className="text-blue-400 hover:text-blue-300 font-medium flex items-center space-x-1 cursor-pointer"
                  >
                    <span>View in Leads CRM</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full py-20 text-center rounded-2xl border border-dashed border-white/10 bg-zinc-950/40 flex flex-col items-center justify-center">
              <MessageSquare className="w-8 h-8 text-zinc-600 mb-2" />
              <p className="text-sm text-zinc-400">Select a conversation to inspect the dialogue history.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
