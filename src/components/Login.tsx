// src/components/Login.tsx
import React, { useState } from "react";
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

export function Login({ onLogin }: { onLogin: (user: any) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  // 🌠 Star data
  const stars = React.useMemo(() => {
    return Array.from({ length: 250 }).map((_, i) => ({
      key: i,
      size: Math.random() * 2 + 0.5,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      duration: Math.random() * 6 + 3,
      delay: `-${Math.random() * 8}s`,
    }));
  }, []);

  // 🌟 Hover splash
  const handleMouseOver = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    el.classList.add("splash");
    setTimeout(() => el.classList.remove("splash"), 400);
  };

  // 🔐 Handle email auth
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      let userCredential;
      if (isSignUp) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      }
      const user = userCredential.user;
      await setDoc(
        doc(db, "users", user.uid),
        {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || "",
          provider: isSignUp ? "email-signup" : "email-login",
        },
        { merge: true }
      );
      onLogin(user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔑 Google login
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      await setDoc(
        doc(db, "users", user.uid),
        {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || "",
          provider: "google",
        },
        { merge: true }
      );
      onLogin(user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ✅ Global styles (React-safe, no jsx issue) */}
      <style>{`
        @keyframes moveUp {
          0% { transform: translateY(100vh); opacity: 0; }
          20% { opacity: 1; }
          100% { transform: translateY(-20vh); opacity: 0; }
        }

        @keyframes splash {
          0% { transform: scale(1); opacity: 1; background:white; }
          50% { transform: scale(3); opacity: 0.9; background: cyan; box-shadow: 0 0 15px cyan; }
          100% { transform: scale(0); opacity: 0; }
        }

        .splash {
          animation: splash 0.4s ease-out forwards !important;
        }
      `}</style>

      {/* 🌌 Full-screen container */}
      <div className="relative w-screen h-screen flex items-center justify-center bg-gray-950 overflow-hidden">
        
        {/* 🌠 Stars background */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {stars.map((star) => (
            <div
              key={star.key}
              onMouseOver={handleMouseOver}
              className="absolute bg-white rounded-full will-change-transform"
              style={{
                width: `${star.size}px`,
                height: `${star.size}px`,
                left: star.left,
                top: star.top,
                animation: `moveUp ${star.duration}s linear infinite`,
                animationDelay: star.delay,
              }}
            />
          ))}
        </div>

        {/* 🌈 Soft color glows */}
        <div className="absolute inset-0 z-0 opacity-60 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-indigo-700 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-purple-800 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-pulse" />
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-700 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-pulse" />
        </div>

        {/* 🪩 Login Card */}
        <div className="relative z-10 w-full max-w-md p-8 rounded-3xl border border-white/10 backdrop-blur-xl bg-white/5 shadow-2xl">
          <h2 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400 mb-6">
            {isSignUp ? "Create Account" : "Login to CRISP AI"}
          </h2>

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900/60 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900/60 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
              required
            />
            {error && <div className="text-red-400 text-sm">{error}</div>}
            <button
              type="submit"
              className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-gray-900 rounded-lg font-semibold hover:scale-[1.03] hover:shadow-lg transition-transform duration-200"
              disabled={loading}
            >
              {loading
                ? isSignUp
                  ? "Signing up..."
                  : "Logging in..."
                : isSignUp
                ? "Sign Up"
                : "Login"}
            </button>
          </form>

          {/* 🔵 Google Login */}
          <div className="mt-6 text-center">
            <button
              onClick={handleGoogleLogin}
              className="w-full px-6 py-3 flex items-center justify-center gap-2 bg-white/10 border border-gray-600 text-gray-100 rounded-lg font-medium hover:bg-white/20 transition-colors"
              disabled={loading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
                <g>
                  <path fill="#4285F4" d="M24 9.5c3.54 0 6.36 1.22 8.32 2.26l6.18-6.18C34.36 2.34 29.52 0 24 0 14.64 0 6.4 5.64 2.44 13.86l7.6 5.91C12.36 13.36 17.68 9.5 24 9.5z"/>
                  <path fill="#34A853" d="M46.1 24.5c0-1.64-.15-3.22-.44-4.75H24v9h12.44c-.54 2.92-2.18 5.39-4.64 7.07l7.6 5.91C43.6 37.6 46.1 31.6 46.1 24.5z"/>
                  <path fill="#FBBC05" d="M10.04 28.36c-.6-1.8-.94-3.7-.94-5.86s.34-4.06.94-5.86l-7.6-5.91C.86 15.36 0 19.52 0 24s.86 8.64 2.44 13.86l7.6-5.91z"/>
                  <path fill="#EA4335" d="M24 48c5.52 0 10.36-1.82 14.32-4.96l-7.6-5.91c-2.12 1.42-4.84 2.27-7.72 2.27-6.32 0-11.64-3.86-13.96-9.27l-7.6 5.91C6.4 42.36 14.64 48 24 48z"/>
                </g>
              </svg>
              {loading ? "Logging in..." : "Login with Google"}
            </button>

            <div className="mt-4">
              <button
                type="button"
                className="text-cyan-400 underline text-sm hover:text-fuchsia-400 transition-colors"
                onClick={() => {
                  setIsSignUp((v) => !v);
                  setError("");
                }}
              >
                {isSignUp
                  ? "Already have an account? Login"
                  : "Don't have an account? Sign Up"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
