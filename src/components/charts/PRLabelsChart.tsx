import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });
const availableLabels = [
  'a-review',
  'e-review',
  'e-consensus',
  'stagnant',
  'stale',
  'created-by-bot',
  'miscellaneous',
];

const EipsLabelChart = () => {
  const [chartData, setChartData] = useState([]);
  interface PRDetail {
    labels: string[];
    repo: string;
    prNumber: number;
    prTitle: string;
    created_at: string;
    closed_at?: string;
    merged_at?: string;
  }

  const [prDetails, setPrDetails] = useState<PRDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRepo, setSelectedRepo] = useState('eips');
  const [showLabels, setShowLabels] = useState(
    Object.fromEntries(availableLabels.map((label) => [label, true]))
  );
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [chartRes, prRes] = await Promise.all([
          fetch(`/api/eipslabelchart/${selectedRepo}`),
          fetch(`/api/${selectedRepo}prdetails2`),
        ]);

        const chartData = await chartRes.json();
        const prData = await prRes.json();

        setChartData(chartData);
        setPrDetails(prData);
      } catch (error) {
        console.error(error);
        toast({ title: 'Failed to fetch data', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedRepo, toast]);

  interface ShowLabels {
    [label: string]: boolean;
  }

  const toggleLabel = (label: string): void => {
    setShowLabels((prev: ShowLabels) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  console.log(toggleLabel);

  const handleDownload = () => {
    const filtered = prDetails.filter((pr) =>
      pr.labels.some((label) => showLabels[label])
    );

    if (!filtered.length) {
      toast({ title: 'No PRs match selected labels', variant: 'default' });
      return;
    }

    const headers = [
      'Repo',
      'PR Number',
      'PR Title',
      'Labels',
      'Created At',
      'Closed At',
      'Merged At',
    ];
    const csvContent = [
      headers.join(','),
      ...filtered.map((pr) =>
        [
          pr.repo,
          pr.prNumber,
          `"${pr.prTitle.replace(/"/g, '""')}"`,
          `"${pr.labels.join(', ')}"`,
          pr.created_at,
          pr.closed_at || '',
          pr.merged_at || '',
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedRepo}-pr-details.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getOption = () => {
    const data = chartData.reduce<Record<string, Record<string, number>>>(
      (acc, { monthYear, type, count }) => {
        const effectiveType = availableLabels.includes(type)
          ? type
          : 'miscellaneous';
        if (showLabels[effectiveType]) {
          if (!acc[monthYear]) acc[monthYear] = {};
          acc[monthYear][effectiveType] =
            (acc[monthYear][effectiveType] || 0) + count;
        }
        return acc;
      },
      {}
    );

    const months = Object.keys(data).sort();
    const series = availableLabels
      .filter((label) => showLabels[label])
      .map((label) => ({
        name: label,
        type: 'bar',
        stack: 'total',
        emphasis: { focus: 'series' },
        data: months.map((m) => data[m]?.[label] || 0),
      }));

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: 'rgba(30, 30, 30, 0.8)',
        borderColor: '#777',
        textStyle: {
          color: '#ffffff',
        },
      },
      legend: { textStyle: { color: '#a0aec0' } },
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
      xAxis: {
        type: 'category',
        data: months,
        axisLabel: { color: '#e2e8f0' },
      },
      yAxis: {
        type: 'value',
        min: -300,
        max: 600,
        axisLabel: { color: '#e2e8f0' },
      },
      series,
      color: [
        '#4CC9F0', // Light cyan-blue
        '#F72585', // Vivid pink
        '#B5179E', // Deep magenta
        '#7209B7', // Dark purple
        '#3A0CA3', // Indigo
        '#4361EE', // Medium blue
        '#4895EF', // Sky blue
        '#00F5D4', // Aqua green
        '#90E0EF', // Soft cyan
        '#F9C74F', // Muted yellow
      ],
    };
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
      {loading ? (
        <div className="flex justify-center items-center h-52">
          <div className="animate-spin border-4 border-purple-400 rounded-full w-10 h-10 border-t-transparent"></div>
        </div>
      ) : (
        <>
          <h2 className="text-xl font-semibold">EIPs Label Distribution</h2>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-6">
            <div className="flex items-center gap-2">
              <></>
            </div>
            <div className="flex flex-wrap gap-4">
              <Select
                onValueChange={(val) => setSelectedRepo(val)}
                value={selectedRepo}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select Repo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="eips">EIPs</SelectItem>
                  <SelectItem value="ercs">ERCs</SelectItem>
                </SelectContent>
              </Select>

              <Button variant={'purpleGlow'} onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                Download PRs
              </Button>
            </div>
          </div>

          <ReactECharts
            option={getOption()}
            style={{ height: '500px', width: '100%' }}
          />
        </>
      )}
    </motion.div>
  );
};

export default EipsLabelChart;
