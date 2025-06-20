import React from 'react';

interface FAQSchemaProps {
  faqs: {
    question: string;
    answer: string;
  }[];
}

export const FAQSchema: React.FC<FAQSchemaProps> = ({ faqs }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

interface BreadcrumbSchemaProps {
  items: {
    name: string;
    url: string;
  }[];
}

export const BreadcrumbSchema: React.FC<BreadcrumbSchemaProps> = ({ items }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

interface ReviewSchemaProps {
  rating: number;
  reviewCount: number;
  reviews?: {
    author: string;
    rating: number;
    text: string;
    date: string;
  }[];
}

export const ReviewSchema: React.FC<ReviewSchemaProps> = ({ rating, reviewCount, reviews = [] }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "CheckResumeAI - AI Resume Analyzer",
    "description": "AI-powered resume analysis tool with ATS compatibility checking",
    "brand": {
      "@type": "Brand",
      "name": "CheckResumeAI"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": rating,
      "reviewCount": reviewCount,
      "bestRating": 5,
      "worstRating": 1
    },
    ...(reviews.length > 0 && {
      "review": reviews.map(review => ({
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": review.author
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": review.rating,
          "bestRating": 5
        },
        "reviewBody": review.text,
        "datePublished": review.date
      }))
    })
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

interface HowToSchemaProps {
  name: string;
  description: string;
  steps: {
    name: string;
    text: string;
    image?: string;
  }[];
}

export const HowToSchema: React.FC<HowToSchemaProps> = ({ name, description, steps }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": name,
    "description": description,
    "step": steps.map((step, index) => ({
      "@type": "HowToStep",
      "position": index + 1,
      "name": step.name,
      "text": step.text,
      ...(step.image && { "image": step.image })
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

interface VideoSchemaProps {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  duration: string;
  contentUrl: string;
}

export const VideoSchema: React.FC<VideoSchemaProps> = ({ 
  name, 
  description, 
  thumbnailUrl, 
  uploadDate, 
  duration, 
  contentUrl 
}) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": name,
    "description": description,
    "thumbnailUrl": thumbnailUrl,
    "uploadDate": uploadDate,
    "duration": duration,
    "contentUrl": contentUrl,
    "embedUrl": contentUrl,
    "publisher": {
      "@type": "Organization",
      "name": "CheckResumeAI",
      "logo": {
        "@type": "ImageObject",
        "url": "https://checkresumeai.com/images/logo.png"
      }
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

export default {
  FAQSchema,
  BreadcrumbSchema,
  ReviewSchema,
  HowToSchema,
  VideoSchema
};
