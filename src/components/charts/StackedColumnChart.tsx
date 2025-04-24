import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import DateTime from '@/components/DateTime';
import { motion } from 'framer-motion';

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

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

interface EIP2 {
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
  __v: number;
  repo: string;
}

interface EIP {
  status: string;
  eips: {
    status: string;
    month: number;
    year: number;
    date: string;
    count: number;
    category: string;
    eips: EIP2[];
  }[];
}

interface AreaCProps {
  dataset: APIResponse;
  status: string;
  type: string;
}
interface APIResponse {
  eip: EIP[];
  erc: EIP[];
  rip: EIP[];
}
const StackedColumnChart: React.FC<AreaCProps> = ({
  dataset,
  status,
  type,
}) => {
  const [typeData, setTypeData] = useState<EIP[]>([]);
  const [isChartReady, setIsChartReady] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jsonData = dataset;
        if (type === 'EIPs' && jsonData.eip) {
          setTypeData(
            jsonData.eip.filter((item: EIP) =>
              item.eips.some((eip) => eip.category !== 'ERCs')
            )
          );
        } else if (type === 'ERCs' && jsonData.erc) {
          setTypeData(jsonData.erc);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [dataset, type]);

  const filteredData = typeData.filter((item) => item.status === status);

  const transformedData = filteredData
    .flatMap((item) =>
      item.eips.map((eip) => ({
        category: getCat(eip.category),
        year: eip.year.toString(),
        value: eip.count,
      }))
    )
    .filter((item) => item.category !== 'ERCs');

  useEffect(() => {
    setIsChartReady(true);
  }, []);

  const years = [...new Set(transformedData.map((d) => d.year))];
  const categories = [...new Set(transformedData.map((d) => d.category))];

  const series = categories.map((cat) => ({
    name: cat,
    type: 'bar',
    stack: 'total',
    emphasis: {
      focus: 'series',
    },
    data: years.map(
      (yr) =>
        transformedData.find((d) => d.year === yr && d.category === cat)
          ?.value || 0
    ),
  }));

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
