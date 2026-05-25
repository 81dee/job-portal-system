/**
 * Resume link for viewing/downloading.
 * Prefer resumeUrl from API; fall back to Cloudinary URL or local /uploads path.
 */
export function getResumeViewUrl(application) {
  if (!application) return "";

  if (application.resumeUrl) {
    return application.resumeUrl;
  }

  const stored = application.resume;
  if (!stored) return "";

  if (/^https?:\/\//i.test(stored)) {
    return stored;
  }

  // Authenticated proxy route (works when file is on server or URL is resolved server-side)
  if (application._id) {
    const apiBase = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
    return `${apiBase}/application/resume/${application._id}`;
  }

  const base = (import.meta.env.VITE_API_URL || "")
    .replace(/\/api\/?$/, "")
    .replace(/\/$/, "");

  const fileName = stored
    .replace(/\\/g, "/")
    .replace(/^\/?uploads\//, "");

  return `${base}/uploads/${fileName}`;
}

/**
 * Open resume in a new tab (handles Cloudinary URLs and auth-protected API route).
 */
export async function openResume(application) {
  const direct = application?.resumeUrl || application?.resume;

  if (direct && /^https?:\/\//i.test(direct)) {
    window.open(direct, "_blank", "noopener,noreferrer");
    return;
  }

  if (!application?._id) {
    throw new Error("Missing application id");
  }

  const apiBase = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
  const token = localStorage.getItem("token");

  const res = await fetch(
    `${apiBase}/application/resume/${application._id}`,
    {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Resume not available");
  }

  const blob = await res.blob();
  const blobUrl = URL.createObjectURL(blob);
  window.open(blobUrl, "_blank", "noopener,noreferrer");
  setTimeout(() => URL.revokeObjectURL(blobUrl), 120000);
}

/** @deprecated Use getResumeViewUrl(application) */
export function getUploadUrl(storedPath) {
  if (!storedPath) return "";
  if (/^https?:\/\//i.test(storedPath)) return storedPath;

  const base = (import.meta.env.VITE_API_URL || "")
    .replace(/\/api\/?$/, "")
    .replace(/\/$/, "");

  const fileName = storedPath
    .replace(/\\/g, "/")
    .replace(/^\/?uploads\//, "");

  return `${base}/uploads/${fileName}`;
}
