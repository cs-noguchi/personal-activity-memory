// Chromeで「今開いているタブのURL・タイトル」を取得するファイル。
// Node.jsから直接Chromeの中身は見えないので、macOSの「AppleScript」という
// 自動化の仕組みを使ってChromeに問い合わせる。

// 外部コマンド（今回はmacOSの`osascript`コマンド）を実行するための機能
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import type { ChromeTabInfo } from "./types.js";

// execFileはコールバック形式なので、async/awaitで使えるように変換しておく
const execFileAsync = promisify(execFile);

// URLとタイトルをつなげて1本の文字列として受け取るときの区切り文字。
// URLやタイトルの中に紛れ込みにくい記号を選んでいる。
const DELIMITER = "|||";

// macOSに実行させるAppleScript本体。
// 「Google Chromeの、一番手前のウィンドウの、アクティブなタブの、URLとタイトルを取得して」
// という命令を書いている。
const SCRIPT = `
tell application "Google Chrome"
  set theURL to URL of active tab of front window
  set theTitle to title of active tab of front window
end tell
return theURL & "${DELIMITER}" & theTitle
`;

// osascriptの出力（"url|||title"形式の文字列）を、扱いやすいオブジェクトに変換する関数。
// OSやChromeを実際に呼び出す処理を含まない「文字列変換だけ」の関数なので、
// テストコード（chromeTab.test.ts）で安全に動作確認できる。
export function parseChromeTabOutput(raw: string): ChromeTabInfo | null {
  const trimmed = raw.trim(); // 前後の余計な空白・改行を除去
  if (!trimmed.includes(DELIMITER)) {
    // 想定した区切り文字が無い＝正常な出力ではないので null を返す
    return null;
  }
  // "url|||title" を区切り文字で分割し、最初の要素をurl、残りをtitleとして結合する
  // （タイトルの中に偶然DELIMITERと同じ文字列が含まれていても壊れないようにするため）
  const [url, ...titleParts] = trimmed.split(DELIMITER);
  return {
    url: url.trim(),
    title: titleParts.join(DELIMITER).trim(),
  };
}

// 実際にmacOSへAppleScriptを実行させ、Chromeのタブ情報を取得する関数。
export async function getChromeTabInfo(): Promise<ChromeTabInfo | null> {
  try {
    // "osascript -e <SCRIPT>" というコマンドを実行するのと同じこと
    const { stdout } = await execFileAsync("osascript", ["-e", SCRIPT]);
    return parseChromeTabOutput(stdout);
  } catch (error) {
    // Chromeが起動していない、ウィンドウが無い、権限が無い等で失敗しうる。
    // 検証対象そのものなので握りつぶさずログに残す。
    // → エラーで全体を止めず、ログだけ出して null を返す（呼び出し元はループを継続できる）
    console.error(
      "[chromeTab] failed to read tab info:",
      error instanceof Error ? error.message : error,
    );
    return null;
  }
}
