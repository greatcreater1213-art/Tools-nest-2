import React, { useState, useRef, useEffect } from 'react';
import { Upload, Download, RefreshCw, Lock, Unlock, Sliders, AlertTriangle } from 'lucide-react';

export const ImageResizer: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [originalDimensions, setOriginalDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [targetWidth, setTargetWidth] = useState<number>(0);
  const [targetHeight, setTargetHeight] = useState<number>(0);
  const [lockAspectRatio, setLockAspectRatio] = useState<boolean>(true);
  const [aspectRatio, setAspectRatio] = useState<number>(1);
  const [format, setFormat] = useState<'image/png' | 'image/jpeg' | 'image/webp'>('image/png');
  const [resizedBlob, setResizedBlob] = useState<Blob | null>(null);
  const [resizedPreview, setResizedPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const PRESETS = [
    { label: 'Instagram Square (1080×1080)', w: 1080, h: 1080 },
    { label: 'Instagram Story (1080×1920)', w: 1080, h: 1920 },
    { label: 'YouTube Thumbnail (1280×720)', w: 1280, h: 720 },
    { label: 'Full HD 1080p (1920×1080)', w: 1920, h: 1080 },
    { label: 'Twitter / X Banner (1500×500)', w: 1500, h: 500 },
    { label: 'Compact Web (800×600)', w: 800, h: 600 },
  ];

  const handleFileSelect = (selectedFile: File) => {
    setErrorMsg(null);
    if (!selectedFile.type.match(/^image\//i)) {
      setErrorMsg('Please select a valid image file.');
      return;
    }

    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      setPreview(src);

      const img = new Image();
      img.src = src;
      img.onload = () => {
        const w = img.naturalWidth;
        const h = img.naturalHeight;
        setOriginalDimensions({ width: w, height: h });
        setTargetWidth(w);
        setTargetHeight(h);
        setAspectRatio(w / h);
      };
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleWidthChange = (val: number) => {
    setTargetWidth(val);
    if (lockAspectRatio && aspectRatio > 0) {
      setTargetHeight(Math.round(val / aspectRatio));
    }
  };

  const handleHeightChange = (val: number) => {
    setTargetHeight(val);
    if (lockAspectRatio && aspectRatio > 0) {
      setTargetWidth(Math.round(val * aspectRatio));
    }
  };

  const applyPreset = (w: number, h: number) => {
    setTargetWidth(w);
    setTargetHeight(h);
  };

  const applyScalePercent = (percent: number) => {
    if (originalDimensions.width > 0) {
      const w = Math.round((originalDimensions.width * percent) / 100);
      const h = Math.round((originalDimensions.height * percent) / 100);
      setTargetWidth(w);
      setTargetHeight(h);
    }
  };

  useEffect(() => {
    if (!preview || targetWidth <= 0 || targetHeight <= 0) return;
    setIsProcessing(true);

    const timer = setTimeout(() => {
      const img = new Image();
      img.src = preview;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setIsProcessing(false);
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        if (format === 'image/jpeg') {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, targetWidth, targetHeight);
        }

        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        canvas.toBlob((blob) => {
          setIsProcessing(false);
          if (blob) {
            setResizedBlob(blob);
            if (resizedPreview) URL.revokeObjectURL(resizedPreview);
            setResizedPreview(URL.createObjectURL(blob));
          }
        }, format, 0.92);
      };
    }, 200);

    return () => clearTimeout(timer);
  }, [preview, targetWidth, targetHeight, format]);

  const handleDownload = () => {
    if (!resizedBlob || !file) return;
    const ext = format === 'image/webp' ? 'webp' : format === 'image/jpeg' ? 'jpg' : 'png';
    const name = file.name.replace(/\.[^/.]+$/, '');
    const filename = `${name}-${targetWidth}x${targetHeight}.${ext}`;

    const link = document.createElement('a');
    link.href = URL.createObjectURL(resizedBlob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setOriginalDimensions({ width: 0, height: 0 });
    setTargetWidth(0);
    setTargetHeight(0);
    setResizedBlob(null);
    if (resizedPreview) URL.revokeObjectURL(resizedPreview);
    setResizedPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6">
      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {!file ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (e.dataTransfer.files?.[0]) handleFileSelect(e.dataTransfer.files[0]);
          }}
          className="border-2 border-dashed border-blue-300 hover:border-blue-500 bg-blue-50/50 hover:bg-blue-50/80 rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition flex flex-col items-center justify-center group"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) handleFileSelect(e.target.files[0]);
            }}
          />
          <div className="w-16 h-16 rounded-2xl bg-blue-600/10 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition">
            <Upload className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">
            Upload Image to Resize
          </h3>
          <p className="text-sm text-slate-500 max-w-sm mb-4">
            Supports PNG, JPG, JPEG, WebP, SVG, and GIF.
          </p>
          <span className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg shadow-xs hover:bg-blue-700 transition">
            Select Image
          </span>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Dimension Controls */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <span className="text-sm font-bold text-slate-700">
                Original Size: <span className="text-blue-600 font-mono">{originalDimensions.width} × {originalDimensions.height} px</span>
              </span>

              {/* Quick Scaling Buttons */}
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                <span>Scale:</span>
                {[25, 50, 75, 100, 150, 200].map(pct => (
                  <button
                    key={pct}
                    onClick={() => applyScalePercent(pct)}
                    className="px-2 py-1 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-md transition"
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-center">
              {/* Width Input */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">
                  Width (Pixels)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="10000"
                    value={targetWidth || ''}
                    onChange={(e) => handleWidthChange(Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium">px</span>
                </div>
              </div>

              {/* Height Input */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">
                  Height (Pixels)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="10000"
                    value={targetHeight || ''}
                    onChange={(e) => handleHeightChange(Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium">px</span>
                </div>
              </div>

              {/* Aspect Ratio Lock & Output Format */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setLockAspectRatio(!lockAspectRatio)}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-bold transition ${
                    lockAspectRatio 
                      ? 'bg-blue-50 border-blue-300 text-blue-700' 
                      : 'bg-slate-100 border-slate-200 text-slate-600'
                  }`}
                  title="Lock aspect ratio"
                >
                  {lockAspectRatio ? <Lock className="w-4 h-4 text-blue-600" /> : <Unlock className="w-4 h-4 text-slate-500" />}
                  <span>{lockAspectRatio ? 'Ratio Locked' : 'Ratio Unlocked'}</span>
                </button>

                <div className="flex-1">
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value as any)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 focus:outline-blue-600"
                  >
                    <option value="image/png">PNG</option>
                    <option value="image/jpeg">JPG</option>
                    <option value="image/webp">WebP</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Presets Grid */}
            <div>
              <span className="text-xs font-bold uppercase text-slate-500 block mb-2">
                Popular Social & Screen Presets:
              </span>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => applyPreset(preset.w, preset.h)}
                    className="text-xs font-medium px-3 py-1.5 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-lg transition text-slate-700"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Resized Result Preview */}
          <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase text-slate-500">Live Scaled Preview</span>
              <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-md">
                {targetWidth} × {targetHeight} px
              </span>
            </div>
            <div className="relative aspect-video max-h-[400px] bg-slate-200/50 rounded-xl overflow-hidden flex items-center justify-center p-2">
              {resizedPreview ? (
                <img
                  src={resizedPreview}
                  alt="Resized preview"
                  className="max-h-full max-w-full object-contain rounded-md shadow-xs"
                />
              ) : (
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
                  <span>Calculating dimensions...</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200">
            <button
              onClick={handleReset}
              className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition flex items-center gap-1.5"
            >
              <RefreshCw className="w-4 h-4" />
              Resize Another Image
            </button>

            <button
              onClick={handleDownload}
              disabled={isProcessing || !resizedBlob}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-md transition flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download Resized Image ({targetWidth} × {targetHeight})
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
