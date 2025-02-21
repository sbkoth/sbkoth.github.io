import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Code, CheckCircle, Rocket } from "lucide-react";
import type { ProcessStep } from "../../../server/process-utils";

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

  if (!steps) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-16 bg-accent/5">
      <h2 className="text-3xl font-bold mb-8 text-center">Our Process</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step, index) => (
          <Card key={index} className="relative hover:shadow-lg transition-shadow">
            <div className="absolute -top-4 left-4 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
              {step.order}
            </div>
            <CardHeader className="pt-8">
              <div className="flex items-center gap-4">
                <div className="text-primary">
                  {iconMap[step.icon]}
                </div>
                <CardTitle>{step.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{step.description}</p>
              <ul className="space-y-2">
                {step.steps.map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
