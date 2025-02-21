import { pgTable, text, serial, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Add admin users table for CMS authentication
export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  password: text("password").notNull(), // Will be hashed
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type", { enum: ["image", "pdf", "slides", "text"] }).notNull(),
  content: jsonb("content").notNull(),
  thumbnail: text("thumbnail").notNull(),
  order: serial("order").notNull(),
});

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

export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  excerpt: text("excerpt").notNull(),
  publishedAt: timestamp("published_at").notNull(),
  thumbnail: text("thumbnail").notNull(),
});

// Export schemas
export const insertProjectSchema = createInsertSchema(projects).omit({ id: true, order: true });
export const insertProfileSchema = createInsertSchema(profile).omit({ id: true });
export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({ id: true });
export const insertAdminUserSchema = createInsertSchema(adminUsers).omit({ id: true, createdAt: true });

// Export types
export type Project = typeof projects.$inferSelect;
export type Profile = typeof profile.$inferSelect;
export type BlogPost = typeof blogPosts.$inferSelect;
export type AdminUser = typeof adminUsers.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;