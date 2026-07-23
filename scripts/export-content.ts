/**
 * Build-time content export for static / GitHub Pages deployment.
 * Reads markdown + profile JSON, validates with Zod, writes
 * client/public/data/*.json, and copies uploads into client/public/uploads.
 */
import fs from "fs/promises";
import matter from "gray-matter";
import path from "path";
import { fileURLToPath } from "url";
import {
  type Feature,
  featureSchema,
  type Profile,
  type Project,
  portfolioExportSchema,
  profileSchema,
  projectSchema,
  projectTypeSchema,
  type Service,
  serviceSchema,
} from "../shared/schema.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");

export const CONTENT_DIR = path.join(ROOT, "content");
export const PUBLIC_DIR = path.join(ROOT, "client", "public");
export const DATA_DIR = path.join(PUBLIC_DIR, "data");
export const UPLOADS_SRC = path.join(ROOT, "uploads");
export const UPLOADS_DEST = path.join(PUBLIC_DIR, "uploads");

export type ServiceData = Service;
export type FeatureData = Feature;
export type ProjectData = Project;
export type ProfileData = Profile;

function normalizeOutcomes(outcomes: unknown): string[] {
  if (!outcomes) return [];
  if (Array.isArray(outcomes)) {
    return outcomes.map(String);
  }
  if (typeof outcomes === "object") {
    return Object.values(outcomes as Record<string, unknown>).map(String);
  }
  return [String(outcomes)];
}

function formatZodError(
  label: string,
  err: { issues: ReadonlyArray<{ path: PropertyKey[]; message: string }> },
): string {
  const details = err.issues
    .map((i) => {
      const path = i.path.map(String).join(".") || "(root)";
      return `  - ${path}: ${i.message}`;
    })
    .join("\n");
  return `${label} validation failed:\n${details}`;
}

export async function loadMarkdownDir<T extends Record<string, unknown>>(
  dir: string,
  map: (data: Record<string, unknown>, body: string, file: string) => T,
): Promise<T[]> {
  let files: string[];
  try {
    files = await fs.readdir(dir);
  } catch {
    return [];
  }

  const items: T[] = [];
  for (const file of files.sort()) {
    if (!file.endsWith(".md")) continue;
    const raw = await fs.readFile(path.join(dir, file), "utf-8");
    const { data, content } = matter(raw);
    items.push(map(data as Record<string, unknown>, content, file));
  }
  return items;
}

export async function loadServices(): Promise<ServiceData[]> {
  const raw = await loadMarkdownDir(path.join(CONTENT_DIR, "services"), (data, body) => ({
    title: String(data.title ?? ""),
    icon: String(data.icon ?? "Code"),
    description: String(data.description ?? ""),
    content: body.trim(),
  }));

  const parsed = serviceSchema.array().safeParse(raw);
  if (!parsed.success) {
    throw new Error(formatZodError("services", parsed.error));
  }
  return parsed.data;
}

export async function loadFeatures(): Promise<FeatureData[]> {
  const raw = await loadMarkdownDir(path.join(CONTENT_DIR, "features"), (data, body) => ({
    title: String(data.title ?? ""),
    icon: String(data.icon ?? "Code2"),
    description: String(data.description ?? ""),
    highlights: Array.isArray(data.highlights) ? data.highlights.map(String) : [],
    content: body.trim(),
  }));

  const parsed = featureSchema.array().safeParse(raw);
  if (!parsed.success) {
    throw new Error(formatZodError("features", parsed.error));
  }
  return parsed.data;
}

export async function loadProjects(): Promise<ProjectData[]> {
  const projects = await loadMarkdownDir(path.join(CONTENT_DIR, "projects"), (data, body, file) => {
    const slug = String(data.slug ?? file.replace(/\.md$/, ""));
    const publishedAt = data.publishedAt
      ? new Date(String(data.publishedAt)).toISOString()
      : new Date(0).toISOString();

    const typeRaw = String(data.type ?? "text");
    const typeParsed = projectTypeSchema.safeParse(typeRaw);
    const type = typeParsed.success ? typeParsed.data : "text";

    return {
      id: 0,
      slug,
      title: String(data.title ?? slug),
      description: String(data.description ?? ""),
      content: body.trim(),
      publishedAt,
      thumbnail: String(data.thumbnail ?? "/uploads/placeholder.jpg"),
      type,
      challenge: data.challenge != null ? String(data.challenge) : null,
      approach: data.approach != null ? String(data.approach) : null,
      implementation: data.implementation != null ? String(data.implementation) : null,
      outcomes: normalizeOutcomes(data.outcomes),
      clientTestimonial: (data.clientTestimonial as Project["clientTestimonial"]) ?? null,
      technologies: Array.isArray(data.technologies) ? data.technologies.map(String) : [],
    };
  });

  // Stable numeric ids for React keys (sorted by title then slug)
  projects.sort((a, b) => a.title.localeCompare(b.title));
  const withIds = projects.map((p, i) => ({ ...p, id: i + 1 }));

  const parsed = projectSchema.array().safeParse(withIds);
  if (!parsed.success) {
    throw new Error(formatZodError("projects", parsed.error));
  }
  return parsed.data;
}

export async function loadProfile(): Promise<ProfileData> {
  const profilePath = path.join(CONTENT_DIR, "profile.json");
  const raw = await fs.readFile(profilePath, "utf-8");
  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch (e) {
    throw new Error(`profile.json is not valid JSON: ${(e as Error).message}`);
  }
  const parsed = profileSchema.safeParse(json);
  if (!parsed.success) {
    throw new Error(formatZodError("profile", parsed.error));
  }
  return parsed.data;
}

async function copyDir(src: string, dest: string): Promise<void> {
  await fs.mkdir(dest, { recursive: true });
  let entries: string[];
  try {
    entries = await fs.readdir(src);
  } catch {
    return;
  }
  for (const entry of entries) {
    const from = path.join(src, entry);
    const to = path.join(dest, entry);
    const stat = await fs.stat(from);
    if (stat.isDirectory()) {
      await copyDir(from, to);
    } else {
      await fs.copyFile(from, to);
    }
  }
}

export async function exportStaticContent(): Promise<{
  profile: ProfileData;
  projects: ProjectData[];
  services: ServiceData[];
  features: FeatureData[];
}> {
  await fs.mkdir(DATA_DIR, { recursive: true });

  const [profile, projects, services, features] = await Promise.all([
    loadProfile(),
    loadProjects(),
    loadServices(),
    loadFeatures(),
  ]);

  const bundle = portfolioExportSchema.safeParse({
    profile,
    projects,
    services,
    features,
  });
  if (!bundle.success) {
    throw new Error(formatZodError("portfolio export", bundle.error));
  }

  await Promise.all([
    fs.writeFile(path.join(DATA_DIR, "profile.json"), JSON.stringify(bundle.data.profile, null, 2)),
    fs.writeFile(
      path.join(DATA_DIR, "projects.json"),
      JSON.stringify(bundle.data.projects, null, 2),
    ),
    fs.writeFile(
      path.join(DATA_DIR, "services.json"),
      JSON.stringify(bundle.data.services, null, 2),
    ),
    fs.writeFile(
      path.join(DATA_DIR, "features.json"),
      JSON.stringify(bundle.data.features, null, 2),
    ),
  ]);

  await copyDir(UPLOADS_SRC, UPLOADS_DEST);

  return bundle.data;
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  exportStaticContent()
    .then(({ profile, projects, services, features }) => {
      console.log(
        `Exported static content: profile=${profile.name}, projects=${projects.length}, services=${services.length}, features=${features.length}`,
      );
    })
    .catch((err) => {
      console.error("Failed to export static content:", err);
      process.exit(1);
    });
}
