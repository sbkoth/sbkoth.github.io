import { useEffect, useRef } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type { Profile } from "@shared/schema";
import { assetUrl } from "@/lib/static-data";
import TerminalPanel from "./terminal-panel";

interface HeroProps {
  profile: Profile;
}

export default function Hero({ profile }: HeroProps) {
  const calendarButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initCalendar = () => {
      if (calendarButtonRef.current && window.calendar?.schedulingButton) {
        if (calendarButtonRef.current.childElementCount > 0) return;
        window.calendar.schedulingButton.load({
          url: "https://calendar.google.com/calendar/appointments/schedules/AcZssZ3jn57Z8GRePdNpJDHhz1kInTrYIl_KwK6RYDkBOp6eWZ1BIIiFnG-sNf1oPI4RPgwFDsTD69dZ?gv=true",
          color: "#27c93f",
          label: "schedule --consultation",
          target: calendarButtonRef.current,
        });
      }
    };

    if (window.calendar?.schedulingButton) {
      initCalendar();
    } else {
      window.addEventListener("load", initCalendar);
      const t = window.setInterval(() => {
        if (window.calendar?.schedulingButton) {
          initCalendar();
          window.clearInterval(t);
        }
      }, 250);
      const stop = window.setTimeout(() => window.clearInterval(t), 10000);
      return () => {
        window.removeEventListener("load", initCalendar);
        window.clearInterval(t);
        window.clearTimeout(stop);
      };
    }

    return () => {
      window.removeEventListener("load", initCalendar);
    };
  }, []);

  const initials = profile.name
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <TerminalPanel prompt="whoami --verbose" delayMs={40}>
      <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-8">
        <Avatar className="h-24 w-24 shrink-0 rounded-md border border-primary/35 sm:h-28 sm:w-28">
          <AvatarImage
            src={assetUrl(profile.avatar)}
            alt={profile.name}
            className="object-cover"
          />
          <AvatarFallback className="rounded-md bg-muted font-mono text-xl text-primary">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1 space-y-3">
          <p className="text-xs text-muted-foreground">
            <span className="text-accent">#</span> identity
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-primary sm:text-3xl md:text-4xl">
            {profile.name}
            <span
              className="tui-blink ml-1 inline-block h-[0.9em] w-[0.5em] translate-y-0.5 bg-primary align-baseline"
              aria-hidden
            />
          </h1>
          <h2 className="text-sm text-accent sm:text-base">
            <span className="text-muted-foreground">role=</span>
            {profile.title}
          </h2>
          <p className="max-w-2xl border-l-2 border-primary/35 pl-3 text-sm leading-relaxed text-foreground/90">
            {profile.bio}
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <span className="text-xs text-muted-foreground">
              $ schedule --consultation
            </span>
            <div
              ref={calendarButtonRef}
              className="inline-block [&_button]:!rounded-md [&_button]:!font-mono [&_button]:!text-sm"
            />
          </div>
        </div>
      </div>
    </TerminalPanel>
  );
}

declare global {
  interface Window {
    calendar?: {
      schedulingButton: {
        load: (config: {
          url: string;
          color: string;
          label: string;
          target: HTMLElement;
        }) => void;
      };
    };
  }
}
