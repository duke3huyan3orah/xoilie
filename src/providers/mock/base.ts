import type {
  GenerationRequest,
  ProviderCapability,
  ProviderConfiguration,
  ProviderEstimate,
  ProviderGenerationResult,
  ProviderHealth,
  ProviderIdentity,
} from "../contracts.js";

export abstract class MockProviderBase<Request extends GenerationRequest> {
  abstract readonly identity: ProviderIdentity;
  abstract readonly capabilities: readonly ProviderCapability[];
  readonly configuration: ProviderConfiguration = { model: "deterministic-mock-v1" };

  health(): Promise<ProviderHealth> {
    return Promise.resolve({
      status: "ready",
      checkedAt: new Date(0).toISOString(),
      message: "Deterministic mock provider; no external service is called.",
    });
  }

  estimate(_request: Request): Promise<ProviderEstimate> {
    return Promise.resolve({
      estimatedDurationSeconds: 0,
      estimatedCost: 0,
      currency: "USD",
      notes: ["Mock estimate"],
    });
  }

  cancel(_requestId: string): Promise<void> {
    return Promise.resolve();
  }

  protected result(
    request: Request,
    mediaType: string,
    extension: string,
    metadata = {},
  ): ProviderGenerationResult {
    const fingerprint = stableFingerprint(JSON.stringify(request));
    return {
      providerId: this.identity.id,
      model: this.configuration.model ?? "deterministic-mock-v1",
      artifacts: [
        {
          uri: `mock://${this.identity.kind}/${request.requestId}-${fingerprint}.${extension}`,
          mediaType,
          label: "DEVELOPMENT / MOCK OUTPUT",
        },
      ],
      metadata: { fingerprint, ...metadata },
      mock: true,
    };
  }
}

function stableFingerprint(value: string): string {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}
