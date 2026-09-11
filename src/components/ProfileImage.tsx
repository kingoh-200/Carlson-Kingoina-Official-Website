"use client";

import { useEffect, useState } from "react";

export default function ProfileImage() {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/profile", { cache: "force-cache" })
      .then((response) => response.ok ? response.json() : null)
      .then((data) => {
        if (data?.profile?.avatar_url) setSrc((current) => current === data.profile.avatar_url ? current : data.profile.avatar_url);
      })
      .catch(() => undefined);
  }, []);

  if (!src) {
    return <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-text-muted">CK</div>;
  }

  return (
    <img
      src={src}
      alt="Carlson Kingoina"
      className="h-full w-full object-cover"
      width={1200}
      height={1200}
      onError={() => setSrc(null)}
    />
  );
}
