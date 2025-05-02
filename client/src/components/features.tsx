import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardBulletList, 
  CardBulletItem 
} from "@/components/ui/card";
import { 
  Code2, 
  GitMerge, 
  AlertCircle, 
  Zap, 
  Database, 
  Brain, 
  Cloud, 
  Shield,
  CreditCard
} from "lucide-react";
import type { Feature } from "@shared/schema";
import ContentDialog from "./content-dialog";

const iconMap: Record<string, React.ReactNode> = {
  Code2: <Code2 className="h-8 w-8" />,
  GitMerge: <GitMerge className="h-8 w-8" />,
  AlertCircle: <AlertCircle className="h-8 w-8" />,
  Zap: <Zap className="h-8 w-8" />,
  Database: <Database className="h-8 w-8" />,
  Brain: <Brain className="h-8 w-8" />,
  Cloud: <Cloud className="h-8 w-8" />,
  Shield: <Shield className="h-8 w-8" />,
  CreditCard: <CreditCard className="h-8 w-8" />,
};

function FeaturesComponent() {
  const { data: features } = useQuery<Feature[]>({
    queryKey: ["/api/features"],
  });

  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);

  if (!features) {
    return null;
  }

  return (
    <>
      <div className="bg-muted/50 py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Professional Expertise</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We deliver end-to-end solutions across a wide range of technology domains, combining strategic vision with technical excellence.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="hover:shadow-lg transition-all cursor-pointer hover:scale-[1.02] border-t-4 border-t-primary"
                onClick={() => setSelectedFeature(feature)}
              >
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="text-primary bg-primary/10 p-3 rounded-lg">
                      {iconMap[feature.icon]}
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{feature.description}</p>
                  <CardBulletList>
                    {feature.highlights.map((highlight, i) => (
                      <CardBulletItem key={i}>{highlight}</CardBulletItem>
                    ))}
                  </CardBulletList>
                </CardContent>
              </Card>
            ))}
          </div>
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

// Export memoized component to prevent unnecessary re-renders
export default React.memo(FeaturesComponent);