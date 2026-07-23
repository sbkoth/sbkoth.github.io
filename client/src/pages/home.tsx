import { useQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import Hero from "@/components/hero";
import Services from "@/components/services";
import ProjectGrid from "@/components/project-grid";
import Contact from "@/components/contact";
import Features from "@/components/features";
import { dataUrl } from "@/lib/static-data";
import type { Profile, Project } from "@shared/schema";

const LoadingSkeleton = () => (
  <div className="tui-shell">
    <div className="tui-window flex items-center justify-center p-10 text-sm text-primary">
      <span className="text-muted-foreground">booting portfolio</span>
      <span className="tui-blink ml-2 inline-block h-4 w-2 bg-primary" />
    </div>
  </div>
);

export default function Home() {
  const { data: profile, isError: profileError } = useQuery<Profile>({
    queryKey: [dataUrl("profile")],
  });

  const { data: projects, isError: projectsError } = useQuery<Project[]>({
    queryKey: [dataUrl("projects")],
  });

  if (profileError || projectsError) {
    return (
      <div className="tui-shell">
        <div className="tui-window flex items-center justify-center p-10 text-sm">
          <p>
            <span className="text-destructive">error:</span> failed to load content
          </p>
        </div>
      </div>
    );
  }

  if (!profile || !projects) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="tui-shell">
      <div className="tui-window">
        <div className="tui-titlebar">
          <span className="flex items-center gap-1.5" aria-hidden>
            <span className="tui-dot tui-dot-red" />
            <span className="tui-dot tui-dot-yellow" />
            <span className="tui-dot tui-dot-green" />
          </span>
          <span className="ml-2 truncate text-primary/90">
            visitor@sbkoth — portfolio
          </span>
          <span className="ml-auto hidden text-[10px] tracking-wide text-muted-foreground sm:inline">
            bash · zsh · tty1
          </span>
        </div>

        <div className="tui-body">
          <Suspense fallback={<LoadingSkeleton />}>
            <Hero profile={profile} />
            <Features />
            <Services />
            <ProjectGrid projects={projects} />
            <Contact profile={profile} />
          </Suspense>

          <footer className="flex items-center justify-between gap-2 px-4 py-3 text-[11px] text-muted-foreground sm:px-6">
            <span>
              <span className="text-primary">$</span> exit 0
            </span>
            <span>
              © {new Date().getFullYear()} {profile.name}
            </span>
          </footer>
        </div>
      </div>
    </div>
  );
}
