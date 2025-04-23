import React, { useCallback } from 'react';
import axios from 'axios';
import ReactECharts from 'echarts-for-react';

// Define the data structure for each entry
interface UpgradeData {
  date: string;
  upgrade: string;
  count: number;
}

// Original data set
const rawData = [
  { date: '2021-12-09', upgrade: 'Arrow Glacier', eip: 'EIP-4345' },
  { date: '2021-04-15', upgrade: 'Berlin', eip: 'EIP-2565' },
  { date: '2021-04-15', upgrade: 'Berlin', eip: 'EIP-2929' },
  { date: '2021-04-15', upgrade: 'Berlin', eip: 'EIP-2718' },
  { date: '2021-04-15', upgrade: 'Berlin', eip: 'EIP-2930' },
  { date: '2017-10-16', upgrade: 'Byzantium', eip: 'EIP-100' },
  { date: '2017-10-16', upgrade: 'Byzantium', eip: 'EIP-140' },
  { date: '2017-10-16', upgrade: 'Byzantium', eip: 'EIP-196' },
  { date: '2017-10-16', upgrade: 'Byzantium', eip: 'EIP-197' },
  { date: '2017-10-16', upgrade: 'Byzantium', eip: 'EIP-198' },
  { date: '2017-10-16', upgrade: 'Byzantium', eip: 'EIP-211' },
  { date: '2017-10-16', upgrade: 'Byzantium', eip: 'EIP-214' },
  { date: '2017-10-16', upgrade: 'Byzantium', eip: 'EIP-649' },
  { date: '2017-10-16', upgrade: 'Byzantium', eip: 'EIP-658' },
  { date: '2024-03-13', upgrade: 'Dencun', eip: 'EIP-1153' },
  { date: '2024-03-13', upgrade: 'Dencun', eip: 'EIP-4788' },
  { date: '2024-03-13', upgrade: 'Dencun', eip: 'EIP-4844' },
  { date: '2024-03-13', upgrade: 'Dencun', eip: 'EIP-5656' },
  { date: '2024-03-13', upgrade: 'Dencun', eip: 'EIP-6780' },
  { date: '2024-03-13', upgrade: 'Dencun', eip: 'EIP-7044' },
  { date: '2024-03-13', upgrade: 'Dencun', eip: 'EIP-7045' },
  { date: '2024-03-13', upgrade: 'Dencun', eip: 'EIP-7514' },
  { date: '2024-03-13', upgrade: 'Dencun', eip: 'EIP-7516' },
  { date: '2019-02-28', upgrade: 'Constantinople', eip: 'EIP-145' },
  { date: '2019-02-28', upgrade: 'Constantinople', eip: 'EIP-1014' },
  { date: '2019-02-28', upgrade: 'Constantinople', eip: 'EIP-1052' },
  { date: '2019-02-28', upgrade: 'Constantinople', eip: 'EIP-1234' },
  { date: '2019-02-28', upgrade: 'Petersburg', eip: 'EIP-1283' },
  { date: '2022-06-30', upgrade: 'Gray Glacier', eip: 'EIP-5133' },
  { date: '2016-03-14', upgrade: 'Homestead', eip: 'EIP-2' },
  { date: '2016-03-14', upgrade: 'Homestead', eip: 'EIP-7' },
  { date: '2016-03-14', upgrade: 'Homestead', eip: 'EIP-8' },
  { date: '2019-12-07', upgrade: 'Istanbul', eip: 'EIP-152' },
  { date: '2019-12-07', upgrade: 'Istanbul', eip: 'EIP-1108' },
  { date: '2019-12-07', upgrade: 'Istanbul', eip: 'EIP-1344' },
  { date: '2019-12-07', upgrade: 'Istanbul', eip: 'EIP-1884' },
  { date: '2019-12-07', upgrade: 'Istanbul', eip: 'EIP-2028' },
  { date: '2019-12-07', upgrade: 'Istanbul', eip: 'EIP-2200' },
  { date: '2021-08-05', upgrade: 'London', eip: 'EIP-1559' },
  { date: '2021-08-05', upgrade: 'London', eip: 'EIP-3198' },
  { date: '2021-08-05', upgrade: 'London', eip: 'EIP-3529' },
  { date: '2021-08-05', upgrade: 'London', eip: 'EIP-3541' },
  { date: '2021-08-05', upgrade: 'London', eip: 'EIP-3554' },
  { date: '2020-01-02', upgrade: 'Muir Glacier', eip: 'EIP-2384' },
  { date: '2019-02-28', upgrade: 'Petersburg', eip: 'EIP-145' },
  { date: '2019-02-28', upgrade: 'Petersburg', eip: 'EIP-1014' },
  { date: '2019-02-28', upgrade: 'Petersburg', eip: 'EIP-1052' },
  { date: '2019-02-28', upgrade: 'Petersburg', eip: 'EIP-1234' },
  { date: '2023-04-12', upgrade: 'Shapella', eip: 'EIP-3651' },
  { date: '2023-04-12', upgrade: 'Shapella', eip: 'EIP-3855' },
  { date: '2023-04-12', upgrade: 'Shapella', eip: 'EIP-3860' },
  { date: '2023-04-12', upgrade: 'Shapella', eip: 'EIP-4895' },
  { date: '2023-04-12', upgrade: 'Shapella', eip: 'EIP-6049' },
  { date: '2016-11-22', upgrade: 'Spurious Dragon', eip: 'EIP-155' },
  { date: '2016-11-22', upgrade: 'Spurious Dragon', eip: 'EIP-160' },
  { date: '2016-11-22', upgrade: 'Spurious Dragon', eip: 'EIP-161' },
  { date: '2016-11-22', upgrade: 'Spurious Dragon', eip: 'EIP-170' },
  { date: '2016-10-18', upgrade: 'Tangerine Whistle', eip: 'EIP-150' },
  { date: '2022-09-15', upgrade: 'The Merge', eip: 'EIP-4399' },
  { date: '2022-09-15', upgrade: 'The Merge', eip: 'EIP-3675' },
  { date: '2015-09-07', upgrade: 'Frontier Thawing', eip: '' },
  { date: '2015-07-30', upgrade: 'Frontier', eip: '' },
  { date: '2021-10-21', upgrade: 'Altair', eip: '' },
];

// Transform data for charting and sort by date, ensuring TBD upgrades are last
const transformedData: UpgradeData[] = Object.values(
  rawData.reduce(
    (acc, { date, upgrade }) => {
      const key = `${date}-${upgrade}`;
      if (!acc[key]) {
        acc[key] = {
          date,
          upgrade,
          count: 0,
        };
      }
      // You can set 0 manually for some upgrades if needed
      if (['Altair', 'Frontier', 'Frontier Thawing'].includes(upgrade)) {
        acc[key].count = 0;
      } else {
        acc[key].count += 1;
      }
      return acc;
    },
    {} as Record<string, UpgradeData>
  )
).sort((a, b) => {
  if (a.date === 'TBD') return 1;
  if (b.date === 'TBD') return -1;
  return new Date(a.date).getTime() - new Date(b.date).getTime();
});

// Function to generate distinct colors
const generateDistinctColor = (index: number, total: number) => {
  const hue = (index * (360 / total)) % 360;
  const saturation = 85 - (index % 2) * 15; // Alternates between 85% and 70%
  const lightness = 60 - (index % 3) * 10; // Alternates between 60%, 50%, and 40%
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

// Map to store colors for each unique upgrade
const uniqueUpgrades = [
  ...new Set(transformedData.map((data) => data.upgrade)),
];
const colorMap = uniqueUpgrades.reduce(
  (map, upgrade, index) => {
    map[upgrade] = generateDistinctColor(index, uniqueUpgrades.length);
    return map;
  },
  {} as Record<string, string>
);

const NetworkUpgradesChart = () => {
  const downloadData = useCallback(async () => {
    const header = 'Date,Network Upgrade,EIP Link,Requires\n';

    try {
      const csvContent =
        'data:text/csv;charset=utf-8,' +
        header +
        (await Promise.all(
          rawData.map(async ({ date, upgrade, eip }) => {
            const eipNo = eip.replace('EIP-', '');
            const url = `https://raw.githubusercontent.com/ethereum/EIPs/master/EIPS/eip-${eipNo}.md`;

            try {
              const response = await fetch(url);
              if (!response.ok) throw new Error(`Failed to fetch EIP-${eipNo}`);

              const eipData = await response.text();
              const requiresMatch = eipData.match(/requires:\s*(.+)/);
              let requires = requiresMatch ? requiresMatch[1].trim() : 'None';

              // Escape requires field if it contains commas
              if (requires.includes(',')) {
                requires = `"${requires}"`;
              }

              return `${date},${upgrade},https://eipsinsight.com/eips/eip-${eipNo},${requires}`;
            } catch (error) {
              console.error(`Error fetching data for EIP-${eipNo}:`, error);
              return `${date},${upgrade},https://eipsinsight.com/eips/eip-${eipNo},"Error fetching requires"`;
            }
          })
        ).then((rows) => rows.join('\n')));

      // Trigger download
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', 'network_upgrades.csv');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error downloading data:', error);
    }
  }, []);
  // Chart configuration
  const chartOptions = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    xAxis: {
      type: 'category',
      data: transformedData.map((data) => data.date), // Ensure proper date data
      axisLabel: {
        color: '#ffffff',
      },
      axisLine: {
        lineStyle: {
          color: '#ffffff',
        },
      },
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: '#ffffff',
      },
      axisLine: {
        lineStyle: {
          color: '#ffffff',
        },
      },
    },
    series: uniqueUpgrades.map((upgrade) => ({
      name: upgrade,
      type: 'bar',
      stack: 'total',
      emphasis: {
        focus: 'series',
      },
      data: transformedData
        .filter((data) => data.upgrade === upgrade)
        .map((data) => data.count),
      itemStyle: {
        color: colorMap[upgrade],
      },
    })),
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
    <div
      className="rounded-2xl shadow-2xl border border-purple-300/50 
        bg-white/30 dark:bg-gray-900/30 
        backdrop-blur-xl backdrop-saturate-150 text-gray-900 dark:text-white"
      style={{ padding: '24px', borderRadius: '12px' }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
        }}
      >
        <h2 style={{ color: '#ffffff', margin: 0 }}>Network Upgrades</h2>
        <button
          onClick={handleDownload}
          style={{
            backgroundColor: '#6a0dad',
            color: '#ffffff',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          Download CSV
        </button>
      </div>
      <ReactECharts option={chartOptions} style={{ height: '500px' }} />
    </div>
  );
};

export default NetworkUpgradesChart;
