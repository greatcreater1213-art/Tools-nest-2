import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Copy, Check, ExternalLink, MessageCircle, Download, Sparkles, Send, Phone } from 'lucide-react';

export const WhatsAppLinkGenerator: React.FC = () => {
  const [countryCode, setCountryCode] = useState<string>('1');
  const [phone, setPhone] = useState<string>('5551234567');
  const [message, setMessage] = useState<string>('Hello, I am interested in your products and would like to learn more!');
  const [copied, setCopied] = useState<boolean>(false);

  const qrCanvasRef = useRef<HTMLCanvasElement>(null);

  const COUNTRY_CODES = [
    { name: 'United States (+1)', code: '1' },
    { name: 'United Kingdom (+44)', code: '44' },
    { name: 'India (+91)', code: '91' },
    { name: 'Canada (+1)', code: '1' },
    { name: 'Australia (+61)', code: '61' },
    { name: 'Germany (+49)', code: '49' },
    { name: 'France (+33)', code: '33' },
    { name: 'Brazil (+55)', code: '55' },
    { name: 'Spain (+34)', code: '34' },
    { name: 'Italy (+39)', code: '39' },
    { name: 'Mexico (+52)', code: '52' },
    { name: 'Nigeria (+234)', code: '234' },
    { name: 'Indonesia (+62)', code: '62' },
    { name: 'Pakistan (+92)', code: '92' },
    { name: 'South Africa (+27)', code: '27' },
    { name: 'UAE (+971)', code: '971' },
    { name: 'Saudi Arabia (+966)', code: '966' },
  ];

  const TEMPLATES = [
    'Hello! I would like to inquire about pricing and availability.',
    'Hi! I found your website and wanted to book an appointment.',
    'Hello team, please send me your latest catalogue / service list.',
    'Hi there, I need urgent customer support regarding my order.',
  ];

  // Clean phone number
  const cleanPhone = `${countryCode}${phone.replace(/\D/g, '')}`;
  const encodedMessage = encodeURIComponent(message.trim());
  const generatedLink = cleanPhone.length > 3
    ? `https://wa.me/${cleanPhone}${encodedMessage ? `?text=${encodedMessage}` : ''}`
    : '';

  useEffect(() => {
    if (!qrCanvasRef.current || !generatedLink) return;
    QRCode.toCanvas(qrCanvasRef.current, generatedLink, {
      width: 240,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    }).catch(console.error);
  }, [generatedLink]);

  const handleCopy = async () => {
    if (!generatedLink) return;
    await navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQr = () => {
    if (!qrCanvasRef.current) return;
    const link = document.createElement('a');
    link.download = `whatsapp-qr-${cleanPhone}.png`;
    link.href = qrCanvasRef.current.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Configuration Column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase text-slate-700 tracking-wider">
              1. Phone Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">
                  Country Code
                </label>
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 focus:outline-blue-600"
                >
                  {COUNTRY_CODES.map((c, i) => (
                    <option key={i} value={c.code}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">
                  Phone Number (Without leading zeros)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-sm font-bold text-slate-400">+{countryCode}</span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="555 123 4567"
                    className="w-full bg-white border border-slate-300 rounded-xl pl-16 pr-4 py-2.5 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold uppercase text-slate-500">
                  Pre-filled Message (Optional)
                </label>
                <span className="text-[11px] text-slate-400">{message.length} chars</span>
              </div>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Hi! I would like to..."
                className="w-full bg-white border border-slate-300 rounded-xl p-3 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Quick Templates */}
            <div>
              <span className="text-[11px] font-bold uppercase text-slate-400 block mb-2">
                Quick Message Templates:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {TEMPLATES.map((tmpl, i) => (
                  <button
                    key={i}
                    onClick={() => setMessage(tmpl)}
                    className="text-xs px-2.5 py-1 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-lg text-slate-600 hover:text-emerald-700 transition text-left line-clamp-1"
                  >
                    "{tmpl}"
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Live Link Result */}
          {generatedLink && (
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 space-y-3">
              <span className="text-xs font-bold uppercase text-emerald-800 block">
                Generated WhatsApp wa.me Link
              </span>
              <div className="p-3 bg-white rounded-xl border border-emerald-200 font-mono text-xs text-slate-800 break-all select-all">
                {generatedLink}
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  onClick={handleCopy}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-xs transition flex items-center gap-2"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-200" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Link Copied!' : 'Copy WhatsApp Link'}</span>
                </button>

                <a
                  href={generatedLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs sm:text-sm shadow-xs transition flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Test in WhatsApp</span>
                </a>
              </div>
            </div>
          )}
        </div>

        {/* QR Code Column */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col items-center text-center">
            <span className="text-xs font-bold uppercase text-slate-500 mb-4">
              Scannable WhatsApp QR Code
            </span>

            <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-center">
              <canvas ref={qrCanvasRef} className="max-w-[200px] max-h-[200px]" />
            </div>

            <p className="text-xs text-slate-500 mt-3 max-w-xs">
              Scan with your phone to start a direct WhatsApp chat instantly without saving the number.
            </p>

            <button
              onClick={handleDownloadQr}
              className="mt-4 w-full py-2.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold rounded-xl transition text-xs flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              Download QR Code Image
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
