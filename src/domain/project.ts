import { z } from "zod";

import { AspectRatioSchema, IdentifierSchema, IsoDateTimeSchema } from "./common.js";
import {
  CharacterSchema,
  CreativeBriefSchema,
  CreativeObjectSchema,
  EnvironmentSchema,
  ReferenceSchema,
  StyleBibleSchema,
} from "./creative.js";
import {
  AssetSchema,
  ExportSchema,
  GenerationSchema,
  ShotSchema,
  StoryboardFrameSchema,
  TimelineSchema,
} from "./production.js";

export const ProviderDefinitionSchema = z.strictObject({
  id: IdentifierSchema,
  type: z.enum(["llm", "image", "video", "audio", "vision", "upscaler"]),
  model: z.string().optional(),
  enabled: z.boolean().default(true),
  apiKeyEnvironmentVariable: z
    .string()
    .regex(/^[A-Z][A-Z0-9_]*$/, "Expected an environment variable name")
    .optional(),
  options: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])),
});

export const ProjectSettingsSchema = z.strictObject({
  aspectRatio: AspectRatioSchema,
  frameRate: z.number().positive(),
  outputDirectory: z.string().min(1),
  developmentMode: z.boolean(),
  bypass: z.boolean(),
});

export const ProjectSchema = z.strictObject({
  schemaVersion: z.literal(1),
  id: IdentifierSchema,
  name: z.string().min(1),
  createdAt: IsoDateTimeSchema,
  updatedAt: IsoDateTimeSchema,
  settings: ProjectSettingsSchema,
  brief: CreativeBriefSchema.optional(),
  styleBible: StyleBibleSchema.optional(),
  characters: z.array(CharacterSchema),
  objects: z.array(CreativeObjectSchema),
  environments: z.array(EnvironmentSchema),
  references: z.array(ReferenceSchema),
  shots: z.array(ShotSchema),
  storyboardFrames: z.array(StoryboardFrameSchema),
  assets: z.array(AssetSchema),
  generations: z.array(GenerationSchema),
  providers: z.array(ProviderDefinitionSchema),
  timeline: TimelineSchema,
  exports: z.array(ExportSchema),
});

export type ProviderDefinition = z.infer<typeof ProviderDefinitionSchema>;
export type ProjectSettings = z.infer<typeof ProjectSettingsSchema>;
export type Project = z.infer<typeof ProjectSchema>;
