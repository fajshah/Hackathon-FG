import React from 'react';
import { 
  Flame, 
  TreePine, 
  ShieldAlert, 
  Sparkles, 
  Download, 
  Activity, 
  ThermometerSun, 
  SunMedium, 
  Droplets,
  HardHat,
  HeartPulse,
  Bike,
  GraduationCap,
  SlidersHorizontal,
  FileCheck
} from 'lucide-react';
import { UserPersona, ClimateScenario, PersonaId } from '../types';
import { USER_PERSONAS, CLIMATE_SCENARIOS } from '../data/fortyguardPhoenixData';

interface HeaderProps {
  currentPersona: UserPersona;
  onSelectPersona: (persona: UserPersona) => void;
  currentScenario: ClimateScenario;
  onSelectScenario: (scenario: ClimateScenario) => void;
  onRunAgenticDecision: () => void;
  isAgentRunning: boolean;
  onOpenAuditBrief: () => void;
  onToggleSimulator: () => void;
  isSimulatorOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentPersona,
  onSelectPersona,
  currentScenario,
  onSelectScenario,
  onRunAgenticDecision,
  isAgentRunning,
  onOpenAuditBrief,
  onToggleSimulator,
  isSimulatorOpen
}) => {
  const getPersonaIcon = (iconName: string) => {
    switch (iconName) {
      case 'HardHat': return <HardHat className="w-3.5 h-3.5" />;
      case 'HeartPulse': return <HeartPulse className="w-3.5 h-3.5" />;
      case 'Bike': return <Bike className="w-3.5 h-3.5" />;
      case 'GraduationCap': return <GraduationCap className="w-3.5 h-3.5" />;
      case 'ShieldAlert': return <ShieldAlert className="w-3.5 h-3.5" />;
      default: return <Activity className="w-3.5 h-3.5" />;
    }
  };

  return (
    <header className="bg-[#050505] border-b border-[#333] sticky top-0 z-40 px-4 lg:px-8 py-4">
      <div className="max-w-7xl mx-auto flex flex-col gap-4">
        {/* Top Header Bar */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          {/* Brand & Track Meta */}
          <div>
            <p className="text-[10px] tracking-[0.3em] text-[#666] font-mono mb-1.5 uppercase">
              FortyGuard Hackathon'26 // Track 1 & 6 // Phoenix 20m² Grid
            </p>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black italic tracking-tighter uppercase leading-none text-[#F0F0F0] font-display">
              CoolRoute <span className="text-[#FF4D00]">Autonomous</span> Intelligence
            </h1>
          </div>

          {/* System Status & Live Environmental Flux Telemetry */}
          <div className="flex flex-wrap items-center gap-4 lg:gap-6 font-mono text-xs">
            <div className="flex items-center gap-3 bg-[#111] px-3.5 py-2 border border-[#222]">
              <span className="w-2 h-2 bg-[#00FF41] rounded-full shadow-[0_0_8px_#00FF41] animate-pulse"></span>
              <div>
                <span className="text-[9px] uppercase tracking-widest text-[#666] block">System Status</span>
                <span className="text-xs font-mono font-bold tracking-wider text-[#00FF41]">
                  {isAgentRunning ? 'AGENTIC_SYNTHESIZING' : 'AGENTIC_CORE_ACTIVE'}
                </span>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-4 bg-[#111] px-4 py-2 border border-[#222]">
              <div>
                <span className="text-[9px] uppercase tracking-widest text-[#666] block">2M Ambient</span>
                <span className="text-sm font-black text-[#FF4D00]">{currentScenario.baseTemp_F}°F</span>
              </div>
              <div className="w-px h-6 bg-[#333]" />
              <div>
                <span className="text-[9px] uppercase tracking-widest text-[#666] block">Solar Flux</span>
                <span className="text-sm font-bold text-white">{Math.round(980 * currentScenario.solarFluxMultiplier)} W/m²</span>
              </div>
              <div className="w-px h-6 bg-[#333]" />
              <div>
                <span className="text-[9px] uppercase tracking-widest text-[#666] block">Rel Humidity</span>
                <span className="text-sm font-bold text-[#00FFCC]">{currentScenario.relativeHumidity_Pct}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Control Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#222]">
          {/* Persona Selection */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-[#666] mr-1">
              Target Persona:
            </span>
            <div className="flex items-center gap-1 bg-[#111] border border-[#222] p-1">
              {USER_PERSONAS.map((p) => {
                const isSelected = p.id === currentPersona.id;
                return (
                  <button
                    key={p.id}
                    id={`persona-btn-${p.id}`}
                    onClick={() => onSelectPersona(p)}
                    title={`${p.name} - ${p.role}`}
                    className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono tracking-wider uppercase transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#FF4D00] text-black font-black italic shadow-sm'
                        : 'text-[#888] hover:text-[#F0F0F0] hover:bg-[#1A1A1A]'
                    }`}
                  >
                    {getPersonaIcon(p.icon)}
                    <span className="hidden sm:inline">{p.name.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Scenario & Engine Actions */}
          <div className="flex items-center gap-2 flex-wrap justify-end">
            {/* Scenario Selector */}
            <div className="flex items-center gap-1.5 bg-[#111] border border-[#222] px-2 py-1">
              <span className="text-[9px] uppercase font-mono tracking-widest text-[#666]">Scenario:</span>
              <select
                id="scenario-selector"
                value={currentScenario.id}
                onChange={(e) => {
                  const found = CLIMATE_SCENARIOS.find(s => s.id === e.target.value);
                  if (found) onSelectScenario(found);
                }}
                aria-label="Select Climate Scenario"
                className="bg-transparent text-xs text-[#F0F0F0] focus:outline-none font-mono font-bold uppercase cursor-pointer"
              >
                {CLIMATE_SCENARIOS.map(s => (
                  <option key={s.id} value={s.id} className="bg-[#111] text-white">
                    {s.name} ({s.timeOfDay})
                  </option>
                ))}
              </select>
            </div>

            {/* Grid Sandbox Toggle */}
            <button
              id="toggle-simulator-btn"
              onClick={onToggleSimulator}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono uppercase tracking-wider border transition-all cursor-pointer ${
                isSimulatorOpen
                  ? 'bg-[#00FFCC]/10 text-[#00FFCC] border-[#00FFCC] font-bold'
                  : 'bg-[#111] text-[#AAA] border-[#333] hover:text-white hover:border-[#555]'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Grid Sandbox</span>
            </button>

            {/* OSHA Brief Modal Trigger */}
            <button
              id="open-audit-brief-btn"
              onClick={onOpenAuditBrief}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#111] text-[#F0F0F0] border border-[#333] hover:border-[#555] text-xs font-mono uppercase tracking-wider font-bold transition-all cursor-pointer"
            >
              <FileCheck className="w-3.5 h-3.5 text-[#00FFCC]" />
              <span>OSHA Brief</span>
            </button>

            {/* Run Engine Main CTA */}
            <button
              id="run-agent-btn"
              disabled={isAgentRunning}
              onClick={onRunAgenticDecision}
              className="flex items-center gap-2 bg-[#FF4D00] text-black px-4 py-2 font-black italic text-xs uppercase tracking-tighter hover:bg-[#FF6622] disabled:opacity-50 transition-all cursor-pointer shadow-[0_0_12px_rgba(255,77,0,0.3)] font-display"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isAgentRunning ? 'animate-spin' : ''}`} />
              <span>{isAgentRunning ? 'Synthesizing...' : 'Deploy Core Decision'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
