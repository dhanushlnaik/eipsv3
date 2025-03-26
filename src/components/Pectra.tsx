"use client";
import React from 'react'
import { Button } from './ui/MovingBorders'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import { HoverEffect } from './ui/CardHover';
import PectraCountdown from './PectraCountdown';

const PectraC = () => {
  return (
           <div className="pt-20 w-full">

      <motion.div
        initial={{ opacity: 0.5, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        
      >
        <h1 className="mt-8 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl">
        Ethereum Network Upgrades 
        </h1>
        <div
        className='cursive text-[20px] text-gray-200 mb-5 mt-[5px] text-center'
        >
            Pectra
        </div>
        <PectraCountdown/>
      </motion.div>

        
              <div className="flex lg:flex-row flex-col lg:items-center p-2 py-6 md:p-5 lg:p-10 gap-2">
      
                        <Button
                          duration={Math.floor(Math.random() * 10000) + 10000}
                          borderRadius="1.75rem"
                          style={{
                            background: "rgb(4,7,29)",
                            backgroundColor:
                              "linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)",
                            borderRadius: `calc(1.75rem* 0.96)`,
                          }}
                          // remove bg-white dark:bg-slate-900
                          className="flex-1 text-black dark:text-white border-neutral-200 dark:border-slate-800"
                        >
    
                  <div className="p-20 lg:ms-5">
                    <p className="text-start text-xl text-white-100 mt-3 font-semibold">
                    EIPsInsight is specialized in toolings designed to provide clear, visual insights into the activity of Ethereum Improvement Proposal (EIP), Ethereum Request for Comments (ERCs), and Rollup Improvement Proposals (RIPs), over a specified period. Data provided is used for tracking the progress and workload distribution among EIP Editors, ensuring transparency and efficiency in the proposal review process.
                    </p>
                  </div>
                  </Button>
                </div>
                <HoverEffect items={projects}/>
            </div>
  )
}

export const projects = [
  {
    title: `EtherWorld Week #${Math.floor(Math.random() * 100)}`,
    description: `EtherWorld Week #${Math.floor(Math.random() * 100)}`,
    link: `https://etherworld.co/week-${Math.floor(Math.random() * 100)}`,
  },
  {
    title: `EtherWorld Week #${Math.floor(Math.random() * 100)}`,
    description: `EtherWorld Week #${Math.floor(Math.random() * 100)}`,
    link: `https://etherworld.co/week-${Math.floor(Math.random() * 100)}`,
  },
  {
    title: `EtherWorld Week #${Math.floor(Math.random() * 100)}`,
    description: `EtherWorld Week #${Math.floor(Math.random() * 100)}`,
    link: `https://etherworld.co/week-${Math.floor(Math.random() * 100)}`,
  },
  {
    title: `EtherWorld Week #${Math.floor(Math.random() * 100)}`,
    description: `EtherWorld Week #${Math.floor(Math.random() * 100)}`,
    link: `https://etherworld.co/week-${Math.floor(Math.random() * 100)}`,
  },
  {
    title: `EtherWorld Week #${Math.floor(Math.random() * 100)}`,
    description: `EtherWorld Week #${Math.floor(Math.random() * 100)}`,
    link: `https://etherworld.co/week-${Math.floor(Math.random() * 100)}`,
  },
  {
    title: `EtherWorld Week #${Math.floor(Math.random() * 100)}`,
    description: `EtherWorld Week #${Math.floor(Math.random() * 100)}`,
    link: `https://etherworld.co/week-${Math.floor(Math.random() * 100)}`,
  },
];


export const LampContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-950 w-full rounded-md z-0",
        className
      )}
    >
      <div className="relative flex w-full flex-1 scale-y-125 items-center justify-center isolate z-0 ">
        <motion.div
          initial={{ opacity: 0.5, width: "15rem" }}
          whileInView={{ opacity: 1, width: "30rem" }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          style={{
            backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
          }}
          className="absolute inset-auto right-1/2 h-56 overflow-visible w-[30rem] bg-gradient-conic from-cyan-500 via-transparent to-transparent text-white [--conic-position:from_70deg_at_center_top]"
        >
          <div className="absolute  w-[100%] left-0 bg-slate-950 h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
          <div className="absolute  w-40 h-[100%] left-0 bg-slate-950  bottom-0 z-20 [mask-image:linear-gradient(to_right,white,transparent)]" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0.5, width: "15rem" }}
          whileInView={{ opacity: 1, width: "30rem" }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          style={{
            backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
          }}
          className="absolute inset-auto left-1/2 h-56 w-[30rem] bg-gradient-conic from-transparent via-transparent to-cyan-500 text-white [--conic-position:from_290deg_at_center_top]"
        >
          <div className="absolute  w-40 h-[100%] right-0 bg-slate-950  bottom-0 z-20 [mask-image:linear-gradient(to_left,white,transparent)]" />
          <div className="absolute  w-[100%] right-0 bg-slate-950 h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
        </motion.div>
        <div className="absolute top-1/2 h-48 w-full translate-y-12 scale-x-150 bg-slate-950 blur-2xl"></div>
        <div className="absolute top-1/2 z-50 h-48 w-full bg-transparent opacity-10 backdrop-blur-md"></div>
        <div className="absolute inset-auto z-50 h-36 w-[28rem] -translate-y-1/2 rounded-full bg-cyan-500 opacity-50 blur-3xl"></div>
        <motion.div
          initial={{ width: "8rem" }}
          whileInView={{ width: "16rem" }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="absolute inset-auto z-30 h-36 w-64 -translate-y-[6rem] rounded-full bg-cyan-400 blur-2xl"
        ></motion.div>
        <motion.div
          initial={{ width: "15rem" }}
          whileInView={{ width: "30rem" }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="absolute inset-auto z-50 h-0.5 w-[30rem] -translate-y-[7rem] bg-cyan-400 "
        ></motion.div>
 
        <div className="absolute inset-auto z-40 h-44 w-full -translate-y-[12.5rem] bg-slate-950 "></div>
      </div>
 
      <div className="relative z-50 flex -translate-y-80 flex-col items-center px-5">
        {children}
      </div>
    </div>
  );
};

export default PectraC