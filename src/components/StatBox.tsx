'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

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
      whileHover={{
        scale: 1.05,
        borderColor: '#D6BCFA',
        boxShadow: '0px 4px 15px rgba(159, 122, 234, 0.5)',
      }}
      transition={{ duration: 0.3 }}
      className="bg-[#1a1325] border border-[#6b46c1] hover:border-[#d6bcfa] p-6 rounded-xl shadow-lg flex flex-col justify-between h-full min-h-[180px] cursor-pointer transition-all duration-300"
    >
      <Link href={url} className="no-underline flex flex-col h-full">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <div className="text-[#9f7aea]">{icon}</div>
        </div>
        <p className="text-2xl font-bold text-[#d6bcfa]">{value}</p>
        <p className="text-sm text-gray-400 mt-auto">{description}</p>{' '}
        {/* Pushes to bottom */}
      </Link>
    </motion.div>
  );
};

export default StatBox;
