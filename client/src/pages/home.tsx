import { useQuery } from "@tanstack/react-query";
import Hero from "@/components/hero";
import Services from "@/components/services";
import ProjectGrid from "@/components/project-grid";
import Testimonials from "@/components/testimonials";
import BlogSection from "@/components/blog-section";
import Contact from "@/components/contact";
import type { Profile, Project, BlogPost } from "@shared/schema";

export default function Home() {
  const { data: profile } = useQuery<Profile>({ 
    queryKey: ["/api/profile"]
  });

  const { data: projects } = useQuery<Project[]>({
    queryKey: ["/api/projects"]
  });

  const { data: posts } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog-posts"]
  });

  if (!profile || !projects || !posts) {
    return null; // Add loading skeleton later if needed
  }

  return (
    <div className="min-h-screen bg-background">
      <Hero profile={profile} />
      <Services />
      <ProjectGrid projects={projects} />
      <Testimonials />
      <BlogSection posts={posts} />
      <Contact profile={profile} />
    </div>
  );
}