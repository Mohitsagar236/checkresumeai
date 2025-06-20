import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { motion } from 'framer-motion';

export function TermsOfServicePage() {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-800 text-gray-900 dark:text-neutral-100">
      <div className="container mx-auto px-4 md:px-6 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gradient-brand dark:text-gradient-gold mb-3">Terms of Service</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Please read these terms carefully before using our AI-powered resume analysis services.
          </p>
        </motion.div>

        <div className="grid gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card className="border-0 shadow-premium dark:shadow-premium-dark backdrop-blur-sm bg-white/80 dark:bg-slate-800/90">
              <CardHeader>
                <CardTitle className="text-gradient-brand dark:text-gradient-gold flex items-center">
                  1. Acceptance of Terms
                  <Badge variant="premium" className="ml-3">Important</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  By accessing or using ResumeAI ("Service"), you agree to be bound by these Terms of Service.
                  These terms apply to all visitors, users, and others who access or use the Service.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card className="border-0 shadow-premium dark:shadow-premium-dark backdrop-blur-sm bg-white/80 dark:bg-slate-800/90">
              <CardHeader>
                <CardTitle className="text-gradient-brand dark:text-gradient-gold">2. User Responsibilities</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  You agree to provide accurate information, use the Service lawfully, and not to upload harmful or copyrighted content.
                  Users are responsible for maintaining the confidentiality of their account information.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Card className="border-0 shadow-premium dark:shadow-premium-dark backdrop-blur-sm bg-white/80 dark:bg-slate-800/90">
              <CardHeader>
                <CardTitle className="text-gradient-brand dark:text-gradient-gold">3. Intellectual Property</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  All content and materials provided by the Service are the intellectual property of ResumeAI. You may not reproduce or distribute without permission.
                  This includes algorithms, analysis methods, and design elements of our platform.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <Card className="border-0 shadow-premium dark:shadow-premium-dark backdrop-blur-sm bg-white/80 dark:bg-slate-800/90">
              <CardHeader>
                <CardTitle className="text-gradient-brand dark:text-gradient-gold flex items-center">
                  4. Premium Services
                  <Badge variant="premium" className="ml-3">Premium</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Premium subscription services are billed according to the package selected at the time of purchase.
                  Real-time analysis features, enhanced reporting, and priority support are exclusively available to premium users.
                </p>
                <div className="mt-3 p-3 bg-premium-50/40 dark:bg-premium-900/20 border border-premium-100 dark:border-premium-800/30 rounded-md">
                  <p className="text-sm text-premium-800 dark:text-premium-300 font-medium">
                    Premium subscribers enjoy unlimited resume scans, real-time analysis, and priority customer support.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <Card className="border-0 shadow-premium dark:shadow-premium-dark backdrop-blur-sm bg-white/80 dark:bg-slate-800/90">
              <CardHeader>
                <CardTitle className="text-gradient-brand dark:text-gradient-gold">5. Limitation of Liability</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  ResumeAI is provided "as is" and we are not liable for any indirect or consequential damages resulting from your use of the Service.
                  While our AI strives for accuracy, final hiring decisions remain the responsibility of employers.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.6 }}
          >
            <Card className="border-0 shadow-premium dark:shadow-premium-dark backdrop-blur-sm bg-white/80 dark:bg-slate-800/90">
              <CardHeader>
                <CardTitle className="text-gradient-brand dark:text-gradient-gold">6. Changes to Terms</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  We may update these Terms at any time. Continued use of the Service after changes implies acceptance.
                  Users will be notified of significant changes to these terms via email or through the Service.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-12 p-6 bg-glass dark:bg-glass-dark border-premium rounded-2xl text-center"
        >
          <p className="text-gray-600 dark:text-gray-300">
            Last updated: May 24, 2025
          </p>
        </motion.div>
      </div>
    </div>
  );
}
