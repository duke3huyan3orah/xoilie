import { z } from "zod";

const BooleanEnvironmentSchema = z
  .enum(["true", "false", "1", "0"])
  .transform((value) => value === "true" || value === "1");

export const AppConfigSchema = z.object({
  environment: z.enum(["development", "test", "production"]),
  logLevel: z.enum(["debug", "info", "warn", "error"]),
  outputDirectory: z.string().min(1),
  developmentMode: z.boolean(),
  bypass: z.boolean(),
  providers: z.object({
    llm: z.string().min(1),
    image: z.string().min(1),
    video: z.string().min(1),
    audio: z.string().min(1),
    vision: z.string().min(1),
    upscaler: z.string().min(1),
  }),
  models: z.object({
    llm: z.string().optional(),
    image: z.string().optional(),
    video: z.string().optional(),
    audio: z.string().optional(),
  }),
});

const EnvironmentSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  XOILIE_LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
  XOILIE_OUTPUT_DIR: z.string().min(1).default("exports"),
  XOILIE_DEVELOPMENT_MODE: BooleanEnvironmentSchema.default(false),
  XOILIE_BYPASS: BooleanEnvironmentSchema.default(false),
  XOILIE_LLM_PROVIDER: z.string().min(1).default("mock-llm"),
  XOILIE_IMAGE_PROVIDER: z.string().min(1).default("mock-image"),
  XOILIE_VIDEO_PROVIDER: z.string().min(1).default("mock-video"),
  XOILIE_AUDIO_PROVIDER: z.string().min(1).default("mock-audio"),
  XOILIE_VISION_PROVIDER: z.string().min(1).default("mock-vision"),
  XOILIE_UPSCALER_PROVIDER: z.string().min(1).default("mock-upscaler"),
  XOILIE_LLM_MODEL: z.string().min(1).optional(),
  XOILIE_IMAGE_MODEL: z.string().min(1).optional(),
  XOILIE_VIDEO_MODEL: z.string().min(1).optional(),
  XOILIE_AUDIO_MODEL: z.string().min(1).optional(),
});

export type AppConfig = z.infer<typeof AppConfigSchema>;

export function loadConfig(environment: NodeJS.ProcessEnv = process.env): AppConfig {
  const parsed = EnvironmentSchema.parse(environment);
  const optionalModels = {
    ...(parsed.XOILIE_LLM_MODEL === undefined ? {} : { llm: parsed.XOILIE_LLM_MODEL }),
    ...(parsed.XOILIE_IMAGE_MODEL === undefined ? {} : { image: parsed.XOILIE_IMAGE_MODEL }),
    ...(parsed.XOILIE_VIDEO_MODEL === undefined ? {} : { video: parsed.XOILIE_VIDEO_MODEL }),
    ...(parsed.XOILIE_AUDIO_MODEL === undefined ? {} : { audio: parsed.XOILIE_AUDIO_MODEL }),
  };

  return AppConfigSchema.parse({
    environment: parsed.NODE_ENV,
    logLevel: parsed.XOILIE_LOG_LEVEL,
    outputDirectory: parsed.XOILIE_OUTPUT_DIR,
    developmentMode: parsed.XOILIE_DEVELOPMENT_MODE,
    bypass: parsed.XOILIE_BYPASS,
    providers: {
      llm: parsed.XOILIE_LLM_PROVIDER,
      image: parsed.XOILIE_IMAGE_PROVIDER,
      video: parsed.XOILIE_VIDEO_PROVIDER,
      audio: parsed.XOILIE_AUDIO_PROVIDER,
      vision: parsed.XOILIE_VISION_PROVIDER,
      upscaler: parsed.XOILIE_UPSCALER_PROVIDER,
    },
    models: optionalModels,
  });
}
