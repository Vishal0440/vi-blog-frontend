import React, { useEffect, useMemo, useState } from "react";
import { AlertCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../utils/api";
import PostCards from "./PostCards";

const PAGE_SIZE = 6;

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [author, setAuthor] = useState("all");
  const [page, setPage] = useState(1);

  const loadPosts = () => {
    setLoading(true);
    setError(false);

    api
      .get("/posts")
      .then((res) => setPosts(res.data))
      .catch(() => {
        setError(true);
        toast.error("Failed to load posts");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const authors = useMemo(() => {
    const seen = new Map(); // lowercase name -> display name, so "John" and "john" collapse to one entry
    posts.forEach((post) => {
      const name = post.author?.name || "Unknown";
      const key = name.toLowerCase();
      if (!seen.has(key)) seen.set(key, name);
    });
    return ["all", ...seen.values()];
  }, [posts]);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        search === "" ||
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.body.toLowerCase().includes(search.toLowerCase());

      const matchesAuthor =
        author === "all" || (post.author?.name || "Unknown") === author;

      return matchesSearch && matchesAuthor;
    });
  }, [posts, search, author]);

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / PAGE_SIZE));

  // If a filter narrows the results below the current page, snap back to
  // the last valid page instead of showing an empty grid with "3 / 1".
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  const paginatedPosts = filteredPosts.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-6">
      {/* Heading + Filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h2 className="font-serif text-3xl font-semibold">Latest Posts</h2>

          <div className="w-10 h-1 bg-emerald-700 rounded mt-2"></div>
        </div>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search posts..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="border border-stone-300 rounded-lg px-4 py-2 w-64 focus:ring-2 focus:ring-emerald-700 outline-none"
          />

          <select
            value={author}
            onChange={(e) => {
              setAuthor(e.target.value);
              setPage(1);
            }}
            className="border border-stone-300 rounded-lg px-3 py-2 capitalize"
          >
            {authors.map((a) => (
              <option key={a} value={a}>
                {a === "all" ? "All Authors" : a}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Error */}
      {error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg py-20 flex flex-col items-center">
          <AlertCircle size={40} className="text-red-400 mb-3" />

          <p className="text-red-600 mb-5">
            Something went wrong loading posts.
          </p>

          <button
            onClick={loadPosts}
            className="bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2 rounded cursor-pointer"
          >
            Try again
          </button>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="bg-stone-50 border rounded-lg py-20 text-center">
          <p className="text-stone-500">No posts found.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedPosts.map((post, index) => (
              <PostCards
                key={post._id}
                post={post}
                index={(page - 1) * PAGE_SIZE + index}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center gap-2 mt-10">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-4 py-2 border rounded disabled:opacity-40"
            >
              Prev
            </button>

            <span className="px-4 py-2">
              {page} / {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 border rounded disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
