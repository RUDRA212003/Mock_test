import React, { useState, useEffect, useRef } from 'react';
import { Clock, CheckCircle, Flag } from 'lucide-react';
import { useInterview } from '../contexts/InterviewContext';
export function InterviewChat({ onFinalSubmit }: { onFinalSubmit?: () => void }) {
  const { currentQuestion, timeRemaining, submitAnswer, session } = useInterview();
  const [answer, setAnswer] = useState('');

  // Reset answer when question changes
  useEffect(() => {
    setAnswer('');
  }, [currentQuestion?.id]);

  // Auto-submit if timer runs out: submit answer if present, else submit empty to go to next question
  useEffect(() => {
    if (timeRemaining === 0) {
      if (answer.trim()) {
        submitAnswer(answer);
      } else {
        submitAnswer('');
      }
    }
  }, [timeRemaining, answer, submitAnswer]);

  // Tab switch protection: only warning, no termination
  const [tabSwitchWarned, setTabSwitchWarned] = useState(false);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && session?.status === 'in-progress' && !tabSwitchWarned) {
        alert('Warning: Please stay on this page during the interview. Switching tabs may affect your test.');
        setTabSwitchWarned(true);
      }
    };
    const handleCopy = (e: ClipboardEvent) => {
      if (session?.status === 'in-progress') {
        e.preventDefault();
        alert('Copying is not allowed during the interview.');
      }
    };
    const handleContextMenu = (e: MouseEvent) => {
      if (session?.status === 'in-progress') {
        e.preventDefault();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('contextmenu', handleContextMenu);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [session?.status, tabSwitchWarned]);


  // Submission button handler
  const handleSubmit = () => {
    if (!answer.trim()) return;
    submitAnswer(answer);
  };

  // Skip button handler
  const handleSkip = () => {
    // Submit empty answer and go to next question
    submitAnswer('');
  };

  if (!currentQuestion || !session) {
    return null;
  }

  const progress = ((session.currentQuestionIndex + 1) / session.questions.length) * 100;
  const timePercentage = timeRemaining > 0
    ? (timeRemaining / getTimeLimit(currentQuestion.difficulty)) * 100
    : 0;

  const getTimerColor = () => {
    if (timePercentage > 50) return 'text-green-600';
    if (timePercentage > 25) return 'text-yellow-600';
    return 'text-red-600';
  };

  // ...existing code...

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold">{session.topic} Interview</h2>
              <p className="text-blue-100 mt-1">
                Question {session.currentQuestionIndex + 1} of {session.questions.length}
              </p>
            </div>
            <div className={`flex items-center gap-2 text-2xl font-bold ${getTimerColor()} bg-white px-4 py-2 rounded-lg`}>
              <Clock className="w-6 h-6" />
              {formatTime(timeRemaining)}
            </div>
          </div>
          <div className="w-full bg-blue-800 rounded-full h-2">
            <div
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        <div className="p-8">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                currentQuestion.difficulty === 'easy'
                  ? 'bg-green-100 text-green-700'
                  : currentQuestion.difficulty === 'medium'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-red-100 text-red-700'
              }`}>
                {currentQuestion.difficulty.toUpperCase()}
              </span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800">
              {currentQuestion.text}
            </h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Choose the correct answer
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {Array.isArray(currentQuestion.options) && currentQuestion.options.slice(0, 6).map((option: string) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setAnswer(option)}
                    disabled={timeRemaining === 0}
                    className={`w-full flex items-center justify-center px-4 py-6 rounded-lg border-2 transition-colors font-semibold text-base
                      ${answer === option ? 'border-blue-600 bg-blue-50 text-blue-800' : 'border-gray-300 bg-white text-gray-700'}
                      hover:border-blue-500 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Select one option and click Submit Answer. You can also skip the question if needed.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleSkip}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-400 text-white font-medium rounded-lg hover:bg-gray-500 transition-colors"
                >
                  Skip
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!answer.trim() || timeRemaining === 0}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {/* @ts-ignore */}
                  <Clock className="w-5 h-5" />
                  Submit Answer
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CheckCircle className="w-4 h-4" />
            <span>
              {session.answers.length} of {session.questions.length} questions answered
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function getTimeLimit(difficulty: string): number {
  const limits = { easy: 20, medium: 60, hard: 120 };
  return limits[difficulty as keyof typeof limits] || 60;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
