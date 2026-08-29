/**
 * FortyGuard 20m² Hyper-Localized Microclimate Dataset & Phoenix, AZ Urban Corridors
 * FortyGuard Hackathon'26 (Track 1: Resilient Cities & Infrastructure, Track 6: Agentic Track)
 */

import { 
  MicroclimateCell, 
  UserPersona, 
  ClimateScenario, 
  CorridorRoute,
  RouteWaypoint 
} from '../types';
import { 
  calculateHeatIndex, 
  calculateMeanRadiantTemp, 
  calculateWBGT, 
  getOshaRiskLevel,
  getOshaRestMinutesPerHour,
  computeSweatLoss,
  calculateCumulativeThermalDose
} from '../utils/thermalPhysics';

export const USER_PERSONAS: UserPersona[] = [
  {
    id: 'utility_worker',
    name: 'Marcus Vance',
    role: 'Municipal Utility & Infrastructure Crew',
    icon: 'HardHat',
    metabolicRate_W: 420,
    oshaCategory: 'Heavy Labor / PPE Required',
    sweatRate_L_hr: 1.4,
    maxSafeDirectSunExposure_min: 15,
    targetMaxTemp_F: 98,
    vulnerabilityFactors: [
      'Heavy synthetic arc-rated PPE barrier',
      'Continuous metabolic exertion (420W)',
      'High thermal asphalt radiant reflection'
    ],
    recommendedHydration_mL_hr: 1200,
    restRequirement: 'Mandatory 30 min rest/hr in shade when Heat Index > 105°F (OSHA NEP)',
    description: 'Requires aggressive solar shielding, low radiant load paths, and frequent hydration access.'
  },
  {
    id: 'senior_pedestrian',
    name: 'Eleanor Ramirez',
    role: 'Vulnerable Senior Transit Commuter (Age 72)',
    icon: 'HeartPulse',
    metabolicRate_W: 180,
    oshaCategory: 'High Cardiovascular Vulnerability',
    sweatRate_L_hr: 0.65,
    maxSafeDirectSunExposure_min: 8,
    targetMaxTemp_F: 95,
    vulnerabilityFactors: [
      'Impaired thermoregulatory vasodilation',
      'Antihypertensive medication heat sensitivity',
      'Max continuous walk threshold: 450 meters'
    ],
    recommendedHydration_mL_hr: 750,
    restRequirement: 'Continuous shade required; cooling seating every 200m',
    description: 'Highly sensitive to $T_{mrt}$ direct solar flux. Even short arterial walks cause acute cardiovascular strain.'
  },
  {
    id: 'courier_cargo',
    name: 'Darius Chen',
    role: 'Gig Economy Delivery Rider (2-Wheeler / Outdoor High Exposure)',
    icon: 'Bike',
    metabolicRate_W: 340,
    oshaCategory: 'Moderate-Heavy Continuous Dispatch',
    sweatRate_L_hr: 1.15,
    maxSafeDirectSunExposure_min: 15,
    targetMaxTemp_F: 100,
    vulnerabilityFactors: [
      'Continuous direct solar irradiance (980 W/m² unprotected exposure)',
      'High radiant asphalt heat reflection on 2-wheeler frame',
      'Rapid dehydration risk with elevated sweat loss deficit'
    ],
    recommendedHydration_mL_hr: 1100,
    restRequirement: '15 min shade pause per 45 min continuous riding when Heat Index > 105°F',
    description: 'Riding 2-wheel delivery vehicle under high direct solar irradiance, requiring shade canopy prioritization to avoid acute heat exhaustion.'
  },
  {
    id: 'student_commuter',
    name: 'Sofia & Leo Martinez',
    role: 'K-12 Afternoon School Commuters',
    icon: 'GraduationCap',
    metabolicRate_W: 210,
    oshaCategory: 'Pediatric Thermal Vulnerability',
    sweatRate_L_hr: 0.7,
    maxSafeDirectSunExposure_min: 12,
    targetMaxTemp_F: 96,
    vulnerabilityFactors: [
      'Higher body surface area to mass ratio',
      'Peak afternoon 3:15 PM heatwave walk',
      'Heat radiation from asphalt crosswalks'
    ],
    recommendedHydration_mL_hr: 600,
    restRequirement: 'Shaded path mandatory; avoid unshaded wide intersections',
    description: 'Requires safe, tree-canopied corridors connecting schools, transit stops, and neighborhood parks.'
  },
  {
    id: 'first_responder',
    name: 'Capt. Sarah Jenkins',
    role: 'Phoenix Fire & Medical Heat Triage Unit',
    icon: 'ShieldAlert',
    metabolicRate_W: 460,
    oshaCategory: 'Emergency Critical Response',
    sweatRate_L_hr: 1.6,
    maxSafeDirectSunExposure_min: 10,
    targetMaxTemp_F: 100,
    vulnerabilityFactors: [
      'Turnout gear encapsulating body heat',
      'High stress sympathetic activation',
      'Need for rapid patient cooling staging'
    ],
    recommendedHydration_mL_hr: 1400,
    restRequirement: 'Active misting/cooling rehab protocols every 20 min',
    description: 'Prioritizes routes that intersect municipal cooling stations and shaded staging zones for triage.'
  }
];

export const CLIMATE_SCENARIOS: ClimateScenario[] = [
  {
    id: 'peak_summer_heatwave',
    name: 'Record Phoenix Heatwave (Peak 15:30)',
    description: 'Extreme desert solar radiation flux (980 W/m²), 114°F regional ambient, low humidity (14%).',
    timeOfDay: '15:30',
    baseTemp_F: 114,
    solarFluxMultiplier: 1.0,
    relativeHumidity_Pct: 14,
    albedoBonus: 0,
    canopyBonus_Pct: 0
  },
  {
    id: 'monsoon_humidity_spike',
    name: 'Desert Monsoon Moisture Surge (13:00)',
    description: '106°F ambient with elevated 42% relative humidity, driving dangerous Heat Index spikes.',
    timeOfDay: '13:00',
    baseTemp_F: 106,
    solarFluxMultiplier: 0.88,
    relativeHumidity_Pct: 42,
    albedoBonus: 0,
    canopyBonus_Pct: 0
  },
  {
    id: 'phoenix_canopy_2030',
    name: 'Phoenix 2030 Tree Canopy Initiative (+40% Shade)',
    description: 'Simulation of proposed urban forestry expansion with mature desert ironwood & mesquite canopies.',
    timeOfDay: '15:30',
    baseTemp_F: 114,
    solarFluxMultiplier: 0.95,
    relativeHumidity_Pct: 14,
    albedoBonus: 0.08,
    canopyBonus_Pct: 40
  },
  {
    id: 'cool_pavement_program',
    name: 'High-Albedo Cool Pavement Rollout',
    description: 'Evaluates reflective street coatings (albedo 0.42) reducing asphalt surface heat retention.',
    timeOfDay: '14:00',
    baseTemp_F: 112,
    solarFluxMultiplier: 0.96,
    relativeHumidity_Pct: 16,
    albedoBonus: 0.25,
    canopyBonus_Pct: 10
  }
];

export interface CorridorPreset {
  id: string;
  name: string;
  subtitle: string;
  originName: string;
  destinationName: string;
  centerLat: number;
  centerLon: number;
  arterialPath: [number, number][];
  canopyPath: [number, number][];
  arterialStreet: string;
  canopyStreet: string;
}

export const CORRIDOR_PRESETS: CorridorPreset[] = [
  {
    id: 'downtown_to_midtown_grand_vs_7th',
    name: 'Grand Ave / Van Buren Arterial vs 7th Ave Shaded Path',
    subtitle: 'Downtown to Midtown Delivery Corridor (33.4484° N, 112.0740° W)',
    originName: 'Downtown Commercial Hub (Washington & 1st Ave)',
    destinationName: 'Midtown Dispatch Terminal (7th Ave & McDowell)',
    centerLat: 33.4484,
    centerLon: -112.0740,
    arterialStreet: 'Grand Ave / Van Buren St (Direct Arterial Corridor)',
    canopyStreet: '7th Avenue Shaded Canopy Corridor (Vegetative Buffer)',
    arterialPath: [
      [33.4484, -112.0740],
      [33.4520, -112.0740],
      [33.4560, -112.0740],
      [33.4600, -112.0740],
      [33.4640, -112.0740]
    ],
    canopyPath: [
      [33.4484, -112.0740],
      [33.4488, -112.0825],
      [33.4540, -112.0825],
      [33.4600, -112.0825],
      [33.4640, -112.0740]
    ]
  },
  {
    id: 'downtown_central_vs_3rd',
    name: 'Central Ave Arterial vs 3rd Ave Shaded Bioswale',
    subtitle: 'Downtown Core to Hance Park Cultural District',
    originName: 'Washington St & 1st Ave (Valley Metro Central)',
    destinationName: 'Margaret T. Hance Park / Roosevelt Row',
    centerLat: 33.4530,
    centerLon: -112.0740,
    arterialStreet: 'Central Avenue (6-lane dark asphalt corridor)',
    canopyStreet: '3rd Avenue Bioswale & Linear Mesquite Walkway',
    arterialPath: [
      [33.4484, -112.0740],
      [33.4510, -112.0740],
      [33.4540, -112.0740],
      [33.4570, -112.0740],
      [33.4600, -112.0740]
    ],
    canopyPath: [
      [33.4484, -112.0740],
      [33.4485, -112.0780],
      [33.4520, -112.0782],
      [33.4560, -112.0780],
      [33.4595, -112.0760],
      [33.4600, -112.0740]
    ]
  },
  {
    id: 'roosevelt_east_west',
    name: 'Roosevelt St Commercial Strip vs Portland Linear Park',
    subtitle: 'Roosevelt Arts Core to Garfield Green Habitat',
    originName: 'Roosevelt St & 7th Ave',
    destinationName: 'Roosevelt St & 7th St',
    centerLat: 33.4580,
    centerLon: -112.0680,
    arterialStreet: 'Roosevelt Street (Unshaded Commercial Corridor)',
    canopyStreet: 'Portland Street Shaded Ramadas & Desert Canopy',
    arterialPath: [
      [33.4580, -112.0830],
      [33.4580, -112.0770],
      [33.4580, -112.0720],
      [33.4580, -112.0660],
      [33.4580, -112.0600]
    ],
    canopyPath: [
      [33.4580, -112.0830],
      [33.4565, -112.0800],
      [33.4565, -112.0730],
      [33.4565, -112.0670],
      [33.4580, -112.0600]
    ]
  },
  {
    id: 'capitol_mall_corridor',
    name: 'Jefferson St Government Arterial vs Bolin Memorial Green',
    subtitle: 'State Capitol Plaza to 1st Ave Civic Hub',
    originName: 'Arizona State Capitol (17th Ave & Washington)',
    destinationName: 'Phoenix City Hall (1st Ave & Washington)',
    centerLat: 33.4480,
    centerLon: -112.0860,
    arterialStreet: 'W Jefferson St (Open Concrete & Asphalt Transitway)',
    canopyStreet: 'Wesley Bolin Memorial Park & Covered Colonnades',
    arterialPath: [
      [33.4480, -112.0970],
      [33.4480, -112.0900],
      [33.4480, -112.0830],
      [33.4480, -112.0760],
      [33.4480, -112.0740]
    ],
    canopyPath: [
      [33.4480, -112.0970],
      [33.4495, -112.0920],
      [33.4495, -112.0850],
      [33.4490, -112.0780],
      [33.4480, -112.0740]
    ]
  }
];

/**
 * Generate synthetic 20m² resolution microclimate grid over Phoenix Downtown
 */
export function generateFortyGuardGrid(
  scenario: ClimateScenario,
  gridRows = 16,
  gridCols = 16,
  centerLat = 33.4530,
  centerLon = -112.0740
): MicroclimateCell[] {
  const cells: MicroclimateCell[] = [];
  const baseLat = centerLat - 0.007;
  const baseLon = centerLon - 0.007;
  const latStep = 0.014 / gridRows;
  const lonStep = 0.014 / gridCols;

  for (let r = 0; r < gridRows; r++) {
    for (let c = 0; c < gridCols; c++) {
      const lat = Number((baseLat + r * latStep).toFixed(5));
      const lon = Number((baseLon + c * lonStep).toFixed(5));
      
      // Determine physical urban zone
      let zone = 'Commercial Urban';
      let streetName = 'Local St';
      let surfaceType: MicroclimateCell['surfaceType'] = 'asphalt_dark';
      let baseAlbedo = 0.10 + scenario.albedoBonus;
      let baseCanopy = Math.max(0, Math.min(95, 10 + scenario.canopyBonus_Pct));
      const coolingInfrastructure: string[] = [];

      // Corridor geometry detection
      const isCentralAve = Math.abs(c - 8) <= 1;
      const is3rdAveCanopy = Math.abs(c - 4) <= 1;
      const isHancePark = r >= 13;
      const isRooseveltRow = Math.abs(r - 10) <= 1;
      const isCommercialCore = r < 5 && isCentralAve;

      if (isHancePark) {
        zone = 'Margaret T. Hance Park / Urban Forest';
        streetName = 'Hance Park Greenway';
        surfaceType = 'park_turf';
        baseAlbedo = 0.28 + scenario.albedoBonus;
        baseCanopy = Math.min(95, 75 + scenario.canopyBonus_Pct);
        coolingInfrastructure.push('Misting Ramada', 'Public Hydration Station', 'Deep Tree Shade');
      } else if (is3rdAveCanopy) {
        zone = '3rd Ave Green Corridor';
        streetName = '3rd Avenue';
        surfaceType = 'permeable_paver';
        baseAlbedo = 0.32 + scenario.albedoBonus;
        baseCanopy = Math.min(92, 68 + scenario.canopyBonus_Pct);
        coolingInfrastructure.push('Desert Mesquite Canopy', 'Cool Pavement Treatment', 'Water Refill Oasis');
      } else if (isCentralAve) {
        zone = 'Central Avenue Transit Spine';
        streetName = 'Central Avenue';
        surfaceType = 'asphalt_dark';
        baseAlbedo = 0.08 + scenario.albedoBonus;
        baseCanopy = Math.max(2, Math.min(25, 4 + scenario.canopyBonus_Pct * 0.2));
        if (r === 7) coolingInfrastructure.push('Light Rail Shaded Shelter');
      } else if (isRooseveltRow) {
        zone = 'Roosevelt Row Arts District';
        streetName = 'Roosevelt Street';
        surfaceType = 'concrete';
        baseAlbedo = 0.22 + scenario.albedoBonus;
        baseCanopy = Math.min(80, 45 + scenario.canopyBonus_Pct);
        coolingInfrastructure.push('Fabric Shade Sails', 'Outdoor Misting Nozzles');
      } else {
        zone = 'Downtown Urban Matrix';
        streetName = `Urban Block ${r}-${c}`;
        surfaceType = (r + c) % 3 === 0 ? 'asphalt_aged' : 'concrete';
        baseAlbedo = 0.16 + scenario.albedoBonus;
        baseCanopy = Math.min(60, 18 + scenario.canopyBonus_Pct);
      }

      // Microclimate Thermal Physics Computation
      const solarFlux = Math.round(
        (920 * scenario.solarFluxMultiplier * (1 - (baseCanopy / 100) * 0.72)) + 
        ((surfaceType === 'asphalt_dark' ? 120 : 20))
      );

      // 2m Ambient Air Temp calculation
      // Urban heat island penalty on dark asphalt vs cooling from canopy evapotranspiration
      const asphaltPenaltyF = surfaceType === 'asphalt_dark' ? 3.8 : surfaceType === 'asphalt_aged' ? 2.0 : 0.5;
      const canopyCoolingF = (baseCanopy / 100) * 11.5;
      const albedoReductionF = (baseAlbedo - 0.10) * 12.0;

      const ambient2m_F = Math.round((scenario.baseTemp_F + asphaltPenaltyF - canopyCoolingF - albedoReductionF) * 10) / 10;
      const ambient2m_C = Math.round(((ambient2m_F - 32) * (5 / 9)) * 10) / 10;

      // Surface temperature (asphalt can reach 145-155°F in Phoenix)
      const surfaceTemp_F = Math.round(
        ambient2m_F + (solarFlux * (1 - baseAlbedo) * 0.045) - ((baseCanopy / 100) * 22)
      );
      const surfaceTemp_C = Math.round(((surfaceTemp_F - 32) * (5 / 9)) * 10) / 10;

      // Mean Radiant Temperature (Tmrt)
      const meanRadiantTemp_F = calculateMeanRadiantTemp(ambient2m_F, solarFlux, baseCanopy, baseAlbedo);
      const meanRadiantTemp_C = Math.round(((meanRadiantTemp_F - 32) * (5 / 9)) * 10) / 10;

      // Heat Index & WBGT
      const heatIndex_F = calculateHeatIndex(ambient2m_F, scenario.relativeHumidity_Pct);
      const wbgt_F = calculateWBGT(ambient2m_F, scenario.relativeHumidity_Pct, solarFlux, 1.8);
      const oshaRisk = getOshaRiskLevel(heatIndex_F);

      cells.push({
        id: `PHX-20M-${r * 100 + c + 1000}`,
        row: r,
        col: c,
        lat,
        lon,
        zone,
        streetName,
        surfaceType,
        albedo: Math.round(baseAlbedo * 100) / 100,
        treeCanopyCoveragePct: Math.round(baseCanopy),
        ambientTemp2m_C: ambient2m_C,
        ambientTemp2m_F: ambient2m_F,
        surfaceTemp_C: surfaceTemp_C,
        surfaceTemp_F: surfaceTemp_F,
        meanRadiantTemp_C: meanRadiantTemp_C,
        meanRadiantTemp_F: meanRadiantTemp_F,
        solarRadiationFlux_Wm2: solarFlux,
        relativeHumidity_Pct: scenario.relativeHumidity_Pct,
        windSpeed_ms: 1.8,
        heatIndex_F: heatIndex_F,
        wetBulbGlobeTemp_F: wbgt_F,
        oshaRiskLevel: oshaRisk,
        coolingInfrastructure: coolingInfrastructure
      });
    }
  }

  return cells;
}

/**
 * Generate detailed CorridorRoute objects for comparison
 */
export function buildCorridorRoutes(
  preset: CorridorPreset,
  scenario: ClimateScenario,
  persona: UserPersona
): { arterialRoute: CorridorRoute; coolCanopyRoute: CorridorRoute } {
  // Dynamically build Arterial Route Waypoints
  const arterialPointsCount = Math.max(1, preset.arterialPath.length);
  const arterialWaypoints: RouteWaypoint[] = preset.arterialPath.map((coords, idx) => {
    const progress = arterialPointsCount > 1 ? idx / (arterialPointsCount - 1) : 0;
    const dist = Math.round(progress * 1300);
    // Peak heat in central arterial stretch
    const heatCurve = Math.sin(progress * Math.PI);
    const ambientTemp = scenario.baseTemp_F + 2.4 + heatCurve * 1.4;
    const meanRadiantTemp = scenario.baseTemp_F + 30.2 + heatCurve * 5.6;
    const solarFlux = Math.round((930 + heatCurve * 80) * scenario.solarFluxMultiplier);
    const canopy = Math.max(1, Math.min(8, Math.round(5 - heatCurve * 3)));
    const isFirst = idx === 0;
    const isLast = idx === arterialPointsCount - 1;

    return {
      cellId: `PHX-20M-ART-${idx + 1}`,
      lat: coords[0],
      lon: coords[1],
      streetName: preset.arterialStreet,
      distanceFromStart_m: dist,
      ambientTemp2m_F: Math.round(ambientTemp * 10) / 10,
      meanRadiantTemp_F: Math.round(meanRadiantTemp * 10) / 10,
      solarFlux_Wm2: solarFlux,
      canopyPct: canopy,
      shadeType: isFirst ? 'Origin Intersection (Zero Shade)' : isLast ? 'Arrival Junction (Zero Shade)' : 'Zero Shade (Peak Solar Load)',
      isCoolingOasis: false,
      notes: '6-lane dark asphalt, low albedo 0.08, high thermal inertia'
    };
  });

  const arterialDistance = 1300;
  const arterialDurationMin = Math.round((arterialDistance / (persona.metabolicRate_W > 350 ? 65 : 75)) * 10) / 10;
  const arterialAvgAmbient = Math.round((arterialWaypoints.reduce((s, w) => s + w.ambientTemp2m_F, 0) / arterialWaypoints.length) * 10) / 10;
  const arterialPeakAmbient = Math.max(...arterialWaypoints.map(w => w.ambientTemp2m_F));
  const arterialMinAmbient = Math.min(...arterialWaypoints.map(w => w.ambientTemp2m_F));
  const arterialAvgTmrt = Math.round((arterialWaypoints.reduce((s, w) => s + w.meanRadiantTemp_F, 0) / arterialWaypoints.length) * 10) / 10;
  const arterialAvgFlux = Math.round(arterialWaypoints.reduce((s, w) => s + w.solarFlux_Wm2, 0) / arterialWaypoints.length);
  const arterialAvgCanopy = 4;
  const arterialHeatIndex = calculateHeatIndex(arterialAvgAmbient, scenario.relativeHumidity_Pct);
  const arterialOshaRisk = getOshaRiskLevel(arterialHeatIndex);
  const arterialRestMin = getOshaRestMinutesPerHour(arterialHeatIndex, persona.metabolicRate_W);
  const arterialSweat = computeSweatLoss(persona.metabolicRate_W, arterialAvgAmbient, arterialAvgTmrt, arterialDurationMin);
  const arterialCTD = calculateCumulativeThermalDose(arterialWaypoints, arterialDurationMin);

  const arterialRoute: CorridorRoute = {
    id: 'arterial',
    name: preset.arterialStreet,
    corridorType: 'Unshaded High-Asphalt Arterial',
    totalDistance_m: arterialDistance,
    estimatedDuration_min: arterialDurationMin,
    avgAmbientTemp2m_F: arterialAvgAmbient,
    peakAmbientTemp2m_F: arterialPeakAmbient,
    minAmbientTemp2m_F: arterialMinAmbient,
    avgMeanRadiantTemp_F: arterialAvgTmrt,
    avgSolarRadiationFlux_Wm2: arterialAvgFlux,
    avgCanopyCoverage_Pct: arterialAvgCanopy,
    cumulativeThermalDose_DegMin: arterialCTD,
    estimatedSweatLoss_mL: arterialSweat,
    oshaRiskLevel: arterialOshaRisk,
    oshaRequiredRest_min_hr: arterialRestMin,
    waypoints: arterialWaypoints,
    pathCoordinates: preset.arterialPath
  };

  // Dynamically build Cool Canopy Route Waypoints
  const canopyPointsCount = Math.max(1, preset.canopyPath.length);
  const canopyWaypoints: RouteWaypoint[] = preset.canopyPath.map((coords, idx) => {
    const progress = canopyPointsCount > 1 ? idx / (canopyPointsCount - 1) : 0;
    const dist = Math.round(progress * 1480);
    // Peak cooling in middle of canopy corridor
    const coolCurve = Math.sin(progress * Math.PI);
    const isFirst = idx === 0;
    const isLast = idx === canopyPointsCount - 1;

    const ambientTemp = scenario.baseTemp_F - (isFirst ? 1.2 : isLast ? 6.2 : 7.0 + coolCurve * 4.2);
    const meanRadiantTemp = scenario.baseTemp_F + (isFirst ? 10.4 : isLast ? 3.5 : -2.0 - coolCurve * 4.5);
    const solarFlux = Math.round((isFirst ? 480 : isLast ? 360 : 320 - coolCurve * 110) * scenario.solarFluxMultiplier);
    const baseCanopy = isFirst ? 55 : isLast ? 68 : Math.round(75 + coolCurve * 15);
    const canopy = Math.min(98, Math.max(30, baseCanopy + scenario.canopyBonus_Pct));
    const isOasis = isFirst || isLast || idx % 2 === 1;

    return {
      cellId: `PHX-20M-CAN-${idx + 1}`,
      lat: coords[0],
      lon: coords[1],
      streetName: isFirst ? 'Transition to Shaded Greenway' : isLast ? 'Destination Canopy Gateway' : preset.canopyStreet,
      distanceFromStart_m: dist,
      ambientTemp2m_F: Math.round(ambientTemp * 10) / 10,
      meanRadiantTemp_F: Math.round(meanRadiantTemp * 10) / 10,
      solarFlux_Wm2: solarFlux,
      canopyPct: canopy,
      shadeType: isFirst ? 'Palo Verde & Desert Ironwood Trees' : isLast ? 'Park Canopy Gateway' : 'Urban Bioswale & Evapotranspiration Canopy',
      isCoolingOasis: isOasis,
      notes: isOasis ? 'Continuous canopy with municipal misting and hydration oasis' : 'Shaded bikeway & pedestrian colonnade'
    };
  });

  const canopyDistance = 1480; // slight detour (~180m)
  const canopyDurationMin = Math.round((canopyDistance / (persona.metabolicRate_W > 350 ? 65 : 75)) * 10) / 10;
  const canopyAvgAmbient = Math.round((canopyWaypoints.reduce((s, w) => s + w.ambientTemp2m_F, 0) / canopyWaypoints.length) * 10) / 10;
  const canopyPeakAmbient = Math.max(...canopyWaypoints.map(w => w.ambientTemp2m_F));
  const canopyMinAmbient = Math.min(...canopyWaypoints.map(w => w.ambientTemp2m_F));
  const canopyAvgTmrt = Math.round((canopyWaypoints.reduce((s, w) => s + w.meanRadiantTemp_F, 0) / canopyWaypoints.length) * 10) / 10;
  const canopyAvgFlux = Math.round(canopyWaypoints.reduce((s, w) => s + w.solarFlux_Wm2, 0) / canopyWaypoints.length);
  const canopyAvgCanopy = Math.round(canopyWaypoints.reduce((s, w) => s + w.canopyPct, 0) / canopyWaypoints.length);
  const canopyHeatIndex = calculateHeatIndex(canopyAvgAmbient, scenario.relativeHumidity_Pct);
  const canopyOshaRisk = getOshaRiskLevel(canopyHeatIndex);
  const canopyRestMin = getOshaRestMinutesPerHour(canopyHeatIndex, persona.metabolicRate_W);
  const canopySweat = computeSweatLoss(persona.metabolicRate_W, canopyAvgAmbient, canopyAvgTmrt, canopyDurationMin);
  const canopyCTD = calculateCumulativeThermalDose(canopyWaypoints, canopyDurationMin);

  const coolCanopyRoute: CorridorRoute = {
    id: 'cool_canopy',
    name: preset.canopyStreet,
    corridorType: 'Shaded Vegetative Tree Canopy',
    totalDistance_m: canopyDistance,
    estimatedDuration_min: canopyDurationMin,
    avgAmbientTemp2m_F: canopyAvgAmbient,
    peakAmbientTemp2m_F: canopyPeakAmbient,
    minAmbientTemp2m_F: canopyMinAmbient,
    avgMeanRadiantTemp_F: canopyAvgTmrt,
    avgSolarRadiationFlux_Wm2: canopyAvgFlux,
    avgCanopyCoverage_Pct: canopyAvgCanopy,
    cumulativeThermalDose_DegMin: canopyCTD,
    estimatedSweatLoss_mL: canopySweat,
    oshaRiskLevel: canopyOshaRisk,
    oshaRequiredRest_min_hr: canopyRestMin,
    waypoints: canopyWaypoints,
    pathCoordinates: preset.canopyPath
  };

  return { arterialRoute, coolCanopyRoute };
}
