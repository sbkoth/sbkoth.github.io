import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { historyDown, historyUp } from "./history.ts";

describe("history navigation (shipped)", () => {
  const hist = ["help", "welcome", "about"]; // newest first

  it("ArrowUp walks to older entries", () => {
    const a = historyUp(hist, -1);
    assert.deepEqual(a, { value: "help", pointer: 0 });
    const b = historyUp(hist, 0);
    assert.deepEqual(b, { value: "welcome", pointer: 1 });
    const c = historyUp(hist, 2);
    assert.equal(c, null);
  });

  it("ArrowDown walks back toward empty", () => {
    const a = historyDown(hist, 1);
    assert.deepEqual(a, { value: "help", pointer: 0 });
    const b = historyDown(hist, 0);
    assert.deepEqual(b, { value: "", pointer: -1 });
    assert.equal(historyDown(hist, -1), null);
  });
});
