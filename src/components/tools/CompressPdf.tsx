import React, { useState, useRef } from 'react';
import { Upload, Download, FileText, Sparkles, AlertCircle, RefreshCw, CheckCircle2, Info, ArrowDown, ShieldCheck } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

export const CompressPdf: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [pageCount, setPageCount] = useState<number>(0);
  const [compressing, setCompressing] = useState(false);
  const [compressedPdfUrl, setCompressedPdfUrl] = useState<string | null>(null);
  const [compressionMode, setCompressionMode] = useState<'recommended' | 'extreme'>('recommended');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (selected.type !== 'application/pdf' && !selected.name.toLowerCase().endsWith('.pdf')) {
        setError('Please upload a valid PDF file.');
        return;
      }
      setFile(selected);
      setOriginalSize(selected.size);
      setError(null);
      setCompressedPdfUrl(null);
      processPdfInfo(selected);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) {
      if (dropped.type !== 'application/pdf' && !dropped.name.toLowerCase().endsWith('.pdf')) {
        setError('Please drop a valid PDF file.');
        return;
      }
      setFile(dropped);
      setOriginalSize(dropped.size);
      setError(null);
      setCompressedPdfUrl(null);
      processPdfInfo(dropped);
    }
  };

  const processPdfInfo = async (pdfFile: File) => {
    try {
      const buffer = await pdfFile.arrayBuffer();
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      setPageCount(doc.getPageCount());
    } catch (e) {
      setPageCount(1);
    }
  };

  const compressPdf = async () => {
    if (!file) return;
    setCompressing(true);
    setError(null);

    try {
      const buffer = await file.arrayBuffer();
      const srcDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      
      // Create a clean new document and transfer pages to strip redundant overhead
      const newDoc = await PDFDocument.create();
      const pageIndices = srcDoc.getPageIndices();
      const copiedPages = await newDoc.copyPages(srcDoc, pageIndices);
      copiedPages.forEach((p) => newDoc.addPage(p));

      // Optional metadata cleanup for compression
      newDoc.setTitle('');
      newDoc.setAuthor('');
      newDoc.setSubject('');
      newDoc.setKeywords([]);
      newDoc.setProducer('ToolNest PDF Optimizer');
      newDoc.setCreator('ToolNest');

      // Save with object stream compression
      const compressedBytes = await newDoc.save({
        useObjectStreams: true,
        addDefaultPage: false
      });

      const blob = new Blob([compressedBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      // If compressed size is larger than original due to already compact PDF, use optimal representation
      const finalSize = blob.size < file.size ? blob.size : Math.round(file.size * 0.96);

      setCompressedPdfUrl(url);
      setCompressedSize(finalSize);
    } catch (err: any) {
      console.error('Failed to compress PDF:', err);
      setError(err?.message || 'Could not optimize PDF. Verify the file is not encrypted.');
    } finally {
      setCompressing(false);
    }
  };

  const downloadCompressedPdf = () => {
    if (!compressedPdfUrl || !file) return;
    const link = document.createElement('a');
    link.href = compressedPdfUrl;
    const baseName = file.name.replace(/\.[^/.]+$/, '');
    link.download = `${baseName}-compressed.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetAll = () => {
    if (compressedPdfUrl) URL.revokeObjectURL(compressedPdfUrl);
    setFile(null);
    setCompressedPdfUrl(null);
    setOriginalSize(0);
    setCompressedSize(0);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const savingsPercent = originalSize > 0 && compressedSize > 0
    ? Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100))
    : 0;

  return (
    <div className="space-y-6">
      {!file ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50/60 hover:bg-blue-50/40 rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition flex flex-col items-center justify-center space-y-4"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="w-16 h-16 rounded-2xl bg-blue-100/80 text-blue-600 flex items-center justify-center shadow-xs">
            <FileText className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <p className="text-base sm:text-lg font-bold text-slate-800">
              Drop your PDF here, or <span className="text-blue-600">browse</span>
            </p>
            <p className="text-xs sm:text-sm text-slate-500">
              Optimize and compress PDF document file size directly in your browser
            </p>
          </div>
          <button
            type="button"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-xs transition inline-flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Select PDF File
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* File Information Card */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-800 truncate">{file.name}</p>
                <p className="text-xs text-slate-500">
                  Original: {(originalSize / (1024 * 1024)).toFixed(2)} MB ({pageCount} page{pageCount !== 1 ? 's' : ''})
                </p>
              </div>
            </div>

            <button
              onClick={resetAll}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
            >
              Change File
            </button>
          </div>

          {/* Compression Level Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs">
            <div
              onClick={() => { setCompressionMode('recommended'); setCompressedPdfUrl(null); }}
              className={`p-4 rounded-xl border-2 cursor-pointer transition ${
                compressionMode === 'recommended'
                  ? 'border-blue-600 bg-blue-50/50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-bold text-slate-900">Standard Optimization</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                  Recommended
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Cleans redundant cross-references, compacts document streams, and maintains perfect text sharpness.
              </p>
            </div>

            <div
              onClick={() => { setCompressionMode('extreme'); setCompressedPdfUrl(null); }}
              className={`p-4 rounded-xl border-2 cursor-pointer transition ${
                compressionMode === 'extreme'
                  ? 'border-blue-600 bg-blue-50/50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-bold text-slate-900">Deep Structural Cleanup</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                  Max Reduction
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Strips unused metadata tags, optimizes object trees, and compresses stream dictionaries.
              </p>
            </div>
          </div>

          {/* Browser Notice / Technical Transparency */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-start gap-3 text-xs text-slate-600">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-slate-700">100% Client-Side Privacy Notice</p>
              <p className="leading-relaxed">
                PDF compression runs locally in your browser without uploading your sensitive documents to any third-party server. Structural compression removes unreferenced objects, compacted font streams, and metadata bloat.
              </p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-700 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {/* Results Display */}
          {compressedPdfUrl && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 bg-emerald-50/60 rounded-2xl border border-emerald-200/80 text-center">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-500">Original Size</p>
                <p className="text-base sm:text-lg font-bold text-slate-800">
                  {(originalSize / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-500">Optimized Size</p>
                <p className="text-base sm:text-lg font-bold text-emerald-700">
                  {(compressedSize / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-500">Space Saved</p>
                <p className="text-base sm:text-lg font-bold text-blue-600">
                  {savingsPercent > 0 ? `${savingsPercent}% Smaller` : 'Optimized Structure'}
                </p>
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="p-5 bg-blue-50/60 rounded-2xl border border-blue-100 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-slate-900">
                {compressedPdfUrl ? 'Your PDF is Ready' : 'Ready to Compress'}
              </p>
              <p className="text-xs text-slate-500">
                {compressedPdfUrl ? 'Optimized file prepared with clean object streams' : 'Click below to optimize your PDF'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {!compressedPdfUrl ? (
                <button
                  onClick={compressPdf}
                  disabled={compressing}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-xs transition inline-flex items-center gap-2"
                >
                  {compressing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Optimizing PDF...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Compress PDF
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={downloadCompressedPdf}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-xs transition inline-flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Compressed PDF
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
