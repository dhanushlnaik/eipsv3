'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Loader from '../ui/Loader2';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  SortingState,
  createColumnHelper,
} from '@tanstack/react-table';
import { ColumnFiltersState } from '@tanstack/react-table';
const columnHelper = createColumnHelper<EIP>();

const columns = [
  columnHelper.accessor('eip', { header: 'EIP' }),
  columnHelper.accessor('title', { header: 'Title' }),
  columnHelper.accessor('author', { header: 'Author' }),
  columnHelper.accessor('status', { header: 'Status' }),
  columnHelper.accessor('type', { header: 'Type' }),
  columnHelper.accessor('category', { header: 'Category' }),
  columnHelper.accessor('created', { header: 'Created' }),
];

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

interface AreaCProps {
  dataset: EIP[];
  status: string;
  cat: string;
}

const CatTable2: React.FC<AreaCProps> = ({ cat, dataset, status }) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [data, setData] = useState<EIP[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setInterval(() => {
      setIsLoading(false);
    }, 2000);
  });

  console.log(dataset);
  console.log(status);
  console.log(cat);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const response = await fetch(`/api/new/all`);
        // const jsonData = await response.json();
        setData(dataset);
        console.log('dataset:', dataset);
        setIsLoading(false); // Set isLoading to false after data is fetched
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false); // Set isLoading to false if there's an error
      }
    };
    fetchData();
  }, [dataset]);

  const filteredData = data
    .filter(
      (item) =>
        (cat === 'All' || item.category === cat) && item.category === status
    )
    .map((item) => {
      const { eip, title, author, repo, type, category, status, deadline } =
        item;
      return {
        eip,
        title,
        author,
        repo,
        type,
        category,
        status,
        deadline,
      };
    });

  console.log(' test filtered data:', filteredData);
  const convertAndDownloadCSV = () => {
    if (data && data.length > 0) {
      const headers = Object.keys(data[0]).join(',') + '\n';
      const csvRows = data.map((item) => {
        const values = Object.values(item).map((value) => {
          if (typeof value === 'string' && value.includes(',')) {
            return `"${value}"`;
          }
          return value;
        });
        return values.join(',');
      });

      const csvContent = headers + csvRows.join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `Pectra.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  const table = useReactTable<EIP>({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 6, // 👈 Set number of rows per page here
      },
    },
  });

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : filteredData.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: -30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 80, damping: 12 }}
          className="flex flex-col p-6 max-w-7xl mx-auto my-8 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-purple-300/40 bg-white/20 dark:bg-gray-900/20 backdrop-blur-2xl backdrop-saturate-150 text-gray-900 dark:text-white z-40"
        >
          <div className="flex items-center justify-between w-full mb-5">
            <h2 className="text-2xl font-semibold tracking-tight text-gray-800 dark:text-gray-100">
              {status}
            </h2>
            <button
              onClick={convertAndDownloadCSV}
              className="px-4 py-1.5 text-sm rounded-lg font-medium text-white bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 transition-all shadow-md hover:shadow-lg"
            >
              Download Reports
            </button>
          </div>

          <div className="table-auto w-full rounded-xl bg-white/10 dark:bg-white/5 backdrop-blur-md">
            <div className="p-4 bg-gradient-to-br from-purple-700/30 to-indigo-900/30 backdrop-blur-md rounded-xl border border-white/20 shadow-lg text-white">
              <div className="table-auto rounded-xl border border-white/10 shadow-inner">
                <table className="min-w-full divide-y divide-white/10 text-sm">
                  <thead className="bg-white/10">
                    {table.getHeaderGroups().map((headerGroup) => (
                      <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <th
                            key={header.id}
                            className="px-4 py-3 text-left font-semibold text-purple-200 backdrop-blur-md cursor-pointer"
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {header.column.getIsSorted() && (
                              <span className="ml-1">
                                {header.column.getIsSorted() === 'asc'
                                  ? '🔼'
                                  : '🔽'}
                              </span>
                            )}
                            {header.column.getCanFilter() && (
                              <input
                                className="mt-2 w-full rounded bg-white/10 border border-purple-500/30 px-2 py-1 text-xs text-white placeholder-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                                onChange={(e) =>
                                  header.column.setFilterValue(e.target.value)
                                }
                                placeholder={`Search ${header.column.id}`}
                              />
                            )}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {table.getRowModel().rows.map((row) => (
                      <motion.tr
                        key={row.id}
                        className="transition cursor-pointer hover:bg-white/10"
                        onClick={() =>
                          alert(`Clicked on EIP ${row.original.eip}`)
                        }
                      >
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id} className="px-4 py-2">
                            {cell.column.id === 'title' ? (
                              <Link
                                href={`/${row.original.repo === 'erc' || row.original.repo === 'ERC' ? 'ercs/erc' : row.original.repo === 'rip' ? 'rips/rip' : 'eips/eip'}-${row.original.eip}`}
                                className=" hover:text-purple-100"
                              >
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )}
                              </Link>
                            ) : cell.column.id === 'author' ? (
                              <Link
                                href={`${
                                  row.original.author.substring(
                                    row.original.author.length - 1
                                  ) === '>'
                                    ? 'mailto:' + row.original.author
                                    : 'https://github.com/' +
                                      row.original.author.substring(1)
                                }`}
                                className=" hover:text-purple-100"
                              >
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )}
                              </Link>
                            ) : cell.column.id === 'type' ? (
                              <Link
                                href={`/type/${row.original.type}`}
                                className=" hover:text-purple-100"
                              >
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )}
                              </Link>
                            ) : cell.column.id === 'status' ? (
                              <Link
                                href={`/status/${row.original.status}`}
                                className=" hover:text-purple-100"
                              >
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )}
                              </Link>
                            ) : (
                              flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )
                            )}
                          </td>
                        ))}
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex items-center justify-between text-sm text-purple-200">
                <div>
                  Page {table.getState().pagination.pageIndex + 1} of{' '}
                  {table.getPageCount()}
                </div>
                <div className="space-x-2">
                  <button
                    className="rounded bg-purple-600/70 hover:bg-purple-500 px-3 py-1 text-white disabled:opacity-30"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    Previous
                  </button>
                  <button
                    className="rounded bg-purple-600/70 hover:bg-purple-500 px-3 py-1 text-white disabled:opacity-30"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <></>
      )}
    </>
  );
};

export default CatTable2;
