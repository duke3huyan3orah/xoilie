import type { ProviderKind } from "./contracts.js";

export type ProviderErrorCode =
  | "AUTHENTICATION"
  | "CONFIGURATION"
  | "INVALID_REQUEST"
  | "RATE_LIMITED"
  | "TIMEOUT"
  | "UNAVAILABLE"
  | "GENERATION_FAILED"
  | "CANCELLED";

export class ProviderError extends Error {
  readonly code: ProviderErrorCode;
  readonly providerId: string;
  readonly providerKind: ProviderKind;
  readonly retryable: boolean;
  readonly details?: Readonly<Record<string, unknown>>;

  constructor(input: {
    message: string;
    code: ProviderErrorCode;
    providerId: string;
    providerKind: ProviderKind;
    retryable?: boolean;
    details?: Readonly<Record<string, unknown>>;
  }) {
    super(input.message);
    this.name = "ProviderError";
    this.code = input.code;
    this.providerId = input.providerId;
    this.providerKind = input.providerKind;
    this.retryable = input.retryable ?? false;
    if (input.details !== undefined) this.details = input.details;
  }
}
