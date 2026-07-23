/**
 * Pure command-history navigation (Up / Down).
 * History is stored newest-first (index 0 = most recent submit).
 */

export type HistoryNav = {
  value: string;
  pointer: number;
};

/** Move older in history (ArrowUp). pointer -1 means not navigating. */
export function historyUp(history: string[], pointer: number): HistoryNav | null {
  if (history.length === 0) return null;
  if (pointer + 1 >= history.length) return null;
  const next = pointer + 1;
  return { value: history[next], pointer: next };
}

/** Move newer in history (ArrowDown). */
export function historyDown(history: string[], pointer: number): HistoryNav | null {
  if (pointer < 0) return null;
  if (pointer === 0) {
    return { value: "", pointer: -1 };
  }
  const next = pointer - 1;
  return { value: history[next], pointer: next };
}
