"use client";

import { useEffect } from "react";

export default function DynamicFavicon() {
  useEffect(() => {
    let cancelled = false;

    fetch("/api/profile", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : null)
      .then((data) => {
        const avatarUrl = data?.profile?.avatar_url;
        if (cancelled || !avatarUrl) return;

        let icon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
        if (!icon) {
          icon = document.createElement("link");
          icon.rel = "icon";
          document.head.appendChild(icon);
        }
        icon.href = avatarUrl;
      })
      .catch(() => undefined);

    return () => { cancelled = true; };
  }, []);

  return null;
}
