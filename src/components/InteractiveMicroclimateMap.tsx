import React, { useState } from 'react';
import { 
  Layers, 
  MapPin, 
  TreePine, 
  Flame, 
  Sun, 
  Droplets, 
  ShieldAlert, 
  Info, 
  Navigation, 
  Crosshair, 
  Sparkles,
  Zap,
  Gauge
} from 'lucide-react';
import { 
  MicroclimateCell, 
  MapViewLayer, 
  CorridorRoute, 
  RouteWaypoint,
  OshaRiskLevel 
} from '../types';
import { CorridorPreset, CORRIDOR_PRESETS } from '../data/fortyguardPhoenixData';

interface MapProps {
  gridCells: MicroclimateCell[];
  selectedPreset: CorridorPreset;
  onSelectPreset: (preset: CorridorPreset) => void;
  arterialRoute: CorridorRoute;
  coolCanopyRoute: CorridorRoute;
  activeLayer: MapViewLayer;
  onChangeLayer: (layer: MapViewLayer) => void;
  hoveredCell: MicroclimateCell | null;
  onHoverCell: (cell: MicroclimateCell | null) => void;
  selectedCell: MicroclimateCell | null;
  onSelectCell: (cell: MicroclimateCell | null) => void;
  selectedRouteId: 'arterial' | 'cool_canopy' | 'both';
  onSelectRouteId: (routeId: 'arterial' | 'cool_canopy' | 'both') => void;
}

export const InteractiveMicroclimateMap: React.FC<MapProps> = ({
  gridCells,
  selectedPreset,
  onSelectPreset,
  arterialRoute,
  coolCanopyRoute,
  activeLayer,
  onChangeLayer,
  hoveredCell,
  onHoverCell,
  selectedCell,
  onSelectCell,
  selectedRouteId,
  onSelectRouteId
}) => {
  const [showGridOutline, setShowGridOutline] = useState(true);
  const [activeWaypoint, setActiveWaypoint] = useState<RouteWaypoint | null>(null);

  // Helper to calculate cell color based on active layer
  const getCellFillColor = (cell: MicroclimateCell): string => {
    switch (activeLayer) {
      case 'ambient2m': {
        const t = cell.ambientTemp2m_F;
        if (t < 100) return 'rgba(0, 255, 204, 0.55)'; // Electric teal/green
        if (t < 104) return 'rgba(0, 210, 255, 0.55)'; // Cyan
        if (t < 108) return 'rgba(255, 190, 0, 0.65)'; // Amber
        if (t < 112) return 'rgba(255, 77, 0, 0.75)'; // High-voltage orange
        return 'rgba(230, 20, 20, 0.85)'; // Crimson
      }
      case 'solarFlux': {
        const flux = cell.solarRadiationFlux_Wm2;
        if (flux < 350) return 'rgba(0, 255, 204, 0.6)';
        if (flux < 600) return 'rgba(255, 200, 0, 0.6)';
        if (flux < 850) return 'rgba(255, 77, 0, 0.75)';
        return 'rgba(220, 20, 60, 0.85)';
      }
      case 'treeCanopy': {
        const canopy = cell.treeCanopyCoveragePct;
        if (canopy > 70) return 'rgba(0, 255, 120, 0.75)';
        if (canopy > 40) return 'rgba(0, 200, 150, 0.6)';
        if (canopy > 15) return 'rgba(0, 160, 130, 0.4)';
        return 'rgba(30, 30, 30, 0.6)';
      }
      case 'surfaceAlbedo': {
        const alb = cell.albedo;
        if (alb > 0.35) return 'rgba(200, 240, 255, 0.75)';
        if (alb > 0.20) return 'rgba(120, 130, 140, 0.5)';
        return 'rgba(20, 20, 20, 0.85)';
      }
      case 'oshaRisk': {
        switch (cell.oshaRiskLevel) {
          case 'Low': return 'rgba(0, 255, 204, 0.65)';
          case 'Moderate': return 'rgba(255, 200, 0, 0.65)';
          case 'High': return 'rgba(255, 77, 0, 0.75)';
          case 'Extreme Danger': return 'rgba(220, 20, 20, 0.85)';
        }
      }
    }
  };

  const inspectedCell = hoveredCell || selectedCell || gridCells[68] || gridCells[0];

  return (
    <div className="bg-[#0A0A0A] border border-[#333] flex flex-col h-full">
      {/* Top Map Controls Bar */}
      <div className="p-3.5 bg-[#050505] border-b border-[#333] flex flex-wrap items-center justify-between gap-3">
        {/* Preset Route Corridor Switcher */}
        <div className="flex items-center gap-2">
          <Navigation className="w-4 h-4 text-[#00FFCC]" />
          <span className="text-xs font-mono uppercase tracking-widest text-[#666]">Corridor:</span>
          <select
            id="corridor-preset-select"
            value={selectedPreset.id}
            onChange={(e) => {
              const found = CORRIDOR_PRESETS.find(p => p.id === e.target.value);
              if (found) onSelectPreset(found);
            }}
            aria-label="Select Corridor"
            className="bg-[#111] border border-[#333] px-2.5 py-1 text-xs text-[#F0F0F0] font-mono font-bold uppercase focus:outline-none focus:border-[#FF4D00] cursor-pointer"
          >
            {CORRIDOR_PRESETS.map(p => (
              <option key={p.id} value={p.id} className="bg-[#111] text-white">{p.name}</option>
            ))}
          </select>
        </div>

        {/* Route Visibility Selector */}
        <div className="flex items-center gap-1 bg-[#111] border border-[#222] p-1 text-xs font-mono">
          <button
            id="route-both-btn"
            onClick={() => onSelectRouteId('both')}
            className={`px-2.5 py-1 text-[11px] uppercase tracking-wider transition-all cursor-pointer ${
              selectedRouteId === 'both' ? 'bg-[#333] text-white font-bold' : 'text-[#888] hover:text-white'
            }`}
          >
            Both Paths
          </button>
          <button
            id="route-arterial-btn"
            onClick={() => onSelectRouteId('arterial')}
            className={`px-2.5 py-1 text-[11px] flex items-center gap-1.5 uppercase tracking-wider transition-all cursor-pointer ${
              selectedRouteId === 'arterial' ? 'bg-[#FF4D00] text-black font-black italic' : 'text-[#888] hover:text-white'
            }`}
          >
            <span className="w-1.5 h-1.5 bg-[#FF4D00] rounded-none" />
            Arterial
          </button>
          <button
            id="route-canopy-btn"
            onClick={() => onSelectRouteId('cool_canopy')}
            className={`px-2.5 py-1 text-[11px] flex items-center gap-1.5 uppercase tracking-wider transition-all cursor-pointer ${
              selectedRouteId === 'cool_canopy' ? 'bg-[#00FFCC] text-black font-black italic' : 'text-[#888] hover:text-white'
            }`}
          >
            <span className="w-1.5 h-1.5 bg-[#00FFCC] rounded-none" />
            Canopy Route
          </button>
        </div>

        {/* Map Raster Layer Switcher */}
        <div className="flex items-center gap-1 bg-[#111] border border-[#222] p-1 text-xs font-mono">
          <button
            id="layer-ambient-btn"
            onClick={() => onChangeLayer('ambient2m')}
            className={`px-2.5 py-1 flex items-center gap-1.5 uppercase tracking-wider transition-all cursor-pointer ${
              activeLayer === 'ambient2m' ? 'bg-[#FF4D00] text-black font-black italic' : 'text-[#888] hover:text-white'
            }`}
            title="2-metre Ambient Air Temperature"
          >
            <Flame className="w-3 h-3" />
            <span>2m Temp</span>
          </button>
          <button
            id="layer-solar-btn"
            onClick={() => onChangeLayer('solarFlux')}
            className={`px-2.5 py-1 flex items-center gap-1.5 uppercase tracking-wider transition-all cursor-pointer ${
              activeLayer === 'solarFlux' ? 'bg-[#FF4D00] text-black font-black italic' : 'text-[#888] hover:text-white'
            }`}
            title="Solar Radiation Flux W/m²"
          >
            <Sun className="w-3 h-3" />
            <span>Solar Flux</span>
          </button>
          <button
            id="layer-canopy-btn"
            onClick={() => onChangeLayer('treeCanopy')}
            className={`px-2.5 py-1 flex items-center gap-1.5 uppercase tracking-wider transition-all cursor-pointer ${
              activeLayer === 'treeCanopy' ? 'bg-[#00FFCC] text-black font-black italic' : 'text-[#888] hover:text-white'
            }`}
            title="Tree Canopy & Vegetation Index"
          >
            <TreePine className="w-3 h-3" />
            <span>Canopy</span>
          </button>
          <button
            id="layer-osha-btn"
            onClick={() => onChangeLayer('oshaRisk')}
            className={`px-2.5 py-1 flex items-center gap-1.5 uppercase tracking-wider transition-all cursor-pointer ${
              activeLayer === 'oshaRisk' ? 'bg-[#FF4D00] text-black font-black italic' : 'text-[#888] hover:text-white'
            }`}
            title="OSHA Heat Stress Hazard Zones"
          >
            <ShieldAlert className="w-3 h-3" />
            <span>OSHA</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Map Canvas / SVG Area */}
      <div className="relative flex-1 min-h-[380px] lg:min-h-[460px] bg-[#050505] overflow-hidden select-none">
        {/* Street Network Vector Graphic Layer */}
        <svg 
          viewBox="0 0 600 600" 
          className="w-full h-full object-contain cursor-crosshair"
          id="fortyguard-raster-svg"
        >
          <defs>
            <linearGradient id="arterialGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF4D00" stopOpacity="1" />
              <stop offset="50%" stopColor="#FF7700" stopOpacity="1" />
              <stop offset="100%" stopColor="#FF2200" stopOpacity="1" />
            </linearGradient>

            <linearGradient id="canopyGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00FFCC" stopOpacity="1" />
              <stop offset="50%" stopColor="#00FF88" stopOpacity="1" />
              <stop offset="100%" stopColor="#00DDFF" stopOpacity="1" />
            </linearGradient>

            <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Map Canvas */}
          <rect width="600" height="600" fill="#050505" />

          {/* FortyGuard 20m² Grid Cells Raster Layer */}
          <g id="grid-cells-layer">
            {gridCells.map((cell) => {
              const cellSize = 600 / 16;
              const x = cell.col * cellSize;
              const y = (15 - cell.row) * cellSize;
              const isHovered = hoveredCell?.id === cell.id;
              const isSelected = selectedCell?.id === cell.id;

              return (
                <rect
                  key={cell.id}
                  id={`cell-${cell.id}`}
                  x={x}
                  y={y}
                  width={cellSize}
                  height={cellSize}
                  fill={getCellFillColor(cell)}
                  stroke={isSelected ? '#00FFCC' : isHovered ? '#FFFFFF' : showGridOutline ? '#1A1A1A' : 'none'}
                  strokeWidth={isSelected ? 2.5 : isHovered ? 1.5 : 0.5}
                  className="transition-all duration-100 cursor-pointer"
                  onMouseEnter={() => onHoverCell(cell)}
                  onClick={() => onSelectCell(cell)}
                />
              );
            })}
          </g>

          {/* Major Street Geometry Labels */}
          <g id="street-labels" opacity="0.45" className="font-mono text-[9px] fill-[#888] pointer-events-none select-none tracking-widest font-bold">
            <text x="295" y="40" textAnchor="middle" transform="rotate(90, 295, 40)">CENTRAL AVE (ARTERIAL)</text>
            <text x="145" y="40" textAnchor="middle" transform="rotate(90, 145, 40)">3RD AVE (CANOPY)</text>
            <text x="445" y="40" textAnchor="middle" transform="rotate(90, 445, 40)">7TH ST</text>
            <text x="30" y="225">ROOSEVELT ST</text>
            <text x="30" y="110">HANCE PARK</text>
            <text x="30" y="480">WASHINGTON ST</text>
          </g>

          {/* Arterial Heat Corridor Path (Red Ribbon) */}
          {(selectedRouteId === 'both' || selectedRouteId === 'arterial') && (
            <g id="arterial-path-group">
              <polyline
                points="300,520 300,420 300,310 300,190 300,80"
                fill="none"
                stroke="#FF4D00"
                strokeWidth="14"
                strokeOpacity="0.3"
                filter="url(#glowEffect)"
              />
              <polyline
                points="300,520 300,420 300,310 300,190 300,80"
                fill="none"
                stroke="url(#arterialGlow)"
                strokeWidth="5"
                strokeDasharray="8 4"
              />

              {/* Arterial Waypoint Heat Markers */}
              {[
                { x: 300, y: 520 },
                { x: 300, y: 420 },
                { x: 300, y: 310 },
                { x: 300, y: 190 },
                { x: 300, y: 80 },
              ].map((pt, idx) => (
                <g key={`art-pt-${idx}`}>
                  <rect x={pt.x - 4} y={pt.y - 4} width="8" height="8" fill="#FF4D00" stroke="#FFFFFF" strokeWidth="1.5" />
                </g>
              ))}
            </g>
          )}

          {/* Shaded Tree Canopy Cool Route Path (Emerald Ribbon) */}
          {(selectedRouteId === 'both' || selectedRouteId === 'cool_canopy') && (
            <g id="canopy-path-group">
              <path
                d="M 300,520 L 150,520 L 150,380 L 150,220 L 210,120 L 300,80"
                fill="none"
                stroke="#00FFCC"
                strokeWidth="16"
                strokeOpacity="0.35"
                filter="url(#glowEffect)"
              />
              <path
                d="M 300,520 L 150,520 L 150,380 L 150,220 L 210,120 L 300,80"
                fill="none"
                stroke="url(#canopyGlow)"
                strokeWidth="5"
              />

              {/* Canopy Waypoints & Cooling Oases */}
              {[
                { x: 300, y: 520, isOasis: false },
                { x: 150, y: 520, isOasis: true },
                { x: 150, y: 380, isOasis: true },
                { x: 150, y: 220, isOasis: true },
                { x: 210, y: 120, isOasis: false },
                { x: 300, y: 80, isOasis: true },
              ].map((pt, idx) => (
                <g 
                  key={`can-pt-${idx}`} 
                  className="cursor-pointer"
                  onClick={() => {
                    const wp = coolCanopyRoute.waypoints[idx];
                    if (wp) setActiveWaypoint(wp);
                  }}
                >
                  <circle cx={pt.x} cy={pt.y} r="6" fill={pt.isOasis ? '#00FFCC' : '#00DD88'} stroke="#000000" strokeWidth="2" />
                  {pt.isOasis && (
                    <circle cx={pt.x} cy={pt.y} r="10" fill="none" stroke="#00FFCC" strokeWidth="1" opacity="0.7" />
                  )}
                </g>
              ))}
            </g>
          )}

          {/* Origin & Destination Badges */}
          <g id="origin-dest-markers">
            <g transform="translate(300, 520)">
              <rect x="-8" y="-8" width="16" height="16" fill="#00FFCC" stroke="#000000" strokeWidth="2" />
              <text x="0" y="3.5" textAnchor="middle" fill="#000000" fontSize="9" fontWeight="900" fontFamily="monospace">A</text>
            </g>
            <g transform="translate(300, 80)">
              <rect x="-8" y="-8" width="16" height="16" fill="#FF4D00" stroke="#000000" strokeWidth="2" />
              <text x="0" y="3.5" textAnchor="middle" fill="#000000" fontSize="9" fontWeight="900" fontFamily="monospace">B</text>
            </g>
          </g>
        </svg>

        {/* Floating Telemetry & Inspection HUD */}
        {inspectedCell && (
          <div className="absolute top-3 left-3 bg-[#050505]/95 border border-[#333] p-4 max-w-xs text-xs font-mono shadow-2xl z-20 pointer-events-auto">
            <div className="flex items-center justify-between pb-2 border-b border-[#222]">
              <div className="flex items-center gap-1.5 text-[#00FFCC]">
                <Crosshair className="w-3.5 h-3.5" />
                <span className="font-bold tracking-widest">{inspectedCell.id}</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 bg-[#111] text-[#888] border border-[#222] uppercase tracking-widest">
                20m² Cell
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-3 text-[11px]">
              <div>
                <span className="text-[#666] block text-[9px] uppercase tracking-wider">2M Ambient</span>
                <span className="text-white font-black text-sm">
                  {inspectedCell.ambientTemp2m_F}°F
                </span>
              </div>
              <div>
                <span className="text-[#666] block text-[9px] uppercase tracking-wider">Radiant Tmrt</span>
                <span className={`font-black text-sm ${inspectedCell.meanRadiantTemp_F > 130 ? 'text-[#FF4D00]' : 'text-[#00FFCC]'}`}>
                  {inspectedCell.meanRadiantTemp_F}°F
                </span>
              </div>
              <div>
                <span className="text-[#666] block text-[9px] uppercase tracking-wider">Solar Flux</span>
                <span className="text-white font-bold">
                  {inspectedCell.solarRadiationFlux_Wm2} W/m²
                </span>
              </div>
              <div>
                <span className="text-[#666] block text-[9px] uppercase tracking-wider">Canopy Cover</span>
                <span className="text-[#00FFCC] font-bold">
                  {inspectedCell.treeCanopyCoveragePct}%
                </span>
              </div>
              <div>
                <span className="text-[#666] block text-[9px] uppercase tracking-wider">Albedo</span>
                <span className="text-[#CCC] font-bold">
                  {inspectedCell.albedo}
                </span>
              </div>
              <div>
                <span className="text-[#666] block text-[9px] uppercase tracking-wider">OSHA Hazard</span>
                <span className={`font-black ${
                  inspectedCell.oshaRiskLevel === 'Extreme Danger' ? 'text-[#FF4D00]' :
                  inspectedCell.oshaRiskLevel === 'High' ? 'text-[#FF7700]' :
                  inspectedCell.oshaRiskLevel === 'Moderate' ? 'text-[#FFCC00]' : 'text-[#00FFCC]'
                }`}>
                  {inspectedCell.oshaRiskLevel}
                </span>
              </div>
            </div>

            {inspectedCell.coolingInfrastructure && inspectedCell.coolingInfrastructure.length > 0 && (
              <div className="mt-3 pt-2 border-t border-[#222]">
                <span className="text-[9px] text-[#666] uppercase tracking-wider block mb-1">Cooling Assets:</span>
                <div className="flex flex-wrap gap-1">
                  {inspectedCell.coolingInfrastructure.map((amenity, i) => (
                    <span key={i} className="text-[10px] px-1.5 py-0.5 bg-[#002211] border border-[#004422] text-[#00FFCC] font-bold uppercase">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Map Legend Overlay */}
        <div className="absolute bottom-3 left-3 bg-[#050505]/95 border border-[#333] px-3 py-2 text-xs font-mono flex items-center gap-4 z-10">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-[#FF4D00]" />
            <span className="text-[10px] text-[#AAA] uppercase font-bold tracking-wider">Arterial Heat Trap</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-[#00FFCC]" />
            <span className="text-[10px] text-[#00FFCC] uppercase font-bold tracking-wider">Cool Canopy Oasis</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-[#00FF41]" />
            <span className="text-[10px] text-[#AAA] uppercase font-bold tracking-wider">Misting Ramada</span>
          </div>
        </div>
      </div>
    </div>
  );
};
