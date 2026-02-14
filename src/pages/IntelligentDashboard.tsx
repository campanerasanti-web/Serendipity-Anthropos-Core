import React, { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchUnifiedDashboard,
  fetchLast30DaysMetrics,
  fetchCashFlowPrediction,
  fetchTodaysInsight,
  fetchPeriodAnalytics,
} from '../services/queries';
import {
  Activity,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  Zap,
  Target,
  Brain,
  Heart,
  Moon,
  SunMedium,
  Loader2,
  Upload,
  CheckCircle2,
  PlayCircle,
  AlertTriangle,
  CheckCircle,
  Info,
} from 'lucide-react';
import type {
  DashboardStats,
  MetricDay,
  DailyInsight,
  PeriodAnalytics,
  RecommendationItem,
  AlertItem,
  FinancialAgentAnalysis,
} from '../types/dashboard';
import type { Stats, Metric, Prediction } from '../types';
import { SophiaMessageCard, SophiaStats } from '../components/SophiaMessageCard';
import { PillarConstellation } from '../components/PillarConstellation';

// ===============================
// COMPONENTES BÁSICOS
// ===============================

interface CardProps {
  icon?: React.ComponentType<any>;
  title: string;
  children: React.ReactNode;
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'cyan' | 'indigo' | 'rose' | 'amber';
  className?: string;
}

const colorClasses: Record<string, { icon: string; bg: string; border: string }> = {
  blue: { icon: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950', border: 'dark:border-blue-700' },
  green: { icon: 'text-green-500', bg: 'bg-green-50 dark:bg-green-950', border: 'dark:border-green-700' },
  red: { icon: 'text-red-500', bg: 'bg-red-50 dark:bg-red-950', border: 'dark:border-red-700' },
  yellow: { icon: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-950', border: 'dark:border-yellow-700' },
  purple: { icon: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-950', border: 'dark:border-purple-700' },
  cyan: { icon: 'text-cyan-500', bg: 'bg-cyan-50 dark:bg-cyan-950', border: 'dark:border-cyan-700' },
  indigo: { icon: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-950', border: 'dark:border-indigo-700' },
  rose: { icon: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-950', border: 'dark:border-rose-700' },
  amber: { icon: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950', border: 'dark:border-amber-700' },
};

const Card: React.FC<CardProps> = ({ icon: Icon, title, children, color = 'blue', className = '' }) => {
  const classes = colorClasses[color];
  return (
    <div
      className={`p-4 rounded-xl border shadow-sm bg-white dark:bg-slate-900 dark:border-slate-700 ${classes.border} ${className}`}
    >
      <div className="flex items-center gap-2 mb-2">
        {Icon && <Icon className={classes.icon} size={20} />}
        <h3 className="font-semibold text-gray-800 dark:text-gray-100">{title}</h3>
      </div>
      <div className="text-gray-600 dark:text-gray-300 text-sm">{children}</div>
    </div>
  );
};

interface SectionTitleProps {
  icon: React.ComponentType<any>;
  title: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-2 mb-4">
    <Icon size={18} className="text-slate-500 dark:text-slate-300" />
    <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{title}</h2>
  </div>
);

interface RecommendationProps extends RecommendationItem {}

const colorToRecommendationType: Record<string, 'success' | 'warning' | 'critical' | 'info'> = {
  green: 'success',
  yellow: 'warning',
  red: 'critical',
  blue: 'info',
};

const Recommendation: React.FC<RecommendationProps> = ({ title, message, type }) => {
  const typeColors: Record<string, 'green' | 'red' | 'yellow' | 'blue'> = {
    success: 'green',
    warning: 'yellow',
    critical: 'red',
    info: 'blue',
  };
  const color = typeColors[type] || 'blue';

  return (
    <Card icon={Sparkles} title={title} color={color as any}>
      {message}
    </Card>
  );
};

interface AlertProps extends AlertItem {}

const Alert: React.FC<AlertProps> = ({ title, message, severity }) => {
  const severityColors: Record<string, 'red' | 'yellow' | 'blue' | 'green'> = {
    critical: 'red',
    warning: 'yellow',
    info: 'blue',
    success: 'green',
  };
  const color = severityColors[severity] || 'red';
  const SeverityIcon =
    severity === 'critical'
      ? AlertCircle
      : severity === 'warning'
        ? AlertTriangle
        : severity === 'success'
          ? CheckCircle2
          : Info;

  return (
    <Card icon={SeverityIcon} title={title} color={color as any}>
      {message}
    </Card>
  );
};

const LoadingAgent: React.FC<{ label?: string }> = ({ label = 'Analizando...' }) => (
  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-300">
    <Loader2 className="animate-spin" size={16} />
    <span>{label}</span>
  </div>
);

// ===============================
// AGENTE FINANCIERO INTELIGENTE
// ===============================

const generateFinancialAgent = (
  stats: Stats | undefined,
  metrics: Array<Metric | MetricDay> | undefined,
  prediction: Prediction | undefined
): FinancialAgentAnalysis => {
  const recommendations: RecommendationItem[] = [];
  const alerts: AlertItem[] = [];

  if (!stats || !metrics) return { recommendations, alerts, health: 'unknown' };

  const totalIncomes = stats.total_incomes || 0;
  const totalFixedCosts = stats.total_fixed_costs || 0;
  const balance = totalIncomes - totalFixedCosts;

  let health: 'critical' | 'warning' | 'good' | 'excellent' | 'unknown' = 'critical';
  if (balance > 0) {
    health = totalIncomes > totalFixedCosts * 1.5 ? 'excellent' : 'good';
  } else if (balance > -totalFixedCosts * 0.5) {
    health = 'warning';
  }

  if (totalIncomes === 0) {
    recommendations.push({
      title: '🎯 Sin ingresos registrados',
      message: 'Necesitas registrar facturas para activar el análisis completo.',
      type: 'info',
    });
  }

  if (balance < 0) {
    const deficit = Math.abs(balance);
    const months = totalFixedCosts > 0 ? Math.ceil(deficit / totalFixedCosts) : 0;
    recommendations.push({
      title: '⚠️ Déficit detectado',
      message: `Gastos superan ingresos por $${deficit.toFixed(2)}. En ${months} mes(es) a este ritmo.`,
      type: 'critical',
    });
  } else {
    const ratio = totalIncomes / (totalFixedCosts || 1);
    if (ratio > 2) {
      recommendations.push({
        title: '✨ Excelente flujo de caja',
        message: `Ingresos cubren ${ratio.toFixed(1)}x tus costos fijos. Posición muy sólida.`,
        type: 'success',
      });
    }
  }

  if (metrics && metrics.length > 1) {
    const recent = metrics.slice(-7);
    const avg = recent.reduce((s: number, m) => s + ((m as MetricDay).daily_profit || 0), 0) / recent.length;
    const lastProfit = (recent[recent.length - 1] as MetricDay).daily_profit || 0;
    const trend = lastProfit > avg ? 'mejorando' : 'empeorando';

    recommendations.push({
      title: trend === 'mejorando' ? '📈 Tendencia positiva' : '📉 Tendencia negativa',
      message: `Promedio diario: $${avg.toFixed(2)}. Últimos días: ${trend}.`,
      type: trend === 'mejorando' ? 'success' : 'warning',
    });
  }

  if (totalFixedCosts > 0) {
    const months = totalIncomes / totalFixedCosts;
    if (months < 1) {
      alerts.push({
        title: '🔴 Alerta crítica',
        message: `Solo tienes ingresos para ${months.toFixed(1)} mes(es).`,
        severity: 'critical',
      });
    } else if (months < 3) {
      alerts.push({
        title: '🟡 Alerta',
        message: `Ingresos cubren solo ${months.toFixed(1)} mes(es) de costos fijos.`,
        severity: 'warning',
      });
    }
  }

  return { recommendations, alerts, health };
};

// ===============================
// MUTACIONES: CARGA MANUAL + CHECKUP
// ===============================

async function submitManualData(formData: FormData) {
  const res = await fetch('/api/manual-input', {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Error al enviar datos manuales');
  return res.json();
}

async function runFullCheckup() {
  const res = await fetch('/api/anthropos/run', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error('Error al ejecutar checkup total');
  return res.json();
}

// ===============================
// DASHBOARD UNIFICADO
// ===============================

export default function IntelligentDashboard() {
  const queryClient = useQueryClient();

  const { data: stats, isLoading: loadingStats } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => fetchUnifiedDashboard(),
    staleTime: 5 * 60 * 1000,
  });

  const { data: metrics, isLoading: loadingMetrics } = useQuery({
    queryKey: ['metrics'],
    queryFn: fetchLast30DaysMetrics,
    staleTime: 5 * 60 * 1000,
  });

  const { data: prediction, isLoading: loadingPrediction } = useQuery({
    queryKey: ['prediction'],
    queryFn: fetchCashFlowPrediction,
    staleTime: 60 * 60 * 1000,
  });

  const { data: todaysInsight, isLoading: loadingInsight } = useQuery({
    queryKey: ['insight'],
    queryFn: fetchTodaysInsight,
    staleTime: 30 * 60 * 1000,
  });

  const { data: periodAnalytics, isLoading: loadingPeriod } = useQuery({
    queryKey: ['period'],
    queryFn: fetchPeriodAnalytics,
    staleTime: 60 * 60 * 1000,
  });

  const financialAgent = useMemo(
    () => generateFinancialAgent(stats, metrics, prediction),
    [stats, metrics, prediction]
  );

  const [manualIncome, setManualIncome] = useState('');
  const [manualFixedCosts, setManualFixedCosts] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  const manualMutation = useMutation({
    mutationFn: (data: FormData) => submitManualData(data),
    onSuccess: () => {
      setSuccessMessage('✅ Datos registrados. Agentes actualizando análisis...');
      setManualIncome('');
      setManualFixedCosts('');
      setAttachment(null);
      setTimeout(() => setSuccessMessage(''), 3000);
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['metrics'] });
    },
    onError: (error) => {
      setSuccessMessage(`❌ Error: ${error instanceof Error ? error.message : 'Desconocido'}`);
      setTimeout(() => setSuccessMessage(''), 5000);
    },
  });

  const checkupMutation = useMutation({
    mutationFn: runFullCheckup,
    onSuccess: () => {
      setSuccessMessage('✅ Checkup completado. Súper Agente en control.');
      setTimeout(() => setSuccessMessage(''), 3000);
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['metrics'] });
      queryClient.invalidateQueries({ queryKey: ['insight'] });
      queryClient.invalidateQueries({ queryKey: ['period'] });
    },
    onError: (error) => {
      setSuccessMessage(`❌ Error checkup: ${error instanceof Error ? error.message : 'Desconocido'}`);
      setTimeout(() => setSuccessMessage(''), 5000);
    },
  });

  const isLoadingAny =
    loadingStats || loadingMetrics || loadingPrediction || loadingInsight || loadingPeriod;

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = new FormData();
    if (manualIncome) form.append('manual_income', manualIncome);
    if (manualFixedCosts) form.append('manual_fixed_costs', manualFixedCosts);
    if (attachment) form.append('attachment', attachment);
    form.append('recording_date', new Date().toISOString());
    manualMutation.mutate(form);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors">
      <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
        {/* Header */}
        <header className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
              <Activity size={26} /> Panel Inteligente Unificado
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Finanzas, Anthropos, Self Gardener y carga manual en una sola vista.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Moon className="text-slate-400 dark:text-slate-200" size={18} />
            <div className="w-10 h-6 bg-slate-300 dark:bg-slate-700 rounded-full relative">
              <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm dark:left-4" />
            </div>
            <SunMedium className="text-yellow-400" size={18} />
          </div>
        </header>

        {/* Barra de acciones */}
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between p-4 bg-slate-100 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => checkupMutation.mutate()}
            disabled={checkupMutation.isPending}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium shadow hover:bg-indigo-700 hover:shadow-md disabled:opacity-60 transition-all"
          >
            {checkupMutation.isPending ? (
              <>
                <Loader2 className="animate-spin" size={16} /> Súper Agente revisando…
              </>
            ) : (
              <>
                <PlayCircle size={16} /> Checkup total (todos los agentes)
              </>
            )}
          </button>

          {successMessage && (
            <div
              className={`text-xs font-medium px-3 py-1 rounded-lg ${
                successMessage.startsWith('✅')
                  ? 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-950'
                  : 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-950'
              }`}
            >
              {successMessage}
            </div>
          )}
        </div>

        {isLoadingAny && (
          <Card icon={Brain} title="🤖 Agente pensando…" color="purple">
            <LoadingAgent label="Los agentes están analizando tus datos en tiempo real…" />
          </Card>
        )}

        {/* GRID PRINCIPAL */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna 1: Finanzas + Carga manual */}
          <div className="space-y-4 lg:col-span-2">
            <SectionTitle icon={TrendingUp} title="Estado Financiero" />
            <Card icon={TrendingUp} title="Salud financiera" color="purple">
              <div className="space-y-2">
                <p>
                  Salud: <strong>{financialAgent.health.toUpperCase()}</strong>
                </p>
                {stats && (
                  <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 space-y-1">
                    <p>Ingresos: ${stats.total_incomes?.toFixed(2) || 0}</p>
                    <p>Costos fijos: ${stats.total_fixed_costs?.toFixed(2) || 0}</p>
                  </div>
                )}
              </div>
            </Card>

            <SectionTitle icon={Upload} title="Ingreso manual de datos y adjuntos" />
            <Card icon={Upload} title="Registrar datos manualmente" color="cyan">
              <form onSubmit={handleManualSubmit} className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-300 mb-1">
                      Ingresos del período (manual)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={manualIncome}
                      onChange={(e) => setManualIncome(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-sm bg-white dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      placeholder="Ej: 150000"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-300 mb-1">
                      Costos fijos del período (manual)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={manualFixedCosts}
                      onChange={(e) => setManualFixedCosts(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-sm bg-white dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      placeholder="Ej: 80000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-300 mb-1">
                    Adjuntar archivo (cualquier modalidad)
                  </label>
                  <input
                    type="file"
                    onChange={(e) => setAttachment(e.target.files?.[0] || null)}
                    className="w-full text-xs text-slate-500 dark:text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-cyan-600 file:text-white hover:file:bg-cyan-700"
                  />
                  <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                    Puede ser Excel, PDF, imagen, etc. El backend decidirá cómo procesarlo.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={manualMutation.isPending}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 text-white text-sm font-medium hover:bg-cyan-700 hover:shadow-md disabled:opacity-60 transition-all"
                >
                  {manualMutation.isPending ? (
                    <>
                      <Loader2 className="animate-spin" size={14} /> Enviando datos…
                    </>
                  ) : (
                    <>
                      <Upload size={14} /> Guardar y actualizar análisis
                    </>
                  )}
                </button>
              </form>
            </Card>

            <SectionTitle icon={Sparkles} title="Recomendaciones inteligentes" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {financialAgent.recommendations.map((r, i) => (
                <Recommendation key={i} {...r} />
              ))}
              {financialAgent.recommendations.length === 0 && (
                <Card icon={Sparkles} title="Sin recomendaciones" color="green">
                  Todo está en orden por ahora. Los agentes seguirán observando.
                </Card>
              )}
            </div>

            <SectionTitle icon={AlertCircle} title="Alertas" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {financialAgent.alerts.map((a, i) => (
                <Alert key={i} {...a} />
              ))}
              {financialAgent.alerts.length === 0 && (
                <Card icon={ShieldCheck} title="Sin alertas críticas" color="green">
                  No se detectan riesgos financieros graves en este momento.
                </Card>
              )}
            </div>
          </div>

          {/* Columna 2: Anthropos + Self Gardener */}
          <div className="space-y-4">
            <SectionTitle icon={Brain} title="Anthropos (Sistema Vivo)" />
            <Card icon={Brain} title="Estado del Anthropos" color="indigo">
              <p className="text-xs leading-relaxed">
                Estado global: <strong>fertile / stressed / fragmented / flowing</strong>
                <br />
                Coherencia del corazón: <strong>0-100%</strong>
                <br />
                Insights de Sophia: <strong>En progreso…</strong>
              </p>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Conecta al endpoint <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">/api/anthropos/last-report</code>
              </p>
            </Card>

            <SectionTitle icon={Heart} title="Self Gardener / Corazón del Sistema" />
            <Card icon={Heart} title="Clima interno" color="rose">
              <p className="text-xs leading-relaxed">
                Carga emocional: <strong>0-100%</strong>
                <br />
                Carga operativa: <strong>0-100%</strong>
                <br />
                Coherencia: <strong>0-100%</strong>
              </p>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Enlazado a HeartEngine y señales emocionales del taller.
              </p>
            </Card>

            <SectionTitle icon={Zap} title="Rituales diarios" />
            <Card icon={Zap} title="Ritmo del día" color="amber">
              <ul className="text-xs space-y-1 text-slate-700 dark:text-slate-300">
                <li>🌄 06:00 — Ritual de amanecer</li>
                <li>🌞 14:00 — Chequeo de mitad de día</li>
                <li>🌇 18:00 — Ritual de cierre</li>
                <li>🌙 22:00 — Vigilancia nocturna</li>
                <li>🕊️ 02:00 — Ciclo completo del Anthropos (Súper Agente)</li>
              </ul>
            </Card>

            <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700">
              <p className="text-xs text-slate-600 dark:text-slate-400">
                ⏰ Última sincronización: <strong>{new Date().toLocaleTimeString('es-ES')}</strong>
              </p>
            </div>
          </div>
        </div>

        {/* SOPHIA WISDOM SECTION */}
        <div className="mt-8 border-t border-slate-600 pt-8">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="w-6 h-6 text-purple-400" />
            <h2 className="text-2xl font-bold text-white">La Brújula de Sophia</h2>
            <p className="ml-auto text-xs text-gray-400">Tu sabiduría como norte del sistema</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* PILLAR CONSTELLATION - 2/3 WIDTH */}
            <div className="lg:col-span-2">
              <SophiaMessageCard context="financial" />
            </div>

            {/* SOPHIA STATS - 1/3 WIDTH */}
            <div className="space-y-4">
              <SophiaStats />
              
              <div className="bg-slate-700/50 backdrop-blur rounded-lg p-4 border border-slate-600">
                <p className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-pink-400" />
                  Disponibilidad de Pilares
                </p>
                <ul className="space-y-1 text-xs text-gray-300">
                  <li>✅ Presencia - Sistema activo</li>
                  <li>✅ Resiliencia - Cargada</li>
                  <li>✅ Claridad - Frecuencia lista</li>
                  <li>✅ Compasión - Integrada</li>
                  <li>✅ Discernimiento - Disponible</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Re-export components
export { SophiaMessageCard, PillarConstellation };
