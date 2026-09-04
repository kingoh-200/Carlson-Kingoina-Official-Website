"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Check, Loader2, Users } from "lucide-react";

export default function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetch("/api/subscribers")
      .then((r) => r.json())
      .then((d) => setCount(d.count ?? 0))
      .catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/subscribers", {
        method: "POST",
        body: JSON.stringify({ email, name: name || undefined }),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      setCount((c) => c + 1);
      setEmail("");
      setName("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-surface-alt p-8">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Mail size={20} />
        </div>
        <div>
          <h3 className="font-semibold">Stay in the loop</h3>
          <p className="text-sm text-text-muted">
            Get notified when I ship something new.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 space-y-3">
        <input
          type="text"
          placeholder="Your name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
        />
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
        />
        <button
          type="submit"
          disabled={status === "loading" || status === "success"}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-primary-dark disabled:opacity-60 active:scale-[0.98]"
        >
          <AnimatePresence mode="wait">
            {status === "loading" ? (
              <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Loader2 size={16} className="animate-spin" />
              </motion.span>
            ) : status === "success" ? (
              <motion.span key="done" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                <Check size={16} />
              </motion.span>
            ) : (
              <motion.span key="mail" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Mail size={16} />
              </motion.span>
            )}
          </AnimatePresence>
          {status === "loading"
            ? "Subscribing..."
            : status === "success"
            ? "You're in!"
            : "Subscribe"}
        </button>
      </form>

      {status === "success" && (
        <motion.p
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 text-center text-sm text-green-600"
        >
          Welcome aboard! 🎉
        </motion.p>
      )}
      {status === "error" && (
        <p className="mt-3 text-center text-sm text-red-500">
          Something went wrong. Try again.
        </p>
      )}

      {/* Subscriber count */}
      {count > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 flex items-center justify-center gap-2 text-xs text-text-muted"
        >
          <Users size={13} />
          <span>
            <strong className="text-text">{count.toLocaleString()}</strong>{" "}
            {count === 1 ? "subscriber" : "subscribers"} and counting
          </span>
        </motion.div>
      )}
    </div>
  );
}
