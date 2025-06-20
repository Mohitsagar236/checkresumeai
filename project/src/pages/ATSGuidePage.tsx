import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';

export function ATSGuidePage() {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-neutral-100">
      <div className="container mx-auto px-4 md:px-6 space-y-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">ATS Guide</h1>
        { [
          { title: 'Use Standard Headings', content: 'Label sections clearly (e.g., Work Experience, Education) so ATS can parse them.' },
          { title: 'Include Keywords', content: 'Match terminology from the job description to pass keyword scans.' },
          { title: 'Avoid Complex Formatting', content: 'Stick to basic fonts, bullet points, and avoid tables or images.' },
          { title: 'Save as DOCX or PDF', content: 'Use ATS-friendly file formats; some systems struggle with other file types.' },
        ].map((item, idx) => (
          <Card key={idx} className="border-0 shadow-md dark:shadow-slate-800/20">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">{item.content}</p>
            </CardContent>
          </Card>
        )) }
      </div>
    </div>
  );
}
