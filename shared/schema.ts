import { z } from "zod";

export const socialsSchema = z.object({
  github: z.string().optional(),
  linkedin: z.string().optional(),
  twitter: z.string().optional(),
  email: z.string().min(1),
});

export const profileSchema = z.object({
  id: z.number(),
  name: z.string().min(1),
  title: z.string().min(1),
  bio: z.string().min(1),
  avatar: z.string().min(1),
  socials: socialsSchema,
});

export const projectTypeSchema = z.enum(["image", "pdf", "slides", "text"]);

export const clientTestimonialSchema = z.object({
  quote: z.string(),
  author: z.string(),
  role: z.string(),
  company: z.string(),
});

export const projectSchema = z.object({
  id: z.number(),
  slug: z.string().min(1),
  title: z.string().min(1),
  description: z.string(),
  content: z.string(),
  publishedAt: z.union([z.string(), z.date()]),
  thumbnail: z.string(),
  type: projectTypeSchema,
  challenge: z.string().nullable().optional(),
  approach: z.string().nullable().optional(),
  implementation: z.string().nullable().optional(),
  outcomes: z.array(z.string()).nullable().optional(),
  clientTestimonial: clientTestimonialSchema.nullable().optional(),
  technologies: z.array(z.string()).nullable().optional(),
});

export const featureSchema = z.object({
  title: z.string().min(1),
  icon: z.string(),
  description: z.string(),
  highlights: z.array(z.string()),
  content: z.string(),
});

export const serviceSchema = z.object({
  title: z.string().min(1),
  icon: z.string(),
  description: z.string(),
  content: z.string(),
});

/** Full static portfolio payload shape written by export-content. */
export const portfolioExportSchema = z.object({
  profile: profileSchema,
  projects: z.array(projectSchema),
  services: z.array(serviceSchema),
  features: z.array(featureSchema),
});

export const insertProjectSchema = projectSchema.omit({ id: true }).extend({
  thumbnailFile: z.unknown().optional(),
});

export const insertProfileSchema = profileSchema.omit({ id: true });

export type Project = z.infer<typeof projectSchema>;
export type Profile = z.infer<typeof profileSchema>;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Feature = z.infer<typeof featureSchema>;
export type Service = z.infer<typeof serviceSchema>;
export type PortfolioExport = z.infer<typeof portfolioExportSchema>;
