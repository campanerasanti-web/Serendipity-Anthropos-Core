import React from 'react';
import { LucideIcon } from 'lucide-react';

interface CardProps {
  icon?: LucideIcon;
  title?: string;
  children: React.ReactNode;
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'indigo';
  variant?: 'default' | 'subtle' | 'bordered';
  className?: string;
}

const colorClasses = {
  blue: 'border-blue-200 bg-blue-50 hover:bg-blue-100',
  green: 'border-green-200 bg-green-50 hover:bg-green-100',
  red: 'border-red-200 bg-red-50 hover:bg-red-100',
  yellow: 'border-yellow-200 bg-yellow-50 hover:bg-yellow-100',
  purple: 'border-purple-200 bg-purple-50 hover:bg-purple-100',
  indigo: 'border-indigo-200 bg-indigo-50 hover:bg-indigo-100',
};

const iconColorClasses = {
  blue: 'text-blue-600',
  green: 'text-green-600',
  red: 'text-red-600',
  yellow: 'text-yellow-600',
  purple: 'text-purple-600',
  indigo: 'text-indigo-600',
};

export const Card: React.FC<CardProps> = ({
  icon: Icon,
  title,
  children,
  color = 'blue',
  variant = 'default',
  className = '',
}) => {
  const baseClasses =
    'rounded-xl border transition-all duration-200 shadow-sm hover:shadow-md';

  const variantClasses = {
    default: colorClasses[color],
    subtle: 'border-gray-100 bg-gray-50 hover:bg-gray-100',
    bordered: `border-2 ${colorClasses[color]}`,
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className} p-4`}
    >
      {(title || Icon) && (
        <div className="flex items-start gap-3 mb-3">
          {Icon && (
            <Icon className={`${iconColorClasses[color]} flex-shrink-0 mt-0.5`} size={20} />
          )}
          {title && (
            <h3 className={`font-semibold text-gray-900 leading-tight`}>
              {title}
            </h3>
          )}
        </div>
      )}
      <div className="text-gray-700 text-sm leading-relaxed">{children}</div>
    </div>
  );
};

export default Card;
