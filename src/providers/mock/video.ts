import type {
  ProviderCapability,
  ProviderIdentity,
  VideoGenerationRequest,
  VideoProvider,
} from "../contracts.js";
import { MockProviderBase } from "./base.js";

export class MockVideoProvider
  extends MockProviderBase<VideoGenerationRequest>
  implements VideoProvider
{
  readonly identity: ProviderIdentity = {
    id: "mock-video",
    name: "Mock Video Provider",
    kind: "video",
    version: "1.0.0",
    availability: "local",
  };
  readonly capabilities: readonly ProviderCapability[] = [
    {
      id: "video-placeholder",
      description: "Deterministic video reference",
      inputMediaTypes: ["text/plain", "image/*"],
      outputMediaTypes: ["video/mp4"],
    },
  ];

  generate(request: VideoGenerationRequest) {
    return Promise.resolve(
      this.result(request, "video/mp4", "mp4", {
        mode: request.mode,
        durationSeconds: request.durationSeconds,
      }),
    );
  }
}
