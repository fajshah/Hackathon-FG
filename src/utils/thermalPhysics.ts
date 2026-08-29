/**
 * Thermal Physics & Physiological Heat Risk Assessment Engine
 * Complies with FortyGuard 20m² Microclimate Standards, OSHA 29 CFR 1910, & EPA Heat Index Standards
 */

import { MicroclimateCell, OshaRiskLevel, UserPersona, CorridorRoute, RouteWaypoint, RouteComparisonResult } from '../types';

/**
 * Standard EPA / NWS Rothfusz Heat Index Regression Equation
 */
export function calculateHeatIndex(tempF: number, relativeHumidityPct: number): number {
  if (tempF < 80) {
    return 0.5 * (tempF + 61.0 + ((tempF - 68.0) * 1.2) + (relativeHumidityPct * 0.094));
  }

  const T = tempF;
  const R = relativeHumidityPct;
  
  let HI = -42.379 +
    2.04901523 * T +
    10.14333127 * R -
    0.22475541 * T * R -
    0.00683783 * T * T -
    0.05481717 * R * R +
    0.00122874 * T * T * R +
    0.00085282 * T * R * R -
    0.00000199 * T * T * R * R;

  // Adjustments
  if (R < 13 && T >= 80 && T <= 112) {
    const adj = ((13 - R) / 4) * Math.sqrt((17 - Math.abs(T - 95)) / 17);
    HI -= adj;
  } else if (R > 85 && T >= 80 && T <= 87) {
    const adj = ((R - 87) / 10) * ((90 - T) / 5);
    HI += adj;
  }

  return Math.round(HI * 10) / 10;
}

/**
 * Mean Radiant Temperature (Tmrt in °F) calculation from 2m air temp, solar flux, and canopy shadow
 */
export function calculateMeanRadiantTemp(
  ambientTempF: number,
  solarFluxWm2: number,
  canopyCoveragePct: number,
  surfaceAlbedo: number
): number {
  // Attenuated solar radiation reaching human body after tree canopy interception
  const effectiveSolarFlux = solarFluxWm2 * (1 - (canopyCoveragePct / 100) * 0.88);
  
  // Reflected ground radiation component
  const reflectedRadiation = effectiveSolarFlux * surfaceAlbedo;
  
  // Stefan-Boltzmann radiative exchange approximation for human standing outdoors
  // Direct solar load adds ~15°F to 40°F over ambient in full desert sun (950 W/m²)
  const radiantDeltaF = (effectiveSolarFlux * 0.038) + (reflectedRadiation * 0.022);
  
  return Math.round((ambientTempF + radiantDeltaF) * 10) / 10;
}

/**
 * Wet Bulb Globe Temperature (WBGT in °F) estimation for outdoor desert environment
 */
export function calculateWBGT(tempF: number, rhPct: number, solarFluxWm2: number, windSpeedMs: number): number {
  const tempC = (tempF - 32) * (5 / 9);
  
  // Approximating natural wet bulb temp Tw
  const Tw_C = tempC * Math.atan(0.151977 * Math.pow(rhPct + 8.313659, 0.5)) +
    Math.atan(tempC + rhPct) -
    Math.atan(rhPct - 1.676331) +
    0.00391838 * Math.pow(rhPct, 1.5) * Math.atan(0.023101 * rhPct) -
    4.686035;

  // Approximating globe temp Tg from solar radiation and air temp
  const Tg_C = tempC + (solarFluxWm2 / (15 + 10 * windSpeedMs));
  const Td_C = tempC;

  // Outdoor WBGT standard weighting: 0.7 Tw + 0.2 Tg + 0.1 Td
  const wbgtC = 0.7 * Tw_C + 0.2 * Tg_C + 0.1 * Td_C;
  const wbgtF = (wbgtC * (9 / 5)) + 32;

  return Math.round(wbgtF * 10) / 10;
}

/**
 * Determine OSHA Heat Hazard Risk Category
 */
export function getOshaRiskLevel(heatIndexF: number): OshaRiskLevel {
  if (heatIndexF < 91) return 'Low';
  if (heatIndexF < 103) return 'Moderate';
  if (heatIndexF < 115) return 'High';
  return 'Extreme Danger';
}

/**
 * Compute OSHA required rest cycle per hour of work based on persona and heat index
 */
export function getOshaRestMinutesPerHour(heatIndexF: number, metabolicRateW: number): number {
  if (heatIndexF < 90) return 0;
  if (heatIndexF < 100) {
    return metabolicRateW > 300 ? 15 : 0;
  }
  if (heatIndexF < 108) {
    return metabolicRateW > 300 ? 30 : 15;
  }
  if (heatIndexF < 115) {
    return metabolicRateW > 300 ? 45 : 30;
  }
  return 45; // Extreme danger: 45 min rest/hr or cease outdoor work
}

/**
 * Compute sweat loss rate (mL) for route duration
 */
export function computeSweatLoss(
  metabolicRateW: number,
  ambientTempF: number,
  meanRadiantTempF: number,
  durationMin: number
): number {
  // Base sweat rate ~ 350mL/hr + heat load factor
  const thermalLoad = Math.max(0, (meanRadiantTempF - 85) * 18);
  const metabolicLoad = (metabolicRateW / 100) * 120;
  const hourlyRate_mL = 350 + thermalLoad + metabolicLoad;
  
  return Math.round((hourlyRate_mL * (durationMin / 60)));
}

/**
 * Calculate Cumulative Thermal Dose (Degree-Minutes above 100°F threshold)
 */
export function calculateCumulativeThermalDose(waypoints: RouteWaypoint[], totalDurationMin: number): number {
  if (waypoints.length === 0) return 0;
  const timePerSegment = totalDurationMin / waypoints.length;
  
  let ctd = 0;
  for (const wp of waypoints) {
    const excess = Math.max(0, wp.ambientTemp2m_F - 100);
    ctd += excess * timePerSegment;
  }
  return Math.round(ctd * 10) / 10;
}

/**
 * Projected Core Body Temperature rise (°C) over the route
 */
export function projectCoreTempDeltaC(
  metabolicRateW: number,
  meanRadiantTempF: number,
  durationMin: number,
  sweatLossML: number
): number {
  // Normal body heat storage rate calculation
  const heatStressScore = ((meanRadiantTempF - 90) / 30) * (metabolicRateW / 250);
  const dehydrationFactor = (sweatLossML / 1000) * 0.15;
  const deltaC = Math.max(0, (heatStressScore * (durationMin / 60) * 0.45) + dehydrationFactor);
  
  return Math.round(deltaC * 100) / 100;
}

/**
 * Synthesize Route Comparative Analysis
 */
export function analyzeRoutePair(
  presetId: string,
  presetName: string,
  timeOfDay: string,
  baselineAmbientF: number,
  arterial: CorridorRoute,
  canopy: CorridorRoute,
  persona: UserPersona
): RouteComparisonResult {
  const avgAmbient2mDelta = Math.round((canopy.avgAmbientTemp2m_F - arterial.avgAmbientTemp2m_F) * 10) / 10;
  const peakAmbient2mDelta = Math.round((canopy.peakAmbientTemp2m_F - arterial.peakAmbientTemp2m_F) * 10) / 10;
  const meanRadiantTempDelta = Math.round((canopy.avgMeanRadiantTemp_F - arterial.avgMeanRadiantTemp_F) * 10) / 10;
  
  const solarFluxReductionPct = Math.round(
    ((arterial.avgSolarRadiationFlux_Wm2 - canopy.avgSolarRadiationFlux_Wm2) / arterial.avgSolarRadiationFlux_Wm2) * 100
  );
  
  const canopyIncreasePct = Math.round(canopy.avgCanopyCoverage_Pct - arterial.avgCanopyCoverage_Pct);
  
  const ctdReductionPct = arterial.cumulativeThermalDose_DegMin > 0
    ? Math.round(((arterial.cumulativeThermalDose_DegMin - canopy.cumulativeThermalDose_DegMin) / arterial.cumulativeThermalDose_DegMin) * 100)
    : 0;

  const sweatReductionML = Math.max(0, arterial.estimatedSweatLoss_mL - canopy.estimatedSweatLoss_mL);
  
  const arterialCoreDelta = projectCoreTempDeltaC(persona.metabolicRate_W, arterial.avgMeanRadiantTemp_F, arterial.estimatedDuration_min, arterial.estimatedSweatLoss_mL);
  const canopyCoreDelta = projectCoreTempDeltaC(persona.metabolicRate_W, canopy.avgMeanRadiantTemp_F, canopy.estimatedDuration_min, canopy.estimatedSweatLoss_mL);
  const coreBodyTempDelta = Math.round((canopyCoreDelta - arterialCoreDelta) * 100) / 100;

  const oshaRestSaved = Math.max(0, arterial.oshaRequiredRest_min_hr - canopy.oshaRequiredRest_min_hr);
  const durationDelta = Math.round((canopy.estimatedDuration_min - arterial.estimatedDuration_min) * 10) / 10;
  const distanceDelta = canopy.totalDistance_m - arterial.totalDistance_m;

  return {
    corridorPresetId: presetId,
    corridorPresetName: presetName,
    timeOfDay,
    baselineAmbient_F: baselineAmbientF,
    solarAzimuth_deg: 242,
    solarZenith_deg: 32,
    arterialRoute: arterial,
    coolCanopyRoute: canopy,
    deltas: {
      avgAmbient2mDelta_F: avgAmbient2mDelta,
      peakAmbient2mDelta_F: peakAmbient2mDelta,
      meanRadiantTempDelta_F: meanRadiantTempDelta,
      solarFluxReduction_Pct: solarFluxReductionPct,
      canopyIncrease_Pct: canopyIncreasePct,
      cumulativeThermalDoseReduction_Pct: ctdReductionPct,
      sweatLossReduction_mL: sweatReductionML,
      coreBodyTempDelta_C: coreBodyTempDelta,
      oshaRestTimeSaved_min_hr: oshaRestSaved,
      durationDelta_min: durationDelta,
      distanceDelta_m: distanceDelta,
    },
  };
}
