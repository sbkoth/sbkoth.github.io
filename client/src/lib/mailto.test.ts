/**
 * Unit tests for shipped mail helpers.
 * Run: npx tsx --test client/src/lib/mailto.test.ts
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildGmailComposeHref, buildMailtoHref } from "./mailto.ts";

describe("buildMailtoHref (shipped)", () => {
  it("builds a plain mailto from email", () => {
    assert.equal(buildMailtoHref("bobby@prameya.legal"), "mailto:bobby@prameya.legal");
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

describe("buildGmailComposeHref (shipped)", () => {
  it("builds a Gmail compose URL with to=", () => {
    const href = buildGmailComposeHref("bobby@prameya.legal");
    assert.match(href, /^https:\/\/mail\.google\.com\/mail\/\?/);
    assert.match(href, /to=bobby%40prameya\.legal|to=bobby@prameya\.legal/);
    assert.match(href, /view=cm/);
    assert.match(href, /fs=1/);
  });

  it("includes subject when provided", () => {
    const href = buildGmailComposeHref("bobby@prameya.legal", "Hi there");
    assert.match(href, /su=Hi(\+|%20)there/);
  });

  it("returns empty for blank email", () => {
    assert.equal(buildGmailComposeHref(""), "");
  });
});
