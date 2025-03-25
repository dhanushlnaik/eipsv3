'use client'

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface StatBoxProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description: string;
  url: string;
}

const StatBox: React.FC<StatBoxProps> = ({
  title,
  value,
  icon,
  description,
  url,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[#1a1325] border border-[#6b46c1] hover:border-[#9f7aea] p-6 rounded-xl shadow-lg flex flex-col justify-between cursor-pointer transition duration-200"
    >
      <Link href={url} className="no-underline">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <div className="text-[#9f7aea]">{icon}</div>
        </div>
        <p className="text-2xl font-bold text-[#d6bcfa]">{value}</p>
        <p className="text-sm text-gray-400 mt-2">{description}</p>
      </Link>
    </motion.div>
  );
};

export default StatBox;