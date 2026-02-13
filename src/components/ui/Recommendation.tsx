import React from 'react';
import { Sparkles, TrendingUp, AlertTriangle, Zap } from 'lucide-react';
import { Card } from './Card';

export interface RecommendationItem {
  title: string;
  message: string;
  type: 'success' | 'warning' | 'critical' | 'info';
}

interface RecommendationProps extends RecommendationItem {
  className?: string;
}

const typeConfig = {
  success: {
    color: 'green' as const,
    icon: TrendingUp,
    bgClass: 'bg-green-50 border-green-200',
    badgeClass: 'bg-green-100 text-green-800',
  },
  warning: {
    color: 'yellow' as const,
    icon: AlertTriangle,
    bgClass: 'bg-yellow-50 border-yellow-200',
    badgeClass: 'bg-yellow-100 text-yellow-800',
  },
  critical: {
    color: 'red' as const,
    icon: Zap,
    bgClass: 'bg-red-50 border-red-200',
    badgeClass: 'bg-red-100 text-red-800',
  },
  info: {
    color: 'blue' as const,
    icon: Sparkles,
    bgClass: 'bg-blue-50 border-blue-200',
    badgeClass: 'bg-blue-100 text-blue-800',
  },
};

export const Recommendation: React.FC<RecommendationProps> = ({
  title,
  message,
  type,
  className = '',
}) => {
  const config = typeConfig[type];

  return (
    <Card
      icon={config.icon}
      title={title}
      color={config.color}
      variant="bordered"
      className={className}
    >
      <div>
        <span
          className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${config.badgeClass} mb-2`}
        >
          {type.toUpperCase()}
        </span>
        <p className="text-gray-700 mt-2">{message}</p>
      </div>
    </Card>
  );
};

export default Recommendation;
