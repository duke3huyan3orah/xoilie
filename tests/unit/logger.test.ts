import { describe, expect, it } from "vitest";

import { redactSecrets } from "../../src/core/logger.js";

describe("redactSecrets", () => {
  it("recursively redacts secret-shaped fields", () => {
    expect(
      redactSecrets({
        provider: { apiKey: "secret-value" },
        headers: [{ authorization: "Bearer secret" }],
        safe: "visible",
      }),
    ).toEqual({
      provider: { apiKey: "[REDACTED]" },
      headers: [{ authorization: "[REDACTED]" }],
      safe: "visible",
    });
  });
});
