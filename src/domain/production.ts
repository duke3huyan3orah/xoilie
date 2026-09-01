import { z } from "zod";

import { IdentifierSchema, IsoDateTimeSchema, JsonValueSchema } from "./common.js";

export const GenerationMetadataSchema = z.strictObject({
  providerId: IdentifierSchema,
  model: z.string().min(1),
  prompt: z.string(),
  negativePrompt: z.string().optional(),
  seed: z.number().int().optional(),
  parameters: z.record(z.string(), JsonValueSchema),
  createdAt: IsoDateTimeSchema,
  sourceReferenceIds: z.array(IdentifierSchema),
  parentAssetId: IdentifierSchema.optional(),
  version: z.number().int().positive(),
  mock: z.boolean().default(false),
});

export const AssetSchema = z.strictObject({
  id: IdentifierSchema,
  kind: z.enum(["image", "video", "audio", "text", "project", "other"]),
  status: z.enum(["planned", "generating", "ready", "failed", "archived"]),
  path: z.string().min(1),
  mediaType: z.string().min(1),
  checksum: z.string().optional(),
  byteSize: z.number().int().nonnegative().optional(),
  metadata: GenerationMetadataSchema.optional(),
});

export const GenerationSchema = z.strictObject({
  id: IdentifierSchema,
  status: z.enum(["queued", "running", "succeeded", "failed", "cancelled"]),
  providerId: IdentifierSchema,
  capability: z.string().min(1),
  inputAssetIds: z.array(IdentifierSchema),
  outputAssetIds: z.array(IdentifierSchema),
  errorCode: z.string().optional(),
  errorMessage: z.string().optional(),
  startedAt: IsoDateTimeSchema.optional(),
  completedAt: IsoDateTimeSchema.optional(),
});

export const ShotSchema = z.strictObject({
  id: IdentifierSchema,
  order: z.number().int().nonnegative(),
  durationSeconds: z.number().positive(),
  purpose: z.string().min(1),
  narrativeFunction: z.string(),
  visualPurpose: z.string(),
  emotionalPurpose: z.string(),
  subjectIds: z.array(IdentifierSchema),
  environmentId: IdentifierSchema.optional(),
  composition: z.string(),
  framing: z.string(),
  cameraPosition: z.string(),
  cameraMovement: z.string(),
  lens: z.string(),
  depthOfField: z.string(),
  focus: z.string(),
  lighting: z.string(),
  color: z.string(),
  atmosphere: z.string(),
  action: z.string(),
  emotion: z.string(),
  transition: z.string(),
  audio: z.string(),
  generationPrompt: z.string(),
  negativePrompt: z.string(),
  requiredReferenceIds: z.array(IdentifierSchema),
});

export const StoryboardFrameSchema = z.strictObject({
  id: IdentifierSchema,
  shotId: IdentifierSchema,
  frameNumber: z.number().int().positive(),
  description: z.string().min(1),
  composition: z.string(),
  camera: z.string(),
  subject: z.string(),
  action: z.string(),
  transition: z.string(),
  assetId: IdentifierSchema.optional(),
});

export const AudioTrackSchema = z.strictObject({
  id: IdentifierSchema,
  kind: z.enum(["dialogue", "narration", "music", "ambience", "sfx"]),
  name: z.string().min(1),
  assetId: IdentifierSchema.optional(),
  startSeconds: z.number().nonnegative(),
  durationSeconds: z.number().positive(),
  volume: z.number().min(0),
  muted: z.boolean().default(false),
});

export const TimelineClipSchema = z.strictObject({
  id: IdentifierSchema,
  track: z.enum(["video", "audio", "overlay", "caption"]),
  sourceId: IdentifierSchema,
  startSeconds: z.number().nonnegative(),
  durationSeconds: z.number().positive(),
  sourceOffsetSeconds: z.number().nonnegative().default(0),
});

export const TimelineSchema = z.strictObject({
  durationSeconds: z.number().nonnegative(),
  frameRate: z.number().positive(),
  clips: z.array(TimelineClipSchema),
  audioTracks: z.array(AudioTrackSchema),
});

export const ExportSchema = z.strictObject({
  id: IdentifierSchema,
  format: z.enum(["mp4", "webm", "png", "jpeg", "wav", "mp3", "srt", "vtt", "archive"]),
  status: z.enum(["planned", "rendering", "ready", "failed"]),
  path: z.string().min(1),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  frameRate: z.number().positive().optional(),
  createdAt: IsoDateTimeSchema.optional(),
});

export type GenerationMetadata = z.infer<typeof GenerationMetadataSchema>;
export type Asset = z.infer<typeof AssetSchema>;
export type Generation = z.infer<typeof GenerationSchema>;
export type Shot = z.infer<typeof ShotSchema>;
export type StoryboardFrame = z.infer<typeof StoryboardFrameSchema>;
export type AudioTrack = z.infer<typeof AudioTrackSchema>;
export type Timeline = z.infer<typeof TimelineSchema>;
export type Export = z.infer<typeof ExportSchema>;
