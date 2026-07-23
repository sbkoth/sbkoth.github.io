import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { autocomplete } from "./autocomplete.ts";
import { COMMAND_NAMES } from "./commands.ts";

const themes = ["dark", "light", "ubuntu", "blue-matrix"];

describe("autocomplete (shipped)", () => {
  it("completes unique command prefix", () => {
    const r = autocomplete("hel", COMMAND_NAMES, themes);
    assert.equal(r.completion, "help");
    assert.equal(r.hints.length, 0);
  });

  it("returns multi-match hints", () => {
    const r = autocomplete("h", COMMAND_NAMES, themes);
    assert.ok(r.hints.includes("help"));
    assert.ok(r.hints.includes("history"));
    assert.ok(!r.completion);
  });

  it("completes themes set and theme names", () => {
    assert.equal(autocomplete("themes ", COMMAND_NAMES, themes).completion, "themes set ");
    const hints = autocomplete("themes set ", COMMAND_NAMES, themes).hints;
    assert.deepEqual(hints, themes);
    const one = autocomplete("themes set u", COMMAND_NAMES, themes);
    assert.equal(one.completion, "themes set ubuntu");
  });

  it("completes projects go", () => {
    assert.equal(autocomplete("projects ", COMMAND_NAMES, themes).completion, "projects go ");
  });
});
