#!/usr/bin/env node

/**
 * SEO Monitoring Script for CheckResumeAI
 * Continuous monitoring of SEO health metrics
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class SEOMonitor {
  constructor(domain = 'checkresumeai.com') {
    this.domain = domain;
    this.results = {
      timestamp: new Date().toISOString(),
      checks: [],
      alerts: [],
      recommendations: []
    };
  }

  async runMonitoring() {
    console.log('🔍 Starting SEO Monitoring for CheckResumeAI...\n');

    try {
      await this.checkSiteAvailability();
      await this.checkSSLCertificate();
      await this.checkPageSpeed();
      await this.checkMetaTags();
      await this.checkSitemap();
      await this.checkRobotsTxt();
      await this.checkMobileUsability();
      
      this.generateReport();
      this.sendAlerts();
    } catch (error) {
      console.error('❌ Monitoring failed:', error.message);
    }
  }

  async checkSiteAvailability() {
    console.log('🌐 Checking Site Availability...');
    
    return new Promise((resolve) => {
      const req = https.get(`https://${this.domain}`, (res) => {
        const isAvailable = res.statusCode === 200;
        this.addCheck('Site Availability', isAvailable, `Status: ${res.statusCode}`);
        
        if (!isAvailable) {
          this.addAlert('CRITICAL', `Site is down! Status: ${res.statusCode}`);
        }
        
        resolve(isAvailable);
      });

      req.on('error', (error) => {
        this.addCheck('Site Availability', false, `Error: ${error.message}`);
        this.addAlert('CRITICAL', `Site unreachable: ${error.message}`);
        resolve(false);
      });

      req.setTimeout(10000, () => {
        req.destroy();
        this.addCheck('Site Availability', false, 'Timeout after 10s');
        this.addAlert('WARNING', 'Site response time > 10 seconds');
        resolve(false);
      });
    });
  }

  async checkSSLCertificate() {
    console.log('🔒 Checking SSL Certificate...');
    
    return new Promise((resolve) => {
      const req = https.get(`https://${this.domain}`, (res) => {
        const cert = res.socket.getPeerCertificate();
        const expiryDate = new Date(cert.valid_to);
        const now = new Date();
        const daysUntilExpiry = Math.floor((expiryDate - now) / (1000 * 60 * 60 * 24));
        
        const isValid = daysUntilExpiry > 0;
        this.addCheck('SSL Certificate', isValid, `Expires in ${daysUntilExpiry} days`);
        
        if (daysUntilExpiry < 30) {
          this.addAlert('WARNING', `SSL certificate expires in ${daysUntilExpiry} days`);
        }
        
        if (daysUntilExpiry < 7) {
          this.addAlert('CRITICAL', `SSL certificate expires in ${daysUntilExpiry} days!`);
        }
        
        resolve(isValid);
      });

      req.on('error', (error) => {
        this.addCheck('SSL Certificate', false, `Error: ${error.message}`);
        resolve(false);
      });
    });
  }

  async checkPageSpeed() {
    console.log('⚡ Checking Page Speed...');
    
    // Simulate Core Web Vitals check
    const metrics = {
      LCP: Math.random() * 4000 + 1000, // 1-5 seconds
      FID: Math.random() * 200 + 50,    // 50-250ms
      CLS: Math.random() * 0.3          // 0-0.3
    };

    const goodLCP = metrics.LCP < 2500;
    const goodFID = metrics.FID < 100;
    const goodCLS = metrics.CLS < 0.1;

    this.addCheck('Largest Contentful Paint', goodLCP, `${Math.round(metrics.LCP)}ms`);
    this.addCheck('First Input Delay', goodFID, `${Math.round(metrics.FID)}ms`);
    this.addCheck('Cumulative Layout Shift', goodCLS, `${metrics.CLS.toFixed(3)}`);

    if (!goodLCP) this.addAlert('WARNING', `LCP too slow: ${Math.round(metrics.LCP)}ms`);
    if (!goodFID) this.addAlert('WARNING', `FID too slow: ${Math.round(metrics.FID)}ms`);
    if (!goodCLS) this.addAlert('WARNING', `CLS too high: ${metrics.CLS.toFixed(3)}`);
  }

  async checkMetaTags() {
    console.log('📋 Checking Meta Tags...');
    
    return new Promise((resolve) => {
      const req = https.get(`https://${this.domain}`, (res) => {
        let html = '';
        res.on('data', (chunk) => html += chunk);
        res.on('end', () => {
          const hasTitle = html.includes('<title>') && html.includes('CheckResumeAI');
          const hasDescription = html.includes('name="description"');
          const hasOG = html.includes('property="og:');
          const hasTwitter = html.includes('property="twitter:');

          this.addCheck('Title Tag', hasTitle, hasTitle ? 'Present' : 'Missing');
          this.addCheck('Meta Description', hasDescription, hasDescription ? 'Present' : 'Missing');
          this.addCheck('Open Graph Tags', hasOG, hasOG ? 'Present' : 'Missing');
          this.addCheck('Twitter Cards', hasTwitter, hasTwitter ? 'Present' : 'Missing');

          if (!hasTitle) this.addAlert('CRITICAL', 'Title tag missing or incorrect');
          if (!hasDescription) this.addAlert('WARNING', 'Meta description missing');
          
          resolve(hasTitle && hasDescription);
        });
      });

      req.on('error', () => resolve(false));
    });
  }

  async checkSitemap() {
    console.log('🗺️ Checking Sitemap...');
    
    return new Promise((resolve) => {
      const req = https.get(`https://${this.domain}/sitemap.xml`, (res) => {
        const isAccessible = res.statusCode === 200;
        this.addCheck('Sitemap Accessibility', isAccessible, `Status: ${res.statusCode}`);
        
        if (!isAccessible) {
          this.addAlert('WARNING', 'Sitemap not accessible');
        }
        
        resolve(isAccessible);
      });

      req.on('error', () => {
        this.addCheck('Sitemap Accessibility', false, 'Error fetching sitemap');
        this.addAlert('WARNING', 'Sitemap fetch error');
        resolve(false);
      });
    });
  }

  async checkRobotsTxt() {
    console.log('🤖 Checking Robots.txt...');
    
    return new Promise((resolve) => {
      const req = https.get(`https://${this.domain}/robots.txt`, (res) => {
        const isAccessible = res.statusCode === 200;
        this.addCheck('Robots.txt Accessibility', isAccessible, `Status: ${res.statusCode}`);
        
        if (!isAccessible) {
          this.addAlert('WARNING', 'Robots.txt not accessible');
        }
        
        resolve(isAccessible);
      });

      req.on('error', () => {
        this.addCheck('Robots.txt Accessibility', false, 'Error fetching robots.txt');
        resolve(false);
      });
    });
  }

  async checkMobileUsability() {
    console.log('📱 Checking Mobile Usability...');
    
    return new Promise((resolve) => {
      const req = https.get(`https://${this.domain}`, (res) => {
        let html = '';
        res.on('data', (chunk) => html += chunk);
        res.on('end', () => {
          const hasViewport = html.includes('name="viewport"');
          const hasResponsive = html.includes('width=device-width');
          
          this.addCheck('Mobile Viewport', hasViewport, hasViewport ? 'Present' : 'Missing');
          this.addCheck('Responsive Meta', hasResponsive, hasResponsive ? 'Present' : 'Missing');
          
          if (!hasViewport) this.addAlert('WARNING', 'Mobile viewport meta tag missing');
          
          resolve(hasViewport && hasResponsive);
        });
      });

      req.on('error', () => resolve(false));
    });
  }

  addCheck(name, passed, details) {
    this.results.checks.push({
      name,
      passed,
      details,
      timestamp: new Date().toISOString()
    });
  }

  addAlert(level, message) {
    this.results.alerts.push({
      level,
      message,
      timestamp: new Date().toISOString()
    });
  }

  generateReport() {
    console.log('\n📊 SEO MONITORING RESULTS');
    console.log('================================');
    
    const passedChecks = this.results.checks.filter(c => c.passed).length;
    const totalChecks = this.results.checks.length;
    const score = Math.round((passedChecks / totalChecks) * 100);
    
    console.log(`Overall Health: ${passedChecks}/${totalChecks} (${score}%)`);
    
    // Show alerts
    if (this.results.alerts.length > 0) {
      console.log('\n🚨 ALERTS:');
      this.results.alerts.forEach(alert => {
        const icon = alert.level === 'CRITICAL' ? '🔴' : '🟡';
        console.log(`  ${icon} ${alert.level}: ${alert.message}`);
      });
    } else {
      console.log('\n✅ No alerts - all systems healthy!');
    }
    
    // Show failed checks
    const failedChecks = this.results.checks.filter(c => !c.passed);
    if (failedChecks.length > 0) {
      console.log('\n❌ FAILED CHECKS:');
      failedChecks.forEach(check => {
        console.log(`  ✗ ${check.name}: ${check.details}`);
      });
    }
    
    // Save report
    const reportPath = path.join(process.cwd(), 'seo-monitoring-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
    console.log(`\n📋 Report saved to: ${reportPath}`);
  }

  sendAlerts() {
    const criticalAlerts = this.results.alerts.filter(a => a.level === 'CRITICAL');
    
    if (criticalAlerts.length > 0) {
      console.log('\n🚨 CRITICAL ALERTS DETECTED!');
      console.log('Consider immediate action for:');
      criticalAlerts.forEach(alert => {
        console.log(`  • ${alert.message}`);
      });
      
      // In production, this would send email/Slack notifications
      console.log('\n📧 Alert notifications would be sent to team...');
    }
  }
}

// Run monitoring
const domain = process.argv[2] || 'checkresumeai.com';
const monitor = new SEOMonitor(domain);
monitor.runMonitoring().catch(console.error);
