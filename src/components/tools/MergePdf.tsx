import React, { useState, useRef } from 'react';
import { Upload, Download, FileText, ArrowUp, ArrowDown, Trash2, Plus, Sparkles, AlertCircle, RefreshCw, Files } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

interface PdfFileItem {
  id: string;
  file: File;
  name: string;
  size: number;
  pageCount?: number;
}

export const MergePdf: React.FC = () => {
  const [pdfFiles, setPdfFiles] = useState<PdfFileItem[]>([]);
  const [outputName, setOutputName] = useState<string>('merged-document');
  const [merging, setMerging] = useState(false);
  const [mergedPdfUrl, setMergedPdfUrl] = useState<string | null>(null);
  const [mergedSize, setMergedSize] = useState<number>(0);
  const [totalMergedPages, setTotalMergedPages] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;
    const newItems: PdfFileItem[] = [];

    for (const file of Array.from(files)) {
      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        let pageCount = 0;
        try {
          const buffer = await file.arrayBuffer();
          const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
          pageCount = doc.getPageCount();
        } catch (e) {
          pageCount = 1;
        }

        newItems.push({
          id: Math.random().toString(36).substring(2, 9),
          file,
          name: file.name,
          size: file.size,
          pageCount
        });
      }
    }

    if (newItems.length === 0) {
      setError('Please select valid PDF documents.');
      return;
    }

    setPdfFiles(prev => [...prev, ...newItems]);
    setError(null);
    setMergedPdfUrl(null);
  };

  const removeFile = (id: string) => {
    setPdfFiles(prev => prev.filter(f => f.id !== id));
    setMergedPdfUrl(null);
  };

  const moveFile = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === pdfFiles.length - 1)) {
      return;
    }
    const newFiles = [...pdfFiles];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const temp = newFiles[index];
    newFiles[index] = newFiles[targetIndex];
    newFiles[targetIndex] = temp;
    setPdfFiles(newFiles);
    setMergedPdfUrl(null);
  };

  const mergePdfs = async () => {
    if (pdfFiles.length < 2) {
      setError('Please add at least 2 PDF files to merge.');
      return;
    }

    setMerging(true);
    setError(null);

    try {
      const mergedDoc = await PDFDocument.create();
      let totalPages = 0;

      for (const item of pdfFiles) {
        const fileBuffer = await item.file.arrayBuffer();
        const srcDoc = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });
        const copiedPages = await mergedDoc.copyPages(srcDoc, srcDoc.getPageIndices());
        copiedPages.forEach((page) => mergedDoc.addPage(page));
        totalPages += copiedPages.length;
      }

      const mergedBytes = await mergedDoc.save();
      const blob = new Blob([mergedBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      setMergedPdfUrl(url);
      setMergedSize(blob.size);
      setTotalMergedPages(totalPages);
    } catch (err: any) {
      console.error('Failed to merge PDFs:', err);
      setError(err?.message || 'Failed to merge PDF files. Please ensure none of the files are password-encrypted.');
    } finally {
      setMerging(false);
    }
  };

  const downloadMergedPdf = () => {
    if (!mergedPdfUrl) return;
    const link = document.createElement('a');
    link.href = mergedPdfUrl;
    link.download = `${outputName.trim() || 'merged-document'}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearAll = () => {
    if (mergedPdfUrl) URL.revokeObjectURL(mergedPdfUrl);
    setPdfFiles([]);
    setMergedPdfUrl(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6">
      {pdfFiles.length === 0 ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleFiles(e.dataTransfer.files);
          }}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50/60 hover:bg-blue-50/40 rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition flex flex-col items-center justify-center space-y-4"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            multiple
            onChange={(e) => handleFiles(e.target.files)}
            className="hidden"
          />
          <div className="w-16 h-16 rounded-2xl bg-blue-100/80 text-blue-600 flex items-center justify-center shadow-xs">
            <Files className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <p className="text-base sm:text-lg font-bold text-slate-800">
              Drop multiple PDF files here, or <span className="text-blue-600">browse</span>
            </p>
            <p className="text-xs sm:text-sm text-slate-500">
              Combine two or more PDF documents into a single organized file
            </p>
          </div>
          <button
            type="button"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-xs transition inline-flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Select PDF Files
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Header Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs">
            <div>
              <span className="text-sm font-bold text-slate-800">
                {pdfFiles.length} PDF{pdfFiles.length > 1 ? 's' : ''} Ready to Merge
              </span>
              <p className="text-xs text-slate-400">
                Total Pages: {pdfFiles.reduce((acc, f) => acc + (f.pageCount || 0), 0)} • Total Size: {(pdfFiles.reduce((acc, f) => acc + f.size, 0) / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                multiple
                onChange={(e) => handleFiles(e.target.files)}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition inline-flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Add More PDFs
              </button>
              <button
                onClick={clearAll}
                className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition"
              >
                Clear All
              </button>
            </div>
          </div>

          {/* Merge Order List */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Document Merge Order
            </h3>
            <div className="space-y-2.5">
              {pdfFiles.map((item, idx) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 p-3.5 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-6 h-6 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-bold text-slate-800 truncate">{item.name}</p>
                      <p className="text-[11px] text-slate-400">
                        {item.pageCount} page{item.pageCount !== 1 ? 's' : ''} • {(item.size / 1024).toFixed(0)} KB
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => moveFile(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded-lg hover:bg-slate-100 transition"
                      title="Move up"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => moveFile(idx, 'down')}
                      disabled={idx === pdfFiles.length - 1}
                      className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded-lg hover:bg-slate-100 transition"
                      title="Move down"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeFile(item.id)}
                      className="p-1.5 text-rose-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                      title="Remove file"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Filename config */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="w-full sm:w-auto flex-1 max-w-sm">
              <label className="block text-xs font-bold text-slate-600 mb-1.5">Output File Name</label>
              <div className="flex items-center">
                <input
                  type="text"
                  value={outputName}
                  onChange={(e) => { setOutputName(e.target.value); setMergedPdfUrl(null); }}
                  placeholder="merged-document"
                  className="w-full px-3.5 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-l-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
                <span className="px-3 py-2 text-xs font-semibold bg-slate-100 border border-l-0 border-slate-200 text-slate-500 rounded-r-xl">
                  .pdf
                </span>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-700 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {/* Action & Download Area */}
          <div className="p-5 bg-blue-50/60 rounded-2xl border border-blue-100 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-slate-900">Merge Documents</p>
              <p className="text-xs text-slate-500">Fast client-side PDF joining with zero quality loss</p>
            </div>

            <div className="flex items-center gap-3">
              {!mergedPdfUrl ? (
                <button
                  onClick={mergePdfs}
                  disabled={merging || pdfFiles.length < 2}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-xs transition inline-flex items-center gap-2"
                >
                  {merging ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Merging PDFs...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Merge {pdfFiles.length} PDFs
                    </>
                  )}
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="text-right mr-2 hidden sm:block">
                    <p className="text-xs font-bold text-emerald-700">Merged Successfully!</p>
                    <p className="text-[11px] text-slate-500">{totalMergedPages} Pages • {(mergedSize / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                  <button
                    onClick={mergePdfs}
                    className="px-3.5 py-2 text-xs font-semibold text-slate-600 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 transition"
                  >
                    Re-merge
                  </button>
                  <button
                    onClick={downloadMergedPdf}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-xs transition inline-flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download Merged PDF
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
