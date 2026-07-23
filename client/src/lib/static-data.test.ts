/**
 * Unit tests for shipped static path helpers.
 * Run: npx tsx --test client/src/lib/static-data.test.ts
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { resolveAssetUrl, resolveDataUrl } from "./static-data.ts";

describe("resolveDataUrl / resolveAssetUrl (shipped)", () => {
  it("builds data URLs under absolute root base /", () => {
    assert.equal(resolveDataUrl("profile", "/"), "/data/profile.json");
    assert.equal(resolveDataUrl("projects", "/"), "/data/projects.json");
    assert.equal(resolveAssetUrl("/uploads/photo.jpg", "/"), "/uploads/photo.jpg");
    assert.equal(resolveAssetUrl("https://example.com/x.png", "/"), "https://example.com/x.png");
  });

  it("builds data URLs under root-relative base ./", () => {
    assert.equal(resolveDataUrl("profile", "./"), "./data/profile.json");
    assert.equal(resolveAssetUrl("/uploads/photo.jpg", "./"), "./uploads/photo.jpg");
  });

  it("prefixes data and assets with an explicit project subpath", () => {
    assert.equal(
      resolveDataUrl("features", "/sbkoth-intro-page/"),
      "/sbkoth-intro-page/data/features.json",
    );
    assert.equal(
      resolveAssetUrl("/uploads/1740109013236-profile-photo.jpg", "/sbkoth-intro-page/"),
      "/sbkoth-intro-page/uploads/1740109013236-profile-photo.jpg",
    );
  });
});
