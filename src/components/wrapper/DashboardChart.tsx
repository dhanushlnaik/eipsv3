'use client';

import React from 'react';
import { motion } from 'motion/react';
import { slideInFromLeft, slideInFromRight } from '@/lib/utils';
import EIPChartWrapper from '../charts/EIPChartWrapper';

const DashboardChart = () => {
  return (
    <div className="py-40 w-full">
      <motion.div
        variants={slideInFromLeft(0.5)}
        className="text-[60px] text-white font-bold mt-10 text-center mb-5"
      >
        All <span className="text-purpleee">EIPs</span>
      </motion.div>
      <motion.div
        variants={slideInFromRight(0.5)}
        className="cursive text-[20px] text-gray-200 mt-5 mb-10 text-center"
      >
        Ethereum Improvement Proposals (EIPs) Categorization Over the Years
        (2015-2025)
      </motion.div>
      <EIPChartWrapper type={'All'} />
    </div>
  );
};

export default DashboardChart;
