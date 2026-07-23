/** Build a valid mailto: URL and open the default mail client. */
export function buildMailtoHref(email: string, subject?: string): string {
  const trimmed = email.trim();
  if (!trimmed) return "";
  // Keep @ unencoded; encode only the query part if present
  const base = `mailto:${trimmed}`;
  if (!subject) return base;
  return `${base}?subject=${encodeURIComponent(subject)}`;
}

export function openMailto(email: string, subject?: string): void {
  const href = buildMailtoHref(email, subject);
  if (!href) return;
  // Assign is more reliable than <a target> quirks for mailto on some browsers
  window.location.assign(href);
}
