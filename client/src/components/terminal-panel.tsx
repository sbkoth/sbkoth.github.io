import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TerminalPanelProps {
  /** Shell command shown in the prompt line */
  prompt?: string;
  /** Optional delay index for staggered fade-in */
  delayMs?: number;
  className?: string;
  children: ReactNode;
}

/** Content block inside the main terminal window (no nested chrome). */
export default function TerminalPanel({
  prompt,
  delayMs = 0,
  className,
  children,
}: TerminalPanelProps) {
  return (
    <section
      className={cn("tui-section tui-fade-in", className)}
      style={delayMs ? { animationDelay: `${delayMs}ms` } : undefined}
    >
      {prompt ? (
        <p className="tui-prompt-line text-muted-foreground">
          <span className="text-primary">visitor</span>
          <span>@</span>
          <span className="text-accent">sbkoth</span>
          <span>:</span>
          <span className="text-primary">~</span>
          <span>$&nbsp;</span>
          <span className="text-foreground">{prompt}</span>
          <span
            className="tui-blink ml-0.5 inline-block h-[1.05em] w-[0.55em] translate-y-px bg-primary align-text-bottom"
            aria-hidden
          />
        </p>
      ) : null}
      {children}
    </section>
  );
}
