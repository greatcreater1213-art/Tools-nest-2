import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { BreadcrumbItem } from '../../types';
import { useNavigation } from '../../context/NavigationContext';

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  const { navigateTo } = useNavigation();

  return (
    <nav aria-label="Breadcrumb" className="flex items-center text-xs md:text-sm text-slate-500 mb-6 overflow-x-auto py-1 whitespace-nowrap">
      <button
        onClick={() => navigateTo('/')}
        className="flex items-center gap-1.5 hover:text-blue-600 transition-colors focus:outline-none"
        title="Go to Homepage"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Home</span>
      </button>

      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          <ChevronRight className="w-3.5 h-3.5 mx-2 text-slate-400 shrink-0" />
          {item.href && !item.active ? (
            <button
              onClick={() => navigateTo(item.href!)}
              className="hover:text-blue-600 transition-colors focus:outline-none"
            >
              {item.label}
            </button>
          ) : (
            <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[200px] sm:max-w-none" aria-current="page">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
};
