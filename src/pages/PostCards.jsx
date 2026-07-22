import React from "react";
import { Link } from "react-router-dom";
import { Heart, MessageCircle, ArrowRight, User } from "lucide-react";
import { getImageUrl } from "../utils/api";

const PostCards = ({ post, index }) => {
  return (
    <Link
      to={`/post/${post._id}`}
      className="bg-stone-50 hover:bg-white flex flex-col relative border border-stone-300 rounded-lg overflow-hidden h-[450px] transition-colors duration-300 hover:shadow-lg"
    >
      {/* Post Number */}
      <span className="absolute top-4 left-4 z-10 font-mono text-xs text-white bg-black/60 px-2 py-1 rounded">
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Image */}
      {post.image && (
        <div className="h-50 overflow-hidden flex-shrink-0">
          <img
            src={getImageUrl(post.image)}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Title */}
        <h2 className="font-serif text-xl font-semibold text-stone-900 leading-snug mb-3 line-clamp-2 min-h-[56px] capitalize">
          {post.title}
        </h2>

        {/* Author */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
            <User size={16} className="text-emerald-700" />
          </div>

          <p className="font-mono text-xs text-stone-500 capitalize">
            By {post.author?.name || "Unknown"} &middot;{" "}
            {new Date(post.createdAt).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>

        {/* Excerpt */}
        <p className="text-sm text-stone-600 leading-relaxed flex-1 line-clamp-2">
          {post.body}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 mt-5 border-t border-stone-200">
          <div className="flex items-center gap-4 text-xs text-stone-500">
            <span className="flex items-center gap-1">
              <Heart size={14} />
              {post.likes?.length || 0}
            </span>
          </div>

          <span className="inline-flex items-center gap-1 text-sm font-medium text-emerald-700">
            Read more
            <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </Link>
  );
};

export default PostCards;
