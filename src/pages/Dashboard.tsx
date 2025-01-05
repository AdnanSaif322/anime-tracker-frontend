import { useEffect, useState } from "react";
import AnimeSearch from "../components/AnimeSearch";
import { AnimeCardSkeleton } from "../components/AnimeCardSkeleton";
import { AnimeItem, AnimeStatus } from "../types/anime";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { AnimeCard } from "../components/AnimeCard";
import Swal from "sweetalert2";
import { AnimeDetailsModal } from "../components/AnimeDetailsModal";
import { API_URL } from "../config";
import { logger } from "../utils/logger";

interface DecodedToken {
  email: string;
  userId: string;
  role: string;
}

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
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        logger.info("Fetching profile", { url: `${API_URL}/auth/profile` });

        const response = await fetch(`${API_URL}/auth/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
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
      const token = localStorage.getItem("token");
      if (!token) {
        setNotification({
          type: "error",
          message: "Please login to add anime",
        });
        return;
      }

      const response = await fetch(`${API_URL}/anime/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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

  const fetchAnimeList = async (pageNum?: number) => {
    try {
      const token = localStorage.getItem("token");
      logger.info("Fetching anime list", { url: `${API_URL}/anime/list` });
      logger.info("Token:", token?.substring(0, 20) + "...");

      const response = await fetch(`${API_URL}/anime/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        logger.error("Response not OK:", {
          status: response.status,
          error: errorData,
        });
        throw new Error(errorData.error || "Failed to fetch anime list");
      }

      const data = await response.json();
      logger.info("Anime list data:", data);
      setAnimeList(data);
    } catch (error) {
      logger.error("Fetch error:", error);
      setError("Failed to load anime list");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
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
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/anime/delete/${animeId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/anime/status/${animeId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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
