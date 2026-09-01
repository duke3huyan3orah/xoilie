import { readFile, writeFile } from "node:fs/promises";

import { ProjectSchema, type Project } from "../domain/index.js";

export function parseProject(input: unknown): Project {
  return ProjectSchema.parse(input);
}

export function serializeProject(project: Project): string {
  return `${JSON.stringify(ProjectSchema.parse(project), null, 2)}\n`;
}

export async function readProject(path: string): Promise<Project> {
  return parseProject(JSON.parse(await readFile(path, "utf8")) as unknown);
}

export async function writeProject(path: string, project: Project): Promise<void> {
  await writeFile(path, serializeProject(project), { encoding: "utf8", flag: "wx" });
}
