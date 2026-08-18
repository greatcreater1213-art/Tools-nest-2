import React, { useState } from 'react';
import { Copy, Check, Trash2, Download, CaseSensitive, Sparkles, RefreshCw } from 'lucide-react';

export const TextCaseConverter: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // Transformations
  const toUpper = () => setText(prev => prev.toUpperCase());
  const toLower = () => setText(prev => prev.toLowerCase());

  const toSentence = () => {
    setText(prev => {
      return prev.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase());
    });
  };

  const toTitleCase = () => {
    const minorWords = new Set(['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'if', 'in', 'nor', 'of', 'on', 'or', 'so', 'the', 'to', 'up', 'yet']);
    setText(prev => {
      return prev
        .toLowerCase()
        .split(' ')
        .map((word, index) => {
          if (index === 0 || !minorWords.has(word)) {
            return word.charAt(0).toUpperCase() + word.slice(1);
          }
          return word;
        })
        .join(' ');
    });
  };

  const toCapitalize = () => {
    setText(prev => {
      return prev.replace(/\b\w/g, c => c.toUpperCase());
    });
  };

  const toCamelCase = () => {
    setText(prev => {
      return prev
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
        .replace(/^[A-Z]/, c => c.toLowerCase());
    });
  };

  const toSnakeCase = () => {
    setText(prev => {
      return prev
        .trim()
        .toLowerCase()
        .replace(/[\s\-_]+/g, '_')
        .replace(/[^a-z0-9_]/g, '');
    });
  };

  const toKebabCase = () => {
    setText(prev => {
      return prev
        .trim()
        .toLowerCase()
        .replace(/[\s\-_]+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
    });
  };

  const toAlternating = () => {
    setText(prev => {
      return prev
        .split('')
        .map((c, i) => (i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()))
        .join('');
    });
  };

  const handleCopy = async () => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!text) return;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'converted-text.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div className="space-y-6">
      {/* Transformation Action Buttons Bar */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3">
        <span className="text-xs font-bold uppercase text-slate-500 block">
          Select Transformation:
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={toUpper}
            className="px-3.5 py-2 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-slate-800 text-xs sm:text-sm font-bold rounded-xl shadow-xs transition"
          >
            UPPERCASE
          </button>
          <button
            onClick={toLower}
            className="px-3.5 py-2 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-slate-800 text-xs sm:text-sm font-bold rounded-xl shadow-xs transition"
          >
            lowercase
          </button>
          <button
            onClick={toTitleCase}
            className="px-3.5 py-2 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-slate-800 text-xs sm:text-sm font-bold rounded-xl shadow-xs transition"
          >
            Title Case
          </button>
          <button
            onClick={toSentence}
            className="px-3.5 py-2 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-slate-800 text-xs sm:text-sm font-bold rounded-xl shadow-xs transition"
          >
            Sentence case
          </button>
          <button
            onClick={toCapitalize}
            className="px-3.5 py-2 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-slate-800 text-xs sm:text-sm font-bold rounded-xl shadow-xs transition"
          >
            Capitalize Words
          </button>
          <button
            onClick={toCamelCase}
            className="px-3.5 py-2 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-slate-800 text-xs sm:text-sm font-mono font-semibold rounded-xl shadow-xs transition"
          >
            camelCase
          </button>
          <button
            onClick={toSnakeCase}
            className="px-3.5 py-2 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-slate-800 text-xs sm:text-sm font-mono font-semibold rounded-xl shadow-xs transition"
          >
            snake_case
          </button>
          <button
            onClick={toKebabCase}
            className="px-3.5 py-2 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-slate-800 text-xs sm:text-sm font-mono font-semibold rounded-xl shadow-xs transition"
          >
            kebab-case
          </button>
          <button
            onClick={toAlternating}
            className="px-3.5 py-2 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-slate-800 text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition"
          >
            aLtErNaTiNg
          </button>
        </div>
      </div>

      {/* Text Area */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs text-slate-500 font-semibold">
          <span>Characters: {text.length} • Words: {wordCount}</span>
          {text && (
            <button
              onClick={() => setText('')}
              className="text-rose-600 hover:text-rose-700 flex items-center gap-1 font-bold"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear Text
            </button>
          )}
        </div>

        <textarea
          rows={8}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or write text here, then click any transformation button above to convert instant casing..."
          className="w-full bg-slate-50/50 border border-slate-300 rounded-2xl p-4 sm:p-5 text-slate-800 text-sm sm:text-base leading-relaxed focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none transition resize-y"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-between items-center gap-4 pt-2">
        <button
          onClick={toSentence}
          className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold rounded-xl transition flex items-center gap-1.5"
        >
          <Sparkles className="w-4 h-4 text-blue-600" />
          Format as Standard Paragraph
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDownload}
            disabled={!text}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 font-semibold text-xs sm:text-sm rounded-xl transition flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            Download .txt
          </button>

          <button
            onClick={handleCopy}
            disabled={!text}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-xs transition flex items-center gap-2"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Converted Text'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
