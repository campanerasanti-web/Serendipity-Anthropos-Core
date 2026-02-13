import React from 'react';
import { getStatusLabel } from '../api/ordersApi';

/**
 * Badge de estado con colores del semáforo
 */
export default function OrderStatusBadge({ status, size = 'normal' }) {
  const statusColors = {
    pending: 'bg-gray-500',
    'in-progress': 'bg-yellow-500',
    completed: 'bg-green-500',
    cancelled: 'bg-red-500',
  };

  const statusEmojis = {
    pending: '⏳',
    'in-progress': '⚙️',
    completed: '✅',
    cancelled: '❌',
  };

  const sizeClasses = {
    small: 'text-xs px-2 py-1',
    normal: 'text-sm px-3 py-1',
    large: 'text-base px-4 py-2',
  };

  return (
    <span
      className={`order-status-badge ${statusColors[status] || 'bg-gray-400'} ${sizeClasses[size]} inline-flex items-center gap-2 rounded-full text-white font-semibold`}
    >
      <span>{statusEmojis[status] || '⚪'}</span>
      <span>{getStatusLabel(status)}</span>
    </span>
  );
}
