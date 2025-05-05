"use client";
import React, { useEffect, useState } from 'react';
import { saveAs } from 'file-saver';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import Footer from './layout/SubFooter';
import axios from 'axios';

interface AuthorProps {
  defaultQuery: string;
}

interface PRItem {
    prNumber: number;
    prTitle: string;
    repo:string;
}
  
interface IssueItem {
    issueNumber: number;
    issueTitle: string;
    repo:string;
}

interface CombinedItem {
    Number: number;
    Title: string;
    Type: "PR" | "issue";
    Repo: string;
  }

const SearchByPrOrIssue: React.FC<AuthorProps> = ({ defaultQuery }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setselectedItem] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [combinedData, setCombinedData] = useState<CombinedItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const cardsPerPage = 25;

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedItem]);

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prResponse, issueResponse] = await Promise.all([
          fetch(`/api/allprs`),
          fetch(`/api/allissues`),
        ]);

        const prData: PRItem[] = await prResponse.json();
        const issueData: IssueItem[] = await issueResponse.json();

        // Combine PR and Issue data
        const combined = [
          ...prData.map((pr) => ({
            Number: pr.prNumber,
            Title: pr.prTitle,
            Type: "PR" as const,
            Repo: pr.repo,
          })),
          ...issueData.map((issue) => ({
            Number: issue.issueNumber,
            Title: issue.issueTitle,
            Type: "issue" as const,
            Repo: issue.repo,
          })),
        ];

        setCombinedData(combined);
        setIsLoading(false);
        console.log(setselectedItem);
        console.log(defaultQuery)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [defaultQuery]);


  const filteredData2 = searchTerm
    ? combinedData.filter((item) =>
        item.Number.toString().includes(searchTerm.trim())
      )
    : combinedData;
    const totalPages = Math.ceil(combinedData.length / cardsPerPage);
 

  const jsonToCsv = (data: CombinedItem[]): string => { 
    const csvRows: string[] = [];
    const headers = ['REPO', 'Title', 'NUMBER', 'LINK'];
   
    csvRows.push(headers.join(','));
  
  
    data.forEach((item: CombinedItem) => {
      const row = [
        `${item.Repo}`, 
        `"${item.Number}"`,
        `"${item.Title}"`, 
       `https://eipsinsight.com/${item.Type}/${item.Repo}/${item.Number}`
      ];
      csvRows.push(row.join(','));
    });
  
    return csvRows.join('\n');
  };
  
  
  const paginatedData = filteredData2.slice(
    (currentPage - 1) * cardsPerPage,
    currentPage * cardsPerPage
  );
  console.log("paginated data:", paginatedData);
  
  const handleDownload = () => {
    if (!paginatedData.length) {
      alert('No data to download.');
      return;
    }
  
    const csvData = jsonToCsv(filteredData2);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'PRandIssues_data.csv');
  };

  return (
    <>
    <div className='min-h-screen bg-[#0F172A]'>
      <div className="px-5 max-w-[1200px] mx-auto">
      <div className='pt-20'></div>
        <div className="flex justify-center mt-3 items-center gap-4">
          <div className="relative w-full md:w-1/2 flex items-center bg-purple-800/50 border border-white/30 rounded-full px-4 py-2 text-gray-200 focus-within:ring-2 focus-within:ring-purple-400 backdrop-blur-md shadow-md">
            <svg
              className="w-5 h-5 text-gray-400 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 1010 17.5a7.5 7.5 0 006.65-6.65z"
              />
            </svg>

            <input
              type="text"
              placeholder="Search PR/ISSUE number"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent outline-none text-sm placeholder-gray-400 text-gray-200 w-full"
            />
          </div>

          <DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant={"glass"}>
    PR/ISSUE
      <ChevronDown className="ml-2 h-4 w-4" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent className="w-[200px] bg-white text-gray-900">
    <DropdownMenuItem onClick={() => (window.location.href = "/SearchEip")}>
      Authors
    </DropdownMenuItem>
    <DropdownMenuItem onClick={() => (window.location.href = "/SearchEipTitle")}>
    EIP
    </DropdownMenuItem>
    <DropdownMenuItem onClick={() => (window.location.href = '/SearchEipTitle')}>
    Title
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
        </div>
      </div>

      <div className="p-4">
        {isLoading ? (
          <p className="text-center text-gray-300">Loading...</p>
        ) : (
          <>
          <div className="flex justify-end items-center mb-4 ml-2 gap-4">
  <Button
    variant="download"
    disabled={isLoading}
    onClick={async () => {
      try {
        handleDownload();
        await axios.post("/api/DownloadCounter");
      } catch (error) {
        console.error("Error triggering download counter:", error);
      }
    }}
    className="rounded-full px-5 py-2"
  >
    {isLoading ? (
      <div className="animate-spin h-4 w-4 border-t-2 border-white rounded-full" />
    ) : (
      "Download CSV"
    )}
  </Button>
</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {paginatedData.map((item) => {

                return (
                  <a
                    key={item.Title}
                    href={`/${item.Type === "PR" ? `/PR/${item.Repo}/${item.Number}` :`/issue/${item.Repo}/${item.Number}`}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-purple-900/30 backdrop-blur-lg border border-purple-700/40 rounded-2xl p-5 transition-all duration-300 transform hover:scale-105 hover:border-purple-400 shadow-xl flex flex-col justify-between min-h-[320px] hover:shadow-purple-500/30"
                  >
                    <h2 className="text-purple-300 text-2xl font-black mb-3 break-words drop-shadow-sm tracking-tight">
                    {item.Type.toUpperCase()}-{item.Number}
                    </h2>

                    <p className="text-sm font-semibold text-gray-100 line-clamp-2 mb-3">
                      {item.Title}
                    </p>

                    <div className="space-y-1 text-sm text-gray-200 font-medium">
                      <p>
                        <b>Repo:</b> {item.Repo}
                      </p>

                    </div>

                    
                  </a>
                );
              })}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex justify-center items-center gap-6 pb-6">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-6 py-3 rounded-lg font-semibold text-lg transition-all duration-300 transform ${
                  currentPage === 1
                    ? 'bg-gray-400 text-gray-500 cursor-not-allowed'
                    : 'bg-purple-600 text-white hover:bg-purple-700 shadow-md hover:scale-105'
                } backdrop-blur-lg border border-purple-600/30`}
              >
                Previous
              </button>

              <span className="text-sm font-medium text-gray-800 dark:text-gray-300">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`px-6 py-3 rounded-lg font-semibold text-lg transition-all duration-300 transform ${
                  currentPage === totalPages
                    ? 'bg-gray-400 text-gray-500 cursor-not-allowed'
                    : 'bg-purple-600 text-white hover:bg-purple-700 shadow-md hover:scale-105'
                } backdrop-blur-lg border border-purple-600/30`}
              >
                Next
              </button>
            </div>
          </>
        )}
        <Footer/>
      </div>
      </div>
    </>
  );
};

export default SearchByPrOrIssue;
