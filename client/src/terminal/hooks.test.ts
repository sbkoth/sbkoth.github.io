/**
 * Unit tests for pure terminal helpers shipped from hooks.ts
 * (live-region announcements, history caps, combobox hint navigation).
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  announceLatestOutput,
  hintOptionId,
  type HistoryEntry,
  limitCmdHistory,
  limitVisibleEntries,
  MAX_CMD_HISTORY,
  MAX_VISIBLE_ENTRIES,
  nextHintIndex,
} from "./hooks.ts";

function entry(
  id: number,
  input: string,
  lines: string[],
  extra?: Partial<HistoryEntry["result"]>,
): HistoryEntry {
  return {
    id,
    input,
    result: { lines, ...extra },
  };
}

describe("announceLatestOutput (shipped)", () => {
  it("returns empty string when there are no entries", () => {
    assert.equal(announceLatestOutput([]), "");
  });

  it("joins latest command output lines", () => {
    const text = announceLatestOutput([
      entry(1, "help", ["line a", "line b"]),
      entry(2, "about", ["Bio line", "More"]),
    ]);
    assert.equal(text, "Bio line\nMore");
  });

  it("announces welcome with fallback when lines empty", () => {
    const text = announceLatestOutput([
      entry(1, "welcome", [], { variant: "welcome", welcomeName: "Srinivas" }),
    ]);
    assert.match(text, /Welcome to Srinivas's terminal portfolio/);
    assert.match(text, /Available commands:/);
    assert.match(text, /help/);
  });

  it("prefers welcome lines when present (includes help menu text)", () => {
    const text = announceLatestOutput([
      entry(1, "welcome", ["Welcome to X", "help - show"], {
        variant: "welcome",
        welcomeName: "X",
      }),
    ]);
    assert.equal(text, "Welcome to X\nhelp - show");
  });

  it("announces empty-output commands by input", () => {
    const text = announceLatestOutput([entry(1, "clear", [])]);
    assert.equal(text, "Command completed: clear");
  });
});

describe("history caps (shipped)", () => {
  it("limitVisibleEntries keeps the newest MAX_VISIBLE_ENTRIES", () => {
    const many = Array.from({ length: MAX_VISIBLE_ENTRIES + 25 }, (_, i) =>
      entry(i + 1, `echo ${i}`, [`out ${i}`]),
    );
    const limited = limitVisibleEntries(many);
    assert.equal(limited.length, MAX_VISIBLE_ENTRIES);
    assert.equal(limited[0].id, 26);
    assert.equal(limited[limited.length - 1].id, MAX_VISIBLE_ENTRIES + 25);
  });

  it("limitCmdHistory keeps the first MAX_CMD_HISTORY (newest-first list)", () => {
    const hist = Array.from({ length: MAX_CMD_HISTORY + 10 }, (_, i) => `cmd-${i}`);
    const limited = limitCmdHistory(hist);
    assert.equal(limited.length, MAX_CMD_HISTORY);
    assert.equal(limited[0], "cmd-0");
    assert.equal(limited[limited.length - 1], `cmd-${MAX_CMD_HISTORY - 1}`);
  });
});

describe("autocomplete listbox helpers (shipped)", () => {
  it("hintOptionId builds stable option ids", () => {
    assert.equal(hintOptionId(0), "terminal-hint-0");
    assert.equal(hintOptionId(3), "terminal-hint-3");
  });

  it("nextHintIndex wraps around the listbox", () => {
    assert.equal(nextHintIndex(3, -1, 1), 0);
    assert.equal(nextHintIndex(3, 0, 1), 1);
    assert.equal(nextHintIndex(3, 2, 1), 0);
    assert.equal(nextHintIndex(3, 0, -1), 2);
    assert.equal(nextHintIndex(3, 2, -1), 1);
    assert.equal(nextHintIndex(0, 0, 1), -1);
  });
});
