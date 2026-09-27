import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { 
  Download, 
  Copy, 
  Check, 
  Globe, 
  FileText, 
  Phone, 
  Wifi, 
  MessageSquare, 
  Sliders, 
  Sparkles,
  QrCode as QrIcon
} from 'lucide-react';

type InputType = 'url' | 'text' | 'phone' | 'wifi' | 'whatsapp';

export const QrCodeGenerator: React.FC = () => {
  const [inputType, setInputType] = useState<InputType>('url');
  
  // Inputs
  const [urlVal, setUrlVal] = useState<string>('https://tools-nest-2.toolsnest.workers.dev');
  const [textVal, setTextVal] = useState<string>('');
  const [phoneVal, setPhoneVal] = useState<string>('+1234567890');
  const [waPhone, setWaPhone] = useState<string>('+1234567890');
  const [waMsg, setWaMsg] = useState<string>('Hello! I scanned your QR code.');
  const [wifiSsid, setWifiSsid] = useState<string>('MyHomeWiFi');
  const [wifiPass, setWifiPass] = useState<string>('');
  const [wifiType, setWifiType] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');

  // Customization
  const [fgColor, setFgColor] = useState<string>('#0f172a');
  const [bgColor, setBgColor] = useState<string>('#ffffff');
  const [errorLevel, setErrorLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [qrSize, setQrSize] = useState<number>(400);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Compute Raw String to Encode
  const getPayload = (): string => {
    switch (inputType) {
      case 'url':
        return urlVal.trim();
      case 'text':
        return textVal.trim() || 'ToolNest QR Code';
      case 'phone':
        return `tel:${phoneVal.replace(/\s+/g, '')}`;
      case 'whatsapp': {
        const clean = waPhone.replace(/[^\d+]/g, '');
        const enc = encodeURIComponent(waMsg);
        return `https://wa.me/${clean.replace('+', '')}${enc ? `?text=${enc}` : ''}`;
      }
      case 'wifi':
        return `WIFI:T:${wifiType};S:${wifiSsid};P:${wifiPass};;`;
      default:
        return urlVal;
    }
  };

  const drawQRCode = async () => {
    if (!canvasRef.current) return;
    const payload = getPayload();
    if (!payload) return;

    try {
      await QRCode.toCanvas(canvasRef.current, payload, {
        width: qrSize,
        margin: 2,
        color: {
          dark: fgColor,
          light: bgColor,
        },
        errorCorrectionLevel: errorLevel,
      });
    } catch (err) {
      console.error('QR code generation error:', err);
    }
  };

  useEffect(() => {
    drawQRCode();
  }, [inputType, urlVal, textVal, phoneVal, waPhone, waMsg, wifiSsid, wifiPass, wifiType, fgColor, bgColor, errorLevel, qrSize]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `toolnest-qrcode-${inputType}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyImage = async () => {
    if (!canvasRef.current) return;
    try {
      canvasRef.current.toBlob(async (blob) => {
        if (blob && navigator.clipboard && (window as any).ClipboardItem) {
          const item = new (window as any).ClipboardItem({ 'image/png': blob });
          await navigator.clipboard.write([item]);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }
      });
    } catch (err) {
      console.warn('Clipboard write image not supported in this browser context:', err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Content Type Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 p-1.5 bg-slate-100/90 rounded-2xl">
        <button
          onClick={() => setInputType('url')}
          className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition ${
            inputType === 'url' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Website URL</span>
        </button>

        <button
          onClick={() => setInputType('text')}
          className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition ${
            inputType === 'text' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Plain Text</span>
        </button>

        <button
          onClick={() => setInputType('whatsapp')}
          className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition ${
            inputType === 'whatsapp' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>WhatsApp</span>
        </button>

        <button
          onClick={() => setInputType('phone')}
          className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition ${
            inputType === 'phone' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Phone className="w-4 h-4" />
          <span>Phone Call</span>
        </button>

        <button
          onClick={() => setInputType('wifi')}
          className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition col-span-2 sm:col-span-1 ${
            inputType === 'wifi' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Wifi className="w-4 h-4" />
          <span>WiFi Network</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Data Input & Customization */}
        <div className="lg:col-span-7 space-y-6">
          {/* Input Fields */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase text-slate-700 tracking-wider">
              1. Enter Content
            </h3>

            {inputType === 'url' && (
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">
                  Destination Website URL
                </label>
                <input
                  type="url"
                  value={urlVal}
                  onChange={(e) => setUrlVal(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            )}

            {inputType === 'text' && (
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">
                  Text to Encode
                </label>
                <textarea
                  rows={4}
                  value={textVal}
                  onChange={(e) => setTextVal(e.target.value)}
                  placeholder="Type any message, note, code, or serial number..."
                  className="w-full bg-white border border-slate-300 rounded-xl p-3 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            )}

            {inputType === 'phone' && (
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phoneVal}
                  onChange={(e) => setPhoneVal(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            )}

            {inputType === 'whatsapp' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">
                    WhatsApp Phone Number (with Country Code)
                  </label>
                  <input
                    type="tel"
                    value={waPhone}
                    onChange={(e) => setWaPhone(e.target.value)}
                    placeholder="+1234567890"
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">
                    Pre-filled Message (Optional)
                  </label>
                  <input
                    type="text"
                    value={waMsg}
                    onChange={(e) => setWaMsg(e.target.value)}
                    placeholder="Hello, I would like more information..."
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {inputType === 'wifi' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">
                    Network Name (SSID)
                  </label>
                  <input
                    type="text"
                    value={wifiSsid}
                    onChange={(e) => setWifiSsid(e.target.value)}
                    placeholder="Home_WiFi"
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">
                      Password
                    </label>
                    <input
                      type="text"
                      value={wifiPass}
                      onChange={(e) => setWifiPass(e.target.value)}
                      placeholder="Network Password"
                      className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">
                      Security Type
                    </label>
                    <select
                      value={wifiType}
                      onChange={(e) => setWifiType(e.target.value as any)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      <option value="WPA">WPA / WPA2 / WPA3</option>
                      <option value="WEP">WEP</option>
                      <option value="nopass">No Password (Open)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Styling & Colors */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-blue-600" />
              2. Colors & Resolution
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">
                  Foreground Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-9 h-9 rounded-xl cursor-pointer border border-slate-300"
                  />
                  <input
                    type="text"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">
                  Background Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-9 h-9 rounded-xl cursor-pointer border border-slate-300"
                  />
                  <input
                    type="text"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">
                  Error Correction
                </label>
                <select
                  value={errorLevel}
                  onChange={(e) => setErrorLevel(e.target.value as any)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                >
                  <option value="L">L (7% Recovery)</option>
                  <option value="M">M (15% Standard)</option>
                  <option value="Q">Q (25% High)</option>
                  <option value="H">H (30% Best)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live QR Canvas Preview & Actions */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col items-center text-center shadow-xs">
            <span className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-4">
              Scannable QR Code Preview
            </span>

            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center max-w-[280px] max-h-[280px]">
              <canvas ref={canvasRef} className="max-w-full max-h-full rounded-lg" />
            </div>

            <p className="text-xs text-slate-500 mt-4 max-w-xs">
              Test by pointing any standard smartphone camera app at the preview.
            </p>

            <div className="w-full space-y-2 mt-6">
              <button
                onClick={handleDownload}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 text-sm"
              >
                <Download className="w-4 h-4" />
                Download QR Code (PNG)
              </button>

              <button
                onClick={handleCopyImage}
                className="w-full py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-semibold rounded-xl transition flex items-center justify-center gap-1.5 text-xs"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Image Copied to Clipboard!' : 'Copy Image to Clipboard'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
