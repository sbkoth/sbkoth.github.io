import { pgTable, text, serial, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const profile = pgTable("profile", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  title: text("title").notNull(),
  bio: text("bio").notNull(),
  avatar: text("avatar").notNull(),
  socials: jsonb("socials").$type<{
    github?: string;
    linkedin?: string;
    twitter?: string;
    email: string;
  }>().notNull(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  content: text("content").notNull(),
  publishedAt: timestamp("published_at").notNull().defaultNow(),
  thumbnail: text("thumbnail").notNull(),
  type: text("type", { enum: ["image", "pdf", "slides", "text"] }).notNull(),
  challenge: text("challenge"),
  approach: text("approach"),
  implementation: text("implementation"),
  outcomes: jsonb("outcomes").$type<string[]>(),
  clientTestimonial: jsonb("client_testimonial").$type<{
    quote: string;
    author: string;
    role: string;
    company: string;
  }>(),
  technologies: jsonb("technologies").$type<string[]>(),
});

// Feature schema
export const featureSchema = z.object({
  title: z.string(),
  icon: z.string(),
  description: z.string(),
  highlights: z.array(z.string()),
  content: z.string(),
});

// Project schemas
export const insertProjectSchema = createInsertSchema(projects)
  .omit({ id: true })
  .extend({
    thumbnailFile: z.any().optional(),
  });

export const insertProfileSchema = createInsertSchema(profile).omit({ id: true });

// Type exports
export type Project = typeof projects.$inferSelect;
export type Profile = typeof profile.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Feature = z.infer<typeof featureSchema>;