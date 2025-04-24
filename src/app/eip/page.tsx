'use client';
import React, { useState, useEffect } from 'react';
import Footer from '@/components/layout/SubFooter';
import Loader from '@/components/ui/Loader2';
import { motion } from 'motion/react';
import { slideInFromLeft, slideInFromRight } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GithubStats from '@/components/tables/GithubStats';
import EIPStatusBar from '@/components/charts/EIPStatusBar';
import EIPTypeDonut from '@/components/charts/EIPTypeDonut';
import EIPTypeBar from '@/components/charts/EIPTypeBar';
import EIPStatusDonut from '@/components/charts/EIPStatusDonut';
import DraftvFinalBar from '@/components/charts/DraftvFinalBar';
import StackedColumnChart from '@/components/charts/StackedColumnChart';
import CBoxStatus from '@/components/tables/StatusTable';
import CatTable from '@/components/tables/catTable';
import TypeGraphs from '@/components/charts/EIPTypeCharts';
import CatTable2 from '@/components/tables/typeTable';

interface EIP {
  _id: string;
  eip: string;
  title: string;
  author: string;
  status: string;
  type: string;
  category: string;
  created: string;
  discussion: string;
  deadline: string;
  requires: string;
  repo: string;
  unique_ID: number;
  __v: number;
}

interface EIP3 {
  _id: string;
  eip: string;
  fromStatus: string;
  toStatus: string;
  title: string;
  status: string;
  author: string;
  created: string;
  changeDate: string;
  type: string;
  category: string;
  discussion: string;
  deadline: string;
  requires: string;
  pr: number;
  changedDay: number;
  changedMonth: number;
  changedYear: number;
  createdMonth: number;
  createdYear: number;
  __v: number;
}

interface EIP2 {
  status: string;
  eips: {
    status: string;
    month: number;
    year: number;
    date: string;
    count: number;
    category: string;
    eips: EIP[];
  }[];
}

interface APIResponse {
  eip: EIP2[];
  erc: EIP2[];
  rip: EIP2[];
}

interface EIPGroup {
  category: string;
  month: number;
  year: number;
  date: string;
  count: number;
  eips: EIP3[];
}

interface APIResponse2 {
  status: string;
  eips: EIPGroup[];
}

interface Data {
  eip: APIResponse2[];
  erc: APIResponse2[];
  rip: APIResponse2[];
}

const EIPPage = () => {
  const [data, setData] = useState<EIP[]>([]);
  const [data4, setData4] = useState<EIP[]>([]);
  const [data2, setData2] = useState<APIResponse>({
    eip: [],
    erc: [],
    rip: [],
  });
  const [data3, setData3] = useState<Data>({ eip: [], erc: [], rip: [] });
  const [isLoading, setIsLoading] = useState(true);
  // const [selected, setSelected] = useState<'status' | 'type'>('type');
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/new/all`);
        const jsonData = await response.json();
        setData(jsonData.eip);
        setData4(jsonData.eip);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/new/graphsv2`);
        const jsonData = await response.json();
        setData2(jsonData);
        setData3(jsonData);
        setIsLoading(false); // Set loader state to false after data is fetched
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false); // Set loader state to false even if an error occurs
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Simulating a loading delay
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    // Cleanup function
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#0F172A]">
      <main className="flex-grow px-5 sm:px-10">
        <div className="pt-20 w-full mx-auto">
          <motion.div
            variants={slideInFromLeft(0.5)}
            className="text-[60px] text-white font-bold mt-[10px] text-center mb-[5px]"
          >
            {`Ethereum Improvement Proposal - [${data.length}]`}
          </motion.div>
          <motion.div
            variants={slideInFromRight(0.5)}
            className="cursive text-[20px] text-gray-200 mb-10 mt-[5px] text-center"
          >
            {
              'Meta, Informational, Standard Track - Core, Interface, Networking'
            }
          </motion.div>

          {isLoading ? (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Your loader component */}
              <Loader />
            </motion.div>
          ) : (
            <>
              <Tabs defaultValue="type" className="w-full ">
                <div className="w-full flex justify-center pt-4">
                  <TabsList className="w-max gap-4 px-4 py-2 rounded-lg shadow-sm">
                    <TabsTrigger value="type">Type</TabsTrigger>
                    <TabsTrigger value="status">Status</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="type">
                  <div className="grid grid-cols-1 lg:grid-cols-3 pt-8 gap-5">
                    <div className="h-fit">
                      <EIPTypeDonut />
                    </div>

                    <div className="h-fit">
                      <GithubStats type="EIPs" />
                    </div>
                    <div className="h-fit">
                      <EIPTypeBar type="EIP" />
                    </div>
                  </div>
                  <div className="mt-6">
                    <motion.div
                      variants={slideInFromLeft(0.5)}
                      className="text-[60px] text-white font-bold mt-[10px] text-center mb-[5px]"
                    >
                      {`EIP Lifecycle Overview by Category`}
                    </motion.div>
                    <motion.div
                      variants={slideInFromRight(0.5)}
                      className="cursive text-[20px] text-gray-200 mb-10 mt-[5px] text-center"
                    >
                      {
                        'a timeline of Ethereum Improvement Proposals across different categories, visualized by status and monthly trends throughout the year.'
                      }
                    </motion.div>
                  </div>
                  <div className="mt-6">
                    <TypeGraphs />
                  </div>

                  <div className="mt-6">
                    <div className="min-w-[800px]">
                      <CatTable2 dataset={data4} cat="All" status="Meta" />
                      <CatTable2
                        dataset={data4}
                        cat="All"
                        status="Informational"
                      />
                      <CatTable2 dataset={data4} cat="All" status="Core" />
                      <CatTable2
                        dataset={data4}
                        cat="All"
                        status="Networking"
                      />
                      <CatTable2 dataset={data4} cat="All" status="Interface" />
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="status">
                  <div className="grid grid-cols-1 lg:grid-cols-3 pt-8 gap-5">
                    <div className="h-fit">
                      <EIPStatusDonut />
                    </div>

                    <div className="h-fit">
                      <GithubStats type="EIPs" />
                    </div>
                    <div className="h-fit">
                      <EIPStatusBar type="EIP" />
                    </div>
                  </div>
                  <div className="mt-6">
                    <DraftvFinalBar type="EIPs" />
                  </div>
                  <div className="mt-6">
                    {[
                      'Draft',
                      'Review',
                      'Last Call',
                      'Living',
                      'Final',
                      'Stagnant',
                      'Withdrawn',
                    ].map((status) => (
                      <div
                        key={status}
                        className="group relative flex flex-col gap-3 pb-8"
                      >
                        {/* Label Section aligned to the left */}
                        <div className="flex items-center gap-3">
                          <h2 className="text-2xl font-bold text-white">
                            {status} -{' '}
                            <a
                              href={`/tableStatus/eip/${status}`}
                              className="underline"
                            >
                              [
                              {
                                data.filter((item) => item.status === status)
                                  .length
                              }
                              ]
                            </a>
                          </h2>
                          <p className="text-red-700">*</p>
                          <p className="hidden group-hover:block text-lg text-gray-500">
                            Count as on date
                          </p>
                        </div>

                        {/* Scrollable Charts Grid */}
                        <div className="overflow-x-auto">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-w-[800px]">
                            <StackedColumnChart
                              type="EIPs"
                              status={status}
                              dataset={data2}
                            />
                            <CBoxStatus
                              status={status}
                              type="EIPs"
                              dataset={data3}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6">
                    <div className="min-w-[800px]">
                      <CatTable dataset={data4} cat="All" status="Draft" />
                      <CatTable dataset={data4} cat="All" status="Final" />
                      <CatTable dataset={data4} cat="All" status="Review" />
                      <CatTable dataset={data4} cat="All" status="Last Call" />
                      <CatTable dataset={data4} cat="All" status="Living" />
                      <CatTable dataset={data4} cat="All" status="Withdrawn" />
                      <CatTable dataset={data4} cat="All" status="Stagnant" />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}

          <div className="bg-[rgba(159,122,234,0.2)] text-white border border-[#9F7AEA]/30 shadow-inner shadow-[#9F7AEA]/20  p-4 rounded-md mt-4">
            <p className="text-sm">
              Also checkout{' '}
              <a
                href="/erc"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-200 hover:text-purple-500"
              >
                ERCs
              </a>{' '}
              and{' '}
              <a
                href="/rip"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-200 hover:text-purple-500"
              >
                RIPs
              </a>
              .
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EIPPage;
