import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';
import { User, LogOut } from 'lucide-react';

export function Navigation() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleGetStartedClick = (e: React.MouseEvent) => {
    console.log('Navigation Get Started button clicked!');
    e.preventDefault();
    
    try {
      navigate('/pricing');
      console.log('Navigation to /pricing attempted');
    } catch (error) {
      console.error('Navigation failed:', error);
      window.location.href = '/pricing';
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out failed:', error);
      // Optionally show a toast or alert here
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-brand-600">
              Resume Analyzer
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400"
                >
                  <User className="h-5 w-5" />
                  <span>Profile</span>
                </Link>                <Button
                  variant="ghost"
                  onClick={handleSignOut}
                  className="flex items-center space-x-2"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login">
                  <Button variant="ghost">Sign In</Button>
                </Link>                <Link to="/pricing" onClick={handleGetStartedClick}>
                  <Button>Get Started</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 