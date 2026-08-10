// 「前回記録した内容」と「今回取得した内容」を比較するためのファイル。
// 同じ内容ならスキップすることで、同じウィンドウを見続けている間に
// 同じ行が大量に記録されてしまうのを防ぐ。
import type { ActivitySnapshot } from "./types.js";

// 比較に使う項目だけを抜き出した型（timestampは比較対象から除く）
type ComparableActivity = Pick<ActivitySnapshot, "appName" | "windowTitle" | "chromeTab">;

// 2つのスナップショットが「内容として同じ」かどうかを判定する純粋関数。
// timestampは常に変わるので比較に含めない。
export function isSameActivity(a: ComparableActivity, b: ComparableActivity): boolean {
  return (
    a.appName === b.appName &&
    a.windowTitle === b.windowTitle &&
    a.chromeTab?.url === b.chromeTab?.url &&
    a.chromeTab?.title === b.chromeTab?.title
  );
}
