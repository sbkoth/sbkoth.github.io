import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express) {
  app.get("/api/profile", async (_req, res) => {
    const profile = await storage.getProfile();
    res.json(profile);
  });

  app.get("/api/blog-posts", async (_req, res) => {
    const posts = await storage.getBlogPosts();
    res.json(posts);
  });

  app.get("/api/projects", async (_req, res) => {
    const projects = await storage.getProjects();
    res.json(projects);
  });

  const httpServer = createServer(app);
  return httpServer;
}