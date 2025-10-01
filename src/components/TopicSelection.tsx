import React, { useState } from 'react';
import { questionDatabase, availableTopics } from '../data/questions';
import { BookOpen, ArrowRight } from 'lucide-react';
import { CandidateInfo } from '../types';

interface TopicSelectionProps {
  candidateInfo: CandidateInfo;
  onTopicSelected: (topic: string, questions?: any[]) => void;
}

export function TopicSelection({ candidateInfo, onTopicSelected }: TopicSelectionProps) {
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [accepted, setAccepted] = useState(false);

  const handleSubmit = () => {
    if (selectedTopic) {
      setLoading(true);
      setTimeout(() => {
        const questions = questionDatabase[selectedTopic] || [];
        onTopicSelected(selectedTopic, questions);
        setLoading(false);
      }, 2000); // 2 seconds loading
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome, {candidateInfo.name}!
          </h2>
          <p className="text-gray-600">
            Select a topic for your interview. You'll be asked 6 questions with varying difficulty levels.
          </p>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Choose Your Topic</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableTopics.map((topic, idx) => {
              // Example labels for topics
              let label = '';
              if (idx === 0) label = 'Trending';
              if (idx === 1) label = 'Most Important';
              if (idx === 2) label = 'Popular';
              return (
                <button
                  key={topic}
                  onClick={() => setSelectedTopic(topic)}
                  className={`p-6 border-2 rounded-lg text-left transition-all ${
                    selectedTopic === topic
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <BookOpen
                      className={`w-6 h-6 ${
                        selectedTopic === topic ? 'text-blue-600' : 'text-gray-400'
                      }`}
                    />
                    <span
                      className={`text-lg font-medium ${
                        selectedTopic === topic ? 'text-blue-900' : 'text-gray-700'
                      }`}
                    >
                      {topic}
                    </span>
                    {label && (
                      <span className="ml-2 px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-800 font-semibold border border-yellow-300">
                        {label}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    6 questions: 2 easy, 2 medium, 2 hard
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h4 className="font-semibold text-blue-900 mb-3">Interview Guidelines</h4>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• Easy questions: 20 seconds each</li>
            <li>• Medium questions: 60 seconds each</li>
            <li>• Hard questions: 120 seconds each</li>
            <li>• You cannot switch tabs or copy content during the interview</li>
            <li>• Answer will auto-submit when time runs out</li>
            <li>• Your progress is automatically saved</li>
          </ul>
          <div className="mt-6 flex items-center gap-3">
            <input
              type="checkbox"
              id="accept-guidelines"
              checked={accepted}
              onChange={e => setAccepted(e.target.checked)}
              className="w-5 h-5 accent-blue-600"
            />
            <label htmlFor="accept-guidelines" className="text-blue-900 text-sm font-medium cursor-pointer">
              I have read and accept the interview guidelines
            </label>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!selectedTopic || !accepted || loading}
          className={`w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors ${loading ? 'animate-pulse' : ''}`}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 01-8 8z" />
              </svg>
              Generating...
            </span>
          ) : (
            <>
              Start Interview
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
