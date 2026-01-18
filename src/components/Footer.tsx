import React from 'react';

const LinkedInIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const Footer: React.FC = () => {
  return (
    <footer className="mt-12 py-6 px-8 bg-slate-100 dark:bg-slate-900 border-t border-slate-300 dark:border-slate-800 text-center text-slate-600 dark:text-slate-400 text-sm">
      <div className="flex flex-col items-center gap-2">
        <p>© 2026 Konstantin Rybakov. All rights reserved.</p>
        <a
          href="https://www.linkedin.com/in/konstantin-rybakov-15245121/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          Get in touch <LinkedInIcon className="inline-block" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
