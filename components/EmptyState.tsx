import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon: Icon, title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
      <div className="bg-white p-3 rounded-full shadow-sm mb-4">
        <Icon size={32} className="text-slate-400" />
      </div>
      <h3 className="text-lg font-medium text-slate-900 mb-1">{title}</h3>
      <p className="text-slate-500 mb-6 max-w-sm">{description}</p>
      {action}
    </div>
  );
};

export default EmptyState;