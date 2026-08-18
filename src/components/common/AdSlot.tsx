import React from 'react';
import { AdSlotType } from '../../types';

interface AdSlotProps {
  type: AdSlotType;
  id?: string;
  className?: string;
}

export const AdSlot: React.FC<AdSlotProps> = ({ type, id, className = '' }) => {
  // Dimensions configured to minimize Cumulative Layout Shift (CLS)
  const getDimensions = () => {
    switch (type) {
      case 'TopAd':
        return 'min-h-[90px] md:min-h-[100px] max-w-5xl';
      case 'ToolTopAd':
        return 'min-h-[100px] md:min-h-[120px] max-w-4xl';
      case 'ToolBottomAd':
        return 'min-h-[120px] md:min-h-[250px] max-w-4xl';
      case 'ContentAd':
        return 'min-h-[250px] max-w-xl';
      default:
        return 'min-h-[100px] max-w-4xl';
    }
  };

  return (
    <div
      id={id || `ad-container-${type.toLowerCase()}`}
      className={`w-full mx-auto my-6 px-4 ${getDimensions()} ${className}`}
      aria-label={`Advertisement Slot - ${type}`}
    >
      <div className="w-full h-full bg-slate-100/80 dark:bg-slate-800/40 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center p-4 text-center transition-all">
        {/* Transparent & Clean Ad Slot Label */}
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
          <span>Advertisement Space • {type}</span>
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-500">
          Reserved for verified advertising partners (Adsterra / AdSense)
        </p>

        {/* 
          =============================================================
          INTEGRATION INSTRUCTION FOR ADSTERRA / AD CODE:
          To place your live Adsterra banner or native widget here,
          paste the script tag or container inside this element or
          replace this entire inner block with your Adsterra snippet.
          =============================================================
        */}
      </div>
    </div>
  );
};
