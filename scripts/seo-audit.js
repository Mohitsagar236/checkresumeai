#!/usr/bin/env node

/**
 * SEO Audit Script for CheckResumeAI
 * Comprehensive analysis of SEO optimization status
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class SEOAuditor {
  constructor(projectPath) {
    this.projectPath = projectPath;
    this.publicPath = path.join(projectPath, 'public');
    this.srcPath = path.join(projectPath, 'src');
    this.results = {
      score: 0,
      maxScore: 0,
      checks: [],
      recommendations: []
    };
  }

  async runAudit() {
    console.log('🔍 Starting SEO Audit for CheckResumeAI...\n');

    // Run all audit checks
    this.checkMetaTags();
    this.checkSitemap();
    this.checkRobotsTxt();
    this.checkStructuredData();
    this.checkImageOptimization();
    this.checkPerformance();
    this.checkMobileOptimization();
    this.checkSSL();
    this.checkCanonicalURLs();
    this.checkSocialMetaTags();
    this.checkHeaderStructure();
    this.checkInternalLinking();
    this.checkPageSpeed();
    this.checkAccessibility();
    this.checkContentOptimization();

    // Calculate final score
    this.calculateScore();
    this.displayResults();
    this.generateReport();
  }

  addCheck(name, passed, description, recommendation = null) {
    this.results.checks.push({
      name,
      passed,
      description,
      recommendation
    });
    this.results.maxScore += 1;
    if (passed) this.results.score += 1;
    if (recommendation) this.results.recommendations.push(recommendation);
  }

  checkMetaTags() {
    console.log('📋 Checking Meta Tags...');
    
    const indexHtml = this.readFile(path.join(this.publicPath, '../index.html'));
    
    if (indexHtml) {
      // Check title tag
      const hasTitle = indexHtml.includes('<title>') && indexHtml.includes('CheckResumeAI');
      this.addCheck(
        'Title Tag',
        hasTitle,
        'Optimized title tag with brand name',
        !hasTitle ? 'Add descriptive title tag with primary keywords' : null
      );

      // Check meta description
      const hasDescription = indexHtml.includes('name="description"') && indexHtml.includes('content="');
      this.addCheck(
        'Meta Description',
        hasDescription,
        'Meta description present and descriptive',
        !hasDescription ? 'Add compelling meta description (150-160 chars)' : null
      );

      // Check keywords
      const hasKeywords = indexHtml.includes('name="keywords"');
      this.addCheck(
        'Meta Keywords',
        hasKeywords,
        'Meta keywords defined for target terms',
        !hasKeywords ? 'Add relevant meta keywords for target terms' : null
      );

      // Check viewport
      const hasViewport = indexHtml.includes('name="viewport"');
      this.addCheck(
        'Viewport Meta Tag',
        hasViewport,
        'Mobile viewport configuration present',
        !hasViewport ? 'Add viewport meta tag for mobile optimization' : null
      );

      // Check robots meta
      const hasRobots = indexHtml.includes('name="robots"');
      this.addCheck(
        'Robots Meta Tag',
        hasRobots,
        'Robots directive specified',
        !hasRobots ? 'Add robots meta tag for crawling instructions' : null
      );
    }
  }

  checkSitemap() {
    console.log('🗺️  Checking Sitemap...');
    
    const sitemapExists = this.fileExists(path.join(this.publicPath, 'sitemap.xml'));
    this.addCheck(
      'XML Sitemap',
      sitemapExists,
      'XML sitemap present for search engines',
      !sitemapExists ? 'Create comprehensive XML sitemap' : null
    );

    if (sitemapExists) {
      const sitemap = this.readFile(path.join(this.publicPath, 'sitemap.xml'));
      const hasUrls = sitemap && sitemap.includes('<url>');
      this.addCheck(
        'Sitemap URLs',
        hasUrls,
        'Sitemap contains URL entries',
        !hasUrls ? 'Add URL entries to sitemap' : null
      );
    }
  }

  checkRobotsTxt() {
    console.log('🤖 Checking Robots.txt...');
    
    const robotsExists = this.fileExists(path.join(this.publicPath, 'robots.txt'));
    this.addCheck(
      'Robots.txt File',
      robotsExists,
      'Robots.txt file exists for crawler instructions',
      !robotsExists ? 'Create robots.txt with proper directives' : null
    );

    if (robotsExists) {
      const robots = this.readFile(path.join(this.publicPath, 'robots.txt'));
      const hasSitemap = robots && robots.includes('Sitemap:');
      this.addCheck(
        'Sitemap in Robots.txt',
        hasSitemap,
        'Sitemap URL specified in robots.txt',
        !hasSitemap ? 'Add sitemap URL to robots.txt' : null
      );
    }
  }

  checkStructuredData() {
    console.log('📊 Checking Structured Data...');
    
    const indexHtml = this.readFile(path.join(this.publicPath, '../index.html'));
    
    if (indexHtml) {
      const hasJsonLd = indexHtml.includes('application/ld+json');
      this.addCheck(
        'JSON-LD Structured Data',
        hasJsonLd,
        'Schema.org structured data implemented',
        !hasJsonLd ? 'Implement JSON-LD structured data for rich snippets' : null
      );

      const hasOrgSchema = indexHtml.includes('"@type": "Organization"') || 
                           indexHtml.includes('"@type": "WebApplication"');
      this.addCheck(
        'Organization Schema',
        hasOrgSchema,
        'Organization/WebApplication schema present',
        !hasOrgSchema ? 'Add Organization or WebApplication schema markup' : null
      );
    }
  }

  checkImageOptimization() {
    console.log('🖼️  Checking Image Optimization...');
    
    const imagesDir = path.join(this.publicPath, 'images');
    const hasImagesDir = this.directoryExists(imagesDir);
    
    this.addCheck(
      'Images Directory',
      hasImagesDir,
      'Organized images directory structure',
      !hasImagesDir ? 'Create organized images directory structure' : null
    );

    // Check for key SEO images
    const ogImageExists = hasImagesDir && this.fileExists(path.join(imagesDir, 'og-image.jpg'));
    this.addCheck(
      'Open Graph Image',
      ogImageExists,
      'Open Graph image for social sharing',
      !ogImageExists ? 'Create optimized Open Graph image (1200x630px)' : null
    );

    const logoExists = hasImagesDir && this.fileExists(path.join(imagesDir, 'logo.png'));
    this.addCheck(
      'Logo File',
      logoExists,
      'Logo file available for branding',
      !logoExists ? 'Add high-quality logo file for branding' : null
    );
  }

  checkPerformance() {
    console.log('⚡ Checking Performance Configuration...');
    
    const vercelConfig = this.readFile(path.join(this.projectPath, 'vercel.json'));
    
    if (vercelConfig) {
      const hasHeaders = vercelConfig.includes('"headers"');
      this.addCheck(
        'Performance Headers',
        hasHeaders,
        'Caching and security headers configured',
        !hasHeaders ? 'Add performance and security headers to vercel.json' : null
      );

      const hasCaching = vercelConfig.includes('Cache-Control');
      this.addCheck(
        'Cache Control Headers',
        hasCaching,
        'Cache control headers for static assets',
        !hasCaching ? 'Implement cache control headers for better performance' : null
      );
    }

    const htaccessExists = this.fileExists(path.join(this.publicPath, '.htaccess'));
    this.addCheck(
      'Apache Configuration',
      htaccessExists,
      '.htaccess file for Apache servers',
      !htaccessExists ? 'Create .htaccess for Apache server optimization' : null
    );
  }

  checkMobileOptimization() {
    console.log('📱 Checking Mobile Optimization...');
    
    const indexHtml = this.readFile(path.join(this.publicPath, '../index.html'));
    
    if (indexHtml) {
      const hasViewport = indexHtml.includes('viewport');
      this.addCheck(
        'Mobile Viewport',
        hasViewport,
        'Mobile viewport meta tag configured',
        !hasViewport ? 'Add mobile viewport meta tag' : null
      );

      const hasResponsiveCSS = indexHtml.includes('width=device-width');
      this.addCheck(
        'Responsive Configuration',
        hasResponsiveCSS,
        'Responsive design viewport configuration',
        !hasResponsiveCSS ? 'Configure responsive design viewport' : null
      );
    }
  }

  checkSSL() {
    console.log('🔒 Checking SSL Configuration...');
    
    const vercelConfig = this.readFile(path.join(this.projectPath, 'vercel.json'));
    
    if (vercelConfig) {
      const hasHTTPS = vercelConfig.includes('https://');
      this.addCheck(
        'HTTPS Configuration',
        hasHTTPS,
        'HTTPS URLs configured in deployment',
        !hasHTTPS ? 'Ensure all URLs use HTTPS protocol' : null
      );

      const hasHSTS = vercelConfig.includes('Strict-Transport-Security');
      this.addCheck(
        'HSTS Headers',
        hasHSTS,
        'HTTP Strict Transport Security headers',
        !hasHSTS ? 'Add HSTS headers for enhanced security' : null
      );
    }
  }

  checkCanonicalURLs() {
    console.log('🔗 Checking Canonical URLs...');
    
    const indexHtml = this.readFile(path.join(this.publicPath, '../index.html'));
    
    if (indexHtml) {
      const hasCanonical = indexHtml.includes('rel="canonical"');
      this.addCheck(
        'Canonical URLs',
        hasCanonical,
        'Canonical URL specified to prevent duplicate content',
        !hasCanonical ? 'Add canonical URL meta tag' : null
      );
    }
  }

  checkSocialMetaTags() {
    console.log('📲 Checking Social Media Meta Tags...');
    
    const indexHtml = this.readFile(path.join(this.publicPath, '../index.html'));
    
    if (indexHtml) {
      const hasOpenGraph = indexHtml.includes('property="og:');
      this.addCheck(
        'Open Graph Tags',
        hasOpenGraph,
        'Open Graph meta tags for Facebook sharing',
        !hasOpenGraph ? 'Add Open Graph meta tags for social sharing' : null
      );

      const hasTwitterCards = indexHtml.includes('property="twitter:');
      this.addCheck(
        'Twitter Card Tags',
        hasTwitterCards,
        'Twitter Card meta tags for Twitter sharing',
        !hasTwitterCards ? 'Add Twitter Card meta tags' : null
      );
    }
  }

  checkHeaderStructure() {
    console.log('📝 Checking Header Structure...');
    
    // This would require analysis of built files or component structure
    // For now, we'll check if components directory exists
    const componentsDir = path.join(this.srcPath, 'components');
    const hasComponents = this.directoryExists(componentsDir);
    
    this.addCheck(
      'Component Structure',
      hasComponents,
      'Organized component structure for maintainable SEO',
      !hasComponents ? 'Organize components for better SEO management' : null
    );
  }

  checkInternalLinking() {
    console.log('🔗 Checking Internal Linking...');
    
    const routesFile = this.fileExists(path.join(this.srcPath, 'routes.tsx')) ||
                       this.fileExists(path.join(this.srcPath, 'routes.ts')) ||
                       this.fileExists(path.join(this.srcPath, 'router.tsx'));
    
    this.addCheck(
      'Routing Structure',
      routesFile,
      'Organized routing structure for internal linking',
      !routesFile ? 'Implement proper routing structure' : null
    );
  }

  checkPageSpeed() {
    console.log('🚀 Checking Page Speed Optimization...');
    
    const viteConfig = this.fileExists(path.join(this.projectPath, 'vite.config.ts'));
    this.addCheck(
      'Build Optimization',
      viteConfig,
      'Vite configuration for optimized builds',
      !viteConfig ? 'Configure Vite for build optimization' : null
    );

    const packageJson = this.readFile(path.join(this.projectPath, 'package.json'));
    if (packageJson) {
      const hasWebVitals = packageJson.includes('web-vitals');
      this.addCheck(
        'Core Web Vitals',
        hasWebVitals,
        'Core Web Vitals monitoring implemented',
        !hasWebVitals ? 'Install and configure web-vitals monitoring' : null
      );
    }
  }

  checkAccessibility() {
    console.log('♿ Checking Accessibility...');
    
    const indexHtml = this.readFile(path.join(this.publicPath, '../index.html'));
    
    if (indexHtml) {
      const hasLang = indexHtml.includes('lang="en"');
      this.addCheck(
        'Language Declaration',
        hasLang,
        'HTML language attribute specified',
        !hasLang ? 'Add lang attribute to HTML element' : null
      );
    }
  }

  checkContentOptimization() {
    console.log('📄 Checking Content Optimization...');
    
    const docsDir = path.join(this.projectPath, 'docs');
    const hasContentStrategy = this.fileExists(path.join(docsDir, 'SEO_CONTENT_STRATEGY.md'));
    
    this.addCheck(
      'Content Strategy',
      hasContentStrategy,
      'SEO content strategy documented',
      !hasContentStrategy ? 'Develop comprehensive SEO content strategy' : null
    );
  }

  calculateScore() {
    this.results.scorePercentage = Math.round((this.results.score / this.results.maxScore) * 100);
  }

  displayResults() {
    console.log('\n📊 SEO AUDIT RESULTS');
    console.log('================================');
    console.log(`Overall Score: ${this.results.score}/${this.results.maxScore} (${this.results.scorePercentage}%)`);
    
    const getGrade = (percentage) => {
      if (percentage >= 90) return { grade: 'A+', color: '\x1b[32m' }; // Green
      if (percentage >= 80) return { grade: 'A', color: '\x1b[32m' };
      if (percentage >= 70) return { grade: 'B', color: '\x1b[33m' }; // Yellow
      if (percentage >= 60) return { grade: 'C', color: '\x1b[33m' };
      return { grade: 'F', color: '\x1b[31m' }; // Red
    };

    const { grade, color } = getGrade(this.results.scorePercentage);
    console.log(`${color}Grade: ${grade}\x1b[0m\n`);

    console.log('✅ PASSED CHECKS:');
    this.results.checks.filter(check => check.passed).forEach(check => {
      console.log(`  ✓ ${check.name}: ${check.description}`);
    });

    console.log('\n❌ FAILED CHECKS:');
    this.results.checks.filter(check => !check.passed).forEach(check => {
      console.log(`  ✗ ${check.name}: ${check.description}`);
    });

    if (this.results.recommendations.length > 0) {
      console.log('\n💡 RECOMMENDATIONS:');
      this.results.recommendations.forEach((rec, index) => {
        console.log(`  ${index + 1}. ${rec}`);
      });
    }

    console.log('\n🎯 NEXT STEPS FOR RANKING #1:');
    if (this.results.scorePercentage < 80) {
      console.log('  • Address failed checks above');
      console.log('  • Focus on technical SEO fundamentals');
    }
    if (this.results.scorePercentage >= 80) {
      console.log('  • Create high-quality, keyword-optimized content');
      console.log('  • Build authoritative backlinks');
      console.log('  • Monitor and improve Core Web Vitals');
    }
    console.log('  • Submit sitemap to Google Search Console');
    console.log('  • Set up Google Analytics 4 tracking');
    console.log('  • Monitor rankings and adjust strategy');
  }

  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      score: this.results.score,
      maxScore: this.results.maxScore,
      percentage: this.results.scorePercentage,
      checks: this.results.checks,
      recommendations: this.results.recommendations
    };

    const reportPath = path.join(this.projectPath, 'seo-audit-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n📋 Detailed report saved to: ${reportPath}`);
  }

  // Utility methods
  fileExists(filePath) {
    try {
      return fs.existsSync(filePath);
    } catch (error) {
      return false;
    }
  }

  directoryExists(dirPath) {
    try {
      return fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
    } catch (error) {
      return false;
    }
  }

  readFile(filePath) {
    try {
      return fs.readFileSync(filePath, 'utf8');
    } catch (error) {
      return null;
    }
  }
}

// Run the audit
const projectPath = process.argv[2] || process.cwd();
const auditor = new SEOAuditor(projectPath);
auditor.runAudit().catch(console.error);
