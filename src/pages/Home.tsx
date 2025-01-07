import { Link } from "react-router-dom";
import { Suspense } from "react";
import { HomeSkeleton } from "../components/HomeSkeleton";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Add loading skeleton */}
      <Suspense fallback={<HomeSkeleton />}>
        {/* Main content wrapper */}
        <div className="flex-grow">
          {/* Navigation */}
          <nav className="p-4 flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-purple-400">
                📺 AnimeTracker
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors duration-200"
              >
                Login
              </Link>
            </div>
          </nav>

          <div className="max-w-6xl mx-auto px-4 py-6">
            {/* Main Title Section */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-extrabold mb-2">
                Track Your Anime Journey
                <br />
                <span className="text-purple-400">All in One Place</span>
              </h1>
              <p className="text-gray-400 text-lg">
                Join thousands of anime fans tracking their favorite shows
              </p>
            </div>

            {/* Three Column Layout */}
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              {/* First card */}
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg relative overflow-hidden flex flex-col justify-center min-h-[180px] border border-gray-700">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-sm font-bold text-purple-400">
                      #1
                    </span>
                    <h3 className="text-xl font-bold text-purple-400">
                      Anime Tracking
                    </h3>
                  </div>
                  <p className="text-gray-300">Your Ultimate Anime Manager!</p>
                </div>
              </div>

              {/* Second card */}
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center justify-center min-h-[180px] transform hover:scale-105 transition-transform duration-200 border border-gray-700">
                <h3 className="text-2xl font-bold mb-4 text-purple-400">
                  Get Started
                </h3>
                <Link
                  to="/register"
                  className="bg-purple-600 px-8 py-3 rounded-lg font-bold text-white shadow-md hover:bg-purple-700 transition-colors duration-200"
                >
                  SIGN UP NOW
                </Link>
              </div>

              {/* Third card */}
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg relative flex flex-col justify-center min-h-[180px] border border-gray-700">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2 text-purple-400">
                    Try Now!
                  </div>
                  <p className="text-gray-300">Email: demo@animetracker.com</p>
                  <p className="text-gray-300">Password: demo123!</p>
                </div>
              </div>
            </div>

            {/* Bottom Section - with reduced margin */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
              <div>
                <h2 className="text-2xl font-bold text-purple-400">
                  Track Faster.
                  <br />
                  Watch More.
                </h2>
              </div>
              <div className="text-gray-300">
                <span>TRACK AND SHARE WITH FRIENDS</span>
              </div>
            </div>
          </div>
        </div>
      </Suspense>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="text-center text-gray-400 text-sm">
            <span>©AnimeTracker. Made with 💜</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
