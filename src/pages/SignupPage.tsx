import { useNavigate } from 'react-router-dom';
import { SignUpModal } from '../components/auth/SignupModal';
import { useEffect, useState } from 'react';

export function SignupPage() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Use effect to set modal open after component mounts
  useEffect(() => {
    // Small delay to ensure component is fully mounted
    const timer = setTimeout(() => {
      setIsModalOpen(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      navigate('/');
    }, 300); // Small delay to allow modal closing animation
  };

  const handleLoginClick = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      navigate('/login');
    }, 300); // Small delay to allow modal closing animation
  };

  return (
    <div className="signup-page-container">
      <SignUpModal
        isOpen={isModalOpen}
        onClose={handleClose}
        onLoginClick={handleLoginClick}
      />
    </div>
  );
}

export default SignupPage;
