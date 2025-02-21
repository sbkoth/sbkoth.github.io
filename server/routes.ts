import type { Express } from "express";
import { createServer } from "http";
import passport from "./auth";
import { requireAuth } from "./auth";
import { db } from "./db";
import { 
  profile,
  projects,
  blogPosts,
  insertProfileSchema,
  insertProjectSchema,
  insertBlogPostSchema
} from "@shared/schema";
import { eq } from "drizzle-orm";
import { storage } from "./storage";

export async function registerRoutes(app: Express) {
  // Public routes
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

  // Authentication routes
  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    res.json({ message: "Logged in successfully" });
  });

  app.post("/api/logout", (req, res) => {
    req.logout(() => {
      res.json({ message: "Logged out successfully" });
    });
  });

  // Protected routes
  app.patch("/api/profile", requireAuth, async (req, res) => {
    const data = insertProfileSchema.parse(req.body);
    await db.update(profile).set(data).where(eq(profile.id, 1));
    res.json({ message: "Profile updated successfully" });
  });

  app.post("/api/projects", requireAuth, async (req, res) => {
    const data = insertProjectSchema.parse(req.body);
    const newProject = await db.insert(projects).values(data).returning();
    res.json(newProject[0]);
  });

  app.patch("/api/projects/:id", requireAuth, async (req, res) => {
    const id = parseInt(req.params.id);
    const data = insertProjectSchema.parse(req.body);
    await db.update(projects).set(data).where(eq(projects.id, id));
    res.json({ message: "Project updated successfully" });
  });

  app.delete("/api/projects/:id", requireAuth, async (req, res) => {
    const id = parseInt(req.params.id);
    await db.delete(projects).where(eq(projects.id, id));
    res.json({ message: "Project deleted successfully" });
  });

  app.post("/api/blog-posts", requireAuth, async (req, res) => {
    const data = insertBlogPostSchema.parse(req.body);
    const newPost = await db.insert(blogPosts).values(data).returning();
    res.json(newPost[0]);
  });

  app.patch("/api/blog-posts/:id", requireAuth, async (req, res) => {
    const id = parseInt(req.params.id);
    const data = insertBlogPostSchema.parse(req.body);
    await db.update(blogPosts).set(data).where(eq(blogPosts.id, id));
    res.json({ message: "Blog post updated successfully" });
  });

  app.delete("/api/blog-posts/:id", requireAuth, async (req, res) => {
    const id = parseInt(req.params.id);
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
    res.json({ message: "Blog post deleted successfully" });
  });

  const httpServer = createServer(app);
  return httpServer;
}