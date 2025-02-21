import type { Project, Profile, BlogPost } from "@shared/schema";

export interface IStorage {
  getProfile(): Promise<Profile>;
  getProjects(): Promise<Project[]>;
  getBlogPosts(): Promise<BlogPost[]>;
}

export class MemStorage implements IStorage {
  private profile: Profile;
  private projects: Project[];
  private blogPosts: BlogPost[];

  constructor() {
    this.profile = {
      id: 1,
      name: "Sebastian Koth",
      title: "Staff Software Engineer at Shopify",
      bio: "Software engineer with over 14 years of experience, specializing in building scalable applications and cloud infrastructure. Currently leading development teams at Shopify, focusing on e-commerce solutions and developer platforms.",
      avatar: "https://images.unsplash.com/photo-1507679799987-c73779587ccf",
      socials: {
        github: "https://github.com/sbkoth",
        linkedin: "https://linkedin.com/in/sbkoth",
        twitter: "https://twitter.com/sbkoth",
        email: "sebastian@example.com"
      }
    };

    this.blogPosts = [
      {
        id: 1,
        title: "Scaling E-commerce Platforms",
        content: "Full blog post content here...",
        excerpt: "Insights on building and scaling modern e-commerce platforms with cloud infrastructure.",
        publishedAt: new Date("2024-02-15").toISOString(),
        thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee"
      },
      {
        id: 2,
        title: "Developer Experience in Modern Teams",
        content: "Full blog post content here...",
        excerpt: "Exploring best practices for improving developer experience and team productivity.",
        publishedAt: new Date("2024-02-10").toISOString(),
        thumbnail: "https://images.unsplash.com/photo-1504639725590-34d0984388bd"
      }
    ];

    this.projects = [
      {
        id: 1,
        title: "E-commerce Platform",
        description: "A scalable e-commerce solution built with modern cloud infrastructure",
        type: "image",
        content: {
          url: "https://images.unsplash.com/photo-1484981138541-3d074aa97716"
        },
        thumbnail: "https://images.unsplash.com/photo-1484981138541-3d074aa97716",
        order: 1
      },
      {
        id: 2,
        title: "Cloud Architecture Documentation",
        description: "Comprehensive guide on cloud infrastructure design",
        type: "pdf",
        content: {
          url: "https://example.com/sample.pdf"
        },
        thumbnail: "https://images.unsplash.com/photo-1425421669292-0c3da3b8f529",
        order: 2
      },
      {
        id: 3,
        title: "Team Leadership Workshop",
        description: "Training materials for technical team leadership",
        type: "slides",
        content: {
          slides: [
            "https://images.unsplash.com/photo-1710855492709-aa06902e181c",
            "https://images.unsplash.com/photo-1716788781066-7dbce308bbe0",
            "https://images.unsplash.com/photo-1609921212029-bb5a28e60960"
          ]
        },
        thumbnail: "https://images.unsplash.com/photo-1508873535684-277a3cbcc4e8",
        order: 3
      }
    ];
  }

  async getProfile(): Promise<Profile> {
    return this.profile;
  }

  async getBlogPosts(): Promise<BlogPost[]> {
    return this.blogPosts.sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }

  async getProjects(): Promise<Project[]> {
    return this.projects.sort((a, b) => a.order - b.order);
  }
}

export const storage = new MemStorage();