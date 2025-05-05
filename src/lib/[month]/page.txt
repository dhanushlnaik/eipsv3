import React, { useEffect, useState, useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
// import { motion } from "framer-motion";
// import NextLink from "next/link";
import { useRouter } from "next/navigation";
// import CopyLink from "@/components/CopyLink";
// import Loader from "@/components/ui/Loader2";
// import { ChevronDownCircle, ChevronUpCircle } from "lucide-react";


// interface StatusChange {
//   _id: string;
//   count: number;
//   statusChanges: {
//     [key: string]: string | number | boolean | null | undefined;
//     _id: string;
//     eip: string;
//     fromStatus: string;
//     toStatus: string;
//     title: string;
//     status: string;
//     author: string;
//     created: string;
//     changeDate: string;
//     type: string;
//     category: string;
//     discussion: string;
//     deadline: string;
//     requires: string;
//     pr: number;
//     changedDay: number;
//     changedMonth: number;
//     changedYear: number;
//     createdMonth: number;
//     createdYear: number;
//     __v: number;
//     repo: string;
//   }[];
// }

// interface APIData {
//   erc: StatusChange[];
//   eip: StatusChange[];
//   rip: StatusChange[];
// }

interface EIP {
  status: string;
  eips: {
    status: string;
    month: number;
    year: number;
    date: string;
    count: number;
    category: string;
    repo:string;
    eips: {
      id: string;
      title: string;
      description: string;
      author: string;
      createdDate: string;
      status: string;
    }[];
  }[];
}

// function getMonthName(monthNumber: number): string {
//   const date = new Date();
//   date.setMonth(monthNumber - 1);
//   return date.toLocaleString("default", { month: "long" });
// }

const MonthPage = () => {  
  const [data, setData] = useState<EIP[]>([]);
  const path = usePathname();

  // const [showDropdown, setShowDropdown] = useState(false);
  // const toggleDropdown = () => setShowDropdown((prev) => !prev);
  
  // const [show, setShow] = useState(false);

  // const toggleCollapse = () => setShow(!show);

  // let year = "";
  // let month = "";

  if (path) {
    const pathParts = path.split("/");
    console.log("path parts:", pathParts);
    // year = pathParts[2];
    // month = pathParts[3];
  }

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/new/graphsv2`);
        const jsonData = await response.json();
        setData(jsonData.eip.concat(jsonData.erc.concat(jsonData.rip)));
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // const filteredData1 = data.filter((item) => item.status === "Draft");
  // const filteredData2 = data.filter((item) => item.status === "Review");
  const filteredData3 = data.filter((item) => item.status === "Last Call");
  // const filteredData4 = data.filter((item) => item.status === "Living");
  // const filteredData5 = data.filter((item) => item.status === "Final");
  // const filteredData6 = data.filter((item) => item.status === "Stagnant");
  // const filteredData7 = data.filter((item) => item.status === "Withdrawn");
  
  console.log("meta data:",filteredData3)

  // const prevMonth = Number(month) - 1;
  // const prevMonthName = getMonthName(prevMonth);

  const router = useRouter();

  const scrollToHash = () => {
    const hash = window.location.hash;
    if (hash) {
      const element = document.getElementById(hash.slice(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  useEffect(() => {
    if (!isLoading) {
      scrollToHash();
    }
  }, [isLoading]);

  useLayoutEffect(() => {
    router.events.on("routeChangeComplete", scrollToHash);
    return () => {
      router.events.off("routeChangeComplete", scrollToHash);
    };
  }, [router]);

  return (
    <>
    </>
  );
};

export default MonthPage;