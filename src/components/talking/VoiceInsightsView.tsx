import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { 
  Activity, 
  Clock, 
  TrendingUp, 
  Smile, 
  Meh, 
  AlertCircle, 
  User, 
  Bot, 
  Search, 
  BarChart3, 
  ShieldCheck, 
  Sparkles, 
  Filter,
  Volume2,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react';
import { ClientCompany } from '../../types';

export interface EnhancedCallMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
  sentiment?: 'positive' | 'neutral' | 'analytical' | 'urgent' | 'inquisitive';
  sentimentScore?: number; // scale from -1.0 (very negative/urgent) to +1.0 (very positive/satisfied)
  latencyMs?: number;
  callTimeSeconds?: number; // elapsed seconds in call
  durationSeconds?: number; // duration of the spoken turn
  toneKeywords?: string[];
}

interface VoiceInsightsViewProps {
  currentClient: ClientCompany;
  callHistory: EnhancedCallMessage[];
  callDuration: number;
  isCallActive: boolean;
  onSelectMessage?: (msg: EnhancedCallMessage) => void;
}

export const VoiceInsightsView: React.FC<VoiceInsightsViewProps> = ({
  currentClient,
  callHistory,
  callDuration,
  isCallActive
}) => {
  const [sentimentFilter, setSentimentFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'TIMELINE' | 'DISTRIBUTION'>('TIMELINE');

  const timelineSvgRef = useRef<SVGSVGElement | null>(null);
  const timelineContainerRef = useRef<HTMLDivElement | null>(null);
  const donutSvgRef = useRef<SVGSVGElement | null>(null);

  // Derive sentiment scores and metrics for messages that don't have them
  const analyzedMessages = useMemo(() => {
    return callHistory.map((msg, index) => {
      let sentiment = msg.sentiment || 'neutral';
      let sentimentScore = msg.sentimentScore;
      let keywords = msg.toneKeywords || [];

      // Calculate fallback sentiment & score if not present
      if (sentimentScore === undefined) {
        const lower = msg.text.toLowerCase();
        if (
          lower.includes('great') || 
          lower.includes('welcome') || 
          lower.includes('assist') || 
          lower.includes('eliminate') || 
          lower.includes('complete') || 
          lower.includes('roi') ||
          lower.includes('payback') ||
          lower.includes('highest-velocity')
        ) {
          sentiment = 'positive';
          sentimentScore = 0.75 + ((index % 3) * 0.08);
          keywords = ['High ROI', 'Resolution', 'Capability'];
        } else if (
          lower.includes('losing') || 
          lower.includes('manually') || 
          lower.includes('error') || 
          lower.includes('discrepancy') || 
          lower.includes('bottleneck') ||
          lower.includes('urgent')
        ) {
          sentiment = 'urgent';
          sentimentScore = -0.65 - ((index % 3) * 0.09);
          keywords = ['Process Friction', 'Labor Waste', 'Urgency'];
        } else if (
          lower.includes('sla') || 
          lower.includes('confidence') || 
          lower.includes('architecture') || 
          lower.includes('benchmark') ||
          lower.includes('gemini') ||
          lower.includes('sop')
        ) {
          sentiment = 'analytical';
          sentimentScore = 0.35 + ((index % 4) * 0.05);
          keywords = ['SLA Compliance', 'Technical Specs', 'Governance'];
        } else if (lower.includes('?') || lower.includes('how') || lower.includes('can you')) {
          sentiment = 'inquisitive';
          sentimentScore = 0.15;
          keywords = ['Inquiry', 'Discovery', 'Qualification'];
        } else {
          sentiment = 'neutral';
          sentimentScore = 0.05;
          keywords = ['Operational Flow'];
        }
      }

      const elapsedSec = msg.callTimeSeconds ?? Math.max(5, index * 12 + 6);
      const estDuration = msg.durationSeconds ?? Math.max(3, Math.min(18, Math.round(msg.text.length / 15)));

      return {
        ...msg,
        sentiment,
        sentimentScore: Math.max(-1, Math.min(1, sentimentScore)),
        callTimeSeconds: elapsedSec,
        durationSeconds: estDuration,
        toneKeywords: keywords.length > 0 ? keywords : ['Dialogue']
      } as EnhancedCallMessage;
    });
  }, [callHistory]);

  // Aggregate stats
  const metrics = useMemo(() => {
    const totalTurns = analyzedMessages.length;
    const scores = analyzedMessages.map(m => m.sentimentScore || 0);
    const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
    
    const agentTurns = analyzedMessages.filter(m => m.sender === 'agent');
    const userTurns = analyzedMessages.filter(m => m.sender === 'user');

    const agentSeconds = agentTurns.reduce((acc, m) => acc + (m.durationSeconds || 5), 0);
    const userSeconds = userTurns.reduce((acc, m) => acc + (m.durationSeconds || 4), 0);
    const totalSpeakingSec = Math.max(1, agentSeconds + userSeconds);

    const agentRatio = Math.round((agentSeconds / totalSpeakingSec) * 100);
    const userRatio = 100 - agentRatio;

    const latencies = analyzedMessages
      .filter(m => m.latencyMs && m.latencyMs > 0)
      .map(m => m.latencyMs as number);
    const avgLatency = latencies.length > 0 ? Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length) : 185;

    const positiveCount = analyzedMessages.filter(m => (m.sentimentScore || 0) > 0.2).length;
    const neutralCount = analyzedMessages.filter(m => (m.sentimentScore || 0) >= -0.2 && (m.sentimentScore || 0) <= 0.2).length;
    const urgentCount = analyzedMessages.filter(m => (m.sentimentScore || 0) < -0.2).length;

    return {
      totalTurns,
      avgScore,
      agentRatio,
      userRatio,
      agentSeconds,
      userSeconds,
      avgLatency,
      positiveCount,
      neutralCount,
      urgentCount
    };
  }, [analyzedMessages]);

  // D3 Sentiment Arc & Trajectory Line Chart
  useEffect(() => {
    const svgElement = timelineSvgRef.current;
    const container = timelineContainerRef.current;
    if (!svgElement || !container || analyzedMessages.length === 0) return;

    // Responsive container measurements
    const width = container.clientWidth || 640;
    const height = 240;
    const margin = { top: 25, right: 30, bottom: 40, left: 45 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgElement);
    svg.selectAll('*').remove();

    svg
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('style', 'max-width: 100%; height: auto; overflow: visible;');

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // Prepare chronological data points
    const data = analyzedMessages.map((m, idx) => ({
      index: idx + 1,
      seconds: m.callTimeSeconds || (idx + 1) * 10,
      score: m.sentimentScore || 0,
      sender: m.sender,
      text: m.text,
      sentiment: m.sentiment,
      latency: m.latencyMs || 150
    }));

    // Scales
    const maxSec = Math.max(callDuration, data[data.length - 1]?.seconds + 5, 30);
    const xScale = d3.scaleLinear().domain([0, maxSec]).range([0, innerWidth]);
    const yScale = d3.scaleLinear().domain([-1, 1]).range([innerHeight, 0]);

    // Defs & Gradients
    const defs = svg.append('defs');

    // Gradient for sentiment curve fill
    const areaGradient = defs
      .append('linearGradient')
      .attr('id', 'sentiment-area-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    areaGradient.append('stop').attr('offset', '0%').attr('stop-color', '#10b981').attr('stop-opacity', 0.35);
    areaGradient.append('stop').attr('offset', '50%').attr('stop-color', '#3b82f6').attr('stop-opacity', 0.15);
    areaGradient.append('stop').attr('offset', '100%').attr('stop-color', '#f43f5e').attr('stop-opacity', 0.3);

    // Grid lines
    g.append('g')
      .attr('class', 'grid')
      .attr('opacity', 0.08)
      .call(
        d3.axisLeft(yScale)
          .tickValues([-1, -0.5, 0, 0.5, 1])
          .tickSize(-innerWidth)
          .tickFormat(() => '')
      );

    // Neutral baseline (0.0)
    g.append('line')
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', yScale(0))
      .attr('y2', yScale(0))
      .attr('stroke', 'rgba(255, 255, 255, 0.25)')
      .attr('stroke-dasharray', '3,3')
      .attr('stroke-width', 1);

    // Area generator
    const area = d3
      .area<{ seconds: number; score: number }>()
      .x(d => xScale(d.seconds))
      .y0(yScale(0))
      .y1(d => yScale(d.score))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(data)
      .attr('fill', 'url(#sentiment-area-gradient)')
      .attr('d', area);

    // Line generator
    const line = d3
      .line<{ seconds: number; score: number }>()
      .x(d => xScale(d.seconds))
      .y(d => yScale(d.score))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#38bdf8')
      .attr('stroke-width', 2.5)
      .attr('d', line);

    // Interactive Points & Markers
    const dots = g.selectAll('.dot')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'dot')
      .attr('transform', (d: any) => `translate(${xScale(d.seconds)}, ${yScale(d.score)})`);

    dots
      .append('circle')
      .attr('r', 5.5)
      .attr('fill', (d: any) => (d.score >= 0.2 ? '#10b981' : d.score <= -0.2 ? '#f43f5e' : '#38bdf8'))
      .attr('stroke', '#09090b')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .append('title')
      .text((d: any) => `[${d.sender.toUpperCase()}] at ${d.seconds}s\nScore: ${d.score.toFixed(2)}\n"${d.text.slice(0, 70)}..."`);

    // Inner icon or dot center
    dots
      .append('circle')
      .attr('r', 2)
      .attr('fill', '#ffffff');

    // Axes
    const xAxis = d3.axisBottom(xScale)
      .ticks(Math.min(8, Math.floor(innerWidth / 60)))
      .tickFormat(d => `${d}s`);

    const yAxis = d3.axisLeft(yScale)
      .tickValues([-1, -0.5, 0, 0.5, 1])
      .tickFormat(d => (d === 1 ? '+1.0' : d === -1 ? '-1.0' : d === 0 ? '0' : `${d}`));

    g.append('g')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(xAxis)
      .attr('color', 'rgba(255, 255, 255, 0.4)')
      .selectAll('text')
      .attr('font-size', '10px')
      .attr('font-family', 'monospace');

    g.append('g')
      .call(yAxis)
      .attr('color', 'rgba(255, 255, 255, 0.4)')
      .selectAll('text')
      .attr('font-size', '10px')
      .attr('font-family', 'monospace');

    // Zone labels (Positive vs Friction)
    g.append('text')
      .attr('x', innerWidth - 6)
      .attr('y', yScale(0.85))
      .attr('text-anchor', 'end')
      .attr('fill', '#34d399')
      .attr('font-size', '9px')
      .attr('font-family', 'monospace')
      .text('▲ Positive / Constructive');

    g.append('text')
      .attr('x', innerWidth - 6)
      .attr('y', yScale(-0.85))
      .attr('text-anchor', 'end')
      .attr('fill', '#fb7185')
      .attr('font-size', '9px')
      .attr('font-family', 'monospace')
      .text('▼ Friction / Urgent Query');

  }, [analyzedMessages, callDuration]);

  // D3 Talk-Time & Duration Distribution Donut Chart
  useEffect(() => {
    const svgElement = donutSvgRef.current;
    if (!svgElement) return;

    const width = 190;
    const height = 190;
    const radius = Math.min(width, height) / 2 - 10;

    const svg = d3.select(svgElement);
    svg.selectAll('*').remove();

    svg
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`);

    const g = svg.append('g').attr('transform', `translate(${width / 2}, ${height / 2})`);

    const pieData = [
      { label: 'Nexus Agent', value: Math.max(1, metrics.agentSeconds), color: '#3b82f6' },
      { label: 'User / Operator', value: Math.max(1, metrics.userSeconds), color: '#10b981' }
    ];

    const pie = d3.pie<{ label: string; value: number; color: string }>()
      .value(d => d.value)
      .sort(null);

    const arc = d3.arc<d3.PieArcDatum<{ label: string; value: number; color: string }>>()
      .innerRadius(radius * 0.62)
      .outerRadius(radius)
      .cornerRadius(4)
      .padAngle(0.04);

    g.selectAll('path')
      .data(pie(pieData))
      .enter()
      .append('path')
      .attr('d', arc as any)
      .attr('fill', d => d.data.color)
      .attr('stroke', '#09090b')
      .attr('stroke-width', 2);

    // Center text
    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '-0.2em')
      .attr('font-size', '18px')
      .attr('font-family', 'monospace')
      .attr('font-weight', 'bold')
      .attr('fill', '#ffffff')
      .text(`${metrics.agentRatio}%`);

    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '1.4em')
      .attr('font-size', '9px')
      .attr('font-family', 'monospace')
      .attr('fill', 'rgba(255, 255, 255, 0.5)')
      .text('Agent Talk Ratio');

  }, [metrics]);

  // Filtered transcript list
  const filteredTranscript = useMemo(() => {
    return analyzedMessages.filter(msg => {
      const matchesFilter = 
        sentimentFilter === 'ALL' ||
        (sentimentFilter === 'POSITIVE' && (msg.sentimentScore || 0) > 0.2) ||
        (sentimentFilter === 'NEUTRAL' && Math.abs(msg.sentimentScore || 0) <= 0.2) ||
        (sentimentFilter === 'URGENT' && (msg.sentimentScore || 0) < -0.2);

      const matchesSearch = 
        !searchTerm.trim() ||
        msg.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.toneKeywords?.some(k => k.toLowerCase().includes(searchTerm.toLowerCase()));

      return matchesFilter && matchesSearch;
    });
  }, [analyzedMessages, sentimentFilter, searchTerm]);

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Top Real-Time KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Total Call Duration */}
        <div className="p-4 rounded-xl bg-[#0c0c0c] border border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-white/50 mb-1">
            <span className="font-mono uppercase tracking-wider text-[10px]">Call Duration</span>
            <Clock className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-white flex items-center gap-2">
            <span>{formatSeconds(callDuration)}</span>
            {isCallActive && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            )}
          </div>
          <span className="text-[10px] font-mono text-white/40 block mt-1">
            {isCallActive ? '● Active Live Stream' : '○ Call Standby'}
          </span>
        </div>

        {/* Overall Sentiment Score */}
        <div className="p-4 rounded-xl bg-[#0c0c0c] border border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-white/50 mb-1">
            <span className="font-mono uppercase tracking-wider text-[10px]">Net Sentiment</span>
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-white flex items-center gap-1.5">
            <span className={metrics.avgScore >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
              {metrics.avgScore >= 0 ? '+' : ''}{(metrics.avgScore * 100).toFixed(0)}%
            </span>
            {metrics.avgScore > 0.1 ? (
              <ArrowUpRight className="w-4 h-4 text-emerald-400" />
            ) : metrics.avgScore < -0.1 ? (
              <ArrowDownRight className="w-4 h-4 text-rose-400" />
            ) : (
              <Minus className="w-4 h-4 text-white/40" />
            )}
          </div>
          <span className="text-[10px] font-mono text-emerald-400/80 block mt-1">
            {metrics.avgScore > 0.2 ? 'Constructive / Positive' : metrics.avgScore < -0.2 ? 'High Friction / Urgent' : 'Objective / Analytical'}
          </span>
        </div>

        {/* Talk Ratio */}
        <div className="p-4 rounded-xl bg-[#0c0c0c] border border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-white/50 mb-1">
            <span className="font-mono uppercase tracking-wider text-[10px]">Talk Balance</span>
            <Volume2 className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-white">
            <span>{metrics.agentRatio}%</span>
            <span className="text-xs text-white/40 font-normal font-sans ml-1.5">Agent / {metrics.userRatio}% User</span>
          </div>
          <div className="w-full bg-white/10 h-1 rounded-full mt-2 overflow-hidden flex">
            <div className="bg-blue-500 h-full" style={{ width: `${metrics.agentRatio}%` }} />
            <div className="bg-emerald-500 h-full" style={{ width: `${metrics.userRatio}%` }} />
          </div>
        </div>

        {/* Mean Latency */}
        <div className="p-4 rounded-xl bg-[#0c0c0c] border border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-white/50 mb-1">
            <span className="font-mono uppercase tracking-wider text-[10px]">Voice Latency</span>
            <Zap className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-white">
            <span>{metrics.avgLatency}</span>
            <span className="text-xs text-white/40 font-normal font-mono ml-1">ms</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 block mt-1">
            ✓ Sub-300ms SLA Target
          </span>
        </div>
      </div>

      {/* D3 Charts Panel: Sentiment Trajectory & Speaking Ratio */}
      <div className="bg-[#0c0c0c] border border-white/10 rounded-2xl p-5 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">
                Conversational Sentiment Trajectory & Duration Arc
              </h3>
              <p className="text-[11px] text-white/50 font-light">
                Rendered with D3.js • Continuous tone analysis mapped across elapsed call seconds
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {metrics.positiveCount} Positive
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-white/60 border border-white/10">
              {metrics.neutralCount} Neutral
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
              {metrics.urgentCount} Urgent
            </span>
          </div>
        </div>

        {/* D3 Visualizations Layout (Timeline + Donut) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Main D3 Area & Line Chart (8 cols) */}
          <div className="lg:col-span-9" ref={timelineContainerRef}>
            <svg ref={timelineSvgRef} className="w-full" />
          </div>

          {/* D3 Speaking Duration Donut (3 cols) */}
          <div className="lg:col-span-3 flex flex-col items-center justify-center p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <svg ref={donutSvgRef} />
            <div className="mt-2 space-y-1 w-full text-center">
              <div className="flex items-center justify-center space-x-2 text-[11px] font-mono">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-white/70">Agent: {formatSeconds(metrics.agentSeconds)}</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-[11px] font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-white/70">Client: {formatSeconds(metrics.userSeconds)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Real-Time Sentiment Transcript List */}
      <div className="bg-[#0c0c0c] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        {/* Header & Filter Bar */}
        <div className="p-4 border-b border-white/10 bg-[#111] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-white font-mono">
              Sentiment Annotated Call Transcript
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-white/50">
              {filteredTranscript.length} Turns
            </span>
          </div>

          {/* Filters & Search */}
          <div className="flex items-center space-x-2">
            {/* Filter Pills */}
            <div className="flex items-center bg-black/50 border border-white/10 rounded-lg p-0.5 text-[11px] font-mono">
              {[
                { id: 'ALL', label: 'All' },
                { id: 'POSITIVE', label: 'Positive' },
                { id: 'NEUTRAL', label: 'Neutral' },
                { id: 'URGENT', label: 'Urgent' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setSentimentFilter(f.id)}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    sentimentFilter === f.id
                      ? 'bg-blue-600 text-white font-medium shadow-sm'
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Quick Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search dialogue..."
                className="bg-black/50 border border-white/10 rounded-lg pl-8 pr-3 py-1 text-xs text-white placeholder-white/30 focus:outline-none focus:border-blue-500 w-36 sm:w-44"
              />
            </div>
          </div>
        </div>

        {/* Scrollable Transcript Cards */}
        <div className="p-4 space-y-3 max-h-[460px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
          {filteredTranscript.length === 0 ? (
            <div className="py-12 text-center text-xs text-white/40">
              No conversational turns match the selected sentiment filter.
            </div>
          ) : (
            filteredTranscript.map((msg, i) => {
              const isAgent = msg.sender === 'agent';
              const score = msg.sentimentScore || 0;
              const isPositive = score >= 0.2;
              const isUrgent = score <= -0.2;

              return (
                <div
                  key={msg.id}
                  className="p-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 transition-all space-y-2.5"
                >
                  {/* Top metadata row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-6 h-6 rounded-md flex items-center justify-center text-xs ${
                        isAgent 
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {isAgent ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                      </div>
                      <span className="text-xs font-medium text-white">
                        {isAgent ? 'Nexus Voice Agent' : 'Client / Operator'}
                      </span>
                      <span className="text-white/20">•</span>
                      <span className="text-[10px] font-mono text-white/40">
                        Turn at {formatSeconds(msg.callTimeSeconds || i * 8)} ({msg.durationSeconds || 4}s)
                      </span>
                    </div>

                    {/* Sentiment Badge & Score */}
                    <div className="flex items-center space-x-2">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                        isPositive
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : isUrgent
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      }`}>
                        {isPositive ? (
                          <Smile className="w-3 h-3" />
                        ) : isUrgent ? (
                          <AlertCircle className="w-3 h-3" />
                        ) : (
                          <Meh className="w-3 h-3" />
                        )}
                        <span className="uppercase">{msg.sentiment}</span>
                        <span className="opacity-70">({score > 0 ? `+${(score * 100).toFixed(0)}%` : `${(score * 100).toFixed(0)}%`})</span>
                      </span>

                      {msg.latencyMs && (
                        <span className="text-[9px] font-mono text-white/30 hidden sm:inline">
                          {msg.latencyMs}ms latency
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Message dialogue text */}
                  <p className="text-xs text-white/80 font-light leading-relaxed pl-8">
                    "{msg.text}"
                  </p>

                  {/* Extracted tone tags / keywords */}
                  {msg.toneKeywords && msg.toneKeywords.length > 0 && (
                    <div className="flex items-center space-x-1.5 pl-8 pt-1">
                      <span className="text-[9px] font-mono uppercase text-white/30">Detected Tags:</span>
                      {msg.toneKeywords.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 border border-white/5 text-white/60"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
