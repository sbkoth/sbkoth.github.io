import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import fileUpload from "express-fileupload";
import path from "path";
import fs from "fs";
import fsPromises from "fs/promises";
import express from "express";
import { ensureBlogDir } from "./blog-utils";
import { ensureProjectDir } from "./project-utils";

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
    const profile = await storage.getProfile();
    res.json(profile);
  });

  app.get("/api/projects", async (_req, res) => {
    const projects = await storage.getProjects();
    res.json(projects);
  });

  app.post("/api/projects", async (req, res) => {
    try {
      if (!req.files || !req.body.data) {
        return res.status(400).json({ message: "Missing required files or data" });
      }

      const data = JSON.parse(req.body.data);
      const thumbnailFile = req.files.thumbnail;

      // Handle thumbnail upload
      if (!Array.isArray(thumbnailFile) && thumbnailFile) {
        const filename = `${Date.now()}-${thumbnailFile.name}`;
        const filepath = path.join(UPLOAD_DIR, filename);
        await thumbnailFile.mv(filepath);
        data.thumbnail = `/uploads/${filename}`;
      }

      // Create the project
      const project = await storage.createProject(data);
      res.json(project);
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(500).json({ message: "Failed to create project" });
    }
  });

  app.post("/api/profile/photo", async (req, res) => {
    try {
      const sourcePhotoPath = path.join(process.cwd(), "attached_assets", "sbk-profile-photo-small.jpg");
      const targetFilename = `${Date.now()}-profile-photo.jpg`;
      const targetPhotoPath = path.join(UPLOAD_DIR, targetFilename);

      await fsPromises.copyFile(sourcePhotoPath, targetPhotoPath);
      await storage.updateProfilePhoto(`/uploads/${targetFilename}`);
      res.json({ url: `/uploads/${targetFilename}` });
    } catch (error) {
      console.error("Error uploading profile photo:", error);
      res.status(500).json({ message: "Failed to upload photo" });
    }
  });

  app.get("/api/blog-posts", async (_req, res) => {
    const posts = await storage.getBlogPosts();
    res.json(posts);
  });

  app.get("/api/services", async (_req, res) => {
    const services = await storage.getServices();
    res.json(services);
  });

  app.get("/api/testimonials", async (_req, res) => {
    const testimonials = await storage.getTestimonials();
    res.json(testimonials);
  });

  // Add new routes
  app.get("/api/features", async (_req, res) => {
    const features = await storage.getFeatures();
    res.json(features);
  });

  app.get("/api/process", async (_req, res) => {
    const process = await storage.getProcess();
    res.json(process);
  });

  // Serve uploaded files
  app.use("/uploads", express.static(UPLOAD_DIR));

  const httpServer = createServer(app);
  await ensureBlogDir();
  await ensureProjectDir();
  await storage.syncBlogPosts();
  await storage.syncProjects();
  return httpServer;
}