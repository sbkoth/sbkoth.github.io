import type { Feature, Profile, Project } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef } from "react";
import { dataUrl } from "@/lib/static-data";
import type { PortfolioData } from "./commands";
import {
  useBootWelcome,
  useLatestOutputAnnouncement,
  useRunSideEffect,
  useTerminalFocus,
  useTerminalKeyboard,
  useTerminalState,
  useTerminalSubmit,
  useTerminalTheme,
} from "./hooks";
import WelcomeBanner from "./WelcomeBanner";

function TermPrompt() {
  return (
    <span className="term-prompt" aria-hidden="true">
      <span className="term-user">visitor</span>
      <span className="term-at">@</span>
      <span className="term-host">sbkoth.github.io</span>
      <span className="term-path">:~$</span>
    </span>
  );
}

export default function Terminal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { data: profile } = useQuery<Profile>({
    queryKey: [dataUrl("profile")],
  });
  const { data: projects } = useQuery<Project[]>({
    queryKey: [dataUrl("projects")],
  });
  const { data: features } = useQuery<Feature[]>({
    queryKey: [dataUrl("features")],
  });
  const { data: services } = useQuery<
    Array<{ title: string; description: string; content?: string }>
  >({
    queryKey: [dataUrl("services")],
  });

  const portfolio: PortfolioData | null = useMemo(() => {
    if (!profile || !projects || !features || !services) return null;
    return {
      profile: {
        name: profile.name,
        title: profile.title,
        bio: profile.bio,
        socials: profile.socials,
      },
      projects: projects.map((p) => ({
        title: p.title,
        description: p.description,
        slug: p.slug,
        content: p.content,
      })),
      features: features.map((f) => ({
        title: f.title,
        description: f.description,
        highlights: f.highlights,
      })),
      services: services.map((s) => ({
        title: s.title,
        description: s.description,
      })),
    };
  }, [profile, projects, features, services]);

  const [state, dispatch] = useTerminalState();
  const { entries, cmdHistory, pointer, hints, inputVal } = state;
  const { setThemeName } = useTerminalTheme();
  const runSideEffect = useRunSideEffect(setThemeName);

  useTerminalFocus(inputRef);
  useBootWelcome(portfolio, dispatch);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [entries, hints, inputVal]);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 1);
    return () => clearTimeout(t);
  }, [inputVal, pointer, entries]);

  const handleKeyDown = useTerminalKeyboard({
    inputVal,
    cmdHistory,
    pointer,
    dispatch,
  });

  const handleSubmit = useTerminalSubmit({
    portfolio,
    inputVal,
    cmdHistory,
    dispatch,
    runSideEffect,
  });

  const liveAnnouncement = useLatestOutputAnnouncement(entries);

  if (!portfolio) {
    return (
      <div
        className="term-wrapper"
        data-testid="terminal-wrapper"
        role="application"
        aria-label="Terminal portfolio loading"
      >
        <div className="term-line">
          <TermPrompt /> <span className="term-dim">loading data…</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="term-wrapper"
      data-testid="terminal-wrapper"
      ref={containerRef}
      role="application"
      aria-label="Interactive terminal portfolio"
    >
      <h1 className="sr-only">Terminal Portfolio — Srinivas Kothapalli</h1>

      <div
        className="term-live"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        data-testid="terminal-live-region"
      >
        {liveAnnouncement}
      </div>

      {entries.map((entry) => (
        <div key={entry.id} className="term-block">
          <div className="term-line">
            <TermPrompt />{" "}
            <span data-testid="input-command" className="term-cmd">
              {entry.input}
            </span>
          </div>
          {(entry.result.variant === "welcome" || entry.result.lines.length > 0) && (
            <div
              className="term-output"
              data-testid={
                entry.id === entries[entries.length - 1]?.id ? "latest-output" : undefined
              }
            >
              {entry.result.variant === "welcome" && entry.result.welcomeName ? (
                <WelcomeBanner name={entry.result.welcomeName} />
              ) : (
                entry.result.lines.map((line, i) => (
                  <div key={i} className="term-output-line">
                    {line === "" ? "\u00A0" : line}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      ))}

      {hints.length > 1 && (
        <div
          className="term-hints"
          data-testid="hints"
          role="listbox"
          aria-label="Autocomplete suggestions"
        >
          {hints.map((h) => (
            <span key={h} className="term-hint" role="option">
              {h}
            </span>
          ))}
        </div>
      )}

      <form className="term-form" onSubmit={handleSubmit} autoComplete="off">
        <label htmlFor="terminal-input" className="term-label">
          <TermPrompt />
        </label>
        <input
          id="terminal-input"
          title="terminal-input"
          type="text"
          className="term-input"
          autoComplete="off"
          spellCheck={false}
          autoFocus
          autoCapitalize="off"
          ref={inputRef}
          value={inputVal}
          onChange={(e) => dispatch({ type: "set_input", value: e.target.value })}
          onKeyDown={handleKeyDown}
          aria-label="Terminal command input"
          aria-describedby="terminal-shortcuts-help"
        />
      </form>
      <p id="terminal-shortcuts-help" className="sr-only">
        Tab or Control I to autocomplete. Up and Down arrows for history. Control L to clear. Type
        help for commands.
      </p>
      <div ref={bottomRef} />
    </div>
  );
}
