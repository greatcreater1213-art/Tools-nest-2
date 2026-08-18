import React, { useState } from 'react';
import { Tag, Percent, DollarSign, RefreshCw, Sparkles, Check, Copy } from 'lucide-react';

export const DiscountCalculator: React.FC = () => {
  const [originalPrice, setOriginalPrice] = useState<string>('120');
  const [discountPercent, setDiscountPercent] = useState<string>('25');
  const [extraDiscountPercent, setExtraDiscountPercent] = useState<string>('0');
  const [salesTaxPercent, setSalesTaxPercent] = useState<string>('8');
  const [currency, setCurrency] = useState<string>('$');
  const [copied, setCopied] = useState<boolean>(false);

  const calculateDiscount = () => {
    const price = parseFloat(originalPrice);
    const disc1 = parseFloat(discountPercent) || 0;
    const disc2 = parseFloat(extraDiscountPercent) || 0;
    const tax = parseFloat(salesTaxPercent) || 0;

    if (isNaN(price) || price < 0) return null;

    // Primary discount
    const primaryDiscountAmount = price * (disc1 / 100);
    const priceAfterPrimary = Math.max(0, price - primaryDiscountAmount);

    // Extra stacked discount on the remaining price
    const extraDiscountAmount = priceAfterPrimary * (disc2 / 100);
    const priceAfterBothDiscounts = Math.max(0, priceAfterPrimary - extraDiscountAmount);

    // Total savings before tax
    const totalDiscountAmount = primaryDiscountAmount + extraDiscountAmount;
    const effectiveDiscountPercent = price > 0 ? (totalDiscountAmount / price) * 100 : 0;

    // Sales Tax applied on discounted price
    const taxAmount = priceAfterBothDiscounts * (tax / 100);
    const finalPriceWithTax = priceAfterBothDiscounts + taxAmount;

    return {
      price,
      primaryDiscountAmount,
      extraDiscountAmount,
      totalDiscountAmount,
      priceAfterBothDiscounts,
      taxAmount,
      finalPriceWithTax,
      effectiveDiscountPercent
    };
  };

  const result = calculateDiscount();

  const handleCopySummary = () => {
    if (!result) return;
    const text = `Original Price: ${currency}${result.price.toFixed(2)}\nDiscount: ${discountPercent}%\nTotal Savings: ${currency}${result.totalDiscountAmount.toFixed(2)}\nFinal Price: ${currency}${result.finalPriceWithTax.toFixed(2)}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Currency and Options */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Currency Symbol:</span>
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {['$', '€', '£', '₹', '¥', 'C$'].map((sym) => (
              <button
                key={sym}
                onClick={() => setCurrency(sym)}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                  currency === sym ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {sym}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => {
            setOriginalPrice('100');
            setDiscountPercent('20');
            setExtraDiscountPercent('0');
            setSalesTaxPercent('0');
          }}
          className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
        >
          Reset to Defaults
        </button>
      </div>

      {/* Inputs & Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Controls */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Price & Discount Details</h3>

          {/* Original Price */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Original Price</label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-sm font-bold text-slate-400">{currency}</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                placeholder="100.00"
                className="w-full pl-8 pr-3.5 py-2.5 text-base font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Primary Discount % */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-600">Discount Percentage (%)</label>
              <span className="text-xs font-bold text-blue-600">{discountPercent}% OFF</span>
            </div>
            <div className="relative mb-2">
              <input
                type="number"
                min="0"
                max="100"
                step="1"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(e.target.value)}
                placeholder="20"
                className="w-full pr-8 pl-3.5 py-2.5 text-sm font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
              <span className="absolute right-3.5 top-2.5 text-sm font-bold text-slate-400">%</span>
            </div>

            {/* Quick Discount Presets */}
            <div className="flex flex-wrap gap-1.5">
              {['10', '15', '20', '25', '30', '40', '50', '70'].map((p) => (
                <button
                  key={p}
                  onClick={() => setDiscountPercent(p)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition ${
                    discountPercent === p
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {p}%
                </button>
              ))}
            </div>
          </div>

          {/* Optional Extra Stacked Discount & Tax */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">
                Extra Discount (%) <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={extraDiscountPercent}
                  onChange={(e) => setExtraDiscountPercent(e.target.value)}
                  placeholder="0"
                  className="w-full pr-8 pl-3 py-2 text-xs font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                />
                <span className="absolute right-3 top-2 text-xs font-bold text-slate-400">%</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">
                Sales Tax (%) <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={salesTaxPercent}
                  onChange={(e) => setSalesTaxPercent(e.target.value)}
                  placeholder="0"
                  className="w-full pr-8 pl-3 py-2 text-xs font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                />
                <span className="absolute right-3 top-2 text-xs font-bold text-slate-400">%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Calculation Output Card */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-6">
          {result ? (
            <div className="space-y-6">
              {/* Highlight Final Price Box */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-md">
                <div className="flex items-center justify-between text-blue-100 text-xs font-bold uppercase tracking-wider mb-1">
                  <span>Final Price You Pay</span>
                  <span className="bg-white/20 px-2 py-0.5 rounded-full text-white text-[11px]">
                    {result.effectiveDiscountPercent.toFixed(0)}% Total Savings
                  </span>
                </div>
                <div className="text-3xl sm:text-4xl font-black tracking-tight">
                  {currency}{result.finalPriceWithTax.toFixed(2)}
                </div>
                <p className="text-xs text-blue-100 mt-2">
                  You save <strong className="text-white">{currency}{result.totalDiscountAmount.toFixed(2)}</strong> off the original price!
                </p>
              </div>

              {/* Detailed Line Breakdown */}
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Original Price:</span>
                  <span className="font-bold text-slate-800 line-through text-slate-400">
                    {currency}{result.price.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-emerald-700 font-semibold">Total Discount Savings:</span>
                  <span className="font-bold text-emerald-600">
                    - {currency}{result.totalDiscountAmount.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Subtotal After Discounts:</span>
                  <span className="font-bold text-slate-800">
                    {currency}{result.priceAfterBothDiscounts.toFixed(2)}
                  </span>
                </div>

                {parseFloat(salesTaxPercent) > 0 && (
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">Estimated Sales Tax ({salesTaxPercent}%):</span>
                    <span className="font-bold text-slate-800">
                      + {currency}{result.taxAmount.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400">
              Enter an original price to view your discount savings.
            </div>
          )}

          {/* Copy Button */}
          <button
            onClick={handleCopySummary}
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
                Summary Copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy Breakdown
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
