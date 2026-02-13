/**
 * EXPRESS BACKEND API - ANTHROPOS SYSTEM
 * 
 * Integration points:
 * - Financial data queries (invoices, fixed costs)
 * - Manual data input processing + file upload
 * - Super Agent checkup execution (all agents in parallel)
 * - Anthropos state reporting
 * 
 * Environment Variables Required:
 * - PORT: Server port (default: 5000)
 * - SUPABASE_URL: Supabase instance URL
 * - SUPABASE_KEY: Supabase service key
 * - DATABASE_URL: PostgreSQL connection string (if not using Supabase)
 */

import express, { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { SophiaWisdomProvider, SophiaEngine } from './services/SophiaWisdomProvider';
import HermeticBodyController from './Controllers/HermeticBodyController';
import type { PillarName } from '../src/types/sophia';

// ============================================================
// SETUP
// ============================================================

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================================
// AUTONOMIC CORS MIDDLEWARE
// ============================================================
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', 'false');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

// Express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// File upload configuration
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({ storage });

// ============================================================
// TYPE DEFINITIONS
// ============================================================

interface Stats {
  financial: {
    totalMonthlyRevenue: number;
    totalMonthlyExpenses: number;
    grossMarginPercentage: number;
  };
  health: number;
  alerts: Array<{
    severity: 'CRITICAL' | 'WARNING' | 'INFO';
    message: string;
  }>;
}

interface Metric {
  date: string;
  average_daily_revenue: number;
  max_daily_revenue: number;
  min_daily_revenue: number;
  variance_percentage: number;
}

interface Prediction {
  projected_revenue_30d: number;
  confidence_level: number;
}

interface TodaysInsight {
  narrative: string;
  confidence_score: number;
}

interface PeriodAnalytics {
  period: string;
  revenue: number;
  expenses: number;
  margin: number;
  alerts_count: number;
}

interface AnthroposReport {
  system_mood: 'fertile' | 'stressed' | 'fragmented' | 'flowing';
  heart_coherence: number;
  emotional_load: number;
  operational_load: number;
  drought_points: string[];
  sophia_insights: Array<{ category: string; insight: string }>;
  security_risks: Array<{ risk: string; severity: 'low' | 'medium' | 'high' | 'critical' }>;
  full_cycle: {
    timestamp: string;
    status: 'complete' | 'pending' | 'running';
    duration_ms: number;
  };
  last_sync_time: string;
}

// ============================================================
// MOCK DATA SERVICE
// ============================================================

const mockDataService = {
  // Financial data
  getUnifiedDashboard: (): Stats => ({
    financial: {
      totalMonthlyRevenue: 500_000_000, // 500M VND
      totalMonthlyExpenses: 200_000_000, // 200M VND
      grossMarginPercentage: 60
    },
    health: 85,
    alerts: [
      { severity: 'WARNING', message: 'Flujo de caja proyectado para próximo mes: ₫150M' }
    ]
  }),

  getLast30DaysMetrics: (): Metric[] => [
    {
      date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      average_daily_revenue: 15_000_000,
      max_daily_revenue: 25_000_000,
      min_daily_revenue: 8_000_000,
      variance_percentage: 35
    },
    {
      date: new Date().toISOString().split('T')[0],
      average_daily_revenue: 16_666_667,
      max_daily_revenue: 28_000_000,
      min_daily_revenue: 10_000_000,
      variance_percentage: 38
    }
  ],

  getCashFlowPrediction: (): Prediction => ({
    projected_revenue_30d: 500_000_000,
    confidence_level: 0.92
  }),

  getTodaysInsight: (): TodaysInsight => ({
    narrative: 'Sistema operando en nivel óptimo. Cash flow positive. Recomendación: mantener velocidad de operación.',
    confidence_score: 0.88
  }),

  getPeriodAnalytics: (): PeriodAnalytics => ({
    period: 'febrero-2026',
    revenue: 500_000_000,
    expenses: 200_000_000,
    margin: 60,
    alerts_count: 1
  }),

  // Anthropos data
  getLastAnthroposReport: (): AnthroposReport => ({
    system_mood: 'flowing',
    heart_coherence: 87,
    emotional_load: 45,
    operational_load: 62,
    drought_points: [
      'Dependencia en proveedor A: 40% de inputs',
      'Variabilidad en entregas: ±15%'
    ],
    sophia_insights: [
      {
        category: 'financial',
        insight: 'Margen bruto mejorando 2% mes a mes'
      },
      {
        category: 'operational',
        insight: 'Ciclo de producción estable a 28 días promedio'
      },
      {
        category: 'security',
        insight: 'Riesgo de dependencia en software legacy: MEDIUM'
      }
    ],
    security_risks: [
      {
        risk: 'Backup de datos sin automatizar',
        severity: 'high'
      },
      {
        risk: 'Acceso de empleados sin control de versiones',
        severity: 'medium'
      }
    ],
    full_cycle: {
      timestamp: new Date().toISOString(),
      status: 'complete',
      duration_ms: 1247
    },
    last_sync_time: new Date().toISOString()
  }),

  // Save manual input
  saveManualInput: (data: any, filePath?: string) => ({
    id: `MI-${Date.now()}`,
    created_at: new Date().toISOString(),
    income: data.income,
    costs: data.costs,
    description: data.description,
    attachment_path: filePath,
    processed: true
  })
};

// ============================================================
// API ENDPOINTS
// ============================================================

// 1. GET /api/unified-dashboard
app.get('/api/unified-dashboard', (req: Request, res: Response) => {
  try {
    const stats = mockDataService.getUnifiedDashboard();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch unified dashboard' });
  }
});

// 2. GET /api/last-30-days-metrics
app.get('/api/last-30-days-metrics', (req: Request, res: Response) => {
  try {
    const metrics = mockDataService.getLast30DaysMetrics();
    res.json(metrics);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
});

// 3. GET /api/cashflow-prediction
app.get('/api/cashflow-prediction', (req: Request, res: Response) => {
  try {
    const prediction = mockDataService.getCashFlowPrediction();
    res.json(prediction);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch prediction' });
  }
});

// 4. GET /api/todays-insight
app.get('/api/todays-insight', (req: Request, res: Response) => {
  try {
    const insight = mockDataService.getTodaysInsight();
    res.json(insight);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch today\'s insight' });
  }
});

// 5. GET /api/period-analytics
app.get('/api/period-analytics', (req: Request, res: Response) => {
  try {
    // TODO: Filter by query params ?startDate=&endDate=
    const analytics = mockDataService.getPeriodAnalytics();
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch period analytics' });
  }
});

// 6. GET /api/anthropos/last-report
app.get('/api/anthropos/last-report', (req: Request, res: Response) => {
  try {
    const report = mockDataService.getLastAnthroposReport();
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Anthropos report' });
  }
});

// 7. POST /api/manual-input (with file upload)
app.post('/api/manual-input', upload.single('attachment'), async (req: Request, res: Response) => {
  try {
    const { income, costs, description } = req.body;
    const filePath = req.file?.path;

    // Validate input
    if (!income || !costs) {
      return res.status(400).json({ error: 'Income and costs are required' });
    }

    // TODO: INTEGRATION POINTS
    // 1. Update database with manual data
    // 2. Call OpsGardenerAgent.AnalyzeManualInput(income, costs)
    // 3. Store file in cloud storage (S3, Azure Blob, etc)
    // 4. Notify AnthroposCore of new data

    const result = mockDataService.saveManualInput(
      { income, costs, description },
      filePath
    );

    res.json({
      success: true,
      data: result,
      message: 'Manual data processed successfully'
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to process manual input',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// 8. POST /api/anthropos/run (Super Agent Checkup)
app.post('/api/anthropos/run', async (req: Request, res: Response) => {
  try {
    // TODO: INTEGRATION POINTS
    // 1. Call OpsGardenerAgent.RunCheckupAsync() in parallel
    // 2. Call SecurityGardenerAgent.RunCheckupAsync() in parallel
    // 3. Call SelfGardener.EvaluateHeartAsync() in parallel
    // 4. Call SophiaEngine.GenerateInsightsAsync() in parallel
    // 5. Aggregate results into single report
    // 6. Store in database
    // 7. Update last_sync_time
    // Example:
    // const results = await Promise.all([
    //   opsGardener.CheckupAsync(),
    //   securityGardener.CheckupAsync(),
    //   selfGardener.CheckupAsync(),
    //   sophiaEngine.InsightsAsync()
    // ]);

    const report = mockDataService.getLastAnthroposReport();

    res.json({
      success: true,
      checkup_id: `CHK-${Date.now()}`,
      report,
      duration_ms: report.full_cycle.duration_ms,
      message: 'Full checkup completed'
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to run full checkup',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ============================================================
// SOPHIA WISDOM ENDPOINTS - LA BRÚJULA MORAL
// ============================================================

/**
 * GET /api/sophia/wisdom/all
 * Obtener todos los fragmentos de sabiduría de /sofia
 * Devuelve: { total_documents, pillars_covered, documents_by_pillar, chunks }
 */
app.get('/api/sophia/wisdom/all', (req: Request, res: Response) => {
  try {
    const all = SophiaWisdomProvider.loadAll();
    const stats = SophiaWisdomProvider.getStatistics();
    
    res.json({
      statistics: stats,
      chunks: all.map(c => ({
        source: c.source,
        pillar: c.pillar,
        excerpt: c.excerpt,
        keywords: c.keywords
      }))
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to load wisdom',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/sophia/insight
 * Generar un insight contextual basado en sabiduría
 * Query params:
 *   - type: PillarName (ej: 'estrés', 'flujo', etc)
 *   - signal: string (descripción del problema)
 *   - severity: 'low' | 'medium' | 'high' | 'critical'
 * 
 * Devuelve: SophiaInsight con mensaje de /sofia
 */
app.get('/api/sophia/insight', (req: Request, res: Response) => {
  try {
    const type = (req.query.type as string) || 'presencia';
    const signal = (req.query.signal as string) || 'flujo desajustado';
    const severity = (req.query.severity as any) || 'medium';

    const insight = SophiaEngine.generateInsight({
      type: type as PillarName,
      signal,
      severity
    });

    res.json(insight);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to generate insight',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/sophia/search
 * Búsqueda semántica en /sofia
 * Query params:
 *   - q: string (término de búsqueda)
 *   - limit: number (máximo de resultados, default 3)
 */
app.get('/api/sophia/search', (req: Request, res: Response) => {
  try {
    const query = (req.query.q as string) || '';
    const limit = parseInt(req.query.limit as string) || 3;

    const results = SophiaWisdomProvider.semanticSearch(query, limit);

    res.json({
      query,
      count: results.length,
      results: results.map(c => ({
        source: c.source,
        pillar: c.pillar,
        excerpt: c.excerpt,
        keywords: c.keywords
      }))
    });
  } catch (error) {
    res.status(500).json({
      error: 'Search failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/sophia/pillar/:pillarName
 * Obtener toda la sabiduría asociada a un pilar específico
 */
app.get('/api/sophia/pillar/:pillarName', (req: Request, res: Response) => {
  try {
    const pillar = req.params.pillarName as PillarName;
    const results = SophiaWisdomProvider.searchByPillar(pillar);

    res.json({
      pillar,
      count: results.length,
      documents: results.map(c => ({
        source: c.source,
        excerpt: c.excerpt,
        keywords: c.keywords
      }))
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch pillar wisdom',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/sophia/learning
 * Guardar una reflexión diaria que se agregará a /sofia/aprendizaje_diario.md
 * Body:
 *   - reflection: string (reflexión)
 *   - pillar: PillarName (pilar asociado)
 *   - source?: string (qué agente aprendió esto)
 */
app.post('/api/sophia/learning', (req: Request, res: Response) => {
  try {
    const { reflection, pillar, source } = req.body as {
      reflection: string;
      pillar: PillarName;
      source?: string;
    };

    if (!reflection || !pillar) {
      return res.status(400).json({
        error: 'Missing required fields: reflection, pillar'
      });
    }

    SophiaWisdomProvider.appendDailyLearning(reflection, pillar, source);

    res.json({
      success: true,
      message: 'Learning recorded in /sofia/aprendizaje_diario.md',
      pillar,
      source: source || 'anonymous',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to record learning',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/sophia/intention-vector
 * Convertir una pregunta en un vector de intención
 * Query params:
 *   - q: string (pregunta/contexto)
 */
app.get('/api/sophia/intention-vector', (req: Request, res: Response) => {
  try {
    const query = (req.query.q as string) || '';

    if (!query) {
      return res.status(400).json({
        error: 'Query parameter q is required'
      });
    }

    const vector = SophiaEngine.createIntentionVector(query);

    res.json(vector);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to create intention vector',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/sophia/statistics
 * Obtener estadísticas sobre la carpeta /sofia
 */
app.get('/api/sophia/statistics', (req: Request, res: Response) => {
  try {
    const stats = SophiaWisdomProvider.getStatistics();
    res.json(stats);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch statistics',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ============================================================
// ADDITIONAL HELPER ENDPOINTS
// ============================================================

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API info
app.get('/api/info', (req: Request, res: Response) => {
  res.json({
    name: 'Anthropos System API',
    version: '1.0.0',
    endpoints: [
      'GET /api/unified-dashboard',
      'GET /api/last-30-days-metrics',
      'GET /api/cashflow-prediction',
      'GET /api/todays-insight',
      'GET /api/period-analytics',
      'GET /api/anthropos/last-report',
      'POST /api/manual-input',
      'POST /api/anthropos/run'
    ]
  });
});

// Error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// ============================================================
// HERMETIC BODY SYSTEM ROUTES
// ============================================================
// DASHBOARD & PRODUCTION ENDPOINTS (STUBS)
// ============================================================

// Dashboard endpoints
app.get('/api/dashboard/daily', (req: Request, res: Response) => {
  res.json({
    date: new Date().toISOString().split('T')[0],
    ingresos: Math.random() * 5000,
    gastos: Math.random() * 2000,
    balance: Math.random() * 3000,
    ordenes: Math.floor(Math.random() * 10)
  });
});

app.get('/api/dashboard/projection', (req: Request, res: Response) => {
  const month = parseInt(req.query.month as string) || new Date().getMonth() + 1;
  const year = parseInt(req.query.year as string) || new Date().getFullYear();
  
  res.json({
    month,
    year,
    proyectado: Math.random() * 50000,
    estimado: Math.random() * 45000,
    confianza: 0.75
  });
});

app.get('/api/dashboard/trends', (req: Request, res: Response) => {
  res.json({
    trend7days: Array(7).fill(0).map(() => Math.random() * 5000),
    avgDailyRevenue: 3500,
    growth: Math.random() * 20 - 10
  });
});

// Production endpoints
app.get('/api/production/wip', (req: Request, res: Response) => {
  res.json({
    total: Math.floor(Math.random() * 20),
    pending: Math.floor(Math.random() * 15),
    inProgress: Math.floor(Math.random() * 8),
    lots: Array(5).fill(0).map((_, i) => ({
      id: `LOT-${1000 + i}`,
      status: ['pending', 'in_progress', 'completed'][Math.floor(Math.random() * 3)],
      items: Math.floor(Math.random() * 100)
    }))
  });
});

app.post('/api/production/create', (req: Request, res: Response) => {
  res.json({
    success: true,
    lotId: `LOT-${Date.now()}`,
    message: 'Production order created'
  });
});

app.post('/api/production/close/:lotId', (req: Request, res: Response) => {
  const lotId = req.params.lotId;
  res.json({
    success: true,
    lotId,
    message: 'Production order closed'
  });
});

// ============================================================
// HERMETIC BODY ROUTES
// ============================================================

/**
 * 🫀 HEALTH ENDPOINT - Sistema Nervioso Autónomo
 * This is the heartbeat endpoint that the frontend checks every 5 seconds
 */
app.get('/api/hermetic/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    responseTime: Date.now() % 50 + 100, // Simulated response time 100-150ms
    systems: {
      database: 'operational',
      cache: 'operational',
      storage: 'operational'
    }
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// ============================================================
// START SERVER
// ============================================================

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════╗
║        ANTHROPOS API SERVER RUNNING                    ║
╚════════════════════════════════════════════════════════╝
  
  Server: http://localhost:${PORT}
  Endpoints: http://localhost:${PORT}/api/info
  Health: http://localhost:${PORT}/health

  INTEGRATION POINTS (Add your agents here):
  ✓ POST /api/manual-input → Call OpsGardenerAgent
  ✓ POST /api/anthropos/run → Call all agents in parallel
  ✓ GET /api/anthropos/last-report → AnthroposCore results

  Environment Variables:
  - PORT: ${PORT}
  - SUPABASE_URL: ${process.env.SUPABASE_URL || 'Not set'}
  - DATABASE_URL: ${process.env.DATABASE_URL ? '✓' : '✗ Not set'}
  
`);
});

export default app;
