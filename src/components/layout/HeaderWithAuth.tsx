import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { MenuIcon, X, FileText, Sun, Moon, LogOut, BarChart3, User } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../hooks/useAuth';

export function HeaderWithAuth() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { darkMode, toggleDarkMode } = useTheme();
  const { user, signOut, profile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Helper function to get user display name
  const getUserDisplayName = () => {
    if (!user) return 'User';
    
    // Try to get full name from user metadata (OAuth users)
    const fullName = user.user_metadata?.full_name || user.user_metadata?.name;
    if (fullName) {
      return fullName;
    }
    
    // Try to get name from profile
    if (profile?.name) {
      return profile.name;
    }
    
    // Fallback to email prefix
    return user.email?.split('@')[0] || 'User';
  };

  // Helper function to get user initials for avatar
  const getUserInitials = () => {
    const displayName = getUserDisplayName();
    if (displayName === 'User' || displayName === user?.email?.split('@')[0]) {
      // If using email fallback, use first letter of email
      return user?.email?.charAt(0).toUpperCase() || 'U';
    }
    
    // Use initials from actual name
    const names = displayName.split(' ');
    if (names.length >= 2) {
      return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
    }
    return displayName.charAt(0).toUpperCase();
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  useEffect(() => {
    // Set mounted to true after component mounts
    setMounted(true);

    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    // Check scroll position immediately on mount
    handleScroll();
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  useEffect(() => {
    // Close menu when route changes
    setIsMenuOpen(false);
  }, [location]);
  useEffect(() => {
    // Prevent body scroll when mobile menu is open
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    // Handle escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isMenuOpen]);
  return (    <header 
      className={`fixed w-full z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-black dark:bg-white shadow-luxury-lg py-3 border-b border-gray-100/50 dark:border-gray-800/50' 
          : 'bg-black dark:bg-white py-5'
      }`}
    >
      {/* Premium gradient accent line */}
      <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent transition-opacity duration-500 ${scrolled ? 'opacity-100' : 'opacity-0'}`}></div>
      
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center group">
            <div className="relative">
              <FileText className="h-9 w-9 text-blue-600 dark:text-blue-400 mr-3 transform group-hover:scale-110 transition-all duration-300" />
              <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>            <span className="text-2xl font-premium-display font-bold bg-gradient-to-r from-white to-gray-300 dark:from-gray-900 dark:to-gray-700 bg-clip-text text-transparent">
              ResumeAI
            </span>
          </Link>          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <nav className={`flex items-center space-x-8 transition-all duration-500 ${mounted ? 'opacity-100 animate-fadeInNav' : 'opacity-0'}`}>              <Link 
                to="/" 
                className={`text-sm font-luxury font-medium transition-all duration-300 hover:text-blue-400 dark:hover:text-blue-600 ${
                  location.pathname === '/'
                    ? 'text-blue-400 dark:text-blue-600 font-semibold'
                    : 'text-gray-300 dark:text-gray-800'
                }`}
              >
                Home
              </Link>              <Link 
                to="/upload" 
                className={`text-sm font-luxury font-medium transition-all duration-300 hover:text-blue-400 dark:hover:text-blue-600 ${
                  location.pathname === '/upload'
                    ? 'text-blue-400 dark:text-blue-600 font-semibold'
                    : 'text-gray-300 dark:text-gray-800'
                }`}
              >
                Analyze Resume
              </Link>
              <Link 
                to="/master" 
                className={`text-sm font-luxury font-medium transition-all duration-300 hover:text-blue-400 dark:hover:text-blue-600 ${
                  location.pathname === '/master'
                    ? 'text-blue-400 dark:text-blue-600 font-semibold'
                    : 'text-gray-300 dark:text-gray-800'
                }`}
              >
                Master CV
              </Link>
              {user && (
                <Link 
                  to="/analytics"                  className={`text-sm font-luxury font-medium transition-all duration-300 hover:text-blue-400 dark:hover:text-blue-600 flex items-center ${
                    location.pathname === '/analytics'
                      ? 'text-blue-400 dark:text-blue-600 font-semibold'
                      : 'text-gray-300 dark:text-gray-800'
                  }`}
                >
                  <BarChart3 className="h-4 w-4 mr-1.5" />
                  Analytics
                </Link>
              )}              <Link 
                to="/pricing" 
                className={`text-sm font-luxury font-medium transition-all duration-300 hover:text-blue-400 dark:hover:text-blue-600 ${
                  location.pathname === '/pricing'
                    ? 'text-blue-400 dark:text-blue-600 font-semibold'
                    : 'text-gray-300 dark:text-gray-800'
                }`}
              >
                Pricing
              </Link>
              <Link 
                to="/faq" 
                className={`text-sm font-luxury font-medium transition-all duration-300 hover:text-blue-400 dark:hover:text-blue-600 ${
                  location.pathname === '/faq'
                    ? 'text-blue-400 dark:text-blue-600 font-semibold'
                    : 'text-gray-300 dark:text-gray-800'
                }`}
              >
                FAQ
              </Link>
              {/* Auth Buttons */}
              <div className="ml-8 flex items-center space-x-4">
                {user ? (
                  <div className="relative group">                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex items-center shadow-sm hover:shadow-md transition-all duration-300 border-gray-700 dark:border-gray-300 hover:border-blue-400 dark:hover:border-blue-600 bg-gray-800 dark:bg-gray-100 text-gray-300 dark:text-gray-800 hover:bg-gray-700 dark:hover:bg-gray-200"
                    >
                      <div className="w-7 h-7 rounded-full bg-gradient-luxury mr-2 flex items-center justify-center text-white text-sm font-medium">
                        {getUserInitials()}
                      </div>
                      <span className="font-medium">{getUserDisplayName()}</span>
                    </Button>                    <div className="absolute right-0 mt-3 w-52 bg-black dark:bg-white border border-gray-700 dark:border-gray-300 shadow-luxury-lg rounded-xl py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <div className="px-4 py-3 border-b border-gray-700 dark:border-gray-300">
                        <p className="text-sm font-medium text-gray-300 dark:text-gray-800">Signed in as</p>
                        <p className="text-sm font-semibold text-gray-200 dark:text-gray-900 truncate">{getUserDisplayName()}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-600 truncate">{user.email}</p>
                      </div>
                      <Link
                        to="/profile"
                        className="w-full text-left px-4 py-3 text-sm text-gray-300 dark:text-gray-800 hover:bg-gray-800 dark:hover:bg-gray-100 flex items-center transition-colors duration-200"
                      >
                        <User className="h-4 w-4 mr-3 text-gray-400 dark:text-gray-600" />
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-sm text-gray-300 dark:text-gray-800 hover:bg-gray-800 dark:hover:bg-gray-100 flex items-center transition-colors duration-200"
                      >
                        <LogOut className="h-4 w-4 mr-3 text-gray-400 dark:text-gray-600" />
                        Sign out
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">                    <Link to="/login">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="font-medium text-gray-300 dark:text-gray-800 hover:bg-gray-800 dark:hover:bg-gray-100 hover:text-blue-400 dark:hover:text-blue-600 transition-all duration-300"
                      >
                        Sign In
                      </Button>
                    </Link>
                    <Link to="/signup">
                      <Button 
                        size="sm"
                        className="btn-premium-luxury font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
                      >
                        Get Started
                      </Button>
                    </Link>
                  </div>
                )}
                <button
                  onClick={toggleDarkMode}
                  className="h-9 w-9 rounded-xl flex items-center justify-center text-gray-300 dark:text-gray-600 hover:bg-gray-800 dark:hover:bg-gray-100 border border-gray-700 dark:border-gray-300 hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-300 shadow-sm hover:shadow-md"
                  aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </button>
              </div>
            </nav>
          </div>          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center space-x-3">            <button
              onClick={toggleDarkMode}
              className="h-9 w-9 rounded-xl flex items-center justify-center text-gray-300 dark:text-gray-600 hover:bg-gray-800 dark:hover:bg-gray-100 border border-gray-700 dark:border-gray-300 transition-all duration-300"
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button 
              onClick={toggleMenu}
              className="h-9 w-9 rounded-xl flex items-center justify-center text-gray-300 dark:text-gray-600 hover:bg-gray-800 dark:hover:bg-gray-100 border border-gray-700 dark:border-gray-300 hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-300"
              aria-label="Toggle menu"
            >
              <MenuIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>      {/* Navigation Menu/Sidebar */}
      <div className={`fixed inset-0 z-50 transition-all duration-300 ${isMenuOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}>
        {/* Dark Semi-transparent Backdrop */}
        <div 
          className="absolute inset-0 bg-black/40 backdrop-blur-md"
          onClick={toggleMenu}
        ></div>
          {/* Menu Panel - Slides from left, 75% width on mobile, 30% on desktop */}
        <div className={`absolute left-0 top-0 h-full w-[75%] md:w-[30%] bg-black dark:bg-white shadow-luxury-xl border-r border-gray-700 dark:border-gray-300 transform transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>          <div className="flex justify-between items-center p-6 border-b border-gray-700 dark:border-gray-300">
            <span className="text-xl font-premium-display font-bold bg-gradient-to-r from-white to-gray-300 dark:from-gray-900 dark:to-gray-700 bg-clip-text text-transparent">Navigation</span>
            <button 
              onClick={toggleMenu}
              className="h-9 w-9 rounded-xl flex items-center justify-center text-gray-300 dark:text-gray-600 hover:bg-gray-800 dark:hover:bg-gray-100 transition-all duration-300"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>          <nav className="px-6 py-8 space-y-6 flex-1">
            <Link 
              to="/" 
              className={`block text-lg font-luxury font-medium transition-colors duration-300 ${
                location.pathname === '/'
                  ? 'text-blue-400 dark:text-blue-600'
                  : 'text-gray-300 dark:text-gray-800 hover:text-blue-400 dark:hover:text-blue-600'
              }`}
              onClick={toggleMenu}
            >
              Home
            </Link>            <Link 
              to="/upload" 
              className={`block text-lg font-luxury font-medium transition-colors duration-300 ${
                location.pathname === '/upload'
                  ? 'text-blue-400 dark:text-blue-600'
                  : 'text-gray-300 dark:text-gray-800 hover:text-blue-400 dark:hover:text-blue-600'
              }`}
              onClick={toggleMenu}
            >
              Analyze Resume
            </Link>
            <Link 
              to="/master" 
              className={`block text-lg font-luxury font-medium transition-colors duration-300 ${
                location.pathname === '/master'
                  ? 'text-blue-400 dark:text-blue-600'
                  : 'text-gray-300 dark:text-gray-800 hover:text-blue-400 dark:hover:text-blue-600'
              }`}
              onClick={toggleMenu}
            >
              Master CV
            </Link>
            {user && (
              <Link 
                to="/analytics"
                className={`text-lg font-luxury font-medium transition-colors duration-300 flex items-center ${
                  location.pathname === '/analytics'
                    ? 'text-blue-400 dark:text-blue-600'
                    : 'text-gray-300 dark:text-gray-800 hover:text-blue-400 dark:hover:text-blue-600'
                }`}
                onClick={toggleMenu}
              >
                <BarChart3 className="h-5 w-5 mr-3" />
                Analytics
              </Link>
            )}
            <Link 
              to="/pricing" 
              className={`block text-lg font-luxury font-medium transition-colors duration-300 ${
                location.pathname === '/pricing'
                  ? 'text-blue-400 dark:text-blue-600'
                  : 'text-gray-300 dark:text-gray-800 hover:text-blue-400 dark:hover:text-blue-600'
              }`}
              onClick={toggleMenu}
            >
              Pricing
            </Link>            <Link 
              to="/faq" 
              className={`block text-lg font-luxury font-medium transition-colors duration-300 ${
                location.pathname === '/faq'
                  ? 'text-blue-400 dark:text-blue-600'
                  : 'text-gray-300 dark:text-gray-800 hover:text-blue-400 dark:hover:text-blue-600'
              }`}
              onClick={toggleMenu}
            >
              FAQ
            </Link>
            {user && (
              <Link 
                to="/profile" 
                className={`text-lg font-luxury font-medium transition-colors duration-300 flex items-center ${
                  location.pathname === '/profile'
                    ? 'text-blue-400 dark:text-blue-600'
                    : 'text-gray-300 dark:text-gray-800 hover:text-blue-400 dark:hover:text-blue-600'
                }`}
                onClick={toggleMenu}
              >
                <User className="h-5 w-5 mr-3" />
                Profile
              </Link>
            )}
          </nav>

          {/* User Info and Sign Out at Bottom */}
          {user && (
            <div className="px-6 pb-6 mt-auto border-t border-gray-700 dark:border-gray-300 pt-6">
              <div className="p-4 rounded-xl bg-gray-800 dark:bg-gray-100 border border-gray-700 dark:border-gray-300 mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-luxury mr-3 flex items-center justify-center text-white font-medium">
                    {getUserInitials()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-300 dark:text-gray-800">Signed in as</p>
                    <p className="text-sm font-semibold text-gray-200 dark:text-gray-900 truncate">{getUserDisplayName()}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-600 truncate">{user.email}</p>
                  </div>
                </div>
              </div>
              <Button 
                onClick={handleLogout} 
                variant="outline" 
                className="w-full justify-center font-medium shadow-sm bg-gray-800 dark:bg-gray-100 text-gray-300 dark:text-gray-800 border-gray-700 dark:border-gray-300 hover:bg-gray-700 dark:hover:bg-gray-200"
                size="lg"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          )}

          {/* Auth Buttons for Non-authenticated Users */}
          {!user && (
            <div className="px-6 pb-6 mt-auto border-t border-gray-700 dark:border-gray-300 pt-6 space-y-4">
              <Link to="/login" onClick={toggleMenu} className="block">
                <Button 
                  variant="outline" 
                  className="w-full justify-center font-medium shadow-sm"
                  size="lg"
                >
                  Sign In
                </Button>
              </Link>
              <Link to="/signup" onClick={toggleMenu} className="block">
                <Button 
                  className="w-full justify-center btn-premium-luxury font-medium shadow-md"
                  size="lg"
                >
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default HeaderWithAuth;
