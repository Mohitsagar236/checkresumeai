import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Card, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { ArrowRight, Calendar, User, BookOpen } from 'lucide-react';

const BlogIndexPage: React.FC = () => {
  const blogPosts = [
    {
      id: 'complete-guide-resume-analysis',
      title: 'The Complete Guide to Resume Analysis in 2025',
      description: 'Master the art of resume analysis with AI-powered tools, ATS optimization strategies, and expert insights to land your dream job.',
      slug: '/blog/complete-guide-resume-analysis',
      publishDate: '2025-01-15',
      author: 'CheckResumeAI Team',
      readTime: '15 min read',
      category: 'Resume Analysis',
      featured: true
    },    {
      id: 'ats-optimization-ultimate-guide',
      title: 'ATS Optimization Ultimate Guide: Beat 88% of Applicant Tracking Systems',
      description: 'Complete guide to ATS optimization with advanced strategies, keyword research techniques, and formatting best practices used by top recruiters.',
      slug: '/blog/ats-optimization-ultimate-guide',
      publishDate: '2025-01-20',
      author: 'CheckResumeAI Team',
      readTime: '18 min read',
      category: 'ATS Optimization',
      featured: true
    },
    {
      id: 'resume-keywords-2025',
      title: 'Top Resume Keywords That Get You Hired in 2025',
      description: 'Discover the most powerful keywords employers are looking for and how to naturally integrate them into your resume.',
      slug: '/blog/resume-keywords-2025',
      publishDate: '2025-01-05',
      author: 'Career Coach',
      readTime: '8 min read',
      category: 'Keywords',
      featured: false
    }
  ];

  return (
    <>
      <Helmet>
        <title>Resume Analysis Blog - Expert Tips & Career Advice | CheckResumeAI</title>
        <meta name="description" content="Get expert resume tips, ATS optimization strategies, and career advice from industry professionals. Boost your job search success with our comprehensive guides." />
        <meta name="keywords" content="resume tips, career advice, ATS optimization, job search, resume analysis, interview preparation, career development" />
        <link rel="canonical" href="https://checkresumeai.com/blog" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Resume Analysis Blog - Expert Tips & Career Advice | CheckResumeAI" />
        <meta property="og:description" content="Get expert resume tips, ATS optimization strategies, and career advice from industry professionals." />
        <meta property="og:url" content="https://checkresumeai.com/blog" />
        <meta property="og:type" content="website" />
        
        {/* Twitter */}
        <meta name="twitter:title" content="Resume Analysis Blog - Expert Tips & Career Advice | CheckResumeAI" />
        <meta name="twitter:description" content="Get expert resume tips, ATS optimization strategies, and career advice from industry professionals." />
      </Helmet>

      <div className="min-h-screen pt-24 pb-16 bg-gray-50 dark:bg-slate-900">
        <div className="container mx-auto px-4 md:px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Resume Analysis Blog
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Expert tips, ATS optimization strategies, and career advice to help you land your dream job
            </p>
          </div>

          {/* Featured Post */}
          {blogPosts.filter(post => post.featured).map(post => (
            <div key={post.id} className="mb-16">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-1">
                <Card className="bg-white dark:bg-slate-800 rounded-lg border-0 shadow-xl">
                  <CardHeader className="p-8">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-medium">
                        Featured
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">{post.category}</span>
                    </div>
                    <CardTitle className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                      {post.description}
                    </CardDescription>
                    <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400 mb-6">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(post.publishDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                    <Link 
                      to={post.slug}
                      className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      Read Full Guide
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </CardHeader>
                </Card>
              </div>
            </div>
          ))}

          {/* All Posts Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.filter(post => !post.featured).map(post => (
              <Card key={post.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-slate-800">
                <CardHeader className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded text-sm">
                      {post.category}
                    </span>
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300 mb-4">
                    {post.description}
                  </CardDescription>
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(post.publishDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-3 w-3" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                  <Link 
                    to={post.slug}
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
                  >
                    Read More
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </CardHeader>
              </Card>
            ))}
          </div>

          {/* Newsletter Signup CTA */}
          <div className="mt-16 bg-blue-600 rounded-lg p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">
              Stay Updated with Resume Tips
            </h2>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Get weekly tips, ATS insights, and career advice delivered to your inbox. Join 10,000+ job seekers who trust our expertise.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <button className="bg-blue-700 hover:bg-blue-800 px-6 py-2 rounded-lg font-medium transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogIndexPage;
