import React, { ReactNode, useState } from 'react';
import { ToolItem } from '../../types';
import { useNavigation } from '../../context/NavigationContext';
import { TOOLS } from '../../config/siteConfig';
import { SEO } from './SEO';
import { Breadcrumbs } from './Breadcrumbs';
import { AdSlot } from './AdSlot';
import { IconHelper } from './IconHelper';
import { 
  ShieldCheck, 
  Zap, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Share2, 
  Check, 
  ArrowRight,
  Sparkles,
  BookOpen
} from 'lucide-react';

interface ToolLayoutProps {
  tool: ToolItem;
  children: ReactNode;
}

export const ToolLayout: React.FC<ToolLayoutProps> = ({ tool, children }) => {
  const { navigateTool, navigateTo } = useNavigation();
  const [openFaqIndices, setOpenFaqIndices] = useState<number[]>([0]);
  const [copiedLink, setCopiedLink] = useState(false);

  const toggleFaq = (index: number) => {
    setOpenFaqIndices(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const handleShare = async () => {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // Structured schema for Google Rich Results
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.name,
    operatingSystem: 'All',
    applicationCategory: 'UtilitiesApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description: tool.metaDescription,
    url: window.location.href,
  };

  const relatedTools = TOOLS.filter(t => tool.relatedToolSlugs.includes(t.slug) || (t.category === tool.category && t.id !== tool.id)).slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <SEO
        title={tool.metaTitle}
        description={tool.metaDescription}
        schema={schema}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6">
        <Breadcrumbs
          items={[
            { label: tool.categoryName, href: `/all-tools?category=${tool.category}` },
            { label: tool.name, active: true },
          ]}
        />

        {/* Tool Header */}
        <header className="mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/10 text-blue-600 flex items-center justify-center shadow-xs border border-blue-100">
                <IconHelper name={tool.icon} className="w-6 h-6" />
              </div>
              <div>
                <span className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 mb-1">
                  {tool.categoryName} • 100% Free
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {tool.name}
                </h1>
              </div>
            </div>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-blue-600 transition shadow-xs"
              title="Share this tool link"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              <span>{copiedLink ? 'Link Copied!' : 'Share Tool'}</span>
            </button>
          </div>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-3xl">
            {tool.fullDescription}
          </p>

          {/* Privacy & Speed Pills */}
          <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              100% Private (Runs locally in browser)
            </span>
            <span className="inline-flex items-center gap-1 text-blue-700 font-medium">
              <Zap className="w-4 h-4 text-blue-600" />
              No signup required
            </span>
          </div>
        </header>

        {/* Top Ad Container */}
        <AdSlot type="ToolTopAd" />

        {/* Main Interactive Tool Workspace */}
        <main className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 sm:p-6 md:p-8 mb-8">
          {children}
        </main>

        {/* Bottom Ad Container */}
        <AdSlot type="ToolBottomAd" />

        {/* How to Use Section */}
        <section className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 mb-8 shadow-xs">
          <div className="flex items-center gap-2 mb-4 text-slate-900 font-bold text-lg">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <h2>How to Use {tool.name}</h2>
          </div>
          <ol className="space-y-3">
            {tool.howToUse.map((step, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm sm:text-base text-slate-700">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* Key Features Section */}
        <section className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 mb-8 shadow-xs">
          <div className="flex items-center gap-2 mb-4 text-slate-900 font-bold text-lg">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <h2>Key Features & Benefits</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {tool.features.map((feat, idx) => (
              <div key={idx} className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-sm text-slate-800">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </section>

        {/* SEO FAQs Accordion */}
        {tool.faqs.length > 0 && (
          <section className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 mb-8 shadow-xs">
            <div className="flex items-center gap-2 mb-6 text-slate-900 font-bold text-lg">
              <HelpCircle className="w-5 h-5 text-blue-600" />
              <h2>Frequently Asked Questions</h2>
            </div>
            <div className="space-y-3">
              {tool.faqs.map((faq, index) => {
                const isOpen = openFaqIndices.includes(index);
                return (
                  <div
                    key={index}
                    className="border border-slate-200 rounded-xl overflow-hidden transition"
                  >
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full px-5 py-4 text-left font-medium text-slate-900 bg-slate-50 hover:bg-slate-100/80 flex items-center justify-between gap-4 transition"
                      aria-expanded={isOpen}
                    >
                      <span className="text-sm sm:text-base font-semibold">{faq.question}</span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-5 py-4 bg-white text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Related Tools Grid */}
        {relatedTools.length > 0 && (
          <section className="mt-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900">Explore Related Utilities</h2>
              <button
                onClick={() => navigateTo('/all-tools')}
                className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                View all tools <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedTools.map(rel => (
                <div
                  key={rel.id}
                  onClick={() => navigateTool(rel.slug)}
                  className="bg-white border border-slate-200 rounded-xl p-4 hover:border-blue-500 hover:shadow-md transition cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-2.5">
                      <IconHelper name={rel.icon} className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm mb-1">{rel.name}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2">{rel.shortDescription}</p>
                  </div>
                  <span className="mt-3 text-xs font-semibold text-blue-600 flex items-center gap-1">
                    Open Tool <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
