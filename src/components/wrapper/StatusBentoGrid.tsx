'use client';

import React from 'react';
import { BentoGrid } from '../ui/BentoGrid';
import StatusChartWrapper from './StatusChartWrapper';
import { motion } from 'motion/react';
import { slideInFromLeft, slideInFromRight } from '@/lib/utils';

export default function BentoGridSecondDemo() {
  return (
    <>
      <motion.div
        variants={slideInFromLeft(0.5)}
        className="text-[60px] text-white font-bold mt-[10px] text-center mb-[5px]"
      >
        EIP Status <span className="text-purpleee"> Changes by Year </span>
      </motion.div>
      <motion.div
        variants={slideInFromRight(0.5)}
        className="cursive text-[20px] text-gray-200 mb-10 mt-[5px] text-center"
      >
        Graph shows the number of EIPs that transitioned into different statuses
        each year.
      </motion.div>
      <BentoGrid className="max-w-8xl mx-auto grid md:grid-cols-3 gap-8 md:auto-rows-[24rem]">
        <StatusChartWrapper category="ERC" type="bar" />

        {/* Other Charts */}
        <StatusChartWrapper category="Core" type="bar" />
        <StatusChartWrapper category="Networking" type="bar" />
        <StatusChartWrapper category="Interface" type="bar" />
        <StatusChartWrapper category="Meta" type="bar" />
        <StatusChartWrapper category="Informational" type="bar" />
      </BentoGrid>
    </>
  );
}
