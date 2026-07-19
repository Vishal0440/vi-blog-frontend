import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Heart, MessageCircle, Share2, User } from "lucide-react";

export default function PostView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [liked, setLiked] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    api
      .get(`/posts/${id}`)
      .then((res) => setPost(res.data))
      .catch(console.error);
  }, [id]);

  const toggleLike = async () => {
    if (!token) return alert("Please login first");

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
      setLiked(!liked);
    } catch (err) {
      console.log(err);
    }
  };

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
            src={`https://vi-blog-backend.onrender.com${post.image}`}
            // src={`http://localhost:5000${post.image}`}
            alt={post.title}
            className="w-full h-[300px] object-fill"
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
