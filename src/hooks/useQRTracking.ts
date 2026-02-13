/**
 * TRAZABILIDAD QR Y SEMÁFORO
 * Sistema de seguimiento de órdenes con códigos QR únicos
 * 
 * "Cada código es un rastro de luz en el camino de la producción"
 */

import { useState, useEffect, useCallback } from 'react';
import apiClient from '../api/apiClient';
import { useOfflineSync } from './useOfflineSync';

export type TrafficLightStatus = 'red' | 'amber' | 'green';

export interface OrderStatusHistory {
  status: TrafficLightStatus;
  timestamp: Date;
  reason?: string;
  updatedBy?: string;
}

export interface Order {
  id: string;
  qrCode: string;           // Unique QR data (URL encoded)
  status: TrafficLightStatus;
  customer: string;
  product: string;
  quantity: number;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
  statusHistory: OrderStatusHistory[];
  notes?: string;
  assignedTo?: string;
  isPendingSync?: boolean;
}

/**
 * Genera un ID único para órdenes
 */
const generateOrderId = (): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 9);
  return `ORD-${timestamp}-${random}`.toUpperCase();
};

/**
 * Genera datos para QR Code
 */
const generateQRData = (orderId: string): string => {
  // URL que apunta al sistema con el ID de la orden
  const baseUrl = 'https://serendipitybros.com/orders';
  return `${baseUrl}/${orderId}`;
};

const mapStatusToTraffic = (status: string): TrafficLightStatus => {
  switch (status) {
    case 'completed':
      return 'green';
    case 'in-progress':
      return 'amber';
    case 'pending':
    case 'cancelled':
    default:
      return 'red';
  }
};

const mapTrafficToStatus = (status: TrafficLightStatus): string => {
  switch (status) {
    case 'green':
      return 'completed';
    case 'amber':
      return 'in-progress';
    case 'red':
    default:
      return 'pending';
  }
};

/**
 * Determina el color según el estado
 */
export const getStatusColor = (status: TrafficLightStatus): string => {
  switch (status) {
    case 'red':
      return '#ef4444'; // red-500
    case 'amber':
      return '#f59e0b'; // amber-500
    case 'green':
      return '#10b981'; // green-500
  }
};

/**
 * Determina el emoji según el estado
 */
export const getStatusEmoji = (status: TrafficLightStatus): string => {
  switch (status) {
    case 'red':
      return '🔴';
    case 'amber':
      return '🟡';
    case 'green':
      return '🟢';
  }
};

/**
 * Determina el label según el estado
 */
export const getStatusLabel = (
  status: TrafficLightStatus,
  language: 'es' | 'vi' | 'en' = 'es'
): string => {
  const labels = {
    red: { es: 'Urgente', vi: 'Khẩn cấp', en: 'Urgent' },
    amber: { es: 'En Proceso', vi: 'Đang xử lý', en: 'In Progress' },
    green: { es: 'Completado', vi: 'Hoàn thành', en: 'Completed' },
  };
  return labels[status][language];
};

/**
 * Hook para gestión de órdenes con QR
 */
export const useQRTracking = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { queueSync, syncPendingChanges, isOnline } = useOfflineSync();

  const cacheKey = 'serendipity-qr-orders-cache';

  const mapApiOrder = (order: any, history?: any[]): Order => {
    const statusHistory = history
      ? history.map((item) => ({
          status: mapStatusToTraffic(item.newStatus || item.NewStatus || ''),
          timestamp: new Date(item.changedAt || item.ChangedAt),
          reason: item.reason || item.Reason,
          updatedBy: item.changedBy || item.ChangedBy,
        }))
      : [];

    if (statusHistory.length === 0) {
      statusHistory.push({
        status: mapStatusToTraffic(order.status || order.Status),
        timestamp: new Date(order.createdAt || order.CreatedAt),
        reason: 'Orden creada',
        updatedBy: 'system'
      });
    }

    return {
      id: order.id || order.Id,
      qrCode: order.qrCode || order.QrCode,
      status: mapStatusToTraffic(order.status || order.Status),
      customer: order.customer || order.Customer,
      product: order.product || order.Product,
      quantity: order.quantity || order.Quantity,
      dueDate: new Date(order.dueDate || order.DueDate),
      createdAt: new Date(order.createdAt || order.CreatedAt),
      updatedAt: new Date(order.updatedAt || order.UpdatedAt),
      statusHistory,
      notes: order.notes || order.Notes,
      assignedTo: order.assignedTo || order.AssignedTo,
    };
  };

  const loadOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await apiClient.get('/api/orders');
      const ordersWithHistory = await Promise.all(
        data.map(async (order: any) => {
          try {
            const history = await apiClient.get(`/api/orders/${order.id || order.Id}/history`);
            return mapApiOrder(order, history);
          } catch {
            return mapApiOrder(order);
          }
        })
      );

      setOrders(ordersWithHistory);
      localStorage.setItem(cacheKey, JSON.stringify(ordersWithHistory));
    } catch (err: any) {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          setOrders(
            parsed.map((order: any) => ({
              ...order,
              dueDate: new Date(order.dueDate),
              createdAt: new Date(order.createdAt),
              updatedAt: new Date(order.updatedAt),
              statusHistory: order.statusHistory.map((h: any) => ({
                ...h,
                timestamp: new Date(h.timestamp),
              })),
            }))
          );
        } catch {
          setOrders([]);
        }
      }

      setError(err?.message || 'Error cargando órdenes');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  useEffect(() => {
    const baseUrl = import.meta.env.VITE_API_BASE || 'http://localhost:5000';
    const source = new EventSource(`${baseUrl}/api/orders/stream`);
    let isMounted = true;

    source.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data);
        const payload = data.Payload || {};
        const orderId = payload.OrderId || payload.orderId;

        if (data.Type === 'order.status_changed' && orderId) {
          const newStatus = payload.NewStatus || payload.newStatus;
          setOrders((prev) =>
            prev.map((order) =>
              order.id === orderId
                ? {
                    ...order,
                    status: mapStatusToTraffic(newStatus),
                    updatedAt: new Date(data.Timestamp || Date.now()),
                    statusHistory: [
                      ...order.statusHistory,
                      {
                        status: mapStatusToTraffic(newStatus),
                        timestamp: new Date(data.Timestamp || Date.now()),
                        reason: 'Actualizado en tiempo real',
                      },
                    ],
                  }
                : order
            )
          );
        }

        if (data.Type === 'order.created' && orderId) {
          let shouldFetch = false;
          setOrders((prev) => {
            shouldFetch = !prev.some((order) => order.id === orderId);
            return prev;
          });

          if (shouldFetch) {
            const created = await apiClient.get(`/api/orders/${orderId}`);
            if (isMounted) {
              const mapped = mapApiOrder(created);
              setOrders((prev) => [mapped, ...prev]);
            }
          }
        }
      } catch {
        // Ignore malformed events
      }
    };

    source.onerror = () => {
      source.close();
    };

    return () => {
      isMounted = false;
      source.close();
    };
  }, []);

  useEffect(() => {
    if (isOnline) {
      syncPendingChanges().finally(loadOrders);
    }
  }, [isOnline, syncPendingChanges, loadOrders]);

  useEffect(() => {
    localStorage.setItem(cacheKey, JSON.stringify(orders));
  }, [orders]);

  /**
   * Crea una nueva orden con QR único
   */
  const createOrder = async (
    customer: string,
    product: string,
    quantity: number,
    dueDate: Date,
    assignedTo?: string,
    notes?: string
  ): Promise<Order | null> => {
    const tempId = generateOrderId();
    const qrCode = generateQRData(tempId);
    const now = new Date();

    const tempOrder: Order = {
      id: tempId,
      qrCode,
      status: 'red',
      customer,
      product,
      quantity,
      dueDate,
      createdAt: now,
      updatedAt: now,
      statusHistory: [
        {
          status: 'red',
          timestamp: now,
          reason: 'Orden creada',
        },
      ],
      assignedTo,
      notes,
      isPendingSync: true,
    };

    setOrders((prev) => [tempOrder, ...prev]);

    try {
      const created = await apiClient.post('/api/orders', {
        customer,
        product,
        quantity,
        dueDate: dueDate.toISOString(),
        assignedTo,
        notes,
      });

      const mapped = mapApiOrder(created);
      setOrders((prev) => [mapped, ...prev.filter((o) => o.id !== tempId)]);
      return mapped;
    } catch {
      queueSync('create', 'order', {
        customer,
        product,
        quantity,
        dueDate: dueDate.toISOString(),
        assignedTo,
        notes,
      });

      return tempOrder;
    }
  };

  /**
   * Actualiza el estado de una orden
   */
  const updateOrderStatus = async (
    orderId: string,
    newStatus: TrafficLightStatus,
    reason?: string,
    updatedBy?: string
  ): Promise<Order | null> => {
    let updatedOrder: Order | null = null;
    const now = new Date();

    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          updatedOrder = {
            ...order,
            status: newStatus,
            updatedAt: now,
            statusHistory: [
              ...order.statusHistory,
              {
                status: newStatus,
                timestamp: now,
                reason,
                updatedBy,
              },
            ],
            isPendingSync: !isOnline,
          };
          return updatedOrder;
        }
        return order;
      })
    );

    if (updatedOrder) {
      console.log(`🚦 Orden ${orderId} → ${getStatusEmoji(newStatus)} ${newStatus}`);
    }

    try {
      await apiClient.patch(`/api/orders/${orderId}/status`, {
        newStatus: mapTrafficToStatus(newStatus),
        reason,
        changedBy: updatedBy,
      });

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, isPendingSync: false } : order
        )
      );
    } catch {
      queueSync('update', 'order', {
        id: orderId,
        status: mapTrafficToStatus(newStatus),
        reason,
        updatedBy,
      });
    }

    return updatedOrder;
  };

  /**
   * Obtiene una orden por ID
   */
  const getOrderById = (orderId: string): Order | null => {
    return orders.find((o) => o.id === orderId) || null;
  };

  /**
   * Obtiene una orden por QR Code
   */
  const getOrderByQR = (qrCode: string): Order | null => {
    return orders.find((o) => o.qrCode === qrCode) || null;
  };

  /**
   * Filtra órdenes por estado
   */
  const getOrdersByStatus = (status: TrafficLightStatus): Order[] => {
    return orders.filter((o) => o.status === status);
  };

  /**
   * Obtiene estadísticas de órdenes
   */
  const getOrderStats = () => {
    const total = orders.length;
    const red = orders.filter((o) => o.status === 'red').length;
    const amber = orders.filter((o) => o.status === 'amber').length;
    const green = orders.filter((o) => o.status === 'green').length;

    // Calcular órdenes vencidas
    const now = new Date();
    const overdue = orders.filter(
      (o) => o.status !== 'green' && o.dueDate < now
    ).length;

    return { total, red, amber, green, overdue };
  };

  /**
   * Elimina una orden
   */
  const deleteOrder = async (orderId: string): Promise<boolean> => {
    const initialLength = orders.length;
    setOrders((prev) => prev.filter((o) => o.id !== orderId));

    try {
      await apiClient.delete(`/api/orders/${orderId}`);
    } catch {
      queueSync('delete', 'order', { id: orderId });
    }

    return orders.length < initialLength;
  };

  /**
   * Actualiza detalles de una orden (excepto estado)
   */
  const updateOrderDetails = async (
    orderId: string,
    updates: Partial<Pick<Order, 'customer' | 'product' | 'quantity' | 'dueDate' | 'notes' | 'assignedTo'>>
  ): Promise<Order | null> => {
    let updatedOrder: Order | null = null;

    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          updatedOrder = {
            ...order,
            ...updates,
            updatedAt: new Date(),
            isPendingSync: !isOnline,
          };
          return updatedOrder;
        }
        return order;
      })
    );

    try {
      await apiClient.patch(`/api/orders/${orderId}`, {
        ...updates,
        dueDate: updates.dueDate ? updates.dueDate.toISOString() : undefined,
      });

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, isPendingSync: false } : order
        )
      );
    } catch {
      queueSync('update', 'order', {
        id: orderId,
        ...updates,
        dueDate: updates.dueDate ? updates.dueDate.toISOString() : undefined,
      });
    }

    return updatedOrder;
  };

  /**
   * Limpia órdenes completadas antiguas (más de 30 días)
   */
  const cleanOldCompletedOrders = () => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    setOrders((prev) =>
      prev.filter(
        (o) => o.status !== 'green' || o.updatedAt > thirtyDaysAgo
      )
    );
  };

  return {
    orders,
    isLoading,
    error,
    createOrder,
    updateOrderStatus,
    getOrderById,
    getOrderByQR,
    getOrdersByStatus,
    getOrderStats,
    deleteOrder,
    updateOrderDetails,
    cleanOldCompletedOrders,
  };
};
