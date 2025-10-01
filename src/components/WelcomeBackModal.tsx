import React from 'react';
import { AlertCircle, PlayCircle, Trash2 } from 'lucide-react';

interface WelcomeBackModalProps {
  onResume: () => void;
  onStartNew: () => void;
}

export function WelcomeBackModal({ onResume, onStartNew }: WelcomeBackModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Welcome Back!</h2>
            <p className="text-sm text-gray-600">You have an interview in progress</p>
          </div>
        </div>

        <p className="text-gray-700 mb-6">
          We found an incomplete interview session. Would you like to continue where you left off,
          or start a new interview?
        </p>

        <div className="space-y-3">
          <button
            onClick={onResume}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlayCircle className="w-5 h-5" />
            Resume Interview
          </button>

          <button
            onClick={onStartNew}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
            Start New Interview
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-4">
          Starting a new interview will discard your current progress
        </p>
      </div>
    </div>
  );
}
