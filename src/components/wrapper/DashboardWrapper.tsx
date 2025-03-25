"use client"
import Dashboard from "../Dashboard";
import mockData from "@/data/eipmock.json";

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

const data: EIP[] = mockData.eip;

export default function DashboardWrapper() {
  return <Dashboard allData={data} data={{ eip: data }} />;
}
