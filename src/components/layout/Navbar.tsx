import React from 'react';
import { 
  Building2, 
  Layers, 
  Users, 
  ClipboardList, 
  Sparkles, 
  Calculator, 
  FileText, 
  Bot, 
  Database, 
  UserCheck, 
  Globe,
  ChevronDown,
  ShieldCheck,
  Zap,
  ArrowRightLeft,
  Headphones,
  LogIn,
  Flame,
  CreditCard,
  MessageSquare,
  BookOpen
} from 'lucide-react';
import { ClientCompany } from '../../types';
import { UserButton, useUser } from '../auth/ClerkAuth';

interface NavbarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  currentRole: 'AGENCY_ADMIN' | 'CLIENT_EXEC';
  onToggleRole: () => void;
  clients: ClientCompany[];
  selectedClientId: string;
  onSelectClient: (id: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  currentRole,
  onToggleRole,
  clients,
  selectedClientId,
  onSelectClient
}) => {
  const { isSignedIn, user } = useUser();
  const selectedClient = clients.find(c => c.id === selectedClientId) || clients[0];

  const navItems = [
    { id: 'landing', label: 'Executive Overview', icon: Globe },
    { id: 'dashboard', label: 'Agency Dashboard', icon: Layers },
    { id: 'crm', label: 'Client CRM', icon: Users },
    { id: 'leads', label: 'Leads', icon: Flame, badge: 'HOT' },
    { id: 'conversations', label: 'Conversations', icon: MessageSquare },
    { id: 'knowledge', label: 'Knowledge Base', icon: BookOpen },
    { id: 'agency-admin', label: 'Agency Admin', icon: ShieldCheck, badge: 'TENANTS' },
    { id: 'onboarding', label: 'Discovery Intake', icon: ClipboardList },
    { id: 'analyzer', label: 'Process Analyzer', icon: Sparkles, badge: 'AI' },
    { id: 'roi', label: 'ROI Calculator', icon: Calculator },
    { id: 'pricing', label: 'Pricing Plans', icon: CreditCard, badge: '$99+' },
    { id: 'proposal', label: 'Proposal Builder', icon: FileText },
    { id: 'agent-studio', label: 'AI Agent Studio', icon: Bot },
    { id: 'talking-agent', label: 'Talking Agent', icon: Headphones, badge: 'VOICE' },
    { id: 'portal', label: 'Client Portal', icon: UserCheck },
    { id: 'sign-in', label: 'Auth & Login', icon: LogIn, badge: 'CLERK' },
    { id: 'schema', label: 'Prisma Schema', icon: Database },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#080808]/95 backdrop-blur-xl border-b border-white/5 no-print">
      {/* Top Banner with Agency & Tenant Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Agency Branding */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group" 
            onClick={() => onSelectTab('landing')}
          >
            <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20 ring-1 ring-white/20">
              N
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base font-semibold tracking-tight text-white">
                  NEXUSAI
                </span>
                <span className="px-1.5 py-0.5 text-[9px] font-mono font-medium uppercase tracking-widest bg-white/5 text-blue-400 border border-white/10 rounded">
                  Enterprise
                </span>
              </div>
              <p className="text-[10px] text-white/40 tracking-wide hidden sm:block">Multi-Tenant AI Operating System</p>
            </div>
          </div>

          {/* Center: Tenant Workspace Switcher */}
          <div className="hidden lg:flex items-center space-x-2 bg-white/[0.03] border border-white/10 rounded-lg px-2 py-1">
            <div className="flex items-center space-x-2 px-2 py-0.5 text-xs text-white/40 border-r border-white/5">
              <Building2 className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-[11px] uppercase tracking-wider">Client:</span>
            </div>
            <select
              value={selectedClientId}
              onChange={(e) => onSelectClient(e.target.value)}
              className="bg-transparent text-xs font-medium text-white/90 focus:outline-none cursor-pointer pr-3 py-0.5 hover:text-white"
            >
              {clients.map(client => (
                <option key={client.id} value={client.id} className="bg-[#0c0c0c] text-white">
                  {client.name} ({client.industry})
                </option>
              ))}
            </select>
          </div>

          {/* Right: Engine Indicator & Role Switcher */}
          <div className="flex items-center space-x-3">
            {/* Live Model Indicator */}
            <div className="hidden md:flex items-center space-x-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 text-xs font-medium text-white/60">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[11px] uppercase tracking-wider font-mono">Gemini 3.8 Flash Active</span>
            </div>

            {/* Role Simulation Switcher Button */}
            <button
              onClick={onToggleRole}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-medium text-white transition-all cursor-pointer"
              title="Toggle between Agency Administrator and Client Stakeholder Portal View"
            >
              <ArrowRightLeft className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-white/80">
                {currentRole === 'AGENCY_ADMIN' ? 'Agency Admin' : 'Client Exec'}
              </span>
            </button>

            {/* Clerk User Button / Profile */}
            <div className="flex items-center pl-1 border-l border-white/10">
              <UserButton />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Sub-Navigation Bar */}
      <div className="bg-[#050505] border-t border-white/5 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 py-1.5 min-w-max">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => onSelectTab(item.id)}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white/10 text-white font-medium border border-white/15 shadow-sm'
                      : 'text-white/50 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-400' : 'text-white/40'}`} />
                  <span className="tracking-tight">{item.label}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.2 text-[9px] font-mono uppercase tracking-wider font-semibold rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
