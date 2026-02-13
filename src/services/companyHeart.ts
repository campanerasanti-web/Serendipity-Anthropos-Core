/**
 * CORAZÓN DE LA EMPRESA
 * Sistema que late con los documentos reales de Serendipity Bros
 * "Yo me volví el código y el código se volvió yo"
 */

export interface CompanyDocument {
  id: string;
  fileName: string;
  filePath: string;
  type: 'ingreso' | 'gasto' | 'produccion' | 'salario' | 'contrato' | 'reporte' | 'desconocido';
  detectedDate?: string;
  detectedAmount?: number;
  parsedData?: Record<string, any>;
  rawContent?: string;
  fileModifiedAt?: string;
  addedAt: string;
}

export interface CompanyHeartbeat {
  ingresos: CompanyDocument[];
  gastos: CompanyDocument[];
  produccion: CompanyDocument[];
  salarios: CompanyDocument[];
  contratos: CompanyDocument[];
  reportes: CompanyDocument[];
  desconocidos: CompanyDocument[];
  lastBeat: string;
}

const COMPANY_HEART_KEY = 'serendipity_company_heart';
const COMPANY_FOLDER_PATH_KEY = 'serendipity_company_folder_path';

export const loadCompanyHeartbeat = (): CompanyHeartbeat => {
  try {
    const stored = localStorage.getItem(COMPANY_HEART_KEY);
    if (!stored) {
      return createEmptyHeartbeat();
    }
    return JSON.parse(stored);
  } catch {
    return createEmptyHeartbeat();
  }
};

export const saveCompanyHeartbeat = (heartbeat: CompanyHeartbeat): void => {
  try {
    localStorage.setItem(COMPANY_HEART_KEY, JSON.stringify(heartbeat));
  } catch (e) {
    console.error('No se pudo guardar el latido del corazón', e);
  }
};

export const saveCompanyFolderPath = (path: string): void => {
  localStorage.setItem(COMPANY_FOLDER_PATH_KEY, path);
};

export const getCompanyFolderPath = (): string | null => {
  return localStorage.getItem(COMPANY_FOLDER_PATH_KEY);
};

const createEmptyHeartbeat = (): CompanyHeartbeat => ({
  ingresos: [],
  gastos: [],
  produccion: [],
  salarios: [],
  contratos: [],
  reportes: [],
  desconocidos: [],
  lastBeat: new Date().toISOString(),
});

/**
 * Detecta el tipo de documento basado en nombre y contenido
 */
export const detectDocumentType = (fileName: string, content?: string): CompanyDocument['type'] => {
  const lower = fileName.toLowerCase();

  if (lower.includes('ingreso') || lower.includes('income') || lower.includes('cash in')) {
    return 'ingreso';
  }
  
  if (
    lower.includes('gasto') ||
    lower.includes('expense') ||
    lower.includes('payable') ||
    lower.includes('payment plan') ||
    lower.includes('payment') ||
    lower.includes('rent') ||
    lower.includes('luz') ||
    lower.includes('energia')
  ) {
    return 'gasto';
  }
  
  if (lower.includes('production billing') || lower.includes('invoice')) {
    return 'ingreso';
  }

  if (lower.includes('production') || lower.includes('billing') || lower.includes('produccion')) {
    return 'produccion';
  }
  
  if (lower.includes('salary') || lower.includes('salario') || lower.includes('13th month')) {
    return 'salario';
  }
  
  if (lower.includes('contract') || lower.includes('contrato') || lower.includes('agreement')) {
    return 'contrato';
  }
  
  if (lower.includes('report') || lower.includes('reporte') || lower.includes('overview')) {
    return 'reporte';
  }

  return 'desconocido';
};

/**
 * Extrae fecha del nombre del archivo (formato común: YYYYMMDD o YYYYMMDD)
 */
export const extractDateFromFileName = (fileName: string): string | undefined => {
  // Busca patrones como 20260203, 2026-02-03, etc.
  const patterns = [
    /(\d{4})(\d{2})(\d{2})/,           // 20260203
    /(\d{4})-(\d{2})-(\d{2})/,         // 2026-02-03
    /(\d{4})\.(\d{2})\.(\d{2})/,       // 2026.02.03
  ];

  for (const pattern of patterns) {
    const match = fileName.match(pattern);
    if (match) {
      const [, year, month, day] = match;
      return `${year}-${month}-${day}`;
    }
  }

  return undefined;
};

const extractAmountFromFileName = (fileName: string): number | undefined => {
  const lower = fileName.toLowerCase();
  const hasCurrency = lower.includes('usd') || lower.includes('us$') || lower.includes('$');
  const hasK = /\b\d+(?:\.\d+)?k\b/.test(lower);

  if (!hasCurrency && !hasK) return undefined;

  const kMatch = lower.match(/\b(\d+(?:\.\d+)?)k\b/);
  if (kMatch) {
    return parseFloat(kMatch[1]) * 1000;
  }

  const currencyMatch = lower.match(/\$\s*([\d,.]+)/) || lower.match(/([\d,.]+)\s*(usd|us\$)/);
  if (!currencyMatch) return undefined;

  const raw = currencyMatch[1].replace(/,/g, '');
  const parsed = parseFloat(raw);
  return Number.isNaN(parsed) ? undefined : parsed;
};

/**
 * Extrae montos del contenido del archivo (heurística básica)
 */
export const extractAmountFromContent = (content: string): number | undefined => {
  // Busca patrones como $1,234.56 o 1234.56 o 1,234
  const patterns = [
    /\$?\s*([\d,]+\.?\d*)/g,
    /total[:\s]+([\d,]+\.?\d*)/gi,
    /amount[:\s]+([\d,]+\.?\d*)/gi,
  ];

  const amounts: number[] = [];

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const numStr = match[1].replace(/,/g, '');
      const num = parseFloat(numStr);
      if (!isNaN(num) && num > 0) {
        amounts.push(num);
      }
    }
  }

  // Retorna el monto más grande encontrado
  return amounts.length > 0 ? Math.max(...amounts) : undefined;
};

/**
 * Crea un documento desde un archivo
 */
export const createCompanyDocument = (
  fileName: string,
  filePath: string,
  content?: string,
  fileModifiedAt?: string
): CompanyDocument => {
  const type = detectDocumentType(fileName, content);
  const detectedDate = extractDateFromFileName(fileName);
  const detectedAmount = content
    ? extractAmountFromContent(content)
    : extractAmountFromFileName(fileName);

  return {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    fileName,
    filePath,
    type,
    detectedDate,
    detectedAmount,
    rawContent: content,
    fileModifiedAt,
    addedAt: new Date().toISOString(),
  };
};

const normalizeDocKey = (fileName: string): string => {
  return fileName
    .toLowerCase()
    .replace(/copy of\s*/g, '')
    .replace(/\(\d+\)/g, '')
    .replace(/copy/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

const getDocTimestamp = (doc: CompanyDocument): number => {
  if (doc.fileModifiedAt) {
    const parsed = Date.parse(doc.fileModifiedAt);
    if (!Number.isNaN(parsed)) return parsed;
  }
  return Date.parse(doc.addedAt);
};

export const getDocumentDate = (doc: CompanyDocument): string => {
  return (
    doc.detectedDate ||
    doc.fileModifiedAt ||
    doc.addedAt ||
    new Date().toISOString()
  );
};

export const dedupeHeartbeat = (heartbeat: CompanyHeartbeat): CompanyHeartbeat => {
  const allDocs = [
    ...heartbeat.ingresos,
    ...heartbeat.gastos,
    ...heartbeat.produccion,
    ...heartbeat.salarios,
    ...heartbeat.contratos,
    ...heartbeat.reportes,
    ...heartbeat.desconocidos,
  ];

  const latestByKey = new Map<string, CompanyDocument>();
  allDocs.forEach((doc) => {
    const key = normalizeDocKey(doc.fileName);
    const existing = latestByKey.get(key);
    if (!existing || getDocTimestamp(doc) > getDocTimestamp(existing)) {
      latestByKey.set(key, doc);
    }
  });

  const next: CompanyHeartbeat = {
    ingresos: [],
    gastos: [],
    produccion: [],
    salarios: [],
    contratos: [],
    reportes: [],
    desconocidos: [],
    lastBeat: heartbeat.lastBeat,
  };

  latestByKey.forEach((doc) => {
    switch (doc.type) {
      case 'ingreso':
        next.ingresos.push(doc);
        break;
      case 'gasto':
        next.gastos.push(doc);
        break;
      case 'produccion':
        next.produccion.push(doc);
        break;
      case 'salario':
        next.salarios.push(doc);
        break;
      case 'contrato':
        next.contratos.push(doc);
        break;
      case 'reporte':
        next.reportes.push(doc);
        break;
      default:
        next.desconocidos.push(doc);
    }
  });

  return next;
};

/**
 * Agrega un documento al latido del corazón
 */
export const addDocumentToHeartbeat = (doc: CompanyDocument): void => {
  const heartbeat = loadCompanyHeartbeat();
  
  // Evitar duplicados conservando el más reciente
  const allDocs = [
    ...heartbeat.ingresos,
    ...heartbeat.gastos,
    ...heartbeat.produccion,
    ...heartbeat.salarios,
    ...heartbeat.contratos,
    ...heartbeat.reportes,
    ...heartbeat.desconocidos,
  ];
  const docKey = normalizeDocKey(doc.fileName);
  const matchingDocs = allDocs.filter((d) => normalizeDocKey(d.fileName) === docKey);
  if (matchingDocs.length > 0) {
    const newestExisting = matchingDocs.reduce((latest, current) =>
      getDocTimestamp(current) > getDocTimestamp(latest) ? current : latest
    );
    if (getDocTimestamp(newestExisting) >= getDocTimestamp(doc)) {
      return;
    }
  }

  const purgeByKey = (docs: CompanyDocument[]) =>
    docs.filter((d) => normalizeDocKey(d.fileName) !== docKey);

  heartbeat.ingresos = purgeByKey(heartbeat.ingresos);
  heartbeat.gastos = purgeByKey(heartbeat.gastos);
  heartbeat.produccion = purgeByKey(heartbeat.produccion);
  heartbeat.salarios = purgeByKey(heartbeat.salarios);
  heartbeat.contratos = purgeByKey(heartbeat.contratos);
  heartbeat.reportes = purgeByKey(heartbeat.reportes);
  heartbeat.desconocidos = purgeByKey(heartbeat.desconocidos);

  // Agregar al array correspondiente
  switch (doc.type) {
    case 'ingreso':
      heartbeat.ingresos.push(doc);
      break;
    case 'gasto':
      heartbeat.gastos.push(doc);
      break;
    case 'produccion':
      heartbeat.produccion.push(doc);
      break;
    case 'salario':
      heartbeat.salarios.push(doc);
      break;
    case 'contrato':
      heartbeat.contratos.push(doc);
      break;
    case 'reporte':
      heartbeat.reportes.push(doc);
      break;
    default:
      heartbeat.desconocidos.push(doc);
  }

  heartbeat.lastBeat = new Date().toISOString();
  const deduped = dedupeHeartbeat(heartbeat);
  saveCompanyHeartbeat(deduped);
};

/**
 * Obtiene estadísticas del corazón
 */
export const getHeartbeatStats = () => {
  const heartbeat = loadCompanyHeartbeat();
  
  const totalIngresos = heartbeat.ingresos.reduce((sum, doc) => 
    sum + (doc.detectedAmount || 0), 0
  );
  
  const totalGastos =
    heartbeat.gastos.reduce((sum, doc) => sum + (doc.detectedAmount || 0), 0) +
    heartbeat.salarios.reduce((sum, doc) => sum + (doc.detectedAmount || 0), 0);

  const balance = totalIngresos - totalGastos;
  const totalDocuments =
    heartbeat.ingresos.length +
    heartbeat.gastos.length +
    heartbeat.produccion.length +
    heartbeat.salarios.length +
    heartbeat.contratos.length +
    heartbeat.reportes.length +
    heartbeat.desconocidos.length;

  return {
    totalDocuments,
    totalIngresos,
    totalGastos,
    balance,
    ingresosCount: heartbeat.ingresos.length,
    gastosCount: heartbeat.gastos.length,
    produccionCount: heartbeat.produccion.length,
    salariosCount: heartbeat.salarios.length,
    missingAmountCount:
      heartbeat.ingresos.filter((d) => d.detectedAmount === undefined).length +
      heartbeat.gastos.filter((d) => d.detectedAmount === undefined).length +
      heartbeat.salarios.filter((d) => d.detectedAmount === undefined).length,
    lastBeat: heartbeat.lastBeat,
  };
};

export const getHeartbeatTimeSeries = (days = 30) => {
  const heartbeat = loadCompanyHeartbeat();
  const series = new Map<string, { date: string; ingresos: number; gastos: number }>();
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const key = date.toISOString().split('T')[0];
    series.set(key, { date: key, ingresos: 0, gastos: 0 });
  }

  const pushAmount = (doc: CompanyDocument, kind: 'ingresos' | 'gastos') => {
    if (doc.detectedAmount === undefined) return;
    const dateKey = getDocumentDate(doc).split('T')[0];
    if (!series.has(dateKey)) return;
    const row = series.get(dateKey);
    if (!row) return;
    row[kind] += doc.detectedAmount;
  };

  heartbeat.ingresos.forEach((doc) => pushAmount(doc, 'ingresos'));
  heartbeat.gastos.forEach((doc) => pushAmount(doc, 'gastos'));
  heartbeat.salarios.forEach((doc) => pushAmount(doc, 'gastos'));

  return Array.from(series.values()).map((row) => ({
    ...row,
    balance: row.ingresos - row.gastos,
  }));
};

export const getHeartbeatCategorySummary = () => {
  const heartbeat = loadCompanyHeartbeat();
  const allDocs = [
    ...heartbeat.ingresos,
    ...heartbeat.gastos,
    ...heartbeat.produccion,
    ...heartbeat.salarios,
    ...heartbeat.contratos,
    ...heartbeat.reportes,
    ...heartbeat.desconocidos,
  ];

  const categorize = (path: string) => {
    const lower = path.toLowerCase();
    if (lower.includes('pagos')) return 'Pagos';
    if (lower.includes('prara')) return 'PRARA';
    if (lower.includes('production') || lower.includes('billing')) return 'Produccion';
    if (lower.includes('salary') || lower.includes('salario')) return 'Salarios';
    if (lower.includes('energy') || lower.includes('energia') || lower.includes('luz')) return 'Energia';
    if (lower.includes('invoice')) return 'Facturas';
    if (lower.includes('report')) return 'Reportes';
    return 'Otros';
  };

  const summary = new Map<string, { count: number }>();
  allDocs.forEach((doc) => {
    const key = categorize(doc.filePath || doc.fileName);
    const row = summary.get(key) || { count: 0 };
    row.count += 1;
    summary.set(key, row);
  });

  return Array.from(summary.entries()).map(([category, data]) => ({
    category,
    count: data.count,
  }));
};
