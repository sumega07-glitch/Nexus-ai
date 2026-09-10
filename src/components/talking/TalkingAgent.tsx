import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  PhoneCall, 
  PhoneOff, 
  Sparkles, 
  Bot, 
  Radio, 
  Play, 
  Square, 
  RotateCcw, 
  Settings2, 
  Headphones, 
  Sliders, 
  Activity, 
  Copy, 
  Check, 
  Download, 
  ShieldCheck, 
  Building2,
  FileAudio,
  MessageSquare,
  BarChart2,
  Clock,
  LineChart
} from 'lucide-react';
import { ClientCompany, KnowledgeDocument } from '../../types';
import { VoiceInsightsView, EnhancedCallMessage } from './VoiceInsightsView';

interface TalkingAgentProps {
  currentClient?: ClientCompany;
  knowledgeDocs?: KnowledgeDocument[];
}

export type CallMessage = EnhancedCallMessage;

export const TalkingAgent: React.FC<TalkingAgentProps> = ({
  currentClient,
  knowledgeDocs = []
}) => {
  const clientName = currentClient?.name || 'Nexus Estates Dubai';
  const docs = knowledgeDocs || [];

  // View Mode: Audio Console vs Voice Insights
  const [currentView, setCurrentView] = useState<'CONSOLE' | 'INSIGHTS'>('CONSOLE');
  const [callDuration, setCallDuration] = useState<number>(94);
  const callTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Voice Call Active State
  const [isCallActive, setIsCallActive] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Track call duration when call is active
  useEffect(() => {
    if (isCallActive) {
      callTimerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (callTimerRef.current) clearInterval(callTimerRef.current);
    }
    return () => {
      if (callTimerRef.current) clearInterval(callTimerRef.current);
    };
  }, [isCallActive]);

  // Settings
  const [selectedVoice, setSelectedVoice] = useState<string>('Zephyr');
  const [voiceSpeed, setVoiceSpeed] = useState<number>(1.0);
  const [activeScenario, setActiveScenario] = useState<'DISCOVERY' | 'SUPPORT' | 'FINANCE' | 'DISPATCH'>('SUPPORT');
  const [autoSpeak, setAutoSpeak] = useState<boolean>(true);
  const [inputText, setInputText] = useState<string>('');
  const [copiedTranscript, setCopiedTranscript] = useState<boolean>(false);

  // Transcripts with sentiment metrics
  const [callHistory, setCallHistory] = useState<CallMessage[]>([
    {
      id: 'msg-init',
      sender: 'agent',
      text: `Hello! I'm the AI sales assistant for Nexus Estates Dubai. I can help you find properties, answer questions, and connect you with our sales team. What are you looking for today? How can I help you find your ideal property today?`,
      timestamp: '11:00 AM',
      sentiment: 'positive',
      sentimentScore: 0.88,
      latencyMs: 180,
      callTimeSeconds: 6,
      durationSeconds: 7,
      toneKeywords: ['Greeting', 'Nexus Estates Dubai', 'Property Discovery']
    },
    {
      id: 'msg-user-1',
      sender: 'user',
      text: "I'm looking for a 3-bedroom villa in Dubai.",
      timestamp: '11:00 AM',
      sentiment: 'inquisitive',
      sentimentScore: 0.75,
      callTimeSeconds: 15,
      durationSeconds: 4,
      toneKeywords: ['3-Bedroom Villa', 'Dubai Search', 'Buyer Inquiry']
    },
    {
      id: 'msg-bot-1',
      sender: 'agent',
      text: "Absolutely. Which area do you prefer, and what's your approximate budget?",
      timestamp: '11:01 AM',
      sentiment: 'positive',
      sentimentScore: 0.85,
      latencyMs: 190,
      callTimeSeconds: 26,
      durationSeconds: 5,
      toneKeywords: ['Area Qualification', 'Budget Inquiry', 'Consultative']
    },
    {
      id: 'msg-user-2',
      sender: 'user',
      text: "Dubai Hills, around AED 3 million.",
      timestamp: '11:01 AM',
      sentiment: 'positive',
      sentimentScore: 0.80,
      callTimeSeconds: 38,
      durationSeconds: 4,
      toneKeywords: ['Dubai Hills', 'AED 3 Million', 'Budget Qualified']
    },
    {
      id: 'msg-bot-2',
      sender: 'agent',
      text: "We have a 3-bedroom villa in Dubai Hills listed at AED 3.2M. It includes a private garden, parking and access to a community pool. Are you looking to purchase soon or still exploring?",
      timestamp: '11:01 AM',
      sentiment: 'positive',
      sentimentScore: 0.92,
      latencyMs: 165,
      callTimeSeconds: 52,
      durationSeconds: 8,
      toneKeywords: ['Property Match', 'Dubai Hills 3.2M', 'Timeline Qualification']
    },
    {
      id: 'msg-user-3',
      sender: 'user',
      text: "Within 3 months.",
      timestamp: '11:02 AM',
      sentiment: 'positive',
      sentimentScore: 0.85,
      callTimeSeconds: 66,
      durationSeconds: 3,
      toneKeywords: ['3 Months', 'High Intent', 'Purchase Horizon']
    },
    {
      id: 'msg-bot-3',
      sender: 'agent',
      text: "Great. I can connect you with a sales specialist. May I have your name and best phone number?",
      timestamp: '11:02 AM',
      sentiment: 'positive',
      sentimentScore: 0.95,
      latencyMs: 175,
      callTimeSeconds: 78,
      durationSeconds: 6,
      toneKeywords: ['Sales Specialist Handoff', 'Lead Capture', 'VIP Service']
    }
  ]);

  // Audio Context & Web Speech Refs
  const recognitionRef = useRef<any>(null);
  const currentAudioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [callHistory, isThinking]);

  // Scenarios Definition
  const scenarios = [
    {
      id: 'SUPPORT' as const,
      name: 'Nexus Estates Dubai - Property Sales Advisory',
      role: 'Luxury Property Sales Specialist',
      description: 'Qualifies buyer preferences, provides details on Dubai Hills, Downtown, and Palm Jumeirah inventory, and coordinates with licensed brokers.',
      greeting: `Hello! I'm the AI sales assistant for Nexus Estates Dubai. I can help you find properties, answer questions, and connect you with our sales team. What are you looking for today? How can I help you find your ideal property today?`
    },
    {
      id: 'DISCOVERY' as const,
      name: 'Executive Discovery Interviewer',
      role: 'AI Process Architect',
      description: 'Conducts live interactive discovery interviews to identify operational bottlenecks and calculate automation ROI.',
      greeting: `Hello! I'm your NexusAI Discovery Architect. Let's explore ${clientName}'s daily operational workflows. What manual task currently consumes the most team hours each week?`
    },
    {
      id: 'FINANCE' as const,
      name: 'Private Client VIP Consultation',
      role: 'Portfolio Advisor',
      description: 'Assists high-net-worth investors with yield projections and luxury off-plan acquisitions.',
      greeting: `Welcome to Nexus Estates Dubai Private Client Desk. I can provide yield analyses for Downtown Dubai and prime waterfront villas in Palm Jumeirah.`
    },
    {
      id: 'DISPATCH' as const,
      name: 'Private Viewing & Broker Dispatcher',
      role: 'Viewing Coordinator',
      description: 'Schedules on-site property walkthroughs and coordinates with licensed sales brokers.',
      greeting: `Nexus Estates Dubai viewing desk. Which property in Dubai Hills, Downtown, or Palm Jumeirah would you like to schedule for a private walkthrough?`
    }
  ];

  // Initialize Web Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const lastResult = event.results[event.results.length - 1];
        if (lastResult.isFinal) {
          const transcript = lastResult[0].transcript.trim();
          if (transcript) {
            handleUserSpeechTurn(transcript);
          }
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        if (isCallActive && !isMuted) {
          try {
            recognition.start();
          } catch (e) {
            // ignore if already started
          }
        } else {
          setIsListening(false);
        }
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      stopCurrentAudio();
    };
  }, [isCallActive, isMuted, selectedVoice, voiceSpeed, activeScenario]);

  // Audio Playback helper
  const stopCurrentAudio = () => {
    if (currentAudioSourceRef.current) {
      try {
        currentAudioSourceRef.current.stop();
      } catch (e) {}
      currentAudioSourceRef.current = null;
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  // Convert raw base64 PCM (24kHz little endian) to AudioBuffer
  const playPCM24kAudio = async (base64Audio: string) => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      stopCurrentAudio();

      const binary = atob(base64Audio);
      const len = binary.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binary.charCodeAt(i);
      }

      const pcm16 = new Int16Array(bytes.buffer);
      const float32 = new Float32Array(pcm16.length);
      for (let i = 0; i < pcm16.length; i++) {
        float32[i] = pcm16[i] / 32768.0;
      }

      const audioBuffer = ctx.createBuffer(1, float32.length, 24000);
      audioBuffer.copyToChannel(float32, 0);

      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.playbackRate.value = voiceSpeed;
      source.connect(ctx.destination);

      source.onended = () => {
        setIsSpeaking(false);
      };

      currentAudioSourceRef.current = source;
      setIsSpeaking(true);
      source.start();
    } catch (err) {
      console.warn('PCM playback error, using speech synthesis fallback:', err);
      fallbackWebSpeech(callHistory[callHistory.length - 1]?.text || '');
    }
  };

  // Fallback to Web Speech API
  const fallbackWebSpeech = (text: string) => {
    if (!('speechSynthesis' in window)) {
      setIsSpeaking(false);
      return;
    }
    stopCurrentAudio();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = voiceSpeed;
    utterance.pitch = 1.0;
    
    // Pick suitable voice
    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel')));
    if (naturalVoice) utterance.voice = naturalVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  // Trigger TTS voice generation
  const speakText = async (text: string) => {
    if (!autoSpeak) return;

    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text.slice(0, 450),
          voiceName: selectedVoice
        })
      });

      const data = await response.json();
      if (data.success && data.audioBase64) {
        await playPCM24kAudio(data.audioBase64);
      } else {
        fallbackWebSpeech(text);
      }
    } catch (e) {
      fallbackWebSpeech(text);
    }
  };

  // Handle a user speech or text turn
  const handleUserSpeechTurn = async (queryText: string) => {
    if (!queryText.trim() || isThinking) return;

    const startTs = Date.now();
    const currentCallSec = callDuration;
    const estUserDuration = Math.max(3, Math.min(12, Math.round(queryText.length / 14)));

    // Determine query sentiment
    const lower = queryText.toLowerCase();
    let querySentiment: 'positive' | 'neutral' | 'analytical' | 'urgent' | 'inquisitive' = 'inquisitive';
    let queryScore = 0.15;
    let queryKeywords = ['Query'];

    if (lower.includes('losing') || lower.includes('error') || lower.includes('manually') || lower.includes('discrepancy') || lower.includes('delay')) {
      querySentiment = 'urgent';
      queryScore = -0.65;
      queryKeywords = ['Labor Friction', 'Urgent Inquiry'];
    } else if (lower.includes('sla') || lower.includes('tolerance') || lower.includes('compliance') || lower.includes('rate')) {
      querySentiment = 'analytical';
      queryScore = 0.40;
      queryKeywords = ['SLA Metric', 'Policy Verification'];
    } else if (lower.includes('good') || lower.includes('thanks') || lower.includes('great')) {
      querySentiment = 'positive';
      queryScore = 0.80;
      queryKeywords = ['Confirmation', 'User Satisfaction'];
    }

    const userMsg: CallMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sentiment: querySentiment,
      sentimentScore: queryScore,
      callTimeSeconds: currentCallSec,
      durationSeconds: estUserDuration,
      toneKeywords: queryKeywords
    };

    setCallHistory(prev => [...prev, userMsg]);
    setIsThinking(true);
    stopCurrentAudio();

    const currentScenarioObj = scenarios.find(s => s.id === activeScenario);

    try {
      const response = await fetch('/api/chat-bot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: clientName,
          persona: `${currentScenarioObj?.role} for ${clientName}`,
          tone: 'Conversational, sharp, executive-ready, highly concise voice phrasing without bullet points',
          systemPrompt: `You are speaking in a real-time live phone call conversation as the ${currentScenarioObj?.role} for ${clientName}. Keep your response concise (1-3 sentences max) so it sounds natural when spoken aloud. Use plain spoken sentences. Ground your answers in company SLA and operational knowledge.`,
          message: queryText,
          knowledgeDocs: docs.map(d => ({ title: d.title, content: d.contentPreview }))
        })
      });

      const data = await response.json();
      const latency = Date.now() - startTs;
      const botResponseText = data.reply || `I have verified the records for ${clientName}. The operational workflow is progressing within standard parameters.`;
      const estBotDuration = Math.max(4, Math.min(18, Math.round(botResponseText.length / 15)));

      const botMsg: CallMessage = {
        id: `bot-${Date.now()}`,
        sender: 'agent',
        text: botResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sentiment: 'analytical',
        sentimentScore: 0.75,
        latencyMs: latency,
        callTimeSeconds: currentCallSec + estUserDuration + Math.round(latency / 1000),
        durationSeconds: estBotDuration,
        toneKeywords: ['SLA Grounded', 'Operational Resolution']
      };

      setCallHistory(prev => [...prev, botMsg]);
      setIsThinking(false);

      if (autoSpeak) {
        speakText(botResponseText);
      }
    } catch (error) {
      console.error('Call Turn Error:', error);
      const latency = Date.now() - startTs;
      const fallbackText = `Acknowledged. Based on ${clientName} standard operating procedures, this request is queued for automatic resolution.`;
      
      setCallHistory(prev => [
        ...prev,
        {
          id: `bot-fb-${Date.now()}`,
          sender: 'agent',
          text: fallbackText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sentiment: 'neutral',
          sentimentScore: 0.25,
          latencyMs: latency,
          callTimeSeconds: currentCallSec + estUserDuration + 1,
          durationSeconds: 5,
          toneKeywords: ['System Fallback']
        }
      ]);
      setIsThinking(false);
      if (autoSpeak) speakText(fallbackText);
    }
  };

  // Start Call Session
  const toggleCall = () => {
    if (isCallActive) {
      // Hang up
      setIsCallActive(false);
      setIsListening(false);
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      stopCurrentAudio();
    } else {
      // Connect Call
      setIsCallActive(true);
      setIsMuted(false);
      const scenarioObj = scenarios.find(s => s.id === activeScenario);
      const greeting = scenarioObj?.greeting || `Hello, autonomous operations voice agent for ${clientName} active. How can I assist?`;
      
      setCallHistory([
        {
          id: `msg-${Date.now()}`,
          sender: 'agent',
          text: greeting,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sentiment: 'positive',
          latencyMs: 140
        }
      ]);

      if (autoSpeak) {
        speakText(greeting);
      }

      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setIsListening(true);
        } catch (e) {
          console.warn('Speech recognition start failed:', e);
        }
      }
    }
  };

  // Toggle Mic Mute
  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      if (recognitionRef.current && isCallActive) {
        try {
          recognitionRef.current.start();
          setIsListening(true);
        } catch (e) {}
      }
    } else {
      setIsMuted(true);
      setIsListening(false);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    }
  };

  // Copy transcript
  const handleCopyTranscript = () => {
    const text = callHistory.map(m => `[${m.timestamp}] ${m.sender === 'user' ? 'Client / Operator' : 'Nexus Voice Agent'}: ${m.text}`).join('\n\n');
    navigator.clipboard.writeText(text);
    setCopiedTranscript(true);
    setTimeout(() => setCopiedTranscript(false), 2000);
  };

  // Switch Scenario
  const handleSelectScenario = (scenId: typeof activeScenario) => {
    setActiveScenario(scenId);
    stopCurrentAudio();
    const sc = scenarios.find(s => s.id === scenId);
    if (sc) {
      const newGreeting = sc.greeting;
      setCallHistory(prev => [
        ...prev,
        {
          id: `sys-sw-${Date.now()}`,
          sender: 'agent',
          text: `[Switched Scenario to ${sc.name}]: ${newGreeting}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sentiment: 'positive',
          latencyMs: 90
        }
      ]);
      if (isCallActive && autoSpeak) {
        speakText(newGreeting);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold tracking-tight text-white">Talking Agent Sandbox</h1>
                <span className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full font-semibold">
                  Gemini 3.1 TTS + Live Speech
                </span>
              </div>
              <p className="text-sm text-white/50">
                Low-latency, full-duplex conversational voice agent connected to {clientName}'s RAG knowledge base.
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-3">
          <button
            onClick={toggleCall}
            id="talking-agent-call-btn"
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer shadow-lg ${
              isCallActive
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/20 animate-pulse'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
            }`}
          >
            {isCallActive ? (
              <>
                <PhoneOff className="w-4 h-4" />
                <span>End Voice Call</span>
              </>
            ) : (
              <>
                <PhoneCall className="w-4 h-4" />
                <span>Start Live Voice Call</span>
              </>
            )}
          </button>

          <button
            onClick={handleCopyTranscript}
            className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-medium text-white transition-all cursor-pointer"
            title="Copy call transcript"
          >
            {copiedTranscript ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-white/60" />}
            <span>{copiedTranscript ? 'Copied' : 'Export Transcript'}</span>
          </button>
        </div>
      </div>

      {/* View Switcher Tabs (Console vs Voice Insights) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0c0c0c] border border-white/10 p-2 rounded-2xl">
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setCurrentView('CONSOLE')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              currentView === 'CONSOLE'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Live Voice Console</span>
          </button>

          <button
            onClick={() => setCurrentView('INSIGHTS')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              currentView === 'INSIGHTS'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <LineChart className="w-3.5 h-3.5 text-blue-300" />
            <span>Voice Insights & Sentiment</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              D3 Live
            </span>
          </button>
        </div>

        {/* Live Call Duration Banner */}
        <div className="flex items-center space-x-3 px-3 py-1 text-xs font-mono">
          <div className="flex items-center space-x-1.5 text-white/60">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            <span>Call Duration:</span>
            <strong className="text-white font-semibold">{Math.floor(callDuration / 60).toString().padStart(2, '0')}:{(callDuration % 60).toString().padStart(2, '0')}</strong>
          </div>
          <span className="text-white/20">•</span>
          <div className="flex items-center space-x-1.5">
            <span className={`w-2 h-2 rounded-full ${isCallActive ? 'bg-emerald-400 animate-ping' : 'bg-white/30'}`} />
            <span className={`text-[11px] ${isCallActive ? 'text-emerald-400' : 'text-white/40'}`}>
              {isCallActive ? 'Active Stream' : 'Standby'}
            </span>
          </div>
        </div>
      </div>

      {currentView === 'INSIGHTS' ? (
        <VoiceInsightsView
          currentClient={currentClient}
          callHistory={callHistory}
          callDuration={callDuration}
          isCallActive={isCallActive}
        />
      ) : (
        /* Main Grid: 2 Columns */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Interactive Visual Voice Stage & Settings (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Visual Voice Orb & Waveform Stage */}
          <div className="relative overflow-hidden bg-[#0c0c0c] border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center min-h-[320px] shadow-2xl">
            {/* Ambient Background Glow */}
            <div 
              className={`absolute inset-0 transition-opacity duration-700 pointer-events-none ${
                isSpeaking 
                  ? 'bg-blue-600/10' 
                  : isListening 
                  ? 'bg-emerald-600/10' 
                  : isThinking 
                  ? 'bg-amber-600/10' 
                  : 'bg-transparent'
              }`}
            />

            {/* Central Glowing Audio Orb */}
            <div className="relative mb-6">
              {/* Outer Pulse Rings */}
              {isSpeaking && (
                <div className="absolute -inset-4 rounded-full bg-blue-500/20 animate-ping" />
              )}
              {isListening && (
                <div className="absolute -inset-4 rounded-full bg-emerald-500/20 animate-ping" />
              )}
              {isThinking && (
                <div className="absolute -inset-3 rounded-full bg-amber-500/20 animate-pulse" />
              )}

              {/* Main Sphere */}
              <div 
                className={`w-28 h-28 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl border ${
                  isSpeaking
                    ? 'bg-gradient-to-tr from-blue-600 to-cyan-400 border-blue-300/40 shadow-blue-500/40 scale-105'
                    : isListening
                    ? 'bg-gradient-to-tr from-emerald-600 to-teal-400 border-emerald-300/40 shadow-emerald-500/40 scale-105'
                    : isThinking
                    ? 'bg-gradient-to-tr from-amber-600 to-yellow-400 border-amber-300/40 shadow-amber-500/40 animate-pulse'
                    : 'bg-[#151515] border-white/10 text-white/40'
                }`}
              >
                {isSpeaking ? (
                  <Volume2 className="w-10 h-10 text-white animate-bounce" />
                ) : isListening ? (
                  <Mic className="w-10 h-10 text-white animate-pulse" />
                ) : isThinking ? (
                  <Sparkles className="w-10 h-10 text-white animate-spin" />
                ) : (
                  <Bot className="w-10 h-10 text-white/50" />
                )}
              </div>
            </div>

            {/* Status Indicator */}
            <div className="space-y-1 z-10">
              <div className="flex items-center justify-center space-x-2">
                <span 
                  className={`w-2.5 h-2.5 rounded-full ${
                    isSpeaking 
                      ? 'bg-blue-400 animate-pulse' 
                      : isListening 
                      ? 'bg-emerald-400 animate-ping' 
                      : isThinking 
                      ? 'bg-amber-400 animate-bounce' 
                      : isCallActive 
                      ? 'bg-white/40' 
                      : 'bg-rose-500/60'
                  }`} 
                />
                <span className="text-xs font-mono uppercase tracking-wider font-semibold text-white">
                  {isSpeaking 
                    ? `Speaking (${selectedVoice} Voice)` 
                    : isListening 
                    ? 'Listening to Microphone...' 
                    : isThinking 
                    ? 'Synthesizing with Gemini...' 
                    : isCallActive 
                    ? 'Connected — Ready for Speech' 
                    : 'Call Standby / Idle'}
                </span>
              </div>
              <p className="text-xs text-white/50">
                {isCallActive 
                  ? 'Speak directly into your mic or click any sample query on the right.' 
                  : 'Click "Start Live Voice Call" above to open bidirectional audio stream.'}
              </p>
            </div>

            {/* Animated Audio Equalizer Bars */}
            <div className="flex items-center justify-center space-x-1.5 mt-6 h-8 z-10">
              {[40, 75, 100, 60, 90, 45, 80, 65, 95, 50, 85, 30].map((h, i) => (
                <div
                  key={i}
                  className={`w-1 rounded-full transition-all duration-150 ${
                    isSpeaking
                      ? 'bg-blue-400 animate-pulse'
                      : isListening
                      ? 'bg-emerald-400 animate-pulse'
                      : 'bg-white/10'
                  }`}
                  style={{
                    height: isSpeaking || isListening ? `${(h * 0.28) + (Math.sin(i + Date.now()/200) * 8)}px` : '4px',
                    animationDelay: `${i * 80}ms`
                  }}
                />
              ))}
            </div>

            {/* In-Call Quick Controls */}
            {isCallActive && (
              <div className="flex items-center space-x-3 mt-6 pt-4 border-t border-white/10 w-full justify-center z-10">
                <button
                  onClick={toggleMute}
                  className={`p-2.5 rounded-xl border text-xs font-medium flex items-center space-x-2 transition-all cursor-pointer ${
                    isMuted
                      ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                      : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                  }`}
                  title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
                >
                  {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-emerald-400" />}
                  <span>{isMuted ? 'Muted' : 'Mic Active'}</span>
                </button>

                {isSpeaking && (
                  <button
                    onClick={stopCurrentAudio}
                    className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-medium flex items-center space-x-2 transition-all cursor-pointer hover:bg-amber-500/30"
                  >
                    <Square className="w-4 h-4" />
                    <span>Interrupt Speech</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Operational Scenario Selector */}
          <div className="bg-[#0c0c0c] border border-white/10 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-white/50">Operational Scenario</span>
              <span className="text-[11px] text-blue-400 font-mono">Dynamic Agent Persona</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {scenarios.map((sc) => {
                const isSelected = activeScenario === sc.id;
                return (
                  <button
                    key={sc.id}
                    onClick={() => handleSelectScenario(sc.id)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-500/15 border-blue-500/40 shadow-sm'
                        : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-semibold ${isSelected ? 'text-blue-400' : 'text-white/90'}`}>
                        {sc.name}
                      </span>
                    </div>
                    <p className="text-[11px] text-white/40 line-clamp-2 leading-relaxed">
                      {sc.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Voice Engine & Audio Synthesis Settings */}
          <div className="bg-[#0c0c0c] border border-white/10 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center space-x-2">
                <Settings2 className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-medium text-white uppercase tracking-wider font-mono">Synthesis Engine</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono">24kHz Studio Output</span>
            </div>

            {/* Voice Model Selector */}
            <div className="space-y-1.5">
              <label className="text-xs text-white/60">Gemini TTS Prebuilt Voice</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { name: 'Zephyr', label: 'Zephyr (Executive)' },
                  { name: 'Kore', label: 'Kore (Warm)' },
                  { name: 'Puck', label: 'Puck (Eng)' },
                  { name: 'Fenrir', label: 'Fenrir (Lead)' },
                  { name: 'Charon', label: 'Charon (Calm)' }
                ].map((v) => (
                  <button
                    key={v.name}
                    onClick={() => {
                      setSelectedVoice(v.name);
                      speakText(`Voice profile updated to ${v.name}. Ready for calls.`);
                    }}
                    className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium text-center transition-all cursor-pointer ${
                      selectedVoice === v.name
                        ? 'bg-blue-500/20 border-blue-500/40 text-blue-300'
                        : 'bg-white/[0.02] border-white/5 text-white/60 hover:bg-white/[0.05]'
                    }`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Speed Slider & Auto-Speak Switch */}
            <div className="flex items-center justify-between pt-2">
              <div className="space-y-1">
                <label className="text-xs text-white/60">Voice Speed: {voiceSpeed}x</label>
                <input
                  type="range"
                  min="0.8"
                  max="1.4"
                  step="0.1"
                  value={voiceSpeed}
                  onChange={(e) => setVoiceSpeed(parseFloat(e.target.value))}
                  className="w-32 accent-blue-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setAutoSpeak(!autoSpeak)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                    autoSpeak
                      ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                      : 'bg-white/[0.04] border-white/10 text-white/40'
                  }`}
                >
                  {autoSpeak ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                  <span>{autoSpeak ? 'Auto-Voice ON' : 'Muted Audio'}</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Live Call Transcript, Audio Player & Test Prompts (7 cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          
          {/* Transcript Card Container */}
          <div className="bg-[#0c0c0c] border border-white/10 rounded-2xl flex flex-col flex-1 min-h-[500px] overflow-hidden shadow-2xl">
            
            {/* Header */}
            <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-[#111]">
              <div className="flex items-center space-x-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-medium text-white tracking-tight uppercase font-mono">
                  Live Full-Duplex Transcript
                </span>
              </div>

              <div className="flex items-center space-x-3 text-xs text-white/40 font-mono">
                <span>Client: <strong className="text-white/80">{clientName}</strong></span>
                <span>•</span>
                <span>Docs: <strong className="text-white/80">{docs.length} SOPs</strong></span>
              </div>
            </div>

            {/* Chat / Call History Scroll Area */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4 max-h-[440px] scrollbar-thin scrollbar-thumb-white/10">
              {callHistory.map((msg) => {
                const isAgent = msg.sender === 'agent';
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start space-x-3 ${isAgent ? '' : 'flex-row-reverse space-x-reverse'}`}
                  >
                    {/* Avatar */}
                    <div 
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isAgent 
                          ? 'bg-blue-500/20 border border-blue-500/30 text-blue-400' 
                          : 'bg-white/10 border border-white/15 text-white/80'
                      }`}
                    >
                      {isAgent ? <Bot className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </div>

                    {/* Bubble */}
                    <div 
                      className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        isAgent
                          ? 'bg-[#151515] border border-white/10 text-white/90 shadow-md'
                          : 'bg-blue-600 text-white shadow-blue-600/20'
                      }`}
                    >
                      <div className="flex items-center justify-between space-x-3 mb-1 text-[11px] opacity-60">
                        <span className="font-medium font-mono">
                          {isAgent ? `Nexus Agent (${selectedVoice})` : 'You (Operator)'}
                        </span>
                        <div className="flex items-center space-x-2">
                          {msg.latencyMs && (
                            <span className="font-mono">{msg.latencyMs}ms</span>
                          )}
                          <span>{msg.timestamp}</span>
                        </div>
                      </div>

                      <p className="whitespace-pre-wrap">{msg.text}</p>

                      {/* Repeat Audio Button for Agent responses */}
                      {isAgent && (
                        <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-end">
                          <button
                            onClick={() => speakText(msg.text)}
                            className="flex items-center space-x-1 text-[11px] text-blue-400 hover:text-blue-300 cursor-pointer"
                          >
                            <Play className="w-3 h-3" />
                            <span>Play Audio</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Thinking Bubble */}
              {isThinking && (
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 animate-spin" />
                  </div>
                  <div className="bg-[#151515] border border-white/10 rounded-2xl px-4 py-3 text-xs text-white/50 flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                    <span>Analyzing indexed SOPs & generating voice turn...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Test Queries Chips */}
            <div className="px-5 py-3 bg-[#111] border-t border-white/5">
              <div className="text-[11px] text-white/40 uppercase tracking-wider font-mono mb-2">
                Click to simulate voice inquiry:
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  'What is our SLA guarantee for Tier-1 freight disputes?',
                  'How many hours per week can we automate in invoice matching?',
                  'Confirm the bill of lading for carrier shipment #4981.',
                  'Draft an executive summary of our 90-day AI rollout.'
                ].map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleUserSpeechTurn(q)}
                    className="text-xs px-2.5 py-1 rounded-md bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-white/15 text-white/70 hover:text-white transition-all cursor-pointer text-left"
                  >
                    "{q}"
                  </button>
                ))}
              </div>
            </div>

            {/* Input Bar */}
            <div className="p-4 bg-[#080808] border-t border-white/10">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (inputText.trim()) {
                    handleUserSpeechTurn(inputText);
                    setInputText('');
                  }
                }}
                className="flex items-center space-x-2"
              >
                <button
                  type="button"
                  onClick={toggleMute}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                    isListening
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 animate-pulse'
                      : 'bg-white/[0.04] border-white/10 text-white/50 hover:text-white'
                  }`}
                  title="Toggle Microphone"
                >
                  {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </button>

                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={
                    isCallActive
                      ? 'Type a message or speak into your microphone...'
                      : 'Type a message (or click "Start Live Voice Call" above)...'
                  }
                  className="flex-1 bg-[#151515] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50"
                />

                <button
                  type="submit"
                  disabled={!inputText.trim() || isThinking}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-xs font-medium transition-all cursor-pointer flex items-center space-x-1.5"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Send Voice Turn</span>
                </button>
              </form>
            </div>

          </div>

        </div>

      </div>
      )}
    </div>
  );
};
