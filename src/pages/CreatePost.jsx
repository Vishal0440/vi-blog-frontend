import React, { useState } from "react";
import { ArrowLeft, ImageIcon } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function CreatePost() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    title: "",
    body: "",
    image: "",
  });

  const [imageError, setImageError] = useState(false);
  const [loading, setLoading] = useState(false);

  const wordCount =
    form.body.trim() === "" ? 0 : form.body.trim().split(/\s+/).length;

  const submit = async (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.body.trim()) {
      toast.error("Title and story can't be empty");
      return;
    }

    if (form.image.trim() && imageError) {
      toast.error(
        "That image URL doesn't work — fix or remove it before publishing",
      );
      return;
    }

    setLoading(true);

    try {
      await api.post(
        "/posts",
        {
          title: form.title.trim(),
          body: form.body.trim(),
          image: form.image.trim() || undefined,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success("Post published 🎉");

      navigate("/dashboard");
    } catch (err) {
      if (!err.response) {
        toast.error("Network error — please check your connection");
      } else {
        toast.error(err.response?.data?.message || "Failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-5 ">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-stone-500 hover:text-emerald-700 mb-6 cursor-pointer"
      >
        <ArrowLeft size={15} />
        Back
      </button>

      <form onSubmit={submit}>
        <div className="flex items-center justify-between mb-2">
          <h1 className="font-serif text-3xl font-semibold text-stone-900">
            Create New Post
          </h1>

          <button
            disabled={loading}
            className="bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2 rounded text-sm font-medium disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Publishing..." : "Publish"}
          </button>
        </div>

        <p className="text-stone-500 mb-6">
          Share your thoughts with the world ✏️
        </p>

        {/* Title */}

        <label
          htmlFor="post-title"
          className="block text-xs uppercase tracking-wider font-mono text-stone-500 mb-1"
        >
          Title
        </label>

        <input
          id="post-title"
          required
          maxLength={100}
          value={form.title}
          onChange={(e) =>
            setForm({
              ...form,
              title: e.target.value,
            })
          }
          placeholder="Enter your post title"
          className="w-full border border-stone-300 rounded px-3 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-700"
        />

        <p className="text-right text-xs text-stone-400 mb-6">
          {form.title.length}/100
        </p>

        {/* Image URL */}

        <label
          htmlFor="post-image"
          className="block text-xs uppercase tracking-wider font-mono text-stone-500 mb-2"
        >
          Cover Image URL
        </label>

        <div className="flex items-center gap-2 border border-stone-300 rounded px-3 py-2 mb-2 focus-within:ring-2 focus-within:ring-emerald-700">
          <ImageIcon size={16} className="text-stone-400 flex-shrink-0" />

          <input
            id="post-image"
            type="url"
            value={form.image}
            onChange={(e) => {
              setForm({ ...form, image: e.target.value });
              setImageError(false);
            }}
            placeholder="https://example.com/image.jpg (optional)"
            className="w-full focus:outline-none text-sm"
          />
        </div>

        {form.image && !imageError && (
          <div className="rounded-lg overflow-hidden border border-stone-300 mb-6 h-52">
            <img
              src={form.image}
              alt="Cover preview"
              onError={() => setImageError(true)}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {imageError && (
          <p className="text-xs text-red-500 mb-6">
            That image URL couldn't be loaded — check the link or try another
            one.
          </p>
        )}

        {!form.image && <div className="mb-4" />}

        {/* Body */}

        <label
          htmlFor="post-body"
          className="block text-xs uppercase tracking-wider font-mono text-stone-500 mb-2"
        >
          Story
        </label>

        <div className="border border-stone-300 rounded-lg overflow-hidden">
          <textarea
            id="post-body"
            required
            rows={12}
            value={form.body}
            onChange={(e) =>
              setForm({
                ...form,
                body: e.target.value,
              })
            }
            placeholder="Write your story here..."
            className="w-full p-4 resize-none focus:outline-none"
          />
        </div>

        <div className="flex justify-between mt-2 text-xs text-stone-400">
          <span>{wordCount} words</span>

          <span>Ready to publish</span>
        </div>
      </form>
    </div>
  );
}
