import { describe, expect, it } from "vitest";

import {
  CreativeBriefSchema,
  GenerationMetadataSchema,
  ProjectSchema,
  ProviderDefinitionSchema,
  ShotSchema,
} from "../../src/domain/index.js";
import fixture from "../fixtures/minimal-project.json" with { type: "json" };

describe("domain schemas", () => {
  it("accepts a schema-versioned minimal project", () => {
    expect(ProjectSchema.parse(fixture).id).toBe("fixture-project");
  });

  it("rejects unsupported project schema versions", () => {
    expect(() => ProjectSchema.parse({ ...fixture, schemaVersion: 2 })).toThrow();
  });

  it("rejects zero-sized aspect ratios", () => {
    expect(() =>
      ProjectSchema.parse({
        ...fixture,
        settings: { ...fixture.settings, aspectRatio: "0:9" },
      }),
    ).toThrow();
  });

  it("accepts credential variable names but not credential-shaped values", () => {
    const provider = {
      id: "example-image",
      type: "image",
      enabled: true,
      options: {},
    };

    expect(
      ProviderDefinitionSchema.parse({
        ...provider,
        apiKeyEnvironmentVariable: "EXAMPLE_API_KEY",
      }).apiKeyEnvironmentVariable,
    ).toBe("EXAMPLE_API_KEY");
    expect(() =>
      ProviderDefinitionSchema.parse({ ...provider, apiKeyEnvironmentVariable: "sk-secret" }),
    ).toThrow();
  });

  it("validates foundational creative and production records", () => {
    const brief = CreativeBriefSchema.parse({
      title: "Product study",
      objective: "Explain the product form",
      audience: "Designers",
      subject: "Mechanical watch",
      environment: "Dark studio",
      era: "Contemporary",
      visualStyle: ["precision still life"],
      genre: "product film",
      mood: ["focused"],
      emotionalArc: ["curiosity", "confidence"],
      colorDirection: ["graphite", "silver"],
      lighting: ["controlled rim light"],
      cameraLanguage: ["macro", "slow dolly"],
      aspectRatio: "16:9",
      durationSeconds: 20,
      platform: "web",
      pacing: "measured",
      referenceIds: [],
      constraints: [],
      requiredAssets: ["watch"],
      forbiddenElements: ["unapproved logos"],
    });
    const shot = ShotSchema.parse({
      id: "shot-001",
      order: 0,
      durationSeconds: 3,
      purpose: "Establish precision",
      narrativeFunction: "introduction",
      visualPurpose: "reveal materials",
      emotionalPurpose: "create curiosity",
      subjectIds: ["watch"],
      composition: "centered macro",
      framing: "extreme close-up",
      cameraPosition: "dial height",
      cameraMovement: "slow push-in",
      lens: "100mm macro",
      depthOfField: "shallow",
      focus: "rack from crown to dial",
      lighting: "hard rim with soft fill",
      color: "graphite and silver",
      atmosphere: "clean studio",
      action: "second hand advances",
      emotion: "precision",
      transition: "cut",
      audio: "quiet mechanical tick",
      generationPrompt: "Canonical prompt pending compiler",
      negativePrompt: "distorted dial markings",
      requiredReferenceIds: [],
    });
    const metadata = GenerationMetadataSchema.parse({
      providerId: "mock-image",
      model: "deterministic-mock-v1",
      prompt: shot.generationPrompt,
      parameters: {},
      createdAt: "2026-01-01T00:00:00.000Z",
      sourceReferenceIds: [],
      version: 1,
      mock: true,
    });

    expect(brief.durationSeconds).toBe(20);
    expect(shot.lens).toBe("100mm macro");
    expect(metadata.version).toBe(1);
  });
});
