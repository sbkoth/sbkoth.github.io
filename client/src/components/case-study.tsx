import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@shared/schema";
import { 
  BookOpen, 
  Lightbulb, 
  Wrench, 
  TrendingUp, 
  Quote, 
  Laptop 
} from "lucide-react";

interface CaseStudyProps {
  project: Project;
}

export default function CaseStudy({ project }: CaseStudyProps) {
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-3xl">{project.title}</CardTitle>
        <p className="text-lg text-muted-foreground mt-2">
          {project.description}
        </p>
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
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              {project.outcomes.map((outcome, index) => (
                <li key={index}>{outcome}</li>
              ))}
            </ul>
          )}
        </div>

        {/* Client Testimonial */}
        {project.clientTestimonial && (
          <>
            <Separator />
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xl font-semibold">
                <Quote className="h-6 w-6 text-primary" />
                <h3>Client Testimonial</h3>
              </div>
              <blockquote className="border-l-4 border-primary/20 pl-4 italic text-muted-foreground">
                "{project.clientTestimonial.quote}"
                <footer className="mt-2 not-italic">
                  <strong>{project.clientTestimonial.author}</strong>
                  <br />
                  <span className="text-sm">
                    {project.clientTestimonial.role}, {project.clientTestimonial.company}
                  </span>
                </footer>
              </blockquote>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
