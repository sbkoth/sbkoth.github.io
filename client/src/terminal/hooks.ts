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

type TerminalState = {
  entries: HistoryEntry[];
  cmdHistory: string[];
  pointer: number;
  hints: string[];
  inputVal: string;
  nextId: number;
};

type TerminalAction =
  | { type: "set_input"; value: string }
  | { type: "set_hints"; hints: string[] }
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

function terminalReducer(state: TerminalState, action: TerminalAction): TerminalState {
  switch (action.type) {
    case "set_input":
      return { ...state, inputVal: action.value, hints: [] };
    case "set_hints":
      return { ...state, hints: action.hints };
    case "clear_screen":
      return { ...state, entries: [], hints: [] };
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
      if (action.historyOnly) {
        return {
          ...state,
          nextId: id,
          entries: [],
          cmdHistory: [action.input, ...state.cmdHistory],
          inputVal: "",
          hints: [],
          pointer: -1,
        };
      }
      return {
        ...state,
        nextId: id,
        entries: [...state.entries, { id, input: action.input, result: action.result }],
        cmdHistory: [action.input, ...state.cmdHistory],
        inputVal: "",
        hints: [],
        pointer: -1,
      };
    }
    case "set_pointer":
      return {
        ...state,
        pointer: action.pointer,
        inputVal: action.inputVal,
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
  dispatch: Dispatch<TerminalAction>;
}) {
  const { inputVal, cmdHistory, pointer, dispatch } = options;

  return useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      const ctrlI = e.ctrlKey && e.key.toLowerCase() === "i";
      const ctrlL = e.ctrlKey && e.key.toLowerCase() === "l";

      if (e.key === "Tab" || ctrlI) {
        e.preventDefault();
        if (!inputVal) return;
        const r = autocomplete(inputVal, COMMAND_NAMES, THEME_NAMES);
        if (r.completion) {
          dispatch({ type: "set_input", value: r.completion });
          dispatch({ type: "set_hints", hints: [] });
        } else if (r.hints.length > 1) {
          dispatch({ type: "set_hints", hints: r.hints });
        } else if (r.hints.length === 1) {
          dispatch({ type: "set_input", value: r.hints[0] });
          dispatch({ type: "set_hints", hints: [] });
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
    [inputVal, cmdHistory, pointer, dispatch],
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

export function useLatestOutputAnnouncement(entries: HistoryEntry[]): string {
  return useMemo(() => {
    const last = entries[entries.length - 1];
    if (!last) return "";
    if (last.result.variant === "welcome") {
      return `Welcome banner for ${last.result.welcomeName ?? "visitor"}`;
    }
    return last.result.lines.join("\n");
  }, [entries]);
}

export type { Dispatch, SetStateAction };
