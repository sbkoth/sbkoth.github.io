import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Cloud, Shield, Code, Brain, ChartBar, Server, Network, Bot, GitMerge, Cpu, Boxes, Waves, CreditCard } from "lucide-react";
import { useState } from "react";
import type { Service } from "../../../server/services-utils";
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
  Boxes: <SiKubernetes className="h-8 w-8" />,  // Replace Boxes with Kubernetes icon
  Waves: <SiApachekafka className="h-8 w-8" />,  // Replace Waves with Kafka icon
  SiStripe: <SiStripe className="h-8 w-8" />,   // Stripe icon for payment processing
  CreditCard: <CreditCard className="h-8 w-8" />,
};

export default function Services() {
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
              className="hover:shadow-lg transition-all cursor-pointer hover:scale-[1.02]"
              onClick={() => setSelectedService(service)}
            >
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="text-primary">
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