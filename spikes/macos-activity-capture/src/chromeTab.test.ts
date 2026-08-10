// chromeTab.ts の中の parseChromeTabOutput（文字列変換ロジック）が
// 正しく動くかを確認するテストファイル。
// 「入力に対して期待通りの出力が返ってくるか」をいくつかのパターンで検証している。
import { describe, expect, it } from "vitest";
import { parseChromeTabOutput } from "./chromeTab.js";

// describe: テストのグループ名（何をテストしているか）
describe("parseChromeTabOutput", () => {
  // it: 個々のテストケース。「〜であること」を確認する
  it("parses url and title separated by the delimiter", () => {
    // 正常系: "url|||title" 形式の文字列が正しく分解されるか
    expect(parseChromeTabOutput("https://example.com|||Example Domain")).toEqual({
      url: "https://example.com",
      title: "Example Domain",
    });
  });

  it("keeps extra delimiters in the title intact", () => {
    // タイトルの中に偶然区切り文字が含まれていても、URLだけを正しく切り出せるか
    expect(parseChromeTabOutput("https://example.com|||A|||B")).toEqual({
      url: "https://example.com",
      title: "A|||B",
    });
  });

  it("trims surrounding whitespace/newlines from osascript output", () => {
    // osascriptの出力には余計な空白・改行が付くことがあるため、除去できているか
    expect(parseChromeTabOutput("  https://example.com|||Example Domain\n")).toEqual({
      url: "https://example.com",
      title: "Example Domain",
    });
  });

  it("returns null when the delimiter is missing", () => {
    // 異常系: 想定した形式でない文字列が来たら null を返すか
    expect(parseChromeTabOutput("unexpected output")).toBeNull();
  });
});
