import { useEffect } from 'react';
import { generateSEOMetadata, seoConfig } from '../config/seoConfig';

interface SEOData {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  noindex?: boolean;
  nofollow?: boolean;
}

export const useSEO = (page: string, customData?: SEOData) => {
  useEffect(() => {
    // Generate SEO metadata for the page
    const seoData = generateSEOMetadata(page, customData);
    
    // Update document title
    document.title = seoData.title;
    
    // Update meta tags
    updateMetaTag('description', seoData.description);
    updateMetaTag('keywords', seoData.keywords);
    
    // Update Open Graph tags
    updateMetaTag('og:title', seoData.title, 'property');
    updateMetaTag('og:description', seoData.description, 'property');
    updateMetaTag('og:url', seoData.canonical, 'property');
    updateMetaTag('og:image', `${seoConfig.siteUrl}${seoData.ogImage}`, 'property');
    
    // Update Twitter tags
    updateMetaTag('twitter:title', seoData.title, 'name');
    updateMetaTag('twitter:description', seoData.description, 'name');
    updateMetaTag('twitter:image', `${seoConfig.siteUrl}${seoData.ogImage}`, 'name');
    
    // Update canonical URL
    updateCanonicalLink(seoData.canonical);
    
    // Update robots meta tag if needed
    if (customData?.noindex || customData?.nofollow) {
      const robotsContent = [
        customData.noindex ? 'noindex' : 'index',
        customData.nofollow ? 'nofollow' : 'follow'
      ].join(', ');
      updateMetaTag('robots', robotsContent);
    }
    
    // Add hreflang for international SEO (if needed)
    updateHreflangLinks();
    
  }, [page, customData]);
};

const updateMetaTag = (name: string, content: string, attribute: 'name' | 'property' = 'name') => {
  let element = document.querySelector(`meta[${attribute}="${name}"]`);
  
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }
  
  element.setAttribute('content', content);
};

const updateCanonicalLink = (url: string) => {
  let canonical = document.querySelector('link[rel="canonical"]');
  
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  
  canonical.setAttribute('href', url);
};

const updateHreflangLinks = () => {
  // Add hreflang links for international SEO
  const hreflangs = [
    { lang: 'en', href: seoConfig.siteUrl },
    { lang: 'x-default', href: seoConfig.siteUrl }
  ];
  
  // Remove existing hreflang links
  document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(link => {
    link.remove();
  });
  
  // Add new hreflang links
  hreflangs.forEach(({ lang, href }) => {
    const link = document.createElement('link');
    link.setAttribute('rel', 'alternate');
    link.setAttribute('hreflang', lang);
    link.setAttribute('href', href);
    document.head.appendChild(link);
  });
};

// Hook for managing JSON-LD structured data
export const useStructuredData = (type: string, data: Record<string, unknown>) => {
  useEffect(() => {
    const scriptId = `structured-data-${type}`;
    
    // Remove existing structured data script
    const existingScript = document.getElementById(scriptId);
    if (existingScript) {
      existingScript.remove();
    }
    
    // Add new structured data script
    const script = document.createElement('script');
    script.id = scriptId;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data, null, 2);
    document.head.appendChild(script);
    
    // Cleanup function
    return () => {
      const scriptToRemove = document.getElementById(scriptId);
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [type, data]);
};

// Hook for monitoring Core Web Vitals (SEO ranking factor)
export const useCoreWebVitals = () => {
  useEffect(() => {
    // Web-vitals monitoring disabled to avoid TypeScript errors
    // TODO: Re-enable with proper TypeScript types in future update
    console.log('Core Web Vitals monitoring is disabled');
  }, []);
};

export default useSEO;
