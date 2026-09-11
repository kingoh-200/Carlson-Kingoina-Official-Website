"use client";

import { useEffect } from "react";
import { loadProfileAvatar } from "@/lib/profile-avatar-client";

export default function DynamicFavicon() {
  useEffect(() => {
    let cancelled = false;

    loadProfileAvatar()
      .then((avatarUrl) => {
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
