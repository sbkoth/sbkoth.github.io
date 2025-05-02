import type { Project, Profile, Feature } from "@shared/schema";
import { projects, profile } from "@shared/schema";
import { db } from "./db";
import { loadProjects } from "./project-utils";
import { loadServices, type Service } from "./services-utils";
import { loadFeatures } from "./features-utils";
import { cacheService } from "./cache-service";

export interface IStorage {
  getProfile(): Promise<Profile>;
  getProjects(): Promise<Project[]>;
  getServices(): Promise<Service[]>;
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

  async syncProjects(): Promise<void> {
    const projectsList = await loadProjects();
    await db.delete(projects);
    if (projectsList.length > 0) {
      // Prepare all project data for batch insert
      const projectsData = projectsList.map(project => ({
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
      }));
      
      // Insert all projects one by one to ensure type safety
      for (const projectData of projectsData) {
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