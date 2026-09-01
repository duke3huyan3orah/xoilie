import type {
  ImageGenerationRequest,
  ImageProvider,
  ProviderCapability,
  ProviderIdentity,
} from "../contracts.js";
import { MockProviderBase } from "./base.js";

export class MockImageProvider
  extends MockProviderBase<ImageGenerationRequest>
  implements ImageProvider
{
  readonly identity: ProviderIdentity = {
    id: "mock-image",
    name: "Mock Image Provider",
    kind: "image",
    version: "1.0.0",
    availability: "local",
  };
  readonly capabilities: readonly ProviderCapability[] = [
    {
      id: "image-placeholder",
      description: "Deterministic image reference",
      inputMediaTypes: ["text/plain", "image/*"],
      outputMediaTypes: ["image/png"],
    },
  ];

  generate(request: ImageGenerationRequest) {
    return Promise.resolve(this.result(request, "image/png", "png", { mode: request.mode }));
  }
}
