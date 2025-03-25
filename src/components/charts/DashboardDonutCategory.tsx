import React from "react";
import ReactECharts from "echarts-for-react";

interface EIP {
  eip: string;
  category: string;
  status: string;
}

interface DonutChartProps {
  dataset: { eip: EIP[] };
}

const DashboardDonut: React.FC<DonutChartProps> = ({ dataset }) => {
  const categoryCounts = dataset.eip.reduce<Record<string, number>>((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(categoryCounts).map(([name, value]) => ({
    name,
    value,
  }));

  const option = { // Dark background
    title: {
      text: "EIP Categories",
      left: "center",
      textStyle: {
        color: "#ffffff", // White text
      },
    },
    tooltip: {
      trigger: "item",
      backgroundColor: "#333",
      textStyle: {
        color: "#ffffff",
      },
    },
    legend: {
      orient: "vertical",
      left: "left",
      textStyle: {
        color: "#ffffff", // White legend text
      },
    },
    series: [
      {
        name: "Category",
        type: "pie",
        radius: "50%",
        data: chartData,
        label: {
          color: "#ffffff", // White labels on the chart
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(255, 255, 255, 0.5)", // Light shadow for better focus
          },
        },
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: 400 }} />;
};

export default DashboardDonut;
