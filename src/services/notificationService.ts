import { NotificationUniversal } from '../types/notification';

let notifications: NotificationUniversal[] = [];

export const notificationService = {
  getAll: () => notifications,
  add: (notif: NotificationUniversal) => {
    notifications = [notif, ...notifications];
  },
  markAsRead: (id: string) => {
    notifications = notifications.map(n => n.id === id ? { ...n, read: true } : n);
  },
  clear: () => {
    notifications = [];
  }
};
