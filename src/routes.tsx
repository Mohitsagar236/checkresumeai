import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import ErrorPage from './pages/ErrorPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { HomePage } from './pages/HomePage';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { PageLoader } from './components/ui/PageLoader';

// Lazy load heavy pages that are not immediately needed
const UploadPage = lazy(() => import('./pages/UploadPage'));
const FAQPage = lazy(() => import('./pages/FAQPage'));
const PricingPage = lazy(() => import('./pages/PricingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const ResumeCheckPage = lazy(() => import('./pages/ResumeCheckPage'));
const ResumeAnalysisPage = lazy(() => import('./pages/ResumeAnalysisPage'));
const ResultsPage = lazy(() => import('./pages/ResultsPage'));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'));
const MasterCVPage = lazy(() => import('./pages/MasterCVPage'));
const AuthCallback = lazy(() => import('./pages/AuthCallback'));
const ProfilePage = lazy(() => import('./pages/ProfilePageImproved'));

// Blog pages - lazy load since they're content heavy
const BlogIndexPage = lazy(() => import('./pages/BlogIndexPage'));
const CompleteGuideResumeAnalysis = lazy(() => import('./pages/blog/CompleteGuideResumeAnalysis'));
const ATSOptimizationUltimateGuide = lazy(() => import('./pages/blog/ATSOptimizationUltimateGuide'));
const ResumeKeywords2025 = lazy(() => import('./pages/blog/ResumeKeywords2025'));

// Landing pages - lazy load analyzer pages
const ATSOptimizationPage = lazy(() => import('./pages/ATSOptimizationPage'));
const ResumeAnalyzerPage = lazy(() => import('./pages/ResumeAnalyzerPage'));
const ResumeFeedbackPage = lazy(() => import('./pages/ResumeFeedbackPage'));
const ResumeParserPage = lazy(() => import('./pages/ResumeParserPage'));
const ResumeScannerPage = lazy(() => import('./pages/ResumeScannerPage'));
const CVAnalyzerPage = lazy(() => import('./pages/CVAnalyzerPage'));

// Legal pages - lazy load since they're rarely visited initially
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage').then(module => ({ default: module.PrivacyPolicyPage })));
const TermsOfServicePage = lazy(() => import('./pages/TermsOfServicePage').then(module => ({ default: module.TermsOfServicePage })));
const CookiePolicyPage = lazy(() => import('./pages/CookiePolicyPage').then(module => ({ default: module.CookiePolicyPage })));
const ContactUsPage = lazy(() => import('./pages/ContactUsPage').then(module => ({ default: module.ContactUsPage })));

// Resource pages - lazy load
const ResumeTipsPage = lazy(() => import('./pages/ResumeTipsPage').then(module => ({ default: module.ResumeTipsPage })));
const ATSGuidePage = lazy(() => import('./pages/ATSGuidePage').then(module => ({ default: module.ATSGuidePage })));
const JobSearchPage = lazy(() => import('./pages/JobSearchPage').then(module => ({ default: module.JobSearchPage })));

// Feature detail pages - lazy load
const ATSCompatibilityAnalysisPage = lazy(() => import('./pages/features/ATSCompatibilityAnalysisPage'));
const IndustrySpecificInsightsPage = lazy(() => import('./pages/features/IndustrySpecificInsightsPage'));
const SkillsGapAnalysisPage = lazy(() => import('./pages/features/SkillsGapAnalysisPage'));
const KeywordOptimizationPage = lazy(() => import('./pages/features/KeywordOptimizationPage'));
const FormatStructureReviewPage = lazy(() => import('./pages/features/FormatStructureReviewPage'));
const PrivacySecurityPage = lazy(() => import('./pages/features/PrivacySecurityPage'));
const JobMatchAnalysisPage = lazy(() => import('./pages/features/JobMatchAnalysisPage'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/upload',
        element: (
          <Suspense fallback={<PageLoader />}>
            <UploadPage />
          </Suspense>
        ),
      },
      {
        path: '/master',
        element: (
          <Suspense fallback={<PageLoader />}>
            <MasterCVPage />
          </Suspense>
        ),
      },
      {
        path: '/results',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ResultsPage />
          </Suspense>
        ),
      },
      {
        path: '/analytics',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ProtectedRoute>
              <AnalyticsPage />
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: '/profile',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: '/pricing',
        element: (
          <Suspense fallback={<PageLoader />}>
            <PricingPage />
          </Suspense>
        ),
      },
      {
        path: '/faq',
        element: (
          <Suspense fallback={<PageLoader />}>
            <FAQPage />
          </Suspense>
        ),
      },
      {
        path: '/login',
        element: (
          <Suspense fallback={<PageLoader />}>
            <LoginPage />
          </Suspense>
        ),
      },
      {
        path: '/signup',
        element: (
          <Suspense fallback={<PageLoader />}>
            <SignupPage />
          </Suspense>
        ),
      },
      {
        path: '/check',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ResumeCheckPage />
          </Suspense>
        ),
      },
      {
        path: '/resume-analysis',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ResumeAnalysisPage />
          </Suspense>
        ),
      },
      // SEO Landing Pages
      {
        path: '/ats-optimization',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ATSOptimizationPage />
          </Suspense>
        ),
      },
      {
        path: '/resume-analyzer',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ResumeAnalyzerPage />
          </Suspense>
        ),
      },
      {
        path: '/resume-feedback',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ResumeFeedbackPage />
          </Suspense>
        ),
      },
      {
        path: '/resume-parser',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ResumeParserPage />
          </Suspense>
        ),
      },
      {
        path: '/resume-scanner',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ResumeScannerPage />
          </Suspense>
        ),
      },
      {
        path: '/cv-analyzer',
        element: (
          <Suspense fallback={<PageLoader />}>
            <CVAnalyzerPage />
          </Suspense>
        ),
      },
      // Blog routes for SEO content strategy
      {
        path: '/blog',
        element: (
          <Suspense fallback={<PageLoader />}>
            <BlogIndexPage />
          </Suspense>
        ),
      },
      {
        path: '/blog/complete-guide-resume-analysis',
        element: (
          <Suspense fallback={<PageLoader />}>
            <CompleteGuideResumeAnalysis />
          </Suspense>
        ),
      },
      {
        path: '/blog/ats-optimization-ultimate-guide',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ATSOptimizationUltimateGuide />
          </Suspense>
        ),
      },
      {
        path: '/blog/resume-keywords-2025',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ResumeKeywords2025 />
          </Suspense>
        ),
      },
      {
        path: '/blog/powered-insights-2025',
        element: (
          <Suspense fallback={<PageLoader />}>
            <CompleteGuideResumeAnalysis />
          </Suspense>
        ),
      },
      // Legal pages
      {
        path: '/privacy',
        element: (
          <Suspense fallback={<PageLoader />}>
            <PrivacyPolicyPage />
          </Suspense>
        ),
      },
      {
        path: '/terms',
        element: (
          <Suspense fallback={<PageLoader />}>
            <TermsOfServicePage />
          </Suspense>
        ),
      },
      {
        path: '/cookies',
        element: (
          <Suspense fallback={<PageLoader />}>
            <CookiePolicyPage />
          </Suspense>
        ),
      },
      {
        path: '/contact',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ContactUsPage />
          </Suspense>
        ),
      },
      // Resource pages
      {
        path: '/resume-tips',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ResumeTipsPage />
          </Suspense>
        ),
      },
      {
        path: '/ats-guide',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ATSGuidePage />
          </Suspense>
        ),
      },
      {
        path: '/job-search',
        element: (
          <Suspense fallback={<PageLoader />}>
            <JobSearchPage />
          </Suspense>
        ),
      },
      {
        path: '/features/ats-compatibility-analysis',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ATSCompatibilityAnalysisPage />
          </Suspense>
        ),
      },
      {
        path: '/features/industry-specific-insights',
        element: (
          <Suspense fallback={<PageLoader />}>
            <IndustrySpecificInsightsPage />
          </Suspense>
        ),
      },
      {
        path: '/features/skills-gap-analysis',
        element: (
          <Suspense fallback={<PageLoader />}>
            <SkillsGapAnalysisPage />
          </Suspense>
        ),
      },
      {
        path: '/features/keyword-optimization',
        element: (
          <Suspense fallback={<PageLoader />}>
            <KeywordOptimizationPage />
          </Suspense>
        ),
      },
      {
        path: '/features/format-structure-review',
        element: (
          <Suspense fallback={<PageLoader />}>
            <FormatStructureReviewPage />
          </Suspense>
        ),
      },
      {
        path: '/features/privacy-security',
        element: (
          <Suspense fallback={<PageLoader />}>
            <PrivacySecurityPage />
          </Suspense>
        ),
      },
      {
        path: '/features/job-match-analysis',
        element: (
          <Suspense fallback={<PageLoader />}>
            <JobMatchAnalysisPage />
          </Suspense>
        ),
      },
    ]
  },
  {
    path: '/auth/callback',
    element: (
      <Suspense fallback={<PageLoader />}>
        <AuthCallback />
      </Suspense>
    ),
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
