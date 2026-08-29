/**
 * CoolRoute Autonomous Climate Intelligence Core
 * FortyGuard Hackathon'26 (Track 1: Resilient Cities & Infrastructure, Track 6: Agentic Track)
 * TypeScript Definitions for FortyGuard 20m² Microclimate Grid & Multi-Agent Decision Engine
 */

export type SurfaceType = 
  | 'asphalt_dark' 
  | 'asphalt_aged' 
  | 'concrete' 
  | 'cool_pavement' 
  | 'canopy_vegetation' 
  | 'park_turf' 
  | 'permeable_paver';

export type OshaRiskLevel = 'Low' | 'Moderate' | 'High' | 'Extreme Danger';

export interface MicroclimateCell {
  id: string; // e.g. "PHX-20M-4021"
  row: number;
  col: number;
  lat: number;
  lon: number;
  zone: string;
  streetName: string;
  surfaceType: SurfaceType;
  albedo: number; // 0.05 to 0.45
  treeCanopyCoveragePct: number; // 0 - 100%
  ambientTemp2m_C: number;
  ambientTemp2m_F: number;
  surfaceTemp_C: number;
  surfaceTemp_F: number;
  meanRadiantTemp_C: number; // Tmrt
  meanRadiantTemp_F: number;
  solarRadiationFlux_Wm2: number; // 50 - 1050 W/m²
  relativeHumidity_Pct: number;
  windSpeed_ms: number;
  heatIndex_F: number;
  wetBulbGlobeTemp_F: number; // WBGT
  oshaRiskLevel: OshaRiskLevel;
  coolingInfrastructure: string[];
}

export type PersonaId = 
  | 'utility_worker' 
  | 'senior_pedestrian' 
  | 'courier_cargo' 
  | 'student_commuter' 
  | 'first_responder';

export interface UserPersona {
  id: PersonaId;
  name: string;
  role: string;
  icon: string;
  metabolicRate_W: number;
  oshaCategory: string;
  sweatRate_L_hr: number;
  maxSafeDirectSunExposure_min: number;
  targetMaxTemp_F: number;
  vulnerabilityFactors: string[];
  recommendedHydration_mL_hr: number;
  restRequirement: string;
  description: string;
}

export interface RouteWaypoint {
  cellId: string;
  lat: number;
  lon: number;
  streetName: string;
  distanceFromStart_m: number;
  ambientTemp2m_F: number;
  meanRadiantTemp_F: number;
  solarFlux_Wm2: number;
  canopyPct: number;
  shadeType: string;
  isCoolingOasis?: boolean;
  notes?: string;
}

export interface CorridorRoute {
  id: 'arterial' | 'cool_canopy';
  name: string;
  corridorType: 'Unshaded High-Asphalt Arterial' | 'Shaded Vegetative Tree Canopy';
  totalDistance_m: number;
  estimatedDuration_min: number;
  avgAmbientTemp2m_F: number;
  peakAmbientTemp2m_F: number;
  minAmbientTemp2m_F: number;
  avgMeanRadiantTemp_F: number;
  avgSolarRadiationFlux_Wm2: number;
  avgCanopyCoverage_Pct: number;
  cumulativeThermalDose_DegMin: number; // Integrated exposure > 100°F
  estimatedSweatLoss_mL: number;
  oshaRiskLevel: OshaRiskLevel;
  oshaRequiredRest_min_hr: number;
  waypoints: RouteWaypoint[];
  pathCoordinates: [number, number][]; // [lat, lon]
}

export interface RouteComparisonResult {
  corridorPresetId: string;
  corridorPresetName: string;
  timeOfDay: string; // e.g. "15:30"
  baselineAmbient_F: number;
  solarAzimuth_deg: number;
  solarZenith_deg: number;
  arterialRoute: CorridorRoute;
  coolCanopyRoute: CorridorRoute;
  deltas: {
    avgAmbient2mDelta_F: number; // e.g. -14.2°F
    peakAmbient2mDelta_F: number; // e.g. -16.8°F
    meanRadiantTempDelta_F: number; // e.g. -32.5°F
    solarFluxReduction_Pct: number; // e.g. -68%
    canopyIncrease_Pct: number; // e.g. +72%
    cumulativeThermalDoseReduction_Pct: number; // e.g. -78%
    sweatLossReduction_mL: number; // e.g. -620 mL
    coreBodyTempDelta_C: number; // e.g. -0.65°C
    oshaRestTimeSaved_min_hr: number; // e.g. 30 min saved
    durationDelta_min: number; // e.g. +2.5 min detour
    distanceDelta_m: number; // e.g. +180m
  };
}

export interface AgentLogEntry {
  agentId: string;
  agentName: string;
  badge: string;
  timestamp: string;
  status: 'active' | 'success' | 'alert' | 'computing';
  message: string;
  details?: Record<string, any>;
}

export interface AutonomousAuditBrief {
  briefId: string;
  timestamp: string;
  metroZone: string;
  targetPersona: UserPersona;
  corridorSummary: {
    origin: string;
    destination: string;
    selectedCorridor: string;
    temperatureDelta_F: number;
    radiantHeatDelta_F: number;
    solarFluxReductionPct: number;
  };
  oshaPhysiologicalVerdict: {
    complianceStatus: 'PASS - COMPLIANT' | 'WARNING - ELEVATED HAZARD' | 'CRITICAL NON-COMPLIANT';
    heatStressIndex: string;
    wbgtAssessment: string;
    hydrationSchedule_mL_hr: number;
    mandatoryRestCycle: string;
    projectedCoreTemp_F: number;
  };
  agenticReasoningInsights: string[];
  actionableDirectives: string[];
  resilienceRoiImpact: {
    heatIllnessRiskReduction_Pct: number;
    productiveLaborSaved_min_shift: number;
    urbanCoolingCarbonAvoidance_kgCO2: number;
  };
  hackathonCertification: {
    track: string;
    modelCore: string;
    dataResolution: string;
    signature: string;
  };
}

export type MapViewLayer = 
  | 'ambient2m' 
  | 'solarFlux' 
  | 'treeCanopy' 
  | 'surfaceAlbedo' 
  | 'oshaRisk';

export interface ClimateScenario {
  id: string;
  name: string;
  description: string;
  timeOfDay: string;
  baseTemp_F: number;
  solarFluxMultiplier: number;
  relativeHumidity_Pct: number;
  albedoBonus: number;
  canopyBonus_Pct: number;
}
