import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';

export function ResumeTipsPage() {
  return (
    <div className="min-h-screen pt-28 pb-16 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-neutral-100">
      <div className="container mx-auto px-4 md:px-6 space-y-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Resume Writing Tips</h1>
        { [
          { title: 'Tailor Your Resume', description: 'Customize your resume for each job application by highlighting relevant skills and experiences.' },
          { title: 'Keep It Concise', description: 'Use bullet points and keep each section brief, focusing on measurable achievements.' },
          { title: 'Highlight Results', description: 'Quantify your accomplishments with data, e.g., "Increased sales by 30% in Q1."' },
          { title: 'Use Clear Formatting', description: 'Choose a clean layout with consistent fonts and spacing for readability.' },
          { title: 'Proofread Thoroughly', description: 'Check for typos, grammatical errors, and ensure all dates and titles are accurate.' },
        ].map((tip, idx) => (
          <Card key={idx} className="border-0 shadow-md dark:shadow-slate-800/20">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">{tip.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">{tip.description}</p>
            </CardContent>
          </Card>
        )) }
      </div>
    </div>
  );
}
