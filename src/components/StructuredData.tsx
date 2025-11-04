import React from 'react';
import { seoConfig } from '../config/seoConfig';

interface StructuredDataProps {
  type?: 'website' | 'product' | 'article' | 'faq' | 'organization';
  data?: any;
}

export const StructuredData: React.FC<StructuredDataProps> = ({ 
  type = 'website', 
  data = {} 
}) => {
  const generateStructuredData = () => {
    const baseData = {
      "@context": "https://schema.org",
      "@type": type === 'website' ? 'WebApplication' : type,
      ...data
    };

    switch (type) {
      case 'website':
        return {
          ...baseData,
          "@type": "WebApplication",
          "name": seoConfig.siteName,
          "alternateName": "Resume Analyzer AI",
          "url": seoConfig.siteUrl,
          "logo": `${seoConfig.siteUrl}/images/logo.png`,
          "description": seoConfig.defaultDescription,
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "Web Browser",          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "INR",
            "availability": "https://schema.org/InStock"
          },
          "creator": seoConfig.organization,
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": seoConfig.siteUrl
          },
          "potentialAction": {
            "@type": "UseAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": seoConfig.siteUrl,
              "inLanguage": "en-US",
              "actionPlatform": [
                "http://schema.org/DesktopWebPlatform",
                "http://schema.org/MobileWebPlatform"
              ]
            }
          },
          "featureList": [
            "AI-Powered Resume Analysis",
            "ATS Compatibility Checker",
            "Skills Gap Analysis",
            "Interview Probability Score",
            "Resume Optimization Tips",
            "Career Path Recommendations",
            "Industry Benchmarking",
            "PDF Resume Upload",
            "Real-time Feedback",
            "Mobile Responsive Design"
          ],
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "reviewCount": "2847",
            "bestRating": "5",
            "worstRating": "1"
          }
        };

      case 'organization':
        return {
          ...baseData,
          "@type": "Organization",
          ...seoConfig.organization,
          "founder": {
            "@type": "Person",
            "name": "CheckResumeAI Team"
          },
          "areaServed": "Worldwide",
          "knowsAbout": [
            "Resume Analysis",
            "ATS Optimization",
            "Career Development",
            "Job Search",
            "Interview Preparation",
            "Skills Assessment",
            "AI Technology",
            "Human Resources"
          ]
        };

      case 'faq':
        return {
          ...baseData,
          "@type": "FAQPage",
          "mainEntity": seoConfig.faqData.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.answer
            }
          }))
        };

      case 'product':
        return {
          ...baseData,
          "@type": "SoftwareApplication",
          "name": "CheckResumeAI Resume Analyzer",
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "Web Browser",          "offers": [
            {
              "@type": "Offer",
              "name": "Free Plan",
              "price": "0",
              "priceCurrency": "INR",
              "description": "Basic resume analysis and ATS checking"
            },
            {
              "@type": "Offer",
              "name": "Premium Plan Monthly",
              "price": "99",
              "priceCurrency": "INR",
              "description": "Advanced analytics, industry insights, and priority support"
            },
            {
              "@type": "Offer",
              "name": "Premium Plan Yearly",
              "price": "499",
              "priceCurrency": "INR",
              "description": "All premium features with 58% savings"
            }
          ],
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "reviewCount": "2847"
          }
        };

      case 'article':
        return {
          ...baseData,
          "@type": "Article",
          "publisher": seoConfig.organization,
          "author": {
            "@type": "Organization",
            "name": "CheckResumeAI"
          },
          "datePublished": new Date().toISOString(),
          "dateModified": new Date().toISOString(),
          ...data
        };

      default:
        return baseData;
    }
  };

  const structuredData = generateStructuredData();

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2)
      }}
    />
  );
};

// Breadcrumb structured data component
export const BreadcrumbStructuredData: React.FC<{
  items: Array<{ name: string; url?: string }>
}> = ({ items }) => {
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      ...(item.url && { "item": `${seoConfig.siteUrl}${item.url}` })
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(breadcrumbData, null, 2)
      }}
    />
  );
};

// Local Business structured data (if applicable)
export const LocalBusinessStructuredData: React.FC = () => {
  const businessData = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "CheckResumeAI",
    "description": "AI-powered resume analysis and career optimization services",
    "url": seoConfig.siteUrl,
    "logo": `${seoConfig.siteUrl}/images/logo.png`,
    "image": `${seoConfig.siteUrl}/images/og-image.jpg`,
    "priceRange": "Free - ₹499",
    "areaServed": "Worldwide",
    "serviceType": "Career Services",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Resume Analysis Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "AI Resume Analysis",
            "description": "Comprehensive AI-powered resume analysis and feedback"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "ATS Compatibility Check",
            "description": "Check resume compatibility with Applicant Tracking Systems"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Skills Gap Analysis",
            "description": "Identify missing skills and get improvement recommendations"
          }
        }
      ]
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "2847",
      "bestRating": "5",
      "worstRating": "1"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(businessData, null, 2)
      }}
    />
  );
};

export default StructuredData;
