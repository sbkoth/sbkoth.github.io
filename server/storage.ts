import type { Project, Profile, InsertProject, BlogPost, InsertBlogPost, Feature } from "@shared/schema";
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
  createProject(project: InsertProject): Promise<Project>;
  updateProfilePhoto(photoUrl: string): Promise<Profile>;
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

  async createProject(insertProject: InsertProject): Promise<Project> {
    // Explicitly extract only the fields defined in the schema
    const projectData = {
      title: insertProject.title,
      slug: insertProject.slug,
      description: insertProject.description,
      content: insertProject.content,
      thumbnail: insertProject.thumbnail,
      type: insertProject.type,
      publishedAt: insertProject.publishedAt,
      challenge: insertProject.challenge,
      approach: insertProject.approach,
      implementation: insertProject.implementation,
      outcomes: insertProject.outcomes,
      technologies: insertProject.technologies,
    };
    
    // Insert as a single record (not an array)
    const [project] = await db
      .insert(projects)
      .values(projectData)
      .returning();

    // Invalidate projects cache when new project is created
    cacheService.invalidate('projects');
    return project;
  }

  async updateProfilePhoto(photoUrl: string): Promise<Profile> {
    const [updatedProfile] = await db
      .update(profile)
      .set({ avatar: photoUrl })
      .returning();

    // Invalidate profile cache when photo is updated
    cacheService.invalidate('profile');
    return updatedProfile;
  }

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
      // Insert posts one by one with properly typed fields
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
      // Insert projects one by one with properly typed fields
      for (const project of projectsList) {
        await db.insert(projects).values({
          title: project.title,
          slug: project.slug,
          description: project.description,
          content: project.content,
          thumbnail: project.thumbnail,
          type: project.type,
          publishedAt: project.publishedAt,
          challenge: project.challenge,
          approach: project.approach,
          implementation: project.implementation,
          outcomes: project.outcomes,
          technologies: project.technologies
        });
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