import React from 'react';
import { SEO } from '../components/common/SEO';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { AdSlot } from '../components/common/AdSlot';
import { SITE_CONFIG } from '../config/siteConfig';
import { FileText, Shield } from 'lucide-react';

export const TermsConditionsPage: React.FC = () => {
  return (
    <>
      <SEO
        title="Terms & Conditions - ToolNest"
        description="Read the terms and conditions for using ToolNest free online utility tools and services."
        canonicalUrl={`${SITE_CONFIG.baseUrl}/#/terms`}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <Breadcrumbs items={[{ label: 'Terms & Conditions' }]} />

        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
            <FileText className="w-3.5 h-3.5" />
            <span>Usage Guidelines</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Terms & Conditions
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Effective Date: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        <AdSlot type="TopAd" />

        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 space-y-6 text-sm text-slate-600 leading-relaxed shadow-xs">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">1. Acceptance of Terms</h2>
            <p>
              By accessing and using the <strong>ToolNest</strong> website ({SITE_CONFIG.domain}), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this site.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">2. Description of Free Services</h2>
            <p>
              ToolNest provides web-based productivity, image manipulation, text formatting, and calculation tools free of charge. You understand and agree that the services are provided "AS-IS" and that ToolNest assumes no responsibility for timeliness, mis-delivery, or failure to store any user configuration.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">3. Permitted and Prohibited Use</h2>
            <p>
              You agree to use ToolNest only for lawful purposes. You agree not to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Attempt to disrupt, overload, or reverse-engineer the underlying service scripts.</li>
              <li>Use the tools for any illegal or unauthorized purpose under your jurisdiction.</li>
              <li>Automate excessive scraping or bot attacks that degrade site performance for legitimate users.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">4. Intellectual Property</h2>
            <p>
              All branding, original layout designs, code architecture, and trademarks associated with ToolNest are the intellectual property of ToolNest. However, <strong>all files, images, calculations, and text processed through our tools remain 100% your own property</strong>. ToolNest claims zero ownership over files you process.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">5. Limitation of Liability</h2>
            <p>
              In no event shall ToolNest, its creators, or contributors be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use the utility tools.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">6. Modifications to Terms</h2>
            <p>
              ToolNest reserves the right to change or update these Terms & Conditions at any time. Continued use of the website following any changes signifies your acceptance of the updated terms.
            </p>
          </section>
        </div>

        <AdSlot type="ContentAd" />
      </div>
    </>
  );
};
