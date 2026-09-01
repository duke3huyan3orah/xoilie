import type {
  ProviderCapability,
  ProviderIdentity,
  VisionGenerationRequest,
  VisionProvider,
} from "../contracts.js";
import { MockProviderBase } from "./base.js";

export class MockVisionProvider
  extends MockProviderBase<VisionGenerationRequest>
  implements VisionProvider
{
  readonly identity: ProviderIdentity = {
    id: "mock-vision",
    name: "Mock Vision Provider",
    kind: "vision",
    version: "1.0.0",
    availability: "local",
  };
  readonly capabilities: readonly ProviderCapability[] = [
    {
      id: "vision-placeholder",
      description: "Deterministic analysis fixture",
      inputMediaTypes: ["image/*", "video/*"],
      outputMediaTypes: ["application/json"],
    },
  ];

  generate(request: VisionGenerationRequest) {
    return Promise.resolve(
      this.result(request, "application/json", "json", {
        mode: request.mode,
        assessment: "mock-pass",
      }),
    );
  }
}
