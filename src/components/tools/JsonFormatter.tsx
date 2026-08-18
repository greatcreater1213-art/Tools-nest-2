import React, { useState } from 'react';
import { Code, Copy, Check, Download, Trash2, Sparkles, AlertCircle, FileText, CheckCircle2, RefreshCw } from 'lucide-react';

export const JsonFormatter: React.FC = () => {
  const [inputJson, setInputJson] = useState<string>('');
  const [outputJson, setOutputJson] = useState<string>('');
  const [indentSize, setIndentSize] = useState<number | string>(2);
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const sampleJson = {
    appName: "ToolNest",
    version: "2.0.0",
    features: ["Browser-based", "Fast", "Secure", "Free"],
    toolsCount: 25,
    author: {
      team: "ToolNest Engineering",
      privacyFocus: true
    },
    settings: {
      theme: "modern",
      offlineReady: true
    }
  };

  const handleFormat = (indent: number | string = indentSize) => {
    if (!inputJson.trim()) {
      setError('Please enter JSON text to format.');
      setIsValid(null);
      setOutputJson('');
      return;
    }

    try {
      const parsed = JSON.parse(inputJson);
      const space = indent === 'tab' ? '\t' : Number(indent);
      const formatted = JSON.stringify(parsed, null, space);
      setOutputJson(formatted);
      setError(null);
      setIsValid(true);
    } catch (err: any) {
      setError(err?.message || 'Invalid JSON syntax. Please check for missing quotes or commas.');
      setIsValid(false);
      setOutputJson('');
    }
  };

  const handleMinify = () => {
    if (!inputJson.trim()) {
      setError('Please enter JSON text to minify.');
      setIsValid(null);
      setOutputJson('');
      return;
    }

    try {
      const parsed = JSON.parse(inputJson);
      const minified = JSON.stringify(parsed);
      setOutputJson(minified);
      setError(null);
      setIsValid(true);
    } catch (err: any) {
      setError(err?.message || 'Invalid JSON syntax.');
      setIsValid(false);
      setOutputJson('');
    }
  };

  const handleValidate = () => {
    if (!inputJson.trim()) {
      setError('Please enter JSON text to validate.');
      setIsValid(null);
      return;
    }

    try {
      JSON.parse(inputJson);
      setError(null);
      setIsValid(true);
      if (!outputJson) {
        handleFormat();
      }
    } catch (err: any) {
      setError(err?.message || 'Invalid JSON format.');
      setIsValid(false);
    }
  };

  const loadSample = () => {
    const str = JSON.stringify(sampleJson, null, 2);
    setInputJson(str);
    setOutputJson(str);
    setError(null);
    setIsValid(true);
  };

  const handleCopy = () => {
    const textToCopy = outputJson || inputJson;
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const textToDownload = outputJson || inputJson;
    if (!textToDownload) return;
    const blob = new Blob([textToDownload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'formatted-data.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setInputJson('');
    setOutputJson('');
    setError(null);
    setIsValid(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setInputJson(content);
      setError(null);
      try {
        const parsed = JSON.parse(content);
        setOutputJson(JSON.stringify(parsed, null, 2));
        setIsValid(true);
      } catch (err: any) {
        setError('Uploaded file contains invalid JSON: ' + err.message);
        setIsValid(false);
      }
    };
    reader.readAsText(file);
  };

  const lineCount = (text: string) => text ? text.split('\n').length : 0;
  const charCount = (text: string) => text.length;

  return (
    <div className="space-y-6">
      {/* Top Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleFormat(2)}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition inline-flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Prettify JSON
          </button>
          <button
            onClick={handleMinify}
            className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
          >
            Minify (Compact)
          </button>
          <button
            onClick={handleValidate}
            className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
          >
            Validate
          </button>
          <button
            onClick={loadSample}
            className="px-3.5 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50 rounded-xl transition"
          >
            Load Sample
          </button>
        </div>

        <div className="flex items-center gap-2">
          <label className="cursor-pointer px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition inline-flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" />
            Upload .json
            <input type="file" accept=".json,text/plain" onChange={handleFileUpload} className="hidden" />
          </label>
          <button
            onClick={handleClear}
            className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Status Bar */}
      {isValid !== null && (
        <div
          className={`p-3.5 rounded-2xl flex items-center gap-3 text-xs font-semibold ${
            isValid
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {isValid ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Valid JSON Data Structure</span>
            </>
          ) : (
            <>
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error || 'Invalid JSON syntax'}</span>
            </>
          )}
        </div>
      )}

      {/* Editor Split Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input Column */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">Raw JSON Input</span>
            <span className="text-[11px] text-slate-400 font-mono">
              {lineCount(inputJson)} lines • {charCount(inputJson)} chars
            </span>
          </div>
          <textarea
            value={inputJson}
            onChange={(e) => setInputJson(e.target.value)}
            placeholder="Paste your unformatted JSON here..."
            rows={14}
            className="w-full p-3 font-mono text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none resize-y"
          />
        </div>

        {/* Formatted Output Column */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">Formatted Result</span>
              <select
                value={indentSize}
                onChange={(e) => {
                  setIndentSize(e.target.value);
                  handleFormat(e.target.value);
                }}
                className="px-2 py-0.5 text-[11px] font-semibold bg-slate-100 border border-slate-200 rounded-md focus:outline-none"
              >
                <option value={2}>2 Spaces</option>
                <option value={4}>4 Spaces</option>
                <option value="tab">1 Tab</option>
              </select>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              {lineCount(outputJson)} lines • {charCount(outputJson)} chars
            </span>
          </div>
          <textarea
            readOnly
            value={outputJson}
            placeholder="Formatted JSON will appear here..."
            rows={14}
            className="w-full p-3 font-mono text-xs sm:text-sm bg-slate-900 text-slate-100 border border-slate-800 rounded-xl focus:outline-none resize-y"
          />
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="text-xs text-slate-500">
          Client-side parsing with zero data transmission to external servers.
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            disabled={!outputJson && !inputJson}
            className={`px-4 py-2 text-xs font-bold rounded-xl shadow-xs transition inline-flex items-center gap-1.5 ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy JSON
              </>
            )}
          </button>
          <button
            onClick={handleDownload}
            disabled={!outputJson && !inputJson}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 text-xs font-bold rounded-xl transition inline-flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Download .json
          </button>
        </div>
      </div>
    </div>
  );
};
