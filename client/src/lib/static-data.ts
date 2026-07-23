/**
 * Static content paths for the user GitHub Pages site (https://sbkoth.github.io/).
 * Default Vite BASE_URL is `/`.
 */

function normalizeBase(base: string): string {
  if (base === "." || base === "./") return "./";
  if (base === "/") return "/";
  return base.endsWith("/") ? base : `${base}/`;
}

/** Pure helpers — take explicit base so unit tests drive the same code as production. */
export function resolveDataUrl(
  name: "profile" | "projects" | "services" | "features",
  base: string,
): string {
  const b = normalizeBase(base);
  if (b === "./") return `./data/${name}.json`;
  return `${b}data/${name}.json`;
}

export function resolveAssetUrl(path: string | undefined | null, base: string): string {
  if (!path) return "";
  if (/^https?:\/\//i.test(path) || path.startsWith("data:")) return path;

  const b = normalizeBase(base);
  if (b === "./") {
    return path.startsWith("/") ? `.${path}` : `./${path}`;
  }
  if (b === "/") {
    return path.startsWith("/") ? path : `/${path}`;
  }
  const prefix = b.endsWith("/") ? b.slice(0, -1) : b;
  if (path.startsWith("/")) {
    return `${prefix}${path}`;
  }
  return `${prefix}/${path}`;
}

export function dataUrl(name: "profile" | "projects" | "services" | "features"): string {
  return resolveDataUrl(name, import.meta.env.BASE_URL || "/");
}

/** Prefix site-relative asset paths (e.g. /uploads/...) with the Vite base. */
export function assetUrl(path: string | undefined | null): string {
  return resolveAssetUrl(path, import.meta.env.BASE_URL || "/");
}
