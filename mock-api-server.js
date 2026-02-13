// Mock API Server - El Mediador de Sofia
// Sirve datos reales para que el dashboard tenga vida inmediatamente

import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Financial Data
const financialData = {
  monthlyRevenue: 1363.75,
  monthlyExpenses: 290.75,
  profitMargin: 78,
  monthlyPayroll: 160.4,
  praraRevenuePercentage: 82,
  totalCustomers: 5,
  qualityErrorRate: 20,
  onTimeDeliveryRate: 95
};

// Team Data (21 employees)
const teamData = [
  { name: "NGUYỄN QUỐC VŨ", role: "Director", salary: 20.0, tier: "Leadership", valueContribution: 20, equityScore: 95 },
  { name: "TRẦN THỊ THANH", role: "Production Manager", salary: 12.0, tier: "Management", valueContribution: 18, equityScore: 90 },
  { name: "LÊ VĂN HẢI", role: "Quality Control", salary: 10.0, tier: "Management", valueContribution: 17, equityScore: 88 },
  { name: "PHẠM THỊ LAN", role: "Admin", salary: 9.0, tier: "Admin", valueContribution: 12, equityScore: 75 },
  { name: "NGUYỄN THỊ HỒNG", role: "Admin", salary: 9.0, tier: "Admin", valueContribution: 12, equityScore: 75 },
  { name: "TRẦN VĂN MINH", role: "Worker", salary: 5.5, tier: "Worker", valueContribution: 8, equityScore: 60 },
  { name: "LÊ THỊ HOA", role: "Worker", salary: 5.5, tier: "Worker", valueContribution: 8, equityScore: 60 },
  { name: "PHẠM VĂN LONG", role: "Worker", salary: 5.2, tier: "Worker", valueContribution: 8, equityScore: 58 },
  { name: "NGUYỄN VĂN KHOA", role: "Worker", salary: 5.2, tier: "Worker", valueContribution: 8, equityScore: 58 },
  { name: "TRẦN THỊ MAI", role: "Worker", salary: 5.0, tier: "Worker", valueContribution: 7, equityScore: 55 },
  { name: "LÊ VĂN TUẤN", role: "Worker", salary: 5.0, tier: "Worker", valueContribution: 7, equityScore: 55 },
  { name: "PHẠM THỊ LINH", role: "Worker", salary: 5.0, tier: "Worker", valueContribution: 7, equityScore: 55 },
  { name: "NGUYỄN THỊ HƯƠNG", role: "Worker", salary: 4.96, tier: "Worker", valueContribution: 7, equityScore: 54 },
  { name: "TRẦN VĂN CƯỜNG", role: "Worker", salary: 4.96, tier: "Worker", valueContribution: 7, equityScore: 54 },
  { name: "LÊ THỊ NGA", role: "Worker", salary: 4.96, tier: "Worker", valueContribution: 7, equityScore: 54 },
  { name: "PHẠM VĂN DŨNG", role: "Worker", salary: 4.96, tier: "Worker", valueContribution: 7, equityScore: 54 },
  { name: "NGUYỄN VĂN THẮNG", role: "Worker", salary: 4.96, tier: "Worker", valueContribution: 7, equityScore: 54 },
  { name: "TRẦN THỊ PHƯƠNG", role: "Worker", salary: 4.96, tier: "Worker", valueContribution: 7, equityScore: 54 },
  { name: "LÊ VĂN HÙNG", role: "Worker", salary: 4.96, tier: "Worker", valueContribution: 7, equityScore: 54 },
  { name: "PHẠM THỊ THẢO", role: "Worker", salary: 4.96, tier: "Worker", valueContribution: 7, equityScore: 54 },
  { name: "NGUYỄN VĂN ANH", role: "Worker", salary: 4.96, tier: "Worker", valueContribution: 7, equityScore: 54 }
];

// Alerts Data
const alertsData = [
  {
    severity: "CRITICAL",
    category: "Revenue Risk",
    message: "PRARA represents 82% of total revenue (1,163M of 1,363M VND)",
    recommendation: "Diversify customer base to reduce to 50% within 18 months",
    injusticeType: "Centralization Risk"
  },
  {
    severity: "CRITICAL",
    category: "Quality Crisis",
    message: "20% error rate due to centralized decision-making",
    recommendation: "Delegate authority to Thanh and Hai by March 13",
    injusticeType: "Lack of Team Ownership"
  },
  {
    severity: "HIGH",
    category: "Salary Inequity",
    message: "1.8x pay gap: Admin 9M vs Worker avg 5M",
    recommendation: "Raise all workers +1M VND/month (cost: 14M = 1% revenue)",
    injusticeType: "Economic Inequity"
  },
  {
    severity: "HIGH",
    category: "Centralization",
    message: "Santi makes 100% of decisions from Vietnam",
    recommendation: "Delegate March 13: Thanh (Production) + Hai (Quality)",
    injusticeType: "Power-Authority Mismatch"
  },
  {
    severity: "OPPORTUNITY",
    category: "Growth",
    message: "Customer diversification potential: 27 customers, PRARA 82%",
    recommendation: "Acquire 5 new customers/month, target 50% PRARA in 18 months",
    injusticeType: null
  }
];

// Recommendations Data
const recommendationsData = [
  {
    priority: 1,
    title: "Delegación Definitiva",
    timeline: "URGENT - Week 1",
    description: "Delegate authority to Thanh (Production) and Hai (Quality) by March 13, 2026",
    impact: "40% faster decisions, 30% higher morale",
    ethicalAlignment: "Shared leadership, distributed accountability",
    actions: [
      "Announce publicly on March 13",
      "Define decision framework",
      "Weekly syncs (not decision gates)",
      "Empower to say YES without Santi"
    ]
  },
  {
    priority: 2,
    title: "Salary Adjustment - Worker Equity",
    timeline: "HIGH - Weeks 2-4",
    description: "Raise all workers +1M VND/month to address 1.8x pay gap",
    impact: "50% lower turnover, 25% higher productivity",
    ethicalAlignment: "Economic justice, retention, dignity",
    actions: [
      "Show financial margin (78% is healthy)",
      "Explain equity principle",
      "Implement via HR system",
      "Announce in all-hands meeting"
    ]
  },
  {
    priority: 3,
    title: "Customer Diversification Strategy",
    timeline: "MEDIUM - Months 1-3",
    description: "Reduce PRARA from 82% to 50% revenue share within 18 months",
    impact: "Business survives PRARA departure, 2x revenue potential",
    ethicalAlignment: "Business resilience, sustainable growth",
    actions: [
      "Identify 50 target customers",
      "Develop elevator pitch",
      "Outreach: 5 new customers/month",
      "Excellent service for referrals"
    ]
  },
  {
    priority: 4,
    title: "Zero-Error Quality Culture",
    timeline: "STRATEGIC - Continuous",
    description: "Shift from 20% error rate to 2% through team ownership",
    impact: "20% → 2% errors in 6 months, 50M/month savings",
    ethicalAlignment: "Ownership, dignity, continuous improvement",
    actions: [
      "Team bonus on zero defects",
      "Daily 15min quality huddle",
      "Root cause analysis",
      "Team decides fixes (not Santi)"
    ]
  }
];

// API Endpoints
app.get('/api/serendipity/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.get('/api/serendipity/financial', (req, res) => {
  res.json(financialData);
});

app.get('/api/serendipity/team', (req, res) => {
  res.json(teamData);
});

app.get('/api/serendipity/alerts', (req, res) => {
  res.json(alertsData);
});

app.get('/api/serendipity/recommendations', (req, res) => {
  res.json(recommendationsData);
});

app.get('/api/serendipity/dashboard', (req, res) => {
  res.json({
    financial: financialData,
    team: teamData,
    alerts: alertsData,
    recommendations: recommendationsData
  });
});

// ═══════════════════════════════════════════════════════════════
// DAILY METRICS EDGE FUNCTION (Simulado)
// Genera métricas diarias con narrativa estacional
// ═══════════════════════════════════════════════════════════════
app.get('/api/serendipity/daily-metrics', (req, res) => {
  const today = new Date();
  const dailyMetrics = [];
  
  // Generar últimos 31 días de métricas
  for (let i = 30; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Simular variación diaria (70-130% del promedio)
    const baseRevenue = financialData.monthlyRevenue / 31;
    const variation = 0.7 + Math.random() * 0.6; // 0.7 a 1.3
    const dailyRevenue = baseRevenue * variation;
    
    const baseExpenses = financialData.monthlyExpenses / 31;
    const dailyExpenses = baseExpenses * (0.9 + Math.random() * 0.2); // 0.9 a 1.1
    
    dailyMetrics.push({
      date: date.toISOString().split('T')[0],
      revenue: parseFloat(dailyRevenue.toFixed(2)),
      expenses: parseFloat(dailyExpenses.toFixed(2)),
      profit: parseFloat((dailyRevenue - dailyExpenses).toFixed(2)),
      transactions: Math.floor(5 + Math.random() * 10), // 5-15 transacciones
    });
  }
  
  // Calcular métricas agregadas
  const totalRevenue = dailyMetrics.reduce((sum, day) => sum + day.revenue, 0);
  const totalExpenses = dailyMetrics.reduce((sum, day) => sum + day.expenses, 0);
  const totalProfit = totalRevenue - totalExpenses;
  const profitMargin = ((totalProfit / totalRevenue) * 100).toFixed(1);
  
  // Calcular tendencia (últimos 7 vs anteriores 7)
  const last7 = dailyMetrics.slice(-7);
  const prev7 = dailyMetrics.slice(-14, -7);
  const avgLast7 = last7.reduce((sum, d) => sum + d.revenue, 0) / 7;
  const avgPrev7 = prev7.reduce((sum, d) => sum + d.revenue, 0) / 7;
  const trend = avgLast7 > avgPrev7 * 1.1 ? 'subiendo' : avgLast7 < avgPrev7 * 0.9 ? 'bajando' : 'estable';
  
  // Determinar liquidez
  const currentBalance = totalProfit * 3; // Simulado: 3x el profit mensual
  const balanceRatio = currentBalance / (financialData.monthlyPayroll + financialData.monthlyExpenses);
  let liquidityLevel = 'alta';
  if (balanceRatio < 3) liquidityLevel = 'media';
  if (balanceRatio < 1.5) liquidityLevel = 'baja';
  if (balanceRatio < 0.5) liquidityLevel = 'critica';
  
  // Mensaje del Día con narrativa estacional
  let messageOfTheDay = '';
  let season = 'cosecha';
  
  if (liquidityLevel === 'alta' && trend === 'subiendo') {
    season = 'cosecha';
    messageOfTheDay = '🌊 Época de cosecha. Los ríos de abundancia fluyen con fuerza. Los graneros se llenan y el sistema respira tranquilo.';
  } else if (liquidityLevel === 'alta' && trend === 'estable') {
    season = 'cosecha';
    messageOfTheDay = '☀️ Época de cosecha. Días de sol sobre campos fértiles. El balance es estable y el futuro es claro.';
  } else if (liquidityLevel === 'media' && trend === 'subiendo') {
    season = 'siembra';
    messageOfTheDay = '⛅ Época de siembra. Las nubes prometen lluvia y el terreno está preparado. Es tiempo de crecer.';
  } else if (liquidityLevel === 'media' && trend === 'estable') {
    season = 'siembra';
    messageOfTheDay = '☁️ Época de siembra. Preparación bajo cielos nublados. Aún hay tiempo para sembrar las semillas del futuro.';
  } else if (liquidityLevel === 'baja' || trend === 'bajando') {
    season = 'sequia';
    messageOfTheDay = '🌵 Tierra seca. Los pozos bajan y las raíces buscan agua. El terreno pide atención urgente.';
  } else if (liquidityLevel === 'critica') {
    season = 'tormenta';
    messageOfTheDay = '⚡ Tormenta inminente. El sistema exige acción inmediata. Es hora de tomar decisiones críticas.';
  }
  
  res.json({
    success: true,
    data: {
      dailyMetrics,
      summary: {
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
        totalExpenses: parseFloat(totalExpenses.toFixed(2)),
        totalProfit: parseFloat(totalProfit.toFixed(2)),
        profitMargin: parseFloat(profitMargin),
        trend,
        liquidityLevel,
        season,
        messageOfTheDay,
      },
      metadata: {
        period: '31 days',
        lastUpdated: new Date().toISOString(),
        dataSource: 'Mock API - Simulación Bio-Digital',
      }
    }
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log('');
  console.log('========================================');
  console.log('  MOCK API SERVER - VIVO Y OPERATIVO');
  console.log('========================================');
  console.log('');
  console.log(`  Backend Mock API: http://localhost:${PORT}`);
  console.log('');
  console.log('  Endpoints disponibles:');
  console.log('    GET /api/serendipity/health');
  console.log('    GET /api/serendipity/financial');
  console.log('    GET /api/serendipity/team');
  console.log('    GET /api/serendipity/alerts');
  console.log('    GET /api/serendipity/recommendations');
  console.log('    GET /api/serendipity/dashboard');
  console.log('    GET /api/serendipity/daily-metrics  ← 🌟 NUEVO: Edge Function');
  console.log('');
  console.log('  🕯️ El dashboard ahora tiene VIDA...');
  console.log('  💓 Sistema Bio-Digital activado');
  console.log('  🌊 Matriz de Ritmos operativa');
  console.log('  ⚡ Modo Emergencia preparado');
  console.log('  🌤️ Oráculo Meteorológico sincronizado');
  console.log('');
});
