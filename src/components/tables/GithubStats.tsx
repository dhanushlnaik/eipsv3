import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import DateTime from '@/components/DateTime';
import { Badge } from '@/components/ui/badge';
import axios from 'axios';
import Link from 'next/link';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface EIP {
  forksCount: number;
  watchlistCount: number;
  stars: number;
  openIssuesCount: number;
}

interface Props {
  type: string;
}

const GithubStats: React.FC<Props> = ({ type }) => {
  const [EIPdata, setEIPData] = useState<EIP>({
    forksCount: 0,
    watchlistCount: 0,
    stars: 0,
    openIssuesCount: 0,
  });
  const [ERCdata, setERCData] = useState<EIP>({
    forksCount: 0,
    watchlistCount: 0,
    stars: 0,
    openIssuesCount: 0,
  });
  const [RIPdata, setRIPData] = useState<EIP>({
    forksCount: 0,
    watchlistCount: 0,
    stars: 0,
    openIssuesCount: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/EIPinfo`);
        const jsonData = await response.json();
        setEIPData(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/ERCinfo`);
        const jsonData = await response.json();
        setERCData(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/RIPInfo`);
        const jsonData = await response.json();
        setRIPData(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const downloadData = () => {
    const csvContent = [
      ['Type', 'Forks Count', 'Watchlist Count', 'Stars', 'Open Issues Count'], // Headers
      type === 'EIPs'
        ? [
            'EIPs',
            EIPdata.forksCount,
            EIPdata.watchlistCount,
            EIPdata.stars,
            EIPdata.openIssuesCount,
          ]
        : type === 'ERCs'
          ? [
              'ERCs',
              ERCdata.forksCount,
              ERCdata.watchlistCount,
              ERCdata.stars,
              ERCdata.openIssuesCount,
            ]
          : [
              'RIPs',
              RIPdata.forksCount,
              RIPdata.watchlistCount,
              RIPdata.stars,
              RIPdata.openIssuesCount,
            ],
    ]
      .map((row) => row.join(','))
      .join('\n');

    // Create a Blob and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${type}_stats_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
    <>
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
            <h2 className="text-lg font-semibold text-purple-300 mb-2 tracking-wide">
              GitHub Insights – {type}
            </h2>
          </Link>
          <button
            onClick={handleDownload}
            className="shadow-[0_4px_14px_0_rgb(107,70,193,39%)] hover:shadow-[0_6px_20px_rgba(107,70,193,23%)] hover:bg-[rgba(107,70,193,0.9)] px-6 py-1 text-xs bg-[#6b46c1] rounded-md text-white font-light transition duration-200 ease-linear"
          >
            Download Reports
          </button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="">Github Stats</TableHead>
              <TableHead>Numbers</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow key={'forks'}>
              <TableCell>
                <Badge variant="glass-purple">Forks</Badge>
              </TableCell>
              <TableCell className="text-purple-400 hover:cursor-pointer font-semibold">
                {type === 'EIPs'
                  ? EIPdata.forksCount
                  : type === 'ERCs'
                    ? ERCdata.forksCount
                    : type === 'RIPs'
                      ? RIPdata.forksCount
                      : EIPdata.forksCount}
              </TableCell>
            </TableRow>
            <TableRow key={'watchlist'}>
              <TableCell>
                <Badge variant="glass-purple">Watchlist</Badge>
              </TableCell>
              <TableCell className="text-purple-400 hover:cursor-pointer font-semibold">
                {type === 'EIPs'
                  ? EIPdata.watchlistCount
                  : type === 'ERCs'
                    ? ERCdata.watchlistCount
                    : type === 'RIPs'
                      ? RIPdata.watchlistCount
                      : EIPdata.watchlistCount}
              </TableCell>
            </TableRow>
            <TableRow key={'stars'}>
              <TableCell>
                <Badge variant="glass-purple">Stars</Badge>
              </TableCell>
              <TableCell className="text-purple-400 hover:cursor-pointer font-semibold">
                {type === 'EIPs'
                  ? EIPdata.stars
                  : type === 'ERCs'
                    ? ERCdata.stars
                    : type === 'RIPs'
                      ? RIPdata.stars
                      : EIPdata.stars}
              </TableCell>
            </TableRow>
            <TableRow key={'openissues'}>
              <TableCell>
                <Badge variant="glass-purple">Open Issues & PR</Badge>
              </TableCell>
              <TableCell className="text-purple-400 hover:cursor-pointer font-semibold">
                {type === 'EIPs'
                  ? EIPdata.openIssuesCount
                  : type === 'ERCs'
                    ? ERCdata.openIssuesCount
                    : type === 'RIPs'
                      ? RIPdata.openIssuesCount
                      : EIPdata.openIssuesCount}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <div className="w-full mt-4">
          <DateTime />
        </div>
      </motion.div>
    </>
  );
};

export default GithubStats;
