import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow p-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link
          to="/"
          className="font-bold text-xl text-blue-500 hover:text-blue-600"
        >
          Vi-Blog
        </Link>
        <div className="flex items-center gap-4 font-semibold ">
          <Link className="hover:text-green-600" to="/">
            Feed
          </Link>
          {user ? (
            <>
              <span className="text-sm capitalize">
                Hi, <strong>{user.name}</strong>
              </span>
              <Link to="/dashboard" className="text-blue-600">
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="text-red-500 hover:text-red-600 cursor-pointer"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link className="hover:text-blue-600" to="/login">
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
