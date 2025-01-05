import React from "react";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "./LoadingSpinner";

interface AnimeDetailsModalProps {
  malId: number;
  isOpen: boolean;
  onClose: () => void;
}

interface AnimeDetails {
  title: string;
  synopsis: string;
  score: number;
  season: string;
  year: number;
  studios: Array<{ name: string }>;
  characters: Array<{
    character: {
      name: string;
      images: { jpg: { image_url: string } };
    };
    voice_actors: Array<{
      name: string;
      language: string;
      images: { jpg: { image_url: string } };
    }>;
  }>;
  images: {
    jpg: { large_image_url: string };
  };
}

export const AnimeDetailsModal: React.FC<AnimeDetailsModalProps> = ({
  malId,
  isOpen,
  onClose,
}) => {
  const [details, setDetails] = useState<AnimeDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnimeDetails = async () => {
      try {
        setLoading(true);
        const [animeRes, charactersRes] = await Promise.all([
          fetch(`https://api.jikan.moe/v4/anime/${malId}`),
          fetch(`https://api.jikan.moe/v4/anime/${malId}/characters`),
        ]);

        const animeData = await animeRes.json();
        const charactersData = await charactersRes.json();

        setDetails({
          ...animeData.data,
          characters: charactersData.data,
        });
      } catch (error) {
        console.error("Error fetching anime details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && malId) {
      fetchAnimeDetails();
    }
  }, [malId, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-gray-900 rounded-lg max-w-4xl w-full shadow-xl overflow-hidden">
          {loading ? (
            <div className="h-96 flex items-center justify-center">
              <LoadingSpinner />
            </div>
          ) : details ? (
            <>
              {/* Background Image */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `url(${details.images.jpg.large_image_url})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />

              {/* Content */}
              <div className="relative p-6">
                <div className="flex gap-6">
                  {/* Poster */}
                  <img
                    src={details.images.jpg.large_image_url}
                    alt={details.title}
                    className="w-48 h-72 object-cover rounded-lg shadow-lg"
                  />

                  {/* Info */}
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white mb-2">
                      {details.title}
                    </h2>
                    <div className="flex items-center gap-4 mb-4">
                      <span className="flex items-center gap-1">
                        <span className="text-yellow-500">★</span>
                        <span className="text-white">{details.score}</span>
                      </span>
                      {details.season && (
                        <span className="text-gray-300">
                          {details.season.charAt(0).toUpperCase() +
                            details.season.slice(1)}{" "}
                          {details.year}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-300 mb-4">{details.synopsis}</p>
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-white mb-2">
                        Studios
                      </h3>
                      <div className="flex gap-2">
                        {details.studios.map((studio) => (
                          <span
                            key={studio.name}
                            className="bg-gray-800 text-white px-2 py-1 rounded"
                          >
                            {studio.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Characters */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Characters & Voice Actors
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {details.characters.slice(0, 6).map((char) => (
                      <div
                        key={char.character.name}
                        className="flex items-center gap-3 bg-gray-800/50 p-2 rounded"
                      >
                        <img
                          src={char.character.images.jpg.image_url}
                          alt={char.character.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div>
                          <p className="text-white text-sm font-medium">
                            {char.character.name}
                          </p>
                          {char.voice_actors?.[0] && (
                            <p className="text-gray-400 text-xs">
                              {char.voice_actors[0].name}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white/80 hover:text-white"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </>
          ) : (
            <div className="h-96 flex items-center justify-center">
              <p className="text-white">Failed to load anime details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
