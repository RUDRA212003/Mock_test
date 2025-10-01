export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface Question {
  id: string;
  text: string;
  difficulty: DifficultyLevel;
  options: string[];
  correctAnswer: string;
  topic: string;
}

export interface Answer {
  questionId: string;
  userAnswer: string;
  timeSpent: number;
  timestamp: number;
}

export interface InterviewSession {
  id: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  topic: string;
  questions: Question[];
  answers: Answer[];
  currentQuestionIndex: number;
  startTime: number;
  status: 'in-progress' | 'completed';
}

export interface InterviewResult {
  sessionId: string;
  candidateName: string;
  candidateEmail: string;
  topic: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  summary: string;
  completedAt: number;
  answers: Answer[];
}

export interface CandidateInfo {
  name: string;
  email: string;
  phone: string;
}
