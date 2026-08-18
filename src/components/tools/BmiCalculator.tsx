import React, { useState } from 'react';
import { Scale, Heart, AlertCircle, Sparkles, RefreshCw, CheckCircle2, Info } from 'lucide-react';

export const BmiCalculator: React.FC = () => {
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('metric');
  
  // Metric state
  const [heightCm, setHeightCm] = useState<string>('175');
  const [weightKg, setWeightKg] = useState<string>('70');

  // Imperial state
  const [heightFeet, setHeightFeet] = useState<string>('5');
  const [heightInches, setHeightInches] = useState<string>('9');
  const [weightLbs, setWeightLbs] = useState<string>('154');

  // Contextual inputs
  const [age, setAge] = useState<string>('25');
  const [gender, setGender] = useState<'male' | 'female'>('male');

  const calculateBmi = () => {
    let weightInKg = 0;
    let heightInMeters = 0;

    if (unitSystem === 'metric') {
      const cm = parseFloat(heightCm);
      const kg = parseFloat(weightKg);
      if (isNaN(cm) || isNaN(kg) || cm <= 0 || kg <= 0) return null;
      weightInKg = kg;
      heightInMeters = cm / 100;
    } else {
      const feet = parseFloat(heightFeet) || 0;
      const inches = parseFloat(heightInches) || 0;
      const lbs = parseFloat(weightLbs);
      const totalInches = (feet * 12) + inches;
      if (totalInches <= 0 || isNaN(lbs) || lbs <= 0) return null;
      heightInMeters = totalInches * 0.0254;
      weightInKg = lbs * 0.45359237;
    }

    if (heightInMeters <= 0) return null;
    const bmi = weightInKg / (heightInMeters * heightInMeters);

    let category = '';
    let categoryColor = '';
    let categoryBg = '';
    let description = '';

    if (bmi < 18.5) {
      category = 'Underweight';
      categoryColor = 'text-amber-600';
      categoryBg = 'bg-amber-500';
      description = 'Below standard body mass index. Consider nutrient-rich balanced meal planning.';
    } else if (bmi < 25) {
      category = 'Normal weight';
      categoryColor = 'text-emerald-600';
      categoryBg = 'bg-emerald-500';
      description = 'Healthy body mass index range for your height. Maintain a balanced diet and regular activity.';
    } else if (bmi < 30) {
      category = 'Overweight';
      categoryColor = 'text-amber-600';
      categoryBg = 'bg-amber-500';
      description = 'Slightly above normal BMI range. Regular cardiovascular workouts and portion balance recommended.';
    } else if (bmi < 35) {
      category = 'Obesity Class I';
      categoryColor = 'text-rose-600';
      categoryBg = 'bg-rose-500';
      description = 'Moderate health risk. Consulting a medical healthcare practitioner or certified nutritionist is advised.';
    } else if (bmi < 40) {
      category = 'Obesity Class II';
      categoryColor = 'text-rose-700';
      categoryBg = 'bg-rose-600';
      description = 'Severe health risk category. Structured lifestyle interventions recommended.';
    } else {
      category = 'Obesity Class III';
      categoryColor = 'text-purple-700';
      categoryBg = 'bg-purple-600';
      description = 'Very high health risk. Seek professional medical guidance.';
    }

    // Healthy weight range (BMI 18.5 to 24.9)
    const minHealthyKg = 18.5 * (heightInMeters * heightInMeters);
    const maxHealthyKg = 24.9 * (heightInMeters * heightInMeters);

    const healthyRangeText = unitSystem === 'metric'
      ? `${minHealthyKg.toFixed(1)} kg - ${maxHealthyKg.toFixed(1)} kg`
      : `${(minHealthyKg * 2.20462).toFixed(1)} lbs - ${(maxHealthyKg * 2.20462).toFixed(1)} lbs`;

    return {
      bmi: parseFloat(bmi.toFixed(1)),
      category,
      categoryColor,
      categoryBg,
      description,
      healthyRangeText,
      heightInMeters,
      weightInKg
    };
  };

  const result = calculateBmi();

  return (
    <div className="space-y-6">
      {/* Unit Switcher & Options Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setUnitSystem('metric')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition ${
              unitSystem === 'metric'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Metric (cm, kg)
          </button>
          <button
            onClick={() => setUnitSystem('imperial')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition ${
              unitSystem === 'imperial'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Imperial (ft, in, lbs)
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-500">Gender:</span>
            <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-200">
              <button
                onClick={() => setGender('male')}
                className={`px-2.5 py-0.5 text-xs font-semibold rounded-md transition ${
                  gender === 'male' ? 'bg-blue-600 text-white' : 'text-slate-600'
                }`}
              >
                Male
              </button>
              <button
                onClick={() => setGender('female')}
                className={`px-2.5 py-0.5 text-xs font-semibold rounded-md transition ${
                  gender === 'female' ? 'bg-pink-600 text-white' : 'text-slate-600'
                }`}
              >
                Female
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-500">Age:</span>
            <input
              type="number"
              min="2"
              max="120"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-14 px-2 py-1 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg text-center focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Main Calculation Inputs & Output Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Parameters Column */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Your Measurements</h3>

          {unitSystem === 'metric' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Height (cm)</label>
                <input
                  type="number"
                  min="50"
                  max="260"
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value)}
                  placeholder="175"
                  className="w-full px-3.5 py-2.5 text-sm font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Weight (kg)</label>
                <input
                  type="number"
                  min="10"
                  max="350"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  placeholder="70"
                  className="w-full px-3.5 py-2.5 text-sm font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Height</label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max="8"
                      value={heightFeet}
                      onChange={(e) => setHeightFeet(e.target.value)}
                      placeholder="5"
                      className="w-full px-3 py-2.5 text-sm font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-semibold">ft</span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="11"
                      value={heightInches}
                      onChange={(e) => setHeightInches(e.target.value)}
                      placeholder="9"
                      className="w-full px-3 py-2.5 text-sm font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-semibold">in</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Weight (lbs)</label>
                <input
                  type="number"
                  min="20"
                  max="800"
                  value={weightLbs}
                  onChange={(e) => setWeightLbs(e.target.value)}
                  placeholder="154"
                  className="w-full px-3.5 py-2.5 text-sm font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
            </div>
          )}

          <div className="pt-2">
            <button
              onClick={() => {
                if (unitSystem === 'metric') { setHeightCm('170'); setWeightKg('65'); }
                else { setHeightFeet('5'); setHeightInches('7'); setWeightLbs('143'); }
              }}
              className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
            >
              Reset to Average Values
            </button>
          </div>
        </div>

        {/* BMI Results & Spectrum Column */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-6">
          {result ? (
            <div className="space-y-6">
              {/* Top Result Card */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Your Body Mass Index (BMI)</p>
                  <div className="flex items-baseline gap-3 mt-1">
                    <span className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">{result.bmi}</span>
                    <span className={`text-base sm:text-lg font-bold ${result.categoryColor}`}>
                      {result.category}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs font-bold text-slate-500">Healthy Weight Range</p>
                  <p className="text-sm font-bold text-emerald-600 mt-0.5">{result.healthyRangeText}</p>
                </div>
              </div>

              {/* Visual Category Spectrum Gauge */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                  <span>15</span>
                  <span>18.5 (Normal)</span>
                  <span>25.0 (Overweight)</span>
                  <span>30.0 (Obese)</span>
                  <span>40</span>
                </div>

                <div className="relative h-4 rounded-full overflow-hidden flex bg-slate-200">
                  <div style={{ width: '18.5%' }} className="bg-amber-400 h-full" title="Underweight (< 18.5)" />
                  <div style={{ width: '26.0%' }} className="bg-emerald-500 h-full" title="Normal (18.5 - 24.9)" />
                  <div style={{ width: '20.0%' }} className="bg-amber-500 h-full" title="Overweight (25 - 29.9)" />
                  <div style={{ width: '17.5%' }} className="bg-rose-500 h-full" title="Obese I (30 - 34.9)" />
                  <div style={{ width: '18.0%' }} className="bg-rose-700 h-full" title="Obese II & III (>= 35)" />
                </div>

                {/* Needle pointer calculation (capped between 0 and 100%) */}
                {(() => {
                  const val = result.bmi;
                  const percent = Math.min(100, Math.max(0, ((val - 15) / (40 - 15)) * 100));
                  return (
                    <div className="relative w-full h-4">
                      <div
                        style={{ left: `${percent}%` }}
                        className="absolute -top-1 -translate-x-1/2 flex flex-col items-center"
                      >
                        <div className="w-0 h-0 border-x-4 border-x-transparent border-t-6 border-t-slate-900" />
                        <span className="text-[10px] font-mono font-bold text-slate-900">{result.bmi}</span>
                      </div>
                    </div>
                  );
                })()}
              </div>

              <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200/60 leading-relaxed">
                {result.description}
              </p>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 space-y-2">
              <Scale className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-sm font-semibold">Enter valid height and weight measurements to calculate your BMI.</p>
            </div>
          )}

          {/* Reference Table */}
          <div className="border-t border-slate-100 pt-4">
            <h4 className="text-xs font-bold text-slate-700 mb-2">WHO BMI Categories for Adults</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              <div className="p-2 rounded-lg bg-amber-50 text-amber-800 border border-amber-200/60">
                <span className="font-bold block">&lt; 18.5</span> Underweight
              </div>
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                <span className="font-bold block">18.5 – 24.9</span> Normal Weight
              </div>
              <div className="p-2 rounded-lg bg-amber-50 text-amber-800 border border-amber-200/60">
                <span className="font-bold block">25.0 – 29.9</span> Overweight
              </div>
              <div className="p-2 rounded-lg bg-rose-50 text-rose-800 border border-rose-200/60">
                <span className="font-bold block">&ge; 30.0</span> Obesity
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
