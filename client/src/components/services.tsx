import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Cloud, Shield, Code, Brain, ChartBar } from "lucide-react";

export default function Services() {
  const services = [
    {
      icon: <Database className="h-8 w-8" />,
      title: "Data Architecture",
      description: "Design and implementation of scalable data solutions, from warehouses to lakes",
    },
    {
      icon: <Cloud className="h-8 w-8" />,
      title: "Cloud Migration",
      description: "Strategic cloud adoption and migration with zero downtime",
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Security Architecture",
      description: "Robust security patterns and compliance frameworks",
    },
    {
      icon: <Code className="h-8 w-8" />,
      title: "Technical Leadership",
      description: "Guide teams in adopting best practices and modern architectures",
    },
    {
      icon: <Brain className="h-8 w-8" />,
      title: "Solution Architecture",
      description: "End-to-end solution design focusing on scalability and maintainability",
    },
    {
      icon: <ChartBar className="h-8 w-8" />,
      title: "Performance Optimization",
      description: "System analysis and optimization for peak performance",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold mb-8">Services</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="text-primary">{service.icon}</div>
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
  );
}
