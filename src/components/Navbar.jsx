import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Bell, LogOut, LayoutDashboard, User } from "lucide-react";
import logo from "../utils/logo.svg";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-15 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold tracking-wide text-blue-600">
          <img src={logo} alt="Vi Blog" className="h-10 w-auto" />
        </Link>

        {/* Right Menu */}
        <div className="flex items-center gap-5">
          <Link
            to="/"
            className="font-medium text-gray-700 hover:text-emerald-600 transition"
          >
            Feed
          </Link>

          {user ? (
            <>
              <Link
                to="/dashboard"
                className="flex items-center gap-1 text-gray-700 hover:text-emerald-600 transition"
              >
                <LayoutDashboard size={18} />
                Dashboard
              </Link>

              <div className="flex items-center gap-3 border-l pl-4">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-semibold">
                  {user.name?.charAt(0).toUpperCase()}
                </div>

                <div className="hidden sm:block">
                  <p className="text-sm font-semibold capitalize">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500">Welcome back 👋</p>
                </div>
              </div>

              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition cursor-pointer"
              >
                <LogOut size={18} />
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="px-5 py-2 rounded-full bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
