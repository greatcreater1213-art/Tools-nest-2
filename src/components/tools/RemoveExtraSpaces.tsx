import React, { useState } from 'react';
import { Copy, Check, Trash2, AlignLeft, Sparkles, CheckCircle2 } from 'lucide-react';

export const RemoveExtraSpaces: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [removeConsecutiveSpaces, setRemoveConsecutiveSpaces] = useState<boolean>(true);
  const [trimLines, setTrimLines] = useState<boolean>(true);
  const [removeBlankLines, setRemoveBlankLines] = useState<boolean>(true);
  const [convertTabsToSpaces, setConvertTabsToSpaces] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  // Compute cleaned text
  const cleanText = (raw: string): string => {
    if (!raw) return '';
    let result = raw;

    if (convertTabsToSpaces) {
      result = result.replace(/\t/g, ' ');
    }

    if (removeConsecutiveSpaces) {
      // Replace 2 or more spaces/non-newline spaces with single space
      result = result.replace(/[^\S\r\n]{2,}/g, ' ');
    }

    if (trimLines) {
      result = result
        .split('\n')
        .map(line => line.trim())
        .join('\n');
    }

    if (removeBlankLines) {
      result = result
        .split('\n')
        .filter(line => line.length > 0)
        .join('\n');
    }

    return result.trim();
  };

  const outputText = cleanText(inputText);

  const originalLength = inputText.length;
  const cleanedLength = outputText.length;
  const charactersSaved = Math.max(0, originalLength - cleanedLength);

  const handleCopy = async () => {
    if (!outputText) return;
    await navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInsertSample = () => {
    setInputText(
      `   This   is   an  example    text with   too    many   consecutive  spaces.   \n\n\n\tIt also  has    multiple tabs   and   unnecessary    blank    lines.   \n\n\nLet's    clean   it    up with   ToolNest!   `
    );
  };

  return (
    <div className="space-y-6">
      {/* Options Bar */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-bold uppercase text-slate-500">
            Whitespace Cleaning Options:
          </span>
          <button
            onClick={handleInsertSample}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Load Messy Sample
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <label className="flex items-center gap-2.5 p-3 bg-white border border-slate-200 rounded-xl cursor-pointer hover:border-blue-300 transition text-xs font-bold text-slate-800">
            <input
              type="checkbox"
              checked={removeConsecutiveSpaces}
              onChange={(e) => setRemoveConsecutiveSpaces(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded-md accent-blue-600"
            />
            <span>Multiple Spaces → Single</span>
          </label>

          <label className="flex items-center gap-2.5 p-3 bg-white border border-slate-200 rounded-xl cursor-pointer hover:border-blue-300 transition text-xs font-bold text-slate-800">
            <input
              type="checkbox"
              checked={trimLines}
              onChange={(e) => setTrimLines(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded-md accent-blue-600"
            />
            <span>Trim Leading / Trailing</span>
          </label>

          <label className="flex items-center gap-2.5 p-3 bg-white border border-slate-200 rounded-xl cursor-pointer hover:border-blue-300 transition text-xs font-bold text-slate-800">
            <input
              type="checkbox"
              checked={removeBlankLines}
              onChange={(e) => setRemoveBlankLines(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded-md accent-blue-600"
            />
            <span>Remove Empty Lines</span>
          </label>

          <label className="flex items-center gap-2.5 p-3 bg-white border border-slate-200 rounded-xl cursor-pointer hover:border-blue-300 transition text-xs font-bold text-slate-800">
            <input
              type="checkbox"
              checked={convertTabsToSpaces}
              onChange={(e) => setConvertTabsToSpaces(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded-md accent-blue-600"
            />
            <span>Tabs to Spaces</span>
          </label>
        </div>
      </div>

      {/* Editor Grid: Input vs Cleaned Output */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase">
            <span>Messy Input Text</span>
            <span>{originalLength} characters</span>
          </div>
          <textarea
            rows={8}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste your unformatted or spaced out text here..."
            className="w-full bg-slate-50/50 border border-slate-300 rounded-2xl p-4 text-slate-800 text-sm leading-relaxed focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none transition resize-y font-mono"
          />
        </div>

        {/* Output */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-blue-600 uppercase">
            <span>Cleaned Result</span>
            <span>{cleanedLength} characters</span>
          </div>
          <textarea
            readOnly
            rows={8}
            value={outputText}
            placeholder="Cleaned formatted text will appear here automatically..."
            className="w-full bg-blue-50/30 border border-blue-200 rounded-2xl p-4 text-slate-800 text-sm leading-relaxed focus:outline-none resize-y font-mono"
          />
        </div>
      </div>

      {/* Stats Bar */}
      {originalLength > 0 && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-emerald-900 text-sm font-bold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Cleaned successfully! Removed {charactersSaved} redundant characters and spaces.</span>
          </div>

          <button
            onClick={handleCopy}
            disabled={!outputText}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-xs transition flex items-center gap-2"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-200" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied Cleaned Text!' : 'Copy Cleaned Text'}</span>
          </button>
        </div>
      )}
    </div>
  );
};
