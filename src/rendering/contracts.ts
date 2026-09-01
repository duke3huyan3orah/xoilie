import type { Export, Project, Timeline } from "../domain/index.js";

export interface RenderRequest {
  readonly project: Project;
  readonly timeline: Timeline;
  readonly export: Export;
  readonly signal?: AbortSignal;
}

export interface RenderResult {
  readonly export: Export;
  readonly diagnostics: readonly string[];
}

export interface Renderer {
  readonly id: string;
  health(): Promise<{ readonly ready: boolean; readonly message: string }>;
  render(request: RenderRequest): Promise<RenderResult>;
}
