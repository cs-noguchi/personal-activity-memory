// このファイルが「npm run capture」で実際に動くプログラムの本体（エントリーポイント）。
// やっていることはシンプルで、
//   1. 一定間隔ごとに「今何をしているか」を1回取得する
//   2. 取得できたらファイルに記録する
//   3. Ctrl+Cで止められる
// というだけのループ処理。

import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { getActiveWindowInfo } from "./activeWindow.js"; // アクティブウィンドウ取得
import { getChromeTabInfo } from "./chromeTab.js"; // ChromeタブのURL取得
import { appendActivityLog } from "./storage.js"; // ファイルへの保存
import { isSameActivity } from "./dedupe.js"; // 前回と同じ内容かどうかの判定
import type { ActivitySnapshot } from "./types.js";

// このファイル自身がある場所を基準に、保存先ファイルのパスを組み立てる
// （どのフォルダから実行しても保存先がブレないようにするため）
const __dirname = dirname(fileURLToPath(import.meta.url));
const LOG_FILE = join(__dirname, "..", "data", "activity-log.jsonl");

// 何ミリ秒おきに取得するか。環境変数 POLL_INTERVAL_MS で変更可能、指定が無ければ5秒。
const POLL_INTERVAL_MS = Number(process.env.POLL_INTERVAL_MS ?? 5000);

// 「今この瞬間、何をしているか」を1回分だけ取得してまとめる関数
async function captureOnce(): Promise<ActivitySnapshot | null> {
  // まずアクティブウィンドウ（アプリ名・タイトル）を取得
  const active = await getActiveWindowInfo();
  if (!active) {
    // 取得できなかった場合はこの回はあきらめる
    return null;
  }

  // アクティブなアプリがChromeのときだけ、追加でタブのURLも取得する
  const isChrome = active.appName === "Google Chrome";
  const chromeTab = isChrome ? await getChromeTabInfo() : null;

  // 取得した情報をひとまとめにして返す
  return {
    timestamp: new Date().toISOString(), // 今の日時
    appName: active.appName,
    windowTitle: active.windowTitle,
    chromeTab,
  };
}

// これまでに何回記録できたかのカウンター（終了時に件数を表示するために使う）
let snapshotCount = 0;

// 直前に記録した内容を覚えておくための変数（同じ内容の連続記録を防ぐため）
let lastSnapshot: ActivitySnapshot | null = null;

// タイマーが発火するたびに呼ばれる処理。1回分の取得→保存→ログ表示をする。
async function tick(): Promise<void> {
  const snapshot = await captureOnce();
  if (!snapshot) {
    // 取得失敗（権限エラーなど）の場合は警告だけ出して次回に備える
    console.warn("[capture] no active window info returned");
    return;
  }

  // 直前に記録した内容と（timestamp以外が）同じなら、記録せずスキップする
  // → 同じウィンドウを見続けている間に同じ内容の行が量産されるのを防ぐ
  if (lastSnapshot && isSameActivity(lastSnapshot, snapshot)) {
    return;
  }

  // ファイルに1行追記
  appendActivityLog(LOG_FILE, snapshot);
  lastSnapshot = snapshot;
  snapshotCount += 1;
  // ターミナルに今回取得した内容を表示（動作確認用）
  console.log(
    `[capture #${snapshotCount}] ${snapshot.timestamp} ${snapshot.appName} - ${snapshot.windowTitle}` +
      (snapshot.chromeTab ? ` (${snapshot.chromeTab.url})` : ""),
  );
}

// ここから下は「スクリプトが読み込まれた瞬間」に実行される部分
console.log(`Writing snapshots to ${LOG_FILE}`);
console.log(`Polling every ${POLL_INTERVAL_MS}ms. Press Ctrl+C to stop.`);

// setInterval（後述）に直接asyncな tick を渡すと、tick内で起きたエラーが
// 誰にも捕まらずプロセスをクラッシュさせてしまうことがある。
// それを防ぐため、必ずこの runTick を経由してエラーを catch するようにしている。
function runTick(): void {
  tick().catch((error) => console.error("[capture] unexpected error:", error));
}

// POLL_INTERVAL_MSミリ秒おきに runTick を繰り返し実行するタイマーを開始
const timer = setInterval(runTick, POLL_INTERVAL_MS);

// Ctrl+C（SIGINT）が押されたときの後片付け処理
process.on("SIGINT", () => {
  clearInterval(timer); // タイマーを止める
  console.log(`\nStopped. Captured ${snapshotCount} snapshot(s) -> ${LOG_FILE}`);
  process.exit(0);
});

// プログラム起動直後にも1回、待たずにすぐ実行しておく
// （最初のタイマー発火まで5秒待たされるのを避けるため）
runTick();
