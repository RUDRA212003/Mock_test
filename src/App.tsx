import React, { useState } from 'react';
import Footer from './components/Footer';
import { Login } from './components/Login';
import { InterviewProvider, useInterview } from './contexts/InterviewContext';
import { ResumeUpload } from './components/ResumeUpload';
import { TopicSelection } from './components/TopicSelection';
import LandingScreen from './components/LandingScreen';
import { InterviewChat } from './components/InterviewChat';
import { InterviewResult } from './components/InterviewResult';
import { WelcomeBackModal } from './components/WelcomeBackModal';
import { InterviewerDashboard } from './components/InterviewerDashboard';
import { CandidateInfo } from './types';



type InterviewStep = 'landing' | 'upload' | 'topic' | 'interview' | 'result' | 'leaderboard' | 'postLoginChoice';
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
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  // Show welcome modal if there is an in-progress session
  React.useEffect(() => {
    if (hasInProgressSession) {
      setShowWelcomeModal(true);
    }
  }, [hasInProgressSession]);

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
  setStep('landing');
  };

  const [showResumeChoice, setShowResumeChoice] = useState(false);
  const handleRestart = () => {
    clearSession();
    setResult(null);
    if (candidateInfo) {
      setShowResumeChoice(true);
    } else {
      setStep('landing');
    }
  };

  const handleViewLeaderboard = () => {
    setStep('leaderboard');
  };

  const [showResultLoading, setShowResultLoading] = useState(false);
  React.useEffect(() => {
    if (session?.status === 'completed' && !result) {
      setShowResultLoading(true);
      setTimeout(() => {
        const interviewResult = completeInterview();
        if (interviewResult) {
          setResult(interviewResult);
          setStep('result');
        }
        setShowResultLoading(false);
      }, 2500); // 2.5 seconds loading
    }
  }, [session?.status, result, completeInterview, setStep]);

  if (showWelcomeModal) {
    return (
      <WelcomeBackModal onResume={handleResumeSession} onStartNew={handleStartNew} />
    );
  }

  if (showResumeChoice) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] w-full">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Continue with previous resume details?</h2>
          <p className="text-gray-600 mb-6">Would you like to use your last uploaded resume details for this interview, or upload a new one?</p>
          <div className="flex gap-4 justify-center">
            <button
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              onClick={() => {
                setShowResumeChoice(false);
                setStep('topic');
              }}
            >
              Continue with Previous
            </button>
            <button
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              onClick={() => {
                setShowResumeChoice(false);
                setCandidateInfo(null);
            setStep('landing');
              }}
            >
              Upload New Resume
            </button>
          </div>
        </div>
      </div>
    );
  }

  switch (step) {
    case 'landing':
      return <LandingScreen onStart={() => setStep('upload')} />;
    case 'upload':
      return <ResumeUpload onInfoExtracted={handleInfoExtracted} />;
    case 'topic':
      return <TopicSelection candidateInfo={candidateInfo!} onTopicSelected={handleTopicSelected} />;
    case 'interview':
      return <InterviewChat onFinalSubmit={() => {
        const interviewResult = completeInterview();
        if (interviewResult) {
          setResult(interviewResult);
          setStep('result');
        }
      }} />;
    case 'result':
      if (showResultLoading) {
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] w-full">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 border-b-4 border-gray-200 mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">AI evaluating your result...</h2>
            <p className="text-lg text-blue-700">Please HOLD, your performance summary is being generated!</p>
          </div>
        );
      }
      return <InterviewResult result={result} onRestart={handleRestart} onViewLeaderboard={handleViewLeaderboard} />;
    case 'leaderboard':
      return <InterviewerDashboard />;
    default:
      return null;
  }
}




function App() {
  const [step, setStep] = useState<InterviewStep>('landing');
  const [user, setUserRaw] = useState<any>(null);
  const [showUserPanel, setShowUserPanel] = useState(false);
  const [page, setPage] = useState<string>('main');

  // Persist user in localStorage
  React.useEffect(() => {
    const storedUser = localStorage.getItem('prep_ai_user');
    if (storedUser) {
      try {
        setUserRaw(JSON.parse(storedUser));
      } catch {}
    }
  }, []);

  // Listen for navigation events
  React.useEffect(() => {
    const handler = (e: any) => {
      if (e.detail === 'about' || e.detail === 'contact' || e.detail === 'privacy') {
        setPage(e.detail);
      }
    };
    window.addEventListener('navigate', handler);
    return () => window.removeEventListener('navigate', handler);
  }, []);

  // Wrap setUser to persist
  const setUser = (u: any) => {
    setUserRaw(u);
    if (u) {
      localStorage.setItem('prep_ai_user', JSON.stringify(u));
    } else {
      localStorage.removeItem('prep_ai_user');
    }
  };

  // Navigation bar
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [adminError, setAdminError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const NavBar = () => (
    <nav className="bg-white shadow-sm border-b border-gray-200 w-full relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setStep('landing'); setPage('main'); }}>
            <img src="/Logo.svg" alt="CRISP AI Logo" className="w-10 h-10 rounded-lg" />
            <h1 className="text-xl font-bold text-gray-800">CRISP AI</h1>
          </div>
          <div className="flex items-center gap-4">
            {/* <button
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600 transition-colors"
              onClick={() => setShowAdminModal(true)}
            >Admin</button> */}
            {user && (
              <button
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                onClick={() => setShowUserPanel((v) => !v)}
                title="User Panel"
              >
                <span className="font-medium text-gray-700">{user.displayName || user.email}</span>
              </button>
            )}
          </div>
        </div>
      </div>
      {showAdminModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-sm relative animate-fade-in">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl" onClick={() => setShowAdminModal(false)} aria-label="Close">×</button>
            <h2 className="text-xl font-bold mb-4 text-center">Admin Login</h2>
            <input
              type="email"
              placeholder="Admin Email"
              className="w-full border border-gray-300 rounded-lg p-3 mb-3"
              value={adminEmail}
              onChange={e => setAdminEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full border border-gray-300 rounded-lg p-3 mb-3"
              value={adminPass}
              onChange={e => setAdminPass(e.target.value)}
            />
            {adminError && <div className="text-red-600 text-sm mb-2">{adminError}</div>}
            <button
              className="w-full py-2 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                // Use .env.local for credentials
                const envEmail = import.meta.env.VITE_ADMIN_EMAIL || 'rudratiptur@gmail.com';
                const envPass = import.meta.env.VITE_ADMIN_PASS || 'Rudresh@123';
                if (adminEmail === envEmail && adminPass === envPass) {
                  setIsAdmin(true);
                  setShowAdminModal(false);
                  setPage('admin');
                  setAdminError('');
                } else {
                  setAdminError('Invalid admin credentials');
                }
              }}
            >Login</button>
          </div>
        </div>
      )}
      {/* User panel dropdown */}
      {user && showUserPanel && (
        <div className="absolute top-16 right-8 bg-white shadow-lg rounded-lg p-6 z-50 min-w-[250px]">
          <div className="font-bold text-lg text-gray-800">{user.displayName || user.email}</div>
          <div className="text-sm text-gray-500">{user.email}</div>
          <button
            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors mt-4"
            onClick={() => { setUser(null); setShowUserPanel(false); setStep('landing'); setPage('main'); }}
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );

  // Static pages
  if (isAdmin && page === 'admin') {
    const AdminPanel = require('./components/AdminPanel').AdminPanel;
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-1">
          <AdminPanel />
        </main>
        <Footer />
      </div>
    );
  }
  if (page === 'about') {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-1 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-10 max-w-lg w-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">About</h2>
            <p className="text-gray-700 mb-2">CRISP AI developed by <b>Rudresh</b> from Kalpataru Institute of Technology, Tiptur.</p>
            <button className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700" onClick={() => setPage('main')}>Back</button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  if (page === 'contact') {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-1 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-10 max-w-lg w-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Contact</h2>
            <p className="text-gray-700 mb-2">Email: <a href="mailto:rudreshmanjunath15@gmail.com" className="text-blue-600 underline">rudreshmanjunath15@gmail.com</a></p>
            <p className="text-gray-700 mb-2">LinkedIn: <a href="https://www.linkedin.com/in/rudresh-manjunath21/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">rudresh-manjunath</a></p>
            <button className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700" onClick={() => setPage('main')}>Back</button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  if (page === 'privacy') {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-1 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-10 max-w-lg w-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Privacy Policy</h2>
            <p className="text-gray-700 mb-2">We use Firebase Authentication. Your data is safe and only used for login and interview purposes. No personal information is shared with third parties. For more details, contact the developer.</p>
            <button className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700" onClick={() => setPage('main')}>Back</button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Login gating for interview and leaderboard
  if ((step === 'upload' || step === 'topic' || step === 'interview' || step === 'result' || step === 'leaderboard') && !user) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-1 flex items-center justify-center">
          <Login onLogin={(u) => {
            setUser(u);
            setStep('postLoginChoice');
          }} />
        </main>
        <Footer />
      </div>
    );
  }

  // After login, show choice screen
  if (step === 'postLoginChoice') {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-1 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-10 flex flex-col items-center gap-8 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              Welcome! {user?.displayName || user?.email}
            </h2>
            <div className="flex flex-col gap-4 w-full">
              <button
                className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors"
                onClick={() => setStep('upload')}
              >
                Take a New Interview
              </button>
              <button
                className="w-full px-6 py-4 bg-gray-200 text-gray-800 rounded-lg font-semibold text-lg hover:bg-gray-300 transition-colors"
                onClick={() => setStep('leaderboard')}
              >
                View Leaderboard
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Main app flow
  return (
    <InterviewProvider>
      <div className="flex flex-col min-h-screen">
        <NavBar />
        <main className="flex-1">
          <IntervieweeFlow step={step} setStep={setStep} />
        </main>
        <Footer />
      </div>
    </InterviewProvider>
  );
}

export default App; // Ensure only one App function is exported