import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import api, { setAuthHeader } from "../utils/api";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setAuthHeader(res.data.token);
      toast.success("Login successful 🎉");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-70px)] bg-[#f8f8f8] flex items-center justify-center px-4">
      <form onSubmit={submit} className="w-full max-w-md">
        {/* Heading */}
        <div className="text-center mb-10">
          <h1
            className="text-4xl sm:text-5xl font-bold text-[#231f20]"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Welcome back 👋
          </h1>

          <p className="mt-3 text-gray-500">
            Sign in to write and manage your posts.
          </p>
        </div>

        {/* Email */}
        <div className="mb-5">
          <label className="block text-xs font-bold uppercase tracking-widest text-gray-600 mb-2">
            Email
          </label>

          <input
            type="email"
            required
            value={form.email}
            placeholder="you@email.com"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full h-12 px-4 border border-gray-300 rounded-md focus:outline-none focus:border-black"
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="block text-xs font-bold uppercase tracking-widest text-gray-600 mb-2">
            Password
          </label>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={form.password}
              placeholder="********"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full h-12 px-4 pr-12 border border-gray-300 rounded-md focus:outline-none focus:border-black"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black transition"
            >
              {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </button>
          </div>
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full h-12 rounded-md text-white font-semibold transition ${
            loading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-[#211d1d] hover:bg-black"
          }`}
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>

        <p className="text-center mt-8 text-gray-500">
          New here?{" "}
          <Link
            to="/signup"
            className="text-teal-700 font-semibold hover:underline"
          >
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
}
