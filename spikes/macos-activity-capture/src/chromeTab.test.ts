import { describe, expect, it } from "vitest";
import { parseChromeTabOutput } from "./chromeTab.js";

describe("parseChromeTabOutput", () => {
  it("parses url and title separated by the delimiter", () => {
    expect(parseChromeTabOutput("https://example.com|||Example Domain")).toEqual({
      url: "https://example.com",
      title: "Example Domain",
    });
  });

  it("keeps extra delimiters in the title intact", () => {
    expect(parseChromeTabOutput("https://example.com|||A|||B")).toEqual({
      url: "https://example.com",
      title: "A|||B",
    });
  });

  it("trims surrounding whitespace/newlines from osascript output", () => {
    expect(parseChromeTabOutput("  https://example.com|||Example Domain\n")).toEqual({
      url: "https://example.com",
      title: "Example Domain",
    });
  });

  it("returns null when the delimiter is missing", () => {
    expect(parseChromeTabOutput("unexpected output")).toBeNull();
  });
});
