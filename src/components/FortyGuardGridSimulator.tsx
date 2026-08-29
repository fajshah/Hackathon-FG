import React from 'react';
import { 
  SlidersHorizontal, 
  TreePine, 
  Sun, 
  Thermometer, 
  Sparkles, 
  RotateCcw, 
  TrendingDown, 
  ShieldCheck,
  Droplets,
  Zap
} from 'lucide-react';
import { ClimateScenario } from '../types';

interface SimulatorProps {
  scenario: ClimateScenario;
  onUpdateScenario: (updated: ClimateScenario) => void;
  onResetScenario: () => void;
}

export const FortyGuardGridSimulator: React.FC<SimulatorProps> = ({
  scenario,
  onUpdateScenario,
  onResetScenario
}) => {
  return (
    <div className="bg-[#0A0A0A] border border-[#333] p-5 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#333] gap-2">
        <div>
          <p className="text-[10px] tracking-[0.25em] text-[#666] font-mono uppercase mb-1">
            05. Microclimate Sandbox // Interventions
          </p>
          <h2 className="text-xl sm:text-2xl font-black italic tracking-tighter uppercase text-[#F0F0F0] font-display flex items-center gap-2">
            FortyGuard <span className="text-[#00FFCC]">Microclimate</span> Sandbox
          </h2>
        </div>

        <button
          id="reset-sandbox-btn"
          onClick={onResetScenario}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#111] hover:bg-[#222] text-[#CCC] hover:text-white text-xs font-mono font-bold uppercase border border-[#333] transition-all cursor-pointer self-start sm:self-auto"
        >
          <RotateCcw className="w-3 h-3 text-[#00FFCC]" />
          <span>Reset Defaults</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-5">
        {/* Baseline Ambient Temp Slider */}
        <div className="p-4 bg-[#080808] border border-[#222] space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[#888] flex items-center gap-1.5 uppercase text-[10px] tracking-wider font-bold">
              <Thermometer className="w-3.5 h-3.5 text-[#FF4D00]" />
              Ambient Temp
            </span>
            <strong className="text-white text-base font-bold font-display">{scenario.baseTemp_F}°F</strong>
          </div>
          <input
            id="slider-ambient-temp"
            type="range"
            min="90"
            max="122"
            step="1"
            value={scenario.baseTemp_F}
            onChange={(e) => onUpdateScenario({ ...scenario, baseTemp_F: Number(e.target.value) })}
            className="w-full accent-[#FF4D00] cursor-pointer"
          />
          <div className="flex justify-between text-[9px] text-[#666] font-mono uppercase">
            <span>90°F Mild</span>
            <span>122°F Extreme</span>
          </div>
        </div>

        {/* Tree Canopy Expansion Slider */}
        <div className="p-4 bg-[#080808] border border-[#222] space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[#888] flex items-center gap-1.5 uppercase text-[10px] tracking-wider font-bold">
              <TreePine className="w-3.5 h-3.5 text-[#00FFCC]" />
              Canopy Bonus
            </span>
            <strong className="text-[#00FFCC] text-base font-bold font-display">+{scenario.canopyBonus_Pct}%</strong>
          </div>
          <input
            id="slider-canopy-bonus"
            type="range"
            min="0"
            max="60"
            step="5"
            value={scenario.canopyBonus_Pct}
            onChange={(e) => onUpdateScenario({ ...scenario, canopyBonus_Pct: Number(e.target.value) })}
            className="w-full accent-[#00FFCC] cursor-pointer"
          />
          <div className="flex justify-between text-[9px] text-[#666] font-mono uppercase">
            <span>0% Current</span>
            <span>+60% Mature</span>
          </div>
        </div>

        {/* Cool Pavement Albedo Slider */}
        <div className="p-4 bg-[#080808] border border-[#222] space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[#888] flex items-center gap-1.5 uppercase text-[10px] tracking-wider font-bold">
              <Sun className="w-3.5 h-3.5 text-[#00FF41]" />
              Pavement Albedo
            </span>
            <strong className="text-[#00FF41] text-base font-bold font-display">+{(scenario.albedoBonus * 100).toFixed(0)}%</strong>
          </div>
          <input
            id="slider-albedo-bonus"
            type="range"
            min="0"
            max="0.30"
            step="0.05"
            value={scenario.albedoBonus}
            onChange={(e) => onUpdateScenario({ ...scenario, albedoBonus: Number(e.target.value) })}
            className="w-full accent-[#00FF41] cursor-pointer"
          />
          <div className="flex justify-between text-[9px] text-[#666] font-mono uppercase">
            <span>Dark Asphalt</span>
            <span>Cool Seal (0.38)</span>
          </div>
        </div>

        {/* Relative Humidity Slider */}
        <div className="p-4 bg-[#080808] border border-[#222] space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[#888] flex items-center gap-1.5 uppercase text-[10px] tracking-wider font-bold">
              <Droplets className="w-3.5 h-3.5 text-[#3388FF]" />
              Rel Humidity
            </span>
            <strong className="text-[#3388FF] text-base font-bold font-display">{scenario.relativeHumidity_Pct}%</strong>
          </div>
          <input
            id="slider-humidity"
            type="range"
            min="10"
            max="65"
            step="1"
            value={scenario.relativeHumidity_Pct}
            onChange={(e) => onUpdateScenario({ ...scenario, relativeHumidity_Pct: Number(e.target.value) })}
            className="w-full accent-[#3388FF] cursor-pointer"
          />
          <div className="flex justify-between text-[9px] text-[#666] font-mono uppercase">
            <span>10% Dry Heat</span>
            <span>65% Monsoon</span>
          </div>
        </div>
      </div>
    </div>
  );
};
