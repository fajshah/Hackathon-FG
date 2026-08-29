import React from 'react';
import { 
  ThermometerSun, 
  Sun, 
  TreePine, 
  Droplets, 
  Clock, 
  ShieldAlert, 
  TrendingDown, 
  ArrowRight, 
  Check, 
  X,
  Footprints,
  Flame,
  Zap
} from 'lucide-react';
import { RouteComparisonResult, UserPersona } from '../types';

interface ComparisonProps {
  comparison: RouteComparisonResult;
  persona: UserPersona;
}

export const ThermalCorridorComparisonPanel: React.FC<ComparisonProps> = ({
  comparison,
  persona
}) => {
  const { arterialRoute, coolCanopyRoute, deltas } = comparison;

  return (
    <div className="bg-[#0A0A0A] border border-[#333] p-5 sm:p-6 flex flex-col justify-between">
      {/* Top Banner with Bold Typography Archetype */}
      <div className="border-b border-[#333] pb-5 mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-[10px] tracking-[0.25em] text-[#666] font-mono uppercase mb-2">
            02. Navigation Delta Analysis // Phoenix Metro Core
          </p>
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-3 sm:gap-6">
            <h3 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-none tracking-tighter italic text-[#F0F0F0] font-display">
              -{Math.abs(deltas.avgAmbient2mDelta_F)}°F
            </h3>
            <div className="text-xs uppercase font-bold tracking-widest font-mono leading-tight text-[#AAA]">
              Potential Temperature <br />
              <span className="text-[#00FFCC] font-black">Micro-Reduction</span> via Canopy Route
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-[#111] px-4 py-2 border border-[#222] font-mono text-xs">
          <span className="text-[#666] uppercase text-[10px] tracking-widest">Tmrt Relief</span>
          <span className="text-[#00FFCC] font-black text-sm">-{Math.abs(deltas.meanRadiantTempDelta_F)}°F</span>
          <div className="w-px h-4 bg-[#333]" />
          <span className="text-[#666] uppercase text-[10px] tracking-widest">Solar Flux Cut</span>
          <span className="text-[#00FFCC] font-black text-sm">-{deltas.solarFluxReduction_Pct}%</span>
        </div>
      </div>

      {/* Side-by-Side Direct Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        {/* Unshaded High-Asphalt Arterial Corridor */}
        <div className="border border-[#333] p-5 sm:p-6 bg-[#080808] hover:bg-[#111] transition-colors flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-3">
              <p className="text-[10px] uppercase tracking-widest text-[#666] font-mono">
                Route Option A: Arterial Heat Corridor
              </p>
              <span className="text-[10px] px-2 py-0.5 bg-[#FF4D00]/20 text-[#FF4D00] border border-[#FF4D00]/40 font-mono font-bold uppercase">
                {arterialRoute.oshaRiskLevel}
              </span>
            </div>

            <h4 className="text-xl sm:text-2xl font-bold font-display text-white mb-2 uppercase tracking-tight">
              {arterialRoute.name}
            </h4>

            <div className="flex items-end gap-2 mb-3">
              <span className="text-4xl sm:text-5xl font-black font-display text-white">
                {arterialRoute.avgAmbientTemp2m_F}°
              </span>
              <span className="text-xs text-[#FF4D00] mb-1 font-mono font-bold tracking-wider">
                [EXPOSED • NO SHADE]
              </span>
            </div>

            {/* Solid Thermal Load Bar */}
            <div className="mb-4 h-1.5 w-full bg-[#222]">
              <div className="h-full w-[95%] bg-[#FF4D00]" />
            </div>

            {/* Monospace Telemetry Grid */}
            <div className="space-y-2 font-mono text-[11px] bg-[#111] p-3 border border-[#222]">
              <div className="flex justify-between">
                <span className="text-[#666]">MEAN_RADIANT_TMRT</span>
                <span className="text-[#FF4D00] font-bold">{arterialRoute.avgMeanRadiantTemp_F}°F</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#666]">SOLAR_RAD_FLUX</span>
                <span className="text-[#F0F0F0] font-bold">{arterialRoute.avgSolarRadiationFlux_Wm2} W/m²</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#666]">EST_SWEAT_LOSS</span>
                <span className="text-[#FF4D00] font-bold">{arterialRoute.estimatedSweatLoss_mL} mL</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#666]">CUMULATIVE_THERMAL_DOSE</span>
                <span className="text-[#FF4D00] font-bold">{arterialRoute.cumulativeThermalDose_DegMin} deg-min</span>
              </div>
              <div className="flex justify-between border-t border-[#222] pt-2 font-bold">
                <span className="text-[#666]">MANDATORY_OSHA_REST</span>
                <span className="text-[#FF4D00]">{arterialRoute.oshaRequiredRest_min_hr} min / hr</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#222] text-[10px] text-[#FF4D00] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
            <X className="w-3.5 h-3.5 shrink-0" />
            <span>Violates OSHA Heat NEP thresholds for continuous labor</span>
          </div>
        </div>

        {/* Shaded Tree Canopy Cool Route */}
        <div className="border border-[#00FFCC] p-5 sm:p-6 bg-[#002211] shadow-[0_0_20px_rgba(0,255,204,0.06)] flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-3">
              <p className="text-[10px] uppercase tracking-widest text-[#00FFCC] font-mono font-bold">
                Route Option B: Shaded Canopy (Recommended)
              </p>
              <span className="text-[10px] px-2 py-0.5 bg-[#00FFCC]/20 text-[#00FFCC] border border-[#00FFCC]/50 font-mono font-bold uppercase">
                {coolCanopyRoute.oshaRiskLevel}
              </span>
            </div>

            <h4 className="text-xl sm:text-2xl font-bold font-display text-white mb-2 uppercase tracking-tight">
              {coolCanopyRoute.name}
            </h4>

            <div className="flex items-end gap-2 mb-3">
              <span className="text-4xl sm:text-5xl font-black font-display text-[#00FFCC]">
                {coolCanopyRoute.avgAmbientTemp2m_F}°
              </span>
              <span className="text-xs text-[#00FFCC] mb-1 font-mono font-bold tracking-wider">
                [PROTECTED • {coolCanopyRoute.avgCanopyCoverage_Pct}% CANOPY]
              </span>
            </div>

            {/* Solid Cooling Protection Bar */}
            <div className="mb-4 h-1.5 w-full bg-[#113322]">
              <div className="h-full w-[65%] bg-[#00FFCC]" />
            </div>

            {/* Monospace Telemetry Grid */}
            <div className="space-y-2 font-mono text-[11px] bg-[#00180c] p-3 border border-[#004422]">
              <div className="flex justify-between">
                <span className="text-[#00aa88]">MEAN_RADIANT_TMRT</span>
                <span className="text-[#00FFCC] font-bold">{coolCanopyRoute.avgMeanRadiantTemp_F}°F</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#00aa88]">SOLAR_RAD_FLUX</span>
                <span className="text-[#00FFCC] font-bold">{coolCanopyRoute.avgSolarRadiationFlux_Wm2} W/m²</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#00aa88]">FLUID_DEFICIT_SAVED</span>
                <span className="text-[#00FFCC] font-bold">-{deltas.sweatLossReduction_mL} mL</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#00aa88]">THERMAL_DOSE_CUT</span>
                <span className="text-[#00FFCC] font-bold">-{deltas.cumulativeThermalDoseReduction_Pct}%</span>
              </div>
              <div className="flex justify-between border-t border-[#003318] pt-2 font-bold">
                <span className="text-[#00aa88]">REST_REDUCTION_GAIN</span>
                <span className="text-[#00FFCC]">+{deltas.oshaRestTimeSaved_min_hr} min / hr productive</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#004422] text-[10px] text-[#00FFCC] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 shrink-0" />
            <span>Fully OSHA 29 CFR 1910 Compliant • Continuous Shade Protection</span>
          </div>
        </div>
      </div>

      {/* Waypoint Microclimate Cross-Section Elevation & Temp Graph */}
      <div className="bg-[#050505] border border-[#222] p-4">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <p className="text-[10px] uppercase font-mono tracking-[0.2em] text-[#666]">
            Thermal Cross-Section Profile // Spatial Corridor Distance (m)
          </p>
          <div className="flex items-center gap-4 text-[10px] font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-[#FF4D00]" />
              <span className="text-[#AAA]">Arterial (Avg {arterialRoute.avgAmbientTemp2m_F}°F)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-[#00FFCC]" />
              <span className="text-[#00FFCC]">Cool Canopy (Avg {coolCanopyRoute.avgAmbientTemp2m_F}°F)</span>
            </div>
          </div>
        </div>

        <div className="h-28 w-full flex items-end gap-2 pt-4 pb-2 px-1 relative bg-[#080808] border border-[#1A1A1A]">
          {/* 100°F Threshold Guideline */}
          <div className="absolute top-6 left-0 right-0 border-b border-dashed border-[#FF4D00]/50 flex items-center justify-end pr-2">
            <span className="text-[9px] text-[#FF4D00] font-mono font-bold tracking-wider">
              100°F CRITICAL HEAT THRESHOLD
            </span>
          </div>

          {coolCanopyRoute.waypoints.map((wp, idx) => {
            const artWp = arterialRoute.waypoints[idx] || arterialRoute.waypoints[arterialRoute.waypoints.length - 1];
            const artHeight = Math.min(100, Math.max(15, (artWp.ambientTemp2m_F - 90) * 3));
            const canHeight = Math.min(100, Math.max(15, (wp.ambientTemp2m_F - 90) * 3));

            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                <div className="w-full flex items-end justify-center gap-1.5 h-20">
                  {/* Arterial Bar */}
                  <div 
                    className="w-3 bg-[#FF4D00] transition-all group-hover:brightness-125"
                    style={{ height: `${artHeight}%` }}
                    title={`Arterial: ${artWp.ambientTemp2m_F}°F`}
                  />
                  {/* Canopy Bar */}
                  <div 
                    className="w-3 bg-[#00FFCC] transition-all group-hover:brightness-125"
                    style={{ height: `${canHeight}%` }}
                    title={`Canopy: ${wp.ambientTemp2m_F}°F (${wp.shadeType})`}
                  />
                </div>
                <span className="text-[9px] text-[#666] font-mono font-bold">{wp.distanceFromStart_m}m</span>
              </div>
            );
          })}
        </div>

        <div className="mt-2 text-right font-mono text-[10px] text-[#888]">
          Detour Pareto Efficiency: <strong className="text-[#00FFCC]">+{deltas.distanceDelta_m}m detour</strong> saves <strong className="text-[#00FFCC]">{deltas.oshaRestTimeSaved_min_hr} min/hr</strong> mandatory rest.
        </div>
      </div>
    </div>
  );
};
