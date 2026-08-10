import { appendFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import type { ActivitySnapshot } from "./types.js";

// JSON化だけを切り出した純粋関数（ファイルI/Oと分離してテストする）
export function toJSONLine(snapshot: ActivitySnapshot): string {
  return `${JSON.stringify(snapshot)}\n`;
}

export function appendActivityLog(filePath: string, snapshot: ActivitySnapshot): void {
  mkdirSync(dirname(filePath), { recursive: true });
  appendFileSync(filePath, toJSONLine(snapshot), "utf-8");
}
