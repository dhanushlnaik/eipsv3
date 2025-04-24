import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactEcharts from 'echarts-for-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface StatusChange {
  eip: string;
  lastStatus: string;
  eipTitle: string;
  eipCategory: string;
}

interface StatusChartData {
  year: number;
  statusChanges: StatusChange[];
}

interface AreaCProps {
  category: string;
  type: string;
}

const getStatus = (status: string): string => {
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

const getCat = (cat: string): string => {
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
      return 'ERC';
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

const categoryColors: string[] = [
  '#FF6384',
  '#FF9F40',
  '#FFCD56',
  '#4BC0C0',
  '#36A2EB',
  '#9966FF',
  '#FF63FF',
  '#32CD32',
  '#FF0000',
  '#008000',
];

const StatusChart: React.FC<AreaCProps> = ({ category, type }) => {
  const [typeData, setTypeData] = useState<StatusChartData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/new/final-status-by-year');
        const jsonData = await response.json();
        setTypeData(jsonData.eip);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const filteredData = typeData.map((item) => ({
    year: item.year,
    statusChanges: item.statusChanges.filter(
      (x) => getCat(x.eipCategory) === category
    ),
  }));

  const transformedData = filteredData.flatMap((item) =>
    item.statusChanges.map((change) => ({
      status: getStatus(change.lastStatus),
      year: item.year,
      value: 1,
    }))
  );

  const groupedByStatus: Record<string, Record<number, number>> = {};

  transformedData.forEach(({ year, status, value }) => {
    if (!groupedByStatus[status]) groupedByStatus[status] = {};
    groupedByStatus[status][year] =
      (groupedByStatus[status][year] || 0) + value;
  });

  const allYears = Array.from(
    new Set(transformedData.map((d) => d.year))
  ).sort();

  const series = Object.entries(groupedByStatus).map(([status, yearMap]) => ({
    name: status,
    type: 'bar',
    stack: 'total',
    emphasis: {
      focus: 'series',
    },
    data: allYears.map((year) => yearMap[year] || 0),
  }));

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    legend: {
      top: 'bottom',
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: allYears,
    },
    yAxis: {
      type: 'value',
    },
    series,
    color: categoryColors,
  };

  const downloadData = () => {
    const normalizedCategory = category;

    const filtered = typeData.flatMap(({ statusChanges, year }) =>
      statusChanges
        .filter(({ eipCategory }) => getCat(eipCategory) === normalizedCategory)
        .map(({ eip, lastStatus, eipTitle, eipCategory }) => ({
          eip,
          lastStatus,
          eipTitle,
          eipCategory,
          year: year.toString(),
        }))
    );

    const header = 'EIP,Last Status,EIP Title,EIP Category,Year,Link\n';

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      header +
      filtered
        .map(({ eip, lastStatus, eipTitle, eipCategory, year }) => {
          const baseUrl =
            eipCategory === 'ERC' ? 'ercs' : type === 'EIPs' ? 'eips' : 'rips';
          return `${eip},${lastStatus},${eipTitle},${eipCategory},${year},https://eipsinsight.com/${baseUrl}/${baseUrl.slice(0, -1)}-${eip}`;
        })
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'StatusChart.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
      className="p-6 rounded-lg bg-[#1a1325] border border-[#6b46c1] hover:border-[#9f7aea] cursor-pointer"
    >
      <div className="flex items-center justify-between w-full mb-4">
        <Link href="/status">
          <h2 className="text-xl font-bold text-[#9f7aea]">{category}</h2>
        </Link>
        <button
          onClick={async () => {
            try {
              downloadData();
              await axios.post('/api/DownloadCounter');
            } catch (error) {
              console.error('Error triggering download counter:', error);
            }
          }}
          className="shadow-[0_4px_14px_0_rgb(107,70,193,39%)] hover:shadow-[0_6px_20px_rgba(107,70,193,23%)] hover:bg-[rgba(107,70,193,0.9)] px-6 py-1 text-xs bg-[#6b46c1] rounded-md text-white font-light transition duration-200 ease-linear"
        >
          Download Reports
        </button>
      </div>
      <ReactEcharts
        option={option}
        style={{ height: '400px', width: '100%' }}
      />
    </motion.div>
  );
};

export default StatusChart;
