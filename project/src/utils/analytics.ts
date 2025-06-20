// Google Analytics 4 and Search Console Setup for CheckResumeAI

// Google Analytics 4 Configuration
export const GA4_CONFIG = {
  measurementId: 'G-XXXXXXXXXX', // Replace with your actual GA4 Measurement ID
  config: {
    page_title: document.title,
    page_location: window.location.href,
    send_page_view: true,
    custom_map: {
      'custom_parameter_1': 'resume_analysis_type',
      'custom_parameter_2': 'user_subscription_status'
    }
  }
};

// Initialize Google Analytics 4
export const initializeGA4 = (measurementId: string) => {
  // Create gtag script
  const gtagScript = document.createElement('script');
  gtagScript.async = true;
  gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(gtagScript);

  // Initialize gtag
  window.dataLayer = window.dataLayer || [];
  function gtag(...args: any[]) {
    window.dataLayer.push(args);
  }
  window.gtag = gtag;

  gtag('js', new Date());
  gtag('config', measurementId, {
    page_title: document.title,
    page_location: window.location.href,
    send_page_view: true,
    // Enhanced ecommerce for premium subscriptions
    custom_map: {
      'custom_parameter_1': 'resume_analysis_type',
      'custom_parameter_2': 'user_subscription_status',
      'custom_parameter_3': 'ats_score_range',
      'custom_parameter_4': 'skills_gap_count'
    }
  });
};

// Track resume analysis events
export const trackResumeAnalysis = (analysisType: string, atsScore?: number, skillsGapCount?: number) => {
  if (window.gtag) {
    window.gtag('event', 'resume_analysis', {
      event_category: 'engagement',
      event_label: analysisType,
      custom_parameter_1: analysisType,
      custom_parameter_3: atsScore ? `${Math.floor(atsScore / 20) * 20}-${Math.floor(atsScore / 20) * 20 + 19}` : 'unknown',
      custom_parameter_4: skillsGapCount || 0,
      value: 1
    });
  }
};

// Track premium subscription events
export const trackSubscription = (planType: string, value: number) => {
  if (window.gtag) {
    window.gtag('event', 'purchase', {
      transaction_id: `sub_${Date.now()}`,
      value: value,
      currency: 'INR',
      items: [{
        item_id: planType,
        item_name: `CheckResumeAI ${planType} Plan`,
        item_category: 'subscription',
        quantity: 1,
        price: value
      }]
    });

    // Also track as conversion
    window.gtag('event', 'conversion', {
      send_to: 'AW-XXXXXXXXX/XXXXXXXXXXX', // Replace with your conversion ID
      transaction_id: `sub_${Date.now()}`,
      value: value,
      currency: 'INR'
    });
  }
};

// Track user engagement events
export const trackEngagement = (action: string, label?: string, value?: number) => {
  if (window.gtag) {
    window.gtag('event', action, {
      event_category: 'engagement',
      event_label: label,
      value: value || 1
    });
  }
};

// Track Core Web Vitals for SEO
export const trackWebVitals = () => {
  // This will be called by the useCoreWebVitals hook
  // Already implemented in useSEO.ts
};

// Google Search Console verification meta tag
export const SEARCH_CONSOLE_VERIFICATION = 'google-site-verification-content-here'; // Replace with actual verification code

// Bing Webmaster Tools verification
export const BING_VERIFICATION = 'bing-verification-content-here'; // Replace with actual verification code

// Yandex verification
export const YANDEX_VERIFICATION = 'yandex-verification-content-here'; // Replace with actual verification code

// Google Tag Manager (alternative to GA4)
export const GTM_ID = 'GTM-XXXXXXX'; // Replace with your GTM container ID

export const initializeGTM = (gtmId: string) => {
  // GTM script
  const gtmScript = document.createElement('script');
  gtmScript.innerHTML = `
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','${gtmId}');
  `;
  document.head.appendChild(gtmScript);

  // GTM noscript fallback
  const gtmNoscript = document.createElement('noscript');
  gtmNoscript.innerHTML = `
    <iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}"
    height="0" width="0" style="display:none;visibility:hidden"></iframe>
  `;
  document.body.insertBefore(gtmNoscript, document.body.firstChild);
};

// Facebook Pixel (for social media marketing)
export const FACEBOOK_PIXEL_ID = 'XXXXXXXXXXXXXXX'; // Replace with actual Pixel ID

export const initializeFacebookPixel = (pixelId: string) => {
  if (window.fbq) return;

  const script = document.createElement('script');
  script.innerHTML = `
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '${pixelId}');
    fbq('track', 'PageView');
  `;
  document.head.appendChild(script);

  // Add noscript fallback
  const noscript = document.createElement('noscript');
  noscript.innerHTML = `
    <img height="1" width="1" style="display:none"
    src="https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1" />
  `;
  document.body.appendChild(noscript);
};

// LinkedIn Insight Tag
export const LINKEDIN_PARTNER_ID = 'XXXXXXX'; // Replace with actual Partner ID

export const initializeLinkedInInsight = (partnerId: string) => {
  const script = document.createElement('script');
  script.innerHTML = `
    _linkedin_partner_id = "${partnerId}";
    window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
    window._linkedin_data_partner_ids.push(_linkedin_partner_id);
  `;
  document.head.appendChild(script);

  const insightScript = document.createElement('script');
  insightScript.src = 'https://snap.licdn.com/li.lms-analytics/insight.min.js';
  insightScript.async = true;
  document.head.appendChild(insightScript);

  const noscript = document.createElement('noscript');
  noscript.innerHTML = `
    <img height="1" width="1" style="display:none" alt="" 
    src="https://px.ads.linkedin.com/collect/?pid=${partnerId}&fmt=gif" />
  `;
  document.body.appendChild(noscript);
};

// Initialize all analytics
export const initializeAllAnalytics = () => {
  // Only initialize in production
  if (process.env.NODE_ENV === 'production') {
    // Initialize GA4
    if (GA4_CONFIG.measurementId !== 'G-XXXXXXXXXX') {
      initializeGA4(GA4_CONFIG.measurementId);
    }

    // Initialize GTM (if preferred over GA4)
    if (GTM_ID !== 'GTM-XXXXXXX') {
      initializeGTM(GTM_ID);
    }

    // Initialize Facebook Pixel
    if (FACEBOOK_PIXEL_ID !== 'XXXXXXXXXXXXXXX') {
      initializeFacebookPixel(FACEBOOK_PIXEL_ID);
    }

    // Initialize LinkedIn Insight
    if (LINKEDIN_PARTNER_ID !== 'XXXXXXX') {
      initializeLinkedInInsight(LINKEDIN_PARTNER_ID);
    }
  }
};

// TypeScript declarations
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
    fbq: (...args: any[]) => void;
    _linkedin_partner_id: string;
    _linkedin_data_partner_ids: string[];
  }
}

export default {
  initializeAllAnalytics,
  trackResumeAnalysis,
  trackSubscription,
  trackEngagement
};
