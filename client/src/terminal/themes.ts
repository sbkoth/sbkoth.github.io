export type TerminalTheme = {
  id: string;
  name: string;
  body: string;
  text: string;
  textDim: string;
  primary: string;
  secondary: string;
  scrollHandle: string;
  scrollHandleHover: string;
};

export const THEMES: Record<string, TerminalTheme> = {
  dark: {
    id: "T_001",
    name: "dark",
    body: "#1D2A35",
    text: "#cbd5e1",
    textDim: "#64748b",
    primary: "#05CE91",
    secondary: "#FF9D00",
    scrollHandle: "#19252E",
    scrollHandleHover: "#162028",
  },
  light: {
    id: "T_002",
    name: "light",
    body: "#EFF3F3",
    text: "#334155",
    textDim: "#64748b",
    primary: "#027474",
    secondary: "#FF9D00",
    scrollHandle: "#C1C1C1",
    scrollHandleHover: "#AAAAAA",
  },
  "blue-matrix": {
    id: "T_003",
    name: "blue-matrix",
    body: "#101116",
    text: "#ffffff",
    textDim: "#76ff9f",
    primary: "#00ff9c",
    secondary: "#60fdff",
    scrollHandle: "#424242",
    scrollHandleHover: "#616161",
  },
  espresso: {
    id: "T_004",
    name: "espresso",
    body: "#323232",
    text: "#F7F7F7",
    textDim: "#A0A0A0",
    primary: "#E1E48B",
    secondary: "#A5C260",
    scrollHandle: "#5b5b5b",
    scrollHandleHover: "#393939",
  },
  "green-goblin": {
    id: "T_005",
    name: "green-goblin",
    body: "#000000",
    text: "#01FF00",
    textDim: "#04A5B2",
    primary: "#E5E500",
    secondary: "#04A500",
    scrollHandle: "#2E2E2E",
    scrollHandleHover: "#414141",
  },
  ubuntu: {
    id: "T_006",
    name: "ubuntu",
    body: "#2D0922",
    text: "#FFFFFF",
    textDim: "#CDCDCD",
    primary: "#80D932",
    secondary: "#80D932",
    scrollHandle: "#F47845",
    scrollHandleHover: "#E65F31",
  },
};

export const THEME_NAMES = Object.keys(THEMES);
export const DEFAULT_THEME = "dark";
export const THEME_STORAGE_KEY = "sbkoth-terminal-theme";

export function getTheme(name: string): TerminalTheme {
  return THEMES[name] ?? THEMES[DEFAULT_THEME];
}

export function applyThemeToDocument(theme: TerminalTheme): void {
  const root = document.documentElement;
  root.style.setProperty("--term-body", theme.body);
  root.style.setProperty("--term-text", theme.text);
  root.style.setProperty("--term-text-dim", theme.textDim);
  root.style.setProperty("--term-primary", theme.primary);
  root.style.setProperty("--term-secondary", theme.secondary);
  root.style.setProperty("--term-scroll", theme.scrollHandle);
  root.style.setProperty("--term-scroll-hover", theme.scrollHandleHover);
  root.style.setProperty("--background", hexToHslTriplet(theme.body));
  root.style.setProperty("--foreground", hexToHslTriplet(theme.text));
  root.style.setProperty("--primary", hexToHslTriplet(theme.primary));
  root.style.setProperty("--muted-foreground", hexToHslTriplet(theme.textDim));
  root.style.setProperty("--accent", hexToHslTriplet(theme.secondary));
  root.style.setProperty("--card", hexToHslTriplet(theme.body));
  root.style.setProperty("--border", hexToHslTriplet(theme.scrollHandle));
  const meta = document.querySelector('meta[name="theme-color"]');
  meta?.setAttribute("content", theme.body);
}

/** Convert #rrggbb to "H S% L%" for our hsl(var(--x)) tokens. */
export function hexToHslTriplet(hex: string): string {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!m) return "0 0% 50%";
  const r = parseInt(m[1], 16) / 255;
  const g = parseInt(m[2], 16) / 255;
  const b = parseInt(m[3], 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      default:
        h = (r - g) / d + 4;
    }
    h /= 6;
  }
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

export function loadStoredThemeName(): string {
  try {
    const v = localStorage.getItem(THEME_STORAGE_KEY);
    if (v && THEMES[v]) return v;
  } catch {
    /* ignore */
  }
  return DEFAULT_THEME;
}

export function storeThemeName(name: string): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, name);
  } catch {
    /* ignore */
  }
}
