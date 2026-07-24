/**
 * Terminal hooks — state, theme, autocomplete, and dispatch side-effects.
 * Keeps Terminal.tsx focused on rendering and event wiring.
 */
import {
  type Dispatch,
  type FormEvent,
  type KeyboardEvent,
  type RefObject,
  type SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { openMailto } from "@/lib/mailto";
import { autocomplete } from "./autocomplete";
import {
  COMMAND_NAMES,
  type DispatchResult,
  dispatchCommand,
  type PortfolioData,
} from "./commands";
import { historyDown, historyUp } from "./history";
import {
  applyThemeToDocument,
  getTheme,
  loadStoredThemeName,
  storeThemeName,
  THEME_NAMES,
} from "./themes";

export type HistoryEntry = {
  id: number;
  input: string;
  result: DispatchResult;
};

/** Cap rendered terminal blocks so long sessions stay snappy without virtualization. */
export const MAX_VISIBLE_ENTRIES = 120;
/** Cap command recall history (ArrowUp/Down). */
export const MAX_CMD_HISTORY = 200;

type TerminalState = {
  entries: HistoryEntry[];
  cmdHistory: string[];
  pointer: number;
  hints: string[];
  /** Index into hints for listbox keyboard navigation; -1 when none active */
  activeHintIndex: number;
  inputVal: string;
  nextId: number;
};

type TerminalAction =
  | { type: "set_input"; value: string }
  | { type: "set_hints"; hints: string[] }
  | { type: "set_active_hint"; index: number }
  | { type: "clear_screen" }
  | {
      type: "append_entry";
      input: string;
      result: DispatchResult;
      /** When true, still records history (e.g. clear command) */
      historyOnly?: boolean;
    }
  | { type: "set_pointer"; pointer: number; inputVal: string }
  | { type: "boot_welcome"; result: DispatchResult };

function trimEntries(entries: HistoryEntry[]): HistoryEntry[] {
  if (entries.length <= MAX_VISIBLE_ENTRIES) return entries;
  return entries.slice(entries.length - MAX_VISIBLE_ENTRIES);
}

function trimCmdHistory(history: string[]): string[] {
  if (history.length <= MAX_CMD_HISTORY) return history;
  return history.slice(0, MAX_CMD_HISTORY);
}

function terminalReducer(state: TerminalState, action: TerminalAction): TerminalState {
  switch (action.type) {
    case "set_input":
      return { ...state, inputVal: action.value, hints: [], activeHintIndex: -1 };
    case "set_hints":
      return {
        ...state,
        hints: action.hints,
        activeHintIndex: action.hints.length > 0 ? 0 : -1,
      };
    case "set_active_hint":
      return { ...state, activeHintIndex: action.index };
    case "clear_screen":
      return { ...state, entries: [], hints: [], activeHintIndex: -1 };
    case "boot_welcome": {
      const id = state.nextId + 1;
      return {
        ...state,
        nextId: id,
        entries: [{ id, input: "welcome", result: action.result }],
        cmdHistory: ["welcome"],
      };
    }
    case "append_entry": {
      const id = state.nextId + 1;
      const nextHistory = trimCmdHistory([action.input, ...state.cmdHistory]);
      if (action.historyOnly) {
        return {
          ...state,
          nextId: id,
          entries: [],
          cmdHistory: nextHistory,
          inputVal: "",
          hints: [],
          activeHintIndex: -1,
          pointer: -1,
        };
      }
      return {
        ...state,
        nextId: id,
        entries: trimEntries([
          ...state.entries,
          { id, input: action.input, result: action.result },
        ]),
        cmdHistory: nextHistory,
        inputVal: "",
        hints: [],
        activeHintIndex: -1,
        pointer: -1,
      };
    }
    case "set_pointer":
      return {
        ...state,
        pointer: action.pointer,
        inputVal: action.inputVal,
        hints: [],
        activeHintIndex: -1,
      };
    default: {
      const _exhaustive: never = action;
      return _exhaustive;
    }
  }
}

const initialState: TerminalState = {
  entries: [],
  cmdHistory: [],
  pointer: -1,
  hints: [],
  activeHintIndex: -1,
  inputVal: "",
  nextId: 0,
};
export function useTerminalState() {
  return useReducer(terminalReducer, initialState);
}

export function useTerminalTheme() {
  const [themeName, setThemeName] = useState(() => {
    if (typeof window === "undefined") return "dark";
    return loadStoredThemeName();
  });

  useEffect(() => {
    const name = loadStoredThemeName();
    setThemeName(name);
    applyThemeToDocument(getTheme(name));
  }, []);

  useEffect(() => {
    applyThemeToDocument(getTheme(themeName));
    storeThemeName(themeName);
  }, [themeName]);

  return { themeName, setThemeName } as const;
}

export function useRunSideEffect(setThemeName: (name: string) => void) {
  return useCallback(
    (result: DispatchResult) => {
      const fx = result.sideEffect;
      if (!fx) return;
      if (fx.type === "theme") {
        setThemeName(fx.name);
      } else if (fx.type === "mailto") {
        openMailto(fx.email, "Hello from your portfolio");
      } else if (fx.type === "open") {
        window.open(fx.url, "_blank", "noopener,noreferrer");
      }
    },
    [setThemeName],
  );
}

export function useTerminalKeyboard(options: {
  inputVal: string;
  cmdHistory: string[];
  pointer: number;
  hints: string[];
  activeHintIndex: number;
  dispatch: Dispatch<TerminalAction>;
}) {
  const { inputVal, cmdHistory, pointer, hints, activeHintIndex, dispatch } = options;

  return useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      const ctrlI = e.ctrlKey && e.key.toLowerCase() === "i";
      const ctrlL = e.ctrlKey && e.key.toLowerCase() === "l";
      const listboxOpen = hints.length > 1;

      if (e.key === "Escape" && listboxOpen) {
        e.preventDefault();
        dispatch({ type: "set_hints", hints: [] });
        return;
      }

      // Combobox: arrow through autocomplete options when listbox is open
      if (listboxOpen && e.key === "ArrowDown") {
        e.preventDefault();
        dispatch({
          type: "set_active_hint",
          index: nextHintIndex(hints.length, activeHintIndex, 1),
        });
        return;
      }
      if (listboxOpen && e.key === "ArrowUp") {
        e.preventDefault();
        dispatch({
          type: "set_active_hint",
          index: nextHintIndex(hints.length, activeHintIndex, -1),
        });
        return;
      }
      if (listboxOpen && e.key === "Enter" && activeHintIndex >= 0 && hints[activeHintIndex]) {
        e.preventDefault();
        dispatch({ type: "set_input", value: hints[activeHintIndex] });
        return;
      }

      if (e.key === "Tab" || ctrlI) {
        e.preventDefault();
        if (!inputVal) return;
        const r = autocomplete(inputVal, COMMAND_NAMES, THEME_NAMES);
        if (r.completion) {
          dispatch({ type: "set_input", value: r.completion });
        } else if (r.hints.length > 1) {
          dispatch({ type: "set_hints", hints: r.hints });
        } else if (r.hints.length === 1) {
          dispatch({ type: "set_input", value: r.hints[0] });
        } else {
          dispatch({ type: "set_hints", hints: r.hints });
        }
        return;
      }

      if (ctrlL) {
        e.preventDefault();
        dispatch({ type: "clear_screen" });
        return;
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        const nav = historyUp(cmdHistory, pointer);
        if (nav) {
          dispatch({ type: "set_pointer", pointer: nav.pointer, inputVal: nav.value });
        }
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        const nav = historyDown(cmdHistory, pointer);
        if (nav) {
          dispatch({ type: "set_pointer", pointer: nav.pointer, inputVal: nav.value });
        }
      }
    },
    [inputVal, cmdHistory, pointer, hints, activeHintIndex, dispatch],
  );
}
export function useTerminalSubmit(options: {
  portfolio: PortfolioData | null;
  inputVal: string;
  cmdHistory: string[];
  dispatch: Dispatch<TerminalAction>;
  runSideEffect: (result: DispatchResult) => void;
}) {
  const { portfolio, inputVal, cmdHistory, dispatch, runSideEffect } = options;

  return useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      if (!portfolio) return;
      const line = inputVal;
      const result = dispatchCommand(line, portfolio, cmdHistory, THEME_NAMES);

      if (result.sideEffect?.type === "clear") {
        dispatch({
          type: "append_entry",
          input: line,
          result,
          historyOnly: true,
        });
        return;
      }

      runSideEffect(result);
      dispatch({ type: "append_entry", input: line, result });
    },
    [portfolio, inputVal, cmdHistory, dispatch, runSideEffect],
  );
}

export function useTerminalFocus(inputRef: RefObject<HTMLInputElement | null>) {
  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.code === "ArrowUp" || e.code === "ArrowDown") {
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", onKey, false);
    return () => window.removeEventListener("keydown", onKey, false);
  }, []);

  useEffect(() => {
    const focusInput = () => inputRef.current?.focus();
    document.addEventListener("click", focusInput);
    return () => document.removeEventListener("click", focusInput);
  }, [inputRef]);
}

export function useBootWelcome(
  portfolio: PortfolioData | null,
  dispatch: Dispatch<TerminalAction>,
) {
  const booted = useRef(false);
  useEffect(() => {
    if (!portfolio || booted.current) return;
    const welcome = dispatchCommand("welcome", portfolio, [], THEME_NAMES);
    dispatch({ type: "boot_welcome", result: welcome });
    booted.current = true;
  }, [portfolio, dispatch]);
}

/**
 * Pure live-region text for the latest command output / welcome banner.
 * Used by the Terminal screen-reader status region.
 */
export function announceLatestOutput(entries: HistoryEntry[]): string {
  const last = entries[entries.length - 1];
  if (!last) return "";
  if (last.result.variant === "welcome") {
    const name = last.result.welcomeName ?? "visitor";
    // Prefer full welcome lines (includes help menu) when present.
    if (last.result.lines.length > 0) {
      return last.result.lines.join("\n");
    }
    return `Welcome to ${name}'s terminal portfolio. Available commands: ${COMMAND_NAMES.join(", ")}. Type help for details. Tab or Control I to autocomplete.`;
  }
  if (last.result.lines.length === 0) {
    return `Command completed: ${last.input}`;
  }
  return last.result.lines.join("\n");
}

export function useLatestOutputAnnouncement(entries: HistoryEntry[]): string {
  return useMemo(() => announceLatestOutput(entries), [entries]);
}

/** Pure: build combobox aria-activedescendant id for a hint index. */
export function hintOptionId(index: number): string {
  return `terminal-hint-${index}`;
}

/** Pure helpers used by the reducer — exported for unit tests. */
export function limitVisibleEntries(entries: HistoryEntry[]): HistoryEntry[] {
  return trimEntries(entries);
}

export function limitCmdHistory(history: string[]): string[] {
  return trimCmdHistory(history);
}

/**
 * Pure: next active hint index when navigating the autocomplete listbox.
 * direction: +1 down, -1 up.
 */
export function nextHintIndex(length: number, current: number, direction: 1 | -1): number {
  if (length <= 0) return -1;
  if (direction === 1) {
    return current < 0 ? 0 : (current + 1) % length;
  }
  return current <= 0 ? length - 1 : current - 1;
}

export type { Dispatch, SetStateAction };
