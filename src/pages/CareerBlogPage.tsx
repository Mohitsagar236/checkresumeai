import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';

export function CareerBlogPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-neutral-100">
      <div className="container mx-auto px-4 md:px-6 space-y-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Career Blog</h1>
        { [
          { title: '5 Strategies to Fast-Track Your Career Growth', excerpt: 'Learn actionable steps to accelerate promotions and skill development.' },
          { title: 'Navigating Career Transitions: A Step-by-Step Guide', excerpt: 'Tips for successfully switching industries or roles with confidence.' },
          { title: 'Building a Strong Professional Network', excerpt: 'How to connect with influencers and peers to advance your career.' },
        ].map((post, idx) => (
          <Card key={idx} className="border-0 shadow-md dark:shadow-slate-800/20">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">{post.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">{post.excerpt}</p>
              <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline mt-2 block">Read more</a>
            </CardContent>
          </Card>
        )) }
      </div>
    </div>
  );
}
