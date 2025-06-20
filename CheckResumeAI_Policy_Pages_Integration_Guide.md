# Policy Pages Integration Guide for CheckResumeAI

This guide explains how to integrate the policy pages you've created into your React application and ensure they're properly linked for Razorpay compliance.

## Step 1: Create Policy Page Components

Create React components for each policy page in your `src/pages` directory:

### ContactPage.tsx
```tsx
import React from 'react';
import { Helmet } from 'react-helmet-async';

const ContactPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Contact Us - CheckResumeAI</title>
        <meta name="description" content="Contact CheckResumeAI for support, sales inquiries, or partnership opportunities." />
      </Helmet>
      <div className="container mx-auto px-4 py-16 md:py-24 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Contact Us</h1>
        
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Get in Touch with CheckResumeAI</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Thank you for your interest in CheckResumeAI. We're here to help with any questions, concerns, or feedback you may have about our AI-powered resume analysis platform.
          </p>
        </section>

        {/* Customer Support Section */}
        <section className="mb-8">
          <h3 className="text-xl font-semibold mb-3">Customer Support</h3>
          <p className="mb-2"><strong>Email:</strong> support@checkresumeai.com</p>
          <p className="mb-2"><strong>Response Time:</strong> Within 24 hours (standard support) / Within 4 hours (premium support)</p>
        </section>

        {/* Additional Contact Sections - Sales, Enterprise, etc. */}
        {/* ... Add more sections from your Contact Us markdown ... */}

        {/* Contact Form */}
        <section className="mt-12 bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold mb-4">Send Us a Message</h3>
          <form className="space-y-4">
            <div>
              <label htmlFor="name" className="block mb-1 font-medium">Name</label>
              <input 
                type="text" 
                id="name" 
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your Name" 
              />
            </div>
            <div>
              <label htmlFor="email" className="block mb-1 font-medium">Email</label>
              <input 
                type="email" 
                id="email" 
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your Email" 
              />
            </div>
            <div>
              <label htmlFor="subject" className="block mb-1 font-medium">Subject</label>
              <select 
                id="subject" 
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="support">Technical Support</option>
                <option value="billing">Billing Question</option>
                <option value="feature">Feature Request</option>
                <option value="partnership">Partnership Inquiry</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="message" className="block mb-1 font-medium">Message</label>
              <textarea 
                id="message" 
                rows={5} 
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="How can we help you?" 
              ></textarea>
            </div>
            <button 
              type="submit" 
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Submit
            </button>
          </form>
        </section>
      </div>
    </>
  );
};

export default ContactPage;
```

### Create similar components for other policy pages:
- `TermsPage.tsx`
- `RefundsPage.tsx` 
- `PrivacyPage.tsx`
- `ShippingPage.tsx`

## Step 2: Add Routes to Your Router Configuration

Update your React Router configuration in `src/App.tsx` or your routing file:

```tsx
import { Routes, Route } from 'react-router-dom';
import ContactPage from './pages/ContactPage';
import TermsPage from './pages/TermsPage';
import RefundsPage from './pages/RefundsPage';
import PrivacyPage from './pages/PrivacyPage';
import ShippingPage from './pages/ShippingPage';
// ...other imports

function App() {
  return (
    <Routes>
      {/* Existing routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      
      {/* Policy Pages */}
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/refunds" element={<RefundsPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/shipping" element={<ShippingPage />} />
      
      {/* Other routes */}
    </Routes>
  );
}
```

## Step 3: Add Footer Links to Policy Pages

Create or update your footer component to include links to all policy pages:

```tsx
const Footer = () => {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">CheckResumeAI</h3>
            <p className="text-gray-600 dark:text-gray-400">
              AI-powered resume analysis for the modern job seeker.
            </p>
            {/* Social Media Links */}
            <div className="flex space-x-4 mt-4">
              <a href="https://twitter.com/checkresumeai" className="text-gray-400 hover:text-blue-500">
                <span className="sr-only">Twitter</span>
                {/* Twitter Icon */}
              </a>
              {/* Other social links */}
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li><a href="/features" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">Features</a></li>
              <li><a href="/pricing" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">Pricing</a></li>
              <li><a href="/blog" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">Blog</a></li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="/contact" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">Contact Us</a></li>
              <li><a href="/faq" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">FAQ</a></li>
              <li><a href="/help" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">Help Center</a></li>
            </ul>
          </div>
          
          {/* Legal - Important for Razorpay compliance */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><a href="/terms" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">Terms & Conditions</a></li>
              <li><a href="/privacy" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">Privacy Policy</a></li>
              <li><a href="/refunds" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">Cancellations & Refunds</a></li>
              <li><a href="/shipping" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">Shipping Policy</a></li>
            </ul>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} CheckResumeAI Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
```

## Step 4: Add Links in the Payment Flow

Make sure your payment flow pages also link to the necessary policy pages:

```tsx
const PaymentSection = () => {
  return (
    <div className="payment-section p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      {/* Payment form and elements */}
      
      {/* Policy agreement section - Razorpay requires this */}
      <div className="mt-6 text-sm text-gray-600 dark:text-gray-400">
        <p>
          By proceeding with the payment, you agree to our{' '}
          <a href="/terms" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Terms & Conditions</a>,{' '}
          <a href="/refunds" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Cancellations & Refunds Policy</a>,{' '}
          <a href="/privacy" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Privacy Policy</a>, and{' '}
          <a href="/shipping" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Shipping Policy</a>.
        </p>
      </div>
      
      {/* Payment button */}
      <button 
        className="mt-6 w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Complete Payment
      </button>
    </div>
  );
};
```

## Step 5: Verify Links in Razorpay Dashboard

After deployment, make sure to:

1. Log in to your Razorpay dashboard
2. Go to Settings > Website & App
3. Add all policy page URLs:
   - `https://checkresumeai.vercel.app/contact`
   - `https://checkresumeai.vercel.app/terms`
   - `https://checkresumeai.vercel.app/refunds`
   - `https://checkresumeai.vercel.app/privacy`
   - `https://checkresumeai.vercel.app/shipping`

## Step 6: Testing

After deployment, test all policy pages to ensure they:

1. Are accessible via direct URL
2. Display correctly on both desktop and mobile
3. Have proper formatting and styling
4. Are linked correctly from footer and payment pages

## Best Practices for Policy Pages

1. **Accessibility**: Ensure all policy pages are accessible to screen readers
2. **Print Styling**: Add print-specific CSS for users who want to print policies
3. **Version Control**: Include "Last Updated" dates on all policy pages
4. **Language**: Use clear, straightforward language
5. **Mobile Optimization**: Make sure policies are readable on mobile devices

---

This integration ensures your CheckResumeAI application meets Razorpay's requirements for policy pages. If you make any changes to your policies, remember to update both your Markdown files and the corresponding React components.
