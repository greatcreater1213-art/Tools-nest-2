import React, { useState } from 'react';
import { Copy, Check, Trash2, Hash, AlertCircle, CheckCircle2 } from 'lucide-react';

export const CharacterCounter: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [limit, setLimit] = useState<number>(280);
  const [copied, setCopied] = useState<boolean>(false);

  const charCount = text.length;
  const charsNoSpaces = text.replace(/\s+/g, '').length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const lineCount = text ? text.split(/\n/).length : 0;
  const remaining = limit - charCount;
  const percentUsed = limit > 0 ? Math.min(100, Math.round((charCount / limit) * 100)) : 0;

  const PRESETS = [
    { label: 'Twitter / X (280)', val: 280 },
    { label: 'SEO Meta Description (160)', val: 160 },
    { label: 'Instagram Bio (150)', val: 150 },
    { label: 'Standard SMS (160)', val: 160 },
    { label: 'LinkedIn Post (3,000)', val: 3000 },
    { label: 'No Limit', val: 0 },
  ];

  const handleCopy = async () => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Platform Limit Presets */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <span className="text-xs font-bold uppercase text-slate-500">
            Target Character Limit Preset
          </span>
          {limit > 0 && (
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
              remaining < 0 
                ? 'bg-rose-100 text-rose-700' 
                : remaining <= 20 
                  ? 'bg-amber-100 text-amber-800' 
                  : 'bg-blue-100 text-blue-700'
            }`}>
              {remaining < 0 ? `${Math.abs(remaining)} characters over limit!` : `${remaining} characters left`}
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {PRESETS.map((preset, i) => (
            <button
              key={i}
              onClick={() => setLimit(preset.val)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                limit === preset.val
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 hover:border-blue-300 text-slate-700'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Progress Bar (if limit is active) */}
        {limit > 0 && (
          <div className="mt-4">
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  remaining < 0 ? 'bg-rose-600' : remaining <= 20 ? 'bg-amber-500' : 'bg-blue-600'
                }`}
                style={{ width: `${percentUsed}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 bg-blue-50/80 border border-blue-200/80 rounded-2xl text-center">
          <span className="text-xs uppercase font-bold text-blue-600 tracking-wider">Total Characters</span>
          <p className="text-3xl font-extrabold text-blue-700 mt-1">{charCount.toLocaleString()}</p>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center">
          <span className="text-xs uppercase font-bold text-slate-500 tracking-wider">Without Spaces</span>
          <p className="text-3xl font-extrabold text-slate-800 mt-1">{charsNoSpaces.toLocaleString()}</p>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center">
          <span className="text-xs uppercase font-bold text-slate-500 tracking-wider">Words</span>
          <p className="text-3xl font-extrabold text-slate-800 mt-1">{wordCount.toLocaleString()}</p>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center">
          <span className="text-xs uppercase font-bold text-slate-500 tracking-wider">Lines</span>
          <p className="text-3xl font-extrabold text-slate-800 mt-1">{lineCount.toLocaleString()}</p>
        </div>
      </div>

      {/* Text Area */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label htmlFor="character-counter-textarea" className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1.5">
            <Hash className="w-4 h-4 text-blue-600" />
            Live Character Counter Editor
          </label>
          {text && (
            <button
              onClick={() => setText('')}
              className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear text
            </button>
          )}
        </div>

        <textarea
          id="character-counter-textarea"
          rows={7}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste text here to see live character count, space breakdowns, and social media length limits..."
          className="w-full bg-slate-50/50 border border-slate-300 rounded-2xl p-4 sm:p-5 text-slate-800 text-sm sm:text-base leading-relaxed focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none transition resize-y"
        />
      </div>

      {/* Action Bar */}
      <div className="flex justify-end pt-2">
        <button
          onClick={handleCopy}
          disabled={!text}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-xs transition flex items-center gap-2"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Copied to Clipboard!' : 'Copy Text'}</span>
        </button>
      </div>
    </div>
  );
};
