import React from 'react';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-gray-200 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
  <div className="text-sm">&copy; {year} PREP AI</div>
        <div className="flex gap-6 text-sm">
          <button
            className="hover:text-blue-400 transition-colors underline"
            onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'about' }))}
          >
            About
          </button>
          <button
            className="hover:text-blue-400 transition-colors underline"
            onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'contact' }))}
          >
            Contact
          </button>
          <button
            className="hover:text-blue-400 transition-colors underline"
            onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'privacy' }))}
          >
            Privacy Policy
          </button>
        </div>
      </div>
    </footer>
  );
}
