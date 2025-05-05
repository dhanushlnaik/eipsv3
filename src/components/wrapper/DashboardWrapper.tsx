'use client';
import { useEffect, useState } from 'react';
import Dashboard from '../Dashboard';
import Loader from '../ui/Loader';

interface EIP {
  _id: string;
  eip: string;
  author: string;
  category: string;
  created: string;
  deadline?: string;
  discussion?: string;
  requires?: string;
  status: string;
  title: string;
  type: string;
  unique_ID: number;
  repo: string;
}

export default function DashboardWrapper() {
  const [data, setData] = useState<EIP[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEIPData = async () => {
      try {
        const response = await fetch('/api/new/all');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await response.json();
        setData(result.eip || []);
      } catch (error) {
        console.error('Error fetching EIP data:', error);
        setData([]); // Fallback to an empty array in case of an error
      } finally {
        setIsLoading(false);
      }
    };

    fetchEIPData();
  }, []);

  if (isLoading) {
    return <Loader />; // You can replace this with a loader component
  }

  return <Dashboard allData={data} data={{ eip: data }} />;
}
