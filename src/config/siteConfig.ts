import { ToolItem, CategoryInfo, ToolCategory } from '../types';

export const SITE_CONFIG = {
  name: 'ToolNest',
  tagline: 'Free Online AI & Utility Tools for Everyday Tasks',
  description: 'Fast, secure, and 100% browser-based utility tools. Compress images, generate QR codes, calculate percentages, format text, and convert units directly in your browser without uploading files to any server.',
  url: 'https://toolnest.pages.dev',
  baseUrl: 'https://toolnest.pages.dev',
  domain: 'toolnest.pages.dev',
  author: 'ToolNest Team',
  contactEmail: 'support@toolnest.pages.dev',
  supportEmail: 'support@toolnest.pages.dev',
  // Placeholders for configuration
  googleAnalyticsId: '', // e.g. "G-XXXXXXXXXX"
  googleSearchConsoleVerification: '', // e.g. "google-site-verification token"
  adsterraConfig: {
    enabled: true,
    note: 'Replace slot placeholders with Adsterra banner or native banner snippet codes.',
  },
};

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'image',
    name: 'Image Tools',
    description: 'Compress, resize, and convert image formats with zero quality loss.',
    icon: 'ImageIcon',
    color: 'from-blue-500 to-indigo-600',
  },
  {
    id: 'text',
    name: 'Text & Content',
    description: 'Analyze word counts, clean whitespace, and transform text cases instantly.',
    icon: 'FileText',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'calculator',
    name: 'Calculators',
    description: 'Precise financial, age, and percentage calculators with instant step breakdowns.',
    icon: 'Calculator',
    color: 'from-amber-500 to-orange-600',
  },
  {
    id: 'generator',
    name: 'Generators',
    description: 'Create high-resolution QR codes, secure passwords, and WhatsApp click-to-chat links.',
    icon: 'Sparkles',
    color: 'from-purple-500 to-pink-600',
  },
  {
    id: 'converter',
    name: 'Converters & Pickers',
    description: 'Convert units across length, weight, storage, and explore color codes effortlessly.',
    icon: 'RefreshCw',
    color: 'from-cyan-500 to-blue-600',
  },
];

export const TOOLS: ToolItem[] = [
  // 1. Image Compressor
  {
    id: 'image-compressor',
    slug: 'image-compressor',
    name: 'Image Compressor',
    category: 'image',
    categoryName: 'Image Tools',
    shortDescription: 'Compress JPG, PNG, and WebP images in your browser with real-time file size savings.',
    fullDescription: 'Optimize and reduce image file sizes drastically without sacrificing visual sharpness. Uses client-side HTML5 Canvas resampling and compression algorithms so your private photos never leave your device.',
    icon: 'Minimize2',
    keywords: ['image compressor', 'compress jpg', 'reduce png size', 'compress webp', 'photo optimizer', 'compress photo online'],
    popular: true,
    metaTitle: 'Free Image Compressor Online - Compress JPG, PNG, WebP Fast | ToolNest',
    metaDescription: 'Compress JPG, JPEG, PNG, and WebP images online for free. Reduce file size up to 85% without quality loss. 100% private, browser-based compression.',
    howToUse: [
      'Click or drag and drop your image (JPG, PNG, or WebP) into the upload area.',
      'Adjust the compression quality slider to balance image quality and file size reduction.',
      'Optionally reduce image max dimensions if you want extra file size savings.',
      'Compare original vs compressed file size and percentage saved.',
      'Click "Download Compressed Image" to save your optimized file immediately.'
    ],
    features: [
      '100% Client-Side: Your photos are never uploaded to any remote server',
      'Supports JPG, JPEG, PNG, and WebP formats',
      'Live before/after file size comparison and compression ratio display',
      'Custom quality level and max dimension controls',
      'Instant one-click high-speed download'
    ],
    faqs: [
      {
        question: 'Is it safe to compress private or sensitive images here?',
        answer: 'Yes, 100%! All compression happens entirely inside your browser using JavaScript and HTML5 Canvas. Your images are never sent or stored on any server.'
      },
      {
        question: 'What is the recommended quality level for web images?',
        answer: 'A quality setting between 70% and 85% typically reduces file size by 60-80% with virtually zero noticeable loss in visual clarity on screens.'
      },
      {
        question: 'Can I compress multiple formats like PNG and WebP?',
        answer: 'Yes, ToolNest Image Compressor seamlessly processes JPG, PNG, and WebP images with full color fidelity.'
      }
    ],
    relatedToolSlugs: ['image-resizer', 'jpg-to-png', 'png-to-jpg']
  },

  // 2. Image Resizer
  {
    id: 'image-resizer',
    slug: 'image-resizer',
    name: 'Image Resizer',
    category: 'image',
    categoryName: 'Image Tools',
    shortDescription: 'Resize photos to exact width and height pixels or percentages while preserving aspect ratio.',
    fullDescription: 'Quickly resize pictures for social media, email attachments, website banners, or print. Lock aspect ratios, select social media resolution presets, and choose output format.',
    icon: 'Maximize2',
    keywords: ['image resizer', 'resize picture', 'change image dimensions', 'photo resizer online', 'scale image'],
    popular: true,
    metaTitle: 'Free Online Image Resizer - Resize Photo Dimensions in Pixels | ToolNest',
    metaDescription: 'Resize photos and graphics online for free. Custom width/height, aspect ratio lock, and social media presets. High quality output with zero server uploads.',
    howToUse: [
      'Upload any photo or graphic from your device.',
      'Enter your desired width and height in pixels or select a pre-made social media preset.',
      'Toggle the "Maintain Aspect Ratio" lock to prevent image distortion.',
      'Select your preferred output format (PNG, JPG, or WebP).',
      'Download your resized image in high resolution.'
    ],
    features: [
      'Pixel-perfect precision and percentage scaling',
      'Smart Aspect Ratio lock to prevent unwanted stretching',
      'Social media presets (Instagram, YouTube, Twitter/X, Facebook)',
      'High-quality bicubic canvas interpolation',
      'Choose output format: PNG, JPG, or WebP'
    ],
    faqs: [
      {
        question: 'Will resizing degrade my image quality?',
        answer: 'Downscaling reduces pixel count while maintaining crispness. Upscaling small images significantly beyond their original size may appear softer, but our bicubic algorithm preserves as much detail as possible.'
      },
      {
        question: 'How do I keep my image from looking squished or stretched?',
        answer: 'Keep the "Maintain Aspect Ratio" checkbox checked. When you change width, height automatically calculates proportionally.'
      }
    ],
    relatedToolSlugs: ['image-compressor', 'jpg-to-png', 'png-to-jpg']
  },

  // 3. JPG to PNG Converter
  {
    id: 'jpg-to-png',
    slug: 'jpg-to-png',
    name: 'JPG to PNG Converter',
    category: 'image',
    categoryName: 'Image Tools',
    shortDescription: 'Convert JPG / JPEG photos into lossless PNG format with transparent alpha channel support.',
    fullDescription: 'Convert JPG images to high-fidelity PNG format right inside your browser. Perfect for graphic design, web development, and preserving sharp text edges without compression artifacts.',
    icon: 'FileImage',
    keywords: ['jpg to png', 'convert jpeg to png', 'jpg converter', 'image to png format'],
    popular: false,
    metaTitle: 'Free JPG to PNG Converter Online - Fast & Lossless | ToolNest',
    metaDescription: 'Convert JPG and JPEG files to PNG format online for free. 100% private, instant browser conversion with lossless quality output.',
    howToUse: [
      'Select or drop your JPG or JPEG file into the upload zone.',
      'The file is automatically processed and rendered into high-definition PNG format.',
      'Preview the converted image and file properties.',
      'Click "Download PNG" to save the file to your computer or phone.'
    ],
    features: [
      'Instant conversion in seconds',
      'Lossless PNG color and pixel representation',
      'Zero quality degradation',
      'No email or signup required'
    ],
    faqs: [
      {
        question: 'Why should I convert JPG to PNG?',
        answer: 'PNG uses lossless compression, making it ideal for graphics with text, logos, screenshots, or when you plan to edit the image repeatedly without losing quality.'
      }
    ],
    relatedToolSlugs: ['png-to-jpg', 'image-compressor', 'image-resizer']
  },

  // 4. PNG to JPG Converter
  {
    id: 'png-to-jpg',
    slug: 'png-to-jpg',
    name: 'PNG to JPG Converter',
    category: 'image',
    categoryName: 'Image Tools',
    shortDescription: 'Convert PNG graphics to lightweight JPG format with custom background color fill for transparent areas.',
    fullDescription: 'Easily convert transparent or large PNG images to standard JPG format. Choose background color replacement (white, black, or custom) to avoid dark backgrounds on transparent graphics, and adjust output quality.',
    icon: 'FileCode',
    keywords: ['png to jpg', 'convert png to jpeg', 'png converter', 'transparent png to jpg'],
    popular: false,
    metaTitle: 'Free PNG to JPG Converter Online - High Quality JPEG | ToolNest',
    metaDescription: 'Convert PNG images to JPG/JPEG format online for free. Custom background color for transparent images and adjustable quality. Fast and private.',
    howToUse: [
      'Upload your PNG image.',
      'Pick a background color for transparent pixels (default is crisp pure white).',
      'Set your preferred JPG quality level.',
      'Click "Download JPG" to retrieve your converted image.'
    ],
    features: [
      'Custom background color selector for transparency handling',
      'Adjustable JPEG compression quality (1-100%)',
      'Drastic file size savings for web publishing',
      'Private client-side rendering'
    ],
    faqs: [
      {
        question: 'Why does my transparent PNG need a background color in JPG?',
        answer: 'The JPG format does not support transparency. ToolNest lets you select a clean background color (such as white) so transparent areas blend seamlessly.'
      }
    ],
    relatedToolSlugs: ['jpg-to-png', 'image-compressor', 'image-resizer']
  },

  // 5. Word Counter
  {
    id: 'word-counter',
    slug: 'word-counter',
    name: 'Word Counter',
    category: 'text',
    categoryName: 'Text & Content',
    shortDescription: 'Count words, characters, sentences, paragraphs, reading time, and analyze keyword density in real-time.',
    fullDescription: 'Comprehensive text metric analyzer for writers, students, bloggers, and SEO professionals. Provides live counts of words, characters (with and without spaces), sentences, paragraphs, estimated reading/speaking times, and top keyword frequencies.',
    icon: 'Type',
    keywords: ['word counter', 'character count', 'sentence counter', 'reading time calculator', 'word frequency', 'text length checker'],
    popular: true,
    metaTitle: 'Free Online Word Counter - Count Words, Characters & Sentences | ToolNest',
    metaDescription: 'Count words, characters, sentences, paragraphs, reading time and keyword density online in real time. Perfect for essays, articles, and social posts.',
    howToUse: [
      'Type or paste your text into the text area (or load a sample text / .txt file).',
      'View real-time statistics update as you type.',
      'Check reading time, speaking time, and keyword density breakdown.',
      'Use the Copy or Clear buttons to manage your text content.'
    ],
    features: [
      'Real-time live updates as you type or paste',
      'Words, characters with & without spaces, sentences, paragraphs',
      'Estimated reading time (200 wpm) and speaking time (130 wpm)',
      'Keyword density frequency table',
      'Clean interface with copy and clear tools'
    ],
    faqs: [
      {
        question: 'How is reading time calculated?',
        answer: 'Reading time is calculated based on the average adult reading speed of 200 words per minute (WPM), and speaking time is based on 130 WPM.'
      },
      {
        question: 'Is there a limit on how much text I can paste?',
        answer: 'No! Because ToolNest runs directly in your browser, you can paste tens of thousands of words with zero lag.'
      }
    ],
    relatedToolSlugs: ['character-counter', 'text-case-converter', 'remove-extra-spaces']
  },

  // 6. Character Counter
  {
    id: 'character-counter',
    slug: 'character-counter',
    name: 'Character Counter',
    category: 'text',
    categoryName: 'Text & Content',
    shortDescription: 'Live character counter with custom limit targets for Twitter/X, meta descriptions, and SMS.',
    fullDescription: 'Precision character counting tool tailored for social media managers, copywriters, and developers. Set character limits to ensure your text fits within strict platform constraints (e.g. 280 characters for Twitter/X, 160 characters for SEO meta descriptions).',
    icon: 'Hash',
    keywords: ['character counter', 'letter counter', 'twitter character counter', 'count characters online', 'string length'],
    popular: false,
    metaTitle: 'Free Character Counter Online - Live Letter & Space Counter | ToolNest',
    metaDescription: 'Count characters with and without spaces, words, lines, and check limits for Twitter, Meta descriptions, and SMS in real time.',
    howToUse: [
      'Paste or write your text into the editor.',
      'Select a platform preset limit (like Twitter 280 chars, Meta Description 160 chars) or enter a custom limit.',
      'Monitor the live progress bar and remaining character countdown.',
      'Copy your finalized text with a single click.'
    ],
    features: [
      'Instant character count (with & without spaces)',
      'Pre-configured presets: Twitter/X (280), Meta Description (160), SMS (160), Instagram Bio (150)',
      'Live visual percentage gauge and remaining character alert',
      'Breakdown of letters, digits, spaces, and punctuation marks'
    ],
    faqs: [
      {
        question: 'What is the ideal length for an SEO Meta Description?',
        answer: 'Most search engines truncate meta descriptions after 155–160 characters. ToolNest helps you craft the optimal length.'
      }
    ],
    relatedToolSlugs: ['word-counter', 'text-case-converter', 'remove-extra-spaces']
  },

  // 7. Percentage Calculator
  {
    id: 'percentage-calculator',
    slug: 'percentage-calculator',
    name: 'Percentage Calculator',
    category: 'calculator',
    categoryName: 'Calculators',
    shortDescription: 'Calculate percentages, percentage increases/decreases, and what percentage X is of Y with step formulas.',
    fullDescription: 'All-in-one multi-mode percentage calculator. Quickly solve percentage of a number, percentage changes (discounts, markups, growth rates), and ratio percentages with transparent step-by-step mathematical explanations.',
    icon: 'Percent',
    keywords: ['percentage calculator', 'calculate percentage', 'percent increase calculator', 'discount calculator', 'percentage difference'],
    popular: true,
    metaTitle: 'Free Percentage Calculator - Calculate %, Increase, Decrease Online | ToolNest',
    metaDescription: 'Fast and accurate percentage calculator. Calculate percentage of a value, percentage change/growth, and discounts with step-by-step formulas.',
    howToUse: [
      'Select your calculation type from the interactive tabs.',
      'Enter the values in the input boxes.',
      'The calculation and formatted result appear instantly.',
      'Read the clear step-by-step math breakdown below the answer.'
    ],
    features: [
      'Mode 1: What is X% of Y?',
      'Mode 2: What percentage is X of Y?',
      'Mode 3: Percentage Increase / Decrease from X to Y',
      'Mode 4: Add or Subtract X% to/from Y (Tax & Discounts)',
      'Clear step-by-step formula explanations'
    ],
    faqs: [
      {
        question: 'How do you calculate percentage increase?',
        answer: 'Subtract the original value from the new value, divide the difference by the original value, and multiply by 100: ((New - Old) / Old) * 100.'
      }
    ],
    relatedToolSlugs: ['age-calculator', 'unit-converter']
  },

  // 8. QR Code Generator
  {
    id: 'qr-code-generator',
    slug: 'qr-code-generator',
    name: 'QR Code Generator',
    category: 'generator',
    categoryName: 'Generators',
    shortDescription: 'Generate custom QR codes for URLs, text, phone numbers, WhatsApp, WiFi, and vCards with instant PNG download.',
    fullDescription: 'Create high-resolution, scannable QR codes for websites, contact cards, WiFi network credentials, phone calls, and plain text. Customize foreground and background colors, dimensions, and error correction levels.',
    icon: 'QrCode',
    keywords: ['qr code generator', 'create qr code', 'free qr maker', 'wifi qr code', 'custom qr code online', 'download qr png'],
    popular: true,
    metaTitle: 'Free QR Code Generator Online - Create Custom QR Codes | ToolNest',
    metaDescription: 'Generate high-resolution custom QR codes for URLs, text, phone, WiFi, and WhatsApp. Free, no expiration, customizable colors, and instant PNG download.',
    howToUse: [
      'Choose your content type (URL, Plain Text, Phone, WhatsApp, WiFi, or vCard).',
      'Enter your information in the designated fields.',
      'Customize colors, quiet zone margins, and size.',
      'Preview the live QR code in real-time and test scanning with your mobile phone.',
      'Click "Download QR Code (PNG)" or "Copy Image".'
    ],
    features: [
      'Supports URLs, Text, Phones, WhatsApp, WiFi network setup, and vCard contacts',
      'Custom foreground and background color pickers',
      'High-resolution output up to 1000px',
      'Configurable Error Correction (L, M, Q, H)',
      'Permanent QR codes that never expire'
    ],
    faqs: [
      {
        question: 'Do these QR codes ever expire?',
        answer: 'No! The QR codes generated by ToolNest are static QR codes. They encode the raw data directly into the pixel matrix and will work forever without expiration.'
      },
      {
        question: 'Can I use these QR codes for commercial projects and print flyers?',
        answer: 'Yes, all generated QR codes are 100% free for both personal and commercial use.'
      }
    ],
    relatedToolSlugs: ['whatsapp-link-generator', 'password-generator', 'color-picker']
  },

  // 9. Password Generator
  {
    id: 'password-generator',
    slug: 'password-generator',
    name: 'Password Generator',
    category: 'generator',
    categoryName: 'Generators',
    shortDescription: 'Generate secure, cryptographically random passwords with customizable length, symbols, and entropy strength meter.',
    fullDescription: 'Protect your online accounts with unbreakable passwords generated using your browser’s native Cryptography API (crypto.getRandomValues). Configure length, uppercase, lowercase, digits, symbols, and exclude ambiguous characters like 0/O and 1/l/I.',
    icon: 'KeyRound',
    keywords: ['password generator', 'random password', 'secure password maker', 'strong password generator', 'crypto password'],
    popular: true,
    metaTitle: 'Free Secure Password Generator Online - Cryptographically Strong | ToolNest',
    metaDescription: 'Generate secure, random, high-entropy passwords online. Customizable length, symbols, and strength score. 100% private and cryptographically secure.',
    howToUse: [
      'Select password length using the slider (e.g. 16 to 32 characters).',
      'Toggle character types: Uppercase, Lowercase, Numbers, and Symbols.',
      'Optionally enable "Exclude Ambiguous Characters" for easy manual reading.',
      'Check the real-time Entropy Score and Strength Rating.',
      'Click "Copy Password" to copy directly to your clipboard.'
    ],
    features: [
      'Powered by window.crypto.getRandomValues for true cryptographic randomness',
      'Real-time Entropy (bits) and crack-time difficulty estimation',
      'Customizable length (4 to 64 characters)',
      'Option to avoid easily confused letters (like O vs 0 and l vs 1)',
      'One-click copy and bulk password generation option'
    ],
    faqs: [
      {
        question: 'Are generated passwords saved or sent anywhere?',
        answer: 'Never. Passwords are generated strictly in your device’s local memory and are never transmitted over the internet.'
      },
      {
        question: 'What is considered a strong password length?',
        answer: 'Security experts recommend a minimum length of 16 characters containing a mix of letters, numbers, and symbols to resist brute-force attacks.'
      }
    ],
    relatedToolSlugs: ['qr-code-generator', 'text-case-converter']
  },

  // 10. Text Case Converter
  {
    id: 'text-case-converter',
    slug: 'text-case-converter',
    name: 'Text Case Converter',
    category: 'text',
    categoryName: 'Text & Content',
    shortDescription: 'Convert text between UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case, and kebab-case.',
    fullDescription: 'Comprehensive string case converter for coders, editors, and students. Instantly transform sentences and code identifiers across standard typographic styles and programming conventions.',
    icon: 'CaseSensitive',
    keywords: ['case converter', 'uppercase to lowercase', 'title case generator', 'sentence case', 'camelcase converter', 'snake_case'],
    popular: true,
    metaTitle: 'Free Text Case Converter Online - UPPERCASE, lowercase, Title Case | ToolNest',
    metaDescription: 'Convert text to UPPERCASE, lowercase, Title Case, Sentence case, Capitalize, camelCase, snake_case, and kebab-case instantly for free.',
    howToUse: [
      'Type or paste your text into the input box.',
      'Click any case transformation button (e.g. Title Case, UPPERCASE, camelCase).',
      'The converted text updates instantly in the box.',
      'Click "Copy" to copy to clipboard or "Download .txt" to save.'
    ],
    features: [
      'Standard Cases: UPPERCASE, lowercase, Sentence case, Title Case, Capitalized Words',
      'Developer Cases: camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE',
      'Fun & Aesthetic Cases: aLtErNaTiNg cAsE, InVeRsE cAsE',
      'Instant Copy, Clear, and Download options',
      'Live character and word counts'
    ],
    faqs: [
      {
        question: 'What is Title Case?',
        answer: 'Title Case capitalizes the first letter of major words while keeping minor words (like and, in, the, of) lowercase for clean headings.'
      }
    ],
    relatedToolSlugs: ['remove-extra-spaces', 'word-counter', 'character-counter']
  },

  // 11. Remove Extra Spaces
  {
    id: 'remove-extra-spaces',
    slug: 'remove-extra-spaces',
    name: 'Remove Extra Spaces',
    category: 'text',
    categoryName: 'Text & Content',
    shortDescription: 'Remove duplicate spaces, leading/trailing whitespaces, empty lines, and tabs from your text instantly.',
    fullDescription: 'Clean messy formatted text from PDFs, OCR scans, code snippets, or word processors. Strip multiple consecutive spaces down to a single space, trim margins, remove blank lines, and format paragraphs neatly.',
    icon: 'AlignLeft',
    keywords: ['remove extra spaces', 'whitespace cleaner', 'clean text spaces', 'remove blank lines', 'trim spaces online'],
    popular: false,
    metaTitle: 'Free Remove Extra Spaces Online - Clean Whitespace & Blank Lines | ToolNest',
    metaDescription: 'Remove duplicate spaces, trim leading/trailing spaces, strip empty lines, and clean text online. Fast, free, and easy text whitespace cleaner.',
    howToUse: [
      'Paste your unformatted or messy text into the input area.',
      'Select your cleaning preferences (e.g. Single spaces, Trim lines, Remove empty lines).',
      'Click "Clean Text" or watch the live formatted output.',
      'Review the space reduction counter and copy the polished text.'
    ],
    features: [
      'Converts multiple consecutive spaces into a single clean space',
      'Trims leading and trailing spaces on every line',
      'Option to remove consecutive empty blank lines',
      'Tab-to-space normalization',
      'Detailed stats: spaces removed and character savings'
    ],
    faqs: [
      {
        question: 'Can this tool fix copy-pasted text from PDF files?',
        answer: 'Yes! PDF copies often introduce broken spaces and ragged empty lines. This tool normalizes the spacing into smooth, readable paragraphs.'
      }
    ],
    relatedToolSlugs: ['text-case-converter', 'word-counter', 'character-counter']
  },

  // 12. WhatsApp Link Generator
  {
    id: 'whatsapp-link-generator',
    slug: 'whatsapp-link-generator',
    name: 'WhatsApp Link Generator',
    category: 'generator',
    categoryName: 'Generators',
    shortDescription: 'Generate custom WhatsApp click-to-chat links with pre-filled messages and a scannable QR code.',
    fullDescription: 'Create instant wa.me links that let customers and friends message you on WhatsApp with one click, without needing to save your phone number to their contacts. Includes pre-filled message support and scannable QR codes for marketing materials.',
    icon: 'MessageCircle',
    keywords: ['whatsapp link generator', 'create wa me link', 'whatsapp chat link', 'whatsapp qr code', 'click to chat whatsapp'],
    popular: true,
    metaTitle: 'Free WhatsApp Link Generator with Pre-filled Message & QR | ToolNest',
    metaDescription: 'Create custom WhatsApp click-to-chat links (wa.me) with pre-filled messages and QR codes for free. Perfect for businesses, customer support, and bios.',
    howToUse: [
      'Enter your country code and phone number (e.g., +1 234 567 8900).',
      'Type an optional pre-filled message that users will send when clicking your link.',
      'Preview your generated wa.me link in real-time.',
      'Click "Copy Link", "Test in WhatsApp", or download the generated QR Code.'
    ],
    features: [
      'International country code selector with phone formatting',
      'Custom pre-filled message with emoji support',
      'Quick message templates (Customer Inquiry, Quote Request, Support)',
      'Live test button to verify the link directly in WhatsApp',
      'Integrated QR code generator for easy mobile scanning'
    ],
    faqs: [
      {
        question: 'Do people need to save my phone number to message me?',
        answer: 'No! WhatsApp click-to-chat links open a direct chat window immediately without requiring the sender to save your number in their phonebook.'
      },
      {
        question: 'Is this service affiliated with WhatsApp?',
        answer: 'No. ToolNest is an independent utility provider. WhatsApp is a registered trademark of Meta Platforms, Inc.'
      }
    ],
    relatedToolSlugs: ['qr-code-generator', 'password-generator', 'color-picker']
  },

  // 13. Color Picker
  {
    id: 'color-picker',
    slug: 'color-picker',
    name: 'Color Picker',
    category: 'converter',
    categoryName: 'Converters & Pickers',
    shortDescription: 'Explore colors, convert between HEX, RGB, HSL, HSV, and CMYK, check WCAG contrast, and view palettes.',
    fullDescription: 'Modern color workstation for web designers and developers. Pick colors via visual palette or sliders, convert instantly across HEX, RGB, HSL, HSV, and CMYK formats, inspect accessibility contrast ratios, and copy code snippets with a single click.',
    icon: 'Palette',
    keywords: ['color picker', 'hex to rgb', 'rgb to hsl', 'color converter', 'wcag contrast checker', 'color palette generator'],
    popular: true,
    metaTitle: 'Free Online Color Picker & Converter - HEX, RGB, HSL, CMYK | ToolNest',
    metaDescription: 'Pick colors, convert HEX, RGB, HSL, HSV, CMYK values, generate harmony palettes, and check WCAG contrast compliance online for free.',
    howToUse: [
      'Use the visual color picker or enter any HEX, RGB, or HSL value.',
      'View all converted color values updated in real time.',
      'Check the WCAG accessibility contrast score for text readability.',
      'Explore auto-generated color harmonies (Complementary, Analogous, Triadic).',
      'Click the copy icon next to any format to copy it to your clipboard.'
    ],
    features: [
      'Multi-format converter: HEX, RGB, RGBA, HSL, HSV, and CMYK',
      'WCAG AA and AAA accessibility contrast rating against black/white',
      'Interactive visual color harmonies (Complementary, Triadic, Analogous, Tetradic)',
      'Curated aesthetic swatch presets',
      'Instant one-click copy with toast notifications'
    ],
    faqs: [
      {
        question: 'What is WCAG color contrast compliance?',
        answer: 'WCAG guidelines ensure text has sufficient contrast against its background. Level AA requires at least 4.5:1 for normal body text, while AAA requires 7:1.'
      }
    ],
    relatedToolSlugs: ['unit-converter', 'qr-code-generator', 'image-compressor']
  },

  // 14. Unit Converter
  {
    id: 'unit-converter',
    slug: 'unit-converter',
    name: 'Unit Converter',
    category: 'converter',
    categoryName: 'Converters & Pickers',
    shortDescription: 'Convert units across Length, Weight, Temperature, Area, Data Size, Time, and Speed in real-time.',
    fullDescription: 'Comprehensive metric and imperial unit conversion calculator. Convert kilometers to miles, kilograms to pounds, Celsius to Fahrenheit, megabytes to gigabytes, and more with high precision.',
    icon: 'ArrowLeftRight',
    keywords: ['unit converter', 'length converter', 'weight converter', 'temperature converter', 'data size converter', 'metric to imperial'],
    popular: true,
    metaTitle: 'Free Online Unit Converter - Length, Weight, Temp, Storage | ToolNest',
    metaDescription: 'Convert units for length, mass/weight, temperature, area, digital storage, time, and speed instantly with high precision math.',
    howToUse: [
      'Select a unit category tab (e.g., Length, Weight, Temperature, Data Size).',
      'Choose your "From" unit and "To" unit.',
      'Enter a value in either field for instant bi-directional calculation.',
      'Click the swap button (⇄) to invert units instantly.',
      'Review the standard mathematical conversion formula below.'
    ],
    features: [
      '7 comprehensive categories: Length, Weight/Mass, Temperature, Area, Data Storage, Time, Speed',
      'Instant bi-directional live calculations',
      'Interactive unit swapping button',
      'Clear conversion formula and reference values',
      'High numerical precision with smart exponential notation for extreme values'
    ],
    faqs: [
      {
        question: 'Does this calculator use decimal (1000) or binary (1024) data sizes?',
        answer: 'The Data Storage converter uses standard binary computing units where 1 KB = 1024 Bytes, 1 MB = 1024 KB, and 1 GB = 1024 MB.'
      }
    ],
    relatedToolSlugs: ['percentage-calculator', 'age-calculator', 'color-picker']
  },

  // 15. Age Calculator
  {
    id: 'age-calculator',
    slug: 'age-calculator',
    name: 'Age Calculator',
    category: 'calculator',
    categoryName: 'Calculators',
    shortDescription: 'Calculate exact age in years, months, and days, total lifespan statistics, and next birthday countdown.',
    fullDescription: 'Calculate chronological age with pinpoint calendar accuracy. Calculates exact years, months, and days lived, total elapsed weeks, hours, and minutes, day of the week you were born, and the countdown to your next birthday.',
    icon: 'Calendar',
    keywords: ['age calculator', 'calculate exact age', 'how old am i', 'birthday countdown', 'days lived calculator', 'chronological age'],
    popular: true,
    metaTitle: 'Free Exact Age Calculator Online - Years, Months, Days & Next Birthday | ToolNest',
    metaDescription: 'Calculate exact age in years, months, days, total hours, minutes lived, and next birthday countdown online for free. Accurate calendar leap-year handling.',
    howToUse: [
      'Select your Date of Birth in the date picker.',
      'Optionally specify a custom "Age as of" date (defaults to today).',
      'Click "Calculate Age" (or view instant live output).',
      'Discover your exact age, lifespan stats (days, hours, minutes), birth day of week, and upcoming birthday countdown.'
    ],
    features: [
      'Exact chronological age in Years, Months, and Days',
      'Accurate leap year and variable month length calendar calculations',
      'Detailed lifespan breakdown: Total Months, Weeks, Days, Hours, Minutes, Seconds',
      'Day of the week of your birth',
      'Upcoming birthday countdown with celebratory confetti animation'
    ],
    faqs: [
      {
        question: 'Does the age calculation account for leap years?',
        answer: 'Yes! ToolNest takes full account of February 29 leap years and exact calendar day differences for 100% precision.'
      }
    ],
    relatedToolSlugs: ['percentage-calculator', 'unit-converter', 'date-difference']
  },

  // 16. PDF to JPG
  {
    id: 'pdf-to-jpg',
    slug: 'pdf-to-jpg',
    name: 'PDF to JPG Converter',
    category: 'converter',
    categoryName: 'Converters',
    shortDescription: 'Convert all PDF pages into high-resolution JPG images client-side with zero server uploads.',
    fullDescription: 'Extract and render every page of your PDF documents into high-quality JPG image files. Select specific pages or download all rendered pages in seconds.',
    icon: 'FileImage',
    keywords: ['pdf to jpg', 'convert pdf to image', 'pdf to jpeg', 'pdf extractor', 'extract pages from pdf'],
    popular: true,
    metaTitle: 'Free PDF to JPG Converter Online - High Resolution | ToolNest',
    metaDescription: 'Convert PDF pages to JPG images in your browser for free. Fast, high-resolution rendering with 100% client-side privacy.',
    howToUse: [
      'Upload or drag-and-drop your PDF document.',
      'Preview rendered pages in real-time.',
      'Select individual pages or choose "Select All".',
      'Click "Download JPG" on single pages or download all selected images.'
    ],
    features: [
      'High-resolution canvas rendering (2x retina quality)',
      'Individual page preview and selection',
      'Batch download capabilities',
      '100% client-side rendering with complete privacy'
    ],
    faqs: [
      {
        question: 'Are my PDF documents uploaded to a server?',
        answer: 'No. All PDF page parsing and image rendering happen entirely inside your web browser.'
      }
    ],
    relatedToolSlugs: ['jpg-to-pdf', 'merge-pdf', 'compress-pdf']
  },

  // 17. JPG to PDF
  {
    id: 'jpg-to-pdf',
    slug: 'jpg-to-pdf',
    name: 'JPG to PDF Converter',
    category: 'converter',
    categoryName: 'Converters',
    shortDescription: 'Combine multiple JPG, PNG, and WebP images into a single clean PDF document.',
    fullDescription: 'Merge multiple photos and graphics into a multi-page PDF. Customize page orientation, paper size (A4 / Letter), and margins before compiling.',
    icon: 'FileText',
    keywords: ['jpg to pdf', 'images to pdf', 'photo to pdf', 'combine images into pdf', 'png to pdf'],
    popular: true,
    metaTitle: 'Free JPG to PDF Converter Online - Merge Images | ToolNest',
    metaDescription: 'Convert JPG, JPEG, and PNG images into a professional PDF document. Reorder images, choose page size, and download instantly.',
    howToUse: [
      'Upload one or more JPG/PNG images.',
      'Reorder images using the up/down arrows if needed.',
      'Select page size (A4, Letter, or Fit to Image) and orientation.',
      'Click "Convert to PDF" and download your compiled document.'
    ],
    features: [
      'Support for multiple JPG, PNG, and WebP images',
      'Custom page sizes: A4, US Letter, and Fit-to-Image',
      'Portrait and Landscape orientation settings',
      'Custom margin and reordering controls'
    ],
    faqs: [
      {
        question: 'Can I add multiple photos at once?',
        answer: 'Yes! You can upload dozens of photos simultaneously and reorder them before generating your PDF.'
      }
    ],
    relatedToolSlugs: ['pdf-to-jpg', 'merge-pdf', 'image-compressor']
  },

  // 18. Merge PDF
  {
    id: 'merge-pdf',
    slug: 'merge-pdf',
    name: 'Merge PDF',
    category: 'converter',
    categoryName: 'Converters',
    shortDescription: 'Combine multiple PDF documents into a single organized PDF file.',
    fullDescription: 'Join multiple separate PDF files into one complete document. Arrange the exact order of documents and compile with zero loss of quality.',
    icon: 'Files',
    keywords: ['merge pdf', 'combine pdf', 'join pdf files', 'pdf merger', 'combine documents'],
    popular: true,
    metaTitle: 'Free Online PDF Merger - Combine Multiple PDFs | ToolNest',
    metaDescription: 'Merge multiple PDF files into a single document online for free. Reorder files, preview page counts, and download instantly.',
    howToUse: [
      'Upload two or more PDF documents.',
      'Drag or click arrows to arrange documents in your preferred order.',
      'Optionally customize the output PDF filename.',
      'Click "Merge PDFs" and download your combined document.'
    ],
    features: [
      'Join unlimited PDF documents',
      'Interactive document re-ordering controls',
      'Live total page count and file size summary',
      'Lossless vector and text preservation'
    ],
    faqs: [
      {
        question: 'Does merging alter the quality of my PDF text or images?',
        answer: 'No. ToolNest copies PDF object streams directly, preserving 100% of original vector quality and text clarity.'
      }
    ],
    relatedToolSlugs: ['compress-pdf', 'pdf-to-jpg', 'jpg-to-pdf']
  },

  // 19. Compress PDF
  {
    id: 'compress-pdf',
    slug: 'compress-pdf',
    name: 'Compress PDF',
    category: 'converter',
    categoryName: 'Converters',
    shortDescription: 'Optimize and reduce PDF document file sizes directly in your browser.',
    fullDescription: 'Clean redundant object streams, optimize cross-reference tables, and strip unnecessary metadata to produce leaner PDF files without cloud uploads.',
    icon: 'Minimize2',
    keywords: ['compress pdf', 'reduce pdf size', 'shrink pdf', 'pdf optimizer', 'online pdf compressor'],
    popular: true,
    metaTitle: 'Free Online PDF Compressor - Reduce PDF Size | ToolNest',
    metaDescription: 'Optimize and compress PDF document size for free directly in your browser. Fast, private, and secure.',
    howToUse: [
      'Upload your PDF document.',
      'Select your desired optimization level (Standard or Deep Structural).',
      'Click "Compress PDF" to optimize the internal object streams.',
      'Review file size savings and download your optimized PDF.'
    ],
    features: [
      'Stream and dictionary compaction',
      'Metadata and redundant object removal',
      'Live before-and-after file size comparison',
      '100% private client-side processing'
    ],
    faqs: [
      {
        question: 'Why compress PDFs client-side?',
        answer: 'Client-side compression ensures confidential contracts, bank statements, and tax files never touch a remote server.'
      }
    ],
    relatedToolSlugs: ['merge-pdf', 'pdf-to-jpg', 'image-compressor']
  },

  // 20. Image Cropper
  {
    id: 'image-cropper',
    slug: 'image-cropper',
    name: 'Image Cropper',
    category: 'image',
    categoryName: 'Image Tools',
    shortDescription: 'Crop photos and graphics with aspect ratio presets (1:1, 16:9, 4:3, 9:16) and live preview.',
    fullDescription: 'Precision image cropping utility with intuitive drag-and-resize bounding boxes, social media aspect ratio presets, custom pixel dimensions, and lossless PNG/JPG export.',
    icon: 'Crop',
    keywords: ['image cropper', 'crop photo', 'crop image online', 'aspect ratio crop', 'square photo crop', '16:9 crop'],
    popular: true,
    metaTitle: 'Free Online Image Cropper - Preset Aspect Ratios | ToolNest',
    metaDescription: 'Crop images online with preset aspect ratios (1:1, 16:9, 4:3, 9:16) or custom dimensions. Fast, interactive, and private.',
    howToUse: [
      'Upload your JPG, PNG, or WebP image.',
      'Choose an aspect ratio preset or adjust the crop boundaries freely.',
      'Drag the bounding box over the desired area in the interactive preview.',
      'Select output format (PNG or JPG) and download your cropped image.'
    ],
    features: [
      'Presets for 1:1 (Avatar/Square), 16:9 (Landscape), 4:3, 3:2, and 9:16 (Stories/Reels)',
      'Real-time live output preview canvas',
      'Custom pixel width/height precision readouts',
      'Choice of PNG (lossless) or JPG with custom quality compression'
    ],
    faqs: [
      {
        question: 'What aspect ratio is best for social media profiles?',
        answer: 'Use 1:1 Square for profile photos and avatars, 16:9 for YouTube thumbnails or landscape headers, and 9:16 for Instagram Stories and TikToks.'
      }
    ],
    relatedToolSlugs: ['image-resizer', 'image-compressor', 'png-to-jpg']
  },

  // 21. JSON Formatter
  {
    id: 'json-formatter',
    slug: 'json-formatter',
    name: 'JSON Formatter & Validator',
    category: 'text',
    categoryName: 'Text Tools',
    shortDescription: 'Format, validate, prettify, and minify JSON data with instant syntax error detection.',
    fullDescription: 'Clean, format, and validate complex JSON data strings. Switch between 2-space, 4-space, and tab indentation, minify for production, validate syntax, and export formatted files.',
    icon: 'Code',
    keywords: ['json formatter', 'json validator', 'prettify json', 'minify json', 'json viewer', 'format json online'],
    popular: true,
    metaTitle: 'Free Online JSON Formatter, Validator & Minifier | ToolNest',
    metaDescription: 'Prettify, format, validate, and minify JSON strings with live syntax checking, error detection, and one-click copy.',
    howToUse: [
      'Paste your raw JSON into the input box (or click "Load Sample" or "Upload .json").',
      'Click "Prettify JSON" to format with clean spacing or "Minify" for a compact single line.',
      'Check the status bar for syntax validation errors.',
      'Copy the formatted JSON or download it as a .json file.'
    ],
    features: [
      'Configurable indentation: 2 spaces, 4 spaces, or 1 tab',
      'Real-time JSON syntax validator and error reporter',
      'Single-click minification for payload optimization',
      'Line count and character count metrics',
      'Export and download as .json files'
    ],
    faqs: [
      {
        question: 'Is my JSON data sent to any server?',
        answer: 'No. All JSON parsing and formatting execute strictly inside your local browser JavaScript engine.'
      }
    ],
    relatedToolSlugs: ['url-encoder-decoder', 'word-counter', 'character-counter']
  },

  // 22. URL Encoder / Decoder
  {
    id: 'url-encoder-decoder',
    slug: 'url-encoder-decoder',
    name: 'URL Encoder / Decoder',
    category: 'text',
    categoryName: 'Text Tools',
    shortDescription: 'Encode and decode URLs, query strings, and special characters safely and accurately.',
    fullDescription: 'Convert reserved characters and query parameters into standard percent-encoded URI strings (e.g. %20 for spaces), or decode encoded URLs back into human-readable text.',
    icon: 'Link',
    keywords: ['url encoder', 'url decoder', 'percent encoding', 'uri component encoder', 'decode url online'],
    popular: false,
    metaTitle: 'Free URL Encoder and Decoder Online | ToolNest',
    metaDescription: 'Encode and decode URLs, query parameters, and special characters online. Supports encodeURIComponent and encodeURI standards.',
    howToUse: [
      'Choose "URL Encode" or "URL Decode" mode.',
      'Enter or paste your URL string into the input area.',
      'The result updates in real-time.',
      'Click "Copy Result" to copy to your clipboard.'
    ],
    features: [
      'Support for both encodeURIComponent (parameters) and encodeURI (full address)',
      'Instant real-time bi-directional processing',
      'Automatic malformed URI sequence detection and error reporting',
      'One-click result copying with visual confirmation'
    ],
    faqs: [
      {
        question: 'What is the difference between encodeURI and encodeURIComponent?',
        answer: 'encodeURIComponent encodes all special characters including ?, =, &, and / (ideal for query parameters), while encodeURI preserves URL protocol and directory slashes.'
      }
    ],
    relatedToolSlugs: ['json-formatter', 'qr-code-generator', 'whatsapp-link-generator']
  },

  // 23. BMI Calculator
  {
    id: 'bmi-calculator',
    slug: 'bmi-calculator',
    name: 'BMI Calculator',
    category: 'calculator',
    categoryName: 'Calculators',
    shortDescription: 'Calculate Body Mass Index (BMI), category classification, and ideal healthy weight range.',
    fullDescription: 'Accurately calculate your Body Mass Index using Metric (cm/kg) or Imperial (ft/lbs) measurements. Features WHO weight category breakdown, visual spectrum indicator, and recommended healthy weight ranges.',
    icon: 'Scale',
    keywords: ['bmi calculator', 'body mass index', 'calculate bmi', 'healthy weight calculator', 'ideal weight', 'bmi chart'],
    popular: true,
    metaTitle: 'Free Online BMI Calculator - Metric & Imperial | ToolNest',
    metaDescription: 'Calculate Body Mass Index (BMI), weight category, and healthy weight range online for free. Supports metric and imperial units.',
    howToUse: [
      'Select your preferred unit system (Metric or Imperial).',
      'Enter your height and weight.',
      'Optionally specify age and gender for personalized context.',
      'Review your BMI score, category, visual gauge position, and healthy weight range.'
    ],
    features: [
      'Dual Metric (cm, kg) and Imperial (ft, in, lbs) support',
      'World Health Organization (WHO) adult category classifications',
      'Visual color-coded BMI spectrum gauge with dynamic needle',
      'Personalized healthy weight range calculation'
    ],
    faqs: [
      {
        question: 'What is considered a normal healthy BMI range?',
        answer: 'According to the World Health Organization, a normal BMI for adults falls between 18.5 and 24.9.'
      }
    ],
    relatedToolSlugs: ['age-calculator', 'percentage-calculator', 'unit-converter']
  },

  // 24. Discount Calculator
  {
    id: 'discount-calculator',
    slug: 'discount-calculator',
    name: 'Discount Calculator',
    category: 'calculator',
    categoryName: 'Calculators',
    shortDescription: 'Calculate sale prices, percentage discounts, total savings, and optional sales tax.',
    fullDescription: 'Calculate final prices after store discounts, stacked promo codes, and regional sales tax. Features quick percentage presets, multi-currency support, and itemized receipt breakdowns.',
    icon: 'Tag',
    keywords: ['discount calculator', 'sale price calculator', 'percentage off', 'calculate savings', 'tax and discount calculator'],
    popular: true,
    metaTitle: 'Free Online Discount Calculator - Sale Price & Savings | ToolNest',
    metaDescription: 'Calculate sale prices, percentage discounts, extra stacked coupons, and sales tax instantly with high precision math.',
    howToUse: [
      'Enter the original retail price of your item.',
      'Enter the discount percentage or click a quick preset button (e.g. 20%, 30%, 50%).',
      'Optionally add an extra stacked coupon % or local sales tax %.',
      'View final price you pay, total savings amount, and copy the summary.'
    ],
    features: [
      'Primary discount + extra stacked promo code calculations',
      'Optional sales tax calculation on discounted subtotal',
      'Quick discount percentage shortcut buttons',
      'Multi-currency symbols ($ USD, € EUR, £ GBP, ₹ INR, ¥ JPY, C$ CAD)',
      'Clear itemized price breakdown'
    ],
    faqs: [
      {
        question: 'How do stacked discounts work?',
        answer: 'A second discount is calculated on the remaining discounted price after the first discount has been deducted, matching retail store checkout policies.'
      }
    ],
    relatedToolSlugs: ['percentage-calculator', 'unit-converter', 'bmi-calculator']
  },

  // 25. Date Difference Calculator
  {
    id: 'date-difference',
    slug: 'date-difference',
    name: 'Date Difference Calculator',
    category: 'calculator',
    categoryName: 'Calculators',
    shortDescription: 'Calculate exact time between two dates in years, months, days, weeks, and working days.',
    fullDescription: 'Calculate the exact span between any two calendar dates with pinpoint accuracy. Provides breakdowns in years, months, and days, total count of days, business working days, weekend days, and elapsed hours.',
    icon: 'CalendarDays',
    keywords: ['date difference calculator', 'days between dates', 'calculate time between dates', 'business days calculator', 'date duration'],
    popular: true,
    metaTitle: 'Free Date Difference Calculator - Days Between Dates | ToolNest',
    metaDescription: 'Calculate the exact difference between two dates in years, months, days, total days, and working business days for free.',
    howToUse: [
      'Select your Start Date and End Date using the date pickers.',
      'Check "Include End Date" if you want to include the final day in the count.',
      'Review exact years, months, and days alongside total days, business days, and hours.',
      'Click "Copy Full Breakdown" to copy results to your clipboard.'
    ],
    features: [
      'Accurate leap year and variable month length calculations',
      'Detailed unit conversions: Total Days, Weeks + Days, Working Days, Weekend Days, Total Hours',
      'Quick range presets (Until End of Year, Last 30 Days, +100 Days)',
      'One-click date swap button',
      'Reverse date range handling'
    ],
    faqs: [
      {
        question: 'Does this calculator separate working days from weekend days?',
        answer: 'Yes! The calculator automatically computes Monday–Friday working days versus Saturday–Sunday weekend days within your selected date span.'
      }
    ],
    relatedToolSlugs: ['age-calculator', 'percentage-calculator', 'unit-converter']
  }
];

export const HOMEPAGE_FAQS = [
  {
    question: 'Are all the tools on ToolNest completely free to use?',
    answer: 'Yes, 100%! Every utility, calculator, and image converter on ToolNest is completely free with no hidden subscriptions, credit card requirements, or daily usage caps.'
  },
  {
    question: 'Do you store or upload my photos, files, or text to a server?',
    answer: 'No. All processing happens entirely client-side in your web browser memory. Your images, confidential passwords, and written text never leave your computer or smartphone.'
  },
  {
    question: 'Do I need to create an account or sign up to use ToolNest?',
    answer: 'No registration or account is needed. You can use any tool instantly upon landing on the page.'
  },
  {
    question: 'Does ToolNest work on mobile devices and tablets?',
    answer: 'Yes! ToolNest is designed with a mobile-first architecture and is fully responsive across Android smartphones, iPhones, iPads, tablets, and desktop computers.'
  },
  {
    question: 'Can I bookmark my favorite tools for quick access?',
    answer: 'Absolutely! Each tool has its own clean, direct URL (e.g., /tools/image-compressor) that you can bookmark on your browser home screen.'
  }
];
