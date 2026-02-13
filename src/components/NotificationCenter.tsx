import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

export interface Notification {
  id: string;
  type: 'critical' | 'warning' | 'success' | 'info';
  title: string;
  message: string;
  duration?: number;
  timestamp: Date;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
}

export const NotificationContext = React.createContext<NotificationContextType>({
  notifications: [],
  addNotification: () => {},
  removeNotification: () => {}
});

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification: Notification = {
      ...notification,
      id,
      timestamp: new Date()
    };

    setNotifications(prev => [...prev, newNotification]);

    // Auto-remove after duration (default 5 seconds)
    const duration = notification.duration || 5000;
    setTimeout(() => removeNotification(id), duration);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
      <NotificationCenter notifications={notifications} removeNotification={removeNotification} />
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = React.useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};

const NotificationCenter: React.FC<{
  notifications: Notification[];
  removeNotification: (id: string) => void;
}> = ({ notifications, removeNotification }) => {
  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    top: '1.5rem',
    right: '1.5rem',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    maxWidth: '400px'
  };

  return (
    <div style={containerStyle}>
      {notifications.map(notification => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
};

const NotificationItem: React.FC<{
  notification: Notification;
  onClose: () => void;
}> = ({ notification, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);

  const getStyles = () => {
    const baseStyle: React.CSSProperties = {
      background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
      border: '2px solid',
      borderRadius: '1rem',
      padding: '1rem 1.5rem',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '1rem',
      animation: isClosing ? 'slideOut 0.3s ease-out' : 'slideIn 0.3s ease-out',
      transition: 'all 0.3s ease'
    };

    switch (notification.type) {
      case 'critical':
        return {
          ...baseStyle,
          borderColor: 'rgba(239, 68, 68, 0.5)',
          background: 'linear-gradient(135deg, rgba(127, 29, 29, 0.95) 0%, rgba(70, 13, 13, 0.95) 100%)'
        };
      case 'warning':
        return {
          ...baseStyle,
          borderColor: 'rgba(251, 146, 60, 0.5)',
          background: 'linear-gradient(135deg, rgba(124, 45, 18, 0.95) 0%, rgba(92, 28, 0, 0.95) 100%)'
        };
      case 'success':
        return {
          ...baseStyle,
          borderColor: 'rgba(34, 197, 94, 0.5)',
          background: 'linear-gradient(135deg, rgba(20, 83, 45, 0.95) 0%, rgba(6, 54, 23, 0.95) 100%)'
        };
      default:
        return baseStyle;
    }
  };

  const getIconColor = () => {
    switch (notification.type) {
      case 'critical':
        return 'rgb(239, 68, 68)';
      case 'warning':
        return 'rgb(251, 146, 60)';
      case 'success':
        return 'rgb(34, 197, 94)';
      default:
        return 'rgb(59, 130, 246)';
    }
  };

  const getIcon = () => {
    switch (notification.type) {
      case 'critical':
        return <AlertCircle width={24} height={24} style={{ color: getIconColor(), flexShrink: 0 }} />;
      case 'warning':
        return <AlertCircle width={24} height={24} style={{ color: getIconColor(), flexShrink: 0 }} />;
      case 'success':
        return <CheckCircle width={24} height={24} style={{ color: getIconColor(), flexShrink: 0 }} />;
      default:
        return <Info width={24} height={24} style={{ color: getIconColor(), flexShrink: 0 }} />;
    }
  };

  return (
    <div style={getStyles()}>
      {getIcon()}
      <div style={{ flex: 1 }}>
        <p style={{ color: 'white', fontWeight: 'bold', marginBottom: '0.25rem' }}>
          {notification.title}
        </p>
        <p style={{ color: 'rgb(226, 232, 240)', fontSize: '0.875rem', lineHeight: '1.4' }}>
          {notification.message}
        </p>
      </div>
      <button
        onClick={() => {
          setIsClosing(true);
          setTimeout(onClose, 300);
        }}
        style={{
          background: 'none',
          border: 'none',
          color: 'rgb(148, 163, 184)',
          cursor: 'pointer',
          padding: '0.25rem',
          flexShrink: 0,
          transition: 'color 0.2s ease'
        }}
        onMouseEnter={e => e.currentTarget.style.color = 'white'}
        onMouseLeave={e => e.currentTarget.style.color = 'rgb(148, 163, 184)'}
      >
        <X width={20} height={20} />
      </button>
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes slideOut {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(400px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};
