'use client';
import React, { useState, useEffect } from 'react';
import Footer from '@/components/layout/SubFooter';
import SearchByEip2 from '@/components/tools/SearchByEIP';
import AllTabTables from '@/components/tools/AllTabTables';
import Loader from '@/components/ui/Loader2';
import { motion } from 'motion/react';
import { slideInFromLeft, slideInFromRight } from '@/lib/utils';

const AllPage = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate data fetching with a timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false); // Set loading to false after 2 seconds
    }, 2000); // Simulating a 2-second data fetch

    return () => clearTimeout(timer); // Clean up the timer on component unmount
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#0F172A]">
      <main className="flex-grow px-5 sm:px-10">
        <div className="pt-20 w-full mx-auto">
          {isLoading ? (
            <Loader /> // Show loader while loading
          ) : (
            <>
              <motion.div
                variants={slideInFromLeft(0.5)}
                className="text-[60px] text-white font-bold mt-[10px] text-center mb-[5px]"
              >
                Explore{' '}
                <span className="text-purpleee">
                  Ethereum Improvement Proposals
                </span>
              </motion.div>
              <motion.div
                variants={slideInFromRight(0.5)}
                className="cursive text-[20px] text-gray-200 mb-10 mt-[5px] text-center"
              >
                {
                  "Your gateway to understanding and navigating Ethereum's latest innovations"
                }
              </motion.div>

              <SearchByEip2 defaultQuery="" />
              <AllTabTables />
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AllPage;
