import React, { useEffect, useState } from "react";
import { ArrowLeft, Upload, X } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

export default function CreatePost() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    title: "",
    body: "",
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // Guard: redirect unauthenticated users instead of letting the POST fail with a 401.
  useEffect(() => {
    if (!token) {
      toast.error("Please log in to create a post");
      navigate("/login");
    }
  }, [token, navigate]);

  // Clean up the object URL used for the preview when it changes/unmounts.
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const wordCount =
    form.body.trim() === "" ? 0 : form.body.trim().split(/\s+/).length;

  const handleFile = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      e.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      toast.error("Image must be 5MB or smaller");
      e.target.value = "";
      return;
    }

    setForm({
      ...form,
      image: file,
    });

    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(URL.createObjectURL(file));

    // Allow re-selecting the same file later and still trigger onChange.
    e.target.value = "";
  };

  const removeImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    setForm({ ...form, image: null });
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.body.trim()) {
      toast.error("Title and story can't be empty");
      return;
    }

    setLoading(true);

    try {
      const fd = new FormData();

      fd.append("title", form.title.trim());
      fd.append("body", form.body.trim());

      if (form.image) {
        fd.append("image", form.image);
      }

      await api.post("/posts", fd, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

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

  if (!token) return null;

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

        {/* Upload */}

        <label className="block text-xs uppercase tracking-wider font-mono text-stone-500 mb-2">
          Cover Image
        </label>

        {imagePreview ? (
          <div className="relative mb-6 rounded-lg overflow-hidden border border-stone-300">
            <img
              src={imagePreview}
              alt="Cover preview"
              className="w-full max-h-64 object-cover"
            />

            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 bg-stone-900/70 hover:bg-stone-900 text-white rounded-full p-1.5 cursor-pointer"
              aria-label="Remove image"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <label className="border-2 border-dashed border-stone-300 rounded-lg py-10 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-700 hover:text-emerald-700 transition mb-6">
            <Upload size={26} />

            <p className="mt-2 text-sm">Click to upload image</p>

            <p className="text-xs text-stone-400">PNG, JPG up to 5MB</p>

            <input
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="hidden"
            />
          </label>
        )}

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
