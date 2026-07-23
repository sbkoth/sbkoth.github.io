import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { useQuery } from "@tanstack/react-query";
import { dataUrl } from "@/lib/static-data";
import { openMailto } from "@/lib/mailto";
import type { Feature, Profile, Project } from "@shared/schema";
import {
  COMMAND_NAMES,
  dispatchCommand,
  type DispatchResult,
  type PortfolioData,
} from "./commands";
import { autocomplete } from "./autocomplete";
import { historyDown, historyUp } from "./history";
import {
  THEME_NAMES,
  applyThemeToDocument,
  getTheme,
  loadStoredThemeName,
  storeThemeName,
} from "./themes";
import WelcomeBanner from "./WelcomeBanner";

type HistoryEntry = {
  id: number;
  input: string;
  result: DispatchResult;
};

let entryId = 0;

function TermPrompt() {
  return (
    <span className="term-prompt">
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

  const [inputVal, setInputVal] = useState("");
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [hints, setHints] = useState<string[]>([]);
  const [pointer, setPointer] = useState(-1);
  const [themeName, setThemeName] = useState(DEFAULT_THEME_SAFE);
  const [booted, setBooted] = useState(false);

  // Apply theme on mount + changes
  useEffect(() => {
    const name = loadStoredThemeName();
    setThemeName(name);
    applyThemeToDocument(getTheme(name));
  }, []);

  useEffect(() => {
    applyThemeToDocument(getTheme(themeName));
    storeThemeName(themeName);
  }, [themeName]);

  // Prevent page scroll on arrow keys (match example)
  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.code === "ArrowUp" || e.code === "ArrowDown") {
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", onKey, false);
    return () => window.removeEventListener("keydown", onKey, false);
  }, []);

  // Focus input when terminal surface is clicked
  useEffect(() => {
    const focusInput = () => inputRef.current?.focus();
    document.addEventListener("click", focusInput);
    return () => document.removeEventListener("click", focusInput);
  }, []);

  // Initial welcome once portfolio data is ready
  useEffect(() => {
    if (!portfolio || booted) return;
    const welcome = dispatchCommand("welcome", portfolio, [], THEME_NAMES);
    setEntries([{ id: ++entryId, input: "welcome", result: welcome }]);
    setCmdHistory(["welcome"]);
    setBooted(true);
  }, [portfolio, booted]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [entries, hints, inputVal]);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 1);
    return () => clearTimeout(t);
  }, [inputVal, pointer, entries]);

  const runSideEffect = useCallback((result: DispatchResult) => {
    const fx = result.sideEffect;
    if (!fx) return;
    if (fx.type === "theme") {
      setThemeName(fx.name);
    } else if (fx.type === "mailto") {
      // Must stay synchronous inside the submit gesture for popups
      openMailto(fx.email, "Hello from your portfolio");
    } else if (fx.type === "open") {
      window.open(fx.url, "_blank", "noopener,noreferrer");
    }
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!portfolio) return;
    const line = inputVal;
    const result = dispatchCommand(line, portfolio, cmdHistory, THEME_NAMES);

    // Run side effects first while still in the user-gesture stack
    // (popup blockers ignore delayed window.open).
    if (result.sideEffect?.type === "clear") {
      setEntries([]);
      setCmdHistory((h) => [line, ...h]);
      setInputVal("");
      setHints([]);
      setPointer(-1);
      return;
    }

    runSideEffect(result);

    setEntries((prev) => [
      ...prev,
      { id: ++entryId, input: line, result },
    ]);
    setCmdHistory((h) => [line, ...h]);
    setInputVal("");
    setHints([]);
    setPointer(-1);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const ctrlI = e.ctrlKey && e.key.toLowerCase() === "i";
    const ctrlL = e.ctrlKey && e.key.toLowerCase() === "l";

    if (e.key === "Tab" || ctrlI) {
      e.preventDefault();
      if (!inputVal) return;
      const r = autocomplete(inputVal, COMMAND_NAMES, THEME_NAMES);
      if (r.completion) {
        setInputVal(r.completion);
        setHints([]);
      } else if (r.hints.length > 1) {
        setHints(r.hints);
      } else if (r.hints.length === 1) {
        setInputVal(r.hints[0]);
        setHints([]);
      } else {
        setHints(r.hints);
      }
      return;
    }

    if (ctrlL) {
      e.preventDefault();
      setEntries([]);
      setHints([]);
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      const nav = historyUp(cmdHistory, pointer);
      if (nav) {
        setInputVal(nav.value);
        setPointer(nav.pointer);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      const nav = historyDown(cmdHistory, pointer);
      if (nav) {
        setInputVal(nav.value);
        setPointer(nav.pointer);
      }
    }
  };

  if (!portfolio) {
    return (
      <div className="term-wrapper" data-testid="terminal-wrapper">
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
    >
      <h1 className="sr-only">Terminal Portfolio — Srinivas Kothapalli</h1>

      {entries.map((entry) => (
        <div key={entry.id} className="term-block">
          <div className="term-line">
            <TermPrompt />{" "}
            <span data-testid="input-command" className="term-cmd">
              {entry.input}
            </span>
          </div>
          {(entry.result.variant === "welcome" ||
            entry.result.lines.length > 0) && (
            <div
              className="term-output"
              data-testid={
                entry.id === entries[entries.length - 1]?.id
                  ? "latest-output"
                  : undefined
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
        <div className="term-hints" data-testid="hints">
          {hints.map((h) => (
            <span key={h} className="term-hint">
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
          onChange={(e) => {
            setInputVal(e.target.value);
            setHints([]);
          }}
          onKeyDown={handleKeyDown}
          aria-label="Terminal command input"
        />
      </form>
      <div ref={bottomRef} />
    </div>
  );
}

function DEFAULT_THEME_SAFE(): string {
  if (typeof window === "undefined") return "dark";
  return loadStoredThemeName();
}
