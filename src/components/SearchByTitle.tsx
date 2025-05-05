"use client";
import React, { useEffect, useState } from 'react';
import { saveAs } from 'file-saver';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  unique_ID: number;
  repo: string;
  __v: number;
  changeDate: string; // Added changeDate property
}

interface AuthorProps {
  defaultQuery: string;
}

interface AuthorCount {
  name: string;
  count: number;
}

const SearchByTitle: React.FC<AuthorProps> = ({ defaultQuery }) => {
  const [data, setData] = useState<EIP[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const cardsPerPage = 25;

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedAuthor]);
  const [authorCounts, setAuthorCounts] = useState<AuthorCount[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/new/graphsv4`);
        const jsonData = await response.json();

        const getEarliestEntries = (data: EIP[], key: keyof EIP) => {
          const uniqueEntries: Record<string, EIP> = {};
          data.forEach((entry) => {
            const entryKey = entry[key] as string;
            if (
              !uniqueEntries[entryKey] ||
              new Date(entry.changeDate) >
                new Date(uniqueEntries[entryKey].changeDate)
            ) {
              uniqueEntries[entryKey] = entry;
            }
          });
          return Object.values(uniqueEntries);
        };

        let filteredData = [
          ...getEarliestEntries(jsonData.eip as EIP[], 'eip'),
          ...getEarliestEntries(jsonData.erc as EIP[], 'eip'),
          ...getEarliestEntries(jsonData.rip as EIP[], 'eip'),
        ];
        filteredData = filteredData.filter(
          (entry, index, self) =>
            entry.eip !== '1' ||
            index === self.findIndex((e) => e.eip === entry.eip)
        );
        console.log(authorCounts);
        setData(filteredData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
    setSelectedAuthor(defaultQuery);
  }, [defaultQuery, authorCounts]);

  useEffect(() => {
    const authorMap: Record<string, number> = {};

    data.forEach((eip) => {
      const authors = eip.author.split(',').map((author) => author.trim());
      authors.forEach((author) => {
        if (author) {
          // Match GitHub handle in the format: Vitalik Buterin (@vbuterin)
          const handleMatch = author.match(/(.+?)\s\(@([a-zA-Z0-9-_]+)\)$/);

          if (handleMatch) {
            // Add counts for the full name and the GitHub handle
            const fullName = handleMatch[1].trim(); // Extract full name
            const handle = handleMatch[2].trim(); // Extract handle

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


  // Filter and paginate data
  const filteredData = data.filter(
    (item) =>
      !selectedAuthor ||
      item.author.toLowerCase().includes(selectedAuthor.toLowerCase())
  );
  //   const totalPages = Math.ceil(filteredData.length / cardsPerPage);
  const filteredData2 = searchTerm
    ? filteredData.filter((item) =>
        item.title.toString().includes(searchTerm.trim())
      )
    : filteredData;
  const totalPages = Math.ceil(filteredData2.length / cardsPerPage);
  // const paginatedData = filteredData2.slice(
  //   (currentPage - 1) * cardsPerPage,
  //   currentPage * cardsPerPage
  // );
  // console.log("paginated data:", paginatedData);


  const paginatedData = filteredData2.slice(
    (currentPage - 1) * cardsPerPage,
    currentPage * cardsPerPage
  );
  console.log('paginated data:', paginatedData);

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

  // const filteredAuthors = authorCounts.filter((author) =>
  //   author.name.toLowerCase().includes(selectedAuthor.toLowerCase())
  // );

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
              placeholder="Search EIP Title"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent outline-none text-sm placeholder-gray-400 text-gray-200 w-full"
            />
          </div>

          <DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant={"glass"}>
      Title
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
    <DropdownMenuItem onClick={() => (window.location.href = "/SearchPRSandISSUES")}>
      PR/ISSUE
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

                const authors = item.author
                  .split(',')
                  .map((author) => author.replace(/<.*?>/g, '').trim());

                const sortedAuthors = authors.sort((a, b) => {
                  const aIsSelected =
                    selectedAuthor &&
                    a.toLowerCase().includes(selectedAuthor.toLowerCase());
                  const bIsSelected =
                    selectedAuthor &&
                    b.toLowerCase().includes(selectedAuthor.toLowerCase());
                  return Number(bIsSelected) - Number(aIsSelected);
                });

                const firstAuthor = sortedAuthors[0];
                const hasMoreAuthors = sortedAuthors.length > 1;

                return (
                  <a
                    key={item._id}
                    href={`/${item.repo === 'erc' ? 'ercs/erc' : item.repo === 'rip' ? 'rips/rip' : 'eips/eip'}-${item.eip}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-purple-900/30 backdrop-blur-lg border border-purple-700/40 rounded-2xl p-5 transition-all duration-300 transform hover:scale-105 hover:border-purple-400 shadow-xl flex flex-col justify-between min-h-[320px] hover:shadow-purple-500/30"
                  >
                    <h2 className="text-purple-300 text-2xl font-black mb-3 break-words drop-shadow-sm tracking-tight">
                      {item.repo.toUpperCase()}-{item.eip}
                    </h2>

                    <p className="text-sm font-semibold text-gray-100 line-clamp-2 mb-3">
                      {item.title}
                    </p>

                    <div className="space-y-1 text-sm text-gray-200 font-medium">
                      <p>
                        <b>Type:</b> {item.type}
                      </p>
                      <p>
                        <b>Category:</b> {item.category}
                      </p>
                      <p>
                        <b>Status:</b> {item.status}
                      </p>

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
                          <AvatarImage
                            src={`https://github.com/${firstAuthor.toLowerCase()}.png`}
                            alt={`@${firstAuthor}`}
                          />
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

export default SearchByTitle;
