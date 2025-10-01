// src/components/Login.tsx
import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword } from 'firebase/auth';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

export function Login({ onLogin }: { onLogin: (user: any) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      let userCredential;
      if (isSignUp) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      }
      const user = userCredential.user;
      // Store user info in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || '',
        provider: 'email',
      }, { merge: true });
      onLogin(user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      // Store user info in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || '',
        provider: 'google',
      }, { merge: true });
      onLogin(user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6">{isSignUp ? 'Sign Up' : 'Login'}</h2>
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required
          />
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button
            type="submit"
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            disabled={loading}
          >
            {loading ? (isSignUp ? 'Signing up...' : 'Logging in...') : (isSignUp ? 'Sign Up' : 'Login')}
          </button>
        </form>
        <div className="mt-6 text-center">
          <button
            onClick={handleGoogleLogin}
            className="w-full px-6 py-3 flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors shadow-sm"
            disabled={loading}
          >
            {/* Google logo SVG */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
              <g>
                <path fill="#4285F4" d="M24 9.5c3.54 0 6.36 1.22 8.32 2.26l6.18-6.18C34.36 2.34 29.52 0 24 0 14.64 0 6.4 5.64 2.44 13.86l7.6 5.91C12.36 13.36 17.68 9.5 24 9.5z"/>
                <path fill="#34A853" d="M46.1 24.5c0-1.64-.15-3.22-.44-4.75H24v9h12.44c-.54 2.92-2.18 5.39-4.64 7.07l7.6 5.91C43.6 37.6 46.1 31.6 46.1 24.5z"/>
                <path fill="#FBBC05" d="M10.04 28.36c-.6-1.8-.94-3.7-.94-5.86s.34-4.06.94-5.86l-7.6-5.91C.86 15.36 0 19.52 0 24s.86 8.64 2.44 13.86l7.6-5.91z"/>
                <path fill="#EA4335" d="M24 48c5.52 0 10.36-1.82 14.32-4.96l-7.6-5.91c-2.12 1.42-4.84 2.27-7.72 2.27-6.32 0-11.64-3.86-13.96-9.27l-7.6 5.91C6.4 42.36 14.64 48 24 48z"/>
                <path fill="none" d="M0 0h48v48H0z"/>
              </g>
            </svg>
            {loading ? 'Logging in...' : 'Login with Google'}
          </button>
          <div className="mt-4">
            <button
              type="button"
              className="text-blue-600 underline text-sm"
              onClick={() => { setIsSignUp((v) => !v); setError(''); }}
            >
              {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
