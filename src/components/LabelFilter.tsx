'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Filter } from "react-feather";

interface LabelFilterProps {
  labels: string[];
  selectedLabels: string[];
  onLabelToggle: (label: string) => void;
}

const LabelFilter: React.FC<LabelFilterProps> = ({
  labels,
  selectedLabels,
  onLabelToggle,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="glass"
          size="sm"
          className="ml-2 p-2 h-auto"
        >
          <Filter size={16} />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="max-h-[300px] overflow-y-auto bg-gray-800 text-white border border-white/20 backdrop-blur-md shadow-lg rounded-md"
        align="start"
      >
        {labels.map((label) => (
          <DropdownMenuCheckboxItem
            key={label}
            checked={selectedLabels.includes(label)}
            onCheckedChange={() => onLabelToggle(label)}
            className="hover:bg-white/10 cursor-pointer"
          >
            {label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LabelFilter;
