let avatarUrl: string | null | undefined;
let avatarRequest: Promise<string | null> | null = null;

export function getCachedAvatarUrl() {
  return avatarUrl;
}

export function setCachedAvatarUrl(url: string | null) {
  avatarUrl = url;
}

export function loadProfileAvatar(): Promise<string | null> {
  if (avatarUrl !== undefined) return Promise.resolve(avatarUrl);
  if (avatarRequest) return avatarRequest;

  const request = fetch("/api/profile", { cache: "no-store" })
    .then((response) => response.ok ? response.json() : null)
    .then((data) => {
      avatarUrl = typeof data?.profile?.avatar_url === "string" && data.profile.avatar_url ? data.profile.avatar_url : null;
      return avatarUrl ?? null;
    })
    .catch(() => {
      avatarUrl = null;
      return null;
    })
    .finally(() => { avatarRequest = null; });

  avatarRequest = request;
  return request;
}
