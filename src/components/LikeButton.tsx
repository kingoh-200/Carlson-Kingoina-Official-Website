"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";

export default function LikeButton({ page }: { page: "home" | "projects" }) {
  const [count, setCount] = useState(0);
  const [isBursting, setIsBursting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch(`/api/likes?page=${page}`)
      .then((response) => response.ok ? response.json() : null)
      .then((data) => {
        if (!cancelled && typeof data?.count === "number") setCount(data.count);
      })
      .catch(() => undefined);

    return () => { cancelled = true; };
  }, [page]);

  async function handleClick() {
    setCount((c) => c + 1);
    setIsBursting(true);
    setTimeout(() => setIsBursting(false), 300);

    try {
      const response = await fetch(`/api/likes?page=${page}`, { method: "POST" });
      const data = await response.json().catch(() => null);
      if (!response.ok || typeof data?.count !== "number") throw new Error("Like was not saved.");
      setCount((current) => Math.max(current, data.count));
    } catch {
      // Refresh the total so a temporary failed request does not leave a false count.
      fetch(`/api/likes?page=${page}`)
        .then((response) => response.ok ? response.json() : null)
        .then((data) => { if (typeof data?.count === "number") setCount(data.count); })
        .catch(() => undefined);
    }
  }

  return (
    <button
      onClick={handleClick}
      className="group inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium transition-all hover:border-primary/40 hover:bg-primary/5"
      aria-label={`Like this page, ${count} likes`}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={isBursting ? "burst" : "idle"}
          initial={{ scale: 1 }}
          animate={{ scale: isBursting ? 1.4 : 1 }}
          exit={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 500, damping: 15 }}
          className="inline-block"
        >
          {count > 0 ? (
            <FontAwesomeIcon
              icon={faHeartSolid}
              className="h-4 w-4 text-rose-500"
            />
          ) : (
            <FontAwesomeIcon
              icon={faHeart}
              className="h-4 w-4 text-text-muted transition-colors group-hover:text-rose-400"
            />
          )}
        </motion.span>
      </AnimatePresence>
      <span className="text-text-muted transition-colors group-hover:text-primary">
        {count > 0 ? `${count} ${count === 1 ? "like" : "likes"}` : "Like this page"}
      </span>
    </button>
  );
}
