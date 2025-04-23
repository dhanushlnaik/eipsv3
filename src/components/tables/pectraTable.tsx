'use client';
import { motion } from 'motion/react';
import Link from 'next/link';
import React from 'react';
import { CSmartTable } from '@coreui/react-pro';

interface EIP {
  eip: string;
  title: string;
  author: string;
  type: string; // Added the missing 'type' property
  status: string; // Added the missing 'status' property
  category: string; // Added the missing 'category' property
  discussion: string; // Added the missing 'discussion' property
}

const PectraData = [
  {
    eip: '2537',
    title: 'Precompile for BLS12-381 curve operations',
    author:
      'Alex Vlasov (@shamatar), Kelly Olson (@ineffectualproperty), Alex Stokes (@ralexstokes), Antonio Sanso (@asanso)',
    link: 'https://eipsinsight.com/eips/eip-2537',
    type: 'Standards Track',
    category: 'Core',
    discussion:
      'https://ethereum-magicians.org/t/eip2537-bls12-precompile-discussion-thread/4187',
  },
  {
    eip: '2935',
    title: 'Serve historical block hashes from state',
    author:
      'Vitalik Buterin (@vbuterin), Tomasz Stanczak (@tkstanczak), Guillaume Ballet (@gballet), Gajinder Singh (@g11tech), Tanishq Jasoria (@tanishqjasoria), Ignacio Hagopian (@jsign), Jochem Brouwer (@jochem-brouwer)',
    link: 'https://eipsinsight.com/eips/eip-2935',
    type: 'Standards Track',
    category: 'Core',
    discussion:
      'https://ethereum-magicians.org/t/eip-2935-save-historical-block-hashes-in-state/4565',
  },
  {
    eip: '6110',
    title: 'Supply validator deposits on chain',
    author:
      'Mikhail Kalinin (@mkalinin), Danny Ryan (@djrtwo), Peter Davies (@petertdavies)',
    link: 'https://eipsinsight.com/eips/eip-6110',
    type: 'Standards Track',
    category: 'Core',
    discussion:
      'https://ethereum-magicians.org/t/eip-6110-supply-validator-deposits-on-chain/12072',
  },
  {
    eip: '7002',
    title: 'Execution layer triggerable withdrawals',
    author:
      'Danny Ryan (@djrtwo), Mikhail Kalinin (@mkalinin), Ansgar Dietrichs (@adietrichs), Hsiao-Wei Wang (@hwwhww), lightclient (@lightclient)',
    link: 'https://eipsinsight.com/eips/eip-7002',
    type: 'Standards Track',
    category: 'Core',
    discussion:
      'https://ethereum-magicians.org/t/eip-7002-execution-layer-triggerable-exits/14195',
  },
  {
    eip: '7251',
    title: 'Increase the MAX_EFFECTIVE_BALANCE',
    author:
      'mike (@michaelneuder), Francesco (@fradamt), dapplion (@dapplion), Mikhail (@mkalinin), Aditya (@adiasg), Justin (@justindrake), lightclient (@lightclient)',
    link: 'https://eipsinsight.com/eips/eip-2251',
    type: 'Standards Track',
    category: 'Core',
    discussion:
      'https://ethereum-magicians.org/t/eip-7251-increase-the-max-effective-balance/15982',
  },
  {
    eip: '7549',
    title: 'Move committee index outside Attestation',
    author: 'dapplion (@dapplion)',
    link: 'https://eipsinsight.com/eips/eip-7549',
    type: 'Standards Track',
    category: 'Core',
    discussion:
      'https://ethereum-magicians.org/t/eip-7549-move-committee-index-outside-attestation/16390',
  },

  {
    eip: '7685',
    title: 'General purpose execution layer requests',
    author: 'lightclient (@lightclient)',
    link: 'https://eipsinsight.com/eips/eip-7685',
    type: 'Standards Track',
    category: 'Core',
    discussion:
      'https://ethereum-magicians.org/t/eip-7685-general-purpose-execution-layer-requests/19668',
  },
  {
    eip: '7702',
    title: 'Set EOA account code',
    author:
      'Vitalik Buterin (@vbuterin), Sam Wilson (@SamWilsn), Ansgar Dietrichs (@adietrichs), Matt Garnett (@lightclient)',
    link: 'https://eipsinsight.com/eips/eip-7702',
    type: 'Standards Track',
    category: 'Core',
    discussion:
      'https://ethereum-magicians.org/t/eip-set-eoa-account-code-for-one-transaction/19923',
  },
  {
    eip: '7691',
    title: 'Blob throughput increase',
    author:
      'Parithosh Jayanthi (@parithosh), Toni Wahrstätter (@nerolation), Sam Calder-Mason (@samcm), Andrew Davis (@savid), Ansgar Dietrichs (@adietrichs)',
    link: 'https://eipsinsight.com/eips/eip-7691',
    type: 'Standards Track',
    category: 'Core',
    discussion:
      'https://ethereum-magicians.org/t/eip-7691-blob-throughput-increase/19694',
  },
  {
    eip: '7623',
    title: 'Increase calldata cost',
    author: 'Toni Wahrstätter (@nerolation), Vitalik Buterin (@vbuterin)',
    link: 'https://eipsinsight.com/eips/eip-7623',
    type: 'Standards Track',
    category: 'Core',
    discussion:
      'https://ethereum-magicians.org/t/eip-7623-increase-calldata-cost/18647',
  },
  {
    eip: '7840',
    title: 'Add blob schedule to EL config files',
    author: 'lightclient (@lightclient)',
    link: 'https://eipsinsight.com/eips/eip-7840',
    type: 'Standards Track',
    category: 'Core',
    discussion:
      'https://ethereum-magicians.org/t/add-blob-schedule-to-execution-client-configuration-files/22182',
  },
  //   {
  //     eip: "3670",
  //     title: "EOF - Code Validation",
  //     author: "Alex Beregszaszi (@axic), Andrei Maiboroda (@gumb0), Paweł Bylica (@chfast)",
  //     link: "https://eipsinsight.com/eips/eip-3670",
  //     type:"Standards Track",
  //   category:"Core",
  //   discussion:"https://ethereum-magicians.org/t/eip-3670-eof-code-validation/6693"
  // },
  //   {
  //     eip: "4200",
  //     title: "EOF - Static relative jumps",
  //     author: "Alex Beregszaszi (@axic), Andrei Maiboroda (@gumb0), Paweł Bylica (@chfast)",
  //     link: "https://eipsinsight.com/eips/eip-4200",
  //     type:"Standards Track",
  //   category:"Core",
  //   discussion:"https://ethereum-magicians.org/t/eip-3920-static-relative-jumps/7108"
  // },
  //   {
  //     eip: "4750",
  //     title: "EOF - Functions",
  //     author: "Andrei Maiboroda (@gumb0), Alex Beregszaszi (@axic), Paweł Bylica (@chfast)",
  //     link: "https://eipsinsight.com/eips/eip-4750",
  //     type:"Standards Track",
  //   category:"Core",
  //   discussion:"https://ethereum-magicians.org/t/eip-4750-eof-functions/8195"
  // },
  //   {
  //     eip: "5450",
  //     title: "EOF - Stack Validation",
  //     author: "Andrei Maiboroda (@gumb0), Paweł Bylica (@chfast), Alex Beregszaszi (@axic), Danno Ferrin (@shemnon)",
  //     link: "https://eipsinsight.com/eips/eip-5450",
  //     type:"Standards Track",
  //   category:"Core",
  //   discussion:"https://ethereum-magicians.org/t/eip-5450-eof-stack-validation/10410"
  // },
  //   {
  //     eip: "6206",
  //     title: "EOF - JUMPF and non-returning functions",
  //     author: "Andrei Maiboroda (@gumb0), Alex Beregszaszi (@axic), Paweł Bylica (@chfast), Matt Garnett (@lightclient)",
  //     link: "https://eipsinsight.com/eips/eip-6206",
  //     type:"Standards Track",
  //   category:"Core",
  //   discussion:"https://ethereum-magicians.org/t/eip-4750-eof-functions/8195"
  // },
  //   {
  //     eip: "7069",
  //     title: "Revamped CALL instructions",
  //     author: "Alex Beregszaszi (@axic), Paweł Bylica (@chfast), Danno Ferrin (@shemnon), Andrei Maiboroda (@gumb0), Charles Cooper (@charles-cooper)",
  //     link: "https://eipsinsight.com/eips/eip-7069",
  //     type:"Standards Track",
  //   category:"Core",
  //   discussion:"https://ethereum-magicians.org/t/eip-revamped-call-instructions/14432"
  // },
  //   {
  //     eip: "7480",
  //     title: "EOF - Data section access instructions",
  //     author: "Andrei Maiboroda (@gumb0), Alex Beregszaszi (@axic), Paweł Bylica (@chfast)",
  //     link: "https://eipsinsight.com/eips/eip-7480",
  //     type:"Standards Track",
  //   category:"Core",
  //   discussion:"https://ethereum-magicians.org/t/eip-7480-eof-data-instructions/15414"
  // },
  //   {
  //     eip: "7620",
  //     title: "EOF Contract Creation",
  //     author: "Alex Beregszaszi (@axic), Paweł Bylica (@chfast), Andrei Maiboroda (@gumb0), Piotr Dobaczewski (@pdobacz)",
  //     link: "https://eipsinsight.com/eips/eip-7620",
  //     type:"Standards Track",
  //   category:"Core",
  //   discussion:"https://ethereum-magicians.org/t/eip-7620-eof-contract-creation-instructions/18625"
  // },
  //   {
  //     eip: "7698",
  //     title: "EOF - Creation transaction",
  //     author: "Piotr Dobaczewski (@pdobacz), Andrei Maiboroda (@gumb0), Paweł Bylica (@chfast), Alex Beregszaszi (@axic)",
  //     link: "https://eipsinsight.com/eips/eip-7698",
  //     type:"Standards Track",
  //   category:"Core",
  //   discussion:"https://ethereum-magicians.org/t/eip-7698-eof-creation-transaction/19784"
  // },
];

const PectraTable = () => {
  const convertAndDownloadCSV = () => {
    if (PectraData && PectraData.length > 0) {
      const headers = Object.keys(PectraData[0]).join(',') + '\n';
      const csvRows = PectraData.map((item) => {
        const values = Object.values(item).map((value) => {
          if (typeof value === 'string' && value.includes(',')) {
            return `"${value}"`;
          }
          return value;
        });
        return values.join(',');
      });

      const csvContent = headers + csvRows.join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `Pectra.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  const factorAuthor = (data: string) => {
    const list = data.split(',');
    for (let i = 0; i < list.length; i++) {
      list[i] = list[i].split(' ').join(' ');
    }
    if (list[list.length - 1][list[list.length - 1].length - 1] === 'al.') {
      list.pop();
    }
    return list;
  };

  const filteredData = PectraData; // Filter as per your need here

  return (
    <motion.div
      initial={{ opacity: 0, y: -30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 80, damping: 12 }}
      className="flex flex-col p-6 max-w-7xl mx-auto mt-6 mb-10 
    rounded-2xl shadow-2xl border border-purple-300/50 
    bg-white/30 dark:bg-gray-900/30 
    backdrop-blur-xl backdrop-saturate-150 text-gray-900 dark:text-white z-40"
    >
      <div className="flex items-center justify-between w-full mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          {`Pectra - [${filteredData.length}]`}
        </h2>
        <button
          onClick={convertAndDownloadCSV}
          className="shadow-[0_4px_14px_0_rgb(107,70,193,39%)] hover:shadow-[0_6px_20px_rgba(107,70,193,23%)] hover:bg-[rgba(107,70,193,0.9)] px-6 py-1 text-xs bg-[#6b46c1] rounded-md text-white font-light transition duration-200 ease-linear"
        >
          Download Reports
        </button>
      </div>
      <CSmartTable
        items={filteredData.sort(
          (a, b) => parseInt(a['eip']) - parseInt(b['eip'])
        )}
        activePage={1}
        clickableRows
        columnFilter
        columnSorter
        itemsPerPage={5}
        pagination
        tableProps={{
          hover: true,
          responsive: true,
          className: 'text-white text-sm',
          style: {
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
            borderRadius: '1rem',
            backdropFilter: 'blur(12px) saturate(180%)',
            WebkitBackdropFilter: 'blur(12px) saturate(180%)',
            border: '1px solid rgba(180, 100, 255, 0.2)',
            boxShadow: '0 4px 30px rgba(128, 90, 213, 0.3)',
          },
        }}
        columns={[
          'eip',
          'title',
          'author',
          'type',
          'category',
          'discussion',
        ].map((key) => ({
          key,
          label: key.charAt(0).toUpperCase() + key.slice(1),
          _style: {
            textAlign: 'center',
          },
        }))}
        scopedColumns={{
          eip: (item: EIP) => (
            <td className="text-center px-3 py-2 bg-white/5 backdrop-blur-sm rounded-md font-semibold text-purple-200">
              <Link href={`/eips/eip-${item.eip}`}>
                <span className="bg-purple-700/30 border border-purple-500/30 px-2 py-1 rounded-md shadow-md hover:scale-105 transition">
                  {item.eip}
                </span>
              </Link>
            </td>
          ),
          title: (item: EIP) => (
            <td className="px-3 py-2 bg-white/5 backdrop-blur-sm text-white">
              <Link
                href={`/eips/eip-${item.eip}`}
                className="hover:text-purple-200 transition"
              >
                {item.title}
              </Link>
            </td>
          ),
          author: (it: EIP) => (
            <td className="px-3 py-2 bg-white/5 backdrop-blur-sm text-purple-100">
              <div className="flex flex-wrap gap-1">
                {factorAuthor(it.author).map((item: string, index: number) => {
                  const raw = item[item.length - 1];
                  const t = raw.substring(1, raw.length - 1);
                  const isEmail = raw.endsWith('>');
                  return (
                    <Link
                      key={index}
                      href={isEmail ? `mailto:${t}` : `https://github.com/${t}`}
                      target="_blank"
                      className="underline underline-offset-2 hover:text-purple-300"
                    >
                      {item}
                    </Link>
                  );
                })}
              </div>
            </td>
          ),
          type: (item: EIP) => (
            <td className="text-center px-3 py-2 bg-white/5 backdrop-blur-sm text-purple-200">
              {item.type}
            </td>
          ),
          category: (item: EIP) => (
            <td className="text-center px-3 py-2 bg-white/5 backdrop-blur-sm text-purple-200">
              {item.category}
            </td>
          ),
          discussion: (item: EIP) => (
            <td className="text-center px-3 py-2 bg-white/5 backdrop-blur-sm">
              <button
                onClick={() => window.open(item.discussion, '_blank')}
                className="bg-gradient-to-r from-purple-600 via-purple-500 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-4 py-2 rounded-md shadow-lg transition-all duration-200 text-sm"
              >
                View
              </button>
            </td>
          ),
        }}
      />
    </motion.div>
  );
};

export default PectraTable;
