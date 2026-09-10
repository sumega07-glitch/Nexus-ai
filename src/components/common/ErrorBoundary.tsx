import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Terminal, Copy, Check, ShieldAlert } from 'lucide-react';

interface ErrorBoundaryProps {
  children?: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  copied: boolean;
  showDetails: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      copied: false,
      showDetails: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('[NexusAI ErrorBoundary] Captured runtime UI exception:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      copied: false,
      showDetails: false,
    });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  handleReload = (): void => {
    window.location.reload();
  };

  handleCopyDiagnostics = (): void => {
    const { error, errorInfo } = this.state;
    const diagnostics = `[NexusAI Exception Report]
Time: ${new Date().toISOString()}
Message: ${error?.message || 'Unknown Error'}
Stack: ${error?.stack || 'N/A'}
Component Stack: ${errorInfo?.componentStack || 'N/A'}
User Agent: ${navigator.userAgent}`;

    navigator.clipboard.writeText(diagnostics).then(() => {
      this.setState({ copied: true });
      setTimeout(() => this.setState({ copied: false }), 2000);
    }).catch(() => {
      // Fallback if clipboard API is restricted
      console.log(diagnostics);
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const errorMessage = this.state.error?.message || 'An unexpected application error occurred';
      const isWebSocketRelated = 
        errorMessage.toLowerCase().includes('websocket') || 
        errorMessage.toLowerCase().includes('ws') || 
        errorMessage.toLowerCase().includes('closed without opened');

      return (
        <div className="min-h-screen bg-[#050505] text-[#e5e7eb] flex items-center justify-center p-4 sm:p-6 font-sans select-none">
          <div className="w-full max-w-2xl bg-zinc-950/90 border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="flex items-start space-x-4 mb-6 relative">
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 shrink-0">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase tracking-widest text-rose-400 font-semibold">
                    Fault Isolation Shield Active
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500">
                    NexusAI Kernel v2.4
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Runtime Boundary Recovered
                </h1>
                <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
                  The application caught an unexpected UI runtime exception and prevented a system crash. Your data remains protected.
                </p>
              </div>
            </div>

            {/* Error Message Box */}
            <div className="mb-6 p-4 rounded-xl bg-black/60 border border-white/5 space-y-2">
              <div className="flex items-center space-x-2 text-xs text-zinc-400 font-medium">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Error Diagnosis:</span>
              </div>
              <p className="text-xs sm:text-sm font-mono text-rose-300 break-words pl-6">
                {errorMessage}
              </p>

              {isWebSocketRelated && (
                <div className="mt-2.5 pt-2.5 border-t border-white/5 text-[11px] text-amber-300/90 pl-6 flex items-start space-x-2">
                  <span>•</span>
                  <span>
                    Note: WebSocket/HMR connections in containerized sandboxes are benign and do not affect platform analytics or API persistence.
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
              <button
                id="error-boundary-retry-btn"
                type="button"
                onClick={this.handleReset}
                className="w-full sm:w-auto flex-1 inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs tracking-wider uppercase transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98] cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Recover UI Session</span>
              </button>

              <button
                id="error-boundary-reload-btn"
                type="button"
                onClick={this.handleReload}
                className="w-full sm:w-auto flex-1 inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-200 border border-white/10 font-medium text-xs tracking-wider uppercase transition-all active:scale-[0.98] cursor-pointer"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Reload Application</span>
              </button>

              <button
                id="error-boundary-copy-btn"
                type="button"
                onClick={this.handleCopyDiagnostics}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl bg-black/40 hover:bg-black/60 text-zinc-400 hover:text-white border border-white/5 font-mono text-xs transition-colors cursor-pointer"
                title="Copy technical diagnostic report to clipboard"
              >
                {this.state.copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Report</span>
                  </>
                )}
              </button>
            </div>

            {/* Expandable Technical Details */}
            <div className="border-t border-white/5 pt-4">
              <button
                type="button"
                onClick={() => this.setState(prev => ({ showDetails: !prev.showDetails }))}
                className="flex items-center space-x-2 text-[11px] font-mono text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>{this.state.showDetails ? 'Hide' : 'Inspect'} Technical Call Stack</span>
              </button>

              {this.state.showDetails && (
                <div className="mt-3 p-3 rounded-lg bg-black/80 border border-white/5 text-[10px] font-mono text-zinc-400 max-h-48 overflow-y-auto space-y-2 select-text">
                  <div>
                    <span className="text-zinc-500 block mb-0.5">Stack Trace:</span>
                    <pre className="whitespace-pre-wrap break-all text-zinc-300">
                      {this.state.error?.stack || 'No stack trace available'}
                    </pre>
                  </div>
                  {this.state.errorInfo?.componentStack && (
                    <div>
                      <span className="text-zinc-500 block mb-0.5">Component Trace:</span>
                      <pre className="whitespace-pre-wrap break-all text-zinc-400">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
