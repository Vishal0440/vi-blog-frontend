import React, { useEffect, useState } from "react";
import api, { getImageUrl } from "../utils/api";
import { useNavigate, useParams } from "react-router-dom";
import { AlertCircle, ArrowLeft, Heart, Share2, User } from "lucide-react";
import { toast } from "react-hot-toast";

function getStoredUser() {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function PostView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(false);
  const [liked, setLiked] = useState(false);

  const token = localStorage.getItem("token");
  const user = getStoredUser();

  useEffect(() => {
    setPost(null);
    setError(false);

    api
      .get(`/posts/${id}`)
      .then((res) => {
        setPost(res.data);
        setLiked(Boolean(user?._id && res.data.likes?.includes(user._id)));
      })
      .catch((err) => {
        console.error(err);
        setError(true);
      });
  }, [id]);

  const toggleLike = async () => {
    if (!token) return toast.error("Please login first");

    // Optimistic update so the button feels instant.
    const wasLiked = liked;
    setLiked(!wasLiked);

    try {
      await api.post(
        `/posts/${id}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const res = await api.get(`/posts/${id}`);
      setPost(res.data);
      setLiked(Boolean(user?._id && res.data.likes?.includes(user._id)));
    } catch (err) {
      console.error(err);
      setLiked(wasLiked); // roll back on failure
      toast.error("Failed to update like");
    }
  };

  if (error) {
    return (
      <div className="max-w-3xl mx-auto py-20 px-5 flex flex-col items-center text-center">
        <AlertCircle size={40} className="text-red-400 mb-3" />

        <p className="text-stone-600 mb-5">
          This post couldn't be found or failed to load.
        </p>

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2 rounded cursor-pointer"
        >
          <ArrowLeft size={16} />
          Back to Feed
        </button>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-5">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-stone-500 hover:text-emerald-700 mb-8 cursor-pointer"
      >
        <ArrowLeft size={16} />
        Back to Feed
      </button>

      {/* Title */}
      <h1 className="font-serif text-4xl font-semibold text-stone-900 mb-4 leading-tight capitalize">
        {post.title}
      </h1>

      {/* Author */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
          <User size={18} className="text-emerald-700" />
        </div>

        <p className="font-mono text-xs text-stone-500 capitalize">
          By {post.author?.name || "Unknown"} &middot;{" "}
          {new Date(post.createdAt).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      {/* Image */}
      {post.image && (
        <div className="rounded-xl overflow-hidden mb-4">
          <img
            src={getImageUrl(post.image)}
            alt={post.title}
            className="w-full h-[300px] object-cover"
          />
        </div>
      )}

      {/* Body */}
      <div className="prose prose-stone max-w-none text-lg leading-8 text-stone-700 whitespace-pre-line">
        {post.body}
      </div>

      {/* Footer */}
      <div className="flex items-center gap-4 mt-10 pt-6 border-t border-stone-300">
        <button
          onClick={toggleLike}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border transition cursor-pointer  ${
            liked
              ? "bg-emerald-50 border-emerald-300 text-emerald-700"
              : "border-stone-300 hover:border-emerald-700 hover:text-emerald-700"
          }`}
        >
          <Heart size={18} fill={liked ? "currentColor" : "none"} />
          {post.likes?.length || 0}
        </button>

        <button className="ml-auto text-stone-500 hover:text-emerald-700 cursor-pointer">
          <Share2 size={20} />
        </button>
      </div>
    </div>
  );
}
