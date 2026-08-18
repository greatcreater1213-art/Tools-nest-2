import React, { useState, useRef, useEffect } from 'react';
import { Upload, Download, Crop, RotateCw, FlipHorizontal, FlipVertical, Sparkles, RefreshCw, AlertCircle, Eye, Check } from 'lucide-react';

export const ImageCropper: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('cropped-image');
  const [imgNaturalSize, setImgNaturalSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [aspectRatio, setAspectRatio] = useState<string>('free');
  
  // Normalized crop coordinates (0 to 1 relative to image)
  const [cropBox, setCropBox] = useState<{ x: number; y: number; width: number; height: number }>({
    x: 0.1,
    y: 0.1,
    width: 0.8,
    height: 0.8
  });

  const [rotation, setRotation] = useState<number>(0);
  const [flipH, setFlipH] = useState<boolean>(false);
  const [flipV, setFlipV] = useState<boolean>(false);
  const [outputFormat, setOutputFormat] = useState<'image/png' | 'image/jpeg'>('image/png');
  const [quality, setQuality] = useState<number>(0.92);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isDraggingRef = useRef<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number; boxX: number; boxY: number }>({ x: 0, y: 0, boxX: 0, boxY: 0 });
  const isResizingRef = useRef<string | null>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const url = URL.createObjectURL(file);
    setImageSrc(url);
    setFileName(file.name.replace(/\.[^/.]+$/, ''));
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setAspectRatio('free');
    setCropBox({ x: 0.1, y: 0.1, width: 0.8, height: 0.8 });
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setImgNaturalSize({ width: img.naturalWidth, height: img.naturalHeight });
  };

  const handleAspectRatioChange = (ratio: string) => {
    setAspectRatio(ratio);
    if (ratio === 'free') return;

    let targetRatio = 1;
    if (ratio === '1:1') targetRatio = 1;
    else if (ratio === '4:3') targetRatio = 4 / 3;
    else if (ratio === '16:9') targetRatio = 16 / 9;
    else if (ratio === '3:2') targetRatio = 3 / 2;
    else if (ratio === '9:16') targetRatio = 9 / 16;

    if (imgNaturalSize.width === 0 || imgNaturalSize.height === 0) return;

    const imgAspect = imgNaturalSize.width / imgNaturalSize.height;
    let newWidth = 0.8;
    let newHeight = (newWidth * imgAspect) / targetRatio;

    if (newHeight > 0.9) {
      newHeight = 0.8;
      newWidth = (newHeight * targetRatio) / imgAspect;
    }

    setCropBox({
      x: Math.max(0, (1 - newWidth) / 2),
      y: Math.max(0, (1 - newHeight) / 2),
      width: Math.min(1, newWidth),
      height: Math.min(1, newHeight)
    });
  };

  // Generate cropped preview
  useEffect(() => {
    if (!imageSrc || !imageRef.current || imgNaturalSize.width === 0) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cropPxX = Math.round(cropBox.x * imgNaturalSize.width);
    const cropPxY = Math.round(cropBox.y * imgNaturalSize.height);
    const cropPxW = Math.round(cropBox.width * imgNaturalSize.width);
    const cropPxH = Math.round(cropBox.height * imgNaturalSize.height);

    if (cropPxW <= 0 || cropPxH <= 0) return;

    canvas.width = cropPxW;
    canvas.height = cropPxH;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageSrc;
    img.onload = () => {
      ctx.save();
      if (outputFormat === 'image/jpeg') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, cropPxX, cropPxY, cropPxW, cropPxH, 0, 0, cropPxW, cropPxH);
      ctx.restore();

      const url = canvas.toDataURL(outputFormat, quality);
      setPreviewUrl(url);
    };
  }, [imageSrc, cropBox, imgNaturalSize, outputFormat, quality]);

  // Pointer drag for crop box
  const startDrag = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      boxX: cropBox.x,
      boxY: cropBox.y
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const deltaX = (e.clientX - dragStartRef.current.x) / rect.width;
    const deltaY = (e.clientY - dragStartRef.current.y) / rect.height;

    let newX = dragStartRef.current.boxX + deltaX;
    let newY = dragStartRef.current.boxY + deltaY;

    newX = Math.max(0, Math.min(1 - cropBox.width, newX));
    newY = Math.max(0, Math.min(1 - cropBox.height, newY));

    setCropBox(prev => ({ ...prev, x: newX, y: newY }));
  };

  const stopDrag = (e: React.PointerEvent) => {
    isDraggingRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch (err) {}
  };

  const downloadCroppedImage = () => {
    if (!previewUrl) return;
    const ext = outputFormat === 'image/png' ? 'png' : 'jpg';
    const link = document.createElement('a');
    link.href = previewUrl;
    link.download = `${fileName}-cropped.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetAll = () => {
    if (imageSrc) URL.revokeObjectURL(imageSrc);
    setImageSrc(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const pixelCropW = Math.round(cropBox.width * imgNaturalSize.width);
  const pixelCropH = Math.round(cropBox.height * imgNaturalSize.height);

  return (
    <div className="space-y-6">
      {!imageSrc ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const f = e.dataTransfer.files?.[0];
            if (f) handleFile(f);
          }}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50/60 hover:bg-blue-50/40 rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition flex flex-col items-center justify-center space-y-4"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/svg+xml"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
            className="hidden"
          />
          <div className="w-16 h-16 rounded-2xl bg-blue-100/80 text-blue-600 flex items-center justify-center shadow-xs">
            <Crop className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <p className="text-base sm:text-lg font-bold text-slate-800">
              Drop an image to crop, or <span className="text-blue-600">browse</span>
            </p>
            <p className="text-xs sm:text-sm text-slate-500">
              Crop with custom aspect ratios, precision coordinates, and live visual preview
            </p>
          </div>
          <button
            type="button"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-xs transition inline-flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Select Image
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Header Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs">
            <div>
              <p className="text-sm font-bold text-slate-800">{fileName}</p>
              <p className="text-xs text-slate-400">
                Original: {imgNaturalSize.width} × {imgNaturalSize.height} px • Crop: {pixelCropW} × {pixelCropH} px
              </p>
            </div>

            <button
              onClick={resetAll}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
            >
              Change Image
            </button>
          </div>

          {/* Aspect Ratio Presets */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-600 mr-2">Aspect Ratio:</span>
              {[
                { label: 'Freeform', val: 'free' },
                { label: '1:1 Square', val: '1:1' },
                { label: '16:9 Landscape', val: '16:9' },
                { label: '4:3 Standard', val: '4:3' },
                { label: '3:2 Classic', val: '3:2' },
                { label: '9:16 Story', val: '9:16' }
              ].map(item => (
                <button
                  key={item.val}
                  onClick={() => handleAspectRatioChange(item.val)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition ${
                    aspectRatio === item.val
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Quick Dimension & Position Sliders */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">Crop Width ({Math.round(cropBox.width * 100)}%)</label>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.01"
                  value={cropBox.width}
                  onChange={(e) => {
                    const w = parseFloat(e.target.value);
                    setCropBox(prev => ({
                      ...prev,
                      width: w,
                      x: Math.min(prev.x, 1 - w)
                    }));
                  }}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">Crop Height ({Math.round(cropBox.height * 100)}%)</label>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.01"
                  value={cropBox.height}
                  onChange={(e) => {
                    const h = parseFloat(e.target.value);
                    setCropBox(prev => ({
                      ...prev,
                      height: h,
                      y: Math.min(prev.y, 1 - h)
                    }));
                  }}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">Format</label>
                <select
                  value={outputFormat}
                  onChange={(e) => setOutputFormat(e.target.value as any)}
                  className="w-full px-2.5 py-1 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                >
                  <option value="image/png">PNG (Lossless)</option>
                  <option value="image/jpeg">JPG (Compressed)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">Quality ({Math.round(quality * 100)}%)</label>
                <input
                  type="range"
                  min="0.5"
                  max="1.0"
                  step="0.05"
                  value={quality}
                  disabled={outputFormat === 'image/png'}
                  onChange={(e) => setQuality(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 disabled:opacity-40"
                />
              </div>
            </div>
          </div>

          {/* Interactive Workspace & Live Output */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Interactive Image with Overlay Box */}
            <div className="bg-slate-900/95 rounded-2xl p-4 flex flex-col items-center justify-center min-h-[340px] shadow-xs">
              <div
                ref={containerRef}
                className="relative inline-block select-none max-w-full max-h-[400px] overflow-hidden rounded-lg cursor-crosshair touch-none"
              >
                <img
                  ref={imageRef}
                  src={imageSrc}
                  alt="Crop Target"
                  onLoad={onImageLoad}
                  className="max-h-[380px] w-auto object-contain block opacity-70"
                />

                {/* Crop Selection Box */}
                <div
                  onPointerDown={startDrag}
                  onPointerMove={onPointerMove}
                  onPointerUp={stopDrag}
                  onPointerCancel={stopDrag}
                  style={{
                    left: `${cropBox.x * 100}%`,
                    top: `${cropBox.y * 100}%`,
                    width: `${cropBox.width * 100}%`,
                    height: `${cropBox.height * 100}%`
                  }}
                  className="absolute border-2 border-blue-400 bg-blue-500/10 cursor-move shadow-2xl flex items-center justify-center"
                >
                  <div className="w-2 h-2 rounded-full bg-white border border-blue-600" />
                  <span className="absolute bottom-1 right-1 bg-slate-900/80 text-white text-[9px] font-mono px-1.5 py-0.5 rounded">
                    {pixelCropW} × {pixelCropH}
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Drag the highlighted blue box to reposition your crop
              </p>
            </div>

            {/* Live Cropped Result Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">Crop Preview</h3>
                  <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                    {pixelCropW} × {pixelCropH} px
                  </span>
                </div>
                <div className="bg-slate-100 rounded-xl overflow-hidden min-h-[220px] max-h-[280px] flex items-center justify-center p-2 border border-slate-200/60">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Cropped Preview"
                      className="max-h-[250px] max-w-full object-contain rounded-md shadow-xs"
                    />
                  ) : (
                    <span className="text-xs text-slate-400">Rendering preview...</span>
                  )}
                </div>
              </div>

              <button
                onClick={downloadCroppedImage}
                disabled={!previewUrl}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-xs transition inline-flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download Cropped {outputFormat === 'image/png' ? 'PNG' : 'JPG'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
