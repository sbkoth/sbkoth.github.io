/**
 * Unit tests for the shipped Markdown sanitize helper used by content-dialog.
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { enhanceListMarkup, renderSafeMarkdown } from "./sanitize-markdown.ts";

describe("renderSafeMarkdown (shipped)", () => {
  it("renders plain markdown to safe HTML", () => {
    const html = renderSafeMarkdown("## Hello\n\nA **bold** paragraph.");
    assert.match(html, /<h2>/i);
    assert.match(html, /<strong>bold<\/strong>/i);
    assert.doesNotMatch(html, /<script/i);
  });

  it("strips script tags from markdown", () => {
    const html = renderSafeMarkdown('Hello <script>alert("xss")</script> world');
    assert.doesNotMatch(html, /<script/i);
    assert.doesNotMatch(html, /alert\(/i);
    assert.match(html, /Hello/);
    assert.match(html, /world/);
  });

  it("strips inline event handlers from raw HTML input", () => {
    const html = renderSafeMarkdown(
      '<p onclick="alert(1)">click me</p><img src=x onerror="alert(2)">',
    );
    assert.doesNotMatch(html, /onclick/i);
    assert.doesNotMatch(html, /onerror/i);
    assert.doesNotMatch(html, /alert\(/i);
  });

  it("strips javascript: URLs from anchors", () => {
    const html = renderSafeMarkdown(
      '[go](javascript:alert(1)) and <a href="javascript:void(0)">x</a>',
    );
    assert.doesNotMatch(html, /javascript:/i);
  });

  it("adds noopener noreferrer on external links", () => {
    const html = renderSafeMarkdown("[site](https://example.com/path)");
    assert.match(html, /href="https:\/\/example\.com\/path"/);
    assert.match(html, /rel="noopener noreferrer"/);
    assert.match(html, /target="_blank"/);
  });

  it("overwrites hostile rel=opener with noopener noreferrer", () => {
    // Without force-set, hardenLinks would keep rel="opener" and leave reverse tabnabbing.
    const html = renderSafeMarkdown(
      '<a href="https://evil.example/" rel="opener" target="_blank">phish</a>',
    );
    assert.match(html, /href="https:\/\/evil\.example\/"/);
    assert.match(html, /rel="noopener noreferrer"/);
    assert.doesNotMatch(html, /\brel\s*=\s*["']opener["']/i);
    assert.doesNotMatch(html, /\brel\s*=\s*["'][^"']*\bopener\b[^"']*["']/i);
    assert.match(html, /target="_blank"/);
  });

  it("overwrites empty or weak rel values on anchors", () => {
    const empty = renderSafeMarkdown(
      '<a href="https://example.com" rel="">x</a>',
    );
    assert.match(empty, /rel="noopener noreferrer"/);
    assert.doesNotMatch(empty, /\brel\s*=\s*["']["']/);

    const weak = renderSafeMarkdown(
      '<a href="https://example.com" rel="nofollow">y</a>',
    );
    assert.match(weak, /rel="noopener noreferrer"/);
    // nofollow alone is insufficient for target=_blank safety; we force both tokens
    assert.match(weak, /noopener/);
    assert.match(weak, /noreferrer/);
  });

  it("enhances list markup after sanitize", () => {
    const html = renderSafeMarkdown("- one\n- two");
    assert.match(html, /class="space-y-1/);
    assert.match(html, /▸/);
  });
});

describe("enhanceListMarkup (shipped)", () => {
  it("wraps li/ul with terminal classes without reintroducing tags", () => {
    const out = enhanceListMarkup("<ul><li>item</li></ul>");
    assert.match(out, /text-primary/);
    assert.match(out, /list-none/);
    assert.doesNotMatch(out, /<script/i);
  });
});
