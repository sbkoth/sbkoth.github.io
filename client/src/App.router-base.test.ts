/**
 * Unit tests for router base derivation (shipped App.tsx).
 * Run: npx tsx --test client/src/App.router-base.test.ts
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { routerBase } from "./App.tsx";

describe("routerBase (shipped)", () => {
  it("uses empty base at domain root", () => {
    assert.equal(routerBase("./", "/"), "");
    assert.equal(routerBase("/", "/"), "");
  });

  it("uses first path segment for project Pages", () => {
    assert.equal(routerBase("./", "/sbkoth-intro-page/"), "/sbkoth-intro-page");
    assert.equal(routerBase("./", "/sbkoth-intro-page"), "/sbkoth-intro-page");
    assert.equal(
      routerBase("./", "/sbkoth-intro-page/index.html"),
      "/sbkoth-intro-page",
    );
  });

  it("honors explicit env base", () => {
    assert.equal(routerBase("/sbkoth-intro-page/", "/anything"), "/sbkoth-intro-page");
  });
});
