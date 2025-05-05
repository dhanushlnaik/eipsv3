"use client";
import React, { useEffect, useState } from 'react';
import { saveAs } from 'file-saver';
import NextLink from 'next/link';
// import AuthorEIPCounter from './AuthorBoard';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, ChevronUp, DownloadIcon, FilterIcon } from "lucide-react";
import { SpokeSpinner } from './ui/Spinner';
import Footer from './layout/SubFooter';

interface EIP {
  _id: string;
  eip: string;
  type: string;
  title: string;
  status: string;
  category: string;
  author: string;
  repo: string;
  changeDate: string; // Added changeDate property
}

interface AuthorCount {
  name: string;
  count: number;
}

interface AuthorProps {
  defaultQuery: string;
}

const Author: React.FC<AuthorProps> = ({ defaultQuery }) => {
  const [data, setData] = useState<EIP[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [filterVisible, setFilterVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const cardsPerPage = 25;

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedAuthor]);

  const [authorCounts, setAuthorCounts] = useState<AuthorCount[]>([]);
  const [visibleCount, setVisibleCount] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/new/graphsv4`);
        const jsonData = await response.json();

        const getEarliestEntries = <K extends keyof EIP>(data: EIP[], key: K) => {
          const uniqueEntries: Record<string, EIP> = {};
          data.forEach(entry => {
            const entryKey = entry[key] as string;
            if (!uniqueEntries[entryKey] || new Date(entry.changeDate) > new Date(uniqueEntries[entryKey].changeDate)) {
              uniqueEntries[entryKey] = entry;
            }
          });
          return Object.values(uniqueEntries);
        };

        let filteredData = [
          ...getEarliestEntries(jsonData.eip, 'eip'),
          ...getEarliestEntries(jsonData.erc, 'eip'),
          ...getEarliestEntries(jsonData.rip, 'eip'),
        ];
        filteredData = filteredData.filter(
          (entry: EIP, index: number, self: EIP[]) =>
            entry.eip !== '1' || index === self.findIndex((e: EIP) => e.eip === '1')
        );

        setData(filteredData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
    setSelectedAuthor(defaultQuery)

  }, [defaultQuery]);

  useEffect(() => {
    const authorMap: Record<string, number> = {};
  
    data.forEach((eip) => {
      const authors = eip.author.split(",").map((author) => author.trim());
      authors.forEach((author) => {
        if (author) {
          // Match GitHub handle in the format: Vitalik Buterin (@vbuterin)
          const handleMatch = author.match(/(.+?)\s\(@([a-zA-Z0-9-_]+)\)$/);
          
          if (handleMatch) {
            // Add counts for the full name and the GitHub handle
            const fullName = handleMatch[1].trim(); // Extract full name
            const handle = handleMatch[2].trim();  // Extract handle
        
            authorMap[fullName] = (authorMap[fullName] || 0) + 1;
            authorMap[`@${handle}`] = (authorMap[`@${handle}`] || 0) + 1;
          } else {
            // Match email address in the format: Vitalik Buterin <vitalik.buterin@ethereum.org>
            const emailMatch = author.match(/(.+?)\s<.+?>$/);
        
            if (emailMatch) {
              const fullName = emailMatch[1].trim(); // Ignore email part, extract only the name
              authorMap[fullName] = (authorMap[fullName] || 0) + 1;
            } else {
              // If no special format is found, count the entire string as the author's name
              authorMap[author] = (authorMap[author] || 0) + 1;
            }
          }
        }
        
      });
    });
  
    const authorArray = Object.entries(authorMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  
    setAuthorCounts(authorArray);
  }, [data]);
  

  const handleExpand = () => {
    setVisibleCount((prev) => Math.min(prev + 5, authorCounts.length));
  };

  const handleCollapse = () => {
    setVisibleCount(5);
  };

  // Filter and paginate data
  const filteredData = data.filter(item =>
    !selectedAuthor || item.author.toLowerCase().includes(selectedAuthor.toLowerCase())
  );
  // const totalPages = Math.ceil(filteredData.length / cardsPerPage);
  const filteredData2 = searchTerm
    ? filteredData.filter((item) =>
        item.eip.toString().includes(searchTerm.trim())
      )
    : filteredData;
    const totalPages = Math.ceil(filteredData2.length / cardsPerPage);
  

  const jsonToCsv = (data: EIP[]): string => { 
    const csvRows: string[] = [];
    const headers = ['EIP', 'Title', 'Author', 'Type', 'Category', 'Repo'];
    
    // Add headers to the CSV
    csvRows.push(headers.join(','));
  
    // Add data rows
    data.forEach((item: EIP) => {
      const row = [
        `EIP-${item.eip}`, // EIP ID
        `"${item.title}"`, // Title (quoted to handle commas)
        `"${item.author}"`, // Author(s) (quoted to handle commas)
        item.type, // Type
        item.category, // Category
        item.repo.toUpperCase() // Repo in uppercase
      ];
      csvRows.push(row.join(','));
    });
  
    return csvRows.join('\n');
  };

  const filteredAuthors = authorCounts.filter((author) =>
    author.name.toLowerCase().includes(selectedAuthor.toLowerCase())
  );
  
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
  
    const csvData = jsonToCsv(paginatedData);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'Author_data.csv');
  };



  return (
<>
<div className='min-h-screen bg-[#0F172A]'>
  <div className="px-5 max-w-[1200px] bg-[#0F172A] mx-auto">
    <div className='pt-20'></div>
    {/* Search Bar & Dropdown */}
    <div className="flex justify-center mt-3 items-center gap-4 px-4 flex-wrap">
      {/* Search Bar */}
      <div className="relative w-full md:w-1/2 flex items-center bg-purple-800/50 border border-white/30 rounded-full px-4 py-2 text-gray-200 focus-within:ring-2 focus-within:ring-purple-400 backdrop-blur-md shadow-md transition-all">
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
          placeholder="Search EIP"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-transparent outline-none text-sm placeholder-gray-400 text-gray-200 w-full"
        />
      </div>

      {/* Dropdown Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="purpleGlow" className="rounded-full px-5 py-2">
            Authors <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-purple-950/80 text-gray-100 backdrop-blur-md border border-white/10 shadow-lg rounded-xl">
          <DropdownMenuItem
            onClick={() => (window.location.href = "/SearchEip")}
            className="hover:bg-purple-700/40 cursor-pointer"
          >
            EIP
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => (window.location.href = "/SearchEipTitle")}
            className="hover:bg-purple-700/40 cursor-pointer"
          >
            Title
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => (window.location.href = "/SearchPRSandISSUES")}
            className="hover:bg-purple-700/40 cursor-pointer"
          >
            PR/ISSUE
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </div>

  <div className="p-4">
    {isLoading ? (
      <SpokeSpinner />
    ) : (
      <>
        {/* Author Filter Chips */}
        <div className="flex flex-wrap justify-center items-center px-4 py-4 mb-4 rounded-lg overflow-x-auto gap-2">
          {filteredAuthors.slice(0, visibleCount).map((author) => (
            <div
              key={author.name}
              onClick={() => setSelectedAuthor(author.name)}
              className={`flex items-center px-2 py-1 rounded-full border text-xs font-bold text-white transition-all duration-200 cursor-pointer gap-2
                ${selectedAuthor === author.name
                  ? "bg-blue-600 scale-105 shadow-md"
                  : "bg-blue-500 hover:bg-blue-400 hover:scale-105"}`}
            >
              <Avatar className="w-6 h-6">
                {author.name.startsWith("@") ? (
                  <AvatarImage
                    src={`https://github.com/${author.name.slice(1)}.png`}
                    alt={author.name}
                  />
                ) : (
                  <AvatarFallback className="bg-black text-white text-xs">
                    {author.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
              <span>{author.name} ({author.count})</span>
            </div>
          ))}

          {visibleCount < authorCounts.length && (
            <button
              onClick={handleExpand}
              className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-400 hover:scale-110 transition"
            >
              <ChevronDown />
            </button>
          )}

          {visibleCount > 20 && (
            <button
              onClick={handleCollapse}
              className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-400 hover:scale-110 transition"
            >
              <ChevronUp />
            </button>
          )}
        </div>

        {/* Action Bar */}
        <div className="flex flex-wrap items-center justify-start gap-4 px-4 mb-4">
          <Button
            variant="download"
            className="rounded-full"
            onClick={async () => {
              try {
                handleDownload();
                await axios.post("/api/DownloadCounter");
              } catch (error) {
                console.error("Error triggering download counter:", error);
              }
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="animate-spin h-4 w-4 border-t-2 border-white rounded-full" />
            ) : (
              <>
                <DownloadIcon className="mr-2 h-4 w-4" />
                Download CSV
              </>
            )}
          </Button>

          <Button
            variant="glass"
            className="rounded-full"
            onClick={() => setFilterVisible((prev) => !prev)}
          >
            <FilterIcon className="mr-2 h-4 w-4" />
            Filter EIP
          </Button>

          {filterVisible && (
            <div className="relative flex items-center bg-purple-800/50 border border-white/30 rounded-full px-4 py-2 text-gray-200 backdrop-blur-md shadow-md w-[200px]">
              <svg
                className="w-4 h-4 text-gray-400 mr-2"
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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search EIP"
                className="bg-transparent outline-none text-sm placeholder-gray-400 text-gray-200 w-full"
              />
            </div>
          )}
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {paginatedData.map((item) => {
            const authors = item.author.split(",").map((author) => author.replace(/<.*?>/g, "").trim());
            const sortedAuthors = authors.sort((a, b) => {
              const aSelected = selectedAuthor && a.toLowerCase().includes(selectedAuthor.toLowerCase());
              const bSelected = selectedAuthor && b.toLowerCase().includes(selectedAuthor.toLowerCase());
              return Number(bSelected) - Number(aSelected);
            });
            const firstAuthor = sortedAuthors[0];
            const hasMoreAuthors = sortedAuthors.length > 1;
            const authorUsernameMatch = firstAuthor.match(/@(\w+)/);
            const githubUsername = authorUsernameMatch?.[1] ?? "";

            return (
              <NextLink
                key={item._id}
                href={`/${item.repo === "erc" ? "ercs/erc" : item.repo === "rip" ? "rips/rip" : "eips/eip"}-${item.eip}`}
                target="_blank"
                className="bg-purple-900/30 backdrop-blur-lg border border-purple-700/40 rounded-2xl p-5 transition-all duration-300 transform hover:scale-105 hover:border-purple-400 shadow-xl flex flex-col justify-between min-h-[320px] hover:shadow-purple-500/30"
                  >
                <h2 className="text-purple-300 text-2xl font-black mb-3 break-words drop-shadow-sm tracking-tight">
                  {item.repo.toUpperCase()}-{item.eip}
                </h2>
                <p className="text-sm font-semibold text-gray-100 line-clamp-2 mb-3">{item.title}</p>
                <div className="space-y-1 text-sm text-gray-200 font-medium mb-4">
                  <p><b>Type:</b> {item.type}</p>
                  <p><b>Category:</b> {item.category}</p>
                  <p><b>Status:</b> {item.status}</p>
                </div>
                                    <div className="mt-4">
                                      <p className="text-xs font-bold text-gray-400 mb-1 tracking-wide">
                                        Author:
                                      </p>
                                      <div
                                        className="flex items-center gap-3 px-3 py-2 rounded-xl border border-purple-500/40 bg-purple-500/20 hover:bg-purple-500/30 transition cursor-pointer w-fit"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          setSelectedAuthor(firstAuthor);
                                        }}
                                      >
                                        <Avatar>
                                        <AvatarImage src={githubUsername ? `https://github.com/${githubUsername}.png` : ""} alt={`@${githubUsername}`} />
                                          <AvatarFallback>
                                            {firstAuthor.slice(0, 2).toUpperCase()}
                                          </AvatarFallback>
                                        </Avatar>
                                        <span className="text-sm text-white font-semibold">
                                          {firstAuthor}
                                          {hasMoreAuthors && (
                                            <span className="ml-1 text-purple-300">
                                              +{sortedAuthors.length - 1}
                                            </span>
                                          )}
                                        </span>
                                      </div>
                                    </div>
                {/* <p className="text-xs font-bold text-gray-400 mb-1 tracking-wide">Author:</p>
                <div
                  className="flex items-center gap-2 px-2 py-1 rounded-full bg-blue-500 text-white border border-blue-500 transition-all hover:bg-blue-400 hover:scale-105 cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedAuthor(firstAuthor);
                  }}
                >
                  <Avatar className="w-5 h-5">
                    <AvatarImage src={githubUsername ? `https://github.com/${githubUsername}.png` : ""} alt={`@${githubUsername}`} />
                    <AvatarFallback>{firstAuthor.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="text-xs font-bold truncate">
                    {firstAuthor}
                    {hasMoreAuthors && <span className="ml-1 whitespace-nowrap">...more</span>}
                  </div>
                </div> */}
              </NextLink>
            );
          })}
        </div>

        {/* Pagination */}
        <div className="mt-8 flex justify-center items-center gap-6">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-6 py-3 rounded-lg font-semibold text-lg transition-all duration-300 transform ${
              currentPage === 1
                ? "bg-gray-400 text-gray-500 cursor-not-allowed"
                : "bg-purple-600 text-white hover:bg-purple-700 shadow-md hover:scale-105"
            } backdrop-blur-lg border border-purple-600/30`}
          >
            Previous
          </button>

          <span className="text-sm font-medium text-gray-800 dark:text-gray-300">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-6 py-3 rounded-lg font-semibold text-lg transition-all duration-300 transform ${
              currentPage === totalPages
                ? "bg-gray-400 text-gray-500 cursor-not-allowed"
                : "bg-purple-600 text-white hover:bg-purple-700 shadow-md hover:scale-105"
            } backdrop-blur-lg border border-purple-600/30`}
          >
            Next
          </button>
        </div>
      </>
    )}
  </div>
  </div>
  <Footer/>
</>
  );
};

export default Author