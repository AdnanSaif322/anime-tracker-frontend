import React, { useState, useRef, useCallback } from "react";
import { useAnimeCache } from "../hooks/useAnimeCache";
import { LoadingSpinner } from "./LoadingSpinner";
import { useClickOutside } from "../hooks/useClickOutside";
import { debounce } from "lodash";

interface AnimeSearchResult {
  mal_id: number;
  title: string;
  images: {
    jpg: {
      image_url: string;
    };
  };
  genres: Array<{ name: string }>;
  score: number;
}

interface AnimeSearchProps {
  onSelect: (anime: AnimeSearchResult) => void;
}

const AnimeSearch: React.FC<AnimeSearchProps> = ({ onSelect }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<AnimeSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { getFromCache, setToCache } = useAnimeCache("anime-search");
  const searchRef = useRef<HTMLDivElement>(null);

  useClickOutside(searchRef, () => {
    setIsOpen(false);
  });

  // Memoized search function
  const searchAnime = useCallback(
    async (searchQuery: string) => {
      if (searchQuery.length < 3) {
        setResults([]);
        return;
      }

      // Check cache first
      const cacheKey = `anime-search-${searchQuery}`;
      const cached = getFromCache();
      if (cached) {
        const parsedCache = JSON.parse(cached);
        if (parsedCache.key === cacheKey) {
          setResults(parsedCache.data);
          return;
        }
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(
            searchQuery
          )}&limit=5`
        );

        if (response.status === 429) {
          setError("Rate limited. Please wait a moment...");
          return;
        }

        const data = await response.json();
        setResults(data.data || []);
        const cacheData = { key: cacheKey, data: data.data };
        setToCache(JSON.stringify(cacheData));
      } catch (error) {
        console.error("Error searching anime:", error);
        setError("Failed to search anime. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [getFromCache, setToCache]
  );

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((searchQuery: string) => {
      searchAnime(searchQuery);
    }, 500), // 500ms delay
    [searchAnime]
  );

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(true);
    debouncedSearch(value);
  };

  const handleSelect = (anime: AnimeSearchResult) => {
    onSelect(anime);
    setQuery("");
    setResults([]);
    setIsOpen(false);
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

      {isOpen && (query.length > 0 || loading) && (
        <div className="absolute w-full mt-2 bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden z-50">
          {loading && (
            <div className="p-4 text-center">
              <LoadingSpinner />
            </div>
          )}

          {error && <div className="p-4 text-red-400 text-center">{error}</div>}

          {!loading &&
            !error &&
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

          {!loading && !error && results.length === 0 && query.length >= 3 && (
            <div className="p-4 text-gray-400 text-center">
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AnimeSearch;
