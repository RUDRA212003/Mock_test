import React from 'react';

export default function LandingScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
      <div className="flex flex-col items-center justify-center gap-6 md:gap-8 p-4 md:p-8 rounded-2xl shadow-xl bg-white/80 w-full max-w-lg mx-auto">
        <img src="/Logo.svg" alt="CareerMock AI Logo" className="w-20 h-20 md:w-24 md:h-24 mb-4" />
        <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-2 text-center drop-shadow-lg">Welcome to PREP AI</h1>
        <p className="text-base md:text-lg text-gray-600 mb-6 text-center max-w-xs md:max-w-md">Your personalized interview practice platform. Get ready to ace your next interview!</p>
        <button
          onClick={onStart}
          className="w-full md:w-auto px-6 py-3 md:px-8 md:py-4 text-lg md:text-xl font-semibold rounded-full bg-gradient-to-r from-blue-600 to-pink-500 text-white shadow-lg hover:scale-105 transition-transform"
        >
          Start Interview
        </button>
      </div>
    </div>
  );
}
