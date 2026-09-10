import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  LogOut, 
  User, 
  Building2, 
  Briefcase, 
  Eye, 
  EyeOff, 
  ChevronRight,
  Zap,
  KeyRound,
  ExternalLink
} from 'lucide-react';

export interface ClerkUser {
  id: string;
  fullName: string;
  firstName: string;
  lastName: string;
  imageUrl?: string;
  primaryEmailAddress: { emailAddress: string };
  role: 'AGENCY_ADMIN' | 'CLIENT_EXEC';
  organization: string;
  createdAt?: string;
}

interface ClerkContextType {
  user: ClerkUser | null;
  isSignedIn: boolean;
  isLoaded: boolean;
  authModal: 'sign-in' | 'sign-up' | null;
  openSignIn: () => void;
  openSignUp: () => void;
  closeAuthModal: () => void;
  signIn: (data: { email: string; password?: string; role?: 'AGENCY_ADMIN' | 'CLIENT_EXEC'; name?: string; org?: string }) => Promise<void>;
  signUp: (data: { name: string; email: string; password?: string; role: 'AGENCY_ADMIN' | 'CLIENT_EXEC'; org: string }) => Promise<void>;
  signOut: () => void;
  switchRole: (role: 'AGENCY_ADMIN' | 'CLIENT_EXEC') => void;
}

const ClerkContext = createContext<ClerkContextType | undefined>(undefined);

const DEFAULT_USERS: Record<string, ClerkUser> = {
  admin: {
    id: 'user_nexus_admin',
    fullName: 'Alex Vance',
    firstName: 'Alex',
    lastName: 'Vance',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    primaryEmailAddress: { emailAddress: 'alex.vance@nexusai.agency' },
    role: 'AGENCY_ADMIN',
    organization: 'NEXUSAI',
    createdAt: '2025-01-15'
  },
  client: {
    id: 'user_nexus_exec',
    fullName: 'Jane Doe',
    firstName: 'Jane',
    lastName: 'Doe',
    imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    primaryEmailAddress: { emailAddress: 'jane@nexusestates.ae' },
    role: 'CLIENT_EXEC',
    organization: 'Nexus Estates Dubai',
    createdAt: '2025-02-01'
  }
};

export const ClerkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<ClerkUser | null>(() => {
    const saved = localStorage.getItem('nexus_auth_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_USERS.admin;
      }
    }
    return DEFAULT_USERS.admin;
  });

  const [isLoaded, setIsLoaded] = useState(true);
  const [authModal, setAuthModal] = useState<'sign-in' | 'sign-up' | null>(null);

  useEffect(() => {
    if (user) {
      localStorage.setItem('nexus_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('nexus_auth_user');
    }
  }, [user]);

  const openSignIn = () => setAuthModal('sign-in');
  const openSignUp = () => setAuthModal('sign-up');
  const closeAuthModal = () => setAuthModal(null);

  const signIn = async (data: { email: string; password?: string; role?: 'AGENCY_ADMIN' | 'CLIENT_EXEC'; name?: string; org?: string }) => {
    await new Promise(r => setTimeout(r, 400));
    const safeEmail = data.email || 'user@nexusai.enterprise';
    const role = data.role || (safeEmail.toLowerCase().includes('estates') || safeEmail.toLowerCase().includes('client') ? 'CLIENT_EXEC' : 'AGENCY_ADMIN');
    const emailPrefix = safeEmail.split('@')[0] || 'User';
    const name = data.name || (emailPrefix.replace(/\./g, ' ').replace(/^./, str => str.toUpperCase())) || 'User';
    const parts = name.split(' ');
    const org = data.org || (role === 'AGENCY_ADMIN' ? 'NEXUSAI' : 'Nexus Estates Dubai');

    const newUser: ClerkUser = {
      id: `user_${Date.now()}`,
      fullName: name,
      firstName: parts[0] || name,
      lastName: parts.slice(1).join(' ') || '',
      primaryEmailAddress: { emailAddress: data.email },
      role,
      organization: org,
      imageUrl: role === 'AGENCY_ADMIN' ? DEFAULT_USERS.admin.imageUrl : DEFAULT_USERS.client.imageUrl
    };

    setUser(newUser);
    closeAuthModal();
  };

  const signUp = async (data: { name: string; email: string; password?: string; role: 'AGENCY_ADMIN' | 'CLIENT_EXEC'; org: string }) => {
    await new Promise(r => setTimeout(r, 450));
    const parts = data.name.split(' ');
    const newUser: ClerkUser = {
      id: `user_${Date.now()}`,
      fullName: data.name,
      firstName: parts[0] || data.name,
      lastName: parts.slice(1).join(' ') || '',
      primaryEmailAddress: { emailAddress: data.email },
      role: data.role,
      organization: data.org || (data.role === 'AGENCY_ADMIN' ? 'My Agency' : 'My Company'),
      imageUrl: DEFAULT_USERS.admin.imageUrl
    };

    setUser(newUser);
    closeAuthModal();
  };

  const signOut = () => {
    setUser(null);
    closeAuthModal();
  };

  const switchRole = (newRole: 'AGENCY_ADMIN' | 'CLIENT_EXEC') => {
    if (newRole === 'AGENCY_ADMIN') {
      setUser(DEFAULT_USERS.admin);
    } else {
      setUser(DEFAULT_USERS.client);
    }
  };

  return (
    <ClerkContext.Provider
      value={{
        user,
        isSignedIn: !!user,
        isLoaded,
        authModal,
        openSignIn,
        openSignUp,
        closeAuthModal,
        signIn,
        signUp,
        signOut,
        switchRole
      }}
    >
      {children}
    </ClerkContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(ClerkContext);
  if (!context) {
    throw new Error('useUser must be used within a ClerkProvider');
  }
  return {
    isLoaded: context.isLoaded,
    isSignedIn: context.isSignedIn,
    user: context.user
  };
};

export const useAuth = () => {
  const context = useContext(ClerkContext);
  if (!context) {
    throw new Error('useAuth must be used within a ClerkProvider');
  }
  return {
    isLoaded: context.isLoaded,
    isSignedIn: context.isSignedIn,
    userId: context.user?.id || null,
    sessionId: context.user ? `sess_${context.user.id}` : null,
    signOut: context.signOut,
    openSignIn: context.openSignIn,
    openSignUp: context.openSignUp,
    switchRole: context.switchRole
  };
};

// Social Google Button SVG
const GoogleIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.14 0 9.89 0 12s.45 3.86 1.24 5.42l4.04-3.15z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
    />
  </svg>
);

// Social GitHub Button SVG
const GithubIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

export const SignIn: React.FC<{ 
  onSuccess?: () => void;
  onNavigateSignUp?: () => void;
}> = ({ onSuccess, onNavigateSignUp }) => {
  const { signIn } = useContext(ClerkContext)!;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await signIn({ email, password });
      onSuccess?.();
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (role: 'AGENCY_ADMIN' | 'CLIENT_EXEC') => {
    setLoading(true);
    setError(null);
    try {
      if (role === 'AGENCY_ADMIN') {
        await signIn({
          email: 'alex.vance@nexusai.agency',
          name: 'Alex Vance',
          role: 'AGENCY_ADMIN',
          org: 'NEXUSAI'
        });
      } else {
        await signIn({
          email: 'jane@nexusestates.ae',
          name: 'Jane Doe',
          role: 'CLIENT_EXEC',
          org: 'Nexus Estates Dubai'
        });
      }
      onSuccess?.();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-zinc-950/90 backdrop-blur-2xl border border-zinc-800/90 rounded-2xl p-8 shadow-2xl relative overflow-hidden font-geist">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-xl flex items-center justify-center font-bold text-white text-lg shadow-lg shadow-blue-500/25 ring-1 ring-white/20">
          N
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Sign in to NEXUSAI</h1>
        <p className="text-xs text-zinc-400 mt-1.5">Multi-Tenant AI Operating System</p>
      </div>

      {/* Social OAuth Buttons */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          type="button"
          onClick={() => handleQuickDemo('AGENCY_ADMIN')}
          className="flex items-center justify-center gap-2 py-2.5 px-4 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 text-xs font-medium rounded-xl transition-all hover:border-zinc-700 cursor-pointer active:scale-98"
        >
          <GoogleIcon className="w-4 h-4" />
          <span>Google</span>
        </button>
        <button
          type="button"
          onClick={() => handleQuickDemo('CLIENT_EXEC')}
          className="flex items-center justify-center gap-2 py-2.5 px-4 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 text-xs font-medium rounded-xl transition-all hover:border-zinc-700 cursor-pointer active:scale-98"
        >
          <GithubIcon className="w-4 h-4 text-white" />
          <span>GitHub</span>
        </button>
      </div>

      {/* Divider */}
      <div className="relative flex items-center justify-center mb-6">
        <div className="border-t border-zinc-800 w-full"></div>
        <span className="bg-zinc-950 px-3 text-[11px] font-medium text-zinc-500 uppercase tracking-wider">
          or continue with email
        </span>
      </div>

      {/* Error alert */}
      {error && (
        <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-xs flex items-center gap-2">
          <span>{error}</span>
        </div>
      )}

      {/* Sign In Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1.5">Email address</label>
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@vanguard-ai.com"
              className="w-full pl-9 pr-4 py-2.5 bg-zinc-900/80 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-geist"
            />
            <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium text-zinc-300">Password</label>
            <button
              type="button"
              className="text-[11px] text-blue-400 hover:text-blue-300 transition-colors"
              onClick={() => alert('Demo Mode: Enter any password or click a quick-login button below.')}
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full pl-9 pr-10 py-2.5 bg-zinc-900/80 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-mono"
            />
            <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-zinc-500 hover:text-zinc-300"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-xs rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <>
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>

      {/* Demo Fast Login Box */}
      <div className="mt-6 pt-5 border-t border-zinc-800/80">
        <div className="text-[11px] uppercase tracking-wider text-zinc-500 font-semibold mb-2 text-center">
          One-Click Demo Access
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleQuickDemo('AGENCY_ADMIN')}
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800/80 text-left hover:border-blue-500/40 hover:bg-zinc-800/60 transition-all group cursor-pointer"
          >
            <div className="text-[11px] font-semibold text-white group-hover:text-blue-400">Alex Vance</div>
            <div className="text-[10px] text-zinc-500">Agency Admin</div>
          </button>
          <button
            type="button"
            onClick={() => handleQuickDemo('CLIENT_EXEC')}
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800/80 text-left hover:border-blue-500/40 hover:bg-zinc-800/60 transition-all group cursor-pointer"
          >
            <div className="text-[11px] font-semibold text-white group-hover:text-blue-400">Jane Doe</div>
            <div className="text-[10px] text-zinc-500">Client Executive</div>
          </button>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="mt-6 text-center text-xs text-zinc-500">
        Don't have an account?{' '}
        <button
          type="button"
          onClick={onNavigateSignUp}
          className="text-blue-400 hover:text-blue-300 font-medium transition-colors cursor-pointer"
        >
          Sign up
        </button>
      </div>

      {/* Security note */}
      <div className="mt-5 flex items-center justify-center gap-1.5 text-[10px] text-zinc-500 font-mono">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        <span>Secured with Clerk & JWT session tokens</span>
      </div>
    </div>
  );
};

export const SignUp: React.FC<{ 
  onSuccess?: () => void;
  onNavigateSignIn?: () => void;
}> = ({ onSuccess, onNavigateSignIn }) => {
  const { signUp } = useContext(ClerkContext)!;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [org, setOrg] = useState('');
  const [role, setRole] = useState<'AGENCY_ADMIN' | 'CLIENT_EXEC'>('AGENCY_ADMIN');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      setError('Please provide your name and email');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await signUp({ name, email, password, role, org: org || (role === 'AGENCY_ADMIN' ? 'Autonomous AI Agency' : 'Enterprise Client') });
      onSuccess?.();
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-zinc-950/90 backdrop-blur-2xl border border-zinc-800/90 rounded-2xl p-8 shadow-2xl relative overflow-hidden font-geist">
      <div className="text-center mb-6">
        <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-xl flex items-center justify-center font-bold text-white text-lg shadow-lg shadow-blue-500/25 ring-1 ring-white/20">
          N
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Create your account</h1>
        <p className="text-xs text-zinc-400 mt-1">Join the NEXUSAI Operating System</p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-xs">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1">Full Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Alex Vance"
            className="w-full px-3.5 py-2.5 bg-zinc-900/80 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1">Email address</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="alex@example.com"
            className="w-full px-3.5 py-2.5 bg-zinc-900/80 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1">Organization Name</label>
          <input
            type="text"
            value={org}
            onChange={(e) => setOrg(e.target.value)}
            placeholder="e.g. Apex Automations Inc."
            className="w-full px-3.5 py-2.5 bg-zinc-900/80 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1.5">Workspace Role</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setRole('AGENCY_ADMIN')}
              className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                role === 'AGENCY_ADMIN'
                  ? 'bg-blue-600/15 border-blue-500/60 text-white font-semibold'
                  : 'bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-blue-400" />
                <span>Agency Admin</span>
              </div>
              <p className="text-[10px] text-zinc-500 mt-1 font-normal">Full CRM & AI Studio control</p>
            </button>

            <button
              type="button"
              onClick={() => setRole('CLIENT_EXEC')}
              className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                role === 'CLIENT_EXEC'
                  ? 'bg-blue-600/15 border-blue-500/60 text-white font-semibold'
                  : 'bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>Client Exec</span>
              </div>
              <p className="text-[10px] text-zinc-500 mt-1 font-normal">Portal, Approvals & Voice</p>
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            className="w-full px-3.5 py-2.5 bg-zinc-900/80 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-mono"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-xs rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <>
              <span>Create Account</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>

      <div className="mt-5 text-center text-xs text-zinc-500">
        Already have an account?{' '}
        <button
          type="button"
          onClick={onNavigateSignIn}
          className="text-blue-400 hover:text-blue-300 font-medium transition-colors cursor-pointer"
        >
          Sign in
        </button>
      </div>
    </div>
  );
};

export const UserButton: React.FC = () => {
  const { user, signOut, openSignIn, switchRole } = useContext(ClerkContext)!;
  const [isOpen, setIsOpen] = useState(false);

  if (!user) {
    return (
      <button
        onClick={openSignIn}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-all shadow-md shadow-blue-500/20 cursor-pointer active:scale-95"
      >
        <User className="w-3.5 h-3.5" />
        <span>Sign In</span>
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 pr-2 rounded-full bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 text-xs font-medium text-white transition-all cursor-pointer ring-1 ring-white/10 hover:ring-white/20"
      >
        <img
          src={user.imageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
          alt={user.fullName}
          className="w-6 h-6 rounded-full object-cover ring-1 ring-blue-500/50"
          referrerPolicy="no-referrer"
        />
        <span className="hidden sm:inline text-[11px] font-medium text-zinc-200">
          {user.firstName}
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-zinc-950 border border-zinc-800/90 shadow-2xl p-4 z-50 text-left font-geist animate-in fade-in slide-in-from-top-2">
            {/* User Profile Info */}
            <div className="flex items-center gap-3 pb-3 border-b border-zinc-800/80">
              <img
                src={user.imageUrl}
                alt={user.fullName}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500/40"
                referrerPolicy="no-referrer"
              />
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-white truncate">{user.fullName}</p>
                <p className="text-[11px] text-zinc-400 truncate font-mono">{user.primaryEmailAddress.emailAddress}</p>
                <div className="mt-1 inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-500/15 border border-blue-500/30 text-[9px] font-mono uppercase tracking-wider text-blue-400 font-semibold">
                  {user.role === 'AGENCY_ADMIN' ? 'Agency Admin' : 'Client Exec'}
                </div>
              </div>
            </div>

            {/* Quick Switch Persona */}
            <div className="py-2 border-b border-zinc-800/80">
              <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold px-1 mb-1">
                Switch Identity
              </p>
              <button
                onClick={() => {
                  switchRole('AGENCY_ADMIN');
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                  user.role === 'AGENCY_ADMIN' ? 'bg-zinc-900 text-blue-400 font-semibold' : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'
                }`}
              >
                <span>Alex Vance (Agency)</span>
                {user.role === 'AGENCY_ADMIN' && <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />}
              </button>

              <button
                onClick={() => {
                  switchRole('CLIENT_EXEC');
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                  user.role === 'CLIENT_EXEC' ? 'bg-zinc-900 text-blue-400 font-semibold' : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'
                }`}
              >
                <span>Jane Doe (Nexus Estates Dubai)</span>
                {user.role === 'CLIENT_EXEC' && <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />}
              </button>
            </div>

            {/* Actions */}
            <div className="pt-2">
              <button
                onClick={() => {
                  signOut();
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Full Page components matching the user's snippet
export const SignInPage: React.FC<{ onNavigate?: (tab: string) => void }> = ({ onNavigate }) => {
  return (
    <div className="flex min-h-[calc(100vh-140px)] items-center justify-center p-6 sm:p-12 animate-in fade-in">
      <SignIn 
        onSuccess={() => onNavigate?.('dashboard')}
        onNavigateSignUp={() => onNavigate?.('sign-up')}
      />
    </div>
  );
};

export const SignUpPage: React.FC<{ onNavigate?: (tab: string) => void }> = ({ onNavigate }) => {
  return (
    <div className="flex min-h-[calc(100vh-140px)] items-center justify-center p-6 sm:p-12 animate-in fade-in">
      <SignUp 
        onSuccess={() => onNavigate?.('dashboard')}
        onNavigateSignIn={() => onNavigate?.('sign-in')}
      />
    </div>
  );
};
