import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";
import type { InsertProject } from "@shared/schema";

const PROJECT_DIR = path.join(process.cwd(), "content", "projects");

export async function ensureProjectDir() {
  try {
    await fs.access(PROJECT_DIR);
  } catch {
    await fs.mkdir(PROJECT_DIR, { recursive: true });
  }
}

export async function loadProjects(): Promise<InsertProject[]> {
  await ensureProjectDir();
  
  const files = await fs.readdir(PROJECT_DIR);
  const projects: InsertProject[] = [];

  for (const file of files) {
    if (!file.endsWith(".md")) continue;

    const content = await fs.readFile(path.join(PROJECT_DIR, file), "utf-8");
    const { data, content: markdown } = matter(content);
    const html = await marked(markdown);

    projects.push({
      slug: file.replace(".md", ""),
      title: data.title,
      description: data.description,
      content: html,
      publishedAt: new Date(data.publishedAt || Date.now()),
      thumbnail: data.thumbnail || "/placeholder.jpg",
      type: data.type || "text",
    });
  }

  return projects;
}
