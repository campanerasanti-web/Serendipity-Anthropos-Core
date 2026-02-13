/**
 * useFinancialClimate - Oráculo Meteorológico del Sistema
 * Transforma datos financieros en metáforas climáticas
 * 
 * "El flujo de capital es como el agua: puede hidratar o crear sequía"
 */

import { useState, useEffect } from 'react';

export type ClimateIcon = '☀️' | '⛅' | '☁️' | '🌧️' | '⚡' | '🌊' | '🌵';

export type Season = 'cosecha' | 'siembra' | 'sequia' | 'tormenta';

export interface FinancialClimate {
  icon: ClimateIcon;
  season: Season;
  narrative: string;
  weatherClass: string; // CSS class para gradientes
  liquidityLevel: 'alta' | 'media' | 'baja' | 'critica';
  flowTrend: 'subiendo' | 'estable' | 'bajando';
  shouldShowRainAnimation: boolean; // Gotas de luz cuando entra ingreso
  recentLargeIncome: boolean;
}

interface ProjectionData {
  dailyRevenues: number[]; // Últimos 31 días
  dailyExpenses: number[];
  currentBalance: number;
  profitMargin: number;
}

export const useFinancialClimate = (projectionData?: ProjectionData) => {
  const [climate, setClimate] = useState<FinancialClimate>({
    icon: '☀️',
    season: 'cosecha',
    narrative: 'Época de abundancia. Los campos están fértiles.',
    weatherClass: 'weather-sunny',
    liquidityLevel: 'alta',
    flowTrend: 'estable',
    shouldShowRainAnimation: false,
    recentLargeIncome: false,
  });

  useEffect(() => {
    if (!projectionData) return;

    const { dailyRevenues, dailyExpenses, currentBalance, profitMargin } = projectionData;

    // ═══════════════════════════════════════════════════
    // 1. CALCULAR FLUJO (últimos 31 días)
    // ═══════════════════════════════════════════════════
    const totalRevenue = dailyRevenues.reduce((sum, val) => sum + val, 0);
    const totalExpenses = dailyExpenses.reduce((sum, val) => sum + val, 0);
    const netFlow = totalRevenue - totalExpenses;

    // Promedio diario de flujo
    const avgDailyFlow = netFlow / dailyRevenues.length;

    // ═══════════════════════════════════════════════════
    // 2. DETERMINAR LIQUIDEZ (basado en balance actual)
    // ═══════════════════════════════════════════════════
    const monthlyExpenses = totalExpenses; // Últimos 31 días ~ 1 mes
    const balanceRatio = currentBalance / (monthlyExpenses || 1);

    let liquidityLevel: FinancialClimate['liquidityLevel'];
    if (balanceRatio >= 3) liquidityLevel = 'alta';       // 3+ meses de runway
    else if (balanceRatio >= 1.5) liquidityLevel = 'media'; // 1.5-3 meses
    else if (balanceRatio >= 0.5) liquidityLevel = 'baja';  // 0.5-1.5 meses
    else liquidityLevel = 'critica';                        // <0.5 meses

    // ═══════════════════════════════════════════════════
    // 3. DETECTAR TENDENCIA (últimos 7 vs anteriores 7 días)
    // ═══════════════════════════════════════════════════
    const last7Days = dailyRevenues.slice(-7);
    const prev7Days = dailyRevenues.slice(-14, -7);

    const avgLast7 = last7Days.reduce((sum, val) => sum + val, 0) / 7;
    const avgPrev7 = prev7Days.reduce((sum, val) => sum + val, 0) / 7;

    let flowTrend: FinancialClimate['flowTrend'];
    if (avgLast7 > avgPrev7 * 1.1) flowTrend = 'subiendo';      // +10% mejora
    else if (avgLast7 < avgPrev7 * 0.9) flowTrend = 'bajando';  // -10% caída
    else flowTrend = 'estable';

    // ═══════════════════════════════════════════════════
    // 4. DETECTAR INGRESO GRANDE RECIENTE
    // ═══════════════════════════════════════════════════
    const avgRevenue = totalRevenue / dailyRevenues.length;
    const last3Days = dailyRevenues.slice(-3);
    const hasLargeIncome = last3Days.some(day => day > avgRevenue * 2); // Ingreso 2x promedio

    // ═══════════════════════════════════════════════════
    // 5. DETERMINAR CLIMA Y ESTACIÓN
    // ═══════════════════════════════════════════════════
    let icon: ClimateIcon;
    let season: Season;
    let narrative: string;
    let weatherClass: string;

    if (liquidityLevel === 'alta' && flowTrend === 'subiendo') {
      // 🌊 AGUA (Liquidez alta + flujo subiendo) → COSECHA
      icon = '🌊';
      season = 'cosecha';
      narrative = 'Época de cosecha. Los ríos fluyen con abundancia y los graneros se llenan.';
      weatherClass = 'weather-agua';
    } else if (liquidityLevel === 'alta' && flowTrend === 'estable') {
      // ☀️ SOL (Liquidez alta + estable) → COSECHA
      icon = '☀️';
      season = 'cosecha';
      narrative = 'Días de sol. El sistema respira tranquilo bajo cielos despejados.';
      weatherClass = 'weather-sunny';
    } else if (liquidityLevel === 'media' && flowTrend === 'subiendo') {
      // ⛅ NUBES PARCIALES (Liquidez media + subiendo) → SIEMBRA
      icon = '⛅';
      season = 'siembra';
      narrative = 'Época de siembra. Las nubes prometen lluvia y el terreno es fértil.';
      weatherClass = 'weather-cloudy';
    } else if (liquidityLevel === 'media' && flowTrend === 'estable') {
      // ☁️ NUBLADO (Liquidez media + estable) → SIEMBRA
      icon = '☁️';
      season = 'siembra';
      narrative = 'Época de siembra. Preparación bajo cielos nublados. Aún hay tiempo.';
      weatherClass = 'weather-overcast';
    } else if (liquidityLevel === 'baja' || flowTrend === 'bajando') {
      // 🌵 SEQUÍA (Liquidez baja o flujo bajando) → SEQUÍA
      icon = '🌵';
      season = 'sequia';
      narrative = 'Tierra seca. Los pozos bajan y el terreno pide urgencia.';
      weatherClass = 'weather-sequia';
    } else if (liquidityLevel === 'critica') {
      // ⚡ TORMENTA (Liquidez crítica) → TORMENTA
      icon = '⚡';
      season = 'tormenta';
      narrative = 'Tormenta inminente. El sistema exige acción inmediata.';
      weatherClass = 'weather-tormenta';
    } else {
      // 🌧️ LLUVIA (Default)
      icon = '🌧️';
      season = 'siembra';
      narrative = 'Época de lluvia. El flujo mantiene el equilibrio.';
      weatherClass = 'weather-rain';
    }

    // ═══════════════════════════════════════════════════
    // 6. ACTIVAR ANIMACIÓN DE GOTAS SI HAY INGRESO GRANDE
    // ═══════════════════════════════════════════════════
    const shouldShowRainAnimation = hasLargeIncome;

    setClimate({
      icon,
      season,
      narrative,
      weatherClass,
      liquidityLevel,
      flowTrend,
      shouldShowRainAnimation,
      recentLargeIncome: hasLargeIncome,
    });

    // Aplicar clase al body para gradientes globales
    document.body.classList.remove(
      'weather-sunny', 'weather-agua', 'weather-cloudy', 
      'weather-overcast', 'weather-sequia', 'weather-tormenta', 'weather-rain'
    );
    document.body.classList.add(weatherClass);

    // Mostrar gotas de luz por 5 segundos si hay ingreso grande
    if (shouldShowRainAnimation) {
      setTimeout(() => {
        setClimate(prev => ({ ...prev, shouldShowRainAnimation: false }));
      }, 5000);
    }

  }, [projectionData]);

  return climate;
};
