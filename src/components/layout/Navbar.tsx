import React, { useState, useEffect, useRef } from 'react';
import { useNavigation } from '../../context/NavigationContext';
import { SITE_CONFIG, TOOLS, CATEGORIES } from '../../config/siteConfig';
import { IconHelper } from '../common/IconHelper';
import { 
  Search, 
  Menu, 
  X, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Zap,
  Grid,
  Info,
  Mail,
  ChevronDown
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentPath, navigateTo, navigateTool } = useNavigation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close mobile menu on path change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [currentPath]);

  // Keyboard shortcut: Cmd/Ctrl + K to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      } else if (e.key === 'Escape') {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [searchOpen]);

  const filteredTools = query.trim()
    ? TOOLS.filter(t => 
        t.name.toLowerCase().includes(query.toLowerCase()) ||
        t.shortDescription.toLowerCase().includes(query.toLowerCase()) ||
        t.keywords.some(k => k.toLowerCase().includes(query.toLowerCase()))
      )
    : TOOLS.slice(0, 6);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-6">
              <button
                onClick={() => navigateTo('/')}
                className="flex items-center gap-2.5 group focus:outline-none"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xl font-extrabold text-slate-900 tracking-tight leading-none group-hover:text-blue-600 transition">
                    Tool<span className="text-blue-600">Nest</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase mt-0.5">
                    100% Free Utilities
                  </span>
                </div>
              </button>

              {/* Desktop Nav Links */}
              <nav className="hidden md:flex items-center gap-1">
                <button
                  onClick={() => navigateTo('/')}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
                    currentPath === '/' 
                      ? 'text-blue-600 bg-blue-50/80' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Home
                </button>

                <button
                  onClick={() => navigateTo('/all-tools')}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
                    currentPath.startsWith('/all-tools') 
                      ? 'text-blue-600 bg-blue-50/80' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  All Tools
                </button>

                <button
                  onClick={() => navigateTo('/about')}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
                    currentPath === '/about' 
                      ? 'text-blue-600 bg-blue-50/80' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  About
                </button>

                <button
                  onClick={() => navigateTo('/contact')}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
                    currentPath === '/contact' 
                      ? 'text-blue-600 bg-blue-50/80' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Contact
                </button>
              </nav>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              {/* Quick Search Button */}
              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200/80 text-slate-500 rounded-xl text-xs sm:text-sm font-medium transition border border-slate-200/60"
                title="Search Tools (Cmd/Ctrl + K)"
              >
                <Search className="w-4 h-4 text-slate-400" />
                <span className="hidden sm:inline">Search 15+ tools...</span>
                <span className="inline sm:hidden">Search</span>
                <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-white border border-slate-300 rounded-md">
                  ⌘K
                </kbd>
              </button>

              <button
                onClick={() => navigateTo('/all-tools')}
                className="hidden lg:inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
              >
                <Grid className="w-3.5 h-3.5" />
                <span>Explore Tools</span>
              </button>

              {/* Mobile Hamburger Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 md:hidden text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-slate-700" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg animate-in slide-in-from-top-2 duration-200">
            <div className="space-y-1">
              <button
                onClick={() => navigateTo('/')}
                className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-bold text-slate-800 hover:bg-blue-50 hover:text-blue-600 transition"
              >
                Home
              </button>
              <button
                onClick={() => navigateTo('/all-tools')}
                className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-bold text-slate-800 hover:bg-blue-50 hover:text-blue-600 transition"
              >
                All Tools (15)
              </button>
              <button
                onClick={() => navigateTo('/about')}
                className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-bold text-slate-800 hover:bg-blue-50 hover:text-blue-600 transition"
              >
                About Us
              </button>
              <button
                onClick={() => navigateTo('/contact')}
                className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-bold text-slate-800 hover:bg-blue-50 hover:text-blue-600 transition"
              >
                Contact Us
              </button>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <span className="text-[11px] font-bold uppercase text-slate-400 px-3 block mb-2">
                Popular Tools
              </span>
              <div className="grid grid-cols-2 gap-2">
                {TOOLS.filter(t => t.popular).slice(0, 4).map(tool => (
                  <button
                    key={tool.id}
                    onClick={() => navigateTool(tool.slug)}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 text-left transition border border-slate-100 flex items-center gap-2"
                  >
                    <IconHelper name={tool.icon} className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold text-slate-800 truncate">{tool.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Global Quick Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-start justify-center pt-16 px-4">
          <div 
            className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Bar */}
            <div className="p-4 border-b border-slate-200 flex items-center gap-3">
              <Search className="w-5 h-5 text-blue-600 shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tools (e.g. compress, password, qr, percentage)..."
                className="w-full bg-transparent text-slate-900 text-sm sm:text-base font-semibold focus:outline-none"
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Results List */}
            <div className="max-h-[360px] overflow-y-auto p-3 space-y-1">
              {filteredTools.length > 0 ? (
                filteredTools.map(tool => (
                  <div
                    key={tool.id}
                    onClick={() => {
                      navigateTool(tool.slug);
                      setSearchOpen(false);
                    }}
                    className="p-3 rounded-xl hover:bg-blue-50 cursor-pointer flex items-center justify-between group transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100/70 text-blue-600 flex items-center justify-center group-hover:scale-105 transition">
                        <IconHelper name={tool.icon} className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition">
                          {tool.name}
                        </h4>
                        <p className="text-xs text-slate-400 line-clamp-1">{tool.shortDescription}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition shrink-0" />
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-slate-400 text-sm">
                  No matching tools found for "{query}". Try another keyword.
                </div>
              )}
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Quick Navigation</span>
              <kbd className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[10px]">ESC to close</kbd>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
