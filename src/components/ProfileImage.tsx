"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function ProfileImage() {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/profile")
      .then((response) => response.ok ? response.json() : null)
      .then((data) => {
        if (data?.profile?.avatar_url) setSrc(data.profile.avatar_url);
      })
      .catch(() => undefined);
  }, []);

  if (!src) {
    return <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-text-muted">CK</div>;
  }

  return (
    <Image
      src={src}
      alt="Carlson Kingoina"
      fill
      className="object-cover"
      priority
      onError={() => setSrc(null)}
    />
  );
}
