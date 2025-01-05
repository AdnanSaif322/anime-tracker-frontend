import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import { LoadingSpinner } from "./components/LoadingSpinner";

// Lazy load pages
const Home = lazy(() => import("./pages/Home"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AuthCallback = lazy(() => import("./pages/AuthCallback"));

// Preload user data when app starts
const preloadUserData = async () => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const response = await fetch("http://localhost:3001/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      const data = await response.json();
      console.log("User data loaded:", data);
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  }
};

function App() {
  useEffect(() => {
    preloadUserData();
  }, []);

  return (
    <Router>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
