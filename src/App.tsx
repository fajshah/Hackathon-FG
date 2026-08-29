/**
 * CoolRoute Autonomous Climate Intelligence Core
 * FortyGuard Hackathon'26 (Track 1: Resilient Cities & Infrastructure, Track 6: Agentic Track)
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { InteractiveMicroclimateMap } from './components/InteractiveMicroclimateMap';
import { MultiAgentExecutionConsole } from './components/MultiAgentExecutionConsole';
import { ThermalCorridorComparisonPanel } from './components/ThermalCorridorComparisonPanel';
import { PhysiologicalRiskAssessment } from './components/PhysiologicalRiskAssessment';
import { FortyGuardGridSimulator } from './components/FortyGuardGridSimulator';
import { EnterpriseAuditBriefModal } from './components/EnterpriseAuditBriefModal';
import { 
  UserPersona, 
  ClimateScenario, 
  MicroclimateCell, 
  MapViewLayer, 
  AutonomousAuditBrief,
  RouteComparisonResult
} from './types';
import { 
  USER_PERSONAS, 
  CLIMATE_SCENARIOS, 
  CORRIDOR_PRESETS, 
  CorridorPreset,
  generateFortyGuardGrid,
  buildCorridorRoutes
} from './data/fortyguardPhoenixData';
import { analyzeRoutePair, createAutonomousAuditBrief } from './utils/thermalPhysics';
import { Sparkles, Info, ShieldCheck, TreePine, Flame, AlertCircle } from 'lucide-react';

export default function App() {
  // Application State
  const [currentPersona, setCurrentPersona] = useState<UserPersona>(USER_PERSONAS[0]);
  const [currentScenario, setCurrentScenario] = useState<ClimateScenario>(CLIMATE_SCENARIOS[0]);
  const [selectedPreset, setSelectedPreset] = useState<CorridorPreset>(CORRIDOR_PRESETS[0]);
  const [activeLayer, setActiveLayer] = useState<MapViewLayer>('ambient2m');
  const [hoveredCell, setHoveredCell] = useState<MicroclimateCell | null>(null);
  const [selectedCell, setSelectedCell] = useState<MicroclimateCell | null>(null);
  const [selectedRouteId, setSelectedRouteId] = useState<'arterial' | 'cool_canopy' | 'both'>('both');
  const [isSimulatorOpen, setIsSimulatorOpen] = useState<boolean>(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState<boolean>(false);
  const [isAgentRunning, setIsAgentRunning] = useState<boolean>(false);

  // Generate 20m² microclimate grid based on current climate scenario
  const gridCells = useMemo(() => {
    return generateFortyGuardGrid(currentScenario, 16, 16, selectedPreset.centerLat, selectedPreset.centerLon);
  }, [currentScenario, selectedPreset]);

  // Build Corridor Routes
  const { arterialRoute, coolCanopyRoute } = useMemo(() => {
    return buildCorridorRoutes(selectedPreset, currentScenario, currentPersona);
  }, [selectedPreset, currentScenario, currentPersona]);

  // Compute full physics and physiological comparison
  const comparison = useMemo<RouteComparisonResult>(() => {
    return analyzeRoutePair(
      selectedPreset.id,
      selectedPreset.name,
      currentScenario.timeOfDay,
      currentScenario.baseTemp_F,
      arterialRoute,
      coolCanopyRoute,
      currentPersona
    );
  }, [selectedPreset, currentScenario, arterialRoute, coolCanopyRoute, currentPersona]);

  // Always maintain an instant computed OSHA verdict brief
  const [auditBrief, setAuditBrief] = useState<AutonomousAuditBrief>(() => {
    return createAutonomousAuditBrief(selectedPreset, currentScenario, currentPersona, comparison);
  });

  // Sync instant OSHA brief whenever physics or persona parameters change
  useEffect(() => {
    setAuditBrief(createAutonomousAuditBrief(selectedPreset, currentScenario, currentPersona, comparison));
  }, [selectedPreset, currentScenario, currentPersona, comparison]);

  // Execute Server-Side Gemini Multi-Agent Decision Engine
  const runMultiAgentDecision = useCallback(async () => {
    setIsAgentRunning(true);
    try {
      const response = await fetch('/api/multi-agent-decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          preset: selectedPreset,
          scenario: currentScenario,
          persona: currentPersona,
          comparison,
          gridTelemetrySnippet: gridCells.slice(0, 10)
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();
      if (data.success && data.brief) {
        setAuditBrief(data.brief);
      }
    } catch (err) {
      console.warn('Multi-agent server decision notice (local physics core active):', err);
    } finally {
      setIsAgentRunning(false);
    }
  }, [selectedPreset, currentScenario, currentPersona, comparison, gridCells]);

  // Trigger agent sync when scenario, preset, or persona changes
  useEffect(() => {
    runMultiAgentDecision();
  }, [selectedPreset.id, currentPersona.id, currentScenario.id]);

  return (
    <div className="min-h-screen bg-[#050505] text-[#F0F0F0] flex flex-col font-sans selection:bg-[#00FFCC] selection:text-black">
      {/* Top Application Header */}
      <Header
        currentPersona={currentPersona}
        onSelectPersona={setCurrentPersona}
        currentScenario={currentScenario}
        onSelectScenario={setCurrentScenario}
        onRunAgenticDecision={runMultiAgentDecision}
        isAgentRunning={isAgentRunning}
        onOpenAuditBrief={() => setIsAuditModalOpen(true)}
        onToggleSimulator={() => setIsSimulatorOpen(!isSimulatorOpen)}
        isSimulatorOpen={isSimulatorOpen}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-6 space-y-6">
        {/* Optional Sandbox / Simulator Drawer */}
        {isSimulatorOpen && (
          <FortyGuardGridSimulator
            scenario={currentScenario}
            onUpdateScenario={setCurrentScenario}
            onResetScenario={() => setCurrentScenario(CLIMATE_SCENARIOS[0])}
          />
        )}

        {/* Primary Geo-Spatial Map & Multi-Agent Intelligence Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Interactive 20m² Microclimate Map (7 columns) */}
          <div className="lg:col-span-7 flex flex-col">
            <InteractiveMicroclimateMap
              gridCells={gridCells}
              selectedPreset={selectedPreset}
              onSelectPreset={setSelectedPreset}
              arterialRoute={arterialRoute}
              coolCanopyRoute={coolCanopyRoute}
              activeLayer={activeLayer}
              onChangeLayer={setActiveLayer}
              hoveredCell={hoveredCell}
              onHoverCell={setHoveredCell}
              selectedCell={selectedCell}
              onSelectCell={setSelectedCell}
              selectedRouteId={selectedRouteId}
              onSelectRouteId={setSelectedRouteId}
            />
          </div>

          {/* Autonomous Multi-Agent Decision Console (5 columns) */}
          <div className="lg:col-span-5 flex flex-col">
            <MultiAgentExecutionConsole
              comparison={comparison}
              persona={currentPersona}
              isAgentRunning={isAgentRunning}
              auditBrief={auditBrief}
              onTriggerDecision={runMultiAgentDecision}
              onOpenFullBrief={() => setIsAuditModalOpen(true)}
            />
          </div>
        </div>

        {/* Comparative Thermal Analytics & Physiological Risk Evaluation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Side-by-Side Thermal Corridor Comparison (7 cols) */}
          <div className="lg:col-span-7">
            <ThermalCorridorComparisonPanel
              comparison={comparison}
              persona={currentPersona}
            />
          </div>

          {/* OSHA & EPA Physiological Heat Strain Matrix (5 cols) */}
          <div className="lg:col-span-5">
            <PhysiologicalRiskAssessment
              comparison={comparison}
              persona={currentPersona}
            />
          </div>
        </div>
      </main>

      {/* Auditable Brief Modal */}
      <EnterpriseAuditBriefModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        brief={auditBrief}
      />

      {/* Status Footer Bar */}
      <footer className="bg-[#050505] border-t border-[#333] px-4 py-4 text-xs text-[#888] font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-none bg-[#00FFCC] animate-pulse" />
            <span className="text-[#CCC] uppercase tracking-wider font-bold">FortyGuard 20m² Spatial Intelligence Core • Phoenix, AZ</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-wider">
            <span className="text-[#00FFCC]">OSHA 29 CFR 1910</span>
            <span className="text-[#444]">•</span>
            <span className="text-[#FF4D00]">EPA Heat Index</span>
            <span className="text-[#444]">•</span>
            <span className="text-white">FortyGuard Hackathon'26 Track 1 & 6</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
