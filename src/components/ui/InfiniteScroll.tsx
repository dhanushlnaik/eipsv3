'use client';

import React from 'react';

import { testimonials } from '@/data';
import { InfiniteMovingCards } from './InfiniteCards';
import { motion } from 'motion/react';
import { slideInFromLeft, slideInFromRight } from '@/lib/utils';

const Clients = () => {
  return (
    <section id="testimonials" className="py-20">
      <motion.div
        variants={slideInFromLeft(0.5)}
        className="text-[60px] text-white font-bold text-center"
      >
        Trending
        <span className="text-purpleee"> EIPS</span>
      </motion.div>

      <motion.div
        variants={slideInFromRight(0.5)}
        className="cursive text-[20px] text-gray-200 mb-10 mt-[5px] text-center"
      >
        Explore the most impactful proposals shaping Ethereum today.
      </motion.div>

      <div className="flex flex-col items-center max-lg:mt-10">
        <div
          // remove bg-white dark:bg-black dark:bg-grid-white/[0.05], h-[40rem] to 30rem , md:h-[30rem] are for the responsive design
          className="h-[50vh] md:h-[30rem] rounded-md flex flex-col antialiased  items-center justify-center relative overflow-hidden"
        >
          <InfiniteMovingCards
            items={testimonials}
            direction="right"
            speed="slow"
          />
        </div>
      </div>
    </section>
  );
};

export default Clients;
