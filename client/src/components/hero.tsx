import { useEffect, useRef } from "react";
import { Avatar } from "@/components/ui/avatar";
import type { Profile } from "@shared/schema";

interface HeroProps {
  profile: Profile;
}

export default function Hero({ profile }: HeroProps) {
  const calendarButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (calendarButtonRef.current && window.initializeGoogleCalendar) {
      window.initializeGoogleCalendar(calendarButtonRef.current);
    }
  }, []);

  return (
    <div className="container mx-auto px-4 py-24 md:py-32">
      <div className="flex flex-col md:flex-row items-center gap-8">
        <Avatar className="w-32 h-32 md:w-48 md:h-48">
          <img src={profile.avatar} alt={profile.name} />
        </Avatar>
        <div className="text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {profile.name}
          </h1>
          <h2 className="text-xl md:text-2xl text-muted-foreground mt-2">
            {profile.title}
          </h2>
          <p className="mt-4 max-w-xl text-lg text-foreground/80">
            {profile.bio}
          </p>
          <div className="mt-8 flex justify-center md:justify-start">
            <div ref={calendarButtonRef} className="inline-block"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Add TypeScript type definition for the window object
declare global {
  interface Window {
    initializeGoogleCalendar?: (target: HTMLElement) => void;
  }
}