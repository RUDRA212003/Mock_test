import React, { useState } from 'react';
import { CircleUser as UserCircle, Briefcase, ArrowLeft, ArrowRight } from 'lucide-react';
import { InterviewProvider, useInterview } from './contexts/InterviewContext';
import { ResumeUpload } from './components/ResumeUpload';
import { TopicSelection } from './components/TopicSelection';
import { InterviewChat } from './components/InterviewChat';
import { InterviewResult } from './components/InterviewResult';
import { WelcomeBackModal } from './components/WelcomeBackModal';
import { InterviewerDashboard } from './components/InterviewerDashboard';
import { Login } from './components/Login';
import { auth, db } from './firebase';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { CandidateInfo } from './types';

type InterviewStep = 'upload' | 'topic' | 'interview' | 'result' | 'leaderboard';
interface IntervieweeFlowProps {
  step: InterviewStep;
  setStep: (step: InterviewStep) => void;
  refetchUserInfo?: () => void;
}

function IntervieweeFlow({ step, setStep, refetchUserInfo }: IntervieweeFlowProps) {
  const {
    session,
    hasInProgressSession,
    startInterview,
    completeInterview,
    resumeSession,
    clearSession,
  } = useInterview();

  const [candidateInfo, setCandidateInfo] = useState<CandidateInfo | null>(null);
  const [result, setResult] = useState<any>(null);
  const [showWelcomeModal, setShowWelcomeModal] = useState(hasInProgressSession);

  React.useEffect(() => {
    if (session?.status === 'in-progress') {
      setStep('interview');
    } else if (session?.status === 'completed') {
      setStep('result');
    }
  }, [session, setStep]);

  const handleInfoExtracted = (info: CandidateInfo) => {
    setCandidateInfo(info);
    setStep('topic');
    if (refetchUserInfo) refetchUserInfo();
  };

  const handleTopicSelected = async (topic: string, questions?: any[]) => {
    if (candidateInfo) {
      try {
        if (questions && questions.length > 0) {
          await startInterview(candidateInfo, topic, questions);
        } else {
          await startInterview(candidateInfo, topic);
        }
        setStep('interview');
      } catch (err) {
        alert('Failed to start interview. Please try again.');
      }
    }
  };

  const handleResumeSession = () => {
    setShowWelcomeModal(false);
    resumeSession();
  };

  const handleStartNew = () => {
    setShowWelcomeModal(false);
    clearSession();
    setCandidateInfo(null);
    setResult(null);
    setStep('upload');
  };

  const handleRestart = () => {
    clearSession();
    setCandidateInfo(null);
    setResult(null);
    setStep('upload');
  };

  const handleViewLeaderboard = () => {
    setStep('leaderboard');
  };

  React.useEffect(() => {
    if (session?.status === 'completed' && !result) {
      const interviewResult = completeInterview();
      if (interviewResult) {
        setResult(interviewResult);
        setStep('result');
      }
    }
  }, [session?.status, result, completeInterview, setStep]);

  if (showWelcomeModal) {
    return (
      <WelcomeBackModal onResume={handleResumeSession} onStartNew={handleStartNew} />
    );
  }

  switch (step) {
    case 'upload':
      return <ResumeUpload onInfoExtracted={handleInfoExtracted} />;
    case 'topic':
  return <TopicSelection candidateInfo={candidateInfo!} onTopicSelected={handleTopicSelected} />;
    case 'interview':
      return <InterviewChat />;
    case 'result':
      return <InterviewResult result={result} onRestart={handleRestart} onViewLeaderboard={handleViewLeaderboard} />;
    case 'leaderboard':
      return <InterviewerDashboard />;
    default:
      return null;
  }
}

function UserPanel({ user, userInfo, onLogout }: { user: any, userInfo: any, onLogout: () => void }) {
  return (
    <div className="absolute top-16 right-8 bg-white shadow-lg rounded-lg p-6 z-50 min-w-[250px]">
      <div className="flex items-center gap-3 mb-4">
        <UserCircle className="w-10 h-10 text-blue-600" />
        <div>
          <div className="font-bold text-lg text-gray-800">{userInfo?.name || user.displayName || user.email}</div>
          <div className="text-sm text-gray-500">{userInfo?.email || user.email}</div>
          <div className="text-sm text-gray-500">{userInfo?.phone || ''}</div>
        </div>
      </div>
      <button
        className="w-full px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
        onClick={onLogout}
      >
        Logout
      </button>
    </div>
  );
}

function AppContent() {
  const [page, setPage] = useState<'landing' | 'interview' | 'leaderboard'>('landing');
  const [interviewStep, setInterviewStep] = useState<InterviewStep>('upload');
  const [user, setUser] = useState<any>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [showUserPanel, setShowUserPanel] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
      setCheckingAuth(false);
      console.log('Firebase user:', firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  React.useEffect(() => {
    async function fetchUserInfo() {
      if (user?.email) {
        const docRef = doc(db, 'users', user.email);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserInfo(docSnap.data());
        }
      }
    }
    fetchUserInfo();
  }, [user]);

  // Add a callback to refetch user info
  const refetchUserInfo = async () => {
    if (user?.email) {
      const docRef = doc(db, 'users', user.email);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserInfo(docSnap.data());
      }
    }
  };

  // Show loading while checking auth
  if (checkingAuth) {
    return <div className="flex items-center justify-center h-screen text-xl">Checking authentication...</div>;
  }

  // Require login for interview and leaderboard
  if ((page === 'interview' || page === 'leaderboard') && !user) {
    return <Login onLogin={setUser} />;
  }

  // Logout handler
  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setShowUserPanel(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      <nav className="bg-white shadow-sm border-b border-gray-200 w-full relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setPage('landing')}>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-800">AI Interview Assistant</h1>
            </div>
            {user && (
              <button
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                onClick={() => setShowUserPanel((v) => !v)}
                title="User Panel"
              >
                <UserCircle className="w-6 h-6 text-blue-600" />
                <span className="font-medium text-gray-700">{userInfo?.name || user.displayName || user.email}</span>
              </button>
            )}
          </div>
        </div>
        {user && showUserPanel && <UserPanel user={user} userInfo={userInfo} onLogout={handleLogout} />}
      </nav>
      <main className="flex-1 py-8 w-full">
        {page === 'landing' && (
          <div className="flex flex-col items-center justify-center h-full w-full px-4">
            <div className="bg-white rounded-lg shadow-lg p-8 sm:p-10 flex flex-col items-center gap-8 w-full max-w-md">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 text-center">Welcome!</h2>
              <div className="flex flex-col sm:flex-row gap-4 w-full">
                <button
                  className="w-full sm:w-auto px-6 py-4 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors"
                  onClick={() => setPage('interview')}
                >
                  Start Interview
                </button>
                <button
                  className="w-full sm:w-auto px-6 py-4 bg-gray-200 text-gray-800 rounded-lg font-semibold text-lg hover:bg-gray-300 transition-colors"
                  onClick={() => setPage('leaderboard')}
                >
                  Go to Leaderboard
                </button>
              </div>
            </div>
          </div>
        )}
        {page === 'interview' && (
          <IntervieweeFlow step={interviewStep} setStep={setInterviewStep} refetchUserInfo={refetchUserInfo} />
        )}
        {page === 'leaderboard' && (
          <InterviewerDashboard />
        )}
      </main>
    </div>
  );
}

function App() {
  return (
    <InterviewProvider>
      <AppContent />
    </InterviewProvider>
  );
}

export default App;