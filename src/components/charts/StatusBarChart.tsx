import React from 'react';
import ReactECharts from 'echarts-for-react';

export interface StatusChange {
  eip: string;
  lastStatus: string;
  eipTitle: string;
  eipCategory: string;
}

export interface StatusChartData {
  statusChanges: StatusChange[];
  year: number;
}

export interface StatusChartProps {
  data: StatusChartData[];
  category: string;
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

const StatusBarChart: React.FC<StatusChartProps> = ({ data, category }) => {
  // Possible status categories
  const statusTypes = ['Draft', 'Last Call', 'Final', 'Review', 'Stagnant'];

  // Filter data to include only years with actual status changes
  const filteredData = data
    .map(({ statusChanges, year }) => {
      const filteredStatusChanges = statusChanges.filter(
        ({ eipCategory }) => eipCategory === category
      );
      return filteredStatusChanges.length > 0
        ? { year, statusChanges: filteredStatusChanges }
        : null;
    })
    .filter(Boolean) as StatusChartData[]; // Remove null values

  // Extract years from the filtered data
  const years = [...new Set(filteredData.map((item) => item.year))].sort();

  // Initialize dataset structure for each status
  const statusData: Record<string, number[]> = {};
  statusTypes.forEach(
    (status) => (statusData[status] = new Array(years.length).fill(0))
  );

  // Populate data into the dataset
  filteredData.forEach(({ statusChanges, year }) => {
    const yearIndex = years.indexOf(year);
    statusChanges.forEach(({ lastStatus }) => {
      const status = getStatus(lastStatus);
      if (statusData[status] !== undefined) {
        statusData[status][yearIndex] += 1;
      }
    });
  });

  // Prepare ECharts options
  const option = {
    tooltip: { trigger: 'axis' },
    legend: { data: statusTypes },
    xAxis: { type: 'category', data: years },
    yAxis: { type: 'value' },
    series: statusTypes.map((status) => ({
      name: status,
      type: 'bar',
      stack: 'total',
      data: statusData[status],
    })),
  };

  return (
    <ReactECharts
      option={option}
      style={{ width: '100%', minHeight: '350px', height: '75%' }}
    />
  );
};

export default StatusBarChart;
