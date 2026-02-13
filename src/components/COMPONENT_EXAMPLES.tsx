import React from 'react';
import {
  Activity,
  AlertCircle,
  Calendar,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from 'lucide-react';
import Card from './ui/Card';
import SectionTitle from './ui/SectionTitle';
import { Recommendation } from './ui/Recommendation';
import { Alert } from './ui/Alert';

/**
 * ============================================================================
 * EJEMPLOS DE USO - COMPONENTES UI REUTILIZABLES
 * ============================================================================
 * Este archivo muestra casos de uso prácticos de los componentes
 */

// ============================================================================
// EJEMPLO 1: USO BÁSICO DE CARD
// ============================================================================

export function CardBasicExample() {
  return (
    <div className="space-y-4 p-6">
      <h2 className="text-xl font-bold">Ejemplo: Cards Básicas</h2>

      <Card icon={TrendingUp} title="Crecimiento" color="green">
        <div className="space-y-2">
          <p className="text-3xl font-bold text-green-100">+25%</p>
          <p className="text-sm text-green-300">Respecto al mes anterior</p>
        </div>
      </Card>

      <Card icon={AlertCircle} title="Alertas" color="red">
        <p className="text-red-100">Tienes 3 alertas pendientes</p>
      </Card>

      <Card title="Sin Icono" color="purple" variant="subtle">
        <p>Las cards pueden mostrarse sin icono</p>
      </Card>
    </div>
  );
}

// ============================================================================
// EJEMPLO 2: SECCIONES CON TÍTULOS
// ============================================================================

export function SectionTitleExample() {
  return (
    <div className="p-6 space-y-12">
      <SectionTitle
        icon={TrendingUp}
        title="Métricas del Negocio"
        subtitle="Estado actual y proyecciones"
      />

      <SectionTitle
        icon={Target}
        title="Objetivos Financieros"
        subtitle="Lo que queremos lograr"
      />

      <SectionTitle
        icon={Zap}
        title="Sistema Inteligente"
        // Sin subtitle
      />
    </div>
  );
}

// ============================================================================
// EJEMPLO 3: SISTEMA DE RECOMENDACIONES
// ============================================================================

export function RecommendationExample() {
  const recommendations = [
    {
      title: '🚀 Oportunidad de Crecimiento',
      message:
        'Tu negocio muestra tendencia positiva. Es buen momento invertir en marketing.',
      type: 'success' as const,
    },
    {
      title: '⚠️ Revisar Concentración',
      message: 'El 60% de ingresos proviene de 3 clientes. Diversifica para reducir riesgo.',
      type: 'warning' as const,
    },
    {
      title: '🎯 Información Importante',
      message: 'Tu runway estimado es de 4 meses. Objetivo: 6 meses mínimo.',
      type: 'info' as const,
    },
    {
      title: '🚨 Acción Urgente',
      message: 'Los gastos superan ingresos. Requiere intervención inmediata.',
      type: 'critical' as const,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <SectionTitle title="Recomendaciones" subtitle="Sistema Inteligente de Sofia" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map((rec, idx) => (
          <Recommendation key={idx} {...rec} />
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// EJEMPLO 4: SISTEMA DE ALERTAS
// ============================================================================

export function AlertExample() {
  const alerts = [
    {
      title: '🔴 CRÍTICO',
      message: 'Tu runway es menor a 1 mes. Riesgo externo extremo.',
      severity: 'critical' as const,
    },
    {
      title: '🟠 ALTO',
      message: 'Tienes 2 meses de cobertura. Riesgo moderado en 60 días.',
      severity: 'critical' as const,
    },
    {
      title: '🟡 MODERADO',
      message: 'Runway de 3 meses. Objetivo: aumentar a 6 meses.',
      severity: 'warning' as const,
    },
    {
      title: 'ℹ️ Información',
      message: 'Tu balance es positivo con tendencia al alza.',
      severity: 'info' as const,
    },
    {
      title: '✅ EXCELENTE',
      message: '6+ meses de cobertura. Posición sólida para crecer.',
      severity: 'success' as const,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <SectionTitle title="Alertas del Sistema" subtitle="Todos los niveles de severidad" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {alerts.map((alert, idx) => (
          <Alert key={idx} {...alert} dismissible onDismiss={() => console.log(`Alerta ${idx} cerrada`)} />
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// EJEMPLO 5: DASHBOARD FINANCIERO SIMPLE
// ============================================================================

export function FinancialDashboardExample() {
  const stats = {
    totalIncomes: 15000,
    totalExpenses: 4000,
    balance: 11000,
    runway: 3.75,
    invoiceCount: 48,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-purple-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">Dashboard Financiero</h1>
          <p className="text-gray-400">Vista simplificada con componentes reutilizables</p>
        </div>

        {/* Section 1: Métricas */}
        <SectionTitle
          icon={TrendingUp}
          title="Métricas Principales"
          subtitle="Estado actual de tu negocio"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card icon={ShieldCheck} title="Ingresos" color="green">
            <p className="text-4xl font-bold text-green-100">${stats.totalIncomes}</p>
            <p className="text-sm text-green-300 mt-2">{stats.invoiceCount} facturas</p>
          </Card>

          <Card icon={AlertCircle} title="Gastos" color="red">
            <p className="text-4xl font-bold text-red-100">${stats.totalExpenses}</p>
            <p className="text-sm text-red-300 mt-2">Compromisos mensuales</p>
          </Card>

          <Card icon={TrendingUp} title="Balance" color="green">
            <p className="text-4xl font-bold text-green-100">${stats.balance}</p>
            <p className="text-sm text-green-300 mt-2">✅ Posición sólida</p>
          </Card>
        </div>

        {/* Section 2: Análisis */}
        <SectionTitle
          icon={Target}
          title="Análisis Avanzado"
          subtitle="Métricas de sostenibilidad"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card title="Runway (Meses)" color="indigo" variant="subtle">
            <p className="text-3xl font-bold text-indigo-200">{stats.runway}</p>
            <p className="text-xs text-indigo-300 mt-2">
              Meses de operación con ingresos actuales
            </p>
          </Card>

          <Card title="Health Score" color="green" variant="subtle">
            <p className="text-3xl font-bold text-green-200">85/100</p>
            <p className="text-xs text-green-300 mt-2">Estado financiero general</p>
          </Card>
        </div>

        {/* Section 3: Recomendaciones */}
        <SectionTitle icon={Zap} title="Recomendaciones" subtitle="Acciones sugeridas" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          <Recommendation
            title="🚀 Es momento de crecer"
            message="Con runway de 3+ meses, tienes estabilidad para invertir en marketing."
            type="success"
          />
          <Recommendation
            title="📊 Estabilizar ingresos"
            message="Tu negocio es volátil. Busca clientes recurrentes para predecibilidad."
            type="warning"
          />
        </div>

        {/* Section 4: Alertas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Alert
            title="✅ POSICIÓN SÓLIDA"
            message="3.75 meses de cobertura asegura estabilidad operacional."
            severity="success"
            dismissible
          />
          <Alert
            title="ℹ️ Información"
            message="Tu balance crece mes a mes. Sigue así."
            severity="info"
            dismissible
          />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// EJEMPLO 6: PÁGINA DE COMPONENTES PARA DESARROLLO
// ============================================================================

export function ComponentShowcase() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-purple-900 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Showcase de Componentes</h1>

        {/* Cards */}
        <section className="mb-12">
          <SectionTitle title="Cards" subtitle="Todas las variantes y colores" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            {['blue', 'green', 'red', 'yellow', 'purple', 'indigo'].map((color) => (
              <Card key={color} title={`Color: ${color}`} color={color as any}>
                <p>Variante por defecto</p>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(['default', 'subtle', 'bordered'] as const).map((variant) => (
              <Card
                key={variant}
                title={`Variante: ${variant}`}
                color="blue"
                variant={variant}
              >
                <p>Esta es la variante {variant}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Recommendations */}
        <section className="mb-12">
          <SectionTitle title="Recomendaciones" subtitle="Todos los tipos" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(['success', 'warning', 'critical', 'info'] as const).map((type) => (
              <Recommendation
                key={type}
                title={`Tipo: ${type}`}
                message="Este es un ejemplo de recomendación"
                type={type}
              />
            ))}
          </div>
        </section>

        {/* Alerts */}
        <section>
          <SectionTitle title="Alertas" subtitle="Todos los niveles" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(['critical', 'warning', 'info', 'success'] as const).map((severity) => (
              <Alert
                key={severity}
                title={`Severity: ${severity}`}
                message="Este es un ejemplo de alerta"
                severity={severity}
                dismissible
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

// ============================================================================
// EXPORT ALL EXAMPLES
// ============================================================================

export const COMPONENT_EXAMPLES = {
  BasicCard: CardBasicExample,
  SectionTitles: SectionTitleExample,
  Recommendations: RecommendationExample,
  Alerts: AlertExample,
  FinancialDashboard: FinancialDashboardExample,
  ComponentShowcase: ComponentShowcase,
};

export default COMPONENT_EXAMPLES;
