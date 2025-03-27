import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";
import type { InsertBlogPost } from "@shared/schema";

const BLOG_DIR = path.join(process.cwd(), "content", "blogs");

export async function ensureBlogDir() {
  try {
    await fs.access(BLOG_DIR);
  } catch {
    await fs.mkdir(BLOG_DIR, { recursive: true });
  }
}

export async function loadBlogPosts(): Promise<InsertBlogPost[]> {
  await ensureBlogDir();
  
  const files = await fs.readdir(BLOG_DIR);
  const posts: InsertBlogPost[] = [];

  for (const file of files) {
    if (!file.endsWith(".md")) continue;

    const content = await fs.readFile(path.join(BLOG_DIR, file), "utf-8");
    const { data, content: markdown } = matter(content);
    // Convert Promise<string> to string using await
    const html = await Promise.resolve(marked(markdown));

    posts.push({
      slug: file.replace(".md", ""),
      title: data.title,
      excerpt: data.excerpt,
      content: html,
      publishedAt: new Date(data.publishedAt || Date.now()),
      thumbnail: data.thumbnail || "/placeholder.jpg",
    });
  }

  return posts;
}
