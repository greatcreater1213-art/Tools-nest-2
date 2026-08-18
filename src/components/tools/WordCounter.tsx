import React, { useState, useMemo } from 'react';
import { Copy, Check, Trash2, FileText, Clock, Volume2, Sparkles, Upload } from 'lucide-react';

export const WordCounter: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const stats = useMemo(() => {
    const raw = text.trim();
    if (!raw) {
      return {
        words: 0,
        characters: 0,
        charactersNoSpaces: 0,
        sentences: 0,
        paragraphs: 0,
        readingTimeMinutes: 0,
        speakingTimeMinutes: 0,
        avgWordLength: 0,
        keywords: [] as { word: string; count: number; density: string }[],
      };
    }

    // Characters
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s+/g, '').length;

    // Words
    const wordList = raw.split(/\s+/).filter(w => w.length > 0);
    const words = wordList.length;

    // Sentences: match ending with . ! ?
    const sentenceList = raw.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const sentences = sentenceList.length;

    // Paragraphs: match non-empty blocks separated by newlines
    const paragraphs = text.split(/\n+/).filter(p => p.trim().length > 0).length;

    // Reading & Speaking times
    const readingTimeMinutes = parseFloat((words / 200).toFixed(1));
    const speakingTimeMinutes = parseFloat((words / 130).toFixed(1));

    // Average word length
    const totalLetters = wordList.reduce((acc, w) => acc + w.length, 0);
    const avgWordLength = words > 0 ? parseFloat((totalLetters / words).toFixed(1)) : 0;

    // Keyword density (stop words filtered)
    const stopWords = new Set(['the', 'and', 'a', 'to', 'of', 'in', 'i', 'is', 'that', 'it', 'on', 'you', 'this', 'for', 'but', 'with', 'are', 'have', 'be', 'at', 'or', 'as', 'was', 'so', 'if', 'out', 'not']);
    const frequencyMap: Record<string, number> = {};

    wordList.forEach(w => {
      const clean = w.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (clean.length > 2 && !stopWords.has(clean)) {
        frequencyMap[clean] = (frequencyMap[clean] || 0) + 1;
      }
    });

    const sortedKeywords = Object.entries(frequencyMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word, count]) => ({
        word,
        count,
        density: ((count / words) * 100).toFixed(1) + '%',
      }));

    return {
      words,
      characters,
      charactersNoSpaces,
      sentences,
      paragraphs,
      readingTimeMinutes,
      speakingTimeMinutes,
      avgWordLength,
      keywords: sortedKeywords,
    };
  }, [text]);

  const handleCopy = async () => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInsertSample = () => {
    setText(
      `Welcome to ToolNest! This powerful online utility platform gives you instant access to 100% private, browser-based tools designed to make everyday tasks effortless. Whether you need to compress photos, calculate percentages, format case titles, or generate secure cryptographic passwords, everything runs locally inside your web browser with zero server uploads.\n\nOur client-side architecture guarantees high speed and complete data privacy. Try typing or pasting your own essays, articles, or notes here to see real-time statistics!`
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setText((ev.target?.result as string) || '');
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="bg-blue-50/80 border border-blue-200/80 rounded-2xl p-4 text-center">
          <span className="text-xs uppercase font-bold text-blue-600 tracking-wider">Words</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-blue-700 mt-1">{stats.words.toLocaleString()}</p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center">
          <span className="text-xs uppercase font-bold text-slate-500 tracking-wider">Characters</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-800 mt-1">{stats.characters.toLocaleString()}</p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center">
          <span className="text-xs uppercase font-bold text-slate-500 tracking-wider">No Spaces</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-800 mt-1">{stats.charactersNoSpaces.toLocaleString()}</p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center">
          <span className="text-xs uppercase font-bold text-slate-500 tracking-wider">Sentences</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-800 mt-1">{stats.sentences.toLocaleString()}</p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center col-span-2 sm:col-span-1">
          <span className="text-xs uppercase font-bold text-slate-500 tracking-wider">Paragraphs</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-800 mt-1">{stats.paragraphs.toLocaleString()}</p>
        </div>
      </div>

      {/* Editor & Action Bar */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label htmlFor="word-counter-textarea" className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-blue-600" />
            Enter or paste your text below:
          </label>

          <div className="flex items-center gap-2">
            <label className="cursor-pointer px-2.5 py-1 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition flex items-center gap-1">
              <Upload className="w-3.5 h-3.5" />
              <span>Load .txt</span>
              <input type="file" accept=".txt,.md,.rtf" className="hidden" onChange={handleFileUpload} />
            </label>

            <button
              onClick={handleInsertSample}
              className="px-2.5 py-1 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Sample Text
            </button>

            {text && (
              <button
                onClick={() => setText('')}
                className="px-2.5 py-1 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear
              </button>
            )}
          </div>
        </div>

        <textarea
          id="word-counter-textarea"
          rows={8}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Start typing or paste your content here to calculate real-time word count, characters, sentences, paragraphs, and reading time..."
          className="w-full bg-slate-50/50 border border-slate-300 rounded-2xl p-4 sm:p-5 text-slate-800 text-sm sm:text-base leading-relaxed focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none transition resize-y"
        />
      </div>

      {/* Secondary Metrics: Reading Time & Keyword Density */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Reading & Speaking Times */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3">
          <h4 className="text-xs font-bold uppercase text-slate-500">Estimated Duration</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-semibold block">Reading Time</span>
                <span className="text-sm font-bold text-slate-800">
                  {stats.readingTimeMinutes < 1 ? '< 1 min' : `${stats.readingTimeMinutes} mins`}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Volume2 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-semibold block">Speaking Time</span>
                <span className="text-sm font-bold text-slate-800">
                  {stats.speakingTimeMinutes < 1 ? '< 1 min' : `${stats.speakingTimeMinutes} mins`}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Keywords Frequency */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3">
          <h4 className="text-xs font-bold uppercase text-slate-500">Top Keyword Density</h4>
          {stats.keywords.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {stats.keywords.map((kw, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-800"
                >
                  <span className="font-semibold text-blue-600">{kw.word}</span>
                  <span className="text-slate-400 font-mono">({kw.count} × {kw.density})</span>
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">
              Type more words to see top keyword density insights.
            </p>
          )}
        </div>
      </div>

      {/* Copy Action */}
      <div className="flex justify-end pt-2">
        <button
          onClick={handleCopy}
          disabled={!text}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-xs transition flex items-center gap-2"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Text Copied to Clipboard!' : 'Copy Text'}</span>
        </button>
      </div>
    </div>
  );
};
