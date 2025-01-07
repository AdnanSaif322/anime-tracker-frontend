import { useEffect, useState } from "react";
import AnimeSearch from "../components/AnimeSearch";
import { AnimeCardSkeleton } from "../components/AnimeCardSkeleton";
import { AnimeItem, AnimeStatus } from "../types/anime";
import { useNavigate } from "react-router-dom";
import { AnimeCard } from "../components/AnimeCard";
import Swal from "sweetalert2";
import { AnimeDetailsModal } from "../components/AnimeDetailsModal";
import { API_URL } from "../config";
import { logger } from "../utils/logger";
import { fetchWithAuth } from "../utils/fetchWithAuth";

const Dashboard = () => {
  const [animeList, setAnimeList] = useState<AnimeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string>("");
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [selectedAnimeId, setSelectedAnimeId] = useState<number | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        logger.info("Fetching profile", { url: `${API_URL}/auth/profile` });

        const response = await fetch(`${API_URL}/auth/profile`, {
          credentials: "include",
        });

        if (!response.ok) {
          logger.error("Profile fetch failed", { status: response.status });
          throw new Error("Failed to fetch profile");
        }

        const data = await response.json();
        logger.info("Profile data received", data);
        setUsername(data.username);
        await fetchAnimeList();
      } catch (error) {
        logger.error("Profile fetch error", error);
        navigate("/login");
      }
    };

    fetchProfile();
  }, [navigate]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000); // Changed from 8000 to 5000 (5 seconds)

      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleAnimeSelect = async (animeData: any) => {
    try {
      logger.info("Adding anime request", {
        url: `${API_URL}/anime/add`,
        animeData: {
          title: animeData.title,
          mal_id: animeData.mal_id,
        },
      });

      const response = await fetch(`${API_URL}/anime/add`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: animeData.title,
          image_url: animeData.images.jpg.image_url,
          vote_average: animeData.score,
          status: "completed",
          genres: animeData.genres,
          mal_id: animeData.mal_id,
        }),
      });

      const data = await response.json();
      logger.info("Anime added successfully", data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to add anime");
      }

      setNotification({
        type: "success",
        message: `${animeData.title} has been added to your list!`,
      });

      fetchAnimeList();
    } catch (error) {
      console.error("Error adding anime:", error);
      setNotification({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to add anime",
      });
    }
  };

  const fetchAnimeList = async () => {
    try {
      const response = await fetchWithAuth("/anime/list");

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch anime list");
      }

      const data = await response.json();
      setAnimeList(data);
    } catch (error) {
      logger.error("Fetch error:", error);
      setError("Failed to load anime list");
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      navigate("/");
    } catch (error) {
      logger.error("Logout error:", error);
    }
  };

  const handleDeleteAnime = async (animeId: string) => {
    const result = await Swal.fire({
      title: "Delete Anime",
      text: "Are you sure you want to delete this anime from your list?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`${API_URL}/anime/delete/${animeId}`, {
          method: "DELETE",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to delete anime");
        }

        setNotification({
          type: "success",
          message: "Anime deleted successfully!",
        });

        fetchAnimeList();
      } catch (error) {
        console.error("Error deleting anime:", error);
        setNotification({
          type: "error",
          message:
            error instanceof Error ? error.message : "Failed to delete anime",
        });
      }
    }
  };

  const handleStatusChange = async (
    animeId: string,
    newStatus: AnimeStatus
  ) => {
    // Update UI immediately
    setAnimeList((prev) =>
      prev.map((anime) =>
        anime.id === animeId ? { ...anime, status: newStatus } : anime
      )
    );

    // Then make API call
    try {
      await updateStatus(animeId, newStatus);
    } catch (error) {
      // Revert on error
      setAnimeList((prev) =>
        prev.map((anime) =>
          anime.id === animeId ? { ...anime, status: anime.status } : anime
        )
      );
    }
  };

  const updateStatus = async (animeId: string, newStatus: AnimeStatus) => {
    const response = await fetch(`${API_URL}/anime/status/${animeId}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: newStatus }),
    });

    if (!response.ok) {
      throw new Error("Failed to update status");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Notification */}
        {notification && (
          <div
            className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg transition-all duration-500 z-50 ${
              notification.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
            style={{
              maxWidth: "calc(100% - 2rem)",
              minWidth: "300px",
            }}
          >
            <div className="flex items-center justify-between">
              <p className="text-white">{notification.message}</p>
              <button
                onClick={() => setNotification(null)}
                className="ml-4 text-white/80 hover:text-white"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Header Section with Username, Logout, and Filters */}
        <div className="flex justify-between items-center mb-8">
          <div>
            {username && (
              <>
                <h1 className="text-3xl font-bold">Welcome, {username}</h1>
                <p className="text-gray-400 mt-1">to your anime list</p>
              </>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="w-64">
              <AnimeSearch onSelect={handleAnimeSelect} />
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Anime Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[...Array(12)].map((_, i) => (
              <AnimeCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {animeList.map((anime) => (
              <AnimeCard
                key={anime.id}
                anime={anime}
                onStatusChange={(newStatus) =>
                  handleStatusChange(anime.id, newStatus)
                }
                onDelete={() => handleDeleteAnime(anime.id)}
                onClick={() => {
                  setSelectedAnimeId(anime.mal_id);
                  setIsDetailsModalOpen(true);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add the modal */}
      {selectedAnimeId && (
        <AnimeDetailsModal
          malId={selectedAnimeId}
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedAnimeId(null);
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
