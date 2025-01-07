import { API_URL } from "../config";

export const refreshAuthToken = async () => {
  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    return response.ok;
  } catch (error) {
    console.error("Token refresh error:", error);
    return false;
  }
};

export const isAuthenticated = async () => {
  try {
    const response = await fetch(`${API_URL}/auth/profile`, {
      credentials: "include",
    });
    return response.ok;
  } catch {
    return false;
  }
};
