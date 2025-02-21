import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Code, CheckCircle, Rocket } from "lucide-react";
import { useState } from "react";
import type { ProcessStep } from "../../../server/process-utils";
import ContentDialog from "./content-dialog";

const iconMap: Record<string, React.ReactNode> = {
  Search: <Search className="h-8 w-8" />,
  Code: <Code className="h-8 w-8" />,
  CheckCircle: <CheckCircle className="h-8 w-8" />,
  Rocket: <Rocket className="h-8 w-8" />,
};

export default function Process() {
  const { data: steps } = useQuery<ProcessStep[]>({
    queryKey: ["/api/process"],
  });

  const [selectedStep, setSelectedStep] = useState<ProcessStep | null>(null);

  if (!steps) {
    return null;
  }

  return (
    <>
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Our Process</h2>
          <p className="text-lg text-muted-foreground">
            A systematic approach to delivering exceptional results
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {steps.map((step, index) => (
            <Card 
              key={index} 
              className="relative border-none shadow-none bg-transparent cursor-pointer hover:bg-accent/5 transition-colors"
              onClick={() => setSelectedStep(step)}
            >
              <div className="absolute -left-4 top-0 flex items-center justify-center w-8 h-8">
                <div className="w-2 h-2 rounded-full bg-primary" />
                {index < steps.length - 1 && (
                  <div className="absolute top-8 left-1 w-[1px] h-[calc(100%-2rem)] bg-primary/20" />
                )}
              </div>
              <CardHeader className="pl-8">
                <div className="flex items-center gap-4 mb-2">
                  <div className="text-primary">
                    {iconMap[step.icon]}
                  </div>
                  <CardTitle className="text-xl">{step.title}</CardTitle>
                </div>
                <p className="text-muted-foreground">{step.description}</p>
              </CardHeader>
              <CardContent className="pl-8">
                <ul className="space-y-3">
                  {step.steps.map((item, i) => (
                    <li key={i} className="text-sm text-muted-foreground">
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {selectedStep && (
        <ContentDialog
          title={selectedStep.title}
          content={selectedStep.content}
          isOpen={!!selectedStep}
          onClose={() => setSelectedStep(null)}
        />
      )}
    </>
  );
}