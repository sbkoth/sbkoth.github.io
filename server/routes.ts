import type { Express } from "express";
import express from "express";
import fs from "fs";
import { createServer } from "http";
import path from "path";
import { cacheService } from "./cache-service";
import { storage } from "./storage";

const UPLOAD_DIR = path.join(process.cwd(), "uploads");
const PUBLIC_UPLOAD_DIR = path.join(process.cwd(), "client", "public", "uploads");
const PUBLIC_DATA_DIR = path.join(process.cwd(), "client", "public", "data");

// Ensure uploads directory exists for local assets
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export async function registerRoutes(app: Express) {
  // Static data for GH Pages parity during local Express dev
  if (fs.existsSync(PUBLIC_DATA_DIR)) {
    app.use("/data", express.static(PUBLIC_DATA_DIR));
  }

  app.get("/api/profile", async (_req, res) => {
    cacheService.invalidate("profile");
    const profile = await storage.getProfile();
    res.json(profile);
  });

  app.get("/api/projects", async (_req, res) => {
    const projects = await storage.getProjects();
    res.json(projects);
  });

  app.get("/api/services", async (_req, res) => {
    const services = await storage.getServices();
    res.json(services);
  });

  app.get("/api/features", async (_req, res) => {
    const features = await storage.getFeatures();
    res.json(features);
  });

  app.get("/api/cache/clear", async (_req, res) => {
    cacheService.clear();
    res.json({ success: true, message: "Cache cleared successfully" });
  });

  // Prefer exported public uploads, fall back to root uploads/
  if (fs.existsSync(PUBLIC_UPLOAD_DIR)) {
    app.use("/uploads", express.static(PUBLIC_UPLOAD_DIR));
  }
  app.use("/uploads", express.static(UPLOAD_DIR));

  const httpServer = createServer(app);
  await storage.syncProjects();
  return httpServer;
}
