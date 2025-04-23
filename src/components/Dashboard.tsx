import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Briefcase,
  Anchor,
  BookOpen,
  Radio,
  Link as LinkIcon,
  Clipboard,
} from 'lucide-react';
import DashboardDonut from './charts/DashboardDonutCategory';
import DashboardDonut2 from './charts/DashboardDonutStatus';
import StatBox from './StatBox';
import { slideInFromLeft, slideInFromRight } from '@/lib/utils';

interface EIP {
  eip: string;
  category: string;
  status: string;
  type?: string;
}

interface DashboardProps {
  allData: EIP[];
  data: { eip: EIP[] };
}

const Dashboard: React.FC<DashboardProps> = ({ allData, data }) => {
  return (
    <div className="p-6 z-20">
      {/* Title */}
      <section id="dashboard">
        <motion.div
          variants={slideInFromLeft(0.5)}
          className="text-[60px] text-white font-bold mt-10 text-center mb-5"
        >
          Dashboard
        </motion.div>
      </section>
      <motion.div
        variants={slideInFromRight(0.5)}
        className="cursive text-[20px] text-gray-200 mb-10 mt-5 text-center"
      >
        Welcome to the dashboard
      </motion.div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 gap-6 mt-6 md:grid-cols-4">
        {/* Meta EIPs */}
        <div className="col-span-1 md:col-span-2">
          <StatBox
            title="Meta EIPs"
            value={
              new Set(
                allData
                  .filter((item) => item.type === 'Meta')
                  .map((item) => item.eip)
              ).size
            }
            description="Meta EIPs describe changes to the EIP process, or other non-optional changes."
            icon={<Briefcase size={20} />}
            url="meta"
          />
        </div>

        <div className="col-span-1 md:col-span-2 md:row-span-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{
              scale: 1.05,
              borderColor: '#D6BCFA',
              boxShadow: '0px 4px 15px rgba(159, 122, 234, 0.5)',
            }}
            transition={{ duration: 0.3 }}
            className="p-6 rounded-lg bg-[#1a1325] border border-[#6b46c1] hover:border-[#d6bcfa] cursor-pointer transition-all duration-300"
          >
            <Link href="/all">
              <h2 className="text-xl font-bold text-[#9f7aea] mb-4">
                Category - [{allData.length}]
              </h2>
            </Link>
            <DashboardDonut2 dataset={data} />
          </motion.div>
        </div>

        <div className="col-span-1">
          <StatBox
            title="Core EIPs"
            value={
              allData.filter(
                (item) =>
                  item.type === 'Standards Track' && item.category === 'Core'
              ).length || 0
            }
            description="Core EIPs describe changes to the Ethereum protocol."
            icon={<Anchor size={20} />}
            url="core"
          />
        </div>

        <div className="col-span-1">
          <StatBox
            title="ERCs"
            value={
              new Set(
                allData
                  .filter((item) => item.category === 'ERC')
                  .map((item) => item.eip)
              ).size
            }
            description="ERCs describe application-level standards for the Ethereum ecosystem."
            icon={<BookOpen size={20} />}
            url="erc"
          />
        </div>

        {/* Networking & Interface */}
        <div className="col-span-1">
          <StatBox
            title="Networking EIPs"
            value={
              new Set(
                allData
                  .filter((item) => item.category === 'Networking')
                  .map((item) => item.eip)
              ).size
            }
            description="Networking EIPs describe changes to the Ethereum network protocol."
            icon={<Radio size={20} />}
            url="networking"
          />
        </div>

        <div className="col-span-1">
          <StatBox
            title="Interface EIPs"
            value={
              new Set(
                allData
                  .filter((item) => item.category === 'Interface')
                  .map((item) => item.eip)
              ).size
            }
            description="Interface EIPs describe changes to the Ethereum client API."
            icon={<LinkIcon size={20} />}
            url="interface"
          />
        </div>

        {/* Informational & RIPs */}
        <div className="col-span-1">
          <StatBox
            title="Informational EIPs"
            value={
              new Set(
                allData
                  .filter((item) => item.type === 'Informational')
                  .map((item) => item.eip)
              ).size
            }
            description="Informational EIPs describe other changes to the Ethereum ecosystem."
            icon={<Clipboard size={20} />}
            url="informational"
          />
        </div>

        <div className="col-span-1">
          <StatBox
            title="RIPs"
            value={
              new Set(
                allData
                  .filter((item) => item.type === 'RIPs')
                  .map((item) => item.eip)
              ).size
            }
            description="RIPs describe research and protocol upgrades."
            icon={<Clipboard size={20} />}
            url="rips"
          />
        </div>

        {/* Status Section */}
        <div className="col-span-1 md:col-span-2 md:row-span-6 z-30">
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
            <Link href="/status">
              <h2 className="text-xl font-bold text-[#9f7aea]">
                Status - [{allData.length}]
              </h2>
            </Link>
            <DashboardDonut dataset={data} />
          </motion.div>
        </div>

        <div className="col-span-1">
          <StatBox
            title="Draft"
            value={
              new Set(
                allData
                  .filter((item) => item.status === 'Draft')
                  .map((item) => item.eip)
              ).size
            }
            description="Draft EIPs are proposals still under initial consideration and open for feedback."
            icon={<Clipboard size={20} />}
            url="rips"
          />
        </div>

        <div className="col-span-1">
          <StatBox
            title="Review"
            value={
              new Set(
                allData
                  .filter((item) => item.status === 'Review')
                  .map((item) => item.eip)
              ).size
            }
            description="EIPs in the Review stage are being actively discussed and evaluated by the community."
            icon={<Clipboard size={20} />}
            url="rips"
          />
        </div>

        <div className="col-span-1">
          <StatBox
            title="Last Call"
            value={
              new Set(
                allData
                  .filter((item) => item.status === 'Last Call')
                  .map((item) => item.eip)
              ).size
            }
            description="Last Call EIPs are nearing finalization, with a short period for final community comments."
            icon={<Clipboard size={20} />}
            url="rips"
          />
        </div>

        <div className="col-span-1">
          <StatBox
            title="Final"
            value={
              new Set(
                allData
                  .filter((item) => item.status === 'Final')
                  .map((item) => item.eip)
              ).size
            }
            description="Final EIPs have been formally accepted and implemented as part of the Ethereum protocol."
            icon={<Clipboard size={20} />}
            url="rips"
          />
        </div>

        <div className="col-span-1">
          <StatBox
            title="Withdrawn"
            value={
              new Set(
                allData
                  .filter((item) => item.status === 'Withdrawn')
                  .map((item) => item.eip)
              ).size
            }
            description="Withdrawn EIPs have been removed from consideration by the author or due to lack of support."
            icon={<Clipboard size={20} />}
            url="rips"
          />
        </div>

        <div className="col-span-1">
          <StatBox
            title="Stagnant"
            value={
              new Set(
                allData
                  .filter((item) => item.status === 'Stagnant')
                  .map((item) => item.eip)
              ).size
            }
            description="Stagnant EIPs are inactive and have not progressed for a prolonged period."
            icon={<Clipboard size={20} />}
            url="rips"
          />
        </div>

        <div className="col-span-1 md:col-span-2">
          <StatBox
            title="Living"
            value={
              new Set(
                allData
                  .filter((item) => item.status === 'Living')
                  .map((item) => item.eip)
              ).size
            }
            description="Living EIPs are continuously updated and reflect evolving standards or documentation."
            icon={<Clipboard size={20} />}
            url="rips"
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
