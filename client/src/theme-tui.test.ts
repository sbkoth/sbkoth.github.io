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
});
