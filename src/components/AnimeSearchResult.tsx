import React from "react";
import { AnimeSearchResult } from "../types/anime";

interface Props {
  anime: AnimeSearchResult;
  onSelect: (anime: AnimeSearchResult) => void;
}

export const AnimeSearchResultItem: React.FC<Props> = ({ anime, onSelect }) => (
  <div
    className="flex items-center p-2 hover:bg-gray-100 cursor-pointer transition-colors duration-200"
    onClick={() => onSelect(anime)}
  >
    <img
      src={anime.images.jpg.image_url}
      alt={anime.title}
      className="w-12 h-16 object-cover mr-2 rounded"
    />
    <div className="flex-grow">
      <div className="font-semibold">{anime.title}</div>
      <div className="text-sm text-gray-600 line-clamp-1">
        {anime.genres.map((g) => g.name).join(", ")}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-yellow-500">★</span>
        <span>{anime.score || "N/A"}</span>
      </div>
    </div>
  </div>
);
