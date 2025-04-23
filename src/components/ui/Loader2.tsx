import React from "react";

const Loader: React.FC = () => {
  return (
    <div className="fixed inset-0 flex justify-center items-center backdrop-blur-md bg-purple-500/30 z-50">
      <div className="w-16 h-16 border-4 border-t-4 border-purple-500/60 border-solid rounded-full animate-spin"></div>
    </div>
  );
};

export default Loader;
