'use client';
import { FaLocationArrow } from 'react-icons/fa6';
import { Spotlight } from './ui/Spotlight';
import MagicButton from './ui/MagicButton';
import { motion } from 'framer-motion';
import { SparklesIcon } from '@heroicons/react/24/solid';
import { Button } from './ui/MovingBorders';
import { slideInFromLeft, slideInFromTop } from '@/lib/utils';

const Hero = () => {
  return (
    <>
      <motion.img
        src="/assets/hero.png"
        alt="Floating Hero"
        className="absolute top-20 right-0 z-10 w-1/2 h-auto"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 2, ease: 'easeInOut', repeat: Infinity }}
      />
      <div className="pb-40 pt-40 relative">
        <div>
          <Spotlight
            className="-top-40 -left-10 md:-left-32 md:-top-20 h-screen"
            fill="white"
          />
          <Spotlight
            className="h-[80vh] w-[50vw] top-10 left-full"
            fill="purple"
          />
          <Spotlight className="left-80 top-28 h-[80vh] w-[50vw]" fill="blue" />
        </div>

        <div
          className="h-screen w-full dark:bg-black-100 bg-white dark:bg-grid-white/[0.03] bg-grid-black-100/[0.2]
       absolute top-0 left-0 flex items-center justify-center"
        >
          <div
            className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black-100
         bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"
          />
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex flex-col items-center justify-center px-6 lg:px-20">
          <motion.div
            initial="hidden"
            animate="visible"
            className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-20 w-full max-w-[1200px]"
          >
            {/* Left Content */}
            <div className="flex flex-col gap-6 lg:gap-8 max-w-[600px]">
              <motion.div variants={slideInFromTop} className="gap-2">
                <Button className="p-3">
                  <div className="flex items-center gap-2">
                    <SparklesIcon className="text-purpleee h-5 w-5" />
                    <h1 className="text-sm font-medium text-purpleee">
                      Empowering Ethereum
                    </h1>
                  </div>
                </Button>
              </motion.div>

              <motion.h1
                variants={slideInFromLeft(0.5)}
                className="text-5xl lg:text-6xl font-bold text-white leading-tight"
              >
                Tracking Progress,{' '}
                <span className="text-purpleee">Shaping Ethereum</span>
              </motion.h1>

              <motion.p
                variants={slideInFromLeft(0.8)}
                className="text-lg text-gray-400 leading-relaxed"
              >
                EIPsInsight provides powerful tools and visual insights into the
                Ethereum Improvement Proposal ecosystem. Track, analyze, and
                support the progress of EIPs, ERCs, and RIPs with clarity and
                ease.
              </motion.p>

              <motion.div variants={slideInFromTop} className=" flex ">
                <a href="#dashboard">
                  <MagicButton
                    title="Explore EIPS"
                    icon={<FaLocationArrow />}
                    position="right"
                  />
                </a>
              </motion.div>
            </div>

            {/* Right Content */}
          </motion.div>

          {/* Explore Button */}
        </div>
      </div>
    </>
  );
};

export default Hero;
