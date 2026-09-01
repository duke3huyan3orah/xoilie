import { describe, expect, it } from "vitest";

import { parseProject, serializeProject } from "../../src/project/manifest.js";
import fixture from "../fixtures/minimal-project.json" with { type: "json" };

describe("project serialization", () => {
  it("round-trips validated project data", () => {
    const project = parseProject(fixture);
    const serialized = serializeProject(project);

    expect(serialized.endsWith("\n")).toBe(true);
    expect(parseProject(JSON.parse(serialized) as unknown)).toEqual(project);
  });

  it("does not accept arbitrary unknown root fields", () => {
    expect(() => parseProject({ ...fixture, credential: "must-not-persist" })).toThrow();
  });

  it("rejects unknown nested fields instead of silently deleting them", () => {
    expect(() =>
      parseProject({
        ...fixture,
        settings: { ...fixture.settings, futureSetting: true },
      }),
    ).toThrow();
  });
});
