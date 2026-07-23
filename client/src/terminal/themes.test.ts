import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { DEFAULT_THEME, getTheme, hexToHslTriplet, THEME_NAMES } from "./themes.ts";

describe("themes (shipped)", () => {
  it("includes several named palettes", () => {
    assert.ok(THEME_NAMES.length >= 5);
    assert.ok(THEME_NAMES.includes("dark"));
    assert.ok(THEME_NAMES.includes("ubuntu"));
    assert.ok(THEME_NAMES.includes("blue-matrix"));
  });

  it("getTheme falls back to default", () => {
    assert.equal(getTheme("nope").name, DEFAULT_THEME);
    assert.equal(getTheme("dark").primary.length > 0, true);
  });

  it("hexToHslTriplet converts hex colors", () => {
    const hsl = hexToHslTriplet("#000000");
    assert.match(hsl, /0\s+0%\s+0%/);
    const green = hexToHslTriplet("#05CE91");
    assert.match(green, /^\d+\s+\d+%\s+\d+%$/);
  });
});
