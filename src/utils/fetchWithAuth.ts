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

  const defaultOptions: RequestInit = {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  };

  try {
    let response = await fetch(`${API_URL}${endpoint}`, {
      ...defaultOptions,
      ...fetchOptions,
    });

    if (response.status === 401 && !skipAuth) {
      const refreshResponse = await fetch(`${API_URL}/auth/refresh`, {
        credentials: "include",
      });

      if (refreshResponse.ok) {
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
