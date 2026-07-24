/**
 * Structural check: primary home is interactive terminal surface.
 */

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe("terminal primary surface (shipped)", () => {
  it("home renders Terminal component", () => {
    const home = fs.readFileSync(path.join(__dirname, "pages/home.tsx"), "utf-8");
    assert.match(home, /from "@\/terminal\/Terminal"|from '@\/terminal\/Terminal'/);
    assert.match(home, /<Terminal/);
  });

  it("Terminal has prompt input and keyboard handlers", () => {
    const term = fs.readFileSync(path.join(__dirname, "terminal/Terminal.tsx"), "utf-8");
    const hooks = fs.readFileSync(path.join(__dirname, "terminal/hooks.ts"), "utf-8");
    const surface = term + "\n" + hooks;
    assert.match(surface, /terminal-input/);
    assert.match(surface, /ArrowUp|historyUp/);
    assert.match(surface, /Tab|autocomplete/);
    assert.match(surface, /Ctrl|ctrlL|clear/);
    assert.match(term, /data-testid="terminal-wrapper"/);
    assert.match(term, /aria-live|terminal-live-region/);
  });

  it("Terminal exposes combobox/listbox autocomplete a11y wiring", () => {
    const term = fs.readFileSync(path.join(__dirname, "terminal/Terminal.tsx"), "utf-8");
    assert.match(term, /role="combobox"/);
    assert.match(term, /aria-autocomplete="list"/);
    assert.match(term, /aria-expanded=\{listboxOpen\}/);
    assert.match(term, /aria-controls/);
    assert.match(term, /aria-activedescendant/);
    assert.match(term, /role="listbox"/);
    assert.match(term, /role="option"/);
    assert.match(term, /aria-selected/);
    assert.match(term, /hintOptionId/);
  });

  it("Terminal has graceful data-load error fallback with retry", () => {
    const term = fs.readFileSync(path.join(__dirname, "terminal/Terminal.tsx"), "utf-8");
    assert.match(term, /isError/);
    assert.match(term, /DataLoadError|terminal-error/);
    assert.match(term, /refetch/);
    assert.match(term, /terminal-retry|Retry/);
    assert.match(term, /role="alert"|aria-live="assertive"/);
  });

  it("static queries keep Infinity staleTime", () => {
    const qc = fs.readFileSync(path.join(__dirname, "lib/queryClient.ts"), "utf-8");
    assert.match(qc, /staleTime:\s*Infinity/);
  });

  it("fonts load only needed IBM Plex Mono weights", () => {
    const html = fs.readFileSync(path.join(__dirname, "../index.html"), "utf-8");
    assert.match(html, /IBM\+Plex\+Mono:wght@500;600/);
    assert.doesNotMatch(html, /wght@400;500;600;700/);
  });

  it("command registry includes help/welcome/themes/projects", () => {
    const cmds = fs.readFileSync(path.join(__dirname, "terminal/commands.ts"), "utf-8");
    assert.match(cmds, /COMMAND_REGISTRY/);
    for (const c of [
      "help",
      "welcome",
      "clear",
      "themes",
      "projects",
      "socials",
      "email",
      "history",
      "echo",
      "pwd",
      "whoami",
    ]) {
      assert.match(cmds, new RegExp(`cmd:\\s*"${c}"`));
    }
  });

  it("components tree keeps only content-dialog + dialog primitive", () => {
    const componentsDir = path.join(__dirname, "components");
    const entries = fs.readdirSync(componentsDir, { withFileTypes: true });
    const files = entries.filter((e) => e.isFile()).map((e) => e.name);
    const dirs = entries.filter((e) => e.isDirectory()).map((e) => e.name);
    assert.deepEqual(files.sort(), ["content-dialog.tsx"]);
    assert.deepEqual(dirs.sort(), ["ui"]);
    const uiFiles = fs.readdirSync(path.join(componentsDir, "ui"));
    assert.deepEqual(uiFiles.sort(), ["dialog.tsx"]);
    // Dead marketing modules must not reappear
    for (const dead of [
      "hero.tsx",
      "project-grid.tsx",
      "project-card.tsx",
      "case-study.tsx",
      "features.tsx",
      "services.tsx",
      "contact.tsx",
      "pdf-viewer.tsx",
      "slide-viewer.tsx",
      "testimonials.tsx",
      "process.tsx",
      "terminal-panel.tsx",
    ]) {
      assert.equal(fs.existsSync(path.join(componentsDir, dead)), false, dead);
    }
  });

  it("content-dialog still uses sanitize + dialog primitive", () => {
    const dialog = fs.readFileSync(path.join(__dirname, "components/content-dialog.tsx"), "utf-8");
    assert.match(dialog, /renderSafeMarkdown/);
    assert.match(dialog, /@\/components\/ui\/dialog/);
  });
});
