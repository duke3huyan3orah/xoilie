import { mkdtemp, readFile, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { runCli, type CliIo } from "../../src/cli/program.js";
import { loadConfig } from "../../src/config/config.js";
import { ProjectSchema } from "../../src/domain/index.js";

const temporaryDirectories: string[] = [];

afterEach(async () => {
  await Promise.all(
    temporaryDirectories
      .splice(0)
      .map((directory) => rm(directory, { recursive: true, force: true })),
  );
});

describe("creative CLI", () => {
  it("initializes a valid bypass project without generated assets", async () => {
    const cwd = await createTemporaryDirectory();
    const output: string[] = [];
    const exitCode = await runCli(["init", "Test Film", "--bypass"], {
      cwd,
      io: collectIo(output),
      config: loadConfig({}),
    });
    const projectDirectory = path.join(cwd, "test-film");
    const project = ProjectSchema.parse(
      JSON.parse(await readFile(path.join(projectDirectory, "project.json"), "utf8")) as unknown,
    );

    expect(exitCode).toBe(0);
    expect(project.settings.bypass).toBe(true);
    expect(project.providers).toHaveLength(6);
    expect(project.providers.find((provider) => provider.type === "image")?.id).toBe("mock-image");
    await expect(stat(path.join(projectDirectory, "assets"))).resolves.toMatchObject({});
    expect(output).toContain("DEVELOPMENT / MOCK MODE enabled");
  });

  it("does not overwrite an existing project directory", async () => {
    const cwd = await createTemporaryDirectory();
    const output: string[] = [];
    const context = { cwd, io: collectIo(output), config: loadConfig({}) };

    expect(await runCli(["init", "Existing"], context)).toBe(0);
    expect(await runCli(["init", "Existing"], context)).toBe(1);
    expect(output.some((line) => line.includes("already exists"))).toBe(true);
  });

  it("reports future commands honestly while detecting bypass mode", async () => {
    const cwd = await createTemporaryDirectory();
    const output: string[] = [];
    const exitCode = await runCli(["generate", "--bypass"], {
      cwd,
      io: collectIo(output),
      config: loadConfig({}),
    });

    expect(exitCode).toBe(2);
    expect(output).toContain("Not implemented yet.");
    expect(output.some((line) => line.startsWith("Bypass mode detected"))).toBe(true);
  });

  it("lists all mock provider categories", async () => {
    const cwd = await createTemporaryDirectory();
    const output: string[] = [];

    expect(
      await runCli(["providers"], { cwd, io: collectIo(output), config: loadConfig({}) }),
    ).toBe(0);
    expect(output.join("\n")).toContain("Mock LLM Provider | llm | Ready (mock)");
    expect(output.join("\n")).toContain("Mock Upscaler Provider | upscaler | Ready (mock)");
  });

  it("applies validated environment configuration during initialization", async () => {
    const cwd = await createTemporaryDirectory();
    const output: string[] = [];
    const config = loadConfig({
      XOILIE_DEVELOPMENT_MODE: "true",
      XOILIE_OUTPUT_DIR: "custom-output",
      XOILIE_IMAGE_PROVIDER: "configured-image",
      XOILIE_IMAGE_MODEL: "configured-model",
    });

    expect(await runCli(["init", "Configured"], { cwd, io: collectIo(output), config })).toBe(0);
    const project = ProjectSchema.parse(
      JSON.parse(await readFile(path.join(cwd, "configured", "project.json"), "utf8")) as unknown,
    );

    expect(project.settings).toMatchObject({
      bypass: false,
      developmentMode: true,
      outputDirectory: "custom-output",
    });
    await expect(stat(path.join(cwd, "configured", "custom-output"))).resolves.toMatchObject({});
    expect(project.providers.find((provider) => provider.type === "image")).toMatchObject({
      id: "configured-image",
      model: "configured-model",
    });
  });

  it("rejects output directories outside the project", async () => {
    const cwd = await createTemporaryDirectory();
    const output: string[] = [];
    const config = loadConfig({ XOILIE_OUTPUT_DIR: "../outside" });

    expect(await runCli(["init", "Unsafe Output"], { cwd, io: collectIo(output), config })).toBe(1);
    expect(output).toContain("Output directory must be a project-relative child path.");
  });
});

async function createTemporaryDirectory(): Promise<string> {
  const directory = await mkdtemp(path.join(tmpdir(), "xoilie-test-"));
  temporaryDirectories.push(directory);
  return directory;
}

function collectIo(output: string[]): CliIo {
  return {
    out: (message) => output.push(message),
    error: (message) => output.push(message),
  };
}
