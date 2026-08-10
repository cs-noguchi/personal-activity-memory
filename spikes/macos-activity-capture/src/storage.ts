// 取得した行動スナップショットを、ローカルのファイルに保存するためのファイル。
// 保存形式は「JSONL」＝1行に1件ずつJSONオブジェクトを書き込む形式。
// （1行ずつ追記していけるので、ログのように後からどんどん足していく用途に向いている）
import { appendFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import type { ActivitySnapshot } from "./types.js";

// スナップショット1件を「JSON文字列＋改行」に変換するだけの関数。
// ファイルへの書き込み（副作用）を含まない純粋関数なので、テストで安全に検証できる。
// JSON化だけを切り出した純粋関数（ファイルI/Oと分離してテストする）
export function toJSONLine(snapshot: ActivitySnapshot): string {
  return `${JSON.stringify(snapshot)}\n`;
}

// スナップショット1件を、指定したファイルの末尾に追記する関数。
export function appendActivityLog(filePath: string, snapshot: ActivitySnapshot): void {
  // 保存先フォルダ（例: data/）がまだ無ければ作成する
  mkdirSync(dirname(filePath), { recursive: true });
  // ファイルの末尾に1行追加する（既存の内容は消えない）
  appendFileSync(filePath, toJSONLine(snapshot), "utf-8");
}
