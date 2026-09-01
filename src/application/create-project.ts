import { mkdir, rm } from "node:fs/promises";
import path from "node:path";

import type { Project } from "../domain/index.js";
import { writeProject } from "../project/manifest.js";

export interface CreateProjectOptions {
  readonly name: string;
  readonly parentDirectory: string;
  readonly bypass?: boolean;
  readonly developmentMode?: boolean;
  readonly outputDirectory?: string;
  readonly providerSelections?: Readonly<Partial<Record<ProviderCategory, string>>>;
  readonly modelSelections?: Readonly<Partial<Record<ModelCategory, string | undefined>>>;
  readonly now?: Date;
}

export interface CreatedProject {
  readonly directory: string;
  readonly manifestPath: string;
  readonly project: Project;
}

const projectDirectories = [
  "assets",
  "references",
  "storyboards",
  "shots",
  "audio",
  "logs",
] as const;
type ProviderCategory = Project["providers"][number]["type"];
type ModelCategory = Exclude<ProviderCategory, "vision" | "upscaler">;

export async function createProject(options: CreateProjectOptions): Promise<CreatedProject> {
  const slug = slugify(options.name);
  const directory = path.resolve(options.parentDirectory, slug);
  const outputDirectory = options.outputDirectory ?? "exports";
  const outputPath = resolveProjectPath(directory, outputDirectory);
  const timestamp = (options.now ?? new Date()).toISOString();
  const project: Project = {
    schemaVersion: 1,
    id: slug,
    name: options.name.trim(),
    createdAt: timestamp,
    updatedAt: timestamp,
    settings: {
      aspectRatio: "16:9",
      frameRate: 24,
      outputDirectory,
      developmentMode: options.developmentMode ?? options.bypass ?? false,
      bypass: options.bypass ?? false,
    },
    characters: [],
    objects: [],
    environments: [],
    references: [],
    shots: [],
    storyboardFrames: [],
    assets: [],
    generations: [],
    providers: createDefaultProviderDefinitions(
      options.bypass ? {} : options.providerSelections,
      options.bypass ? {} : options.modelSelections,
    ),
    timeline: { durationSeconds: 0, frameRate: 24, clips: [], audioTracks: [] },
    exports: [],
  };

  await mkdir(directory);
  try {
    await Promise.all([
      ...projectDirectories.map((name) => mkdir(path.join(directory, name), { recursive: true })),
      mkdir(outputPath, { recursive: true }),
    ]);
    const manifestPath = path.join(directory, "project.json");
    await writeProject(manifestPath, project);
    return { directory, manifestPath, project };
  } catch (error) {
    await rm(directory, { recursive: true, force: true });
    throw error;
  }
}

export function slugify(value: string): string {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (slug.length === 0)
    throw new Error("Project name must contain at least one letter or number.");
  return slug;
}

function resolveProjectPath(projectDirectory: string, relativePath: string): string {
  const resolved = path.resolve(projectDirectory, relativePath);
  const relative = path.relative(projectDirectory, resolved);
  if (relative.length === 0 || relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error("Output directory must be a project-relative child path.");
  }
  return resolved;
}

function createDefaultProviderDefinitions(
  providerSelections: CreateProjectOptions["providerSelections"] = {},
  modelSelections: CreateProjectOptions["modelSelections"] = {},
): Project["providers"] {
  return (["llm", "image", "video", "audio", "vision", "upscaler"] as const).map((type) => {
    const id = providerSelections[type] ?? `mock-${type}`;
    const configuredModel = modelSelections[type as ModelCategory];
    return {
      id,
      type,
      ...(configuredModel !== undefined
        ? { model: configuredModel }
        : id.startsWith("mock-")
          ? { model: "deterministic-mock-v1" }
          : {}),
      enabled: true,
      options: {},
    };
  });
}
