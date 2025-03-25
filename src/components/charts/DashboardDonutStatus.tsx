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

const DashboardDonut2: React.FC<DonutChartProps> = ({ dataset }) => {
  const statusCounts = dataset.eip.reduce<Record<string, number>>((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(statusCounts).map(([name, value]) => ({
    name,
    value,
  }));

  const option = {// Dark background
    title: {
      text: "EIP Status",
      left: "center",
      textStyle: {
        color: "#ffffff", // Light-colored text
      },
    },
    tooltip: {
      trigger: "item",
      backgroundColor: "#333",
      borderColor: "#777",
      textStyle: {
        color: "#fff",
      },
    },
    legend: {
      orient: "vertical",
      left: "left",
      textStyle: {
        color: "#ffffff", // Light-colored legend text
      },
    },
    series: [
      {
        name: "Status",
        type: "pie",
        radius: "50%",
        data: chartData,
        label: {
          color: "#ffffff", // Light-colored labels
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(255, 255, 255, 0.5)",
          },
        },
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: 400 }} />;
};

export default DashboardDonut2;
