'use client';
import PectraC from '@/components/Pectra';
import React from 'react';
import NetworkUpgradesChart from '@/components/charts/NetworkUpgradeBar';
import AuthorContributionsChart from '@/components/charts/AuthorContributionBar';
import Footer from '@/components/layout/SubFooter';
import PectraTable from '@/components/tables/pectraTable';

const Pectra = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0F172A]">
      <main className="flex-grow px-5 sm:px-10">
        <div className="max-w-7xl w-full mx-auto">
          {/* Content */}
          <PectraC />
          <div className="space-y-10 z-10">
            <NetworkUpgradesChart />
            <AuthorContributionsChart />
            <PectraTable />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Pectra;
