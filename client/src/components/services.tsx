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
  Database: <Database className="h-8 w-8" />,
  Cloud: <Cloud className="h-8 w-8" />,
  Shield: <Shield className="h-8 w-8" />,
  Code: <Code className="h-8 w-8" />,
  Brain: <Brain className="h-8 w-8" />,
  ChartBar: <ChartBar className="h-8 w-8" />,
  Server: <Server className="h-8 w-8" />,
  Network: <Network className="h-8 w-8" />,
  Bot: <Bot className="h-8 w-8" />,
  GitMerge: <GitMerge className="h-8 w-8" />,
  Cpu: <Cpu className="h-8 w-8" />,
  Activity: <Activity className="h-8 w-8" />,
  // Use standard icons instead of specialized ones for consistent styling
  Boxes: <Boxes className="h-8 w-8" />,
  Waves: <Waves className="h-8 w-8" />,
  SiStripe: <CreditCard className="h-8 w-8" />,
  CreditCard: <CreditCard className="h-8 w-8" />,
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
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8">Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <Card 
              key={index} 
              className="hover:shadow-lg transition-all cursor-pointer hover:scale-[1.02] border-t-4 border-t-primary"
              onClick={() => setSelectedService(service)}
            >
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="text-primary bg-primary/10 p-3 rounded-lg">
                    {iconMap[service.icon]}
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{service.description}</p>
              </CardContent>
            </Card>
          ))}
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