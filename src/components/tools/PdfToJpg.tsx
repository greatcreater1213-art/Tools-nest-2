import React, { useState, useRef, useEffect } from 'react';
import { Upload, Download, FileText, Check, AlertCircle, RefreshCw, Eye, Image as ImageIcon, Sparkles } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';

// Set up pdfjs worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

interface PageImage {
  pageNumber: number;
  dataUrl: string;
  blob: Blob;
  width: number;
  height: number;
}

export const PdfToJpg: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PageImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [error, setError] = useState<string | null>(null);
  const [quality, setQuality] = useState<number>(0.92);
  const [scale, setScale] = useState<number>(2.0); // High res 2x
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [downloadingAll, setDownloadingAll] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (selected.type !== 'application/pdf' && !selected.name.toLowerCase().endsWith('.pdf')) {
        setError('Please upload a valid PDF file.');
        return;
      }
      setFile(selected);
      setError(null);
      renderPdf(selected);
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
      setError(null);
      renderPdf(dropped);
    }
  };

  const renderPdf = async (pdfFile: File) => {
    setLoading(true);
    setPages([]);
    setError(null);

    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdfDoc = await loadingTask.promise;
      const numPages = pdfDoc.numPages;

      setProgress({ current: 0, total: numPages });
      const renderedPages: PageImage[] = [];

      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        setProgress({ current: pageNum, total: numPages });
        const page = await pdfDoc.getPage(pageNum);
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        if (context) {
          // Fill white background for PDF page rendering
          context.fillStyle = '#ffffff';
          context.fillRect(0, 0, canvas.width, canvas.height);

          await page.render({
            canvasContext: context,
            viewport: viewport,
            canvas: canvas
          } as any).promise;

          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          const blob = await new Promise<Blob>((resolve) => {
            canvas.toBlob((b) => resolve(b || new Blob()), 'image/jpeg', quality);
          });

          renderedPages.push({
            pageNumber: pageNum,
            dataUrl,
            blob,
            width: viewport.width,
            height: viewport.height
          });
        }
      }

      setPages(renderedPages);
      setSelectedPages(renderedPages.map(p => p.pageNumber));
    } catch (err: any) {
      console.error('Failed to convert PDF:', err);
      setError(err?.message || 'Failed to render PDF pages. Please verify the file is not corrupted or password-protected.');
    } finally {
      setLoading(false);
    }
  };

  const downloadSinglePage = (page: PageImage) => {
    const link = document.createElement('a');
    link.href = page.dataUrl;
    const baseName = file ? file.name.replace(/\.[^/.]+$/, '') : 'document';
    link.download = `${baseName}-page-${page.pageNumber}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadSelectedPages = async () => {
    if (pages.length === 0) return;
    setDownloadingAll(true);
    const baseName = file ? file.name.replace(/\.[^/.]+$/, '') : 'document';

    for (const page of pages) {
      if (selectedPages.includes(page.pageNumber)) {
        downloadSinglePage(page);
        // Small delay to prevent browser download throttling
        await new Promise(r => setTimeout(r, 250));
      }
    }
    setDownloadingAll(false);
  };

  const togglePageSelection = (pageNum: number) => {
    setSelectedPages(prev =>
      prev.includes(pageNum)
        ? prev.filter(p => p !== pageNum)
        : [...prev, pageNum].sort((a, b) => a - b)
    );
  };

  const resetAll = () => {
    setFile(null);
    setPages([]);
    setSelectedPages([]);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

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
              Drop your PDF file here, or <span className="text-blue-600">browse</span>
            </p>
            <p className="text-xs sm:text-sm text-slate-500">
              Converts all pages into high-resolution JPG images client-side
            </p>
          </div>
          <button
            type="button"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-xs transition inline-flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Select PDF Document
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* File Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-800 truncate">{file.name}</p>
                <p className="text-xs text-slate-500">{(file.size / (1024 * 1024)).toFixed(2)} MB • {pages.length} Pages</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={resetAll}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
              >
                Change PDF
              </button>
            </div>
          </div>

          {/* Loading Indicator */}
          {loading && (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
              <p className="text-sm font-bold text-slate-800">
                Rendering Page {progress.current} of {progress.total}...
              </p>
              <div className="w-full max-w-xs mx-auto bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-blue-600 h-full transition-all duration-200"
                  style={{ width: `${(progress.current / (progress.total || 1)) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-700 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {/* Rendered Pages Grid */}
          {pages.length > 0 && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Converted Pages ({pages.length})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Select pages to download or download individually
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedPages(pages.map(p => p.pageNumber))}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
                  >
                    Select All
                  </button>
                  <button
                    onClick={downloadSelectedPages}
                    disabled={selectedPages.length === 0 || downloadingAll}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition inline-flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    {downloadingAll ? 'Downloading...' : `Download Selected (${selectedPages.length})`}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {pages.map((page) => {
                  const isSelected = selectedPages.includes(page.pageNumber);
                  return (
                    <div
                      key={page.pageNumber}
                      className={`relative bg-white rounded-2xl border ${
                        isSelected ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-200'
                      } p-3.5 shadow-xs transition space-y-3`}
                    >
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => togglePageSelection(page.pageNumber)}
                            className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                          />
                          <span>Page {page.pageNumber}</span>
                        </label>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {(page.blob.size / 1024).toFixed(0)} KB
                        </span>
                      </div>

                      <div className="bg-slate-100 rounded-xl overflow-hidden aspect-[3/4] flex items-center justify-center border border-slate-200/60">
                        <img
                          src={page.dataUrl}
                          alt={`Page ${page.pageNumber}`}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      <button
                        onClick={() => downloadSinglePage(page)}
                        className="w-full py-2 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-xs font-bold rounded-xl transition inline-flex items-center justify-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download JPG
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
