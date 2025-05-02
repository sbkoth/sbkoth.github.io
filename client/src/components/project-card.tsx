import { useState } from "react";
import type { Project } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import PdfViewer from "./pdf-viewer";
import SlideViewer from "./slide-viewer";
import CaseStudy from "./case-study";
import { ArrowRight, Database, Cloud, GitMerge, Server, Network, Code, Cpu } from "lucide-react";
import { SiKubernetes, SiApachekafka, SiAmazon, SiGooglecloud, SiTerraform, SiDocker, SiOracle } from "react-icons/si";

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
            src={project.content}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        );
      case "pdf":
        return <PdfViewer url={project.content} />;
      case "slides":
        // For slides, treat content as either a direct URL or a comma-separated list of URLs
        const slideUrls = project.content.includes(',') 
          ? project.content.split(',').map(url => url.trim())
          : [project.content];
        return <SlideViewer slides={slideUrls} />;
      case "text":
        return <CaseStudy project={project} />;
    }
  };

  // Function to determine the primary technology icon for the project
  const getPrimaryTechIcon = () => {
    if (!project.technologies || project.technologies.length === 0) {
      return <Database className="h-5 w-5 text-primary" />;
    }

    const lowerTechs = project.technologies.map(tech => tech.toLowerCase());
    
    if (lowerTechs.some(tech => tech.includes('kubernetes'))) {
      return <SiKubernetes className="h-5 w-5 text-primary" />;
    } else if (lowerTechs.some(tech => tech.includes('kafka'))) {
      return <SiApachekafka className="h-5 w-5 text-primary" />;
    } else if (lowerTechs.some(tech => tech.includes('aws'))) {
      return <SiAmazon className="h-5 w-5 text-primary" />;
    } else if (lowerTechs.some(tech => tech.includes('google cloud'))) {
      return <SiGooglecloud className="h-5 w-5 text-primary" />;
    } else if (lowerTechs.some(tech => tech.includes('terraform'))) {
      return <SiTerraform className="h-5 w-5 text-primary" />;
    } else if (lowerTechs.some(tech => tech.includes('docker'))) {
      return <SiDocker className="h-5 w-5 text-primary" />;
    } else if (lowerTechs.some(tech => tech.includes('oracle'))) {
      return <SiOracle className="h-5 w-5 text-primary" />;
    } else if (lowerTechs.some(tech => tech.includes('cloud'))) {
      return <Cloud className="h-5 w-5 text-primary" />;
    } else if (lowerTechs.some(tech => tech.includes('data'))) {
      return <Database className="h-5 w-5 text-primary" />;
    } else if (lowerTechs.some(tech => tech.includes('server'))) {
      return <Server className="h-5 w-5 text-primary" />;
    } else if (lowerTechs.some(tech => tech.includes('network'))) {
      return <Network className="h-5 w-5 text-primary" />;
    } else if (lowerTechs.some(tech => tech.includes('git'))) {
      return <GitMerge className="h-5 w-5 text-primary" />;
    } else if (lowerTechs.some(tech => tech.includes('python') || tech.includes('java') || tech.includes('typescript'))) {
      return <Code className="h-5 w-5 text-primary" />;
    } else {
      return <Cpu className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Card className="cursor-pointer group hover:shadow-xl transition-all duration-300 border-t-4 border-t-primary hover:scale-[1.02] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <CardHeader className="space-y-1 relative z-10">
            <div className="flex items-center gap-2">
              <div className="text-primary bg-primary/10 p-2 rounded-lg shadow-sm group-hover:shadow transition-all duration-300 group-hover:bg-primary/20">
                <div className="transform transition-transform duration-300 group-hover:scale-110">
                  {getPrimaryTechIcon()}
                </div>
              </div>
              <CardTitle className="group-hover:text-primary transition-colors duration-300">{project.title}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="overflow-hidden rounded-md mb-4 shadow-sm group-hover:shadow-md transition-shadow duration-300">
              <img 
                src={project.thumbnail} 
                alt={project.title}
                className="w-full aspect-video object-cover transform transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <p className="text-sm text-muted-foreground mb-4 group-hover:text-foreground/90 transition-colors duration-300 line-clamp-3">
              {project.description}
            </p>
            <div className="flex items-center justify-between">
              {project.technologies && (
                <div className="flex flex-wrap gap-2">
                  {project.technologies.slice(0, 3).map((tech) => (
                    <Badge 
                      key={tech} 
                      variant="secondary" 
                      className="text-xs transition-all duration-300 hover:bg-primary/10"
                    >
                      {tech}
                    </Badge>
                  ))}
                  {project.technologies.length > 3 && (
                    <Badge 
                      variant="secondary" 
                      className="text-xs transition-all duration-300 hover:bg-primary/10"
                    >
                      +{project.technologies.length - 3} more
                    </Badge>
                  )}
                </div>
              )}
              <div className="text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1 text-sm font-medium mr-2">
                <span>View details</span>
                <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}