import { useNavigate } from 'react-router-dom';
import { LoginModal } from '../components/auth/LoginModal';

export function LoginPage() {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/');
  };

  const handleSignUpClick = () => {
    navigate('/signup');
  };

  return (
    <LoginModal
      isOpen={true}
      onClose={handleClose}
      onSignUpClick={handleSignUpClick}
    />
  );
}

export default LoginPage;
