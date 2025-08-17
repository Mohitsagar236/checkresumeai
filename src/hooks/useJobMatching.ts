import { useState } from 'react';
import { JobMatch } from '../types/jobs';
import { parseResumeForJobs } from '../services/jobs/resumeParseService';
import { fetchJobMatches } from '../services/jobs/jobMatchService';

interface UseJobMatchingResult {
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  uploadAndFindJobs: (file: File) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  resumeFile: File | null;
  matchedJobs: JobMatch[];
}

export function useJobMatching(): UseJobMatchingResult {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [matchedJobs, setMatchedJobs] = useState<JobMatch[]>([]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const uploadAndFindJobs = async (file: File) => {
    setIsLoading(true);
    setError(null);
    setResumeFile(file);
    
    try {
      // Parse the resume
      const parsedData = await parseResumeForJobs(file);
      
      // Fetch matching jobs
      const jobs = await fetchJobMatches(parsedData);
      setMatchedJobs(jobs);
      
      // Open the modal to display results
      openModal();
    } catch (err) {
      console.error('Error in job matching process:', err);
      setError(typeof err === 'string' ? err : 'Failed to process resume for job matching');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isModalOpen,
    openModal,
    closeModal,
    uploadAndFindJobs,
    isLoading,
    error,
    resumeFile,
    matchedJobs
  };
}
