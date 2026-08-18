import React, { useState, useRef } from 'react';
import { Upload, Download, RefreshCw, FileImage, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';

export const JpgToPngConverter: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [pngBlob, setPngBlob] = useState<Blob | null>(null);
  const [pngSize, setPngSize] = useState<number>(0);
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
    if (!selectedFile.type.match(/^image\/(jpeg|jpg)/i) && !selectedFile.name.match(/\.(jpe?g)$/i)) {
      setErrorMsg('Please select a valid JPG or JPEG image.');
      return;
    }

    setFile(selectedFile);
    setIsConverting(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      setPreview(src);

      const img = new Image();
      img.src = src;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setIsConverting(false);
          setErrorMsg('Failed to initialize conversion canvas.');
          return;
        }

        ctx.drawImage(img, 0, 0);

        canvas.toBlob((blob) => {
          setIsConverting(false);
          if (blob) {
            setPngBlob(blob);
            setPngSize(blob.size);
          }
        }, 'image/png');
      };

      img.onerror = () => {
        setIsConverting(false);
        setErrorMsg('Failed to decode JPG image.');
      };
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleDownload = () => {
    if (!pngBlob || !file) return;
    const baseName = file.name.replace(/\.[^/.]+$/, '');
    const filename = `${baseName}.png`;

    const link = document.createElement('a');
    link.href = URL.createObjectURL(pngBlob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setPngBlob(null);
    setPngSize(0);
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
            accept="image/jpeg,image/jpg"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) handleFileSelect(e.target.files[0]);
            }}
          />
          <div className="w-16 h-16 rounded-2xl bg-blue-600/10 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition">
            <FileImage className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">
            Choose a JPG / JPEG file to convert
          </h3>
          <p className="text-sm text-slate-500 max-w-sm mb-4">
            Converts directly inside your browser to lossless PNG with zero server upload.
          </p>
          <span className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg shadow-xs hover:bg-blue-700 transition">
            Select JPG Image
          </span>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Conversion Status Banner */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-emerald-900 font-bold text-sm sm:text-base">
                  Conversion Complete! Ready to Download.
                </h4>
                <div className="flex items-center gap-2 text-xs text-emerald-700 font-medium mt-0.5">
                  <span>JPG ({formatFileSize(file.size)})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span className="font-bold">PNG ({formatFileSize(pngSize)})</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleDownload}
              disabled={isConverting || !pngBlob}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-xs transition flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download PNG
            </button>
          </div>

          {/* Preview Box */}
          <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50">
            <span className="text-xs font-bold uppercase text-slate-500 block mb-2">
              Converted Image Preview
            </span>
            <div className="relative aspect-video max-h-[350px] bg-slate-200/60 rounded-xl overflow-hidden flex items-center justify-center p-2">
              {preview && (
                <img
                  src={preview}
                  alt="Converted PNG preview"
                  className="max-h-full max-w-full object-contain rounded-md shadow-xs"
                />
              )}
            </div>
          </div>

          {/* Action Row */}
          <div className="flex justify-between items-center pt-2">
            <button
              onClick={handleReset}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition flex items-center gap-1.5"
            >
              <RefreshCw className="w-4 h-4" />
              Convert Another JPG
            </button>

            <button
              onClick={handleDownload}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs transition flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Save Lossless PNG
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
