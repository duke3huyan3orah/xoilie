import type {
  AudioGenerationRequest,
  AudioProvider,
  ProviderCapability,
  ProviderIdentity,
} from "../contracts.js";
import { MockProviderBase } from "./base.js";

export class MockAudioProvider
  extends MockProviderBase<AudioGenerationRequest>
  implements AudioProvider
{
  readonly identity: ProviderIdentity = {
    id: "mock-audio",
    name: "Mock Audio Provider",
    kind: "audio",
    version: "1.0.0",
    availability: "local",
  };
  readonly capabilities: readonly ProviderCapability[] = [
    {
      id: "audio-placeholder",
      description: "Deterministic audio reference",
      inputMediaTypes: ["text/plain"],
      outputMediaTypes: ["audio/wav"],
    },
  ];

  generate(request: AudioGenerationRequest) {
    return Promise.resolve(
      this.result(request, "audio/wav", "wav", {
        mode: request.mode,
        durationSeconds: request.durationSeconds ?? 0,
      }),
    );
  }
}
