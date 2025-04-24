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

// interface EIP3 {
//   _id: string;
//   eip: string;
//   fromStatus: string;
//   toStatus: string;
//   title: string;
//   status: string;
//   author: string;
//   created: string;
//   changeDate: string;
//   type: string;
//   category: string;
//   discussion: string;
//   deadline: string;
//   requires: string;
//   pr: number;
//   changedDay: number;
//   changedMonth: number;
//   changedYear: number;
//   createdMonth: number;
//   createdYear: number;
//   __v: number;
// }

// interface EIP2 {
//   status: string;
//   eips: {
//     status: string;
//     month: number;
//     year: number;
//     date: string;
//     count: number;
//     category: string;
//     eips: EIP[];
//   }[];
// }

// interface APIResponse {
//   eip: EIP2[];
//   erc: EIP2[];
//   rip: EIP2[];
// }

// interface EIPGroup {
//   category: string;
//   month: number;
//   year: number;
//   date: string;
//   count: number;
//   eips: EIP3[];
// }

// interface APIResponse2 {
//   status: string;
//   eips: EIPGroup[];
// }

// interface Data {
//   eip: APIResponse2[];
//   erc: APIResponse2[];
//   rip: APIResponse2[];
// }

const EIPPage = () => {
  const [data, setData] = useState<EIP[]>([]);
  // const [data4, setData4] = useState<EIP[]>([]);
  // const [data2, setData2] = useState<APIResponse>({
  //   eip: [],
  //   erc: [],
  //   rip: [],
  // });
  // const [data3, setData3] = useState<Data>({ eip: [], erc: [], rip: [] });
  const [isLoading, setIsLoading] = useState(true);
  // const [selected, setSelected] = useState<'status' | 'type'>('type');
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/new/all`);
        const jsonData = await response.json();
        setData(jsonData.eip);
        // setData4(jsonData.eip);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch(`/api/new/graphsv2`);
  //       // const jsonData = await response.json();
  //       // setData2(jsonData);
  //       // setData3(jsonData);
  //       setIsLoading(false); // Set loader state to false after data is fetched
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //       setIsLoading(false); // Set loader state to false even if an error occurs
  //     }
  //   };

  //   fetchData();
  // }, []);

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
              <TabsList className="flex justify-center mx-auto">
  <TabsTrigger value="type">Type</TabsTrigger>
  <TabsTrigger value="status">Status</TabsTrigger>
</TabsList>

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
                      <EIPStatusBar type="EIP"/>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EIPPage;
