import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import fileUpload from "express-fileupload";
import path from "path";
import fs from "fs";
import fsPromises from "fs/promises";
import express from "express";
import { ensureProjectDir } from "./project-utils";
import { cacheService } from "./cache-service";

const UPLOAD_DIR = path.join(process.cwd(), "uploads");

// Create uploads directory if it doesn't exist
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export async function registerRoutes(app: Express) {
  // File upload middleware
  app.use(fileUpload({
    createParentPath: true,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max file size
  }));

  app.get("/api/profile", async (_req, res) => {
    // Invalidate the cache to force fresh data fetch
    cacheService.invalidate('profile');
    const profile = await storage.getProfile();
    res.json(profile);
  });

  app.get("/api/projects", async (_req, res) => {
    const projects = await storage.getProjects();
    res.json(projects);
  });

  // Admin-related endpoints have been removed

  app.get("/api/services", async (_req, res) => {
    const services = await storage.getServices();
    res.json(services);
  });

  // Features route
  app.get("/api/features", async (_req, res) => {
    const features = await storage.getFeatures();
    res.json(features);
  });
  
  // Cache control endpoint
  app.get("/api/cache/clear", async (_req, res) => {
    cacheService.clear();
    res.json({ success: true, message: "Cache cleared successfully" });
  });

  // Serve uploaded files
  app.use("/uploads", express.static(UPLOAD_DIR));

  const httpServer = createServer(app);
  await ensureProjectDir();
  await storage.syncProjects();
  return httpServer;
}