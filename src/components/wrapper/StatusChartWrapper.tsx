'use client';
import React, { useState, useEffect } from 'react';
import finalStatusData from '@/data/final-status.json';
import StatusBarChart from '../charts/StatusBarChart';
import DownloadButton from '../ui/DownloadButton';
import { SpokeSpinner } from '../ui/Spinner';

interface StatusChange {
  eip: string;
  lastStatus: string;
  eipTitle: string;
  eipCategory: string;
}

interface StatusChart {
  year: number;
  statusChanges: StatusChange[];
}

interface APIResponse {
  eip: StatusChart[];
  erc: StatusChart[];
  rip: StatusChart[];
}

// Hook to fetch and process final status data
const useFinalStatusData = (category: string) => {
  const [typeData, setTypeData] = useState<StatusChart[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const jsonData: APIResponse = finalStatusData;

      // Merge all categories into a unified dataset
      const combinedData = [
        ...jsonData.eip,
        ...jsonData.erc,
        ...jsonData.rip,
      ].reduce((acc: StatusChart[], curr: StatusChart) => {
        const existingYear = acc.find((item) => item.year === curr.year);
        if (existingYear) {
          existingYear.statusChanges.push(...curr.statusChanges);
        } else {
          acc.push({ year: curr.year, statusChanges: [...curr.statusChanges] });
        }
        return acc;
      }, []);

      setTypeData(combinedData);
    } catch (error) {
      console.error('Error loading JSON data:', error);
    } finally {
      setLoading(false);
    }
  }, [category]);

  return { typeData, loading };
};

interface StatusChartWrapperProps {
  category: string;
  type: string;
}

const StatusChartWrapper: React.FC<StatusChartWrapperProps> = ({
  category,
  type,
}) => {
  const { typeData, loading } = useFinalStatusData(category);

  return (
    <div className="w-full p-6 bg-white dark:bg-gray-900 shadow-lg rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          {category}
        </h2>
        <DownloadButton data={typeData} category={category} type={type} />
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
          <SpokeSpinner/>
        </div>
      ) : typeData.length > 0 ? (
        <StatusBarChart data={typeData} category={category} />
      ) : (
        <div className="text-center text-gray-500 dark:text-gray-400">
          No data available for {category}.
        </div>
      )}
    </div>
  );
};

export default StatusChartWrapper;
