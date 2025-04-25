import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import DateTime from '@/components/DateTime';
import { motion } from 'framer-motion';

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

interface StatusChart {
  statusChanges: {
    eip: string;
    lastStatus: string;
    eipTitle: string;
    eipCategory: string;
  }[];
  year: number;
}

interface AreaCProps {
  category: string;
  type: string;
}
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
const StackedColumnChart: React.FC<AreaCProps> = ({ category, type }) => {
  const [typeData, setTypeData] = useState<EIP[]>([]);
  const [isChartReady, setIsChartReady] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/new/final-status-by-year`);
        const jsonData = await response.json();
        console.log(type);
        console.log(jsonData.erc);

        const combinedData = [...jsonData.erc].reduce(
          (acc: StatusChart[], curr: StatusChart) => {
            const existingYear = acc.find((item) => item.year === curr.year);
            if (existingYear) {
              // Merge status changes if year already exists
              existingYear.statusChanges.push(...curr.statusChanges);
            } else {
              // Add a new entry for the year
              acc.push({
                year: curr.year,
                statusChanges: [...curr.statusChanges],
              });
            }
            return acc;
          },
          [] as StatusChart[]
        );

        if (category === 'ERC') {
          console.log('chart data', jsonData.erc);
          console.log('Combined Chart Data', combinedData);
        }

        setTypeData(combinedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [category, type]);

  const filteredData = typeData.filter((item) => item.status === status);

  interface TransformedDataItem {
    category: string;
    year: string;
    value: number;
    status: string; // Added the missing 'status' property
  }

  const transformedData: TransformedDataItem[] = filteredData
    .flatMap((item) =>
      Array.isArray(item.eip)
        ? item.eip.map(
            (eip: { category: string; year: number; count: number }) => ({
              category: getCat(eip.category),
              year: eip.year.toString(),
              value: eip.count,
              status: item.status, // Include the status property
            })
          )
        : []
    )
    .filter((item) => item.category !== 'ERCs');

  useEffect(() => {
    setIsChartReady(true);
  }, []);

  const categoryColors = [
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

  const years = [...new Set(transformedData.map((d) => d.year))].sort();

  const statusMap: Record<string, Record<string, number>> = {};

  transformedData.forEach(({ status, year }) => {
    if (!statusMap[status]) statusMap[status] = {};
    statusMap[status][year.toString()] =
      (statusMap[status][year.toString()] || 0) + 1;
  });

  const series = Object.entries(statusMap).map(([status, yearCounts], idx) => ({
    name: status,
    type: 'bar',
    stack: 'total',
    emphasis: {
      focus: 'series',
    },
    itemStyle: {
      color: categoryColors[idx % categoryColors.length],
    },
    data: years.map((year) => yearCounts[year] || 0),
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
      data: years,
    },
    yAxis: {
      type: 'value',
    },
    series,
    color: categoryColors,
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
        {isChartReady && (
          <ReactECharts
            option={option}
            style={{
              height: '400px',
              width: '100%',
            }}
          />
        )}
        <div className="w-full mt-4">
          <DateTime />
        </div>
      </motion.div>
    </>
  );
};

export default StackedColumnChart;
