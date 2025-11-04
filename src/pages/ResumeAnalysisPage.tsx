import { useState } from 'react';
import { EnhancedResumeAnalysisHero as ResumeAnalysisHero } from '../components/resume/EnhancedResumeAnalysisHero';
import { mockJobRoles } from '../data/mockData';
import { useAuth } from '../hooks/useAuth';
import { useSubscription } from '../hooks/useSubscription';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { LoginModal } from '../components/auth/LoginModal';
import { SignUpModal } from '../components/auth/SignupModal';

export function ResumeAnalysisPage() {
  const { user } = useAuth();
  const { isPremium } = useSubscription();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [file, setFile] = useState<File | null>(null);
  const [jobRole, setJobRole] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  const handleResumeUpload = (selectedFile: File) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    setFile(selectedFile);
    showToast(`Resume "${selectedFile.name}" uploaded successfully!`, 'success');
  };

  const handleJobRoleSelect = (selectedRole: string) => {
    setJobRole(selectedRole);
  };
  const handleSubmit = () => {
    console.log("ResumeAnalysisPage handleSubmit called", { user, file, jobRole });
    
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    if (!file || !jobRole) {
      showToast('Please upload a resume and select a job role.', 'error');
      return;
    }

    showToast('Preparing your analysis results...', 'info');

    try {
      // Create a FileReader to read the file content
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const fileContent = event.target?.result as string;
          const base64Content = fileContent.split('base64,')[1] || '';
          
          // Create URL parameters
          const params = new URLSearchParams();
          params.set('jobRoleId', jobRole);
          params.set('fileName', file.name);
          params.set('fileSize', `${file.size}`);
          params.set('fileType', file.type);
          params.set('resumeContent', base64Content);
          
          console.log("Navigating to results page with params", { 
            jobRoleId: jobRole, 
            fileName: file.name 
          });
          
        // Navigate to results page
          navigate(`/results?${params.toString()}`);
        } catch (error) {
          console.error("Error in FileReader onload:", error);
          showToast('Error processing file. Please try again.', 'error');
        }
      };
      
      reader.onerror = (error) => {
        console.error("FileReader error:", error);
        showToast('Error reading file. Please try again with a different file.', 'error');
      };
      
      // Start reading the file
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      showToast('An unexpected error occurred. Please try again.', 'error');
    }
  };

  return (
    <div className="min-h-screen pt-36 pb-16 bg-gray-50 text-gray-900 dark:bg-slate-900 dark:text-neutral-100">
      <div className="container mx-auto px-4 md:px-6">
        <ResumeAnalysisHero 
          onResumeUpload={handleResumeUpload}
          onJobRoleSelect={handleJobRoleSelect}
          onSubmit={handleSubmit}
          jobRoles={mockJobRoles}
          isPremium={isPremium}
        />
      </div>

      {/* Modals */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)}
        onSignUpClick={() => {
          setShowLoginModal(false);
          setShowSignupModal(true);
        }}
      />
      <SignUpModal
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        onLoginClick={() => {
          setShowSignupModal(false);
          setShowLoginModal(true);
        }}
      />
    </div>
  );
}

export default ResumeAnalysisPage;
