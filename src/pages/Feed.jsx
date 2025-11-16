import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../utils/api";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/posts")
      .then((res) => setPosts(res.data))
      .catch(() => toast.error("Failed to load posts"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-lg">Loading posts...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Latest Posts 📰</h1>

      {posts.length === 0 ? (
        <div className="bg-white text-center py-12 rounded-lg shadow">
          <p className="text-gray-600 text-lg">
            No posts available right now 😕
          </p>
          <p className="text-gray-500 text-sm mt-1">Check back later!</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {posts.map((p) => (
            <div
              key={p._id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
            >
              {p.image && (
                <img
                  src={`https://vi-blog-backend.onrender.com${p.image}`}
                  // src={`http://localhost:5000${p.image}`}
                  alt="Post"
                  className="w-full h-60 object-center"
                />
              )}
              <div className="p-5">
                <h2 className="text-2xl font-semibold text-gray-800">
                  {p.title}
                </h2>
                <div className="flex items-center gap-12 mt-2">
                  <p className="text-sm text-gray-500 mt-1 capitalize">
                    By {p.author?.name || "Unknown"}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Posted on :{" "}
                    {new Date(p.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <p className="mt-3 text-gray-700 leading-relaxed">
                  {p.body?.slice(0, 200)}...
                </p>
                <Link
                  to={`/post/${p._id}`}
                  className="inline-block mt-4 text-blue-600 hover:underline font-medium"
                >
                  View more →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
