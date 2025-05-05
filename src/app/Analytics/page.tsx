'use client';
import React, { useState, useEffect } from 'react';
import Footer from '@/components/layout/SubFooter';
import Loader from '@/components/ui/Loader2';
import { motion } from 'motion/react';
import { slideInFromLeft, slideInFromRight } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import axios from 'axios';
import { useCallback } from 'react';
import { RoundSpinner as Spinner } from '@/components/ui/Spinner';
import ReactECharts from 'echarts-for-react';
import Link from 'next/link';
import DateTime from '@/components/DateTime';
import EipsLabelChart from '@/components/charts/PRLabelsChart';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from '@/components/ui/table';
import Comments from '@/components/tools/Comments';

type PR = {
  repo: string;
  prNumber: number;
  key: string;
  tag: string;
  prTitle: string;
  created_at: Date;
  closed_at: Date | null;
  merged_at: Date | null;
  reviewDate: Date | null;
};

type Issue = {
  repo: string;
  key: string;
  tag: string;
  IssueNumber: number;
  IssueTitle: string;
  state: string;
  created_at: Date;
  closed_at: Date | null;
};

interface ChartDataItem {
  _id: string;
  category: string;
  monthYear: string;
  type: 'Created' | 'Merged' | 'Closed' | 'Open' | 'Review';
  count: number;
  eips: number;
  ercs: number;
  rips: number;
}

function getId(item: PR | Issue) {
  return 'prNumber' in item ? item.prNumber : item.IssueNumber;
}

function ItemRow({
  item,
  type,
  state,
}: {
  item: PR | Issue;
  type: string;
  state: string;
}) {
  return (
    <TableRow className="transition duration-300 hover:shadow-lg hover:bg-purple-500/10 hover:backdrop-blur-sm">
      <TableCell className="text-center align-middle text-gray-200">
        {getId(item)}
      </TableCell>
      <TableCell className="px-2 break-words max-w-[200px] text-gray-200">
        {'prTitle' in item ? item.prTitle : item.IssueTitle}
      </TableCell>
      <TableCell className="text-center align-middle text-gray-200">
        {state}
      </TableCell>
      <TableCell className="text-center align-middle text-gray-200">
        {item.created_at ? new Date(item.created_at).toLocaleDateString() : '-'}
      </TableCell>
      <TableCell className="text-center align-middle text-gray-200">
        {item.closed_at ? new Date(item.closed_at).toLocaleDateString() : '-'}
      </TableCell>
      {type === 'PRs' && (
        <TableCell className="text-center align-middle text-gray-200">
          {'merged_at' in item && item.merged_at
            ? new Date(item.merged_at).toLocaleDateString()
            : '-'}
        </TableCell>
      )}
      <TableCell className="text-center">
        <Link
          href={
            type === 'PRs'
              ? `/PR/${(item as PR).repo}/${(item as PR).prNumber}`
              : `/issue/${(item as Issue).repo}/${(item as Issue).IssueNumber}`
          }
          target="_blank"
          className="inline-block rounded-md border border-purple-500/30 bg-purple-700/60 px-4 py-2 text-sm text-white shadow-md transition-all hover:scale-105 hover:bg-purple-600/80 hover:shadow-lg"
        >
          {type === 'PRs' ? 'Pull Request' : 'Issue'}
        </Link>
      </TableCell>
    </TableRow>
  );
}

const AnalyticsPage = () => {
  const [isloading, setLoading] = useState<boolean>(false);
  const [loading2, setLoading2] = useState<boolean>(false);
  const [loading3, setLoading3] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const toggleDropdown = () => setShowDropdown((prev) => !prev);

  const [data, setData] = useState<{
    PRs: {
      [key: string]: {
        created: PR[];
        closed: PR[];
        merged: PR[];
        open: PR[];
        review: PR[];
      };
    };
    Issues: {
      [key: string]: { created: Issue[]; closed: Issue[]; open: Issue[] };
    };
  }>({ PRs: {}, Issues: {} });

  const [downloaddata, setdownloadData] = useState<{
    PRs: {
      [key: string]: {
        created: PR[];
        closed: PR[];
        merged: PR[];
        open: PR[];
        review: PR[];
      };
    };
    Issues: {
      [key: string]: { created: Issue[]; closed: Issue[]; open: Issue[] };
    };
  }>({ PRs: {}, Issues: {} });

  const [chartdata, setchartData] = useState<ChartDataItem[] | undefined>([]);
  // const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'PRs' | 'Issues'>('PRs');
  const [selectedRepo, setSelectedRepo] = useState<string>('All');
  const [showCategory, setShowCategory] = useState<{ [key: string]: boolean }>({
    created: true,
    closed: true,
    merged: true,
    open: true,
    review: true,
  });

  const fetchEndpoint = useCallback(() => {
    const baseUrl = '/api/AnalyticsCharts';
    const tabPath = activeTab === 'PRs' ? 'prs' : 'issues';
    const repoPath = selectedRepo.toLowerCase();
    const endpoint = `${baseUrl}/${tabPath}/${repoPath}`;

    return endpoint;
  }, [activeTab, selectedRepo]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const endpoint = fetchEndpoint();
        const response = await axios.get(endpoint);
        setchartData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fetchEndpoint]);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory((prev) => (prev === category ? null : category)); // Toggle selection
    setShowCategory({
      created: category === 'created',
      open: category === 'open',
      closed: category === 'closed',
      merged: category === 'merged',
      // review: category === 'review' // Uncomment if review category is enabled
    });
  };

  const getYears = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 10 }, (_, i) => currentYear - i);
  };

  const getMonths = () => [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading2(true);
      const endpoint =
        activeTab === 'PRs'
          ? `/api/AnalyticsData/prs/${selectedRepo.toLowerCase()}?year=${selectedYear}&month=${selectedMonth}`
          : `/api/AnalyticsData/issues/${selectedRepo.toLowerCase()}?year=${selectedYear}&month=${selectedMonth}`;

      try {
        if (activeTab === 'PRs') {
          const result: Array<{
            monthYear: string;
            value: {
              created?: PR[];
              closed?: PR[];
              merged?: PR[];
              open?: PR[];
              review?: PR[];
            };
          }> = await fetch(endpoint).then((res) => res.json());

          const formattedData = result.reduce<{
            PRs: Record<
              string,
              {
                created: PR[];
                closed: PR[];
                merged: PR[];
                open: PR[];
                review: PR[];
              }
            >;
            Issues: Record<
              string,
              { created: Issue[]; closed: Issue[]; open: Issue[] }
            >;
          }>(
            (acc, item) => {
              const { monthYear, value } = item;
              const {
                created = [],
                closed = [],
                merged = [],
                open = [],
                review = [],
              } = value;

              if (!acc.PRs[monthYear]) {
                acc.PRs[monthYear] = {
                  created: [],
                  closed: [],
                  merged: [],
                  open: [],
                  review: [],
                };
              }

              acc.PRs[monthYear].created = created;
              acc.PRs[monthYear].closed = closed;
              acc.PRs[monthYear].merged = merged;
              acc.PRs[monthYear].open = open;
              acc.PRs[monthYear].review = review;

              return acc;
            },
            { PRs: {}, Issues: {} }
          );

          setData(formattedData);
        } else {
          const result: Array<{
            monthYear: string;
            value: {
              created?: Issue[];
              closed?: Issue[];
              open?: Issue[];
            };
          }> = await fetch(endpoint).then((res) => res.json());

          const formattedData = result.reduce<{
            PRs: Record<
              string,
              {
                created: PR[];
                closed: PR[];
                merged: PR[];
                open: PR[];
                review: PR[];
              }
            >;
            Issues: Record<
              string,
              {
                created: Issue[];
                closed: Issue[];
                open: Issue[];
              }
            >;
          }>(
            (acc, item) => {
              const { monthYear, value } = item;
              const { created = [], closed = [], open = [] } = value;

              if (!acc.Issues[monthYear]) {
                acc.Issues[monthYear] = {
                  created: [],
                  closed: [],
                  open: [],
                };
              }

              acc.Issues[monthYear].created = created;
              acc.Issues[monthYear].closed = closed;
              acc.Issues[monthYear].open = open;

              return acc;
            },
            { PRs: {}, Issues: {} }
          );

          setData(formattedData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading2(false);
      }
    };

    fetchData();
  }, [selectedRepo, selectedYear, selectedMonth, activeTab]);

  useEffect(() => {
    const fetchData2 = async () => {
      setLoading3(true);
      const endpoint =
        activeTab === 'PRs'
          ? `/api/AnalyticsData/prs/${selectedRepo.toLowerCase()}`
          : `/api/AnalyticsData/issues/${selectedRepo.toLowerCase()}`;

      try {
        const response = await fetch(endpoint);
        if (!response.ok) throw new Error('Failed to fetch data');

        if (activeTab === 'PRs') {
          const result: Array<{
            monthYear: string;
            value: {
              created?: PR[];
              closed?: PR[];
              merged?: PR[];
              open?: PR[];
              review?: PR[];
            };
          }> = await response.json();

          const formattedData = result.reduce<{
            PRs: Record<
              string,
              {
                created: PR[];
                closed: PR[];
                merged: PR[];
                open: PR[];
                review: PR[];
              }
            >;
            Issues: Record<
              string,
              { created: Issue[]; closed: Issue[]; open: Issue[] }
            >;
          }>(
            (acc, item) => {
              const { monthYear, value } = item;
              const {
                created = [],
                closed = [],
                merged = [],
                open = [],
                review = [],
              } = value;

              if (!acc.PRs[monthYear]) {
                acc.PRs[monthYear] = {
                  created: [],
                  closed: [],
                  merged: [],
                  open: [],
                  review: [],
                };
              }

              acc.PRs[monthYear].created.push(...created);
              acc.PRs[monthYear].closed.push(...closed);
              acc.PRs[monthYear].merged.push(...merged);
              acc.PRs[monthYear].open.push(...open);
              acc.PRs[monthYear].review.push(...review);

              return acc;
            },
            { PRs: {}, Issues: {} }
          );

          setdownloadData(formattedData);
        } else {
          const result: Array<{
            monthYear: string;
            value: {
              created?: Issue[];
              closed?: Issue[];
              open?: Issue[];
            };
          }> = await response.json();

          const formattedData = result.reduce<{
            PRs: Record<
              string,
              {
                created: PR[];
                closed: PR[];
                merged: PR[];
                open: PR[];
                review: PR[];
              }
            >;
            Issues: Record<
              string,
              {
                created: Issue[];
                closed: Issue[];
                open: Issue[];
              }
            >;
          }>(
            (acc, item) => {
              const { monthYear, value } = item;
              const { created = [], closed = [], open = [] } = value;

              if (!acc.Issues[monthYear]) {
                acc.Issues[monthYear] = {
                  created: [],
                  closed: [],
                  open: [],
                };
              }

              acc.Issues[monthYear].created.push(...created);
              acc.Issues[monthYear].closed.push(...closed);
              acc.Issues[monthYear].open.push(...open);

              return acc;
            },
            { PRs: {}, Issues: {} }
          );

          setdownloadData(formattedData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading3(false);
      }
    };

    fetchData2();
  }, [selectedRepo, activeTab]);

  const renderTable = (year: string, month: string, type: 'PRs' | 'Issues') => {
    // Data based on type (PRs or Issues)
    const dataToUse = type === 'PRs' ? data.PRs : data.Issues;

    // Format the month-year key for data lookup
    const key = `${year}-${String(getMonths().indexOf(month) + 1).padStart(2, '0')}`;

    // Default data structure for PRs or Issues
    const items =
      dataToUse[key] ||
      (type === 'PRs'
        ? {
            created: [] as PR[],
            closed: [] as PR[],
            merged: [] as PR[],
            open: [] as PR[],
          }
        : {
            created: [] as Issue[],
            closed: [] as Issue[],
            open: [] as Issue[],
          });

    const createdCount = items.created.length;
    const closedCount = items.closed.length;
    const openCount = items.open.length;

    // Conditionally calculate for PR-specific categories
    const mergedCount =
      type === 'PRs' ? (items as { merged: PR[] }).merged.length : 0;

    return (
      <>
        <Tabs
          defaultValue="created"
          value={selectedCategory ?? undefined}
          onValueChange={(value) =>
            handleCategoryClick(value as 'created' | 'open' | 'closed')
          }
          className="w-full"
        >
          <div className="w-full flex justify-center pt-4">
            <TabsList className="w-max gap-4 px-4 py-2 rounded-lg shadow-sm">
              <TabsTrigger value="created">
                Created {loading2 ? <Spinner size="sm" /> : `(${createdCount})`}
              </TabsTrigger>

              <TabsTrigger value="open">
                Open {loading2 ? <Spinner size="sm" /> : `(${openCount})`}
              </TabsTrigger>

              <TabsTrigger value="closed">
                Closed {loading2 ? <Spinner size="sm" /> : `(${closedCount})`}
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="PRs">
            <div>Showing PRs content...</div>
          </TabsContent>
          <TabsContent value="Issues">
            <div>Showing Issues content...</div>
          </TabsContent>
        </Tabs>

        {type === 'PRs' && (
          <div
            className={cn(
              'text-center p-2 m-2 flex-1 min-w-[150px] rounded-md shadow-sm cursor-pointer',
              selectedCategory === 'merged'
                ? 'border-2 border-blue-300 bg-gray-800 text-white'
                : 'bg-gray-800 text-white'
            )}
            onClick={() => handleCategoryClick('merged')}
          >
            Merged ({loading2 ? <Spinner /> : mergedCount})
          </div>
        )}

        <div className="overflow-y-auto max-h-[700px] border-t border-gray-200 rounded-b-md">
          <Table>
            <TableHeader className="bg-gray-800 text-white">
              <TableRow>
                <TableHead className="text-center min-w-[6rem] px-2">
                  Number
                </TableHead>
                <TableHead className="text-center min-w-[20rem] px-2">
                  Title
                </TableHead>
                <TableHead className="text-center min-w-[6rem] px-2">
                  State
                </TableHead>
                <TableHead className="text-center min-w-[6rem] px-2">
                  Created At
                </TableHead>
                <TableHead className="text-center min-w-[6rem] px-2">
                  Closed At
                </TableHead>
                {type === 'PRs' && (
                  <TableHead className="text-center min-w-[6rem] px-2">
                    Merged At
                  </TableHead>
                )}
                <TableHead className="text-center min-w-[10rem] px-2">
                  Link
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.created.length === 0 &&
              items.closed.length === 0 &&
              items.open.length === 0 &&
              (type !== 'PRs' ||
                ('merged' in items && items.merged?.length === 0)) ? (
                <TableRow>
                  <TableCell
                    colSpan={type === 'PRs' ? 7 : 6}
                    className="text-center"
                  >
                    No Data Available
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {showCategory.created &&
                    items.created.map((item: PR | Issue) => (
                      <ItemRow
                        key={`created-${getId(item)}`}
                        item={item}
                        type={type}
                        state="Created"
                      />
                    ))}
                  {showCategory.closed &&
                    items.closed.map((item: PR | Issue) => (
                      <ItemRow
                        key={`closed-${getId(item)}`}
                        item={item}
                        type={type}
                        state="Closed"
                      />
                    ))}
                  {showCategory.merged &&
                    type === 'PRs' &&
                    'merged' in items &&
                    items.merged.map((item: PR) => (
                      <ItemRow
                        key={`merged-${item.prNumber}`}
                        item={item}
                        type={type}
                        state="Merged"
                      />
                    ))}
                  {showCategory.open &&
                    items.open.map((item: PR | Issue) => (
                      <ItemRow
                        key={`open-${getId(item)}`}
                        item={item}
                        type={type}
                        state="Open"
                      />
                    ))}
                </>
              )}
            </TableBody>
          </Table>
        </div>
      </>
    );
  };

  const convertToCSV = (
    filteredData: {
      created?: PR[];
      closed?: PR[];
      merged?: PR[];
      open?: PR[];
      reviewed?: PR[];
    },
    type: 'PRs' | 'Issues'
  ) => {
    const csvRows = [];

    const headers =
      type === 'PRs'
        ? ['Number', 'Title', 'Created At', 'Closed At', 'Merged At', 'Link']
        : ['Number', 'Title', 'Created At', 'Closed At', 'Link'];

    // Add headers to CSV rows
    csvRows.push(headers.join(','));

    // console.log("filteredData",filteredData)
    // Combine created and closed arrays for PRs and Issues
    const items =
      type === 'PRs'
        ? [
            ...(Array.isArray(filteredData.reviewed) && showCategory.review
              ? filteredData.reviewed
              : []),
            ...(Array.isArray(filteredData.created) && showCategory.created
              ? filteredData.created
              : []),
            ...(Array.isArray(filteredData.closed) && showCategory.closed
              ? filteredData.closed
              : []),
            ...(Array.isArray(filteredData.merged) && showCategory.merged
              ? filteredData.merged
              : []),
            ...(Array.isArray(filteredData.open) && showCategory.open
              ? filteredData.open
              : []),
            // ...(Array.isArray(filteredData.review) && showCategory.review ? filteredData.review : [])
          ]
        : [
            ...(Array.isArray(filteredData.created) && showCategory.created
              ? filteredData.created
              : []),
            ...(Array.isArray(filteredData.closed) && showCategory.closed
              ? filteredData.closed
              : []),
            ...(Array.isArray(filteredData.open) && showCategory.open
              ? filteredData.open
              : []),
          ];

    // console.log(items);

    // Add data to CSV rows
    items.forEach((item: PR | Issue) => {
      const row =
        type === 'PRs'
          ? [
              (item as PR).prNumber,
              `"${(item as PR).prTitle}"`, // Wrap title in quotes
              new Date(item.created_at).toLocaleDateString(),
              item.closed_at
                ? new Date(item.closed_at).toLocaleDateString()
                : '-',
              (item as PR).merged_at
                ? new Date((item as PR).merged_at!).toLocaleDateString()
                : '-',
              `https://github.com/ethereum/${selectedRepo}/${type === 'PRs' ? 'pull' : 'issues'}/${(item as PR).prNumber}`,
            ].join(',')
          : [
              (item as Issue).IssueNumber,
              `"${(item as Issue).IssueTitle}"`, // Wrap title in quotes
              new Date(item.created_at).toLocaleDateString(),
              item.closed_at
                ? new Date(item.closed_at).toLocaleDateString()
                : '-',
              `https://github.com/ethereum/${selectedRepo}/issues/${(item as Issue).IssueNumber}`,
            ].join(',');

      csvRows.push(row);
    });

    return csvRows.join('\n');
  };

  function downloadCSVForIssues(
    data: { created?: Issue[]; closed?: Issue[]; open?: Issue[] },
    type: string
  ) {
    const csvRows = [];

    // Define headers for the CSV
    const headers = ['Number', 'Title', 'Created At', 'Closed At', 'Link'];
    csvRows.push(headers.join(','));

    // Combine created, closed, and open arrays
    const items = [
      ...(data.created || []),
      ...(data.closed || []),
      ...(data.open || []),
    ];

    // Add data rows to the CSV
    items.forEach((item) => {
      const row = [
        item.IssueNumber,
        `"${item.IssueTitle}"`, // Wrap title in quotes
        new Date(item.created_at).toLocaleDateString(),
        item.closed_at ? new Date(item.closed_at).toLocaleDateString() : '-',
        `https://github.com/ethereum/${selectedRepo}/issues/${item.IssueNumber}`,
      ].join(',');
      csvRows.push(row);
    });

    // Create a Blob and trigger download
    const csv = csvRows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `${type}-${selectedYear}-${selectedMonth}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  const convertToCSV2 = (
    filteredData: {
      created?: Array<PR & { key: string; tag: string }>;
      closed?: Array<PR & { key: string; tag: string }>;
      merged?: Array<PR & { key: string; tag: string }>;
      reviewed?: Array<PR & { key: string; tag: string }>;
      open?: Array<PR & { key: string; tag: string }>;
    },
    type: 'PRs' | 'Issues'
  ) => {
    const csvRows = [];

    // Add `Key` and `Tag` headers to the existing ones
    const headers =
      type === 'PRs'
        ? [
            'Key',
            'Tag',
            'Number',
            'Title',
            'Created At',
            'Closed At',
            'Merged At',
            'Link',
          ]
        : ['Key', 'Tag', 'Number', 'Title', 'Created At', 'Closed At', 'Link'];

    // Add headers to CSV rows
    csvRows.push(headers.join(','));

    // console.log("filteredData", filteredData);

    // Combine created and closed arrays for PRs and Issues
    const items =
      type === 'PRs'
        ? [
            ...(Array.isArray(filteredData.reviewed) && showCategory.review
              ? filteredData.reviewed
              : []),
            ...(Array.isArray(filteredData.created) && showCategory.created
              ? filteredData.created
              : []),
            ...(Array.isArray(filteredData.closed) && showCategory.closed
              ? filteredData.closed
              : []),
            ...(Array.isArray(filteredData.merged) && showCategory.merged
              ? filteredData.merged
              : []),
            ...(Array.isArray(filteredData.open) && showCategory.open
              ? filteredData.open
              : []),
          ]
        : [
            ...(Array.isArray(filteredData.created) && showCategory.created
              ? filteredData.created
              : []),
            ...(Array.isArray(filteredData.closed) && showCategory.closed
              ? filteredData.closed
              : []),
            ...(Array.isArray(filteredData.open) && showCategory.open
              ? filteredData.open
              : []),
          ];

    // console.log(items);

    // Add data to CSV rows
    items.forEach((item: PR | (Issue & { key: string; tag: string })) => {
      const row =
        type === 'PRs'
          ? [
              item.key, // Add `key`
              item.tag, // Add `tag`
              (item as PR).prNumber,
              `"${(item as PR).prTitle}"`, // Wrap title in quotes
              new Date(item.created_at).toLocaleDateString(),
              item.closed_at
                ? new Date(item.closed_at).toLocaleDateString()
                : '-',
              (item as PR).merged_at
                ? new Date((item as PR).merged_at!).toLocaleDateString()
                : '-',
              `https://github.com/ethereum/${selectedRepo}/${type === 'PRs' ? 'pull' : 'issues'}/${(item as PR).prNumber}`,
            ].join(',')
          : [
              item.key, // Add `key`
              item.tag, // Add `tag`
              (item as Issue).IssueNumber,
              `"${(item as Issue).IssueTitle}"`, // Wrap title in quotes
              new Date(item.created_at).toLocaleDateString(),
              item.closed_at
                ? new Date(item.closed_at).toLocaleDateString()
                : '-',
              `https://github.com/ethereum/${selectedRepo}/issues/${(item as Issue).IssueNumber}`,
            ].join(',');

      csvRows.push(row);
    });

    return csvRows.join('\n');
  };

  const handleDownload = () => {
    if (!selectedYear || !selectedMonth) {
      alert('Please select a year and month.');
      return;
    }

    const key = `${selectedYear}-${String(getMonths().indexOf(selectedMonth) + 1).padStart(2, '0')}`;
    const filteredData = activeTab === 'PRs' ? data.PRs[key] : data.Issues[key];

    if (
      !filteredData ||
      (filteredData.created.length === 0 && filteredData.closed.length === 0)
    ) {
      alert('No data available for the selected month.');
      return;
    }

    // console.log("review data:",filteredData);

    // Combine arrays and pass them to the CSV function
    const combinedData =
      activeTab === 'PRs'
        ? {
            created: filteredData.created,
            closed: filteredData.closed,
            merged: 'merged' in filteredData ? filteredData.merged : [],
            reviewed: 'review' in filteredData ? filteredData.review : [],
            open: filteredData.open,
          }
        : {
            created: filteredData.created,
            closed: filteredData.closed,
            open: filteredData.open,
          };

    if (activeTab === 'PRs') {
      downloadCSV(
        combinedData as {
          created?: PR[];
          closed?: PR[];
          merged?: PR[];
          open?: PR[];
          reviewed?: PR[];
        },
        activeTab
      );
    } else {
      downloadCSVForIssues(
        combinedData as { created?: Issue[]; closed?: Issue[]; open?: Issue[] },
        activeTab
      );
    }
  };

  const handleDownload2 = () => {
    // Initialize combined data arrays for PRs and Issues separately
    const combinedPRData = {
      created: [] as Array<PR & { key: string; tag: string }>,
      closed: [] as Array<PR & { key: string; tag: string }>,
      merged: [] as Array<PR & { key: string; tag: string }>,
      reviewed: [] as Array<PR & { key: string; tag: string }>,
      open: [] as Array<PR & { key: string; tag: string }>,
    };

    const combinedIssueData = {
      created: [] as Array<Issue & { key: string; tag: string }>,
      closed: [] as Array<Issue & { key: string; tag: string }>,
      open: [] as Array<Issue & { key: string; tag: string }>,
    };

    // Determine if we're handling PRs or Issues
    const allData =
      activeTab === 'PRs' ? downloaddata.PRs : downloaddata.Issues;

    // Iterate over all keys in the selected dataset (PRs or Issues)
    Object.keys(allData).forEach((key) => {
      const currentData = allData[key];

      if (activeTab === 'PRs') {
        // Add each record with 'key' and 'tag' to combinedPRData
        combinedPRData.created.push(
          ...(currentData as { created: PR[] }).created.map((item) => ({
            ...item,
            key,
            tag: 'created',
          }))
        );
        combinedPRData.closed.push(
          ...(currentData as { closed: PR[] }).closed.map((item) => ({
            ...item,
            key,
            tag: 'closed',
          }))
        );
        combinedPRData.open.push(
          ...(currentData as { open: PR[] }).open.map((item) => ({
            ...item,
            key,
            tag: 'open',
          }))
        );
        combinedPRData.merged.push(
          ...((currentData as { merged: PR[] }).merged || []).map((item) => ({
            ...item,
            key,
            tag: 'merged',
          }))
        );
        combinedPRData.reviewed.push(
          ...((currentData as { review: PR[] }).review || []).map((item) => ({
            ...item,
            key,
            tag: 'reviewed',
          }))
        );
      } else {
        // Add each record with 'key' and 'tag' to combinedIssueData
        combinedIssueData.created.push(
          ...(currentData as { created: Issue[] }).created.map((item) => ({
            ...item,
            key,
            tag: 'created',
          }))
        );
        combinedIssueData.closed.push(
          ...(currentData as { closed: Issue[] }).closed.map((item) => ({
            ...item,
            key,
            tag: 'closed',
          }))
        );
        combinedIssueData.open.push(
          ...(currentData as { open: Issue[] }).open.map((item) => ({
            ...item,
            key,
            tag: 'open',
          }))
        );
      }
    });

    // Check if there's data to download
    const noData =
      activeTab === 'PRs'
        ? combinedPRData.created.length === 0 &&
          combinedPRData.closed.length === 0 &&
          combinedPRData.open.length === 0 &&
          combinedPRData.merged.length === 0 &&
          combinedPRData.reviewed.length === 0
        : combinedIssueData.created.length === 0 &&
          combinedIssueData.closed.length === 0 &&
          combinedIssueData.open.length === 0;

    if (noData) {
      alert('No data available.');
      return;
    }

    // console.log("Combined data with keys and tags:", activeTab === 'PRs' ? combinedPRData : combinedIssueData);

    // Pass the appropriate combined data to the CSV download function
    if (activeTab === 'PRs') {
      downloadCSV2(combinedPRData, activeTab);
    } else {
      downloadCSV2(
        {
          created: combinedIssueData.created?.map((item) => ({
            ...item,
            prNumber: 0,
            prTitle: '',
            merged_at: null,
            reviewDate: null,
          })),
          closed: combinedIssueData.closed?.map((item) => ({
            ...item,
            prNumber: 0,
            prTitle: '',
            merged_at: null,
            reviewDate: null,
          })),
          open: combinedIssueData.open?.map((item) => ({
            ...item,
            prNumber: 0,
            prTitle: '',
            merged_at: null,
            reviewDate: null,
          })),
        },
        activeTab
      );
    }
  };

  const downloadCSV = (
    data: {
      created?: PR[];
      closed?: PR[];
      merged?: PR[];
      open?: PR[];
      reviewed?: PR[];
    },
    type: 'PRs' | 'Issues'
  ) => {
    const csv = convertToCSV(data, type);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `${type}-${selectedYear}-${selectedMonth}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const downloadCSV2 = (
    data: {
      created?: Array<PR & { key: string; tag: string }>;
      closed?: Array<PR & { key: string; tag: string }>;
      merged?: Array<PR & { key: string; tag: string }>;
      reviewed?: Array<PR & { key: string; tag: string }>;
      open?: Array<PR & { key: string; tag: string }>;
    },
    type: 'PRs' | 'Issues'
  ) => {
    const csv = convertToCSV2(data, type);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `${type}_since_2015.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const renderChart = () => {
    if (!Array.isArray(chartdata)) return null;

    console.log('chart data:', chartdata);

    const transformedData = chartdata.reduce<{
      [key: string]: { [key: string]: number };
    }>((acc, { monthYear, type, count, eips, ercs, rips }) => {
      if (showCategory[type.toLowerCase()]) {
        if (!acc[monthYear]) acc[monthYear] = {};

        acc[monthYear][type] = (acc[monthYear][type] || 0) + count;

        if (selectedRepo === 'All') {
          acc[monthYear][`${type}-eips`] =
            (acc[monthYear][`${type}-eips`] || 0) + eips;
          acc[monthYear][`${type}-ercs`] =
            (acc[monthYear][`${type}-ercs`] || 0) + ercs;
          acc[monthYear][`${type}-rips`] =
            (acc[monthYear][`${type}-rips`] || 0) + rips;
        }
      }
      return acc;
    }, {});

    console.log('transformed data:', transformedData);

    const finalTransformedData = Object.keys(transformedData).flatMap(
      (monthYear) => {
        const entry = transformedData[monthYear];
        return [
          ...(showCategory.created
            ? [{ monthYear, type: 'Created', count: entry.Created || 0 }]
            : []),
          ...(showCategory.merged
            ? [{ monthYear, type: 'Merged', count: entry.Merged || 0 }]
            : []),
          ...(showCategory.closed
            ? [{ monthYear, type: 'Closed', count: entry.Closed || 0 }]
            : []),
        ];
      }
    );

    const mergedMax = Math.max(
      0,
      ...finalTransformedData
        .filter((d) => d.type === 'Merged')
        .map((d) => Math.abs(d.count))
    );
    const closedMax = Math.max(
      0,
      ...finalTransformedData
        .filter((d) => d.type === 'Closed')
        .map((d) => Math.abs(d.count))
    );
    const getmin = Math.max(mergedMax, closedMax) || 0;

    const trendData = showCategory.open
      ? Object.keys(transformedData).map((monthYear) => {
          const entry = transformedData[monthYear];
          const openCount = entry.Open || 0;
          return {
            monthYear,
            Open:
              openCount +
              (activeTab === 'PRs' ? Math.abs(getmin) : Math.abs(closedMax)),
          };
        })
      : [];

    const sortedMonths = [
      ...new Set(finalTransformedData.map((item) => item.monthYear)),
    ].sort((a, b) => a.localeCompare(b));

    const series = [];

    if (showCategory.created) {
      series.push({
        name: 'Created',
        type: 'line',
        stack: 'counts',
        data: sortedMonths.map(
          (m) =>
            finalTransformedData.find(
              (d) => d.monthYear === m && d.type === 'Created'
            )?.count || 0
        ),
        itemStyle: { color: '#2196f3' },
      } as const); // <-- ADD this
    }
    if (showCategory.merged) {
      series.push({
        name: 'Merged',
        type: 'bar',
        stack: 'counts',
        data: sortedMonths.map(
          (m) =>
            finalTransformedData.find(
              (d) => d.monthYear === m && d.type === 'Merged'
            )?.count || 0
        ),
        itemStyle: { color: '#4caf50' },
      } as const); // <-- ADD this
    }
    if (showCategory.closed) {
      series.push({
        name: 'Closed',
        type: 'bar',
        stack: 'counts',
        data: sortedMonths.map(
          (m) =>
            finalTransformedData.find(
              (d) => d.monthYear === m && d.type === 'Closed'
            )?.count || 0
        ),
        itemStyle: { color: '#ff4d4d' },
      } as const); // <-- ADD this
    }
    if (showCategory.open) {
      series.push({
        name: 'Open',
        type: 'line',
        yAxisIndex: 1,
        smooth: true,
        lineStyle: {
          color: '#ff00ff',
          width: 2,
        },
        data: sortedMonths
          .map((m) => {
            const found = trendData.find((d) => d.monthYear === m);
            return found ? found.Open : null;
          })
          .filter((value): value is number => value !== null),
      } as const); // <-- ADD this
    }

    const option: {
      tooltip: {
        trigger: 'axis';
        axisPointer: { type: 'shadow' };
        backgroundColor: 'rgba(30, 30, 30, 0.8)';
        borderColor: '#777';
        textStyle: {
          color: '#ffffff';
        };
        formatter: (
          params: Array<{
            axisValueLabel: string;
            axisValue: string;
            seriesName: string;
            value: number;
          }>
        ) => string;
      };
      legend: {
        top: 'top';
        right: 'right';
        textStyle: { color: string };
      };
      grid: {
        left: string;
        right: string;
        bottom: string;
        containLabel: boolean;
      };
      dataZoom: Array<{
        type: 'slider' | 'inside';
        show?: boolean;
        height?: number;
        start: number;
        end: number;
        xAxisIndex: number;
        backgroundColor?: string;
        borderColor?: string;
        dataBackground?: {
          lineStyle: { color: string };
          areaStyle: { color: string };
        };
        handleIcon?: string;
        handleSize?: string;
        handleStyle?: {
          color: string;
          borderColor: string;
          shadowBlur: number;
          shadowColor: string;
        };
        fillerColor?: string;
        textStyle?: {
          color: string;
          fontSize: number;
        };
        zoomLock?: boolean;
      }>;
      xAxis: Array<{
        type: 'category';
        data: string[];
        axisLabel: { color: string };
      }>;
      yAxis: Array<{
        type: 'value';
        min: number;
        max: number;
        axisLabel: { color?: string; show?: boolean };
        splitLine?: { show: boolean };
      }>;
      series: Array<{
        name: string;
        type: 'bar' | 'line';
        stack?: string;
        data: number[];
        itemStyle?: { color: string };
        yAxisIndex?: number;
        smooth?: boolean;
        lineStyle?: { color: string; width: number };
      }>;
    } = {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: 'rgba(30, 30, 30, 0.8)',
        borderColor: '#777',
        textStyle: {
          color: '#ffffff',
        },
        formatter: (params) => {
          let tooltip = params[0].axisValueLabel + '<br/>';
          params.forEach((param) => {
            const { seriesName, value } = param;
            const monthYear = param.axisValue;
            if (
              selectedRepo === 'All' &&
              ['Created', 'Merged', 'Closed', 'Open'].includes(seriesName)
            ) {
              const eips =
                transformedData[monthYear]?.[`${seriesName}-eips`] || 0;
              const ercs =
                transformedData[monthYear]?.[`${seriesName}-ercs`] || 0;
              const rips =
                transformedData[monthYear]?.[`${seriesName}-rips`] || 0;
              tooltip += `
              ${seriesName}: ${Math.abs(value)} 
              (eips: ${Math.abs(eips)}, ercs: ${Math.abs(ercs)}, rips: ${Math.abs(rips)})<br/>
            `;
            } else {
              tooltip += `${seriesName}: ${Math.abs(value)}<br/>`;
            }
          });
          return tooltip;
        },
      },
      legend: {
        top: 'top',
        right: 'right',
        textStyle: { color: '#a0aec0' },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '18%',
        containLabel: true,
      },
      dataZoom: [
        {
          type: 'slider',
          show: true,
          height: 20, // reduce height for slimmer look
          start: 0,
          end: 100,
          xAxisIndex: 0,
          backgroundColor: '#1a1325', // match your dark purple bg
          borderColor: 'transparent',
          dataBackground: {
            lineStyle: {
              color: '#6b46c1', // lavender highlight line
            },
            areaStyle: {
              color: 'rgba(159, 122, 234, 0.2)', // soft purple fill
            },
          },
          handleIcon: 'M8.7,11.6v-7.2h-1.4v7.2H4.5v1.4h6.1v-1.4H8.7z', // minimal handle
          handleSize: '80%', // slimmer handle
          handleStyle: {
            color: '#9f7aea', // vivid handle color
            borderColor: '#6b46c1',
            shadowBlur: 4,
            shadowColor: 'rgba(159, 122, 234, 0.3)',
          },
          fillerColor: 'rgba(159, 122, 234, 0.15)', // filled area
          textStyle: {
            color: '#cbd5e0', // gray-300
            fontSize: 10,
          },
        },
        {
          type: 'inside',
          xAxisIndex: 0,
          start: 0,
          end: 100,
          zoomLock: false,
        },
      ],
      xAxis: [
        {
          type: 'category',
          data: sortedMonths,
          axisLabel: { color: '#e2e8f0' },
        },
      ],
      yAxis: [
        {
          type: 'value',
          min: -300,
          max: 600,
          axisLabel: { color: '#e2e8f0' },
        },
        {
          type: 'value',
          min: 0,
          max: Math.max(0, ...trendData.map((d) => Math.abs(d.Open))),
          axisLabel: { show: false },
          splitLine: { show: false },
        },
      ],
      series,
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{
          borderColor: '#D6BCFA',
          boxShadow: '0px 4px 15px rgba(159, 122, 234, 0.5)',
        }}
        transition={{ duration: 0.3 }}
        className="w-full p-6 rounded-lg bg-[#1a1325] border border-[#6b46c1] hover:border-[#9f7aea] cursor-pointer"
      >
        <div className="flex items-center justify-between w-full mb-4">
          <h2 className="text-xl font-bold text-[#9f7aea]">
            {`Github PR Analytics (Monthly, since 2015)`}
          </h2>

          {/* <Link href={"https://eipsinsight.com//Analytics#GithubAnalytics"}><CopyIcon/></Link> */}
          <button
            onClick={async () => {
              try {
                // Trigger the CSV conversion and download
                handleDownload2();

                // Trigger the API call
                await axios.post('/api/DownloadCounter');
              } catch (error) {
                console.error('Error triggering download counter:', error);
              }
            }}
            disabled={loading3}
            className="shadow-[0_4px_14px_0_rgb(107,70,193,39%)] hover:shadow-[0_6px_20px_rgba(107,70,193,23%)] hover:bg-[rgba(107,70,193,0.9)] px-6 py-1 text-xs bg-[#6b46c1] rounded-md text-white font-light transition duration-200 ease-linear"
          >
            Download Reports
          </button>
        </div>
        <div className="flex items-center justify-center w-full mb-4">
          <Select
            value={selectedRepo}
            onValueChange={(value) => setSelectedRepo(value)} // update your state like MenuItem was doing
          >
            <SelectTrigger className="w-[180px] border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-purple-500">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent className="max-h-[200px] overflow-y-auto">
              <SelectGroup>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="EIPs">EIPs</SelectItem>
                <SelectItem value="ERCs">ERCs</SelectItem>
                <SelectItem value="RIPs">RIPs</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <ReactECharts
          option={option}
          style={{ width: '100%', height: '400px' }}
        />
        <div className="w-full mt-4">
          <DateTime />
        </div>
        <div className="mt-4 mb-8">
          <div className="text-center text-gray-400 italic text-sm space-y-1">
            <p>
              *Note: The data is updated daily at 15:00 UTC to maintain accuracy
              and provide the most current information.*
            </p>
            <p>
              *Note: The data related to the number of PRs might vary when
              compared to the official GitHub repository due to factors like
              deleted PRs.*
            </p>
          </div>

          <div className="mt-6 mx-auto flex flex-wrap justify-center gap-4 p-4 rounded-lg bg-[#1a1325]/70 backdrop-blur-md">
            {/* Created */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="created"
                checked={showCategory.created}
                onCheckedChange={() =>
                  setShowCategory((prev: { [key: string]: boolean }) => ({
                    ...prev,
                    created: !prev.created,
                  }))
                }
              />
              <Label htmlFor="created" className="text-gray-300 text-sm">
                {activeTab === 'PRs' ? 'Created PRs' : 'Created Issues'}
              </Label>
            </div>

            {/* Open */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="open"
                checked={showCategory.open}
                onCheckedChange={() =>
                  setShowCategory((prev: { [key: string]: boolean }) => ({
                    ...prev,
                    open: !prev.open,
                  }))
                }
              />
              <Label htmlFor="open" className="text-gray-300 text-sm">
                Open PRs
              </Label>
            </div>

            {/* Closed */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="closed"
                checked={showCategory.closed}
                onCheckedChange={() =>
                  setShowCategory((prev: { [key: string]: boolean }) => ({
                    ...prev,
                    closed: !prev.closed,
                  }))
                }
              />
              <Label htmlFor="closed" className="text-gray-300 text-sm">
                {activeTab === 'PRs' ? 'Closed PRs' : 'Closed Issues'}
              </Label>
            </div>

            {/* Merged (only for PRs) */}
            {activeTab === 'PRs' && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="merged"
                  checked={showCategory.merged}
                  onCheckedChange={() =>
                    setShowCategory((prev: { [key: string]: boolean }) => ({
                      ...prev,
                      merged: !prev.merged,
                    }))
                  }
                />
                <Label htmlFor="merged" className="text-gray-300 text-sm">
                  Merged PRs
                </Label>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0F172A]">
      <main className="flex-grow px-5 sm:px-10">
        <div className="pt-20 w-full mx-auto">
          <motion.div
            variants={slideInFromLeft(0.5)}
            className="text-[60px] text-white font-bold mt-[10px] text-center mb-[5px]"
          >
            {`GitHub Analytics Dashboard`}
          </motion.div>
          <motion.div
            variants={slideInFromRight(0.5)}
            className="cursive text-[20px] text-gray-200 mb-10 mt-[5px] text-center"
          >
            {
              'Track, visualize, and download reports for pull requests and issues across your repositories — customizable by month, year, and status.'
            }
          </motion.div>
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger className="font-bold">
                FAQ: GitHub Tracker Tool
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold">What does this tool do?</p>
                    <p>
                      This tool aims to automate the process of tracking PRs and
                      issues in GitHub repositories, providing visualizations
                      and reports to streamline project management. The default
                      view utilizes the timeline to observe trends in the number
                      of Created, Closed, Merged, and Open PRs/Issues at the end
                      of each month.
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold">
                      How can I view data for a specific month?
                    </p>
                    <p>
                      To focus on a specific month, click the View More button
                      and choose the desired Year and Month from the dropdown
                      menus. The table and graph will then update to display
                      data exclusively for that selected month.
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold">How to customize the chart?</p>
                    <p>
                      To customize the chart, you can adjust the timeline scroll
                      bar to display data for a specific month/year.
                      Additionally, you can tailor the graph by selecting or
                      deselecting checkboxes for Created, Closed, Merged, and
                      Open PRs/Issues, allowing you to focus on the trends that
                      are most relevant to you.
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold">How to download reports?</p>
                    <p>
                      After selecting your preferred data using the View More
                      option, you can download reports based on the filtered
                      data for further analysis or record-keeping. Simply click
                      the download button to export the data in your chosen
                      format.
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {isloading ? (
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
              <Tabs
                defaultValue="PRs"
                value={activeTab}
                onValueChange={(value) =>
                  setActiveTab(value as 'PRs' | 'Issues')
                }
                className="w-full"
              >
                <div className="w-full flex justify-center pt-4">
                  <TabsList className="w-max gap-4 px-4 py-2 rounded-lg shadow-sm">
                    <TabsTrigger value="PRs">PRs</TabsTrigger>
                    <TabsTrigger value="Issues">Issues</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="PRs"></TabsContent>
                <TabsContent value="Issues"></TabsContent>
              </Tabs>
            </>
          )}

          <div className="space-y-8">
            {' '}
            {/* Unified vertical spacing */}
            {renderChart()}
            <div className="flex justify-center">
              <Button variant={'purpleGlow'} onClick={toggleDropdown}>
                {showDropdown ? 'Hide' : 'View More'}
              </Button>
            </div>
            {showDropdown && (
              <div className="flex justify-center">
                <div className="flex flex-wrap gap-4">
                  {/* Year Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant={'glass'}>
                        {selectedYear ? `Year: ${selectedYear}` : 'Select Year'}
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {getYears().map((year) => (
                        <DropdownMenuItem
                          key={year}
                          onClick={() => {
                            setSelectedYear(year.toString());
                            setSelectedMonth(null);
                          }}
                        >
                          {year}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Month Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant={'glass'} disabled={!selectedYear}>
                        {selectedMonth
                          ? `Month: ${selectedMonth}`
                          : 'Select Month'}
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {selectedYear &&
                        getMonths().map((month, index) => (
                          <DropdownMenuItem
                            key={index}
                            onClick={() => setSelectedMonth(month)}
                          >
                            {month}
                          </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            )}
            {selectedYear && selectedMonth && (
              <div className="flex justify-end">
                <Button
                  variant={'glass'}
                  onClick={async () => {
                    try {
                      handleDownload();
                      await axios.post('/api/DownloadCounter');
                    } catch (error) {
                      console.error(
                        'Error triggering download counter:',
                        error
                      );
                    }
                  }}
                  disabled={loading2}
                >
                  <Download className="mr-2 h-4 w-4" />
                  {loading2 ? (
                    <span className="animate-spin h-4 w-4 border-t-2 border-white rounded-full" />
                  ) : (
                    'Download CSV'
                  )}
                </Button>
              </div>
            )}
            {showDropdown && selectedYear && selectedMonth && (
              <div>{renderTable(selectedYear, selectedMonth, activeTab)}</div>
            )}
            <div>
              <EipsLabelChart />
            </div>
          </div>

          <div className="my-10 w-full">
            <Comments page="Analytics" />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AnalyticsPage;
