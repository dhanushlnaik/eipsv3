'use client'; // if using App Router
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function NotFoundPage() {
  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen bg-black text-white overflow-hidden">
      {/* Blurred SVG background */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="absolute inset-0 overflow-hidden flex justify-center items-center"
      >
        <svg
          className="absolute opacity-30 blur-3xl"
          width="1000"
          height="1000"
          viewBox="0 0 1000 1000"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 3, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' }}
            d="M321.5,255.5Q325,461,525,420Q725,379,720,580Q715,781,512.5,776Q310,771,245,621Q180,471,216.5,363.5Q253,256,321.5,255.5Z"
            fill="url(#grad)"
          />
          <defs>
            <radialGradient id="grad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#A855F7" />
              <stop offset="100%" stopColor="#6B21A8" />
            </radialGradient>
          </defs>
        </svg>
      </motion.div>

      {/* Content */}
      <div className="z-10 text-center space-y-6 px-4">
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-7xl sm:text-9xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
        >
          404
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-lg sm:text-2xl"
        >
          {"Oops! The page you're looking for doesn't exist."}
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Link
            href="/"
            className="inline-block bg-purple-600 hover:bg-purple-700 transition text-white font-semibold py-2 px-6 rounded-full shadow-lg backdrop-blur-md bg-opacity-60 border border-white/20"
          >
            Go Home
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
