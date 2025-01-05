import React from "react";
import { FunnelIcon } from "@heroicons/react/24/outline";

interface FilterProps {
  onFilterChange: (filters: {
    rating: number;
    genres: string[];
    status: string;
  }) => void;
}

export const AnimeFilter: React.FC<FilterProps> = ({ onFilterChange }) => {
  const handleFilterChange = () => {
    // Implement filter logic here
    onFilterChange({ rating: 0, genres: [], status: "" });
  };

  return (
    <div className="flex items-center gap-2">
      <FunnelIcon
        className="w-6 h-6 text-white cursor-pointer"
        onClick={handleFilterChange}
      />
      {/* Add dropdowns or inputs for filters here */}
    </div>
  );
};
