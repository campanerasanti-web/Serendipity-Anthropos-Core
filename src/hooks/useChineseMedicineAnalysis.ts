/**
 * BENCHMARK DE MEDICINA CHINA - Análisis del Qi Financiero
 * 
 * Cruza principios de Medicina Tradicional China con flujo de dinero
 * para detectar bloqueos (estancamiento de Qi) y fugas de energía
 * 
 * "El dinero es energía. Su flujo sano nutre el sistema; su bloqueo lo enferma."
 * - Inspirado en El Gran Libro de la Medicina China
 */

import { useState, useEffect } from 'react';
import { PersonalFinance } from './usePersonalFinance';

// Principios de Medicina China aplicados al flujo financiero
export type QiState = 'flowing' | 'stagnant' | 'deficient' | 'excessive';
export type ElementType = 'wood' | 'fire' | 'earth' | 'metal' | 'water';

export interface QiAnalysis {
  state: QiState;
  element: ElementType;
  description: string;
  severity: 'low' | 'medium' | 'high';
  recommendation: string;
}

export interface ChakraFinancial {
  name: string;
  category: keyof PersonalFinance;
  element: ElementType;
  qiLevel: number; // 0-100
  isBlocked: boolean;
  leakage: number; // % de gasto excesivo
  recommendation?: string;
}

export interface YinYangBalance {
  yin: number;  // Ahorro, estabilidad, pasivo (0-100)
  yang: number; // Gasto, acción, activo (0-100)
  balance: number; // -100 (muy Yin) a +100 (muy Yang)
  state: 'balanced' | 'yin_excess' | 'yang_excess';
  recommendation: string;
}

export interface MedicinaChinaReport {
  // Estado general del Qi financiero
  overallQi: QiState;
  qiScore: number; // 0-100

  // Balance Yin-Yang
  yinYang: YinYangBalance;

  // Chakras financieros (7 categorías de gasto)
  chakras: ChakraFinancial[];

  // Meridianos bloqueados (flujos problemáticos)
  blockedMeridians: {
    from: string;
    to: string;
    blockageLevel: number; // 0-100
    impact: string;
  }[];

  // Fugas de energía detectadas
  energyLeaks: {
    category: string;
    amount: number;
    percentage: number;
    reason: string;
    solution: string;
  }[];

  // Recomendaciones por elemento (5 elementos)
  elementRecommendations: {
    element: ElementType;
    issues: string[];
    solutions: string[];
    priority: 'low' | 'medium' | 'high';
  }[];

  // Fecha del análisis
  analyzedAt: Date;
}

/**
 * Mapeo de gastos a Elementos de Medicina China
 */
const EXPENSE_TO_ELEMENT: Record<string, ElementType> = {
  housing: 'earth',        // Tierra = hogar, base, estabilidad
  utilities: 'water',      // Agua = flujo, servicios esenciales
  food: 'earth',           // Tierra = nutrición, sostén
  transportation: 'metal', // Metal = movimiento, estructura
  healthcare: 'water',     // Agua = limpieza, renovación
  education: 'wood',       // Madera = crecimiento, expansión
  leisure: 'fire',         // Fuego = alegría, pasión, expansión emocional
  savings: 'metal',        // Metal = acumulación, contención
};

/**
 * Umbrales saludables según principios TCM (% del ingreso)
 */
const HEALTHY_THRESHOLDS = {
  housing: { min: 20, max: 35 },      // 20-35% vivienda
  utilities: { min: 5, max: 10 },     // 5-10% servicios
  food: { min: 10, max: 15 },         // 10-15% alimentación
  transportation: { min: 5, max: 15 }, // 5-15% transporte
  healthcare: { min: 5, max: 10 },    // 5-10% salud
  education: { min: 5, max: 15 },     // 5-15% educación
  leisure: { min: 5, max: 10 },       // 5-10% ocio
  savings: { min: 20, max: 50 },      // 20-50% ahorro (ideal)
};

/**
 * Hook para analizar el Qi financiero según Medicina China
 */
export const useChineseMedicineAnalysis = () => {
  const [report, setReport] = useState<MedicinaChinaReport | null>(null);

  /**
   * Analiza el estado del Qi en una categoría de gasto
   */
  const analyzeQiState = (
    actual: number,
    income: number,
    category: keyof PersonalFinance
  ): QiAnalysis => {
    const percentage = (actual / income) * 100;
    const threshold = HEALTHY_THRESHOLDS[category as keyof typeof HEALTHY_THRESHOLDS];

    if (!threshold) {
      return {
        state: 'flowing',
        element: 'earth',
        description: 'Categoría sin umbrales definidos',
        severity: 'low',
        recommendation: 'Monitorear',
      };
    }

    // Deficiente: gasto muy bajo (puede indicar descuido)
    if (percentage < threshold.min * 0.5) {
      return {
        state: 'deficient',
        element: EXPENSE_TO_ELEMENT[category as string],
        description: `Qi deficiente en ${category}. Posible descuido o represión.`,
        severity: 'medium',
        recommendation: `Incrementar inversión en ${category} para nutrir este aspecto.`,
      };
    }

    // Fluye: dentro del rango saludable
    if (percentage >= threshold.min && percentage <= threshold.max) {
      return {
        state: 'flowing',
        element: EXPENSE_TO_ELEMENT[category as string],
        description: `Qi fluye armoniosamente en ${category}.`,
        severity: 'low',
        recommendation: 'Mantener este equilibrio.',
      };
    }

    // Excesivo: gasto muy alto (fuga de energía)
    if (percentage > threshold.max * 1.5) {
      return {
        state: 'excessive',
        element: EXPENSE_TO_ELEMENT[category as string],
        description: `Qi excesivo en ${category}. Fuga de energía detectada.`,
        severity: 'high',
        recommendation: `Reducir gasto en ${category}. Redirigir energía hacia ahorro o inversión.`,
      };
    }

    // Estancado: fuera de rango pero no crítico
    return {
      state: 'stagnant',
      element: EXPENSE_TO_ELEMENT[category as string],
      description: `Qi estancado en ${category}. Flujo irregular.`,
      severity: 'medium',
      recommendation: `Revisar patrones de gasto en ${category}. Buscar bloqueos emocionales.`,
    };
  };

  /**
   * Calcula el balance Yin-Yang del flujo financiero
   */
  const calculateYinYang = (finance: PersonalFinance): YinYangBalance => {
    // Yin = ahorro, estabilidad, contención (0-100)
    const yinScore = (finance.savingsRate * 0.7) + ((1 - finance.debtToIncome) * 30);

    // Yang = gasto, acción, expansión (0-100)
    const spendingRate = ((finance.totalExpenses - finance.savings) / finance.totalIncome) * 100;
    const yangScore = Math.min(spendingRate, 100);

    const balance = yangScore - yinScore; // -100 a +100

    let state: 'balanced' | 'yin_excess' | 'yang_excess';
    let recommendation: string;

    if (balance >= -10 && balance <= 10) {
      state = 'balanced';
      recommendation = '☯️ Balance perfecto. El Yin y Yang fluyen en armonía. Mantén este equilibrio sagrado.';
    } else if (balance < -10) {
      state = 'yin_excess';
      recommendation = `🌙 Exceso de Yin (${Math.abs(balance).toFixed(0)}%). Demasiada contención. Considera invertir en crecimiento, educación o experiencias enriquecedoras.`;
    } else {
      state = 'yang_excess';
      recommendation = `☀️ Exceso de Yang (${balance.toFixed(0)}%). Demasiada expansión. Aumenta el ahorro y la estabilidad para nutrir tu futuro.`;
    }

    return {
      yin: yinScore,
      yang: yangScore,
      balance,
      state,
      recommendation,
    };
  };

  /**
   * Analiza chakras financieros (7 categorías + ahorro)
   */
  const analyzeChakras = (finance: PersonalFinance): ChakraFinancial[] => {
    const categories: (keyof PersonalFinance)[] = [
      'housing',
      'utilities',
      'food',
      'transportation',
      'healthcare',
      'education',
      'leisure',
      'savings',
    ];

    return categories.map((category) => {
      const amount = finance[category] as number;
      const percentage = (amount / finance.totalIncome) * 100;
      const threshold = HEALTHY_THRESHOLDS[category as keyof typeof HEALTHY_THRESHOLDS];
      const element = EXPENSE_TO_ELEMENT[category as string];

      // Calcular nivel de Qi (0-100)
      let qiLevel = 50; // Base
      if (threshold) {
        const mid = (threshold.min + threshold.max) / 2;
        if (percentage >= threshold.min && percentage <= threshold.max) {
          qiLevel = 80 + (20 * (1 - Math.abs(percentage - mid) / mid));
        } else if (percentage < threshold.min) {
          qiLevel = (percentage / threshold.min) * 50;
        } else {
          const excess = percentage - threshold.max;
          qiLevel = 50 - Math.min(excess, 50);
        }
      }

      // Detectar bloqueo (fuera de rango saludable)
      const isBlocked = threshold
        ? percentage < threshold.min * 0.8 || percentage > threshold.max * 1.2
        : false;

      // Calcular fuga (exceso sobre umbral máximo)
      let leakage = 0;
      if (threshold && percentage > threshold.max) {
        leakage = ((percentage - threshold.max) / threshold.max) * 100;
      }

      const analysis = analyzeQiState(amount, finance.totalIncome, category);

      return {
        name: category,
        category,
        element,
        qiLevel,
        isBlocked,
        leakage,
        recommendation: analysis.recommendation,
      };
    });
  };

  /**
   * Detecta fugas de energía (gastos excesivos)
   */
  const detectEnergyLeaks = (finance: PersonalFinance): MedicinaChinaReport['energyLeaks'] => {
    const leaks: MedicinaChinaReport['energyLeaks'] = [];

    const categories: (keyof PersonalFinance)[] = [
      'housing',
      'utilities',
      'food',
      'transportation',
      'healthcare',
      'education',
      'leisure',
    ];

    categories.forEach((category) => {
      const amount = finance[category] as number;
      const percentage = (amount / finance.totalIncome) * 100;
      const threshold = HEALTHY_THRESHOLDS[category as keyof typeof HEALTHY_THRESHOLDS];

      if (threshold && percentage > threshold.max) {
        const excess = amount - (finance.totalIncome * threshold.max) / 100;
        leaks.push({
          category,
          amount: excess,
          percentage: percentage - threshold.max,
          reason: `Gasto excesivo en ${category}. Supera umbral saludable de ${threshold.max}%.`,
          solution: `Reducir ${category} en $${excess.toFixed(0)}/mes. Redirigir hacia ahorro o inversión.`,
        });
      }
    });

    // Ordenar por magnitud de fuga
    return leaks.sort((a, b) => b.amount - a.amount);
  };

  /**
   * Genera recomendaciones por elemento (5 elementos)
   */
  const generateElementRecommendations = (
    chakras: ChakraFinancial[]
  ): MedicinaChinaReport['elementRecommendations'] => {
    const elements: ElementType[] = ['wood', 'fire', 'earth', 'metal', 'water'];
    return elements.map((element) => {
      const relatedChakras = chakras.filter((c) => c.element === element);
      const blockedChakras = relatedChakras.filter((c) => c.isBlocked);
      const issues: string[] = [];
      const solutions: string[] = [];

      let priority: 'low' | 'medium' | 'high' = 'low';

      if (blockedChakras.length > 0) {
        priority = blockedChakras.length > 1 ? 'high' : 'medium';
        blockedChakras.forEach((c) => {
          issues.push(`${c.name}: Qi ${c.qiLevel < 50 ? 'deficiente' : 'excesivo'}`);
          if (c.recommendation) solutions.push(c.recommendation);
        });
      } else {
        solutions.push(`Elemento ${element} en armonía. Mantener.`);
      }

      return { element, issues, solutions, priority };
    });
  };

  /**
   * Genera el reporte completo de Medicina China
   */
  const generateReport = (finance: PersonalFinance): MedicinaChinaReport => {
    const chakras = analyzeChakras(finance);
    const yinYang = calculateYinYang(finance);
    const energyLeaks = detectEnergyLeaks(finance);

    // Calcular Qi Score general (0-100)
    const avgQiLevel = chakras.reduce((sum, c) => sum + c.qiLevel, 0) / chakras.length;
    const yinYangPenalty = Math.abs(yinYang.balance) / 2; // Penalizar desbalance
    const qiScore = Math.max(0, avgQiLevel - yinYangPenalty);

    // Determinar estado general del Qi
    let overallQi: QiState;
    if (qiScore >= 75) overallQi = 'flowing';
    else if (qiScore >= 50) overallQi = 'stagnant';
    else if (yinYang.balance < -20) overallQi = 'deficient';
    else overallQi = 'excessive';

    const report: MedicinaChinaReport = {
      overallQi,
      qiScore,
      yinYang,
      chakras,
      blockedMeridians: [], // Future: detectar relaciones entre categorías
      energyLeaks,
      elementRecommendations: generateElementRecommendations(chakras),
      analyzedAt: new Date(),
    };

    setReport(report);
    return report;
  };

  return {
    report,
    generateReport,
    analyzeQiState,
    calculateYinYang,
    analyzeChakras,
    detectEnergyLeaks,
  };
};
