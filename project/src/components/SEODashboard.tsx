import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOMetrics {
  organicTraffic: number;
  keywordRankings: { keyword: string; position: number; change: number }[];
  backlinks: number;
  coreWebVitals: {
    lcp: number;
    fid: number;
    cls: number;
  };
  siteHealth: {
    score: number;
    issues: string[];
  };
}

const SEODashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<SEOMetrics | null>(null);
  const [timeframe, setTimeframe] = useState('30d');

  useEffect(() => {
    // Simulate fetching SEO metrics
    const fetchMetrics = () => {
      const mockMetrics: SEOMetrics = {
        organicTraffic: 12547,
        keywordRankings: [
          { keyword: 'resume analyzer', position: 3, change: +2 },
          { keyword: 'ATS checker', position: 7, change: +1 },
          { keyword: 'resume scanner', position: 12, change: -1 },
          { keyword: 'CV analyzer', position: 15, change: +5 },
          { keyword: 'resume feedback', position: 8, change: 0 },
        ],
        backlinks: 156,
        coreWebVitals: {
          lcp: 2.1,
          fid: 85,
          cls: 0.08
        },
        siteHealth: {
          score: 92,
          issues: ['Missing alt text on 3 images', 'One broken internal link']
        }
      };
      setMetrics(mockMetrics);
    };

    fetchMetrics();
  }, [timeframe]);

  const getMetricStatus = (value: number, thresholds: { good: number; needs_improvement: number }) => {
    if (value <= thresholds.good) return 'good';
    if (value <= thresholds.needs_improvement) return 'needs-improvement';
    return 'poor';
  };

  const formatChange = (change: number) => {
    if (change > 0) return `+${change}`;
    if (change < 0) return `${change}`;
    return '→';
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  if (!metrics) {
    return <div className="p-8">Loading SEO metrics...</div>;
  }

  return (
    <>
      <Helmet>
        <title>SEO Dashboard - CheckResumeAI Analytics</title>
        <meta name="description" content="Monitor SEO performance, keyword rankings, and site health metrics for CheckResumeAI." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              SEO Performance Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Monitor your SEO metrics and track progress toward #1 rankings
            </p>
          </div>

          {/* Time Range Selector */}
          <div className="mb-6">
            <div className="flex space-x-2">
              {['7d', '30d', '90d', '1y'].map((period) => (
                <button
                  key={period}
                  onClick={() => setTimeframe(period)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    timeframe === period
                      ? 'bg-blue-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Organic Traffic
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {metrics.organicTraffic.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
              <p className="text-sm text-green-600 mt-2">↗ +12.5% from last period</p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Avg. Keyword Position
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {Math.round(metrics.keywordRankings.reduce((acc, k) => acc + k.position, 0) / metrics.keywordRankings.length)}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <p className="text-sm text-green-600 mt-2">↗ +2.1 positions improved</p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Backlinks
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {metrics.backlinks}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
              </div>
              <p className="text-sm text-green-600 mt-2">↗ +23 new this month</p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Site Health Score
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {metrics.siteHealth.score}%
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                {metrics.siteHealth.issues.length} issues to fix
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Keyword Rankings */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Keyword Rankings
              </h2>
              <div className="space-y-4">
                {metrics.keywordRankings.map((keyword, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {keyword.keyword}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Position #{keyword.position}
                      </p>
                    </div>
                    <div className={`text-sm font-medium ${getChangeColor(keyword.change)}`}>
                      {formatChange(keyword.change)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Core Web Vitals */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Core Web Vitals
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Largest Contentful Paint
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {metrics.coreWebVitals.lcp}s
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    getMetricStatus(metrics.coreWebVitals.lcp, { good: 2.5, needs_improvement: 4.0 }) === 'good'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  }`}>
                    Good
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      First Input Delay
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {metrics.coreWebVitals.fid}ms
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    getMetricStatus(metrics.coreWebVitals.fid, { good: 100, needs_improvement: 300 }) === 'good'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  }`}>
                    Good
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Cumulative Layout Shift
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {metrics.coreWebVitals.cls}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    getMetricStatus(metrics.coreWebVitals.cls, { good: 0.1, needs_improvement: 0.25 }) === 'good'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  }`}>
                    Good
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Site Health Issues */}
          {metrics.siteHealth.issues.length > 0 && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Site Health Issues
              </h2>
              <div className="space-y-2">
                {metrics.siteHealth.issues.map((issue, index) => (
                  <div key={index} className="flex items-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <svg className="w-5 h-5 text-yellow-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <span className="text-gray-900 dark:text-white">{issue}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Items */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              🎯 Action Items for This Week
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">Content</h3>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <li>• Publish ATS optimization guide</li>
                  <li>• Update resume templates page</li>
                  <li>• Add FAQ structured data</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">Technical</h3>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <li>• Fix broken internal links</li>
                  <li>• Add missing alt text</li>
                  <li>• Optimize image compression</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SEODashboard;
