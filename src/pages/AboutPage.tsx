import React from 'react';
import { SEO } from '../components/common/SEO';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { AdSlot } from '../components/common/AdSlot';
import { SITE_CONFIG } from '../config/siteConfig';
import { ShieldCheck, Zap, Lock, Heart, Users, Sparkles } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <>
      <SEO
        title="About Us - ToolNest | Free Client-Side Utilities"
        description="Learn more about ToolNest's mission to provide fast, completely free, and 100% private online utilities without server uploads."
        canonicalUrl={`${SITE_CONFIG.baseUrl}/#/about`}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <Breadcrumbs items={[{ label: 'About Us' }]} />

        <div className="space-y-4 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Our Mission</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            About ToolNest
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            We build lightning-fast, high-privacy web utilities designed to solve daily tasks without signups, subscriptions, or invasive server uploads.
          </p>
        </div>

        <AdSlot type="TopAd" />

        {/* Content Body */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 space-y-8 shadow-xs">
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Why We Created ToolNest
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Every day, millions of students, software engineers, content creators, and remote professionals need simple tasks done: converting an image to PNG, calculating percentages, generating a secure WiFi QR code, or trimming whitespace from formatted code.
            </p>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Unfortunately, the modern web is filled with bloated websites requiring account registrations, paywalls, slow cloud uploads, and trackers that log personal data. <strong>ToolNest was built to change that.</strong>
            </p>
          </div>

          {/* Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">100% Client-Side Privacy</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                All image compression, text conversion, and password generation runs locally on your device's browser memory. Your files are never stored or uploaded.
              </p>
            </div>

            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Instant Execution</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Because data doesn't travel across remote servers, conversions and calculations happen in single-digit milliseconds.
              </p>
            </div>

            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Always Free</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                No credit cards, no premium tiers, no limits on how many times you can compress images or generate QR codes.
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Technology Stack
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              ToolNest is built with modern, ultra-lightweight web standards: React 19, TypeScript, Tailwind CSS, HTML5 Canvas, Web Cryptography API, and optimized static asset delivery on edge CDNs for instantaneous global access.
            </p>
          </div>
        </div>

        <AdSlot type="ContentAd" />
      </div>
    </>
  );
};
