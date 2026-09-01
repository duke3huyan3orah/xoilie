import { describe, expect, it } from "vitest";

import { loadConfig } from "../../src/config/config.js";

describe("loadConfig", () => {
  it("uses deterministic mock providers by default", () => {
    const config = loadConfig({});

    expect(config.environment).toBe("development");
    expect(config.providers).toEqual({
      llm: "mock-llm",
      image: "mock-image",
      video: "mock-video",
      audio: "mock-audio",
      vision: "mock-vision",
      upscaler: "mock-upscaler",
    });
    expect(config.bypass).toBe(false);
  });

  it("parses explicit boolean and model settings", () => {
    const config = loadConfig({
      XOILIE_BYPASS: "1",
      XOILIE_DEVELOPMENT_MODE: "true",
      XOILIE_LLM_MODEL: "local/test-model",
    });

    expect(config.bypass).toBe(true);
    expect(config.developmentMode).toBe(true);
    expect(config.models.llm).toBe("local/test-model");
  });

  it("rejects ambiguous boolean settings", () => {
    expect(() => loadConfig({ XOILIE_BYPASS: "yes" })).toThrow();
  });
});
