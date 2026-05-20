"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

const API = "https://ai-toolbox-api-production.up.railway.app";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export default function AdminBlogPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  function authHeaders(): Record<string, string> {
    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
    return token ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } : {};
  }

  async function loadPosts() {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/admin/blog`, { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts || []);
      }
    } catch (e) {
      console.error("Failed to load posts", e);
    }
    setLoading(false);
  }

  useEffect(() => { loadPosts(); }, []);

  async function deletePost(id: string) {
    if (!confirm("Delete this post?")) return;
    await fetch(`${API}/api/admin/blog/${id}`, { method: "DELETE", headers: authHeaders() });
    loadPosts();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">Blog Posts</h2>
        <button
          onClick={() => router.push("/admin/blog/new")}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          + New Post
        </button>
      </div>

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : posts.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-400">
          No blog posts yet.
        </div>
      ) : (
        <div className="space-y-2">
          {posts.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white px-5 py-3"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-800 truncate">{p.title}</span>
                  {!p.published && (
                    <span className="shrink-0 rounded bg-yellow-100 px-1.5 py-0.5 text-xs text-yellow-700">Draft</span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-0.5">
                  {p.slug} · {p.category} · {new Date(p.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => router.push(`/admin/blog/${p.id}`)}
                  className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100"
                >
                  Edit
                </button>
                <button
                  onClick={() => deletePost(p.id)}
                  className="rounded-lg px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
