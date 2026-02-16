import { useState } from 'react';
import { notificationService } from '../services/notificationService';
import { NotificationUniversal } from '../types/notification';

export function useNotification() {
  const [notifications, setNotifications] = useState<NotificationUniversal[]>(notificationService.getAll());

  const addNotification = (notif: NotificationUniversal) => {
    notificationService.add(notif);
    setNotifications([...notificationService.getAll()]);
  };

  const markAsRead = (id: string) => {
    notificationService.markAsRead(id);
    setNotifications([...notificationService.getAll()]);
  };

  const clear = () => {
    notificationService.clear();
    setNotifications([]);
  };

  return { notifications, addNotification, markAsRead, clear };
}
