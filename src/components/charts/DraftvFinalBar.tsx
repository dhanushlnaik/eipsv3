import React, { useEffect, useState } from 'react';
import DateTime from '@/components/DateTime';
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
    case 'RIP':
      return 'RIPs';
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

interface EIP {
  status: string;
  eips: {
    status: string;
    month: number;
    year: number;
    date: string;
    count: number;
    category: string;
    eips: { eip: string; category: string; month: number; year: number }[];
  }[];
}

interface AreaCProps {
  type: string;
}

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const getMonthName = (month: number) => months[month - 1];

const DraftvFinalBar: React.FC<AreaCProps> = ({ type }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<EIP[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/new/graphsv2`);
        const jsonData = await res.json();
        let selectedData: EIP[] = [];

        if (type === 'EIPs') {
          selectedData = jsonData.eip?.filter(
            (item: { category: string }) => item.category !== 'ERCs'
          );
        } else if (type === 'ERCs') {
          selectedData = jsonData.erc;
        } else {
          selectedData = jsonData.rip;
        }

        setData(selectedData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [type]);

  const removeDuplicates = (arr: { eip: string }[]) => {
    const seen = new Set();
    return arr.filter(({ eip }) => {
      if (!seen.has(eip)) {
        seen.add(eip);
        return true;
      }
      return false;
    });
  };

  const statusLabels = ['Draft', 'Final'];
  const combined = data.filter((d) => statusLabels.includes(d.status));

  const transformed = combined.flatMap((item) =>
    item.eips.map((eip) => ({
      status: item.status,
      category: getCat(eip.category),
      year: `${getMonthName(eip.month)} ${eip.year}`,
      value: removeDuplicates(eip.eips).length,
    }))
  );

  const consolidated = transformed.reduce(
    (acc, curr) => {
      const key = `${curr.status}-${curr.year}`;
      acc[key] = acc[key]
        ? { ...acc[key], value: acc[key].value + curr.value }
        : curr;
      return acc;
    },
    {} as Record<string, (typeof transformed)[number]>
  );

  const finalData = Object.values(consolidated).sort((a, b) => {
    const [aM, aY] = a.year.split(' ');
    const [bM, bY] = b.year.split(' ');
    return (
      parseInt(aY) - parseInt(bY) || months.indexOf(aM) - months.indexOf(bM)
    );
  });

  const draftData = finalData
    .filter((d) => d.status === 'Draft')
    .map((d) => d.value);
  const finalDataSeries = finalData
    .filter((d) => d.status === 'Final')
    .map((d) => d.value);
  const xData = [...new Set(finalData.map((d) => d.year))];

  const downloadData = () => {
    const exportRows = combined.flatMap((item) =>
      item.eips.flatMap((eip) => {
        const unique = removeDuplicates(eip.eips);
        return unique.map(({ eip: id }) => ({
          status: item.status,
          category: getCat(eip.category),
          year: eip.year.toString(),
          month: getMonthName(eip.month),
          eip: id,
        }));
      })
    );

    const csvHeader = 'Status,Category,Year,Month,EIP\n';
    const csvBody = exportRows
      .map((row) =>
        [row.status, row.category, row.year, row.month, row.eip].join(',')
      )
      .join('\n');

    const uri = encodeURI('data:text/csv;charset=utf-8,' + csvHeader + csvBody);
    const link = document.createElement('a');
    link.setAttribute('href', uri);
    link.setAttribute('download', `Draft_vs_Final.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
      data: ['Draft', 'Final'],
      top: 30,
      textStyle: {
        color: '#ffffff',
      },
    },
    grid: { left: '3%', right: '4%', bottom: '10%', containLabel: true },
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
      data: xData,
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
    series: [
      {
        name: 'Draft',
        type: 'bar',
        data: draftData,
        itemStyle: {
          color: colors[3].main,
          borderColor: colors[3].stroke,
          borderWidth: 1,
        },
      },
      {
        name: 'Final',
        type: 'bar',
        data: finalDataSeries,
        itemStyle: {
          color: colors[5].main,
          borderColor: colors[5].stroke,
          borderWidth: 1,
        },
      },
    ],
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
                {`Ethereum EIPs: Draft vs Final Status Breakdown (Chronological View)`}
              </h2>
            </Link>
            <button
              onClick={downloadData}
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
      <div className="w-full mt-4">
        <DateTime />
      </div>
    </motion.div>
  );
};

export default DraftvFinalBar;
