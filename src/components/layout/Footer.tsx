import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Twitter, Linkedin, Facebook, Instagram } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 dark:bg-slate-950 text-white pt-16 pb-8 border-t dark:border-slate-800">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <Link to="/" className="flex items-center mb-4">
              <FileText className="h-7 w-7 text-blue-400 dark:text-blue-300 mr-2 dark:drop-shadow-[0_0_3px_rgba(59,130,246,0.3)]" />
              <span className="text-xl font-bold text-white dark:text-neutral-100">ResumeAI</span>
            </Link>
            <p className="text-gray-400 mb-4 text-sm">
              Using AI to help you land your dream job with an ATS-optimized resume tailored for your target role.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white dark:text-neutral-100 font-semibold mb-4 text-lg dark:shadow-glow">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-400 hover:text-blue-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/upload" className="text-gray-400 hover:text-blue-400 transition-colors">
                  Analyze Resume
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-400 hover:text-blue-400 transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-blue-400 transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white dark:text-neutral-100 font-semibold mb-4 text-lg dark:shadow-glow">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-blue-400 transition-colors">
                  Career Blog
                </Link>
              </li>
              <li>
                <Link to="/resume-tips" className="text-gray-400 hover:text-blue-400 transition-colors">
                  Resume Writing Tips
                </Link>
              </li>
              <li>
                <Link to="/ats-guide" className="text-gray-400 hover:text-blue-400 transition-colors">
                  ATS Guide
                </Link>
              </li>
              <li>
                <Link to="/job-search" className="text-gray-400 hover:text-blue-400 transition-colors">
                  Job Search Strategies
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white dark:text-neutral-100 font-semibold mb-4 text-lg dark:shadow-glow">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-blue-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-blue-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-gray-400 hover:text-blue-400 transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-blue-400 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 dark:border-slate-800/80 mt-12 pt-8 text-center text-sm text-gray-400 dark:text-gray-500">
          <p>© {currentYear} ResumeAI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}