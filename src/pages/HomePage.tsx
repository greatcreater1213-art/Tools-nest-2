import React, { useState } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { SITE_CONFIG, TOOLS, CATEGORIES } from '../config/siteConfig';
import { IconHelper } from '../components/common/IconHelper';
import { SEO } from '../components/common/SEO';
import { AdSlot } from '../components/common/AdSlot';
import { 
  Sparkles, 
  Search, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Lock, 
  Smartphone, 
  Layers, 
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Star
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { navigateTo, navigateTool } = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredTools = TOOLS.filter(tool => {
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    const matchesSearch = 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const popularTools = TOOLS.filter(t => t.popular);

  return (
    <>
      <SEO
        title="ToolNest - Free Online AI & Utility Tools | 100% Client-Side"
        description="Fast, free, and private online tools: image compressor, resizer, format converter, word counter, QR generator, password generator, and unit calculators."
        keywords={['free online tools', 'image compressor', 'qr code generator', 'password generator', 'word counter', 'unit converter']}
        canonicalUrl={SITE_CONFIG.baseUrl}
      />

      <div className="space-y-12 pb-16">
        {/* Top Ad Slot Placeholder */}
        <div className="max-w-7xl mx-auto px-4 pt-4">
          <AdSlot type="TopAd" />
        </div>

        {/* Hero Section */}
        <section className="relative overflow-hidden pt-4 pb-8 sm:pt-10 sm:pb-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-bold shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>{TOOLS.length} Fast & Free Browser Utilities</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Free Online Tools for <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700">
                Everyday Tasks
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Simple, fast, and 100% browser-based utility tools. Compress images, generate QR codes, calculate percentages, format text, and convert units directly in your browser with zero server uploads.
            </p>

            {/* Prominent Search Box */}
            <div className="max-w-xl mx-auto pt-1">
              <div className="relative flex items-center shadow-md hover:shadow-lg rounded-2xl bg-white border border-slate-200/90 p-2 focus-within:ring-2 focus-within:ring-blue-600 focus-within:border-blue-600 transition">
                <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for a tool (e.g. compress image, qr code, word count)..."
                  className="w-full px-3 py-2 text-sm sm:text-base text-slate-900 placeholder-slate-400 bg-transparent focus:outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="px-2.5 py-1 text-xs text-slate-400 hover:text-slate-700 font-semibold transition"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Popular Tool Shortcuts below Search */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mt-3.5 text-xs text-slate-500">
                <span className="font-semibold text-slate-400">Popular:</span>
                {[
                  { name: 'Image Compressor', slug: 'image-compressor' },
                  { name: 'QR Code', slug: 'qr-code-generator' },
                  { name: 'Word Counter', slug: 'word-counter' },
                  { name: 'Percentage', slug: 'percentage-calculator' },
                  { name: 'Password', slug: 'password-generator' },
                  { name: 'Age Calculator', slug: 'age-calculator' },
                ].map((item) => (
                  <button
                    key={item.slug}
                    onClick={() => navigateTool(item.slug)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100/90 hover:bg-blue-50 hover:text-blue-700 text-slate-700 font-medium transition border border-slate-200/60"
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Trust Badges */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-5 sm:gap-8 text-xs font-semibold text-slate-600">
              <div className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-emerald-600" />
                <span>100% Client-Side Privacy</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Zero Server Uploads</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-blue-600" />
                <span>Mobile & Desktop Ready</span>
              </div>
            </div>
          </div>
        </section>

        {/* Popular / Trending Highlights */}
        {!searchQuery && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                  Popular & Trending Tools
                </h2>
              </div>
              <button
                onClick={() => navigateTo('/all-tools')}
                className="text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <span>View All 15 Tools</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {popularTools.map(tool => (
                <div
                  key={tool.id}
                  onClick={() => navigateTool(tool.slug)}
                  className="bg-white border border-slate-200/80 hover:border-blue-300 rounded-2xl p-5 shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer group flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition">
                        <IconHelper name={tool.icon} className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200/60 flex items-center gap-1">
                        <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                        Popular
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

                  <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600 group-hover:translate-x-0.5 transition">
                    <span>Open Tool</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Category Filters & Full Tools Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                All Available Utility Tools
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Showing {filteredTools.length} of {TOOLS.length} tools
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  selectedCategory === 'all'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Tools ({TOOLS.length})
              </button>
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                    selectedCategory === cat.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Tools Grid */}
          {filteredTools.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredTools.map(tool => (
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
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
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
                    <span>Use Tool Free</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-12 text-center space-y-3">
              <Search className="w-8 h-8 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No matching tools found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No utilities matched your search term "{searchQuery}". Try selecting "All Tools" or searching for words like "image", "calculate", or "password".
              </p>
              <button
                onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
                className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl"
              >
                Reset Filters
              </button>
            </div>
          )}
        </section>

        {/* Content Ad Slot */}
        <div className="max-w-7xl mx-auto px-4">
          <AdSlot type="ContentAd" />
        </div>

        {/* Why ToolNest Features Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl">
            <div className="max-w-3xl mx-auto text-center space-y-3 mb-10">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
                Built for Speed & Privacy
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Why Use ToolNest?
              </h2>
              <p className="text-sm sm:text-base text-slate-400">
                ToolNest runs directly in your web browser. No cloud uploads, no server delays, and no privacy compromises.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="p-5 sm:p-6 bg-slate-800/70 rounded-2xl border border-slate-700/60 space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">1. Ultra Fast</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Processes files, calculations, and conversions instantly with zero upload queues or lag.
                </p>
              </div>

              <div className="p-5 sm:p-6 bg-slate-800/70 rounded-2xl border border-slate-700/60 space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">2. Easy to Use</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Clean interfaces with no cluttered menus or confusing configurations. Just upload, click, and download.
                </p>
              </div>

              <div className="p-5 sm:p-6 bg-slate-800/70 rounded-2xl border border-slate-700/60 space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">3. 100% Browser-Based</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Your files, photos, and credentials never leave your device. All processing happens safely inside your browser.
                </p>
              </div>

              <div className="p-5 sm:p-6 bg-slate-800/70 rounded-2xl border border-slate-700/60 space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">4. 100% Free</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  No hidden fees, no subscriptions, and no registration required. Unlimited usage for all tools.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Frequently Asked Questions (FAQ) Section for SEO */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="text-center space-y-2 mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Everything you need to know about ToolNest online utilities.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-2">
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                Are my uploaded images or passwords saved on your server?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                No. ToolNest does not send your images, text, or passwords to any backend server. All image compression, conversions, QR codes, and password calculations happen exclusively in your local browser's memory using JavaScript and HTML5 Canvas.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-2">
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                Do I need to create an account or pay to use ToolNest?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                No registration or subscription is required. All 15+ tools are 100% free to use with unlimited operations.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-2">
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                Can I use ToolNest on my smartphone or tablet?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Yes! ToolNest is designed with a mobile-first philosophy. All tools, download buttons, and converters work seamlessly on iOS Safari, Android Chrome, tablets, and desktop browsers.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};
