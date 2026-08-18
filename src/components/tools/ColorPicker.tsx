import React, { useState } from 'react';
import { Copy, Check, Palette, Sparkles, RefreshCw, Eye } from 'lucide-react';

export const ColorPicker: React.FC = () => {
  const [hex, setHex] = useState<string>('#3b82f6');
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  // HEX to RGB
  const hexToRgb = (hexStr: string) => {
    let clean = hexStr.replace('#', '');
    if (clean.length === 3) {
      clean = clean.split('').map(c => c + c).join('');
    }
    const num = parseInt(clean, 16);
    if (isNaN(num) || clean.length !== 6) return { r: 59, g: 130, b: 246 };
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255,
    };
  };

  const rgb = hexToRgb(hex);

  // RGB to HSL
  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  };

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  // RGB to CMYK
  const rgbToCmyk = (r: number, g: number, b: number) => {
    let c = 1 - (r / 255);
    let m = 1 - (g / 255);
    let y = 1 - (b / 255);
    let k = Math.min(c, Math.min(m, y));

    if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
    c = Math.round(((c - k) / (1 - k)) * 100);
    m = Math.round(((m - k) / (1 - k)) * 100);
    y = Math.round(((y - k) / (1 - k)) * 100);
    k = Math.round(k * 100);

    return { c, m, y, k };
  };

  const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);

  // Luminance & WCAG Contrast
  const getLuminance = (r: number, g: number, b: number) => {
    const a = [r, g, b].map(v => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };

  const lum = getLuminance(rgb.r, rgb.g, rgb.b);
  const contrastWhite = parseFloat(((1.05) / (lum + 0.05)).toFixed(2));
  const contrastBlack = parseFloat(((lum + 0.05) / (0.05)).toFixed(2));

  // Harmonies (HSL based)
  const hslToHex = (h: number, s: number, l: number): string => {
    l /= 100;
    const a = (s * Math.min(l, 1 - l)) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  const complementary = hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l);
  const triadic1 = hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l);
  const triadic2 = hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l);
  const analogous1 = hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l);
  const analogous2 = hslToHex((hsl.h + 330) % 360, hsl.s, hsl.l);

  const SWATCHES = [
    '#ef4444', '#f97316', '#f59e0b', '#10b981', '#06b6d4',
    '#3b82f6', '#6366f1', '#8b5cf6', '#ec4899', '#0f172a'
  ];

  const handleCopy = async (text: string, formatName: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedFormat(formatName);
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Color Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Visual Color Picker & Large Swatch */}
        <div className="lg:col-span-5 space-y-4">
          <div
            className="w-full h-48 rounded-2xl border border-slate-300 shadow-md flex items-end p-4 transition-all duration-300"
            style={{ backgroundColor: hex }}
          >
            <div className="bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl shadow-xs text-xs font-mono font-bold text-slate-800">
              {hex.toUpperCase()}
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
            <label className="block text-xs font-bold uppercase text-slate-500">
              Pick Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={hex}
                onChange={(e) => setHex(e.target.value)}
                className="w-12 h-12 rounded-xl border border-slate-300 cursor-pointer p-0.5 bg-white shrink-0"
              />
              <input
                type="text"
                value={hex}
                onChange={(e) => setHex(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-base font-mono font-bold uppercase text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Preset Palette */}
            <div>
              <span className="text-[11px] font-bold uppercase text-slate-400 block mb-1.5">
                Popular Swatches:
              </span>
              <div className="flex flex-wrap gap-2">
                {SWATCHES.map((swatch, i) => (
                  <button
                    key={i}
                    onClick={() => setHex(swatch)}
                    className="w-8 h-8 rounded-lg border border-slate-300 shadow-xs hover:scale-110 transition"
                    style={{ backgroundColor: swatch }}
                    title={swatch}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Formats & Values Column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase text-slate-500 tracking-wider">
              Color Value Codes
            </h3>

            {/* HEX */}
            <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200">
              <div>
                <span className="text-xs font-bold text-slate-500 block">HEX</span>
                <span className="font-mono text-sm font-bold text-slate-900">{hex.toUpperCase()}</span>
              </div>
              <button
                onClick={() => handleCopy(hex.toUpperCase(), 'HEX')}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition flex items-center gap-1"
              >
                {copiedFormat === 'HEX' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedFormat === 'HEX' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* RGB */}
            <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200">
              <div>
                <span className="text-xs font-bold text-slate-500 block">RGB</span>
                <span className="font-mono text-sm font-bold text-slate-900">
                  rgb({rgb.r}, {rgb.g}, {rgb.b})
                </span>
              </div>
              <button
                onClick={() => handleCopy(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, 'RGB')}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition flex items-center gap-1"
              >
                {copiedFormat === 'RGB' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedFormat === 'RGB' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* HSL */}
            <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200">
              <div>
                <span className="text-xs font-bold text-slate-500 block">HSL</span>
                <span className="font-mono text-sm font-bold text-slate-900">
                  hsl({hsl.h}, {hsl.s}%, {hsl.l}%)
                </span>
              </div>
              <button
                onClick={() => handleCopy(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, 'HSL')}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition flex items-center gap-1"
              >
                {copiedFormat === 'HSL' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedFormat === 'HSL' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* CMYK */}
            <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200">
              <div>
                <span className="text-xs font-bold text-slate-500 block">CMYK (Print)</span>
                <span className="font-mono text-sm font-bold text-slate-900">
                  cmyk({cmyk.c}%, {cmyk.m}%, {cmyk.y}%, {cmyk.k}%)
                </span>
              </div>
              <button
                onClick={() => handleCopy(`cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`, 'CMYK')}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition flex items-center gap-1"
              >
                {copiedFormat === 'CMYK' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedFormat === 'CMYK' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* WCAG Contrast Ratios */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <h4 className="text-xs font-bold uppercase text-slate-500 mb-2">
              WCAG Accessibility Contrast Ratings
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-white rounded-xl border border-slate-200 text-center">
                <span className="text-xs text-slate-500 block">Against White (#FFF)</span>
                <span className="text-base font-bold text-slate-800">{contrastWhite}:1</span>
                <span className={`text-[10px] font-bold block mt-0.5 ${contrastWhite >= 4.5 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {contrastWhite >= 4.5 ? '✓ Pass AA (Readable)' : '✗ Fail (Low Contrast)'}
                </span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 text-center">
                <span className="text-xs text-slate-500 block">Against Black (#000)</span>
                <span className="text-base font-bold text-slate-800">{contrastBlack}:1</span>
                <span className={`text-[10px] font-bold block mt-0.5 ${contrastBlack >= 4.5 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {contrastBlack >= 4.5 ? '✓ Pass AA (Readable)' : '✗ Fail (Low Contrast)'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Auto Color Harmonies */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4">
        <h3 className="text-sm font-bold uppercase text-slate-700 tracking-wider flex items-center gap-2">
          <Palette className="w-4 h-4 text-blue-600" />
          Color Harmonies & Palettes
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Complementary */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-slate-600 block">Complementary</span>
            <div className="flex gap-2 h-12">
              <div className="flex-1 rounded-lg shadow-xs cursor-pointer" style={{ backgroundColor: hex }} onClick={() => setHex(hex)} />
              <div className="flex-1 rounded-lg shadow-xs cursor-pointer" style={{ backgroundColor: complementary }} onClick={() => setHex(complementary)} />
            </div>
            <div className="flex justify-between text-[11px] font-mono text-slate-500">
              <span>{hex}</span>
              <span>{complementary}</span>
            </div>
          </div>

          {/* Analogous */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-slate-600 block">Analogous</span>
            <div className="flex gap-2 h-12">
              <div className="flex-1 rounded-lg shadow-xs cursor-pointer" style={{ backgroundColor: analogous1 }} onClick={() => setHex(analogous1)} />
              <div className="flex-1 rounded-lg shadow-xs cursor-pointer" style={{ backgroundColor: hex }} onClick={() => setHex(hex)} />
              <div className="flex-1 rounded-lg shadow-xs cursor-pointer" style={{ backgroundColor: analogous2 }} onClick={() => setHex(analogous2)} />
            </div>
            <div className="flex justify-between text-[11px] font-mono text-slate-500">
              <span>{analogous1}</span>
              <span>{analogous2}</span>
            </div>
          </div>

          {/* Triadic */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-slate-600 block">Triadic</span>
            <div className="flex gap-2 h-12">
              <div className="flex-1 rounded-lg shadow-xs cursor-pointer" style={{ backgroundColor: hex }} onClick={() => setHex(hex)} />
              <div className="flex-1 rounded-lg shadow-xs cursor-pointer" style={{ backgroundColor: triadic1 }} onClick={() => setHex(triadic1)} />
              <div className="flex-1 rounded-lg shadow-xs cursor-pointer" style={{ backgroundColor: triadic2 }} onClick={() => setHex(triadic2)} />
            </div>
            <div className="flex justify-between text-[11px] font-mono text-slate-500">
              <span>{triadic1}</span>
              <span>{triadic2}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
