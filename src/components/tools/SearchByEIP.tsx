import React, { useEffect, useState } from 'react';

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

const SearchByEip2: React.FC<AuthorProps> = ({ defaultQuery }) => {
  const [data, setData] = useState<EIP[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const cardsPerPage = 25;

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedAuthor]);

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

        setData(filteredData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
    setSelectedAuthor(defaultQuery);
  }, [defaultQuery]);

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
        item.eip.toString().includes(searchTerm.trim())
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

  const networkUpgrades: Record<string, number[]> = {
    Homestead: [2, 7, 8],
    'Spurious Dragon': [155, 160, 161, 170],
    'Tangerine Whistle': [150],
    Byzantium: [100, 140, 196, 197, 198, 211, 214, 649, 658],
    Petersburg: [145, 1014, 1052, 1234, 1283],
    Istanbul: [152, 1108, 1344, 1844, 2028, 2200],
    'Muir Glacier': [2384],
    Dencun: [1153, 4788, 4844, 5656, 6780, 7044, 7045, 7514, 7516],
    Pectra: [7691, 7623, 7840, 7702, 7685, 7549, 7251, 7002, 6110, 2935, 2537],
    Berlin: [2565, 2929, 2718, 2930],
    London: [1559, 3198, 3529, 3541, 3554],
    'Arrow Glacier': [4345],
    'Gray Glacier': [5133],
    Paris: [3675, 4399],
    Shapella: [3651, 3855, 3860, 4895, 6049],
  };

  return (
    <>
      <div className="px-5 max-w-[1200px] mx-auto">
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
              placeholder="Search EIP"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent outline-none text-sm placeholder-gray-400 text-gray-200 w-full"
            />
          </div>
        </div>
      </div>

      <div className="p-4">
        {isLoading ? (
          <p className="text-center text-gray-300">Loading...</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {paginatedData.map((item) => {
                const networkUpgrade = Object.entries(networkUpgrades).find(
                  ([, eips]) => eips.includes(Number(item.eip))
                )?.[0];

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
                    className="bg-purple-900/50 backdrop-blur-md rounded-lg p-4 transition transform hover:scale-105 hover:outline hover:outline-purple-400 outline-offset-[-2px] flex flex-col justify-between min-h-[300px] shadow-md"
                  >
                    <h2 className="text-blue-400 text-xl font-extrabold mb-3 break-words">
                      {item.repo.toUpperCase()}-{item.eip}
                    </h2>

                    <p className="text-sm font-bold text-gray-300 truncate mb-2">
                      {item.title}
                    </p>

                    <p className="text-sm text-gray-300 mb-1">
                      <b>Type:</b> {item.type}
                    </p>

                    <p className="text-sm text-gray-300 mb-1">
                      <b>Category:</b> {item.category}
                    </p>

                    <p className="text-sm text-gray-300 mb-1">
                      <b>Status:</b> {item.status}
                    </p>

                    {networkUpgrade && (
                      <p className="text-sm text-gray-300 mb-1">
                        <b>Network Upgrade:</b> {networkUpgrade}
                      </p>
                    )}

                    <p className="text-xs font-bold text-gray-300 mb-2">
                      Authors:
                    </p>
                    <div
                      className="flex items-center gap-2 bg-blue-500 text-white px-3 py-1 rounded-full border border-blue-500 whitespace-nowrap overflow-hidden transition hover:bg-blue-400 hover:scale-105 cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedAuthor(firstAuthor);
                      }}
                    >
                      {firstAuthor}
                      {hasMoreAuthors && (
                        <span className="ml-2">
                          +{sortedAuthors.length - 1}
                        </span>
                      )}
                    </div>
                  </a>
                );
              })}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex justify-center items-center gap-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-md font-semibold transition-all duration-200 ${
                  currentPage === 1
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Previous
              </button>

              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-md font-semibold transition-all duration-200 ${
                  currentPage === totalPages
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default SearchByEip2;
