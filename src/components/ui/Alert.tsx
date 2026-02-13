import React from 'react';
import { AlertCircle, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { Card } from './Card';

export interface AlertItem {
  title: string;
  message: string;
  severity: 'critical' | 'warning' | 'info' | 'success';
}

interface AlertProps extends AlertItem {
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

const severityConfig = {
  critical: {
    color: 'red' as const,
    icon: AlertCircle,
    bgClass: 'bg-red-50 border-red-300',
    badgeClass: 'bg-red-100 text-red-900',
    labelClass: 'text-red-700 font-bold',
  },
  warning: {
    color: 'yellow' as const,
    icon: AlertTriangle,
    bgClass: 'bg-yellow-50 border-yellow-300',
    badgeClass: 'bg-yellow-100 text-yellow-900',
    labelClass: 'text-yellow-700 font-bold',
  },
  info: {
    color: 'blue' as const,
    icon: Info,
    bgClass: 'bg-blue-50 border-blue-300',
    badgeClass: 'bg-blue-100 text-blue-900',
    labelClass: 'text-blue-700 font-bold',
  },
  success: {
    color: 'green' as const,
    icon: CheckCircle,
    bgClass: 'bg-green-50 border-green-300',
    badgeClass: 'bg-green-100 text-green-900',
    labelClass: 'text-green-700 font-bold',
  },
};

export const Alert: React.FC<AlertProps> = ({
  title,
  message,
  severity,
  dismissible = false,
  onDismiss,
  className = '',
}) => {
  const config = severityConfig[severity];
  const [isDismissed, setIsDismissed] = React.useState(false);

  if (isDismissed) return null;

  return (
    <Card
      icon={config.icon}
      title={title}
      color={config.color}
      variant="bordered"
      className={className}
    >
      <div className="flex justify-between items-start gap-3">
        <div className="flex-1">
          <span
            className={`inline-block px-2.5 py-1 text-xs font-bold rounded-full ${config.badgeClass} mb-2`}
          >
            {severity.toUpperCase()}
          </span>
          <p className="text-gray-700 mt-2 leading-relaxed">{message}</p>
        </div>
        {dismissible && (
          <button
            onClick={() => {
              setIsDismissed(true);
              onDismiss?.();
            }}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        )}
      </div>
    </Card>
  );
};

export default Alert;
