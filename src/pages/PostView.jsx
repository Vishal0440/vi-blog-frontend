import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { useParams } from "react-router-dom";

export default function PostView() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [body, setBody] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    api
      .get(`/posts/${id}`)
      .then((r) => setPost(r.data))
      .catch(console.error);
    api
      .get(`/comments/${id}`)
      .then((r) => setComments(r.data))
      .catch(console.error);
  }, [id]);

  const addComment = async (e) => {
    e.preventDefault();
    if (!token) return alert("Login first");
    await api.post(
      `/comments/${id}`,
      { text: body },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setBody("");
    const res = await api.get(`/comments/${id}`);
    setComments(res.data);
  };

  const toggleLike = async () => {
    if (!token) return alert("Login first");
    await api.post(
      `/posts/${id}/like`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const res = await api.get(`/posts/${id}`);
    setPost(res.data);
  };

  if (!post) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      {post.image && (
        <img
          src={`https://vi-blog-backend.onrender.com${post.image}`}
          // src={`http://localhost:5000${post.image}`}
          alt=""
          className="w-full h-80 img-cover mb-4 border rounded"
        />
      )}
      <h1 className="text-2xl font-bold">{post.title}</h1>
      <p className="text-sm text-gray-600 capitalize">By {post.author?.name}</p>
      <div className="mt-4">{post.body}</div>

      <div className="mt-6">
        <button onClick={toggleLike} className="px-3 py-1 border rounded">
          👍 {post.likes?.length || 0}
        </button>
      </div>

      <div className="mt-6">
        <h3 className="font-semibold">Comments</h3>
        <form onSubmit={addComment} className="mt-2">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="border p-2 w-full"
          />
          <button className="bg-blue-600 text-white px-3 py-1 rounded mt-2">
            Add Comment
          </button>
        </form>

        <div className="mt-4 space-y-3">
          {comments.map((c) => (
            <div key={c._id} className="border p-3 rounded">
              <p className="text-sm font-semibold capitalize">
                {c.author?.name}
              </p>
              <p>{c.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
