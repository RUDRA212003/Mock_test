import React, { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// --- CUSTOM CSS KEYFRAMES & SCROLLBAR HIDING RULES ---
const customStyles = `
  /* Background Stars Moving Upwards */
  @keyframes moveUp {
    0% { transform: translateY(0); opacity: 1; }
    90% { opacity: 1; }
    100% { transform: translateY(-150vh); opacity: 0; }
  }
  /* Background Glows (Slow Pulse) */
  @keyframes animate-pulse-slow {
      0%, 100% { opacity: 0.2; }
      50% { opacity: 0.6; }
  }

  /* --- HIDE SCROLLBAR CSS --- */
  /* For Webkit browsers (Chrome, Safari, Edge, Opera) */
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
    width: 0 !important;
  }
  /* For Firefox */
  .hide-scrollbar {
    scrollbar-width: none; /* Firefox */
  }
`;

// --- HELPER COMPONENT: Testimonial Card ---
const TestimonialCard = ({ quote, name, title }) => {
  return (
    <motion.div
      className="p-8 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg flex flex-col justify-between h-full relative overflow-hidden"
      whileHover={{ scale: 1.03, boxShadow: "0 0 25px rgba(6, 182, 212, 0.4)" }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <p className="text-xl italic text-gray-200 mb-6 relative z-10">"{quote}"</p>
      <div className="relative z-10 pt-4 border-t border-white/10">
        <p className="text-cyan-400 font-semibold text-lg">{name}</p>
        <p className="text-gray-400 text-sm">{title}</p>
      </div>
    </motion.div>
  );
};

// --- HELPER COMPONENT: Footer ---
const Footer = () => {
  return (
    <motion.footer 
      className="py-12 border-t border-white/10 text-center text-gray-500 text-sm bg-gray-950/50 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 1 }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <p className="mb-4">&copy; {new Date().getFullYear()} CRISP AI. All rights reserved. | Powered by Next-Gen LLMs</p>
        <div className="flex justify-center space-x-6">
          
          {/* LinkedIn Logo Link */}
          <a href="https://www.linkedin.com/in/rudresh-manjunath21/" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors" title="LinkedIn Profile">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.57-4 0v5.604h-3v-11h3v1.765c1.397-2.793 7-2.257 7 3.514v5.721z"/></svg>
          </a>
          
          {/* GitHub Logo Link */}
          <a href="https://github.com/RUDRA212003" target="_blank" rel="noopener noreferrer" className="hover:text-fuchsia-400 transition-colors" title="GitHub Profile">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.087-.731.084-.676.084-.676 1.205.082 1.839 1.235 1.839 1.235 1.071 1.838 2.809 1.305 3.493.998.108-.77.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.046.138 3.003.404 2.292-1.552 3.3-1.23 3.3-1.23.653 1.653.242 2.874.118 3.176.766.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.2-6.096 8.2-11.391 0-6.627-5.373-12-12-12z"/></svg>
          </a>
        </div>
      </div>
    </motion.footer>
  );
};


// --- MAIN COMPONENT: LandingScreen ---
export default function LandingScreen({ onStart }: { onStart: () => void }) {
  
  const contentRef = useRef(null); 
  const feedbackSectionRef = useRef(null); 

  // --- FRAMER MOTION SCROLL LOGIC for STICKY BUTTON ---
  const { scrollY } = useScroll();
  
  // Opacity will be 0 until scrollY reaches 400px (just past the hero), then fades in fully by 500px.
  const buttonOpacity = useTransform(scrollY, [400, 500], [0, 1]);
  // The button only appears after the scroll threshold is passed.
  const buttonDisplay = useTransform(scrollY, [399, 400], ["none", "block"]); 

  // --- AUTOMATIC SMOOTH SCROLL LOGIC ---
  useEffect(() => {
    const scrollToSection = () => {
      if (feedbackSectionRef.current) {
        const offsetTop = feedbackSectionRef.current.offsetTop;
        
        if (contentRef.current) {
             contentRef.current.scrollTo({
                top: offsetTop - 150, 
                behavior: 'smooth' 
            });
        }
      }
    };

    const timer = setTimeout(scrollToSection, 2000); 

    return () => clearTimeout(timer); 
  }, []); 

  // --- DATA (Testimonials and Stars) ---
  const testimonials = [
    { quote: "CRISP AI's practice sessions were critical for my offer at Google. The personalized feedback is unmatched.", name: "Anya Sharma", title: "Senior Software Engineer, Google" },
    { quote: "I aced the behavioral rounds thanks to the realistic simulations. Truly a game-changer for my career.", name: "Ben Carter", title: "Product Manager, Microsoft" },
    { quote: "From struggling with LeetCode to confidently solving hard problems, CRISP AI transformed my approach.", name: "Chloe Lee", title: "Data Scientist, Meta" },
    { quote: "The closest you can get to real-world interview experience without leaving your home. Highly recommend!", name: "David Kim", title: "Machine Learning Engineer" },
    { quote: "The instant, actionable feedback helped me refine my answers much faster than traditional methods.", name: "Eva Martinez", title: "Engineering Lead" },
    { quote: "CRISP AI gave me the edge I needed. My communication and problem-solving skills peaked just in time.", name: "Felix Wong", title: "Cybersecurity Analyst" },
  ];

  const stars = React.useMemo(() => {
    return Array.from({ length: 250 }).map((_, i) => ({
      key: i,
      size: Math.random() * 2 + 0.8,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      duration: Math.random() * 8 + 4,
      delay: `-${Math.random() * 8}s`,
    }));
  }, []);

  // --- RENDER ---
  return (
    <>
      {/* Inject custom keyframes and SCROLLBAR HIDING RULES */}
      <style>{customStyles}</style>

      {/* --- STICKY CTA BUTTON (Appears on scroll) --- */}
      <motion.div 
        className="fixed top-4 right-4 z-50 transition-all" // Fixed to top-right
        style={{ opacity: buttonOpacity, display: buttonDisplay }}
      >
        <motion.button
            onClick={onStart}
            className="px-6 py-3 text-base font-bold rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-500 text-gray-900 uppercase shadow-2xl"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
        >
            Start Interview Now
        </motion.button>
      </motion.div>

      {/* Main container: Fixed background, scrollable foreground */}
      <div className="min-h-screen bg-gray-950 overflow-hidden relative font-inter text-gray-100">

        {/* --- FIXED BACKGROUND (Stars and Glows) --- */}
        <div className="fixed inset-0 z-0 bg-gradient-to-br from-gray-950 to-indigo-950">
          
          {/* Star Field (Moving Upwards) */}
          {stars.map((star) => (
            <div
              key={star.key}
              className="absolute bg-white rounded-full will-change-transform"
              style={{
                width: `${star.size}px`,
                height: `${star.size}px`,
                left: star.left,
                top: star.top,
                animation: `moveUp ${star.duration}s linear infinite`,
                animationDelay: star.delay,
                boxShadow: `0 0 ${star.size}px rgba(255, 255, 255, 0.4)`,
              }}
            />
          ))}

          {/* Soft Background Glows (Slow Pulse) */}
          <div className="absolute inset-0 opacity-60 pointer-events-none">
            <div className="absolute -top-1/4 -left-1/4 w-[500px] h-[500px] bg-indigo-700 rounded-full mix-blend-screen filter blur-3xl" style={{ animation: 'animate-pulse-slow 12s infinite ease-in-out', animationDelay: '0s' }} />
            <div className="absolute bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-fuchsia-800 rounded-full mix-blend-screen filter blur-3xl" style={{ animation: 'animate-pulse-slow 10s infinite ease-in-out', animationDelay: '3s' }} />
            <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-cyan-700 rounded-full mix-blend-screen filter blur-3xl" style={{ animation: 'animate-pulse-slow 14s infinite ease-in-out', animationDelay: '6s' }} />
          </div>
        </div>

        {/* --- SCROLLABLE FOREGROUND CONTENT --- */}
        <div ref={contentRef} className="relative z-10 w-full pt-0 overflow-y-auto h-screen hide-scrollbar">
          
          {/* 1. HERO SECTION */}
          <section className="min-h-[85vh] flex flex-col items-center justify-center text-center p-8 lg:p-16">
            <motion.img
              src="/Logo.svg"
              alt="CRISP AI Logo"
              className="w-32 h-32 lg:w-48 lg:h-48 mb-8"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
            <motion.h1
              className="text-6xl lg:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400 mb-6 tracking-tight drop-shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 1, ease: "easeOut" }}
            >
              CRISP AI
            </motion.h1>
            <motion.p
              className="text-2xl lg:text-3xl text-gray-300 mb-12 max-w-3xl font-light leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 1, ease: "easeOut" }}
            >
              Your personal AI-driven coach for mastering any job interview.
              Prepare smarter, perform better, and land your dream role.
            </motion.p>

            <motion.button
              onClick={onStart}
              className="px-12 py-5 text-xl lg:text-2xl font-bold rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-gray-900 shadow-xl uppercase tracking-wider transition-all duration-300"
              whileHover={{ scale: 1.07, boxShadow: "0 0 35px rgba(235, 235, 52, 0.9)" }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 1, ease: "easeOut" }}
            >
              Begin Interview Practice
            </motion.button>

            {/* Subtle indicator to show content continues below */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, repeat: Infinity, duration: 1.5 }}
                className="absolute bottom-10 text-cyan-400 flex flex-col items-center"
            >
                {/* <p className="text-sm">Scroll Down</p>
                <svg className="w-5 h-5 mt-1 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg> */}
            </motion.div>
          </section>

          {/* 2. FEEDBACK SECTION (Target for automatic scroll) */}
          <section ref={feedbackSectionRef} className="py-24 max-w-7xl mx-auto px-4" id="feedback">
            <motion.h2
              className="text-5xl lg:text-6xl font-extrabold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-fuchsia-300 drop-shadow-lg"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8 }}
            >
              Hear From Our Champions
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {testimonials.map((t, index) => (
                <TestimonialCard key={index} {...t} />
              ))}
            </div>
          </section>

          {/* 3. FINAL CTA SECTION */}
          <section className="py-24 max-w-5xl mx-auto px-4 text-center" id="final-cta">
            <motion.div
              className="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-12 shadow-2xl"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-4xl font-bold text-fuchsia-400 mb-4">
                Ready to transform your interview game?
              </h3>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                just click the button and begin your personalized practice session right away.
              </p>
              <motion.button
                onClick={onStart}
                className="px-12 py-5 text-xl lg:text-2xl font-bold rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-gray-900 shadow-xl uppercase tracking-wider transition-all duration-300"
                whileHover={{ scale: 1.07, boxShadow: "0 0 35px rgba(52, 211, 235, 0.9)" }}
                whileTap={{ scale: 0.95 }}
              >
                Start Free Practice
              </motion.button>
            </motion.div>
          </section>

          {/* 4. FOOTER */}
          <Footer />

        </div>
      </div>
    </>
  );
}
