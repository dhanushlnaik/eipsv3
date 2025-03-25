import React from "react";
interface DownloadButtonProps {
  data: object[];
  category: string;
  type: string;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ data, category, type }) => {
  const handleDownload = () => {
    if (!data || data.length === 0) {
      console.warn("No data available to download.");
      return;
    }

    const fileName = `${category}_${type}_data.json`;
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
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
      className="px-2 py-1 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
    >
      Download Data
    </button>
  );
};

export default DownloadButton;
