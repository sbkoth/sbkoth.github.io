/**
 * Welcome banner art: SBKOTH wordmark (left) + terminal portrait (right).
 * Portrait is monospace-only silhouette of the formal headshot
 * (glasses, full beard, collar/tie, three-piece suit + pocket square).
 */

export const SBKOTH_LOGO: string[] = [
  "███████╗██████╗ ██╗  ██╗ ██████╗ ████████╗██╗  ██╗",
  "██╔════╝██╔══██╗██║ ██╔╝██╔═══██╗╚══██╔══╝██║  ██║",
  "███████╗██████╔╝█████╔╝ ██║   ██║   ██║   ███████║",
  "╚════██║██╔══██╗██╔═██╗ ██║   ██║   ██║   ██╔══██║",
  "███████║██████╔╝██║  ██╗╚██████╔╝   ██║   ██║  ██║",
  "╚══════╝╚═════╝ ╚═╝  ╚═╝ ╚═════╝    ╚═╝   ╚═╝  ╚═╝",
];

/** Compact logo for narrow viewports */
export const SBKOTH_LOGO_MOBILE: string[] = [
  "  ____  _     _         _   _     ",
  " / ___| |__ | | _____ | |_| |__  ",
  " \\___ \\ '_ \\| |/ / _ \\| __| '_ \\ ",
  "  ___) | |_) |   < (_) | |_| | | |",
  " |____/|_.__/|_|\\_\\___/ \\__|_| |_|",
];

/**
 * Formal portrait silhouette (no photo) — short hair, rectangular glasses,
 * full beard, white collar, necktie, navy suit lapels, waistcoat, pocket square.
 * Designed to read at IBM Plex Mono terminal sizes.
 */
export const PORTRAIT_ART: string[] = [
  "            ▄▄████▄▄            ",
  "         ▄████████████▄         ",
  "       ▄████████████████▄       ",
  "      ████▀▀▀▀████▀▀▀▀████      ",
  "     ███┌──────────────┐███     ",
  "     ███│ ▄██▄    ▄██▄ │███     ",
  "     ███│ ████    ████ │███     ",
  "     ███│ ▀██▀ ██ ▀██▀ │███     ",
  "     ███└──────╨───────┘███     ",
  "      ████▄  ▄▄▄▄▄▄  ▄████      ",
  "       ██████████████████       ",
  "      ▄██████████████████▄      ",
  "   ▄████████████████████████▄   ",
  "  ████▀  ▀████████████▀  ▀████  ",
  " ████    ████ ▐██▌ ████    ████ ",
  "████    ███   ▐██▌   ███    ████",
  "████   ███    ▐██▌    ███   ████",
  "████  ███  ·  ▐██▌  ·  ███  ████",
  " ████ ███     ▐██▌     ███ ████ ",
  "  ████████▄   ▐██▌   ▄████████  ",
  "   ██████████████████████████   ",
  "    ████████████████████████    ",
];

/**
 * Pad two string arrays into side-by-side monospace columns.
 */
export function sideBySide(
  left: string[],
  right: string[],
  gap = 3,
): string[] {
  const widthL = Math.max(0, ...left.map((l) => l.length));
  const rows = Math.max(left.length, right.length);
  const spacer = " ".repeat(gap);
  const out: string[] = [];
  for (let i = 0; i < rows; i++) {
    const l = (left[i] ?? "").padEnd(widthL, " ");
    const r = right[i] ?? "";
    out.push(`${l}${spacer}${r}`.replace(/\s+$/, ""));
  }
  return out;
}

export function welcomeBannerLines(name: string): string[] {
  const art = sideBySide(SBKOTH_LOGO, PORTRAIT_ART, 4);
  return [
    "",
    ...art,
    "",
    `  Welcome to ${name}'s terminal portfolio.`,
    "  ----",
    "  Type `help` for available commands.",
    "  Tab / Ctrl+I autocomplete · ↑/↓ history · Ctrl+L clear",
    "  ----",
    "",
  ];
}
