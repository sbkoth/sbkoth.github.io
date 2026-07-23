import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Code2,
  GitMerge,
  AlertCircle,
  Zap,
  Database,
  Brain,
  Cloud,
  Shield,
  CreditCard,
} from "lucide-react";
import type { Feature } from "@shared/schema";
import ContentDialog from "./content-dialog";
import { dataUrl } from "@/lib/static-data";
import TerminalPanel from "./terminal-panel";

const iconMap: Record<string, React.ReactNode> = {
  Code2: <Code2 className="h-4 w-4" />,
  GitMerge: <GitMerge className="h-4 w-4" />,
  AlertCircle: <AlertCircle className="h-4 w-4" />,
  Zap: <Zap className="h-4 w-4" />,
  Database: <Database className="h-4 w-4" />,
  Brain: <Brain className="h-4 w-4" />,
  Cloud: <Cloud className="h-4 w-4" />,
  Shield: <Shield className="h-4 w-4" />,
  CreditCard: <CreditCard className="h-4 w-4" />,
};

function FeaturesComponent() {
  const { data: features, isError } = useQuery<Feature[]>({
    queryKey: [dataUrl("features")],
  });

  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);

  if (isError) {
    return (
      <TerminalPanel prompt="ls expertise/">
        <p className="text-sm text-destructive">error: failed to load expertise</p>
      </TerminalPanel>
    );
  }

  if (!features || features.length === 0) {
    return null;
  }

  return (
    <>
      <TerminalPanel prompt="ls -la expertise/" delayMs={80}>
        <div className="mb-5">
          <h2 className="tui-section-title">Professional Expertise</h2>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            End-to-end systems work — strategy that still compiles.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <article
              key={`${feature.title}-${index}`}
              className="tui-card"
              onClick={() => setSelectedFeature(feature)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelectedFeature(feature);
                }
              }}
              role="button"
              tabIndex={0}
            >
              <div className="flex items-start gap-3">
                <div className="shrink-0 border border-primary/30 p-2 text-primary">
                  {iconMap[feature.icon] ?? <Code2 className="h-4 w-4" />}
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-medium leading-snug text-primary">
                    <span className="font-normal text-muted-foreground">./</span>
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                  {feature.highlights?.length > 0 && (
                    <ul className="mt-3 space-y-1">
                      {feature.highlights.slice(0, 4).map((highlight, i) => (
                        <li
                          key={i}
                          className="flex gap-2 text-[11px] text-foreground/80"
                        >
                          <span className="shrink-0 text-primary">▸</span>
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </TerminalPanel>

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

export default React.memo(FeaturesComponent);
