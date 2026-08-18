import React, { useState } from 'react';
import { Percent, ArrowRight, Sparkles, HelpCircle, Calculator, TrendingUp, TrendingDown } from 'lucide-react';

type Mode = 'simple' | 'fraction' | 'change' | 'tax_discount';

export const PercentageCalculator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Mode>('simple');

  // Mode 1: What is X% of Y?
  const [m1X, setM1X] = useState<string>('15');
  const [m1Y, setM1Y] = useState<string>('200');

  // Mode 2: What percentage is X of Y?
  const [m2X, setM2X] = useState<string>('45');
  const [m2Y, setM2Y] = useState<string>('180');

  // Mode 3: Percentage increase / decrease from X to Y
  const [m3Old, setM3Old] = useState<string>('50');
  const [m3New, setM3New] = useState<string>('75');

  // Mode 4: Add / Subtract X% to/from Y
  const [m4Percent, setM4Percent] = useState<string>('20');
  const [m4Value, setM4Value] = useState<string>('150');
  const [m4Op, setM4Op] = useState<'add' | 'subtract'>('subtract');

  // Calculations
  const calcM1 = () => {
    const x = parseFloat(m1X);
    const y = parseFloat(m1Y);
    if (isNaN(x) || isNaN(y)) return null;
    const result = (x / 100) * y;
    return {
      val: parseFloat(result.toFixed(4)),
      formula: `(${x} ÷ 100) × ${y} = ${result.toFixed(2)}`,
    };
  };

  const calcM2 = () => {
    const x = parseFloat(m2X);
    const y = parseFloat(m2Y);
    if (isNaN(x) || isNaN(y) || y === 0) return null;
    const result = (x / y) * 100;
    return {
      val: parseFloat(result.toFixed(4)),
      formula: `(${x} ÷ ${y}) × 100 = ${result.toFixed(2)}%`,
    };
  };

  const calcM3 = () => {
    const oldVal = parseFloat(m3Old);
    const newVal = parseFloat(m3New);
    if (isNaN(oldVal) || isNaN(newVal) || oldVal === 0) return null;
    const diff = newVal - oldVal;
    const pct = (diff / Math.abs(oldVal)) * 100;
    const isIncrease = diff >= 0;
    return {
      diff: parseFloat(diff.toFixed(4)),
      pct: parseFloat(Math.abs(pct).toFixed(2)),
      isIncrease,
      formula: `((${newVal} - ${oldVal}) ÷ |${oldVal}|) × 100 = ${pct.toFixed(2)}%`,
    };
  };

  const calcM4 = () => {
    const p = parseFloat(m4Percent);
    const v = parseFloat(m4Value);
    if (isNaN(p) || isNaN(v)) return null;
    const changeAmt = (p / 100) * v;
    const result = m4Op === 'add' ? v + changeAmt : v - changeAmt;
    return {
      changeAmt: parseFloat(changeAmt.toFixed(4)),
      final: parseFloat(result.toFixed(4)),
      formula: m4Op === 'add' 
        ? `${v} + (${p}% of ${v}) = ${v} + ${changeAmt.toFixed(2)} = ${result.toFixed(2)}`
        : `${v} - (${p}% of ${v}) = ${v} - ${changeAmt.toFixed(2)} = ${result.toFixed(2)}`,
    };
  };

  const r1 = calcM1();
  const r2 = calcM2();
  const r3 = calcM3();
  const r4 = calcM4();

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1.5 bg-slate-100/90 rounded-2xl">
        <button
          onClick={() => setActiveTab('simple')}
          className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition text-center ${
            activeTab === 'simple'
              ? 'bg-white text-blue-600 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          What is X% of Y?
        </button>

        <button
          onClick={() => setActiveTab('fraction')}
          className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition text-center ${
            activeTab === 'fraction'
              ? 'bg-white text-blue-600 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          What % is X of Y?
        </button>

        <button
          onClick={() => setActiveTab('change')}
          className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition text-center ${
            activeTab === 'change'
              ? 'bg-white text-blue-600 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          % Increase / Decrease
        </button>

        <button
          onClick={() => setActiveTab('tax_discount')}
          className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition text-center ${
            activeTab === 'tax_discount'
              ? 'bg-white text-blue-600 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Add / Discount %
        </button>
      </div>

      {/* Mode 1: What is X% of Y? */}
      {activeTab === 'simple' && (
        <div className="space-y-6">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-center gap-3 text-lg sm:text-xl font-bold text-slate-800">
              <span>What is</span>
              <div className="relative w-28">
                <input
                  type="number"
                  step="any"
                  value={m1X}
                  onChange={(e) => setM1X(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 text-lg font-extrabold focus:ring-2 focus:ring-blue-500 focus:outline-none pr-7"
                />
                <span className="absolute right-2.5 top-2.5 text-sm text-slate-400 font-bold">%</span>
              </div>
              <span>of</span>
              <div className="w-36">
                <input
                  type="number"
                  step="any"
                  value={m1Y}
                  onChange={(e) => setM1Y(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 text-lg font-extrabold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <span>?</span>
            </div>

            {/* Result Display */}
            {r1 && (
              <div className="bg-blue-50/80 border border-blue-200 rounded-2xl p-6 text-center">
                <span className="text-xs uppercase font-bold text-blue-600 tracking-wider block mb-1">
                  Calculated Result
                </span>
                <p className="text-4xl sm:text-5xl font-black text-blue-700">
                  {r1.val.toLocaleString()}
                </p>
                <p className="text-sm font-mono text-slate-500 mt-2">
                  Formula: {r1.formula}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mode 2: What % is X of Y? */}
      {activeTab === 'fraction' && (
        <div className="space-y-6">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-center gap-3 text-lg sm:text-xl font-bold text-slate-800">
              <div className="w-32">
                <input
                  type="number"
                  step="any"
                  value={m2X}
                  onChange={(e) => setM2X(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 text-lg font-extrabold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <span>is what percentage of</span>
              <div className="w-36">
                <input
                  type="number"
                  step="any"
                  value={m2Y}
                  onChange={(e) => setM2Y(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 text-lg font-extrabold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <span>?</span>
            </div>

            {r2 && (
              <div className="bg-blue-50/80 border border-blue-200 rounded-2xl p-6 text-center">
                <span className="text-xs uppercase font-bold text-blue-600 tracking-wider block mb-1">
                  Percentage
                </span>
                <p className="text-4xl sm:text-5xl font-black text-blue-700">
                  {r2.val.toLocaleString()}%
                </p>
                <p className="text-sm font-mono text-slate-500 mt-2">
                  Formula: {r2.formula}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mode 3: % Increase / Decrease from X to Y */}
      {activeTab === 'change' && (
        <div className="space-y-6">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">
                  Initial / Old Value
                </label>
                <input
                  type="number"
                  step="any"
                  value={m3Old}
                  onChange={(e) => setM3Old(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">
                  New / Final Value
                </label>
                <input
                  type="number"
                  step="any"
                  value={m3New}
                  onChange={(e) => setM3New(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {r3 && (
              <div className={`p-6 rounded-2xl border text-center ${
                r3.isIncrease 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}>
                <div className="flex items-center justify-center gap-1.5 text-xs uppercase font-bold tracking-wider mb-1">
                  {r3.isIncrease ? <TrendingUp className="w-4 h-4 text-emerald-600" /> : <TrendingDown className="w-4 h-4 text-rose-600" />}
                  <span>{r3.isIncrease ? 'Percentage Increase' : 'Percentage Decrease'}</span>
                </div>
                <p className={`text-4xl sm:text-5xl font-black ${
                  r3.isIncrease ? 'text-emerald-700' : 'text-rose-700'
                }`}>
                  {r3.isIncrease ? '+' : '-'}{r3.pct}%
                </p>
                <p className="text-sm font-semibold mt-1">
                  Difference: {r3.diff > 0 ? `+${r3.diff}` : r3.diff}
                </p>
                <p className="text-xs font-mono text-slate-500 mt-2">
                  Formula: {r3.formula}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mode 4: Add / Subtract X% to/from Y (Discounts / Taxes) */}
      {activeTab === 'tax_discount' && (
        <div className="space-y-6">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">
                  Base Amount / Price ($)
                </label>
                <input
                  type="number"
                  step="any"
                  value={m4Value}
                  onChange={(e) => setM4Value(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">
                  Operation
                </label>
                <div className="flex gap-1.5 bg-slate-200/80 p-1 rounded-xl">
                  <button
                    onClick={() => setM4Op('subtract')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                      m4Op === 'subtract' ? 'bg-white text-rose-700 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Subtract (Discount)
                  </button>
                  <button
                    onClick={() => setM4Op('add')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                      m4Op === 'add' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Add (Tax / Tip)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">
                  Percentage (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="any"
                    value={m4Percent}
                    onChange={(e) => setM4Percent(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none pr-7"
                  />
                  <span className="absolute right-3 top-2.5 text-slate-400 font-bold text-sm">%</span>
                </div>
              </div>
            </div>

            {r4 && (
              <div className="bg-blue-50/80 border border-blue-200 rounded-2xl p-6 text-center">
                <span className="text-xs uppercase font-bold text-blue-600 tracking-wider block mb-1">
                  Final Amount
                </span>
                <p className="text-4xl sm:text-5xl font-black text-blue-700">
                  {r4.final.toLocaleString()}
                </p>
                <p className="text-sm font-semibold text-slate-700 mt-1">
                  {m4Op === 'add' ? 'Added Amount: +' : 'Discount Savings: -'}{r4.changeAmt.toLocaleString()}
                </p>
                <p className="text-xs font-mono text-slate-500 mt-2">
                  Formula: {r4.formula}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
