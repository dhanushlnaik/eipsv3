import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import Link from 'next/link';
import axios from 'axios';

import { motion } from 'framer-motion';

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

const ERCStatusDonut = () => {
  const [data, setData] = useState<EIP[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/new/all`);
        const jsonData = await response.json();
        setData(jsonData.erc);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);
  const colors = [
    { main: 'rgba(159, 122, 234, 0.7)', stroke: '#9F7AEA' }, // Purple
    { main: 'rgba(246, 114, 128, 0.7)', stroke: '#F67280' }, // Red
    { main: 'rgba(129, 199, 132, 0.7)', stroke: '#81C784' }, // Green
    { main: 'rgba(100, 181, 246, 0.7)', stroke: '#64B5F6' }, // Blue
    { main: 'rgba(255, 213, 79, 0.7)', stroke: '#FFD54F' }, // Yellow
    { main: 'rgba(255, 138, 101, 0.7)', stroke: '#FF8A65' }, // Orange
    { main: 'rgba(77, 182, 172, 0.7)', stroke: '#4DB6AC' }, // Teal
  ];

  const statusData = Array.from(new Set(data.map((item) => item.status)));

  // Generate chart data based on the status values
  const statusChartData = statusData.map((status) => ({
    name: status,
    value: data.filter((item) => item.status === status).length,
  }));

  // Format the status data for the chart with colors and borders
  const formattedStatusData = statusChartData.map((item, index) => ({
    ...item,
    itemStyle: {
      color: colors[index % colors.length].main,
      borderColor: colors[index % colors.length].stroke,
      borderWidth: 3,
    },
  }));

  const statusChartOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)',
      backgroundColor: 'rgba(30, 30, 30, 0.8)',
      borderColor: '#777',
      textStyle: {
        color: '#fff',
      },
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      textStyle: {
        color: '#ffffff',
      },
    },
    series: [
      {
        name: 'EIP Status',
        type: 'pie',
        radius: ['40%', '70%'],
        data: formattedStatusData,
        label: {
          show: true,
          position: 'inside',
          formatter: '{c}',
          color: '#ffffff',
          fontSize: 12,
        },
        itemStyle: {
          color: 'transparent',
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 15,
            shadowOffsetX: 0,
            shadowColor: 'rgba(255, 255, 255, 0.6)',
          },
          label: {
            show: true,
            fontSize: '16',
            fontWeight: 'bold',
          },
        },
        labelLine: {
          show: false,
        },
      },
    ],
  };

  const downloadData = () => {
    const header =
      'Repo, EIP, Title, Author, Status, Type, Category, Discussion, Created at, Deadline, Link\n';
    const csvContent =
      header +
      data
        .map(
          ({
            repo,
            eip,
            title,
            author,
            status,
            type,
            category,
            discussion,
            created,
            deadline,
          }) => {
            const url =
              repo === 'eip'
                ? `https://eipsinsight.com/eips/eip-${eip}`
                : repo === 'erc'
                  ? `https://eipsinsight.com/ercs/erc-${eip}`
                  : `https://eipsinsight.com/rips/rip-${eip}`;
            const deadlineValue = deadline || '';
            return `"${repo}","${eip}","${title.replace(
              /"/g,
              '""'
            )}","${author.replace(/"/g, '""')}","${status.replace(
              /"/g,
              '""'
            )}","${type.replace(/"/g, '""')}","${category.replace(
              /"/g,
              '""'
            )}","${discussion.replace(/"/g, '""')}","${created.replace(
              /"/g,
              '""'
            )}","${deadlineValue.replace(/"/g, '""')}","${url}"`;
          }
        )
        .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.csv';
    a.click();
    URL.revokeObjectURL(url);
  };
  const handleDownload = async () => {
    try {
      downloadData();
      await axios.post('/api/DownloadCounter');
    } catch (error) {
      console.error('Error triggering download counter:', error);
    }
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
      <div className="flex items-center justify-between w-full mb-4">
        <Link href="/status">
          <h2 className="text-xl font-bold text-[#9f7aea]">
            {`ERC Status - [${data.length}]`}
          </h2>
        </Link>
        <button
          onClick={handleDownload}
          className="shadow-[0_4px_14px_0_rgb(107,70,193,39%)] hover:shadow-[0_6px_20px_rgba(107,70,193,23%)] hover:bg-[rgba(107,70,193,0.9)] px-6 py-1 text-xs bg-[#6b46c1] rounded-md text-white font-light transition duration-200 ease-linear"
        >
          Download Reports
        </button>
      </div>

      <ReactECharts option={statusChartOption} style={{ height: '400px' }} />
    </motion.div>
  );
};

export default ERCStatusDonut;
