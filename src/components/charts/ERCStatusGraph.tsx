import React, { useEffect, useState } from 'react';
import DateTime from '@/components/DateTime';
import { motion } from 'framer-motion';
import Link from 'next/link';
import ReactECharts from 'echarts-for-react';

const getStatus = (status: string) => {
  switch (status) {
    case 'Last Call':
      return 'LastCall';
    default:
      return status;
  }
};

interface StatusChartData {
  statusChanges: {
    eip: string;
    lastStatus: string;
    eipTitle: string;
    eipCategory: string;
  }[];
  year: number;
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
  unique_ID: number;
  __v: number;
}

const ERCStatusGraph = () => {
  const [data, setData] = useState<EIP[]>([]);
  const [graphData, setGraphData] = useState<StatusChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/new/all`);
        const jsonData = await response.json();
        setData(jsonData.erc);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/new/final-status-by-year`);
        const jsonData = await response.json();
        setGraphData(jsonData.erc);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const transformedData = graphData
    .flatMap((item) =>
      item.statusChanges.map((change) => ({
        status: getStatus(change.lastStatus),
        year: item.year,
        value: 1,
      }))
    )
    .sort((a, b) => a.year - b.year);

  const years = [...new Set(transformedData.map((item) => item.year))];
  const statuses = [...new Set(transformedData.map((item) => item.status))];

  const series = statuses.map((status, index) => ({
    name: status,
    type: 'bar',
    stack: 'total',
    emphasis: {
      focus: 'series',
    },
    itemStyle: {
      color: [
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
      ][index % 10],
    },
    data: years.map(
      (year) =>
        transformedData.filter((d) => d.status === status && d.year === year)
          .length
    ),
  }));

  const chartOptions = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(30, 30, 30, 0.8)',
      borderColor: '#777',
      textStyle: {
        color: '#ffffff',
      },
    },
    legend: {
      top: 'top',
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
      data: years,
      boundaryGap: true,
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
    series,
  };

  const handleDownloadCSV = (data: StatusChartData[]) => {
    const csvContent = [
      ['Year', 'EIP', 'Last Status', 'EIP Title', 'EIP Category', 'Link'],
      ...data.flatMap((item) =>
        item.statusChanges.map((statusChange) => [
          item.year,
          statusChange.eip,
          statusChange.lastStatus,
          statusChange.eipTitle,
          statusChange.eipCategory,
          `https://eipsinsight.com/ercs/erc-${statusChange.eip}`,
        ])
      ),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'status_chart_data.csv');
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
      {isLoading ? (
        <div className="flex justify-center items-center h-52">
          <div className="animate-spin border-4 border-purple-400 rounded-full w-10 h-10 border-t-transparent"></div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between w-full mb-4">
            <Link href="/status">
              <h2 className="text-xl font-bold text-[#9f7aea]">
                ERC (Progress Over the Years) - [{data.length}]
              </h2>
            </Link>
            <button
              onClick={() => handleDownloadCSV(graphData)}
              className="shadow-[0_4px_14px_0_rgb(107,70,193,39%)] hover:shadow-[0_6px_20px_rgba(107,70,193,23%)] hover:bg-[rgba(107,70,193,0.9)] px-6 py-1 text-xs bg-[#6b46c1] rounded-md text-white font-light transition duration-200 ease-linear"
            >
              Download Reports
            </button>
          </div>
          <ReactECharts option={chartOptions} style={{ height: '400px' }} />
        </>
      )}
      <div className="w-full mt-4">
        <DateTime />
      </div>
    </motion.div>
  );
};

export default ERCStatusGraph;
