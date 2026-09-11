"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProfileCropper from "@/components/ProfileCropper";
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
  Users,
  User,
  Star,
  BarChart3,
  Mail,
  Globe,
  Save,
} from "lucide-react";

type Tab = "dashboard" | "projects" | "gallery" | "testimonials" | "messages" | "subscribers" | "profile" | "settings";

const ADMIN_PASSWORD = "carlson2024";

interface Project {
  id: string; title: string; description: string; tags: string[];
  live_url: string | null; github_url: string | null; image_url: string | null;
  featured: boolean; sort_order: number; created_at: string;
}
interface GalleryImage {
  id: string; title: string; url: string; category: string; created_at: string;
}
interface Testimonial {
  id: string; name: string; role: string | null; company: string | null;
  content: string; avatar_url: string | null; featured: boolean; created_at: string;
}
interface Message {
  id: string; name: string; email: string; message: string; read: boolean; created_at: string;
}
interface Subscriber {
  id: string; email: string; name: string | null; active: boolean; created_at: string;
}
interface Profile {
  full_name: string; bio: string; avatar_url: string; email: string;
  location: string; role: string; social_github: string; social_linkedin: string; social_twitter: string;
}
interface Settings { [key: string]: string }

const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "dashboard", label: "Dashboard", icon: <BarChart3 size={16} /> },
  { id: "projects", label: "Projects", icon: <FolderOpen size={16} /> },
  { id: "gallery", label: "Gallery", icon: <ImageIcon size={16} /> },
  { id: "testimonials", label: "Testimonials", icon: <Star size={16} /> },
  { id: "messages", label: "Messages", icon: <MessageSquare size={16} /> },
  { id: "subscribers", label: "Subscribers", icon: <Users size={16} /> },
  { id: "profile", label: "Profile", icon: <User size={16} /> },
  { id: "settings", label: "Settings", icon: <Settings size={16} /> },
];

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [profileImageToCrop, setProfileImageToCrop] = useState<File | null>(null);

  const [projects, setProjects] = useState<Project[]>([]);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [settings, setSettings] = useState<Settings>({});

  const [projectForm, setProjectForm] = useState({ title: "", description: "", tags: "", live_url: "", github_url: "", image_url: "", featured: false });
  const [testimonialForm, setTestimonialForm] = useState({ name: "", role: "", company: "", content: "", featured: false });
  const [imageForm, setImageForm] = useState({ title: "", url: "", category: "general" });

  useEffect(() => { if (authenticated) loadData(activeTab); }, [activeTab, authenticated]);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) { setAuthenticated(true); setPasswordError(false); }
    else { setPasswordError(true); }
  }

  async function loadData(tab: Tab) {
    setLoading(true);
    try {
      if (tab === "dashboard" || tab === "projects") {
        const res = await fetch("/api/projects");
        const data = await res.json();
        setProjects(data.projects ?? []);
      }
      if (tab === "dashboard" || tab === "gallery") {
        const res = await fetch("/api/gallery");
        const data = await res.json();
        setImages(data.images ?? []);
      }
      if (tab === "dashboard" || tab === "testimonials") {
        const res = await fetch("/api/testimonials");
        const data = await res.json();
        setTestimonials(data.testimonials ?? []);
      }
      if (tab === "dashboard" || tab === "messages") {
        const res = await fetch("/api/messages");
        const data = await res.json();
        setMessages(data.messages ?? []);
      }
      if (tab === "dashboard" || tab === "subscribers") {
        const res = await fetch("/api/subscribers");
        const data = await res.json();
        // subscribers endpoint returns count, fetch list separately
        setSubscribers([]);
      }
      if (tab === "dashboard" || tab === "profile") {
        const res = await fetch("/api/profile");
        const data = await res.json();
        setProfile(data.profile ?? null);
      }
      if (tab === "dashboard" || tab === "settings") {
        const res = await fetch("/api/settings");
        const data = await res.json();
        setSettings(data.settings ?? {});
      }
    } catch { /* silent */ }
    setLoading(false);
  }

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(null), 3000); }

  async function uploadFile(file: File, folder = "images"): Promise<string | null> {
    const maxUploadSize = 100 * 1024 * 1024;
    if (file.size > maxUploadSize) {
      showToast("Choose an image smaller than 100 MB.");
      return null;
    }

    setUploading(true);
    try {
      const signatureResponse = await fetch(`/api/upload-signature?folder=${encodeURIComponent(folder)}`, { cache: "no-store" });
      const signatureData = await signatureResponse.json().catch(() => ({}));
      if (!signatureResponse.ok) throw new Error(signatureData.error || "Could not prepare the upload.");

      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", signatureData.apiKey);
      formData.append("timestamp", String(signatureData.timestamp));
      formData.append("signature", signatureData.signature);
      formData.append("folder", signatureData.folder);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`, { method: "POST", body: formData });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.secure_url) return data.secure_url;
      showToast(data.error || "Upload failed. Please try again.");
      return null;
    } catch {
      showToast("Could not reach the upload service. Please try again.");
      return null;
    } finally {
      setUploading(false);
    }
  }

  async function uploadProfileImage(file: File) {
    const url = await uploadFile(file, "profile");
    if (url) {
      setProfile((current) => current ? { ...current, avatar_url: url } : current);
      showToast("Profile image uploaded. Save your profile to publish it.");
    }
  }

  async function addProject(e: React.FormEvent) {
    e.preventDefault(); setSaving(true);
    await fetch("/api/projects", { method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...projectForm, tags: projectForm.tags.split(",").map((t) => t.trim()).filter(Boolean) }) });
    setProjectForm({ title: "", description: "", tags: "", live_url: "", github_url: "", image_url: "", featured: false });
    showToast("Project added!"); loadData("projects"); setSaving(false);
  }

  async function deleteProject(id: string) {
    if (!confirm("Delete?")) return;
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    setProjects((p) => p.filter((x) => x.id !== id)); showToast("Deleted");
  }

  async function addImage(e: React.FormEvent) {
    e.preventDefault(); setSaving(true);
    await fetch("/api/gallery", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(imageForm) });
    setImageForm({ title: "", url: "", category: "general" });
    showToast("Image added!"); loadData("gallery"); setSaving(false);
  }

  async function deleteImage(id: string) {
    if (!confirm("Delete?")) return;
    await fetch(`/api/gallery/${id}`, { method: "DELETE" });
    setImages((i) => i.filter((x) => x.id !== id)); showToast("Deleted");
  }

  async function addTestimonial(e: React.FormEvent) {
    e.preventDefault(); setSaving(true);
    await fetch("/api/testimonials", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(testimonialForm) });
    setTestimonialForm({ name: "", role: "", company: "", content: "", featured: false });
    showToast("Testimonial added!"); loadData("testimonials"); setSaving(false);
  }

  async function deleteTestimonial(id: string) {
    if (!confirm("Delete?")) return;
    await fetch(`/api/testimonials/${id}`, { method: "DELETE" });
    setTestimonials((t) => t.filter((x) => x.id !== id)); showToast("Deleted");
  }

  async function markRead(id: string) {
    await fetch(`/api/messages/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ read: true }) });
    setMessages((m) => m.map((x) => (x.id === id ? { ...x, read: true } : x)));
  }

  async function deleteMessage(id: string) {
    if (!confirm("Delete?")) return;
    await fetch(`/api/messages/${id}`, { method: "DELETE" });
    setMessages((m) => m.filter((x) => x.id !== id)); showToast("Deleted");
  }

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault(); if (!profile) return; setSaving(true);
    try {
      const res = await fetch("/api/profile", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(profile) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        showToast(data.error || "Could not save your profile.");
        return;
      }
      setProfile(data.profile ?? profile);
      showToast("Profile saved!");
    } catch {
      showToast("Could not reach the profile service. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function saveSetting(key: string, value: string) {
    setSaving(true);
    await fetch("/api/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key, value }) });
    setSettings((s) => ({ ...s, [key]: value })); setSaving(false); showToast("Saved");
  }

  const unreadCount = messages.filter((m) => !m.read).length;
  const featuredCount = projects.filter((p) => p.featured).length;

  // ── Login ──
  if (!authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Lock size={24} /></div>
            <h1 className="mt-4 text-xl font-bold">Admin Access</h1>
            <p className="mt-1 text-sm text-text-muted">Enter the admin password to continue.</p>
          </div>
          <input type="password" placeholder="Password" value={passwordInput} onChange={(e) => { setPasswordInput(e.target.value); setPasswordError(false); }} className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary" autoFocus />
          {passwordError && <p className="text-center text-sm text-red-500">Wrong password.</p>}
          <button type="submit" className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-medium text-white hover:bg-primary-dark">Enter Dashboard</button>
        </form>
      </div>
    );
  }

  // ── Dashboard ──
  return (
    <div className="min-h-screen w-full px-4 py-6 sm:px-6 sm:py-10 lg:px-10">
      <div className="w-full max-w-none">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Admin Dashboard</h1>
            <p className="mt-1 text-sm text-text-muted">Manage your entire site from here.</p>
          </div>
          <button onClick={() => setAuthenticated(false)} className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-text-muted hover:bg-surface-alt"><LogOut size={14} /> Logout</button>
        </div>

        {/* Tabs */}
        <div className="mt-6 flex gap-1 overflow-x-auto rounded-xl border border-border bg-surface-alt p-1">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all ${activeTab === tab.id ? "bg-surface text-text shadow-sm" : "text-text-muted hover:text-text"}`}>
              {tab.icon}<span>{tab.label}</span>
              {tab.id === "messages" && unreadCount > 0 && <span className="rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold text-white">{unreadCount}</span>}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {loading ? (
            <div className="flex items-center justify-center py-20"><Loader2 size={24} className="animate-spin text-primary" /></div>
          ) : (
            <>
              {/* ── Dashboard Overview ── */}
              {activeTab === "dashboard" && (
                <div className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard icon={<FolderOpen size={20} />} label="Projects" value={projects.length} sub={`${featuredCount} featured`} />
                    <StatCard icon={<ImageIcon size={20} />} label="Gallery" value={images.length} sub="images uploaded" />
                    <StatCard icon={<MessageSquare size={20} />} label="Messages" value={messages.length} sub={`${unreadCount} unread`} accent={unreadCount > 0} />
                    <StatCard icon={<Users size={20} />} label="Subscribers" value={subscribers.length || "—"} sub="total" />
                  </div>
                  {unreadCount > 0 && (
                    <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                      <div className="flex items-center gap-2 text-sm font-medium text-primary"><Mail size={16} /> {unreadCount} unread message{unreadCount !== 1 && "s"}</div>
                      <p className="mt-1 text-xs text-text-muted">Go to the Messages tab to read them.</p>
                    </div>
                  )}
                  <div className="rounded-xl border border-border p-5">
                    <h3 className="font-semibold">Quick Actions</h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button onClick={() => setActiveTab("projects")} className="rounded-lg border border-border px-3 py-2 text-sm hover:bg-surface-alt">Add Project</button>
                      <button onClick={() => setActiveTab("gallery")} className="rounded-lg border border-border px-3 py-2 text-sm hover:bg-surface-alt">Upload Image</button>
                      <button onClick={() => setActiveTab("testimonials")} className="rounded-lg border border-border px-3 py-2 text-sm hover:bg-surface-alt">Add Testimonial</button>
                      <button onClick={() => setActiveTab("profile")} className="rounded-lg border border-border px-3 py-2 text-sm hover:bg-surface-alt">Edit Profile</button>
                      <a href="/" target="_blank" className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm hover:bg-surface-alt"><Globe size={14} /> View Site</a>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Projects ── */}
              {activeTab === "projects" && (
                <div className="space-y-6">
                  <form onSubmit={addProject} className="rounded-xl border border-border p-5 space-y-3">
                    <h3 className="font-semibold">Add Project</h3>
                    <input placeholder="Title" required value={projectForm.title} onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })} className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                    <textarea placeholder="Description" required rows={2} value={projectForm.description} onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })} className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none" />
                    <input placeholder="Tags (comma separated)" value={projectForm.tags} onChange={(e) => setProjectForm({ ...projectForm, tags: e.target.value })} className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                    <div className="grid gap-3 sm:grid-cols-3">
                      <input placeholder="Live URL" value={projectForm.live_url} onChange={(e) => setProjectForm({ ...projectForm, live_url: e.target.value })} className="rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary" />
                      <input placeholder="GitHub URL" value={projectForm.github_url} onChange={(e) => setProjectForm({ ...projectForm, github_url: e.target.value })} className="rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary" />
                      <input placeholder="Image URL" value={projectForm.image_url} onChange={(e) => setProjectForm({ ...projectForm, image_url: e.target.value })} className="rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary" />
                    </div>
                    <label className="flex items-center gap-2 text-sm text-text-muted"><input type="checkbox" checked={projectForm.featured} onChange={(e) => setProjectForm({ ...projectForm, featured: e.target.checked })} className="rounded" /> Featured</label>
                    <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-50">{saving && <Loader2 size={14} className="animate-spin" />} Add Project</button>
                  </form>
                  <div className="space-y-3">
                    {projects.map((p) => (
                      <div key={p.id} className="flex items-start justify-between gap-4 rounded-xl border border-border p-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2"><h4 className="font-medium">{p.title}</h4>{p.featured && <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">Featured</span>}</div>
                          <p className="mt-1 text-sm text-text-muted line-clamp-2">{p.description}</p>
                          <div className="mt-2 flex flex-wrap gap-1">{p.tags.map((t) => <span key={t} className="rounded bg-surface-alt px-2 py-0.5 text-[10px] text-text-muted">{t}</span>)}</div>
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

              {/* ── Gallery ── */}
              {activeTab === "gallery" && (
                <div className="space-y-6">
                  <div className="rounded-xl border border-border p-5 space-y-3">
                    <h3 className="font-semibold">Upload Image</h3>
                    <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border py-8 text-sm text-text-muted transition-colors hover:border-primary/30 hover:text-primary">
                      <Upload size={18} />{uploading ? "Uploading..." : "Click to upload an image"}
                      <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={async (e) => { const file = e.target.files?.[0]; if (!file) return; const url = await uploadFile(file); if (url) { setImageForm((f) => ({ ...f, url })); showToast("Uploaded!"); } }} disabled={uploading} />
                    </label>
                    <form onSubmit={addImage} className="space-y-3">
                      <input placeholder="Image URL" required value={imageForm.url} onChange={(e) => setImageForm({ ...imageForm, url: e.target.value })} className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary" />
                      <input placeholder="Title" required value={imageForm.title} onChange={(e) => setImageForm({ ...imageForm, title: e.target.value })} className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary" />
                      <select value={imageForm.category} onChange={(e) => setImageForm({ ...imageForm, category: e.target.value })} className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary">
                        <option value="general">General</option><option value="projects">Projects</option><option value="campus">Campus</option><option value="personal">Personal</option>
                      </select>
                      <button type="submit" disabled={saving || !imageForm.url} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-50">{saving && <Loader2 size={14} className="animate-spin" />} Save Image</button>
                    </form>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {images.map((img) => (
                      <div key={img.id} className="group relative overflow-hidden rounded-xl border border-border">
                        <img src={img.url} alt={img.title} className="aspect-[4/3] w-full object-cover" />
                        <div className="p-3"><h4 className="text-sm font-medium">{img.title}</h4><span className="text-[10px] text-text-muted">{img.category}</span></div>
                        <button onClick={() => deleteImage(img.id)} className="absolute right-2 top-2 rounded-lg bg-black/50 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100"><Trash2 size={12} /></button>
                      </div>
                    ))}
                    {images.length === 0 && <p className="col-span-full text-center text-sm text-text-muted py-10">No images yet.</p>}
                  </div>
                </div>
              )}

              {/* ── Testimonials ── */}
              {activeTab === "testimonials" && (
                <div className="space-y-6">
                  <form onSubmit={addTestimonial} className="rounded-xl border border-border p-5 space-y-3">
                    <h3 className="font-semibold">Add Testimonial</h3>
                    <div className="grid gap-3 sm:grid-cols-3">
                      <input placeholder="Name" required value={testimonialForm.name} onChange={(e) => setTestimonialForm({ ...testimonialForm, name: e.target.value })} className="rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary" />
                      <input placeholder="Role" value={testimonialForm.role} onChange={(e) => setTestimonialForm({ ...testimonialForm, role: e.target.value })} className="rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary" />
                      <input placeholder="Company" value={testimonialForm.company} onChange={(e) => setTestimonialForm({ ...testimonialForm, company: e.target.value })} className="rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary" />
                    </div>
                    <textarea placeholder="What they said..." required rows={3} value={testimonialForm.content} onChange={(e) => setTestimonialForm({ ...testimonialForm, content: e.target.value })} className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary resize-none" />
                    <label className="flex items-center gap-2 text-sm text-text-muted"><input type="checkbox" checked={testimonialForm.featured} onChange={(e) => setTestimonialForm({ ...testimonialForm, featured: e.target.checked })} className="rounded" /> Featured</label>
                    <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-50">{saving && <Loader2 size={14} className="animate-spin" />} Add Testimonial</button>
                  </form>
                  <div className="space-y-3">
                    {testimonials.map((t) => (
                      <div key={t.id} className="flex items-start justify-between gap-4 rounded-xl border border-border p-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2"><h4 className="font-medium">{t.name}</h4>{t.role && <span className="text-xs text-text-muted">— {t.role}{t.company && ` at ${t.company}`}</span>}{t.featured && <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">Featured</span>}</div>
                          <p className="mt-1 text-sm text-text-muted italic">&ldquo;{t.content}&rdquo;</p>
                        </div>
                        <button onClick={() => deleteTestimonial(t.id)} className="rounded-lg p-2 text-text-muted hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"><Trash2 size={14} /></button>
                      </div>
                    ))}
                    {testimonials.length === 0 && <p className="text-center text-sm text-text-muted py-10">No testimonials yet.</p>}
                  </div>
                </div>
              )}

              {/* ── Messages ── */}
              {activeTab === "messages" && (
                <div className="space-y-3">
                  {messages.map((m) => (
                    <div key={m.id} className={`rounded-xl border p-4 ${m.read ? "border-border" : "border-primary/30 bg-primary/5"}`}>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2"><h4 className="font-medium">{m.name}</h4>{!m.read && <span className="h-2 w-2 rounded-full bg-primary" />}</div>
                          <p className="text-xs text-text-muted">{m.email} — {new Date(m.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="flex gap-1">
                          {!m.read && <button onClick={() => markRead(m.id)} className="rounded-lg p-2 text-text-muted hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-500/10"><Check size={14} /></button>}
                          <button onClick={() => deleteMessage(m.id)} className="rounded-lg p-2 text-text-muted hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"><Trash2 size={14} /></button>
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-text-muted whitespace-pre-wrap">{m.message}</p>
                    </div>
                  ))}
                  {messages.length === 0 && <p className="text-center text-sm text-text-muted py-10">No messages yet.</p>}
                </div>
              )}

              {/* ── Subscribers ── */}
              {activeTab === "subscribers" && (
                <div className="space-y-3">
                  <p className="text-sm text-text-muted">{subscribers.length} total subscribers.</p>
                  {subscribers.length === 0 && <p className="text-center text-sm text-text-muted py-10">Subscriber data is managed through the subscribe form.</p>}
                </div>
              )}

              {/* ── Profile ── */}
              {activeTab === "profile" && profile && (
                <form onSubmit={saveProfile} className="rounded-xl border border-border p-5 space-y-4">
                  <h3 className="font-semibold">Edit Profile</h3>
                  <div className="flex flex-col gap-4 rounded-xl border border-dashed border-border bg-surface-alt p-4 sm:flex-row sm:items-center">
                    <div className="h-24 w-24 shrink-0 overflow-hidden rounded-full border-4 border-surface bg-surface shadow-md ring-1 ring-primary/20">
                      {profile.avatar_url ? <img src={profile.avatar_url} alt="Profile preview" className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center text-lg font-bold text-text-muted">{profile.full_name.slice(0, 2).toUpperCase()}</div>}
                    </div>
                    <div>
                      <p className="text-sm font-medium">Profile photo</p>
                      <p className="mt-1 text-xs text-text-muted">JPEG, PNG, WebP, or GIF. Maximum 100 MB.</p>
                      <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm font-medium hover:border-primary/40 hover:text-primary">
                        <Upload size={15} />{uploading ? "Uploading..." : "Choose & crop photo"}
                        <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" disabled={uploading} onChange={(e) => { const file = e.target.files?.[0]; if (file) setProfileImageToCrop(file); e.currentTarget.value = ""; }} />
                      </label>
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div><label className="text-xs text-text-muted">Full Name</label><input value={profile.full_name} onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary" /></div>
                    <div><label className="text-xs text-text-muted">Role</label><input value={profile.role || ""} onChange={(e) => setProfile({ ...profile, role: e.target.value })} className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary" /></div>
                    <div><label className="text-xs text-text-muted">Email</label><input value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary" /></div>
                    <div><label className="text-xs text-text-muted">Location</label><input value={profile.location || ""} onChange={(e) => setProfile({ ...profile, location: e.target.value })} className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary" /></div>
                    <div><label className="text-xs text-text-muted">Avatar URL</label><input value={profile.avatar_url || ""} onChange={(e) => setProfile({ ...profile, avatar_url: e.target.value })} className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary" /></div>
                  </div>
                  <div><label className="text-xs text-text-muted">Bio</label><textarea rows={3} value={profile.bio || ""} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary resize-none" /></div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div><label className="text-xs text-text-muted">GitHub URL</label><input value={profile.social_github || ""} onChange={(e) => setProfile({ ...profile, social_github: e.target.value })} className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary" /></div>
                    <div><label className="text-xs text-text-muted">LinkedIn URL</label><input value={profile.social_linkedin || ""} onChange={(e) => setProfile({ ...profile, social_linkedin: e.target.value })} className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary" /></div>
                    <div><label className="text-xs text-text-muted">Twitter URL</label><input value={profile.social_twitter || ""} onChange={(e) => setProfile({ ...profile, social_twitter: e.target.value })} className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary" /></div>
                  </div>
                  <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-50">{saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save Profile</button>
                </form>
              )}

              {/* ── Settings ── */}
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
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="fixed bottom-6 right-6 rounded-xl bg-surface border border-border px-4 py-3 text-sm font-medium shadow-lg z-50">{toast}</motion.div>
        )}
        {profileImageToCrop && <ProfileCropper file={profileImageToCrop} onCancel={() => setProfileImageToCrop(null)} onCrop={async (file) => { await uploadProfileImage(file); setProfileImageToCrop(null); }} />}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, sub, accent }: { icon: React.ReactNode; label: string; value: number | string; sub: string; accent?: boolean }) {
  return (
    <div className={`rounded-xl border p-4 ${accent ? "border-primary/30 bg-primary/5" : "border-border"}`}>
      <div className="flex items-center gap-2 text-text-muted">{icon}<span className="text-xs font-medium uppercase tracking-wider">{label}</span></div>
      <p className="mt-2 text-2xl font-bold">{value}</p>
      <p className="text-xs text-text-muted">{sub}</p>
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
