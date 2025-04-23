import React from 'react';
import ReactECharts from 'echarts-for-react';

interface EIP {
  eip: string;
  category: string;
  status: string;
}

interface DonutChartProps {
  dataset: { eip: EIP[] };
}

const DashboardDonut2: React.FC<DonutChartProps> = ({ dataset }) => {
  const statusCounts = dataset.eip.reduce<Record<string, number>>(
    (acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    },
    {}
  );

  const totalEIPs = Object.values(statusCounts).reduce(
    (sum, count) => sum + count,
    0
  );

  const chartData = Object.entries(statusCounts).map(([name, value]) => ({
    name,
    value,
  }));

  const colors = [
    { main: 'rgba(159, 122, 234, 0.7)', stroke: '#9F7AEA' }, // Purple
    { main: 'rgba(246, 114, 128, 0.7)', stroke: '#F67280' }, // Red
    { main: 'rgba(129, 199, 132, 0.7)', stroke: '#81C784' }, // Green
    { main: 'rgba(100, 181, 246, 0.7)', stroke: '#64B5F6' }, // Blue
    { main: 'rgba(255, 213, 79, 0.7)', stroke: '#FFD54F' }, // Yellow
    { main: 'rgba(255, 138, 101, 0.7)', stroke: '#FF8A65' }, // Orange
    { main: 'rgba(77, 182, 172, 0.7)', stroke: '#4DB6AC' }, // Teal (NEW for 7th status)
  ];

  // Assign colors dynamically to each status
  const formattedData = chartData.map((item, index) => ({
    ...item,
    itemStyle: {
      color: colors[index % colors.length].main, // Transparent main color
      borderColor: colors[index % colors.length].stroke, // Solid stroke color
      borderWidth: 3, // Ensure border width is applied
    },
  }));

  const option = {
    title: {
      text: 'EIP Status',
      left: 'center',
      textStyle: {
        color: '#ffffff',
      },
    },
    tooltip: {
      trigger: 'item',
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
        name: 'Status',
        type: 'pie',
        radius: ['40%', '70%'], // Donut shape
        data: formattedData,
        label: {
          color: '#ffffff',
          fontSize: 12,
        },
        itemStyle: {
          borderRadius: 5,
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 15,
            shadowOffsetX: 0,
            shadowColor: 'rgba(255, 255, 255, 0.6)',
          },
        },
      },
      {
        name: 'Total',
        type: 'pie',
        radius: ['0%', '30%'], // Center text space
        data: [{ value: totalEIPs, name: `Total: ${totalEIPs}` }],
        label: {
          position: 'center',
          fontSize: 20,
          fontWeight: 'bold',
          color: '#ffffff',
        },
        itemStyle: {
          color: 'transparent',
        },
        emphasis: {
          label: {
            show: true,
          },
        },
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: 700 }} />;
};

export default DashboardDonut2;
