import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  Bot,
  Boxes,
  Brain,
  ChartBar,
  Cloud,
  Code,
  Cpu,
  CreditCard,
  Database,
  GitMerge,
  LineChart,
  Network,
  Server,
  Shield,
  Waves,
} from "lucide-react";
import React, { lazy, Suspense, useState } from "react";

const ContentDialog = lazy(() => import("./content-dialog"));

import { dataUrl } from "@/lib/static-data";
import TerminalPanel from "./terminal-panel";

interface Service {
  title: string;
  icon: string;
  description: string;
  content: string;
}

const iconMap: Record<string, React.ReactNode> = {
  Database: <Database className="h-4 w-4" />,
  Cloud: <Cloud className="h-4 w-4" />,
  Shield: <Shield className="h-4 w-4" />,
  Code: <Code className="h-4 w-4" />,
  Brain: <Brain className="h-4 w-4" />,
  ChartBar: <ChartBar className="h-4 w-4" />,
  LineChart: <LineChart className="h-4 w-4" />,
  Server: <Server className="h-4 w-4" />,
  Network: <Network className="h-4 w-4" />,
  Bot: <Bot className="h-4 w-4" />,
  GitMerge: <GitMerge className="h-4 w-4" />,
  Cpu: <Cpu className="h-4 w-4" />,
  Activity: <Activity className="h-4 w-4" />,
  Boxes: <Boxes className="h-4 w-4" />,
  Waves: <Waves className="h-4 w-4" />,
  SiStripe: <CreditCard className="h-4 w-4" />,
  CreditCard: <CreditCard className="h-4 w-4" />,
};

function ServicesComponent() {
  const { data: services, isError } = useQuery<Service[]>({
    queryKey: [dataUrl("services")],
  });

  const [selectedService, setSelectedService] = useState<Service | null>(null);

  if (isError) {
    return (
      <TerminalPanel prompt="ls services/">
        <p className="text-sm text-destructive">error: failed to load services</p>
      </TerminalPanel>
    );
  }

  if (!services || services.length === 0) {
    return null;
  }

  return (
    <>
      <TerminalPanel prompt="find services -type f" delayMs={100}>
        <div className="mb-5">
          <h2 className="tui-section-title">Services</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            <span className="text-primary">{services.length}</span> modules available
          </p>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <article
              key={`${service.title}-${index}`}
              className="tui-card"
              onClick={() => setSelectedService(service)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelectedService(service);
                }
              }}
              role="button"
              tabIndex={0}
            >
              <div className="flex items-start gap-3">
                <div className="shrink-0 border border-primary/30 p-2 text-primary">
                  {iconMap[service.icon] ?? <Code className="h-4 w-4" />}
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-medium text-primary">
                    <span className="font-normal text-muted-foreground">svc/</span>
                    {service.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {service.description}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </TerminalPanel>

      {selectedService && (
        <Suspense fallback={null}>
          <ContentDialog
            title={selectedService.title}
            content={selectedService.content}
            isOpen={!!selectedService}
            onClose={() => setSelectedService(null)}
          />
        </Suspense>
      )}
    </>
  );
}

export default React.memo(ServicesComponent);
