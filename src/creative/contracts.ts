import type { CreativeBrief, Project, Shot, StyleBible } from "../domain/index.js";

export type CreativeStage =
  | "brief"
  | "style"
  | "story"
  | "shots"
  | "storyboard"
  | "assets"
  | "prompts"
  | "generation"
  | "continuity"
  | "timeline"
  | "audio"
  | "quality-control"
  | "export";

export interface CreativePlan {
  readonly brief: CreativeBrief;
  readonly styleBible: StyleBible;
  readonly shots: readonly Shot[];
}

export interface CreativeWorkflow {
  plan(project: Project, idea: string, signal?: AbortSignal): Promise<CreativePlan>;
}
