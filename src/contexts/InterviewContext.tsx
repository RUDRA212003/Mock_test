import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { InterviewSession, Question, Answer, InterviewResult, CandidateInfo } from '../types';
import { generateQuestions } from '../data/questions';

interface InterviewContextType {
  session: InterviewSession | null;
  currentQuestion: Question | null;
  timeRemaining: number;
  startInterview: (candidateInfo: CandidateInfo, topic: string, questionsOverride?: Question[]) => void;
  submitAnswer: (answer: string) => void;
  completeInterview: () => InterviewResult | null;
  resumeSession: () => void;
  clearSession: () => void;
  hasInProgressSession: boolean;
}

const InterviewContext = createContext<InterviewContextType | undefined>(undefined);

const STORAGE_KEY = 'interview_session';
const TIMER_KEY = 'interview_timer';

const TIME_LIMITS = {
  easy: 20,
  medium: 60,
  hard: 120,
};

export function InterviewProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [hasInProgressSession, setHasInProgressSession] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsedSession = JSON.parse(saved);
      if (parsedSession.status === 'in-progress') {
        setHasInProgressSession(true);
      }
    }
  }, []);

  const saveSession = useCallback((sessionData: InterviewSession) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionData));
    localStorage.setItem(TIMER_KEY, Date.now().toString());
  }, []);

  const startTimer = useCallback((difficulty: string) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    const limit = TIME_LIMITS[difficulty as keyof typeof TIME_LIMITS];
    setTimeRemaining(limit);
    startTimeRef.current = Date.now();

    timerRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const remaining = limit - elapsed;

      if (remaining <= 0) {
        setTimeRemaining(0);
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      } else {
        setTimeRemaining(remaining);
      }
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startInterview = useCallback(async (candidateInfo: CandidateInfo, topic: string, questionsOverride?: Question[]) => {
    let questions: Question[] = [];
    if (questionsOverride && questionsOverride.length > 0) {
      questions = questionsOverride;
    } else {
      // If generateQuestions is async, await it
      const result = generateQuestions(topic);
      questions = result instanceof Promise ? await result : result;
    }
    const newSession: InterviewSession = {
      id: `session-${Date.now()}`,
      candidateName: candidateInfo.name,
      candidateEmail: candidateInfo.email,
      candidatePhone: candidateInfo.phone,
      topic,
      questions,
      answers: [],
      currentQuestionIndex: 0,
      startTime: Date.now(),
      status: 'in-progress',
    };

    setSession(newSession);
    saveSession(newSession);
    startTimer(questions[0].difficulty);
    setHasInProgressSession(false);
  }, [saveSession, startTimer]);

  const submitAnswer = useCallback((answer: string) => {
    if (!session) return;

    const currentQuestion = session.questions[session.currentQuestionIndex];
    const timeSpent = TIME_LIMITS[currentQuestion.difficulty as keyof typeof TIME_LIMITS] - timeRemaining;

    const newAnswer: Answer = {
      questionId: currentQuestion.id,
      userAnswer: answer,
      timeSpent,
      timestamp: Date.now(),
    };

    const updatedAnswers = [...session.answers, newAnswer];
    const nextIndex = session.currentQuestionIndex + 1;

    stopTimer();

    if (nextIndex < session.questions.length) {
      const updatedSession = {
        ...session,
        answers: updatedAnswers,
        currentQuestionIndex: nextIndex,
      };
      setSession(updatedSession);
      saveSession(updatedSession);
      startTimer(session.questions[nextIndex].difficulty);
    } else {
      const completedSession = {
        ...session,
        answers: updatedAnswers,
        status: 'completed' as const,
      };
      setSession(completedSession);
      saveSession(completedSession);
    }
  }, [session, timeRemaining, saveSession, startTimer, stopTimer]);

  const completeInterview = useCallback((): InterviewResult | null => {
    if (!session || session.status !== 'completed') return null;

    let correctAnswers = 0;
    session.answers.forEach((answer) => {
      const question = session.questions.find((q) => q.id === answer.questionId);
      if (question) {
        const userAnswer = answer.userAnswer.toLowerCase().trim();
        const correctAnswer = question.correctAnswer.toLowerCase().trim();

        const keyTerms = correctAnswer.split(' ').filter(word => word.length > 4);
        const matchedTerms = keyTerms.filter(term => userAnswer.includes(term));

        if (matchedTerms.length >= Math.ceil(keyTerms.length * 0.3)) {
          correctAnswers++;
        }
      }
    });

    const score = Math.round((correctAnswers / session.questions.length) * 100);

    let summary = '';
    if (score >= 80) {
      summary = 'Excellent performance! Strong understanding of the concepts with detailed answers.';
    } else if (score >= 60) {
      summary = 'Good performance! Solid grasp of fundamentals with room for improvement in depth.';
    } else if (score >= 40) {
      summary = 'Fair performance. Shows basic understanding but needs more practice and study.';
    } else {
      summary = 'Needs improvement. Consider reviewing the fundamentals and practicing more.';
    }

    const result: InterviewResult = {
      sessionId: session.id,
      candidateName: session.candidateName,
      candidateEmail: session.candidateEmail,
      topic: session.topic,
      score,
      totalQuestions: session.questions.length,
      correctAnswers,
      summary,
      completedAt: Date.now(),
      answers: session.answers,
    };

    const results = JSON.parse(localStorage.getItem('interview_results') || '[]');
    results.push(result);
    localStorage.setItem('interview_results', JSON.stringify(results));

    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TIMER_KEY);

    return result;
  }, [session]);

  const resumeSession = useCallback(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsedSession = JSON.parse(saved);
      if (parsedSession.status === 'in-progress') {
        setSession(parsedSession);
        setHasInProgressSession(false);
        const currentQuestion = parsedSession.questions[parsedSession.currentQuestionIndex];
        startTimer(currentQuestion.difficulty);
      }
    }
  }, [startTimer]);

  const clearSession = useCallback(() => {
    stopTimer();
    setSession(null);
    setHasInProgressSession(false);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TIMER_KEY);
  }, [stopTimer]);

  useEffect(() => {
    return () => {
      stopTimer();
    };
  }, [stopTimer]);

  const currentQuestion = session
    ? session.questions[session.currentQuestionIndex]
    : null;

  return (
    <InterviewContext.Provider
      value={{
        session,
        currentQuestion,
        timeRemaining,
        startInterview,
        submitAnswer,
        completeInterview,
        resumeSession,
        clearSession,
        hasInProgressSession,
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
}

export function useInterview() {
  const context = useContext(InterviewContext);
  if (!context) {
    throw new Error('useInterview must be used within InterviewProvider');
  }
  return context;
}
