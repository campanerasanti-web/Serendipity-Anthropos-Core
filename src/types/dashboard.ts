// ============================================================================
// TIPOS TYPESCRIPT - DASHBOARD INTELIGENTE
// ============================================================================

export interface DashboardStats {
  total_incomes: number;
  total_invoices: number;
  total_fixed_costs: number;
  monthly_average?: number;
  period_start?: string;
  period_end?: string;
}

export interface MetricDay {
  date: string;
  daily_revenue: number;
  daily_expenses: number;
  daily_profit: number;
  narrative: string;
  emoji?: string;
  confidence_score: number;
}

export interface CashFlowPrediction {
  month: number;
  year: number;
  predicted_revenue: number;
  predicted_expenses: number;
  predicted_profit: number;
  confidence: number;
  reasoning?: string;
}

export interface DailyInsight {
  date: string;
  narrative: string;
  emoji?: string;
  confidence_score: number;
  key_metric?: string;
}

export interface PeriodAnalytics {
  period: string;
  total_revenue: number;
  total_expenses: number;
  total_profit: number;
  avg_daily: number;
  trend: 'up' | 'down' | 'stable';
  volatility: number; // 0-1
  health_indicators?: Record<string, any>;
}

export interface RecommendationItem {
  title: string;
  message: string;
  type: 'success' | 'warning' | 'critical' | 'info';
}

export interface AlertItem {
  title: string;
  message: string;
  severity: 'critical' | 'warning' | 'info' | 'success';
}

export interface FinancialAgentAnalysis {
  recommendations: RecommendationItem[];
  alerts: AlertItem[];
  health: 'critical' | 'warning' | 'good' | 'excellent' | 'unknown';
  riskScore?: number;
  seasonality?: string;
  patterns?: string[];
}

export interface ManualInputPayload {
  manual_income?: number;
  manual_fixed_costs?: number;
  attachment?: File;
  recording_date?: string;
  notes?: string;
}

export interface ManualInputResponse {
  success: boolean;
  message: string;
  data?: Record<string, any>;
}

export interface CheckupResponse {
  success: boolean;
  message: string;
  status: 'completed' | 'running' | 'error';
  agents_run?: {
    opsGardener?: boolean;
    securityGardener?: boolean;
    anthroposCore?: boolean;
    selfGardener?: boolean;
  };
  timestamp?: string;
}

export interface AnthroposReport {
  state: 'fertile' | 'stressed' | 'fragmented' | 'flowing';
  coherence: number; // 0-100
  lastUpdate: string;
  summary?: string;
  insights?: string[];
}

export interface HeartEngineStatus {
  emotional_load: number; // 0-100
  operational_load: number; // 0-100
  coherence_signal: number; // 0-100
  status: 'healthy' | 'stressed' | 'critical';
}

export interface SophiaInsight {
  insight: string;
  confidence: number;
  context: string;
  recommendation?: string;
}
