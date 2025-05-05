'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import NLink from 'next/link';
import { motion } from 'framer-motion';
import React from 'react';
import { ChevronDoubleDown, ChevronDoubleUp } from '@mynaui/icons-react';
import Loader from '@/components/ui/Loader2';
import Header from '@/components/wrapper/Header';
import { Markdown } from '@/components/markdowns/EIPMD';
import Footer from '@/components/layout/SubFooter';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Info } from 'lucide-react'; // A nice info-circle icon (lucide)
interface EipMetadataJson {
  eip: number;
  title: string;
  description: string;
  author: string[];
  'discussions-to': string;
  'last-call-deadline': string;
  status: string;
  type: string;
  category: string;
  created: string;
  requires: number[];
}

const extracteipno = (data: string[]) => data[2]?.split('-')[1];

interface DataItem {
  status: string;
  mergedDate: string;
}

const extractLastStatusDates = (data: Record<string, DataItem>) => {
  const statusDates: { status: string; date: string }[] = [];
  let lastStatus = '';
  const sortedData = Object.keys(data)
    .filter((key) => key !== 'repo')
    .sort(
      (a, b) =>
        new Date(data[a].mergedDate).getTime() -
        new Date(data[b].mergedDate).getTime()
    );

  sortedData.forEach((key) => {
    const { status, mergedDate } = data[key];
    if (status !== 'unknown' && lastStatus !== status) {
      statusDates.push({ status, date: mergedDate });
      lastStatus = status;
    }
  });

  return statusDates;
};

const extractLastTypesDates = (
  data: Record<string, { type: string; mergedDate: string }>
) => {
  const typeDates: { type: string; date: string }[] = [];
  const standardTrackTypes = [
    'Standards Track',
    'Standard Track',
    'Standards Track (Core, Networking, Interface, ERC)',
    'Standard',
  ];
  let lastType = '';
  const sortedData = Object.keys(data)
    .filter((key) => key !== 'repo')
    .sort(
      (a, b) =>
        new Date(data[a].mergedDate).getTime() -
        new Date(data[b].mergedDate).getTime()
    );

  sortedData.forEach((key) => {
    const { type: originalType, mergedDate } = data[key];
    if (originalType !== 'unknown') {
      const normalizedType = standardTrackTypes.includes(originalType)
        ? 'Standards Track'
        : originalType;
      if (lastType !== normalizedType) {
        typeDates.push({ type: normalizedType, date: mergedDate });
        lastType = normalizedType;
      }
    }
  });

  return typeDates;
};

const extractMetadata = (text: string) => {
  const regex = /(--|---)\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)/;
  const match = text.match(regex);

  if (match) {
    return {
      metadata: match[2],
      markdown: match[3],
    };
  } else {
    return {
      metadata: '',
      markdown: text,
    };
  }
};

const convertMetadataToJson = (
  metadataText: string
): EipMetadataJson => {
  const lines = metadataText.split('\n');
  const jsonObject: Partial<EipMetadataJson> = {};

  lines.forEach((line) => {
    const [key, value] = line.split(/: (.+)/);
    if (key && value) {
      const trimmedKey = key.trim();
      const trimmedValue = value.trim();

      if (trimmedKey === 'eip') {
        jsonObject.eip = parseInt(trimmedValue);
      } else if (trimmedKey === 'requires') {
        jsonObject.requires = trimmedValue
          .split(',')
          .map((v) => parseInt(v.trim()));
      } else if (trimmedKey === 'author') {
        jsonObject.author = trimmedValue
          .split(',')
          .map((author: string) => author.trim());
      } else {
        (jsonObject as Partial<EipMetadataJson> & Record<string, string>)[
          trimmedKey
        ] = trimmedValue;
      }
    }
  });

  return jsonObject as EipMetadataJson;
};

const EIPPage = () => {
  const path = usePathname();
  const pathArray = path?.split('/') || [];
  const eipNo = extracteipno(pathArray);
  const [markdownFileURL, setMarkdownFileURL] = useState<string>('');
  const [metadataJson, setMetadataJson] = useState<EipMetadataJson>();
  const [markdown, setMarkdown] = useState<string>('');
  const [Repo, setRepo] = useState('');
  const [data, setData] = useState<{ status: string; date: string }[]>([]);
  const [data2, setData2] = useState<{ type: string; date: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDataNotFound, setIsDataNotFound] = useState(false);
  const [show2, setShow2] = useState(false); // State to toggle visibility
  const toggleCollapse2 = () => setShow2(!show2);

  const networkUpgrades: Record<string, number[]> = {
    Homestead: [2, 7, 8],
    'Spurious Dragon': [155, 160, 161, 170],
    'Tangerine Whistle': [150],
    Byzantium: [100, 140, 196, 197, 198, 211, 214, 649, 658],
    Petersburg: [145, 1014, 1052, 1234, 1283],
    Istanbul: [152, 1108, 1344, 1844, 2028, 2200],
    'Muir Glacier': [2384],
    Dencun: [1153, 4788, 4844, 5656, 6780, 7044, 7045, 7514, 7516],
    Pectra: [
      7691, 7623, 7840, 7702, 7685, 7549, 7251, 7002, 6110, 2935, 2537, 7642,
    ],
    Berlin: [2565, 2929, 2718, 2930],
    London: [1559, 3198, 3529, 3541, 3554],
    'Arrow Glacier': [4345],
    'Gray Glacier': [5133],
    Paris: [3675, 4399],
    Shapella: [3651, 3855, 3860, 4895, 6049],
  };

  const getNetworkUpgrades = (eipNo: number) => {
    console.log('eip:', eipNo);

    const matchedUpgrades = Object.entries(networkUpgrades)
      .filter(([, eipNos]) => eipNos.map(Number).includes(Number(eipNo)))
      .map(([upgradeName]) => upgradeName);

    const formattedUpgrades = matchedUpgrades.join(', ');
    console.log('Matched Network Upgrade Labels:', formattedUpgrades);

    return formattedUpgrades;
  };

  const networkUpgradeLabels = getNetworkUpgrades(Number(eipNo));
  console.log('Matched Network Upgrade Labels:', networkUpgradeLabels);

  useEffect(() => {
    if (eipNo) {
      const fetchData = async () => {
        try {
          const repoPath =
            Repo.toLowerCase() === 'eip'
              ? 'eipshistory'
              : `${Repo.toLowerCase()}history`;
          const response = await fetch(`/api/new/${repoPath}/${eipNo}`);
          //   const response = await fetch(`/api/new/${Repo.toLowerCase()}history/${eipNo}`);
          const jsonData = await response.json();
          const statusWithDates = extractLastStatusDates(jsonData);
          const typeWithDates = extractLastTypesDates(jsonData);
          setData(statusWithDates);
          setData2(typeWithDates);
          console.log(statusWithDates);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData();
    }
  }, [Repo, eipNo]);

  const getValid = async (num: string): Promise<string> => {
    const links = [
      {
        url: `https://raw.githubusercontent.com/ethereum/RIPs/master/RIPS/rip-${num}.md`,
        path: `rip`,
      },
      {
        url: `https://raw.githubusercontent.com/ethereum/ERCs/master/ERCS/erc-${num}.md`,
        path: `erc`,
      },
      {
        url: `https://raw.githubusercontent.com/ethereum/EIPs/master/EIPS/eip-${num}.md`,
        path: `eip`,
      },
    ];

    for (const link of links) {
      try {
        const response = await fetch(link.url);
        if (response.ok) {
          return link.path;
        }
      } catch (error) {
        console.error(`Error checking link ${link.url}:`, error);
      }
    }
    return `/eips/eip-${num}`;
  };

  const fetchEIPData = useCallback(async () => {
    if (!eipNo) return;

    setIsLoading(true); // Set loading state at the beginning

    try {
      const getRepo = await getValid(eipNo);
      if (!getRepo) {
        setIsLoading(false);
        return; // Exit if no repo is returned
      }

      setRepo(getRepo);

      const _markdownFileURL = `https://raw.githubusercontent.com/ethereum/${getRepo.toUpperCase()}s/master/${getRepo.toUpperCase()}S/${getRepo}-${eipNo}.md`;
      console.log('final url:', _markdownFileURL);
      setMarkdownFileURL(_markdownFileURL);

      const eipMarkdownRes = await fetch(_markdownFileURL).then((response) =>
        response.text()
      );

      const { metadata, markdown: _markdown } = extractMetadata(eipMarkdownRes);
      const metadataJson = convertMetadataToJson(metadata);

      if (!metadataJson?.author || !metadataJson?.created) {
        setIsDataNotFound(true);
      } else {
        setMetadataJson(metadataJson);
        setMarkdown(_markdown);
        setIsDataNotFound(false);
      }
    } catch (error) {
      console.error('Error fetching EIP data:', error);
      setIsDataNotFound(true);
    } finally {
      setIsLoading(false);
    }
  }, [eipNo]); // Make sure to include all dependencies here, [Repo, eipNo]);

  useEffect(() => {
    if (eipNo) {
      fetchEIPData();
    }
  }, [fetchEIPData, eipNo]);
  const statusOrder = [
    'Draft',
    'Review',
    'Living',
    'Stagnant',
    'Last Call',
    'Withdrawn',
    'Final',
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#0F172A]">
      <main className="flex-grow px-5 sm:px-10">
        <div className="pt-20 w-full mx-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-screen">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Loader />
              </motion.div>
            </div>
          ) : isDataNotFound ? (
            <div className="flex flex-col items-center justify-center h-screen px-6 text-center">
              <h1 className="text-3xl font-bold mb-4 text-blue-600">
                EIP Not Found
              </h1>
              <p className="text-gray-500 text-lg mb-6">
                This EIP might not exist or could be an{' '}
                <NLink
                  href={`/ercs/erc-${eipNo}`}
                  className="text-blue-500 underline"
                >
                  ERC
                </NLink>{' '}
                or a{' '}
                <NLink
                  href={`/rips/rip-${eipNo}`}
                  className="text-blue-500 underline"
                >
                  RIP
                </NLink>
                . Please check again.
              </p>
              <div
                onClick={() => (window.location.href = '/')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg"
              >
                Return to Home
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="px-5 lg:px-10 mx-2 lg:mx-40 mt-5 lg:mt-10 pb-10">
                <Header
                  title={`${Repo.toUpperCase()}- ${eipNo}`}
                  subtitle={metadataJson?.title || ''}
                />

                {/* Metadata Table */}
                <div className="overflow-x-auto mt-6">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="py-2 pr-4 font-semibold">Authors</th>
                        <td className="py-2">
                          {metadataJson?.author?.join(', ')}
                        </td>
                      </tr>
                      <tr className="border-b">
                        <th className="py-2 pr-4 font-semibold">Created</th>
                        <td className="py-2">{metadataJson?.created}</td>
                      </tr>

                      {metadataJson?.['discussions-to'] && (
                        <tr className="border-b">
                          <th className="py-2 pr-4 font-semibold">
                            Discussion Link
                          </th>
                          <td className="py-2">
                            <NLink
                              href={metadataJson['discussions-to']}
                              target="_blank"
                              className="text-blue-500 underline"
                            >
                              {metadataJson['discussions-to']}
                            </NLink>
                          </td>
                        </tr>
                      )}

                      {metadataJson?.requires &&
                        metadataJson.requires.length > 0 && (
                          <tr className="border-b">
                            <th className="py-2 pr-4 font-semibold">
                              Requires
                            </th>
                            <td className="py-2 flex flex-wrap gap-2">
                              {metadataJson.requires.map((req, i) => (
                                <NLink
                                  key={i}
                                  href={`/eips/eip-${req}`}
                                  className="text-blue-500 underline"
                                >
                                  EIP-{req}
                                </NLink>
                              ))}
                            </td>
                          </tr>
                        )}

                      {metadataJson?.status && (
                        <tr className="border-b">
                          <th className="py-2 pr-4 font-semibold">Status</th>
                          <td className="py-2">{metadataJson?.status}</td>
                        </tr>
                      )}

                      {metadataJson?.['last-call-deadline'] && (
                        <tr className="border-b">
                          <th className="py-2 pr-4 font-semibold">
                            Last Call Deadline
                          </th>
                          <td className="py-2">
                            {metadataJson['last-call-deadline']}
                          </td>
                        </tr>
                      )}

                      {metadataJson?.type && (
                        <tr className="border-b">
                          <th className="py-2 pr-4 font-semibold">Type</th>
                          <td className="py-2">{metadataJson?.type}</td>
                        </tr>
                      )}

                      {metadataJson?.category && (
                        <tr className="border-b">
                          <th className="py-2 pr-4 font-semibold capitalize">
                            Category
                          </th>
                          <td className="py-2">{metadataJson?.category}</td>
                        </tr>
                      )}

                      {networkUpgradeLabels && (
                        <tr className="border-b">
                          <th className="py-2 pr-4 font-semibold">
                            Network Upgrade
                          </th>
                          <td className="py-2">{networkUpgradeLabels}</td>
                        </tr>
                      )}
                    </thead>
                  </table>
                </div>

                {/* Status Timeline Section */}
                <motion.section
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.25 } },
                  }}
                  className="flex flex-col w-full mt-12 space-y-8"
                >
                  {/* Heading */}
                  <div className="flex items-center space-x-4 mb-8">
                    <h2 className="text-3xl font-bold text-purple-200 bg-white/5 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg shadow-purple-500/20">
                      Status Timeline
                    </h2>

                    {/* Tooltip Info Icon */}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="relative group cursor-pointer">
                            <Info className="w-6 h-6 text-purple-400 hover:text-purple-300 transition" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent
                          side="right"
                          sideOffset={8}
                          className="max-w-xs text-sm p-2 bg-white/10 backdrop-blur-md rounded-lg text-purple-200 shadow-lg"
                        >
                          Instructions: The timeline tracks status changes using
                          the merged date as the reference point.
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  {/* Timeline */}
                  <div className="flex w-full flex-wrap gap-6 items-center">
                    {data
                      .filter((item) => statusOrder.includes(item.status))
                      .sort(
                        (a, b) =>
                          new Date(a.date).getTime() -
                          new Date(b.date).getTime()
                      )
                      .map((item, index, sortedData) => {
                        const currentDate = new Date(item.date);
                        const nextItem = sortedData[index + 1];
                        const nextDate = nextItem
                          ? new Date(nextItem.date)
                          : null;

                        const dayDifference = nextDate
                          ? Math.abs(
                              Math.ceil(
                                (nextDate.getTime() - currentDate.getTime()) /
                                  (1000 * 3600 * 24)
                              )
                            )
                          : null;

                        return (
                          <React.Fragment key={index}>
                            {/* Status Card */}
                            <motion.div
                              variants={{
                                hidden: { opacity: 0, x: -50, scale: 0.9 },
                                visible: { opacity: 1, x: 0, scale: 1 },
                              }}
                              transition={{ duration: 0.6, ease: 'easeOut' }}
                              className="flex flex-col items-center min-w-[120px] max-w-[120px] mb-4"
                            >
                              <div className="p-5 bg-gradient-to-br from-white/10 to-purple-500/10 backdrop-blur-xl rounded-xl shadow-md text-center min-h-[80px] flex flex-col justify-center">
                                <p className="font-bold text-purple-300">
                                  {item.status}
                                </p>
                                <p className="text-purple-200 text-xs mt-1">
                                  {currentDate.toLocaleDateString('en-US', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                  })}
                                </p>
                              </div>
                            </motion.div>

                            {/* Arrow + Days */}
                            {nextItem && (
                              <motion.div
                                variants={{
                                  hidden: { opacity: 0, x: -50, scale: 0.9 },
                                  visible: { opacity: 1, x: 0, scale: 1 },
                                }}
                                transition={{ duration: 0.6, ease: 'easeOut' }}
                                className="flex flex-col items-center"
                              >
                                <div className="h-[1px] w-20 bg-purple-400 relative">
                                  <div className="absolute right-[-10px] top-[-4px] w-0 h-0 border-t-[5px] border-b-[5px] border-t-transparent border-b-transparent border-l-[10px] border-l-purple-400" />
                                </div>
                                <p className="text-xs text-purple-400 mt-1">
                                  {dayDifference} days
                                </p>
                              </motion.div>
                            )}
                          </React.Fragment>
                        );
                      })}
                  </div>
                </motion.section>

                {show2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                  >
                    <div className="flex flex-wrap gap-6 mt-6">
                      {data
                        .filter((item) => statusOrder.includes(item.status))
                        .sort(
                          (a, b) =>
                            new Date(a.date).getTime() -
                            new Date(b.date).getTime()
                        )
                        .map((item, index, sortedData) => {
                          const currentDate = new Date(item.date);
                          const nextItem = sortedData[index + 1];
                          const nextDate = nextItem
                            ? new Date(nextItem.date)
                            : null;
                          const dayDifference = nextDate
                            ? Math.ceil(
                                (nextDate.getTime() - currentDate.getTime()) /
                                  (1000 * 3600 * 24)
                              )
                            : null;

                          return (
                            <React.Fragment key={index}>
                              <div className="flex flex-col items-center min-w-[120px] max-w-[120px] mb-4">
                                <div className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow-md flex flex-col justify-center min-h-[80px] text-center">
                                  <div className="font-bold text-blue-600">
                                    {item.status}
                                  </div>
                                  <div className="text-gray-500 text-sm">
                                    {currentDate.toLocaleDateString('en-US', {
                                      day: 'numeric',
                                      month: 'long',
                                      year: 'numeric',
                                    })}
                                  </div>
                                </div>
                              </div>

                              {nextItem && (
                                <div className="flex flex-col items-center">
                                  <div className="relative w-20 h-px bg-gray-400">
                                    <div className="absolute -right-2 -top-1 border-t-4 border-b-4 border-l-8 border-transparent border-l-gray-400" />
                                  </div>
                                  <div className="text-gray-500 text-xs">
                                    {dayDifference} days
                                  </div>
                                </div>
                              )}
                            </React.Fragment>
                          );
                        })}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Type Timeline Section */}
              {data2.length > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <div className="bg-gray-100 dark:bg-gray-800 p-5 rounded-lg mt-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-blue-600">
                        Type Timeline
                      </h2>

                      <button onClick={toggleCollapse2}>
                        {show2 ? (
                          <ChevronDoubleUp className="w-6 h-6 text-white" />
                        ) : (
                          <ChevronDoubleDown className="w-6 h-6 text-white" />
                        )}
                      </button>
                    </div>

                    {show2 && (
                      <div className="flex flex-wrap gap-6 mt-6">
                        {data2
                          .sort(
                            (a, b) =>
                              new Date(a.date).getTime() -
                              new Date(b.date).getTime()
                          )
                          .map((item, index, sortedData) => {
                            const currentDate = new Date(item.date);
                            const nextItem = sortedData[index + 1];
                            const nextDate = nextItem
                              ? new Date(nextItem.date)
                              : null;
                            const dayDifference = nextDate
                              ? Math.ceil(
                                  (nextDate.getTime() - currentDate.getTime()) /
                                    (1000 * 3600 * 24)
                                )
                              : null;

                            return (
                              <React.Fragment key={index}>
                                <div className="flex flex-col items-center min-w-[120px] max-w-[120px] mb-4">
                                  <div className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow-md flex flex-col justify-center min-h-[80px] text-center">
                                    <div className="font-bold text-blue-600">
                                      {item.type}
                                    </div>
                                    <div className="text-gray-500 text-sm">
                                      {currentDate.toLocaleDateString('en-US', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                      })}
                                    </div>
                                  </div>
                                </div>

                                {nextItem && (
                                  <div className="flex flex-col items-center">
                                    <div className="relative w-20 h-px bg-gray-400">
                                      <div className="absolute -right-2 -top-1 border-t-4 border-b-4 border-l-8 border-transparent border-l-gray-400" />
                                    </div>
                                    <div className="text-gray-500 text-xs">
                                      {dayDifference} days
                                    </div>
                                  </div>
                                )}
                              </React.Fragment>
                            );
                          })}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Markdown Render */}
              <div className="max-w-screen-lg mx-auto mt-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <Markdown md={markdown} markdownFileURL={markdownFileURL} />
                </motion.div>
              </div>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EIPPage;
