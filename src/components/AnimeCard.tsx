import { useState, useRef, memo } from "react";
import { ImageWithFallback } from "./ImageWithFallback";
import { ImageErrorBoundary } from "./ImageErrorBoundary";
import { optimizeImageUrl } from "../utils/imageUtils";
import { AnimeItem, AnimeStatus } from "../types/anime";
import { useClickOutside } from "../hooks/useClickOutside";

interface Props {
  anime: AnimeItem;
  onStatusChange?: (status: AnimeStatus) => void;
  onDelete?: () => void;
  onClick?: () => void;
}

export const AnimeCard = memo(
  ({ anime, onStatusChange, onDelete, onClick }: Props) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const statusRef = useRef<HTMLDivElement>(null);

    useClickOutside(statusRef, () => setIsStatusOpen(false));

    const statusColors = {
      watching: "bg-blue-500",
      completed: "bg-green-500",
      plan_to_watch: "bg-yellow-500",
      dropped: "bg-red-500",
    } as const;

    const handleStatusClick = (status: AnimeStatus) => {
      onStatusChange?.(status);
      setIsStatusOpen(false);
    };

    return (
      <div
        className="bg-gray-800 rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
      >
        <div className="relative h-48 overflow-hidden">
          <ImageErrorBoundary>
            <div className="transform transition-transform duration-300 hover:scale-110">
              <ImageWithFallback
                src={optimizeImageUrl(anime.image_url, 300)}
                alt={anime.name}
                className={`w-full h-full object-cover transition-all duration-300 ${
                  isHovered ? "scale-105 brightness-110" : ""
                }`}
              />
            </div>
          </ImageErrorBoundary>
          <div
            ref={statusRef}
            className="absolute top-2 right-2 z-20"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              onClick={(e) => {
                e.stopPropagation();
                setIsStatusOpen(!isStatusOpen);
              }}
              className={`cursor-pointer ${
                statusColors[anime.status as keyof typeof statusColors]
              } text-white px-2 py-1 rounded text-sm transform transition-all duration-300 hover:scale-110 hover:shadow-lg ${
                isHovered ? "scale-105" : ""
              }`}
            >
              <div className="flex items-center gap-1">
                <span>{anime.status.replace(/_/g, " ")}</span>
                <svg
                  className={`w-3 h-3 transition-transform duration-300 ${
                    isStatusOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            {/* Status Dropdown */}
            {isStatusOpen && (
              <div className="absolute top-full right-0 mt-1 bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden">
                {Object.keys(statusColors).map((status) => (
                  <button
                    key={status}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatusClick(status as AnimeStatus);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors ${
                      anime.status === status ? "bg-gray-700" : ""
                    }`}
                  >
                    {status.replace(/_/g, " ")}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="p-3 relative">
          <h3 className="text-sm font-semibold mb-2 line-clamp-1 text-white">
            {anime.name}
          </h3>

          {/* Rating and Genre container with better spacing and truncation */}
          <div className="flex items-center justify-between space-x-2">
            <div className="flex items-center shrink-0">
              <span className="text-yellow-500 text-xs mr-1">★</span>
              <span className="text-gray-300 text-xs">
                {anime.vote_average?.toFixed(1) || "N/A"}
              </span>
            </div>
            <div className="text-xs text-gray-400 truncate">{anime.genres}</div>
          </div>

          {/* Delete button */}
          <div
            className={`absolute right-2 bottom-2 transition-all duration-300 ${
              isHovered
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-2"
            }`}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.();
              }}
              className="bg-red-500 text-white px-2 py-0.5 rounded-full text-xs hover:bg-red-600 transition-colors duration-200"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  }
);
