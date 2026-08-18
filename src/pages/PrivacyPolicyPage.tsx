import React from 'react';
import { SEO } from '../components/common/SEO';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { AdSlot } from '../components/common/AdSlot';
import { SITE_CONFIG } from '../config/siteConfig';
import { ShieldCheck, Lock, EyeOff } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <>
      <SEO
        title="Privacy Policy - ToolNest"
        description="Read ToolNest's privacy policy. Learn how our client-side processing guarantees your data, files, and images are never collected or stored on remote servers."
        canonicalUrl={`${SITE_CONFIG.baseUrl}/#/privacy-policy`}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <Breadcrumbs items={[{ label: 'Privacy Policy' }]} />

        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
            <Lock className="w-3.5 h-3.5" />
            <span>Zero Server Storage</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        <AdSlot type="TopAd" />

        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 space-y-6 text-sm text-slate-600 leading-relaxed shadow-xs">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">1. Overview & Commitment to Privacy</h2>
            <p>
              At <strong>ToolNest</strong> ({SITE_CONFIG.domain}), the privacy of our visitors is of paramount importance. This Privacy Policy document outlines the types of personal information received and collected by ToolNest and how it is used.
            </p>
            <p>
              Our defining core architectural principle is that <strong>all file processing, image compression, conversions, text calculations, and password generations are executed entirely within your client-side browser memory</strong>. We do not transmit or store your processed data on our servers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">2. Information We DO NOT Collect</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>We <strong>do not</strong> upload or store images you compress or convert (JPG, PNG, WebP).</li>
              <li>We <strong>do not</strong> log, transmit, or record passwords or QR codes generated with our tools.</li>
              <li>We <strong>do not</strong> collect personal contact lists, WhatsApp numbers, or text messages entered into converters.</li>
              <li>We <strong>do not</strong> require user account creation, emails, or phone numbers for utility usage.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">3. Log Files & Standard Web Analytics</h2>
            <p>
              Like many other websites, ToolNest may use standard web server log files and analytics tools (such as Google Analytics) to understand aggregated traffic patterns, popular tools, browser types, internet service providers (ISPs), referring/exit pages, and number of clicks. This data is not linked to any information that is personally identifiable.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">4. Cookies and Advertising Partners</h2>
            <p>
              ToolNest may display advertising provided by third-party advertising networks (e.g. Adsterra or Google AdSense) to keep all utility tools 100% free for users worldwide.
            </p>
            <p>
              Third-party ad servers or ad networks use technologies like cookies, JavaScript, or Web Beacons in their respective advertisements and links that appear on ToolNest. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see.
            </p>
            <p>
              ToolNest has no access to or control over these cookies that are used by third-party advertisers. You may disable cookies through your individual browser options.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">5. GDPR & CCPA Compliance</h2>
            <p>
              Under California Consumer Privacy Act (CCPA) and European General Data Protection Regulation (GDPR), users have the right to know what data is collected. Because ToolNest does not collect, sell, or store personal files or user-identifying data, your rights to data erasure and privacy are inherently protected by design.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">6. Contact Information</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:{' '}
              <a href={`mailto:${SITE_CONFIG.supportEmail}`} className="text-blue-600 font-semibold hover:underline">
                {SITE_CONFIG.supportEmail}
              </a>
            </p>
          </section>
        </div>

        <AdSlot type="ContentAd" />
      </div>
    </>
  );
};
