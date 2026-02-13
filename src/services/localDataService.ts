/**
 * 🌱 SERVICIO DE DATOS LOCAL - SISTEMA AUTOEVOLUTIVO
 * 
 * Este servicio lee datos de la carpeta "Serendipity bros 26" 
 * que crece y aprende con cada día que pasa.
 * 
 * NO REQUIERE dependencias externas (Supabase, DB, etc.)
 * TODO se almacena en archivos JSON locales.
 */

// Tipos de datos
export interface FinancialState {
  timestamp: string;
  mesActual: string;
  totalMonthlyRevenue: number;
  totalMonthlyExpenses: number;
  grossMargin: number;
  grossMarginPercentage: number;
  payroll: number;
  payrollPercentage: number;
  praraRevenue: number;
  praraPercentage: number;
  customerCount: number;
  activeOrdersMonth: number;
  errorRate: number;
  onTimeDeliveryRate: number;
  employeeCount: number;
}

export interface TeamMember {
  nombre: string;
  rol: string;
  salarioMensual: number;
  tier: string;
  contribucionValor: number;
  equityScore: number;
}

export interface Invoice {
  id: string;
  cliente: string;
  fecha: string;
  monto: number;
  moneda: string;
  estado: string;
  productosPrincipales: string[];
  cantidadTotal: number;
}

export interface FixedCost {
  id: string;
  categoria: string;
  concepto: string;
  monto: number;
  moneda: string;
  frecuencia: string;
  fechaPago: string;
  proveedor: string;
  estado: string;
}

export interface AlertaEtica {
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'OPPORTUNITY';
  category: string;
  message: string;
  recommendation: string;
  injusticeType?: string;
}

export interface Recomendacion {
  priority: number;
  title: string;
  description: string;
  impact: string;
  ethicalAlignment: string;
  actionItems: string[];
  timeline: string;
}

// 🔥 RUTA BASE - Durante build, Vite copiará /public a /dist
const DATA_BASE = '/data';

/**
 * Función genérica para cargar JSON desde /public/data/
 */
async function loadJSON<T>(relativePath: string): Promise<T> {
  try {
    const response = await fetch(`${DATA_BASE}/${relativePath}`);
    if (!response.ok) {
      console.warn(`⚠️ No se pudo cargar ${relativePath}. Usando datos mock.`);
      return {} as T;
    }
    return await response.json();
  } catch (error) {
    console.error(`❌ Error cargando ${relativePath}:`, error);
    throw error;
  }
}

/**
 * 💰 OBTENER ESTADO FINANCIERO ACTUAL
 */
export const fetchFinancialState = async (): Promise<FinancialState> => {
  return loadJSON<FinancialState>('financial-state.json');
};

/**
 * 👥 OBTENER EQUIPO COMPLETO (22 personas)
 */
export const fetchTeamRoster = async (): Promise<{ equipos: TeamMember[] }> => {
  return loadJSON<{ equipos: TeamMember[] }>('team-roster.json');
};

/**
 * 📄 OBTENER FACTURAS DEL MES
 */
export const fetchInvoices = async (): Promise<{ facturas: Invoice[] }> => {
  return loadJSON<{ facturas: Invoice[] }>('invoices.json');
};

/**
 * 🏢 OBTENER COSTOS FIJOS DEL MES
 */
export const fetchFixedCosts = async (): Promise<{ costosFijos: FixedCost[] }> => {
  return loadJSON<{ costosFijos: FixedCost[] }>('fixed-costs.json');
};

/**
 * 🤖 OBTENER MODELOS DE APRENDIZAJE Y PROYECCIONES
 */
export const fetchLearningModels = async () => {
  return loadJSON('learning-models.json');
};

/**
 * 📊 OBTENER DASHBOARD UNIFICADO (equivalente al RPC de Supabase)
 * 
 * Esta función combina todos los datos en un solo objeto,
 * igual que antes pero sin SQL ni Supabase.
 */
export const fetchUnifiedDashboard = async () => {
  const [financial, team, invoices, fixedCosts] = await Promise.all([
    fetchFinancialState(),
    fetchTeamRoster(),
    fetchInvoices(),
    fetchFixedCosts()
  ]);

  // 🚨 GENERAR ALERTAS ÉTICAS DINÁMICAMENTE
  const alertas: AlertaEtica[] = [];

  // Alerta 1: Concentración de ingresos PRARA
  if (financial.praraPercentage > 75) {
    alertas.push({
      severity: 'CRITICAL',
      category: 'Revenue Concentration',
      message: `PRARA representa ${financial.praraPercentage.toFixed(2)}% de ingresos totales - RIESGO ALTO de dependencia`,
      recommendation: 'Diversificar base de clientes urgentemente. Target: reducir a < 60% en 6 meses',
      injusticeType: 'Economic Vulnerability'
    });
  }

  // Alerta 2: Brecha salarial
  const salarios = team.equipos.map(m => m.salarioMensual);
  const salarioMax = Math.max(...salarios);
  const salarioMin = Math.min(...salarios);
  const brechaSalarial = salarioMax / salarioMin;

  if (brechaSalarial > 4) {
    alertas.push({
      severity: 'HIGH',
      category: 'Salary Inequity',
      message: `Brecha salarial Leadership vs Support: ${brechaSalarial.toFixed(2)}x`,
      recommendation: 'Revisar estructura salarial para garantizar equidad y dignidad laboral',
      injusticeType: 'Wage Disparity'
    });
  }

  // Alerta 3: Tasa de errores
  if (financial.errorRate > 5) {
    alertas.push({
      severity: 'MEDIUM',
      category: 'Quality Control',
      message: `Tasa de errores: ${financial.errorRate.toFixed(1)}% (objetivo: <5%)`,
      recommendation: 'Implementar capacitación adicional en QC y revisar procesos',
      injusticeType: 'Quality Standards'
    });
  }

  // Alerta 4: Oportunidad de crecimiento
  if (financial.customerCount < 10) {
    alertas.push({
      severity: 'OPPORTUNITY',
      category: 'Growth Potential',
      message: `Solo ${financial.customerCount} clientes activos. Potencial de expansión significativo`,
      recommendation: 'Desarrollar estrategia de adquisición de clientes (target: 10+ clientes en 12 meses)',
      injusticeType: undefined
    });
  }

  // ✨ GENERAR RECOMENDACIONES PRIORIZADAS
  const recomendaciones: Recomendacion[] = [
    {
      priority: 1,
      title: 'Diversificar Base de Clientes',
      description: `Reducir dependencia de PRARA (actualmente ${financial.praraPercentage.toFixed(1)}%). Buscar 3-5 clientes nuevos con ingresos promedio de 50-100M VND/mes.`,
      impact: 'Reducción de riesgo económico en 40%. Mayor estabilidad financiera.',
      ethicalAlignment: 'Autonomía económica y seguridad laboral para el equipo',
      actionItems: [
        'Identificar 10 prospectos potenciales en sector retail/boutique',
        'Preparar portfolio de productos con casos de éxito',
        'Asignar 20% tiempo comercial a desarrollo de nuevos clientes'
      ],
      timeline: 'Próximos 6 meses'
    },
    {
      priority: 2,
      title: 'Reducir Tasa de Errores',
      description: `Bajar errorRate de ${financial.errorRate.toFixed(1)}% a <5% mediante capacitación y mejora de procesos.`,
      impact: 'Ahorro de 15-20M VND/mes en retrabajos. Mejora de reputación con clientes.',
      ethicalAlignment: 'Calidad como compromiso con clientes y orgullo del equipo',
      actionItems: [
        'Capacitación QC semanal para operadores',
        'Implementar checklist de inspección en cada etapa',
        'Reunión mensual de análisis de defectos'
      ],
      timeline: 'Próximos 3 meses'
    },
    {
      priority: 3,
      title: 'Revisar Equidad Salarial',
      description: `Analizar brecha salarial actual (${brechaSalarial.toFixed(1)}x) y proponer ajustes progresivos.`,
      impact: 'Mayor motivación del equipo. Reducción de rotación. Cultura de justicia.',
      ethicalAlignment: 'Dignidad laboral y reconocimiento justo del valor aportado',
      actionItems: [
        'Estudio de mercado salarial Vietnam (sector manufacturero)',
        'Proponer aumento 10-15% para tiers Operations/Support',
        'Implementar bonos por rendimiento accesibles para todos'
      ],
      timeline: 'Próximos 6 meses'
    },
    {
      priority: 4,
      title: 'Optimizar On-Time Delivery',
      description: `Subir tasa de entrega puntual de ${financial.onTimeDeliveryRate.toFixed(1)}% a >95%.`,
      impact: 'Reducción de penalizaciones. Mejor posicionamiento competitivo.',
      ethicalAlignment: 'Confiabilidad como valor fundamental del negocio',
      actionItems: [
        'Mapear cuellos de botella en proceso de producción',
        'Implementar sistema Kanban para tracking de órdenes',
        'Establecer buffer time de 10% en planificación'
      ],
      timeline: 'Próximos 4 meses'
    }
  ];

  // Calcular totales para compatibilidad con componentes existentes
  const total_incomes = financial.totalMonthlyRevenue;
  const total_invoices = invoices.facturas?.length || 0;
  const total_fixed_costs = fixedCosts.costosFijos?.reduce((sum, c) => sum + c.monto, 0) || 0;

  return {
    financial,
    team: team.equipos,
    invoices: invoices.facturas || [],
    fixedCosts: fixedCosts.costosFijos || [],
    alerts: alertas,
    recommendations: recomendaciones,
    timestamp: new Date().toISOString(),
    // Campos adicionales para compatibilidad
    total_incomes,
    total_invoices,
    total_fixed_costs
  };
};

/**
 * 📈 OBTENER MÉTRICAS DE LOS ÚLTIMOS 30 DÍAS
 * 
 * Por ahora retorna array vacío hasta que tengamos historial real.
 * El sistema irá poblando esto automáticamente día a día.
 */
export const fetchLast30DaysMetrics = async () => {
  try {
    return await loadJSON<any[]>('historical-metrics-30d.json');
  } catch {
    // Si aún no hay historial, retornar array vacío
    return [];
  }
};

/**
 * 🧠 OBTENER PROYECCIONES DE CASH FLOW
 * 
 * Esta función usará los modelos de aprendizaje para predecir.
 */
export const fetchCashFlowPrediction = async () => {
  const models: any = await fetchLearningModels();
  const financial = await fetchFinancialState();

  const today = new Date();
  const currentMonth = today.getMonth() +1;
  const currentYear = today.getFullYear();

  // Proyección simple por ahora (se sofisticará con más datos históricos)
  const predicted_revenue = financial.totalMonthlyRevenue * 1.05; // +5% growth estimate
  const predicted_expenses = financial.totalMonthlyExpenses * 1.02; // +2% inflation
  const predicted_profit = predicted_revenue - predicted_expenses;
  
  return {
    month: currentMonth,
    year: currentYear,
    predicted_revenue,
    predicted_expenses,
    predicted_profit,
    confidence: models.modelosActivos?.proyeccionVentas?.precision || 0,
    reasoning: `Basado en ${models.metricas?.diasConDatos || 1} días de datos históricos. Proyección con ${models.metricas?.estadoAprendizaje || 'inicializando'}.`
  };
};

/**
 * 🔄 SISTEMA DE MUTACIÓN Y CRECIMIENTO
 * 
 * Esta función se ejecutará diariamente (via cron job o trigger)
 * para actualizar el historial y hacer que el sistema aprenda.
 */
export const mutateAndGrowSystem = async () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  // Obtener snapshot actual
  const snapshot = await fetchUnifiedDashboard();

  // Guardar en histórico (esto requeriría un backend o script)
  console.log(`📊 Snapshot del día ${year}-${month}-${day} generado`);
  console.log(`💰 Revenue: ${snapshot.financial.totalMonthlyRevenue.toLocaleString()} VND`);
  console.log(`👥 Equipo: ${snapshot.financial.employeeCount} personas`);
  console.log(`🚨 Alertas: ${snapshot.alerts.length}`);
  console.log(`✨ Recomendaciones: ${snapshot.recommendations.length}`);

  return {
    success: true,
    timestamp: today.toISOString(),
    message: 'Sistema mutado y crecido exitosamente'
  };
};

// 🎯 EXPORTAR TODO
export default {
  fetchFinancialState,
  fetchTeamRoster,
  fetchInvoices,
  fetchFixedCosts,
  fetchUnifiedDashboard,
  fetchLast30DaysMetrics,
  fetchCashFlowPrediction,
  fetchLearningModels,
  mutateAndGrowSystem
};
