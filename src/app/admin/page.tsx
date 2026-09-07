"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FolderOpen,
  ImageIcon,
  MessageSquare,
  Settings,
  Trash2,
  Check,
  ExternalLink,
  Loader2,
  Lock,
  LogOut,
  Upload,
} from "lucide-react";

type Tab = "projects" | "gallery" | "messages" | "settings";

const ADMIN_PASSWORD = "carlson2024"; // Change this to something secret

interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  live_url: string | null;
  github_url: string | null;
  image_url: string | null;
  featured: boolean;
  sort_order: number;
  created_at: string;
}

interface GalleryImage {
  id: string;
  title: string;
  url: string;
  category: string;
  created_at: string;
}

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  created_at: string;
}

interface Settings {
  [key: string]: string;
}

const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "projects", label: "Projects", icon: <FolderOpen size={16} /> },
  { id: "gallery", label: "Gallery", icon: <ImageIcon size={16} /> },
  { id: "messages", label: "Messages", icon: <MessageSquare size={16} /> },
  { id: "settings", label: "Settings", icon: <Settings size={16} /> },
];

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  const [activeTab, setActiveTab] = useState<Tab>("projects");
  const [loading, setLoading] = useState(true);

  const [projects, setProjects] = useState<Project[]>([]);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [settings, setSettings] = useState<Settings>({});

  const [projectForm, setProjectForm] = useState({ title: "", description: "", tags: "", live_url: "", github_url: "", image_url: "", featured: false });
  const [imageForm, setImageForm] = useState({ title: "", url: "", category: "general" });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (authenticated) loadData(activeTab);
  }, [activeTab, authenticated]);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  }

  async function loadData(tab: Tab) {
    setLoading(true);
    try {
      if (tab === "projects") {
        const res = await fetch("/api/projects");
        const data = await res.json();
        setProjects(data.projects ?? []);
      } else if (tab === "gallery") {
        const res = await fetch("/api/gallery");
        const data = await res.json();
        setImages(data.images ?? []);
      } else if (tab === "messages") {
        const res = await fetch("/api/messages");
        const data = await res.json();
        setMessages(data.messages ?? []);
      } else if (tab === "settings") {
        const res = await fetch("/api/settings");
        const data = await res.json();
        setSettings(data.settings ?? {});
      }
    } catch { /* silent */ }
    setLoading(false);
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  async function uploadFile(file: File): Promise<string | null> {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("bucket", "images");

    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    setUploading(false);

    if (data.url) return data.url;
    showToast(data.error || "Upload failed");
    return null;
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = await uploadFile(file);
    if (url) {
      setImageForm((f) => ({ ...f, url }));
      showToast("Image uploaded! Now add a title and save.");
    }
  }

  async function addProject(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...projectForm,
          tags: projectForm.tags.split(",").map((t) => t.trim()).filter(Boolean),
        }),
      });
      setProjectForm({ title: "", description: "", tags: "", live_url: "", github_url: "", image_url: "", featured: false });
      showToast("Project added!");
      loadData("projects");
    } catch { showToast("Failed to add project"); }
    setSaving(false);
  }

  async function deleteProject(id: string) {
    if (!confirm("Delete this project?")) return;
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    setProjects((p) => p.filter((x) => x.id !== id));
    showToast("Project deleted");
  }

  async function addImage(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(imageForm),
      });
      setImageForm({ title: "", url: "", category: "general" });
      showToast("Image added!");
      loadData("gallery");
    } catch { showToast("Failed to add image"); }
    setSaving(false);
  }

  async function deleteImage(id: string) {
    if (!confirm("Delete this image?")) return;
    await fetch(`/api/gallery/${id}`, { method: "DELETE" });
    setImages((i) => i.filter((x) => x.id !== id));
    showToast("Image deleted");
  }

  async function markRead(id: string) {
    await fetch(`/api/messages/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read: true }),
    });
    setMessages((m) => m.map((x) => (x.id === id ? { ...x, read: true } : x)));
  }

  async function deleteMessage(id: string) {
    if (!confirm("Delete this message?")) return;
    await fetch(`/api/messages/${id}`, { method: "DELETE" });
    setMessages((m) => m.filter((x) => x.id !== id));
    showToast("Message deleted");
  }

  async function saveSetting(key: string, value: string) {
    setSaving(true);
    await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value }),
    });
    setSettings((s) => ({ ...s, [key]: value }));
    setSaving(false);
    showToast("Setting saved");
  }

  const unreadCount = messages.filter((m) => !m.read).length;

  // ── Login screen ──
  if (!authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Lock size={24} />
            </div>
            <h1 className="mt-4 text-xl font-bold">Admin Access</h1>
            <p className="mt-1 text-sm text-text-muted">Enter the admin password to continue.</p>
          </div>
          <input
            type="password"
            placeholder="Password"
            value={passwordInput}
            onChange={(e) => { setPasswordInput(e.target.value); setPasswordError(false); }}
            className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            autoFocus
          />
          {passwordError && <p className="text-center text-sm text-red-500">Wrong password. Try again.</p>}
          <button type="submit" className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-medium text-white hover:bg-primary-dark">
            Enter Dashboard
          </button>
        </form>
      </div>
    );
  }

  // ── Dashboard ──
  return (
    <div className="min-h-screen px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Admin Dashboard</h1>
            <p className="mt-1 text-sm text-text-muted">Manage your site content, projects, and messages.</p>
          </div>
          <button onClick={() => setAuthenticated(false)} className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-text-muted hover:bg-surface-alt">
            <LogOut size={14} /> Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="mt-6 flex gap-1 rounded-xl border border-border bg-surface-alt p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                activeTab === tab.id ? "bg-surface text-text shadow-sm" : "text-text-muted hover:text-text"
              }`}
            >
              {tab.icon}
              {tab.label}
              {tab.id === "messages" && unreadCount > 0 && (
                <span className="ml-1 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold text-white">{unreadCount}</span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="mt-6">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={24} className="animate-spin text-primary" />
            </div>
          ) : (
            <>
              {/* ── Projects Tab ── */}
              {activeTab === "projects" && (
                <div className="space-y-6">
                  <form onSubmit={addProject} className="rounded-xl border border-border p-5 space-y-3">
                    <h3 className="font-semibold">Add Project</h3>
                    <input placeholder="Title" required value={projectForm.title} onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })} className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                    <textarea placeholder="Description" required rows={2} value={projectForm.description} onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })} className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none" />
                    <input placeholder="Tags (comma separated)" value={projectForm.tags} onChange={(e) => setProjectForm({ ...projectForm, tags: e.target.value })} className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                    <div className="grid gap-3 sm:grid-cols-3">
                      <input placeholder="Live URL" value={projectForm.live_url} onChange={(e) => setProjectForm({ ...projectForm, live_url: e.target.value })} className="rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                      <input placeholder="GitHub URL" value={projectForm.github_url} onChange={(e) => setProjectForm({ ...projectForm, github_url: e.target.value })} className="rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                      <input placeholder="Image URL" value={projectForm.image_url} onChange={(e) => setProjectForm({ ...projectForm, image_url: e.target.value })} className="rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                    </div>
                    <label className="flex items-center gap-2 text-sm text-text-muted">
                      <input type="checkbox" checked={projectForm.featured} onChange={(e) => setProjectForm({ ...projectForm, featured: e.target.checked })} className="rounded" />
                      Featured project
                    </label>
                    <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-50">
                      {saving ? <Loader2 size={14} className="animate-spin" /> : null}
                      Add Project
                    </button>
                  </form>

                  <div className="space-y-3">
                    {projects.map((p) => (
                      <div key={p.id} className="flex items-start justify-between gap-4 rounded-xl border border-border p-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{p.title}</h4>
                            {p.featured && <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">Featured</span>}
                          </div>
                          <p className="mt-1 text-sm text-text-muted line-clamp-2">{p.description}</p>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {p.tags.map((t) => <span key={t} className="rounded bg-surface-alt px-2 py-0.5 text-[10px] text-text-muted">{t}</span>)}
                          </div>
                          <div className="mt-2 flex gap-3">
                            {p.live_url && <a href={p.live_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline"><ExternalLink size={10} /> Live</a>}
                            {p.github_url && <a href={p.github_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-text-muted hover:text-primary">Code</a>}
                          </div>
                        </div>
                        <button onClick={() => deleteProject(p.id)} className="rounded-lg p-2 text-text-muted hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"><Trash2 size={14} /></button>
                      </div>
                    ))}
                    {projects.length === 0 && <p className="text-center text-sm text-text-muted py-10">No projects yet.</p>}
                  </div>
                </div>
              )}

              {/* ── Gallery Tab ── */}
              {activeTab === "gallery" && (
                <div className="space-y-6">
                  <div className="rounded-xl border border-border p-5 space-y-3">
                    <h3 className="font-semibold">Add Image</h3>
                    <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border py-8 text-sm text-text-muted transition-colors hover:border-primary/30 hover:text-primary">
                      <Upload size={18} />
                      {uploading ? "Uploading..." : "Click to upload an image"}
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                    </label>
                    <form onSubmit={addImage} className="space-y-3">
                      <input placeholder="Image URL (auto-filled after upload)" required value={imageForm.url} onChange={(e) => setImageForm({ ...imageForm, url: e.target.value })} className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                      <input placeholder="Title" required value={imageForm.title} onChange={(e) => setImageForm({ ...imageForm, title: e.target.value })} className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                      <select value={imageForm.category} onChange={(e) => setImageForm({ ...imageForm, category: e.target.value })} className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary">
                        <option value="general">General</option>
                        <option value="projects">Projects</option>
                        <option value="campus">Campus</option>
                        <option value="personal">Personal</option>
                      </select>
                      <button type="submit" disabled={saving || !imageForm.url} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-50">
                        {saving ? <Loader2 size={14} className="animate-spin" /> : null}
                        Save Image
                      </button>
                    </form>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {images.map((img) => (
                      <div key={img.id} className="group relative overflow-hidden rounded-xl border border-border">
                        <img src={img.url} alt={img.title} className="aspect-[4/3] w-full object-cover" />
                        <div className="p-3">
                          <h4 className="text-sm font-medium">{img.title}</h4>
                          <span className="text-[10px] text-text-muted">{img.category}</span>
                        </div>
                        <button onClick={() => deleteImage(img.id)} className="absolute right-2 top-2 rounded-lg bg-black/50 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                    {images.length === 0 && <p className="col-span-full text-center text-sm text-text-muted py-10">No images yet.</p>}
                  </div>
                </div>
              )}

              {/* ── Messages Tab ── */}
              {activeTab === "messages" && (
                <div className="space-y-3">
                  {messages.map((m) => (
                    <div key={m.id} className={`rounded-xl border p-4 ${m.read ? "border-border" : "border-primary/30 bg-primary/5"}`}>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{m.name}</h4>
                            {!m.read && <span className="h-2 w-2 rounded-full bg-primary" />}
                          </div>
                          <p className="text-xs text-text-muted">{m.email} — {new Date(m.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="flex gap-1">
                          {!m.read && (
                            <button onClick={() => markRead(m.id)} className="rounded-lg p-2 text-text-muted hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-500/10" title="Mark read">
                              <Check size={14} />
                            </button>
                          )}
                          <button onClick={() => deleteMessage(m.id)} className="rounded-lg p-2 text-text-muted hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-text-muted whitespace-pre-wrap">{m.message}</p>
                    </div>
                  ))}
                  {messages.length === 0 && <p className="text-center text-sm text-text-muted py-10">No messages yet.</p>}
                </div>
              )}

              {/* ── Settings Tab ── */}
              {activeTab === "settings" && (
                <div className="space-y-4">
                  {Object.entries(settings).map(([key, value]) => (
                    <SettingRow key={key} settingKey={key} value={value} onSave={saveSetting} saving={saving} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {toast && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="fixed bottom-6 right-6 rounded-xl bg-surface border border-border px-4 py-3 text-sm font-medium shadow-lg z-50">
            {toast}
          </motion.div>
        )}
      </div>
    </div>
  );
}

function SettingRow({ settingKey, value, onSave, saving }: { settingKey: string; value: string; onSave: (key: string, value: string) => Promise<void>; saving: boolean }) {
  const [localValue, setLocalValue] = useState(value);

  return (
    <div className="rounded-xl border border-border p-4">
      <label className="text-xs font-medium uppercase tracking-wider text-text-muted">{settingKey.replace(/_/g, " ")}</label>
      <div className="mt-2 flex gap-2">
        <input value={localValue} onChange={(e) => setLocalValue(e.target.value)} className="flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
        <button onClick={() => onSave(settingKey, localValue)} disabled={saving || localValue === value} className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-40">Save</button>
      </div>
    </div>
  );
}
