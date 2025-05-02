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
      <div className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent inline-block">
              Featured Projects
            </h2>
            <div className="h-1 w-24 bg-primary/30 mx-auto rounded-full mb-6"></div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Explore our portfolio of innovative projects and successful client solutions
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <Card 
                key={project.id} 
                className="group hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-[1.03] border-t-4 border-t-primary overflow-hidden animate-fade-in"
                onClick={() => setSelectedProject(project)}
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                  animationFillMode: 'backwards'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader className="space-y-1 pb-2 relative z-10">
                  <div>
                    <CardTitle className="group-hover:text-primary transition-colors duration-300">
                      {project.title}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                      <span className="inline-block h-2 w-2 rounded-full bg-primary/60"></span>
                      {format(new Date(project.publishedAt), 'MMMM d, yyyy')}
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <p className="text-muted-foreground line-clamp-3 group-hover:text-foreground/90 transition-colors duration-300 leading-relaxed">
                    {project.description}
                  </p>
                  <div className="mt-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm font-medium flex items-center">
                    <span>Read case study</span>
                    <span className="ml-1 transform group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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