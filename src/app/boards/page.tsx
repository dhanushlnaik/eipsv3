'use client';
import React, { useState, useEffect } from 'react';
import Footer from '@/components/layout/SubFooter';
import Loader from '@/components/ui/Loader2';
import { motion } from 'motion/react';
import { slideInFromLeft, slideInFromRight } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import axios from 'axios';
import DateTime from '@/components/DateTime';
import LabelFilter from '@/components/LabelFilter';
import { Download, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const labelColors: { [key: string]: { color: string; description: string } } = {
  // General or Unlabeled
  "unlabeled": { color: "#374151", description: "No specific label applied." }, // dark gray
  "1272989785": { color: "#1F2937", description: "No specific description available." }, // darker gray

  // Review/Waiting Labels
  "a-review": { color: "#EAB308", description: "Waiting on author to review." }, // amber
  "e-review": { color: "#3B82F6", description: "Waiting on editor to review." },
  "e-consensus": { color: "#FB923C", description: "Waiting on editor consensus." },
  "w-response": { color: "#FACC15", description: "Waiting on author response." },
  "w-ci": { color: "#EF4444", description: "Waiting on CI to pass." },
  "w-stale": { color: "#111827", description: "Waiting on activity." },

  // Bug and Enhancements
  "bug": { color: "#DC2626", description: "Fixes or reports a bug." },
  "enhancement": { color: "#10B981", description: "Adds new features or improvements." },

  // Creation and Modification Labels
  "c-new": { color: "#0D9488", description: "Creates a brand new proposal." },
  "c-status": { color: "#2563EB", description: "Changes a proposal's status." },
  "c-update": { color: "#06B6D4", description: "Modifies an existing proposal." },

  // Dependencies
  "dependencies": { color: "#8B5CF6", description: "Pull requests that update a dependency file." },
  "e-blocked": { color: "#B91C1C", description: "Requires another open PR to be merged." },
  "e-blocking": { color: "#DB2777", description: "Required to be merged by another open PR." },
  "e-circular": { color: "#F97316", description: "Circular dependency requires manual merging." },
  "w-dependency": { color: "#EA580C", description: "This EIP depends on another EIP with a less stable status." },

  // Status Labels
  "s-draft": { color: "#7C3AED", description: "This EIP is a Draft." },
  "s-final": { color: "#16A34A", description: "This EIP is Final." },
  "s-lastcall": { color: "#F97316", description: "This EIP is in Last Call." },
  "s-review": { color: "#3B82F6", description: "This EIP is in Review." },
  "s-stagnant": { color: "#4B5563", description: "This EIP is Stagnant." },
  "s-withdrawn": { color: "#991B1B", description: "This EIP is Withdrawn." },
  "stagnant": { color: "#4B5563", description: "Marked as stagnant." },
  "stale": { color: "#6B7280", description: "No recent activity." },

  // Topics/Types
  "t-core": { color: "#1D4ED8", description: "Related to core functionality." },
  "t-erc": { color: "#14B8A6", description: "Related to ERC standards." },
  "t-informational": { color: "#0EA5E9", description: "Provides informational guidance." },
  "t-interface": { color: "#9333EA", description: "Related to interface design." },
  "t-meta": { color: "#EAB308", description: "Meta-related proposals." },
  "t-networking": { color: "#059669", description: "Networking-related proposals." },
  "t-process": { color: "#DB2777", description: "Relates to EIP process." },
  "t-security": { color: "#DC2626", description: "Relates to security." },

  // Miscellaneous
  "created-by-bot": { color: "#475569", description: "Created by a bot." },
  "discussions-to": { color: "#0891B2", description: "Points to related discussions." },
  "e-number": { color: "#1E40AF", description: "Waiting on EIP Number assignment." },
  "question": { color: "#7C3AED", description: "Denotes a question or inquiry." },
  "javascript": { color: "#EA580C", description: "Pull requests that update Javascript code." },
  "ruby": { color: "#B91C1C", description: "Pull requests that update Ruby code." },

  // Repository-Specific Labels
  "r-ci": { color: "#64748B", description: "Relates to the CI." },
  "r-eips": { color: "#22D3EE", description: "Relates to EIP formatting or repository." },
  "r-other": { color: "#475569", description: "Relates to other parts of the EIPs repository." },
  "r-process": { color: "#2563EB", description: "Relates to the EIP process." },
  "r-website": { color: "#16A34A", description: "Relates to the EIPs website." },
};



interface EIPData {
  _id: string;
  prNumber: string;
  prTitle: string;
  labels: string[];
  prCreatedDate: string;
  prLink: string;
  state: string;
}

const BoardPage = () => {
  const [eipData, setEipData] = useState([]);
  const [ercData, setErcData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('EIPs'); // Default to 'EIPs'
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);

  
  const handleLabelToggle = (label: string) => {
    setSelectedLabels((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  const filteredData = (data: EIPData[]) => {
    const filterAndSort = (items: EIPData[]) => {
      return items
        .filter((item) => {
          // Ignore items with state 'closed'
          if (item.state === 'closed') return false;

          // Ignore items with both 'dependencies' and 'ruby' labels
          const hasDependencies = item.labels.includes('dependencies');
          const hasRuby = item.labels.includes('ruby');
          if (hasDependencies && hasRuby) return false;

          return true;
        })
        .sort((a, b) => {
          const aHasWithdrawn = a.labels.includes('s-withdrawn') ? 1 : 0;
          const bHasWithdrawn = b.labels.includes('s-withdrawn') ? 1 : 0;
          return aHasWithdrawn - bHasWithdrawn;
        });
    };

    if (selectedLabels.length === 0) {
      return filterAndSort(data);
    }

    return filterAndSort(data).filter((item) =>
      item.labels.some((label) => selectedLabels.includes(label))
    );
  };

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/FullBoards');
        setEipData(response.data.eips || []);
        setErcData(response.data.ercs || []);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const displayedData =
    activeTab === 'EIPs' ? filteredData(eipData) : filteredData(ercData);

  // Extract unique labels for the filter
  const allLabels = Array.from(
    new Set([...eipData, ...ercData].flatMap((item: EIPData) => item.labels))
  );

  const handleDownload = () => {
    // Check the active tab and fetch the appropriate data
    const filteredData = displayedData;

    if (!filteredData || filteredData.length === 0) {
      alert(`No data available for the selected month in ${activeTab}.`);
      return;
    }

    console.log(`Data for download in ${activeTab}:`, filteredData);

    // Pass the filtered data and active tab (EIPs or ERCs) to the CSV function
    downloadCSV(filteredData, activeTab);
  };

  const downloadCSV = (data: EIPData[], type: string) => {
    const csv = convertToCSV(data, type);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `${type}-board-data.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const convertToCSV = (filteredData: EIPData[], type: string) => {
    const csvRows = [];
    console.log(type);
    // Define the headers for the CSV
    const headers = [
      'Serial Number',
      'PR Number',
      'PR Title',
      'Labels',
      'Created Date',
      'URL',
    ];

    // Add headers to CSV rows
    csvRows.push(headers.join(','));

    // Iterate over the filtered data and extract necessary fields
    filteredData.forEach((item: EIPData, index: number) => {
      const row = [
        index + 1, // Serial Number
        item.prNumber, // PR Number
        item.prTitle, // PR Title
        item.labels.join('; '), // Labels (joined with semicolon)
        new Date(item.prCreatedDate).toLocaleDateString(), // Created Date
        item.prLink, // URL
      ].join(',');

      csvRows.push(row);
    });

    return csvRows.join('\n');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center mt-20">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#9F7AEA]/40 border-t-transparent bg-[rgba(159,122,234,0.2)] shadow-inner shadow-[#9F7AEA]/20" />
      </div>
    );
  }

  // if (hasError) {
  //   return (
  //     <div className="flex justify-center mt-20">
  //       <div className="bg-[rgba(159,122,234,0.2)] text-red-400 border border-[#9F7AEA]/30 shadow-inner shadow-[#9F7AEA]/20 p-4 rounded-md">
  //         <p className="text-lg font-semibold">Failed to load data.</p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen flex flex-col bg-[#0F172A]">
      <main className="flex-grow px-5 sm:px-10">
        <div className="pt-20 w-full mx-auto">
          <motion.div
            variants={slideInFromLeft(0.5)}
            className="text-[60px] text-white font-bold mt-[10px] text-center mb-[5px]"
          >
            {`EIP Board: Prioritize and Track Open PRs Efficiently`}
          </motion.div>
          <motion.div
            variants={slideInFromRight(0.5)}
            className="cursive text-[20px] text-gray-200 mb-10 mt-[5px] text-center"
          >
            {
              'Organize Pull Requests by Editor Response and Author Interaction to Streamline Reviews and Discussions'
            }
          </motion.div>
          <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="eip-board-info">
        <AccordionTrigger>What is this tool?</AccordionTrigger>
        <AccordionContent className="space-y-6 text-muted-foreground text-justify">
          <div>
            <h4 className="font-semibold mb-1">What is EIP Board?</h4>
            <p>
              The table below lists all Open Pull Requests (till date) in a order such that it uses
              oldest author interaction after the most recent editor response.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-1">How do label filters work?</h4>
            <p>
              You can filter table data using label filters, and the same filters will apply to the
              downloaded reports.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-1">How is prioritization determined?</h4>
            <p>
              PRs with the <code>&quot;s-withdrawn&quot;</code> label are given the lowest priority and moved
              to the bottom of the table. The remaining PRs are ranked based on the
              longest-waiting interaction time, with those having the oldest interaction appearing
              at the top.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-1">Who would use this tool?</h4>
            <p>
              This tool is created to support EIP/ERC Editors to identify the longest waiting PRs
              for Editor&apos;s review. These PRs can also be discussed in{" "}
              <a
                href="https://www.youtube.com/watch?v=dwJrlAfM14E&list=PL4cwHXAawZxqnDHxOyuwMpyt5s8F8gdmO"
                className="underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                EIP Editing Office Hour
              </a>{" "}
              and{" "}
              <a
                href="https://www.youtube.com/playlist?list=PL4cwHXAawZxpLrRIkDlBjDUUrGgF91pQw"
                className="underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                EIPIP Meetings
              </a>{" "}
              in case it requires attention of more than one editor/reviewer.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-1">Credits</h4>
            <p>
              PS: This tool is based on a fork from{" "}
              <a
                href="https://github.com/gaudren/eip-board"
                className="underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                here
              </a>
              .
            </p>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>

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
            <div className="px-4 py-6 md:px-8">
  {/* Tab Buttons */}
  <div className="flex justify-center space-x-4 mb-4">
  <Button
  onClick={() => setActiveTab("EIPs")}
  variant={activeTab === "EIPs" ? "purpleGlow" : "glass"}
  className="px-4 py-2 rounded-md text-sm font-semibold"
>
  EIPs
</Button>

<Button
  onClick={() => setActiveTab("ERCs")}
  variant={activeTab === "ERCs" ? "purpleGlow" : "glass"}
  className="px-4 py-2 rounded-md text-sm font-semibold"
>
  ERCs
</Button>
  </div>

  {/* Heading + Download */}
  <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4 px-2">
    <h2 className="text-2xl font-bold text-purple-300">
      {activeTab} BOARD ({displayedData.length})
    </h2>
    <Button
      onClick={async () => {
        try {
          handleDownload();
          await axios.post("/api/DownloadCounter");
        } catch (error) {
          console.error("Error triggering download counter:", error);
        }
      }}
      variant={"download"}
    >
      <Download />
      Download Reports
    </Button>
  </div>

  {/* Table */}
  <div className="overflow-auto max-h-[900px] bg-white/5 backdrop-blur-md rounded-lg border border-white/10 shadow-md">
    <table className="min-w-full text-sm text-white">
      <thead className="bg-purple-900/30 text-purple-200 sticky top-0 z-10">
        <tr>
          <th className="px-4 py-2 text-center">Serial Number</th>
          <th className="px-4 py-2 text-center">PR Number</th>
          <th className="px-4 py-2 text-center">PR Date</th>
          <th className="px-4 py-2 text-center">
            Labels
            <LabelFilter
              labels={allLabels}
              selectedLabels={selectedLabels}
              onLabelToggle={handleLabelToggle}
            />
          </th>
          <th className="px-4 py-2 text-center">PR Link</th>
        </tr>
      </thead>
      <tbody>
        {displayedData.length === 0 ? (
          <tr>
            <td colSpan={5} className="text-center py-4 text-gray-400">
              No Data Available
            </td>
          </tr>
        ) : (
          displayedData.map((item, index) => (
            <tr key={item._id} className="hover:bg-white/5 transition">
              <td className="text-center px-4 py-2">{index + 1}</td>
              <td className="text-center px-4 py-2">{item.prNumber}</td>
              <td className="text-center px-4 py-2">
                {new Date(item.prCreatedDate).toLocaleDateString()}
              </td>
              <td className="text-center px-4 py-2">
  <div className="flex flex-wrap justify-center gap-2">
    {item.labels.map((label, idx) => {
      const labelKey = label.toLowerCase();
      const { color } = labelColors[labelKey] || { color: "#6B7280" };

      return (
        <span
          key={idx}
          className="px-3 py-1 rounded-full text-xs font-semibold text-white transition duration-200 ease-linear"
          style={{
            backgroundColor: color,
            boxShadow: `0 0 10px ${color}99`, // light glow effect
          }}
        >
          {label}
        </span>
      );
    })}
  </div>
</td>
<td className="text-center px-4 py-2">
  <Button
    asChild
    variant="glass"
    className="px-3 py-1 rounded-md text-sm gap-1 items-center"
  >
    <a
      href={item.prLink}
      target="_blank"
      rel="noopener noreferrer"
    >
      View PR
      <ExternalLink className="w-4 h-4 ml-1 opacity-70" />
    </a>
  </Button>
</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>

  {/* Footer */}
  <div className="mt-4 bg-white/5 border border-white/10 rounded-md p-4 text-sm text-purple-100">
    <DateTime/>
    <p className="mt-4">
      For other details, check{" "}
      <a href="/Analytics" className="minimal">
        PRs Analytics
      </a>{" "}
      and{" "}
      <a href="/Reviewers" className="minimal">
        Editors Leaderboard
      </a>
      .
    </p>
  </div>
</div>
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

export default BoardPage;
