"use client";

import { useEffect, useState } from "react";
import { getCachedAvatarUrl, loadProfileAvatar, setCachedAvatarUrl } from "@/lib/profile-avatar-client";

export default function ProfileImage() {
  const [src, setSrc] = useState<string | null | undefined>(() => getCachedAvatarUrl());

  useEffect(() => {
    let active = true;
    loadProfileAvatar().then((url) => { if (active) setSrc(url); });
    return () => { active = false; };
  }, []);

  if (src === undefined) {
    return <div className="h-full w-full animate-pulse bg-surface-alt" aria-label="Loading profile photo" />;
  }

  if (src === null) {
    return <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-text-muted">CK</div>;
  }

  return (
    <img
      src={src}
      alt="Carlson Kingoina"
      className="h-full w-full object-cover"
      width={1200}
      height={1200}
      onError={() => { setCachedAvatarUrl(null); setSrc(null); }}
    />
  );
}
