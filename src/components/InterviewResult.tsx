import React from 'react';
import { generateSummary } from '../utils/geminiSummary';
import { Trophy, CheckCircle, XCircle, RotateCcw, BarChart2 } from 'lucide-react';
import { InterviewResult as IInterviewResult } from '../types';
import { questionDatabase } from '../data/questions';
import { updateUserScoreByEmail, updateUserSummaryByEmail } from '../firebase';
import { generateHFSummary } from '../utils/huggingfaceSummary';

interface InterviewResultProps {
  result: IInterviewResult;
  onRestart: () => void;
  onViewLeaderboard: () => void; // New prop for the leaderboard button
}

export function InterviewResult({ result, onRestart, onViewLeaderboard }: InterviewResultProps) {
  const [aiSummary, setAiSummary] = React.useState<string>('');
  const [loadingSummary, setLoadingSummary] = React.useState(false);

  React.useEffect(() => {
    async function fetchSummary() {
      setLoadingSummary(true);
      // Collect all user answers as text
      const answers = result.answers?.map(a => a.userAnswer) || [];
      let summary = '';
      try {
        summary = await generateSummary(answers, result.topic);
        if (!summary) throw new Error('Empty Gemini summary');
      } catch {
        try {
          summary = await generateHFSummary(answers, result.topic);
        } catch {
          summary = 'AI summary could not be generated.';
        }
      }
      setAiSummary(summary);
      // Build detailed result for saving
      const originalQuestions = questionDatabase[result.topic] || [];
      let detailedResult = `Candidate ${result.candidateName} completed the interview on ${result.topic} with a score of ${result.score}%.\nCorrect answers: ${result.correctAnswers} out of ${result.totalQuestions}.\n\nQuestions & Answers:`;
      result.answers?.forEach((answer, idx) => {
        const question = originalQuestions.find(q => q.id === answer.questionId);
        if (!question) return;
        detailedResult += `\nQ${idx + 1}: ${question.text}\nYour Answer: ${answer.userAnswer}\nCorrect Answer: ${question.correctAnswer}`;
        if (answer.userAnswer !== question.correctAnswer) {
          detailedResult += ' (Incorrect)';
        } else {
          detailedResult += ' (Correct)';
        }
        detailedResult += `\nTime Taken: ${answer.timeSpent} seconds\n`;
      });
      detailedResult += `\n\nAI Summary: ${summary}`;
      // Save to Firebase
      if (result?.candidateEmail) {
        await updateUserSummaryByEmail(result.candidateEmail, detailedResult);
      }
      setLoadingSummary(false);
    }
    fetchSummary();
  }, [result.answers, result.topic]);
  const percentage = result.score;

  const getScoreColor = () => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-blue-600';
    if (percentage >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBackground = () => {
    if (percentage >= 80) return 'from-green-500 to-green-600';
    if (percentage >= 60) return 'from-blue-500 to-blue-600';
    if (percentage >= 40) return 'from-yellow-500 to-yellow-600';
    return 'from-red-500 to-red-600';
  };

  React.useEffect(() => {
    if (result?.candidateEmail && typeof result.score === 'number') {
      updateUserScoreByEmail(result.candidateEmail, result.score);
    }
  }, [result]);

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className={`bg-gradient-to-r ${getScoreBackground()} p-8 text-white text-center`}>
          <Trophy className="w-20 h-20 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-2">Interview Complete!</h2>
          <p className="text-lg opacity-90">
            {result.candidateName} - {result.topic}
          </p>
        </div>

        <div className="p-8">
          <div className="text-center mb-8">
            <div className={`text-7xl font-bold ${getScoreColor()} mb-4`}>
              {percentage}%
            </div>
            <p className="text-xl text-gray-700 mb-2">Your Score</p>
            <p className="text-gray-600">
              {result.correctAnswers} out of {result.totalQuestions} questions answered correctly
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <CheckCircle className="w-10 h-10 text-green-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-green-700 mb-1">
                {result.correctAnswers}
              </div>
              <div className="text-sm text-green-600 font-medium">Correct Answers</div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <XCircle className="w-10 h-10 text-red-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-red-700 mb-1">
                {result.totalQuestions - result.correctAnswers}
              </div>
              <div className="text-sm text-red-600 font-medium">Incorrect Answers</div>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Performance Summary</h3>
            <p className="text-gray-700 leading-relaxed">{result.summary}</p>
            <div className="mt-4">
              <h4 className="text-md font-semibold text-blue-900 mb-2">AI Summary</h4>
              <p className="text-blue-800 leading-relaxed">{loadingSummary ? 'Generating summary...' : aiSummary}</p>
            </div>
            <div className="mt-6">
              <h4 className="text-md font-semibold text-gray-900 mb-2">Questions & Answers</h4>
              <ul className="space-y-4">
                {result.answers?.map((answer, idx) => {
                  const question = (questionDatabase[result.topic] || []).find(q => q.id === answer.questionId);
                  if (!question) return null;
                  // Fuzzy match logic (same as InterviewContext)
                  const userAnswer = answer.userAnswer.toLowerCase().trim();
                  const correctAnswer = question.correctAnswer.toLowerCase().trim();
                  const keyTerms = correctAnswer.split(' ').filter(word => word.length > 4);
                  const matchedTerms = keyTerms.filter(term => userAnswer.includes(term));
                  const isCorrect = matchedTerms.length >= Math.ceil(keyTerms.length * 0.3);
                  return (
                    <li key={answer.questionId} className={`p-4 rounded-lg border ${isCorrect ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'}`}>
                      <div className="font-semibold text-gray-800 mb-1">Q{idx + 1}: {question.text}</div>
                      <div className="text-sm text-gray-700">Your Answer: <span className={isCorrect ? 'text-green-700' : 'text-red-700'}>{answer.userAnswer}</span></div>
                      {!isCorrect && (
                        <div className="text-sm text-green-700">Correct Answer: {question.correctAnswer}</div>
                      )}
                      <div className="text-xs text-gray-500 mt-1">Time Taken: {answer.timeSpent} seconds</div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Next Steps</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>• Review the topics you found challenging</li>
              <li>• Practice with similar questions to improve</li>
              <li>• Consider taking another interview on a different topic</li>
              <li>• Your results have been saved for the interviewer to review</li>
            </ul>
          </div>

          <div className="flex gap-4">
            <button
              onClick={onViewLeaderboard}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
            >
              <BarChart2 className="w-5 h-5" />
              View Leaderboard
            </button>
            <button
              onClick={onRestart}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              Take Another Interview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}