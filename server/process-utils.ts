import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

const PROCESS_DIR = path.join(process.cwd(), "content", "process");

export interface ProcessStep {
  title: string;
  order: number;
  icon: string;
  description: string;
  steps: string[];
  content: string;
}

export async function ensureProcessDir() {
  try {
    await fs.access(PROCESS_DIR);
  } catch {
    await fs.mkdir(PROCESS_DIR, { recursive: true });
  }
}

export async function loadProcess(): Promise<ProcessStep[]> {
  await ensureProcessDir();
  
  const files = await fs.readdir(PROCESS_DIR);
  const steps: ProcessStep[] = [];

  for (const file of files) {
    if (!file.endsWith(".md")) continue;

    const content = await fs.readFile(path.join(PROCESS_DIR, file), "utf-8");
    const { data, content: markdown } = matter(content);

    steps.push({
      title: data.title,
      order: data.order,
      icon: data.icon,
      description: data.description,
      steps: data.steps || [],
      content: markdown,
    });
  }

  // Sort by order
  return steps.sort((a, b) => a.order - b.order);
}
