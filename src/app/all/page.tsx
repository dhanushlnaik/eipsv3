'use client';
import React from 'react';
import Footer from '@/components/layout/SubFooter';
import SearchByEip2 from '@/components/tools/SearchByEIP';


const AllPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0F172A]">
      <SearchByEip2 defaultQuery="" />
      <Footer />
    </div>
  );
};

export default AllPage;
