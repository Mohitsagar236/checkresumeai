import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';

export function JobSearchPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-neutral-100">
      <div className="container mx-auto px-4 md:px-6 space-y-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Job Search Strategies</h1>
        {/*
          List of job search strategies. Each strategy includes a title and description.
        */}
        {/*
          - Leverage Networking: Connect with professionals on LinkedIn and attend industry events to uncover hidden opportunities.
          - Optimize Your Profiles: Keep your LinkedIn and online profiles updated with relevant keywords and achievements.
          - Use Multiple Channels: Apply through company websites, job boards, and referrals to diversify your approach.
          - Follow-Up Effectively: Send personalized follow-up emails after interviews to demonstrate interest and professionalism.
        */}
        {/*
          Mapping over the strategies array to create a Card for each strategy.
          Each Card displays the title and description of a job search strategy.
        */}
        {/*
          Note: The keys for the mapped elements are currently set to the index (idx) of the array.
          For better performance and to avoid potential issues, it's recommended to use a unique identifier for each item if available.
        */}
        {/*
          The Card components are styled with Tailwind CSS classes for consistent design.
          - border-0: Removes the border.
          - shadow-md: Applies a medium shadow for depth.
        */}
        {/*
          The text-gray-600 class is used to style the text color of the strategy descriptions.
        */}
        {/*
          Consider adding more strategies or customizing the existing ones to fit your specific job search needs.
        */}
        {/*
          Remember to import any additional components or libraries you may need for extended functionality.
        */}
        {[
          { title: 'Leverage Networking', description: 'Connect with professionals on LinkedIn and attend industry events to uncover hidden opportunities.' },
          { title: 'Optimize Your Profiles', description: 'Keep your LinkedIn and online profiles updated with relevant keywords and achievements.' },
          { title: 'Use Multiple Channels', description: 'Apply through company websites, job boards, and referrals to diversify your approach.' },
          { title: 'Follow-Up Effectively', description: 'Send personalized follow-up emails after interviews to demonstrate interest and professionalism.' },
        ].map((strategy, idx) => (
          <Card key={idx} className="border-0 shadow-md dark:shadow-slate-800/20">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">{strategy.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">{strategy.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
