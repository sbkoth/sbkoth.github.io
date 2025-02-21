import { Button } from "@/components/ui/button";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { SiX } from "react-icons/si";
import { MdEmail } from "react-icons/md";
import type { Profile } from "@shared/schema";

interface ContactProps {
  profile: Profile;
}

export default function Contact({ profile }: ContactProps) {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h2 className="text-3xl font-bold mb-8">Get in Touch</h2>
      <div className="flex justify-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <a href={`https://github.com/sbkoth`} target="_blank" rel="noopener">
            <FaGithub className="h-5 w-5" />
          </a>
        </Button>
        <Button variant="outline" size="icon" asChild>
          <a href={`https://linkedin.com/in/sbkoth`} target="_blank" rel="noopener">
            <FaLinkedin className="h-5 w-5" />
          </a>
        </Button>
        <Button variant="outline" size="icon" asChild>
          <a href={`https://x.com/sbkoth`} target="_blank" rel="noopener">
            <SiX className="h-5 w-5" />
          </a>
        </Button>
        <Button variant="outline" size="icon" asChild>
          <a href={`mailto:bobby@prameya.legal`}>
            <MdEmail className="h-5 w-5" />
          </a>
        </Button>
      </div>
    </div>
  );
}