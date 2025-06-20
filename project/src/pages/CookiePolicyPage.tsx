import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';

export function CookiePolicyPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-neutral-100">
      <div className="container mx-auto px-4 md:px-6 space-y-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Cookie Policy</h1>

        <Card className="border-0 shadow-md dark:shadow-slate-800/20">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">What Are Cookies</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-300">
              Cookies are small data files placed on your device to help websites remember your preferences and activity.
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md dark:shadow-slate-800/20">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Types of Cookies We Use</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300">
              <li>Essential Cookies: Necessary for site functionality.</li>
              <li>Performance Cookies: Help us understand site usage and improve performance.</li>
              <li>Functional Cookies: Remember your settings and preferences.</li>
              <li>Targeting Cookies: Used to show relevant content and ads.</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md dark:shadow-slate-800/20">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Your Choices</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-300">
              You can disable cookies through your browser settings, but this may affect site functionality.
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md dark:shadow-slate-800/20">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Changes to This Policy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-300">
              We may update this Cookie Policy periodically. Continued use indicates acceptance of the changes.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
