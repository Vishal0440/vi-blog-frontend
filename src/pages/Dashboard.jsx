import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Trash2, ArrowRight, FileText, AlertCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import api, { getImageUrl } from "../utils/api";

function getStoredUser() {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function Dashboard() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = getStoredUser();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (!token || !user?._id) {
      navigate("/login");
      return;
    }

    setLoading(true);
    setError(false);

    api
      .get("/posts", {
        params: { author: user._id },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        // Filter defensively in case the backend ignores the query param
        // and still returns every post.
        setPosts(res.data.filter((p) => p.author?._id === user._id));
      })
      .catch(() => {
        setError(true);
        toast.error("Failed to load posts");
      })
      .finally(() => setLoading(false));
  }, [token, user?._id, navigate]);

  const deletePost = async (id) => {
    if (!window.confirm("Delete this post?")) return;

    setDeletingId(id);

    try {
      await api.delete(`/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPosts((prev) => prev.filter((p) => p._id !== id));
      toast.success("Post deleted");
    } catch {
      toast.error("Failed to delete post");
    } finally {
      setDeletingId(null);
    }
  };

  const truncate = (text, max) =>
    text.length > max ? `${text.slice(0, max)}...` : text;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-5">
      {/* Welcome */}
      <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-lg px-6 py-5 mb-8">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-stone-900 capitalize">
            Hello, {user?.name} 👋
          </h1>

          <p className="text-sm text-stone-600">
            Manage your published articles.
          </p>
        </div>

        <Link
          to="/create"
          className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded"
        >
          <Plus size={16} />
          Write Post
        </Link>
      </div>

      {/* Heading */}
      <div className="mb-6">
        <h2 className="font-serif text-3xl font-semibold text-stone-900">
          My Posts
        </h2>

        <div className="w-10 h-1 bg-emerald-700 mt-2 rounded"></div>
      </div>

      {error ? (
        <div className="border border-red-200 bg-red-50 rounded-lg py-20 flex flex-col items-center">
          <AlertCircle size={40} className="text-red-400 mb-3" />

          <p className="text-red-600 mb-5">
            Something went wrong loading your posts.
          </p>

          <button
            onClick={() => {
              setLoading(true);
              setError(false);
              api
                .get("/posts", {
                  params: { author: user._id },
                  headers: { Authorization: `Bearer ${token}` },
                })
                .then((res) => {
                  setPosts(res.data.filter((p) => p.author?._id === user._id));
                })
                .catch(() => {
                  setError(true);
                  toast.error("Failed to load posts");
                })
                .finally(() => setLoading(false));
            }}
            className="bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2 rounded cursor-pointer"
          >
            Try again
          </button>
        </div>
      ) : posts.length === 0 ? (
        <div className="border border-stone-300 bg-stone-50 rounded-lg py-20 flex flex-col items-center">
          <FileText size={40} className="text-stone-400 mb-3" />

          <p className="text-stone-500">You haven't written any posts yet.</p>

          <Link
            to="/create"
            className="mt-5 bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2 rounded"
          >
            Create your first post
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {posts.map((post) => (
            <div
              key={post._id}
              className="bg-stone-50 border border-stone-300 rounded-lg overflow-hidden hover:bg-white hover:shadow-lg transition"
            >
              {post.image && (
                <div className="h-52 overflow-hidden">
                  <img
                    src={getImageUrl(post.image)}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="p-5">
                <h3 className="font-serif text-xl font-semibold text-stone-900 mb-2">
                  {post.title}
                </h3>

                <p className="text-xs font-mono text-stone-500 mb-4">
                  {new Date(post.createdAt).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>

                <p className="text-sm text-stone-600 leading-relaxed">
                  {truncate(post.body, 140)}
                </p>

                <div className="flex justify-between items-center mt-6 border-t border-stone-200 pt-4">
                  <button
                    onClick={() => navigate(`/post/${post._id}`)}
                    className="flex items-center gap-2 text-emerald-700 font-medium hover:underline cursor-pointer"
                  >
                    Read More
                    <ArrowRight size={15} />
                  </button>

                  <button
                    onClick={() => deletePost(post._id)}
                    disabled={deletingId === post._id}
                    className="flex items-center gap-2 text-red-500 hover:text-red-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 size={16} />
                    {deletingId === post._id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
