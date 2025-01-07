import React, { useState, useRef, useCallback } from "react";
import { useDebounce } from "../hooks/useDebounce";
import { useClickOutside } from "../hooks/useClickOutside";
import { AnimeSearchResult } from "../types/anime";
import { AnimeSearchProps } from "../types/anime";
import { LoadingSpinner } from "./LoadingSpinner";

export default function AnimeSearch({ onSelect }: AnimeSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<AnimeSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const debouncedQuery = useDebounce(query, 500);

  const searchAnime = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(
          searchQuery
        )}&limit=5`
      );
      const data = await response.json();
      setResults(data.data || []);
    } catch (error) {
      console.error("Error searching anime:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setShowResults(true);
    debouncedQuery(value);
  };

  const handleSelect = (anime: AnimeSearchResult) => {
    onSelect(anime);
    setQuery("");
    setResults([]);
    setShowResults(false);
  };

  return (
    <div ref={searchRef} className="relative">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Search anime..."
        className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
      />

      {showResults && (query.length > 0 || loading) && (
        <div className="absolute w-full mt-2 bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden z-50">
          {loading && (
            <div className="p-4 text-center">
              <LoadingSpinner />
            </div>
          )}

          {!loading &&
            results.map((anime) => (
              <button
                key={anime.mal_id}
                onClick={() => handleSelect(anime)}
                className="w-full p-2 text-left hover:bg-gray-700 flex items-center gap-2 transition-colors"
              >
                <img
                  src={anime.images.jpg.image_url}
                  alt={anime.title}
                  className="w-10 h-14 object-cover rounded"
                  loading="lazy"
                />
                <div>
                  <div className="text-white">{anime.title}</div>
                  <div className="text-gray-400 text-sm">
                    Score: {anime.score || "N/A"}
                  </div>
                </div>
              </button>
            ))}

          {!loading && results.length === 0 && query.length >= 3 && (
            <div className="p-4 text-gray-400 text-center">
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
