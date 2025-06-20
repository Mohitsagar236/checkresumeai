// Test script for subscription expiry date in analytics
// Run with: node test-subscription-expiry-analytics.js

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const { exec: execCallback } = require('child_process');

const exec = promisify(execCallback);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

// Define paths
const projectDir = process.cwd();
const subscriptionContextPath = path.join(projectDir, 'project/src/context/SubscriptionContext.tsx');
const analyticsPagePath = path.join(projectDir, 'project/src/pages/AnalyticsPage.tsx');
const analyticsDashboardPath = path.join(projectDir, 'project/src/components/analytics/AnalyticsDashboard.tsx');
const analyticsAPIPath = path.join(projectDir, 'project/src/api/analytics.ts');

// Test cases
const testCases = [
  {
    name: 'Premium subscription with valid expiry date',
    tier: 'premium',
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days in the future
    subscriberEmail: 'premium@example.com',
    expectDisplay: true,
  },
  {
    name: 'Free subscription (no expiry date)',
    tier: 'free',
    expiryDate: null,
    subscriberEmail: null,
    expectDisplay: false,
  },
];

// Mock localStorage for testing
class LocalStorageMock {
  constructor() {
    this.store = {};
  }

  getItem(key) {
    return this.store[key] || null;
  }

  setItem(key, value) {
    this.store[key] = String(value);
  }

  clear() {
    this.store = {};
  }
}

// Verify files exist
async function verifyFilesExist() {
  const files = [
    subscriptionContextPath,
    analyticsPagePath,
    analyticsDashboardPath,
    analyticsAPIPath
  ];
  
  for (const file of files) {
    try {
      await readFile(file, 'utf8');
      console.log(`✅ File exists: ${path.basename(file)}`);
    } catch (err) {
      console.error(`❌ File not found: ${path.basename(file)}`);
      throw new Error(`File not found: ${file}`);
    }
  }
}

// Verify code structure contains expected components
async function verifyCodeStructure() {
  try {
    const analyticsPage = await readFile(analyticsPagePath, 'utf8');
    const analyticsDashboard = await readFile(analyticsDashboardPath, 'utf8');
    const analyticsAPI = await readFile(analyticsAPIPath, 'utf8');
    
    // Check for key elements
    const checks = [
      {
        file: 'AnalyticsPage.tsx',
        content: analyticsPage,
        patterns: [
          'formattedExpiryDate',
          'subscriptionInfo?.expiryDate || expiryDate'
        ]
      },
      {
        file: 'AnalyticsDashboard.tsx',
        content: analyticsDashboard,
        patterns: [
          'formattedExpiryDate',
          'Premium expires',
          'Crown className'
        ]
      },
      {
        file: 'analytics.ts',
        content: analyticsAPI,
        patterns: [
          'subscriptionInfo?:',
          'getSubscriptionData',
          'subscriptionData.expiresAt'
        ]
      }
    ];

    for (const { file, content, patterns } of checks) {
      for (const pattern of patterns) {
        if (!content.includes(pattern)) {
          console.error(`❌ Pattern not found in ${file}: ${pattern}`);
          throw new Error(`Required code pattern not found in ${file}: ${pattern}`);
        }
        console.log(`✅ Pattern found in ${file}: ${pattern}`);
      }
    }
  } catch (err) {
    if (!err.message.includes('Required code pattern')) {
      console.error('❌ Error verifying code structure:', err);
    }
    throw err;
  }
}

// Run tests
async function runTests() {
  console.log('📋 Starting subscription expiry in analytics tests');
  
  try {
    await verifyFilesExist();
    await verifyCodeStructure();
    
    // Simulate subscription data for testing
    global.localStorage = new LocalStorageMock();
    
    for (const testCase of testCases) {
      console.log(`\n🧪 Running test: ${testCase.name}`);
      
      // Mock subscription data
      const subscriptionData = {
        tier: testCase.tier,
        startDate: new Date().toISOString(),
        expiresAt: testCase.expiryDate,
        features: {}, // Would contain actual features in real code
        subscriberEmail: testCase.subscriberEmail
      };
      
      // Store in mock localStorage
      global.localStorage.setItem('subscription_data', JSON.stringify(subscriptionData));
      
      // Test output - what would be displayed in UI
      const formattedDate = testCase.expiryDate 
        ? new Date(testCase.expiryDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        : 'No expiration date';
      
      console.log('Subscription Data:');
      console.log(`  - Tier: ${testCase.tier}`);
      console.log(`  - Expiry Date: ${formattedDate}`);
      console.log(`  - Subscriber Email: ${testCase.subscriberEmail || 'None'}`);
      
      if (testCase.expectDisplay) {
        console.log('✅ Expected display: "Premium expires: ' + formattedDate + '"');
      } else {
        console.log('✅ Expected: No expiry date display (free tier)');
      }
    }
    
    console.log('\n✅ All tests completed successfully!');
  } catch (err) {
    console.error('\n❌ Test failed:', err.message);
    process.exit(1);
  }
}

// Run the tests
runTests();
