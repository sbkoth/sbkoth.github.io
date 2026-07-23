/**
 * Unit tests for shipped mailto helper.
 * Run: npx tsx --test client/src/lib/mailto.test.ts
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { buildMailtoHref } from "./mailto.ts";

describe("buildMailtoHref (shipped)", () => {
  it("builds a plain mailto from email", () => {
    assert.equal(
      buildMailtoHref("bobby@prameya.legal"),
      "mailto:bobby@prameya.legal",
    );
  });

  it("trims whitespace and ignores empty", () => {
    assert.equal(buildMailtoHref("  a@b.co  "), "mailto:a@b.co");
    assert.equal(buildMailtoHref(""), "");
    assert.equal(buildMailtoHref("   "), "");
  });

  it("appends encoded subject when provided", () => {
    assert.equal(
      buildMailtoHref("bobby@prameya.legal", "Hello there"),
      "mailto:bobby@prameya.legal?subject=Hello%20there",
    );
  });
});
