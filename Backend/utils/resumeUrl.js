/**
 * Resolve stored resume value to a browser-openable URL.
 */
export function resolveResumeUrl(stored) {
  if (!stored) return null;

  if (/^https?:\/\//i.test(stored)) {
    return stored;
  }

  const base =
    process.env.PUBLIC_URL ||
    process.env.RENDER_EXTERNAL_URL ||
    process.env.BACKEND_URL ||
    "http://localhost:3000";

  const fileName = stored.replace(/\\/g, "/").replace(/^\/?uploads\//, "");

  return `${base.replace(/\/$/, "")}/uploads/${fileName}`;
}

export function attachResumeUrl(application) {
  const doc = application?.toObject ? application.toObject() : { ...application };
  doc.resumeUrl = resolveResumeUrl(doc.resume);
  return doc;
}
