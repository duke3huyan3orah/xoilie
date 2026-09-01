import { z } from "zod";

export const IdentifierSchema = z.string().trim().min(1).max(128);
export const IsoDateTimeSchema = z.iso.datetime({ offset: true });
export const AspectRatioSchema = z
  .string()
  .regex(/^\d{1,2}:\d{1,2}$/)
  .refine(
    (value) => value.split(":").every((part) => Number(part) > 0),
    "Dimensions must be positive",
  );
export const JsonValueSchema: z.ZodType<JsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.null(),
    z.array(JsonValueSchema),
    z.record(z.string(), JsonValueSchema),
  ]),
);

export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };
