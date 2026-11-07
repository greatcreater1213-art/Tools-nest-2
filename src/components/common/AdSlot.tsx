import React, { useId } from 'react';
import { AdSlotType } from '../../types';

interface AdSlotProps {
  type: AdSlotType;
  id?: string;
  className?: string;
}

// 728x90 Desktop Ad Script Content
const DESKTOP_728x90_HTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: transparent; overflow: hidden; display: flex; justify-content: center; align-items: center; width: 728px; height: 90px; }
  </style>
</head>
<body>
  <script type="text/javascript">
    atOptions = {
      'key' : '692924dc8738b345293e343ab32f91f2',
      'format' : 'iframe',
      'height' : 90,
      'width' : 728,
      'params' : {}
    };
  </script>
  <script type="text/javascript" src="https://bauval.org/22/692924dc8738b345293e343ab32f91f2"></script>
</body>
</html>`;

// 320x50 Mobile Ad Script Content
const MOBILE_320x50_HTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: transparent; overflow: hidden; display: flex; justify-content: center; align-items: center; width: 320px; height: 50px; }
  </style>
</head>
<body>
  <script type="text/javascript">
    atOptions = {
      'key' : '6ec7dfe28f3b916bb4858b80c0756df0',
      'format' : 'iframe',
      'height' : 50,
      'width' : 320,
      'params' : {}
    };
  </script>
  <script type="text/javascript" src="https://bauval.org/22/6ec7dfe28f3b916bb4858b80c0756df0"></script>
</body>
</html>`;

export const AdSlot: React.FC<AdSlotProps> = ({ type, id, className = '' }) => {
  const reactId = useId();
  const slotId = id || `ad-${type.toLowerCase()}-${reactId.replace(/[^a-zA-Z0-9]/g, '')}`;

  return (
    <div
      id={slotId}
      className={`w-full mx-auto my-4 sm:my-6 flex flex-col items-center justify-center ${className}`}
      aria-label={`Advertisement Slot - ${type}`}
    >
      {/* Desktop Banner: 728x90 (Hidden on mobile <768px, Visible on md+ 768px and up) */}
      <div className="hidden md:flex flex-col items-center justify-center w-full overflow-hidden">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1 select-none">
          Advertisement
        </span>
        <div className="w-[728px] h-[90px] max-w-full flex items-center justify-center bg-slate-50 rounded-lg overflow-hidden border border-slate-200/60 shadow-2xs">
          <iframe
            title={`Adsterra Desktop 728x90 - ${type}`}
            srcDoc={DESKTOP_728x90_HTML}
            width={728}
            height={90}
            className="w-[728px] h-[90px] border-0 overflow-hidden block"
            scrolling="no"
            loading="lazy"
            sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms"
          />
        </div>
      </div>

      {/* Mobile Banner: 320x50 (Visible on mobile <768px, Hidden on md+ 768px and up) */}
      <div className="flex md:hidden flex-col items-center justify-center w-full overflow-hidden">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1 select-none">
          Advertisement
        </span>
        <div className="w-[320px] h-[50px] max-w-full flex items-center justify-center bg-slate-50 rounded-lg overflow-hidden border border-slate-200/60 shadow-2xs">
          <iframe
            title={`Adsterra Mobile 320x50 - ${type}`}
            srcDoc={MOBILE_320x50_HTML}
            width={320}
            height={50}
            className="w-[320px] h-[50px] border-0 overflow-hidden block"
            scrolling="no"
            loading="lazy"
            sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms"
          />
        </div>
      </div>
    </div>
  );
};
