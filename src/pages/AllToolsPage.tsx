import React, { useState } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { SITE_CONFIG, TOOLS, CATEGORIES } from '../config/siteConfig';
import { IconHelper } from '../components/common/IconHelper';
import { SEO } from '../components/common/SEO';
import { AdSlot } from '../components/common/AdSlot';
import { Search, Grid, ArrowRight, Sparkles } from 'lucide-react';

export const AllToolsPage: React.FC = () => {
  const { navigateTool } = useNavigation();
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  const filtered = TOOLS.filter(t => {
    const matchCat = selectedCat === 'all' || t.category === selectedCat;
    const matchSearch = 
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.shortDescription.toLowerCase().includes(search.toLowerCase()) ||
      t.keywords.some(k => k.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  return (
    <>
      <SEO
        title={`All ${TOOLS.length} Free Online Utility Tools | ToolNest Directory`}
        description="Browse the complete directory of free web utilities: PDF tools, image cropper, compressor, resizer, format converter, JSON formatter, URL encoder, calculators, QR generator, and password generator."
        keywords={['all tools', 'online tools directory', 'free web utilities', 'browser tools', 'pdf tools', 'json formatter']}
        canonicalUrl={`${SITE_CONFIG.baseUrl}/#/all-tools`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <AdSlot type="TopAd" />

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
            <Grid className="w-3.5 h-3.5" />
            <span>Complete Directory</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            All Free Online Utilities
          </h1>
          <p className="text-sm sm:text-base text-slate-600">
            Explore our full suite of {TOOLS.length} fast, reliable, and 100% private browser tools.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full w-full md:w-auto pb-1 md:pb-0">
            <button
              onClick={() => setSelectedCat('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                selectedCat === 'all'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              All ({TOOLS.length})
            </button>
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCat(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  selectedCat === cat.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tools..."
              className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3 py-1.5 text-xs sm:text-sm text-slate-800 focus:outline-blue-600"
            />
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(tool => (
            <div
              key={tool.id}
              onClick={() => navigateTool(tool.slug)}
              className="bg-white border border-slate-200/90 hover:border-blue-400 rounded-2xl p-5 shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-xl bg-blue-50/80 text-blue-600 flex items-center justify-center group-hover:scale-105 transition">
                    <IconHelper name={tool.icon} className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                    {tool.category}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                    {tool.shortDescription}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600">
                <span>Launch Tool</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
              </div>
            </div>
          ))}
        </div>

        <AdSlot type="ContentAd" />
      </div>
    </>
  );
};
