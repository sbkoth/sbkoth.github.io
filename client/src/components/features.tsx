import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code2, GitMerge, AlertCircle, Zap } from "lucide-react";
import { useState } from "react";
import type { Feature } from "../../../server/features-utils";
import ContentDialog from "./content-dialog";

const iconMap: Record<string, React.ReactNode> = {
  Code2: <Code2 className="h-8 w-8" />,
  GitMerge: <GitMerge className="h-8 w-8" />,
  AlertCircle: <AlertCircle className="h-8 w-8" />,
  Zap: <Zap className="h-8 w-8" />,
};

export default function Features() {
  const { data: features } = useQuery<Feature[]>({
    queryKey: ["/api/features"],
  });

  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);

  if (!features) {
    return null;
  }

  return (
    <>
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8">Why Choose Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="hover:shadow-lg transition-all cursor-pointer hover:scale-[1.02]"
              onClick={() => setSelectedFeature(feature)}
            >
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="text-primary">
                    {iconMap[feature.icon]}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.highlights.map((highlight, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <span className="text-sm">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {selectedFeature && (
        <ContentDialog
          title={selectedFeature.title}
          content={selectedFeature.content}
          isOpen={!!selectedFeature}
          onClose={() => setSelectedFeature(null)}
        />
      )}
    </>
  );
}