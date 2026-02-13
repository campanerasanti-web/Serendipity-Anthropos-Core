/**
 * PROTOCOLO TET - PREPARACIÓN PRUEBA PILOTO
 * 
 * Sistema de carga masiva de órdenes reales para el Año Nuevo Lunar (Tết)
 * - Importación desde CSV/Excel
 * - Generación automática de QR codes
 * - Asignación a operarios vietnamitas
 * - Interfaz de monitoreo en tiempo real
 * 
 * "El Tết es el momento de comenzar con energía renovada"
 */

import { useState, useCallback } from 'react';
import { Order, TrafficLightStatus } from './useQRTracking';

export interface TETOrder {
  customerName: string;
  product: string;
  quantity: number;
  dueDate: string; // ISO string
  priority: 'high' | 'medium' | 'low';
  assignedTo?: string;
  notes?: string;
}

export interface TETBatchImport {
  id: string;
  timestamp: Date;
  totalOrders: number;
  successfulImports: number;
  failedImports: number;
  errors: Array<{
    row: number;
    reason: string;
  }>;
  orders: Order[];
}

export interface TETStats {
  totalOrders: number;
  redCount: number;
  amberCount: number;
  greenCount: number;
  overdueCount: number;
  assignedToVietnamese: number;
  avgCompletionTime: number; // hours
  readinessScore: number; // 0-100
}

/**
 * Hook para el Protocolo TET
 */
export const useTETProtocol = () => {
  const [isReady, setIsReady] = useState(false);
  const [stats, setStats] = useState<TETStats>({
    totalOrders: 0,
    redCount: 0,
    amberCount: 0,
    greenCount: 0,
    overdueCount: 0,
    assignedToVietnamese: 0,
    avgCompletionTime: 0,
    readinessScore: 0,
  });
  const [lastImport, setLastImport] = useState<TETBatchImport | null>(null);

  /**
   * Convierte datos CSV a objetos TETOrder
   */
  const parseCSV = (csvText: string): TETOrder[] => {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map((h) => h.trim());
    
    const orders: TETOrder[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map((v) => v.trim());
      
      const order: TETOrder = {
        customerName: values[headers.indexOf('customer')] || '',
        product: values[headers.indexOf('product')] || '',
        quantity: parseInt(values[headers.indexOf('quantity')] || '0'),
        dueDate: values[headers.indexOf('dueDate')] || new Date().toISOString(),
        priority: (values[headers.indexOf('priority')] as any) || 'medium',
        assignedTo: values[headers.indexOf('assignedTo')] || undefined,
        notes: values[headers.indexOf('notes')] || undefined,
      };
      
      orders.push(order);
    }
    
    return orders;
  };

  /**
   * Convierte TETOrder a Order con QR code
   */
  const convertToOrder = (tetOrder: TETOrder): Order => {
    const orderId = `TET-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 5)}`.toUpperCase();
    const qrCode = `https://serendipitybros.com/orders/${orderId}`;
    
    // Determinar estado inicial según prioridad y fecha
    let initialStatus: TrafficLightStatus = 'amber';
    const dueDate = new Date(tetOrder.dueDate);
    const now = new Date();
    const hoursUntilDue = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (tetOrder.priority === 'high' || hoursUntilDue < 24) {
      initialStatus = 'red';
    } else if (hoursUntilDue > 72) {
      initialStatus = 'amber';
    }
    
    return {
      id: orderId,
      qrCode,
      status: initialStatus,
      customer: tetOrder.customerName,
      product: tetOrder.product,
      quantity: tetOrder.quantity,
      dueDate,
      createdAt: now,
      updatedAt: now,
      statusHistory: [
        {
          status: initialStatus,
          timestamp: now,
          reason: 'Orden creada en Protocolo TET',
        },
      ],
      notes: tetOrder.notes,
      assignedTo: tetOrder.assignedTo,
    };
  };

  /**
   * Importa órdenes desde CSV
   */
  const importFromCSV = useCallback((csvText: string): TETBatchImport => {
    const batchId = `BATCH-${Date.now()}`;
    const tetOrders = parseCSV(csvText);
    const orders: Order[] = [];
    const errors: TETBatchImport['errors'] = [];
    
    tetOrders.forEach((tetOrder, index) => {
      try {
        const order = convertToOrder(tetOrder);
        orders.push(order);
      } catch (error) {
        errors.push({
          row: index + 2, // +2 para contar header y 0-index
          reason: error instanceof Error ? error.message : 'Error desconocido',
        });
      }
    });
    
    const batchImport: TETBatchImport = {
      id: batchId,
      timestamp: new Date(),
      totalOrders: tetOrders.length,
      successfulImports: orders.length,
      failedImports: errors.length,
      errors,
      orders,
    };
    
    setLastImport(batchImport);
    
    // Guardar en localStorage
    const existingOrders = JSON.parse(localStorage.getItem('serendipity-qr-orders') || '[]');
    const allOrders = [...existingOrders, ...orders];
    localStorage.setItem('serendipity-qr-orders', JSON.stringify(allOrders));
    
    // Actualizar stats
    calculateStats(allOrders);
    
    return batchImport;
  }, []);

  /**
   * Genera órdenes de prueba para TET
   */
  const generateTestOrders = useCallback((count: number = 20): TETBatchImport => {
    const customers = ['PRARA', 'VinCorp', 'Saigon Trading', 'Hanoi Industries', 'Da Nang Exports'];
    const products = ['Caja Premium', 'Embalaje Estándar', 'Set Regalo', 'Pack Especial TET', 'Caja Lujo'];
    const vietnameseWorkers = ['Nguyen Van A', 'Tran Thi B', 'Le Van C', 'Pham Thi D', 'Hoang Van E'];
    const priorities: Array<'high' | 'medium' | 'low'> = ['high', 'high', 'medium', 'medium', 'low'];
    
    const tetOrders: TETOrder[] = [];
    const now = new Date();
    
    for (let i = 0; i < count; i++) {
      const daysOffset = Math.floor(Math.random() * 10) - 2; // -2 a +7 días
      const dueDate = new Date(now.getTime() + daysOffset * 24 * 60 * 60 * 1000);
      
      tetOrders.push({
        customerName: customers[Math.floor(Math.random() * customers.length)],
        product: products[Math.floor(Math.random() * products.length)],
        quantity: Math.floor(Math.random() * 500) + 100,
        dueDate: dueDate.toISOString(),
        priority: priorities[Math.floor(Math.random() * priorities.length)],
        assignedTo: i % 3 === 0 ? vietnameseWorkers[Math.floor(Math.random() * vietnameseWorkers.length)] : undefined,
        notes: i % 5 === 0 ? 'Orden especial para TET - cliente VIP' : undefined,
      });
    }
    
    // Convertir a CSV y luego importar
    const csvLines = ['customer,product,quantity,dueDate,priority,assignedTo,notes'];
    tetOrders.forEach((order) => {
      csvLines.push(
        `${order.customerName},${order.product},${order.quantity},${order.dueDate},${order.priority},${order.assignedTo || ''},${order.notes || ''}`
      );
    });
    const csvText = csvLines.join('\n');
    
    return importFromCSV(csvText);
  }, [importFromCSV]);

  /**
   * Calcula estadísticas de órdenes
   */
  const calculateStats = useCallback((orders: Order[]) => {
    const now = new Date();
    
    const redCount = orders.filter((o) => o.status === 'red').length;
    const amberCount = orders.filter((o) => o.status === 'amber').length;
    const greenCount = orders.filter((o) => o.status === 'green').length;
    
    const overdueCount = orders.filter(
      (o) => o.status !== 'green' && new Date(o.dueDate) < now
    ).length;
    
    const assignedToVietnamese = orders.filter((o) =>
      o.assignedTo && (
        o.assignedTo.includes('Nguyen') ||
        o.assignedTo.includes('Tran') ||
        o.assignedTo.includes('Le') ||
        o.assignedTo.includes('Pham') ||
        o.assignedTo.includes('Hoang')
      )
    ).length;
    
    // Calcular tiempo promedio de completado (solo completadas)
    const completedOrders = orders.filter((o) => o.status === 'green');
    let totalHours = 0;
    completedOrders.forEach((order) => {
      const created = new Date(order.createdAt);
      const completed = order.statusHistory.find((h) => h.status === 'green');
      if (completed) {
        totalHours += (new Date(completed.timestamp).getTime() - created.getTime()) / (1000 * 60 * 60);
      }
    });
    const avgCompletionTime = completedOrders.length > 0 ? totalHours / completedOrders.length : 0;
    
    // Calcular readiness score (0-100)
    // - 40% basado en % de órdenes no vencidas
    // - 30% basado en % de órdenes con QR asignado
    // - 30% basado en distribución a operarios vietnamitas
    const notOverduePercent = orders.length > 0 ? ((orders.length - overdueCount) / orders.length) * 100 : 100;
    const allHaveQR = 100; // Todas tienen QR por diseño
    const assignmentPercent = orders.length > 0 ? (assignedToVietnamese / orders.length) * 100 : 0;
    
    const readinessScore = (notOverduePercent * 0.4) + (allHaveQR * 0.3) + (assignmentPercent * 0.3);
    
    setStats({
      totalOrders: orders.length,
      redCount,
      amberCount,
      greenCount,
      overdueCount,
      assignedToVietnamese,
      avgCompletionTime: Math.round(avgCompletionTime * 10) / 10,
      readinessScore: Math.round(readinessScore),
    });
    
    // Sistema se considera listo si readiness > 70%
    setIsReady(readinessScore >= 70);
  }, []);

  /**
   * Activa el protocolo TET (verifica que todo esté listo)
   */
  const activateTETProtocol = useCallback((): { success: boolean; message: string } => {
    const orders = JSON.parse(localStorage.getItem('serendipity-qr-orders') || '[]');
    
    if (orders.length === 0) {
      return {
        success: false,
        message: 'No hay órdenes cargadas. Importa órdenes primero.',
      };
    }
    
    calculateStats(orders);
    
    if (stats.readinessScore < 70) {
      return {
        success: false,
        message: `Readiness Score: ${stats.readinessScore}%. Requiere al menos 70% para activar.`,
      };
    }
    
    setIsReady(true);
    
    return {
      success: true,
      message: `✅ Protocolo TET activado. ${orders.length} órdenes listas para el Año Nuevo Lunar.`,
    };
  }, [stats.readinessScore, calculateStats]);

  /**
   * Genera reporte de preparación TET
   */
  const generateTETReport = useCallback((): string => {
    const report = `
🎊 REPORTE PROTOCOLO TET - ${new Date().toLocaleDateString('es-ES')}

📊 ESTADÍSTICAS GENERALES:
   - Total órdenes: ${stats.totalOrders}
   - 🔴 Rojas (urgentes): ${stats.redCount}
   - 🟡 Ámbar (en proceso): ${stats.amberCount}
   - 🟢 Verdes (completadas): ${stats.greenCount}
   - ⚠️ Vencidas: ${stats.overdueCount}

👷 EQUIPO VIETNAMITA:
   - Órdenes asignadas: ${stats.assignedToVietnamese}
   - Cobertura: ${stats.totalOrders > 0 ? Math.round((stats.assignedToVietnamese / stats.totalOrders) * 100) : 0}%

⏱️ RENDIMIENTO:
   - Tiempo promedio completado: ${stats.avgCompletionTime}h
   - Readiness Score: ${stats.readinessScore}%

${lastImport ? `
📥 ÚLTIMA IMPORTACIÓN:
   - Batch ID: ${lastImport.id}
   - Fecha: ${lastImport.timestamp.toLocaleString('es-ES')}
   - Total procesadas: ${lastImport.totalOrders}
   - ✅ Exitosas: ${lastImport.successfulImports}
   - ❌ Fallidas: ${lastImport.failedImports}
${lastImport.errors.length > 0 ? `   - Errores: ${lastImport.errors.map((e) => `Fila ${e.row}: ${e.reason}`).join(', ')}` : ''}
` : ''}

${isReady ? '✅ SISTEMA LISTO PARA PRUEBA PILOTO' : '⚠️ SISTEMA REQUIERE AJUSTES'}
${stats.readinessScore < 70 ? `   - Mejora necesaria: +${70 - stats.readinessScore}% para activar` : ''}

🕯️ "El Tết es el momento de comenzar con energía renovada"
`;
    
    return report.trim();
  }, [stats, lastImport, isReady]);

  return {
    isReady,
    stats,
    lastImport,
    importFromCSV,
    generateTestOrders,
    calculateStats,
    activateTETProtocol,
    generateTETReport,
  };
};
