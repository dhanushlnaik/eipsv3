"use client";
import Image from "next/image";
import React, { useState } from "react";

const Navbar = () => {
  const [isLightMode, setIsLightMode] = useState(false);

  const toggleLightMode = () => {
    setIsLightMode(!isLightMode);
    document.documentElement.classList.toggle("light");
  };

  return (
    <div className={`w-full h-[65px] fixed top-0 z-50 px-10 backdrop-blur-md ${isLightMode ? "bg-white/30" : "bg-purple-900/30"}`}>
      <div className="w-full h-full flex flex-row items-center justify-between m-auto px-4">
        <a
          href="#about-me"
          className="h-auto w-auto flex flex-row items-center border border-white/30 bg-white/10 mr-4 px-4 py-2 rounded-full text-gray-200"
        >
          <Image src="/EIPsInsights.gif" width={30} height={30} alt="EIPS"/>
          <span className="ml-2 hidden md:block text-gray-200">
            EIPs Insights
          </span>
        </a>

        <div className="w-[500px] h-full flex flex-row items-center justify-between md:mr-20">
          <div className="flex items-center justify-between w-full h-auto border border-white/30 bg-purple-800/50 px-5 py-2 rounded-full text-gray-200">
            {[
              { href: "/pectra", label: "Pectra" },
              { href: "/alleips", label: "All EIPs" },
              { href: "/tools", label: "Tools" },
              { href: "/insights", label: "Insights" },
              { href: "/more", label: "More" },
            ].map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="cursor-pointer relative text-gray-200 hover:text-purple-400 transition-colors duration-300 group"
              >
                {label}
                <span className="absolute bottom-0 left-1/2 w-0 h-[2px] bg-purple-400 transition-all duration-300 transform -translate-x-1/2 group-hover:w-full group-hover:left-0"></span>
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-row gap-5">
          <button
            onClick={toggleLightMode}
            className="w-10 h-10 flex items-center justify-center rounded-full border text-gray-800 hover:bg-gray-300 transition-colors duration-300"
          >
            {isLightMode ? "🌙" : "☀️"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;