// ============================================================
// SHARED TYPES - Frontend & Backend Communication
// ============================================================

// Financial Stats
export interface Stats {
  total_incomes: number;
  total_fixed_costs: number;
}

// Daily Metrics
export interface Metric {
  date?: string;
  daily_profit: number;
  daily_revenue?: number;
  daily_expenses?: number;
}

// Cash Flow Prediction
export interface Prediction {
  prediction_date?: string;
  predicted_balance?: number;
  runway_months?: number;
  confidence?: number;
  next_30_days?: {
    estimated_income: number;
    estimated_expenses: number;
    projected_balance: number;
  };
}

// Today's Insight
export interface TodaysInsight {
  date: string;
  focus: string;
  recommendation: string;
  urgency: 'critical' | 'high' | 'medium' | 'low';
  icon?: string;
  narrative?: string;
  confidence_score?: number;
}

// Period Analytics
export interface PeriodAnalytics {
  period: string;
  total_income: number;
  total_expenses: number;
  profit_margin: number;
  growth_rate: number;
  variance: number;
}

// ============================================================
// ANTHROPOS & SUPER AGENT TYPES
// ============================================================

// Heart (Corazón del Sistema)
export interface HeartState {
  Coherence: number; // 0-100
  EmotionalLoad: number; // 0-100
  OperationalLoad: number; // 0-100
  State: 'balanced' | 'stressed' | 'recovering' | 'thriving';
  LastUpdate?: string;
}

// Sophia Engine (Insights)
export interface SophiaInsight {
  Category: 'opportunity' | 'risk' | 'performance' | 'pattern' | 'anomaly';
  Message: string;
  Severity: 'info' | 'warning' | 'critical';
  Timestamp?: string;
}

// System State (Anthropos)
export interface SystemState {
  Mood: 'fertile' | 'stressed' | 'fragmented' | 'flowing' | 'dormant';
  Health: number; // 0-100
  DroughtPoints: string[];
  SecurityRisks: string[];
  LastCycle?: string;
  UpcomingRitual?: string;
}

// Full Anthropos Report (Super Agent)
export interface AnthroposReport {
  timestamp: string;
  state: SystemState;
  heart: HeartState;
  insights: SophiaInsight[];
  lastRitual?: string;
  logs?: string[];
  operationalStatus: 'healthy' | 'warning' | 'critical';
  nextCheckup?: string;
  system_mood?: string;
  heart_coherence?: number;
  emotional_load?: number;
  operational_load?: number;
  drought_points?: string[];
  sophia_insights?: string[];
  security_risks?: string[];
  full_cycle?: boolean;
  last_sync_time?: string;
}

// Manual Input Payload
export interface ManualInputPayload {
  manual_income?: number;
  manual_fixed_costs?: number;
  attachment?: File;
}

// Manual Input Response
export interface ManualInputResponse {
  ok: boolean;
  manualIncome: number;
  manualFixedCosts: number;
  attachment?: {
    filename: string;
    size: number;
    processed: boolean;
  };
  message?: string;
}

// Checkup Response (Super Agent Run)
export interface CheckupResponse {
  ok: boolean;
  super_agent: string; // 'AnthroposCore'
  status: 'completed' | 'in_progress' | 'failed';
  message: string;
  executedAgents?: {
    ops_gardener: boolean;
    security_gardener: boolean;
    anthropos_core: boolean;
    heart_engine: boolean;
    sophia_engine: boolean;
  };
  reportId?: string;
  nextExecution?: string;
}

// ============================================================
// FINANCIAL AGENT GENERATED TYPES
// ============================================================

export interface Recommendation {
  title: string;
  message: string;
  type: 'success' | 'warning' | 'critical' | 'info';
}

export interface Alert {
  title: string;
  message: string;
  severity: 'critical' | 'warning' | 'info';
}

export interface FinancialAgentOutput {
  recommendations: Recommendation[];
  alerts: Alert[];
  health: 'critical' | 'warning' | 'good' | 'excellent' | 'unknown';
}
