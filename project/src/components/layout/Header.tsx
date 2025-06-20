import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../ui/Button';
import { MenuIcon, X, FileText, Sun, Moon, User } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../hooks/useAuth';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { darkMode, toggleDarkMode } = useTheme();
  const { user, signOut } = useAuth();
  const location = useLocation();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out failed:', error);
      // Optionally show a toast or alert here
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
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

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white dark:bg-slate-900 shadow-md py-2' 
          : 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm py-4'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <FileText className="h-8 w-8 text-blue-600 mr-2" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              ResumeAI
            </span>
          </Link>

          {/* Desktop Navigation - Using flex instead of hidden/flex classes for better visibility */}
          <div className="hidden md:block">
            <nav className={`flex items-center space-x-4 transition-opacity duration-300 ${mounted ? 'opacity-100 animate-fadeInNav' : 'opacity-0'}`}>
              <Link 
                to="/" 
                className={`text-sm font-medium hover:text-blue-600 ${
                  location.pathname === '/'
                    ? 'text-blue-600'
                    : 'text-gray-700 dark:text-gray-200'
                }`}
              >
                Home
              </Link>
              <Link 
                to="/upload" 
                className={`text-sm font-medium hover:text-blue-600 ${
                  location.pathname === '/upload'
                    ? 'text-blue-600'
                    : 'text-gray-700 dark:text-gray-200'
                }`}
              >
                Analyze Resume
              </Link>
              <Link 
                to="/pricing" 
                className={`text-sm font-medium hover:text-blue-600 ${
                  location.pathname === '/pricing'
                    ? 'text-blue-600'
                    : 'text-gray-700 dark:text-gray-200'
                }`}
              >
                Pricing
              </Link>
              <Link 
                to="/faq" 
                className={`text-sm font-medium hover:text-blue-600 ${
                  location.pathname === '/faq'
                    ? 'text-blue-600'
                    : 'text-gray-700 dark:text-gray-200'
                }`}
              >
                FAQ
              </Link>
              <Link 
                to="/blog" 
                className={`text-sm font-medium hover:text-blue-600 ${
                  location.pathname.startsWith('/blog')
                    ? 'text-blue-600'
                    : 'text-gray-700 dark:text-gray-200'
                }`}
              >
                Blog
              </Link>
              {/* Dark Mode Toggle */}
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleDarkMode} 
                className="p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all rounded-full"
                aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {darkMode ? 
                  <Sun className="h-5 w-5 text-amber-500 dark:text-amber-300" /> : 
                  <Moon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                }
              </Button>
              {user ? (
                <div className="flex items-center space-x-2">
                  <Link to="/profile" className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600">
                    <User className="h-5 w-5 mr-1" />
                    Profile
                  </Link>
                  <Button variant="outline" size="sm" onClick={handleSignOut}>
                    Log Out
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link to="/login">
                    <Button variant="outline" size="sm">
                      Log In
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button size="sm">Sign Up</Button>
                  </Link>
                </div>
              )}
            </nav>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-700 dark:text-gray-200"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 bg-white dark:bg-slate-900 rounded-lg shadow-lg animate-fadeIn">
            <nav className="flex flex-col space-y-3 p-4">
              <Link 
                to="/" 
                className={`text-sm font-medium hover:text-blue-600 transition-colors ${
                  location.pathname === '/' ? 'text-blue-600' : 'text-gray-700 dark:text-gray-200'
                }`}
              >
                Home
              </Link>
              <Link 
                to="/upload" 
                className={`text-sm font-medium hover:text-blue-600 transition-colors ${
                  location.pathname === '/upload' ? 'text-blue-600' : 'text-gray-700 dark:text-gray-200'
                }`}
              >
                Analyze Resume
              </Link>
              <Link 
                to="/pricing" 
                className={`text-sm font-medium hover:text-blue-600 transition-colors ${
                  location.pathname === '/pricing' ? 'text-blue-600' : 'text-gray-700 dark:text-gray-200'
                }`}
              >
                Pricing
              </Link>
              <Link 
                to="/faq" 
                className={`text-sm font-medium hover:text-blue-600 transition-colors ${
                  location.pathname === '/faq' ? 'text-blue-600' : 'text-gray-700 dark:text-gray-200'
                }`}
              >
                FAQ
              </Link>
              <Link 
                to="/blog" 
                className={`text-sm font-medium hover:text-blue-600 transition-colors ${
                  location.pathname.startsWith('/blog') ? 'text-blue-600' : 'text-gray-700 dark:text-gray-200'
                }`}
              >
                Blog
              </Link>
              {/* Dark Mode Toggle in Mobile Menu */}
              <button onClick={toggleDarkMode} className="flex items-center p-2 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white">
                {darkMode ? <Sun className="mr-2 h-5 w-5" /> : <Moon className="mr-2 h-5 w-5" />}
                {darkMode ? 'Light Mode' : 'Dark Mode'}
              </button>
              <div className="flex flex-col space-y-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                {user ? (
                  <>
                    <Link to="/profile">
                      <Button variant="outline" className="w-full">
                        <User className="mr-2 h-5 w-5" />
                        Profile
                      </Button>
                    </Link>
                    <Button className="w-full" onClick={handleSignOut}>
                      Log Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login">
                      <Button variant="outline" className="w-full">
                        Log In
                      </Button>
                    </Link>
                    <Link to="/signup">
                      <Button className="w-full">Sign Up</Button>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}