import path from "node:path";

import { Command, CommanderError } from "commander";

import { createProject } from "../application/index.js";
import { loadConfig, type AppConfig } from "../config/config.js";
import { createMockProviders } from "../providers/index.js";

export interface CliIo {
  readonly out: (message: string) => void;
  readonly error: (message: string) => void;
}

export interface CliContext {
  readonly cwd: string;
  readonly io: CliIo;
  readonly config?: AppConfig;
}

const defaultIo: CliIo = {
  out: (message) => console.log(message),
  error: (message) => console.error(message),
};

export function createCli(context: CliContext = { cwd: process.cwd(), io: defaultIo }): Command {
  const config = context.config ?? loadConfig();
  const program = new Command()
    .name("creative")
    .description("XOILIE creative production CLI")
    .version("0.0.0")
    .option("--bypass", "use deterministic mock providers for development and testing", false)
    .configureOutput({
      writeOut: (value) => context.io.out(value.trimEnd()),
      writeErr: (value) => context.io.error(value.trimEnd()),
    })
    .exitOverride();

  program
    .command("init")
    .description("create a versioned XOILIE project manifest")
    .argument("<name>", "project name")
    .action(async (name: string) => {
      const bypass = program.opts<{ bypass: boolean }>().bypass || config.bypass;
      const created = await createProject({
        name,
        parentDirectory: context.cwd,
        bypass,
        developmentMode: config.developmentMode,
        outputDirectory: config.outputDirectory,
        providerSelections: config.providers,
        modelSelections: config.models,
      });
      context.io.out(`Created XOILIE project at ${path.relative(context.cwd, created.directory)}`);
      if (created.project.settings.bypass) context.io.out("DEVELOPMENT / MOCK MODE enabled");
    });

  program
    .command("providers")
    .description("list providers available in this foundation")
    .action(() => {
      context.io.out("Provider | Type | Status | Capabilities");
      for (const provider of createMockProviders()) {
        context.io.out(
          `${provider.identity.name} | ${provider.identity.kind} | Ready (mock) | ${provider.capabilities.map((capability) => capability.id).join(", ")}`,
        );
      }
    });

  addUnimplementedCommand(program, context, "plan", "create a structured creative plan", "[idea]");
  addUnimplementedCommand(program, context, "storyboard", "create storyboard data");
  addUnimplementedCommand(program, context, "generate", "generate planned assets");
  addUnimplementedCommand(program, context, "render", "render the project timeline");
  addUnimplementedCommand(program, context, "edit", "apply a structured project edit");
  addUnimplementedCommand(program, context, "assets", "inspect project assets");
  addUnimplementedCommand(program, context, "models", "list provider models");
  addUnimplementedCommand(program, context, "inspect", "inspect project state");
  addUnimplementedCommand(program, context, "export", "export project deliverables");
  addUnimplementedCommand(program, context, "doctor", "inspect the local development environment");

  program.action(() => {
    program.outputHelp();
    context.io.out("Interactive mode: Not implemented yet.");
    throw new CommanderError(2, "xoilie.notImplemented", "Interactive mode is not implemented");
  });

  return program;
}

export async function runCli(
  arguments_: readonly string[],
  context: CliContext = { cwd: process.cwd(), io: defaultIo },
): Promise<number> {
  try {
    await createCli(context).parseAsync([...arguments_], { from: "user" });
    return 0;
  } catch (error) {
    if (error instanceof CommanderError) return error.exitCode;
    context.io.error(error instanceof Error ? error.message : "Unknown CLI error");
    return 1;
  }
}

function addUnimplementedCommand(
  program: Command,
  context: CliContext,
  name: string,
  description: string,
  argument?: string,
): void {
  const command = program.command(name).description(description);
  if (argument !== undefined) command.argument(argument);
  command.action(() => {
    const config = context.config ?? loadConfig();
    if (program.opts<{ bypass: boolean }>().bypass || config.bypass) {
      context.io.out(
        "Bypass mode detected; deterministic mock providers will be used when this command is implemented.",
      );
    }
    context.io.out("Not implemented yet.");
    throw new CommanderError(2, "xoilie.notImplemented", `${name} is not implemented`);
  });
}
