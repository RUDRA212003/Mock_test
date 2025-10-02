import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, updateDoc, query, where, getDocs } from 'firebase/firestore';
import { Users, TrendingUp, Clock, Award, Search, Filter } from 'lucide-react';
import { InterviewResult } from '../types';
import { CandidateDetailModal } from './CandidateDetailModal'; // New component to be created

export function InterviewerDashboard() {
  const [showRatingModal, setShowRatingModal] = useState(true);
  const [starRating, setStarRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  // Get current user email from localStorage or context
  const userEmail = localStorage.getItem('user_email');

  // Check if user already submitted a review (optional: fetch from Firestore)
  useEffect(() => {
    async function checkReview() {
      if (!userEmail) return;
      const q = query(collection(db, 'reviews'), where('email', '==', userEmail));
      const snap = await getDocs(q);
      if (!snap.empty) setShowRatingModal(false);
    }
    checkReview();
  }, [userEmail]);
  async function handleSubmitReview() {
    if (starRating === 0) return;
    setSubmitting(true);
  const reviewEmail = userEmail || `anonymous_${Math.random().toString(36).substring(2, 10)}`;
  const userName = localStorage.getItem('user_name') || 'Anonymous';
    try {
      const q = query(collection(db, 'rating'), where('email', '==', reviewEmail));
      const snap = await getDocs(q);
      if (!snap.empty) {
        // Update existing rating
        await updateDoc(snap.docs[0].ref, {
          name: userName,
          email: reviewEmail,
          'star rating': starRating,
          'review': reviewText,
          updatedAt: Date.now(),
        });
      } else {
        // Add new rating
        await addDoc(collection(db, 'rating'), {
          name: userName,
          email: reviewEmail,
          'star rating': starRating,
          'review': reviewText,
          createdAt: Date.now(),
        });
      }
      setShowRatingModal(false);
    } catch (e) {
      alert('Error submitting review.');
    }
    setSubmitting(false);
  }
  const [results, setResults] = useState<InterviewResult[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTopic, setFilterTopic] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'score'>('date');
  const [selectedCandidate, setSelectedCandidate] = useState<InterviewResult | null>(null);

  useEffect(() => {
    const loadResults = () => {
      const saved = localStorage.getItem('interview_results');
      if (saved) {
        const parsed = JSON.parse(saved);
        setResults(parsed);
      }
    };

    loadResults();
    const interval = setInterval(loadResults, 2000);
    return () => clearInterval(interval);
  }, []);

  const filteredResults = results
    .filter((result) => {
      const matchesSearch =
        result.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.candidateEmail.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTopic = filterTopic === 'all' || result.topic === filterTopic;
      return matchesSearch && matchesTopic;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return b.completedAt - a.completedAt;
      }
      return b.score - a.score;
    });

  const averageScore =
    results.length > 0
      ? Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length)
      : 0;

  const topics = Array.from(new Set(results.map((r) => r.topic)));

  const handleRowClick = (result: InterviewResult) => {
    setSelectedCandidate(result);
  };

  if (selectedCandidate) {
    return (
      <CandidateDetailModal
        candidateResult={selectedCandidate}
        onClose={() => setSelectedCandidate(null)}
      />
    );
  }

  return (
    <>
      {showRatingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative animate-fade-in">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
              onClick={() => setShowRatingModal(false)}
              aria-label="Close"
            >×</button>
            <h2 className="text-xl font-bold mb-4 text-center">Rate Your Experience</h2>
            <div className="flex justify-center mb-4">
              {[1,2,3,4,5].map((star) => (
                <span
                  key={star}
                  className={`cursor-pointer text-4xl transition-colors ${
                    (hoverRating || starRating) >= star ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setStarRating(star)}
                  role="button"
                  aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                >★</span>
              ))}
            </div>
            <textarea
              className="w-full border border-gray-300 rounded-lg p-3 mb-4 resize-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Leave a review (optional)"
              value={reviewText}
              onChange={e => setReviewText(e.target.value)}
              maxLength={300}
            />
            <button
              className={`w-full py-2 rounded-lg font-bold text-white transition-colors ${starRating === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
              disabled={starRating === 0 || submitting}
              onClick={handleSubmitReview}
            >{submitting ? 'Submitting...' : 'Submit Rating'}</button>
            <div className="text-xs text-gray-500 mt-2 text-center">You can close this window if you don't want to rate.</div>
          </div>
        </div>
      )}
      <div className="w-full max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Interviewer Dashboard</h1>
        <p className="text-gray-600">Monitor and review candidate interview performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-8 h-8 text-blue-600" />
            <div>
              <div className="text-2xl font-bold text-gray-800">{results.length}</div>
              <div className="text-sm text-gray-600">Total Interviews</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-8 h-8 text-green-600" />
            <div>
              <div className="text-2xl font-bold text-gray-800">{averageScore}%</div>
              <div className="text-sm text-gray-600">Average Score</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-2">
            <Award className="w-8 h-8 text-yellow-600" />
            <div>
              <div className="text-2xl font-bold text-gray-800">
                {results.filter((r) => r.score >= 80).length}
              </div>
              <div className="text-sm text-gray-600">High Performers</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-8 h-8 text-red-600" />
            <div>
              <div className="text-2xl font-bold text-gray-800">{topics.length}</div>
              <div className="text-sm text-gray-600">Topics Covered</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow mb-6 p-6">
        <div className="flex justify-end mb-4 gap-4">
          <button
            onClick={() => {
              // Export all results to Excel
              const header = [
                'Name', 'Email', 'Topic', 'Score', 'Correct Answers', 'Total Questions', 'Date', 'AI Summary'
              ];
              const rows = results.map(r => [
                r.candidateName,
                r.candidateEmail,
                r.topic,
                r.score,
                r.correctAnswers,
                r.totalQuestions,
                new Date(r.completedAt).toLocaleString(),
                r.summary?.replace(/\n/g, ' ')
              ]);
              let csv = header.join(',') + '\n' + rows.map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')).join('\n');
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'interview_results.csv';
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }}
            className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors shadow"
          >
            Download All Results (Excel)
          </button>
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to clear the leaderboard? This will remove all local leaderboard data. (This does NOT affect Firebase)')) {
                localStorage.removeItem('interview_results');
                setResults([]);
                alert('Leaderboard cleared!');
              }
            }}
            className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors shadow"
          >
            Clear Leaderboard
          </button>
        </div>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-4">
            <div className="relative">
              <Filter className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <select
                value={filterTopic}
                onChange={(e) => setFilterTopic(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                title="Filter by topic"
              >
                <option value="all">All Topics</option>
                {topics.map((topic) => (
                  <option key={topic} value={topic}>
                    {topic}
                  </option>
                ))}
              </select>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'score')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              title="Sort results"
            >
              <option value="date">Sort by Date</option>
              <option value="score">Sort by Score</option>
            </select>
          </div>
        </div>

        {filteredResults.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">No interviews yet</h3>
            <p className="text-gray-500">
              Completed interviews will appear here for review
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Candidate</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Topic</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Score</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Questions</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredResults.map((result) => (
                  <tr
                    key={result.sessionId}
                    onClick={() => handleRowClick(result)}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <td className="py-4 px-4">
                      <div className="font-medium text-gray-800">{result.candidateName}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm text-gray-600">{result.candidateEmail}</div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        {result.topic}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div
                        className={`text-2xl font-bold ${
                          result.score >= 80
                            ? 'text-green-600'
                            : result.score >= 60
                            ? 'text-blue-600'
                            : result.score >= 40
                            ? 'text-yellow-600'
                            : 'text-red-600'
                        }`}
                      >
                        {result.score}%
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="text-sm text-gray-600">
                        {result.correctAnswers}/{result.totalQuestions}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm text-gray-600">
                        {new Date(result.completedAt).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(result.completedAt).toLocaleTimeString()}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
    </>
  );
}