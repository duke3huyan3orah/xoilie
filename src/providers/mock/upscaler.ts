import type {
  ProviderCapability,
  ProviderIdentity,
  UpscaleGenerationRequest,
  UpscalerProvider,
} from "../contracts.js";
import { MockProviderBase } from "./base.js";

export class MockUpscalerProvider
  extends MockProviderBase<UpscaleGenerationRequest>
  implements UpscalerProvider
{
  readonly identity: ProviderIdentity = {
    id: "mock-upscaler",
    name: "Mock Upscaler Provider",
    kind: "upscaler",
    version: "1.0.0",
    availability: "local",
  };
  readonly capabilities: readonly ProviderCapability[] = [
    {
      id: "upscale-placeholder",
      description: "Deterministic upscale reference",
      inputMediaTypes: ["image/*"],
      outputMediaTypes: ["image/png"],
    },
  ];

  generate(request: UpscaleGenerationRequest) {
    return Promise.resolve(this.result(request, "image/png", "png", { scale: request.scale }));
  }
}
