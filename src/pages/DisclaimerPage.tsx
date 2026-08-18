import React from 'react';
import { SEO } from '../components/common/SEO';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { AdSlot } from '../components/common/AdSlot';
import { SITE_CONFIG } from '../config/siteConfig';
import { AlertTriangle, Info } from 'lucide-react';

export const DisclaimerPage: React.FC = () => {
  return (
    <>
      <SEO
        title="Disclaimer - ToolNest"
        description="Legal disclaimer regarding the accuracy of calculation tools, third-party advertising, and informational content on ToolNest."
        canonicalUrl={`${SITE_CONFIG.baseUrl}/#/disclaimer`}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <Breadcrumbs items={[{ label: 'Disclaimer' }]} />

        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Important Information</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Disclaimer
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        <AdSlot type="TopAd" />

        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 space-y-6 text-sm text-slate-600 leading-relaxed shadow-xs">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">1. General Information Purpose Only</h2>
            <p>
              The information and calculations provided on <strong>ToolNest</strong> ({SITE_CONFIG.domain}) are for general educational, computational, and productivity purposes only. All tools are provided in good faith; however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, or completeness of any calculated data.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">2. Financial, Mathematical & Technical Calculations</h2>
            <p>
              While our percentage calculators, unit converters, and mathematical algorithms are built against standard formulas, they should not be used as the sole basis for high-stakes engineering, legal, medical, or accounting determinations without secondary professional verification.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">3. Third-Party Links and Advertisements</h2>
            <p>
              ToolNest may contain links to other websites or content belonging to or originating from third parties, as well as banner advertisements. Such external links are not investigated, monitored, or checked for accuracy, adequacy, or completeness by us.
            </p>
            <p>
              We do not warrant, endorse, guarantee, or assume responsibility for the accuracy or reliability of any information offered by third-party websites linked through our platform.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">4. Password Security Best Practices</h2>
            <p>
              Our Password Generator utilizes standard browser-native Cryptographically Secure Pseudorandom Number Generation (CSPRNG via <code>crypto.getRandomValues</code>). However, maintaining safe password hygiene, enabling Multi-Factor Authentication (2FA), and using reputable password managers remains the user's sole responsibility.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">5. "Use at Your Own Risk"</h2>
            <p>
              Your use of ToolNest and your reliance on any tools or information on the site is solely at your own risk. ToolNest and its developers shall not be held liable for any damages resulting from tool usage.
            </p>
          </section>
        </div>

        <AdSlot type="ContentAd" />
      </div>
    </>
  );
};
