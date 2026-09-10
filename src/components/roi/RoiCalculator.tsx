import React, { useState } from 'react';
import { 
  Calculator, 
  TrendingUp, 
  Clock, 
  DollarSign, 
  ArrowRight, 
  Check, 
  PieChart, 
  BarChart3, 
  Sparkles,
  FileText,
  HelpCircle,
  Zap
} from 'lucide-react';
import { ClientCompany } from '../../types';

interface RoiCalculatorProps {
  currentClient: ClientCompany;
  onGoToProposal: () => void;
}

export const RoiCalculator: React.FC<RoiCalculatorProps> = ({
  currentClient,
  onGoToProposal
}) => {
  // Financial Model Sliders
  const [teamSize, setTeamSize] = useState<number>(45);
  const [hourlyWage, setHourlyWage] = useState<number>(currentClient.hourlyWageAvg || 68);
  const [manualHoursPerWeek, setManualHoursPerWeek] = useState<number>(14);
  const [automationEfficiency, setAutomationEfficiency] = useState<number>(75);
  const [setupInvestment, setSetupInvestment] = useState<number>(16500);
  const [monthlyRetainer, setMonthlyRetainer] = useState<number>(4250);

  // Financial Calculations
  const annualWorkWeeks = 50;
  const currentAnnualLaborCost = teamSize * manualHoursPerWeek * hourlyWage * annualWorkWeeks;
  const grossHoursSavedAnnual = teamSize * manualHoursPerWeek * (automationEfficiency / 100) * annualWorkWeeks;
  const grossDollarSavingsAnnual = grossHoursSavedAnnual * hourlyWage;
  
  const agencyFirstYearCost = setupInvestment + (monthlyRetainer * 12);
  const netFirstYearSavings = grossDollarSavingsAnnual - agencyFirstYearCost;
  const firstYearRoiPercentage = Math.round((netFirstYearSavings / agencyFirstYearCost) * 100);
  
  // Break-even calculation in months
  const monthlyGrossSavings = grossDollarSavingsAnnual / 12;
  const monthlyNetBenefit = monthlyGrossSavings - monthlyRetainer;
  const breakEvenMonths = monthlyNetBenefit > 0 ? (setupInvestment / monthlyNetBenefit).toFixed(1) : '12+';

  // 3-Year Projection
  const year1AgencyCost = agencyFirstYearCost;
  const year2AgencyCost = monthlyRetainer * 12;
  const year3AgencyCost = monthlyRetainer * 12;
  const total3YearAgencyCost = year1AgencyCost + year2AgencyCost + year3AgencyCost;

  const total3YearGrossBenefit = grossDollarSavingsAnnual * 3;
  const total3YearNetValue = total3YearGrossBenefit - total3YearAgencyCost;

  const handleApplyPreset = (preset: 'Logistics' | 'Fintech' | 'Healthcare') => {
    if (preset === 'Logistics') {
      setTeamSize(60);
      setHourlyWage(68);
      setManualHoursPerWeek(16);
      setAutomationEfficiency(78);
      setSetupInvestment(18500);
      setMonthlyRetainer(4750);
    } else if (preset === 'Fintech') {
      setTeamSize(30);
      setHourlyWage(95);
      setManualHoursPerWeek(18);
      setAutomationEfficiency(82);
      setSetupInvestment(22000);
      setMonthlyRetainer(5500);
    } else if (preset === 'Healthcare') {
      setTeamSize(40);
      setHourlyWage(85);
      setManualHoursPerWeek(12);
      setAutomationEfficiency(72);
      setSetupInvestment(15000);
      setMonthlyRetainer(4000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass p-6 rounded-xl">
        <div>
          <div className="flex items-center space-x-2 text-[10px] font-medium text-white/40 uppercase tracking-widest mb-1 font-mono">
            <Calculator className="w-3.5 h-3.5 text-blue-400" />
            <span>Financial Modeling Engine</span>
          </div>
          <h1 className="serif italic text-3xl text-white">
            ROI & Cost-of-Inaction Calculator
          </h1>
          <p className="text-xs text-white/50 mt-1 font-light">
            Quantify direct labor savings, break-even velocity, and 3-year capacity value for <span className="text-white font-normal">{currentClient.name}</span>.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center space-x-2 bg-black/40 border border-white/5 p-1.5 rounded-lg text-xs">
          <span className="text-[10px] text-white/40 uppercase tracking-wider px-1 font-mono">Presets:</span>
          <button
            onClick={() => handleApplyPreset('Logistics')}
            className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-white/80 transition-colors cursor-pointer text-xs font-mono"
          >
            Supply Chain
          </button>
          <button
            onClick={() => handleApplyPreset('Fintech')}
            className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-white/80 transition-colors cursor-pointer text-xs font-mono"
          >
            Fintech
          </button>
          <button
            onClick={() => handleApplyPreset('Healthcare')}
            className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-white/80 transition-colors cursor-pointer text-xs font-mono"
          >
            Healthcare
          </button>
        </div>
      </div>

      {/* Main 2-Column Interface: Sliders (Left) & Financial Dashboard (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Interactive Parameters (5 Cols) */}
        <div className="lg:col-span-5 glass rounded-xl p-6 space-y-6">
          <div className="pb-3 border-b border-white/5">
            <h2 className="text-sm font-semibold tracking-wide text-white">Labor & Automation Inputs</h2>
            <p className="text-xs text-white/40 font-light">Adjust variables to test scenario sensitivities.</p>
          </div>

          <div className="space-y-5 text-xs">
            {/* Slider 1: Team Size */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-white/60 font-medium">Knowledge Workers in Scope:</span>
                <span className="font-mono text-white font-semibold">{teamSize} Employees</span>
              </div>
              <input
                type="range"
                min="5"
                max="250"
                step="5"
                value={teamSize}
                onChange={(e) => setTeamSize(Number(e.target.value))}
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-[10px] text-white/30 font-mono">
                <span>5</span>
                <span>125</span>
                <span>250 team</span>
              </div>
            </div>

            {/* Slider 2: Average Hourly Wage */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-white/60 font-medium">Loaded Hourly Wage Rate:</span>
                <span className="font-mono text-white font-semibold">${hourlyWage}/hr</span>
              </div>
              <input
                type="range"
                min="35"
                max="180"
                step="5"
                value={hourlyWage}
                onChange={(e) => setHourlyWage(Number(e.target.value))}
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-[10px] text-white/30 font-mono">
                <span>$35/hr</span>
                <span>$105/hr</span>
                <span>$180/hr</span>
              </div>
            </div>

            {/* Slider 3: Weekly Manual Repetitive Hours */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-white/60 font-medium">Weekly Repetitive Hours / Person:</span>
                <span className="font-mono text-white font-semibold">{manualHoursPerWeek} hrs/week</span>
              </div>
              <input
                type="range"
                min="4"
                max="28"
                step="1"
                value={manualHoursPerWeek}
                onChange={(e) => setManualHoursPerWeek(Number(e.target.value))}
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-[10px] text-white/30 font-mono">
                <span>4 hrs (10%)</span>
                <span>14 hrs (35%)</span>
                <span>28 hrs (70%)</span>
              </div>
            </div>

            {/* Slider 4: AI Automation Efficacy Rate */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-white/60 font-medium">AI Automation Resolution Rate:</span>
                <span className="font-mono text-emerald-400 font-semibold">{automationEfficiency}%</span>
              </div>
              <input
                type="range"
                min="40"
                max="95"
                step="5"
                value={automationEfficiency}
                onChange={(e) => setAutomationEfficiency(Number(e.target.value))}
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] text-white/30 font-mono">
                <span>40% Conservative</span>
                <span>75% Target</span>
                <span>95% High</span>
              </div>
            </div>

            {/* Agency Investment Inputs */}
            <div className="pt-4 border-t border-white/5 space-y-4">
              <span className="text-xs uppercase tracking-wider text-white/50 block font-mono">Commercial Terms</span>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase text-white/40 block mb-1 font-mono">Setup Investment</label>
                  <input
                    type="number"
                    step="500"
                    value={setupInvestment}
                    onChange={(e) => setSetupInvestment(Number(e.target.value))}
                    className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-white font-mono text-xs focus:outline-none focus:border-white/30"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase text-white/40 block mb-1 font-mono">Monthly Retainer</label>
                  <input
                    type="number"
                    step="250"
                    value={monthlyRetainer}
                    onChange={(e) => setMonthlyRetainer(Number(e.target.value))}
                    className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-white font-mono text-xs focus:outline-none focus:border-white/30"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Financial Results & 3-Year Projection (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* 4 Hero Output Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="glass p-5 rounded-xl">
              <span className="text-[10px] uppercase tracking-wider text-white/40 block font-mono">Cost of Inaction</span>
              <span className="text-2xl font-light font-mono text-rose-400 block mt-1.5">
                ${currentAnnualLaborCost.toLocaleString()}
              </span>
              <span className="text-[10px] text-white/30 block mt-1 font-light">
                {(teamSize * manualHoursPerWeek * annualWorkWeeks).toLocaleString()} manual hours/yr wasted
              </span>
            </div>

            <div className="glass p-5 rounded-xl">
              <span className="text-[10px] uppercase tracking-wider text-white/40 block font-mono">Gross Reclaimed Value</span>
              <span className="text-2xl font-light font-mono text-emerald-400 block mt-1.5">
                ${grossDollarSavingsAnnual.toLocaleString()}
              </span>
              <span className="text-[10px] text-emerald-400/80 block mt-1 font-light">
                {grossHoursSavedAnnual.toLocaleString()} hours saved/yr
              </span>
            </div>

            <div className="glass p-5 rounded-xl">
              <span className="text-[10px] uppercase tracking-wider text-white/40 block font-mono">Net 1st-Year Profit</span>
              <span className="text-2xl font-light font-mono text-white block mt-1.5">
                ${netFirstYearSavings.toLocaleString()}
              </span>
              <span className="text-[10px] text-blue-400 block mt-1 font-mono">
                +{firstYearRoiPercentage}% First-Year ROI
              </span>
            </div>

            <div className="glass p-5 rounded-xl">
              <span className="text-[10px] uppercase tracking-wider text-white/40 block font-mono">Break-Even Velocity</span>
              <span className="text-2xl font-light font-mono text-white block mt-1.5">
                {breakEvenMonths} Mo
              </span>
              <span className="text-[10px] text-white/30 block mt-1 font-light">
                Full payback of initial engineering fee
              </span>
            </div>
          </div>

          {/* 3-Year Cumulative Value Trajectory Card */}
          <div className="glass p-6 rounded-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div>
                <h3 className="text-sm font-semibold tracking-wide text-white">3-Year Cumulative Trajectory</h3>
                <p className="text-xs text-white/40 font-light">Total Net Return over 36 months of operations.</p>
              </div>
              <span className="text-sm font-mono text-emerald-400 font-medium">
                ${total3YearNetValue.toLocaleString()} Net Value
              </span>
            </div>

            {/* Visual Bar Comparison by Year */}
            <div className="space-y-3 pt-2 text-xs">
              <div>
                <div className="flex justify-between text-[10px] text-white/40 mb-1 font-mono">
                  <span>Year 1 (Setup + Deployment + Retainer)</span>
                  <span className="text-white font-medium">${netFirstYearSavings.toLocaleString()} Net</span>
                </div>
                <div className="w-full bg-black/40 h-2.5 rounded-full overflow-hidden flex">
                  <div className="bg-rose-500/60 h-full" style={{ width: `${Math.min(30, (year1AgencyCost / grossDollarSavingsAnnual) * 100)}%` }} title="Agency Investment" />
                  <div className="bg-emerald-500 h-full" style={{ width: `${Math.max(40, 100 - (year1AgencyCost / grossDollarSavingsAnnual) * 100)}%` }} title="Net Benefit" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[10px] text-white/40 mb-1 font-mono">
                  <span>Year 2 (Continuous Optimization)</span>
                  <span className="text-white font-medium">${(grossDollarSavingsAnnual - year2AgencyCost).toLocaleString()} Net</span>
                </div>
                <div className="w-full bg-black/40 h-2.5 rounded-full overflow-hidden flex">
                  <div className="bg-rose-500/60 h-full" style={{ width: `${Math.min(18, (year2AgencyCost / grossDollarSavingsAnnual) * 100)}%` }} />
                  <div className="bg-emerald-500 h-full" style={{ width: `${Math.max(70, 100 - (year2AgencyCost / grossDollarSavingsAnnual) * 100)}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[10px] text-white/40 mb-1 font-mono">
                  <span>Year 3 (Scale & Enterprise Multiplier)</span>
                  <span className="text-white font-medium">${(grossDollarSavingsAnnual - year3AgencyCost).toLocaleString()} Net</span>
                </div>
                <div className="w-full bg-black/40 h-2.5 rounded-full overflow-hidden flex">
                  <div className="bg-rose-500/60 h-full" style={{ width: `${Math.min(18, (year3AgencyCost / grossDollarSavingsAnnual) * 100)}%` }} />
                  <div className="bg-emerald-500 h-full" style={{ width: `${Math.max(70, 100 - (year3AgencyCost / grossDollarSavingsAnnual) * 100)}%` }} />
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center space-x-4 pt-2 text-[10px] text-white/40 font-mono">
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Net Client Value</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500/60"></span>
                <span>Agency Retainer</span>
              </div>
            </div>
          </div>

          {/* Direct CTA to Proposal */}
          <div className="glass p-5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-blue-500/20">
            <div>
              <span className="text-xs font-semibold text-white block">Ready to Present These Numbers?</span>
              <span className="text-[11px] text-white/40 font-light">
                These calculations will automatically populate the Commercial Terms section in the Proposal Builder.
              </span>
            </div>

            <button
              onClick={onGoToProposal}
              className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs uppercase tracking-wider flex items-center space-x-2 transition-all shadow-md cursor-pointer self-start sm:self-auto"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Generate Proposal</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
