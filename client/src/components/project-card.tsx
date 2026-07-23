import type { Project } from "@shared/schema";
import { Cloud, Code, Cpu, Database, GitMerge, Network, Server } from "lucide-react";
import { useState } from "react";
import { SiApachekafka, SiDocker, SiGooglecloud, SiKubernetes, SiTerraform } from "react-icons/si";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import CaseStudy from "./case-study";
import PdfViewer from "./pdf-viewer";
import SlideViewer from "./slide-viewer";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const [open, setOpen] = useState(false);

  const renderContent = () => {
    switch (project.type) {
      case "image":
        return (
          <img src={project.content} alt={project.title} className="w-full h-full object-cover" />
        );
      case "pdf":
        return <PdfViewer url={project.content} />;
      case "slides": {
        // For slides, treat content as either a direct URL or a comma-separated list of URLs
        const slideUrls = project.content.includes(",")
          ? project.content.split(",").map((url) => url.trim())
          : [project.content];
        return <SlideViewer slides={slideUrls} />;
      }
      case "text":
        return <CaseStudy project={project} />;
    }
  };

  // Function to determine the primary technology icon for the project
  const getPrimaryTechIcon = () => {
    if (!project.technologies || project.technologies.length === 0) {
      return <Database className="h-5 w-5 text-primary" />;
    }

    const lowerTechs = project.technologies.map((tech) => tech.toLowerCase());

    if (lowerTechs.some((tech) => tech.includes("kubernetes"))) {
      return <SiKubernetes className="h-5 w-5 text-primary" />;
    } else if (lowerTechs.some((tech) => tech.includes("kafka"))) {
      return <SiApachekafka className="h-5 w-5 text-primary" />;
    } else if (lowerTechs.some((tech) => tech.includes("aws"))) {
      return <Cloud className="h-5 w-5 text-primary" />;
    } else if (lowerTechs.some((tech) => tech.includes("google cloud"))) {
      return <SiGooglecloud className="h-5 w-5 text-primary" />;
    } else if (lowerTechs.some((tech) => tech.includes("terraform"))) {
      return <SiTerraform className="h-5 w-5 text-primary" />;
    } else if (lowerTechs.some((tech) => tech.includes("docker"))) {
      return <SiDocker className="h-5 w-5 text-primary" />;
    } else if (lowerTechs.some((tech) => tech.includes("oracle"))) {
      return <Database className="h-5 w-5 text-primary" />;
    } else if (lowerTechs.some((tech) => tech.includes("cloud"))) {
      return <Cloud className="h-5 w-5 text-primary" />;
    } else if (lowerTechs.some((tech) => tech.includes("data"))) {
      return <Database className="h-5 w-5 text-primary" />;
    } else if (lowerTechs.some((tech) => tech.includes("server"))) {
      return <Server className="h-5 w-5 text-primary" />;
    } else if (lowerTechs.some((tech) => tech.includes("network"))) {
      return <Network className="h-5 w-5 text-primary" />;
    } else if (lowerTechs.some((tech) => tech.includes("git"))) {
      return <GitMerge className="h-5 w-5 text-primary" />;
    } else if (
      lowerTechs.some(
        (tech) => tech.includes("python") || tech.includes("java") || tech.includes("typescript"),
      )
    ) {
      return <Code className="h-5 w-5 text-primary" />;
    } else {
      return <Cpu className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Card className="cursor-pointer group hover:shadow-lg transition-shadow border-t-4 border-t-primary">
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="text-primary bg-primary/10 p-2 rounded-lg">
                {getPrimaryTechIcon()}
              </div>
              <CardTitle>{project.title}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <img
              src={project.thumbnail}
              alt={project.title}
              className="w-full aspect-video object-cover rounded-md mb-4"
            />
            <p className="text-sm text-muted-foreground mb-4">{project.description}</p>
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
      <DialogContent className="max-w-4xl">{renderContent()}</DialogContent>
    </Dialog>
  );
}
