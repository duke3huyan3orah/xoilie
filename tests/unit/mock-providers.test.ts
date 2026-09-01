import { describe, expect, it } from "vitest";

import {
  createMockProviders,
  MockImageProvider,
  MockLLMProvider,
} from "../../src/providers/mock/index.js";
import type { ImageProvider } from "../../src/providers/contracts.js";

describe("provider contracts and mocks", () => {
  it("provides one healthy deterministic mock for every provider category", async () => {
    const providers = createMockProviders();
    const health = await Promise.all(providers.map(async (provider) => provider.health()));

    expect(providers.map((provider) => provider.identity.kind)).toEqual([
      "llm",
      "image",
      "video",
      "audio",
      "vision",
      "upscaler",
    ]);
    expect(health.every((result) => result.status === "ready")).toBe(true);
  });

  it("returns stable, explicitly marked image results", async () => {
    const provider: ImageProvider = new MockImageProvider();
    const request = {
      requestId: "request-1",
      projectId: "project-1",
      prompt: "A controlled product study",
      mode: "text-to-image" as const,
    };

    const first = await provider.generate(request);
    const second = await provider.generate(request);

    expect(first).toEqual(second);
    expect(first.mock).toBe(true);
    expect(first.artifacts[0]?.uri).toMatch(/^mock:\/\/image\//);
    expect(first.artifacts[0]?.label).toBe("DEVELOPMENT / MOCK OUTPUT");
  });

  it("estimates zero external cost", async () => {
    const provider = new MockImageProvider();
    const estimate = await provider.estimate({
      requestId: "request-2",
      projectId: "project-1",
      prompt: "fixture",
      mode: "text-to-image",
    });

    expect(estimate.estimatedCost).toBe(0);
  });

  it("uses a JSON extension for structured LLM output", async () => {
    const result = await new MockLLMProvider().generate({
      requestId: "request-3",
      projectId: "project-1",
      prompt: "fixture",
      responseFormat: "json",
    });

    expect(result.artifacts[0]?.mediaType).toBe("application/json");
    expect(result.artifacts[0]?.uri).toMatch(/\.json$/);
  });
});
