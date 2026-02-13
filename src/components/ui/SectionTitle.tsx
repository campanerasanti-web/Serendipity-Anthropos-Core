import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SectionTitleProps {
  icon?: LucideIcon;
  title: string;
  subtitle?: string;
  className?: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  icon: Icon,
  title,
  subtitle,
  className = '',
}) => {
  return (
    <div className={`mb-6 ${className}`}>
      <div className="flex items-center gap-3 mb-2">
        {Icon && <Icon className="text-indigo-600" size={24} />}
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      </div>
      {subtitle && <p className="text-gray-600 text-sm ml-9">{subtitle}</p>}
      <div className="h-1 w-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mt-2 ml-9" />
    </div>
  );
};

export default SectionTitle;
