import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DateTime from '@/components/DateTime';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import axios from 'axios';
import { SpokeSpinner } from '../ui/Spinner';
import { Badge } from '../ui/badge';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface EIP {
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

interface EIPGroup {
  category: string;
  month: number;
  year: number;
  date: string;
  count: number;
  eips: EIP[];
}

interface APIResponse {
  status: string;
  eips: EIPGroup[];
}

interface Data {
  eip: APIResponse[];
  erc: APIResponse[];
  rip: APIResponse[];
}

interface CBoxProps {
  dataset: Data;
  status: string;
  type: string;
}

const getStatus = (status: string) => {
  switch (status) {
    case 'Draft':
      return 'Draft';
    case 'Final':
    case 'Accepted':
    case 'Superseded':
      return 'Final';
    case 'Last Call':
      return 'Last Call';
    case 'Withdrawn':
    case 'Abandoned':
    case 'Rejected':
      return 'Withdrawn';
    case 'Review':
      return 'Review';
    case 'Living':
    case 'Active':
      return 'Living';
    case 'Stagnant':
      return 'Stagnant';
    default:
      return 'Final';
  }
};

const getCat = (cat: string) => {
  switch (cat) {
    case 'Standards Track':
    case 'Standard Track':
    case 'Standards Track (Core, Networking, Interface, ERC)':
    case 'Standard':
    case 'Process':
    case 'Core':
    case 'core':
      return 'Core';
    case 'ERC':
      return 'ERCs';
    case 'Networking':
      return 'Networking';
    case 'Interface':
      return 'Interface';
    case 'Meta':
      return 'Meta';
    case 'Informational':
      return 'Informational';
    default:
      return 'Core';
  }
};

const CBoxStatus: React.FC<CBoxProps> = ({ dataset, status, type }) => {
  const [data, setData] = useState<Data>();
  const [isLoading, setIsLoading] = useState(true);
  const [typeData, setTypeData] = useState<APIResponse[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(2025);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jsonData = dataset;
        setData(jsonData);
        if (type === 'EIPs' && jsonData.eip) {
          setTypeData(
            jsonData.eip.filter((item: APIResponse) =>
              item.eips.some(
                (eipGroup: EIPGroup) =>
                  eipGroup.category !== getCat('ERC') &&
                  eipGroup.category !== 'ERCs'
              )
            )
          );
        } else if (type === 'ERCs' && jsonData.erc) {
          setTypeData(jsonData.erc);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [dataset, type]);

  useEffect(() => {
    if (type === 'EIPs') {
      setTypeData(data?.eip || []);
    } else if (type === 'ERCs') {
      setTypeData(data?.erc || []);
    }
  }, [type, data?.eip, data?.erc]);

  const statusData = typeData.filter(
    (item) => item.status === getStatus(status)
  );
  const yearData = statusData
    .flatMap((item) => item.eips)
    .filter((item) => item.year === selectedYear);

  const result: { [key: string]: number } = {};

  yearData
    .filter((item) => item.category !== 'ERC')
    .forEach((item) => {
      item.eips.forEach((item) => {
        if (
          (item.type === 'Standards Track' ||
            item.type === 'Standard Track' ||
            item.type == 'Standard' ||
            item.type == 'Core' ||
            item.type == 'Process' ||
            item.type ==
              'Standards Track (Core, Networking, Interface, ERC)') &&
          item.status === getStatus(status)
        ) {
          if (item.category === 'Core') {
            result['Standard - Core'] = (result['Standard - Core'] || 0) + 1;
          }
          //  else if (item.category === "ERC") {
          //   result["Standard - ERC"] = (result["Standard - ERC"] || 0) + 1;
          // }
          else if (item.category === 'Networking') {
            result['Standard - Networking'] =
              (result['Standard - Networking'] || 0) + 1;
          } else if (item.category === 'Interface') {
            result['Standard - Interface'] =
              (result['Standard - Interface'] || 0) + 1;
          } else {
            result['Standard - Core'] = (result['Standard - Core'] || 0) + 1;
          }
        } else if (item.type === 'Meta' && item.status === getStatus(status)) {
          result['Meta'] = (result['Meta'] || 0) + 1;
        } else if (
          item.type === 'Informational' &&
          item.status === getStatus(status)
        ) {
          result['Informational'] = (result['Informational'] || 0) + 1;
        }
      });
    });

  const convertAndDownloadCSV = () => {
    if (yearData && yearData.length > 0) {
      // Define the columns you want to drop
      const columnsToDrop = [
        '_id',
        'fromStatus',
        'toStatus',
        // "changeDate",
        // "type",
        // "discussion",
        'requires',
        'changedDay',
        'changedMonth',
        'changedYear',
        'createdMonth',
        'deadline',
        'createdYear',
        '__v',
      ];

      // Create CSV headers
      const headers =
        Object.keys(yearData[0].eips[0])
          .filter((column) => !columnsToDrop.includes(column))
          .join(',') + '\n';

      // Convert data to CSV rows
      const csvRows = yearData.map((item) => {
        const values = item.eips.map((eip) => {
          // Filter out the columns you want to drop
          const filteredValues = Object.values(eip)
            .filter(
              (value, index) => !columnsToDrop.includes(Object.keys(eip)[index])
            )
            .map((value) => {
              // Ensure values with commas are enclosed in double quotes
              if (typeof value === 'string' && value.includes(',')) {
                return `"${value}"`;
              }
              return value;
            });

          return filteredValues.join(',');
        });

        return values.join('\n');
      });

      // Combine headers and rows
      const csvContent = headers + csvRows.join('\n');

      // Trigger CSV download
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';

      a.download = `${status}_${selectedYear}.csv`;

      document.body.appendChild(a);
      a.href = url;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  const rows = [];
  const standardTrackKeys = [];

  let total = 0;
  for (const key in result) {
    total = total + result[key];
  }
  for (const key in result) {
    const percentage = ((result[key] * 100) / total).toFixed(2);
    if (key.startsWith('Standard')) {
      standardTrackKeys.push(key);
    } else {
      rows.push(
        <TableRow key={key}>
          <TableCell>
            <Badge variant="glass-purple">{key}</Badge>
          </TableCell>
          <TableCell>{result[key]}</TableCell>
          <TableCell
            style={{
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
              minWidth: '150px',
            }}
            className={'ml-10 text-purple-400'}
          >
            {percentage}%
          </TableCell>
        </TableRow>
      );
    }
  }

  standardTrackKeys.sort();

  for (const key of standardTrackKeys) {
    const percentage = ((result[key] * 100) / total).toFixed(2);
    rows.unshift(
      <TableRow key={key}>
        <TableCell>
          <Badge variant={'glass-orange'}>{key}</Badge>
        </TableCell>
        <TableCell className={'ml-20 text-purple-400'}>{result[key]}</TableCell>
        <TableCell className={'ml-10 text-purple-400'}>{percentage}%</TableCell>
      </TableRow>
    );
  }

  const currentYear = new Date().getFullYear();
  const years = Array.from(
    new Array(currentYear - 2014),
    (val, index) => index + 2015
  ).reverse();
  const handleYearChange = (year: number) => {
    setSelectedYear(year);
  };

  const handleDownload = async () => {
    try {
      convertAndDownloadCSV();
      await axios.post('/api/DownloadCounter');
    } catch (error) {
      console.error('Error triggering download counter:', error);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{
          borderColor: '#D6BCFA',
          boxShadow: '0px 4px 15px rgba(159, 122, 234, 0.5)',
        }}
        transition={{ duration: 0.3 }}
        className="p-6 rounded-lg bg-[#1a1325] border border-[#6b46c1] hover:border-[#9f7aea] cursor-pointer"
      >
        {isLoading ? ( // Show loader while data is loading
          <SpokeSpinner />
        ) : (
          <>
            <div className={'flex w-full gap-10'}>
              <Select
                value={selectedYear.toString()}
                onValueChange={(value) => handleYearChange(parseInt(value))}
              >
                <SelectTrigger className="w-[180px] border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-purple-500">
                  <SelectValue placeholder="Select Option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {years.map((year) => (
                      <SelectItem value={year.toString()} key={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <button
                onClick={handleDownload}
                className="shadow-[0_4px_14px_0_rgb(107,70,193,39%)] hover:shadow-[0_6px_20px_rgba(107,70,193,23%)] hover:bg-[rgba(107,70,193,0.9)] px-6 py-1 text-xs bg-[#6b46c1] rounded-md text-white font-light transition duration-200 ease-linear"
              >
                Download Reports
              </button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type - Category</TableHead>
                  <TableHead>Numbers</TableHead>
                  <TableHead>Percentage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>{rows}</TableBody>
            </Table>

            <div className="flex justify-center w-full text-center">
              <p className="text-xl font-bold text-[#8c3bd8] mr-6 break-words">
                Total: {total}
              </p>
            </div>

            <div className="w-full mt-4">
              <DateTime />
            </div>
          </>
        )}
      </motion.div>
    </>
  );
};

export default CBoxStatus;
