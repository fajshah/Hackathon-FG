import React from 'react';
import { 
  HeartPulse, 
  Droplets, 
  Activity, 
  ShieldAlert, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles,
  Flame,
  Info,
  ShieldCheck
} from 'lucide-react';
import { RouteComparisonResult, UserPersona } from '../types';

interface RiskProps {
  comparison: RouteComparisonResult;
  persona: UserPersona;
}

export const PhysiologicalRiskAssessment: React.FC<RiskProps> = ({
  comparison,
  persona
}) => {
  const { arterialRoute, coolCanopyRoute, deltas } = comparison;

  return (
    <div className="bg-[#0A0A0A] border border-[#333] p-5 sm:p-6 flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#333] gap-2">
          <div>
            <p className="text-[10px] tracking-[0.25em] text-[#666] font-mono uppercase mb-1">
              04. OSHA & EPA Strain Matrix // Individual Risk
            </p>
            <h2 className="text-xl sm:text-2xl font-black italic tracking-tighter uppercase text-[#F0F0F0] font-display flex items-center gap-2">
              Physiological <span className="text-[#FF4D00]">Heat Strain</span> Assessment
            </h2>
          </div>
          <span className="text-[10px] px-2.5 py-1 bg-[#111] border border-[#333] text-[#CCC] font-mono font-bold uppercase self-start sm:self-auto">
            {persona.name} • {persona.oshaCategory}
          </span>
        </div>

        {/* Heat Strain Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5">
          <div className="p-3 bg-[#080808] border border-[#222]">
            <div className="flex items-center gap-1 text-[9px] uppercase tracking-wider text-[#666] font-mono mb-1">
              <Activity className="w-3 h-3 text-[#00FFCC]" />
              <span>Core Temp Delta</span>
            </div>
            <div className="text-2xl font-black font-display text-[#00FFCC]">
              {deltas.coreBodyTempDelta_C}°C
            </div>
            <span className="text-[9px] text-[#888] font-mono uppercase">Elevation avoided</span>
          </div>

          <div className="p-3 bg-[#080808] border border-[#222]">
            <div className="flex items-center gap-1 text-[9px] uppercase tracking-wider text-[#666] font-mono mb-1">
              <Droplets className="w-3 h-3 text-[#00FFCC]" />
              <span>Sweat Saved</span>
            </div>
            <div className="text-2xl font-black font-display text-[#00FFCC]">
              {deltas.sweatLossReduction_mL} mL
            </div>
            <span className="text-[9px] text-[#888] font-mono uppercase">Fluid loss prevented</span>
          </div>

          <div className="p-3 bg-[#080808] border border-[#222]">
            <div className="flex items-center gap-1 text-[9px] uppercase tracking-wider text-[#666] font-mono mb-1">
              <Clock className="w-3 h-3 text-[#FFCC00]" />
              <span>Rest Gained</span>
            </div>
            <div className="text-2xl font-black font-display text-[#FFCC00]">
              {deltas.oshaRestTimeSaved_min_hr} m/hr
            </div>
            <span className="text-[9px] text-[#888] font-mono uppercase">Productive gain</span>
          </div>

          <div className="p-3 bg-[#080808] border border-[#222]">
            <div className="flex items-center gap-1 text-[9px] uppercase tracking-wider text-[#666] font-mono mb-1">
              <Flame className="w-3 h-3 text-[#FF4D00]" />
              <span>Thermal Dose</span>
            </div>
            <div className="text-2xl font-black font-display text-[#FF4D00]">
              -{deltas.cumulativeThermalDoseReduction_Pct}%
            </div>
            <span className="text-[9px] text-[#888] font-mono uppercase">&gt;100°F exposure</span>
          </div>
        </div>

        {/* Persona Specific Vulnerabilities & Mitigations */}
        <div className="space-y-2 font-mono">
          <span className="text-[10px] uppercase text-[#666] block font-bold tracking-widest">
            Target Persona Heat Vulnerability Factors:
          </span>
          <div className="space-y-1.5">
            {persona.vulnerabilityFactors.map((vf, idx) => (
              <div key={idx} className="flex items-center gap-2 p-2.5 bg-[#080808] border border-[#222] text-[#DDD] text-[11px]">
                <AlertTriangle className="w-3.5 h-3.5 text-[#FFCC00] shrink-0" />
                <span>{vf}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actionable Hydration & Safety Protocol Banner */}
      <div className="mt-5 p-4 bg-[#002211] border border-[#00FFCC] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-[#00FFCC] shrink-0" />
          <div>
            <span className="text-white font-bold text-xs uppercase block tracking-wider">Certified OSHA Dispatch Protocol</span>
            <span className="text-[#00FFCC] text-[11px]">
              Hydration: {persona.recommendedHydration_mL_hr} mL/hr • Rest: {persona.restRequirement}
            </span>
          </div>
        </div>

        <span className="text-[10px] px-2.5 py-1 bg-[#00FFCC] text-black font-black uppercase tracking-wider shrink-0">
          OSHA COMPLIANT
        </span>
      </div>
    </div>
  );
};
