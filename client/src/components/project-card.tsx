import { useState } from "react";
import type { Project } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import PdfViewer from "./pdf-viewer";
import SlideViewer from "./slide-viewer";
import CaseStudy from "./case-study";
import { ArrowRight } from "lucide-react";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const [open, setOpen] = useState(false);

  const renderContent = () => {
    switch (project.type) {
      case "image":
        return (
          <img 
            src={project.content.url} 
            alt={project.title}
            className="w-full h-full object-cover"
          />
        );
      case "pdf":
        return <PdfViewer url={project.content.url} />;
      case "slides":
        return <SlideViewer slides={project.content.slides} />;
      case "text":
        return <CaseStudy project={project} />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Card className="cursor-pointer group hover:shadow-lg transition-shadow">
          <CardHeader className="space-y-1">
            <div className="flex justify-between items-start">
              <CardTitle>{project.title}</CardTitle>
              <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </CardHeader>
          <CardContent>
            <img 
              src={project.thumbnail} 
              alt={project.title}
              className="w-full aspect-video object-cover rounded-md mb-4"
            />
            <p className="text-sm text-muted-foreground mb-4">
              {project.description}
            </p>
            {project.technologies && (
              <div className="flex flex-wrap gap-2">
                {project.technologies.slice(0, 3).map((tech) => (
                  <Badge key={tech} variant="secondary" className="text-xs">
                    {tech}
                  </Badge>
                ))}
                {project.technologies.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{project.technologies.length - 3} more
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}