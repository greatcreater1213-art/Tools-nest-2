import React, { useState } from 'react';
import { CalendarDays, Clock, Copy, Check, ArrowLeftRight, Sparkles, RefreshCw, Calendar, CheckCircle2 } from 'lucide-react';

export const DateDifferenceCalculator: React.FC = () => {
  const getTodayStr = () => new Date().toISOString().split('T')[0];
  const getNextMonthStr = () => {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    return d.toISOString().split('T')[0];
  };

  const [startDate, setStartDate] = useState<string>(getTodayStr());
  const [endDate, setEndDate] = useState<string>(getNextMonthStr());
  const [includeEndDay, setIncludeEndDay] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const calculateDifference = () => {
    if (!startDate || !endDate) return null;

    const start = new Date(startDate + 'T00:00:00');
    const end = new Date(endDate + 'T00:00:00');

    if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;

    let isReversed = false;
    let d1 = new Date(start);
    let d2 = new Date(end);

    if (d1 > d2) {
      isReversed = true;
      const temp = d1;
      d1 = d2;
      d2 = temp;
    }

    // Precise Calendar Years, Months, Days
    let years = d2.getFullYear() - d1.getFullYear();
    let months = d2.getMonth() - d1.getMonth();
    let days = d2.getDate() - d1.getDate();

    if (days < 0) {
      months -= 1;
      // Get days in previous month of d2
      const prevMonthLastDay = new Date(d2.getFullYear(), d2.getMonth(), 0).getDate();
      days += prevMonthLastDay;
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    // Total milliseconds
    let diffMs = Math.abs(end.getTime() - start.getTime());
    let totalDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (includeEndDay) {
      totalDays += 1;
      days += 1;
    }

    const totalWeeks = Math.floor(totalDays / 7);
    const remainingDaysInWeek = totalDays % 7;

    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;
    const totalSeconds = totalMinutes * 60;

    // Count business days (Monday-Friday) vs weekend days
    let businessDays = 0;
    let weekendDays = 0;
    const cur = new Date(d1);
    const stopDate = new Date(d2);
    if (!includeEndDay) {
      stopDate.setDate(stopDate.getDate() - 1);
    }

    while (cur <= stopDate) {
      const dayOfWeek = cur.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        weekendDays++;
      } else {
        businessDays++;
      }
      cur.setDate(cur.getDate() + 1);
    }

    return {
      isReversed,
      years,
      months,
      days,
      totalDays,
      totalWeeks,
      remainingDaysInWeek,
      totalHours,
      totalMinutes,
      totalSeconds,
      businessDays,
      weekendDays
    };
  };

  const result = calculateDifference();

  const handleSwap = () => {
    const temp = startDate;
    setStartDate(endDate);
    setEndDate(temp);
  };

  const handleCopy = () => {
    if (!result) return;
    const text = `Date Difference:\nFrom: ${startDate}\nTo: ${endDate}\nExact: ${result.years} years, ${result.months} months, ${result.days} days\nTotal Days: ${result.totalDays.toLocaleString()} days (${result.businessDays} workdays, ${result.weekendDays} weekend days)`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Date Pickers and Options */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Select Date Range</h3>

          {/* Start Date */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <button
              onClick={handleSwap}
              className="p-2 text-slate-500 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 rounded-xl border border-slate-200 transition"
              title="Swap Dates"
            >
              <ArrowLeftRight className="w-4 h-4" />
            </button>
          </div>

          {/* End Date */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          {/* Include End Day Checkbox */}
          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
              <input
                type="checkbox"
                checked={includeEndDay}
                onChange={(e) => setIncludeEndDay(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
              />
              <span>Include End Date in Calculation (+1 full day)</span>
            </label>
          </div>

          {/* Quick Range Presets */}
          <div className="pt-3 border-t border-slate-100 space-y-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Quick Presets</span>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => {
                  const now = new Date();
                  setStartDate(now.toISOString().split('T')[0]);
                  setEndDate(new Date(now.getFullYear(), 11, 31).toISOString().split('T')[0]);
                }}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 transition"
              >
                Until End of Year
              </button>
              <button
                onClick={() => {
                  const now = new Date();
                  const past = new Date();
                  past.setDate(now.getDate() - 30);
                  setStartDate(past.toISOString().split('T')[0]);
                  setEndDate(now.toISOString().split('T')[0]);
                }}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 transition"
              >
                Last 30 Days
              </button>
              <button
                onClick={() => {
                  const now = new Date();
                  const next = new Date();
                  next.setDate(now.getDate() + 100);
                  setStartDate(now.toISOString().split('T')[0]);
                  setEndDate(next.toISOString().split('T')[0]);
                }}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 transition"
              >
                +100 Days From Today
              </button>
            </div>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-6">
          {result ? (
            <div className="space-y-5">
              {/* Primary Output Hero Box */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-md">
                <p className="text-xs font-bold text-blue-100 uppercase tracking-wider mb-1">
                  Exact Calendar Difference
                </p>
                <div className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                  {result.years > 0 && `${result.years} Year${result.years > 1 ? 's' : ''}, `}
                  {result.months > 0 && `${result.months} Month${result.months > 1 ? 's' : ''}, `}
                  {result.days} Day{result.days !== 1 ? 's' : ''}
                </div>
                <p className="text-xs text-blue-100 mt-2">
                  Total duration of <strong>{result.totalDays.toLocaleString()} days</strong>
                  {result.isReversed && ' (Reverse date order)'}
                </p>
              </div>

              {/* Breakdown Grid Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                  <span className="text-[11px] text-slate-400 font-medium block">Total Days</span>
                  <span className="text-lg font-bold text-slate-900">{result.totalDays.toLocaleString()}</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                  <span className="text-[11px] text-slate-400 font-medium block">Weeks & Days</span>
                  <span className="text-lg font-bold text-slate-900">
                    {result.totalWeeks}w {result.remainingDaysInWeek}d
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                  <span className="text-[11px] text-slate-400 font-medium block">Working Days</span>
                  <span className="text-lg font-bold text-emerald-600">{result.businessDays} days</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                  <span className="text-[11px] text-slate-400 font-medium block">Weekend Days</span>
                  <span className="text-lg font-bold text-amber-600">{result.weekendDays} days</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                  <span className="text-[11px] text-slate-400 font-medium block">Total Hours</span>
                  <span className="text-lg font-bold text-slate-900">{result.totalHours.toLocaleString()}</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                  <span className="text-[11px] text-slate-400 font-medium block">Total Minutes</span>
                  <span className="text-lg font-bold text-slate-900">{result.totalMinutes.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400">
              Select start and end dates to calculate the difference.
            </div>
          )}

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            disabled={!result}
            className={`w-full py-2.5 text-xs font-bold rounded-xl shadow-xs transition inline-flex items-center justify-center gap-1.5 ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Copied to Clipboard!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy Full Breakdown
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
