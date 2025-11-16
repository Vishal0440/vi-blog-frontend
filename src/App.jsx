import React, { Suspense } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

// Lazy loaded pages
const Feed = React.lazy(() => import("./pages/Feed"));
const Login = React.lazy(() => import("./pages/Login"));
const Signup = React.lazy(() => import("./pages/Signup"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const CreatePost = React.lazy(() => import("./pages/CreatePost"));
const PostView = React.lazy(() => import("./pages/PostView"));
const ProtectedRoute = React.lazy(() => import("./components/ProtectedRoute"));

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Suspense fallback={<div className="text-center p-5">Loading...</div>}>
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/post/:id" element={<PostView />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <CreatePost />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>

      <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>
  );
}
