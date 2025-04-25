import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import Link from 'next/link';
import ReactECharts from 'echarts-for-react';

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
    case 'RIP':
      return 'RIPs';
    case 'Networking':
      return 'Networking';
    case 'Interface':
      return 'Interface';
    case 'Meta':
      return 'Meta';
    case 'Informational':
      return 'Informational';
    case 'RRC':
      return 'RRCs';
    default:
      return 'Core';
  }
};

interface EIP {
  _id: string;
  eip: string;
  title: string;
  author: string;
  status: string;
  type: string;
  category: string;
  created: Date;
  discussion: string;
  deadline: string;
  requires: string;
  repo: string;
  unique_ID: number;
  __v: number;
}

interface ChartProps {
  type: string;
}
interface TransformedData {
  category: string;
  year: number;
  value: number;
}

const EIPTypeBar: React.FC<ChartProps> = ({ type }) => {
  const [data, setData] = useState<EIP[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/new/all`);
        const jsonData = await response.json();
        if (type === 'EIP') {
          setData(jsonData.eip);
        } else if (type === 'ERC') {
          setData(jsonData.erc);
        } else if (type === 'RIP') {
          jsonData.rip.forEach((item: EIP) => {
            if (item.eip === '7859') {
              item.status = 'Draft'; // Update the status
            }
          });
          setData(jsonData.rip);
        } else if (type === 'Total') {
          setData(jsonData.eip.concat(jsonData.erc.concat(jsonData.rip)));
        } else {
          setData(jsonData.eip.concat(jsonData.erc.concat(jsonData.rip)));
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [type]);

  const transformedData = data.reduce<TransformedData[]>((acc, item) => {
    const year = new Date(item.created).getFullYear();
    const category = getCat(item.category);

    // Check if a record for the same category and year already exists
    const existingEntry = acc.find(
      (entry) => entry.year === year && entry.category === category
    );

    if (existingEntry) {
      // If it exists, increment the value
      existingEntry.value += 1;
    } else {
      // Otherwise, create a new entry
      acc.push({
        category: category,
        year: year,
        value: 1,
      });
    }

    return acc;
  }, []);

  const downloadData = () => {
    const header =
      'Repo,EIP,Title,Author,Status,Type,Category,Discussion,Created at,Deadline,Link\n';
    const csvContent =
      header +
      data
        .map(
          ({
            repo,
            eip,
            title,
            author,
            discussion,
            status,
            type,
            category,
            created,
            deadline,
          }) => {
            const url =
              repo === 'eip'
                ? `https://eipsinsight.com/eips/eip-${eip}`
                : repo === 'erc'
                  ? `https://eipsinsight.com/ercs/erc-${eip}`
                  : `https://eipsinsight.com/rips/rip-${eip}`;
            const deadlineVal = deadline || '';
            return `"${repo}","${eip}","${title.replace(/"/g, '""')}","${author.replace(/"/g, '""')}","${status.replace(/"/g, '""')}","${type.replace(/"/g, '""')}","${category.replace(/"/g, '""')}","${discussion.replace(/"/g, '""')}","${created}","${deadlineVal.replace(/"/g, '""')}","${url}"`;
          }
        )
        .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type.toLowerCase()}_data_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    axios
      .post('/api/DownloadCounter')
      .catch((err) => console.error('Error updating download count:', err));
  };
  const handleDownload = async () => {
    try {
      downloadData();
      await axios.post('/api/DownloadCounter');
    } catch (error) {
      console.error('Error triggering download counter:', error);
    }
  };

  const colors = [
    { main: 'rgba(159, 122, 234, 0.7)', stroke: '#9F7AEA' }, // Purple
    { main: 'rgba(246, 114, 128, 0.7)', stroke: '#F67280' }, // Red
    { main: 'rgba(129, 199, 132, 0.7)', stroke: '#81C784' }, // Green
    { main: 'rgba(100, 181, 246, 0.7)', stroke: '#64B5F6' }, // Blue
    { main: 'rgba(255, 213, 79, 0.7)', stroke: '#FFD54F' }, // Yellow
    { main: 'rgba(255, 138, 101, 0.7)', stroke: '#FF8A65' }, // Orange
    { main: 'rgba(77, 182, 172, 0.7)', stroke: '#4DB6AC' }, // Teal
  ];

  const yearSet = [...new Set(transformedData.map((d) => d.year))];

  const seriesMap = transformedData.reduce((acc, { category, year, value }) => {
    if (!acc.has(category)) acc.set(category, []);
    acc.get(category)?.push({ year, value });
    return acc;
  }, new Map<string, { year: number; value: number }[]>());

  const chartOption = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(30, 30, 30, 0.8)',
      borderColor: '#777',
      textStyle: {
        color: '#ffffff',
      },
    },
    legend: {
      top: 20,
      textStyle: {
        color: '#ffffff',
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    dataZoom: [
      {
        type: 'slider',
        show: true,
        height: 14, // reduce height for slimmer look
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

    xAxis: {
      type: 'category',
      boundaryGap: true,
      data: yearSet,
      axisLine: {
        lineStyle: { color: '#ffffff' },
      },
      axisLabel: {
        color: '#e2e8f0', // Tailwind gray-200
      },
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: { color: '#ffffff' },
      },
      axisLabel: {
        color: '#e2e8f0',
      },
      splitLine: {
        lineStyle: { color: '#2d3748' }, // Tailwind gray-800 for subtle lines
      },
    },
    series: Array.from(seriesMap.entries()).map(
      ([category, values], index) => ({
        name: category,
        type: 'bar',
        stack: 'total',
        emphasis: { focus: 'series' },
        itemStyle: {
          color: colors[index % colors.length].main,
          borderColor: colors[index % colors.length].stroke,
          borderWidth: 1,
        },
        data: yearSet.map((year) => {
          const entry = values.find((v) => v.year === year);
          return entry ? entry.value : 0;
        }),
      })
    ),
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        scale: 1.05,
        borderColor: '#D6BCFA',
        boxShadow: '0px 4px 15px rgba(159, 122, 234, 0.5)',
      }}
      transition={{ duration: 0.3 }}
      className="p-6 rounded-lg bg-[#1a1325] border border-[#6b46c1] hover:border-[#9f7aea] cursor-pointer"
    >
      {isLoading ? (
        <div className="flex justify-center items-center h-52">
          <div className="animate-spin border-4 border-blue-400 rounded-full w-10 h-10 border-t-transparent"></div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between w-full mb-4">
            <Link href="/status">
              <h2 className="text-xl font-bold text-[#9f7aea]">
                {`Ethereum Proposals by Year - [${data.length}]`}
              </h2>
            </Link>
            <button
              onClick={handleDownload}
              className="shadow-[0_4px_14px_0_rgb(107,70,193,39%)] hover:shadow-[0_6px_20px_rgba(107,70,193,23%)] hover:bg-[rgba(107,70,193,0.9)] px-6 py-1 text-xs bg-[#6b46c1] rounded-md text-white font-light transition duration-200 ease-linear"
            >
              Download Reports
            </button>
          </div>

          <ReactECharts
            option={chartOption}
            style={{ height: '400px', width: '100%' }}
          />
        </>
      )}
    </motion.div>
  );
};

export default EIPTypeBar;
