import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';

export function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen pt-28 pb-16 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-neutral-100">
      <div className="container mx-auto px-4 md:px-6 space-y-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Privacy Policy</h1>
        <Card className="border-0 shadow-md dark:shadow-slate-800/20">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Introduction</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-300">
              We value your privacy and are committed to protecting your personal data. This policy explains what information we collect, how we use it, and your rights.
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md dark:shadow-slate-800/20">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Data Collection</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-300">
              We collect information you provide directly (e.g., resume file, job preferences) and usage data (e.g., pages visited) to improve our services.
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md dark:shadow-slate-800/20">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Data Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-300">
              Your data is used to generate resume analysis results and enhance user experience. We do not share personal information with third parties except as required by law.
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md dark:shadow-slate-800/20">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Data Security</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-300">
              We implement industry-standard security measures such as encryption in transit and at rest to safeguard your information.
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md dark:shadow-slate-800/20">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">User Rights</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-300">
              You have the right to access, rectify, or delete your personal data. Contact us using the details below to exercise these rights.
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md dark:shadow-slate-800/20">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-300">
              For privacy inquiries, email us at <a href="mailto:checkresmueai@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline">checkresmueai@gmail.com</a>.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
