// dedupe.ts の isSameActivity（内容が同じかどうかの比較ロジック）のテスト
import { describe, expect, it } from "vitest";
import { isSameActivity } from "./dedupe.js";

describe("isSameActivity", () => {
  it("returns true when appName/windowTitle/chromeTab are all identical", () => {
    const a = { appName: "Code", windowTitle: "index.ts", chromeTab: null };
    const b = { appName: "Code", windowTitle: "index.ts", chromeTab: null };
    expect(isSameActivity(a, b)).toBe(true);
  });

  it("returns false when the window title changed", () => {
    const a = { appName: "Code", windowTitle: "index.ts", chromeTab: null };
    const b = { appName: "Code", windowTitle: "storage.ts", chromeTab: null };
    expect(isSameActivity(a, b)).toBe(false);
  });

  it("returns true when chrome tab url/title are identical", () => {
    const a = {
      appName: "Google Chrome",
      windowTitle: "Example",
      chromeTab: { url: "https://example.com", title: "Example" },
    };
    const b = {
      appName: "Google Chrome",
      windowTitle: "Example",
      chromeTab: { url: "https://example.com", title: "Example" },
    };
    expect(isSameActivity(a, b)).toBe(true);
  });

  it("returns false when the chrome tab url changed", () => {
    const a = {
      appName: "Google Chrome",
      windowTitle: "Example",
      chromeTab: { url: "https://example.com", title: "Example" },
    };
    const b = {
      appName: "Google Chrome",
      windowTitle: "Other",
      chromeTab: { url: "https://example.org", title: "Other" },
    };
    expect(isSameActivity(a, b)).toBe(false);
  });

  it("returns false when one has a chrome tab and the other doesn't", () => {
    const a = {
      appName: "Google Chrome",
      windowTitle: "Example",
      chromeTab: { url: "https://example.com", title: "Example" },
    };
    const b = { appName: "Google Chrome", windowTitle: "Example", chromeTab: null };
    expect(isSameActivity(a, b)).toBe(false);
  });
});
