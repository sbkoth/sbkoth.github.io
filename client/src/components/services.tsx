import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Cloud, Shield, Code, Brain, ChartBar, Server, Network, Bot, GitMerge, Cpu, Boxes, Waves, CreditCard, Activity } from "lucide-react";
// Define the Service interface locally to avoid import issues
interface Service {
  title: string;
  icon: string;
  description: string;
  content: string;
}
import ContentDialog from "./content-dialog";
import { SiKubernetes, SiApachekafka, SiStripe } from "react-icons/si";

const iconMap: Record<string, React.ReactNode> = {
  Database: <Database className="h-8 w-8 transition-transform group-hover:scale-110 group-hover:rotate-3" />,
  Cloud: <Cloud className="h-8 w-8 transition-transform group-hover:scale-110 group-hover:rotate-3" />,
  Shield: <Shield className="h-8 w-8 transition-transform group-hover:scale-110 group-hover:rotate-3" />,
  Code: <Code className="h-8 w-8 transition-transform group-hover:scale-110 group-hover:rotate-3" />,
  Brain: <Brain className="h-8 w-8 transition-transform group-hover:scale-110 group-hover:rotate-3" />,
  ChartBar: <ChartBar className="h-8 w-8 transition-transform group-hover:scale-110 group-hover:rotate-3" />,
  Server: <Server className="h-8 w-8 transition-transform group-hover:scale-110 group-hover:rotate-3" />,
  Network: <Network className="h-8 w-8 transition-transform group-hover:scale-110 group-hover:rotate-3" />,
  Bot: <Bot className="h-8 w-8 transition-transform group-hover:scale-110 group-hover:rotate-3" />,
  GitMerge: <GitMerge className="h-8 w-8 transition-transform group-hover:scale-110 group-hover:rotate-3" />,
  Cpu: <Cpu className="h-8 w-8 transition-transform group-hover:scale-110 group-hover:rotate-3" />,
  Activity: <Activity className="h-8 w-8 transition-transform group-hover:scale-110 group-hover:rotate-3" />,
  // Use standard icons instead of specialized ones for consistent styling
  Boxes: <Boxes className="h-8 w-8 transition-transform group-hover:scale-110 group-hover:rotate-3" />,
  Waves: <Waves className="h-8 w-8 transition-transform group-hover:scale-110 group-hover:rotate-3" />,
  SiStripe: <CreditCard className="h-8 w-8 transition-transform group-hover:scale-110 group-hover:rotate-3" />,
  CreditCard: <CreditCard className="h-8 w-8 transition-transform group-hover:scale-110 group-hover:rotate-3" />,
};

function ServicesComponent() {
  const { data: services } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  const [selectedService, setSelectedService] = useState<Service | null>(null);

  if (!services) {
    return null;
  }

  return (
    <>
      <div className="py-24 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent inline-block">
              Specialized Services
            </h2>
            <div className="h-1 w-24 bg-primary/30 mx-auto rounded-full mb-6"></div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Our portfolio of specialized services delivers targeted expertise across key technology domains
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card 
                key={index} 
                className="group hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-[1.03] border-t-4 border-t-primary animate-fade-in"
                onClick={() => setSelectedService(service)}
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                  animationFillMode: 'backwards'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-4">
                    <div className="text-primary bg-primary/10 p-3 rounded-lg transition-colors duration-300 group-hover:bg-primary/20 shadow-sm group-hover:shadow">
                      {iconMap[service.icon]}
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">
                      {service.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed group-hover:text-foreground/90 transition-colors duration-300">
                    {service.description}
                  </p>
                  <div className="mt-4 flex justify-end">
                    <span className="text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-medium">
                      View details →
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {selectedService && (
        <ContentDialog
          title={selectedService.title}
          content={selectedService.content}
          isOpen={!!selectedService}
          onClose={() => setSelectedService(null)}
        />
      )}
    </>
  );
}

// Export a memoized version of the component to prevent unnecessary re-renders
export default React.memo(ServicesComponent);