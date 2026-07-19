import React, { useState } from "react";
import { ArrowLeft, Upload } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function CreatePost() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    title: "",
    body: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);

  const wordCount =
    form.body.trim() === "" ? 0 : form.body.trim().split(/\s+/).length;

  const handleFile = (e) => {
    setForm({
      ...form,
      image: e.target.files[0],
    });
  };

  const submit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const fd = new FormData();

      fd.append("title", form.title);
      fd.append("body", form.body);

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
      toast.error(err.response?.data?.message || "Failed");
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

        <label className="block text-xs uppercase tracking-wider font-mono text-stone-500 mb-1">
          Title
        </label>

        <input
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

        <label className="border-2 border-dashed border-stone-300 rounded-lg py-10 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-700 hover:text-emerald-700 transition mb-6">
          <Upload size={26} />

          <p className="mt-2 text-sm">
            {form.image ? form.image.name : "Click to upload image"}
          </p>

          <p className="text-xs text-stone-400">PNG, JPG up to 5MB</p>

          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="hidden"
          />
        </label>

        {/* Body */}

        <label className="block text-xs uppercase tracking-wider font-mono text-stone-500 mb-2">
          Story
        </label>

        <div className="border border-stone-300 rounded-lg overflow-hidden">
          <textarea
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
