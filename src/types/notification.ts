export interface NotificationUniversal {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  createdAt: Date;
  read?: boolean;
}
