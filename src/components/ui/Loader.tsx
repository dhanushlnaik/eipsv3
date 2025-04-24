'use client';
import React from 'react';
import Image from 'next/image';

const Loader = () => {
  return (
    <div className="relative flex items-center justify-center w-full h-screen">
      {/* Rotating Gradient Circle */}
      <div className="container">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Logo in the center */}
      <div className="absolute flex items-center justify-center w-16 h-16 rounded-full bg-black">
        <Image
          src="/EIPsInsights.gif"
          alt="Logo"
          width={48}
          height={48}
          className="object-contain"
        />
      </div>
    </div>
  );
};

export default Loader;
