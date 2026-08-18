import React, { useState, useEffect, useCallback } from 'react';
import { Copy, Check, RefreshCw, Shield, ShieldAlert, ShieldCheck, KeyRound, Sliders, List } from 'lucide-react';

export const PasswordGenerator: React.FC = () => {
  const [password, setPassword] = useState<string>('');
  const [length, setLength] = useState<number>(18);
  const [includeUpper, setIncludeUpper] = useState<boolean>(true);
  const [includeLower, setIncludeLower] = useState<boolean>(true);
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(true);
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState<boolean>(true);
  const [bulkList, setBulkList] = useState<string[]>([]);
  const [showBulk, setShowBulk] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const LOWER = 'abcdefghijklmnopqrstuvwxyz';
  const NUMS = '0123456789';
  const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  const AMBIGUOUS = /[0Oo1lI|]/g;

  const generateSinglePassword = useCallback((len: number): string => {
    let charPool = '';
    if (includeUpper) charPool += UPPER;
    if (includeLower) charPool += LOWER;
    if (includeNumbers) charPool += NUMS;
    if (includeSymbols) charPool += SYMBOLS;

    if (excludeAmbiguous) {
      charPool = charPool.replace(AMBIGUOUS, '');
    }

    if (!charPool) charPool = LOWER;

    const array = new Uint32Array(len);
    window.crypto.getRandomValues(array);

    let result = '';
    for (let i = 0; i < len; i++) {
      result += charPool[array[i] % charPool.length];
    }
    return result;
  }, [includeUpper, includeLower, includeNumbers, includeSymbols, excludeAmbiguous]);

  const generate = useCallback(() => {
    const p = generateSinglePassword(length);
    setPassword(p);

    if (showBulk) {
      const list: string[] = [];
      for (let i = 0; i < 5; i++) {
        list.push(generateSinglePassword(length));
      }
      setBulkList(list);
    }
  }, [generateSinglePassword, length, showBulk]);

  useEffect(() => {
    generate();
  }, [generate]);

  // Calculate Strength & Entropy
  const calculateStrength = () => {
    let poolSize = 0;
    if (includeUpper) poolSize += 26;
    if (includeLower) poolSize += 26;
    if (includeNumbers) poolSize += 10;
    if (includeSymbols) poolSize += 26;

    const entropy = Math.round(length * Math.log2(poolSize || 1));

    if (entropy < 36) return { label: 'Weak', color: 'bg-rose-500 text-rose-700', text: 'text-rose-600', score: 1, crack: 'Seconds' };
    if (entropy < 60) return { label: 'Medium', color: 'bg-amber-500 text-amber-700', text: 'text-amber-600', score: 2, crack: 'Days' };
    if (entropy < 80) return { label: 'Strong', color: 'bg-emerald-500 text-emerald-700', text: 'text-emerald-600', score: 3, crack: 'Years' };
    return { label: 'Very Strong', color: 'bg-blue-600 text-blue-700', text: 'text-blue-600', score: 4, crack: 'Centuries' };
  };

  const strength = calculateStrength();

  const handleCopy = async (textToCopy: string, index?: number) => {
    await navigator.clipboard.writeText(textToCopy);
    if (index !== undefined) {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } else {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Password Display Box */}
      <div className="bg-slate-900 rounded-2xl p-6 shadow-inner text-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full overflow-hidden">
          <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
            Generated Secure Password
          </span>
          <div className="font-mono text-xl sm:text-2xl font-bold tracking-wider break-all select-all text-emerald-400">
            {password || 'Select options below'}
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
          <button
            onClick={generate}
            className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 hover:text-white transition"
            title="Generate new password"
          >
            <RefreshCw className="w-5 h-5" />
          </button>

          <button
            onClick={() => handleCopy(password)}
            className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition flex items-center gap-2 text-sm"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-200" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied!' : 'Copy Password'}</span>
          </button>
        </div>
      </div>

      {/* Strength Meter Bar */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Security Rating: <strong className={strength.text}>{strength.label}</strong>
          </span>
          <span className="text-xs font-medium text-slate-500">
            Estimated Brute-force Time: <strong className="text-slate-800">{strength.crack}</strong>
          </span>
        </div>

        <div className="grid grid-cols-4 gap-1.5 h-2">
          {[1, 2, 3, 4].map(idx => (
            <div
              key={idx}
              className={`rounded-full transition-all duration-300 ${
                idx <= strength.score ? strength.color.split(' ')[0] : 'bg-slate-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Options & Sliders */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-6">
        {/* Length Slider */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-blue-600" />
              Password Length
            </label>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 font-mono font-bold text-sm rounded-lg">
              {length} characters
            </span>
          </div>
          <input
            type="range"
            min="6"
            max="64"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-[11px] text-slate-400 mt-1">
            <span>6 (Short)</span>
            <span>16 (Recommended)</span>
            <span>32 (Strong)</span>
            <span>64 (Max)</span>
          </div>
        </div>

        {/* Character Toggles */}
        <div>
          <span className="text-xs font-bold uppercase text-slate-500 block mb-3">
            Character Types to Include
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl cursor-pointer hover:border-blue-300 transition">
              <input
                type="checkbox"
                checked={includeUpper}
                onChange={(e) => setIncludeUpper(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded-md focus:ring-blue-500 accent-blue-600"
              />
              <div className="text-xs sm:text-sm">
                <span className="font-bold text-slate-800 block">Uppercase Letters (A-Z)</span>
                <span className="text-slate-400 font-mono text-[11px]">e.g. ABCDEFGHIJKLMNOP</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl cursor-pointer hover:border-blue-300 transition">
              <input
                type="checkbox"
                checked={includeLower}
                onChange={(e) => setIncludeLower(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded-md focus:ring-blue-500 accent-blue-600"
              />
              <div className="text-xs sm:text-sm">
                <span className="font-bold text-slate-800 block">Lowercase Letters (a-z)</span>
                <span className="text-slate-400 font-mono text-[11px]">e.g. abcdefghijklmnop</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl cursor-pointer hover:border-blue-300 transition">
              <input
                type="checkbox"
                checked={includeNumbers}
                onChange={(e) => setIncludeNumbers(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded-md focus:ring-blue-500 accent-blue-600"
              />
              <div className="text-xs sm:text-sm">
                <span className="font-bold text-slate-800 block">Numbers (0-9)</span>
                <span className="text-slate-400 font-mono text-[11px]">e.g. 1234567890</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl cursor-pointer hover:border-blue-300 transition">
              <input
                type="checkbox"
                checked={includeSymbols}
                onChange={(e) => setIncludeSymbols(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded-md focus:ring-blue-500 accent-blue-600"
              />
              <div className="text-xs sm:text-sm">
                <span className="font-bold text-slate-800 block">Special Symbols (!@#$)</span>
                <span className="text-slate-400 font-mono text-[11px]">e.g. !@#$%^&*()_+</span>
              </div>
            </label>
          </div>
        </div>

        {/* Exclude Ambiguous */}
        <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <label className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm text-slate-700 font-medium">
            <input
              type="checkbox"
              checked={excludeAmbiguous}
              onChange={(e) => setExcludeAmbiguous(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded-md accent-blue-600"
            />
            <span>Exclude Ambiguous Characters (e.g. 0, O, o, 1, l, I)</span>
          </label>

          <button
            onClick={() => setShowBulk(!showBulk)}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <List className="w-3.5 h-3.5" />
            {showBulk ? 'Hide Bulk Generator' : 'Generate Multiple Passwords'}
          </button>
        </div>
      </div>

      {/* Bulk Passwords List (Optional Expandable) */}
      {showBulk && bulkList.length > 0 && (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
          <h4 className="text-xs font-bold uppercase text-slate-500">
            Batch Generated Passwords ({length} chars each)
          </h4>
          <div className="space-y-2">
            {bulkList.map((p, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200"
              >
                <span className="font-mono text-sm font-semibold text-slate-800 break-all">{p}</span>
                <button
                  onClick={() => handleCopy(p, idx)}
                  className="px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition flex items-center gap-1 shrink-0 ml-2"
                >
                  {copiedIndex === idx ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedIndex === idx ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
