import { useQuery } from "@tanstack/react-query";
import Hero from "@/components/hero";
import BlogSection from "@/components/blog-section";
import ProjectGrid from "@/components/project-grid";
import Contact from "@/components/contact";
import type { Profile, Project, BlogPost } from "@shared/schema";

export default function Home() {
  const { data: profile } = useQuery<Profile>({ 
    queryKey: ["/api/profile"]
  });

  const { data: blogPosts } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog-posts"]
  });

  const { data: projects } = useQuery<Project[]>({
    queryKey: ["/api/projects"]
  });

  if (!profile || !projects || !blogPosts) {
    return null; // Add loading skeleton later if needed
  }

  return (
    <div className="min-h-screen bg-background">
      <Hero profile={profile} />
      <BlogSection posts={blogPosts} />
      <ProjectGrid projects={projects} />
      <Contact profile={profile} />
    </div>
  );
}