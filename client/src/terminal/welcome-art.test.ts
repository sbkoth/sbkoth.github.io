import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { PORTRAIT_ART, SBKOTH_LOGO, sideBySide, welcomeBannerLines } from "./welcome-art.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe("welcome art (shipped)", () => {
  it("has non-empty logo and non-trivial portrait height", () => {
    assert.ok(SBKOTH_LOGO.length >= 5);
    assert.ok(PORTRAIT_ART.length >= 16, "portrait must be tall enough for torso");
    const maxW = Math.max(...PORTRAIT_ART.map((l) => l.length));
    assert.ok(maxW >= 24, "portrait must be wide enough for shoulders");
  });

  it("portrait includes glasses, beard, suit silhouette cues", () => {
    const text = PORTRAIT_ART.join("\n");
    // rectangular glasses frames
    assert.match(text, /┌|┐|└|┘|─|│|╨|▄█|██/, "glasses/frame structure");
    // dense head/hair/beard mass
    assert.match(text, /█{4,}/, "solid silhouette blocks");
    // suit / lapel / tie vertical
    assert.match(text, /▐|▌|║| lapel|█.*█/s);
    // pocket square cue (· dots on chest) or lapel spread
    assert.ok(
      text.includes("·") || text.includes("▌") || /████.*████/.test(text),
      "suit torso markers",
    );
  });

  it("sideBySide places portrait to the right of logo", () => {
    const left = ["AAA", "BBB"];
    const right = ["111", "222", "333"];
    const merged = sideBySide(left, right, 2);
    assert.equal(merged.length, 3);
    assert.match(merged[0], /AAA\s+111/);
    assert.match(merged[2], /333/);
  });

  it("welcomeBannerLines includes name and side-by-side art", () => {
    const lines = welcomeBannerLines("Srinivas Kothapalli");
    assert.ok(lines.some((l) => l.includes("Srinivas")));
    assert.ok(lines.some((l) => l.includes("help")));
    const wide = lines.find((l) => l.length > SBKOTH_LOGO[0].length + 5);
    assert.ok(wide, "expected side-by-side art line");
  });

  it("WelcomeBanner source has no photo/img avatar", () => {
    const banner = fs.readFileSync(path.join(__dirname, "WelcomeBanner.tsx"), "utf-8");
    assert.doesNotMatch(banner, /<img|welcome-photo|avatar|assetUrl/);
    assert.match(banner, /PORTRAIT_ART/);
    assert.match(banner, /SBKOTH_LOGO/);
  });
});
