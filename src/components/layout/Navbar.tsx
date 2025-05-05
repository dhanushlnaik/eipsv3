'use client';
import Image from 'next/image';
import React, { useState } from 'react';
import SearchBox from '../tools/SearchBar';
import Link from 'next/link';

const Navbar = () => {
  const [isLightMode, setIsLightMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleLightMode = () => {
    setIsLightMode(!isLightMode);
    document.documentElement.classList.toggle('light');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div
      className={`w-full h-[65px] fixed top-0 z-50 px-4 md:px-10 backdrop-blur-md ${
        isLightMode ? 'bg-white/30' : 'bg-purple-900/30'
      }`}
    >
      <div className="w-full h-full flex items-center justify-between m-auto">
        {/* Logo */}
        <Link
          href="/"
          className="h-auto w-auto flex items-center border border-white/30 bg-white/10 px-4 py-2 rounded-full text-gray-200"
        >
          <Image src="/EIPsInsights.gif" width={30} height={30} alt="EIPS" />
          <span className="ml-2 hidden md:block text-gray-200">
            EIPs Insights
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex w-[500px] h-full items-center justify-between">
          <div className="flex items-center justify-between w-full h-auto border border-white/30 bg-purple-800/50 px-5 py-2 rounded-full text-gray-200">
            {[
              { href: '/pectra', label: 'Pectra' },
              { href: '/all', label: 'All EIPs' },
              { href: '/boards', label: 'Boards' },
              { href: '/insights', label: 'Insights' },
              { href: '/Analytics', label: 'Analytics' },
            ].map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="cursor-pointer relative text-gray-200 hover:text-purple-400 transition-colors duration-300 group"
              >
                {label}
                <span className="absolute bottom-0 left-1/2 w-0 h-[2px] bg-purple-400 transition-all duration-300 transform -translate-x-1/2 group-hover:w-full"></span>
              </a>
            ))}
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={toggleMenu}
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-full border text-gray-200 hover:bg-gray-300 transition-colors duration-300"
        >
          {isMenuOpen ? '✖' : '☰'}
        </button>

        {/* Search and Light Mode Toggle */}
        <div className="hidden md:flex flex-row gap-5">
          <SearchBox />
          <button
            onClick={toggleLightMode}
            className="w-10 h-10 flex items-center justify-center rounded-full border text-gray-800 hover:bg-gray-300 transition-colors duration-300"
          >
            {isLightMode ? '🌙' : '☀️'}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden flex flex-col gap-4 mt-4 bg-purple-800/50 p-4 rounded-lg text-gray-200">
          {[
            { href: '/pectra', label: 'Pectra' },
            { href: '/alleips', label: 'All EIPs' },
            { href: '/tools', label: 'Tools' },
            { href: '/insights', label: 'Insights' },
            { href: '/more', label: 'More' },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="cursor-pointer text-gray-200 hover:text-purple-400 transition-colors duration-300"
            >
              {label}
            </Link>
          ))}
          <SearchBox />
          <button
            onClick={toggleLightMode}
            className="w-full flex items-center justify-center rounded-full border text-gray-800 hover:bg-gray-300 transition-colors duration-300"
          >
            {isLightMode ? '🌙' : '☀️'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;
