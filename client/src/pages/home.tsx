import { useQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import Hero from "@/components/hero";
import Services from "@/components/services";
import ProjectGrid from "@/components/project-grid";
import Contact from "@/components/contact";
import Features from "@/components/features";
import { Skeleton } from "@/components/ui/skeleton";
import type { Profile, Project } from "@shared/schema";

// Loading skeleton component
const LoadingSkeleton = () => (
  <div className="space-y-8 p-4">
    <Skeleton className="h-[400px] w-full" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Skeleton className="h-[200px]" />
      <Skeleton className="h-[200px]" />
    </div>
  </div>
);

export default function Home() {
  const { data: profile, isError: profileError } = useQuery<Profile>({ 
    queryKey: ["/api/profile"]
  });

  const { data: projects, isError: projectsError } = useQuery<Project[]>({
    queryKey: ["/api/projects"]
  });

  if (profileError || projectsError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-destructive">Failed to load content. Please try again later.</p>
      </div>
    );
  }

  if (!profile || !projects) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<LoadingSkeleton />}>
        <Hero profile={profile} />
        <Features />
        <Services />
        <ProjectGrid projects={projects} />
        <Contact profile={profile} />
      </Suspense>
    </div>
  );
}