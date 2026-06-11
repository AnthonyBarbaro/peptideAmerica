import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";

describe("content compliance script", () => {
  it("passes for storefront content", () => {
    expect(() =>
      execFileSync("node", ["scripts/check-content-compliance.mjs"], {
        encoding: "utf8",
        stdio: "pipe",
      }),
    ).not.toThrow();
  });
});
