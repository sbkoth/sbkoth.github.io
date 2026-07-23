/**
 * Unit tests for shipped terminal command dispatch.
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  COMMAND_NAMES,
  COMMAND_REGISTRY,
  dispatchCommand,
  getCommand,
  type PortfolioData,
  welcomeLines,
} from "./commands.ts";

const data: PortfolioData = {
  profile: {
    name: "Srinivas Kothapalli",
    title: "Data Platform Architect",
    bio: "Bio line about platforms.",
    socials: {
      github: "https://github.com/sbkoth",
      email: "bobby@prameya.legal",
    },
  },
  projects: [
    {
      title: "Data Highway",
      description: "Streaming backbone",
      slug: "data-highway",
      content: "Long form content",
    },
    {
      title: "Other Project",
      description: "Desc 2",
      slug: "other",
      content: "More",
    },
  ],
  features: [
    {
      title: "AI",
      description: "ML work",
      highlights: ["RAG", "Platforms"],
    },
  ],
  services: [{ title: "Kafka", description: "Streaming platforms" }],
};

const themes = ["dark", "light", "ubuntu"];

describe("dispatchCommand (shipped)", () => {
  it("returns not-found for unknown commands", () => {
    const r = dispatchCommand("foobar", data, [], themes);
    assert.match(r.lines[0] ?? "", /command not found: foobar/);
  });

  it("help lists all registered commands and shortcuts", () => {
    const r = dispatchCommand("help", data, [], themes);
    const text = r.lines.join("\n");
    for (const cmd of COMMAND_NAMES) {
      assert.match(text, new RegExp(`\\b${cmd}\\b`));
    }
    assert.match(text, /Tab or Ctrl/);
    assert.match(text, /Ctrl \+ l/i);
  });

  it("welcome includes portfolio name", () => {
    const r = dispatchCommand("welcome", data, [], themes);
    assert.ok(r.lines.some((l) => l.includes("Srinivas")));
  });

  it("about returns profile bio", () => {
    const r = dispatchCommand("about", data, [], themes);
    assert.ok(r.lines.some((l) => l.includes("Bio line")));
    assert.ok(r.lines.some((l) => l.includes("Data Platform")));
  });

  it("clear returns clear side effect", () => {
    const r = dispatchCommand("clear", data, [], themes);
    assert.equal(r.sideEffect?.type, "clear");
  });

  it("echo prints arguments", () => {
    const r = dispatchCommand("echo hello world", data, [], themes);
    assert.deepEqual(r.lines, ["hello world"]);
  });

  it("history prints prior entries", () => {
    const r = dispatchCommand("history", data, ["help", "welcome"], themes);
    const text = r.lines.join("\n");
    assert.match(text, /welcome/);
    assert.match(text, /help/);
  });

  it("projects lists titles and go opens detail", () => {
    const list = dispatchCommand("projects", data, [], themes);
    assert.ok(list.lines.some((l) => l.includes("Data Highway")));
    const detail = dispatchCommand("projects go 1", data, [], themes);
    assert.ok(detail.lines.some((l) => l.includes("Long form")));
  });

  it("themes set returns theme side effect", () => {
    const r = dispatchCommand("themes set ubuntu", data, [], themes);
    assert.equal(r.sideEffect?.type, "theme");
    if (r.sideEffect?.type === "theme") {
      assert.equal(r.sideEffect.name, "ubuntu");
    }
  });

  it("email returns mailto side effect and lists addresses", () => {
    const r = dispatchCommand("email", data, [], themes);
    assert.equal(r.sideEffect?.type, "mailto");
    if (r.sideEffect?.type === "mailto") {
      assert.equal(r.sideEffect.email, "bobby@prameya.legal");
    }
    const text = r.lines.join("\n");
    assert.match(text, /bobby@prameya\.legal/);
    assert.match(text, /mail\.google\.com/);
  });

  it("socials go opens github", () => {
    const r = dispatchCommand("socials go 1", data, [], themes);
    assert.equal(r.sideEffect?.type, "open");
    if (r.sideEffect?.type === "open") {
      assert.match(r.sideEffect.url, /github\.com\/sbkoth/);
    }
  });

  it("welcomeLines is non-empty art", () => {
    assert.ok(welcomeLines("Test").length > 5);
  });

  it("COMMAND_REGISTRY is the source of COMMAND_NAMES and handlers", () => {
    assert.ok(COMMAND_REGISTRY.length >= 10);
    assert.equal(COMMAND_NAMES.length, COMMAND_REGISTRY.length);
    for (const def of COMMAND_REGISTRY) {
      assert.ok(typeof def.handler === "function", def.cmd);
      assert.equal(getCommand(def.cmd)?.cmd, def.cmd);
    }
    // help text is derived from the same registry
    const help = dispatchCommand("help", data, [], themes);
    for (const def of COMMAND_REGISTRY) {
      assert.ok(
        help.lines.some((l) => l.includes(def.cmd)),
        `help should list ${def.cmd}`,
      );
    }
  });
});
