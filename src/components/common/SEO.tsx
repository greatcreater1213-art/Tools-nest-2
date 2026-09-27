import React, { useEffect } from 'react';
import { SITE_CONFIG } from '../../config/siteConfig';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  canonicalUrl?: string;
  keywords?: string[];
  schema?: Record<string, unknown>;
}

export const SEO: React.FC<SEOProps> = ({ title, description, canonical, canonicalUrl: propCanonicalUrl, keywords, schema }) => {
  const fullTitle = title 
    ? (title.includes(SITE_CONFIG.name) ? title : `${title} | ${SITE_CONFIG.name}`)
    : `${SITE_CONFIG.name} - ${SITE_CONFIG.tagline}`;
  const metaDesc = description || SITE_CONFIG.description;
  const canonicalUrl = canonical || propCanonicalUrl || (typeof window !== 'undefined' ? window.location.href : SITE_CONFIG.url);

  useEffect(() => {
    // Update Document Title
    document.title = fullTitle;

    // Update Meta Description
    let metaDescriptionTag = document.querySelector('meta[name="description"]');
    if (!metaDescriptionTag) {
      metaDescriptionTag = document.createElement('meta');
      metaDescriptionTag.setAttribute('name', 'description');
      document.head.appendChild(metaDescriptionTag);
    }
    metaDescriptionTag.setAttribute('content', metaDesc);

    // Update Meta Keywords if provided
    if (keywords && keywords.length > 0) {
      let metaKeywordsTag = document.querySelector('meta[name="keywords"]');
      if (!metaKeywordsTag) {
        metaKeywordsTag = document.createElement('meta');
        metaKeywordsTag.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywordsTag);
      }
      metaKeywordsTag.setAttribute('content', keywords.join(', '));
    }

    // Update Open Graph tags
    let ogTitleTag = document.querySelector('meta[property="og:title"]');
    if (ogTitleTag) ogTitleTag.setAttribute('content', fullTitle);

    let ogDescTag = document.querySelector('meta[property="og:description"]');
    if (ogDescTag) ogDescTag.setAttribute('content', metaDesc);

    let ogUrlTag = document.querySelector('meta[property="og:url"]');
    if (!ogUrlTag) {
      ogUrlTag = document.createElement('meta');
      ogUrlTag.setAttribute('property', 'og:url');
      document.head.appendChild(ogUrlTag);
    }
    ogUrlTag.setAttribute('content', canonicalUrl);

    // Update Canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    // Insert or update Schema.org JSON-LD
    let scriptTag = document.getElementById('json-ld-schema') as HTMLScriptElement | null;
    if (schema) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = 'json-ld-schema';
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(schema);
    } else if (scriptTag) {
      scriptTag.remove();
    }
  }, [fullTitle, metaDesc, canonicalUrl, keywords, schema]);

  return null;
};
