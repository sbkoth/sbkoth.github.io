import { Button } from "@/components/ui/button";
import { FaGithub } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import type { Profile } from "@shared/schema";

interface ContactProps {
  profile: Profile;
}

export default function Contact({ profile }: ContactProps) {
  const { socials } = profile;
  const links = [
    {
      href: socials.github,
      label: "GitHub",
      icon: <FaGithub className="h-5 w-5" />,
    },
    {
      href: socials.email ? `mailto:${socials.email}` : undefined,
      label: "Email",
      icon: <MdEmail className="h-5 w-5" />,
    },
  ].filter((l) => Boolean(l.href));

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h2 className="text-3xl font-bold mb-8">Get in Touch</h2>
      <div className="flex justify-center gap-4">
        {links.map((link) => (
          <Button key={link.label} variant="outline" size="icon" asChild>
            <a
              href={link.href}
              target={link.href?.startsWith("mailto:") ? undefined : "_blank"}
              rel={
                link.href?.startsWith("mailto:") ? undefined : "noopener noreferrer"
              }
              aria-label={link.label}
            >
              {link.icon}
            </a>
          </Button>
        ))}
      </div>
    </div>
  );
}
