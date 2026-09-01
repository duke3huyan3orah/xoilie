export * from "./audio.js";
export * from "./image.js";
export * from "./llm.js";
export * from "./upscaler.js";
export * from "./video.js";
export * from "./vision.js";

import { MockAudioProvider } from "./audio.js";
import { MockImageProvider } from "./image.js";
import { MockLLMProvider } from "./llm.js";
import { MockUpscalerProvider } from "./upscaler.js";
import { MockVideoProvider } from "./video.js";
import { MockVisionProvider } from "./vision.js";

export function createMockProviders() {
  return [
    new MockLLMProvider(),
    new MockImageProvider(),
    new MockVideoProvider(),
    new MockAudioProvider(),
    new MockVisionProvider(),
    new MockUpscalerProvider(),
  ] as const;
}
