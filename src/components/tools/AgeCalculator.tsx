import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Calendar, Cake, Sparkles, Clock, Heart, ArrowRight } from 'lucide-react';

export const AgeCalculator: React.FC = () => {
  // Default to a reasonable DOB like 2000-01-01
  const [birthDateStr, setBirthDateStr] = useState<string>('2000-01-01');
  const [targetDateStr, setTargetDateStr] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  const calculateAge = () => {
    if (!birthDateStr || !targetDateStr) return null;

    const birth = new Date(birthDateStr + 'T00:00:00');
    const target = new Date(targetDateStr + 'T00:00:00');

    if (isNaN(birth.getTime()) || isNaN(target.getTime()) || birth > target) {
      return null;
    }

    let years = target.getFullYear() - birth.getFullYear();
    let months = target.getMonth() - birth.getMonth();
    let days = target.getDate() - birth.getDate();

    if (days < 0) {
      // Borrow days from previous month
      const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
      days += prevMonth.getDate();
      months -= 1;
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    // Total Lifespan Stats
    const totalMs = target.getTime() - birth.getTime();
    const totalDays = Math.floor(totalMs / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = years * 12 + months;
    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;
    const totalSeconds = totalMinutes * 60;

    // Day of the week born on
    const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const birthDayName = DAYS_OF_WEEK[birth.getDay()];

    // Next Birthday Calculation
    let nextBdayYear = target.getFullYear();
    let nextBday = new Date(nextBdayYear, birth.getMonth(), birth.getDate());

    if (nextBday < target) {
      nextBday = new Date(nextBdayYear + 1, birth.getMonth(), birth.getDate());
    }

    const msUntilBday = nextBday.getTime() - target.getTime();
    const daysUntilNextBday = Math.ceil(msUntilBday / (1000 * 60 * 60 * 24));
    const nextBdayDayName = DAYS_OF_WEEK[nextBday.getDay()];

    const monthsUntilNextBday = Math.floor(daysUntilNextBday / 30.4375);
    const remainingDaysAfterMonths = Math.floor(daysUntilNextBday % 30.4375);

    return {
      years,
      months,
      days,
      totalMonths,
      totalWeeks,
      totalDays,
      totalHours,
      totalMinutes,
      totalSeconds,
      birthDayName,
      daysUntilNextBday,
      monthsUntilNextBday,
      remainingDaysAfterMonths,
      nextBdayDayName,
      isBirthdayToday: daysUntilNextBday === 0 || (birth.getMonth() === target.getMonth() && birth.getDate() === target.getDate()),
    };
  };

  const ageData = calculateAge();

  const handleCelebrate = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // Ignore if confetti not supported
    }
  };

  return (
    <div className="space-y-6">
      {/* Date Pickers */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 flex items-center gap-1">
              <Calendar className="w-4 h-4 text-blue-600" />
              Date of Birth
            </label>
            <input
              type="date"
              value={birthDateStr}
              onChange={(e) => setBirthDateStr(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm sm:text-base font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 flex items-center gap-1">
              <Clock className="w-4 h-4 text-blue-600" />
              Age at Date of (Default: Today)
            </label>
            <input
              type="date"
              value={targetDateStr}
              onChange={(e) => setTargetDateStr(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm sm:text-base font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Main Age Result Display */}
      {ageData ? (
        <div className="space-y-6">
          {/* Exact Chronological Age Banner */}
          <div className="bg-blue-600 text-white rounded-2xl p-6 sm:p-8 text-center shadow-md relative overflow-hidden">
            <div className="relative z-10">
              <span className="text-xs uppercase font-bold tracking-widest text-blue-200 block mb-2">
                Your Exact Chronological Age
              </span>
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 my-2">
                <div>
                  <span className="text-4xl sm:text-6xl font-black">{ageData.years}</span>
                  <span className="block text-xs uppercase font-bold text-blue-200 mt-1">Years</span>
                </div>
                <div className="text-3xl sm:text-5xl font-light text-blue-300">/</div>
                <div>
                  <span className="text-4xl sm:text-6xl font-black">{ageData.months}</span>
                  <span className="block text-xs uppercase font-bold text-blue-200 mt-1">Months</span>
                </div>
                <div className="text-3xl sm:text-5xl font-light text-blue-300">/</div>
                <div>
                  <span className="text-4xl sm:text-6xl font-black">{ageData.days}</span>
                  <span className="block text-xs uppercase font-bold text-blue-200 mt-1">Days</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-blue-100 font-medium mt-3">
                Born on a <strong className="text-white underline decoration-blue-400">{ageData.birthDayName}</strong>
              </p>
            </div>
          </div>

          {/* Next Birthday Card */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Cake className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-emerald-950 font-bold text-base sm:text-lg">
                  {ageData.isBirthdayToday ? '🎉 Happy Birthday Today!' : 'Next Birthday Countdown'}
                </h4>
                <p className="text-xs sm:text-sm text-emerald-800 font-medium mt-0.5">
                  {ageData.isBirthdayToday
                    ? 'Wishing you a wonderful celebration!'
                    : `${ageData.daysUntilNextBday} days remaining (falls on a ${ageData.nextBdayDayName})`}
                </p>
              </div>
            </div>

            <button
              onClick={handleCelebrate}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-xs transition flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Celebrate!</span>
            </button>
          </div>

          {/* Detailed Lifespan Breakdown Grid */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4">
            <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider">
              Total Lifespan Statistics (Time Elapsed)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="p-3 bg-white rounded-xl border border-slate-200 text-center">
                <span className="text-[11px] font-bold text-slate-400 uppercase block">Months</span>
                <span className="text-base sm:text-lg font-black text-slate-800">
                  {ageData.totalMonths.toLocaleString()}
                </span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 text-center">
                <span className="text-[11px] font-bold text-slate-400 uppercase block">Weeks</span>
                <span className="text-base sm:text-lg font-black text-slate-800">
                  {ageData.totalWeeks.toLocaleString()}
                </span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 text-center">
                <span className="text-[11px] font-bold text-slate-400 uppercase block">Days</span>
                <span className="text-base sm:text-lg font-black text-slate-800">
                  {ageData.totalDays.toLocaleString()}
                </span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 text-center">
                <span className="text-[11px] font-bold text-slate-400 uppercase block">Hours</span>
                <span className="text-base sm:text-lg font-black text-slate-800">
                  {ageData.totalHours.toLocaleString()}
                </span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 text-center">
                <span className="text-[11px] font-bold text-slate-400 uppercase block">Minutes</span>
                <span className="text-base sm:text-lg font-black text-slate-800">
                  {ageData.totalMinutes.toLocaleString()}
                </span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 text-center">
                <span className="text-[11px] font-bold text-slate-400 uppercase block">Seconds</span>
                <span className="text-base sm:text-lg font-black text-slate-800">
                  {ageData.totalSeconds.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-center text-sm font-medium">
          Please select a valid date of birth earlier than the target date.
        </div>
      )}
    </div>
  );
};
