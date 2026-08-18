import React, { useState, useRef } from 'react';
import { Upload, Download, FileText, ArrowUp, ArrowDown, Trash2, Plus, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { PDFDocument, PageSizes } from 'pdf-lib';

interface ImageItem {
  id: string;
  file: File;
  previewUrl: string;
  name: string;
  size: number;
}

export const JpgToPdf: React.FC = () => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [pageSize, setPageSize] = useState<'a4' | 'letter' | 'fit'>('a4');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [margin, setMargin] = useState<'none' | 'small' | 'normal'>('small');
  const [pdfName, setPdfName] = useState<string>('converted-document');
  const [generating, setGenerating] = useState(false);
  const [generatedPdfUrl, setGeneratedPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const newItems: ImageItem[] = [];

    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        newItems.push({
          id: Math.random().toString(36).substring(2, 9),
          file,
          previewUrl: URL.createObjectURL(file),
          name: file.name,
          size: file.size
        });
      }
    });

    if (newItems.length === 0) {
      setError('Please select valid JPG or PNG images.');
      return;
    }

    setImages(prev => [...prev, ...newItems]);
    setError(null);
    setGeneratedPdfUrl(null);
  };

  const removeImage = (id: string) => {
    setImages(prev => {
      const filtered = prev.filter(img => img.id !== id);
      const target = prev.find(img => img.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return filtered;
    });
    setGeneratedPdfUrl(null);
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === images.length - 1)) {
      return;
    }
    const newImages = [...images];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const temp = newImages[index];
    newImages[index] = newImages[targetIndex];
    newImages[targetIndex] = temp;
    setImages(newImages);
    setGeneratedPdfUrl(null);
  };

  const generatePdf = async () => {
    if (images.length === 0) return;
    setGenerating(true);
    setError(null);

    try {
      const pdfDoc = await PDFDocument.create();

      for (const item of images) {
        const imageBytes = await item.file.arrayBuffer();
        let pdfImage;

        if (item.file.type === 'image/png') {
          pdfImage = await pdfDoc.embedPng(imageBytes);
        } else {
          // Handle JPEG / other formats by embedding as JPEG or canvas conversion
          try {
            pdfImage = await pdfDoc.embedJpg(imageBytes);
          } catch (e) {
            // Fallback: render to canvas and convert to PNG if JPEG embedding fails
            const imgBitmap = await createImageBitmap(item.file);
            const canvas = document.createElement('canvas');
            canvas.width = imgBitmap.width;
            canvas.height = imgBitmap.height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(imgBitmap, 0, 0);
              const pngDataUrl = canvas.toDataURL('image/png');
              const pngBytes = await (await fetch(pngDataUrl)).arrayBuffer();
              pdfImage = await pdfDoc.embedPng(pngBytes);
            }
          }
        }

        if (!pdfImage) continue;

        const imgWidth = pdfImage.width;
        const imgHeight = pdfImage.height;

        let pageWidth: number;
        let pageHeight: number;

        if (pageSize === 'fit') {
          pageWidth = imgWidth;
          pageHeight = imgHeight;
        } else {
          const standardSize = pageSize === 'letter' ? PageSizes.Letter : PageSizes.A4;
          if (orientation === 'landscape') {
            pageWidth = standardSize[1];
            pageHeight = standardSize[0];
          } else {
            pageWidth = standardSize[0];
            pageHeight = standardSize[1];
          }
        }

        const page = pdfDoc.addPage([pageWidth, pageHeight]);

        let marginSize = 0;
        if (pageSize !== 'fit') {
          if (margin === 'small') marginSize = 15;
          if (margin === 'normal') marginSize = 30;
        }

        const availableWidth = pageWidth - (marginSize * 2);
        const availableHeight = pageHeight - (marginSize * 2);

        // Scale image while preserving aspect ratio
        const scaleFactor = Math.min(availableWidth / imgWidth, availableHeight / imgHeight);
        const drawWidth = imgWidth * scaleFactor;
        const drawHeight = imgHeight * scaleFactor;

        const xPos = marginSize + (availableWidth - drawWidth) / 2;
        const yPos = marginSize + (availableHeight - drawHeight) / 2;

        page.drawImage(pdfImage, {
          x: xPos,
          y: yPos,
          width: drawWidth,
          height: drawHeight,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setGeneratedPdfUrl(url);
    } catch (err: any) {
      console.error('Failed to create PDF:', err);
      setError(err?.message || 'Failed to generate PDF. Please try different images.');
    } finally {
      setGenerating(false);
    }
  };

  const downloadPdf = () => {
    if (!generatedPdfUrl) return;
    const link = document.createElement('a');
    link.href = generatedPdfUrl;
    link.download = `${pdfName.trim() || 'document'}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearAll = () => {
    images.forEach(img => URL.revokeObjectURL(img.previewUrl));
    if (generatedPdfUrl) URL.revokeObjectURL(generatedPdfUrl);
    setImages([]);
    setGeneratedPdfUrl(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6">
      {images.length === 0 ? (
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
            accept="image/jpeg,image/jpg,image/png,image/webp"
            multiple
            onChange={(e) => handleFiles(e.target.files)}
            className="hidden"
          />
          <div className="w-16 h-16 rounded-2xl bg-blue-100/80 text-blue-600 flex items-center justify-center shadow-xs">
            <Upload className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <p className="text-base sm:text-lg font-bold text-slate-800">
              Drop JPG or PNG images here, or <span className="text-blue-600">browse</span>
            </p>
            <p className="text-xs sm:text-sm text-slate-500">
              Combine multiple photos into a single professional PDF document
            </p>
          </div>
          <button
            type="button"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-xs transition inline-flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Select Images
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Header Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-800">
                {images.length} Image{images.length > 1 ? 's' : ''} Selected
              </span>
            </div>

            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                multiple
                onChange={(e) => handleFiles(e.target.files)}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition inline-flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Add More Images
              </button>
              <button
                onClick={clearAll}
                className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition"
              >
                Clear All
              </button>
            </div>
          </div>

          {/* Layout & PDF Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 sm:p-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">Page Size</label>
              <select
                value={pageSize}
                onChange={(e) => { setPageSize(e.target.value as any); setGeneratedPdfUrl(null); }}
                className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
              >
                <option value="a4">A4 Standard (210 × 297 mm)</option>
                <option value="letter">US Letter (8.5 × 11 in)</option>
                <option value="fit">Fit to Image Size</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">Orientation</label>
              <select
                value={orientation}
                disabled={pageSize === 'fit'}
                onChange={(e) => { setOrientation(e.target.value as any); setGeneratedPdfUrl(null); }}
                className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none disabled:opacity-50"
              >
                <option value="portrait">Portrait</option>
                <option value="landscape">Landscape</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">Margin</label>
              <select
                value={margin}
                disabled={pageSize === 'fit'}
                onChange={(e) => { setMargin(e.target.value as any); setGeneratedPdfUrl(null); }}
                className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none disabled:opacity-50"
              >
                <option value="none">No Margin (Full Bleed)</option>
                <option value="small">Small Margin (15 pt)</option>
                <option value="normal">Normal Margin (30 pt)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">PDF Filename</label>
              <input
                type="text"
                value={pdfName}
                onChange={(e) => setPdfName(e.target.value)}
                placeholder="document-name"
                className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Re-orderable Image Cards */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Page Order (Reorder or Remove)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {images.map((item, idx) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-slate-200 shadow-xs"
                >
                  <div className="w-14 h-14 bg-slate-100 rounded-xl overflow-hidden shrink-0 border border-slate-200/60">
                    <img src={item.previewUrl} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-800 truncate">Page {idx + 1}: {item.name}</p>
                    <p className="text-[11px] text-slate-400">{(item.size / 1024).toFixed(0)} KB</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => moveImage(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded-lg hover:bg-slate-100 transition"
                      title="Move up"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => moveImage(idx, 'down')}
                      disabled={idx === images.length - 1}
                      className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded-lg hover:bg-slate-100 transition"
                      title="Move down"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeImage(item.id)}
                      className="p-1 text-rose-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                      title="Remove image"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
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
              <p className="text-sm font-bold text-slate-900">Ready to build your PDF</p>
              <p className="text-xs text-slate-500">Fast client-side PDF compilation with zero compression loss</p>
            </div>

            <div className="flex items-center gap-3">
              {!generatedPdfUrl ? (
                <button
                  onClick={generatePdf}
                  disabled={generating}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-xs transition inline-flex items-center gap-2"
                >
                  {generating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Converting to PDF...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Convert to PDF
                    </>
                  )}
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={generatePdf}
                    className="px-3.5 py-2 text-xs font-semibold text-slate-600 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 transition"
                  >
                    Re-generate
                  </button>
                  <button
                    onClick={downloadPdf}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-xs transition inline-flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
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
