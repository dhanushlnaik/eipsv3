import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="fixed inset-0 flex flex-col justify-center items-center backdrop-blur-md bg-purple-500/30 z-50 animate-fade-in">
      <div className="w-16 h-16 border-4 border-t-purple-500 border-purple-300 border-solid rounded-full animate-spin mb-4"></div>
      <p className="text-lg font-semibold text-purple-800 animate-pulse">Loading Experience...</p>

      <style jsx>{`
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: scale(0.95);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Loader;
