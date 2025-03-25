import { motion } from "framer-motion";
import Link from "next/link";
import { Briefcase, Anchor, BookOpen, Radio, Link as LinkIcon, Clipboard } from "lucide-react";
import DashboardDonut from "./charts/DashboardDonutCategory";
import DashboardDonut2 from "./charts/DashboardDonutStatus";
import StatBox from "./StatBox";
import { slideInFromLeft, slideInFromRight} from "@/lib/utils";

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
    <div className="p-6">


              <motion.div
              variants={slideInFromLeft(0.5)}
              className='text-[60px] text-white font-bold mt-[10px] text-center mb-[5px]'
              >
                  Dashboard
              </motion.div>
              <motion.div
              variants={slideInFromRight(0.5)}
              className='cursive text-[20px] text-gray-200 mb-10 mt-[5px] text-center'
              >
                 Welcome to the dashboard
              </motion.div>

      <div className="grid grid-cols-2 gap-6 mt-6">
        <div className="col-span-2">
          <StatBox
            title="Meta EIPs"
            value={new Set(allData.filter((item) => item.type === "Meta").map((item) => item.eip)).size}
            description="Meta EIPs describe changes to the EIP process, or other non-optional changes."
            icon={<Briefcase size={20} />}
            url="meta"
          />
        </div>

        <StatBox
          title="Core EIPs"
          value={data?.eip.filter((item) => item.type === "Standards Track" && item.category === "Core").length || 0}
          description="Core EIPs describe changes to the Ethereum protocol."
          icon={<Anchor size={20} />}
          url="core"
        />

        <StatBox
          title="ERCs"
          value={new Set(allData.filter((item) => item.category === "ERC").map((item) => item.eip)).size}
          description="ERCs describe application-level standards for the Ethereum ecosystem."
          icon={<BookOpen size={20} />}
          url="erc"
        />

        <StatBox
          title="Networking EIPs"
          value={new Set(allData.filter((item) => item.category === "Networking").map((item) => item.eip)).size}
          description="Networking EIPs describe changes to the Ethereum network protocol."
          icon={<Radio size={20} />}
          url="networking"
        />

        <StatBox
          title="Interface EIPs"
          value={new Set(allData.filter((item) => item.category === "Interface").map((item) => item.eip)).size}
          description="Interface EIPs describe changes to the Ethereum client API."
          icon={<LinkIcon size={20} />}
          url="interface"
        />

        <StatBox
          title="Informational EIPs"
          value={new Set(allData.filter((item) => item.type === "Informational").map((item) => item.eip)).size}
          description="Informational EIPs describe other changes to the Ethereum ecosystem."
          icon={<Clipboard size={20} />}
          url="informational"
        />
                <StatBox
          title="RIPs"
          value={new Set(allData.filter((item) => item.type === "RIPs").map((item) => item.eip)).size}
          description="Informational EIPs describe other changes to the Ethereum ecosystem."
          icon={<Clipboard size={20} />}
          url="informational"
        />
      </div>

      <div className="grid grid-cols-2 gap-6 mt-6">
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5, delay: 0.2 }}
          className="p-6 rounded-lg bg-[#1a1325] border border-[#6b46c1] hover:border-[#9f7aea] cursor-pointer"
        >
          <Link href="/all">
            <h2 className="text-xl font-bold text-[#9f7aea] mb-4">Category - [{allData.length}]</h2>
          </Link>
          <DashboardDonut2 dataset={data} />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5, delay: 0.2 }}
          className=" p-6 rounded-lg bg-[#1a1325] border border-[#6b46c1] hover:border-[#9f7aea] cursor-pointer"
        >
          <Link href="/status">
            <h2 className="text-xl font-bold text-[#9f7aea] mb-4">Status - [{allData.length}]</h2>
          </Link>
          <DashboardDonut dataset={data} />
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;