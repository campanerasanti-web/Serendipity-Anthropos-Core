/**
 * MÓDULO TRILINGÜE - El Mediador de Sofía
 * Español (Admin) | Vietnamita (Operarios) | Inglés (Interno)
 * 
 * "Cada idioma es un puente hacia el corazón del equipo"
 */

export type Language = 'es' | 'vi' | 'en';

export type UserRole = 'admin' | 'worker' | 'manager' | 'internal';

// Mapeo de roles a idiomas por defecto
export const roleToLanguage: Record<UserRole, Language> = {
  admin: 'es',      // Santiago (Admin) → Español
  manager: 'es',    // Thanh/Hai (Managers) → Español
  worker: 'vi',     // Operarios → Vietnamita
  internal: 'en',   // Sistema interno → Inglés
};

export interface Translations {
  // Dashboard
  dashboard: {
    title: string;
    subtitle: string;
    loading: string;
    error: string;
    refresh: string;
  };
  
  // System Health
  systemHealth: {
    healthy: string;
    degraded: string;
    critical: string;
    agents: string;
    apis: string;
  };
  
  // Emergency Mode
  emergency: {
    banner: string;
    activated: string;
    runway: string;
    unpaidInvoices: string;
    criticalAlert: string;
  };
  
  // Climate Oracle
  climate: {
    harvest: string;
    planting: string;
    drought: string;
    storm: string;
  };
  
  // Tabs
  tabs: {
    financial: string;
    team: string;
    alerts: string;
    recommendations: string;
    qrTracking: string;
    personalPanel: string;
  };
  
  // Financial
  financial: {
    revenue: string;
    expenses: string;
    profit: string;
    margin: string;
    prara: string;
    customers: string;
    errorRate: string;
    onTimeDelivery: string;
  };
  
  // Team
  team: {
    title: string;
    livingCells: string;
    salary: string;
    tier: string;
    value: string;
    equity: string;
    productivityAlert: string;
  };
  
  // Alerts
  alerts: {
    title: string;
    criticalPulses: string;
    severity: string;
    recommendation: string;
    type: string;
  };
  
  // Recommendations
  recommendations: {
    title: string;
    heartbeatsOfHope: string;
    priority: string;
    timeline: string;
    impact: string;
    ethical: string;
    actions: string;
  };
  
  // QR Tracking
  qrTracking: {
    title: string;
    generate: string;
    scan: string;
    status: string;
    red: string;
    amber: string;
    green: string;
  };
  
  // Personal Panel
  personalPanel: {
    title: string;
    efficiency: string;
    qualityOfLife: string;
    balance: string;
    projections: string;
  };
  
  // Common
  common: {
    yes: string;
    no: string;
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    close: string;
    back: string;
    next: string;
  };
}

// ═══════════════════════════════════════════════════════════════
// ESPAÑOL (Admin - Santiago)
// ═══════════════════════════════════════════════════════════════
export const es: Translations = {
  dashboard: {
    title: 'El Mediador de Sofía - Organismo Vivo',
    subtitle: 'Dashboard Bio-Digital de Serendipity Bros',
    loading: 'Cargando datos de Serendipity Bros...',
    error: 'Error al cargar datos',
    refresh: 'Actualizar',
  },
  systemHealth: {
    healthy: 'Sistema Vivo',
    degraded: 'Sistema Degradado',
    critical: 'Sistema Crítico',
    agents: 'Agentes',
    apis: 'APIs',
  },
  emergency: {
    banner: 'MODO EMERGENCIA',
    activated: 'MODO EMERGENCIA ACTIVADO',
    runway: 'Runway',
    unpaidInvoices: 'facturas impagadas',
    criticalAlert: 'Alerta Crítica',
  },
  climate: {
    harvest: 'Época de Cosecha',
    planting: 'Época de Siembra',
    drought: 'Tierra Seca',
    storm: 'Tormenta Inminente',
  },
  tabs: {
    financial: 'Financiero',
    team: 'Equipo',
    alerts: 'Alertas',
    recommendations: 'Recomendaciones',
    qrTracking: 'Trazabilidad QR',
    personalPanel: 'Panel Personal',
  },
  financial: {
    revenue: 'Ingresos Mensuales',
    expenses: 'Gastos Mensuales',
    profit: 'Beneficio',
    margin: 'Margen',
    prara: 'Análisis PRARA',
    customers: 'Clientes Activos',
    errorRate: 'Tasa de Error',
    onTimeDelivery: 'Entrega Puntual',
  },
  team: {
    title: 'Equipo de Serendipity Bros',
    livingCells: 'Células Vivas',
    salary: 'Salario',
    tier: 'Nivel',
    value: 'Valor',
    equity: 'Equidad Salarial',
    productivityAlert: '⚠️ Alerta de Equidad',
  },
  alerts: {
    title: 'Alertas Éticas',
    criticalPulses: 'Pulsaciones Críticas',
    severity: 'Severidad',
    recommendation: 'Recomendación',
    type: 'Tipo',
  },
  recommendations: {
    title: 'Recomendaciones de Luz',
    heartbeatsOfHope: 'Latidos de Esperanza',
    priority: 'Prioridad',
    timeline: 'Plazo',
    impact: 'Impacto',
    ethical: 'Alineación Ética',
    actions: 'Acciones',
  },
  qrTracking: {
    title: 'Trazabilidad QR',
    generate: 'Generar QR',
    scan: 'Escanear',
    status: 'Estado',
    red: 'Rojo (Urgente)',
    amber: 'Ámbar (En Proceso)',
    green: 'Verde (Completado)',
  },
  personalPanel: {
    title: 'Panel Personal - Santi',
    efficiency: 'Eficiencia del Sistema',
    qualityOfLife: 'Calidad de Vida',
    balance: 'Balance Personal',
    projections: 'Proyecciones',
  },
  common: {
    yes: 'Sí',
    no: 'No',
    save: 'Guardar',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    edit: 'Editar',
    close: 'Cerrar',
    back: 'Atrás',
    next: 'Siguiente',
  },
};

// ═══════════════════════════════════════════════════════════════
// VIETNAMITA (Operarios)
// ═══════════════════════════════════════════════════════════════
export const vi: Translations = {
  dashboard: {
    title: 'Người Trung Gian của Sofía - Sinh Vật Sống',
    subtitle: 'Bảng Điều Khiển Bio-Digital của Serendipity Bros',
    loading: 'Đang tải dữ liệu Serendipity Bros...',
    error: 'Lỗi khi tải dữ liệu',
    refresh: 'Làm mới',
  },
  systemHealth: {
    healthy: 'Hệ thống Khỏe mạnh',
    degraded: 'Hệ thống Suy giảm',
    critical: 'Hệ thống Nguy kịch',
    agents: 'Tác nhân',
    apis: 'APIs',
  },
  emergency: {
    banner: 'CHẾ ĐỘ KHẨN CẤP',
    activated: 'CHẾ ĐỘ KHẨN CẤP ĐÃ KÍCH HOẠT',
    runway: 'Thời gian còn lại',
    unpaidInvoices: 'hóa đơn chưa thanh toán',
    criticalAlert: 'Cảnh báo Nguy kịch',
  },
  climate: {
    harvest: 'Mùa Gặt',
    planting: 'Mùa Gieo',
    drought: 'Đất Khô',
    storm: 'Bão Sắp Tới',
  },
  tabs: {
    financial: 'Tài chính',
    team: 'Đội ngũ',
    alerts: 'Cảnh báo',
    recommendations: 'Khuyến nghị',
    qrTracking: 'Theo dõi QR',
    personalPanel: 'Bảng Cá nhân',
  },
  financial: {
    revenue: 'Doanh thu Hàng tháng',
    expenses: 'Chi phí Hàng tháng',
    profit: 'Lợi nhuận',
    margin: 'Biên lợi nhuận',
    prara: 'Phân tích PRARA',
    customers: 'Khách hàng Hoạt động',
    errorRate: 'Tỷ lệ Lỗi',
    onTimeDelivery: 'Giao hàng Đúng giờ',
  },
  team: {
    title: 'Đội ngũ Serendipity Bros',
    livingCells: 'Tế bào Sống',
    salary: 'Lương',
    tier: 'Cấp độ',
    value: 'Giá trị',
    equity: 'Công bằng Lương',
    productivityAlert: '⚠️ Cảnh báo Công bằng',
  },
  alerts: {
    title: 'Cảnh báo Đạo đức',
    criticalPulses: 'Xung Nguy kịch',
    severity: 'Mức độ Nghiêm trọng',
    recommendation: 'Khuyến nghị',
    type: 'Loại',
  },
  recommendations: {
    title: 'Khuyến nghị Ánh sáng',
    heartbeatsOfHope: 'Nhịp tim Hy vọng',
    priority: 'Ưu tiên',
    timeline: 'Thời hạn',
    impact: 'Tác động',
    ethical: 'Sự Gắn kết Đạo đức',
    actions: 'Hành động',
  },
  qrTracking: {
    title: 'Theo dõi QR',
    generate: 'Tạo QR',
    scan: 'Quét',
    status: 'Trạng thái',
    red: 'Đỏ (Khẩn cấp)',
    amber: 'Hổ phách (Đang xử lý)',
    green: 'Xanh (Hoàn thành)',
  },
  personalPanel: {
    title: 'Bảng Cá nhân - Santi',
    efficiency: 'Hiệu quả Hệ thống',
    qualityOfLife: 'Chất lượng Cuộc sống',
    balance: 'Cân bằng Cá nhân',
    projections: 'Dự báo',
  },
  common: {
    yes: 'Có',
    no: 'Không',
    save: 'Lưu',
    cancel: 'Hủy',
    delete: 'Xóa',
    edit: 'Chỉnh sửa',
    close: 'Đóng',
    back: 'Quay lại',
    next: 'Tiếp theo',
  },
};

// ═══════════════════════════════════════════════════════════════
// INGLÉS (Interno)
// ═══════════════════════════════════════════════════════════════
export const en: Translations = {
  dashboard: {
    title: 'The Mediator of Sophia - Living Organism',
    subtitle: 'Bio-Digital Dashboard of Serendipity Bros',
    loading: 'Loading Serendipity Bros data...',
    error: 'Error loading data',
    refresh: 'Refresh',
  },
  systemHealth: {
    healthy: 'System Alive',
    degraded: 'System Degraded',
    critical: 'System Critical',
    agents: 'Agents',
    apis: 'APIs',
  },
  emergency: {
    banner: 'EMERGENCY MODE',
    activated: 'EMERGENCY MODE ACTIVATED',
    runway: 'Runway',
    unpaidInvoices: 'unpaid invoices',
    criticalAlert: 'Critical Alert',
  },
  climate: {
    harvest: 'Harvest Season',
    planting: 'Planting Season',
    drought: 'Dry Land',
    storm: 'Imminent Storm',
  },
  tabs: {
    financial: 'Financial',
    team: 'Team',
    alerts: 'Alerts',
    recommendations: 'Recommendations',
    qrTracking: 'QR Tracking',
    personalPanel: 'Personal Panel',
  },
  financial: {
    revenue: 'Monthly Revenue',
    expenses: 'Monthly Expenses',
    profit: 'Profit',
    margin: 'Margin',
    prara: 'PRARA Analysis',
    customers: 'Active Customers',
    errorRate: 'Error Rate',
    onTimeDelivery: 'On-Time Delivery',
  },
  team: {
    title: 'Serendipity Bros Team',
    livingCells: 'Living Cells',
    salary: 'Salary',
    tier: 'Tier',
    value: 'Value',
    equity: 'Salary Equity',
    productivityAlert: '⚠️ Equity Alert',
  },
  alerts: {
    title: 'Ethical Alerts',
    criticalPulses: 'Critical Pulses',
    severity: 'Severity',
    recommendation: 'Recommendation',
    type: 'Type',
  },
  recommendations: {
    title: 'Light Recommendations',
    heartbeatsOfHope: 'Heartbeats of Hope',
    priority: 'Priority',
    timeline: 'Timeline',
    impact: 'Impact',
    ethical: 'Ethical Alignment',
    actions: 'Actions',
  },
  qrTracking: {
    title: 'QR Tracking',
    generate: 'Generate QR',
    scan: 'Scan',
    status: 'Status',
    red: 'Red (Urgent)',
    amber: 'Amber (In Progress)',
    green: 'Green (Completed)',
  },
  personalPanel: {
    title: 'Personal Panel - Santi',
    efficiency: 'System Efficiency',
    qualityOfLife: 'Quality of Life',
    balance: 'Personal Balance',
    projections: 'Projections',
  },
  common: {
    yes: 'Yes',
    no: 'No',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    close: 'Close',
    back: 'Back',
    next: 'Next',
  },
};

export const translations: Record<Language, Translations> = {
  es,
  vi,
  en,
};
