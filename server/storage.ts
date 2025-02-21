import type { Project, Profile, InsertProject, BlogPost, InsertBlogPost } from "@shared/schema";
import { projects, profile, blogPosts } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { loadBlogPosts } from "./blog-utils";

export interface IStorage {
  getProfile(): Promise<Profile>;
  getProjects(): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProfilePhoto(photoUrl: string): Promise<Profile>;
  getBlogPosts(): Promise<BlogPost[]>;
  syncBlogPosts(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getProfile(): Promise<Profile> {
    const [profileData] = await db.select().from(profile);
    return profileData;
  }

  async getProjects(): Promise<Project[]> {
    return db.select().from(projects);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const [project] = await db
      .insert(projects)
      .values(insertProject)
      .returning();
    return project;
  }

  async updateProfilePhoto(photoUrl: string): Promise<Profile> {
    const [updatedProfile] = await db
      .update(profile)
      .set({ avatar: photoUrl })
      .returning();
    return updatedProfile;
  }

  async getBlogPosts(): Promise<BlogPost[]> {
    return db.select().from(blogPosts);
  }

  async syncBlogPosts(): Promise<void> {
    const posts = await loadBlogPosts();

    // Clear existing posts and insert new ones
    await db.delete(blogPosts);
    if (posts.length > 0) {
      await db.insert(blogPosts).values(posts);
    }
  }
}

export const storage = new DatabaseStorage();