import React, { useState } from 'react';
import { SEO } from '../components/common/SEO';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { AdSlot } from '../components/common/AdSlot';
import { SITE_CONFIG } from '../config/siteConfig';
import { Mail, MessageSquare, Send, CheckCircle2, Sparkles, HelpCircle } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Feedback / Tool Suggestion');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    // In static client-side mode, acknowledge receipt
    setSubmitted(true);
  };

  return (
    <>
      <SEO
        title="Contact Us - ToolNest Support & Feedback"
        description="Get in touch with the ToolNest team for support, tool suggestions, bug reports, and general feedback."
        canonicalUrl={`${SITE_CONFIG.baseUrl}/#/contact`}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <Breadcrumbs items={[{ label: 'Contact Us' }]} />

        <div className="space-y-4 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
            <Mail className="w-3.5 h-3.5" />
            <span>Get in Touch</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Contact Support & Feedback
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            Have a suggestion for a new utility tool or noticed an issue? We'd love to hear from you.
          </p>
        </div>

        <AdSlot type="TopAd" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Form Column */}
          <div className="md:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
            {submitted ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Message Received!</h3>
                <p className="text-sm text-slate-600 max-w-sm mx-auto">
                  Thank you for reaching out. Our development team reviews user feedback and tool requests regularly.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setMessage(''); }}
                  className="px-5 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Johnson"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@example.com"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                    Topic / Subject
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Feedback / Tool Suggestion">New Tool Suggestion</option>
                    <option value="Bug Report">Bug Report / Technical Issue</option>
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Advertising / Partnership">Advertising & Sponsorship</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                    Message Details
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your suggestion or feedback in detail..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-2 text-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>

          {/* Info Column */}
          <div className="md:col-span-5 space-y-6">
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-600" />
                Quick Support FAQ
              </h3>
              <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
                <p>
                  <strong>Do you charge for tool requests?</strong>
                  <br />No, we are open to community feedback and routinely add new utilities requested by users free of charge.
                </p>
                <p>
                  <strong>Where can I report a broken tool?</strong>
                  <br />Please select "Bug Report" in the form above and mention your device/browser type (e.g. Chrome on Windows or Safari on iPhone).
                </p>
              </div>
            </div>

            <div className="bg-blue-50/70 border border-blue-200 rounded-3xl p-6 space-y-2">
              <span className="text-xs font-bold uppercase text-blue-700 tracking-wider">
                Direct Contact
              </span>
              <p className="text-sm font-semibold text-slate-800">
                Email:{' '}
                <a href={`mailto:${SITE_CONFIG.supportEmail}`} className="text-blue-600 hover:underline">
                  {SITE_CONFIG.supportEmail}
                </a>
              </p>
              <p className="text-xs text-slate-500">
                Typical response time: within 24–48 business hours.
              </p>
            </div>
          </div>
        </div>

        <AdSlot type="ContentAd" />
      </div>
    </>
  );
};
