/**
 * Sistema de memoria viva del jardin
 * Construye su propia base de datos desde documentos recibidos
 */

export interface PaymentRecord {
  id: string;
  date: string;
  amount: number;
  type: 'ingreso' | 'pago';
  description: string;
  source: string;
  createdAt: string;
}

export interface WipRecord {
  id: string;
  clientName: string;
  orderNumber: string;
  status: 'WIP' | 'pendiente' | 'completado';
  addedAt: string;
}

export type JobCardStatus =
  | 'grabado'
  | 'planchado'
  | 'hablandado'
  | 'medicion'
  | 'completado'
  | 'reproceso';

export interface VendorUser {
  id: string;
  name: string;
  active: boolean;
  createdAt: string;
}

export interface VendorRecord {
  id: string;
  name: string;
  users: VendorUser[];
  activeUserId: string;
  createdAt: string;
}

export interface PurchaseOrderRecord {
  id: string;
  vendor: string;
  vendorId?: string;
  idCode: string;
  item: string;
  quantity: string;
  deliveryDate: string;
  colorTone: 'negro' | 'color';
  notes: string;
  status: 'abierta' | 'cerrada';
  createdAt: string;
}

export interface JobCardRecord {
  id: string;
  poId: string;
  idCode: string;
  title: string;
  status: JobCardStatus;
  productionNotes: string;
  assignedAgent: 'ops_gardener' | 'anthropos_core';
  supportAgent?: 'ops_gardener' | 'anthropos_core';
  reprocess?: {
    steps: JobCardStatus[];
    comment: string;
    createdBy: string;
    requestedAt: string;
  };
  history: Array<{ status: JobCardStatus; at: string }>;
  createdAt: string;
  updatedAt: string;
}

export interface GeneratedDocumentRecord {
  id: string;
  jobCardId: string;
  type: 'invoice' | 'packing_list';
  reference: string;
  createdAt: string;
}

export interface GardenMemory {
  payments: PaymentRecord[];
  wips: WipRecord[];
  vendors: VendorRecord[];
  purchaseOrders: PurchaseOrderRecord[];
  jobCards: JobCardRecord[];
  generatedDocuments: GeneratedDocumentRecord[];
  lastSync: string;
}

const STORAGE_KEY = 'sofia_garden_memory';

export const loadGardenMemory = (): GardenMemory => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return {
        payments: [],
        wips: [],
        vendors: [],
        purchaseOrders: [],
        jobCards: [],
        generatedDocuments: [],
        lastSync: new Date().toISOString(),
      };
    }
    return JSON.parse(stored);
  } catch {
    return {
      payments: [],
      wips: [],
      vendors: [],
      purchaseOrders: [],
      jobCards: [],
      generatedDocuments: [],
      lastSync: new Date().toISOString(),
    };
  }
};

export const saveGardenMemory = (memory: GardenMemory): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memory));
  } catch (e) {
    console.error('No se pudo guardar la memoria del jardin', e);
  }
};

export const addPaymentRecord = (payment: Omit<PaymentRecord, 'id' | 'createdAt'>): void => {
  const memory = loadGardenMemory();
  const newRecord: PaymentRecord = {
    ...payment,
    id: `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
  };
  memory.payments.push(newRecord);
  memory.lastSync = new Date().toISOString();
  saveGardenMemory(memory);
};

export const addWipRecord = (wip: Omit<WipRecord, 'id' | 'addedAt'>): void => {
  const memory = loadGardenMemory();
  const newRecord: WipRecord = {
    ...wip,
    id: `wip_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    addedAt: new Date().toISOString(),
  };
  memory.wips.push(newRecord);
  memory.lastSync = new Date().toISOString();
  saveGardenMemory(memory);
};

const createId = (prefix: string): string => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const createVendorUser = (vendorName: string): VendorUser => {
  const now = new Date().toISOString();
  return {
    id: createId('vendor_user'),
    name: `${vendorName} User`.replace(/\s+/g, ' ').trim(),
    active: true,
    createdAt: now,
  };
};

export const getVendors = (): VendorRecord[] => {
  const memory = loadGardenMemory();
  return memory.vendors || [];
};

export const ensureVendor = (vendorName: string): VendorRecord => {
  const memory = loadGardenMemory();
  const normalized = vendorName.trim();
  const existing = (memory.vendors || []).find(
    (vendor) => vendor.name.toLowerCase() === normalized.toLowerCase()
  );

  if (existing) {
    return existing;
  }

  const user = createVendorUser(normalized);
  const newVendor: VendorRecord = {
    id: createId('vendor'),
    name: normalized,
    users: [user],
    activeUserId: user.id,
    createdAt: new Date().toISOString(),
  };

  memory.vendors = [...(memory.vendors || []), newVendor];
  memory.lastSync = new Date().toISOString();
  saveGardenMemory(memory);
  return newVendor;
};

export const addPurchaseOrder = (
  po: Omit<PurchaseOrderRecord, 'id' | 'createdAt' | 'status'>
): PurchaseOrderRecord => {
  const vendor = ensureVendor(po.vendor);
  const memory = loadGardenMemory();
  const newRecord: PurchaseOrderRecord = {
    ...po,
    vendor: vendor.name,
    id: createId('po'),
    vendorId: vendor.id,
    status: 'abierta',
    createdAt: new Date().toISOString(),
  };
  memory.purchaseOrders.push(newRecord);
  memory.lastSync = new Date().toISOString();
  saveGardenMemory(memory);
  return newRecord;
};

export const addJobCardRecord = (
  jobCard: Omit<JobCardRecord, 'id' | 'createdAt' | 'updatedAt' | 'history'>
): JobCardRecord => {
  const memory = loadGardenMemory();
  const now = new Date().toISOString();
  const newRecord: JobCardRecord = {
    ...jobCard,
    id: createId('jobcard'),
    createdAt: now,
    updatedAt: now,
    history: [{ status: jobCard.status, at: now }],
  };
  memory.jobCards.push(newRecord);
  memory.lastSync = now;
  saveGardenMemory(memory);
  return newRecord;
};

const ensureGeneratedDocuments = (memory: GardenMemory, jobCardId: string): void => {
  const existing = memory.generatedDocuments.filter((doc) => doc.jobCardId === jobCardId);
  const now = new Date().toISOString();

  if (!existing.find((doc) => doc.type === 'invoice')) {
    memory.generatedDocuments.push({
      id: createId('doc'),
      jobCardId,
      type: 'invoice',
      reference: `INV-${jobCardId.slice(-6).toUpperCase()}`,
      createdAt: now,
    });
  }

  if (!existing.find((doc) => doc.type === 'packing_list')) {
    memory.generatedDocuments.push({
      id: createId('doc'),
      jobCardId,
      type: 'packing_list',
      reference: `PKL-${jobCardId.slice(-6).toUpperCase()}`,
      createdAt: now,
    });
  }
};

export const updateJobCardStatus = (jobCardId: string, status: JobCardStatus): void => {
  const memory = loadGardenMemory();
  const jobIndex = memory.jobCards.findIndex((job) => job.id === jobCardId);
  if (jobIndex === -1) return;

  const now = new Date().toISOString();
  const jobCard = memory.jobCards[jobIndex];
  if (jobCard.status === status) return;

  const updated: JobCardRecord = {
    ...jobCard,
    status,
    updatedAt: now,
    history: [...jobCard.history, { status, at: now }],
  };
  memory.jobCards[jobIndex] = updated;

  if (status === 'medicion') {
    ensureGeneratedDocuments(memory, jobCardId);
  }

  memory.lastSync = now;
  saveGardenMemory(memory);
};

export const requestJobCardReprocess = (
  jobCardId: string,
  steps: JobCardStatus[],
  comment: string,
  createdBy: string
): void => {
  const memory = loadGardenMemory();
  const jobIndex = memory.jobCards.findIndex((job) => job.id === jobCardId);
  if (jobIndex === -1) return;

  const now = new Date().toISOString();
  const jobCard = memory.jobCards[jobIndex];
  const updated: JobCardRecord = {
    ...jobCard,
    status: 'reproceso',
    updatedAt: now,
    reprocess: {
      steps,
      comment,
      createdBy,
      requestedAt: now,
    },
    history: [...jobCard.history, { status: 'reproceso', at: now }],
  };

  memory.jobCards[jobIndex] = updated;
  memory.lastSync = now;
  saveGardenMemory(memory);
};

export const getJobCardByIdCode = (idCode: string): JobCardRecord | null => {
  const memory = loadGardenMemory();
  const normalized = idCode.trim().toLowerCase();
  return (
    memory.jobCards.find((job) => job.idCode.toLowerCase() === normalized) || null
  );
};

export const getMonthlyIncomes = (month: number, year: number): number => {
  const memory = loadGardenMemory();
  return memory.payments
    .filter((p) => {
      const date = new Date(p.date);
      return (
        p.type === 'ingreso' &&
        date.getMonth() + 1 === month &&
        date.getFullYear() === year
      );
    })
    .reduce((sum, p) => sum + p.amount, 0);
};

export const getActiveWipCount = (): number => {
  const memory = loadGardenMemory();
  const wipCount = memory.wips.filter((w) => w.status === 'WIP').length;
  const jobCount = (memory.jobCards || []).filter((job) => job.status !== 'completado').length;
  return wipCount + jobCount;
};

export const parsePaymentDocument = (
  fileName: string,
  content: string
): Omit<PaymentRecord, 'id' | 'createdAt'> | null => {
  // Parsea archivos de texto o CSV con pagos/cobros
  // Adapta esto según el formato real de tus archivos
  try {
    const lines = content.split('\n').filter((l) => l.trim());
    if (lines.length < 2) return null;

    const firstLine = lines[0];
    const match = firstLine.match(/(\d{4}-\d{2}-\d{2}).*(\d+[\.,]\d{2})/);
    if (!match) return null;

    const [, date, amountStr] = match;
    const amount = parseFloat(amountStr.replace(',', '.'));

    return {
      date,
      amount,
      type: amount > 0 ? 'ingreso' : 'pago',
      description: firstLine,
      source: fileName,
    };
  } catch {
    return null;
  }
};
