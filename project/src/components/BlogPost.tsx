import React from 'react';
import { Helmet } from 'react-helmet-async';

interface BlogPostProps {
  title: string;
  description: string;
  keywords?: string;
  author?: string;
  publishedDate?: string;
  modifiedDate?: string;
  canonicalUrl?: string;
  featuredImage?: string;
  children: React.ReactNode;
}

const BlogPost: React.FC<BlogPostProps> = ({
  title,
  description,
  keywords,
  author = 'CheckResumeAI Team',
  publishedDate,
  modifiedDate,
  canonicalUrl,
  featuredImage,
  children
}) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "author": {
      "@type": "Organization",
      "name": author
    },
    "publisher": {
      "@type": "Organization",
      "name": "CheckResumeAI",
      "logo": {
        "@type": "ImageObject",
        "url": "https://checkresumeai.com/images/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": canonicalUrl
    },
    ...(publishedDate && { "datePublished": publishedDate }),
    ...(modifiedDate && { "dateModified": modifiedDate }),
    ...(featuredImage && {
      "image": {
        "@type": "ImageObject",
        "url": featuredImage,
        "width": 1200,
        "height": 630
      }
    })
  };

  return (
    <>
      <Helmet>
        <title>{title} | CheckResumeAI Blog</title>
        <meta name="description" content={description} />
        {keywords && <meta name="keywords" content={keywords} />}
        <meta name="author" content={author} />
        {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
        
        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
        {featuredImage && <meta property="og:image" content={featuredImage} />}
        
        {/* Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        {featuredImage && <meta name="twitter:image" content={featuredImage} />}
        
        {/* Article specific meta */}
        {publishedDate && <meta property="article:published_time" content={publishedDate} />}
        {modifiedDate && <meta property="article:modified_time" content={modifiedDate} />}
        <meta property="article:section" content="Resume Analysis" />
        <meta property="article:author" content={author} />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      
      <article className="max-w-4xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {title}
          </h1>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 space-x-4">
            <span>By {author}</span>
            {publishedDate && (
              <span>Published {new Date(publishedDate).toLocaleDateString()}</span>
            )}
            {modifiedDate && publishedDate !== modifiedDate && (
              <span>Updated {new Date(modifiedDate).toLocaleDateString()}</span>
            )}
          </div>
        </header>
        
        <div className="prose prose-lg dark:prose-invert max-w-none">
          {children}
        </div>
        
        {/* Call to Action */}
        <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="text-xl font-semibold mb-3">Ready to analyze your resume?</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Get instant feedback on your resume with our AI-powered analyzer. Upload your resume now for a free analysis.
          </p>
          <a 
            href="/" 
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Analyze My Resume
          </a>
        </div>
      </article>
    </>
  );
};

export default BlogPost;
