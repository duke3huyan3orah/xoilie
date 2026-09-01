import type { JsonValue } from "../domain/index.js";

export type ProviderKind = "llm" | "image" | "video" | "audio" | "vision" | "upscaler";
export type ProviderAvailability = "local" | "free-api" | "paid-api" | "experimental";

export interface ProviderIdentity {
  readonly id: string;
  readonly name: string;
  readonly kind: ProviderKind;
  readonly version: string;
  readonly availability: ProviderAvailability;
}

export interface ProviderCapability {
  readonly id: string;
  readonly description: string;
  readonly inputMediaTypes: readonly string[];
  readonly outputMediaTypes: readonly string[];
}

export interface ProviderHealth {
  readonly status: "ready" | "degraded" | "unavailable";
  readonly checkedAt: string;
  readonly message?: string;
}

export interface ProviderConfiguration {
  readonly model?: string;
  readonly endpoint?: string;
  readonly apiKeyEnvironmentVariable?: string;
  readonly options?: Readonly<Record<string, JsonValue>>;
}

export interface GenerationArtifact {
  readonly uri: string;
  readonly mediaType: string;
  readonly label?: string;
}

export interface ProviderGenerationResult {
  readonly providerId: string;
  readonly model: string;
  readonly artifacts: readonly GenerationArtifact[];
  readonly metadata: Readonly<Record<string, JsonValue>>;
  readonly mock: boolean;
}

export interface ProviderEstimate {
  readonly estimatedDurationSeconds?: number;
  readonly estimatedCost?: number;
  readonly currency?: string;
  readonly notes: readonly string[];
}

export interface GenerationRequest {
  readonly requestId: string;
  readonly projectId: string;
  readonly prompt: string;
  readonly negativePrompt?: string;
  readonly inputAssets?: readonly GenerationArtifact[];
  readonly parameters?: Readonly<Record<string, JsonValue>>;
  readonly signal?: AbortSignal;
}

export interface LLMGenerationRequest extends GenerationRequest {
  readonly systemPrompt?: string;
  readonly responseFormat?: "text" | "json";
}

export interface ImageGenerationRequest extends GenerationRequest {
  readonly mode: "text-to-image" | "image-to-image" | "edit" | "inpaint" | "outpaint";
}

export interface VideoGenerationRequest extends GenerationRequest {
  readonly mode: "text-to-video" | "image-to-video" | "first-frame" | "start-end-frame";
  readonly durationSeconds: number;
}

export interface AudioGenerationRequest extends GenerationRequest {
  readonly mode: "speech" | "music" | "sound-effect";
  readonly durationSeconds?: number;
}

export interface VisionGenerationRequest extends GenerationRequest {
  readonly mode: "describe" | "compare" | "quality-check";
}

export interface UpscaleGenerationRequest extends GenerationRequest {
  readonly scale: 2 | 4;
}

export interface Provider<Request extends GenerationRequest = GenerationRequest> {
  readonly identity: ProviderIdentity;
  readonly capabilities: readonly ProviderCapability[];
  readonly configuration: ProviderConfiguration;
  health(): Promise<ProviderHealth>;
  generate(request: Request): Promise<ProviderGenerationResult>;
  estimate(request: Request): Promise<ProviderEstimate>;
  cancel(requestId: string): Promise<void>;
}

export type LLMProvider = Provider<LLMGenerationRequest>;
export type ImageProvider = Provider<ImageGenerationRequest>;
export type VideoProvider = Provider<VideoGenerationRequest>;
export type AudioProvider = Provider<AudioGenerationRequest>;
export type VisionProvider = Provider<VisionGenerationRequest>;
export type UpscalerProvider = Provider<UpscaleGenerationRequest>;
