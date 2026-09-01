export type LogLevel = "debug" | "info" | "warn" | "error";
export type LogContext = Readonly<Record<string, unknown>>;

export interface Logger {
  debug(message: string, context?: LogContext): void;
  info(message: string, context?: LogContext): void;
  warn(message: string, context?: LogContext): void;
  error(message: string, context?: LogContext): void;
}

const secretKeyPattern = /api[-_]?key|authorization|credential|password|secret|token/i;

export function redactSecrets(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(redactSecrets);
  if (value === null || typeof value !== "object") return value;

  return Object.fromEntries(
    Object.entries(value).map(([key, nestedValue]) => [
      key,
      secretKeyPattern.test(key) ? "[REDACTED]" : redactSecrets(nestedValue),
    ]),
  );
}

export function createConsoleLogger(minimumLevel: LogLevel = "info"): Logger {
  const priorities: Record<LogLevel, number> = { debug: 10, info: 20, warn: 30, error: 40 };
  const write = (level: LogLevel, message: string, context?: LogContext): void => {
    if (priorities[level] < priorities[minimumLevel]) return;
    const suffix = context === undefined ? "" : ` ${JSON.stringify(redactSecrets(context))}`;
    const line = `[${level.toUpperCase()}] ${message}${suffix}`;
    if (level === "error") console.error(line);
    else console.log(line);
  };

  return {
    debug: (message, context) => write("debug", message, context),
    info: (message, context) => write("info", message, context),
    warn: (message, context) => write("warn", message, context),
    error: (message, context) => write("error", message, context),
  };
}
