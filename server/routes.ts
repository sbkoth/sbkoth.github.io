import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import fileUpload from "express-fileupload";
import path from "path";
import fs from "fs";
import fsPromises from "fs/promises";
import express from "express";
import { ensureBlogDir } from "./blog-utils";

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
      const projectFile = req.files.file;
      const thumbnailFile = req.files.thumbnail;

      if (!Array.isArray(projectFile) && projectFile) {
        const filename = `${Date.now()}-${projectFile.name}`;
        const filepath = path.join(UPLOAD_DIR, filename);
        await projectFile.mv(filepath);
        data.content = { url: `/uploads/${filename}` };
      }

      if (!Array.isArray(thumbnailFile) && thumbnailFile) {
        const filename = `${Date.now()}-${thumbnailFile.name}`;
        const filepath = path.join(UPLOAD_DIR, filename);
        await thumbnailFile.mv(filepath);
        data.thumbnail = `/uploads/${filename}`;
      }

      const project = await storage.createProject(data);
      res.json(project);
    } catch (error) {
      console.error("Error uploading project:", error);
      res.status(500).json({ message: "Failed to upload project" });
    }
  });

  app.post("/api/profile/photo", async (req, res) => {
    try {
      // Copy the photo from attached_assets to uploads
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

  // Serve uploaded files
  app.use("/uploads", express.static(UPLOAD_DIR));

  const httpServer = createServer(app);
  await ensureBlogDir();
  await storage.syncBlogPosts();
  return httpServer;
}