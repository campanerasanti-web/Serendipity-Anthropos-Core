/**
 * CONEXIÓN CON 'SANTI' - Panel Financiero Personal
 * Muestra cómo la eficiencia de Serendipity impacta la calidad de vida del Admin
 * 
 * "Cuando el sistema prospera, el líder encuentra paz"
 */

import { useState, useEffect } from 'react';

export interface PersonalFinance {
  // Ingresos personales
  monthlySalary: number;          // Salario mensual de Serendipity
  additionalIncome: number;       // Ingresos adicionales (inversiones, etc.)
  totalIncome: number;            // Total mensual

  // Gastos personales
  housing: number;                // Vivienda (hipoteca/alquiler)
  utilities: number;              // Servicios (luz, agua, internet)
  food: number;                   // Alimentación
  transportation: number;         // Transporte
  healthcare: number;             // Salud
  education: number;              // Educación (hijos)
  leisure: number;                // Ocio y familia
  savings: number;                // Ahorro mensual
  totalExpenses: number;          // Total gastos

  // Balance personal
  monthlyBalance: number;         // Ingresos - Gastos
  savingsRate: number;            // % de ahorro
  debtToIncome: number;           // Ratio deuda/ingresos

  // Calidad de vida (0-100)
  qualityOfLifeScore: number;

  // Fecha de actualización
  lastUpdated: Date;
}

export interface CompanyImpact {
  // Métricas de Serendipity
  companyProfitMargin: number;    // Margen de beneficio de la empresa
  companyRevenue: number;         // Ingresos mensuales
  praraRisk: number;              // Riesgo PRARA (0-100, menor es mejor)
  qualityErrorRate: number;       // Tasa de error de calidad
  teamEfficiency: number;         // Eficiencia del equipo (0-100)
  
  // Correlaciones (0-100)
  efficiencyImpact: number;       // Impacto de eficiencia en vida personal
  stressLevel: number;            // Nivel de estrés (inverso de estabilidad)
  timeFlexibility: number;        // Flexibilidad de tiempo (mejora con delegación)
  workLifeBalance: number;        // Balance vida-trabajo

  // NUEVAS MÉTRICAS: Paz y Presencia
  peaceScore: number;             // Nivel de paz interior (0-100)
  presenceHours: number;          // Horas de presencia consciente ganadas/semana
  automationImpact: number;       // % de tareas automatizadas
  mindfulnessGain: number;        // Ganancia de atención plena (0-100)

  // Proyecciones (próximos 6 meses)
  projectedSalaryIncrease: number;  // % de aumento proyectado
  projectedStressReduction: number; // % de reducción de estrés
  projectedTimeGain: number;        // Horas ganadas por semana
  projectedPeaceIncrease: number;   // % de aumento en paz interior
}

export interface CorrelationInsight {
  metric: string;
  companyValue: number;
  personalImpact: string;
  trend: 'improving' | 'stable' | 'declining';
  recommendation?: string;
}

/**
 * Hook para gestionar finanzas personales de Santi
 */
export const usePersonalFinance = (adminId: string = 'santi') => {
  const [personalData, setPersonalData] = useState<PersonalFinance>(() => {
    // Recuperar datos de localStorage
    const saved = localStorage.getItem(`serendipity-personal-finance-${adminId}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          lastUpdated: new Date(parsed.lastUpdated),
        };
      } catch {
        return getDefaultPersonalFinance();
      }
    }
    return getDefaultPersonalFinance();
  });

  // Persistir datos en localStorage
  useEffect(() => {
    localStorage.setItem(
      `serendipity-personal-finance-${adminId}`,
      JSON.stringify(personalData)
    );
  }, [personalData, adminId]);

  /**
   * Actualiza el salario mensual (basado en Serendipity)
   */
  const updateSalary = (newSalary: number) => {
    setPersonalData((prev) => {
      const totalIncome = newSalary + prev.additionalIncome;
      const monthlyBalance = totalIncome - prev.totalExpenses;
      const savingsRate = totalIncome > 0 ? (prev.savings / totalIncome) * 100 : 0;

      return {
        ...prev,
        monthlySalary: newSalary,
        totalIncome,
        monthlyBalance,
        savingsRate,
        lastUpdated: new Date(),
      };
    });
  };

  /**
   * Actualiza gastos personales
   */
  const updateExpenses = (expenses: Partial<Omit<PersonalFinance, 'totalExpenses'>>) => {
    setPersonalData((prev) => {
      const updated = { ...prev, ...expenses };
      const totalExpenses =
        (expenses.housing ?? prev.housing) +
        (expenses.utilities ?? prev.utilities) +
        (expenses.food ?? prev.food) +
        (expenses.transportation ?? prev.transportation) +
        (expenses.healthcare ?? prev.healthcare) +
        (expenses.education ?? prev.education) +
        (expenses.leisure ?? prev.leisure) +
        (expenses.savings ?? prev.savings);

      const monthlyBalance = updated.totalIncome - totalExpenses;
      const savingsRate = updated.totalIncome > 0 ? (updated.savings / updated.totalIncome) * 100 : 0;

      return {
        ...updated,
        totalExpenses,
        monthlyBalance,
        savingsRate,
        lastUpdated: new Date(),
      };
    });
  };

  /**
   * Calcula el impacto de la empresa en la vida personal
   */
  const calculateCompanyImpact = (companyMetrics: {
    profitMargin: number;
    revenue: number;
    praraRisk: number;
    qualityErrorRate: number;
    teamSize: number;
    delegationLevel: number; // 0-100
  }): CompanyImpact => {
    // Eficiencia del equipo (mayor margen + menor PRARA = mayor eficiencia)
    const teamEfficiency = Math.min(
      100,
      (companyMetrics.profitMargin * 2 + (100 - companyMetrics.praraRisk)) / 2
    );

    // Impacto de eficiencia: A mayor eficiencia, mayor calidad de vida
    const efficiencyImpact = teamEfficiency;

    // Nivel de estrés: Inverso de estabilidad (alto PRARA + errores = alto estrés)
    const stressLevel = Math.min(
      100,
      companyMetrics.praraRisk * 0.5 + companyMetrics.qualityErrorRate * 50
    );

    // Flexibilidad de tiempo: Delegación efectiva libera tiempo
    const timeFlexibility = companyMetrics.delegationLevel;

    // Balance vida-trabajo: Combinación de estrés bajo + tiempo flexible
    const workLifeBalance = (timeFlexibility + (100 - stressLevel)) / 2;

    // NUEVAS MÉTRICAS: Paz y Presencia
    // Paz interior: inverso del estrés + balance vida-trabajo
    const peaceScore = (100 - stressLevel) * 0.6 + workLifeBalance * 0.4;
    
    // Horas de presencia: calculadas desde automatización y delegación
    // Fórmula: (delegationLevel + teamEfficiency) / 20 = horas/semana recuperadas
    const presenceHours = ((companyMetrics.delegationLevel + teamEfficiency) / 20);
    
    // Impacto de automatización: % de tareas que ya no requieren tu atención directa
    const automationImpact = Math.min(100, (companyMetrics.delegationLevel * 0.7) + (teamEfficiency * 0.3));
    
    // Ganancia de mindfulness: capacidad de estar presente sin preocupaciones
    // Mayor cuando el sistema es eficiente y el riesgo es bajo
    const mindfulnessGain = Math.min(100, ((100 - companyMetrics.praraRisk) * 0.5) + (teamEfficiency * 0.5));

    // Proyecciones (basadas en tendencias)
    const projectedSalaryIncrease = companyMetrics.profitMargin > 50 ? 10 : 5;
    const projectedStressReduction = teamEfficiency > 70 ? 30 : 15;
    const projectedTimeGain = companyMetrics.delegationLevel > 60 ? 10 : 5;
    const projectedPeaceIncrease = peaceScore < 70 ? 25 : 10; // Mayor margen de mejora si paz actual es baja

    return {
      companyProfitMargin: companyMetrics.profitMargin,
      companyRevenue: companyMetrics.revenue,
      praraRisk: companyMetrics.praraRisk,
      qualityErrorRate: companyMetrics.qualityErrorRate,
      teamEfficiency,
      efficiencyImpact,
      stressLevel,
      timeFlexibility,
      workLifeBalance,
      peaceScore,
      presenceHours,
      automationImpact,
      mindfulnessGain,
      projectedSalaryIncrease,
      projectedStressReduction,
      projectedTimeGain,
      projectedPeaceIncrease,
    };
  };

  /**
   * Genera insights de correlación
   */
  const generateCorrelationInsights = (
    companyImpact: CompanyImpact
  ): CorrelationInsight[] => {
    const insights: CorrelationInsight[] = [];

    // Insight 1: Margen de beneficio → Salario
    insights.push({
      metric: 'Margen de Beneficio',
      companyValue: companyImpact.companyProfitMargin,
      personalImpact: `Tu salario puede crecer ${companyImpact.projectedSalaryIncrease}% en 6 meses`,
      trend: companyImpact.companyProfitMargin > 50 ? 'improving' : 'stable',
      recommendation:
        companyImpact.companyProfitMargin < 50
          ? 'Optimizar costos operativos para aumentar margen'
          : undefined,
    });

    // Insight 2: PRARA → Estrés
    insights.push({
      metric: 'Riesgo PRARA',
      companyValue: companyImpact.praraRisk,
      personalImpact: `Nivel de estrés: ${Math.round(companyImpact.stressLevel)}%`,
      trend: companyImpact.praraRisk < 30 ? 'improving' : 'declining',
      recommendation:
        companyImpact.praraRisk > 50
          ? 'Delegar decisiones críticas para reducir carga mental'
          : undefined,
    });

    // Insight 3: Eficiencia → Tiempo libre
    insights.push({
      metric: 'Eficiencia del Equipo',
      companyValue: companyImpact.teamEfficiency,
      personalImpact: `Ganarás ${companyImpact.projectedTimeGain}h/semana para familia`,
      trend: companyImpact.timeFlexibility > 60 ? 'improving' : 'stable',
      recommendation:
        companyImpact.timeFlexibility < 50
          ? 'Implementar automatizaciones y delegar tareas rutinarias'
          : undefined,
    });

    // Insight 4: Balance vida-trabajo
    insights.push({
      metric: 'Balance Vida-Trabajo',
      companyValue: companyImpact.workLifeBalance,
      personalImpact: `Balance general: ${Math.round(companyImpact.workLifeBalance)}%`,
      trend:
        companyImpact.workLifeBalance > 70
          ? 'improving'
          : companyImpact.workLifeBalance > 50
          ? 'stable'
          : 'declining',
      recommendation:
        companyImpact.workLifeBalance < 60
          ? 'Priorizar delegación y automatización para recuperar equilibrio'
          : undefined,
    });

    return insights;
  };

  /**
   * Calcula puntuación de calidad de vida (0-100)
   */
  const calculateQualityOfLife = (companyImpact: CompanyImpact): number => {
    // 40% balance financiero personal
    const financialScore =
      personalData.savingsRate > 20
        ? 100
        : personalData.savingsRate > 10
        ? 70
        : personalData.savingsRate > 5
        ? 50
        : 30;

    // 30% nivel de estrés (invertido)
    const stressScore = 100 - companyImpact.stressLevel;

    // 30% balance vida-trabajo
    const balanceScore = companyImpact.workLifeBalance;

    const qualityOfLifeScore = (financialScore * 0.4 + stressScore * 0.3 + balanceScore * 0.3);

    // Actualizar en estado
    setPersonalData((prev) => ({
      ...prev,
      qualityOfLifeScore,
    }));

    return qualityOfLifeScore;
  };

  return {
    personalData,
    updateSalary,
    updateExpenses,
    calculateCompanyImpact,
    generateCorrelationInsights,
    calculateQualityOfLife,
  };
};

/**
 * Datos por defecto para finanzas personales
 */
function getDefaultPersonalFinance(): PersonalFinance {
  return {
    monthlySalary: 3000, // USD
    additionalIncome: 500,
    totalIncome: 3500,
    housing: 1200,
    utilities: 200,
    food: 400,
    transportation: 150,
    healthcare: 100,
    education: 200,
    leisure: 300,
    savings: 700,
    totalExpenses: 3250,
    monthlyBalance: 250,
    savingsRate: 20,
    debtToIncome: 0.3,
    qualityOfLifeScore: 75,
    lastUpdated: new Date(),
  };
}
