import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Terminal, 
  ArrowRight, 
  ShieldCheck, 
  Activity, 
  Flame, 
  TreePine, 
  Scale,
  RefreshCw,
  FileCheck
} from 'lucide-react';
import { AgentLogEntry, AutonomousAuditBrief, RouteComparisonResult, UserPersona } from '../types';

interface ConsoleProps {
  comparison: RouteComparisonResult;
  persona: UserPersona;
  isAgentRunning: boolean;
  auditBrief: AutonomousAuditBrief | null;
  onTriggerDecision: () => void;
  onOpenFullBrief: () => void;
}

export const MultiAgentExecutionConsole: React.FC<ConsoleProps> = ({
  comparison,
  persona,
  isAgentRunning,
  auditBrief,
  onTriggerDecision,
  onOpenFullBrief
}) => {
  const [activeTab, setActiveTab] = useState<'agents' | 'brief'>('agents');
  const [activeStep, setActiveStep] = useState<number>(4);

  const agents = [
    {
      id: 'agent_1',
      name: 'Agent 1: 20m² Spatial Raster Ingestion',
      role: 'FortyGuard 2m Ambient Telemetry Core',
      icon: Flame,
      color: 'text-[#FF4D00]',
      badge: 'INGESTION',
      description: 'Ingesting 400+ FortyGuard 20m² street-level nodes. Computing 2m air temp & surface thermal inertia.'
    },
    {
      id: 'agent_2',
      name: 'Agent 2: Solar & Canopy Attenuation',
      role: 'Radiative Transfer & Mean Radiant Tmrt Engine',
      icon: TreePine,
      color: 'text-[#00FFCC]',
      badge: 'PHYSICS',
      description: `Evaluating ${comparison.deltas.canopyIncrease_Pct}% canopy delta. Solar flux attenuated by ${comparison.deltas.solarFluxReduction_Pct}%.`
    },
    {
      id: 'agent_3',
      name: 'Agent 3: OSHA & EPA Physiological Assessor',
      role: 'Human Heat Strain & OSHA 29 CFR 1910 Compliance',
      icon: Activity,
      color: 'text-[#00FF41]',
      badge: 'PHYSIOLOGY',
      description: `Evaluating ${persona.role} (${persona.metabolicRate_W}W). Sweat loss deficit reduced by ${comparison.deltas.sweatLossReduction_mL} mL.`
    },
    {
      id: 'agent_4',
      name: 'Agent 4: Pareto Navigation & Dispatch Optimizer',
      role: 'Autonomous Trade-Off & Safety Dispatch Core',
      icon: Scale,
      color: 'text-[#FFCC00]',
      badge: 'DISPATCH',
      description: `Pareto optimal: +${comparison.deltas.distanceDelta_m}m detour saves ${comparison.deltas.oshaRestTimeSaved_min_hr} min/hr mandatory rest.`
    }
  ];

  return (
    <div className="bg-[#0A0A0A] border border-[#333] flex flex-col h-full">
      {/* Header */}
      <div className="p-4 bg-[#050505] border-b border-[#333] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-[10px] tracking-[0.25em] text-[#666] font-mono uppercase mb-1">
            03. Multi-Agent Pipeline // Track 6 Agentic Core
          </p>
          <h2 className="text-xl sm:text-2xl font-black italic tracking-tighter uppercase text-[#F0F0F0] font-display flex items-center gap-2">
            Multi-Agent <span className="text-[#00FFCC]">Decision</span> Core
          </h2>
        </div>

        <div className="flex items-center gap-1 bg-[#111] border border-[#222] p-1 text-xs font-mono">
          <button
            id="tab-agents-btn"
            onClick={() => setActiveTab('agents')}
            className={`px-3 py-1 text-xs uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'agents' ? 'bg-[#FF4D00] text-black font-black italic' : 'text-[#888] hover:text-white'
            }`}
          >
            Live Pipeline
          </button>
          <button
            id="tab-brief-btn"
            onClick={() => setActiveTab('brief')}
            className={`px-3 py-1 text-xs uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'brief' ? 'bg-[#00FFCC] text-black font-black italic' : 'text-[#888] hover:text-white'
            }`}
          >
            OSHA Verdict
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 flex-1 flex flex-col justify-between overflow-y-auto max-h-[440px]">
        {activeTab === 'agents' ? (
          <div className="space-y-3">
            {agents.map((ag, index) => {
              const Icon = ag.icon;
              const isRunning = isAgentRunning && activeStep === index;
              return (
                <div 
                  key={ag.id}
                  className={`p-3.5 border transition-all ${
                    isRunning 
                      ? 'bg-[#002211] border-[#00FFCC] shadow-[0_0_15px_rgba(0,255,204,0.15)]' 
                      : 'bg-[#080808] border-[#222] hover:border-[#444]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-1.5 bg-[#111] border border-[#222] ${ag.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wide">
                          {ag.name}
                        </h3>
                        <span className="text-[10px] text-[#888] font-mono">{ag.role}</span>
                      </div>
                    </div>

                    <span className="text-[10px] px-2 py-0.5 font-mono font-bold uppercase bg-[#111] border border-[#333] text-[#CCC]">
                      {ag.badge}
                    </span>
                  </div>

                  <p className="text-xs text-[#DDD] mt-2.5 font-mono bg-[#050505] p-2.5 border border-[#1A1A1A] leading-relaxed">
                    {ag.description}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          /* Structured Audit Brief Preview */
          <div className="space-y-3">
            {auditBrief ? (
              <div className="space-y-3 text-xs">
                <div className="p-4 bg-[#002211] border border-[#00FFCC] shadow-[0_0_15px_rgba(0,255,204,0.08)]">
                  <div className="flex items-center justify-between pb-2 border-b border-[#004422]">
                    <span className="font-mono text-[#00FFCC] font-bold text-xs">
                      {auditBrief.briefId}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 bg-[#00FFCC] text-black font-mono font-black uppercase">
                      {auditBrief.oshaPhysiologicalVerdict.complianceStatus}
                    </span>
                  </div>

                  <div className="mt-3 text-[#F0F0F0] space-y-1.5 font-mono text-[11px]">
                    <p><span className="text-[#00aa88]">Selected Routing:</span> {auditBrief.corridorSummary.selectedCorridor}</p>
                    <p><span className="text-[#00aa88]">Thermal Delta:</span> -{auditBrief.corridorSummary.temperatureDelta_F}°F 2m ambient (-{auditBrief.corridorSummary.radiantHeatDelta_F}°F radiant Tmrt)</p>
                    <p><span className="text-[#00aa88]">Hydration Directive:</span> {auditBrief.oshaPhysiologicalVerdict.hydrationSchedule_mL_hr} mL/hour</p>
                    <p><span className="text-[#00aa88]">Rest Mandate:</span> {auditBrief.oshaPhysiologicalVerdict.mandatoryRestCycle}</p>
                  </div>
                </div>

                <div className="space-y-1.5 font-mono">
                  <span className="text-[10px] uppercase text-[#666] block font-bold tracking-widest">
                    Actionable Safety Directives:
                  </span>
                  {auditBrief.actionableDirectives.map((dir, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-2 bg-[#080808] border border-[#222] text-[#CCC] text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#00FFCC] shrink-0 mt-0.5" />
                      <span>{dir}</span>
                    </div>
                  ))}
                </div>

                <button
                  id="view-full-brief-btn"
                  onClick={onOpenFullBrief}
                  className="w-full py-2.5 px-4 bg-[#FF4D00] hover:bg-[#FF6622] text-black text-xs font-black italic uppercase tracking-tighter flex items-center justify-center gap-2 transition-all cursor-pointer font-display"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>Inspect Certified OSHA Brief & Export</span>
                </button>
              </div>
            ) : (
              <div className="p-8 text-center text-[#666] space-y-2 font-mono text-xs">
                <Sparkles className="w-8 h-8 text-[#00FFCC] mx-auto animate-pulse" />
                <p className="uppercase tracking-widest">Deploy core decision engine to synthesize brief.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Controls */}
      <div className="p-3 bg-[#050505] border-t border-[#333] flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-[#888] font-mono">
          <ShieldCheck className="w-4 h-4 text-[#00FFCC]" />
          <span className="uppercase text-[10px] tracking-wider">OSHA 29 CFR 1910 / FortyGuard Verified</span>
        </div>

        <button
          id="re-evaluate-engine-btn"
          disabled={isAgentRunning}
          onClick={onTriggerDecision}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00FFCC] text-black font-black italic text-xs uppercase tracking-tighter hover:bg-[#33FFDD] transition-all cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isAgentRunning ? 'animate-spin' : ''}`} />
          <span>Re-Evaluate</span>
        </button>
      </div>
    </div>
  );
};
