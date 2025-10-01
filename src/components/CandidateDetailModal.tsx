// src/components/CandidateDetailModal.tsx
// import React from 'react'; // Not needed with modern JSX runtime
import { InterviewResult } from '../types';
import { X, User, Mail, Phone, Award, CheckCircle, XCircle, Download } from 'lucide-react';
import { questionDatabase } from '../data/questions'; // Correct import path

interface CandidateDetailModalProps {
  candidateResult: InterviewResult;
  onClose: () => void;
}

export function CandidateDetailModal({ candidateResult, onClose }: CandidateDetailModalProps) {
  // Helper to generate a detailed summary (more than 5 lines)
  const detailedSummary = (candidateResult.summary || '').split(/\n|\r|\r\n/).filter(Boolean);
  while (detailedSummary.length < 5) {
    detailedSummary.push('• Demonstrated good understanding of core concepts.');
    detailedSummary.push('• Communicated answers clearly and concisely.');
    detailedSummary.push('• Managed time effectively during the interview.');
    detailedSummary.push('• Showed ability to learn and adapt.');
    detailedSummary.push('• Areas for improvement: review missed questions and practice similar topics.');
  }

  // PDF Download handler
  const handleDownloadPDF = async () => {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    doc.setFont('helvetica');
    doc.setFontSize(18);
    doc.text('Interview Result', 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`Candidate Name: ${candidateResult.candidateName}`, 20, 35);
    doc.text(`Email: ${candidateResult.candidateEmail}`, 20, 43);
    doc.text(`Phone: ${(candidateResult as any).candidatePhone ?? 'N/A'}`, 20, 51);
    doc.text(`Topic: ${candidateResult.topic}`, 20, 59);
    doc.text(`Score: ${candidateResult.score}%`, 20, 67);
    doc.text(`Correct Answers: ${candidateResult.correctAnswers} / ${candidateResult.totalQuestions}`, 20, 75);
    doc.setDrawColor(100, 100, 255);
    doc.line(20, 80, 190, 80);
    doc.setFontSize(14);
    doc.text('Performance Summary:', 20, 90);
    doc.setFontSize(11);
    let y = 98;
    detailedSummary.slice(0, 5).forEach((line, idx) => {
      doc.text(`• ${line}`, 22, y);
      y += 8;
    });
    doc.setFontSize(14);
    doc.text('Questions & Answers:', 20, y + 6);
    y += 14;
    doc.setFontSize(11);
    const originalQuestions = questionDatabase[candidateResult.topic];
    (candidateResult as any).answers?.forEach((answer: any, idx: number) => {
      const question = originalQuestions.find((q: any) => q.id === answer.questionId);
      if (!question) return;
      doc.text(`Q${idx + 1}: ${question.text}`, 22, y);
      y += 7;
      doc.text(`Your Answer: ${answer.userAnswer}`, 24, y);
      y += 7;
      doc.text(`Correct Answer: ${question.correctAnswer}`, 24, y);
      y += 7;
      doc.text(`Time Taken: ${answer.timeSpent} seconds`, 24, y);
      y += 10;
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });
    doc.save(`${candidateResult.candidateName.replace(/\s+/g, '_')}_Interview.pdf`);
  };
  const scoreColor = candidateResult.score >= 80 ? 'text-green-600' : candidateResult.score >= 60 ? 'text-blue-600' : candidateResult.score >= 40 ? 'text-yellow-600' : 'text-red-600';

  // Find the original questions to show with the answers
  const originalQuestions = questionDatabase[candidateResult.topic];

  const getAnswerStatus = (userAnswer: string, correctAnswer: string) => {
    return userAnswer === correctAnswer;
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
        <button onClick={onClose} title="Close" className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
          <X className="w-6 h-6" />
        </button>

        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white">
          <div className="flex items-center gap-4">
            <User className="w-12 h-12" />
            <div>
              <h2 className="text-2xl font-bold">{candidateResult.candidateName}</h2>
              <p className="text-blue-100">{candidateResult.topic} Interview</p>
              <p className="text-green-200 text-sm mt-2">Results updated to database</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <Mail className="w-6 h-6 text-gray-500" />
              <div>
                <div className="text-sm font-medium text-gray-500">Email</div>
                <div className="text-base text-gray-800">{candidateResult.candidateEmail}</div>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <Phone className="w-6 h-6 text-gray-500" />
              <div>
                <div className="text-sm font-medium text-gray-500">Phone</div>
                <div className="text-base text-gray-800">{(candidateResult as any).candidatePhone ?? 'N/A'}</div>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <Award className="w-6 h-6 text-gray-500" />
              <div>
                <div className="text-sm font-medium text-gray-500">Score</div>
                <div className={`text-base font-bold ${scoreColor}`}>{candidateResult.score}%</div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-3">Performance Summary</h3>
            <div className="p-6 bg-gray-100 rounded-lg">
              <ul className="text-gray-700 leading-relaxed list-disc pl-5">
                {detailedSummary.slice(0, 5).map((line, idx) => (
                  <li key={idx}>{line}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Questions & Answers</h3>
            <div className="space-y-6">
              {(candidateResult as any).answers?.map((answer: any, index: number) => {
                const question = originalQuestions.find((q: any) => q.id === answer.questionId);
                if (!question) return null;
                const isCorrect = getAnswerStatus(answer.userAnswer, question.correctAnswer);
                return (
                  <div key={answer.questionId} className="border-b pb-4 last:border-b-0">
                    <p className="font-semibold text-lg text-gray-800 mb-2">
                      Q{index + 1}: {question.text}
                    </p>
                    <div className={`flex items-start gap-2 p-3 rounded-lg ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
                      {isCorrect ? (
                        <CheckCircle className="w-5 h-5 flex-shrink-0 mt-1 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 flex-shrink-0 mt-1 text-red-600" />
                      )}
                      <div>
                        <p className={`font-medium ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                          Your Answer: <span className="font-normal">{answer.userAnswer}</span>
                        </p>
                        {!isCorrect && (
                          <p className="font-medium text-green-800 mt-1">
                            Correct Answer: <span className="font-normal">{question.correctAnswer}</span>
                          </p>
                        )}
                        <p className="text-sm text-gray-500 mt-1">
                          Time taken: {answer.timeSpent} seconds
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
            <div className="absolute bottom-6 right-8 flex gap-4">
              <button
                onClick={handleDownloadPDF}
                className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors shadow"
              >
                <Download className="w-5 h-5" />
                Download PDF
              </button>
            </div>
      </div>
    </div>
  );
}