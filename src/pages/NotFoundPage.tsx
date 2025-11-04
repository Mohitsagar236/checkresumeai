import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, Home, Search } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-lg rounded-lg bg-white dark:bg-gray-800 p-8 shadow-lg text-center">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-6">
            <FileQuestion className="h-12 w-12 text-blue-600 dark:text-blue-300" />
          </div>
          
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            404
          </h1>
          
          <h2 className="text-xl font-medium text-gray-800 dark:text-gray-200">
            Page Not Found
          </h2>
          
          <p className="text-gray-600 dark:text-gray-400">
            The page you{"'"}re looking for doesn{"'"}t exist or has been moved.
          </p>
          
          <div className="mt-4 flex flex-col sm:flex-row gap-4">
            <Button asChild variant="default">
              <Link to="/" className="inline-flex items-center gap-2">
                <Home className="h-4 w-4" />
                Go to Homepage
              </Link>
            </Button>
            
            <Button asChild variant="outline">
              <a href="https://docs.resumeanalyzer.app" className="inline-flex items-center gap-2">
                <Search className="h-4 w-4" />
                Browse Documentation
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
