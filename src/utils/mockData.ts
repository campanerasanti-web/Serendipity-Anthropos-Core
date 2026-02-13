// Mock data para desarrollo y pruebas
export const mockDashboardData = {
  stats: {
    total_incomes: 12000,
    total_invoices: 45,
    total_fixed_costs: 3500,
    monthly_average: 4000,
  },

  metrics: Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return {
      date: date.toISOString().split('T')[0],
      daily_revenue: 300 + Math.random() * 400,
      daily_expenses: 100 + Math.random() * 150,
      daily_profit: 150 + Math.random() * 300,
      narrative: `Día ${i + 1}: ${['Día productivo', 'Transacciones normales', 'Buen flujo de caja', 'Operación estable'][Math.floor(Math.random() * 4)]}`,
      emoji: ['💰', '📊', '📈', '✨'][Math.floor(Math.random() * 4)],
      confidence_score: 0.75 + Math.random() * 0.24,
    };
  }),

  prediction: {
    month: 3,
    year: 2026,
    predicted_revenue: 14000,
    predicted_expenses: 3500,
    predicted_profit: 10500,
    confidence: 0.82,
  },

  insight: {
    narrative:
      'Tu negocio muestra una tendencia positiva en los últimos días. La estabilidad en costos y el crecimiento gradual de ingresos sugieren que estás en el camino correcto hacia una operación más sostenible.',
    emoji: '💭',
    confidence_score: 0.88,
  },

  recommendations: [
    {
      title: '📈 Tendencia positiva detectada',
      message: 'Tu promedio de ganancia diaria es de $250. Estás mejorando semana a semana. Mantén este ritmo.',
      type: 'success',
    },
    {
      title: '💡 Oportunidad: Optimizar Marketing',
      message: 'Tienes 12 meses de runway. Es buen momento para invertir en growth con confianza.',
      type: 'info',
    },
    {
      title: '⚠️ Revisar concentración de gastos',
      message: 'El 60% de tus gastos son en una sola categoría. Evalúa si es sostenible a largo plazo.',
      type: 'warning',
    },
  ],

  alerts: [
    {
      title: '✅ Posición sólida',
      message: 'Tienes 3.4 meses de runway con costos actuales. Situación dentro de parámetros normales.',
      severity: 'success',
    },
    {
      title: '🟢 Balance positivo',
      message: 'Ingresos superan gastos. Tu balance actual es de $8,500.',
      severity: 'info',
    },
  ],

  invoices: [
    {
      id: 1,
      number: 'INV-001',
      amount: 1500,
      description: 'Servicios profesionales',
      date: '2026-02-10',
    },
    {
      id: 2,
      number: 'INV-002',
      amount: 2000,
      description: 'Consultoría técnica',
      date: '2026-02-11',
    },
    {
      id: 3,
      number: 'INV-003',
      amount: 800,
      description: 'Desarrollo web',
      date: '2026-02-12',
    },
  ],

  fixedCosts: [
    {
      id: 1,
      month: 2,
      year: 2026,
      payroll: 1500,
      rent: 1000,
      energy: 300,
      other: 200,
    },
    {
      id: 2,
      month: 1,
      year: 2026,
      payroll: 1500,
      rent: 1000,
      energy: 280,
      other: 250,
    },
  ],
};

// Funciones helper para simular que son queries reales
export const mockQueryFunctions = {
  fetchUnifiedDashboard: async (month: number, year: number) => {
    await new Promise((r) => setTimeout(r, 500));
    return mockDashboardData.stats;
  },

  fetchLast30DaysMetrics: async () => {
    await new Promise((r) => setTimeout(r, 400));
    return mockDashboardData.metrics;
  },

  fetchCashFlowPrediction: async (month: number, year: number) => {
    await new Promise((r) => setTimeout(r, 300));
    return mockDashboardData.prediction;
  },

  fetchTodaysInsight: async () => {
    await new Promise((r) => setTimeout(r, 300));
    return mockDashboardData.insight;
  },

  fetchInvoices: async () => {
    await new Promise((r) => setTimeout(r, 300));
    return mockDashboardData.invoices;
  },

  fetchFixedCosts: async () => {
    await new Promise((r) => setTimeout(r, 300));
    return mockDashboardData.fixedCosts;
  },
};

export default mockDashboardData;
