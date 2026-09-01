import type {
  LLMGenerationRequest,
  LLMProvider,
  ProviderCapability,
  ProviderIdentity,
} from "../contracts.js";
import { MockProviderBase } from "./base.js";

export class MockLLMProvider extends MockProviderBase<LLMGenerationRequest> implements LLMProvider {
  readonly identity: ProviderIdentity = {
    id: "mock-llm",
    name: "Mock LLM Provider",
    kind: "llm",
    version: "1.0.0",
    availability: "local",
  };

  readonly capabilities: readonly ProviderCapability[] = [
    {
      id: "text-generation",
      description: "Deterministic text fixture",
      inputMediaTypes: ["text/plain"],
      outputMediaTypes: ["text/plain"],
    },
  ];

  generate(request: LLMGenerationRequest) {
    return Promise.resolve(
      this.result(
        request,
        request.responseFormat === "json" ? "application/json" : "text/plain",
        request.responseFormat === "json" ? "json" : "txt",
        {
          content:
            request.responseFormat === "json"
              ? '{"mock":true}'
              : `MOCK RESPONSE: ${request.prompt}`,
        },
      ),
    );
  }
}
