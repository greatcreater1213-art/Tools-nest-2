import React from 'react';
import { TOOLS } from '../../config/siteConfig';
import { ToolLayout } from '../common/ToolLayout';
import { ImageCompressor } from './ImageCompressor';
import { ImageResizer } from './ImageResizer';
import { JpgToPngConverter } from './JpgToPngConverter';
import { PngToJpgConverter } from './PngToJpgConverter';
import { WordCounter } from './WordCounter';
import { CharacterCounter } from './CharacterCounter';
import { PercentageCalculator } from './PercentageCalculator';
import { QrCodeGenerator } from './QrCodeGenerator';
import { PasswordGenerator } from './PasswordGenerator';
import { TextCaseConverter } from './TextCaseConverter';
import { RemoveExtraSpaces } from './RemoveExtraSpaces';
import { WhatsAppLinkGenerator } from './WhatsAppLinkGenerator';
import { ColorPicker } from './ColorPicker';
import { UnitConverter } from './UnitConverter';
import { AgeCalculator } from './AgeCalculator';
import { PdfToJpg } from './PdfToJpg';
import { JpgToPdf } from './JpgToPdf';
import { MergePdf } from './MergePdf';
import { CompressPdf } from './CompressPdf';
import { ImageCropper } from './ImageCropper';
import { JsonFormatter } from './JsonFormatter';
import { UrlEncoderDecoder } from './UrlEncoderDecoder';
import { BmiCalculator } from './BmiCalculator';
import { DiscountCalculator } from './DiscountCalculator';
import { DateDifferenceCalculator } from './DateDifferenceCalculator';
import { useNavigation } from '../../context/NavigationContext';
import { AlertCircle, ArrowLeft } from 'lucide-react';

interface ToolRendererProps {
  slug: string;
}

export const ToolRenderer: React.FC<ToolRendererProps> = ({ slug }) => {
  const { navigateTo } = useNavigation();
  const tool = TOOLS.find(t => t.slug === slug);

  if (!tool) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Tool Not Found</h1>
        <p className="text-slate-500 mb-6">
          The tool you are looking for does not exist or has been moved.
        </p>
        <button
          onClick={() => navigateTo('/all-tools')}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl inline-flex items-center gap-2 shadow-xs transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Browse All Available Tools
        </button>
      </div>
    );
  }

  const renderToolComponent = () => {
    switch (tool.slug) {
      case 'image-compressor':
        return <ImageCompressor />;
      case 'image-resizer':
        return <ImageResizer />;
      case 'jpg-to-png':
        return <JpgToPngConverter />;
      case 'png-to-jpg':
        return <PngToJpgConverter />;
      case 'word-counter':
        return <WordCounter />;
      case 'character-counter':
        return <CharacterCounter />;
      case 'percentage-calculator':
        return <PercentageCalculator />;
      case 'qr-code-generator':
        return <QrCodeGenerator />;
      case 'password-generator':
        return <PasswordGenerator />;
      case 'text-case-converter':
        return <TextCaseConverter />;
      case 'remove-extra-spaces':
        return <RemoveExtraSpaces />;
      case 'whatsapp-link-generator':
        return <WhatsAppLinkGenerator />;
      case 'color-picker':
        return <ColorPicker />;
      case 'unit-converter':
        return <UnitConverter />;
      case 'age-calculator':
        return <AgeCalculator />;
      case 'pdf-to-jpg':
        return <PdfToJpg />;
      case 'jpg-to-pdf':
        return <JpgToPdf />;
      case 'merge-pdf':
        return <MergePdf />;
      case 'compress-pdf':
        return <CompressPdf />;
      case 'image-cropper':
        return <ImageCropper />;
      case 'json-formatter':
        return <JsonFormatter />;
      case 'url-encoder-decoder':
        return <UrlEncoderDecoder />;
      case 'bmi-calculator':
        return <BmiCalculator />;
      case 'discount-calculator':
        return <DiscountCalculator />;
      case 'date-difference':
        return <DateDifferenceCalculator />;
      default:
        return <div>Tool coming soon...</div>;
    }
  };

  return <ToolLayout tool={tool}>{renderToolComponent()}</ToolLayout>;
};
