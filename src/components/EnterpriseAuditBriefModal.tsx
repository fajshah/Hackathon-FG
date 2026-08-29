import React from 'react';
import { 
  X, 
  Download, 
  Printer, 
  ShieldCheck, 
  CheckCircle2, 
  TreePine, 
  ThermometerSun, 
  Cpu, 
  FileText,
  Building2,
  Calendar,
  UserCheck
} from 'lucide-react';
import { AutonomousAuditBrief } from '../types';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  brief: AutonomousAuditBrief | null;
}

export const EnterpriseAuditBriefModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  brief
}) => {
  if (!isOpen || !brief) return null;

  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(brief, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${brief.briefId}-FortyGuard-Audit-Brief.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#0A0A0A] border border-[#444] max-w-4xl w-full max-h-[90vh] flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden">
        {/* Modal Top Bar */}
        <div className="p-4 bg-[#050505] border-b border-[#333] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#002211] border border-[#00FFCC] text-[#00FFCC]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-black text-base text-[#F0F0F0] uppercase tracking-tight">
                  Auditable Climate Safety & Resilience Brief
                </h2>
                <span className="text-[10px] px-2 py-0.5 bg-[#00FFCC] text-black font-mono font-bold uppercase">
                  FortyGuard'26 Certified
                </span>
              </div>
              <p className="text-xs text-[#888] font-mono mt-0.5">
                DOC ID: {brief.briefId} • GENERATED: {new Date(brief.timestamp).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="export-json-btn"
              onClick={handleDownloadJSON}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#111] hover:bg-[#222] text-[#00FFCC] text-xs font-mono font-bold border border-[#00FFCC]/50 transition-all cursor-pointer uppercase"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>
            <button
              id="print-brief-btn"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FF4D00] hover:bg-[#FF6622] text-black text-xs font-mono font-black italic transition-all cursor-pointer uppercase"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              id="close-modal-btn"
              onClick={onClose}
              className="p-1.5 text-[#888] hover:text-white hover:bg-[#222] transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Printable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-[#DDD] font-sans text-xs">
          {/* Executive Certification Header */}
          <div className="p-4 bg-[#050505] border border-[#333] flex flex-col md:flex-row justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono text-[#00FFCC] font-bold tracking-widest block">
                Autonomous Multi-Agent Decision Ledger
              </span>
              <h3 className="font-display text-xl font-black italic text-white uppercase tracking-tight">
                Phoenix Microclimate Corridor Safety Directive
              </h3>
              <p className="text-[#999] font-mono text-xs">
                Zone: <strong className="text-white">{brief.metroZone}</strong> • Persona: <strong className="text-white">{brief.targetPersona.name} ({brief.targetPersona.role})</strong>
              </p>
            </div>

            <div className="flex flex-col items-start md:items-end justify-center font-mono text-xs">
              <span className="text-[10px] text-[#888] uppercase">OSHA 29 CFR 1910 VERDICT:</span>
              <span className="text-base font-black text-[#00FFCC] mt-0.5">
                {brief.oshaPhysiologicalVerdict.complianceStatus}
              </span>
              <span className="text-[10px] text-[#666] mt-1">
                Sig: {brief.hackathonCertification.signature}
              </span>
            </div>
          </div>

          {/* Section 1: Microclimate Delta Ledger */}
          <div className="space-y-2">
            <h4 className="font-mono text-xs font-bold text-[#F0F0F0] uppercase tracking-wider flex items-center gap-1.5">
              <ThermometerSun className="w-4 h-4 text-[#00FFCC]" />
              1. FortyGuard 20m² Thermal Microclimate Delta Ledger
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-[#080808] border border-[#222]">
                <span className="text-[10px] text-[#888] font-mono block uppercase">2m Air Temp Delta</span>
                <span className="text-2xl font-black font-display text-[#00FFCC]">
                  -{brief.corridorSummary.temperatureDelta_F}°F
                </span>
                <span className="text-[10px] text-[#666] block font-mono">Ambient relief under canopy</span>
              </div>
              <div className="p-3 bg-[#080808] border border-[#222]">
                <span className="text-[10px] text-[#888] font-mono block uppercase">Radiant Tmrt Delta</span>
                <span className="text-2xl font-black font-display text-[#00FFCC]">
                  -{brief.corridorSummary.radiantHeatDelta_F}°F
                </span>
                <span className="text-[10px] text-[#666] block font-mono">Radiant solar attenuation</span>
              </div>
              <div className="p-3 bg-[#080808] border border-[#222]">
                <span className="text-[10px] text-[#888] font-mono block uppercase">Solar Radiation Reduction</span>
                <span className="text-2xl font-black font-display text-[#00FFCC]">
                  -{brief.corridorSummary.solarFluxReductionPct}%
                </span>
                <span className="text-[10px] text-[#666] block font-mono">UV & shortwave blocked</span>
              </div>
            </div>
          </div>

          {/* Section 2: Physiological Heat Stress Assessment */}
          <div className="space-y-2">
            <h4 className="font-mono text-xs font-bold text-[#F0F0F0] uppercase tracking-wider flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-[#FF4D00]" />
              2. OSHA & EPA Quantitative Physiological Risk Evaluation
            </h4>
            <div className="p-4 bg-[#080808] border border-[#222] grid grid-cols-1 md:grid-cols-2 gap-4 font-mono">
              <div className="space-y-2">
                <p><span className="text-[#888]">Heat Stress Benchmark:</span> <span className="text-white font-bold">{brief.oshaPhysiologicalVerdict.heatStressIndex}</span></p>
                <p><span className="text-[#888]">WBGT Assessment:</span> <span className="text-white font-bold">{brief.oshaPhysiologicalVerdict.wbgtAssessment}</span></p>
                <p><span className="text-[#888]">Projected Core Temp:</span> <span className="text-[#00FFCC] font-black">{brief.oshaPhysiologicalVerdict.projectedCoreTemp_F}°F</span></p>
              </div>
              <div className="space-y-2">
                <p><span className="text-[#888]">Mandatory Rest Cycle:</span> <span className="text-white font-bold">{brief.oshaPhysiologicalVerdict.mandatoryRestCycle}</span></p>
                <p><span className="text-[#888]">Hydration Schedule:</span> <span className="text-[#00FFCC] font-black">{brief.oshaPhysiologicalVerdict.hydrationSchedule_mL_hr} mL/hr</span></p>
                <p><span className="text-[#888]">Metabolic Exertion:</span> <span className="text-white">{brief.targetPersona.metabolicRate_W}W ({brief.targetPersona.oshaCategory})</span></p>
              </div>
            </div>
          </div>

          {/* Section 3: Multi-Agent Chain-of-Thought Reasoning */}
          <div className="space-y-2">
            <h4 className="font-mono text-xs font-bold text-[#F0F0F0] uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-[#00FFCC]" />
              3. Multi-Agent Reasoning Chain of Custody
            </h4>
            <div className="space-y-2">
              {brief.agenticReasoningInsights.map((insight, idx) => (
                <div key={idx} className="p-3 bg-[#080808] border border-[#222] font-mono text-[11px] leading-relaxed text-[#CCC] flex items-start gap-2.5">
                  <span className="text-[#00FFCC] font-black shrink-0">0{idx + 1}.</span>
                  <span>{insight}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Certified Actionable Directives */}
          <div className="space-y-2">
            <h4 className="font-mono text-xs font-bold text-[#F0F0F0] uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#00FF41]" />
              4. Mandatory Dispatch Safety Directives
            </h4>
            <div className="space-y-2">
              {brief.actionableDirectives.map((dir, idx) => (
                <div key={idx} className="p-3 bg-[#002211] border border-[#00FFCC] font-mono text-[11px] text-[#E0FFF0] flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#00FFCC] shrink-0 mt-0.5" />
                  <span>{dir}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Resilience ROI & Economic Impact */}
          <div className="space-y-2">
            <h4 className="font-mono text-xs font-bold text-[#F0F0F0] uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-[#FFCC00]" />
              5. Municipal Resilience ROI & Labor Productivity Impact
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
              <div className="p-3 bg-[#080808] border border-[#222]">
                <span className="text-[10px] text-[#888] block uppercase">Heat Illness Risk Reduction</span>
                <span className="text-2xl font-black font-display text-[#00FFCC]">
                  {brief.resilienceRoiImpact.heatIllnessRiskReduction_Pct}%
                </span>
              </div>
              <div className="p-3 bg-[#080808] border border-[#222]">
                <span className="text-[10px] text-[#888] block uppercase">Shift Rest Time Saved</span>
                <span className="text-2xl font-black font-display text-[#FFCC00]">
                  {brief.resilienceRoiImpact.productiveLaborSaved_min_shift}m / shift
                </span>
              </div>
              <div className="p-3 bg-[#080808] border border-[#222]">
                <span className="text-[10px] text-[#888] block uppercase">Cooling Carbon Benefit</span>
                <span className="text-2xl font-black font-display text-[#00FF41]">
                  {brief.resilienceRoiImpact.urbanCoolingCarbonAvoidance_kgCO2} kg CO2e/km
                </span>
              </div>
            </div>
          </div>

          {/* Hackathon Verification Footer */}
          <div className="pt-4 border-t border-[#333] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#666] font-mono gap-2">
            <span>{brief.hackathonCertification.track}</span>
            <span>ENGINE: {brief.hackathonCertification.modelCore}</span>
            <span>RESOLUTION: {brief.hackathonCertification.dataResolution}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
