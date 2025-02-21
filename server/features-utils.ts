import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

const FEATURES_DIR = path.join(process.cwd(), "content", "features");

export interface Feature {
  title: string;
  icon: string;
  description: string;
  highlights: string[];
  content: string;
}

export async function ensureFeaturesDir() {
  try {
    await fs.access(FEATURES_DIR);
  } catch {
    await fs.mkdir(FEATURES_DIR, { recursive: true });
  }
}

export async function loadFeatures(): Promise<Feature[]> {
  await ensureFeaturesDir();
  
  const files = await fs.readdir(FEATURES_DIR);
  const features: Feature[] = [];

  for (const file of files) {
    if (!file.endsWith(".md")) continue;

    const content = await fs.readFile(path.join(FEATURES_DIR, file), "utf-8");
    const { data, content: markdown } = matter(content);

    features.push({
      title: data.title,
      icon: data.icon,
      description: data.description,
      highlights: data.highlights || [],
      content: markdown,
    });
  }

  return features;
}
