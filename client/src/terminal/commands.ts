/**
 * Pure command registry + dispatch for the interactive terminal.
 * Portfolio data is injected so unit tests drive the real functions.
 */

export type PortfolioData = {
  profile: {
    name: string;
    title: string;
    bio: string;
    socials: {
      github?: string;
      linkedin?: string;
      twitter?: string;
      email: string;
    };
  };
  projects: Array<{
    title: string;
    description: string;
    slug: string;
    content?: string;
  }>;
  features: Array<{
    title: string;
    description: string;
    highlights?: string[];
  }>;
  services: Array<{
    title: string;
    description: string;
  }>;
};

export type CommandMeta = {
  cmd: string;
  desc: string;
};

export const COMMANDS: CommandMeta[] = [
  { cmd: "about", desc: "about Srinivas Kothapalli" },
  { cmd: "clear", desc: "clear the terminal" },
  { cmd: "echo", desc: "print out anything" },
  { cmd: "email", desc: "send an email" },
  { cmd: "features", desc: "professional expertise areas" },
  { cmd: "gui", desc: "show non-terminal tip" },
  { cmd: "help", desc: "check available commands" },
  { cmd: "history", desc: "view command history" },
  { cmd: "projects", desc: "view projects" },
  { cmd: "pwd", desc: "print current working directory" },
  { cmd: "services", desc: "list services offered" },
  { cmd: "socials", desc: "social / contact links" },
  { cmd: "themes", desc: "list or set terminal themes" },
  { cmd: "welcome", desc: "display hero section" },
  { cmd: "whoami", desc: "about current user" },
];

export const COMMAND_NAMES = COMMANDS.map((c) => c.cmd);

export type SideEffect =
  | { type: "clear" }
  | { type: "theme"; name: string }
  | { type: "mailto"; email: string }
  | { type: "open"; url: string };

export type DispatchResult = {
  lines: string[];
  sideEffect?: SideEffect;
  /** Rich welcome layout: logo + portrait side-by-side */
  variant?: "welcome";
  welcomeName?: string;
};

function usage(cmd: string, detail?: string): DispatchResult {
  return {
    lines: detail
      ? [`Usage: ${cmd} ${detail}`]
      : [`Usage: ${cmd}`],
  };
}

function padCmd(cmd: string, width = 12): string {
  return cmd + " ".repeat(Math.max(1, width - cmd.length));
}

import { welcomeBannerLines } from "./welcome-art";

export { welcomeBannerLines as welcomeLines } from "./welcome-art";

export function dispatchCommand(
  raw: string,
  data: PortfolioData,
  history: string[],
  themeNames: string[],
): DispatchResult {
  const trimmed = raw.trim();
  if (trimmed === "") {
    return { lines: [] };
  }

  const parts = trimmed.split(/\s+/);
  const cmd = parts[0].toLowerCase();
  const args = parts.slice(1);

  if (!COMMAND_NAMES.includes(cmd)) {
    return { lines: [`command not found: ${cmd}`] };
  }

  switch (cmd) {
    case "clear":
      return { lines: [], sideEffect: { type: "clear" } };

    case "help":
      return {
        lines: [
          ...COMMANDS.map((c) => `${padCmd(c.cmd)}- ${c.desc}`),
          "",
          "Tab or Ctrl + i  => autocompletes the command",
          "Up Arrow         => go back to previous command",
          "Down Arrow       => go forward in history",
          "Ctrl + l         => clear the terminal",
        ],
      };

    case "welcome":
      return {
        lines: welcomeBannerLines(data.profile.name),
        variant: "welcome",
        welcomeName: data.profile.name,
      };

    case "whoami":
      return { lines: ["visitor"] };

    case "about":
      if (args.length > 0) return usage("about");
      return {
        lines: [
          data.profile.name,
          data.profile.title,
          "----",
          data.profile.bio,
        ],
      };

    case "pwd":
      if (args.length > 0) return usage("pwd");
      return { lines: ["/home/sbkoth"] };

    case "echo":
      return { lines: [args.join(" ")] };

    case "history": {
      if (args.length > 0) return usage("history");
      // history is newest-first in UI store; show chronological oldest→newest for readability
      const chrono = [...history].reverse();
      return {
        lines: chrono.map((h, i) => `  ${String(i + 1).padStart(3, " ")}  ${h}`),
      };
    }

    case "email": {
      if (args.length > 0) return usage("email");
      const email = data.profile.socials.email;
      return {
        lines: [
          `To: ${email}`,
          "Opening Gmail compose (new tab) and trying your default mail app…",
          `mailto:${email}`,
          `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`,
        ],
        sideEffect: { type: "mailto", email },
      };
    }

    case "gui":
      if (args.length > 0) return usage("gui");
      return {
        lines: [
          "You are already in the terminal portfolio.",
          "Use `projects`, `features`, `services`, or `about` to explore.",
          "Schedule: type `email` or use socials.",
        ],
      };

    case "projects": {
      if (args.length === 0) {
        const lines = data.projects.flatMap((p, i) => [
          `${i + 1}. ${p.title}`,
          `   ${p.description}`,
          `   slug: ${p.slug}`,
          "",
        ]);
        lines.push("Usage: projects go <id>  — open project details in scrollback");
        return { lines };
      }
      if (args[0] === "go" && args.length === 2) {
        const id = parseInt(args[1], 10);
        if (!Number.isFinite(id) || id < 1 || id > data.projects.length) {
          return usage("projects", "go <project-id>");
        }
        const p = data.projects[id - 1];
        return {
          lines: [
            `# ${p.title}`,
            p.description,
            "----",
            (p.content || "").trim() || "(no long-form content)",
          ],
        };
      }
      return usage("projects", "[go <id>]");
    }

    case "features": {
      if (args.length > 0) return usage("features");
      return {
        lines: data.features.flatMap((f, i) => {
          const hs = (f.highlights || []).map((h) => `   - ${h}`);
          return [`${i + 1}. ${f.title}`, `   ${f.description}`, ...hs, ""];
        }),
      };
    }

    case "services": {
      if (args.length > 0) return usage("services");
      return {
        lines: data.services.map(
          (s, i) => `${i + 1}. ${s.title} — ${s.description}`,
        ),
      };
    }

    case "socials": {
      const entries: Array<{ label: string; url: string }> = [];
      if (data.profile.socials.github) {
        entries.push({ label: "GitHub", url: data.profile.socials.github });
      }
      if (data.profile.socials.email) {
        entries.push({
          label: "Email",
          url: `mailto:${data.profile.socials.email}`,
        });
      }
      if (data.profile.socials.linkedin) {
        entries.push({ label: "LinkedIn", url: data.profile.socials.linkedin });
      }
      if (data.profile.socials.twitter) {
        entries.push({ label: "X", url: data.profile.socials.twitter });
      }

      if (args.length === 0) {
        return {
          lines: [
            ...entries.map((e, i) => `${i + 1}. ${e.label} — ${e.url}`),
            "",
            "Usage: socials go <id>",
          ],
        };
      }
      if (args[0] === "go" && args.length === 2) {
        const id = parseInt(args[1], 10);
        if (!Number.isFinite(id) || id < 1 || id > entries.length) {
          return usage("socials", "go <id>");
        }
        const e = entries[id - 1];
        if (e.url.startsWith("mailto:")) {
          return {
            lines: [`Opening ${e.url} ...`],
            sideEffect: {
              type: "mailto",
              email: e.url.replace(/^mailto:/, ""),
            },
          };
        }
        return {
          lines: [`Opening ${e.url} ...`],
          sideEffect: { type: "open", url: e.url },
        };
      }
      return usage("socials", "[go <id>]");
    }

    case "themes": {
      if (args.length === 0) {
        return {
          lines: [
            "Available themes:",
            ...themeNames.map((t) => `  - ${t}`),
            "",
            "Usage: themes set <theme-name>",
          ],
        };
      }
      if (args[0] === "set" && args.length === 2) {
        const name = args[1];
        if (!themeNames.includes(name)) {
          return {
            lines: [
              `Invalid theme: ${name}`,
              "Usage: themes set <theme-name>",
              `Themes: ${themeNames.join(", ")}`,
            ],
          };
        }
        return {
          lines: [`Theme set to '${name}'.`],
          sideEffect: { type: "theme", name },
        };
      }
      return usage("themes", "set <theme-name>");
    }

    default:
      return { lines: [`command not found: ${cmd}`] };
  }
}
