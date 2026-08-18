import React, { useState } from 'react';
import { ArrowLeftRight, RefreshCw, Sliders } from 'lucide-react';

type UnitType = 'length' | 'weight' | 'temperature' | 'area' | 'data' | 'time' | 'speed';

interface UnitDefinition {
  label: string;
  factor: number; // relative to base unit (e.g. meter, gram, byte, second, sq meter)
}

export const UnitConverter: React.FC = () => {
  const [category, setCategory] = useState<UnitType>('length');
  const [fromValue, setFromValue] = useState<string>('1');
  const [fromUnit, setFromUnit] = useState<string>('kilometer');
  const [toUnit, setToUnit] = useState<string>('mile');

  // Categories configuration
  const UNITS: Record<UnitType, Record<string, UnitDefinition>> = {
    length: {
      kilometer: { label: 'Kilometers (km)', factor: 1000 },
      meter: { label: 'Meters (m)', factor: 1 },
      centimeter: { label: 'Centimeters (cm)', factor: 0.01 },
      millimeter: { label: 'Millimeters (mm)', factor: 0.001 },
      mile: { label: 'Miles (mi)', factor: 1609.344 },
      yard: { label: 'Yards (yd)', factor: 0.9144 },
      foot: { label: 'Feet (ft)', factor: 0.3048 },
      inch: { label: 'Inches (in)', factor: 0.0254 },
      nauticalMile: { label: 'Nautical Miles (NM)', factor: 1852 },
    },
    weight: {
      metricTon: { label: 'Metric Tonnes (t)', factor: 1000000 },
      kilogram: { label: 'Kilograms (kg)', factor: 1000 },
      gram: { label: 'Grams (g)', factor: 1 },
      milligram: { label: 'Milligrams (mg)', factor: 0.001 },
      pound: { label: 'Pounds (lb)', factor: 453.59237 },
      ounce: { label: 'Ounces (oz)', factor: 28.349523125 },
      stone: { label: 'Stones (st)', factor: 6350.29318 },
    },
    temperature: {
      celsius: { label: 'Celsius (°C)', factor: 1 },
      fahrenheit: { label: 'Fahrenheit (°F)', factor: 1 },
      kelvin: { label: 'Kelvin (K)', factor: 1 },
    },
    area: {
      squareKilometer: { label: 'Square Kilometers (km²)', factor: 1000000 },
      squareMeter: { label: 'Square Meters (m²)', factor: 1 },
      squareFoot: { label: 'Square Feet (ft²)', factor: 0.092903 },
      squareYard: { label: 'Square Yards (yd²)', factor: 0.836127 },
      squareMile: { label: 'Square Miles (mi²)', factor: 2589988.11 },
      acre: { label: 'Acres (ac)', factor: 4046.8564224 },
      hectare: { label: 'Hectares (ha)', factor: 10000 },
    },
    data: {
      byte: { label: 'Bytes (B)', factor: 1 },
      kilobyte: { label: 'Kilobytes (KB)', factor: 1024 },
      megabyte: { label: 'Megabytes (MB)', factor: 1048576 },
      gigabyte: { label: 'Gigabytes (GB)', factor: 1073741824 },
      terabyte: { label: 'Terabytes (TB)', factor: 1099511627776 },
      petabyte: { label: 'Petabytes (PB)', factor: 1125899906842624 },
    },
    time: {
      second: { label: 'Seconds (s)', factor: 1 },
      minute: { label: 'Minutes (min)', factor: 60 },
      hour: { label: 'Hours (hr)', factor: 3600 },
      day: { label: 'Days (d)', factor: 86400 },
      week: { label: 'Weeks (wk)', factor: 604800 },
      month: { label: 'Months (30 days)', factor: 2592000 },
      year: { label: 'Years (365 days)', factor: 31536000 },
    },
    speed: {
      metersPerSecond: { label: 'Meters / second (m/s)', factor: 1 },
      kilometersPerHour: { label: 'Kilometers / hour (km/h)', factor: 0.277778 },
      milesPerHour: { label: 'Miles / hour (mph)', factor: 0.44704 },
      knot: { label: 'Knots (kn)', factor: 0.514444 },
    }
  };

  const handleCategoryChange = (newCat: UnitType) => {
    setCategory(newCat);
    const available = Object.keys(UNITS[newCat]);
    setFromUnit(available[0]);
    setToUnit(available[1] || available[0]);
  };

  const handleSwap = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  // Conversion math
  const calculateConversion = (): { result: number; formula: string } | null => {
    const val = parseFloat(fromValue);
    if (isNaN(val)) return null;

    if (category === 'temperature') {
      let res = val;
      let formula = '';
      if (fromUnit === 'celsius' && toUnit === 'fahrenheit') {
        res = (val * 9) / 5 + 32;
        formula = `(${val}°C × 9/5) + 32 = ${res.toFixed(2)}°F`;
      } else if (fromUnit === 'fahrenheit' && toUnit === 'celsius') {
        res = ((val - 32) * 5) / 9;
        formula = `(${val}°F - 32) × 5/9 = ${res.toFixed(2)}°C`;
      } else if (fromUnit === 'celsius' && toUnit === 'kelvin') {
        res = val + 273.15;
        formula = `${val}°C + 273.15 = ${res.toFixed(2)} K`;
      } else if (fromUnit === 'kelvin' && toUnit === 'celsius') {
        res = val - 273.15;
        formula = `${val} K - 273.15 = ${res.toFixed(2)}°C`;
      } else if (fromUnit === 'fahrenheit' && toUnit === 'kelvin') {
        res = ((val - 32) * 5) / 9 + 273.15;
        formula = `((${val}°F - 32) × 5/9) + 273.15 = ${res.toFixed(2)} K`;
      } else if (fromUnit === 'kelvin' && toUnit === 'fahrenheit') {
        res = ((val - 273.15) * 9) / 5 + 32;
        formula = `((${val} K - 273.15) × 9/5) + 32 = ${res.toFixed(2)}°F`;
      } else {
        res = val;
        formula = `${val} = ${res}`;
      }
      return { result: parseFloat(res.toFixed(6)), formula };
    }

    const currentUnits = UNITS[category];
    const fromFactor = currentUnits[fromUnit]?.factor || 1;
    const toFactor = currentUnits[toUnit]?.factor || 1;

    // Convert from -> base -> to
    const baseValue = val * fromFactor;
    const targetValue = baseValue / toFactor;

    const fromLabel = currentUnits[fromUnit]?.label.split(' ')[0];
    const toLabel = currentUnits[toUnit]?.label.split(' ')[0];

    const formula = `1 ${fromLabel} = ${(fromFactor / toFactor).toPrecision(6)} ${toLabel}`;
    return { result: parseFloat(targetValue.toPrecision(8)), formula };
  };

  const conversion = calculateConversion();

  const CATEGORY_TABS: { id: UnitType; label: string }[] = [
    { id: 'length', label: 'Length' },
    { id: 'weight', label: 'Weight' },
    { id: 'temperature', label: 'Temperature' },
    { id: 'area', label: 'Area' },
    { id: 'data', label: 'Data Size' },
    { id: 'time', label: 'Time' },
    { id: 'speed', label: 'Speed' },
  ];

  return (
    <div className="space-y-6">
      {/* Category Tabs */}
      <div className="flex overflow-x-auto gap-1.5 p-1.5 bg-slate-100/90 rounded-2xl pb-2">
        {CATEGORY_TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => handleCategoryChange(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition ${
              category === tab.id
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Converter Panel */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
          {/* "From" Side */}
          <div className="md:col-span-5 space-y-2">
            <label className="block text-xs font-bold uppercase text-slate-500">
              From
            </label>
            <input
              type="number"
              step="any"
              value={fromValue}
              onChange={(e) => setFromValue(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-lg font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-blue-600"
            >
              {(Object.entries(UNITS[category]) as [string, UnitDefinition][]).map(([key, def]) => (
                <option key={key} value={key}>
                  {def.label}
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <div className="md:col-span-1 flex justify-center pt-2 md:pt-6">
            <button
              onClick={handleSwap}
              className="w-10 h-10 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 flex items-center justify-center transition shadow-xs"
              title="Swap units"
            >
              <ArrowLeftRight className="w-4 h-4" />
            </button>
          </div>

          {/* "To" Side */}
          <div className="md:col-span-5 space-y-2">
            <label className="block text-xs font-bold uppercase text-slate-500">
              To
            </label>
            <div className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-lg font-bold text-blue-700 overflow-x-auto whitespace-nowrap">
              {conversion ? conversion.result.toLocaleString() : '—'}
            </div>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-blue-600"
            >
              {(Object.entries(UNITS[category]) as [string, UnitDefinition][]).map(([key, def]) => (
                <option key={key} value={key}>
                  {def.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Result Formula Banner */}
        {conversion && (
          <div className="bg-blue-50/80 border border-blue-200 rounded-2xl p-4 text-center">
            <span className="text-xs uppercase font-bold text-blue-600 tracking-wider block mb-1">
              Conversion Formula & Rate
            </span>
            <p className="text-base sm:text-lg font-bold text-slate-800 font-mono">
              {fromValue} {UNITS[category][fromUnit]?.label.split(' ')[0]} = {conversion.result.toLocaleString()} {UNITS[category][toUnit]?.label.split(' ')[0]}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Rate: {conversion.formula}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
