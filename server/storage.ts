import type { Project, Profile, InsertProject, BlogPost, InsertBlogPost, Feature, ProcessStep } from "@shared/schema";
import { projects, profile, blogPosts } from "@shared/schema";
import { db } from "./db";
import { loadBlogPosts } from "./blog-utils";
import { loadProjects } from "./project-utils";
import { loadServices, type Service } from "./services-utils";
import { loadTestimonials, type Testimonial } from "./testimonials-utils";
import { loadFeatures } from "./features-utils"; // Assumed file
import { loadProcess } from "./process-utils"; // Assumed file


export interface IStorage {
  getProfile(): Promise<Profile>;
  getProjects(): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProfilePhoto(photoUrl: string): Promise<Profile>;
  getBlogPosts(): Promise<BlogPost[]>;
  getServices(): Promise<Service[]>;
  getTestimonials(): Promise<Testimonial[]>;
  syncBlogPosts(): Promise<void>;
  syncProjects(): Promise<void>;
  getFeatures(): Promise<Feature[]>;
  getProcess(): Promise<ProcessStep[]>;
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

  async syncProjects(): Promise<void> {
    const projectsList = await loadProjects();

    // Clear existing projects and insert new ones
    await db.delete(projects);
    if (projectsList.length > 0) {
      await db.insert(projects).values(projectsList);
    }
  }
  async getServices(): Promise<Service[]> {
    return loadServices();
  }

  async getTestimonials(): Promise<Testimonial[]> {
    return loadTestimonials();
  }
  async getFeatures(): Promise<Feature[]> {
    return loadFeatures();
  }

  async getProcess(): Promise<ProcessStep[]> {
    return loadProcess();
  }
}

export const storage = new DatabaseStorage();