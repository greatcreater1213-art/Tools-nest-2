import React, { useState } from 'react';
import { Link, Copy, Check, Trash2, ArrowLeftRight, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';

export const UrlEncoderDecoder: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [outputText, setOutputText] = useState<string>('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [encodeType, setEncodeType] = useState<'component' | 'full'>('component');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const handleProcess = (text: string = inputText, currentMode: 'encode' | 'decode' = mode) => {
    if (!text.trim()) {
      setOutputText('');
      setError(null);
      return;
    }

    try {
      if (currentMode === 'encode') {
        const result = encodeType === 'component' ? encodeURIComponent(text) : encodeURI(text);
        setOutputText(result);
        setError(null);
      } else {
        const result = decodeURIComponent(text);
        setOutputText(result);
        setError(null);
      }
    } catch (err: any) {
      setError(err?.message || 'Malformed URI sequence. Unable to decode this text.');
      setOutputText('');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setInputText(val);
    handleProcess(val, mode);
  };

  const switchMode = (newMode: 'encode' | 'decode') => {
    setMode(newMode);
    if (outputText) {
      setInputText(outputText);
      handleProcess(outputText, newMode);
    } else {
      handleProcess(inputText, newMode);
    }
  };

  const loadSample = () => {
    const sample = mode === 'encode'
      ? 'https://example.com/search?q=online tools & free=true#results'
      : 'https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Donline%20tools%20%26%20free%3Dtrue%23results';
    setInputText(sample);
    handleProcess(sample, mode);
  };

  const handleCopy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
    setError(null);
  };

  return (
    <div className="space-y-6">
      {/* Mode Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => switchMode('encode')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition ${
              mode === 'encode'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            URL Encode
          </button>
          <button
            onClick={() => switchMode('decode')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition ${
              mode === 'decode'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            URL Decode
          </button>
        </div>

        {mode === 'encode' && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Method:</span>
            <select
              value={encodeType}
              onChange={(e) => {
                setEncodeType(e.target.value as any);
                setTimeout(() => handleProcess(inputText, 'encode'), 10);
              }}
              className="px-2.5 py-1 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
            >
              <option value="component">encodeURIComponent (Standard query params)</option>
              <option value="full">encodeURI (Full URL address)</option>
            </select>
          </div>
        )}

        <div className="flex items-center gap-2">
          <button
            onClick={loadSample}
            className="px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50 rounded-xl transition"
          >
            Load Sample
          </button>
          <button
            onClick={handleClear}
            className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Error Notice */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-700 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Input / Output Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">
              {mode === 'encode' ? 'Plain Text / Raw URL to Encode' : 'Encoded URI to Decode'}
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              {inputText.length} characters
            </span>
          </div>
          <textarea
            value={inputText}
            onChange={handleInputChange}
            placeholder={
              mode === 'encode'
                ? 'Type or paste a URL / query string to encode...'
                : 'Paste encoded text (e.g. https%3A%2F%2F...)...'
            }
            rows={8}
            className="w-full p-3 font-mono text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none resize-y"
          />
        </div>

        {/* Output */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-2 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">
                {mode === 'encode' ? 'Encoded Result' : 'Decoded Plain Text'}
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                {outputText.length} characters
              </span>
            </div>
            <textarea
              readOnly
              value={outputText}
              placeholder="Result will appear here in real-time..."
              rows={8}
              className="w-full p-3 font-mono text-xs sm:text-sm bg-slate-900 text-slate-100 border border-slate-800 rounded-xl focus:outline-none resize-y"
            />
          </div>

          <div className="pt-2 flex items-center justify-end">
            <button
              onClick={handleCopy}
              disabled={!outputText}
              className={`px-5 py-2 text-xs font-bold rounded-xl shadow-xs transition inline-flex items-center gap-1.5 ${
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
                  Copy Result
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
