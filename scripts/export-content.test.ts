/**
 * Unit tests for build-time content export (real loaders + real content dir).
 * Run: npx tsx --test scripts/export-content.test.ts
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import fs from "fs/promises";
import path from "path";
import {
  CONTENT_DIR,
  DATA_DIR,
  exportStaticContent,
  loadFeatures,
  loadProfile,
  loadProjects,
  loadServices,
} from "./export-content.ts";

describe("export-content loaders", () => {
  it("loads profile with required portfolio fields from real content", async () => {
    const profile = await loadProfile();
    assert.ok(profile.name && profile.name.length > 0, "name required");
    assert.ok(profile.title && profile.title.length > 0, "title required");
    assert.ok(profile.bio && profile.bio.length > 20, "bio required");
    assert.ok(profile.avatar.startsWith("/uploads/"), "avatar path");
    assert.ok(profile.socials?.email, "email required");
  });

  it("loads projects from markdown with non-empty titles and content", async () => {
    const projects = await loadProjects();
    assert.ok(projects.length >= 5, `expected several projects, got ${projects.length}`);
    for (const p of projects) {
      assert.ok(p.id > 0, "numeric id");
      assert.ok(p.slug, "slug");
      assert.ok(p.title, "title");
      assert.ok(p.description, "description");
      assert.ok(p.content.length > 0, `content for ${p.slug}`);
      assert.ok(p.publishedAt, "publishedAt iso");
    }
    // ids unique
    const ids = new Set(projects.map((p) => p.id));
    assert.equal(ids.size, projects.length);
  });

  it("loads services and features from markdown", async () => {
    const [services, features] = await Promise.all([loadServices(), loadFeatures()]);
    assert.ok(services.length >= 5, `services: ${services.length}`);
    assert.ok(features.length >= 3, `features: ${features.length}`);
    for (const s of services) {
      assert.ok(s.title && s.description && s.content.length > 0, s.title);
    }
    for (const f of features) {
      assert.ok(f.title && f.description && f.content.length > 0, f.title);
      assert.ok(Array.isArray(f.highlights), "highlights array");
    }
  });

  it("exportStaticContent writes JSON files under client/public/data", async () => {
    const result = await exportStaticContent();
    assert.ok(result.profile.name);
    assert.ok(result.projects.length > 0);
    assert.ok(result.services.length > 0);
    assert.ok(result.features.length > 0);

    for (const name of ["profile", "projects", "services", "features"]) {
      const file = path.join(DATA_DIR, `${name}.json`);
      const raw = await fs.readFile(file, "utf-8");
      const parsed = JSON.parse(raw);
      if (name === "profile") {
        assert.equal(parsed.name, result.profile.name);
      } else {
        assert.ok(Array.isArray(parsed) && parsed.length > 0, name);
      }
    }

    // Source content dir still present (sanity)
    const contentStat = await fs.stat(CONTENT_DIR);
    assert.ok(contentStat.isDirectory());
  });
});
