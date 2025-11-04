import React, { useRef } from 'react';
import { Briefcase, Search } from 'lucide-react';
import { Button } from '../ui/Button';
import { useJobMatching } from '../../hooks/useJobMatching';
import { JobMatchModal } from './JobMatchModal';

interface FindJobsButtonProps {
  variant?: 'default' | 'outline' | 'ghost' | 'link' | 'secondary' | 'subtle';
  size?: 'default' | 'sm' | 'lg' | 'xl' | 'icon';
  className?: string;
  mobile?: boolean;
}

export function FindJobsButton({ 
  variant = 'default', 
  size = 'sm',
  className = '',
  mobile = false 
}: FindJobsButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { 
    isModalOpen,
    closeModal,
    uploadAndFindJobs,
    isLoading,
    resumeFile
  } = useJobMatching();

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        await uploadAndFindJobs(file);
      } catch (error) {
        console.error('Error handling file upload:', error);
      }
    }
    
    // Reset file input so the same file can be selected again if needed
    if (event.target.value) {
      event.target.value = '';
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.docx"
        style={{ display: 'none' }}
        aria-label="Upload resume for job matching"
      />
      
      {mobile ? (
        <div
          className={`text-sm font-luxury font-medium transition-colors duration-300 flex items-center cursor-pointer ${className}`}
          onClick={handleButtonClick}
        >
          <Search className="h-4 w-4 mr-3" />
          Find Jobs
        </div>
      ) : (
        <Button
          variant={variant}
          size={size}
          className={`flex items-center ${className}`}
          onClick={handleButtonClick}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="animate-pulse">Processing...</span>
          ) : (
            <>
              <Briefcase className="h-4 w-4 mr-2" />
              Find Jobs
            </>
          )}
        </Button>
      )}
      
      <JobMatchModal 
        isOpen={isModalOpen}
        onClose={closeModal}
        file={resumeFile}
      />
    </>
  );
}
