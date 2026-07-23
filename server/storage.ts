import type { Feature, Profile, Project } from "@shared/schema";
import {
  loadFeatures,
  loadProjects as loadMarkdownProjects,
  loadProfile,
  loadServices,
  type ServiceData,
} from "../scripts/export-content";
import { cacheService } from "./cache-service";

export type Service = ServiceData;

export interface IStorage {
  getProfile(): Promise<Profile>;
  getProjects(): Promise<Project[]>;
  getServices(): Promise<Service[]>;
  syncProjects(): Promise<void>;
  getFeatures(): Promise<Feature[]>;
}

/**
 * File-backed storage for local dev and static export parity.
 * Public portfolio content lives in markdown + content/profile.json — no DB required.
 */
export class FileStorage implements IStorage {
  async getProfile(): Promise<Profile> {
    const cached = cacheService.get("profile");
    if (cached) return cached;

    const profileData = (await loadProfile()) as Profile;
    cacheService.set("profile", profileData);
    return profileData;
  }

  async getProjects(): Promise<Project[]> {
    const cached = cacheService.get("projects");
    if (cached) return cached;

    const list = await loadMarkdownProjects();
    const projectsData = list.map((p) => ({
      ...p,
      publishedAt: new Date(p.publishedAt),
      type: p.type as Project["type"],
    })) as Project[];
    cacheService.set("projects", projectsData);
    return projectsData;
  }

  async syncProjects(): Promise<void> {
    // No-op: projects are read from markdown on each cache miss.
    cacheService.invalidate("projects");
  }

  async getServices(): Promise<Service[]> {
    const cached = cacheService.get("services");
    if (cached) return cached;

    const services = await loadServices();
    cacheService.set("services", services);
    return services;
  }

  async getFeatures(): Promise<Feature[]> {
    const cached = cacheService.get("features");
    if (cached) return cached;

    const features = await loadFeatures();
    cacheService.set("features", features);
    return features;
  }
}

export const storage = new FileStorage();
