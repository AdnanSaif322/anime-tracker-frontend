import { API_URL } from "../config";
import { refreshAuthToken } from "./auth";

interface FetchOptions extends RequestInit {
  skipAuth?: boolean;
}

export const fetchWithAuth = async (
  endpoint: string,
  options: FetchOptions = {}
) => {
  const { skipAuth = false, ...fetchOptions } = options;

  // Always include credentials for cookie-based auth
  const defaultOptions: RequestInit = {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  };

  try {
    // First attempt
    let response = await fetch(`${API_URL}${endpoint}`, {
      ...defaultOptions,
      ...fetchOptions,
    });

    // If unauthorized and not skipping auth, try refreshing token
    if (response.status === 401 && !skipAuth) {
      const refreshed = await refreshAuthToken();

      if (refreshed) {
        // Retry request with new token
        response = await fetch(`${API_URL}${endpoint}`, {
          ...defaultOptions,
          ...fetchOptions,
        });
      }
    }

    return response;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};
