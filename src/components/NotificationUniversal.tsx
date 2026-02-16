import React from 'react';
import { NotificationUniversal } from '../types/notification';
import styles from '../styles/NotificationUniversal.module.css';

interface Props {
  notification: NotificationUniversal;
  onRead: (id: string) => void;
}

export const NotificationUniversal: React.FC<Props> = ({ notification, onRead }) => {
  return (
    <div className={styles.notification + ' ' + styles[notification.type]} onClick={() => onRead(notification.id)}>
      <span>{notification.message}</span>
      {!notification.read && <span className={styles.unreadDot} />}
    </div>
  );
};
