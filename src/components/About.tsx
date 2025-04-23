import React from 'react';
import { Button } from './ui/MovingBorders';

const About = () => {
  return (
    <div className="py-20 w-full flex flex-col items-center px-4 md:px-8 lg:px-16">
      <div className="flex flex-col lg:flex-row lg:items-center w-full max-w-7xl gap-6">
        <Button
          duration={Math.floor(Math.random() * 10000) + 10000}
          borderRadius="1.75rem"
          style={{
            background: 'rgb(4,7,29)',
            backgroundColor:
              'linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)',
            borderRadius: `calc(1.75rem * 0.96)`,
          }}
          className="flex-1 text-black dark:text-white border-neutral-200 dark:border-slate-800 p-6 md:p-10 lg:p-12"
        >
          <div className="p-5 md:p-8 lg:p-10">
            <h1 className="heading pb-6 text-3xl md:text-4xl lg:text-5xl text-center lg:text-left">
              What is <span className="text-purpleee">EIPs Insights</span>
            </h1>
            <p className="text-start text-base md:text-lg lg:text-xl text-white-100 font-semibold leading-relaxed">
              EIPsInsight specializes in tools designed to provide clear, visual
              insights into the activity of Ethereum Improvement Proposals
              (EIPs), Ethereum Request for Comments (ERCs), and Rollup
              Improvement Proposals (RIPs) over a specified period. The provided
              data helps track the progress and workload distribution among EIP
              Editors, ensuring transparency and efficiency in the proposal
              review process.
            </p>
          </div>
        </Button>
      </div>
    </div>
  );
};

export default About;
