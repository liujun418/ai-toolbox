"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

const API = "https://ai-toolbox-api-production.up.railway.app";

export default function BlogEditorPage() {
  const { user } = useAuth();
  const router = useRouter();
  const rawParams = useParams() as { id: string };
  const postId = rawParams?.id || "";
  const isNew = postId === "new";

  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [relatedTools, setRelatedTools] = useState("");
  const [published, setPublished] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!isNew);

  function authHeaders(): Record<string, string> {
    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
    return token ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } : {};
  }

  useEffect(() => {
    if (isNew) return;
    setLoading(true);
    fetch(`${API}/api/admin/blog/${postId}`, { headers: authHeaders() })
      .then((r) => r.json())
      .then((d) => {
        setSlug(d.slug || "");
        setTitle(d.title || "");
        setDescription(d.description || "");
        setContent(d.content || "");
        setCategory(d.category || "");
        setTags(d.tags || "");
        setRelatedTools(d.related_tools || "");
        setPublished(d.published ?? true);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [postId, isNew]);

  async function save() {
    if (!title.trim() || !slug.trim()) return alert("Title and slug are required.");
    setSaving(true);
    const body = { slug: slug.trim(), title: title.trim(), description, content, category, tags, related_tools: relatedTools, published };
    const method = isNew ? "POST" : "PATCH";
    const url = isNew ? `${API}/api/admin/blog` : `${API}/api/admin/blog/${postId}`;
    const res = await fetch(url, { method, headers: authHeaders(), body: JSON.stringify(body) });
    setSaving(false);
    if (res.ok) {
      router.push("/admin/blog");
    } else {
      const d = await res.json();
      alert(d.detail || "Save failed");
    }
  }

  if (loading) return <p className="text-gray-400">Loading...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">{isNew ? "New Post" : "Edit Post"}</h2>
        <div className="flex gap-2">
          <label className="flex items-center gap-1.5 text-sm text-gray-600">
            <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
            Published
          </label>
          <button onClick={() => router.push("/admin/blog")} className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
            Cancel
          </button>
          <button onClick={save} disabled={saving} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50">
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      <div className="space-y-4 max-w-4xl">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
            <input value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="my-post-slug" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <input value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="Image Editing" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Content (HTML)</label>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={20} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
            <input value={tags} onChange={(e) => setTags(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="tag1, tag2, tag3" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Related Tools (comma-separated IDs)</label>
            <input value={relatedTools} onChange={(e) => setRelatedTools(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="background-remover, image-upscaler" />
          </div>
        </div>
      </div>
    </div>
  );
}
