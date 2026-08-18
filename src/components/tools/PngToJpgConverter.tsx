import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, Download, RefreshCw, FileCode, CheckCircle, AlertTriangle, ArrowRight, Palette } from 'lucide-react';

export const PngToJpgConverter: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [bgColor, setBgColor] = useState<string>('#ffffff');
  const [quality, setQuality] = useState<number>(90);
  const [jpgBlob, setJpgBlob] = useState<Blob | null>(null);
  const [jpgSize, setJpgSize] = useState<number>(0);
  const [jpgPreview, setJpgPreview] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileSelect = (selectedFile: File) => {
    setErrorMsg(null);
    if (!selectedFile.type.match(/^image\/png/i) && !selectedFile.name.match(/\.png$/i)) {
      setErrorMsg('Please select a valid PNG image.');
      return;
    }

    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const convertToJpg = useCallback(() => {
    if (!preview) return;
    setIsConverting(true);

    const img = new Image();
    img.src = preview;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setIsConverting(false);
        setErrorMsg('Failed to process image canvas.');
        return;
      }

      // Fill background color for transparent areas
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw the PNG image on top
      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          setIsConverting(false);
          if (blob) {
            setJpgBlob(blob);
            setJpgSize(blob.size);
            if (jpgPreview) URL.revokeObjectURL(jpgPreview);
            setJpgPreview(URL.createObjectURL(blob));
          }
        },
        'image/jpeg',
        quality / 100
      );
    };

    img.onerror = () => {
      setIsConverting(false);
      setErrorMsg('Failed to load PNG image.');
    };
  }, [preview, bgColor, quality, jpgPreview]);

  useEffect(() => {
    if (preview) {
      convertToJpg();
    }
  }, [convertToJpg, preview]);

  const handleDownload = () => {
    if (!jpgBlob || !file) return;
    const baseName = file.name.replace(/\.[^/.]+$/, '');
    const filename = `${baseName}.jpg`;

    const link = document.createElement('a');
    link.href = URL.createObjectURL(jpgBlob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setJpgBlob(null);
    if (jpgPreview) URL.revokeObjectURL(jpgPreview);
    setJpgPreview(null);
    setJpgSize(0);
    setErrorMsg(null);
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
            accept="image/png"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) handleFileSelect(e.target.files[0]);
            }}
          />
          <div className="w-16 h-16 rounded-2xl bg-blue-600/10 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition">
            <FileCode className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">
            Choose a PNG file to convert to JPG
          </h3>
          <p className="text-sm text-slate-500 max-w-sm mb-4">
            Supports transparent PNGs with custom background fill selection.
          </p>
          <span className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg shadow-xs hover:bg-blue-700 transition">
            Select PNG Image
          </span>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Options Bar */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Background Color Fill */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-2">
                Fill Color for Transparent Areas
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-10 h-10 rounded-xl border border-slate-300 cursor-pointer p-0.5 bg-white"
                />
                <input
                  type="text"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-28 bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm font-mono uppercase text-slate-800"
                />
                <div className="flex gap-1.5">
                  {['#ffffff', '#000000', '#f8fafc', '#f1f5f9'].map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setBgColor(c)}
                      className="w-7 h-7 rounded-lg border border-slate-300 shadow-xs"
                      style={{ backgroundColor: c }}
                      title={`Set background ${c}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Quality Slider */}
            <div>
              <div className="flex justify-between items-center text-xs font-bold uppercase text-slate-600 mb-2">
                <span>JPEG Quality</span>
                <span className="text-blue-600 font-mono">{quality}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                step="5"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 mt-2"
              />
            </div>
          </div>

          {/* Status & Size Comparison */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-emerald-900 font-bold text-sm sm:text-base">
                  JPG Ready for Download
                </h4>
                <div className="flex items-center gap-2 text-xs text-emerald-700 font-medium mt-0.5">
                  <span>PNG ({formatFileSize(file.size)})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span className="font-bold">JPG ({formatFileSize(jpgSize)})</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleDownload}
              disabled={isConverting || !jpgBlob}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-xs transition flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download JPG
            </button>
          </div>

          {/* Preview */}
          <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50">
            <span className="text-xs font-bold uppercase text-slate-500 block mb-2">
              Converted JPG Preview
            </span>
            <div className="relative aspect-video max-h-[350px] bg-slate-200/60 rounded-xl overflow-hidden flex items-center justify-center p-2">
              {jpgPreview ? (
                <img
                  src={jpgPreview}
                  alt="Converted JPG preview"
                  className="max-h-full max-w-full object-contain rounded-md shadow-xs"
                />
              ) : (
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
                  <span>Converting PNG to JPG...</span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center pt-2">
            <button
              onClick={handleReset}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition flex items-center gap-1.5"
            >
              <RefreshCw className="w-4 h-4" />
              Convert Another PNG
            </button>

            <button
              onClick={handleDownload}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs transition flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download JPG Image
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
