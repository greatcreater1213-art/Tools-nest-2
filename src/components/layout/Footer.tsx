import React from 'react';
import { useNavigation } from '../../context/NavigationContext';
import { SITE_CONFIG, TOOLS, CATEGORIES } from '../../config/siteConfig';
import { Sparkles, Shield, Heart, Lock, Zap } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigateTo, navigateTool } = useNavigation();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-20 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-xs">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                Tool<span className="text-blue-400">Nest</span>
              </span>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Free, fast, and 100% private online utility tools for developers, designers, content creators, and students. Process images, text, and data directly inside your browser.
            </p>

            <div className="flex items-center gap-4 text-xs font-semibold text-slate-400 pt-2">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <Lock className="w-3.5 h-3.5" />
                <span>100% Client-Side Privacy</span>
              </div>
              <div className="flex items-center gap-1.5 text-blue-400">
                <Zap className="w-3.5 h-3.5" />
                <span>Zero Server Uploads</span>
              </div>
            </div>
          </div>

          {/* Image & Text Tools */}
          <div>
            <h4 className="text-xs font-bold uppercase text-white tracking-wider mb-4">
              Image & Text Tools
            </h4>
            <ul className="space-y-2.5 text-xs">
              {TOOLS.filter(t => t.category === 'image' || t.category === 'text').slice(0, 6).map(tool => (
                <li key={tool.id}>
                  <button
                    onClick={() => navigateTool(tool.slug)}
                    className="text-slate-400 hover:text-white transition"
                  >
                    {tool.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Math & Generator Tools */}
          <div>
            <h4 className="text-xs font-bold uppercase text-white tracking-wider mb-4">
              Generators & Math
            </h4>
            <ul className="space-y-2.5 text-xs">
              {TOOLS.filter(t => t.category === 'generator' || t.category === 'calculator' || t.category === 'converter').slice(0, 6).map(tool => (
                <li key={tool.id}>
                  <button
                    onClick={() => navigateTool(tool.slug)}
                    className="text-slate-400 hover:text-white transition"
                  >
                    {tool.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company & Legal Links */}
          <div>
            <h4 className="text-xs font-bold uppercase text-white tracking-wider mb-4">
              Company & Legal
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => navigateTo('/about')}
                  className="text-slate-400 hover:text-white transition"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('/contact')}
                  className="text-slate-400 hover:text-white transition"
                >
                  Contact Support
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('/privacy-policy')}
                  className="text-slate-400 hover:text-white transition"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('/terms')}
                  className="text-slate-400 hover:text-white transition"
                >
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('/disclaimer')}
                  className="text-slate-400 hover:text-white transition"
                >
                  Disclaimer
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 mt-10 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} ToolNest. All rights reserved. Free online browser utilities.</p>
          <div className="flex items-center gap-6">
            <button onClick={() => navigateTo('/privacy-policy')} className="hover:text-slate-400 transition">Privacy</button>
            <button onClick={() => navigateTo('/terms')} className="hover:text-slate-400 transition">Terms</button>
            <button onClick={() => navigateTo('/disclaimer')} className="hover:text-slate-400 transition">Disclaimer</button>
            <button onClick={() => navigateTo('/contact')} className="hover:text-slate-400 transition">Contact</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
