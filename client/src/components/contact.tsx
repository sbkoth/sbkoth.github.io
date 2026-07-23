import type { Profile } from "@shared/schema";
import { FaGithub } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { buildMailtoHref, openMailto } from "@/lib/mailto";
import TerminalPanel from "./terminal-panel";

interface ContactProps {
  profile: Profile;
}

export default function Contact({ profile }: ContactProps) {
  const { socials } = profile;
  const email = socials.email?.trim() ?? "";
  const mailto = email ? buildMailtoHref(email, "Hello from your portfolio") : "";

  return (
    <TerminalPanel prompt="contact --list" delayMs={160}>
      <div className="mb-5">
        <h2 className="tui-section-title">Get in Touch</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Prefer async channels — open a pipe below.
        </p>
      </div>

      <ul className="space-y-2">
        {socials.github ? (
          <li>
            <a
              href={socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className="tui-link-row"
              aria-label="GitHub"
            >
              <span className="border border-primary/30 p-2 text-primary">
                <FaGithub className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm">
                  <span className="text-muted-foreground">$ </span>
                  open github
                </span>
                <span className="block truncate text-[11px] text-muted-foreground">
                  {socials.github}
                </span>
              </span>
              <span className="text-[10px] uppercase tracking-wider text-accent/80">exec</span>
            </a>
          </li>
        ) : null}

        {email && mailto ? (
          <li>
            {/*
              Use both href and explicit click handler: some browsers ignore
              bare mailto on styled anchors; location.assign is reliable.
            */}
            <a
              href={mailto}
              className="tui-link-row"
              aria-label={`Email ${email}`}
              onClick={(e) => {
                e.preventDefault();
                openMailto(email, "Hello from your portfolio");
              }}
            >
              <span className="border border-primary/30 p-2 text-primary">
                <MdEmail className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm">
                  <span className="text-muted-foreground">$ </span>
                  mail {email}
                </span>
                <span className="block truncate text-[11px] text-muted-foreground">{mailto}</span>
              </span>
              <span className="text-[10px] uppercase tracking-wider text-accent/80">exec</span>
            </a>
          </li>
        ) : null}
      </ul>
    </TerminalPanel>
  );
}
