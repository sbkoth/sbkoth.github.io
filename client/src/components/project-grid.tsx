import React, { useState } from "react";
import type { Project } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ContentDialog from "./content-dialog";
import { format } from "date-fns";

interface ProjectGridProps {
  projects: Project[];
}

function ProjectGridComponent({ projects }: ProjectGridProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <>
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8">Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card 
              key={project.id} 
              className="group hover:shadow-lg transition-all cursor-pointer hover:scale-[1.02] border-t-4 border-t-primary"
              onClick={() => setSelectedProject(project)}
            >
              <CardHeader className="space-y-1">
                <div>
                  <CardTitle className="group-hover:text-primary transition-colors">
                    {project.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {format(new Date(project.publishedAt), 'MMMM d, yyyy')}
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground line-clamp-3">{project.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {selectedProject && (
        <ContentDialog
          title={selectedProject.title}
          content={selectedProject.content}
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </>
  );
}

// Export a memoized version of the component to prevent unnecessary re-renders
export default React.memo(ProjectGridComponent);