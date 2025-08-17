import React, { useState, useEffect } from 'react';
import { X, Briefcase, MapPin, Building, ExternalLink, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { parseResumeForJobs } from '../../services/jobs/resumeParseService';
import { fetchJobMatches } from '../../services/jobs/jobMatchService';
import { JobMatch } from '../../types/jobs';

interface JobMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  file?: File | null;
}

export function JobMatchModal({ isOpen, onClose, file }: JobMatchModalProps) {
  const [jobs, setJobs] = useState<JobMatch[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [parsedSkills, setParsedSkills] = useState<string[]>([]);
  const [parsedJobTitles, setParsedJobTitles] = useState<string[]>([]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    // Reset state when modal opens
    if (isOpen && file) {
      handleFindJobs();
    }
  }, [isOpen, file]);

  const handleFindJobs = async () => {
    if (!file) {
      setError('Please upload a resume file first.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Parse resume for job-relevant information
      const parsedData = await parseResumeForJobs(file);
      setParsedSkills(parsedData.skills);
      setParsedJobTitles(parsedData.jobTitles);

      // Fetch matching jobs based on parsed data
      const matchedJobs = await fetchJobMatches(parsedData);
      setJobs(matchedJobs);
    } catch (err) {
      console.error('Error finding jobs:', err);
      setError(typeof err === 'string' ? err : 'An error occurred while finding job matches. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Early render return if modal is closed
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div
        className="absolute inset-0 bg-transparent"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden bg-white dark:bg-slate-900 rounded-xl shadow-luxury-xl border border-gray-200 dark:border-gray-700 animate-scaleIn">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Job Matches Based on Your Resume
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full h-8 w-8"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-10rem)]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="h-10 w-10 text-blue-500 animate-spin mb-4" />
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Finding job matches based on your resume...
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                This may take a few moments
              </p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="rounded-full bg-red-100 dark:bg-red-900/20 p-3 mb-4">
                <X className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              <p className="text-gray-900 dark:text-gray-100 text-lg font-medium mb-2">
                Error Finding Job Matches
              </p>
              <p className="text-gray-600 dark:text-gray-300 max-w-md">
                {error}
              </p>
              <Button className="mt-6" onClick={handleFindJobs}>
                Try Again
              </Button>
            </div>
          ) : jobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="rounded-full bg-yellow-100 dark:bg-yellow-900/20 p-3 mb-4">
                <Briefcase className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
              </div>
              <p className="text-gray-900 dark:text-gray-100 text-lg font-medium mb-2">
                No Job Matches Found
              </p>
              <p className="text-gray-600 dark:text-gray-300 max-w-md">
                We couldn't find any job matches for your profile. Try uploading a more detailed resume or check back later.
              </p>
              <Button className="mt-6" onClick={handleFindJobs}>
                Try Again
              </Button>
            </div>
          ) : (
            <>
              {/* Resume Skills Summary */}
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
                  Skills & Experience Detected from Your Resume
                </h3>
                <div className="flex flex-wrap gap-2">
                  {parsedSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                {parsedJobTitles.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Relevant Experience:</span>{' '}
                      {parsedJobTitles.join(', ')}
                    </p>
                  </div>
                )}
              </div>

              {/* Job List */}
              <div className="grid gap-4">
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="flex justify-between">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                        {job.title}
                      </h3>
                      <div className="flex items-center">
                        <span 
                          className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 font-medium"
                        >
                          {job.matchPercentage}% Match
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3 flex-wrap gap-y-1">
                      <div className="flex items-center mr-4">
                        <Building className="h-4 w-4 mr-1 flex-shrink-0" />
                        {job.company}
                      </div>
                      <div className="flex items-center mr-4">
                        <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                        {job.location}
                      </div>
                    </div>

                    {job.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                        {job.description}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.skills.slice(0, 5).map((skill, index) => (
                        <span
                          key={index}
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                            ${parsedSkills.includes(skill)
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300'
                          }`}
                        >
                          {skill}
                          {parsedSkills.includes(skill) && (
                            <span className="ml-1 text-green-600 dark:text-green-400">✓</span>
                          )}
                        </span>
                      ))}
                      {job.skills.length > 5 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                          +{job.skills.length - 5} more
                        </span>
                      )}
                    </div>

                    <div className="flex justify-end">
                      <a 
                        href={job.applyUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                      >
                        View Job <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer - only show when we have jobs */}
        {jobs.length > 0 && (
          <div className="flex justify-between items-center p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Found {jobs.length} matching jobs
            </p>
            <Button onClick={onClose}>Close</Button>
          </div>
        )}
      </div>
    </div>
  );
}
