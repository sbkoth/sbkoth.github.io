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
  Code2: <Code2 className="h-8 w-8 transition-transform group-hover:scale-110" />,
  GitMerge: <GitMerge className="h-8 w-8 transition-transform group-hover:scale-110" />,
  AlertCircle: <AlertCircle className="h-8 w-8 transition-transform group-hover:scale-110" />,
  Zap: <Zap className="h-8 w-8 transition-transform group-hover:scale-110" />,
  Database: <Database className="h-8 w-8 transition-transform group-hover:scale-110" />,
  Brain: <Brain className="h-8 w-8 transition-transform group-hover:scale-110" />,
  Cloud: <Cloud className="h-8 w-8 transition-transform group-hover:scale-110" />,
  Shield: <Shield className="h-8 w-8 transition-transform group-hover:scale-110" />,
  CreditCard: <CreditCard className="h-8 w-8 transition-transform group-hover:scale-110" />,
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
      <div className="bg-dot-pattern relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/80 to-background/95"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent inline-block">
              Professional Expertise
            </h2>
            <div className="h-1 w-24 bg-primary/30 mx-auto rounded-full mb-6"></div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              We deliver end-to-end solutions across a wide range of technology domains, combining strategic vision with technical excellence.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="group hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-[1.03] border-t-4 border-t-primary overflow-hidden"
                onClick={() => setSelectedFeature(feature)}
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                  animationFillMode: 'backwards'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="text-primary bg-primary/10 p-3 rounded-lg transition-colors duration-300 group-hover:bg-primary/20">
                      {iconMap[feature.icon]}
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 group-hover:text-foreground/90 transition-colors duration-300">{feature.description}</p>
                  <CardBulletList>
                    {feature.highlights.map((highlight, i) => (
                      <CardBulletItem key={i} className="transition-transform duration-300 group-hover:translate-x-1">
                        {highlight}
                      </CardBulletItem>
                    ))}
                  </CardBulletList>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Render feature content dialog with error handling */}
      {selectedFeature && (
        <ContentDialog
          title={selectedFeature.title}
          content={selectedFeature.content || 'No detailed information available for this expertise area.'}
          isOpen={!!selectedFeature}
          onClose={() => setSelectedFeature(null)}
        />
      )}
    </>
  );
}

// Export memoized component to prevent unnecessary re-renders
export default React.memo(FeaturesComponent);