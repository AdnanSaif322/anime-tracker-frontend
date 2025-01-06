import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../config";
import { logger } from "../utils/logger";
import { jwtDecode } from "jwt-decode";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      logger.info("Login attempt", {
        url: `${API_URL}/auth/login`,
        email,
      });

      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      // Log all response headers
      const allHeaders: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        allHeaders[key] = value;
      });

      logger.info("Complete response headers:", allHeaders);

      const data = await response.json();
      logger.info("Login response", {
        status: response.status,
        ok: response.ok,
        headers: {
          "set-cookie": response.headers.get("set-cookie"),
          "content-type": response.headers.get("content-type"),
        },
        data: data,
      });

      if (!response.ok) {
        throw new Error(data.error || "Failed to login");
      }

      // Try to verify auth immediately
      const verifyResponse = await fetch(`${API_URL}/auth/profile`, {
        credentials: "include",
      });

      logger.info("Verify auth response:", {
        status: verifyResponse.status,
        ok: verifyResponse.ok,
      });

      if (verifyResponse.ok) {
        navigate("/dashboard");
      } else {
        throw new Error("Authentication verification failed");
      }
    } catch (error) {
      logger.error("Login error", error);
      setError(error instanceof Error ? error.message : "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <Link
        to="/"
        className="fixed top-8 left-8 text-white flex items-center gap-2 hover:text-purple-400 transition-colors"
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
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        <span className="text-lg font-semibold">Back to Home</span>
      </Link>

      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-white">
            Welcome back!
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Please sign in to your account
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-700 bg-gray-800 placeholder-gray-400 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-700 bg-gray-800 placeholder-gray-400 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Password"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200 disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </div>

          <div className="flex items-center justify-center">
            <div className="text-sm">
              <Link
                to="/register"
                className="font-medium text-purple-500 hover:text-purple-400 transition-colors duration-200"
              >
                Don't have an account? Register
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
