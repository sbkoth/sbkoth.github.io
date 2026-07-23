import type { Project } from "@shared/schema";
import { BookOpen, Laptop, Lightbulb, TrendingUp, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface CaseStudyProps {
  project: Project;
}

export default function CaseStudy({ project }: CaseStudyProps) {
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-3xl">{project.title}</CardTitle>
        <p className="text-lg text-muted-foreground mt-2">{project.description}</p>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Challenge Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xl font-semibold">
            <BookOpen className="h-6 w-6 text-primary" />
            <h3>The Challenge</h3>
          </div>
          <p className="text-muted-foreground">{project.challenge}</p>
        </div>

        <Separator />

        {/* Approach Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xl font-semibold">
            <Lightbulb className="h-6 w-6 text-primary" />
            <h3>Our Approach</h3>
          </div>
          <p className="text-muted-foreground">{project.approach}</p>
        </div>

        <Separator />

        {/* Implementation Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xl font-semibold">
            <Wrench className="h-6 w-6 text-primary" />
            <h3>Implementation</h3>
          </div>
          <p className="text-muted-foreground">{project.implementation}</p>

          {/* Technologies Used */}
          {project.technologies && (
            <div className="flex flex-wrap gap-2 mt-4">
              <div className="flex items-center gap-2 mr-2">
                <Laptop className="h-4 w-4" />
                <span className="font-medium">Technologies:</span>
              </div>
              {project.technologies.map((tech) => (
                <Badge key={tech} variant="secondary">
                  {tech}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <Separator />

        {/* Outcomes Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xl font-semibold">
            <TrendingUp className="h-6 w-6 text-primary" />
            <h3>Key Outcomes</h3>
          </div>
          {project.outcomes && (
            <div className="space-y-2 text-muted-foreground">
              {project.outcomes.map((outcome, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                  <span>{outcome}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
