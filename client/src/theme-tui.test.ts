/**
 * Structural tests for shipped TUI theme tokens (real CSS file).
 * Run: npx tsx --test client/src/theme-tui.test.ts
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cssPath = path.join(__dirname, "index.css");
const tailwindPath = path.join(__dirname, "../../tailwind.config.ts");

describe("TUI theme (shipped styles)", () => {
  it("uses monospace as primary font and dark terminal palette", () => {
    const css = fs.readFileSync(cssPath, "utf-8");
    assert.match(css, /font-mono/, "body should use mono");
    assert.match(css, /--background:/, "terminal bg token");
    assert.match(css, /--primary:/, "green primary token");
    assert.match(css, /\.tui-window/, "single terminal window shell");
    assert.match(css, /\.tui-link-row/, "contact link row for mailto");
    assert.match(css, /color-scheme:\s*dark/, "dark color scheme");
    assert.match(css, /pointer-events:\s*none/, "scanlines must not block clicks");
  });

  it("configures JetBrains Mono in Tailwind font stack", () => {
    const tw = fs.readFileSync(tailwindPath, "utf-8");
    assert.match(tw, /JetBrains Mono/);
    assert.match(tw, /fontFamily/);
  });

  it("ships TerminalPanel and mailto-capable contact", () => {
    const panel = path.join(__dirname, "components/terminal-panel.tsx");
    const contact = path.join(__dirname, "components/contact.tsx");
    assert.ok(fs.existsSync(panel));
    assert.ok(fs.existsSync(contact));
    const src = fs.readFileSync(panel, "utf-8");
    const contactSrc = fs.readFileSync(contact, "utf-8");
    assert.match(src, /visitor/);
    assert.match(contactSrc, /openMailto|buildMailtoHref|mailto:/);
  });
});

