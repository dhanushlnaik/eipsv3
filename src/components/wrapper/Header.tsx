import React from 'react';
import { motion } from 'motion/react';
import { slideInFromLeft, slideInFromRight } from '@/lib/utils';

interface HeaderProps {
  title: string;
  subtitle: string;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  return (
    <>
      <motion.div
        variants={slideInFromLeft(0.5)}
        className="text-[60px] text-white font-bold mt-[10px] text-center mb-[5px]"
      >
        {title}
      </motion.div>
      <motion.div
        variants={slideInFromRight(0.5)}
        className="text-[20px] text-gray-200 mb-10 mt-[5px] text-center"
      >
        {subtitle}
      </motion.div>
    </>
  );
};

export default Header;
