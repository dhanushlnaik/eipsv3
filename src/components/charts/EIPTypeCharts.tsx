import React from 'react';
import StatusChart from './StatusColumnChart';

const TypeGraphs = () => {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6 ">
        <div className="p-4">
          <StatusChart category="Core" type="EIPs" />
        </div>
        <div className="p-4">
          <StatusChart category="Networking" type="EIPs" />
        </div>
        <div className="p-4">
          <StatusChart category="Interface" type="EIPs" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 p-6 ">
        <div className="p-4">
          <StatusChart category="Informational" type="EIPs" />
        </div>
        <div className="p-4">
          <StatusChart category="Meta" type="EIPs" />
        </div>
      </div>
    </>
  );
};

export default TypeGraphs;
