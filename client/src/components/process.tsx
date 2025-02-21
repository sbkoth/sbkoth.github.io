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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {steps.map((step, index) => (
            <Card 
              key={index} 
              className="hover:shadow-lg transition-all cursor-pointer hover:scale-[1.02]"
              onClick={() => setSelectedStep(step)}
            >
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="text-primary">
                    {iconMap[step.icon]}
                  </div>
                  <CardTitle className="text-xl">{step.title}</CardTitle>
                </div>
                <p className="text-muted-foreground mt-2">{step.description}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {step.steps.map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <span className="text-sm text-muted-foreground">{item}</span>
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