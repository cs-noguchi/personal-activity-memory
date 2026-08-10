import { describe, expect, it } from "vitest";
import { toJSONLine } from "./storage.js";
import type { ActivitySnapshot } from "./types.js";

describe("toJSONLine", () => {
  it("serializes a snapshot as a single JSON line", () => {
    const snapshot: ActivitySnapshot = {
      timestamp: "2026-08-10T10:00:00.000Z",
      appName: "Code",
      windowTitle: "index.ts",
      chromeTab: null,
    };

    const line = toJSONLine(snapshot);

    expect(line.endsWith("\n")).toBe(true);
    expect(JSON.parse(line)).toEqual(snapshot);
  });

  it("includes chrome tab info when present", () => {
    const snapshot: ActivitySnapshot = {
      timestamp: "2026-08-10T10:00:00.000Z",
      appName: "Google Chrome",
      windowTitle: "Example Domain",
      chromeTab: { url: "https://example.com", title: "Example Domain" },
    };

    expect(JSON.parse(toJSONLine(snapshot))).toEqual(snapshot);
  });
});
