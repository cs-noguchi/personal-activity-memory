// storage.ts の toJSONLine（JSON文字列への変換ロジック）が
// 正しく動くかを確認するテストファイル。
import { describe, expect, it } from "vitest";
import { toJSONLine } from "./storage.js";
import type { ActivitySnapshot } from "./types.js";

describe("toJSONLine", () => {
  it("serializes a snapshot as a single JSON line", () => {
    // テスト用のサンプルデータを用意する
    const snapshot: ActivitySnapshot = {
      timestamp: "2026-08-10T10:00:00.000Z",
      appName: "Code",
      windowTitle: "index.ts",
      chromeTab: null,
    };

    const line = toJSONLine(snapshot);

    // 「行の最後が改行になっているか」＝1行分のデータとして正しい形か
    expect(line.endsWith("\n")).toBe(true);
    // 「文字列をJSONとして読み直したら元のデータと一致するか」＝変換ミスが無いか
    expect(JSON.parse(line)).toEqual(snapshot);
  });

  it("includes chrome tab info when present", () => {
    // Chromeのタブ情報が入っているケースでも正しく変換できるか確認
    const snapshot: ActivitySnapshot = {
      timestamp: "2026-08-10T10:00:00.000Z",
      appName: "Google Chrome",
      windowTitle: "Example Domain",
      chromeTab: { url: "https://example.com", title: "Example Domain" },
    };

    expect(JSON.parse(toJSONLine(snapshot))).toEqual(snapshot);
  });
});
