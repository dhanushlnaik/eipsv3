import React from 'react';

interface DownloadButtonProps {
  data: object[];
  category: string;
  type: string;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({
  data,
  category,
  type,
}) => {
  const handleDownload = () => {
    if (!data || data.length === 0) {
      console.warn('No data available to download.');
      return;
    }

    const fileName = `${category}_${type}_data.json`;
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleDownload}
      className="shadow-[0_4px_14px_0_rgb(107,70,193,39%)] hover:shadow-[0_6px_20px_rgba(107,70,193,23%)] hover:bg-[rgba(107,70,193,0.9)] px-6 py-1 text-xs bg-[#6b46c1] rounded-md text-white font-light transition duration-200 ease-linear"
    >
      Download Data
    </button>
  );
};

export default DownloadButton;
