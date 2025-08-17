import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export function ContactUsPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-neutral-100">
      <div className="container mx-auto px-4 md:px-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Contact Us</h1>
        <Card className="border-0 shadow-md dark:shadow-slate-800/20">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Get in Touch</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Have questions or feedback? We're here to help! Reach out via email or through social media.
            </p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-6">
              <li>Email: <a href="mailto:checkresmueai@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline">checkresmueai@gmail.com</a></li>
              <li>Twitter: <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">@ResumeAI</a></li>
              <li>LinkedIn: <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">ResumeAI</a></li>
            </ul>
            {/* Potential contact form for future enhancement */}
            {/* <form> ... </form> */}
          </CardContent>
        </Card>
        <div className="mt-6">
          <Button variant="link" className="text-blue-600 dark:text-blue-400" onClick={() => window.history.back()}>
            &larr; Back
          </Button>
        </div>
      </div>
    </div>
  );
}
