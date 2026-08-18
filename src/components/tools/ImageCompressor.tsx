import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, Download, RefreshCw, Sliders, CheckCircle2, AlertTriangle, ArrowDown } from 'lucide-react';

export const ImageCompressor: React.FC = () => {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [compressedPreview, setCompressedPreview] = useState<string | null>(null);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  
  const [quality, setQuality] = useState<number>(80);
  const [maxDimension, setMaxDimension] = useState<number>(1920);
  const [outputFormat, setOutputFormat] = useState<'image/jpeg' | 'image/webp' | 'image/png'>('image/jpeg');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileSelect = (file: File) => {
    setErrorMsg(null);
    if (!file.type.match(/^image\/(jpeg|jpg|png|webp)/i)) {
      setErrorMsg('Please select a valid image file (JPG, JPEG, PNG, or WebP).');
      return;
    }

    setOriginalFile(file);
    setOriginalSize(file.size);
    
    // Choose format matching upload if possible
    if (file.type.includes('webp')) setOutputFormat('image/webp');
    else if (file.type.includes('png')) setOutputFormat('image/png');
    else setOutputFormat('image/jpeg');

    const reader = new FileReader();
    reader.onload = (e) => {
      setOriginalPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const compressImage = useCallback(() => {
    if (!originalPreview) return;
    setIsProcessing(true);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = originalPreview;

    img.onload = () => {
      let width = img.naturalWidth;
      let height = img.naturalHeight;

      // Scale dimensions if larger than maxDimension
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setIsProcessing(false);
        setErrorMsg('Canvas rendering failed on this device.');
        return;
      }

      // Smooth resizing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // For JPEG format, fill white background if transparent
      if (outputFormat === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
      }

      ctx.drawImage(img, 0, 0, width, height);

      const q = quality / 100;
      canvas.toBlob(
        (blob) => {
          setIsProcessing(false);
          if (blob) {
            setCompressedBlob(blob);
            setCompressedSize(blob.size);
            if (compressedPreview) URL.revokeObjectURL(compressedPreview);
            setCompressedPreview(URL.createObjectURL(blob));
          }
        },
        outputFormat,
        outputFormat === 'image/png' ? undefined : q
      );
    };

    img.onerror = () => {
      setIsProcessing(false);
      setErrorMsg('Failed to process image file.');
    };
  }, [originalPreview, maxDimension, quality, outputFormat, compressedPreview]);

  useEffect(() => {
    if (originalPreview) {
      compressImage();
    }
  }, [compressImage, originalPreview]);

  const handleDownload = () => {
    if (!compressedBlob || !originalFile) return;
    const ext = outputFormat === 'image/webp' ? 'webp' : outputFormat === 'image/png' ? 'png' : 'jpg';
    const originalName = originalFile.name.replace(/\.[^/.]+$/, '');
    const filename = `${originalName}-compressed.${ext}`;

    const link = document.createElement('a');
    link.href = URL.createObjectURL(compressedBlob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    setOriginalFile(null);
    setOriginalPreview(null);
    setOriginalSize(0);
    setCompressedBlob(null);
    if (compressedPreview) URL.revokeObjectURL(compressedPreview);
    setCompressedPreview(null);
    setCompressedSize(0);
    setErrorMsg(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const percentSaved = originalSize > 0 && compressedSize > 0 
    ? Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100))
    : 0;

  return (
    <div className="space-y-6">
      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Upload Box */}
      {!originalFile ? (
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
            accept="image/jpeg,image/png,image/webp,image/jpg"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) handleFileSelect(e.target.files[0]);
            }}
          />
          <div className="w-16 h-16 rounded-2xl bg-blue-600/10 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition">
            <Upload className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">
            Choose an image or drag & drop here
          </h3>
          <p className="text-sm text-slate-500 max-w-sm mb-4">
            Supports JPG, JPEG, PNG, and WebP up to 50MB. Processed 100% locally.
          </p>
          <span className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg shadow-xs hover:bg-blue-700 transition">
            Select Image
          </span>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Quality Slider */}
            <div>
              <div className="flex justify-between items-center text-sm font-semibold text-slate-700 mb-2">
                <label className="flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-blue-600" />
                  Compression Quality
                </label>
                <span className="text-blue-600 bg-blue-100 px-2 py-0.5 rounded-md text-xs font-bold">
                  {quality}%
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>Smaller File</span>
                <span>Best Quality</span>
              </div>
            </div>

            {/* Max Dimension */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Max Width/Height (Resolution)
              </label>
              <select
                value={maxDimension}
                onChange={(e) => setMaxDimension(Number(e.target.value))}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-blue-600 font-medium"
              >
                <option value="3840">Original / 4K (3840px)</option>
                <option value="1920">Full HD (1920px) - Recommended</option>
                <option value="1280">Standard HD (1280px)</option>
                <option value="800">Compact Web (800px)</option>
                <option value="500">Thumbnail (500px)</option>
              </select>
            </div>

            {/* Output Format */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Output Format
              </label>
              <select
                value={outputFormat}
                onChange={(e) => setOutputFormat(e.target.value as any)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-blue-600 font-medium"
              >
                <option value="image/jpeg">JPG / JPEG (Best for photos)</option>
                <option value="image/webp">WebP (Next-gen lightweight)</option>
                <option value="image/png">PNG (Lossless)</option>
              </select>
            </div>
          </div>

          {/* Stats & Comparison Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold block mb-1">
                Original Size
              </span>
              <span className="text-lg font-bold text-slate-800">
                {formatFileSize(originalSize)}
              </span>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <span className="text-xs text-blue-600 uppercase tracking-wider font-semibold block mb-1">
                Compressed Size
              </span>
              <span className="text-lg font-bold text-blue-700 flex items-center gap-1.5">
                {isProcessing ? 'Compressing...' : formatFileSize(compressedSize)}
              </span>
            </div>

            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
              <span className="text-xs text-emerald-600 uppercase tracking-wider font-semibold block mb-1">
                Savings
              </span>
              <span className="text-lg font-bold text-emerald-700 flex items-center gap-1">
                <ArrowDown className="w-4 h-4 text-emerald-600" />
                {percentSaved}% Smaller
              </span>
            </div>
          </div>

          {/* Visual Previews */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 flex flex-col">
              <span className="text-xs font-bold text-slate-600 mb-2">Original Preview</span>
              <div className="relative aspect-video bg-slate-200/60 rounded-lg overflow-hidden flex items-center justify-center">
                {originalPreview && (
                  <img
                    src={originalPreview}
                    alt="Original"
                    className="max-h-full max-w-full object-contain"
                  />
                )}
              </div>
            </div>

            <div className="border border-blue-200 rounded-xl p-3 bg-blue-50/30 flex flex-col">
              <span className="text-xs font-bold text-blue-700 mb-2">Compressed Result</span>
              <div className="relative aspect-video bg-slate-200/60 rounded-lg overflow-hidden flex items-center justify-center">
                {compressedPreview ? (
                  <img
                    src={compressedPreview}
                    alt="Compressed result"
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
                    <span>Compressing image...</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200">
            <button
              onClick={handleReset}
              className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition flex items-center gap-1.5"
            >
              <RefreshCw className="w-4 h-4" />
              Compress Another Image
            </button>

            <button
              onClick={handleDownload}
              disabled={isProcessing || !compressedBlob}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-md transition flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download Compressed Image ({formatFileSize(compressedSize)})
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
