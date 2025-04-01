import type { Project, Profile, BlogPost, InsertBlogPost, Feature } from "@shared/schema";
import { projects, profile, blogPosts } from "@shared/schema";
import { db } from "./db";
import { loadBlogPosts } from "./blog-utils";
import { loadProjects } from "./project-utils";
import { loadServices, type Service } from "./services-utils";
import { loadFeatures } from "./features-utils";
import { cacheService } from "./cache-service";

export interface IStorage {
  getProfile(): Promise<Profile>;
  getProjects(): Promise<Project[]>;
  getBlogPosts(): Promise<BlogPost[]>;
  getServices(): Promise<Service[]>;
  syncBlogPosts(): Promise<void>;
  syncProjects(): Promise<void>;
  getFeatures(): Promise<Feature[]>;
}

export class DatabaseStorage implements IStorage {
  async getProfile(): Promise<Profile> {
    const cached = cacheService.get('profile');
    if (cached) return cached;

    const [profileData] = await db.select().from(profile);
    cacheService.set('profile', profileData);
    return profileData;
  }

  async getProjects(): Promise<Project[]> {
    const cached = cacheService.get('projects');
    if (cached) return cached;

    const projectsData = await db.select().from(projects);
    cacheService.set('projects', projectsData);
    return projectsData;
  }

  // Admin-related methods have been removed

  async getBlogPosts(): Promise<BlogPost[]> {
    const cached = cacheService.get('blogPosts');
    if (cached) return cached;

    const posts = await db.select().from(blogPosts);
    cacheService.set('blogPosts', posts);
    return posts;
  }

  async syncBlogPosts(): Promise<void> {
    const posts = await loadBlogPosts();
    await db.delete(blogPosts);
    if (posts.length > 0) {
      // Process and insert blog posts one by one
      for (const post of posts) {
        await db.insert(blogPosts).values({
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          publishedAt: post.publishedAt,
          thumbnail: post.thumbnail
        });
      }
    }
    // Invalidate blog posts cache after sync
    cacheService.invalidate('blogPosts');
  }

  async syncProjects(): Promise<void> {
    const projectsList = await loadProjects();
    await db.delete(projects);
    if (projectsList.length > 0) {
      // Process and insert projects one by one
      for (const project of projectsList) {
        // Prepare the data with proper type handling
        const projectData = {
          slug: project.slug,
          title: project.title,
          description: project.description,
          content: project.content,
          publishedAt: project.publishedAt ? new Date(project.publishedAt) : new Date(),
          thumbnail: project.thumbnail,
          type: project.type as "image" | "pdf" | "slides" | "text",
          challenge: project.challenge || null,
          approach: project.approach || null,
          implementation: project.implementation || null,
          outcomes: project.outcomes || [],
          clientTestimonial: project.clientTestimonial || null,
          technologies: project.technologies || []
        };
        
        await db.insert(projects).values(projectData);
      }
    }
    // Invalidate projects cache after sync
    cacheService.invalidate('projects');
  }

  async getServices(): Promise<Service[]> {
    const cached = cacheService.get('services');
    if (cached) return cached;

    const services = await loadServices();
    cacheService.set('services', services);
    return services;
  }

  async getFeatures(): Promise<Feature[]> {
    const cached = cacheService.get('features');
    if (cached) return cached;

    const features = await loadFeatures();
    cacheService.set('features', features);
    return features;
  }
}

export const storage = new DatabaseStorage();