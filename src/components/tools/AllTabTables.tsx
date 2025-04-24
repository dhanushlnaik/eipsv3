import React, { useState, useEffect } from 'react';
import CatTable from '../tables/catTable';

interface EIP {
  _id: string;
  eip: string;
  title: string;
  author: string;
  status: string;
  type: string;
  category: string;
  created: string;
  discussion: string;
  deadline: string;
  requires: string;
  repo: string;
  unique_ID: number;
  __v: number;
}

const AllTabTables: React.FC = () => {
  const [selected, setSelected] = useState('All');
  const [data, setData] = useState<EIP[]>([]);
  const [data2, setData2] = useState<EIP[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/new/all`);
        const jsonData = await response.json();
        setData(jsonData.eip.concat(jsonData.erc).concat(jsonData.rip));
        const alldata = jsonData.eip.concat(jsonData.erc).concat(jsonData.rip);
        let filteredData = alldata.filter(
          (item: EIP) => item.category === selected
        );
        if (selected === 'All') {
          filteredData = alldata;
        }

        setData2(filteredData);
        console.log('all data:', alldata);
        console.log('filtered data:', filteredData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [selected]);

  useEffect(() => {
    let filteredData = data.filter((item: EIP) => item.category === selected);
    if (selected === 'All') {
      filteredData = data;
    }
    console.log('main data:', filteredData);

    setData2(filteredData);
  }, [selected, data]);

  //   const handleDownload = () => {
  //     // Filter data based on the selected category
  //     let filteredData;
  //     if(selected!=='RIP'){
  //     filteredData = data
  //         .filter((item) => (selected==="All"||item.category === selected))
  //         .map((item) => {
  //             const { repo, eip, title, author, discussion, status, deadline, type, category,created } = item;
  //             return { repo, eip, title, author, discussion, status, deadline, type, category,created };
  //         });
  //       }
  //     else{
  //     filteredData=data
  //     .filter((item) => item.repo === 'rip')
  //         .map((item) => {
  //             const { repo, eip, title, author, discussion, status, deadline, type, category,created } = item;
  //             return { repo, eip, title, author, discussion, status, deadline, type, category,created };
  //         });
  //     }

  //     // Check if there's any data to download
  //     if (filteredData.length === 0) {
  //         console.log("No data available for download.");
  //         return; // Exit if no data is present
  //     }

  //     // Define the CSV header
  //     const header = "Repo, EIP, Title, Author,Status, deadline, Type, Category, Discussion, Created at, Link\n";

  //     // Prepare the CSV content
  //     const csvContent = "data:text/csv;charset=utf-8,"
  //     + header
  //     + filteredData.map(({ repo, eip, title, author, discussion, status, deadline, type, category, created }) => {
  //         // Generate the correct URL based on the repo type
  //         const url = repo === "eip"
  //             ? `https://eipsinsight.com/eips/eip-${eip}`
  //             : repo === "erc"
  //             ? `https://eipsinsight.com/ercs/erc-${eip}`
  //             : `https://eipsinsight.com/rips/rip-${eip}`;

  //         // Wrap title and author in double quotes to handle commas
  //         return `"${repo}","${eip}","${title.replace(/"/g, '""')}","${author.replace(/"/g, '""')}","${status.replace(/"/g, '""')}","${deadline ? deadline.replace(/"/g, '""') : '-'}","${type.replace(/"/g, '""')}","${category.replace(/"/g, '""')}","${discussion.replace(/"/g, '""')}","${created.replace(/"/g, '""')}","${url}"`; }).join("\n");

  //     // Check the generated CSV content before download
  //     console.log("CSV Content:", csvContent);

  //     // Encode the CSV content for downloading
  //     const encodedUri = encodeURI(csvContent);
  //     const link = document.createElement("a");
  //     link.setAttribute("href", encodedUri);
  //     link.setAttribute("download", `${selected}.csv`); // Name your CSV file here
  //     document.body.appendChild(link); // Required for Firefox
  //     link.click();
  //     document.body.removeChild(link);
  // };

  const optionArr = React.useMemo(() => ['All', 'EIP', 'ERC', 'RIP'], []);

  useEffect(() => {
    // Check if a hash exists in the URL
    const hash = window.location.hash.slice(1); // Remove the '#' character
    if (hash && optionArr.includes(hash)) {
      setSelected(hash);
    }
  }, [optionArr]); // Include optionArr in the dependency array

  return (
    <>
      {/* For larger screens, show the buttons with padding */}
      <div className="space-x-6 hidden md:flex px-6">
        {optionArr.map((item, key) => {
          if (item === 'All') {
            return (
              <button
                key={key}
                className="text-white text-lg font-semibold relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-1 after:bg-purple-500 transition-all duration-300 hover:after:w-full hover:text-purple-300"
              >
                {item}
              </button>
            );
          }

          const link = `/${item.toLowerCase()}`;

          return (
            <a
              href={link}
              key={key}
              className="mr-4 text-white hover:text-purple-300 transition-all duration-300"
            >
              <button className="bg-transparent border-2 border-transparent text-white px-4 py-2 rounded-lg backdrop-blur-lg transition-all duration-300 hover:scale-105 hover:shadow-lg relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-1 after:bg-purple-500 hover:after:w-full">
                {item}
              </button>
            </a>
          );
        })}
      </div>

      {/* For smaller screens, render a dropdown with padding */}
      <div className="block md:hidden w-full max-w-md mx-auto text-center mt-4 px-6">
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="w-full bg-transparent text-white border-2 border-purple-500/40 px-4 py-3 rounded-lg backdrop-blur-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 hover:bg-purple-500/10"
        >
          {optionArr.map((item, key) => (
            <option
              value={item}
              key={key}
              className="bg-purple-500/10 text-white"
            >
              {item}
            </option>
          ))}
        </select>
      </div>

      <CatTable dataset={data2} cat={selected} status={'Living'} />
      <CatTable dataset={data2} cat={selected} status={'Final'} />
      <CatTable dataset={data2} cat={selected} status={'Last Call'} />
      <CatTable dataset={data2} cat={selected} status={'Review'} />
      <CatTable dataset={data2} cat={selected} status={'Draft'} />
      <CatTable dataset={data2} cat={selected} status={'Withdrawn'} />
      <CatTable dataset={data2} cat={selected} status={'Stagnant'} />
    </>
  );
};

export default AllTabTables;
