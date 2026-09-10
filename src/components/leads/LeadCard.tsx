import React from 'react';
import { 
  Flame, 
  MapPin, 
  Home, 
  Coins, 
  Calendar, 
  CheckCircle2, 
  PhoneCall, 
  MessageSquare, 
  ArrowUpRight,
  UserCheck,
  Building2,
  Clock
} from 'lucide-react';
import { QualifiedLead } from '../../types';

interface LeadCardProps {
  lead: QualifiedLead;
  onContactSales: (lead: QualifiedLead) => void;
  onViewConversation: (lead: QualifiedLead) => void;
  variant?: 'full' | 'compact';
}

export const LeadCard: React.FC<LeadCardProps> = ({
  lead,
  onContactSales,
  onViewConversation,
  variant = 'full'
}) => {
  return (
    <div 
      id={`lead-card-${lead.id}`}
      className="relative rounded-2xl bg-gradient-to-b from-zinc-900/90 via-zinc-950/90 to-black border border-white/10 p-6 md:p-7 shadow-2xl backdrop-blur-xl transition-all hover:border-white/20 hover:shadow-orange-500/5 group"
    >
      {/* Glow highlight for Hot Leads */}
      {lead.isHot && (
        <div className="absolute -top-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />
      )}

      {/* Header Tag / Badge */}
      <div className="flex items-center justify-between gap-3 mb-5">
        {lead.isHot ? (
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-rose-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold tracking-wider uppercase animate-pulse">
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>🔥 HOT LEAD</span>
          </div>
        ) : (
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold tracking-wider uppercase">
            <UserCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>INBOUND LEAD</span>
          </div>
        )}

        <div className="flex items-center space-x-2 text-[11px] font-mono text-zinc-400">
          <Clock className="w-3 h-3 text-zinc-500" />
          <span>{lead.capturedAt}</span>
        </div>
      </div>

      {/* Lead Name */}
      <div className="mb-5 pb-4 border-b border-white/5">
        <h3 className="text-2xl font-bold tracking-tight text-white group-hover:text-white transition-colors">
          {lead.name}
        </h3>
        <p className="text-xs text-zinc-400 mt-1 flex items-center gap-2">
          <span>{lead.clientName}</span>
          {lead.sourceChannel && (
            <>
              <span className="text-zinc-600">•</span>
              <span className="text-zinc-500 font-mono text-[10px]">{lead.sourceChannel}</span>
            </>
          )}
        </p>
      </div>

      {/* Property Details Spec Grid */}
      <div className="space-y-2.5 mb-6 text-sm">
        {/* Preferred Location */}
        <div className="flex items-center justify-between text-zinc-300 py-1">
          <span className="text-xs text-zinc-400 flex items-center gap-2 font-medium">
            <MapPin className="w-4 h-4 text-zinc-400" />
            Location
          </span>
          <span className="font-semibold text-white tracking-wide">
            {lead.preferredLocation}
          </span>
        </div>

        {/* Property Type */}
        <div className="flex items-center justify-between text-zinc-300 py-1">
          <span className="text-xs text-zinc-400 flex items-center gap-2 font-medium">
            <Home className="w-4 h-4 text-zinc-400" />
            Property Type
          </span>
          <span className="font-semibold text-white">
            {lead.propertyType}
          </span>
        </div>

        {/* Budget */}
        <div className="flex items-center justify-between text-zinc-300 py-1">
          <span className="text-xs text-zinc-400 flex items-center gap-2 font-medium">
            <Coins className="w-4 h-4 text-amber-400/80" />
            Budget
          </span>
          <span className="font-bold text-amber-300 font-mono">
            {lead.budget}
          </span>
        </div>

        {/* Timeline */}
        <div className="flex items-center justify-between text-zinc-300 py-1">
          <span className="text-xs text-zinc-400 flex items-center gap-2 font-medium">
            <Calendar className="w-4 h-4 text-zinc-400" />
            Timeline
          </span>
          <span className="font-medium text-white">
            {lead.timeline}
          </span>
        </div>
      </div>

      {/* Status Row */}
      <div className="mb-6 p-3 rounded-xl bg-zinc-900/60 border border-white/5 flex items-center justify-between">
        <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider font-mono">
          Status:
        </span>
        <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold font-mono tracking-wider">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>{lead.status}</span>
        </div>
      </div>

      {/* Action Buttons: [Contact Sales] & [View Conversation] */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <button
          id={`contact-sales-btn-${lead.id}`}
          onClick={() => onContactSales(lead)}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/20 transition-all cursor-pointer group/btn"
        >
          <PhoneCall className="w-4 h-4 text-white transition-transform group-hover/btn:scale-110" />
          <span>Contact Sales</span>
        </button>

        <button
          id={`view-conversation-btn-${lead.id}`}
          onClick={() => onViewConversation(lead)}
          className="w-full py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/25 text-white/90 hover:text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center space-x-2 transition-all cursor-pointer"
        >
          <MessageSquare className="w-4 h-4 text-zinc-400" />
          <span>View Conversation</span>
        </button>
      </div>

      {/* Broker Assignment Footer note */}
      {lead.assignedBroker && (
        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
          <span>Assigned: {lead.assignedBroker.split(' (')[0]}</span>
          {lead.score && <span className="text-amber-400/90 font-bold">{lead.score}% AI Match</span>}
        </div>
      )}
    </div>
  );
};
