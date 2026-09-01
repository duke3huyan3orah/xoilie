import { z } from "zod";

import { AspectRatioSchema, IdentifierSchema } from "./common.js";

export const ReferenceSchema = z.strictObject({
  id: IdentifierSchema,
  label: z.string().min(1),
  type: z.enum(["character", "object", "environment", "lighting", "style", "motion", "other"]),
  source: z.string().min(1),
  description: z.string(),
  relevance: z.string().min(1),
});

export const CharacterSchema = z.strictObject({
  id: IdentifierSchema,
  name: z.string().min(1),
  canonicalDescription: z.string().min(1),
  physicalAppearance: z.string(),
  clothing: z.array(z.string()),
  hairstyle: z.string().optional(),
  accessories: z.array(z.string()),
  age: z.string().optional(),
  proportions: z.string().optional(),
  identityAnchors: z.array(z.string()),
  negativeConstraints: z.array(z.string()),
  referenceIds: z.array(IdentifierSchema),
});

export const CreativeObjectSchema = z.strictObject({
  id: IdentifierSchema,
  name: z.string().min(1),
  kind: z.enum(["object", "vehicle", "product"]),
  canonicalDescription: z.string().min(1),
  shape: z.string(),
  materials: z.array(z.string()),
  colors: z.array(z.string()),
  branding: z.array(z.string()),
  dimensions: z.string().optional(),
  identifyingDetails: z.array(z.string()),
  negativeConstraints: z.array(z.string()),
  referenceIds: z.array(IdentifierSchema),
});

export const EnvironmentSchema = z.strictObject({
  id: IdentifierSchema,
  name: z.string().min(1),
  canonicalDescription: z.string().min(1),
  location: z.string(),
  era: z.string(),
  timeOfDay: z.string(),
  weather: z.string(),
  lighting: z.string(),
  colors: z.array(z.string()),
  materials: z.array(z.string()),
  identityAnchors: z.array(z.string()),
  negativeConstraints: z.array(z.string()),
  referenceIds: z.array(IdentifierSchema),
});

export const CreativeBriefSchema = z.strictObject({
  title: z.string().min(1),
  objective: z.string().min(1),
  audience: z.string().min(1),
  subject: z.string().min(1),
  environment: z.string(),
  era: z.string(),
  visualStyle: z.array(z.string()),
  genre: z.string(),
  mood: z.array(z.string()),
  emotionalArc: z.array(z.string()),
  colorDirection: z.array(z.string()),
  lighting: z.array(z.string()),
  cameraLanguage: z.array(z.string()),
  aspectRatio: AspectRatioSchema,
  durationSeconds: z.number().positive(),
  platform: z.string(),
  pacing: z.enum(["slow", "measured", "dynamic", "fast"]),
  referenceIds: z.array(IdentifierSchema),
  constraints: z.array(z.string()),
  requiredAssets: z.array(z.string()),
  forbiddenElements: z.array(z.string()),
});

export const StyleBibleSchema = z.strictObject({
  visual: z.strictObject({
    colorPalette: z.array(z.string()),
    contrast: z.string(),
    saturation: z.string(),
    grain: z.string(),
    texture: z.array(z.string()),
    lensCharacteristics: z.array(z.string()),
    depthOfField: z.string(),
    lighting: z.array(z.string()),
    environment: z.array(z.string()),
    materials: z.array(z.string()),
    renderingStyle: z.string(),
  }),
  cinematography: z.strictObject({
    lensLanguage: z.array(z.string()),
    cameraMovement: z.array(z.string()),
    framing: z.array(z.string()),
    shotScale: z.array(z.string()),
    focusBehavior: z.string(),
    shutterFeel: z.string(),
    motionBlur: z.string(),
    cameraHeight: z.string(),
  }),
  characterIds: z.array(IdentifierSchema),
  objectIds: z.array(IdentifierSchema),
  environmentIds: z.array(IdentifierSchema),
  globalNegativeConstraints: z.array(z.string()),
});

export type Reference = z.infer<typeof ReferenceSchema>;
export type Character = z.infer<typeof CharacterSchema>;
export type CreativeObject = z.infer<typeof CreativeObjectSchema>;
export type Environment = z.infer<typeof EnvironmentSchema>;
export type CreativeBrief = z.infer<typeof CreativeBriefSchema>;
export type StyleBible = z.infer<typeof StyleBibleSchema>;
